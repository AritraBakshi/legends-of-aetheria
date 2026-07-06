import Phaser from 'phaser';
import { gameState } from '../GameState';
import type { ActiveCreature, Move } from '../data/types';
import type { CreatureData } from '../data/types';
import { getMoveById } from '../data/moves';
import { getCreatureById } from '../data/creatures';
import { getItemById } from '../data/items';
import { TYPE_COLORS } from '../data/typeChart';
import {
  calcDamage, isFainted, calcExpGain, applyExpGain,
  checkEvolution, applyStatusDamage, tryCapture, createActiveCreature,
  learnNewMoves,
  type BattleCreature,
} from '../systems/BattleSystem';

type BattlePhase = 'playerTurn' | 'enemyTurn' | 'message' | 'capture' | 'victory' | 'fled' | 'evolve';

interface TrainerCreatureSlot {
  creature: ActiveCreature;
  data: CreatureData;
}

interface BattleConfig {
  wildCreature: ActiveCreature;
  wildCreatureData: CreatureData;
  isTrainer?: boolean;
  trainerName?: string;
  trainerNpcId?: string;
  trainerExtraCreatures?: TrainerCreatureSlot[];
  onBattleEnd: (result: string) => void;
}

export class BattleScene extends Phaser.Scene {
  private config!: BattleConfig;
  private playerBC!: BattleCreature;
  private enemyBC!: BattleCreature;
  private phase: BattlePhase = 'playerTurn';

  // UI elements
  private msgBox!: Phaser.GameObjects.Text;

  private enemySprite!: Phaser.GameObjects.Image;
  private playerSprite!: Phaser.GameObjects.Image;
  private enemyNamePlate!: Phaser.GameObjects.Container;
  private playerNamePlate!: Phaser.GameObjects.Container;
  private enemyHpBar!: Phaser.GameObjects.Graphics;
  private playerHpBar!: Phaser.GameObjects.Graphics;
  private enemyHpText!: Phaser.GameObjects.Text;
  private playerHpText!: Phaser.GameObjects.Text;
  private enemyLvlText!: Phaser.GameObjects.Text;
  private playerLvlText!: Phaser.GameObjects.Text;
  private playerNameText!: Phaser.GameObjects.Text;
  private playerTypeBg!: Phaser.GameObjects.Graphics;
  private playerTypeText!: Phaser.GameObjects.Text;
  private enemyTypeBg!: Phaser.GameObjects.Graphics;
  private enemyTypeText!: Phaser.GameObjects.Text;

  private actionMenu!: Phaser.GameObjects.Container;
  private moveMenu!: Phaser.GameObjects.Container;
  private bagMenu!: Phaser.GameObjects.Container;
  private partyMenu!: Phaser.GameObjects.Container;

  private menuButtons: Phaser.GameObjects.Text[] = [];
  private moveButtons: Phaser.GameObjects.Text[] = [];
  private selectedAction = 0;
  private selectedMove = 0;
  private enemyNameText!: Phaser.GameObjects.Text;

  // Trainer multi-creature queue (creatures 2..N waiting to battle)
  private trainerEnemyQueue: TrainerCreatureSlot[] = [];

  private canInput = false;

  constructor() { super('Battle'); }

  init(data: BattleConfig) {
    this.config = data;
    this.canInput = false;
    this.menuButtons = [];
    this.moveButtons = [];
    this.trainerEnemyQueue = [...(data.trainerExtraCreatures ?? [])];
  }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Battle background
    this.add.image(W / 2, H / 2, 'battle_bg').setDisplaySize(W, H);

    // Enemy creature
    this.enemyBC = {
      creature: this.config.wildCreature,
      stages: { atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0, acc: 0, eva: 0 },
      confusionTurns: 0,
    };

    // Player creature (first in party with HP)
    const playerCreature = gameState.party.find(c => c.currentHp > 0);
    if (!playerCreature) { this.endBattle('blackout'); return; }
    this.playerBC = {
      creature: playerCreature,
      stages: { atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0, acc: 0, eva: 0 },
      confusionTurns: 0,
    };

    // Sprites — with entrance animations
    const enemyData = this.config.wildCreatureData;
    const enemyStartX = W * 0.68;
    const enemyY = H * 0.3;
    const playerStartX = W * 0.28;
    const playerY = H * 0.52;

    // Drop shadows
    const enemyShadow = this.add.graphics();
    enemyShadow.fillStyle(0x000000, 0.25).fillEllipse(enemyStartX, enemyY + 44, 80, 16);
    const playerShadow = this.add.graphics();
    playerShadow.fillStyle(0x000000, 0.25).fillEllipse(playerStartX, playerY + 50, 90, 16);

