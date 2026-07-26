import Phaser from 'phaser';

export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Bridges the on-screen touch controls (rendered in React, outside the
 * Phaser canvas) with the game scenes. Scenes poll `touchInput.left/right/up/down`
 * for movement (same shape as Phaser's CursorKeys) and listen for the
 * 'interact' / 'menu' events for button taps.
 */
class TouchInputController extends Phaser.Events.EventEmitter {
  up = false;
  down = false;
  left = false;
  right = false;

  setDirection(dir: Direction, active: boolean) {
    this[dir] = active;
  }

  interact() {
    this.emit('interact');
  }

  menu() {
    this.emit('menu');
  }

  clearDirections() {
    this.up = this.down = this.left = this.right = false;
  }
}

export const touchInput = new TouchInputController();

/** True if the device looks like a touch/coarse-pointer device (phones, tablets). */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(pointer: coarse)').matches ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}
