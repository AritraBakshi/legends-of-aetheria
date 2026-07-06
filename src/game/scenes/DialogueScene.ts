import Phaser from 'phaser';

interface DialogueConfig {
  lines: string[];
  speakerName?: string;
  onComplete?: () => void;
}

export class DialogueScene extends Phaser.Scene {
  private config!: DialogueConfig;
  private lineIndex = 0;
  private isTyping = false;
  private currentText!: Phaser.GameObjects.Text;
  private fullText = '';
  private typeTimer!: Phaser.Time.TimerEvent;
  private charIndex = 0;
  private canAdvance = false;
  private arrow!: Phaser.GameObjects.Text;
  private boxBg!: Phaser.GameObjects.Graphics;
  private speakerText!: Phaser.GameObjects.Text;
  private pointerDownHandler = () => this.advance();

  constructor() { super({ key: 'Dialogue', active: false }); }

  init(data: DialogueConfig) {
    this.config = data;
    this.lineIndex = 0;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;
    const boxH = 110;
    const boxY = H - boxH - 16;
    const padX = 16;

    // Semi-transparent overlay at bottom
    this.boxBg = this.add.graphics();
    this.boxBg.fillStyle(0x000000, 0.75).fillRect(padX, boxY, W - padX * 2, boxH);
    this.boxBg.lineStyle(3, 0xffd700).strokeRoundedRect(padX, boxY, W - padX * 2, boxH, 8);

    // Speaker name badge
    if (this.config.speakerName) {
      const nameBg = this.add.graphics();
      nameBg.fillStyle(0x1a1a2e).fillRoundedRect(padX + 10, boxY - 22, this.config.speakerName.length * 11 + 20, 26, 6);
      nameBg.lineStyle(2, 0xffd700).strokeRoundedRect(padX + 10, boxY - 22, this.config.speakerName.length * 11 + 20, 26, 6);
      this.speakerText = this.add.text(padX + 20, boxY - 14, this.config.speakerName, {
        fontSize: '14px', fontFamily: 'monospace', color: '#ffd700',
      }).setOrigin(0, 0.5);
    }

    // Main dialogue text
    this.currentText = this.add.text(padX + 18, boxY + 16, '', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffffff',
      wordWrap: { width: W - padX * 2 - 36 }, lineSpacing: 6,
    });

    // Next arrow
    this.arrow = this.add.text(W - padX - 20, boxY + boxH - 20, '▼', {
      fontSize: '16px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(1, 1).setAlpha(0);
    this.tweens.add({ targets: this.arrow, alpha: 1, y: this.arrow.y - 4, duration: 400, yoyo: true, repeat: -1 });

    // Show first line
    this.showLine();

    // Input handlers
    this.input.keyboard!.on('keydown-Z', () => this.advance());
    this.input.keyboard!.on('keydown-ENTER', () => this.advance());
    this.input.keyboard!.on('keydown-SPACE', () => this.advance());
    this.input.on('pointerdown', this.pointerDownHandler);
  }

  private showLine() {
    this.canAdvance = false;
    this.isTyping = true;
    this.charIndex = 0;
    this.fullText = this.config.lines[this.lineIndex];
    this.currentText.setText('');
    this.arrow.setAlpha(0);

    this.typeTimer = this.time.addEvent({
      delay: 30,
      callback: () => {
        this.charIndex++;
        this.currentText.setText(this.fullText.substring(0, this.charIndex));
        if (this.charIndex >= this.fullText.length) {
          this.isTyping = false;
          this.canAdvance = true;
          this.arrow.setAlpha(1);
          if (this.typeTimer) this.typeTimer.destroy();
        }
      },
      repeat: this.fullText.length - 1,
    });
  }

  private advance() {
    if (this.isTyping) {
      // Skip to full text
      if (this.typeTimer) this.typeTimer.destroy();
      this.currentText.setText(this.fullText);
      this.isTyping = false;
      this.canAdvance = true;
      this.arrow.setAlpha(1);
      return;
    }
    if (!this.canAdvance) return;
    this.lineIndex++;
    if (this.lineIndex >= this.config.lines.length) {
      // Done
      this.input.keyboard!.off('keydown-Z');
      this.input.keyboard!.off('keydown-ENTER');
      this.input.keyboard!.off('keydown-SPACE');
      this.input.off('pointerdown', this.pointerDownHandler);
      this.scene.stop('Dialogue');
      if (this.config.onComplete) this.config.onComplete();
    } else {
      this.showLine();
    }
  }
}

export default DialogueScene;
