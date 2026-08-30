import Phaser from 'phaser';

/**
 * Scales an image to fit within a `box` x `box` square while preserving its
 * native aspect ratio (like CSS `object-fit: contain`) — used everywhere a
 * creature sprite is shown at a fixed slot size.
 *
 * Replaces the old pattern of `.setDisplaySize(box, box)`, which forces
 * every sprite into a perfect square regardless of its actual dimensions.
 * Since creature art isn't uniform (some sprites are ~1:1, some are
 * noticeably wide/flat like Sparkit and Thornbud at roughly 2:1, some are
 * tall/narrow), that squared-off approach visibly squishes/stretches many
 * sprites. This scales uniformly instead, so a sprite is never distorted —
 * it's simply scaled up or down (in both directions equally) to fit inside
 * the box, same treatment whether the source art is larger or smaller than
 * the target slot.
 *
 * IMPORTANT: the scale is computed from the sprite's *drawn content*, not
 * its raw PNG canvas size. Several source files have transparent padding
 * baked in (e.g. Sparkit/Thornbud's canvases are ~2.15:1, but the creature
 * art inside is only ~1.5:1 and fills just ~65% of the canvas width). Fitting
 * against the raw canvas would size those creatures ~35% smaller than a
 * tightly-cropped sprite even though both are "fit to the box" — exactly
 * the inconsistent-sizing bug real sprite sheets avoid by trimming first.
 * Trimming the transparent margin before computing scale keeps every
 * creature's actual art proportional to the same box, like normal games do.
 */

interface ContentBounds { x: number; y: number; width: number; height: number }

const boundsCache = new Map<string, ContentBounds>();

/** Alpha values at/below this are treated as transparent padding. */
const ALPHA_THRESHOLD = 10;

/**
 * Scans a decoded RGBA buffer and returns the bounding box of non-transparent
 * pixels. Pure/DOM-free so it can be unit tested directly with synthetic
 * pixel buffers, and reused by the (canvas-backed) runtime lookup below.
 */
export function computePixelBounds(data: Uint8ClampedArray | Uint8Array, w: number, h: number): ContentBounds {
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const alpha = data[(y * w + x) * 4 + 3];
      if (alpha > ALPHA_THRESHOLD) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < minX || maxY < minY) {
    // Fully transparent (or empty) image — fall back to the full frame.
    return { x: 0, y: 0, width: w, height: h };
  }
  return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

/**
 * Given a source frame size, its trimmed content bounds, and a target box,
 * returns the scale to apply and the *normalized origin* (0..1 fraction of
 * the frame) that puts the trimmed content's center — not the padded
 * frame's center — at the image's (x, y).
 *
 * Using origin instead of nudging img.x/img.y is important: `fitImageToBox`
 * gets called again on the same Image object after `setTexture()`
 * (evolutions, switching creatures, enemy swaps), and any given Image may
 * also be mid-tween on x/y at that point. Origin is fully self-contained and
 * idempotent — recomputing it doesn't depend on or disturb the sprite's
 * current position, so repeated re-fits can't drift it off its slot.
 * Pure math, no Phaser/DOM dependency, so it's directly unit-testable.
 */
export function computeFitTransform(frameW: number, frameH: number, bounds: ContentBounds, box: number) {
  const scale = Math.min(box / bounds.width, box / bounds.height);
  const originX = (bounds.x + bounds.width / 2) / frameW;
  const originY = (bounds.y + bounds.height / 2) / frameH;
  return { scale, originX, originY };
}

function getContentBounds(img: Phaser.GameObjects.Image): ContentBounds {
  const key = img.texture.key;
  const cached = boundsCache.get(key);
  if (cached) return cached;

  const w = img.width;
  const h = img.height;
  let bounds: ContentBounds = { x: 0, y: 0, width: w, height: h };

  try {
    const src = img.texture.getSourceImage() as CanvasImageSource;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.drawImage(src, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);
      bounds = computePixelBounds(data, w, h);
    }
  } catch {
    // Canvas readback can fail (e.g. tainted canvas) — fall back to the
    // untrimmed frame rather than throwing, matching the old behavior.
  }

  boundsCache.set(key, bounds);
  return bounds;
}

export function fitImageToBox<T extends Phaser.GameObjects.Image>(img: T, box: number): T {
  const bounds = getContentBounds(img);
  const { scale, originX, originY } = computeFitTransform(img.width, img.height, bounds, box);
  img.setScale(scale);
  img.setOrigin(originX, originY);
  return img;
}