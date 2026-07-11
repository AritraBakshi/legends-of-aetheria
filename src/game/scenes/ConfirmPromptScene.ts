import Phaser from 'phaser';

interface ConfirmPromptConfig {
  message: string;
  onYes: () => void;
  onNo: () => void;
}

/**
 * A generic Yes/No confirmation box (currently used for trainer rematch
 * prompts). Runs as its own Scene — same reasoning as LocationBannerScene:
 * OverworldScene's camera zooms in/out per map (indoor vs outdoor), and
 * setScrollFactor(0) only cancels scroll, not zoom, so anything drawn
 * directly in OverworldScene at a fixed pixel position would still get
 * distorted indoors. A separate scene has its own camera, always at zoom 1.
 */
export class ConfirmPromptScene extends Phaser.Scene {
  private config!: ConfirmPromptConfig;

  constructor() { super({ key: 'ConfirmPrompt', active: false }); }

  init(data: ConfirmPromptConfig) {
    this.config = data;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    const boxW = 300, boxH = 88;
    const boxX = W / 2 - boxW / 2, boxY = H / 2 - boxH / 2;

    const bg = this.add.graphics();
    bg.fillStyle(0x0a0a14, 0.92).fillRoundedRect(boxX, boxY, boxW, boxH, 10);
    bg.lineStyle(2, 0xffd700, 0.9).strokeRoundedRect(boxX, boxY, boxW, boxH, 10);

    this.add.text(W / 2, boxY + 24, this.config.message, {
      fontSize: '15px', fontFamily: 'monospace', color: '#ffffff',
      align: 'center', wordWrap: { width: boxW - 24 },
    }).setOrigin(0.5);

    const finish = (choice: () => void) => {
      this.scene.stop();
      choice();
    };

    const yesBtn = this.add.text(W / 2 - 60, boxY + 62, 'Yes', {
      fontSize: '16px', fontFamily: 'monospace', color: '#40ff90',
      backgroundColor: '#00000090', padding: { x: 14, y: 5 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const noBtn = this.add.text(W / 2 + 60, boxY + 62, 'No', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ff6060',
      backgroundColor: '#00000090', padding: { x: 14, y: 5 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    yesBtn.on('pointerdown', () => finish(this.config.onYes));
    noBtn.on('pointerdown', () => finish(this.config.onNo));

    const enterHandler = () => finish(this.config.onYes);
    const escHandler = () => finish(this.config.onNo);
    this.input.keyboard?.once('keydown-ENTER', enterHandler);
    this.input.keyboard?.once('keydown-Z', enterHandler);
    this.input.keyboard?.once('keydown-ESC', escHandler);
  }
}

export default ConfirmPromptScene;
