import Phaser from 'phaser';

interface BlackoutConfig {
  locationName: string;
}

/**
 * Full-screen "YOU BLACKED OUT!" message shown after losing a battle.
 *
 * This must be its own Scene rather than something BattleScene draws
 * directly: by the time this needs to show, `this.scene.stop('Battle')`
 * has already run as part of the battle -> overworld handoff, and nothing
 * added to an already-stopped scene ever renders. Launching a separate
 * scene (same pattern as LocationBanner/ConfirmPrompt/Guide) sidesteps
 * that timing issue entirely.
 */
export class BlackoutScene extends Phaser.Scene {
  constructor() { super({ key: 'Blackout', active: false }); }

  create({ locationName }: BlackoutConfig) {
    const W = this.scale.width, H = this.scale.height;

    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 1).fillRect(0, 0, W, H);

    this.add.text(W / 2, H / 2 - 20, 'YOU BLACKED OUT!', {
      fontSize: '28px', fontFamily: 'monospace', color: '#ff4444', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 20,
      `You lost the battle, so you were transported to the nearest healing area in "${locationName}".`, {
      fontSize: '14px', fontFamily: 'monospace', color: '#aaaaaa', align: 'center',
      wordWrap: { width: W - 80 },
    }).setOrigin(0.5);

    const tapText = this.add.text(W / 2, H - 30, 'Tap to continue', {
      fontSize: '12px', fontFamily: 'monospace', color: '#707070',
    }).setOrigin(0.5);
    this.tweens.add({ targets: tapText, alpha: 0.3, yoyo: true, repeat: -1, duration: 700 });

    const dismiss = () => this.scene.stop();
    this.input.once('pointerdown', dismiss);
    this.input.keyboard?.once('keydown-ENTER', dismiss);
    this.input.keyboard?.once('keydown-Z', dismiss);
    // Auto-dismiss too, in case the player doesn't interact
    this.time.delayedCall(3500, dismiss);
  }
}

export default BlackoutScene;