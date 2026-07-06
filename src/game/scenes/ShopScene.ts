import Phaser from 'phaser';
import type { NPC } from '../data/types';
import { getItemById } from '../data/items';
import { gameState } from '../GameState';

interface ShopConfig { npc: NPC; }

export class ShopScene extends Phaser.Scene {
  constructor() { super('Shop'); }

  create({ npc }: ShopConfig) {
    const W = 640, H = 480;
    if (!npc.shopItems?.length) { this.closeShop(); return; }

    const items = npc.shopItems;
    const rowH = 46;
    const shopW = 420;
    const shopH = 56 + items.length * rowH + 44;   // header + rows + footer
    const sx = Math.floor((W - shopW) / 2);
    const sy = Math.floor((H - shopH) / 2);

    // ── Dim background ────────────────────────────────────────────────────────
    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.55).fillRect(0, 0, W, H);
    dim.setInteractive(); // absorb clicks so overworld doesn't receive them

    // ── Panel ─────────────────────────────────────────────────────────────────
    const panel = this.add.graphics();
    panel.fillStyle(0x0d1a2e, 0.97).fillRoundedRect(sx, sy, shopW, shopH, 10);
    panel.lineStyle(3, 0xffd700).strokeRoundedRect(sx, sy, shopW, shopH, 10);

    // Title + money
    this.add.text(sx + shopW / 2, sy + 14, '🛒  SHOP', {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5, 0);

    const moneyTxt = this.add.text(sx + shopW - 14, sy + 14, `¢${gameState.money}`, {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(1, 0);

    // ── Item rows ─────────────────────────────────────────────────────────────
    const renderRows = () => {
      // Destroy previous rows (everything after the first 4 fixed elements)
      this.children.list
        .filter(c => (c as Phaser.GameObjects.GameObject).getData('shopRow'))
        .forEach(c => c.destroy());

      items.forEach((shopItem: { id: number; price: number }, i: number) => {
        const item = getItemById(shopItem.id);
        if (!item) return;
        const iy = sy + 52 + i * rowH;
        const canAfford = gameState.money >= shopItem.price;

        const rowBg = this.add.graphics().setData('shopRow', true);
        rowBg.fillStyle(canAfford ? 0x0e1e3a : 0x080e1a).fillRoundedRect(sx + 8, iy, shopW - 16, rowH - 4, 5);

        const nameTxt = this.add.text(sx + 18, iy + 5, item.name, {
          fontSize: '14px', fontFamily: 'monospace', color: canAfford ? '#c0e0ff' : '#506070',
        }).setData('shopRow', true);

        const descTrunc = item.description.length > 25 ? item.description.slice(0, 25) + '…' : item.description;
        this.add.text(sx + 18, iy + 24, descTrunc, {
          fontSize: '10px', fontFamily: 'monospace', color: '#405060',
        }).setData('shopRow', true);

        this.add.text(sx + shopW - 88, iy + 12, `¢${shopItem.price}`, {
          fontSize: '13px', fontFamily: 'monospace', color: canAfford ? '#ffd700' : '#705820',
        }).setData('shopRow', true);

        const buyBtn = this.add.text(sx + shopW - 10, iy + 11, 'BUY', {
          fontSize: '13px', fontFamily: 'monospace',
          color:           canAfford ? '#ffffff' : '#303030',
          backgroundColor: canAfford ? '#1a50b0' : '#151515',
          padding: { x: 8, y: 3 },
        }).setOrigin(1, 0).setData('shopRow', true);

        if (canAfford) {
          buyBtn.setInteractive({ useHandCursor: true });
          buyBtn.on('pointerover', () => buyBtn.setStyle({ backgroundColor: '#3080ff' }));
          buyBtn.on('pointerout',  () => buyBtn.setStyle({ backgroundColor: '#1a50b0' }));
          buyBtn.on('pointerdown', () => {
            gameState.money -= shopItem.price;
            gameState.addItem(shopItem.id, 1);
            moneyTxt.setText(`¢${gameState.money}`);
            renderRows(); // rebuild to grey out newly unaffordable items
          });
        }
      });
    };

    renderRows();

    // ── Close button ──────────────────────────────────────────────────────────
    const closeY = sy + 52 + items.length * rowH + 6;
    const closeBtn = this.add.text(sx + shopW / 2, closeY, '[ Close Shop ]', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ff8080',
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setColor('#ffaaaa'));
    closeBtn.on('pointerout',  () => closeBtn.setColor('#ff8080'));
    closeBtn.on('pointerdown', () => this.closeShop());

    this.input.keyboard!.once('keydown-ESC', () => this.closeShop());
  }

  private closeShop() {
    // Tell the overworld the shop is done
    const ow = this.scene.get('Overworld') as Phaser.Scene & { onShopClosed?: () => void };
    ow?.onShopClosed?.();
    this.scene.stop('Shop');
  }
}
