import Phaser from 'phaser';

interface LocationBannerConfig {
  name: string;
}

/**
 * Shows the "Route 1" / "Earthenhold" style map-name card.
 *
 * This runs as its own Scene (like Dialogue/Menu/Shop) specifically so it has
 * its own camera at zoom 1. OverworldScene's camera zooms in (2x indoors,
 * 1.5x outdoors) to frame the player, and `setScrollFactor(0)` only cancels
 * camera *scroll* — not zoom — so screen-fixed UI drawn directly in
 * OverworldScene still gets scaled/shifted by that zoom. Keeping the banner
 * in its own scene sidesteps that entirely.
 */
export class LocationBannerScene extends Phaser.Scene {
  private config!: LocationBannerConfig;

  constructor() { super({ key: 'LocationBanner', active: false }); }

  init(data: LocationBannerConfig) {
    this.config = data;
  }

  create() {
    const W = this.scale.width;
    const boxY = 88; // clear of the top edge

    const bg = this.add.graphics().setDepth(0).setAlpha(0);
    bg.fillStyle(0x000000, 0.7).fillRoundedRect(W / 2 - 140, boxY, 280, 40, 8);
    bg.lineStyle(2, 0xffd700, 0.8).strokeRoundedRect(W / 2 - 140, boxY, 280, 40, 8);

    const txt = this.add.text(W / 2, boxY + 20, this.config.name, {
      fontSize: '20px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5).setDepth(1).setAlpha(0);

    this.tweens.add({ targets: [bg, txt], alpha: 1, duration: 250, delay: 350 });
    this.tweens.add({
      targets: [bg, txt], alpha: 0, duration: 400, delay: 2600,
      onComplete: () => { bg.destroy(); txt.destroy(); this.scene.stop(); },
    });
  }
}

export default LocationBannerScene;
