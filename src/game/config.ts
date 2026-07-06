import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import TitleScene from './scenes/TitleScene';
import StarterScene from './scenes/StarterScene';
import OverworldScene from './scenes/OverworldScene';
import BattleScene from './scenes/BattleScene';
import MenuScene from './scenes/MenuScene';
import DialogueScene from './scenes/DialogueScene';
import { ShopScene } from './scenes/ShopScene';
import MoveReminderScene from './scenes/MoveReminderScene';

const BASE_WIDTH = 640;
const BASE_HEIGHT = 480;

export function createGame(parent: HTMLElement): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    parent,
    backgroundColor: '#000000',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: BASE_WIDTH,
      height: BASE_HEIGHT,
      min: { width: 320, height: 240 },
      max: { width: 1920, height: 1440 },
    },
    physics: {
      default: 'arcade',
      arcade: { debug: false, gravity: { x: 0, y: 0 } },
    },
    scene: [
      BootScene,
      TitleScene,
      StarterScene,
      OverworldScene,
      BattleScene,
      MenuScene,
      DialogueScene,
      ShopScene,
      MoveReminderScene,
    ],
    input: {
      keyboard: true,
      mouse: true,
      touch: true,
    },
    dom: { createContainer: false },
  };

  return new Phaser.Game(config);
}
