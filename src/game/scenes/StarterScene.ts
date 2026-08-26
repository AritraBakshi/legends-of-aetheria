import Phaser from 'phaser';
import { gameState } from '../GameState';
import { getStarterCreatures, getCreatureById } from '../data/creatures';
import { createActiveCreature } from '../systems/BattleSystem';
import { fitImageToBox } from './spriteFit';
import { TYPE_COLORS } from '../data/typeChart';

export class StarterScene extends Phaser.Scene {
  private selectedIndex = 0;
  private starters = getStarterCreatures();
  private confirmed = false;
  private nameText!: Phaser.GameObjects.Text;
  private descText!: Phaser.GameObjects.Text;
  private typeText!: Phaser.GameObjects.Text;
  private statBars: Phaser.GameObjects.Graphics[] = [];
  private creatureSprites: Phaser.GameObjects.Image[] = [];
  private selectionBoxes: Phaser.GameObjects.Graphics[] = [];
  private arrowLeft!: Phaser.GameObjects.Text;
  private arrowRight!: Phaser.GameObjects.Text;

  constructor() { super('Starter'); }

  create() {
    // Phaser reuses this scene's underlying systems (input, time, tweens)
    // across every scene.start('Starter') call — only create() itself
    // reruns. Class fields like `confirmed` and plugin state like
    // `input.enabled` are NOT reset automatically, so if this scene is
    // ever entered more than once in a session, it would otherwise start
    // back up already "confirmed" and with input still disabled from the
    // previous run — permanently inert, no error, just dead. Reset
    // everything explicitly every time this scene boots.
    this.confirmed = false;
    this.selectedIndex = 0;
    this.input.enabled = true;
    this.statBars = [];
    this.creatureSprites = [];
    this.selectionBoxes = [];

    const W = this.scale.width, H = this.scale.height;

    // Background
    const bg = this.add.graphics();
    for (let y = 0; y < H; y++) {
      const t = y / H;
      const r = Math.floor(20 + t * 40), gv = Math.floor(30 + t * 50), b = Math.floor(60 + t * 80);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, gv, b)).fillRect(0, y, W, 1);
    }

    // Header
    this.add.text(W / 2, 30, "Choose Your Partner Creature!", {
      fontSize: '28px', fontFamily: 'monospace', color: '#ffd700',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    this.add.text(W / 2, 65, "Prof. Rowan: \"These three have been waiting for a trainer like you!\"", {
      fontSize: '14px', fontFamily: 'monospace', color: '#c0e0ff',
    }).setOrigin(0.5);

    // Starter boxes — centred correctly for 3 cards
    const boxW = 160, boxH = 195;
    const GAP = 14;
    const totalBoxW = 3 * boxW + 2 * GAP;
    const startX = Math.floor((W - totalBoxW) / 2);

    this.starters.forEach((starter, i) => {
      const bx = startX + i * (boxW + GAP);
      const by = 100;

      // Box background
      const box = this.add.graphics();
      box.fillStyle(0x1a2a3a).fillRoundedRect(bx, by, boxW, boxH, 12);
      box.lineStyle(3, 0x4080a0).strokeRoundedRect(bx, by, boxW, boxH, 12);
      this.selectionBoxes.push(box);

      // Type color banner
      const typeColor = TYPE_COLORS[starter.type[0]] ?? 0x808080;
      const banner = this.add.graphics();
      banner.fillStyle(typeColor, 0.3).fillRoundedRect(bx + 4, by + 4, boxW - 8, 30, 8);
      banner.lineStyle(1, typeColor).strokeRoundedRect(bx + 4, by + 4, boxW - 8, 30, 8);

      // Type label
      this.add.text(bx + boxW / 2, by + 19, starter.type.join(' / '), {
        fontSize: '12px', fontFamily: 'monospace', color: '#ffffff',
      }).setOrigin(0.5);

      // Creature sprite
      const sprite = fitImageToBox(this.add.image(bx + boxW / 2, by + 90, `creature_${starter.id}`), 64);
      this.creatureSprites.push(sprite);

      // Creature name
      this.add.text(bx + boxW / 2, by + 130, starter.name, {
        fontSize: '18px', fontFamily: 'monospace', color: '#ffd700',
      }).setOrigin(0.5);

      // Brief description
      const shortDesc = starter.description.substring(0, 40) + (starter.description.length > 40 ? '...' : '');
      this.add.text(bx + boxW / 2, by + 152, shortDesc, {
        fontSize: '10px', fontFamily: 'monospace', color: '#a0c0e0',
        wordWrap: { width: boxW - 16 }, align: 'center',
      }).setOrigin(0.5, 0);

      // Click handler
      const hitZone = this.add.rectangle(bx + boxW / 2, by + boxH / 2, boxW, boxH, 0x000000, 0)
        .setInteractive({ useHandCursor: true });
      hitZone.on('pointerover', () => {
        this.selectedIndex = i;
        this.updateSelection();
      });
      hitZone.on('pointerdown', () => {
        this.selectedIndex = i;
        this.confirmSelection();
      });
    });

    // Info panel — compact to leave room for stat bars and confirm button
    const infoY = 308;
    const infoBg = this.add.graphics();
    infoBg.fillStyle(0x0a1628, 0.9).fillRoundedRect(W / 2 - 280, infoY, 560, 86, 10);
    infoBg.lineStyle(2, 0xffd700, 0.7).strokeRoundedRect(W / 2 - 280, infoY, 560, 86, 10);

    this.nameText = this.add.text(W / 2, infoY + 20, '', {
      fontSize: '22px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5);

    this.typeText = this.add.text(W / 2, infoY + 48, '', {
      fontSize: '14px', fontFamily: 'monospace', color: '#80d0ff',
    }).setOrigin(0.5);

    this.descText = this.add.text(W / 2, infoY + 68, '', {
      fontSize: '12px', fontFamily: 'monospace', color: '#c0d0e0',
      wordWrap: { width: 520 }, align: 'center',
    }).setOrigin(0.5, 0);

    // Stat bars sit between info panel and confirm button
    this.drawStatBars(infoY + 90);

    // Navigation arrows
    this.arrowLeft = this.add.text(startX - 30, 200, '◀', {
      fontSize: '32px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.arrowLeft.on('pointerdown', () => this.navigate(-1));

    this.arrowRight = this.add.text(startX + totalBoxW + 10, 200, '▶', {
      fontSize: '32px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    this.arrowRight.on('pointerdown', () => this.navigate(1));

    // Confirm button — positioned below stat bars, above screen bottom
    const confirmBtn = this.add.text(W / 2, H - 14, '[ PRESS ENTER TO CHOOSE ]', {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffd700',
      stroke: '#804000', strokeThickness: 2,
    }).setOrigin(0.5, 1).setInteractive({ useHandCursor: true });
    confirmBtn.on('pointerdown', () => this.confirmSelection());
    this.tweens.add({ targets: confirmBtn, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

    // Keys
    const keys = this.input.keyboard!;
    keys.on('keydown-LEFT', () => this.navigate(-1));
    keys.on('keydown-RIGHT', () => this.navigate(1));
    keys.on('keydown-A', () => this.navigate(-1));
    keys.on('keydown-D', () => this.navigate(1));
    keys.on('keydown-ENTER', () => this.confirmSelection());
    keys.on('keydown-SPACE', () => this.confirmSelection());

    this.updateSelection();
  }

  private drawStatBars(startY: number) {
    const W = this.scale.width;
    const stats = ['HP', 'ATK', 'DEF', 'SP.ATK', 'SP.DEF', 'SPD'];
    for (let i = 0; i < 6; i++) {
      this.add.text(W / 2 - 260 + (i * 90), startY + 10, stats[i], {
        fontSize: '10px', fontFamily: 'monospace', color: '#80a0c0',
      }).setOrigin(0.5);
      const g = this.add.graphics();
      this.statBars.push(g);
    }
  }

  private updateSelection() {
    const starter = this.starters[this.selectedIndex];

    // Update info panel
    this.nameText.setText(starter.name);
    this.typeText.setText(`Type: ${starter.type.join(' / ')} | Ability: ${starter.ability.split('—')[0].trim()}`);
    this.descText.setText(starter.description);

    // Update stat bars
    const statValues = [
      starter.baseStats.hp, starter.baseStats.atk, starter.baseStats.def,
      starter.baseStats.spatk, starter.baseStats.spdef, starter.baseStats.spd,
    ];
    const W = this.scale.width;
    const barY = 308 + 90 + 12; // infoY(308) + info panel height(90) + padding(12)
    statValues.forEach((val, i) => {
      const g = this.statBars[i];
      g.clear();
      const bx = W / 2 - 260 + (i * 90) - 35;
      const maxW = 70;
      const barW = Math.floor((val / 100) * maxW);
      g.fillStyle(0x303050).fillRect(bx, barY, maxW, 8);
      const color = val > 70 ? 0x40ff40 : val > 50 ? 0xffd700 : 0xff6040;
      g.fillStyle(color).fillRect(bx, barY, barW, 8);
    });

    // Highlight selected box — must use the same world coords as create()
    const W2 = this.scale.width;
    const boxW = 160, boxH = 195;
    const GAP = 14;
    const totalBoxW = 3 * boxW + 2 * GAP;
    const startX = Math.floor((W2 - totalBoxW) / 2);
    this.selectionBoxes.forEach((box, i) => {
      const bx = startX + i * (boxW + GAP);
      const by = 100;
      box.clear();
      box.fillStyle(i === this.selectedIndex ? 0x1e3a5e : 0x1a2a3a).fillRoundedRect(bx, by, boxW, boxH, 12);
      box.lineStyle(3, i === this.selectedIndex ? 0xffd700 : 0x4080a0).strokeRoundedRect(bx, by, boxW, boxH, 12);
    });

    // Scale selected sprite
    this.creatureSprites.forEach((sprite, i) => {
      this.tweens.add({
        targets: sprite,
        scaleX: i === this.selectedIndex ? 1.2 : 1,
        scaleY: i === this.selectedIndex ? 1.2 : 1,
        duration: 150,
      });
    });
  }

  private navigate(dir: number) {
    this.selectedIndex = (this.selectedIndex + dir + this.starters.length) % this.starters.length;
    this.updateSelection();
  }

  private confirmSelection() {
    if (this.confirmed) return;
    this.confirmed = true;

    // Belt-and-suspenders: spamming ENTER/SPACE/clicks during the ~900ms
    // transition window (flash -> delayedCall -> fade -> scene.start) should
    // never be able to re-enter this method or leak a stray keypress into
    // whatever scene starts next. The confirmed flag already guards
    // re-entrancy, but strip the actual input sources too so nothing keeps
    // queuing.
    this.input.keyboard!.removeAllListeners();
    this.input.enabled = false;
    this.arrowLeft?.disableInteractive();
    this.arrowRight?.disableInteractive();

    const starter = this.starters[this.selectedIndex];

    // Flash effect
    this.cameras.main.flash(300, 255, 255, 255);

    this.time.delayedCall(400, () => {
      const creature = createActiveCreature(starter.id, 5);
      creature.isCaught = true;
      gameState.party.push(creature);
      gameState.seenCreatures.add(starter.id);
      gameState.caughtCreatures.add(starter.id);
      gameState.setFlag('hasStarter');
      gameState.mapId = 'oakwind';
      gameState.playerX = 15;
      gameState.playerY = 10;

      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        // Return to Overworld — it will show the first-time tip via gameState flag
        this.scene.start('Overworld');
      });
    });
  }
}

export default StarterScene;