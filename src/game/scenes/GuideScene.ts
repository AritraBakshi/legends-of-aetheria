import Phaser from 'phaser';

interface GuideTopic {
  title: string;
  lines: string[];
}

const TOPICS: GuideTopic[] = [
  {
    title: 'Controls',
    lines: [
      'Arrow keys (or WASD) to move.',
      'Enter or Z to interact with people, signs, and doors.',
      'Esc opens the menu — check your party, bag, and save from there.',
    ],
  },
  {
    title: 'Catching Creatures',
    lines: [
      'Walk into tall grass to find wild creatures.',
      'Weaken one in battle, then use a Capture Orb from your bag.',
      'Lower HP and status conditions like sleep or paralysis both improve your odds.',
    ],
  },
  {
    title: 'Battling',
    lines: [
      'Each move has a type — some types hit harder or weaker against others.',
      'Physical moves use Attack/Defense, Special moves use Sp.Atk/Sp.Def.',
      'Status moves can raise your stats, lower the foe\'s, or inflict conditions like burn or paralysis.',
    ],
  },
  {
    title: 'PP and Final Crashout',
    lines: [
      'Every move has limited PP (uses) — it won\'t work once it hits 0.',
      'If ALL of a creature\'s moves run out of PP, it can still use Final Crashout.',
      'Final Crashout always works, but hits you with 50 HP of recoil — it\'s a last resort, not a strategy!',
    ],
  },
  {
    title: 'Trainers & Rematches',
    lines: [
      'The first time a trainer spots you (or you walk into them), they\'ll challenge you automatically.',
      'After you\'ve beaten a trainer once, they won\'t auto-challenge again.',
      'Walk up and press Enter to ask for a rematch — you\'ll get a Yes/No choice first.',
      'Trainers get stronger each time you beat them, so rematches are a great way to grind levels.',
    ],
  },
  {
    title: 'Evolution',
    lines: [
      'Creatures evolve automatically once they reach the right level.',
      'Evolving usually makes them notably stronger and can change their moves.',
    ],
  },
  {
    title: 'Healing & Shops',
    lines: [
      'Nurses fully heal your entire party for free — HP, status, and PP.',
      'Shopkeepers sell Capture Orbs, potions, and other supplies for money (¢).',
      'You earn money by winning trainer battles.',
    ],
  },
  {
    title: 'Move Reminder',
    lines: [
      'A creature can only know a few moves at once.',
      'The Move Reminder can teach back any move it has already learned by level, in case you swapped it out.',
    ],
  },
  {
    title: 'Dungeons',
    lines: [
      'Some towns hide a dungeon — a gauntlet of trainers guarding a Dungeon Master.',
      'You must beat every trainer inside in one unbroken streak to unlock the Dungeon Master.',
      'Losing a battle, or leaving the dungeon, resets your streak — you\'ll need to start the run over.',
      'Once you\'ve fully cleared it, you can keep challenging the Dungeon Master directly without redoing the streak — until you leave and come back.',
    ],
  },
  {
    title: 'Saving',
    lines: [
      'Open the menu (Esc) to save your game at any time.',
      'Your progress is stored right on this device.',
      'Want to move your save to another device, or keep a backup? See "Export/Import Save" below!',
    ],
  },
  {
    title: 'Export/Import Save',
    lines: [
      'From the TITLE SCREEN (not in-game), you\'ll find Export Save and Import Save buttons.',
      'Export Save downloads a .txt file with your save AND copies it to your clipboard.',
      'Import Save reads a save code from your clipboard (or lets you paste it if that\'s blocked) and asks you to confirm before overwriting your current save.',
      'This is the way to back up your progress or carry it over to a different browser or device — just export on one, then import on the other.',
      'After importing, the page reloads automatically to apply it.',
    ],
  },
];

/**
 * The Guide NPC's help menu — a topic list the player can browse freely.
 *
 * This is fully self-contained: switching between the topic list and a
 * topic's detail text happens by clearing and redrawing within this SAME
 * scene instance. It deliberately does NOT stop itself and hand off to a
 * separate Dialogue scene and back — that stop/relaunch chain across scene
 * keys isn't used anywhere else in this codebase and proved unreliable in
 * practice (the whole game could end up stuck with no way to close the
 * menu). Keeping everything in one scene avoids that class of bug entirely.
 *
 * Still runs as its own Scene (not drawn directly in OverworldScene) for the
 * same reason as LocationBanner/ConfirmPrompt: it needs a camera fixed at
 * zoom 1, independent of whatever zoom OverworldScene's camera is using.
 */
