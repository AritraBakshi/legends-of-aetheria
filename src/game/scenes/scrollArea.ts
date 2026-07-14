import Phaser from 'phaser';

export interface ScrollAreaHandle {
  /** Add row content into this container, at local (x, index * rowStep) —
   * no manual scroll offset, no visibility filtering. It's already
   * positioned/clipped for you. */
  container: Phaser.GameObjects.Container;
  /** Call when the view closes or rebuilds, to tear down the camera,
   * scrollbar, and input listeners. */
  destroy: () => void;
}

/**
 * Creates a smoothly-scrollable, properly clipped list area using a
 * dedicated camera scoped to the given viewport rectangle — the technique
 * introduced for the Guide NPC's help screen and later the Trainer Menu.
 * Works in any Scene, since clipping via a camera's own viewport is a hard
 * boundary regardless of renderer (unlike GeometryMask, which isn't
 * reliably renderer-agnostic), and avoids the older "rebuild every row on
 * every scroll tick + paint a colour-matched rectangle over the overflow"
 * approach, which required the cover colour to exactly match the backdrop.
 *
 * @param scene            The scene this list belongs to.
 * @param viewX/viewY      Top-left of the clipped viewport, in scene coords.
 * @param viewW/viewH      Size of the clipped viewport.
 * @param totalContentH    Total height of all rows stacked together.
 * @param ignore           Other objects (panel bg, title, buttons, dimmer)
 *                         that should NOT be visible through this camera —
 *                         typically everything else in the view.
 * @param opts.scrollbarX  X position for the scrollbar track (defaults to
 *                         the viewport's right edge).
 * @param opts.rowStep     Pixels moved per Up/Down key press.
 */
export function createScrollArea(
  scene: Phaser.Scene,
  viewX: number, viewY: number, viewW: number, viewH: number,
  totalContentH: number,
  ignore: Phaser.GameObjects.GameObject[],
  opts: { scrollbarX?: number; scrollbarW?: number; rowStep?: number } = {},
): ScrollAreaHandle {
  const { scrollbarX = viewX + viewW - 2, scrollbarW = 8, rowStep = 32 } = opts;

  const rows = scene.add.container(viewX, viewY);

  const cam = scene.cameras.add(viewX, viewY, viewW, viewH);
  cam.setScroll(viewX, viewY);
  ignore.forEach(o => cam.ignore(o));
  scene.cameras.main.ignore(rows);

  const maxScroll = Math.max(0, totalContentH - viewH);
  let scrollY = 0;
  let wheelHandler: ((...a: unknown[]) => void) | null = null;
  let upHandler: (() => void) | null = null;
  let downHandler: (() => void) | null = null;
  let trackBg: Phaser.GameObjects.Graphics | null = null;
  let thumb: Phaser.GameObjects.Graphics | null = null;

  if (maxScroll > 0) {
    trackBg = scene.add.graphics();
    trackBg.fillStyle(0x1a2a40).fillRoundedRect(scrollbarX, viewY, scrollbarW, viewH, scrollbarW / 2);
    cam.ignore(trackBg);

    const thumbH = Math.max(16, (viewH / totalContentH) * viewH);
    thumb = scene.add.graphics();
    cam.ignore(thumb);

    const applyScroll = () => {
      rows.y = viewY - scrollY;
      const p = scrollY / maxScroll;
      thumb!.clear().fillStyle(0x4080c0)
        .fillRoundedRect(scrollbarX, viewY + p * (viewH - thumbH), scrollbarW, thumbH, scrollbarW / 2);
    };
    applyScroll();

    wheelHandler = (_p: unknown, _g: unknown, _dx: unknown, dy: unknown) => {
      scrollY = Phaser.Math.Clamp(scrollY + (dy as number) * 0.5, 0, maxScroll);
      applyScroll();
    };
    scene.input.on('wheel', wheelHandler);

    upHandler = () => { scrollY = Phaser.Math.Clamp(scrollY - rowStep, 0, maxScroll); applyScroll(); };
    downHandler = () => { scrollY = Phaser.Math.Clamp(scrollY + rowStep, 0, maxScroll); applyScroll(); };
    scene.input.keyboard?.on('keydown-UP', upHandler);
    scene.input.keyboard?.on('keydown-DOWN', downHandler);
  }

  const destroy = () => {
    if (wheelHandler) scene.input.off('wheel', wheelHandler);
    if (upHandler)    scene.input.keyboard?.off('keydown-UP', upHandler);
    if (downHandler)  scene.input.keyboard?.off('keydown-DOWN', downHandler);
    scene.cameras.remove(cam);
    rows.destroy();
    trackBg?.destroy();
    thumb?.destroy();
  };

  return { container: rows, destroy };
}