    // Enemy sprite — slides in from right, displayed larger to fill the frame
    this.enemySprite = this.add.image(W + 80, enemyY, `creature_${enemyData.id}`)
      .setDisplaySize(this.battleSize(enemyData.id).enemy, this.battleSize(enemyData.id).enemy).setAlpha(0);
    this.tweens.add({
      targets: this.enemySprite, x: enemyStartX, alpha: 1,
      duration: 420, ease: 'Back.easeOut',
      onComplete: () => {
        // Idle float — only animate Y, never touch scale (setDisplaySize already set it)
        this.tweens.add({
          targets: [this.enemySprite, enemyShadow],
          y: `${enemyY - 8}`,
          duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
      },
    });

    // Player sprite — slides in from left, back sprite shown larger
    this.playerSprite = this.add.image(-80, playerY, `creature_${playerCreature.dataId}_back`)
      .setDisplaySize(this.battleSize(playerCreature.dataId).player, this.battleSize(playerCreature.dataId).player).setFlipX(true).setAlpha(0);
    this.tweens.add({
      targets: this.playerSprite, x: playerStartX, alpha: 1,
      duration: 420, ease: 'Back.easeOut', delay: 180,
      onComplete: () => {
        this.tweens.add({
          targets: this.playerSprite,
          y: `${playerY - 5}`,
          duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
      },
    });

    // Name plates & HP bars
    this.createEnemyHUD();
    this.createPlayerHUD();

    // Message box
    const msgBg = this.add.graphics();
    msgBg.fillStyle(0x1a1a2e, 0.95).fillRoundedRect(8, H - 108, W - 16, 96, 8);
    msgBg.lineStyle(3, 0xffd700, 0.8).strokeRoundedRect(8, H - 108, W - 16, 96, 8);
    this.msgBox = this.add.text(24, H - 96, '', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff',
      wordWrap: { width: W - 48 }, lineSpacing: 6,
    }).setDepth(10);

    // Menus
    this.createActionMenu();
    this.createMoveMenuContainer();
    this.createBagMenu();
    this.createPartyMenuContainer();

    // Intro message
    const creatureName = this.config.wildCreatureData.name;
    const lvl = this.config.wildCreature.level;
    const introMsg = this.config.isTrainer
      ? `${this.config.trainerName} wants to battle!`
      : `A wild ${creatureName} (Lv.${lvl}) appeared!`;

    this.showMessage(introMsg, () => {
      this.showMessage(`Go, ${this.getPlayerCreatureName()}!`, () => {
        this.showActionMenu();
      });
    });
  }

  // ── HUD ──────────────────────────────────────────────────────────────────────
  private createEnemyHUD() {
    // Enemy HUD sits top-LEFT — enemy sprite is at ~68% width, so left side is clear
    const container = this.add.container(16, 16);
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.9).fillRoundedRect(0, 0, 220, 64, 6);
    bg.lineStyle(2, 0xffffff, 0.4).strokeRoundedRect(0, 0, 220, 64, 6);

    const enemyData = this.config.wildCreatureData;
    this.enemyNameText = this.add.text(10, 8, enemyData.name, { fontSize: '16px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold' });
    this.enemyLvlText = this.add.text(160, 8, `Lv.${this.enemyBC.creature.level}`, { fontSize: '14px', fontFamily: 'monospace', color: '#ffd700' });

    const typeColor = TYPE_COLORS[enemyData.type[0]] ?? 0x808080;
    this.enemyTypeBg = this.add.graphics();
    this.enemyTypeBg.fillStyle(typeColor, 0.8).fillRoundedRect(10, 28, 60, 16, 4);
    this.enemyTypeText = this.add.text(40, 36, enemyData.type[0], { fontSize: '10px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5);

    const hpLabel = this.add.text(10, 48, 'HP', { fontSize: '11px', fontFamily: 'monospace', color: '#a0a0c0' });
    const hpBg = this.add.graphics();
    hpBg.fillStyle(0x303050).fillRoundedRect(28, 50, 180, 10, 3);
    this.enemyHpBar = this.add.graphics();
    this.enemyHpText = this.add.text(210, 48, '', { fontSize: '10px', fontFamily: 'monospace', color: '#a0a0c0' }).setOrigin(1, 0);

    container.add([bg, this.enemyNameText, this.enemyLvlText, this.enemyTypeBg, this.enemyTypeText, hpLabel, hpBg, this.enemyHpBar, this.enemyHpText]);
    this.enemyNamePlate = container;
    this.updateHPBar(this.enemyBC.creature, false);
  }

  private createPlayerHUD() {
    const W = this.scale.width, H = this.scale.height;
    const container = this.add.container(W - 240, H - 180);
    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.9).fillRoundedRect(0, 0, 230, 70, 6);
    bg.lineStyle(2, 0xffffff, 0.4).strokeRoundedRect(0, 0, 230, 70, 6);

    const creature = this.playerBC.creature;
    const data = getCreatureById(creature.dataId)!;
    // Store reference so we can update it on creature switch
    this.playerNameText = this.add.text(10, 8, this.getPlayerCreatureName(), { fontSize: '16px', fontFamily: 'monospace', color: '#ffffff', fontStyle: 'bold' });
    this.playerLvlText = this.add.text(170, 8, `Lv.${creature.level}`, { fontSize: '14px', fontFamily: 'monospace', color: '#ffd700' });

    const typeColor = TYPE_COLORS[data.type[0]] ?? 0x808080;
    this.playerTypeBg = this.add.graphics();
    this.playerTypeBg.fillStyle(typeColor, 0.8).fillRoundedRect(10, 28, 60, 16, 4);
    this.playerTypeText = this.add.text(40, 36, data.type[0], { fontSize: '10px', fontFamily: 'monospace', color: '#ffffff' }).setOrigin(0.5);

    const hpLabel = this.add.text(10, 50, 'HP', { fontSize: '11px', fontFamily: 'monospace', color: '#a0a0c0' });
    const hpBg = this.add.graphics();
    hpBg.fillStyle(0x303050).fillRoundedRect(28, 52, 190, 10, 3);
    this.playerHpBar = this.add.graphics();
    this.playerHpText = this.add.text(220, 50, '', { fontSize: '10px', fontFamily: 'monospace', color: '#c0c0e0' }).setOrigin(1, 0);

    container.add([bg, this.playerNameText, this.playerLvlText, this.playerTypeBg, this.playerTypeText, hpLabel, hpBg, this.playerHpBar, this.playerHpText]);
    this.playerNamePlate = container;
    this.updateHPBar(this.playerBC.creature, true);
  }

  private updateHPBar(creature: ActiveCreature, isPlayer: boolean) {
    const bar = isPlayer ? this.playerHpBar : this.enemyHpBar;
    const txt = isPlayer ? this.playerHpText : this.enemyHpText;
    const ratio = Math.max(0, creature.currentHp / creature.maxHp);
    const maxW = isPlayer ? 190 : 180;
    const color = ratio > 0.5 ? 0x30c030 : ratio > 0.2 ? 0xf0c020 : 0xe02020;
    const ox = 28, oy = isPlayer ? 52 : 50;
    bar.clear();
    if (ratio > 0) bar.fillStyle(color).fillRoundedRect(ox, oy, Math.floor(maxW * ratio), 10, 3);
    txt.setText(isPlayer ? `${creature.currentHp}/${creature.maxHp}` : '');
  }

  // ── ACTION MENU ───────────────────────────────────────────────────────────────
  private createActionMenu() {
    const W = this.scale.width, H = this.scale.height;
    this.actionMenu = this.add.container(W - 316, H - 108).setDepth(20);

    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.95).fillRoundedRect(0, 0, 300, 96, 8);
    bg.lineStyle(2, 0xffd700).strokeRoundedRect(0, 0, 300, 96, 8);
    this.actionMenu.add(bg);

    const actions = ['⚔ FIGHT', '🎒 BAG', '♦ PARTY', '🏃 RUN'];
    const colors = ['#ff8080', '#80ffff', '#80ff80', '#ffff80'];
    actions.forEach((action, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      const btn = this.add.text(16 + col * 148, 18 + row * 44, action, {
        fontSize: '18px', fontFamily: 'monospace', color: colors[i],
        stroke: '#000', strokeThickness: 2,
      }).setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => { this.selectedAction = i; this.highlightActionBtn(); });
      btn.on('pointerdown', () => { this.selectedAction = i; this.handleActionSelect(); });
      this.menuButtons.push(btn);
      this.actionMenu.add(btn);
    });
    this.actionMenu.setVisible(false);

    // Keyboard nav
    this.input.keyboard!.on('keydown-UP',    () => { if (this.canInput && this.actionMenu.visible) { this.selectedAction = Math.max(0, this.selectedAction - 2); this.highlightActionBtn(); } });
    this.input.keyboard!.on('keydown-DOWN',  () => { if (this.canInput && this.actionMenu.visible) { this.selectedAction = Math.min(3, this.selectedAction + 2); this.highlightActionBtn(); } });
    this.input.keyboard!.on('keydown-LEFT',  () => { if (this.canInput && this.actionMenu.visible) { this.selectedAction = Math.max(0, this.selectedAction - 1); this.highlightActionBtn(); } });
    this.input.keyboard!.on('keydown-RIGHT', () => { if (this.canInput && this.actionMenu.visible) { this.selectedAction = Math.min(3, this.selectedAction + 1); this.highlightActionBtn(); } });
    this.input.keyboard!.on('keydown-ENTER', () => { if (this.canInput && this.actionMenu.visible) this.handleActionSelect(); });
    this.input.keyboard!.on('keydown-Z',     () => { if (this.canInput && this.actionMenu.visible) this.handleActionSelect(); });
    this.input.keyboard!.on('keydown-X',     () => { if (this.canInput && this.moveMenu.visible) this.showActionMenu(); });
  }