export class GuideScene extends Phaser.Scene {
  private onClose?: () => void;
  private layer!: Phaser.GameObjects.Container;

  // Detail-view scroll state — torn down/rebuilt each time a topic is opened.
  // Clipping is done with a dedicated camera scoped to the text box rather
  // than a GeometryMask: mask-based clipping depends on the renderer backend
  // and wasn't reliably cropping text, while a camera's viewport is a hard
  // boundary that behaves the same in WebGL and Canvas.
  private scrollCam?: Phaser.Cameras.Scene2D.Camera;
  private scrollBody?: Phaser.GameObjects.Text;
  private wheelHandler?: (pointer: unknown, objs: unknown, dx: number, dy: number) => void;
  private scrollKeyHandler?: (event: KeyboardEvent) => void;

  constructor() { super({ key: 'Guide', active: false }); }

  init(data: { onClose?: () => void }) {
    this.onClose = data?.onClose;
  }

  create() {
    this.layer = this.add.container(0, 0);
    this.renderList();

    // Esc always closes the whole Guide, from either view.
    this.input.keyboard?.on('keydown-ESC', this.closeGuide, this);
  }

  shutdown() {
    this.input.keyboard?.off('keydown-ESC', this.closeGuide, this);
    this.teardownScrollHandlers();
  }

  private closeGuide = () => {
    this.scene.stop();
    this.onClose?.();
  };

  private teardownScrollHandlers() {
    if (this.wheelHandler) { this.input.off('wheel', this.wheelHandler); this.wheelHandler = undefined; }
    if (this.scrollKeyHandler) { window.removeEventListener('keydown', this.scrollKeyHandler); this.scrollKeyHandler = undefined; }
    if (this.scrollCam) { this.cameras.remove(this.scrollCam); this.scrollCam = undefined; }
    this.scrollBody?.destroy();
    this.scrollBody = undefined;
  }

  private clearLayer() {
    this.teardownScrollHandlers();
    this.layer.each((child: Phaser.GameObjects.GameObject) => child.destroy());
    this.layer.removeAll();
  }

  private renderList() {
    this.clearLayer();
    const W = this.scale.width, H = this.scale.height;
    const panelW = 560, panelH = 420;
    const panelX = W / 2 - panelW / 2, panelY = H / 2 - panelH / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a14, 0.94).fillRoundedRect(panelX, panelY, panelW, panelH, 12);
    bg.lineStyle(2, 0xffd700, 0.9).strokeRoundedRect(panelX, panelY, panelW, panelH, 12);
    this.layer.add(bg);

