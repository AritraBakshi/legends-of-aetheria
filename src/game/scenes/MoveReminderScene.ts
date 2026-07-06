import Phaser from 'phaser';
import { gameState } from '../GameState';
import { getCreatureById } from '../data/creatures';
import { getMoveById } from '../data/moves';

export class MoveReminderScene extends Phaser.Scene {
  constructor() { super('MoveReminder'); }

  create() {
    const W = 640, H = 480;
    const pw = 440;

    const close = () => {
      const ow = this.scene.get('Overworld') as Phaser.Scene & { onMoveReminderClosed?: () => void };
      ow?.onMoveReminderClosed?.();
      this.scene.stop('MoveReminder');
    };

    // ── Dim background ──────────────────────────────────────────────────────
    const dim = this.add.graphics();
    dim.fillStyle(0x000000, 0.6).fillRect(0, 0, W, H);
    dim.setInteractive(); // block click-through

    // Panel + title graphics are rebuilt by drawPanel() each time we switch
    // between the creature list and the move list, since they need different
    // heights. We keep references so we can destroy/redraw just these.
    let panelGfx: Phaser.GameObjects.Graphics | null = null;
    let titleTxt: Phaser.GameObjects.Text | null = null;
    let geo = { sx: 0, sy: 0, pw, ph: 0 };

    const drawPanel = (ph: number) => {
      panelGfx?.destroy();
      titleTxt?.destroy();

      const sx = Math.floor((W - pw) / 2);
      const sy = Math.floor((H - ph) / 2);
      geo = { sx, sy, pw, ph };

      panelGfx = this.add.graphics();
      panelGfx.fillStyle(0x0d1a2e, 0.97).fillRoundedRect(sx, sy, pw, ph, 10);
      panelGfx.lineStyle(3, 0xffd700).strokeRoundedRect(sx, sy, pw, ph, 10);

      titleTxt = this.add.text(sx + pw / 2, sy + 14, '📖  Move Reminder', {
        fontSize: '17px', fontFamily: 'monospace', color: '#ffd700',
      }).setOrigin(0.5, 0);
    };

    const clearRows = () => {
      this.children.list
        .filter(c => (c as Phaser.GameObjects.GameObject).getData('mrRow'))
        .forEach(c => c.destroy());
    };

    const renderCreatureList = () => {
      const rowH = 38;
      const headerH = 46;
      const footerH = 34;
      const ph = headerH + Math.max(gameState.party.length, 1) * rowH + footerH;

      clearRows();
      drawPanel(ph);
      const { sx, sy, pw } = geo;

      if (gameState.party.length === 0) {
        this.add.text(sx + pw / 2, sy + ph / 2, 'No creatures in party!', {
          fontSize: '14px', fontFamily: 'monospace', color: '#607090',
        }).setOrigin(0.5).setData('mrRow', true);
      }

      gameState.party.forEach((c, i) => {
        const data = getCreatureById(c.dataId);
        if (!data) return;
        const ry = sy + headerH + i * rowH;
        const rb = this.add.graphics().setData('mrRow', true);
        rb.fillStyle(0x0e1e3a).fillRoundedRect(sx + 10, ry, pw - 20, 32, 5);
        rb.lineStyle(1, 0x304060).strokeRoundedRect(sx + 10, ry, pw - 20, 32, 5);
        this.add.text(sx + 24, ry + 9, `${data.name}  Lv.${c.level}`, {
          fontSize: '13px', fontFamily: 'monospace', color: '#c0e0ff',
        }).setData('mrRow', true);
        this.add.text(sx + pw - 20, ry + 9, `${c.moves.length}/4`, {
          fontSize: '11px', fontFamily: 'monospace', color: '#607090',
        }).setOrigin(1, 0).setData('mrRow', true);
        const hit = this.add.rectangle(sx + pw / 2, ry + 16, pw - 20, 32, 0, 0)
          .setInteractive({ useHandCursor: true }).setData('mrRow', true);
        hit.on('pointerdown', () => renderMoveList(i));
      });

      this.add.text(sx + pw / 2, sy + ph - 12, '[ Close ]', {
        fontSize: '13px', fontFamily: 'monospace', color: '#ff8080',
      }).setOrigin(0.5, 1).setInteractive({ useHandCursor: true })
        .setData('mrRow', true)
        .on('pointerdown', close);
    };

    const renderMoveList = (ci: number) => {
      const creature = gameState.party[ci];
      const data = getCreatureById(creature.dataId)!;
      const learnables = data.learnset.filter(l => l.level <= creature.level);

      const rowH = 34;
      const headerH = 56; // extra room for the subtitle line
      const footerH = 34;
      const ph = headerH + Math.max(learnables.length, 1) * rowH + footerH;

      clearRows();
      drawPanel(ph);
      const { sx, sy, pw } = geo;

      this.add.text(sx + pw / 2, sy + 36, `${data.name} — pick a move to remember:`, {
        fontSize: '11px', fontFamily: 'monospace', color: '#a0c0e0',
      }).setOrigin(0.5, 0).setData('mrRow', true);

      learnables.forEach((entry, i) => {
        const move = getMoveById(entry.moveId);
        if (!move) return;
        const already = creature.moves.some(m => m.moveId === entry.moveId);
        const ry = sy + headerH + i * rowH;

        const rb = this.add.graphics().setData('mrRow', true);
        rb.fillStyle(already ? 0x0a1a10 : 0x0e1e3a).fillRoundedRect(sx + 10, ry, pw - 20, 28, 4);
        rb.lineStyle(1, already ? 0x206040 : 0x304060).strokeRoundedRect(sx + 10, ry, pw - 20, 28, 4);

        this.add.text(sx + 22, ry + 7, move.name, {
          fontSize: '12px', fontFamily: 'monospace', color: already ? '#40c060' : '#c0e0ff',
        }).setData('mrRow', true);
        this.add.text(sx + 185, ry + 7, `Lv.${entry.level}`, {
          fontSize: '10px', fontFamily: 'monospace', color: '#607090',
        }).setData('mrRow', true);
        this.add.text(sx + 245, ry + 7, move.type, {
          fontSize: '10px', fontFamily: 'monospace', color: '#8090a0',
        }).setData('mrRow', true);
        this.add.text(sx + pw - 14, ry + 7, already ? '✓ Known' : 'TEACH', {
          fontSize: '11px', fontFamily: 'monospace',
          color: already ? '#206040' : '#ffffff',
          backgroundColor: already ? '#0a2010' : '#204080',
          padding: { x: 4, y: 1 },
        }).setOrigin(1, 0).setData('mrRow', true);

        if (!already) {
          this.add.rectangle(sx + pw / 2, ry + 14, pw - 20, 28, 0, 0)
            .setInteractive({ useHandCursor: true })
            .setData('mrRow', true)
            .on('pointerdown', () => {
              if (creature.moves.length < 4) {
                creature.moves.push({ moveId: entry.moveId, pp: move.pp, maxPp: move.pp });
              } else {
                creature.moves.shift();
                creature.moves.push({ moveId: entry.moveId, pp: move.pp, maxPp: move.pp });
              }
              renderMoveList(ci);
            });
        }
      });

      this.add.text(sx + 18, sy + ph - 12, '◀ Back', {
        fontSize: '12px', fontFamily: 'monospace', color: '#80d0ff',
        backgroundColor: '#0e1830', padding: { x: 4, y: 2 },
      }).setOrigin(0, 1).setInteractive({ useHandCursor: true })
        .setData('mrRow', true)
        .on('pointerdown', renderCreatureList);

      this.add.text(sx + pw - 18, sy + ph - 12, '[ Close ]', {
        fontSize: '12px', fontFamily: 'monospace', color: '#ff8080',
      }).setOrigin(1, 1).setInteractive({ useHandCursor: true })
        .setData('mrRow', true)
        .on('pointerdown', close);
    };

    renderCreatureList();
    this.input.keyboard!.once('keydown-ESC', close);
  }
}

export default MoveReminderScene;