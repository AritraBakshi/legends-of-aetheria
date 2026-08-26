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
 */
export function fitImageToBox<T extends Phaser.GameObjects.Image>(img: T, box: number): T {
  const scale = Math.min(box / img.width, box / img.height);
  img.setScale(scale);
  return img;
}
