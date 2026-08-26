import Phaser from 'phaser';
import { gameState } from '../GameState';
import { getCreatureById, CREATURES } from '../data/creatures';
import { getItemById } from '../data/items';
import { getMoveById } from '../data/moves';
import { TYPE_COLORS } from '../data/typeChart';
import { MAPS } from '../data/maps';
import type { ActiveCreature } from '../data/types';
import { learnNewMoves, checkEvolution, applyExpGain } from '../systems/BattleSystem';
import { fitImageToBox } from './spriteFit';

type MenuTab = 'main' | 'party' | 'bag' | 'dex' | 'save' | 'storage';

interface MenuConfig { onClose: () => void; }

export class MenuScene extends Phaser.Scene {
  private config!: MenuConfig;
  private activeTab: MenuTab = 'main';
  private container!: Phaser.GameObjects.Container;
  private contentContainer!: Phaser.GameObjects.Container;
  private selectedPartyIndex = 0;
  private activeWheelHandler: ((...args: unknown[]) => void) | null = null;
  private activeUpHandler: (() => void) | null = null;
  private activeDownHandler: (() => void) | null = null;
  private activeDragStartHandler: ((pointer: Phaser.Input.Pointer) => void) | null = null;
  private activeDragMoveHandler: ((pointer: Phaser.Input.Pointer) => void) | null = null;
  private activeDragEndHandler: ((pointer: Phaser.Input.Pointer) => void) | null = null;
  /**
   * Scroll lists use a dedicated camera scoped to the list's viewport for
   * clipping (same technique as the Guide NPC's help screen), instead of
   * rebuilding rows every scroll tick and painting a colour-matched
   * rectangle over the overflow. These are torn down centrally on every
   * tab switch — see switchTab().
   */
  private scrollCams: Phaser.Cameras.Scene2D.Camera[] = [];
  private scrollLayers: Phaser.GameObjects.Container[] = [];
  // Party: null = list view, number = detail view for that index
  private partyDetailIndex: number | null = null;
  // Bag: null = item list, number = target picker for that item id
  private bagPendingItemId: number | null = null;

  constructor() { super('Menu'); }