  // ── MOVE MENU ─────────────────────────────────────────────────────────────────
  private createMoveMenuContainer() {
    const W = this.scale.width, H = this.scale.height;
    this.moveMenu = this.add.container(8, H - 108).setDepth(20);

    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.95).fillRoundedRect(0, 0, 620, 96, 8);
    bg.lineStyle(2, 0x80a0ff).strokeRoundedRect(0, 0, 620, 96, 8);
    this.moveMenu.add(bg);

    const cancelBtn = this.add.text(600, 8, '✕', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ff8080',
    }).setInteractive({ useHandCursor: true });
    cancelBtn.on('pointerdown', () => this.showActionMenu());
    this.moveMenu.add(cancelBtn);

    this.moveMenu.setVisible(false);
    this.rebuildMoveButtons(); // populate for the initial creature
  }

  /** Destroy old move buttons and rebuild for the current playerBC creature */
  private rebuildMoveButtons() {
    this.moveButtons.forEach(b => {
      this.moveMenu.remove(b, true);
    });
    this.moveButtons = [];

    const creature = this.playerBC.creature;
    creature.moves.forEach((m, i) => {
      const move = getMoveById(m.moveId);
      if (!move) return;
      const col = i % 2, row = Math.floor(i / 2);
      const typeColor = TYPE_COLORS[move.type] ?? 0x808080;
      const hex = '#' + typeColor.toString(16).padStart(6, '0');
      const ppColor = m.pp > m.maxPp / 2 ? '#a0ffa0' : m.pp > 0 ? '#ffff80' : '#ff8080';
      const btn = this.add.text(16 + col * 300, 14 + row * 40,
        `${move.name}  [${move.type}]  PP:${m.pp}/${m.maxPp}`, {
        fontSize: '15px', fontFamily: 'monospace', color: hex,
      }).setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => { this.selectedMove = i; this.highlightMoveBtn(); });
      btn.on('pointerdown', () => { this.selectedMove = i; this.executePlayerMove(); });
      this.moveButtons.push(btn);
      this.moveMenu.add(btn);
    });
  }

  // ── BAG MENU ──────────────────────────────────────────────────────────────────
  private createBagMenu() {
    const W = this.scale.width, H = this.scale.height;
    this.bagMenu = this.add.container(8, H - 190).setDepth(20);

    const bg = this.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.95).fillRoundedRect(0, 0, 620, 180, 8);
    bg.lineStyle(2, 0x80ff80).strokeRoundedRect(0, 0, 620, 180, 8);
    this.bagMenu.add(bg);

    this.bagMenu.add(this.add.text(10, 10, 'BAG', { fontSize: '16px', fontFamily: 'monospace', color: '#ffd700' }));
    const cancelBtn = this.add.text(595, 10, '✕', { fontSize: '18px', fontFamily: 'monospace', color: '#ff8080' })
      .setInteractive({ useHandCursor: true });
    cancelBtn.on('pointerdown', () => { this.bagMenu.setVisible(false); this.showActionMenu(); });
    this.bagMenu.add(cancelBtn);

    [1, 2, 3].forEach((itemId, i) => {
      const item = getItemById(itemId)!;
      const qty = gameState.getItem(itemId)?.quantity ?? 0;
      const btn = this.add.text(16, 40 + i * 32, `${item.name} × ${qty}  — ${item.description}`, {
        fontSize: '14px', fontFamily: 'monospace', color: qty > 0 ? '#80ffff' : '#606080',
      }).setInteractive({ useHandCursor: qty > 0 });
      btn.on('pointerdown', () => {
        if (qty > 0) { this.bagMenu.setVisible(false); this.attemptCapture(itemId); }
      });
      this.bagMenu.add(btn);
    });

    [10, 11, 12, 13].forEach((itemId, i) => {
      const item = getItemById(itemId)!;
      const qty = gameState.getItem(itemId)?.quantity ?? 0;
      const btn = this.add.text(16, 140 + i * 26, `${item.name} × ${qty}`, {
        fontSize: '13px', fontFamily: 'monospace', color: qty > 0 ? '#80ff80' : '#606080',
      }).setInteractive({ useHandCursor: qty > 0 });
      btn.on('pointerdown', () => {
        if (qty > 0) { this.bagMenu.setVisible(false); this.useHealItem(itemId); }
      });
      this.bagMenu.add(btn);
    });

    this.bagMenu.setVisible(false);
  }

  // ── PARTY MENU ────────────────────────────────────────────────────────────────
  private createPartyMenuContainer() {
    this.partyMenu = this.add.container(0, 0).setDepth(25).setVisible(false);
  }

  /**
   * Show the party picker.
   * forced=true  → creature fainted, MUST pick another (no cancel)
   * forced=false → voluntary switch, can cancel (costs a turn)
   */
  private showPartyMenu(forced: boolean) {
    this.canInput = false;
    this.actionMenu.setVisible(false);
    this.moveMenu.setVisible(false);
    this.bagMenu.setVisible(false);

    // Rebuild fresh every time
    this.partyMenu.removeAll(true);

    const W = this.scale.width, H = this.scale.height;
    const menuW = 400;
    const rowH = 38;
    const rows = gameState.party.length;
    const menuH = 54 + rows * rowH + (forced ? 0 : 32);
    const mx = (W - menuW) / 2;
    const my = (H - menuH) / 2;

    this.partyMenu.setPosition(mx, my);

    // Background
    const bg = this.add.graphics();
    bg.fillStyle(0x0d1a2e, 0.97).fillRoundedRect(0, 0, menuW, menuH, 10);
    bg.lineStyle(3, 0x80ff80, 1).strokeRoundedRect(0, 0, menuW, menuH, 10);
    this.partyMenu.add(bg);

    this.partyMenu.add(this.add.text(menuW / 2, 14, forced ? '⚠ Choose your next creature!' : 'Switch Creature', {
      fontSize: '16px', fontFamily: 'monospace', color: forced ? '#ff8080' : '#80ff80',
    }).setOrigin(0.5, 0));

    gameState.party.forEach((c, i) => {
      const data = getCreatureById(c.dataId)!;
      const isActive = c === this.playerBC.creature;
      const isFaint = c.currentHp <= 0;
      const canSend = !isActive && !isFaint;

      const ry = 46 + i * rowH;

      // Row background
      const rowBg = this.add.graphics();
      rowBg.fillStyle(isActive ? 0x1a3050 : isFaint ? 0x300808 : 0x101820, 0.95)
           .fillRoundedRect(8, ry, menuW - 16, rowH - 2, 4);
      if (canSend) {
        rowBg.lineStyle(1, 0x406080).strokeRoundedRect(8, ry, menuW - 16, rowH - 2, 4);
      }
      this.partyMenu.add(rowBg);

      // Creature name
      const nameColor = isFaint ? '#605060' : isActive ? '#80d8ff' : '#e0e0ff';
      this.partyMenu.add(this.add.text(20, ry + 10, data.name, {
        fontSize: '14px', fontFamily: 'monospace', color: nameColor,
      }));

      // Level
      this.partyMenu.add(this.add.text(110, ry + 10, `Lv.${c.level}`, {
        fontSize: '11px', fontFamily: 'monospace', color: '#8090a0',
      }));

      // HP bar
      const hpPct = c.maxHp > 0 ? c.currentHp / c.maxHp : 0;
      const hpColor = isFaint ? 0x505060 : hpPct > 0.5 ? 0x30c030 : hpPct > 0.2 ? 0xf0c020 : 0xe02020;
      const barBg = this.add.graphics();
      barBg.fillStyle(0x303050).fillRoundedRect(150, ry + 12, 100, 8, 2);
      const barFill = this.add.graphics();
      if (!isFaint) barFill.fillStyle(hpColor).fillRoundedRect(150, ry + 12, Math.floor(100 * hpPct), 8, 2);
      this.partyMenu.add([barBg, barFill]);

      // HP text
      const hpTxt = isFaint ? 'FAINTED' : isActive ? '(active)' : `${c.currentHp}/${c.maxHp}`;
      const hpTxtColor = isFaint ? '#604060' : isActive ? '#60a0d0' : '#a0c0a0';
      this.partyMenu.add(this.add.text(260, ry + 10, hpTxt, {
        fontSize: '11px', fontFamily: 'monospace', color: hpTxtColor,
      }));

      // Send Out button (only for valid targets)
      if (canSend) {
        const sendBtn = this.add.text(menuW - 14, ry + 9, '[ Send Out ]', {
          fontSize: '12px', fontFamily: 'monospace', color: '#40c0ff',
          backgroundColor: '#102030', padding: { x: 4, y: 2 },
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        sendBtn.on('pointerover', () => { sendBtn.setStyle({ color: '#80ffff', backgroundColor: '#1a4060' }); });
        sendBtn.on('pointerout',  () => { sendBtn.setStyle({ color: '#40c0ff', backgroundColor: '#102030' }); });
        sendBtn.on('pointerdown', () => {
          this.partyMenu.setVisible(false);
          this.switchInCreature(c, forced);
        });
        this.partyMenu.add(sendBtn);
      }
    });

    // Cancel button for voluntary switch
    if (!forced) {
      const cancelBtn = this.add.text(menuW / 2, menuH - 10, '[ Cancel ]', {
        fontSize: '13px', fontFamily: 'monospace', color: '#ff8080',
      }).setOrigin(0.5, 1).setInteractive({ useHandCursor: true });
      cancelBtn.on('pointerover', () => cancelBtn.setColor('#ffaaaa'));
      cancelBtn.on('pointerdown', () => {
        this.partyMenu.setVisible(false);
        this.showActionMenu();
      });
      this.partyMenu.add(cancelBtn);
    }

    this.partyMenu.setVisible(true);
    this.canInput = true;
  }

  /** Perform the creature switch, then rebuild move menu */
  private switchInCreature(newCreature: ActiveCreature, fromFaint: boolean) {
    this.canInput = false;
    this.playerBC.creature = newCreature;
    this.playerBC.stages = { atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0, acc: 0, eva: 0 };
    this.playerBC.confusionTurns = 0;

    // Update sprite & HUD
    this.playerSprite.setTexture(`creature_${newCreature.dataId}_back`)
      .setDisplaySize(this.battleSize(newCreature.dataId).player, this.battleSize(newCreature.dataId).player);
    this.updateHPBar(newCreature, true);
    this.playerLvlText.setText(`Lv.${newCreature.level}`);
    this.playerNameText.setText(this.getPlayerCreatureName());

    // Update type badge
    const newData = getCreatureById(newCreature.dataId)!;
    const newTypeColor = TYPE_COLORS[newData.type[0]] ?? 0x808080;
    this.playerTypeBg.clear();
    this.playerTypeBg.fillStyle(newTypeColor, 0.8).fillRoundedRect(10, 28, 60, 16, 4);
    this.playerTypeText.setText(newData.type[0]);

    // Rebuild move buttons for the new creature
    this.rebuildMoveButtons();

    const data = getCreatureById(newCreature.dataId)!;
    this.showMessage(`Go, ${data.name}!`, () => {
      if (fromFaint) {
        // Forced switch: it's still the player's turn
        this.showActionMenu();
      } else {
        // Voluntary switch: counts as the player's turn → enemy moves next
        this.enemyTurn();
      }
    });
  }

  // ── MENU VISIBILITY ──────────────────────────────────────────────────────────
  private showActionMenu() {
    this.actionMenu.setVisible(true);
    this.moveMenu.setVisible(false);
    this.bagMenu.setVisible(false);
    this.partyMenu.setVisible(false);
    this.selectedAction = 0;
    this.highlightActionBtn();
    this.canInput = true;
  }

  private showMoveMenu() {
    this.actionMenu.setVisible(false);
    this.moveMenu.setVisible(true);
    this.selectedMove = 0;
    this.highlightMoveBtn();
  }

  private highlightActionBtn() {
    this.menuButtons.forEach((b, i) => b.setScale(i === this.selectedAction ? 1.1 : 1).setAlpha(i === this.selectedAction ? 1 : 0.7));
  }

  private highlightMoveBtn() {
    this.moveButtons.forEach((b, i) => b.setScale(i === this.selectedMove ? 1.05 : 1).setAlpha(i === this.selectedMove ? 1 : 0.75));
  }

  private handleActionSelect() {
    if (!this.canInput) return;
    this.canInput = false;
    switch (this.selectedAction) {
      case 0: // FIGHT
        this.showMoveMenu(); this.canInput = true; break;
      case 1: // BAG
        this.actionMenu.setVisible(false); this.bagMenu.setVisible(true); this.canInput = true; break;
      case 2: // PARTY
        this.showPartyMenu(false); break;
      case 3: // RUN
        this.tryRun(); break;
    }
  }

  // ── COMBAT MOVES ─────────────────────────────────────────────────────────────
  private executePlayerMove() {
    if (!this.canInput) return;
    this.canInput = false;
    this.moveMenu.setVisible(false);
    this.actionMenu.setVisible(false);

    const moveSlot = this.playerBC.creature.moves[this.selectedMove];
    if (!moveSlot || moveSlot.pp <= 0) {
      this.showMessage('No PP left!', () => this.showActionMenu());
      return;
    }
    moveSlot.pp--;
    const move = getMoveById(moveSlot.moveId)!;
    const playerName = this.getPlayerCreatureName();

    this.showMessage(`${playerName} used ${move.name}!`, () => {
      this.applyMove(this.playerBC, this.enemyBC, move, false);
    });
  }

  private applyMove(attacker: BattleCreature, defender: BattleCreature, move: Move, isEnemy: boolean) {
    const attackerName = isEnemy ? this.config.wildCreatureData.name : this.getPlayerCreatureName();
    const defenderName = isEnemy ? this.getPlayerCreatureName() : this.config.wildCreatureData.name;

    if (move.category === 'Status') {
      this.applyStatusMove(attacker, defender, move, isEnemy);
      return;
    }

    if (Math.random() * 100 > move.accuracy) {
      this.showMessage(`${attackerName}'s ${move.name} missed!`, () => this.nextTurn(!isEnemy));
      return;
    }

    const result = calcDamage(attacker, defender, move);
    const targetSprite = isEnemy ? this.playerSprite : this.enemySprite;
    const knockDir = isEnemy ? -18 : 18; // enemy knocks left, player knocks right

    // Type-colour flash overlay
    const typeColors: Record<string, number> = {
      Fire: 0xff4400, Water: 0x0088ff, Nature: 0x00cc44, Earth: 0xaa7700,
      Wind: 0x88ccff, Shadow: 0x8800cc, Light: 0xffee00, Electric: 0xffcc00,
      Normal: 0xffffff,
    };
    const flashCol = typeColors[move.type] ?? 0xffffff;
    const flash = this.add.graphics().setDepth(50);
    flash.fillStyle(flashCol, 0.35)
      .fillRect(0, 0, this.scale.width, this.scale.height);
    this.tweens.add({ targets: flash, alpha: 0, duration: 180, onComplete: () => flash.destroy() });

    // Knockback + white flash on hit sprite
    const origX = targetSprite.x;
    this.tweens.add({
      targets: targetSprite,
      x: origX + knockDir, alpha: 0.1,
      duration: 60, yoyo: true, repeat: 2,
      onComplete: () => { targetSprite.x = origX; targetSprite.setAlpha(1); },
    });

    defender.creature.currentHp = Math.max(0, defender.creature.currentHp - result.damage);
    this.updateHPBar(defender.creature, isEnemy); // isEnemy=true → player bar; isEnemy=false → enemy bar

    let msg = result.effectivenessMsg ?? `Dealt ${result.damage} damage!`;

    if (move.effect?.type === 'status' && move.effect.chance && Math.random() * 100 < (move.effect.chance ?? 0)) {
      if (!defender.creature.status && move.effect.status) {
        defender.creature.status = move.effect.status;
        msg += ` ${defenderName} is ${move.effect.status}!`;
      }
    }

    this.showMessage(msg, () => {
      if (isFainted(defender.creature)) {
        const faintedName = isEnemy ? this.getPlayerCreatureName() : this.config.wildCreatureData.name;
        this.showMessage(`${faintedName} fainted!`, () => {
          if (isEnemy) this.handlePlayerFaint();
          else this.handleEnemyFaint();
        });
      } else {
        this.nextTurn(!isEnemy);
      }
    });
  }

  private applyStatusMove(attacker: BattleCreature, defender: BattleCreature, move: Move, isEnemy: boolean) {
    const attackerName = isEnemy ? this.config.wildCreatureData.name : this.getPlayerCreatureName();
    const defenderName = isEnemy ? this.getPlayerCreatureName() : this.config.wildCreatureData.name;
    let msg = '';

    if (move.effect?.type === 'stat') {
      const target = move.effect.target === 'self' ? attacker : defender;
      const targetName = move.effect.target === 'self' ? attackerName : defenderName;
      const stat = move.effect.stat!;
      const stages = move.effect.stages!;
      target.stages[stat] = Math.max(-6, Math.min(6, (target.stages[stat] ?? 0) + stages));
      const dir = stages > 0 ? 'rose' : 'fell';
      const amount = Math.abs(stages) > 1 ? ' sharply' : '';
      msg = `${targetName}'s ${stat.toUpperCase()} ${dir}${amount}!`;
    } else if (move.effect?.type === 'heal') {
      const healAmt = Math.floor(attacker.creature.maxHp * (move.effect.healPercent ?? 50) / 100);
      attacker.creature.currentHp = Math.min(attacker.creature.maxHp, attacker.creature.currentHp + healAmt);
      this.updateHPBar(attacker.creature, !isEnemy);
      msg = `${attackerName} restored ${healAmt} HP!`;
    } else if (move.effect?.type === 'status' && move.effect.status) {
      if (!defender.creature.status) {
        defender.creature.status = move.effect.status;
        msg = `${defenderName} is now ${move.effect.status}!`;
      } else {
        msg = `${defenderName} is already affected!`;
      }
    }

    this.showMessage(msg || `${attackerName} used ${move.name}!`, () => this.nextTurn(!isEnemy));
  }

  // ── TURN FLOW ─────────────────────────────────────────────────────────────────
  // wasPlayerTurn=true  → player just moved → enemy goes next
  // wasPlayerTurn=false → enemy just moved  → player chooses
  private nextTurn(wasPlayerTurn: boolean) {
    if (wasPlayerTurn) this.time.delayedCall(400, () => this.enemyTurn());
    else this.showActionMenu();
  }

  private enemyTurn() {
    const moves = this.enemyBC.creature.moves.filter(m => m.pp > 0);
    if (moves.length === 0) { this.showActionMenu(); return; }

    const moveSlot = moves[Math.floor(Math.random() * moves.length)];
    moveSlot.pp--;
    const move = getMoveById(moveSlot.moveId)!;
    const enemyName = this.config.wildCreatureData.name;

    const statusDmg = applyStatusDamage(this.enemyBC.creature);
    if (statusDmg > 0) {
      this.updateHPBar(this.enemyBC.creature, false);
      const status = this.enemyBC.creature.status;
      this.showMessage(`${enemyName} is hurt by ${status}! (-${statusDmg} HP)`, () => {
        if (isFainted(this.enemyBC.creature)) {
          this.showMessage(`${enemyName} fainted!`, () => this.handleEnemyFaint());
        } else {
          this.doEnemyAttack(move);
        }
      });
    } else {
      this.doEnemyAttack(move);
    }
  }

  private doEnemyAttack(move: Move) {
    const enemyName = this.config.wildCreatureData.name;
    this.showMessage(`${enemyName} used ${move.name}!`, () => {
      this.applyMove(this.enemyBC, this.playerBC, move, true);
    });
  }

  // ── FAINT HANDLING ────────────────────────────────────────────────────────────
  private handleEnemyFaint() {
    const exp = calcExpGain(this.enemyBC.creature);
    const creature = this.playerBC.creature;
    const { leveled, newLevel } = applyExpGain(creature, exp);
    gameState.seenCreatures.add(this.config.wildCreatureData.id);

    this.showMessage(`Gained ${exp} EXP!`, () => {
      if (leveled) {
        this.showMessage(`${this.getPlayerCreatureName()} grew to Level ${newLevel}!`, () => {
          this.updateHPBar(creature, true);
          this.playerLvlText.setText(`Lv.${creature.level}`);

          // Check for new moves learned at this level
          const newMoveIds = learnNewMoves(creature);
          const learnNext = (remaining: number[]) => {
            if (remaining.length === 0) {
              this.checkEvolutionAfterLevel(creature);
              return;
            }
            const moveId = remaining[0];
            const move = getMoveById(moveId)!;
            if (creature.moves.length < 4) {
              creature.moves.push({ moveId, pp: move.pp, maxPp: move.pp });
              this.rebuildMoveButtons();
              this.showMessage(`${this.getPlayerCreatureName()} learned ${move.name}!`, () => learnNext(remaining.slice(1)));
            } else {
              // Moves full — for now auto-replace the oldest move
              const dropped = creature.moves.shift()!;
              const droppedMove = getMoveById(dropped.moveId);
              creature.moves.push({ moveId, pp: move.pp, maxPp: move.pp });
              this.rebuildMoveButtons();
              this.showMessage(
                `Forgot ${droppedMove?.name ?? '?'} and learned ${move.name}!`,
                () => learnNext(remaining.slice(1)),
              );
            }
          };
          learnNext(newMoveIds);
        });
      } else {
        this.finishEnemyFaint();
      }
    });
  }

  /** Returns consistent battle display sizes for a creature based on its evolution
   *  stage, regardless of the source PNG's actual pixel dimensions. This keeps all
   *  base-form creatures the same visual size, all mid-evolutions the same size, etc. */
  private battleSize(dataId: number): { enemy: number; player: number } {
    const stage1 = [1, 4, 7, 10, 12, 14, 16, 18, 20, 22, 24, 29];   // base forms
    const stage2 = [2, 5, 8, 11, 13, 15, 17, 19, 21, 23, 25, 30];   // mid evolutions
    // stage3 / standalone finals: 3, 6, 9, 26, 27, 28 — everything else
    if (stage1.includes(dataId)) return { enemy: 96,  player: 112 };
    if (stage2.includes(dataId)) return { enemy: 120, player: 136 };
    return                              { enemy: 152, player: 172 };
  }

  private checkEvolutionAfterLevel(creature: ActiveCreature) {
    const evolveId = checkEvolution(creature);
    if (evolveId) {
      this.showMessage(`${this.getPlayerCreatureName()} is evolving!`, () => {
        const newData = getCreatureById(evolveId)!;
        const oldName = this.getPlayerCreatureName();
        creature.dataId = evolveId;

        // Mark evolved form as seen AND caught in the dex
        gameState.seenCreatures.add(evolveId);
        gameState.caughtCreatures.add(evolveId);

        // Update moves to match the evolved species' learnset up to current level
        const evolved = getCreatureById(evolveId)!;
        const newMoves = evolved.learnset
          .filter(m => m.level <= creature.level)
          .sort((a, b) => b.level - a.level)
          .slice(0, 4);
        // Keep any moves the creature already has that aren't in the new learnset
        const existingMoveIds = new Set(creature.moves.map(m => m.moveId));
        const newMoveIds = new Set(newMoves.map(m => m.moveId));
        const toKeep = creature.moves.filter(m => !newMoveIds.has(m.moveId));
        const toAdd = newMoves
          .filter(m => !existingMoveIds.has(m.moveId))
          .map(m => ({ moveId: m.moveId, pp: getMoveById(m.moveId)?.pp ?? 10, maxPp: getMoveById(m.moveId)?.pp ?? 10 }));
        const merged = [...creature.moves, ...toAdd];
        creature.moves = merged.slice(-4); // keep the 4 most recently learned
        this.rebuildMoveButtons();

        this.playerSprite.setTexture(`creature_${evolveId}_back`)
          .setDisplaySize(this.battleSize(evolveId).player, this.battleSize(evolveId).player);
        this.showMessage(`${oldName} evolved into ${newData.name}!`, () => this.finishEnemyFaint());
      });
    } else {
      this.finishEnemyFaint();
    }
  }

  /**
   * Called after the current enemy creature faints + EXP chain is done.
   * If the trainer has more creatures queued, sends out the next one.
   * Otherwise, calls finishWin().
   */
  private finishEnemyFaint() {
    if (this.trainerEnemyQueue.length > 0) {
      this.nextTrainerCreature();
    } else {
      this.finishWin();
    }
  }

  /** Swap in the trainer's next creature and refresh the enemy HUD. */
  private nextTrainerCreature() {
    const next = this.trainerEnemyQueue.shift()!;
    gameState.seenCreatures.add(next.data.id);

    // Update the live reference so doEnemyAttack() uses the correct name
    this.config.wildCreatureData = next.data;

    this.enemyBC = {
      creature: next.creature,
      stages: { atk: 0, def: 0, spatk: 0, spdef: 0, spd: 0, acc: 0, eva: 0 },
      confusionTurns: 0,
    };

    // Update enemy sprite (animate it sliding in)
    this.enemySprite.setAlpha(0).setTexture(`creature_${next.data.id}`)
      .setDisplaySize(this.battleSize(next.data.id).enemy, this.battleSize(next.data.id).enemy);
    this.tweens.add({ targets: this.enemySprite, alpha: 1, duration: 400 });

    // Update enemy HUD text + type badge
    this.enemyNameText?.setText(next.data.name);
    this.enemyLvlText?.setText(`Lv.${next.creature.level}`);
    this.updateHPBar(next.creature, false);
    const newTypeColor = TYPE_COLORS[next.data.type[0]] ?? 0x808080;
    this.enemyTypeBg?.clear();
    this.enemyTypeBg?.fillStyle(newTypeColor, 0.8).fillRoundedRect(10, 28, 60, 16, 4);
    this.enemyTypeText?.setText(next.data.type[0]);

    const trainerName = this.config.trainerName ?? 'Trainer';
    this.showMessage(`${trainerName} sent out ${next.data.name}!`, () => {
      this.showActionMenu();
    });
  }

  /** Called after all trainer/wild creatures are defeated — shows prize then ends battle. */
  private finishWin() {
    if (this.config.isTrainer) {
      const baseLevel = this.config.wildCreature.level +
        (this.config.trainerExtraCreatures ?? []).reduce((s, tc) => s + tc.creature.level, 0);
      const rematchCount = this.config.trainerNpcId
        ? gameState.getCounter(`rematch_${this.config.trainerNpcId}`)
        : 0;
      const scaleFactor = 1 + rematchCount * 0.5; // +50% per rematch
      const prize = Math.floor(baseLevel * 20 * scaleFactor);
      gameState.money += prize;
      const rematchNote = rematchCount > 0 ? ` (×${scaleFactor.toFixed(1)} rematch bonus)` : '';
      this.showMessage(
        `${this.config.trainerName ?? 'Trainer'} was defeated!\nYou received ¢${prize}!${rematchNote}`,
        () => this.endBattle('win'),
      );
    } else {
      this.endBattle('win');
    }
  }

  private handlePlayerFaint() {
    const anyAlive = gameState.party.some(c => c !== this.playerBC.creature && c.currentHp > 0);
    if (!anyAlive) {
      this.showMessage(`You have no creatures left!`, () => this.endBattle('blackout'));
    } else {
      // Show party picker — player MUST choose a replacement
      this.showMessage(`${this.getPlayerCreatureName()} fainted!`, () => {
        this.showPartyMenu(true);
      });
    }
  }

  // ── ITEMS & CAPTURE ───────────────────────────────────────────────────────────
  private attemptCapture(ballId: number) {
    if (this.config.isTrainer) {
      this.showMessage("You can't capture a trainer's creature!", () => this.showActionMenu());
      return;
    }
    const ballItem = getItemById(ballId)!;
    gameState.useItem(ballId);
    const enemyName = this.config.wildCreatureData.name;
    const catchRate = this.config.wildCreatureData.catchRate;
    const ballMult = ballItem.catchMultiplier ?? 1;

    this.showMessage(`Threw ${ballItem.name}!`, () => {
      const W = this.scale.width, H = this.scale.height;
      const orb = this.add.image(W * 0.28, H * 0.52, 'capture_orb_0').setDepth(30);
      this.tweens.add({
        targets: orb, x: this.enemySprite.x, y: this.enemySprite.y,
        duration: 600, ease: 'Power2',
        onComplete: () => {
          this.enemySprite.setAlpha(0);
          let shakes = 0;
          const shakeTimer = this.time.addEvent({
            delay: 400,
            callback: () => {
              shakes++;
              this.tweens.add({ targets: orb, x: orb.x + (shakes % 2 === 0 ? 8 : -8), duration: 100, yoyo: true });
              orb.setTexture(`capture_orb_${shakes % 3}`);
              if (shakes >= 3) {
                shakeTimer.destroy();
                this.time.delayedCall(300, () => {
                  const caught = tryCapture(this.enemyBC.creature, catchRate, ballMult);
                  if (caught) {
                    orb.setTexture('capture_orb_2');
                    this.tweens.add({ targets: orb, alpha: 0, duration: 300, delay: 200 });
                    this.showMessage(`${enemyName} was caught!`, () => {
                      const caughtCreature = this.enemyBC.creature;
                      caughtCreature.isCaught = true;
                      gameState.addToParty(caughtCreature);
                      gameState.caughtCreatures.add(this.config.wildCreatureData.id);
                      gameState.seenCreatures.add(this.config.wildCreatureData.id);
                      this.endBattle('caught');
                    });
                  } else {
                    this.enemySprite.setAlpha(1);
                    orb.destroy();
                    this.showMessage(`${enemyName} broke free!`, () => this.enemyTurn());
                  }
                });
              }
            },
            repeat: 2,
          });
        },
      });
    });
  }

  private useHealItem(itemId: number) {
    const item = getItemById(itemId)!;
    const creature = this.playerBC.creature;
    gameState.useItem(itemId);
    if (item.healAmount) {
      creature.currentHp = Math.min(creature.maxHp, creature.currentHp + item.healAmount);
    } else if (item.healPercent) {
      creature.currentHp = Math.min(creature.maxHp, Math.floor(creature.maxHp * item.healPercent / 100));
    }
    this.updateHPBar(creature, true);
    this.showMessage(`${this.getPlayerCreatureName()} was healed!`, () => this.enemyTurn());
  }

  // ── RUN ───────────────────────────────────────────────────────────────────────
  private tryRun() {
    if (this.config.isTrainer) {
      this.showMessage("You can't run from a trainer battle!", () => this.showActionMenu());
      return;
    }
    const playerSpd = this.playerBC.creature.stats.spd;
    const enemySpd  = this.enemyBC.creature.stats.spd;
    const escapeChance = Math.min(0.95, (playerSpd * 128 / Math.max(1, enemySpd) + 30) / 255);
    if (Math.random() < escapeChance) {
      this.showMessage('Got away safely!', () => this.endBattle('fled'));
    } else {
      this.showMessage(`Can't escape!`, () => { this.canInput = false; this.enemyTurn(); });
    }
  }

  // ── END BATTLE ────────────────────────────────────────────────────────────────
  private endBattle(result: string) {
    if (result === 'blackout') {
      gameState.party.forEach(c => { c.currentHp = Math.max(1, Math.floor(c.maxHp * 0.5)); c.status = null; });
      gameState.mapId = 'oakwind';
      gameState.playerX = 15;
      gameState.playerY = 10;
    }

    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.stop('Battle');
      this.scene.setActive(true, 'Overworld');
      this.scene.setVisible(true, 'Overworld');
      const ow = this.scene.get('Overworld') as unknown as { isInBattle: boolean; cameras: { main: { fadeIn: (n: number) => void } } };
      if (result === 'blackout') {
        this.scene.start('Overworld');
        this.showBlackoutMessage();
      } else {
        ow.isInBattle = false;
        ow.cameras?.main?.fadeIn?.(400);
        if (this.config.onBattleEnd) this.config.onBattleEnd(result);
      }
    });
  }

  private showBlackoutMessage() {
    const W = this.scale.width, H = this.scale.height;
    const overlay = this.add.graphics().setDepth(999);
    overlay.fillStyle(0x000000, 1).fillRect(0, 0, W, H);
    this.add.text(W / 2, H / 2 - 20, 'YOU BLACKED OUT!', {
      fontSize: '28px', fontFamily: 'monospace', color: '#ff4444', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(1000);
    this.add.text(W / 2, H / 2 + 20, 'Returned to Oakwind Village...', {
      fontSize: '16px', fontFamily: 'monospace', color: '#aaaaaa',
    }).setOrigin(0.5).setDepth(1000);
  }

  // ── MESSAGES ──────────────────────────────────────────────────────────────────
  private showMessage(text: string, onComplete?: () => void) {
    this.actionMenu?.setVisible(false);
    this.moveMenu?.setVisible(false);
    if (!this.msgBox) return;
    this.msgBox.setText(text);
    if (onComplete) this.time.delayedCall(1800, onComplete);
  }

  private getPlayerCreatureName(): string {
    const data = getCreatureById(this.playerBC.creature.dataId);
    return this.playerBC.creature.nickname ?? data?.name ?? 'Creature';
  }
}

export default BattleScene;
