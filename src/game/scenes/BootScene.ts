import Phaser from 'phaser';
import { TILE } from '../data/maps';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    for (let id = 1; id <= 30; id++) {
      this.load.image(`creature_${id}`,      `assets/creatures/creature_${id}.png`);
      this.load.image(`creature_${id}_back`, `assets/creatures/creature_${id}_back.png`);
    }
  }

  create() {
    this.generateTileTextures();
    this.generatePlayerSprites();
    // Creature sprites are now real PNGs loaded in preload() above —
    // generateCreatureSprites() is kept in the file as a fallback/reference
    // but is no longer called.
    this.generateNPCSprites();
    this.generateUITextures();
    this.scene.start('Title');
  }

  // ── TILES ────────────────────────────────────────────────────────────────────
  private generateTileTextures() {
    const g = this.add.graphics();
    const T = 32;

    // Grass — base + 3-shade dither pattern + 4 blade clusters
    g.clear()
      .fillStyle(0x4a8c3f).fillRect(0, 0, T, T)
      .fillStyle(0x3d7a33).fillRect(0,0,2,2).fillRect(8,12,2,2).fillRect(18,5,2,2).fillRect(26,20,2,2)
      .fillStyle(0x5aa04a).fillRect(3,7,2,3).fillRect(14,18,2,3).fillRect(22,3,2,3).fillRect(6,24,2,3)
      .fillStyle(0x2d6625).fillRect(1,14,1,2).fillRect(10,2,1,2).fillRect(24,16,1,2).fillRect(16,28,1,2);
    g.generateTexture('tile_grass', T, T);

    // Path — sandy dirt with pebble detail
    g.clear()
      .fillStyle(0xc8a86b).fillRect(0, 0, T, T)
      .fillStyle(0xb8955a).fillRect(2,2,3,2).fillRect(12,8,2,3).fillRect(22,18,3,2).fillRect(6,22,2,3)
      .fillStyle(0xd8b87b).fillRect(8,5,2,2).fillRect(20,14,2,2).fillRect(4,26,2,2).fillRect(26,6,2,2)
      .fillStyle(0xa08050).fillRect(15,20,2,2).fillRect(28,24,2,2).fillRect(10,28,2,2);
    g.generateTexture('tile_path', T, T);

    // Tall Grass — layered blades front and back
    g.clear()
      .fillStyle(0x2a6e27).fillRect(0, 0, T, T)
      // back blades (darker)
      .fillStyle(0x1d5a1a)
      .fillRect(0,0,3,14).fillRect(5,2,3,12).fillRect(10,0,3,13).fillRect(15,1,3,12)
      .fillRect(20,0,3,14).fillRect(25,2,3,12).fillRect(29,0,3,13)
      // mid fill
      .fillStyle(0x327830).fillRect(0, 12, T, 20)
      // front blades (lighter)
      .fillStyle(0x4a9e47)
      .fillRect(1,10,3,22).fillRect(6,8,3,24).fillRect(11,11,3,21).fillRect(16,9,3,23)
      .fillRect(21,10,3,22).fillRect(26,8,3,24)
      // tips
      .fillStyle(0x5dbc58).fillRect(1,8,3,4).fillRect(6,6,3,4).fillRect(11,9,3,4)
      .fillRect(16,7,3,4).fillRect(21,8,3,4).fillRect(26,6,3,4);
    g.generateTexture('tile_tallgrass', T, T);

    // Tree — layered canopy with shadow
    g.clear()
      .fillStyle(0x1a5c18).fillRect(0, 0, T, T)
      .fillStyle(0x135014).fillRect(6,18,4,4).fillRect(16,12,4,4) // inner shadow
      .fillStyle(0x2d8c2a).fillRect(3,3,26,26)
      .fillStyle(0x3aa636).fillRect(5,5,8,8).fillRect(18,5,8,8).fillRect(10,16,12,10)
      .fillStyle(0x1a5c18).fillRect(6,6,4,4).fillRect(20,6,4,4).fillRect(12,18,8,6) // cavities
      .fillStyle(0x4ec04a).fillRect(4,4,3,3).fillRect(24,4,3,3).fillRect(14,14,3,3); // highlights
    g.generateTexture('tile_tree', T, T);

    // Water — animated shimmer pattern
    g.clear()
      .fillStyle(0x2a70c8).fillRect(0, 0, T, T)
      .fillStyle(0x3d90e8).fillRect(0,4,T,6).fillRect(0,16,T,6).fillRect(0,26,T,6)
      .fillStyle(0x5ab0f8).fillRect(4,6,8,2).fillRect(18,8,6,2).fillRect(2,18,10,2)
      .fillRect(20,20,8,2).fillRect(6,28,12,2)
      .fillStyle(0x1a5098).fillRect(0,0,T,2).fillRect(0,T-2,T,2)
      .fillStyle(0x8ad0ff, 0.4).fillRect(8,5,4,1).fillRect(22,17,4,1).fillRect(4,27,4,1);
    g.generateTexture('tile_water', T, T);

    // Wall — stone brick pattern
    g.clear()
      .fillStyle(0x8a7a6a).fillRect(0, 0, T, T)
      .fillStyle(0x6a5a4a) // mortar lines
      .fillRect(0,10,T,2).fillRect(0,22,T,2).fillRect(0,0,2,10).fillRect(0,12,2,10)
      .fillRect(14,0,2,10).fillRect(14,12,2,10).fillRect(14,24,2,8)
      .fillRect(28,0,2,10).fillRect(28,12,2,10)
      .fillStyle(0x9a8a7a) // brick highlights
      .fillRect(4,2,8,6).fillRect(18,2,8,6).fillRect(4,14,8,6).fillRect(18,14,8,6)
      .fillRect(11,24,14,6)
      .fillStyle(0x7a6a5a) // brick shadows
      .fillRect(10,7,2,3).fillRect(24,7,2,3).fillRect(10,19,2,3).fillRect(24,19,3,3);
    g.generateTexture('tile_wall', T, T);

    // Floor — wooden plank look
    g.clear()
      .fillStyle(0xd4c4a8).fillRect(0, 0, T, T)
      .fillStyle(0xc4b498).fillRect(0,0,1,T).fillRect(T-1,0,1,T)
      .fillRect(0,0,T,1).fillRect(0,T-1,T,1)
      .fillStyle(0xb8a88a).fillRect(0,10,T,2).fillRect(0,22,T,2) // plank lines
      .fillStyle(0xe0d0b8).fillRect(2,2,4,8).fillRect(8,12,6,8).fillRect(20,2,6,8); // lighter planks
    g.generateTexture('tile_floor', T, T);

    // Roof — red tiles with ridge lines
    g.clear()
      .fillStyle(0xc05030).fillRect(0, 0, T, T)
      .fillStyle(0xa04028).fillRect(0,6,T,2).fillRect(0,13,T,2).fillRect(0,20,T,2).fillRect(0,27,T,2)
      .fillStyle(0xd86040).fillRect(0,2,T,2).fillRect(0,9,T,2).fillRect(0,16,T,2).fillRect(0,23,T,2)
      .fillStyle(0xe07050).fillRect(4,3,4,1).fillRect(12,3,4,1).fillRect(20,3,4,1)
      .fillRect(4,10,4,1).fillRect(20,10,4,1).fillRect(12,17,4,1).fillRect(20,17,4,1);
    g.generateTexture('tile_roof', T, T);

    // Flower — grass base with 3 flowers
    g.clear()
      .fillStyle(0x4a8c3f).fillRect(0, 0, T, T)
      .fillStyle(0x3d7a33).fillRect(0,0,2,2).fillRect(16,8,2,2).fillRect(26,22,2,2)
      .fillStyle(0x208020).fillRect(6,14,2,8).fillRect(18,8,2,10).fillRect(26,14,2,8) // stems
      .fillStyle(0xffd700).fillCircle(7,12,3).fillCircle(27,12,3)   // yellow flowers
      .fillStyle(0xff8080).fillCircle(19,6,4)                        // pink flower
      .fillStyle(0xffe0a0).fillCircle(7,12,1).fillCircle(27,12,1)   // centers
      .fillStyle(0xffffff).fillCircle(19,6,1);
    g.generateTexture('tile_flower', T, T);

    // Door — wooden with gold handle
    g.clear()
      .fillStyle(0x8a7a6a).fillRect(0, 0, T, T)
      .fillStyle(0x6a4828).fillRect(8, 2, 16, 30)
      .fillStyle(0x5a3818).fillRect(8,2,2,30).fillRect(22,2,2,30) // door edges
      .fillStyle(0x7a5838).fillRect(10,14,12,2) // mid rail
      .fillStyle(0xffd700).fillCircle(22,20,3) // handle
      .fillStyle(0xe0c000).fillRect(20,19,2,2);
    g.generateTexture('tile_door', T, T);

    // Sign — wooden post with painted board
    g.clear()
      .fillStyle(0x4a8c3f).fillRect(0, 0, T, T)
      .fillStyle(0x6a4828).fillRect(13, 12, 6, 20) // post
      .fillStyle(0xd4a870).fillRect(4, 4, 24, 14)  // board
      .fillStyle(0xc49060).fillRect(4,4,24,2).fillRect(4,16,24,2) // board edge
      .fillStyle(0x805828).fillRect(5,5,22,1)       // text lines
      .fillRect(5,8,18,1).fillRect(5,11,20,1).fillRect(5,14,14,1);
    g.generateTexture('tile_sign', T, T);

    // Boulder — chunky gray rock, fully self-contained (no background color
    // showing through, so it sits cleanly on any ground tile beneath it)
    g.clear()
      .fillStyle(0x8a8580).fillRect(0, 0, T, T)
      .fillStyle(0x6e6a66).fillRect(4, 22, 24, 8) // shadowed base
      .fillStyle(0x9a958f).fillRect(9, 6, 8, 8).fillRect(17, 8, 7, 7) // facet highlights
      .fillStyle(0x5a5652).fillRect(10, 20, 4, 3).fillRect(19, 18, 4, 3) // cracks/shadow
      .fillStyle(0x76726c).fillRect(2, 12, 6, 10).fillRect(24, 12, 6, 10) // rounded sides
      .fillStyle(0x6a8a4a, 0.5).fillRect(6, 26, 3, 2).fillRect(23, 27, 3, 2); // moss
    g.generateTexture('tile_boulder', T, T);

    // Rocky path — grayish, cracked earth-city ground
    g.clear()
      .fillStyle(0x9a9088).fillRect(0, 0, T, T)
      .fillStyle(0x847a72).fillRect(2,2,4,2).fillRect(14,10,3,4).fillRect(24,20,4,2).fillRect(8,24,3,2)
      .fillStyle(0xaca290).fillRect(10,6,3,2).fillRect(22,8,3,2).fillRect(4,18,3,2).fillRect(18,26,3,2)
      .fillStyle(0x6e6660).fillRect(16,18,2,2).fillRect(28,4,2,2).fillRect(6,10,2,2); // crack flecks
    g.generateTexture('tile_rockpath', T, T);

    // Mud — dark wet earth patch with puddle sheen
    g.clear()
      .fillStyle(0x5a4630).fillRect(0, 0, T, T)
      .fillStyle(0x4a3824).fillRect(0,0,T,T).fillRect(3,3,T-6,T-6) // uneven darker fill trick
      .fillStyle(0x6a5238).fillRect(2,2,10,8).fillRect(18,16,10,8).fillRect(6,20,8,6)
      .fillStyle(0x3a2c1c).fillRect(12,12,6,4).fillRect(22,4,6,4) // wet dark patches
      .fillStyle(0x8a9aa0, 0.5).fillRect(14,14,3,1).fillRect(24,6,3,1); // puddle sheen
    g.generateTexture('tile_mud', T, T);

    g.destroy();
  }

  // ── PLAYER ───────────────────────────────────────────────────────────────────
  private generatePlayerSprites() {
    const g = this.add.graphics();
    const DIRS = ['down', 'up', 'left', 'right'];
    const SKIN = 0xf0c8a0, SHIRT = 0x3070d0, PANTS = 0x204090;
    const HAT = 0xd04020, SHOE = 0x302010, HAIR = 0x2a1a0a;
    const W = 32, H = 32;

    DIRS.forEach((dir) => {
      for (let frame = 0; frame < 3; frame++) {
        g.clear();
        const wob = frame === 1 ? -1 : 0;
        const legL = frame === 0 ? 0 : frame === 1 ? -2 : 2;
        const legR = -legL;

        // Shoes
        g.fillStyle(SHOE).fillRect(10, 27 + legL, 5, 4).fillRect(17, 27 + legR, 5, 4);
        // Pants
        g.fillStyle(PANTS).fillRect(9, 21, 6, 7 + legL).fillRect(17, 21, 6, 7 + legR);
        // Belt
        g.fillStyle(0x8a6020).fillRect(9, 20, 14, 2);
        // Shirt body
        g.fillStyle(SHIRT).fillRect(8, 13 + wob, 16, 9);
        // Collar
        g.fillStyle(0x2060c0).fillRect(12, 13 + wob, 8, 2);
        // Arms
        const armSwing = frame === 1 ? -2 : frame === 2 ? 2 : 0;
        g.fillStyle(SHIRT).fillRect(5, 14 + wob + armSwing, 4, 7);
        g.fillStyle(SHIRT).fillRect(23, 14 + wob - armSwing, 4, 7);
        // Hands
        g.fillStyle(SKIN).fillRect(5, 21 + wob + armSwing, 4, 3).fillRect(23, 21 + wob - armSwing, 4, 3);
        // Neck
        g.fillStyle(SKIN).fillRect(13, 11 + wob, 6, 3);
        // Head
        g.fillStyle(SKIN).fillRect(9, 4 + wob, 14, 10);
        // Hat brim + crown
        g.fillStyle(HAT).fillRect(7, 5 + wob, 18, 4).fillRect(9, 1 + wob, 14, 6);
        // Hat band
        g.fillStyle(0xffd700).fillRect(7, 8 + wob, 18, 1);
        // Hair
        g.fillStyle(HAIR).fillRect(9, 8 + wob, 14, 2);

        // Face / eyes based on direction
        g.fillStyle(0x202020);
        if (dir === 'down') {
          g.fillRect(12, 10 + wob, 2, 2).fillRect(18, 10 + wob, 2, 2);
          g.fillStyle(0xff8080).fillRect(14, 13 + wob, 4, 1); // mouth
        } else if (dir === 'left') {
          g.fillRect(10, 10 + wob, 2, 2);
          g.fillStyle(HAIR).fillRect(20, 5 + wob, 4, 5); // hair side
        } else if (dir === 'right') {
          g.fillRect(20, 10 + wob, 2, 2);
          g.fillStyle(HAIR).fillRect(8, 5 + wob, 4, 5);
        } else {
          // up — show back of head
          g.fillStyle(HAIR).fillRect(9, 8 + wob, 14, 6);
        }
        g.generateTexture(`player_${dir}_${frame}`, W, H);
      }
    });

    // Shadow
    g.clear().fillStyle(0x000000, 0.3).fillEllipse(16, 30, 20, 6);
    g.generateTexture('player_shadow', W, H);
    g.destroy();
  }

  // ── CREATURES ────────────────────────────────────────────────────────────────
  private generateCreatureSprites() {
    const g = this.add.graphics();

    const designs: Record<number, (g: Phaser.GameObjects.Graphics) => void> = {

      // 1: Embrix — Fire fox cub
      1: g => {
        g.fillStyle(0xff6020).fillRect(8,14,16,14);            // body
        g.fillStyle(0xff8040).fillRect(10,9,12,10);            // head
        g.fillStyle(0xff4010).fillRect(6,6,5,9).fillRect(21,6,5,9); // ears
        g.fillStyle(0xffe8d0).fillRect(11,13,10,7);            // face
        g.fillStyle(0x101010).fillRect(12,15,3,3).fillRect(17,15,3,3); // eyes
        g.fillStyle(0xff2010).fillRect(14,20,4,2);             // nose
        g.fillStyle(0x101010).fillRect(13,22,6,1);             // mouth
        g.fillStyle(0xff6020).fillRect(18,26,6,4).fillRect(22,22,4,8); // tail
        g.fillStyle(0xffcc00).fillCircle(25,20,5);             // flame
        g.fillStyle(0xff6600).fillCircle(25,20,3);             // flame core
        g.fillStyle(0xff4010).fillRect(8,26,5,5).fillRect(19,26,5,5); // paws
      },

      // 2: Inferox — Fire wolf, evolved
      2: g => {
        g.fillStyle(0xd04010).fillRect(6,12,20,16);            // body
        g.fillStyle(0xe05020).fillRect(8,7,16,12);             // head
        g.fillStyle(0xc03000).fillRect(6,3,6,10).fillRect(20,3,6,10); // pointed ears
        g.fillStyle(0xff8040).fillRect(9,9,14,9);              // face
        g.fillStyle(0xffcc80).fillRect(10,14,12,5);            // muzzle
        g.fillStyle(0xff2000).fillRect(14,15,4,2);             // nose
        g.fillStyle(0xffaa00).fillRect(12,16,3,3).fillRect(17,16,3,3); // glowing eyes
        g.fillStyle(0xff6600).fillRect(13,18,6,1);             // teeth
        // flame mane
        g.fillStyle(0xff8800).fillTriangle(6,8,3,2,8,4).fillTriangle(9,7,7,1,11,5)
          .fillTriangle(14,6,13,0,16,4).fillTriangle(19,7,18,1,21,5).fillTriangle(22,8,21,2,25,4);
        g.fillStyle(0xffee00).fillTriangle(7,8,5,3,9,5).fillTriangle(14,6,13,2,16,5);
        // tail with flame
        g.fillStyle(0xd04010).fillRect(22,20,8,5).fillRect(26,16,4,10);
        g.fillStyle(0xff8800).fillCircle(28,14,5).fillStyle(0xffee00).fillCircle(28,14,3);
        // legs
        g.fillStyle(0xc03000).fillRect(8,26,5,6).fillRect(19,26,5,6);
      },

      // 3: Pyroar — Fire/Shadow lion
      3: g => {
        g.fillStyle(0xc83010).fillRect(6,14,20,14);            // body
        g.fillStyle(0x500028).fillRect(4,10,24,14);            // shadow mane
        // mane spikes
        g.fillStyle(0x200010).fillTriangle(4,10,2,4,6,8).fillTriangle(8,8,6,2,10,6)
          .fillTriangle(16,6,14,0,18,4).fillTriangle(24,8,22,2,26,6).fillTriangle(28,10,26,4,30,8);
        g.fillStyle(0x400020).fillRect(6,10,20,12);            // mane fill
        g.fillStyle(0xe05030).fillRect(9,11,14,10);            // face
        g.fillStyle(0xff8060).fillRect(10,16,12,6);            // muzzle
        g.fillStyle(0xffaa00).fillRect(11,13,4,4).fillRect(17,13,4,4); // bright eyes
        g.fillStyle(0xff0000).fillCircle(13,15,2).fillCircle(19,15,2); // pupils (fire)
        g.fillStyle(0xff2010).fillRect(14,20,4,2);             // nose
        g.fillStyle(0xffffff).fillRect(12,22,3,2).fillRect(17,22,3,2); // fangs
        // tail
        g.fillStyle(0xc83010).fillRect(24,20,6,4).fillRect(28,16,4,10);
        g.fillStyle(0xff8800).fillCircle(30,14,6).fillStyle(0xffee00).fillCircle(30,14,3);
        // paws
        g.fillStyle(0xb02810).fillRect(7,26,6,6).fillRect(19,26,6,6);
        g.fillStyle(0x300015).fillRect(7,26,6,2).fillRect(19,26,6,2);
      },

      // 4: Aquril — Water sprite
      4: g => {
        g.fillStyle(0x4080e0).fillRect(8,12,16,16);            // body
        g.fillStyle(0x60a0ff).fillRect(10,7,12,11);            // head
        g.fillStyle(0x2060c0).fillEllipse(5,18,10,14);         // left fin
        g.fillEllipse(27,18,10,14);                            // right fin
        g.fillStyle(0xb0d8ff).fillRect(11,9,10,8);             // face highlight
        g.fillStyle(0x101010).fillRect(12,12,3,3).fillRect(17,12,3,3);
        g.fillStyle(0x2060c0).fillRect(14,16,4,2);             // nose
        g.fillStyle(0x101010).fillRect(13,18,6,1);             // mouth
        // dorsal fin
        g.fillStyle(0x2060c0).fillTriangle(12,6,16,0,20,6);
        // tail fins
        g.fillStyle(0x4080e0).fillRect(10,26,12,6);
        g.fillStyle(0x2060c0).fillTriangle(10,28,6,32,14,32).fillTriangle(22,28,18,32,26,32);
        // water droplets
        g.fillStyle(0x80c8ff, 0.6).fillCircle(4,10,2).fillCircle(28,10,2);
      },

      // 5: Aqueron — Water serpent
      5: g => {
        g.fillStyle(0x2870d8).fillRect(12,6,8,24);             // serpent body
        g.fillStyle(0x3890f0).fillRect(10,6,12,10);            // head
        g.fillStyle(0x1a58b0).fillRect(8,8,4,16);              // left body stripe
        g.fillRect(20,8,4,16);                                 // right body stripe
        g.fillStyle(0x6ac0ff).fillRect(11,8,10,7);             // face
        g.fillStyle(0x00ffcc).fillRect(12,11,3,3).fillRect(17,11,3,3); // teal eyes
        g.fillStyle(0x1a58b0).fillRect(14,14,4,2);             // nose
        // fins along body
        g.fillStyle(0x1a58b0).fillTriangle(6,12,12,14,6,18).fillTriangle(26,12,20,14,26,18)
          .fillTriangle(6,20,12,22,6,26).fillTriangle(26,20,20,22,26,26);
        // head crest
        g.fillStyle(0x50b0ff).fillTriangle(12,4,16,0,20,4);
        // tail
        g.fillStyle(0x2870d8).fillTriangle(10,28,22,28,16,32);
        g.fillStyle(0x6ac0ff).fillRect(12,24,8,2); // belly patch
      },

      // 6: Tidalon — Water/Light dragon
      6: g => {
        g.fillStyle(0x1850c0).fillRect(8,10,16,18);            // body
        g.fillStyle(0x2870e8).fillRect(10,6,12,12);            // head
        // wing membranes
        g.fillStyle(0x3090ff, 0.7).fillTriangle(2,8,10,14,4,24).fillTriangle(30,8,22,14,28,24);
        g.fillStyle(0x1050a0).fillTriangle(2,8,10,14,4,20).fillTriangle(30,8,22,14,28,20);
        // glowing patterns
        g.fillStyle(0xaaddff).fillRect(12,10,8,2).fillRect(11,14,10,2).fillRect(12,18,8,2);
        g.fillStyle(0xffd700).fillRect(11,8,10,7);             // golden face
        g.fillStyle(0x00ffff).fillRect(12,10,3,3).fillRect(17,10,3,3); // glowing eyes
        g.fillStyle(0xffd700).fillCircle(16,14,2);             // third eye / gem
        // horn
        g.fillStyle(0xffd700).fillTriangle(12,4,16,0,20,4).fillTriangle(13,5,16,0,19,5);
        // tail
        g.fillStyle(0x1850c0).fillRect(22,20,6,8);
        g.fillStyle(0xaaddff).fillTriangle(22,22,28,22,25,30); // tail fin glow
        // legs/feet
        g.fillStyle(0x1050a0).fillRect(8,26,5,6).fillRect(19,26,5,6);
      },

      // 7: Leafling — Nature sprite
      7: g => {
        g.fillStyle(0x40a040).fillRect(8,12,16,16);            // body
        g.fillStyle(0x60c060).fillRect(10,8,12,10);            // head
        g.fillStyle(0x208020).fillRect(3,4,8,14);              // big leaf ear L
        g.fillRect(21,4,8,14);                                 // big leaf ear R
        g.fillStyle(0x4ad44a).fillRect(5,6,4,10).fillRect(23,6,4,10); // leaf highlights
        g.fillStyle(0x80e080).fillRect(11,10,10,7);            // face
        g.fillStyle(0x101010).fillRect(12,13,3,3).fillRect(17,13,3,3);
        g.fillStyle(0x208020).fillRect(14,17,4,2);             // mouth
        // top leaf
        g.fillStyle(0x20a020).fillTriangle(16,0,9,10,23,10);
        g.fillStyle(0x30c030).fillRect(15,2,2,8);              // leaf vein
        // tail/vine
        g.fillStyle(0x20a020).fillRect(13,26,6,6).fillRect(12,22,8,6);
        g.fillStyle(0x30d030).fillRect(14,24,4,2);             // vine detail
      },

      // 8: Fernix — Nature phoenix
      8: g => {
        g.fillStyle(0x208020).fillRect(12,14,8,14);            // body
        // wing feathers (L and R)
        g.fillStyle(0x40a040).fillTriangle(2,4,12,14,4,22).fillTriangle(30,4,20,14,28,22);
        g.fillStyle(0x60c060).fillTriangle(2,6,12,14,5,18).fillTriangle(30,6,20,14,27,18);
        g.fillStyle(0x90e090).fillTriangle(3,8,12,14,6,14).fillTriangle(29,8,20,14,26,14);
        // tail feathers
        g.fillStyle(0x208020).fillTriangle(10,26,14,20,8,32).fillTriangle(16,28,16,20,12,32)
          .fillTriangle(22,26,18,20,24,32);
        g.fillStyle(0x60c060).fillTriangle(11,28,14,22,10,32);
        // head + crest
        g.fillStyle(0x40c040).fillRect(10,8,12,10);
        g.fillStyle(0xffd700).fillRect(12,4,8,6);              // golden crest
        g.fillStyle(0xff8800).fillTriangle(12,2,16,0,20,2).fillTriangle(14,3,16,0,18,3);
        g.fillStyle(0xa0ffa0).fillRect(11,10,10,6);            // face
        g.fillStyle(0x101010).fillRect(12,12,3,3).fillRect(17,12,3,3);
        g.fillStyle(0xffd700).fillRect(14,10,4,2);             // beak
      },

      // 9: Verdance — Nature/Earth tree guardian
      9: g => {
        g.fillStyle(0x5a3a10).fillRect(10,16,12,16);           // trunk body
        g.fillStyle(0x8a5a20).fillRect(8,18,4,12).fillRect(20,18,4,12); // root legs
        g.fillStyle(0x6a4a18).fillRect(10,16,12,4).fillRect(11,20,10,2).fillRect(12,24,8,2); // bark texture
        // bark knots
        g.fillStyle(0x4a2a08).fillCircle(13,20,2).fillCircle(19,24,2);
        // canopy (multi-layer)
        g.fillStyle(0x1a5c18).fillCircle(16,8,12);             // outer canopy
        g.fillStyle(0x2d8c2a).fillCircle(14,10,8).fillCircle(18,10,8); // mid canopy
        g.fillStyle(0x40a840).fillCircle(16,8,6);              // inner canopy
        g.fillStyle(0x60c060).fillCircle(12,6,3).fillCircle(20,6,3).fillCircle(16,4,3); // highlights
        // face carved in tree
        g.fillStyle(0x2a1a08).fillRect(12,14,4,3).fillRect(18,14,4,3); // eyes
        g.fillStyle(0x40b040).fillCircle(14,15,1).fillCircle(20,15,1); // eye glow
        g.fillStyle(0x2a1a08).fillRect(12,18,8,2);             // bark mouth
        // flowers in canopy
        g.fillStyle(0xff8080).fillCircle(10,8,2).fillCircle(22,8,2);
        g.fillStyle(0xffffff).fillCircle(10,8,1).fillCircle(22,8,1);
      },

      // 10: Pebbit — Earth rabbit
      10: g => {
        g.fillStyle(0xa0907a).fillRect(8,16,16,12);            // body
        g.fillStyle(0xc0b09a).fillRect(10,9,12,12);            // head
        g.fillStyle(0xa0907a).fillRect(11,2,4,12);             // left long ear
        g.fillRect(17,2,4,12);                                 // right long ear
        g.fillStyle(0xd4c0aa).fillRect(12,4,2,9).fillRect(18,4,2,9); // inner ear
        g.fillStyle(0xe0d0c0).fillRect(11,11,10,8);            // face
        g.fillStyle(0xff4080).fillRect(12,13,4,2);             // pink nose
        g.fillStyle(0x101010).fillRect(11,14,3,3).fillRect(18,14,3,3); // eyes
        g.fillStyle(0x808060).fillRect(8,28,6,4).fillRect(18,28,6,4); // paws
        // belly spot
        g.fillStyle(0xd8c8b0).fillEllipse(16,22,8,8);
        // tail
        g.fillStyle(0xe0d0c0).fillCircle(4,22,4);
      },

      // 11: Bouldrake — Earth stone dragon
      11: g => {
        g.fillStyle(0x707060).fillRect(6,12,20,16);            // body
        g.fillStyle(0x909080).fillRect(8,7,16,12);             // head
        // stone scales on back
        g.fillStyle(0x505040).fillTriangle(8,12,12,7,10,12).fillTriangle(12,12,14,7,14,12)
          .fillTriangle(16,12,18,7,18,12).fillTriangle(20,12,22,7,22,12);
        g.fillStyle(0x808070).fillRect(10,9,12,8);             // face
        g.fillStyle(0x101010).fillRect(11,12,4,4).fillRect(17,12,4,4); // deep eyes
        g.fillStyle(0xff8020).fillCircle(13,14,2).fillCircle(19,14,2); // lava glow eyes
        g.fillStyle(0x505040).fillRect(10,4,6,6).fillRect(16,4,6,6); // horns
        g.fillStyle(0x606050).fillRect(11,16,10,4);            // muzzle
        g.fillStyle(0xff4000).fillRect(13,19,6,2);             // fire breath hint
        // tail
        g.fillStyle(0x707060).fillRect(22,22,8,4).fillRect(26,18,4,10);
        g.fillStyle(0x505040).fillTriangle(26,18,30,14,30,22); // tail spike
        // legs
        g.fillStyle(0x606050).fillRect(7,26,6,6).fillRect(19,26,6,6);
      },

      // 12: Fluttail — Wind butterfly
      12: g => {
        // upper wings (large)
        g.fillStyle(0xc8a0ff, 0.9).fillEllipse(9,11,16,20).fillEllipse(23,11,16,20);
        // lower wings
        g.fillStyle(0xffcc60, 0.9).fillEllipse(9,22,14,14).fillEllipse(23,22,14,14);
        // wing patterns
        g.fillStyle(0x8060ff).fillCircle(9,12,4).fillCircle(23,12,4);
        g.fillStyle(0xff8820).fillCircle(9,22,3).fillCircle(23,22,3);
        g.fillStyle(0xffffff, 0.5).fillCircle(9,10,2).fillCircle(23,10,2);
        // body
        g.fillStyle(0x202020).fillRect(14,6,4,22);
        g.fillStyle(0x404040).fillEllipse(16,10,8,12);         // thorax
        // head
        g.fillStyle(0x303030).fillCircle(16,7,4);
        g.fillStyle(0xffffff).fillCircle(15,6,1).fillCircle(17,6,1); // eyes
        // antennae
        g.fillStyle(0x404040).fillRect(14,2,1,6).fillRect(17,2,1,6);
        g.fillStyle(0xffcc60).fillCircle(14,2,2).fillCircle(18,2,2); // tips
      },

      // 13: Galewyn — Wind serpent/dragon
      13: g => {
        g.fillStyle(0xa0d0ff).fillRect(10,4,12,24);            // long body
        g.fillStyle(0x80b0e0).fillRect(8,4,16,10);             // head
        // wind aura
        g.fillStyle(0xffffff, 0.4).fillEllipse(16,14,24,10).fillEllipse(16,20,20,8);
        // wing membranes
        g.fillStyle(0xc0e8ff, 0.8).fillTriangle(2,6,10,12,2,18).fillTriangle(30,6,22,12,30,18);
        g.fillStyle(0x80c0ff, 0.6).fillTriangle(2,8,10,12,3,16).fillTriangle(30,8,22,12,29,16);
        g.fillStyle(0xddf0ff).fillRect(9,6,14,7);              // face
        g.fillStyle(0x0060ff).fillRect(11,8,4,4).fillRect(17,8,4,4); // deep blue eyes
        g.fillStyle(0xffffff).fillRect(12,9,2,2).fillRect(18,9,2,2); // eye glint
        g.fillStyle(0xa0d0ff).fillRect(13,12,6,2);             // nostril
        // head crest
        g.fillStyle(0x60a0e0).fillTriangle(10,2,16,0,22,2);
        g.fillStyle(0xffffff, 0.6).fillTriangle(12,3,16,0,20,3);
        // tail fins
        g.fillStyle(0xa0d0ff).fillTriangle(8,26,24,26,16,32);
        g.fillStyle(0xc0e8ff, 0.8).fillTriangle(10,26,22,26,16,30);
        // speed lines on body
        g.fillStyle(0xffffff, 0.3).fillRect(8,16,16,1).fillRect(8,20,16,1);
      },

      // 14: Shadling — Shadow ferret
      14: g => {
        g.fillStyle(0x402060).fillRect(6,16,20,12);            // long body
        g.fillStyle(0x603090).fillRect(8,9,16,12);             // head
        g.fillStyle(0x402060).fillRect(8,5,4,8).fillRect(20,5,4,8); // pointed ears
        g.fillStyle(0x200030).fillRect(9,7,2,5).fillRect(21,7,2,5); // inner ear shadow
        g.fillStyle(0x8040a0).fillRect(10,11,12,8);            // face
        g.fillStyle(0xffa0ff).fillRect(12,13,4,4).fillRect(18,13,4,4); // bright eyes
        g.fillStyle(0xff00ff).fillCircle(14,15,2).fillCircle(20,15,2); // iris glow
        g.fillStyle(0x602080).fillRect(13,18,6,2);             // snout
        // tail (long and dark)
        g.fillStyle(0x402060).fillRect(22,22,8,4).fillRect(26,18,4,12);
        // shadow wisps
        g.fillStyle(0x200030, 0.5).fillEllipse(4,20,8,6).fillEllipse(28,20,8,6)
          .fillEllipse(16,28,10,4);
        // paws
        g.fillStyle(0x301050).fillRect(7,26,5,6).fillRect(20,26,5,6);
      },

      // 15: Nightshroud — Shadow phantom
      15: g => {
        // body as dark swirling mass
        g.fillStyle(0x100020, 0.95).fillEllipse(16,18,24,24);
        g.fillStyle(0x200040).fillEllipse(16,16,20,20);
        g.fillStyle(0x300060).fillEllipse(16,14,16,16);
        // tattered edges
        g.fillStyle(0x080015).fillTriangle(4,14,8,24,2,26).fillTriangle(28,14,24,24,30,26)
          .fillTriangle(10,26,12,20,6,30).fillTriangle(22,26,20,20,26,30)
          .fillTriangle(16,28,14,22,18,32);
        // glowing eyes
        g.fillStyle(0xff00ff).fillCircle(12,14,5).fillCircle(20,14,5);
        g.fillStyle(0xff80ff).fillCircle(12,14,3).fillCircle(20,14,3);
        g.fillStyle(0xffffff).fillCircle(11,13,1).fillCircle(19,13,1);
        // spectral glow aura
        g.fillStyle(0x8000ff, 0.15).fillEllipse(16,16,30,28);
        // floating skull hint
        g.fillStyle(0x400060, 0.7).fillRect(13,8,6,6);
        g.fillStyle(0x080015).fillRect(13,10,2,2).fillRect(17,10,2,2);
      },

      // 16: Gloworm — Light caterpillar
      16: g => {
        g.fillStyle(0xffd070).fillRect(6,10,20,14);            // body
        g.fillStyle(0xffe890).fillRect(8,8,16,10);             // head
        // body segments
        g.fillStyle(0xffb840).fillRect(6,12,20,2).fillRect(6,16,20,2).fillRect(6,20,20,2);
        g.fillStyle(0xffd070).fillRect(6,22,20,4);             // lower body
        g.fillStyle(0xfff0b0).fillEllipse(16,13,12,8);         // face glow
        g.fillStyle(0x101010).fillRect(12,12,3,3).fillRect(17,12,3,3);
        g.fillStyle(0xffffff).fillRect(12,12,1,1).fillRect(17,12,1,1); // eye glint
        g.fillStyle(0x20200).fillRect(14,16,4,2);              // mouth
        // glow orbs on back
        g.fillStyle(0xffff80, 0.8).fillCircle(9,10,3).fillCircle(16,8,3).fillCircle(23,10,3);
        g.fillStyle(0xffffff, 0.5).fillCircle(9,9,1).fillCircle(16,7,1).fillCircle(23,9,1);
        // legs (tiny)
        g.fillStyle(0xffb840).fillRect(8,22,2,6).fillRect(12,22,2,6)
          .fillRect(16,22,2,6).fillRect(20,22,2,6).fillRect(24,22,2,6);
        // antennae
        g.fillStyle(0xffd070).fillRect(12,4,2,6).fillRect(18,4,2,6);
        g.fillStyle(0xffff80).fillCircle(13,4,2).fillCircle(19,4,2);
      },

      // 17: Luminary — Light radiant being
      17: g => {
        // core orb
        g.fillStyle(0xffe060).fillCircle(16,14,12);
        g.fillStyle(0xfff090).fillCircle(16,14,9);
        g.fillStyle(0xffffc0).fillCircle(16,14,6);
        g.fillStyle(0xffffff).fillCircle(16,14,4);
        // light rays
        g.fillStyle(0xffe060, 0.6)
          .fillTriangle(16,0,14,6,18,6)
          .fillTriangle(28,4,24,10,30,8)
          .fillTriangle(32,14,26,14,30,18)
          .fillTriangle(28,26,24,20,30,22)
          .fillTriangle(16,30,14,24,18,24)
          .fillTriangle(4,26,2,22,8,22)
          .fillTriangle(0,14,6,14,2,18)
          .fillTriangle(4,4,2,8,8,10);
        // orbiting light balls
        g.fillStyle(0xffcc00).fillCircle(6,8,3).fillCircle(26,8,3).fillCircle(6,22,3).fillCircle(26,22,3);
        g.fillStyle(0xffffff).fillCircle(6,8,1).fillCircle(26,8,1).fillCircle(6,22,1).fillCircle(26,22,1);
        // face (simple, serene)
        g.fillStyle(0xffa000).fillCircle(13,13,2).fillCircle(19,13,2);
        g.fillStyle(0xffd000).fillRect(13,17,6,2);
      },

      // 18: Sparkit — Electric lizard
      18: g => {
        g.fillStyle(0xf0c020).fillRect(8,14,16,14);            // body
        g.fillStyle(0xffe060).fillRect(10,9,12,11);            // head
        g.fillStyle(0xf0c020).fillRect(6,12,4,8).fillRect(22,12,4,8); // side frills
        g.fillStyle(0xfff080).fillRect(7,13,3,6).fillRect(23,13,3,6); // frill highlight
        g.fillStyle(0xfff8c0).fillRect(11,11,10,7);            // face
        g.fillStyle(0x101010).fillRect(12,13,3,3).fillRect(17,13,3,3);
        g.fillStyle(0x0000ff).fillCircle(13,14,1).fillCircle(18,14,1); // blue pupils
        g.fillStyle(0xf0c020).fillRect(14,17,4,2);             // snout
        // lightning tail
        g.fillStyle(0xf0c020).fillRect(22,22,4,6);
        g.fillStyle(0xffff00).fillTriangle(24,22,28,18,30,24).fillTriangle(28,20,26,28,30,28);
        g.fillStyle(0xffffff, 0.8).fillTriangle(25,20,27,18,29,22);
        // electric sparks on body
        g.fillStyle(0xffff00).fillRect(10,16,2,2).fillRect(20,18,2,2).fillRect(14,20,2,2);
        g.fillStyle(0xffffff, 0.6).fillRect(11,16,1,1).fillRect(21,18,1,1);
        // legs
        g.fillStyle(0xe0b010).fillRect(8,26,5,6).fillRect(19,26,5,6);
      },

      // 19: Voltaur — Electric bull
      19: g => {
        g.fillStyle(0xd0a010).fillRect(6,14,20,16);            // massive body
        g.fillStyle(0xf0c020).fillRect(8,8,16,12);             // head
        // large curved horns
        g.fillStyle(0xe8e040).fillTriangle(6,8,2,2,10,10).fillTriangle(26,8,22,10,30,2);
        g.fillStyle(0xffff80).fillTriangle(7,8,4,4,9,10).fillTriangle(25,8,23,10,28,4);
        // lightning along horns
        g.fillStyle(0xffffff, 0.7).fillRect(3,4,1,4).fillRect(28,4,1,4);
        g.fillStyle(0xc0900a).fillRect(9,10,14,8);             // face
        g.fillStyle(0xffe060).fillRect(10,12,12,6);            // muzzle
        g.fillStyle(0xff4000).fillRect(12,13,3,4).fillRect(17,13,3,4); // burning eyes
        g.fillStyle(0xffff00).fillCircle(13,15,1).fillCircle(18,15,1);
        g.fillStyle(0x000000).fillRect(12,18,8,2);             // nostril/mouth
        // static electricity aura
        g.fillStyle(0xffff80, 0.25).fillEllipse(16,18,30,24);
        // hooves
        g.fillStyle(0x302000).fillRect(6,28,7,4).fillRect(19,28,7,4);
        // tail
        g.fillStyle(0xd0a010).fillRect(24,20,4,10);
        g.fillStyle(0xffff00).fillCircle(26,30,4);
      },

      // 20: Thornbud — Nature/Earth spiky plant
      20: g => {
        g.fillStyle(0x20800a).fillRect(8,12,16,18);            // stalk body
        g.fillStyle(0x40c020).fillEllipse(16,10,22,16);        // bud/flower head
        g.fillStyle(0x60e040).fillEllipse(16,9,16,12);         // inner bud
        // thorns
        g.fillStyle(0x156008).fillTriangle(4,12,8,14,6,8).fillTriangle(28,12,24,14,26,8)
          .fillTriangle(4,20,8,22,5,16).fillTriangle(28,20,24,22,27,16)
          .fillTriangle(6,26,10,28,7,22).fillTriangle(26,26,22,28,25,22);
        g.fillStyle(0x20a010).fillTriangle(5,12,8,14,7,9);
        // center flower
        g.fillStyle(0xff6080).fillCircle(16,10,5);
        g.fillStyle(0xffaa00).fillCircle(16,10,3);
        g.fillStyle(0xffd700).fillCircle(16,10,1);
        // eyes (leaves shaped)
        g.fillStyle(0x101010).fillRect(12,16,3,3).fillRect(17,16,3,3);
        g.fillStyle(0x40e040).fillCircle(13,17,1).fillCircle(18,17,1);
        // roots at base
        g.fillStyle(0x8a5a20).fillRect(10,28,4,4).fillRect(14,30,4,2).fillRect(18,28,4,4);
      },

      // 21: Bramblord — Nature/Earth thorn knight
      21: g => {
        g.fillStyle(0x3a5020).fillRect(8,12,16,18);            // armored body
        // bark plate armor
        g.fillStyle(0x2a3a14).fillRect(8,12,16,4).fillRect(8,20,16,4); // armor bands
        g.fillStyle(0x507030).fillRect(9,13,14,3).fillRect(9,21,14,3); // lighter plates
        // helmet/crown of thorns
        g.fillStyle(0x2a3a14).fillRect(9,7,14,8);
        g.fillStyle(0x1a2a08).fillTriangle(8,7,10,0,12,7).fillTriangle(12,7,14,2,16,7)
          .fillTriangle(16,7,18,0,20,7).fillTriangle(20,7,22,2,24,7);
        g.fillStyle(0x507030).fillTriangle(9,8,10,2,12,8).fillTriangle(16,8,18,2,20,8);
        // face (stern bark face)
        g.fillStyle(0x3a4a18).fillRect(10,8,12,7);
        g.fillStyle(0x60ff60).fillRect(11,10,4,4).fillRect(17,10,4,4); // glowing eyes
        g.fillStyle(0x101010).fillRect(12,14,8,2);             // grim mouth
        // shoulder thorns
        g.fillStyle(0x1a2a08).fillTriangle(4,12,8,14,5,8).fillTriangle(28,12,24,14,27,8);
        // legs/roots
        g.fillStyle(0x8a5a20).fillRect(8,28,6,4).fillRect(18,28,6,4);
        g.fillStyle(0x2a3a14).fillRect(8,26,6,4).fillRect(18,26,6,4);
      },

      // 22: Craglet — Earth rock pup
      22: g => {
        g.fillStyle(0x808070).fillRect(6,16,20,14);            // stone body
        g.fillStyle(0xa0a090).fillRect(8,9,16,12);             // head
        g.fillStyle(0x808070).fillRect(8,5,6,8).fillRect(18,5,6,8); // ears
        g.fillStyle(0x707060).fillRect(9,6,4,6).fillRect(19,6,4,6); // ear shadow
        g.fillStyle(0xc0c0b0).fillRect(10,11,12,8);            // face
        g.fillStyle(0x101010).fillRect(11,13,4,4).fillRect(17,13,4,4);
        g.fillStyle(0xff6060).fillRect(13,18,6,2);             // pink nose
        g.fillStyle(0x101010).fillRect(12,20,8,2);             // mouth
        // stone cracks on body
        g.fillStyle(0x606050).fillRect(10,20,3,6).fillRect(18,22,4,5);
        g.fillStyle(0x909080).fillRect(11,20,1,5).fillRect(19,22,2,4);
        // paws (chunky)
        g.fillStyle(0x707060).fillRect(7,28,6,4).fillRect(19,28,6,4);
        g.fillStyle(0x606050).fillRect(7,29,6,3).fillRect(19,29,6,3);
        // stubby tail
        g.fillStyle(0x808070).fillCircle(4,24,4);
        g.fillStyle(0x606050).fillCircle(3,24,2);
      },

      // 23: Stonewulf — Earth stone wolf
      23: g => {
        g.fillStyle(0x606050).fillRect(6,14,20,14);            // large body
        g.fillStyle(0x808070).fillRect(6,7,18,12);             // head
        // massive stone horns / ears
        g.fillStyle(0x505040).fillTriangle(6,7,4,0,10,7).fillTriangle(18,7,22,7,24,0);
        g.fillStyle(0x707060).fillTriangle(7,7,5,2,9,7).fillTriangle(19,7,21,7,23,2);
        g.fillStyle(0xa0a090).fillRect(8,9,14,8);              // face
        g.fillStyle(0x101010).fillRect(8,11,5,5).fillRect(16,11,5,5); // eyes
        g.fillStyle(0x00cc44).fillCircle(10,13,2).fillCircle(18,13,2); // green iris
        g.fillStyle(0xd0d0c0).fillRect(9,16,12,4);             // muzzle
        g.fillStyle(0x000000).fillRect(12,17,8,3);             // open jaw
        g.fillStyle(0xffffff).fillRect(12,17,2,2).fillRect(18,17,2,2); // fangs
        // back ridge spines
        g.fillStyle(0x404030).fillTriangle(8,14,10,8,12,14).fillTriangle(12,14,14,8,16,14)
          .fillTriangle(16,14,18,8,20,14);
        // tail (heavy stone)
        g.fillStyle(0x606050).fillRect(22,20,8,6).fillRect(26,14,4,12);
        g.fillStyle(0x404030).fillTriangle(24,14,28,10,30,16);
        // paws
        g.fillStyle(0x505040).fillRect(6,26,7,6).fillRect(19,26,7,6);
      },

      // 24: Mistfin — Water/Wind manta ray
      24: g => {
        // main body disc
        g.fillStyle(0x4090c0).fillEllipse(16,18,28,18);
        g.fillStyle(0x60b0e0).fillEllipse(16,16,22,14);
        // wing tips
        g.fillStyle(0x3070a0).fillTriangle(2,14,16,18,2,24).fillTriangle(30,14,16,18,30,24);
        g.fillStyle(0x4090c0).fillTriangle(2,16,16,18,3,22).fillTriangle(30,16,16,18,29,22);
        // head bump
        g.fillStyle(0x5090c0).fillEllipse(16,12,12,10);
        // eyes (on top)
        g.fillStyle(0x101010).fillCircle(11,12,3).fillCircle(21,12,3);
        g.fillStyle(0x00ffff).fillCircle(11,12,2).fillCircle(21,12,2);
        g.fillStyle(0xffffff).fillCircle(10,11,1).fillCircle(20,11,1);
        // belly (lighter)
        g.fillStyle(0x90d0f0).fillEllipse(16,20,18,10);
        // tail
        g.fillStyle(0x3070a0).fillRect(14,24,4,8);
        g.fillStyle(0x4090c0).fillTriangle(10,30,22,30,16,32);
        // wind ripples
        g.fillStyle(0xffffff, 0.2).fillEllipse(16,16,16,8).fillEllipse(16,18,20,6);
      },

      // 25: Aeromanta — Water/Wind evolved manta
      25: g => {
        // large swooping wings
        g.fillStyle(0x2060a0).fillEllipse(16,18,32,20);
        g.fillStyle(0x3080c0).fillEllipse(16,16,26,16);
        // elongated wing tips
        g.fillStyle(0x1a4a80).fillTriangle(0,10,16,18,0,26).fillTriangle(32,10,16,18,32,26);
        g.fillStyle(0x2060a0).fillTriangle(0,12,16,18,1,24).fillTriangle(32,12,16,18,31,24);
        // body ridge
        g.fillStyle(0x40a0e0).fillRect(12,8,8,16);
        g.fillStyle(0x50b0f0).fillEllipse(16,12,10,12);
        // head with glow
        g.fillStyle(0x60c0ff).fillEllipse(16,10,12,10);
        g.fillStyle(0x101010).fillCircle(10,10,3).fillCircle(22,10,3);
        g.fillStyle(0x00ffcc).fillCircle(10,10,2).fillCircle(22,10,2);
        g.fillStyle(0xffffff).fillCircle(9,9,1).fillCircle(21,9,1);
        // bioluminescent stripe
        g.fillStyle(0x00ffcc, 0.4).fillRect(10,16,12,2).fillRect(10,20,12,2);
        // twin tails
        g.fillStyle(0x2060a0).fillRect(13,26,4,6).fillRect(19,26,4,6);
        g.fillStyle(0x40a0e0).fillTriangle(10,32,14,26,13,32).fillTriangle(22,32,20,26,19,32);
      },

      // 26: Embersaur — Fire/Earth dinosaur
      26: g => {
        g.fillStyle(0xc84010).fillRect(6,12,20,18);            // body
        g.fillStyle(0xe06020).fillRect(8,8,16,10);             // head
        // bone/stone armor plating
        g.fillStyle(0xa03010).fillRect(6,12,20,4).fillRect(6,18,20,4).fillRect(6,24,20,4);
        g.fillStyle(0xb84818).fillRect(7,13,18,2).fillRect(7,19,18,2).fillRect(7,25,18,2);
        // crest of spines
        g.fillStyle(0xff6000).fillTriangle(8,8,10,2,12,8).fillTriangle(12,8,14,0,16,8)
          .fillTriangle(16,8,18,2,20,8).fillTriangle(20,8,22,4,24,8);
        g.fillStyle(0xff8820).fillTriangle(9,8,10,4,12,8).fillTriangle(16,8,18,4,20,8);
        // face
        g.fillStyle(0xd05020).fillRect(9,10,14,6);
        g.fillStyle(0xff3000).fillRect(10,11,4,4).fillRect(18,11,4,4); // eyes
        g.fillStyle(0xff8800).fillCircle(12,13,2).fillCircle(20,13,2); // fire iris
        g.fillStyle(0xffd000).fillRect(10,15,12,2);            // long snout
        // lava cracks on body
        g.fillStyle(0xff4400, 0.7).fillRect(10,16,3,6).fillRect(18,18,3,4);
        g.fillStyle(0xff8800, 0.5).fillRect(11,17,1,4).fillRect(19,19,1,3);
        // tail (heavy)
        g.fillStyle(0xc84010).fillRect(22,22,8,6).fillRect(26,20,4,10);
        g.fillStyle(0xff6000).fillCircle(28,20,4);
        // sturdy legs
        g.fillStyle(0xa03010).fillRect(6,28,7,4).fillRect(19,28,7,4);
      },

      // 27: Crypthorn — Shadow/Earth dark unicorn
      27: g => {
        g.fillStyle(0x1a0a30).fillRect(8,12,16,18);            // dark body
        g.fillStyle(0x280a40).fillRect(8,7,16,12);             // head
        // mane (shadow wisps)
        g.fillStyle(0x3a1060, 0.8).fillRect(4,4,8,18).fillRect(6,2,6,20);
        g.fillStyle(0x500080, 0.5).fillRect(5,6,6,14);
        // dark mane detail
        g.fillStyle(0x200050).fillTriangle(4,4,7,14,3,16).fillTriangle(4,10,7,20,2,22);
        // horn (crystal dark)
        g.fillStyle(0x400060).fillTriangle(12,0,16,0,14,10);
        g.fillStyle(0x6000a0).fillTriangle(13,0,15,0,14,10);
        g.fillStyle(0xaa00ff, 0.6).fillRect(14,1,1,8);
        // face
        g.fillStyle(0x200030).fillRect(9,9,14,8);
        g.fillStyle(0x8000ff).fillRect(10,11,4,4).fillRect(18,11,4,4); // purple eyes
        g.fillStyle(0xff00ff).fillCircle(12,13,2).fillCircle(20,13,2); // inner glow
        g.fillStyle(0xffffff).fillCircle(11,12,1).fillCircle(19,12,1);
        g.fillStyle(0x200030).fillRect(12,16,8,2);             // muzzle
        // legs (skeletal dark)
        g.fillStyle(0x1a0a30).fillRect(8,28,4,4).fillRect(12,28,4,4).fillRect(16,28,4,4).fillRect(20,28,4,4);
        g.fillStyle(0x500080).fillRect(8,30,4,2).fillRect(12,30,4,2).fillRect(16,30,4,2).fillRect(20,30,4,2);
        // tail
        g.fillStyle(0x3a1060).fillRect(22,20,4,12);
        g.fillStyle(0x8000ff, 0.4).fillRect(22,18,4,14);
      },

      // 28: Sunpuff — Light/Fire fluffy sun creature
      28: g => {
        // main fluffy body
        g.fillStyle(0xffc020).fillCircle(16,18,12);
        g.fillStyle(0xffd860).fillCircle(16,16,10);
        // fluffy cloud texture
        g.fillStyle(0xffe880).fillCircle(10,14,5).fillCircle(22,14,5).fillCircle(16,12,5)
          .fillCircle(10,20,5).fillCircle(22,20,5).fillCircle(16,24,4);
        // sun rays (spiky fluff)
        g.fillStyle(0xffa000)
          .fillTriangle(16,2,14,8,18,8)
          .fillTriangle(28,6,24,10,30,12)
          .fillTriangle(30,18,26,16,30,22)
          .fillTriangle(26,28,22,24,28,26)
          .fillTriangle(16,30,14,26,18,26)
          .fillTriangle(6,28,4,24,10,26)
          .fillTriangle(2,18,4,22,6,16)
          .fillTriangle(4,6,2,12,8,10);
        // face (cute, bright)
        g.fillStyle(0x101010).fillCircle(12,16,3).fillCircle(20,16,3);
        g.fillStyle(0xffffff).fillCircle(13,15,1).fillCircle(21,15,1);
        g.fillStyle(0xffa040).fillEllipse(16,20,8,4);          // big warm smile
        // inner fire glow
        g.fillStyle(0xff8800, 0.3).fillCircle(16,17,8);
        g.fillStyle(0xffffff, 0.4).fillCircle(14,14,2).fillCircle(18,14,2);
      },

      // 29: Frostpine — Water ice tree creature
      29: g => {
        g.fillStyle(0x8ab0d0).fillRect(12,8,8,24);             // ice trunk
        g.fillStyle(0x6090b0).fillRect(10,10,4,18).fillRect(18,10,4,18); // trunk sides
        // icy pine branches (layered)
        g.fillStyle(0x4080c0).fillTriangle(2,28,16,18,30,28);  // bottom bough
        g.fillStyle(0x60a0d0).fillTriangle(4,22,16,12,28,22);  // mid bough
        g.fillStyle(0x80c0e0).fillTriangle(7,16,16,6,25,16);   // upper bough
        // snow/ice on branches
        g.fillStyle(0xd0e8ff).fillTriangle(4,28,16,22,28,28);
        g.fillStyle(0xb0d0f0).fillTriangle(6,22,16,16,26,22);
        g.fillStyle(0xc0e0ff).fillTriangle(9,16,16,10,23,16);
        // ice crystal top
        g.fillStyle(0xa0d0f8).fillTriangle(12,4,16,0,20,4);
        g.fillStyle(0xd0f0ff).fillTriangle(13,4,16,1,19,4);
        // icicles hanging
        g.fillStyle(0xc0e8ff).fillRect(6,28,2,4).fillRect(12,28,2,5).fillRect(18,28,2,4).fillRect(24,28,2,3);
        g.fillStyle(0xe0f4ff).fillRect(6,28,1,3).fillRect(12,28,1,4).fillRect(18,28,1,3);
        // eyes (two circles in trunk)
        g.fillStyle(0x002040).fillCircle(13,14,2).fillCircle(19,14,2);
        g.fillStyle(0x00ccff).fillCircle(13,14,1).fillCircle(19,14,1);
      },

      // 30: Glacivern — Water/Wind ice dragon
      30: g => {
        g.fillStyle(0x60a0d0).fillRect(8,12,16,16);            // ice body
        g.fillStyle(0x80c0e8).fillRect(10,7,12,11);            // head
        // crystalline wing membranes
        g.fillStyle(0xa0d8f0, 0.8).fillTriangle(0,6,10,14,2,24).fillTriangle(32,6,22,14,30,24);
        g.fillStyle(0xc0eeff, 0.5).fillTriangle(1,8,10,14,2,20).fillTriangle(31,8,22,14,30,20);
        // ice crystal spines on back
        g.fillStyle(0x90c8e8).fillTriangle(10,12,12,6,14,12).fillTriangle(14,12,16,4,18,12)
          .fillTriangle(18,12,20,6,22,12);
        g.fillStyle(0xd0f0ff).fillTriangle(11,12,12,8,13,12).fillTriangle(15,12,16,6,17,12)
          .fillTriangle(19,12,20,8,21,12);
        g.fillStyle(0xe0f4ff).fillRect(11,8,10,8);             // face highlight
        g.fillStyle(0x001830).fillRect(11,10,4,4).fillRect(17,10,4,4); // dark eyes
        g.fillStyle(0x00e8ff).fillCircle(13,12,2).fillCircle(19,12,2); // cyan iris
        g.fillStyle(0xffffff).fillCircle(12,11,1).fillCircle(18,11,1);
        g.fillStyle(0x60a0d0).fillRect(13,14,6,2);             // snout
        // breath frost
        g.fillStyle(0xd0f0ff, 0.5).fillEllipse(16,5,12,6);
        // tail with ice crystal tip
        g.fillStyle(0x60a0d0).fillRect(22,20,6,8).fillRect(26,16,4,12);
        g.fillStyle(0x90c8e8).fillTriangle(24,16,28,12,30,18);
        g.fillStyle(0xd0f0ff).fillTriangle(25,16,28,13,29,17);
        // feet with ice claws
        g.fillStyle(0x5090c0).fillRect(7,26,6,6).fillRect(19,26,6,6);
        g.fillStyle(0xd0f0ff).fillRect(7,30,2,4).fillRect(10,30,2,4).fillRect(19,30,2,4).fillRect(22,30,2,4);
      },
    };

    for (let id = 1; id <= 30; id++) {
      // ── Front sprite (32×32, facing viewer) ──────────────────────────────────
      g.clear();
      if (designs[id]) {
        designs[id](g);
      } else {
        // Should not happen — all 30 are designed above
        g.fillStyle(0x8080a0).fillRect(6,8,20,20);
        g.fillStyle(0xe8e8ff).fillRect(9,10,14,10);
        g.fillStyle(0x101010).fillRect(11,13,3,3).fillRect(18,13,3,3).fillRect(13,17,6,2);
      }
      g.generateTexture(`creature_${id}`, 32, 32);

      // ── Back sprite (48×48, showing creature from behind) ────────────────────
      // Scale up and mirror horizontally to simulate a "behind" view.
      // We re-draw a simplified back-facing version: same colors, no face,
      // back-prominent features (tail, wings, dorsal spines) in the foreground.
      g.clear();
      this.drawCreatureBack(g, id);
      g.generateTexture(`creature_${id}_back`, 48, 48);
    }

    g.destroy();
  }

  /** Draws a simplified back-view of each creature at 48×48 for the player battle sprite. */
  private drawCreatureBack(g: Phaser.GameObjects.Graphics, id: number) {
    // Type-colour lookup for fallback
    const typeColors: Record<number, number> = {
      1:0xff6020, 2:0xd04010, 3:0xc83010, 4:0x4080e0, 5:0x2870d8, 6:0x1850c0,
      7:0x40a040, 8:0x208020, 9:0x3a5020, 10:0xa0907a, 11:0x707060, 12:0xc8a0ff,
      13:0xa0d0ff, 14:0x402060, 15:0x100020, 16:0xffd070, 17:0xffe060, 18:0xf0c020,
      19:0xd0a010, 20:0x20800a, 21:0x3a5020, 22:0x808070, 23:0x606050, 24:0x4090c0,
      25:0x2060a0, 26:0xc84010, 27:0x1a0a30, 28:0xffc020, 29:0x8ab0d0, 30:0x60a0d0,
    };
    const col = typeColors[id] ?? 0x808080;
    const dark = Math.round(col * 0.7) & 0xffffff;

    // All back sprites share a common structure: large rounded body seen from behind,
    // distinctive tail/wing/crest feature, and no visible eyes/face.
    // Each one is individually tuned for that creature's silhouette.

    const B: Record<number, () => void> = {
      // Fire line
      1: () => {
        g.fillStyle(col).fillEllipse(24,28,28,24);          // body back
        g.fillStyle(dark).fillEllipse(24,26,20,18);         // shadow
        g.fillStyle(col).fillRect(12,6,8,14);               // head back
        g.fillStyle(0xff4010).fillRect(10,2,6,12).fillRect(20,2,6,12); // ears
        // flame tail prominent
        g.fillStyle(0xff6020).fillRect(26,20,8,12).fillRect(30,14,6,16);
        g.fillStyle(0xffcc00).fillCircle(32,12,7);
        g.fillStyle(0xff6600).fillCircle(32,12,4);
      },
      2: () => {
        g.fillStyle(col).fillEllipse(24,28,32,24);
        g.fillStyle(dark).fillEllipse(24,26,24,18);
        g.fillStyle(col).fillRect(14,6,14,16);
        g.fillStyle(0xff8800).fillTriangle(8,8,14,10,10,4).fillTriangle(12,6,14,10,14,2)
          .fillTriangle(18,4,20,10,22,6).fillTriangle(24,6,26,2,28,8);
        g.fillStyle(0xffee00).fillTriangle(9,8,10,4,12,8).fillTriangle(18,6,20,4,22,6);
        g.fillStyle(col).fillRect(30,16,8,12).fillRect(34,10,6,16);
        g.fillStyle(0xff8800).fillCircle(36,8,7).fillStyle(0xffee00).fillCircle(36,8,4);
      },
      3: () => {
        g.fillStyle(col).fillEllipse(24,28,34,24);
        g.fillStyle(0x500028).fillEllipse(24,24,28,20);
        g.fillStyle(0x200010).fillTriangle(6,8,10,18,4,20).fillTriangle(12,4,14,14,8,16)
          .fillTriangle(24,2,26,12,20,14).fillTriangle(36,4,34,14,40,16).fillTriangle(42,8,38,18,44,20);
        g.fillStyle(col).fillRect(30,18,8,12).fillRect(34,10,6,18);
        g.fillStyle(0xff8800).fillCircle(36,8,8).fillStyle(0xffee00).fillCircle(36,8,5);
      },
      // Water line
      4: () => {
        g.fillStyle(col).fillEllipse(24,26,28,22);
        g.fillStyle(0x80c0ff).fillEllipse(24,24,20,16);
        g.fillStyle(0x2060c0).fillEllipse(8,22,12,18).fillEllipse(40,22,12,18); // fins
        g.fillStyle(col).fillTriangle(16,32,32,32,24,40);
        g.fillStyle(0x2060c0).fillTriangle(14,30,34,30,24,40);
        g.fillStyle(0x2060c0).fillTriangle(16,6,24,0,32,6); // dorsal fin
      },
      5: () => {
        g.fillStyle(col).fillRect(18,4,12,40);
        g.fillStyle(0x1a58b0).fillRect(14,8,6,32).fillRect(30,8,6,32);
        g.fillStyle(0x6ac0ff).fillRect(18,6,12,8);
        g.fillStyle(0x1a58b0).fillTriangle(4,10,18,14,4,24).fillTriangle(44,10,30,14,44,24)
          .fillTriangle(4,22,18,26,4,36).fillTriangle(44,22,30,26,44,36);
        g.fillStyle(col).fillTriangle(14,40,34,40,24,48);
      },
      6: () => {
        g.fillStyle(col).fillEllipse(24,28,28,22);
        g.fillStyle(0xa0d0ff, 0.6).fillTriangle(4,8,18,18,6,32).fillTriangle(44,8,30,18,42,32);
        g.fillStyle(0xffd700).fillRect(18,6,12,12);
        g.fillStyle(0xaaddff).fillRect(16,16,16,3).fillRect(16,22,16,3);
        g.fillStyle(col).fillRect(30,26,8,14).fillRect(34,20,6,14);
        g.fillStyle(0xaaddff).fillTriangle(28,28,36,28,32,40);
      },
      // Nature line
      7: () => {
        g.fillStyle(col).fillEllipse(24,28,26,24);
        g.fillStyle(0x208020).fillRect(4,6,10,18).fillRect(34,6,10,18); // large leaf ears
        g.fillStyle(0x4ad44a).fillRect(6,8,6,14).fillRect(36,8,6,14);
        g.fillStyle(0x20a020).fillTriangle(24,0,16,12,32,12); // top leaf
        g.fillStyle(0x30c030).fillRect(23,2,2,10);
        g.fillStyle(col).fillRect(30,22,6,8).fillRect(28,18,8,6);
      },
      8: () => {
        g.fillStyle(0x40a040).fillTriangle(4,4,18,16,6,28).fillTriangle(44,4,30,16,42,28);
        g.fillStyle(0x60c060).fillTriangle(4,8,18,16,7,22).fillTriangle(44,8,30,16,41,22);
        g.fillStyle(0x90e090).fillTriangle(5,12,18,16,8,18).fillTriangle(43,12,30,16,40,18);
        g.fillStyle(0x208020).fillRect(18,12,12,20);
        g.fillStyle(0x208020).fillTriangle(12,34,18,24,10,44).fillTriangle(20,36,22,26,16,44)
          .fillTriangle(28,36,26,26,32,44);
        g.fillStyle(0xffd700).fillRect(16,6,16,8);
        g.fillStyle(0xff8800).fillTriangle(16,4,24,0,32,4);
      },
      9: () => {
        g.fillStyle(0x5a3a10).fillRect(18,14,12,34);
        g.fillStyle(0x8a5a20).fillRect(12,22,8,26).fillRect(28,22,8,26);
        g.fillStyle(0x4a2a08).fillCircle(20,24,3).fillCircle(28,28,3);
        g.fillStyle(0x1a5c18).fillCircle(24,10,14);
        g.fillStyle(0x2d8c2a).fillCircle(20,12,10).fillCircle(28,12,10);
        g.fillStyle(0x40a840).fillCircle(24,10,8);
        g.fillStyle(0xff8080).fillCircle(16,8,3).fillCircle(32,8,3);
      },
      // Earth rabbit
      10: () => {
        g.fillStyle(col).fillEllipse(24,28,28,24);
        g.fillStyle(0xd4c0aa).fillEllipse(24,26,20,18);
        g.fillStyle(col).fillRect(14,4,6,18).fillRect(28,4,6,18); // long ears back
        g.fillStyle(0xd4c0aa).fillRect(15,6,4,14).fillRect(29,6,4,14);
        g.fillStyle(0xe0d0c0).fillCircle(6,28,6); // tail
        g.fillStyle(col).fillRect(8,34,8,6).fillRect(32,34,8,6);
      },
      11: () => {
        g.fillStyle(col).fillEllipse(24,28,32,24);
        g.fillStyle(0x505040).fillTriangle(10,8,14,12,14,6).fillTriangle(14,8,16,12,18,6)
          .fillTriangle(20,8,22,12,24,6).fillTriangle(26,8,28,12,30,6); // back spines
        g.fillStyle(col).fillRect(30,18,10,16).fillRect(36,10,6,16);
        g.fillStyle(0x505040).fillTriangle(32,10,36,6,38,14);
        g.fillStyle(0xff8020, 0.4).fillCircle(36,9,5);
        g.fillStyle(col).fillRect(8,34,8,8).fillRect(32,34,8,8);
      },
      // Wind butterfly
      12: () => {
        g.fillStyle(0xc8a0ff, 0.9).fillEllipse(12,14,18,24).fillEllipse(36,14,18,24);
        g.fillStyle(0xffcc60, 0.9).fillEllipse(12,28,16,18).fillEllipse(36,28,16,18);
        g.fillStyle(0x8060ff).fillCircle(12,14,5).fillCircle(36,14,5);
        g.fillStyle(0xff8820).fillCircle(12,28,4).fillCircle(36,28,4);
        g.fillStyle(0x202020).fillRect(22,8,4,30);
        g.fillStyle(0x404040).fillEllipse(24,14,10,16);
        g.fillStyle(0xffcc60).fillCircle(22,4,3).fillCircle(26,4,3);
      },
      // Wind serpent
      13: () => {
        g.fillStyle(col).fillRect(16,2,16,44);
        g.fillStyle(0x80b0e0).fillRect(14,2,20,14);
        g.fillStyle(0xffffff, 0.3).fillEllipse(24,20,28,14).fillEllipse(24,30,22,10);
        g.fillStyle(0xc0e8ff, 0.7).fillTriangle(2,8,14,16,2,26).fillTriangle(46,8,34,16,46,26);
        g.fillStyle(col).fillTriangle(12,40,36,40,24,48);
        g.fillStyle(0x60a0e0).fillTriangle(14,38,34,38,24,46);
      },
      // Shadow ferret
      14: () => {
        g.fillStyle(col).fillEllipse(24,24,32,18);
        g.fillStyle(0x8040a0).fillEllipse(24,22,24,14);
        g.fillStyle(col).fillRect(32,10,10,28).fillRect(38,4,6,30);
        g.fillStyle(0x200030, 0.5).fillEllipse(6,26,10,8).fillEllipse(40,26,10,8);
        g.fillStyle(col).fillRect(8,34,6,8).fillRect(34,34,6,8);
      },
      // Shadow phantom
      15: () => {
        g.fillStyle(0x100020, 0.95).fillEllipse(24,24,32,32);
        g.fillStyle(0x200040).fillEllipse(24,22,26,26);
        g.fillStyle(0x080015).fillTriangle(6,18,12,32,4,36).fillTriangle(42,18,36,32,44,36)
          .fillTriangle(14,34,18,26,10,40).fillTriangle(34,34,30,26,38,40);
        g.fillStyle(0x8000ff, 0.15).fillEllipse(24,22,40,36);
      },
      // Gloworm
      16: () => {
        g.fillStyle(col).fillRect(8,10,32,18);
        g.fillStyle(0xffb840).fillRect(8,14,32,3).fillRect(8,20,32,3);
        g.fillStyle(0xffff80, 0.8).fillCircle(12,12,4).fillCircle(24,10,4).fillCircle(36,12,4);
        g.fillStyle(0xffd070).fillRect(10,26,4,8).fillRect(18,26,4,8).fillRect(26,26,4,8).fillRect(34,26,4,8);
        g.fillStyle(col).fillRect(14,4,4,8).fillRect(30,4,4,8);
        g.fillStyle(0xffff80).fillCircle(16,4,3).fillCircle(32,4,3);
      },
      // Luminary
      17: () => {
        g.fillStyle(0xffe060).fillCircle(24,20,14);
        g.fillStyle(0xfff090).fillCircle(24,20,10);
        g.fillStyle(0xffffc0).fillCircle(24,20,6);
        g.fillStyle(0xffffff).fillCircle(24,20,3);
        g.fillStyle(0xffe060, 0.5)
          .fillTriangle(24,2,22,8,26,8).fillTriangle(38,6,34,12,40,10)
          .fillTriangle(42,20,36,20,40,24).fillTriangle(38,34,34,28,40,30)
          .fillTriangle(24,40,22,34,26,34).fillTriangle(10,34,6,30,12,28)
          .fillTriangle(6,20,12,20,8,24).fillTriangle(10,6,8,12,14,10);
        g.fillStyle(0xffcc00).fillCircle(8,10,4).fillCircle(40,10,4).fillCircle(8,32,4).fillCircle(40,32,4);
      },
      // Electric lizard
      18: () => {
        g.fillStyle(col).fillEllipse(24,28,28,22);
        g.fillStyle(0xfff8c0).fillEllipse(24,26,20,16);
        g.fillStyle(col).fillRect(8,16,8,12).fillRect(32,16,8,12); // frills
        g.fillStyle(col).fillRect(28,10,8,18).fillRect(32,6,6,20);
        g.fillStyle(0xffff00).fillTriangle(34,8,38,4,40,12).fillTriangle(38,6,36,14,40,14);
        g.fillStyle(col).fillRect(8,36,8,8).fillRect(32,36,8,8);
      },
      // Voltaur
      19: () => {
        g.fillStyle(col).fillEllipse(24,28,36,26);
        g.fillStyle(0xe8e040).fillTriangle(8,8,4,2,14,12).fillTriangle(40,8,34,12,44,2); // horns back
        g.fillStyle(0xffff80).fillTriangle(9,8,6,4,12,12).fillTriangle(39,8,36,12,42,4);
        g.fillStyle(col).fillRect(30,12,8,18);
        g.fillStyle(0xffff00).fillCircle(32,42,6);
        g.fillStyle(col).fillRect(6,36,10,6).fillRect(32,36,10,6);
        g.fillStyle(0xffff80, 0.2).fillEllipse(24,26,42,32);
      },
      // Thornbud
      20: () => {
        g.fillStyle(0x20800a).fillRect(18,14,12,34);
        g.fillStyle(0x40c020).fillEllipse(24,12,28,20);
        g.fillStyle(0x156008).fillTriangle(4,16,12,18,8,10).fillTriangle(44,16,36,18,40,10)
          .fillTriangle(4,26,12,28,6,20).fillTriangle(44,26,36,28,42,20);
        g.fillStyle(0xff6080).fillCircle(24,12,7);
        g.fillStyle(0xffaa00).fillCircle(24,12,4);
        g.fillStyle(0x8a5a20).fillRect(14,42,6,6).fillRect(22,44,4,4).fillRect(28,42,6,6);
      },
      // Bramblord
      21: () => {
        g.fillStyle(0x3a5020).fillRect(12,10,24,34);
        g.fillStyle(0x2a3a14).fillRect(12,10,24,6).fillRect(12,22,24,6).fillRect(12,34,24,6);
        g.fillStyle(0x1a2a08).fillTriangle(6,10,12,14,8,4).fillTriangle(44,10,36,14,40,4)
          .fillTriangle(4,18,12,22,6,12).fillTriangle(44,18,36,22,42,12);
        g.fillStyle(0x2a3a14).fillRect(12,6,24,8); // back of helmet
        g.fillStyle(0x1a2a08).fillTriangle(12,4,16,0,20,4).fillTriangle(20,4,24,0,28,4)
          .fillTriangle(28,4,32,0,36,4);
        g.fillStyle(0x8a5a20).fillRect(12,42,8,6).fillRect(28,42,8,6);
      },
      // Craglet
      22: () => {
        g.fillStyle(col).fillEllipse(24,28,30,24);
        g.fillStyle(0xa0a090).fillEllipse(24,26,22,18);
        g.fillStyle(col).fillRect(12,6,8,16).fillRect(28,6,8,16); // ears back
        g.fillStyle(0x606050).fillRect(16,20,4,8).fillRect(26,22,4,6); // cracks
        g.fillStyle(col).fillCircle(6,30,6); // stubby tail
        g.fillStyle(0x606050).fillCircle(5,30,4);
        g.fillStyle(col).fillRect(8,36,8,6).fillRect(32,36,8,6);
      },
      // Stonewulf
      23: () => {
        g.fillStyle(col).fillEllipse(24,28,36,26);
        g.fillStyle(0x505040).fillTriangle(8,8,12,14,16,8).fillTriangle(16,10,18,14,22,8)
          .fillTriangle(22,10,24,14,28,8).fillTriangle(28,10,30,14,34,8); // ridge spines
        g.fillStyle(col).fillRect(32,18,10,18).fillRect(38,10,6,20);
        g.fillStyle(0x404030).fillTriangle(34,10,38,6,40,14);
        g.fillStyle(col).fillRect(6,36,10,8).fillRect(32,36,10,8);
        g.fillStyle(0x00cc44, 0.5).fillEllipse(8,24,4,4).fillEllipse(40,24,4,4); // eye glow
      },
      // Mistfin
      24: () => {
        g.fillStyle(col).fillEllipse(24,24,42,24);
        g.fillStyle(0x5090c0).fillEllipse(24,22,32,18);
        g.fillStyle(0x3070a0).fillTriangle(2,18,24,24,2,32).fillTriangle(46,18,24,24,46,32);
        g.fillStyle(0x90d0f0).fillEllipse(24,26,24,12);
        g.fillStyle(col).fillRect(20,32,8,12);
        g.fillStyle(col).fillTriangle(12,40,36,40,24,48);
      },
      // Aeromanta
      25: () => {
        g.fillStyle(col).fillEllipse(24,24,48,26);
        g.fillStyle(0x3080c0).fillEllipse(24,22,36,20);
        g.fillStyle(0x1a4a80).fillTriangle(0,14,24,22,0,36).fillTriangle(48,14,24,22,48,36);
        g.fillStyle(0x40a0e0).fillRect(18,8,12,22);
        g.fillStyle(0x50b0f0).fillEllipse(24,14,14,16);
        g.fillStyle(0x00ffcc, 0.35).fillRect(14,22,20,3).fillRect(14,28,20,3);
        g.fillStyle(col).fillRect(18,36,6,10).fillRect(26,36,6,10);
      },
      // Embersaur
      26: () => {
        g.fillStyle(col).fillEllipse(24,28,34,24);
        g.fillStyle(0xa03010).fillRect(8,10,32,6).fillRect(8,18,32,6).fillRect(8,26,32,6);
        g.fillStyle(0xff6000).fillTriangle(10,10,12,4,14,10).fillTriangle(14,10,16,2,18,10)
          .fillTriangle(20,10,22,4,24,10).fillTriangle(26,10,28,2,30,10);
        g.fillStyle(0xff8820).fillTriangle(11,10,12,6,14,10).fillTriangle(20,10,22,6,24,10);
        g.fillStyle(col).fillRect(32,20,10,16);
        g.fillStyle(0xff6000).fillCircle(36,18,5);
        g.fillStyle(col).fillRect(6,36,10,6).fillRect(32,36,10,6);
        g.fillStyle(0xff4400, 0.5).fillRect(14,22,6,8).fillRect(26,24,6,6);
      },
      // Crypthorn
      27: () => {
        g.fillStyle(col).fillEllipse(24,28,30,24);
        g.fillStyle(0x3a1060, 0.8).fillRect(6,6,10,28).fillRect(8,4,8,26);
        g.fillStyle(0x200050).fillTriangle(4,6,8,18,2,22).fillTriangle(6,14,10,24,2,28);
        g.fillStyle(0x400060).fillTriangle(18,0,24,0,21,14); // horn
        g.fillStyle(0x6000a0).fillTriangle(19,0,23,0,21,14);
        g.fillStyle(0xaa00ff, 0.5).fillRect(21,1,1,12);
        g.fillStyle(col).fillRect(28,12,6,22);
        g.fillStyle(0x8000ff, 0.35).fillRect(28,10,6,24);
        g.fillStyle(col).fillRect(8,36,6,6).fillRect(14,36,6,6).fillRect(28,36,6,6).fillRect(34,36,6,6);
      },
      // Sunpuff
      28: () => {
        g.fillStyle(col).fillCircle(24,24,16);
        g.fillStyle(0xffd860).fillCircle(24,22,13);
        g.fillStyle(0xffe880).fillCircle(16,20,7).fillCircle(32,20,7).fillCircle(24,18,7)
          .fillCircle(16,28,7).fillCircle(32,28,7).fillCircle(24,32,6);
        g.fillStyle(0xffa000)
          .fillTriangle(24,4,22,10,26,10).fillTriangle(38,8,34,14,42,12)
          .fillTriangle(44,24,38,22,42,28).fillTriangle(38,40,34,34,42,36)
          .fillTriangle(24,46,22,40,26,40).fillTriangle(10,40,6,36,14,34)
          .fillTriangle(4,24,10,22,6,28).fillTriangle(10,8,6,12,14,14);
        g.fillStyle(0xff8800, 0.25).fillCircle(24,22,12);
      },
      // Frostpine
      29: () => {
        g.fillStyle(0x8ab0d0).fillRect(20,8,8,40);
        g.fillStyle(0x6090b0).fillRect(16,12,6,28).fillRect(26,12,6,28);
        g.fillStyle(0x4080c0).fillTriangle(4,40,24,28,44,40);
        g.fillStyle(0x60a0d0).fillTriangle(6,32,24,20,42,32);
        g.fillStyle(0x80c0e0).fillTriangle(9,22,24,10,39,22);
        g.fillStyle(0xd0e8ff).fillTriangle(6,40,24,32,42,40);
        g.fillStyle(0xb0d0f0).fillTriangle(8,32,24,24,40,32);
        g.fillStyle(0xc0e0ff).fillTriangle(11,22,24,14,37,22);
        g.fillStyle(0xa0d0f8).fillTriangle(18,8,24,0,30,8);
        g.fillStyle(0xd0f0ff).fillTriangle(19,8,24,2,29,8);
        g.fillStyle(0xc0e8ff).fillRect(8,40,3,6).fillRect(18,40,3,8).fillRect(26,40,3,6).fillRect(36,40,3,5);
      },
      // Glacivern
      30: () => {
        g.fillStyle(col).fillEllipse(24,28,30,24);
        g.fillStyle(0xa0d8f0, 0.7).fillTriangle(2,8,14,18,4,32).fillTriangle(46,8,34,18,44,32);
        g.fillStyle(0xc0eeff, 0.4).fillTriangle(3,10,14,18,5,28).fillTriangle(45,10,34,18,43,28);
        g.fillStyle(0x90c8e8).fillTriangle(14,8,18,14,22,8).fillTriangle(22,8,24,2,28,8)
          .fillTriangle(26,8,28,14,32,8); // ice spine ridge
        g.fillStyle(0xd0f0ff).fillTriangle(16,8,18,12,20,8).fillTriangle(22,8,24,4,28,8);
        g.fillStyle(col).fillRect(30,22,10,18).fillRect(36,14,6,18);
        g.fillStyle(0x90c8e8).fillTriangle(30,14,36,10,38,18);
        g.fillStyle(0xd0f0ff).fillTriangle(31,14,36,11,37,17);
        g.fillStyle(col).fillRect(6,36,8,8).fillRect(34,36,8,8);
        g.fillStyle(0xd0f0ff).fillRect(6,42,3,6).fillRect(10,42,3,6).fillRect(34,42,3,6).fillRect(38,42,3,6);
      },
    };

    if (B[id]) {
      B[id]();
    } else {
      // Fallback generic back
      const c = typeColors[id] ?? 0x8080a0;
      g.fillStyle(c).fillEllipse(24,26,30,26);
      g.fillStyle(Math.round(c*0.7)&0xffffff).fillEllipse(24,24,22,18);
    }
  }

  // ── NPC SPRITES ──────────────────────────────────────────────────────────────
  private generateNPCSprites() {
    const g = this.add.graphics();
    const W = 32, H = 40; // wider/taller than 32×32 player for distinctiveness

    // Shared helper: draw a character body at (cx, cy) with given colours
    const drawBody = (
      cx: number, cy: number,
      shirtCol: number, pantsCol: number, skinCol: number,
      hairCol: number, hatCol: number | null,
      extras?: () => void,
    ) => {
      // Shoes
      g.fillStyle(0x302010).fillRect(cx - 7, cy + 12, 6, 4).fillRect(cx + 1, cy + 12, 6, 4);
      // Pants
      g.fillStyle(pantsCol).fillRect(cx - 8, cy + 4, 16, 9);
      // Shirt
      g.fillStyle(shirtCol).fillRect(cx - 9, cy - 4, 18, 10);
      // Arms
      g.fillStyle(shirtCol).fillRect(cx - 13, cy - 3, 5, 8).fillRect(cx + 8, cy - 3, 5, 8);
      // Hands
      g.fillStyle(skinCol).fillRect(cx - 13, cy + 4, 5, 3).fillRect(cx + 8, cy + 4, 5, 3);
      // Neck
      g.fillStyle(skinCol).fillRect(cx - 4, cy - 7, 8, 4);
      // Head
      g.fillStyle(skinCol).fillRect(cx - 7, cy - 18, 14, 12);
      // Hair
      g.fillStyle(hairCol).fillRect(cx - 7, cy - 18, 14, 5);
      // Eyes
      g.fillStyle(0x101010).fillRect(cx - 5, cy - 11, 3, 3).fillRect(cx + 2, cy - 11, 3, 3);
      // Hat or accessory
      if (hatCol !== null) {
        g.fillStyle(hatCol).fillRect(cx - 9, cy - 20, 18, 4).fillRect(cx - 7, cy - 24, 14, 6);
      }
      if (extras) extras();
    };

    // ── Prof. Rowan — blue academic coat, grey hair, glasses ─────────────────
    g.clear();
    drawBody(16, 26, 0x3050b0, 0x303060, 0xf0c8a0, 0xa0a0a0, null, () => {
      // Lab coat over shirt
      g.fillStyle(0xe8e8f0).fillRect(9, 22, 6, 14).fillRect(17, 22, 6, 14);
      // Glasses
      g.fillStyle(0x606060).fillRect(8, 16, 7, 1).fillRect(17, 16, 7, 1).fillRect(15, 16, 2, 1);
      g.fillStyle(0x8080ff, 0.5).fillRect(9, 17, 5, 3).fillRect(18, 17, 5, 3);
      // Book in hand
      g.fillStyle(0x8b4513).fillRect(3, 22, 6, 8);
      g.fillStyle(0xfff8e8).fillRect(4, 23, 4, 6);
    });
    g.generateTexture('npc_rowan', W, H);

    // ── Nurse Joy — pink uniform, pink bun, white apron ───────────────────────
    g.clear();
    drawBody(16, 26, 0xff80a0, 0xff6090, 0xffe0e8, 0xff4080, null, () => {
      // Pink cap with cross
      g.fillStyle(0xffffff).fillRect(9, 8, 14, 5);
      g.fillStyle(0xff4080).fillRect(15, 8, 2, 5).fillRect(11, 10, 10, 1);
      // Apron
      g.fillStyle(0xffffff, 0.9).fillRect(11, 22, 10, 14);
      // Heart badge
      g.fillStyle(0xff2060).fillRect(14, 24, 4, 3);
      // Cross on apron
      g.fillStyle(0xff4080).fillRect(15, 26, 2, 4).fillRect(13, 28, 6, 2);
      // Smile
      g.fillStyle(0xff6090).fillRect(13, 15, 6, 1);
    });
    g.generateTexture('npc_nurse', W, H);

    // ── Shopkeeper — green merchant coat, yellow hair, money bag ─────────────
    g.clear();
    drawBody(16, 26, 0x608040, 0x405020, 0xf0c8a0, 0xd0c020, null, () => {
      // Merchant cap (flat cap)
      g.fillStyle(0x506030).fillRect(7, 10, 18, 3).fillRect(9, 7, 14, 5);
      g.fillStyle(0xd0c020).fillRect(7, 12, 18, 1); // cap band
      // Vest
      g.fillStyle(0x405020).fillRect(11, 22, 4, 12).fillRect(17, 22, 4, 12);
      // Coin bag
      g.fillStyle(0xc8a040).fillCircle(4, 28, 5);
      g.fillStyle(0xa08030).fillRect(6, 24, 4, 3);
      g.fillStyle(0xffd700).fillRect(5, 25, 3, 1);
      // Smile
      g.fillStyle(0x805020).fillRect(13, 15, 6, 1);
    });
    g.generateTexture('npc_shopkeeper', W, H);

    // ── Generic villager A (npc1) — green shirt, brown pants ─────────────────
    g.clear();
    drawBody(16, 26, 0x40a060, 0x6a4020, 0xf0c8a0, 0x602010, null, () => {
      g.fillStyle(0x303060).fillRect(7, 9, 18, 4);  // cap
      g.fillStyle(0x404080).fillRect(9, 7, 12, 4);
    });
    g.generateTexture('npc_villager_a', W, H);

    // ── Generic villager B (npc2) — red shirt, dark pants, bandana ───────────
    g.clear();
    drawBody(16, 26, 0xc04020, 0x303030, 0xf0d0b0, 0x2a1a0a, null, () => {
      // Bandana on head
      g.fillStyle(0xe04040).fillRect(7, 10, 18, 5);
      g.fillStyle(0xc03030).fillRect(7, 13, 18, 2);
      // Scarf
      g.fillStyle(0xe04040).fillRect(9, 19, 14, 4);
    });
    g.generateTexture('npc_villager_b', W, H);

    // ── Generic villager C (npc3) — old man, grey outfit, walking stick ───────
    g.clear();
    drawBody(16, 26, 0x808090, 0x606070, 0xf0d0b0, 0xd0d0d0, 0x707080, () => {
      // Walking stick
      g.fillStyle(0x8a5a20).fillRect(28, 14, 3, 22);
      g.fillStyle(0xc08040).fillRect(28, 12, 3, 4);
      // Beard
      g.fillStyle(0xd8d8d8).fillRect(10, 16, 12, 6);
      // Wrinkle lines
      g.fillStyle(0xd0b090).fillRect(10, 12, 2, 1).fillRect(20, 12, 2, 1);
    });
    g.generateTexture('npc_villager_c', W, H);

    // ── Trainer 1 — sporty red, cap, fierce look ──────────────────────────────
    g.clear();
    drawBody(16, 26, 0xd03020, 0x202060, 0xf0c8a0, 0x1a1a1a, 0xd03020, () => {
      // Sporty stripe on shirt
      g.fillStyle(0xffffff).fillRect(9, 20, 18, 2);
      // Wristbands
      g.fillStyle(0xffffff).fillRect(3, 26, 5, 2).fillRect(24, 26, 5, 2);
      // Battle pose — arms angled
      g.fillStyle(0xf0c8a0).fillRect(2, 22, 5, 4).fillRect(25, 22, 5, 4);
      // Angry brows
      g.fillStyle(0x1a1a1a).fillRect(8, 10, 5, 2).fillRect(19, 10, 5, 2);
    });
    g.generateTexture('npc_trainer1', W, H);

    // ── Trainer 2 — blue, smart, glasses ──────────────────────────────────────
    g.clear();
    drawBody(16, 26, 0x2050a0, 0x102040, 0xf0c8a0, 0x301810, null, () => {
      // Collared shirt
      g.fillStyle(0xffffff).fillRect(13, 20, 6, 6);
      // Glasses
      g.fillStyle(0x404040).fillRect(8, 15, 7, 1).fillRect(17, 15, 7, 1).fillRect(15, 15, 2, 1);
      g.fillStyle(0x80a0ff, 0.4).fillRect(9, 16, 5, 3).fillRect(18, 16, 5, 3);
      // Belt
      g.fillStyle(0x8a6020).fillRect(8, 31, 16, 2);
      g.fillStyle(0xffd700).fillRect(14, 31, 4, 2);
    });
    g.generateTexture('npc_trainer2', W, H);

    // ── Trainer 3 — woodsy brown, rugged, scar ────────────────────────────────
    g.clear();
    drawBody(16, 26, 0x6a3a18, 0x3a2010, 0xe8b890, 0x1a0a08, 0x3a2010, () => {
      // Vest / waistcoat
      g.fillStyle(0x8a5a28).fillRect(9, 20, 6, 12).fillRect(17, 20, 6, 12);
      // Scar on face
      g.fillStyle(0xc08060).fillRect(18, 11, 1, 5);
      // Stubble
      g.fillStyle(0x3a2010).fillRect(10, 16, 12, 2);
      // Wristbands (leather)
      g.fillStyle(0x5a3018).fillRect(3, 25, 5, 3).fillRect(24, 25, 5, 3);
    });
    g.generateTexture('npc_trainer3', W, H);

    // ── Earth Dungeon trainer — stony gray/tan digging gear, hard hat ─────────
    g.clear();
    drawBody(16, 26, 0x8a7a5a, 0x6a5a3a, 0xd8a878, 0x3a2c1c, 0x8a7a5a, () => {
      // Hard hat
      g.fillStyle(0xc0a040).fillRect(8, 6, 16, 6);
      g.fillStyle(0xa08030).fillRect(8, 10, 16, 2);
      // Rugged vest
      g.fillStyle(0x6a5a3a).fillRect(9, 20, 6, 12).fillRect(17, 20, 6, 12);
      // Gloves
      g.fillStyle(0x5a4a2a).fillRect(2, 25, 5, 3).fillRect(25, 25, 5, 3);
    });
    g.generateTexture('npc_earth_trainer', W, H);

    // ── Earth Dungeon Master — imposing dark stone-armored figure ─────────────
    g.clear();
    drawBody(16, 26, 0x5a5048, 0x38322c, 0xc0a888, 0x1a1a1a, 0x8a7040, () => {
      // Heavy stone shoulder plates
      g.fillStyle(0x726858).fillRect(3, 18, 9, 8).fillRect(20, 18, 9, 8);
      // Crown/horned helm
      g.fillStyle(0x2e2a24).fillRect(9, 4, 14, 8);
      g.fillStyle(0x8a7040).fillRect(7, 6, 3, 6).fillRect(22, 6, 3, 6); // horns
      // Glowing eyes
      g.fillStyle(0xffb020).fillRect(11, 9, 3, 2).fillRect(18, 9, 3, 2);
      // Cracked earth-toned cape
      g.fillStyle(0x4a4038, 0.9).fillRect(6, 22, 20, 16);
    });
    g.generateTexture('npc_dungeon_master', W, H);

    // ── Mom / assistant — warm dress, apron ───────────────────────────────────
    g.clear();
    drawBody(16, 26, 0xe05080, 0xe03060, 0xffe0e8, 0x8b2040, null, () => {
      // Longer skirt / dress look
      g.fillStyle(0xe03060).fillRect(7, 32, 18, 6);
      g.fillStyle(0xffc0d0).fillRect(8, 30, 16, 4);
      // Apron ties
      g.fillStyle(0xffffff, 0.8).fillRect(13, 23, 2, 12).fillRect(17, 23, 2, 12);
      // Hair bun
      g.fillStyle(0x8b2040).fillCircle(16, 8, 5);
      g.fillStyle(0xc04060).fillCircle(16, 8, 3);
    });
    g.generateTexture('npc_mom', W, H);

    // ── Sign board — wooden post with notice board (replaces human sprite for signs) ──
    g.clear();
    g.fillStyle(0x6a4828).fillRect(13, 20, 6, 20);    // post
    g.fillStyle(0x5a3818).fillRect(13, 20, 2, 20);    // post shadow
    g.fillStyle(0xd4a870).fillRoundedRect(2, 4, 28, 18, 3);  // board
    g.lineStyle(2, 0x8a5a28).strokeRoundedRect(2, 4, 28, 18, 3);
    g.fillStyle(0xe8c090).fillRoundedRect(4, 6, 24, 4, 2);   // board highlight
    g.fillStyle(0x6a3a18).fillRect(5, 12, 16, 2).fillRect(5, 16, 12, 2); // text lines
    g.generateTexture('npc_sign', W, H);

    // ── Move Reminder NPC — sage in purple robe with scroll ──────────────────
    g.clear();
    drawBody(16, 26, 0x6030a0, 0x402060, 0xf0d0b0, 0xd0c0f0, null, () => {
      // Purple wizard robe overlay
      g.fillStyle(0x7040b0).fillRect(7, 22, 6, 14).fillRect(19, 22, 6, 14);
      // Star/sparkle on robe
      g.fillStyle(0xffdd00).fillRect(15, 26, 2, 6).fillRect(12, 29, 8, 2);
      // Scroll in hand
      g.fillStyle(0xf0e0c0).fillRect(25, 20, 5, 12);
      g.fillStyle(0xd4b890).fillRect(25, 20, 5, 2).fillRect(25, 30, 5, 2);
      g.fillStyle(0x8a6040).fillRect(26, 22, 3, 1).fillRect(26, 24, 3, 1).fillRect(26, 26, 3, 1);
      // Long beard
      g.fillStyle(0xe8e8e8).fillRect(11, 18, 10, 8);
      g.fillStyle(0xd0d0d0).fillRect(12, 22, 8, 4);
    });
    g.generateTexture('npc_move_reminder', W, H);

    g.destroy();
  }

  // ── UI ───────────────────────────────────────────────────────────────────────
  private generateUITextures() {
    const g = this.add.graphics();
    const W = 640, H = 480;

    // Battle background — layered atmospheric scene
    g.clear();
    // Sky gradient simulation (top to horizon)
    const skyBands = [
      [0,0,W,20,0x1a2a5e],[0,20,W,20,0x243470],[0,40,W,20,0x2e3e82],
      [0,60,W,20,0x384894],[0,80,W,20,0x4052a6],[0,100,W,30,0x4a5cb8],
      [0,130,W,40,0x6070c8],[0,170,W,40,0x7a84d8],[0,210,W,40,0x8fa0df],
    ];
    skyBands.forEach(([x,y,w,h,col]) => { g.fillStyle(col as number).fillRect(x as number,y as number,w as number,h as number); });
    // Sun
    g.fillStyle(0xfff4a0, 0.9).fillCircle(500, 60, 40);
    g.fillStyle(0xffff80, 0.5).fillCircle(500, 60, 55);
    g.fillStyle(0xffd700, 0.3).fillCircle(500, 60, 70);
    // Clouds
    g.fillStyle(0xffffff, 0.85);
    g.fillEllipse(380,50,80,28).fillEllipse(420,44,60,24).fillEllipse(350,48,50,20);
    g.fillStyle(0xffffff, 0.65);
    g.fillEllipse(140,70,100,32).fillEllipse(180,62,80,28).fillEllipse(110,68,60,22);
    g.fillStyle(0xffffff, 0.5);
    g.fillEllipse(560,90,70,22).fillEllipse(590,84,50,18);
    // Distant mountains
    g.fillStyle(0x3a3a6a);
    g.fillTriangle(0,260,80,160,160,260).fillTriangle(80,260,200,140,320,260)
      .fillTriangle(200,260,340,120,480,260).fillTriangle(360,260,500,150,640,260)
      .fillTriangle(520,260,620,170,640,260);
    g.fillStyle(0x4a4a7a);
    g.fillTriangle(0,260,60,180,140,260).fillTriangle(100,260,220,155,340,260)
      .fillTriangle(280,260,400,130,540,260).fillTriangle(460,260,560,165,640,260);
    // Mountain snow caps
    g.fillStyle(0xe8e8ff, 0.7);
    g.fillTriangle(80,160,110,175,60,175).fillTriangle(200,140,230,160,170,160)
      .fillTriangle(340,120,370,142,310,142).fillTriangle(500,150,528,168,472,168);
    // Mid-ground treeline silhouette
    g.fillStyle(0x1a3a14);
    for (let tx = -10; tx < W + 10; tx += 18) {
      const h = 35 + Math.sin(tx * 0.15) * 12 + Math.sin(tx * 0.07) * 8;
      g.fillTriangle(tx, 280, tx + 9, 280 - h, tx + 18, 280);
    }
    g.fillStyle(0x143010);
    for (let tx = 0; tx < W; tx += 22) {
      const h = 25 + Math.cos(tx * 0.12) * 10;
      g.fillTriangle(tx, 282, tx + 11, 282 - h, tx + 22, 282);
    }
    // Ground (grass platform — enemy side)
    g.fillStyle(0x2a5e18).fillRect(0, 276, W, H - 276);
    g.fillStyle(0x387820).fillRect(0, 276, W, 12);
    g.fillStyle(0x46922a).fillRect(0, 276, W, 5);
    // Ground detail — grass tufts
    g.fillStyle(0x2a5e18);
    for (let gx = 0; gx < W; gx += 14) {
      const gh = 4 + Math.sin(gx * 0.3) * 3;
      g.fillTriangle(gx, 276, gx + 4, 276 - gh, gx + 8, 276);
    }
    // Player platform (front, slightly higher grass)
    g.fillStyle(0x326c1a).fillRect(0, 340, 280, H - 340);
    g.fillStyle(0x3e861e).fillRect(0, 340, 280, 8);
    g.fillStyle(0x4aa028).fillRect(0, 340, 280, 3);
    // Distant haze at horizon
    g.fillStyle(0x8090c0, 0.3).fillRect(0, 258, W, 24);

    g.generateTexture('battle_bg', W, H);

    // HP bar backgrounds
    g.clear().fillStyle(0x202020).fillRoundedRect(0, 0, 200, 16, 4);
    g.generateTexture('hpbar_bg', 200, 16);
    g.clear().fillStyle(0x30c030).fillRoundedRect(0, 0, 196, 12, 3);
    g.generateTexture('hpbar_full', 196, 12);

    // Menu boxes
    g.clear().fillStyle(0x1a1a2e).fillRoundedRect(0, 0, 400, 80, 8)
      .lineStyle(2, 0x4080ff).strokeRoundedRect(0, 0, 400, 80, 8);
    g.generateTexture('menu_box', 400, 80);

    g.clear().fillStyle(0x1a1a2e, 0.95).fillRoundedRect(0, 0, 608, 100, 8)
      .lineStyle(3, 0xffd700).strokeRoundedRect(0, 0, 608, 100, 8);
    g.generateTexture('dialogue_box', 608, 100);

    g.clear().fillStyle(0x1a1a2e).fillRoundedRect(0, 0, 300, 130, 8)
      .lineStyle(2, 0xffd700).strokeRoundedRect(0, 0, 300, 130, 8);
    g.generateTexture('battle_menu', 300, 130);

    g.clear().fillStyle(0x1a1a2e).fillRoundedRect(0, 0, 220, 70, 6)
      .lineStyle(2, 0xffffff, 0.5).strokeRoundedRect(0, 0, 220, 70, 6);
    g.generateTexture('nameplate', 220, 70);

    // Capture orb
    const orbColors = [0xff4020, 0xff6040, 0xff8060];
    orbColors.forEach((c, i) => {
      g.clear().fillStyle(c).fillCircle(16, 16, 14)
        .fillStyle(0xffffff, 0.3).fillEllipse(10, 10, 8, 6)
        .fillStyle(0x101010).fillRect(2, 14, 28, 4)
        .fillStyle(0xffffff).fillCircle(16, 16, 3);
      g.generateTexture(`capture_orb_${i}`, 32, 32);
    });

    // Starter box
    g.clear().fillStyle(0x1a2a3a).fillRoundedRect(0, 0, 180, 220, 12)
      .lineStyle(3, 0xffd700).strokeRoundedRect(0, 0, 180, 220, 12);
    g.generateTexture('starter_box', 180, 220);

    g.destroy();
  }
}

export default BootScene;