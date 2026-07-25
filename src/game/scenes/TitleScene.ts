import Phaser from 'phaser';
import { hasSaveData } from '../systems/SaveSystem';
import { gameState } from '../GameState';
import { NEWS } from '../data/news';
import { createScrollArea, type ScrollAreaHandle } from './scrollArea';

export class TitleScene extends Phaser.Scene {
  private stars: Phaser.GameObjects.Graphics[] = [];
  private menuItems: Phaser.GameObjects.Text[] = [];
  private selectedIndex = 0;
  private canSelect = true;
  private options: string[] = [];

  constructor() { super('Title'); }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Background gradient (dark purple/blue night sky)
    const bg = this.add.graphics();
    for (let y = 0; y < H; y++) {
      const t = y / H;
      const r = Math.floor(10 + t * 20);
      const gv = Math.floor(5 + t * 15);
      const b = Math.floor(30 + t * 40);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, gv, b)).fillRect(0, y, W, 1);
    }

    // Stars
    for (let i = 0; i < 100; i++) {
      const star = this.add.graphics();
      const x = Phaser.Math.Between(0, W);
      const y = Phaser.Math.Between(0, H * 0.6);
      const size = Math.random() < 0.2 ? 2 : 1;
      star.fillStyle(0xffffff, 0.5 + Math.random() * 0.5).fillRect(x, y, size, size);
      this.stars.push(star);
      this.tweens.add({
        targets: star, alpha: { from: 0.3, to: 1 }, duration: 800 + Math.random() * 1200,
        yoyo: true, repeat: -1, delay: Math.random() * 2000,
      });
    }

    // Moon
    const moon = this.add.graphics();
    moon.fillStyle(0xfff8e0).fillCircle(W * 0.8, 80, 40);
    moon.fillStyle(0x1a1060).fillCircle(W * 0.8 + 15, 70, 35);
    this.tweens.add({ targets: moon, y: -5, duration: 3000, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

    // Mountains silhouette
    const mts = this.add.graphics();
    mts.fillStyle(0x0a0a20);
    mts.fillTriangle(0, H, 150, H * 0.45, 300, H);
    mts.fillTriangle(200, H, 380, H * 0.35, 560, H);
    mts.fillTriangle(400, H, 550, H * 0.5, 700, H);
    mts.fillTriangle(500, H, 640, H * 0.4, W, H);
    mts.fillStyle(0x080818);
    mts.fillTriangle(50, H, 160, H * 0.55, 270, H);
    mts.fillTriangle(250, H, 400, H * 0.42, 550, H);
    mts.fillTriangle(450, H, 580, H * 0.52, W, H);

    // Ground
    const ground = this.add.graphics();
    ground.fillStyle(0x0d1a0d).fillRect(0, H * 0.78, W, H * 0.22);
    ground.fillStyle(0x1a2e1a).fillRect(0, H * 0.8, W, 20);

    // Title logo
    const titleShadow = this.add.text(W / 2 + 3, H * 0.22 + 3, 'LEGENDS OF', {
      fontSize: '52px', fontFamily: 'monospace', color: '#000000',
    }).setOrigin(0.5).setAlpha(0.5);
    const title1 = this.add.text(W / 2, H * 0.22, 'LEGENDS OF', {
      fontSize: '52px', fontFamily: 'monospace', color: '#ffd700',
      stroke: '#804000', strokeThickness: 4,
    }).setOrigin(0.5);

    const title2Shadow = this.add.text(W / 2 + 4, H * 0.34 + 4, 'AETHERIA', {
      fontSize: '72px', fontFamily: 'monospace', color: '#000000',
    }).setOrigin(0.5).setAlpha(0.5);
    const title2 = this.add.text(W / 2, H * 0.34, 'AETHERIA', {
      fontSize: '72px', fontFamily: 'monospace', color: '#ffffff',
      stroke: '#4060d0', strokeThickness: 6,
    }).setOrigin(0.5);

    this.tweens.add({
      targets: [title1, title2, titleShadow, title2Shadow],
      y: '-=6', duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.inOut',
    });

    // Subtitle
    this.add.text(W / 2, H * 0.46, '— Monster Collecting RPG —', {
      fontSize: '18px', fontFamily: 'monospace', color: '#a0c0ff',
    }).setOrigin(0.5);

    // Creature silhouettes
    this.drawCreatureSilhouettes();

    // Menu options
    this.options = hasSaveData() ? ['New Game', 'Continue', 'News', 'Options'] : ['New Game', 'News', 'Options'];

    const menuStartY = H * 0.62;
    this.options.forEach((opt, i) => {
      const item = this.add.text(W / 2, menuStartY + i * 44, opt, {
        fontSize: '26px', fontFamily: 'monospace', color: '#ffffff',
        stroke: '#000000', strokeThickness: 2,
      }).setOrigin(0.5).setInteractive();
      item.on('pointerover', () => { this.selectedIndex = i; this.updateSelection(); });
      item.on('pointerdown', () => this.selectOption(i));
      this.menuItems.push(item);
    });

    this.updateSelection();

    // Copyright
    this.add.text(W / 2, H - 16, '© 2026 Legends of Aetheria — Original Work', {
      fontSize: '11px', fontFamily: 'monospace', color: '#606080',
    }).setOrigin(0.5);

    // Press Start prompt
    const pressStart = this.add.text(W / 2, H * 0.56, 'Press ENTER or click to select', {
      fontSize: '14px', fontFamily: 'monospace', color: '#80a0ff',
    }).setOrigin(0.5);
    this.tweens.add({ targets: pressStart, alpha: 0, duration: 700, yoyo: true, repeat: -1 });

    // Controls
    const keys = this.input.keyboard!;
    keys.on('keydown-UP', () => this.navigate(-1));
    keys.on('keydown-DOWN', () => this.navigate(1));
    keys.on('keydown-ENTER', () => this.selectOption(this.selectedIndex));
    keys.on('keydown-SPACE', () => this.selectOption(this.selectedIndex));
    keys.on('keydown-W', () => this.navigate(-1));
    keys.on('keydown-S', () => this.navigate(1));
  }

  private drawCreatureSilhouettes() {
    const g = this.add.graphics();
    const H = this.scale.height;
    // Left creature silhouette
    g.fillStyle(0x080820, 0.8);
    g.fillCircle(100, H * 0.72, 28);
    g.fillRect(84, H * 0.72, 32, 24);
    g.fillRect(88, H * 0.75, 6, 6);
    g.fillRect(106, H * 0.75, 6, 6);
    g.fillRect(75, H * 0.66, 8, 16);
    g.fillRect(117, H * 0.66, 8, 16);
    // Right creature silhouette
    g.fillEllipse(540, H * 0.72, 52, 44);
    g.fillRect(522, H * 0.74, 56, 22);
    g.fillRect(526, H * 0.78, 8, 8);
    g.fillRect(546, H * 0.78, 8, 8);
    g.fillTriangle(565, H * 0.60, 575, H * 0.60, 570, H * 0.68);
    // Center creature silhouette (larger)
    g.fillStyle(0x0a0a28, 0.7);
    g.fillCircle(320, H * 0.72, 36);
    g.fillRect(296, H * 0.72, 48, 30);
    g.fillRect(300, H * 0.79, 10, 10);
    g.fillRect(330, H * 0.79, 10, 10);
    g.fillTriangle(308, H * 0.58, 320, H * 0.58, 314, H * 0.68);
    g.fillTriangle(332, H * 0.58, 344, H * 0.58, 338, H * 0.68);
  }

  private navigate(dir: number) {
    if (!this.canSelect) return;
    this.selectedIndex = (this.selectedIndex + dir + this.options.length) % this.options.length;
    this.updateSelection();
  }

  private updateSelection() {
    this.menuItems.forEach((item, i) => {
      if (i === this.selectedIndex) {
        item.setColor('#ffd700').setScale(1.1);
      } else {
        item.setColor('#ffffff').setScale(1);
      }
    });
  }

  private selectOption(index: number) {
    if (!this.canSelect) return;
    this.canSelect = false;
    const opt = this.options[index];
    if (opt === 'Continue') {
      gameState.load();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Overworld');
      });
    } else if (opt === 'New Game') {
      // Reset all game state for a fresh playthrough
      gameState.mapId = 'oakwind';
      gameState.playerX = 15;
      gameState.playerY = 10;
      gameState.lastHealMapId = 'oakwind';
      gameState.lastHealX = 15;
      gameState.lastHealY = 10;
      gameState.party = [];
      gameState.storage = [];
      gameState.inventory = [{ id: 1, quantity: 5 }, { id: 10, quantity: 3 }];
      gameState.money = 200;
      gameState.flags = {};
      gameState.counters = {};
      gameState.seenCreatures = new Set();
      gameState.caughtCreatures = new Set();
      gameState.playTime = 0;
      gameState.startTime = Date.now();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('Overworld');
      });
    } else if (opt === 'News') {
      this.showNewsPanel();
    } else if (opt === 'Options') {
      this.showOptionsMenu();
    }
  }

  private showOptionsMenu() {
    const W = this.scale.width, H = this.scale.height;
    const SAVE_KEY = 'legends_of_aetheria_save';

    // Dim overlay
    const dim = this.add.graphics().setDepth(50);
    dim.fillStyle(0x000000, 0.7).fillRect(0, 0, W, H);

    // Panel — taller to fit save transfer section
    const pw = 400, ph = 360;
    const px = (W - pw) / 2, py = (H - ph) / 2;
    const panel = this.add.graphics().setDepth(51);
    panel.fillStyle(0x0d1a2e, 0.98).fillRoundedRect(px, py, pw, ph, 10);
    panel.lineStyle(3, 0xffd700).strokeRoundedRect(px, py, pw, ph, 10);

    const title = this.add.text(W / 2, py + 18, '⚙  OPTIONS', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5).setDepth(52);

    // Load saved options
    const opts = JSON.parse(localStorage.getItem('loa_options') ?? '{}');
    let soundOn: boolean = opts.sound ?? true;
    let textSpeed: 'slow' | 'normal' | 'fast' = opts.textSpeed ?? 'normal';

    const all: Phaser.GameObjects.GameObject[] = [dim, panel, title];

    const makeRow = (label: string, y: number, getValue: () => string, onToggle: () => void) => {
      const lbl = this.add.text(px + 24, y, label, {
        fontSize: '15px', fontFamily: 'monospace', color: '#c0e0ff',
      }).setDepth(52);
      const val = this.add.text(px + pw - 24, y, getValue(), {
        fontSize: '15px', fontFamily: 'monospace', color: '#ffd700',
      }).setOrigin(1, 0).setDepth(52).setInteractive({ useHandCursor: true });
      val.on('pointerdown', () => { onToggle(); val.setText(getValue()); });
      val.on('pointerover', () => val.setColor('#ffffff'));
      val.on('pointerout',  () => val.setColor('#ffd700'));
      all.push(lbl, val);
    };

    makeRow('Sound',
      py + 58,
      () => soundOn ? '  ON  ◀▶' : ' OFF  ◀▶',
      () => { soundOn = !soundOn; },
    );
    makeRow('Text Speed',
      py + 90,
      () => ({ slow: ' SLOW ◀▶', normal: ' NORM ◀▶', fast: ' FAST ◀▶' })[textSpeed],
      () => { textSpeed = textSpeed === 'slow' ? 'normal' : textSpeed === 'normal' ? 'fast' : 'slow'; },
    );

    // Controls hint
    all.push(this.add.text(W / 2, py + 124, 'Controls: Arrow Keys / WASD to move   Z/Enter confirm   Esc cancel', {
      fontSize: '10px', fontFamily: 'monospace', color: '#404060',
    }).setOrigin(0.5).setDepth(52));

    // ── Save Transfer section ─────────────────────────────────────────────────
    const divider = this.add.graphics().setDepth(52);
    divider.lineStyle(1, 0x304060).lineBetween(px + 16, py + 144, px + pw - 16, py + 144);
    all.push(divider);

    all.push(this.add.text(W / 2, py + 152, '💾  Save Transfer', {
      fontSize: '14px', fontFamily: 'monospace', color: '#80d0ff',
    }).setOrigin(0.5).setDepth(52));
    all.push(this.add.text(W / 2, py + 170, 'Move your save between devices or deployments', {
      fontSize: '10px', fontFamily: 'monospace', color: '#405060',
    }).setOrigin(0.5).setDepth(52));

    // Status feedback text
    const statusTxt = this.add.text(W / 2, py + 268, '', {
      fontSize: '11px', fontFamily: 'monospace', color: '#40ff80',
    }).setOrigin(0.5).setDepth(52);
    all.push(statusTxt);

    const setStatus = (msg: string, color = '#40ff80') => {
      statusTxt.setText(msg).setColor(color);
      this.time.delayedCall(3000, () => { if (statusTxt.active) statusTxt.setText(''); });
    };

    // EXPORT button — downloads save as .json file AND copies to clipboard
    const exportBtn = this.add.text(px + pw / 2 - 6, py + 196, '📤 Export Save', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffffff',
      backgroundColor: '#1a3a5a', padding: { x: 10, y: 6 },
    }).setOrigin(1, 0).setDepth(52).setInteractive({ useHandCursor: true });
    exportBtn.on('pointerover', () => exportBtn.setStyle({ backgroundColor: '#2a5a8a' }));
    exportBtn.on('pointerout',  () => exportBtn.setStyle({ backgroundColor: '#1a3a5a' }));
    exportBtn.on('pointerdown', () => {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) { setStatus('No save data found!', '#ff8080'); return; }

      // Encode as base64 so it survives copy/paste without formatting issues
      const encoded = btoa(unescape(encodeURIComponent(raw)));

      // Copy to clipboard
      navigator.clipboard?.writeText(encoded).catch(() => {/* fallback below */});

      // Also trigger a file download
      const blob = new Blob([encoded], { type: 'text/plain' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `aetheria_save_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('✓ Saved to file & clipboard!', '#40ff80');
    });
    all.push(exportBtn);

    // IMPORT button — reads from clipboard, user can also paste into prompt
    const importBtn = this.add.text(px + pw / 2 + 6, py + 196, '📥 Import Save', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffffff',
      backgroundColor: '#3a1a5a', padding: { x: 10, y: 6 },
    }).setOrigin(0, 0).setDepth(52).setInteractive({ useHandCursor: true });
    importBtn.on('pointerover', () => importBtn.setStyle({ backgroundColor: '#5a2a8a' }));
    importBtn.on('pointerout',  () => importBtn.setStyle({ backgroundColor: '#3a1a5a' }));
    importBtn.on('pointerdown', async () => {
      let encoded = '';

      // Try clipboard first
      try {
        encoded = (await navigator.clipboard.readText()).trim();
      } catch {
        // Clipboard blocked — fallback to prompt
        const pasted = window.prompt(
          'Paste your save code here:\n(The text from your exported .txt file)',
        );
        if (!pasted) return;
        encoded = pasted.trim();
      }

      if (!encoded) { setStatus('Nothing to import.', '#ff8080'); return; }

      try {
        const raw  = decodeURIComponent(escape(atob(encoded)));
        const data = JSON.parse(raw);

        // Basic validation — must have required save fields
        if (!data.mapId || !data.party || !data.inventory) {
          throw new Error('Invalid save format');
        }

        // Confirm before overwriting
        const ok = window.confirm(
          `Import save from ${new Date(data.savedAt ?? 0).toLocaleString()}?\n` +
          `Party: ${data.party?.length ?? 0} creatures   Money: ¢${data.money ?? 0}\n\n` +
          'This will OVERWRITE your current save!',
        );
        if (!ok) return;

        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        setStatus('✓ Save imported! Reload the page to apply.', '#40ff80');

        // Reload after 2 s so the new save is picked up cleanly
        this.time.delayedCall(2000, () => window.location.reload());
      } catch (err) {
        console.error("Import failed:", err);
        setStatus('✗ Invalid save data — check the text and retry.', '#ff4040');
      }
    });
    all.push(importBtn);

    // Help text
    all.push(this.add.text(W / 2, py + 232, 'Export: downloads a .txt file and copies to clipboard', {
      fontSize: '9px', fontFamily: 'monospace', color: '#304050',
    }).setOrigin(0.5).setDepth(52));
    all.push(this.add.text(W / 2, py + 248, 'Import: reads from clipboard (or paste when prompted)', {
      fontSize: '9px', fontFamily: 'monospace', color: '#304050',
    }).setOrigin(0.5).setDepth(52));

    // Save & Close
    const closeBtn = this.add.text(W / 2, py + ph - 16, '[ Save & Close ]', {
      fontSize: '15px', fontFamily: 'monospace', color: '#ff8080',
    }).setOrigin(0.5, 1).setDepth(52).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setColor('#ffaaaa'));
    closeBtn.on('pointerdown', () => {
      localStorage.setItem('loa_options', JSON.stringify({ sound: soundOn, textSpeed }));
      all.forEach(o => o.destroy()); closeBtn.destroy();
      this.canSelect = true;
    });
    all.push(closeBtn);

    this.input.keyboard!.once('keydown-ESC', () => {
      all.forEach(o => o.destroy()); closeBtn.destroy();
      this.canSelect = true;
    });
  }

  private showNewsPanel() {
    const W = this.scale.width, H = this.scale.height;

    // Snapshot everything already in the scene (stars, mountains, title
    // logo, menu items, etc.) BEFORE building the modal, so the scroll
    // camera below can be told to ignore all of it — otherwise it renders
    // the whole background scene (cropped to its own viewport) underneath
    // the news text, since it only knew to ignore the modal's own chrome.
    const preExisting = [...this.children.list];

    const dim = this.add.graphics().setDepth(50);
    dim.fillStyle(0x000000, 0.7).fillRect(0, 0, W, H);

    const pw = 460, ph = 420;
    const px = (W - pw) / 2, py = (H - ph) / 2;
    const panel = this.add.graphics().setDepth(51);
    panel.fillStyle(0x0d1a2e, 0.98).fillRoundedRect(px, py, pw, ph, 10);
    panel.lineStyle(3, 0xffd700).strokeRoundedRect(px, py, pw, ph, 10);

    const title = this.add.text(W / 2, py + 18, '📰  NEWS', {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5).setDepth(52);

    const all: Phaser.GameObjects.GameObject[] = [...preExisting, dim, panel, title];
    const modalOnly: Phaser.GameObjects.GameObject[] = [dim, panel, title];

    const viewX = px + 16, viewY = py + 46, viewW = pw - 32, viewH = ph - 96;

    // Lay out every entry's title/date/bullets into the scrollable container,
    // measuring height as we go so the scroll area knows the true content size.
    const rows = this.add.container(0, 0);
    let cursorY = 0;
    const wrapWidth = viewW - 16;

    NEWS.forEach((entry, i) => {
      if (i > 0) cursorY += 14; // gap between entries

      const dateTxt = this.add.text(0, cursorY, entry.date, {
        fontSize: '10px', fontFamily: 'monospace', color: '#5878a8',
      });
      rows.add(dateTxt);
      cursorY += 14;

      const titleTxt = this.add.text(0, cursorY, entry.title, {
        fontSize: '15px', fontFamily: 'monospace', color: '#ffd700',
      });
      rows.add(titleTxt);
      cursorY += titleTxt.height + 6;

      for (const bullet of entry.bullets) {
        const bulletTxt = this.add.text(10, cursorY, `•  ${bullet}`, {
          fontSize: '12px', fontFamily: 'monospace', color: '#d0e0ff',
          wordWrap: { width: wrapWidth - 10 }, lineSpacing: 3,
        });
        rows.add(bulletTxt);
        cursorY += bulletTxt.height + 6;
      }

      if (i < NEWS.length - 1) {
        const divider = this.add.graphics();
        divider.lineStyle(1, 0x1c2e46).lineBetween(0, cursorY + 4, wrapWidth, cursorY + 4);
        rows.add(divider);
        cursorY += 10;
      }
    });

    const scrollArea: ScrollAreaHandle = createScrollArea(
      this, viewX, viewY, viewW, viewH, cursorY, all, { rowStep: 40 },
    );
    scrollArea.container.add(rows);

    const closeBtn = this.add.text(W / 2, py + ph - 16, '[ Close ]', {
      fontSize: '15px', fontFamily: 'monospace', color: '#ff8080',
    }).setOrigin(0.5, 1).setDepth(52).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setColor('#ffaaaa'));
    closeBtn.on('pointerout', () => closeBtn.setColor('#ff8080'));
    modalOnly.push(closeBtn);
    const closeAll = () => {
      modalOnly.forEach(o => o.destroy());
      scrollArea.destroy();
      this.canSelect = true;
    };
    closeBtn.on('pointerdown', closeAll);
    all.push(closeBtn);

    this.input.keyboard!.once('keydown-ESC', closeAll);
  }
}

export default TitleScene;