    const title = this.add.text(W / 2, panelY + 22, '📖 What do you want to know about?', {
      fontSize: '17px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5);
    this.layer.add(title);

    const cols = 2, colW = (panelW - 60) / cols, rowH = 44;
    const gridX = panelX + 30, gridY = panelY + 56;

    TOPICS.forEach((topic, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const bx = gridX + col * colW + colW / 2;
      const by = gridY + row * rowH + rowH / 2;
      const btn = this.add.text(bx, by, topic.title, {
        fontSize: '14px', fontFamily: 'monospace', color: '#ffffff',
        backgroundColor: '#1a1a2e', padding: { x: 10, y: 8 },
        align: 'center', fixedWidth: colW - 12,
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#3a3a5e' }));
      btn.on('pointerout',  () => btn.setStyle({ backgroundColor: '#1a1a2e' }));
      btn.on('pointerdown', () => this.renderDetail(topic));
      this.layer.add(btn);
    });

    const closeBtn = this.add.text(W / 2, panelY + panelH - 26, 'Close', {
      fontSize: '15px', fontFamily: 'monospace', color: '#ff8080',
      backgroundColor: '#00000090', padding: { x: 16, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', this.closeGuide, this);
    this.layer.add(closeBtn);
  }

  private renderDetail(topic: GuideTopic) {
    this.clearLayer();
    const W = this.scale.width, H = this.scale.height;
    const panelW = 560, panelH = 420;
    const panelX = W / 2 - panelW / 2, panelY = H / 2 - panelH / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a14, 0.94).fillRoundedRect(panelX, panelY, panelW, panelH, 12);
    bg.lineStyle(2, 0xffd700, 0.9).strokeRoundedRect(panelX, panelY, panelW, panelH, 12);
    this.layer.add(bg);

    const title = this.add.text(W / 2, panelY + 26, topic.title, {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5);
    this.layer.add(title);

    // ── Scrollable body area ──────────────────────────────────────────────
    // Strictly confined between the title and the Back button: viewY starts
    // below the title, and viewY + viewH ends above the Back button, with a
    // clipping camera enforcing that boundary so text can never visually
    // overlap either one, no matter how long the topic is.
    const viewX = panelX + 24, viewY = panelY + 58;
    const viewW = panelW - 48 - 16; // leave a little room for the scrollbar
    const viewH = panelH - 100;     // room above for title, below for Back button

    const body = this.add.text(viewX, viewY, topic.lines.join('\n\n'), {
      fontSize: '15px', fontFamily: 'monospace', color: '#ffffff',
      wordWrap: { width: viewW }, lineSpacing: 8,
    });
    this.scrollBody = body;

    // A camera whose viewport is exactly the text box. Only this camera
    // draws `body`; the main camera draws everything else (bg, title,
    // buttons, scrollbar) but skips `body`, so the two never double-render
    // and the viewport's edges become a hard, reliable clip boundary.
    const scrollCam = this.cameras.add(viewX, viewY, viewW, viewH);
    scrollCam.setScroll(viewX, viewY);
    scrollCam.ignore(this.layer);
    this.cameras.main.ignore(body);
    this.scrollCam = scrollCam;

    const maxScroll = Math.max(0, body.height - viewH);
    let scrollY = 0;

    // Scrollbar track + thumb (only shown if there's actually overflow)
    let thumb: Phaser.GameObjects.Rectangle | undefined;
    if (maxScroll > 0) {
      const trackX = viewX + viewW + 10;
      const track = this.add.rectangle(trackX, viewY + viewH / 2, 4, viewH, 0x2a2a3e).setOrigin(0.5);
      this.layer.add(track);
      const thumbH = Math.max(24, viewH * (viewH / body.height));
      thumb = this.add.rectangle(trackX, viewY + thumbH / 2, 6, thumbH, 0xffd700).setOrigin(0.5);
      this.layer.add(thumb);

      const hint = this.add.text(trackX - 18, viewY - 16, '⇅ scroll', {
        fontSize: '10px', fontFamily: 'monospace', color: '#606080',
      }).setOrigin(0.5);
      this.layer.add(hint);
    }

    const applyScroll = () => {
      body.y = viewY - scrollY;
      if (thumb) {
        const t = maxScroll > 0 ? scrollY / maxScroll : 0;
        thumb.y = viewY + thumb.height / 2 + t * (viewH - thumb.height);
      }
    };

    this.wheelHandler = (_pointer, _objs, _dx, dy) => {
      scrollY = Phaser.Math.Clamp(scrollY + dy * 0.5, 0, maxScroll);
      applyScroll();
    };
    this.input.on('wheel', this.wheelHandler);

    // Keyboard scrolling (Up/Down arrows), bound at the window level so it
    // works regardless of which element currently has focus.
    this.scrollKeyHandler = (event: KeyboardEvent) => {
      if (event.code === 'ArrowDown') { scrollY = Phaser.Math.Clamp(scrollY + 28, 0, maxScroll); applyScroll(); }
      if (event.code === 'ArrowUp')   { scrollY = Phaser.Math.Clamp(scrollY - 28, 0, maxScroll); applyScroll(); }
    };
    window.addEventListener('keydown', this.scrollKeyHandler);

    const backBtn = this.add.text(W / 2, panelY + panelH - 26, '◀ Back to topics', {
      fontSize: '15px', fontFamily: 'monospace', color: '#a0d0ff',
      backgroundColor: '#00000090', padding: { x: 16, y: 6 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    backBtn.on('pointerdown', () => this.renderList());
    this.layer.add(backBtn);
  }
}

export default GuideScene;