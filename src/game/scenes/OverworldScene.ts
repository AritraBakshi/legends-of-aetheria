import Phaser from 'phaser';
import { gameState } from '../GameState';
import { MAPS, TILE, TILE_SIZE, TILE_SOLID } from '../data/maps';
import type { MapData, NPC } from '../data/types';
import { createActiveCreature } from '../systems/BattleSystem';
import { getCreatureById, CREATURES } from '../data/creatures';
import { getItemById } from '../data/items';
import { getMoveById } from '../data/moves';

const MOVE_DURATION = 160;
const TILE_TEXTURES: Record<number, string> = {
  [TILE.GRASS]: 'tile_grass', [TILE.PATH]: 'tile_path', [TILE.TALL_GRASS]: 'tile_tallgrass',
  [TILE.TREE]: 'tile_tree', [TILE.WATER]: 'tile_water', [TILE.WALL]: 'tile_wall',
  [TILE.FLOOR]: 'tile_floor', [TILE.ROOF]: 'tile_roof', [TILE.FLOWER]: 'tile_flower',
  [TILE.DOOR]: 'tile_door', [TILE.SIGN]: 'tile_sign',
};

export class OverworldScene extends Phaser.Scene {
  private mapData!: MapData;
  private tileLayer!: Phaser.GameObjects.Container;
  private playerSprite!: Phaser.GameObjects.Image;
  private playerShadow!: Phaser.GameObjects.Image;
  private isMoving = false;
  private playerDir: 'up' | 'down' | 'left' | 'right' = 'down';
  private walkFrame = 0;
  private walkTimer = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key; left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };
  private dayNightOverlay!: Phaser.GameObjects.Rectangle;
  private timeText!: Phaser.GameObjects.Text;
  private locationTimer = 0;
  public isInBattle = false;
  private dialogueActive = false;
  private npcObjects: { npc: NPC; sprite: Phaser.GameObjects.Graphics }[] = [];
  private moneyText!: Phaser.GameObjects.Text;
  private encounterMeter!: Phaser.GameObjects.Graphics;

  constructor() { super('Overworld'); }

  init() {
    this.isInBattle = false;
    this.dialogueActive = false;
    this.isMoving = false;
    
  }

  create() {
    this.mapData = MAPS[gameState.mapId] ?? MAPS.oakwind;
    this.buildMap();
    this.createPlayer();
    this.createNPCs();
    this.createHUD();
    this.setupCamera();
    this.setupInput();
    this.createDayNightOverlay();
    this.showLocationBanner();

    // One-time map tip
    const mapFlag = `visited_${this.mapData.id}`;
    if (!gameState.getFlag(mapFlag)) {
      gameState.setFlag(mapFlag);
      this.time.delayedCall(600, () => this.showMapTip());
    }

    // First-time "go see Rowan" hint (new game, no party)
    if (gameState.party.length === 0 && !gameState.getFlag('sawRowanHint')) {
      gameState.setFlag('sawRowanHint');
      this.time.delayedCall(900, () => {
        this.showDialogue(
          ['Welcome to Oakwind Village!', 'Head to Professor Rowan\'s Lab (north-west building) to get your first creature!'],
          'Tutorial',
        );
      });
    }
  }

  // ─── MAP ──────────────────────────────────────────────────────────────────────
  private buildMap() {
    const { width, height, tiles } = this.mapData;
    this.tileLayer = this.add.container(0, 0);
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const tileId = tiles[row][col];
        const texKey = TILE_TEXTURES[tileId] ?? 'tile_grass';
        this.tileLayer.add(
          this.add.image(col * TILE_SIZE + TILE_SIZE / 2, row * TILE_SIZE + TILE_SIZE / 2, texKey),
        );
      }
    }
  }

  private createPlayer() {
    const px = gameState.playerX * TILE_SIZE + TILE_SIZE / 2;
    const py = gameState.playerY * TILE_SIZE + TILE_SIZE / 2;
    this.playerShadow = this.add.image(px, py + 10, 'player_shadow').setAlpha(0.4).setDepth(9);
    this.playerSprite = this.add.image(px, py, `player_${this.playerDir}_0`).setDepth(10);
  }

  private createNPCs() {
    this.npcObjects = [];
    this.mapData.npcs.forEach(npc => {
      const nx = npc.x * TILE_SIZE + TILE_SIZE / 2;
      const ny = npc.y * TILE_SIZE + TILE_SIZE / 2;

      // Pick the right pre-generated texture for this NPC
      const textureKey = this.getNPCTexture(npc);
      const sprite = this.add.image(nx, ny + TILE_SIZE / 2, textureKey).setDepth(9).setOrigin(0.5, 1);

      // Flip trainers to face the player direction
      if (npc.direction === 'left') sprite.setFlipX(true);

      // Idle bob tween — each NPC bobs at slightly different speed for life
      const bobOffset = (npc.x * 13 + npc.y * 7) % 600; // stagger phase
      this.tweens.add({
        targets: sprite,
        y: ny + TILE_SIZE / 2 - 3,
        duration: 900 + bobOffset,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: bobOffset,
      });

      // Trainer "ready to battle" glow for unbeaten trainers
      if (npc.isTrainer && !gameState.getFlag(`beaten_${npc.id}`)) {
        const glow = this.add.graphics().setDepth(8);
        glow.fillStyle(0xff6000, 0.18).fillCircle(nx, ny - 16, 20);
        this.tweens.add({
          targets: glow, alpha: 0.05, duration: 1200, yoyo: true,
          repeat: -1, ease: 'Sine.easeInOut',
        });
      }

      // Name / rematch label
      const rematchCount = npc.isTrainer ? gameState.getCounter(`rematch_${npc.id}`) : 0;
      const labelText = rematchCount > 0 ? `${npc.name} ×${rematchCount}` : npc.name;
      const labelColor = npc.isTrainer
        ? (rematchCount > 0 ? '#ffd080' : '#ff9060')
        : npc.isNurse ? '#ffb0c8'
        : npc.isShop ? '#b0ffa0'
        : '#ffffff';
      this.add.text(nx, ny - 42, labelText, {
        fontSize: '11px', fontFamily: 'monospace', color: labelColor,
        backgroundColor: '#00000088', padding: { x: 3, y: 1 },
      }).setOrigin(0.5, 1).setDepth(20);

      // Store with the sprite as a graphics placeholder (type compat) — use image directly
      this.npcObjects.push({ npc, sprite: this.add.graphics() }); // keep array shape
      // Destroy the placeholder — we already have the image above
      this.npcObjects[this.npcObjects.length - 1].sprite.destroy();
    });
  }

  private getNPCTexture(npc: NPC): string {
    if (npc.isNurse)    return 'npc_nurse';
    if (npc.isShop)     return 'npc_shopkeeper';
    if (npc.name === 'Sign' || npc.id.includes('sign')) return 'npc_sign';
    if (npc.id === 'move_reminder') return 'npc_move_reminder';
    if (npc.id === 'rowan')   return 'npc_rowan';
    if (npc.id === 'mom')     return 'npc_mom';
    if (npc.id === 'assistant') return 'npc_mom';
    if (npc.id === 'trainer1') return 'npc_trainer1';
    if (npc.id === 'trainer2') return 'npc_trainer2';
    if (npc.id === 'trainer3') return 'npc_trainer3';
    if (npc.id === 'npc1')    return 'npc_villager_a';
    if (npc.id === 'npc2')    return 'npc_villager_b';
    if (npc.id === 'npc3')    return 'npc_villager_c';
    return 'npc_villager_a'; // fallback
  }

  // ─── HUD ──────────────────────────────────────────────────────────────────────
  private createHUD() {
    const W = this.scale.width, H = this.scale.height;
    const hudBg = this.add.graphics().setScrollFactor(0).setDepth(100);
    hudBg.fillStyle(0x000000, 0.6).fillRect(0, 0, W, 36);
    this.add.text(10, 18, this.mapData.name, {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);
    this.timeText = this.add.text(W - 10, 18, '00:00', {
      fontSize: '14px', fontFamily: 'monospace', color: '#c0e0ff',
    }).setOrigin(1, 0.5).setScrollFactor(0).setDepth(101);
    this.add.text(W / 2, 18, `♦ ${gameState.party.length}/6`, {
      fontSize: '14px', fontFamily: 'monospace', color: '#80ff80',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

    // Money display — right of party count
    this.moneyText = this.add.text(W / 2 + 50, 18, `¢${gameState.money}`, {
      fontSize: '13px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0, 0.5).setScrollFactor(0).setDepth(101);

    // Encounter proximity meter — only shows on maps with wild encounters
    if (this.mapData.encounters.length > 0) {
      const meterBg = this.add.graphics().setScrollFactor(0).setDepth(100);
      meterBg.fillStyle(0x000000, 0.5).fillRect(10, H - 32, 80, 8);
      this.encounterMeter = this.add.graphics().setScrollFactor(0).setDepth(101);
      this.add.text(10, H - 36, '⚡', {
        fontSize: '10px', fontFamily: 'monospace', color: '#ffd700',
      }).setOrigin(0, 1).setScrollFactor(0).setDepth(101);
    }

    this.add.text(10, H - 10,
      'Move: WASD/Arrows  |  Talk: Z/Enter  |  Menu: ESC', {
      fontSize: '11px', fontFamily: 'monospace', color: '#505060',
    }).setOrigin(0, 1).setScrollFactor(0).setDepth(101);
  }

  private setupCamera() {
    const mapW = this.mapData.width * TILE_SIZE;
    const mapH = this.mapData.height * TILE_SIZE;
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.startFollow(this.playerSprite, true, 0.08, 0.08);
    this.cameras.main.setZoom(this.mapData.isIndoor ? 2 : 1.5);
  }

  private setupInput() {
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up:    this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left:  this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.input.keyboard!.on('keydown-ESC',   () => { if (!this.dialogueActive) this.openMenu(); });
    this.input.keyboard!.on('keydown-ENTER', () => { if (!this.isMoving) this.handleInteractKey(); });
    this.input.keyboard!.on('keydown-Z',     () => { if (!this.isMoving) this.handleInteractKey(); });
  }

  private handleInteractKey() {
    if (this.dialogueActive) return;
    this.tryInteract();
  }

  private createDayNightOverlay() {
    this.dayNightOverlay = this.add.rectangle(0, 0, 9999, 9999, 0x000040, 0)
      .setOrigin(0, 0).setDepth(50).setScrollFactor(0);
  }

  private showLocationBanner() {
    const W = this.scale.width;
    const bg = this.add.graphics().setScrollFactor(0).setDepth(200);
    bg.fillStyle(0x000000, 0.7).fillRoundedRect(W / 2 - 140, 50, 280, 40, 8);
    bg.lineStyle(2, 0xffd700, 0.8).strokeRoundedRect(W / 2 - 140, 50, 280, 40, 8);
    const txt = this.add.text(W / 2, 70, this.mapData.name, {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
    this.tweens.add({ targets: [bg, txt], alpha: 0, duration: 400, delay: 2500, onComplete: () => { bg.destroy(); txt.destroy(); } });
  }

  private showMapTip() {
    const tips: Record<string, string[]> = {
      route1: ['You entered Route 1!', 'Walk through TALL GRASS to find wild creatures.', 'Watch out — trainers on this route will challenge you!'],
      route2: ['Route 2 — Ancient Ruins area', 'Stronger creatures live here. Keep your party healed!', 'Head back to the Pokémon Center in Oakwind to heal for free.'],
      labInterior: ['Professor Rowan\'s Laboratory', 'Talk to Prof. Rowan to receive your starter creature!'],
      pokecenter: ['Pokémon Center', 'Nurse Joy heals your whole team for free!', 'The shopkeeper on the right sells supplies.'],
      playerHouse: ['Home sweet home!', 'Talk to Mom for encouragement.'],
    };
    const lines = tips[this.mapData.id];
    if (lines) this.showDialogue(lines, 'Tip');
  }

  private showDialogue(lines: string[], speaker: string, onComplete?: () => void) {
    if (this.dialogueActive) return;
    this.dialogueActive = true;
    this.scene.launch('Dialogue', {
      lines,
      speakerName: speaker,
      onComplete: () => {
        this.dialogueActive = false;
        onComplete?.();
      },
    });
  }

  // ─── UPDATE LOOP ──────────────────────────────────────────────────────────────
  update(_time: number, delta: number) {
    if (this.isInBattle || this.dialogueActive) return;

    this.locationTimer += delta;
    if (this.locationTimer > 1000) {
      this.locationTimer = 0;
      gameState.updateTime();
      const h = Math.floor(gameState.timeOfDay * 24);
      const m = Math.floor((gameState.timeOfDay * 24 - h) * 60);
      this.timeText?.setText(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      this.dayNightOverlay?.setAlpha(gameState.getTimeAlpha() * 0.6);
    }

    if (!this.isMoving) this.handleMovement();

    this.walkTimer += delta;
    if (this.walkTimer > 200) {
      this.walkTimer = 0;
      this.walkFrame = this.isMoving ? (this.walkFrame + 1) % 3 : 0;
      this.playerSprite?.setTexture(`player_${this.playerDir}_${this.walkFrame}`);
    }
  }

  private handleMovement() {
    let dx = 0, dy = 0;
    if      (this.cursors.left.isDown  || this.wasd.left.isDown)  { dx = -1; this.playerDir = 'left'; }
    else if (this.cursors.right.isDown || this.wasd.right.isDown) { dx =  1; this.playerDir = 'right'; }
    else if (this.cursors.up.isDown    || this.wasd.up.isDown)    { dy = -1; this.playerDir = 'up'; }
    else if (this.cursors.down.isDown  || this.wasd.down.isDown)  { dy =  1; this.playerDir = 'down'; }
    else return;

    this.playerSprite?.setTexture(`player_${this.playerDir}_0`);
    const newX = gameState.playerX + dx;
    const newY = gameState.playerY + dy;

    // Exit check BEFORE collision (tree-border exits work)
    for (const exit of this.mapData.exits) {
      if (newX === exit.x && newY === exit.y) {
        this.transitionMap(exit.targetMap, exit.targetX, exit.targetY);
        return;
      }
    }

    if (this.isCollidingAt(newX, newY)) return;

    // NPC collision — trigger trainer battle if applicable
    for (const { npc } of this.npcObjects) {
      if (npc.x === newX && npc.y === newY) {
        if (npc.isTrainer && !gameState.getFlag(`beaten_${npc.id}`) && gameState.party.length > 0) {
          this.playerDir = (dx === 1 ? 'right' : dx === -1 ? 'left' : dy === 1 ? 'down' : 'up');
          this.startTrainerBattle(npc);
        }
        return;
      }
    }

    // Move the player
    gameState.playerX = newX;
    gameState.playerY = newY;
    this.isMoving = true;
    const tx = newX * TILE_SIZE + TILE_SIZE / 2;
    const ty = newY * TILE_SIZE + TILE_SIZE / 2;
    this.tweens.add({
      targets: [this.playerSprite, this.playerShadow],
      x: tx, y: ty, duration: MOVE_DURATION, ease: 'Linear',
      onComplete: () => {
        this.isMoving = false;
        this.onPlayerMoved();
      },
    });
  }

  private onPlayerMoved() {
    // Check trainer line-of-sight (3 tiles ahead of trainer)
    if (this.checkTrainerSight()) return;

    // Wild encounter in tall grass
    const tileId = this.mapData.tiles[gameState.playerY]?.[gameState.playerX];
    if (tileId === TILE.TALL_GRASS && gameState.party.length > 0) {
      gameState.encounterSteps++;
      if (gameState.encounterSteps >= gameState.nextEncounterAt) {
        gameState.encounterSteps = 0;
        gameState.nextEncounterAt = Math.floor(Math.random() * 6) + 5;
        if (Math.random() < 0.45) this.startWildEncounter();
      }
    } else {
      gameState.encounterSteps = 0;
    }

    // Update encounter proximity meter
    if (this.encounterMeter) {
      const pct = gameState.encounterSteps / gameState.nextEncounterAt;
      const meterW = Math.floor(80 * pct);
      const meterColor = pct > 0.75 ? 0xff4040 : pct > 0.4 ? 0xffa020 : 0x40d040;
      const H = this.scale.height;
      this.encounterMeter.clear();
      if (meterW > 0) {
        this.encounterMeter.fillStyle(meterColor, 0.85).fillRect(10, H - 32, meterW, 8);
      }
    }

    // Keep money display fresh (may have changed via rematch prize etc.)
    this.moneyText?.setText(`¢${gameState.money}`);
  }

  // ─── TRAINER BATTLES ──────────────────────────────────────────────────────────
  /**
   * Returns true if a trainer spotted the player at their current position.
   * Trainers are always re-challengeable (no beaten check here).
   */
  private checkTrainerSight(): boolean {
    for (const { npc } of this.npcObjects) {
      if (!npc.isTrainer) continue;
      if (this.isInBattle) continue;

      const dx = gameState.playerX - npc.x;
      const dy = gameState.playerY - npc.y;
      let inSight = false;

      if (npc.direction === 'down'  && dx === 0 && dy > 0 && dy <= 3) inSight = true;
      if (npc.direction === 'up'    && dx === 0 && dy < 0 && dy >= -3) inSight = true;
      if (npc.direction === 'right' && dy === 0 && dx > 0 && dx <= 3) inSight = true;
      if (npc.direction === 'left'  && dy === 0 && dx < 0 && dx >= -3) inSight = true;

      if (inSight) {
        this.startTrainerBattle(npc);
        return true;
      }
    }
    return false;
  }

  /** Build a scaled trainer creature, following evolution chains if the level warrants it. */
  private buildTrainerCreature(baseCreatureId: number, baseLevel: number, rematchCount: number) {
    const level = baseLevel + rematchCount * 5;
    let creatureId = baseCreatureId;
    // Walk the full evolution chain — a creature may evolve multiple times over rematches
    let data = getCreatureById(creatureId)!;
    while (data.evolutionLevel && data.evolvesInto && level >= data.evolutionLevel) {
      creatureId = data.evolvesInto;
      data = getCreatureById(creatureId) ?? data;
    }
    gameState.seenCreatures.add(creatureId);
    return { creature: createActiveCreature(creatureId, level), data };
  }

  private startTrainerBattle(npc: NPC) {
    if (this.isInBattle || !npc.trainerCreatures || npc.trainerCreatures.length === 0) return;
    if (gameState.party.length === 0) return;
    this.isInBattle = true;

    const rematchCount = gameState.getCounter(`rematch_${npc.id}`);

    // Build scaled party (lead = highest level, extras = the rest)
    const scaledParty = [...npc.trainerCreatures]
      .sort((a, b) => a.level - b.level)
      .map(enc => this.buildTrainerCreature(enc.creatureId, enc.level, rematchCount));

    const lead  = scaledParty[0];
    const extra = scaledParty.slice(1);

    // Dialogue: different after first defeat
    let challengeLine = npc.dialogue[0] ?? `${npc.name} wants to battle!`;
    if (rematchCount === 1) challengeLine = `${npc.name}: You beat me once, but I've been training! Rematch!`;
    else if (rematchCount === 2) challengeLine = `${npc.name}: Twice already?! I won't hold back! My creatures are much stronger now!`;
    else if (rematchCount >= 3) challengeLine = `${npc.name}: You're a legend! But I refuse to give up — battle me again! (Rematch #${rematchCount + 1})`;

    this.cameras.main.shake(250, 0.012);
    this.showDialogue([challengeLine], npc.name, () => {
      this.cameras.main.fadeOut(400, 255, 255, 255);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.launch('Battle', {
          wildCreature: lead.creature,
          wildCreatureData: lead.data,
          isTrainer: true,
          trainerName: npc.name,
          trainerNpcId: npc.id,
          trainerExtraCreatures: extra,
          onBattleEnd: (result: string) => {
            if (result === 'win') {
              gameState.incrementCounter(`rematch_${npc.id}`);
            }
            this.isInBattle = false;
            this.cameras.main.fadeIn(400);
          },
        });
        this.scene.setActive(false, 'Overworld');
        this.scene.setVisible(false, 'Overworld');
      });
    });
  }

  // ─── WILD ENCOUNTERS ──────────────────────────────────────────────────────────
  private startWildEncounter() {
    if (this.isInBattle) return;
    const encounters = this.mapData.encounters;
    if (encounters.length === 0) return;
    this.isInBattle = true;

    const total = encounters.reduce((s, e) => s + e.weight, 0);
    let rand = Math.random() * total;
    let chosen = encounters[0];
    for (const enc of encounters) { rand -= enc.weight; if (rand <= 0) { chosen = enc; break; } }

    const level = Phaser.Math.Between(chosen.minLevel, chosen.maxLevel);
    const wildCreature = createActiveCreature(chosen.creatureId, level);
    const data = getCreatureById(chosen.creatureId)!;
    gameState.seenCreatures.add(chosen.creatureId);

    this.cameras.main.shake(200, 0.01);
    this.time.delayedCall(300, () => {
      this.cameras.main.fadeOut(400, 255, 255, 255);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.launch('Battle', {
          wildCreature, wildCreatureData: data,
          onBattleEnd: (_result: string) => {
            this.isInBattle = false;
            this.cameras.main.fadeIn(400);
          },
        });
        this.scene.setActive(false, 'Overworld');
        this.scene.setVisible(false, 'Overworld');
      });
    });
  }

  // ─── COLLISION & INTERACTION ──────────────────────────────────────────────────
  private isCollidingAt(x: number, y: number): boolean {
    const { width, height, tiles } = this.mapData;
    if (x < 0 || y < 0 || x >= width || y >= height) return true;
    return TILE_SOLID.has(tiles[y]?.[x]);
  }

  private tryInteract() {
    const fx = gameState.playerX + (this.playerDir === 'right' ? 1 : this.playerDir === 'left' ? -1 : 0);
    const fy = gameState.playerY + (this.playerDir === 'down'  ? 1 : this.playerDir === 'up'   ? -1 : 0);
    for (const { npc } of this.npcObjects) {
      if (npc.x === fx && npc.y === fy) { this.talkToNPC(npc); return; }
    }
  }

  private talkToNPC(npc: NPC) {
    if (this.dialogueActive) return;

    // Nurse: heal
    if (npc.isNurse) {
      const hasInjured = gameState.party.some(c =>
        c.currentHp < c.maxHp || c.status || c.moves.some(m => m.pp < m.maxPp)
      );
      const healMsg = hasInjured
        ? ['I\'ll heal your creatures right away!', '...', 'All done! Your creatures are fully restored!', 'Please come again!']
        : ['Your creatures are already in perfect health!', 'Come back if you need healing!'];
      if (hasInjured) gameState.party.forEach(c => {
        c.currentHp = c.maxHp;
        c.status = null;
        c.moves.forEach(m => { m.pp = m.maxPp; });
      });
      this.showDialogue(healMsg, npc.name);
      return;
    }

    // Shop
    if (npc.isShop && npc.shopItems) {
      this.showDialogue([npc.dialogue[0] ?? 'Welcome!'], npc.name, () => {
        this.dialogueActive = true;
        this.scene.launch('Shop', { npc });
      });
      return;
    }

    // Trainers — always rebattleable
    if (npc.isTrainer) {
      if (gameState.party.length === 0) {
        this.showDialogue(['Come back when you have a creature to battle with!'], npc.name);
      } else {
        this.startTrainerBattle(npc);
      }
      return;
    }

    // Prof. Rowan — starter trigger
    if (npc.triggersStarter && gameState.party.length === 0) {
      this.showDialogue(npc.dialogue, npc.name, () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Starter'));
      });
      return;
    }

    // Move Reminder
    if (npc.id === 'move_reminder') {
      if (gameState.party.length === 0) {
        this.showDialogue(['You have no creatures yet!'], npc.name);
        return;
      }
      this.showDialogue(
        ['I can help your creatures remember moves they once knew.',
         'Which creature needs a reminder?'],
        npc.name,
        () => {
          this.dialogueActive = true;
          this.scene.launch('MoveReminder');
        },
      );
      return;
    }

    // Normal NPC
    const lines = (npc.repeatable || !gameState.getFlag(`npc_done_${npc.id}`))
      ? npc.dialogue
      : ['...'];
    if (!npc.repeatable) gameState.setFlag(`npc_done_${npc.id}`);
    this.showDialogue(lines, npc.name);
  }

  /** Called by ShopScene when it closes. */
  public onShopClosed() {
    this.dialogueActive = false;
    this.moneyText?.setText(`¢${gameState.money}`);
  }

  /** Called by MoveReminderScene when it closes. */
  public onMoveReminderClosed() {
    this.dialogueActive = false;
  }

  // ─── MAP TRANSITION ──────────────────────────────────────────────────────────
  private transitionMap(targetMap: string, targetX: number, targetY: number) {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      gameState.mapId = targetMap;
      gameState.playerX = targetX;
      gameState.playerY = targetY;
      this.scene.restart();
    });
  }

  private openMenu() {
    if (this.dialogueActive) return;
    this.scene.launch('Menu', {
      onClose: () => {
        this.scene.setActive(true, 'Overworld');
        this.scene.setVisible(true, 'Overworld');
      },
    });
    this.scene.setActive(false, 'Overworld');
    this.scene.setVisible(false, 'Overworld');
  }
}

export default OverworldScene;
