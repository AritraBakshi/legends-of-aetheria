import Phaser from 'phaser';
import type { NPC } from '../data/types';
import { getItemById } from '../data/items';
import { gameState } from '../GameState';
import { createScrollArea, type ScrollAreaHandle } from './scrollArea';

interface ShopConfig { npc: NPC; }

export class ShopScene extends Phaser.Scene {
  constructor() { super('Shop'); }

  create({ npc }: ShopConfig) {
    const W = 640, H = 480;
    if (!npc.shopItems?.length) { this.closeShop(); return; }

    const items = npc.shopItems;
    const rowH = 46;
    const shopW = 420;
    const headerH = 52;
    const footerH = 44;
    // Panel height is capped so a big shop's item list scrolls (and clips)
    // instead of the whole panel growing past the screen.
    const maxShopH = H - 32;
    const naturalH = headerH + items.length * rowH + footerH;
    const shopH = Math.min(naturalH, maxShopH);
    const listH = shopH - headerH - footerH;
    const sx = Math.floor((W - shopW) / 2);
    const sy = Math.floor((H - shopH) / 2);

    let scrollHandle: ScrollAreaHandle | null = null;

    // ── Dim background ────────────────────────────────────────────────────────
    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.55).fillRect(0, 0, W, H);
    dim.setInteractive(); // absorb clicks so overworld doesn't receive them

    // ── Panel ─────────────────────────────────────────────────────────────────
    const panel = this.add.graphics();
    panel.fillStyle(0x0d1a2e, 0.97).fillRoundedRect(sx, sy, shopW, shopH, 10);
    panel.lineStyle(3, 0xffd700).strokeRoundedRect(sx, sy, shopW, shopH, 10);

    // Title + money
    const titleTxt = this.add.text(sx + shopW / 2, sy + 14, '🛒  SHOP', {
      fontSize: '18px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(0.5, 0);

    const moneyTxt = this.add.text(sx + shopW - 14, sy + 14, `¢${gameState.money}`, {
      fontSize: '14px', fontFamily: 'monospace', color: '#ffd700',
    }).setOrigin(1, 0);

    // ── Close button (always visible, outside the scroll area) ─────────────────
    const closeBtn = this.add.text(sx + shopW / 2, sy + shopH - footerH + 6, '[ Close Shop ]', {
      fontSize: '14px', fontFamily: 'monospace', color: '#ff8080',
    }).setOrigin(0.5, 0).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerover', () => closeBtn.setColor('#ffaaaa'));
    closeBtn.on('pointerout',  () => closeBtn.setColor('#ff8080'));
    closeBtn.on('pointerdown', () => this.closeShop());

    // ── Scrollable, clipped item rows ───────────────────────────────────────────
    const renderRows = () => {
      scrollHandle?.destroy();
      scrollHandle = createScrollArea(
        this, sx + 8, sy + headerH, shopW - 16, listH,
        items.length * rowH,
        [dim, panel, titleTxt, moneyTxt, closeBtn],
        { rowStep: rowH },
      );
      const rows = scrollHandle.container;

      items.forEach((shopItem: { id: number; price: number }, i: number) => {
        const item = getItemById(shopItem.id);
        if (!item) return;
        const iy = i * rowH;
        const canAfford = gameState.money >= shopItem.price;

        const rowBg = this.add.graphics();
        rowBg.fillStyle(canAfford ? 0x0e1e3a : 0x080e1a).fillRoundedRect(0, iy, shopW - 16, rowH - 4, 5);
        rows.add(rowBg);

        rows.add(this.add.text(10, iy + 5, item.name, {
          fontSize: '14px', fontFamily: 'monospace', color: canAfford ? '#c0e0ff' : '#506070',
        }));

        const descTrunc = item.description.length > 25 ? item.description.slice(0, 25) + '…' : item.description;
        rows.add(this.add.text(10, iy + 24, descTrunc, {
          fontSize: '10px', fontFamily: 'monospace', color: '#405060',
        }));

        rows.add(this.add.text(shopW - 96, iy + 12, `¢${shopItem.price}`, {
          fontSize: '13px', fontFamily: 'monospace', color: canAfford ? '#ffd700' : '#705820',
        }));

        const buyBtn = this.add.text(shopW - 18, iy + 11, 'BUY', {
          fontSize: '13px', fontFamily: 'monospace',
          color:           canAfford ? '#ffffff' : '#303030',
          backgroundColor: canAfford ? '#1a50b0' : '#151515',
          padding: { x: 8, y: 3 },
        }).setOrigin(1, 0);
        rows.add(buyBtn);

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

    this.input.keyboard!.once('keydown-ESC', () => this.closeShop());

    // Belt-and-suspenders: if the scene stops any other way, still clean up
    // the scroll camera/listeners rather than leaking them.
    this.events.once('shutdown', () => { scrollHandle?.destroy(); scrollHandle = null; });
  }

  private closeShop() {
    // Tell the overworld the shop is done
    const ow = this.scene.get('Overworld') as Phaser.Scene & { onShopClosed?: () => void };
    ow?.onShopClosed?.();
    this.scene.stop('Shop');
  }
}