  init(data: MenuConfig) { this.config = data; }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Dim overlay
    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.7).setDepth(0);

    // Main menu panel
    this.container = this.add.container(W / 2 - 260, 40).setDepth(10);
    const panelBg = this.add.graphics();
    panelBg.fillStyle(0x0d1a2e, 0.98).fillRoundedRect(0, 0, 520, H - 80, 12);
    panelBg.lineStyle(3, 0xffd700).strokeRoundedRect(0, 0, 520, H - 80, 12);
    this.container.add(panelBg);

    // Title bar
    panelBg.fillStyle(0x1a2e4e).fillRoundedRect(4, 4, 512, 48, 8);
    const titleText = this.add.text(260, 28, '✦ TRAINER MENU ✦', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5);
    this.container.add(titleText);

    // Tab buttons
    const tabs: { id: MenuTab; label: string }[] = [
      { id: 'party',   label: '♦ PARTY' },
      { id: 'bag',     label: '🎒 BAG' },
      { id: 'dex',     label: '📖 DEX' },
      { id: 'storage', label: '📦 BOX' },
      { id: 'save',    label: '💾 SAVE' },
    ];

    tabs.forEach((tab, i) => {
      const btn = this.add.text(14 + i * 99, 70, tab.label, {
        fontSize: '12px', fontFamily: 'monospace', color: '#c0e0ff',
        backgroundColor: '#1a2a4a', padding: { x: 6, y: 6 },
      }).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => this.switchTab(tab.id));
      btn.on('pointerover', () => btn.setColor('#ffd700'));
      btn.on('pointerout', () => btn.setColor(this.activeTab === tab.id ? '#ffd700' : '#c0e0ff'));
      this.container.add(btn);
    });

    // Close button
    const closeBtn = this.add.text(490, 20, '✕', {
      fontSize: '22px', fontFamily: 'monospace', color: '#ff8080',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.closeMenu());
    this.container.add(closeBtn);

    // Content area
    this.contentContainer = this.add.container(W / 2 - 260, 160).setDepth(10);
    this.switchTab('party');

    // Keyboard
    this.input.keyboard!.on('keydown-ESC',   () => this.closeMenu());
    this.input.keyboard!.on('keydown-ONE',   () => this.switchTab('party'));
    this.input.keyboard!.on('keydown-TWO',   () => this.switchTab('bag'));
    this.input.keyboard!.on('keydown-THREE', () => this.switchTab('dex'));
    this.input.keyboard!.on('keydown-FOUR',  () => this.switchTab('storage'));
    this.input.keyboard!.on('keydown-FIVE',  () => this.switchTab('save'));
  }

  /**
   * A blocking Yes/No confirmation modal, rendered above everything
   * (including the active tab content) with a dimmed backdrop. Used for
   * evolution confirmation, and reusable for any future "are you sure?"
   * prompt in the menu.
   */
  private showConfirmModal(message: string, onYes: () => void, onNo: () => void) {
    const W = this.scale.width, H = this.scale.height;
    const modal = this.add.container(0, 0).setDepth(1000);

    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.6).fillRect(0, 0, W, H);
    dim.setInteractive(new Phaser.Geom.Rectangle(0, 0, W, H), Phaser.Geom.Rectangle.Contains);
    modal.add(dim);

    const boxW = 420, boxH = 160;
    const boxX = (W - boxW) / 2, boxY = (H - boxH) / 2;
    const box = this.add.graphics();
    box.fillStyle(0x1a1a2e, 0.98).fillRoundedRect(boxX, boxY, boxW, boxH, 10);
    box.lineStyle(3, 0xffd700, 0.9).strokeRoundedRect(boxX, boxY, boxW, boxH, 10);
    modal.add(box);

    const txt = this.add.text(boxX + boxW / 2, boxY + 44, message, {
      fontSize: '15px', fontFamily: 'monospace', color: '#ffffff',
      align: 'center', wordWrap: { width: boxW - 40 }, lineSpacing: 6,
    }).setOrigin(0.5);
    modal.add(txt);

    const yesBtn = this.add.text(boxX + boxW / 2 - 70, boxY + boxH - 32, '✔ YES', {
      fontSize: '18px', fontFamily: 'monospace', color: '#80ff80', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    const noBtn = this.add.text(boxX + boxW / 2 + 70, boxY + boxH - 32, '✘ NO', {
      fontSize: '18px', fontFamily: 'monospace', color: '#ff8080', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    yesBtn.on('pointerover', () => yesBtn.setStyle({ color: '#c0ffc0' }));
    yesBtn.on('pointerout',  () => yesBtn.setStyle({ color: '#80ff80' }));
    noBtn.on('pointerover',  () => noBtn.setStyle({ color: '#ffc0c0' }));
    noBtn.on('pointerout',   () => noBtn.setStyle({ color: '#ff8080' }));
    yesBtn.on('pointerdown', () => { modal.destroy(); onYes(); });
    noBtn.on('pointerdown',  () => { modal.destroy(); onNo(); });
    modal.add([yesBtn, noBtn]);
  }

  private switchTab(tab: MenuTab) {
    this.teardownScrollArea();

    // Reset sub-navigation when leaving a tab
    if (tab !== 'party') this.partyDetailIndex  = null;
    if (tab !== 'bag')   this.bagPendingItemId  = null;

    this.activeTab = tab;
    this.contentContainer.removeAll(true);
    switch (tab) {
      case 'party':   this.renderParty();   break;
      case 'bag':     this.renderBag();     break;
      case 'dex':     this.renderDex();     break;
      case 'storage': this.renderStorage(); break;
      case 'save':    this.renderSave();    break;
    }
  }

  /** Tears down the active scroll camera/layer and its input listeners, if any. */
  private teardownScrollArea() {
    if (this.activeWheelHandler) { this.input.off('wheel', this.activeWheelHandler); this.activeWheelHandler = null; }
    if (this.activeUpHandler)    { this.input.keyboard?.off('keydown-UP', this.activeUpHandler); this.activeUpHandler = null; }
    if (this.activeDownHandler)  { this.input.keyboard?.off('keydown-DOWN', this.activeDownHandler); this.activeDownHandler = null; }
    if (this.activeDragStartHandler) { this.input.off('pointerdown', this.activeDragStartHandler); this.activeDragStartHandler = null; }
    if (this.activeDragMoveHandler)  { this.input.off('pointermove', this.activeDragMoveHandler); this.activeDragMoveHandler = null; }
    if (this.activeDragEndHandler) {
      this.input.off('pointerup', this.activeDragEndHandler);
      this.input.off('pointerupoutside', this.activeDragEndHandler);
      this.activeDragEndHandler = null;
    }
    this.scrollCams.forEach(cam => this.cameras.remove(cam));
    this.scrollCams = [];
    this.scrollLayers.forEach(layer => layer.destroy());
    this.scrollLayers = [];
  }

  /**
   * Sets up a smoothly-scrollable, properly clipped list area using a
   * dedicated camera scoped to the list's viewport — the same technique
   * used by the Guide NPC's help screen. This replaces the old approach of
   * rebuilding every row on each scroll tick and painting a colour-matched
   * rectangle over the overflow, which relied on that colour exactly
   * matching the backdrop and rebuilt GameObjects on every wheel event.
   *
   * `listTop`/`listH` use the same local coordinate system already used
   * throughout this file (the 0–512-wide content panel). Returns a
   * container — add each row's content into it ONCE, positioned at
   * `index * rowStep` (no manual scroll offset, no visibility filtering
   * needed; the camera clips everything outside the view automatically).
   */
  private createScrollArea(
    listTop: number, listH: number, totalContentH: number,
    opts: { scrollbarX?: number; scrollbarW?: number; rowStep?: number } = {},
  ): Phaser.GameObjects.Container {
    const { scrollbarX = 500, scrollbarW = 8, rowStep = 32 } = opts;
    const cc = this.contentContainer;
    const viewX = cc.x, viewY = cc.y + listTop, viewW = 512, viewH = listH;

    const rows = this.add.container(viewX, viewY);
    this.scrollLayers.push(rows);

    const cam = this.cameras.add(viewX, viewY, viewW, viewH);
    cam.setScroll(viewX, viewY);
    cam.ignore(this.container);
    cam.ignore(cc);
    this.cameras.main.ignore(rows);
    this.scrollCams.push(cam);

    const maxScroll = Math.max(0, totalContentH - listH);
    if (maxScroll <= 0) return rows;
    let scrollY = 0;

    const trackBg = this.add.graphics();
    trackBg.fillStyle(0x1a2a40).fillRoundedRect(scrollbarX, listTop, scrollbarW, listH, scrollbarW / 2);
    cc.add(trackBg);
    const thumbH = Math.max(16, (listH / totalContentH) * listH);
    const thumb = this.add.graphics();
    cc.add(thumb);

    const applyScroll = () => {
      rows.y = viewY - scrollY;
      const p = scrollY / maxScroll;
      thumb.clear().fillStyle(0x4080c0)
        .fillRoundedRect(scrollbarX, listTop + p * (listH - thumbH), scrollbarW, thumbH, scrollbarW / 2);
    };
    applyScroll();

    this.activeWheelHandler = (_p: unknown, _g: unknown, _dx: unknown, dy: unknown) => {
      scrollY = Phaser.Math.Clamp(scrollY + (dy as number) * 0.5, 0, maxScroll);
      applyScroll();
    };
    this.input.on('wheel', this.activeWheelHandler);

    this.activeUpHandler = () => { scrollY = Phaser.Math.Clamp(scrollY - rowStep, 0, maxScroll); applyScroll(); };
    this.activeDownHandler = () => { scrollY = Phaser.Math.Clamp(scrollY + rowStep, 0, maxScroll); applyScroll(); };
    this.input.keyboard?.on('keydown-UP', this.activeUpHandler);
    this.input.keyboard?.on('keydown-DOWN', this.activeDownHandler);

    // Touch/mouse drag-to-scroll — no wheel or arrow keys on a phone, so
    // this is the only way to scroll Dex/Party/Bag/Box there. A small move
    // threshold keeps quick taps on row buttons (swap, release, select)
    // working normally; only a real drag past DRAG_THRESHOLD scrolls.
    const DRAG_THRESHOLD = 6;
    let dragPointerId: number | null = null;
    let dragging = false;
    let dragStartY = 0;
    let scrollStartY = 0;

    this.activeDragStartHandler = (pointer: Phaser.Input.Pointer) => {
      if (
        dragPointerId === null &&
        pointer.x >= viewX && pointer.x <= viewX + viewW &&
        pointer.y >= viewY && pointer.y <= viewY + viewH
      ) {
        dragPointerId = pointer.id;
        dragging = false;
        dragStartY = pointer.y;
        scrollStartY = scrollY;
      }
    };
    this.activeDragMoveHandler = (pointer: Phaser.Input.Pointer) => {
      if (dragPointerId !== pointer.id) return;
      const dy = dragStartY - pointer.y;
      if (!dragging && Math.abs(dy) < DRAG_THRESHOLD) return;
      dragging = true;
      scrollY = Phaser.Math.Clamp(scrollStartY + dy, 0, maxScroll);
      applyScroll();
    };
    this.activeDragEndHandler = (pointer: Phaser.Input.Pointer) => {
      if (dragPointerId !== pointer.id) return;
      dragPointerId = null;
      dragging = false;
    };
    this.input.on('pointerdown', this.activeDragStartHandler);
    this.input.on('pointermove', this.activeDragMoveHandler);
    this.input.on('pointerup', this.activeDragEndHandler);
    this.input.on('pointerupoutside', this.activeDragEndHandler);

    return rows;
  }

  private renderParty() {
    const H = this.scale.height;
    const panelH = H - 220;

    const bg = this.add.graphics();
    bg.fillStyle(0x0a1220, 0.5).fillRoundedRect(4, 0, 512, panelH, 8);
    this.contentContainer.add(bg);

    if (gameState.party.length === 0) {
      this.contentContainer.add(this.add.text(260, panelH / 2,
        'No creatures!\nVisit Prof. Rowan to start.', {
        fontSize: '16px', fontFamily: 'monospace', color: '#606080', align: 'center',
      }).setOrigin(0.5));
      return;
    }

    // ── Detail view ──────────────────────────────────────────────────────────
    if (this.partyDetailIndex !== null) {
      const creature = gameState.party[this.partyDetailIndex];
      if (!creature) { this.partyDetailIndex = null; this.renderParty(); return; }
      const data = getCreatureById(creature.dataId)!;

      // Back button
      const backBtn = this.add.text(14, 10, '◀ Party', {
        fontSize: '13px', fontFamily: 'monospace', color: '#80d0ff',
        backgroundColor: '#0e1e3a', padding: { x: 6, y: 4 },
      }).setInteractive({ useHandCursor: true });
      backBtn.on('pointerdown', () => { this.partyDetailIndex = null; this.switchTab('party'); });
      this.contentContainer.add(backBtn);

      this.contentContainer.add(this.add.text(260, 12,
        `${creature.nickname ?? data.name}  Lv.${creature.level}`, {
        fontSize: '16px', fontFamily: 'monospace', color: '#ffd700',
      }).setOrigin(0.5));

      // Navigation arrows between party members
      if (this.partyDetailIndex > 0) {
        const prevBtn = this.add.text(14, 34, '▲ Prev', {
          fontSize: '11px', fontFamily: 'monospace', color: '#a0c0e0',
          backgroundColor: '#0e1830', padding: { x: 4, y: 2 },
        }).setInteractive({ useHandCursor: true });
        prevBtn.on('pointerdown', () => { this.partyDetailIndex!--; this.switchTab('party'); });
        this.contentContainer.add(prevBtn);
      }
      if (this.partyDetailIndex < gameState.party.length - 1) {
        const nextBtn = this.add.text(14, 56, '▼ Next', {
          fontSize: '11px', fontFamily: 'monospace', color: '#a0c0e0',
          backgroundColor: '#0e1830', padding: { x: 4, y: 2 },
        }).setInteractive({ useHandCursor: true });
        nextBtn.on('pointerdown', () => { this.partyDetailIndex!++; this.switchTab('party'); });
        this.contentContainer.add(nextBtn);
      }

      this.renderPartyDetail(creature, 30);
      return;
    }

    // ── List view ─────────────────────────────────────────────────────────────
    const SLOT_H = 46;
    const listTop = 34;
    const listH   = panelH - listTop - 16;
    const totalH  = gameState.party.length * SLOT_H;

    // ── Title ─────────────────────────────────────────────────────────────────
    this.contentContainer.add(this.add.text(260, 10,
      `Your Creatures  (${gameState.party.length}/6)`, {
      fontSize: '15px', fontFamily: 'monospace', color: '#80d0ff',
    }).setOrigin(0.5));

    // ── Scrollable, clipped rows — built once, no visibility filtering needed ──
    const slotContainer = this.createScrollArea(listTop, listH, totalH, { rowStep: SLOT_H });
    gameState.party.forEach((creature, i) => {
      this.renderPartySlot(creature, i, i * SLOT_H, slotContainer, () => {});
    });
  }

  private renderPartySlot(
    creature: ActiveCreature, index: number, y: number,
    container: Phaser.GameObjects.Container,
    onReorder: () => void,
    showButtons = true,
  ) {
    const data = getCreatureById(creature.dataId)!;
    const isSelected = index === this.selectedPartyIndex;
    const typeColor  = TYPE_COLORS[data.type[0]] ?? 0x808080;
    const isFainted  = creature.currentHp <= 0;

    const slotBg = this.add.graphics();
    slotBg.fillStyle(isSelected ? 0x1e3a5e : isFainted ? 0x1a0808 : 0x0e1e3a)
          .fillRoundedRect(10, y + 2, 468, 42, 5);
    slotBg.lineStyle(2, isSelected ? 0xffd700 : typeColor, isSelected ? 1 : 0.35)
          .strokeRoundedRect(10, y + 2, 468, 42, 5);
    container.add(slotBg);

    container.add(fitImageToBox(this.add.image(36, y + 23, `creature_${creature.dataId}`), 30));
    container.add(this.add.text(60, y + 6, creature.nickname ?? data.name, {
      fontSize: '13px', fontFamily: 'monospace', color: isFainted ? '#605060' : '#ffffff',
    }));
    container.add(this.add.text(60, y + 22, `Lv.${creature.level}`, {
      fontSize: '10px', fontFamily: 'monospace', color: '#8090a0',
    }));
    container.add(this.add.text(105, y + 22, data.type[0], {
      fontSize: '9px', fontFamily: 'monospace', color: '#fff',
      backgroundColor: '#' + (TYPE_COLORS[data.type[0]] ?? 0x808080).toString(16).padStart(6, '0'),
      padding: { x: 3, y: 1 },
    }));

    const hpRatio = isFainted ? 0 : creature.currentHp / creature.maxHp;
    const hpColor = isFainted ? 0x504050 : hpRatio > 0.5 ? 0x30c030 : hpRatio > 0.2 ? 0xf0c020 : 0xe02020;
    const hpBg = this.add.graphics();
    hpBg.fillStyle(0x202040).fillRoundedRect(200, y + 14, 160, 7, 2);
    hpBg.fillStyle(hpColor).fillRoundedRect(200, y + 14, Math.floor(160 * hpRatio), 7, 2);
    container.add(hpBg);
    container.add(this.add.text(366, y + 11,
      isFainted ? 'FAINTED' : `${creature.currentHp}/${creature.maxHp}`, {
      fontSize: '10px', fontFamily: 'monospace', color: isFainted ? '#804060' : '#a0c0e0',
    }));

    // Reorder buttons — only when row is fully in view
    if (showButtons && index > 0) {
      const upBtn = this.add.text(452, y + 3, '▲', {
        fontSize: '11px', fontFamily: 'monospace', color: '#ffd700',
        backgroundColor: '#102030', padding: { x: 3, y: 1 },
      }).setInteractive({ useHandCursor: true });
      upBtn.on('pointerdown', () => {
        [gameState.party[index], gameState.party[index - 1]] = [gameState.party[index - 1], gameState.party[index]];
        if (this.selectedPartyIndex === index) this.selectedPartyIndex--;
        else if (this.selectedPartyIndex === index - 1) this.selectedPartyIndex++;
        onReorder(); this.switchTab('party');
      });
      container.add(upBtn);
    }
    if (showButtons && index < gameState.party.length - 1) {
      const downBtn = this.add.text(452, y + 26, '▼', {
        fontSize: '11px', fontFamily: 'monospace', color: '#ffd700',
        backgroundColor: '#102030', padding: { x: 3, y: 1 },
      }).setInteractive({ useHandCursor: true });
      downBtn.on('pointerdown', () => {
        [gameState.party[index], gameState.party[index + 1]] = [gameState.party[index + 1], gameState.party[index]];
        if (this.selectedPartyIndex === index) this.selectedPartyIndex++;
        else if (this.selectedPartyIndex === index + 1) this.selectedPartyIndex--;
        onReorder(); this.switchTab('party');
      });
      container.add(downBtn);
    }

    // Main click → show detail page
    const hit = this.add.rectangle(230, y + 23, 430, 42, 0, 0).setInteractive({ useHandCursor: true });
    hit.on('pointerdown', () => {
      this.selectedPartyIndex = index;
      this.partyDetailIndex   = index;
      this.switchTab('party');
    });
    container.add(hit);
  }

  private renderPartyDetail(creature: ActiveCreature, y: number) {
    const data = getCreatureById(creature.dataId)!;
    const typeColor = TYPE_COLORS[data.type[0]] ?? 0x808080;
    const panelW = 498;

    // Detail panel background
    const detailBg = this.add.graphics();
    detailBg.fillStyle(0x0b1828).fillRoundedRect(10, y, panelW, 234, 8);
    detailBg.lineStyle(2, typeColor, 0.5).strokeRoundedRect(10, y, panelW, 234, 8);
    this.contentContainer.add(detailBg);

    // Creature name header
    this.contentContainer.add(this.add.text(22, y + 8, `${creature.nickname ?? data.name}`, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffd700', fontStyle: 'bold',
    }));
    data.type.forEach((t, ti) => {
      const tc = TYPE_COLORS[t] ?? 0x808080;
      this.contentContainer.add(this.add.text(160 + ti * 72, y + 10, t, {
        fontSize: '10px', fontFamily: 'monospace', color: '#ffffff',
        backgroundColor: '#' + tc.toString(16).padStart(6, '0'), padding: { x: 5, y: 2 },
      }));
    });

    // EXP bar
    const expRatio = creature.expToNext > 0 ? Math.min(1, creature.exp / creature.expToNext) : 0;
    this.contentContainer.add(this.add.text(22, y + 28, 'EXP', {
      fontSize: '10px', fontFamily: 'monospace', color: '#5080a0',
    }));
    const expBg = this.add.graphics();
    expBg.fillStyle(0x202040).fillRoundedRect(52, y + 30, 200, 6, 2);
    expBg.fillStyle(0x4060e0).fillRoundedRect(52, y + 30, Math.floor(200 * expRatio), 6, 2);
    this.contentContainer.add(expBg);
    this.contentContainer.add(this.add.text(260, y + 27, `${creature.exp}/${creature.expToNext}`, {
      fontSize: '10px', fontFamily: 'monospace', color: '#405080',
    }));

    // ── Ability ──────────────────────────────────────────────────────────────────
    const [abilityName, abilityDesc] = data.ability.split('—').map(s => s.trim());
    this.contentContainer.add(this.add.text(22, y + 40, 'Ability:', {
      fontSize: '10px', fontFamily: 'monospace', color: '#5080a0',
    }));
    this.contentContainer.add(this.add.text(70, y + 40, abilityName, {
      fontSize: '10px', fontFamily: 'monospace', color: '#ffd700',
    }));
    if (abilityDesc) {
      this.contentContainer.add(this.add.text(22, y + 54, abilityDesc, {
        fontSize: '9px', fontFamily: 'monospace', color: '#8090a0',
      }));
    }

    // ── Stats block ─────────────────────────────────────────────────────────────
    const stats: Array<[string, number, number]> = [
      ['HP',    creature.maxHp,        220],
      ['ATK',   creature.stats.atk,    110],
      ['DEF',   creature.stats.def,    110],
      ['SpATK', creature.stats.spatk,  110],
      ['SpDEF', creature.stats.spdef,  110],
      ['SPD',   creature.stats.spd,    110],
    ];
    const maxStatVal = 220; // rough cap for bar scaling
    const statTop = y + 68;
    const COL = 3;
    stats.forEach(([label, val, _cap], si) => {
      const col = si % COL;
      const row = Math.floor(si / COL);
      const sx = 22 + col * 160;
      const sy = statTop + row * 22;
      const ratio = Math.min(1, val / maxStatVal);
      const barColor = ratio > 0.6 ? 0x30c080 : ratio > 0.35 ? 0xc0c030 : 0xe04040;

      this.contentContainer.add(this.add.text(sx, sy, label, {
        fontSize: '10px', fontFamily: 'monospace', color: '#607090',
      }));
      const statBar = this.add.graphics();
      statBar.fillStyle(0x1a2a3a).fillRoundedRect(sx + 48, sy + 2, 80, 8, 2);
      statBar.fillStyle(barColor).fillRoundedRect(sx + 48, sy + 2, Math.floor(80 * ratio), 8, 2);
      this.contentContainer.add(statBar);
      this.contentContainer.add(this.add.text(sx + 132, sy, `${val}`, {
        fontSize: '10px', fontFamily: 'monospace', color: '#a0c0e0',
      }).setOrigin(1, 0));
    });

    // ── Moves block ─────────────────────────────────────────────────────────────
    const movesTop = statTop + 50;
    const divider = this.add.graphics();
    divider.lineStyle(1, 0x203040).lineBetween(22, movesTop - 4, 498, movesTop - 4);
    this.contentContainer.add(divider);

    this.contentContainer.add(this.add.text(22, movesTop, 'MOVES', {
      fontSize: '10px', fontFamily: 'monospace', color: '#405060',
    }));

    creature.moves.forEach((ms, mi) => {
      const move = getMoveById(ms.moveId);
      if (!move) return;
      const col = mi % 2;
      const row = Math.floor(mi / 2);
      const mx = 22 + col * 242;
      const my = movesTop + 16 + row * 38;

      const moveColor = TYPE_COLORS[move.type] ?? 0x808080;
      const moveBg = this.add.graphics();
      moveBg.fillStyle(0x0e1e2e).fillRoundedRect(mx, my, 230, 32, 4);
      moveBg.lineStyle(1, moveColor, 0.5).strokeRoundedRect(mx, my, 230, 32, 4);
      this.contentContainer.add(moveBg);

      // Move name
      this.contentContainer.add(this.add.text(mx + 8, my + 4, move.name, {
        fontSize: '12px', fontFamily: 'monospace',
        color: '#' + moveColor.toString(16).padStart(6, '0'),
      }));

      // Type tag + category
      this.contentContainer.add(this.add.text(mx + 8, my + 19, `${move.type} · ${move.category}`, {
        fontSize: '9px', fontFamily: 'monospace', color: '#506070',
      }));

      // Power
      const powerStr = move.power ? `PWR ${move.power}` : '—';
      this.contentContainer.add(this.add.text(mx + 148, my + 4, powerStr, {
        fontSize: '10px', fontFamily: 'monospace', color: '#8090a0',
      }));

      // PP bar
      const ppRatio = ms.maxPp > 0 ? ms.pp / ms.maxPp : 0;
      const ppColor = ppRatio > 0.5 ? '#40c040' : ppRatio > 0.2 ? '#c0c020' : '#e04040';
      this.contentContainer.add(this.add.text(mx + 148, my + 18, `PP ${ms.pp}/${ms.maxPp}`, {
        fontSize: '10px', fontFamily: 'monospace', color: ppColor,
      }));
    });

    if (creature.moves.length === 0) {
      this.contentContainer.add(this.add.text(260, movesTop + 30, 'No moves!', {
        fontSize: '13px', fontFamily: 'monospace', color: '#404050',
      }).setOrigin(0.5));
    }
  }

  private renderBag() {
    const H = this.scale.height;
    const panelH = H - 220;
    const bg = this.add.graphics();
    bg.fillStyle(0x0a1220, 0.5).fillRoundedRect(4, 0, 512, panelH, 8);
    this.contentContainer.add(bg);

    // ── Target picker page ────────────────────────────────────────────────────
    if (this.bagPendingItemId !== null) {
      const item = getItemById(this.bagPendingItemId);
      const invEntry = gameState.inventory.find(i => i.id === this.bagPendingItemId);
      const ROW_H = 46;
      const listTop = 50;
      const listH = panelH - listTop - 30;
      const totalH = gameState.party.length * ROW_H;

      // Header (always visible, outside the scroll area)
      const backBtn = this.add.text(14, 10, '◀ Items', {
        fontSize: '13px', fontFamily: 'monospace', color: '#80d0ff',
        backgroundColor: '#0e1e3a', padding: { x: 6, y: 4 },
      }).setInteractive({ useHandCursor: true });
      backBtn.on('pointerdown', () => { this.bagPendingItemId = null; this.switchTab('bag'); });
      this.contentContainer.add(backBtn);

      this.contentContainer.add(this.add.text(260, 12, `Use: ${item?.name ?? '?'}`, {
        fontSize: '15px', fontFamily: 'monospace', color: '#ffd700',
      }).setOrigin(0.5));
      this.contentContainer.add(this.add.text(260, 30, `Qty: ${invEntry?.quantity ?? 0}`, {
        fontSize: '11px', fontFamily: 'monospace', color: '#607080',
      }).setOrigin(0.5));

      const feedbackTxt = this.add.text(260, panelH - 8, '', {
        fontSize: '13px', fontFamily: 'monospace', color: '#40ff80',
      }).setOrigin(0.5, 1);
      this.contentContainer.add(feedbackTxt);

      const showFeedback = (msg: string, col = '#40ff80') => {
        feedbackTxt.setText(msg).setColor(col);
        this.time.delayedCall(1200, () => {
          // Don't yank the player back to Bag if they've already navigated
          // to a different tab (or closed the menu) in the meantime.
          if (this.activeTab !== 'bag') return;
          this.bagPendingItemId = null;
          this.switchTab('bag');
        });
      };

      // ── Scrollable, clipped party rows — built once ────────────────────────
      const rowContainer = this.createScrollArea(listTop, listH, totalH, { rowStep: ROW_H });
      gameState.party.forEach((creature, ci) => {
        const data = getCreatureById(creature.dataId);
        if (!data) return;
        const rowY = ci * ROW_H;

        const hpRatio = creature.currentHp / creature.maxHp;
        const hpColor = hpRatio > 0.5 ? '#30c030' : hpRatio > 0.2 ? '#f0c020' : '#e02020';

        const rowBg = this.add.graphics();
        rowBg.fillStyle(0x0e1e3a).fillRoundedRect(10, rowY, 498, ROW_H - 4, 5);
        rowBg.lineStyle(1, 0x253550).strokeRoundedRect(10, rowY, 498, ROW_H - 4, 5);
        rowContainer.add(rowBg);
        rowContainer.add(fitImageToBox(this.add.image(36, rowY + 20, `creature_${creature.dataId}`), 28));
        rowContainer.add(this.add.text(58, rowY + 5, `${data.name} Lv.${creature.level}`, {
          fontSize: '13px', fontFamily: 'monospace', color: '#c0e0ff',
        }));
        rowContainer.add(this.add.text(200, rowY + 5, `${creature.currentHp}/${creature.maxHp} HP`, {
          fontSize: '12px', fontFamily: 'monospace', color: hpColor,
        }));

        const applyBtn = this.add.text(500, rowY + 12, '▶ USE', {
          fontSize: '12px', fontFamily: 'monospace', color: '#80ff80',
          backgroundColor: '#103010', padding: { x: 5, y: 3 },
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        applyBtn.on('pointerover', () => applyBtn.setStyle({ backgroundColor: '#1a4a1a' }));
        applyBtn.on('pointerout',  () => applyBtn.setStyle({ backgroundColor: '#103010' }));
        applyBtn.on('pointerdown', () => {
          if (!item || !invEntry || invEntry.quantity <= 0) { showFeedback('None left!', '#ff4040'); return; }
          let used = false;
          if (item.type === 'heal') {
            if (creature.currentHp <= 0) { showFeedback("Can't heal a fainted creature!", '#ff4040'); return; }
            if (creature.currentHp >= creature.maxHp) { showFeedback(`${data.name} is already full HP!`, '#ffa040'); return; }
            if (item.healAmount)  creature.currentHp = Math.min(creature.maxHp, creature.currentHp + item.healAmount);
            if (item.healPercent) creature.currentHp = Math.min(creature.maxHp, Math.floor(creature.maxHp * item.healPercent / 100));
            used = true;
          } else if (item.type === 'status_cure') {
            if (!creature.status) { showFeedback(`${data.name} has no status!`, '#ffa040'); return; }
            if (!item.curesStatus?.includes(creature.status)) { showFeedback(`Doesn't cure ${creature.status}!`, '#ffa040'); return; }
            creature.status = null;
            creature.statusTurns = undefined;
            used = true;
          } else if (item.type === 'xp_boost' && item.xpAmount) {
            const { leveled } = applyExpGain(creature, item.xpAmount);
            if (leveled) {
              const newMoveIds = learnNewMoves(creature);
              newMoveIds.forEach(moveId => {
                const mv = getMoveById(moveId);
                if (!mv) return;
                if (creature.moves.length < 4) creature.moves.push({ moveId, pp: mv.pp, maxPp: mv.pp });
                else { creature.moves.shift(); creature.moves.push({ moveId, pp: mv.pp, maxPp: mv.pp }); }
              });
              const evolveId = checkEvolution(creature);
              if (evolveId) {
                const newData = getCreatureById(evolveId)!;
                const oldName = data.name;
                const newLevel = creature.level;
                this.showConfirmModal(
                  `${oldName} is trying to evolve into ${newData.name}!\nAllow it?`,
                  () => {
                    creature.dataId = evolveId;
                    gameState.seenCreatures.add(evolveId);
                    gameState.caughtCreatures.add(evolveId);
                    gameState.useItem(this.bagPendingItemId!);
                    showFeedback(`${oldName} grew to Lv.${newLevel} and evolved into ${newData.name}!`, '#80ffff');
                  },
                  () => {
                    // Declined — stays as-is. checkEvolution() runs again the
                    // next time it levels up, so this will simply be asked again then.
                    gameState.useItem(this.bagPendingItemId!);
                    showFeedback(`${oldName} grew to Lv.${newLevel}! (Evolution declined)`, '#80ffff');
                  },
                );
                used = true;
                return; // modal callbacks handle useItem()/feedback themselves
              } else {
                showFeedback(`${data.name} gained ${item.xpAmount} EXP and grew to Lv.${creature.level}!`, '#80ffff');
              }
            } else {
              showFeedback(`${data.name} gained ${item.xpAmount} EXP!`, '#80ffff');
            }
            used = true;
          }
          if (used && item.type !== 'xp_boost') {
            gameState.useItem(this.bagPendingItemId!);
            showFeedback(`Used on ${data.name}! (${creature.currentHp}/${creature.maxHp} HP)`, '#40ff80');
          } else if (used) {
            gameState.useItem(this.bagPendingItemId!);
          }
        });
        rowContainer.add(applyBtn);
      });
      return;
    }

    // ── Item list page ────────────────────────────────────────────────────────
    const ROW_H = 56;
    const listTop = 34;
    const listH = panelH - listTop - 10;
    const totalH = gameState.inventory.length * ROW_H;

    this.contentContainer.add(this.add.text(260, 10, 'Items', {
      fontSize: '16px', fontFamily: 'monospace', color: '#80d0ff',
    }).setOrigin(0.5));
    this.contentContainer.add(this.add.text(490, 10, `¢${gameState.money}`, {
      fontSize: '13px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(1, 0));

    if (gameState.inventory.length === 0) {
      this.contentContainer.add(this.add.text(260, panelH / 2, 'Bag is empty!', {
        fontSize: '16px', fontFamily: 'monospace', color: '#606080',
      }).setOrigin(0.5));
      return;
    }

    // ── Scrollable, clipped item rows — built once ─────────────────────────
    const rowContainer = this.createScrollArea(listTop, listH, totalH, { rowStep: ROW_H });
    gameState.inventory.forEach((inv, idx) => {
      const item = getItemById(inv.id);
      if (!item) return;
      const rowY = idx * ROW_H;

      const row = this.add.graphics();
      row.fillStyle(0x0e1e3a).fillRoundedRect(10, rowY, 498, ROW_H - 4, 6);
      row.lineStyle(1, 0x304060).strokeRoundedRect(10, rowY, 498, ROW_H - 4, 6);
      rowContainer.add(row);
      rowContainer.add(this.add.text(22, rowY + 6, item.name, {
        fontSize: '14px', fontFamily: 'monospace', color: '#c0e0ff',
      }));
      rowContainer.add(this.add.text(22, rowY + 25, item.description, {
        fontSize: '10px', fontFamily: 'monospace', color: '#607090',
      }));
      rowContainer.add(this.add.text(380, rowY + 13, `× ${inv.quantity}`, {
        fontSize: '14px', fontFamily: 'monospace', color: '#ffd700',
      }));

      const isUsable = item.type === 'heal' || item.type === 'status_cure' || item.type === 'xp_boost';
      const isDirectUse = item.type === 'repel';
      if ((isUsable || isDirectUse) && inv.quantity > 0) {
        const useBtn = this.add.text(500, rowY + 13, 'USE', {
          fontSize: '13px', fontFamily: 'monospace', color: '#ffffff',
          backgroundColor: '#204020', padding: { x: 7, y: 3 },
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
        useBtn.on('pointerover', () => useBtn.setStyle({ backgroundColor: '#306030' }));
        useBtn.on('pointerout',  () => useBtn.setStyle({ backgroundColor: '#204020' }));
        useBtn.on('pointerdown', () => {
          if (isDirectUse) {
            if (item.repelSteps) gameState.repelSteps = Math.max(gameState.repelSteps, item.repelSteps);
            gameState.useItem(item.id);
            this.switchTab('bag');
            // Brief toast added directly to the scene (not contentContainer,
            // which switchTab just cleared), so it survives the tab refresh.
            const toast = this.add.text(260, 4, `Used ${item.name}! Wild creatures will avoid you.`, {
              fontSize: '12px', fontFamily: 'monospace', color: '#40ff80',
              backgroundColor: '#0e1e3a', padding: { x: 8, y: 4 },
            }).setOrigin(0.5, 0).setDepth(1000);
            this.time.delayedCall(1400, () => toast.destroy());
            return;
          }
          this.bagPendingItemId = item.id; this.switchTab('bag');
        });
        rowContainer.add(useBtn);
      }
    });
  }

  private readonly DEX_ROW_H = 44;
  private readonly DEX_VISIBLE_ROWS = 7;

  private renderDex() {
    const H = this.scale.height;
    const panelH = H - 220;
    const bg = this.add.graphics();
    bg.fillStyle(0x0a1220, 0.5).fillRoundedRect(4, 0, 512, panelH, 8);
    this.contentContainer.add(bg);

    // Header
    const allIds      = Array.from({ length: CREATURES.length }, (_, i) => i + 1);
    const seenCount   = allIds.filter(id =>
      gameState.seenCreatures.has(id) || gameState.caughtCreatures.has(id) ||
      gameState.party.some(c => c.dataId === id) || gameState.storage.some(c => c.dataId === id)
    ).length;
    const caughtCount = allIds.filter(id =>
      gameState.caughtCreatures.has(id) ||
      gameState.party.some(c => c.dataId === id) || gameState.storage.some(c => c.dataId === id)
    ).length;
    this.contentContainer.add(this.add.text(260, 14, `Creature Encyclopedia  Seen: ${seenCount} | Caught: ${caughtCount}`, {
      fontSize: '14px', fontFamily: 'monospace', color: '#80d0ff',
    }).setOrigin(0.5));

    // Scroll hint
    this.contentContainer.add(this.add.text(260, 34, '▲▼ Scroll: Mouse Wheel or ↑↓', {
      fontSize: '10px', fontFamily: 'monospace', color: '#404060',
    }).setOrigin(0.5));

    const listTop  = 48;
    const listH    = panelH - listTop - 12;
    const totalH   = CREATURES.length * this.DEX_ROW_H;

    // ── Scrollable, clipped rows — built once ──────────────────────────────
    const rowContainer = this.createScrollArea(listTop, listH, totalH, {
      scrollbarX: 498, scrollbarW: 10, rowStep: this.DEX_ROW_H,
    });
    for (let id = 1; id <= CREATURES.length; id++) {
      const ry = (id - 1) * this.DEX_ROW_H;

      const inParty   = gameState.party.some(c => c.dataId === id);
      const inStorage = gameState.storage.some(c => c.dataId === id);
      const isCaught  = gameState.caughtCreatures.has(id) || inParty || inStorage;
      const isSeen    = gameState.seenCreatures.has(id) || isCaught;
      const data      = getCreatureById(id)!;

      const row = this.add.graphics();
      row.fillStyle(isCaught ? 0x0e2a1e : isSeen ? 0x0e1e2a : 0x0e0e18)
         .fillRoundedRect(10, ry, 498, 38, 5);
      row.lineStyle(1, isCaught ? 0x30c060 : isSeen ? 0x304060 : 0x202030)
         .strokeRoundedRect(10, ry, 498, 38, 5);
      rowContainer.add(row);

      rowContainer.add(this.add.text(24, ry + 10,
        `#${id.toString().padStart(3, '0')}`, {
        fontSize: '12px', fontFamily: 'monospace', color: '#607090',
      }));

      if (isSeen || isCaught) {
        const sprite = fitImageToBox(this.add.image(65, ry + 19, `creature_${id}`), 28);
        const nameTxt = this.add.text(90, ry + 8, data.name, {
          fontSize: '14px', fontFamily: 'monospace', color: isCaught ? '#80ff80' : '#c0e0ff',
        });
        const typeTxt = this.add.text(90, ry + 25, data.type.join(' / '), {
          fontSize: '10px', fontFamily: 'monospace', color: '#607090',
        });
        const statusTxt = this.add.text(480, ry + 14, isCaught ? '✓' : '👁', {
          fontSize: '18px', fontFamily: 'monospace', color: isCaught ? '#40ff40' : '#8080ff',
        }).setOrigin(1, 0.5);
        rowContainer.add([sprite, nameTxt, typeTxt, statusTxt]);
      } else {
        rowContainer.add(this.add.text(90, ry + 12, '???', {
          fontSize: '14px', fontFamily: 'monospace', color: '#303050',
        }));
      }
    }
  }

private renderStorage() {
    const H = this.scale.height;
    const panelH = H - 220;

    const bg = this.add.graphics();
    bg.fillStyle(0x0a1220, 0.5).fillRoundedRect(4, 0, 512, panelH, 8);
    this.contentContainer.add(bg);

    const storageCount = gameState.storage.length;
    const partyCount   = gameState.party.length;

    if (storageCount === 0) {
      this.contentContainer.add(this.add.text(260, 14, `📦 Storage Box  (0 creatures)`, {
        fontSize: '15px', fontFamily: 'monospace', color: '#80d0ff',
      }).setOrigin(0.5));
      this.contentContainer.add(this.add.text(260, panelH / 2, 'Box is empty!\nOverflow creatures appear here\nwhen your party is full.', {
        fontSize: '14px', fontFamily: 'monospace', color: '#505070', align: 'center',
      }).setOrigin(0.5));
      return;
    }

    // ── Layout: header, scrollable list, footer (selected-slot line) ──────────
    const ROW_H    = 56;
    const listTop  = 48;
    const footerH  = 20;
    const listH    = panelH - listTop - footerH;
    const totalH   = ROW_H * storageCount;

    this.contentContainer.add(this.add.text(260, 14,
      `📦 Storage Box  (${storageCount} creature${storageCount !== 1 ? 's' : ''})`, {
      fontSize: '15px', fontFamily: 'monospace', color: '#80d0ff',
    }).setOrigin(0.5));
    this.contentContainer.add(this.add.text(260, 34,
      'Click ⇄ to move to party (party must have space, or swaps with selected)', {
      fontSize: '9px', fontFamily: 'monospace', color: '#404060',
    }).setOrigin(0.5));

    // ── Scrollable, clipped rows — built once ──────────────────────────────
    const rowContainer = this.createScrollArea(listTop, listH, totalH, {
      scrollbarX: 498, scrollbarW: 10, rowStep: ROW_H,
    });
    gameState.storage.forEach((creature, storageIdx) => {
      const data = getCreatureById(creature.dataId);
      if (!data) return;
      const ry = storageIdx * ROW_H;

      const typeColor = TYPE_COLORS[data.type[0]] ?? 0x808080;

      const rowBg = this.add.graphics();
      rowBg.fillStyle(0x0e1e3a).fillRoundedRect(10, ry, 490, ROW_H - 4, 6);
      rowBg.lineStyle(1, typeColor, 0.4).strokeRoundedRect(10, ry, 490, ROW_H - 4, 6);
      rowContainer.add(rowBg);

      rowContainer.add(
        fitImageToBox(this.add.image(46, ry + (ROW_H - 4) / 2, `creature_${creature.dataId}`), 38),
      );
      rowContainer.add(this.add.text(76, ry + 7, `${creature.nickname ?? data.name}  Lv.${creature.level}`, {
        fontSize: '14px', fontFamily: 'monospace', color: '#ffffff',
      }));

      data.type.forEach((t, ti) => {
        const tc = TYPE_COLORS[t] ?? 0x808080;
        rowContainer.add(this.add.text(76 + ti * 68, ry + 26, t, {
          fontSize: '10px', fontFamily: 'monospace', color: '#ffffff',
          backgroundColor: '#' + tc.toString(16).padStart(6, '0'), padding: { x: 5, y: 2 },
        }));
      });

      const hpRatio = creature.currentHp / creature.maxHp;
      const hpColor = hpRatio > 0.5 ? 0x30c030 : hpRatio > 0.2 ? 0xf0c020 : 0xe02020;
      const hpBar = this.add.graphics();
      hpBar.fillStyle(0x303050).fillRoundedRect(76, ry + 40, 200, 8, 3);
      hpBar.fillStyle(hpColor).fillRoundedRect(76, ry + 40, Math.max(0, Math.floor(200 * hpRatio)), 8, 3);
      rowContainer.add(hpBar);
      rowContainer.add(this.add.text(282, ry + 37, `${creature.currentHp}/${creature.maxHp}`, {
        fontSize: '10px', fontFamily: 'monospace', color: '#607090',
      }));

      const canAddToParty = partyCount < 6;
      const btnLabel = canAddToParty ? '⇄ TO PARTY' : `⇄ SWAP [${this.selectedPartyIndex + 1}]`;
      const swapBtn = this.add.text(492, ry + (ROW_H - 4) / 2, btnLabel, {
        fontSize: '11px', fontFamily: 'monospace', color: '#ffd700',
        backgroundColor: '#1a3a1a', padding: { x: 6, y: 4 },
      }).setOrigin(1, 0.5).setInteractive({ useHandCursor: true });

      swapBtn.on('pointerover', () => swapBtn.setStyle({ backgroundColor: '#2a5a2a' }));
      swapBtn.on('pointerout',  () => swapBtn.setStyle({ backgroundColor: '#1a3a1a' }));
      swapBtn.on('pointerdown', () => {
        if (canAddToParty) {
          gameState.party.push(creature);
          gameState.storage.splice(storageIdx, 1);
        } else {
          const idx = Phaser.Math.Clamp(this.selectedPartyIndex, 0, gameState.party.length - 1);
          const partyCreature = gameState.party[idx];
          gameState.party[idx] = creature;
          gameState.storage[storageIdx] = partyCreature;
        }
        this.switchTab('storage');
      });
      rowContainer.add(swapBtn);
    });

    // ── Footer — selected party slot, always visible, outside the scroll area ─
    if (gameState.party.length > 0) {
      const sel = gameState.party[Phaser.Math.Clamp(this.selectedPartyIndex, 0, gameState.party.length - 1)];
      const selData = getCreatureById(sel.dataId);
      this.contentContainer.add(this.add.text(14, panelH - 4,
        `Selected party slot [${this.selectedPartyIndex + 1}]: ${selData?.name ?? '?'} Lv.${sel.level}  (change in PARTY tab)`, {
        fontSize: '10px', fontFamily: 'monospace', color: '#506070',
      }).setOrigin(0, 1));
    }
  }

 private renderSave() {
    const panelH = this.scale.height - 220;
    const bg = this.add.graphics();
    bg.fillStyle(0x0a1220, 0.5).fillRoundedRect(4, 0, 512, panelH, 8);
    this.contentContainer.add(bg);

    // ── Title ───────────────────────────────────────────────────────────────
    const titleY = panelH * 0.06;
    this.contentContainer.add(this.add.text(260, titleY, 'Save Game', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5));

    // ── Info block ────────────────────────────────────────────────────────
    const info = [
      `Trainer: ${gameState.playerName}`,
      `Location: ${MAPS[gameState.mapId]?.name ?? gameState.mapId}`,
      `Creatures: ${gameState.caughtCreatures.size}/${CREATURES.length} caught`,
      `Seen: ${gameState.seenCreatures.size}/${CREATURES.length}`,
      `Party: ${gameState.party.length}/6`,
      `Money: ¢${gameState.money}`,
    ];

    const lineH = 24;
    const infoPadTop = 14;
    const infoPadBottom = 14;
    const infoBoxY = titleY + 30;
    const infoBoxH = infoPadTop + info.length * lineH + infoPadBottom;

    const infoBg = this.add.graphics();
    infoBg.fillStyle(0x0e1e3a).fillRoundedRect(16, infoBoxY, 486, infoBoxH, 8);
    this.contentContainer.add(infoBg);

    info.forEach((line, i) => {
      this.contentContainer.add(this.add.text(30, infoBoxY + infoPadTop + i * lineH, line, {
        fontSize: '15px', fontFamily: 'monospace', color: '#c0d0e0',
      }));
    });

    // ── Footer — anchored to bottom of panel FIRST ──────────────────────────
    const footerY = panelH - 10;
    this.contentContainer.add(this.add.text(260, footerY,
      'Game auto-saves when catching creatures.', {
      fontSize: '12px', fontFamily: 'monospace', color: '#506070', align: 'center',
    }).setOrigin(0.5, 1));

    // ── Save button — positioned relative to footer, not info box ──────────
    // Reserve space: footer text height (~14px) + gap (20px) + button height (~42px)
    const footerReserve = 14 + 20;
    const saveBtnY = footerY - footerReserve - 21; // 21 ≈ half button height, since origin is 0.5
    const saveBtn = this.add.text(260, saveBtnY, '[ SAVE GAME ]', {
      fontSize: '22px', fontFamily: 'monospace', color: '#ffd700',
      backgroundColor: '#1a3a1a', padding: { x: 20, y: 10 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    saveBtn.on('pointerover', () => saveBtn.setColor('#ffffff'));
    saveBtn.on('pointerout', () => saveBtn.setColor('#ffd700'));
    saveBtn.on('pointerdown', () => {
      gameState.save();
      saveBtn.setText('✓ SAVED!').setColor('#40ff40');
      this.time.delayedCall(2000, () => {
        // The player may have switched tabs or closed the menu in the
        // meantime, which destroys saveBtn (contentContainer.removeAll(true)
        // in switchTab()/shutdown()). Touching a destroyed GameObject here
        // throws, so bail out if it's gone.
        if (!saveBtn.active) return;
        saveBtn.setText('[ SAVE GAME ]').setColor('#ffd700');
      });
    });
    this.contentContainer.add(saveBtn);
  }

  private closeMenu() {
    this.scene.stop('Menu');
    if (this.config?.onClose) this.config.onClose();
  }

  /**
   * Phaser calls this whenever the scene stops, regardless of how (Close
   * button, Esc, or anything else). Without this, closing the menu while a
   * scroll camera was active (e.g. mid-scroll in the Dex) would leave that
   * camera and its wheel/arrow-key listeners running indefinitely on top of
   * the overworld afterwards.
   */
  shutdown() {
    this.teardownScrollArea();
  }
}

export default MenuScene;