import type { MapData } from './types';

export const TILE = {
  GRASS: 0, PATH: 1, TALL_GRASS: 2, TREE: 3, WATER: 4,
  WALL: 5, FLOOR: 6, SAND: 7, FLOWER: 8, SIGN: 9,
  FENCE: 10, ROOF: 11, DOOR: 12,
  BOULDER: 13, ROCK_PATH: 14, MUD: 15, CAVE_FLOOR: 16,
  WALL_CORAL: 17, ROOF_CORAL: 18, SEAWEED: 19,
  PALM: 20, SHELL: 21, DOCK: 22, CRYSTAL: 23,
  // Electric-region set (storm routes + Voltspire City): HEDGE is the Route 2
  // maze's wall tile, PUDDLE is storm-soaked ground flavor for both routes,
  // NEON_FLOOR/NEON_WALL are the city's yellow-and-blue futuristic streets
  // and buildings, STREETLAMP is a solid glowing light source.
  HEDGE: 24, PUDDLE: 25, NEON_FLOOR: 26, NEON_WALL: 27, STREETLAMP: 28,
  // Vertical-oriented fence — a distinct tile from FENCE because that one's
  // art (vertical posts + horizontal rails) is drawn for a fence running
  // LEFT-RIGHT. Stacked north-south instead, it doesn't read as a
  // continuous line — each tile just repeats its own horizontal rail band,
  // so a vertical run looks like stacked horizontal segments, not a fence
  // running alongside the water. This tile is the 90°-rotated equivalent
  // (continuous vertical rails, horizontal cross-posts) for that use case.
  FENCE_V: 29,
  // Nature City set — living treehouse architecture: TREEHOUSE_WALL is the
  // wood-trunk building facade, TREEHOUSE_ROOF is the leafy canopy "roof".
  TREEHOUSE_WALL: 30, TREEHOUSE_ROOF: 31,
  // Autumn-evening decoration: MAPLE_TREE is a distinct red-orange canopy
  // tree (vs. the plain green TREE border), AUTUMN_GRASS is orange-tinted
  // ground with fallen-leaf litter, for visual variety beyond flat green.
  MAPLE_TREE: 32, AUTUMN_GRASS: 33,
};

export const TILE_SIZE = 32;
export const TILE_SOLID = new Set([TILE.TREE, TILE.WATER, TILE.WALL, TILE.FENCE, TILE.SIGN, TILE.ROOF, TILE.BOULDER, TILE.WALL_CORAL, TILE.ROOF_CORAL, TILE.SEAWEED, TILE.PALM, TILE.HEDGE, TILE.NEON_WALL, TILE.STREETLAMP, TILE.FENCE_V, TILE.TREEHOUSE_WALL, TILE.TREEHOUSE_ROOF, TILE.MAPLE_TREE]);

const T = TILE.TREE, G = TILE.GRASS, P = TILE.PATH, S = TILE.TALL_GRASS;
const W = TILE.WATER, L = TILE.WALL, F = TILE.FLOOR, R = TILE.ROOF;
const D = TILE.DOOR, H = TILE.FLOWER;
const B = TILE.BOULDER, K = TILE.ROCK_PATH, M = TILE.MUD, C = TILE.CAVE_FLOOR;
const LW = TILE.WALL_CORAL, RW = TILE.ROOF_CORAL, SW = TILE.SEAWEED;
const SD = TILE.SAND;
const PM = TILE.PALM, SH = TILE.SHELL, DK = TILE.DOCK;
const FN = TILE.FENCE, CR = TILE.CRYSTAL;
const HG = TILE.HEDGE, PD = TILE.PUDDLE, NF = TILE.NEON_FLOOR, NW = TILE.NEON_WALL, SL = TILE.STREETLAMP;
const FV = TILE.FENCE_V;
const THW = TILE.TREEHOUSE_WALL, THR = TILE.TREEHOUSE_ROOF;
const MT = TILE.MAPLE_TREE, AG = TILE.AUTUMN_GRASS;

// ─── OAKWIND VILLAGE (32 × 24) ────────────────────────────────────────────────
// Houses: left=(x:2-4,y:2-5), right=(x:19-24,y:2-5) → Pokémon Center
// Lab:    left side at y:12-16
const OAK_TILES: number[][] = [
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,P,P,P,P,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,H,G,G,G,G,P,P,P,P,P,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,H,G,H,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,G,P,P,P,P,P,P,P,P,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,H,H,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,H,H,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

// ─── ROUTE 1 (32 × 24) ───────────────────────────────────────────────────────
const R1_TILES: number[][] = [
  [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,T,T,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,T,T,S,S,S,S,S,S,S,T],
  [T,S,S,S,T,T,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,T,T,S,S,S,S,S,S,S,T],
  [T,G,G,G,T,T,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,T,T,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,T,T,S,S,P,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,T,T,S,S,P,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,H,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,H,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,T,T,S,S,S,S,S,P,S,S,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,T,T,S,S,S,S,S,P,S,S,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,H,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,H,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,W,W,W,W,W,G,G,P,G,G,G,G,G,G,G,W,W,W,W,W,G,G,G,G,G,T],
  [T,G,G,G,G,G,W,W,W,W,W,G,G,P,G,G,G,G,G,G,G,W,W,W,W,W,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  // Row 23: path opening at x=13 leads to Route 2 (exit triggers from row 22 stepping south)
  [T,T,T,T,T,T,T,T,T,T,T,T,T,P,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

// ─── ROUTE 2 (32 × 24) ───────────────────────────────────────────────────────
const R2_TILES: number[][] = [
  [T,T,T,T,T,T,T,T,T,T,T,T,T,P,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,T,T,T,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,T,T,T,S,S,S,S,S,S,S,T],
  [T,S,S,T,T,T,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,T,T,T,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,W,W,W,W,W,G,G,G,G,G,G,G,P,G,G,G,G,G,G,W,W,W,W,W,G,G,G,G,G,G,T],
  [T,W,W,W,W,W,G,G,G,G,G,G,G,P,G,G,G,G,G,G,W,W,W,W,W,G,G,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,T,T,T,S,S,S,S,P,S,S,S,S,T,T,T,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,H,S,T,T,T,S,S,S,S,P,S,S,S,S,T,T,T,S,S,S,S,S,S,H,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,W,W,W,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,W,W,W,G,G,G,G,T],
  [T,W,W,W,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,W,W,W,G,G,G,G,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,S,S,S,S,S,S,S,S,S,S,S,S,P,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,T,T,S,S,S,P,S,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,S,S,S,S,S,S,S,T,T,S,S,S,P,S,S,S,T,T,S,S,S,S,S,S,S,S,S,S,S,S,T],
  [T,G,G,G,G,G,G,G,G,G,G,G,G,P,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,T],
  [T,T,T,T,T,T,T,T,T,T,T,T,T,P,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
];

// ─── EARTHENHOLD (32 × 24) — Earth-themed dungeon city ──────────────────────
// Grayish rocky paths + mud replace most grass; boulders scattered as obstacles.
// Earth Lodge (nurse/shop/move reminder) on the west side; grandiose Dungeon
// Gate on the east side leading into the Earthen Dungeon.
function makeEarthenholdTiles(): number[][] {
  const w = 32, h = 24;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(K));

  // Border
  for (let x = 0; x < w; x++) { grid[0][x] = T; grid[h - 1][x] = T; }
  for (let y = 0; y < h; y++) { grid[y][0] = T; grid[y][w - 1] = T; }

  // Main north-south road from Route 2 entrance down through the city,
  // continuing through a gap in the south border to the new Cave Route.
  for (let y = 1; y < h; y++) { grid[y][13] = P; grid[y][14] = P; }
  // East-west road connecting the Lodge and the Dungeon Gate
  for (let x = 1; x < w - 1; x++) { grid[11][x] = P; grid[12][x] = P; }

  // Scattered mud patches
  const mudSpots: [number, number][] = [
    [4, 15], [5, 15], [4, 16], [18, 6], [19, 6], [18, 7],
    [22, 16], [23, 16], [23, 17], [6, 19], [7, 19], [7, 20],
  ];
  for (const [x, y] of mudSpots) grid[y][x] = M;

  // Scattered boulders (solid obstacles) dotted around the open plaza
  // (kept clear of doors, roads, and NPC tiles)
  const boulders: [number, number][] = [
    [10, 14], [10, 15], [20, 14], [21, 19], [9, 4], [18, 14],
    [16, 16], [17, 5], [6, 20], [25, 15],
  ];
  for (const [x, y] of boulders) grid[y][x] = B;

  // A little surviving grass, much less than the village
  const grassSpots: [number, number][] = [
    [3, 3], [3, 4], [28, 3], [28, 4], [3, 20], [28, 20],
  ];
  for (const [x, y] of grassSpots) grid[y][x] = G;

  // Glinting crystal veins — Earthenhold's signature decoration, scattered
  // through the open plaza away from roads/buildings/boulders
  const crystalSpots: [number, number][] = [
    [12, 4], [19, 15], [7, 8], [24, 19], [15, 20], [4, 10],
  ];
  for (const [x, y] of crystalSpots) if (grid[y][x] === K) grid[y][x] = CR;

  // ── Earth Lodge building (nurse/shop/move reminder), west side — now a
  // single whole-building sprite (see MapData.buildings) instead of
  // assembled from repeated wall/roof/door tiles, so the ground here stays
  // plain rocky-path; the building image is rendered as a second pass on
  // top of it, same layering idea as the fence decorations.

  // ── Dungeon Gate, east side — now a whole-building sprite (see
  // MapData.buildings); ground stays plain rocky-path.

  return grid;
}
const EARTHENHOLD_TILES: number[][] = makeEarthenholdTiles();

// ─── EARTHEN DUNGEON (22 × 20) — single grand hall ───────────────────────────
function makeEarthenDungeonTiles(): number[][] {
  const w = 22, h = 20;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(F));

  for (let x = 0; x < w; x++) { grid[0][x] = L; grid[h - 1][x] = L; }
  for (let y = 0; y < h; y++) { grid[y][0] = L; grid[y][w - 1] = L; }

  // South entrance (back to Earthenhold)
  grid[h - 1][10] = D; grid[h - 1][11] = D;

  // Rocky ground accents — hand-placed rather than a formula, so the floor
  // reads as scattered rubble instead of a repeating diagonal stripe.
  const rockyAccents: [number, number][] = [
    [3, 4], [6, 3], [14, 4], [18, 3], [4, 8], [9, 9], [15, 8], [19, 9],
    [3, 12], [7, 13], [13, 12], [18, 13], [5, 16], [11, 15], [17, 16],
    [8, 6], [12, 6], [16, 12], [6, 11], [10, 5],
  ];
  for (const [x, y] of rockyAccents) grid[y][x] = K;

  // A few crystal veins glinting in the dungeon rock
  const dungeonCrystals: [number, number][] = [[5, 5], [16, 6], [9, 14], [14, 16]];
  for (const [x, y] of dungeonCrystals) grid[y][x] = CR;

  // Boulder pillars lining the approach toward the Dungeon Master
  for (let y = 3; y < h - 3; y += 3) {
    grid[y][3] = B; grid[y][w - 4] = B;
  }
  // A small boulder ring around the Dungeon Master's dais
  grid[2][9] = B; grid[2][12] = B; grid[3][8] = B; grid[3][13] = B;

  return grid;
}
const EARTHEN_DUNGEON_TILES: number[][] = makeEarthenDungeonTiles();

// ─── CAVE ROUTE (22 × 20) — dry cave giving way to a Surf-gated pool ─────────
// North door connects back to Earthenhold. A rocky corridor winds south past
// boulders, then opens onto a wide water pool that blocks all further
// progress until the player has Surf. Beyond the pool, a south door leads
// deeper into the Water Cave and, eventually, the Water City.
// Carves a winding tunnel segment: for each row between y0 and y1, the
// center-x and half-width are linearly interpolated between the given
// start/end values, producing an organic, wavy passage instead of a
// uniform rectangular room.
function carveTunnel(
  grid: number[][], w: number,
  y0: number, y1: number,
  cx0: number, cx1: number,
  width0: number, width1: number,
  tile: number,
) {
  const span = Math.max(1, y1 - y0);
  for (let y = y0; y <= y1; y++) {
    const t = (y - y0) / span;
    const cx = Math.round(cx0 + (cx1 - cx0) * t);
    const halfWidth = Math.max(1, Math.round((width0 + (width1 - width0) * t) / 2));
    for (let x = Math.max(1, cx - halfWidth); x <= Math.min(w - 2, cx + halfWidth); x++) {
      grid[y][x] = tile;
    }
  }
}

function makeCaveRouteTiles(): number[][] {
  const w = 22, h = 20;
  // Start as solid rock; the tunnel is carved out of it rather than starting
  // from an open floor, so any un-carved cell reads as natural cave rock,
  // not a built room wall. Using BOULDER (not WALL) keeps the whole place
  // reading as an outdoor-style cave, the same way routes use solid TREE
  // borders rather than architecture.
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(B));

  // North opening back to Earthenhold — a plain gap in the rock, not a door,
  // exactly like a route's tree-border path opening.
  grid[0][13] = C; grid[0][14] = C;

  // Winding entry passage down to the pool — drifts left, then right, widening
  carveTunnel(grid, w, 1, 4, 13, 12, 4, 7, C);
  carveTunnel(grid, w, 4, 9, 12, 13, 7, 9, C);

  // Rocky accents and boulder obstructions through the entry passage
  const rockyAccents: [number, number][] = [[11, 2], [15, 3], [8, 5], [16, 6], [9, 8]];
  for (const [x, y] of rockyAccents) grid[y][x] = K;
  grid[2][12] = B; grid[7][10] = B; grid[8][16] = B;

  // Wide water pool blocking the corridor — impassable without Surf.
  // Spans the full carveable width so there's no dry route around it.
  for (let y = 10; y <= 13; y++) {
    for (let x = 1; x <= w - 2; x++) grid[y][x] = W;
  }

  // Winding far-bank passage from the pool down to the south door — drifts
  // left then curves back right
  carveTunnel(grid, w, 14, 16, 11, 10, 9, 6, C);
  carveTunnel(grid, w, 16, 18, 10, 13, 6, 5, C);

  const farBankAccents: [number, number][] = [[9, 15], [14, 17], [7, 17]];
  for (const [x, y] of farBankAccents) grid[y][x] = K;
  grid[17][12] = B;

  // South opening onward to the Water Cave — same plain-gap treatment
  grid[h - 1][13] = C; grid[h - 1][14] = C;

  return grid;
}
const CAVE_ROUTE_TILES: number[][] = makeCaveRouteTiles();

// ─── WATER CAVE (22 × 22) — mostly-flooded passage, Surf required throughout ──
// A winding water channel with a few rocky islands to break up the swim.
// North opening back to Cave Route; south opening onto the Water City —
// both plain gaps in the rock, not doors, so it reads as an outdoor cave
// like Cave Route rather than an indoor room.
function makeWaterCaveTiles(): number[][] {
  const w = 22, h = 22;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(W));

  for (let x = 0; x < w; x++) { grid[0][x] = B; grid[h - 1][x] = B; }
  for (let y = 0; y < h; y++) { grid[y][0] = B; grid[y][w - 1] = B; }

  grid[0][13] = K; grid[0][14] = K;
  grid[h - 1][13] = K; grid[h - 1][14] = K;

  // A short dry landing just inside the north opening (so the player isn't
  // dropped straight into deep water) and another just inside the south one
  for (let x = 11; x <= 16; x++) { grid[1][x] = K; grid[2][x] = K; }
  for (let x = 11; x <= 16; x++) { grid[h - 2][x] = K; grid[h - 3][x] = K; }

  // Scattered rocky islands to break up the swim and give the water some shape
  const islands: [number, number, number, number][] = [
    // [x, y, width, height]
    [3, 6, 3, 2], [16, 5, 3, 2], [2, 12, 2, 3], [18, 11, 2, 3],
    [8, 9, 3, 2], [12, 14, 3, 2], [5, 17, 3, 2], [15, 17, 3, 2],
  ];
  for (const [ix, iy, iw, ih] of islands) {
    for (let y = iy; y < iy + ih; y++) for (let x = ix; x < ix + iw; x++) grid[y][x] = K;
  }

  return grid;
}
const WATER_CAVE_TILES: number[][] = makeWaterCaveTiles();

// ─── WATER CITY (26 × 20) — floating island, ringed by open sea ─────────────
// A sea "moat" (2 tiles thick) wraps the island, then a sandy shoreline, then
// the plaza itself: Water Lodge (nurse/shop/move reminder) to the west,
// Water Dungeon Gate to the east — the same civic template as Earthenhold.
function makeWaterCityTiles(): { grid: number[][]; decorations: { x: number; y: number; tile: number }[] } {
  const w = 26, h = 20;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(SD));
  const decorations: { x: number; y: number; tile: number }[] = [];

  // Outer sea moat, 2 tiles thick
  for (let t = 0; t < 2; t++) {
    for (let x = 0; x < w; x++) { grid[t][x] = W; grid[h - 1 - t][x] = W; }
    for (let y = 0; y < h; y++) { grid[y][t] = W; grid[y][w - 1 - t] = W; }
  }
  // Shallow kelp fringe just inside the moat, then the sandy beach begins
  for (let x = 2; x < w - 2; x++) { grid[2][x] = SW; grid[h - 3][x] = SW; }
  for (let y = 2; y < h - 2; y++) { grid[y][2] = SW; grid[y][w - 3] = SW; }

  // North dock — the arrival point from the Water Cave
  grid[0][13] = K; grid[0][14] = K; grid[1][13] = K; grid[1][14] = K;
  grid[2][13] = P; grid[2][14] = P;

  // Main north-south road from the dock down into the plaza
  for (let y = 2; y < h - 2; y++) { grid[y][13] = P; grid[y][14] = P; }
  // East-west road connecting the Lodge and the Dungeon Gate
  for (let x = 2; x < w - 2; x++) { grid[9][x] = P; grid[10][x] = P; }

  // Interior waterway — a canal cutting across the south of the plaza, with
  // a plank bridge where the main road crosses it. Gives Waveshore its own
  // "built around the water" identity instead of reading as dry ground with
  // a moat around the edge.
  for (let y = 13; y <= 14; y++) {
    for (let x = 4; x <= w - 5; x++) grid[y][x] = W;
  }
  const kelpInCanal: [number, number][] = [[6, 13], [10, 14], [17, 13], [20, 14]];
  for (const [x, y] of kelpInCanal) grid[y][x] = SW;
  grid[13][13] = P; grid[13][14] = P; grid[14][13] = P; grid[14][14] = P; // bridge

  // ── Water Lodge (nurse/shop/move reminder), west side — now a
  // whole-building sprite (see MapData.buildings); ground stays plain sand.

  // ── Dungeon Gate, east side — now a whole-building sprite (see
  // MapData.buildings); ground stays plain sand.

  // Fishing pier reaching out into the west moat — walkable over water
  // without needing Surf, since it's a built structure, not open sea
  for (let x = 0; x <= 3; x++) grid[12][x] = DK;
  grid[11][1] = DK; grid[13][1] = DK; // small T-head at the pier's outer end

  // Palm trees along the beach
  const palmSpots: [number, number][] = [[3, 11], [22, 3], [3, 16]];
  for (const [x, y] of palmSpots) if (grid[y][x] === SD) grid[y][x] = PM;

  // Shell/starfish accents scattered across the open sand
  const shellSpots: [number, number][] = [[7, 11], [16, 11], [9, 16], [17, 16], [22, 16], [5, 12]];
  for (const [x, y] of shellSpots) if (grid[y][x] === SD) grid[y][x] = SH;

  // Land bridge across the south moat — the Storm Thicket (forest maze)
  // exit. Walkable without Surf since it's a built dock, unlike the Storm
  // Coast opening at x:6-7 a bit further west, which is deliberately left
  // as open water (that route starts with surfing, this one doesn't).
  grid[17][20] = DK; grid[18][20] = DK; grid[19][20] = DK;

  // Fence channels flanking both new south exits, so each reads as an
  // intentional, marked route rather than a random gap in the moat/sand.
  // Uses FENCE_V (a vertical-oriented variant, see TILE.FENCE_V) since these
  // run north-south alongside the water — the regular FENCE tile's art is
  // drawn for a fence running left-right and doesn't read as continuous
  // when stacked vertically. Rows 17-19 only (right where the water/dock
  // actually is) so this doesn't run into the existing Pearl Diver NPC at
  // (19,16) or the shell decorations dotted along row 16. Rendered as
  // decorations (not baked into the grid) so the real kelp/water underneath
  // actually shows through the fence posts instead of a guessed background.
  for (let y = 17; y <= 19; y++) {
    decorations.push({ x: 5, y, tile: FV }, { x: 8, y, tile: FV });   // flanks the Storm Coast surf lane (x:6-7)
    decorations.push({ x: 19, y, tile: FV }, { x: 21, y, tile: FV }); // flanks the Storm Thicket dock (x:20)
  }

  return { grid, decorations };
}
const { grid: WATER_CITY_TILES, decorations: WATER_CITY_DECORATIONS } = makeWaterCityTiles();

// ─── WATER DUNGEON (24 × 22) — coral hall, single grand chamber ─────────────
// Fills a small rectangular island centered on (cx, cy) — used to give NPCs
// solid footing amid the open water.
function sandIsland(grid: number[][], cx: number, cy: number, rx: number, ry: number, tile: number = SD) {
  for (let y = cy - ry; y <= cy + ry; y++) {
    if (!grid[y]) continue;
    for (let x = cx - rx; x <= cx + rx; x++) {
      if (grid[y][x] !== undefined) grid[y][x] = tile;
    }
  }
}

function makeWaterDungeonTiles(): number[][] {
  const w = 24, h = 22;
  // The whole chamber is flooded — Surf is required to cross it, the same
  // way Water Cave works, rather than walking a dry dungeon floor.
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(W));

  for (let x = 0; x < w; x++) { grid[0][x] = L; grid[h - 1][x] = L; }
  for (let y = 0; y < h; y++) { grid[y][0] = L; grid[y][w - 1] = L; }

  // South entrance (back to Water City) — a sandy landing just inside the
  // door so the player isn't dropped straight into deep water
  grid[h - 1][11] = D; grid[h - 1][12] = D;
  sandIsland(grid, 11, 20, 3, 0);
  sandIsland(grid, 11, 19, 2, 1);

  // Trainer islands — small sandbars just big enough to stand on
  const trainerIslands: [number, number][] = [
    [5, 18], [18, 18], [5, 15], [18, 15], [5, 11], [12, 11], [18, 11],
  ];
  for (const [x, y] of trainerIslands) sandIsland(grid, x, y, 1, 1);

  // Dungeon Master's platform — wider, at the far end of the chamber
  sandIsland(grid, 12, 4, 2, 1);

  // Loose sand tufts and seaweed drifting in the open water — "a little
  // sand and seaweed here and there" rather than a uniform floor
  const sandTufts: [number, number][] = [
    [8, 7], [15, 8], [9, 13], [15, 13], [3, 16], [20, 16], [8, 4], [16, 17],
  ];
  for (const [x, y] of sandTufts) if (grid[y][x] === W) grid[y][x] = SD;

  const seaweedSpots: [number, number][] = [
    [6, 6], [14, 6], [9, 9], [16, 10], [4, 12], [19, 13], [7, 17],
    [15, 18], [10, 16], [13, 9], [3, 8], [20, 9], [6, 14], [17, 15],
  ];
  for (const [x, y] of seaweedSpots) if (grid[y][x] === W) grid[y][x] = SW;

  // A few coral-boulder outcrops in the open water for visual rhythm
  const boulders: [number, number][] = [
    [3, 6], [20, 6], [3, 13], [20, 13], [8, 2], [15, 2],
  ];
  for (const [x, y] of boulders) grid[y][x] = B;

  return grid;
}
const WATER_DUNGEON_TILES: number[][] = makeWaterDungeonTiles();

// ─── STORM COAST (32 × 24) — Water → Electric transition route ──────────────
// The sea from Waveshore's south moat continues here, then recedes into
// storm-soaked tidal flats, then solid (but still storm-lashed) land —
// a single route that carries the player from surfing to walking without
// a hard cut between the two. forceNight + ambientWeather: 'storm' on the
// MapData (see OverworldScene) keep it dark with rain and lightning the
// whole time, regardless of the real-time day/night cycle.
// The south edge is a dead end for now — it'll open onto Voltspire City
// once that's built; the "Storm rolls on..." sign flags this honestly
// rather than silently teleporting the player somewhere wrong.
function makeStormCoastTiles(): number[][] {
  const w = 32, h = 24;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(G));

  // Border
  for (let x = 0; x < w; x++) { grid[0][x] = T; grid[h - 1][x] = T; }
  for (let y = 0; y < h; y++) { grid[y][0] = T; grid[y][w - 1] = T; }

  // North gap — arrival from Waveshore's new south dock (matches the
  // waterCity exit added at x:6-7, y:19)
  grid[0][6] = W; grid[0][7] = W;

  // ── Open sea (rows 1-6): the moat continuing south, storm-tossed ──
  for (let y = 1; y <= 6; y++) {
    for (let x = 1; x < w - 1; x++) grid[y][x] = W;
  }
  const seaSeaweed: [number, number][] = [[4, 2], [11, 3], [19, 2], [25, 4], [8, 5], [22, 6]];
  for (const [x, y] of seaSeaweed) grid[y][x] = SW;

  // ── Tidal flats (rows 7-13): an uneven shoreline recedes south-eastward
  // (a gentle sine wave on the boundary so it doesn't read as a ruler-straight
  // line) — open water above the curve, storm-wet sand below it ──
  for (let y = 7; y <= 13; y++) {
    const t = (y - 7) / 6;
    const boundary = Math.round(3 + t * 25 + Math.sin(y * 1.3) * 2);
    for (let x = 1; x < w - 1; x++) grid[y][x] = x < boundary ? W : SD;
  }
  const flatPuddles: [number, number][] = [
    [21, 8], [24, 9], [18, 10], [27, 10], [22, 11], [26, 12], [19, 12], [24, 13],
  ];
  for (const [x, y] of flatPuddles) if (grid[y][x] === SD) grid[y][x] = PD;
  // Storm debris — boulders washed up onto the flats
  const flatBoulders: [number, number][] = [[20, 9], [28, 11]];
  for (const [x, y] of flatBoulders) if (grid[y][x] === SD) grid[y][x] = B;

  // ── Storm-soaked land (rows 14-22): grass/tall-grass with a north-south
  // path corridor, puddles pooling everywhere, and a thickening tree line
  // toward the south (the forest Route 2 will pick up on the other path) ──
  // Tall grass fills the WHOLE land zone as one contiguous field (not a
  // checkerboard) — the encounter counter only advances on CONSECUTIVE
  // encounter-tile steps and resets to 0 the moment you step off one, so a
  // checkerboard pattern (which caps any straight-line run at 2-3 tiles,
  // no matter its overall density) can never reach the 5-10 step threshold
  // needed to even roll the encounter dice. A solid field, like Route 1/2
  // use, is what actually makes encounters possible.
  for (let y = 14; y <= 22; y++) {
    for (let x = 1; x < w - 1; x++) grid[y][x] = S;
  }
  // Path corridor stops one row short of the border (h-2, not h-1) so it
  // never overwrites the solid south wall — the earlier version ran the
  // loop all the way to h, which punched a 2-tile gap straight through the
  // border at (15,23)/(16,23), inviting the player toward what looked like
  // an exit but was actually just the hard map edge.
  for (let y = 13; y < h - 1; y++) { grid[y][15] = P; grid[y][16] = P; }
  // Grass now encroaches on one of the two path columns almost every row
  // (alternating sides) so walking the direct route reliably brushes
  // encounter tiles, while the other column stays clear if you want to dodge.
  for (let y = 14; y < h - 1; y++) {
    const encroachX = (y % 2 === 0) ? 15 : 16;
    grid[y][encroachX] = S;
  }

  const landPuddles: [number, number][] = [
    [5, 15], [9, 17], [13, 20], [22, 16], [26, 18], [6, 21], [24, 21], [11, 15], [20, 19],
  ];
  for (const [x, y] of landPuddles) grid[y][x] = PD;

  // Tree clusters thickening toward the south border, foreshadowing the
  // forest that Route 2 (the other path to Voltspire) runs through
  const treeClusters: [number, number][] = [
    [3, 18], [4, 19], [3, 20], [28, 18], [29, 19], [28, 20],
    [4, 21], [5, 22], [27, 21], [26, 22], [2, 15], [29, 16],
  ];
  for (const [x, y] of treeClusters) grid[y][x] = T;

  // South border gap — Voltspire is now built, so this route actually goes
  // somewhere; carved deliberately here (not by the old path-corridor loop
  // overrunning the border, which was the original bug) at exactly the
  // path corridor's columns.
  grid[h - 1][15] = P; grid[h - 1][16] = P;

  return grid;
}
const STORM_COAST_TILES: number[][] = makeStormCoastTiles();

// ─── STORM THICKET (23 × 23) — the other Water → Electric route: a real,
// generated forest maze (hedge walls, tall-grass floor for encounters) ──
// Deterministic seeded PRNG so the generated maze is stable across rebuilds
// instead of reshuffling every time this module re-evaluates.
function mulberry32(seed: number) {
  let s = seed | 0;
  return function rand() {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface MazeResult {
  grid: number[][];
  /** Tile coords of the unique entrance→exit route through the maze. */
  path: [number, number][];
  /** Tile coords of every dead-end (degree-1) cell NOT on that route — safe
   * spots for NPCs, since blocking a true leaf cell can never cut off
   * anything else (there's nothing beyond it to reach). */
  deadEnds: { tile: [number, number]; distanceFromEntrance: number; distanceFromExit: number }[];
}

/**
 * Builds an `(2*cols+1) x (2*rows+1)` maze via randomized depth-first
 * "recursive backtracker" carving — the standard algorithm for generating a
 * *perfect* maze (a spanning tree over the cell grid: every cell reachable,
 * exactly one simple path between any two cells, so "which way is correct"
 * is always well-defined even though there are plenty of dead-end branches
 * to get lost in).
 */
function generateMaze(cols: number, rows: number, entranceCol: number, exitCol: number, seed: number): MazeResult {
  const rand = mulberry32(seed);
  const key = (c: number, r: number) => `${c},${r}`;
  const links: Record<string, Set<string>> = {};
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) links[key(c, r)] = new Set();

  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));
  const stack: [number, number][] = [[0, 0]];
  visited[0][0] = true;
  while (stack.length) {
    const [c, r] = stack[stack.length - 1];
    const candidates: [number, number][] = [];
    if (r > 0 && !visited[r - 1][c]) candidates.push([c, r - 1]);
    if (r < rows - 1 && !visited[r + 1][c]) candidates.push([c, r + 1]);
    if (c > 0 && !visited[r][c - 1]) candidates.push([c - 1, r]);
    if (c < cols - 1 && !visited[r][c + 1]) candidates.push([c + 1, r]);
    if (candidates.length === 0) { stack.pop(); continue; }
    const [nc, nr] = candidates[Math.floor(rand() * candidates.length)];
    visited[nr][nc] = true;
    links[key(c, r)].add(key(nc, nr));
    links[key(nc, nr)].add(key(c, r));
    stack.push([nc, nr]);
  }

  // Carve the tile grid: start solid hedge, punch a floor tile per cell plus
  // a connecting floor tile in the wall between every linked cell pair.
  const w = 2 * cols + 1, h = 2 * rows + 1;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(HG));
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) grid[2 * r + 1][2 * c + 1] = P;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    for (const n of links[key(c, r)]) {
      const [nc, nr] = n.split(',').map(Number);
      grid[r + nr + 1][c + nc + 1] = P;
    }
  }
  grid[0][2 * entranceCol + 1] = P;
  grid[h - 1][2 * exitCol + 1] = P;

  // BFS from the entrance cell over the tree — gives both the unique route
  // to the exit (walk `prev` back from the exit cell) and a distance value
  // for every cell (used below to find the *farthest* dead end).
  const startKey = key(entranceCol, 0);
  const prev: Record<string, string | null> = { [startKey]: null };
  const dist: Record<string, number> = { [startKey]: 0 };
  const queue: string[] = [startKey];
  while (queue.length) {
    const cur = queue.shift()!;
    const [c, r] = cur.split(',').map(Number);
    for (const n of links[key(c, r)]) {
      if (n in prev) continue;
      prev[n] = cur;
      dist[n] = dist[cur] + 1;
      queue.push(n);
    }
  }
  const path: [number, number][] = [];
  let cur: string | null = key(exitCol, rows - 1);
  while (cur) {
    const [c, r] = cur.split(',').map(Number);
    path.unshift([2 * c + 1, 2 * r + 1]);
    cur = prev[cur];
  }
  const pathKeys = new Set(path.map(([tx, ty]) => key((tx - 1) / 2, (ty - 1) / 2)));

  // Second BFS, from the exit cell this time — used below to find dead ends
  // close to the exit (for the south sign) the same way distanceFromEntrance
  // finds ones close to the entrance.
  const exitKey = key(exitCol, rows - 1);
  const distFromExit: Record<string, number> = { [exitKey]: 0 };
  const exitQueue: string[] = [exitKey];
  while (exitQueue.length) {
    const curK = exitQueue.shift()!;
    const [c, r] = curK.split(',').map(Number);
    for (const n of links[key(c, r)]) {
      if (n in distFromExit) continue;
      distFromExit[n] = distFromExit[curK] + 1;
      exitQueue.push(n);
    }
  }

  const deadEnds: MazeResult['deadEnds'] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const k = key(c, r);
    if (links[k].size === 1 && !pathKeys.has(k)) {
      deadEnds.push({ tile: [2 * c + 1, 2 * r + 1], distanceFromEntrance: dist[k], distanceFromExit: distFromExit[k] });
    }
  }

  return { grid, path, deadEnds };
}

// Entrance column 5, exit column 5 (both roughly centered — the maze itself,
// not the entrance/exit placement, is what makes this route non-trivial).
// Seed is an arbitrary fixed constant, not derived from anything time-based,
// so the layout never changes between builds.
const STORM_THICKET = generateMaze(11, 11, 5, 5, 20260827);

// Re-tag floor cells as tall grass — ALL of them, not a checkerboard. The
// encounter counter only advances on CONSECUTIVE encounter-tile steps and
// resets on any non-grass tile, so a checkerboard (which caps any run at
// 2-3 tiles regardless of overall density) structurally can't reach the
// 5-10 step threshold needed to even roll the dice — maze corridors are
// already short between turns, so every tile needs to count. A few puddles
// are sprinkled in afterward purely for storm flavor.
for (let y = 0; y < STORM_THICKET.grid.length; y++) {
  for (let x = 0; x < STORM_THICKET.grid[y].length; x++) {
    if (STORM_THICKET.grid[y][x] !== P) continue;
    STORM_THICKET.grid[y][x] = S;
  }
}
const thicketPuddleSpots: [number, number][] = [[3, 3], [9, 7], [15, 5], [19, 13], [7, 17], [13, 19]];
for (const [x, y] of thicketPuddleSpots) if (STORM_THICKET.grid[y]?.[x] === S) STORM_THICKET.grid[y][x] = PD;

const STORM_THICKET_TILES: number[][] = STORM_THICKET.grid;

// ─── VOLTSPIRE (32 × 24) — the Electric-region city Storm Coast leads to.
// Futuristic, night-lit, yellow-and-neon-blue, streetlamps glowing through
// the dark — an open plaza (not a maze), so NPCs can never block the only
// way through, unlike the routes leading here.
function makeVoltspireTiles(): number[][] {
  const w = 32, h = 24;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(NF));

  // Border — city buildings framing the plaza
  for (let x = 0; x < w; x++) { grid[0][x] = NW; grid[h - 1][x] = NW; }
  for (let y = 0; y < h; y++) { grid[y][0] = NW; grid[y][w - 1] = NW; }

  // Single north entrance from Storm Coast — Storm Thicket does NOT connect
  // here; it leads to a separate Nature City instead, still to be built.
  grid[0][8] = NF; grid[0][9] = NF;

  // Volt Lodge — now a whole-building sprite (see MapData.buildings);
  // ground stays plain neon floor.

  // Dungeon Gate, east side — now a whole-building sprite (see
  // MapData.buildings); ground stays plain neon floor.

  // Streetlamps lighting the plaza — solid glowing props (see fx_lampglow
  // in OverworldScene for the actual light-bleed effect), placed clear of
  // both the entrance lane and the two building facades
  const lampSpots: [number, number][] = [[3, 11], [3, 18], [28, 11], [28, 18], [14, 20], [17, 20], [14, 21], [17, 21], [14, 22], [17, 22]];
  for (const [x, y] of lampSpots) grid[y][x] = SL;

  // A few puddles near the entrances — rain tracked in from the storm routes
  const cityPuddles: [number, number][] = [[10, 15], [21, 16]];
  for (const [x, y] of cityPuddles) grid[y][x] = PD;

  return grid;
}
const VOLTSPIRE_TILES: number[][] = makeVoltspireTiles();

// Volt Dungeon — open floor plan like Earthen/Water Dungeon (not a maze),
// so trainers scattered around it can never block the only way through.
function makeVoltDungeonTiles(): number[][] {
  const w = 24, h = 22;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(F));
  for (let x = 0; x < w; x++) { grid[0][x] = L; grid[h - 1][x] = L; }
  for (let y = 0; y < h; y++) { grid[y][0] = L; grid[y][w - 1] = L; }
  grid[h - 1][11] = D; grid[h - 1][12] = D; // south entrance, back to Voltspire

  // Neon accent seams in the floor, echoing the city outside
  const neonAccents: [number, number][] = [
    [4, 5], [8, 4], [16, 5], [19, 4], [5, 9], [10, 10], [15, 9], [18, 10],
    [4, 14], [9, 15], [14, 14], [19, 15], [6, 18], [12, 17], [17, 18],
  ];
  for (const [x, y] of neonAccents) grid[y][x] = NF;

  // Boulder pillars lining the approach toward the Dungeon Master
  for (let y = 3; y < h - 3; y += 3) { grid[y][3] = B; grid[y][w - 4] = B; }
  grid[2][10] = B; grid[2][13] = B; grid[3][9] = B; grid[3][14] = B;

  return grid;
}
const VOLT_DUNGEON_TILES: number[][] = makeVoltDungeonTiles();

// ─── NATURE CITY (32 × 24) — the city Storm Thicket leads to. Living
// treehouse architecture (wood-trunk walls, leafy canopy roofs) instead of
// cut stone or neon panels, and forceDusk (see types.ts/OverworldScene) for
// a warm golden-hour tint rather than pitch dark — evening, not midnight.
function makeNatureCityTiles(): { grid: number[][]; decorations: { x: number; y: number; tile: number }[] } {
  const w = 32, h = 24;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(G));
  const decorations: { x: number; y: number; tile: number }[] = [];

  // Border — thick forest ringing the city, same TREE border every outdoor
  // map uses, rather than architecture (the city is nestled IN the woods) —
  // with maple trees mixed in for variety instead of a monotone tree line
  for (let x = 0; x < w; x++) { grid[0][x] = T; grid[h - 1][x] = T; }
  for (let y = 0; y < h; y++) { grid[y][0] = T; grid[y][w - 1] = T; }
  const borderMaples: [number, number][] = [[4, 0], [11, 0], [20, 0], [27, 0], [0, 6], [0, 14], [w - 1, 6], [w - 1, 14]];
  for (const [x, y] of borderMaples) if (grid[y]?.[x] === T) grid[y][x] = MT;

  // North entrance from Storm Thicket, with a path corridor running south
  // into the plaza
  grid[0][15] = P; grid[0][16] = P;
  for (let y = 1; y < h - 1; y++) { grid[y][15] = P; grid[y][16] = P; }

  // Nature Lodge — now a whole-building sprite (see MapData.buildings);
  // ground stays plain grass.

  // Dungeon Gate, east side — now a whole-building sprite (see
  // MapData.buildings); ground stays plain grass.

  // Autumn-grass patches — orange-tinted ground with fallen-leaf litter,
  // breaking up the flat green so the plaza reads as "fall evening", not
  // a generic lawn
  const autumnPatches: [number, number, number, number][] = [
    [17, 9, 4, 3], [22, 16, 5, 4], [3, 15, 4, 3], [17, 19, 6, 3],
  ];
  for (const [px, py, pw, ph] of autumnPatches) {
    for (let y = py; y < py + ph; y++) for (let x = px; x < px + pw; x++) if (grid[y]?.[x] === G) grid[y][x] = AG;
  }

  // Tall grass and stray flowers dotting the plaza
  const grassSpots: [number, number][] = [
    [5, 12], [6, 12], [26, 12], [25, 12], [4, 20], [28, 20], [4, 5], [28, 5],
  ];
  for (const [x, y] of grassSpots) if (grid[y][x] === G) grid[y][x] = S;

  // A proper fenced flowerbed — a small planted bed ringed by fence, not
  // just loose flowers scattered on open grass. Fences are decorations
  // (rendered over the plain grass here, not baked into the grid) so the
  // grass actually shows through around the fence posts.
  for (let x = 9; x <= 13; x++) { decorations.push({ x, y: 15, tile: FN }, { x, y: 17, tile: FN }); }
  decorations.push({ x: 9, y: 16, tile: FV }, { x: 13, y: 16, tile: FV });
  for (let x = 10; x <= 12; x++) grid[16][x] = H;

  // A few maple trees decorating the plaza itself, not just the border
  const plazaMaples: [number, number][] = [[14, 12], [17, 14], [3, 10], [28, 15]];
  for (const [x, y] of plazaMaples) if (grid[y]?.[x] === G || grid[y]?.[x] === S) grid[y][x] = MT;

  return { grid, decorations };
}
const { grid: NATURE_CITY_TILES, decorations: NATURE_CITY_DECORATIONS } = makeNatureCityTiles();

// Nature Dungeon — open floor plan like the other three dungeons (not a
// maze), so trainers scattered around it can never block the only way
// through. Continues the level curve above Volt Dungeon's 36-49.
function makeNatureDungeonTiles(): number[][] {
  const w = 24, h = 22;
  const grid: number[][] = Array.from({ length: h }, () => Array(w).fill(F));
  for (let x = 0; x < w; x++) { grid[0][x] = L; grid[h - 1][x] = L; }
  for (let y = 0; y < h; y++) { grid[y][0] = L; grid[y][w - 1] = L; }
  grid[h - 1][11] = D; grid[h - 1][12] = D; // south entrance, back to Nature City

  // Mossy/grassy accents in the floor
  const grassAccents: [number, number][] = [
    [4, 5], [8, 4], [16, 5], [19, 4], [5, 9], [10, 10], [15, 9], [18, 10],
    [4, 14], [9, 15], [14, 14], [19, 15], [6, 18], [12, 17], [17, 18],
  ];
  for (const [x, y] of grassAccents) grid[y][x] = S;

  // Boulder pillars lining the approach toward the Dungeon Master
  for (let y = 3; y < h - 3; y += 3) { grid[y][3] = B; grid[y][w - 4] = B; }
  grid[2][10] = B; grid[2][13] = B; grid[3][9] = B; grid[3][14] = B;

  return grid;
}
const NATURE_DUNGEON_TILES: number[][] = makeNatureDungeonTiles();

// NPC placement derived directly from the generated maze. Every NPC below
// sits on a genuine dead-end (leaf) cell, never on the maze's sole
// entrance→exit route — this engine has trainers (and any other NPC)
// permanently occupy and block their tile, even after being defeated, so
// putting one on a cut-vertex of a perfect maze (where literally every
// through-cell is a cut vertex, since a perfect maze has zero redundant
// paths) would hard-lock the maze forever once someone reached it. Leaf
// cells have nothing beyond them, so blocking one can never strand anything
// else — that's what makes them safe.
const thicketDeadEndsByEntranceDist = [...STORM_THICKET.deadEnds].sort((a, b) => a.distanceFromEntrance - b.distanceFromEntrance);
const thicketDeadEndsByExitDist = [...STORM_THICKET.deadEnds].sort((a, b) => a.distanceFromExit - b.distanceFromExit);
const thicketDeadEndsByFarthest = [...STORM_THICKET.deadEnds].sort((a, b) => b.distanceFromEntrance - a.distanceFromEntrance);

const thicketUsedTiles = new Set<string>();
function claimDeadEnd(sorted: typeof STORM_THICKET.deadEnds): [number, number] {
  const pick = sorted.find(d => !thicketUsedTiles.has(`${d.tile[0]},${d.tile[1]}`));
  if (!pick) throw new Error('Storm Thicket maze ran out of distinct dead-end cells for NPC placement');
  thicketUsedTiles.add(`${pick.tile[0]},${pick.tile[1]}`);
  return pick.tile;
}

const thicketEntranceTile = STORM_THICKET.path[0]; // used only for the exit-gap x-coordinate, not for NPC placement
const thicketChestTile = claimDeadEnd(thicketDeadEndsByFarthest);         // farthest dead end overall — the real detour reward
const thicketTrainer1Tile = claimDeadEnd(thicketDeadEndsByFarthest);
const thicketTrainer2Tile = claimDeadEnd(thicketDeadEndsByFarthest);
const thicketSignNorthTile = claimDeadEnd(thicketDeadEndsByEntranceDist); // nearest dead end to the entrance
const thicketSignSouthTile = claimDeadEnd(thicketDeadEndsByExitDist);     // nearest dead end to the exit

// ─── EARTH LODGE INTERIOR (14 × 10) ──────────────────────────────────────────
const EARTH_LODGE_TILES: number[][] = [
  [L,L,L,L,L,L,L,L,L,L,L,L,L,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,L,L,L,L,L,D,L,L,L,L,L,L,L],
];

// Same generic interior shell reused for the Water Lodge.
const WATER_LODGE_TILES: number[][] = EARTH_LODGE_TILES;
const VOLT_LODGE_TILES: number[][] = EARTH_LODGE_TILES;
const NATURE_LODGE_TILES: number[][] = EARTH_LODGE_TILES;

// ─── PLAYER HOUSE INTERIOR (12 × 10) ─────────────────────────────────────────
const HOUSE_TILES: number[][] = [
  [L,L,L,L,L,L,L,L,L,L,L,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,L],
  [L,L,L,L,L,D,L,L,L,L,L,L],
];

// ─── POKÉMON CENTER INTERIOR (14 × 10) ───────────────────────────────────────
// Right building in Oakwind (door at 21,5) → Pokémon Center
// Nurse at (4,4), Shop counter at (9,4), Door at (6,9)
const POKECENTER_TILES: number[][] = [
  [L,L,L,L,L,L,L,L,L,L,L,L,L,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,L,L,L,L,L,D,L,L,L,L,L,L,L],
];

// ─── LAB INTERIOR (16 × 12) ─────────────────────────────────────────────────
const LAB_TILES: number[][] = [
  [L,L,L,L,L,L,L,L,L,L,L,L,L,L,L,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,F,F,F,F,F,F,F,F,F,F,F,F,F,F,L],
  [L,L,L,L,L,L,L,D,L,L,L,L,L,L,L,L],
];

export const MAPS: Record<string, MapData> = {
  oakwind: {
    id: 'oakwind', name: 'Oakwind Village', width: 32, height: 24,
    tiles: OAK_TILES,
    decorations: [
      { x: 24, y: 17, tile: FN }, { x: 25, y: 17, tile: FN }, { x: 26, y: 17, tile: FN }, { x: 27, y: 17, tile: FN },
      { x: 24, y: 18, tile: FN }, { x: 27, y: 18, tile: FN },
      { x: 24, y: 19, tile: FN }, { x: 27, y: 19, tile: FN },
      { x: 24, y: 20, tile: FN }, { x: 25, y: 20, tile: FN }, { x: 26, y: 20, tile: FN }, { x: 27, y: 20, tile: FN },
    ],
    buildings: [
      { x: 2, y: 2, texture: 'building_player_house', widthTiles: 3, heightTiles: 4, doors: [{ x: 3, y: 5 }] },
      { x: 19, y: 2, texture: 'building_pokecenter', widthTiles: 6, heightTiles: 4, doors: [{ x: 21, y: 5 }] },
      { x: 1, y: 12, texture: 'building_lab', widthTiles: 8, heightTiles: 5, doors: [{ x: 4, y: 16 }] },
    ],
    npcs: [
      {
        id: 'npc1', name: 'Villager', x: 10, y: 8, direction: 'right', repeatable: true,
        dialogue: [
          'Welcome to Oakwind Village!',
          'The Pokémon Center to the east has a nurse who can heal your creatures for free.',
          'There\'s also a shop inside — pick up some supplies before heading into the tall grass!',
        ],
      },
      {
        id: 'npc2', name: 'Girl', x: 22, y: 18, direction: 'left', repeatable: true,
        dialogue: [
          'Route 1 to the south has lots of wild creatures!',
          'I saw a cute little Pebbit hopping around in the tall grass!',
          'There\'s even more on Route 2 beyond that...',
        ],
      },
      {
        id: 'npc3', name: 'Old Man', x: 8, y: 17, direction: 'down', repeatable: true,
        dialogue: [
          'Professor Rowan\'s lab is just to the north-west.',
          'He\'ll give you a partner creature to start your journey!',
          'Go talk to him — he\'s been waiting for a new trainer.',
        ],
      },
      {
        id: 'guide', name: 'Guide', x: 16, y: 13, direction: 'left', repeatable: true,
        isGuide: true,
        dialogue: ['New to Aetheria? I can walk you through anything you\'re unsure about!'],
      },
      {
        id: 'pokecenter_sign', name: 'Sign', x: 18, y: 7, direction: 'down', repeatable: true,
        dialogue: [
          '🏥 POKÉMON CENTER',
          'Nurse Joy will heal your party for FREE!',
          'The Shopkeeper inside sells Capture Orbs and Herbs.',
        ],
      },
    ],
    exits: [
      { x: 13, y: 22, width: 1, height: 1, targetMap: 'route1', targetX: 13, targetY: 2 },
      { x: 3,  y: 5,  width: 1, height: 1, targetMap: 'playerHouse', targetX: 5, targetY: 8 },
      { x: 21, y: 5,  width: 1, height: 1, targetMap: 'pokecenter',  targetX: 6, targetY: 8 },
      { x: 4,  y: 16, width: 1, height: 1, targetMap: 'labInterior', targetX: 7, targetY: 10 },
    ],
    encounters: [],
    music: 'town',
    isCity: true,
  },

  route1: {
    id: 'route1', name: 'Route 1', width: 32, height: 24,
    tiles: R1_TILES,
    npcs: [
      {
        id: 'trainer1', name: 'Hiker Ron', x: 8, y: 9, direction: 'down',
        dialogue: ['Hey you! Let\'s battle!', 'My Pebbit is tough as a rock!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 10, level: 5 }, { creatureId: 14, level: 4 }],
      },
      {
        id: 'route1_sign', name: 'Sign', x: 14, y: 4, direction: 'down', repeatable: true,
        dialogue: ['ROUTE 1 — Oakwind Village ↑  Ancient Ruins ↓', 'Tall grass: Level 2-7 creatures'],
      },
    ],
    exits: [
      { x: 13, y: 1,  width: 1, height: 1, targetMap: 'oakwind', targetX: 13, targetY: 21 },
      { x: 13, y: 23, width: 1, height: 1, targetMap: 'route2',  targetX: 13, targetY: 1  },
    ],
    encounters: [
      { creatureId: 10, minLevel: 2, maxLevel: 6, weight: 35 },
      { creatureId: 12, minLevel: 2, maxLevel: 6, weight: 35 },
      { creatureId: 16, minLevel: 3, maxLevel: 7, weight: 30 },
    ],
    music: 'route',
  },

  route2: {
    id: 'route2', name: 'Route 2', width: 32, height: 24,
    tiles: R2_TILES,
    npcs: [
      {
        id: 'trainer2', name: 'Ranger Mia', x: 20, y: 9, direction: 'left',
        dialogue: ['I protect these wild creatures!', 'But a good battle keeps me sharp!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 22, level: 9 }, { creatureId: 24, level: 8 }],
      },
      {
        id: 'trainer3', name: 'Youngster Jay', x: 6, y: 14, direction: 'right',
        dialogue: ['I\'ve been training all week!', 'My Shadling is super spooky!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 20, level: 7 }],
      },
      {
        id: 'route2_sign', name: 'Sign', x: 14, y: 3, direction: 'down', repeatable: true,
        dialogue: ['ROUTE 2 — Ancient Ruins Ahead', 'WARNING: Strong wild creatures. Bring potions!'],
      },
    ],
    exits: [
      { x: 13, y: 1,  width: 1, height: 1, targetMap: 'route1', targetX: 13, targetY: 22 },
      { x: 13, y: 23, width: 1, height: 1, targetMap: 'earthenhold', targetX: 13, targetY: 2 },
    ],
    encounters: [
      { creatureId: 20, minLevel: 6, maxLevel: 11, weight: 30 },
      { creatureId: 18, minLevel: 7, maxLevel: 12, weight: 30 },
      { creatureId: 14, minLevel: 7, maxLevel: 13, weight: 25 },
      { creatureId: 21, minLevel: 10, maxLevel: 14, weight: 5 },
    ],
    music: 'route',
  },

  earthenhold: {
    id: 'earthenhold', name: 'Earthenhold', width: 32, height: 24,
    tiles: EARTHENHOLD_TILES,
    buildings: [
      { x: 3, y: 2, texture: 'building_earth_lodge', widthTiles: 6, heightTiles: 4, doors: [{ x: 5, y: 5 }] },
      // Standardized dungeon-gate footprint (8×6) shared by all four
      // regions now that there's no tile-grid size restriction — each one
      // still looks nothing alike (rocky fortress here vs. coral temple,
      // neon tower, living tree arch elsewhere), just at a consistent,
      // properly grand scale instead of the old mismatched
      // 8×8/4×8/7×5/7×6 footprints tile assembly forced them into.
      { x: 22, y: 3, texture: 'building_earthen_gate', widthTiles: 8, heightTiles: 6, doors: [{ x: 25, y: 8 }, { x: 26, y: 8 }] },
    ],
    npcs: [
      {
        id: 'earthen_villager1', name: 'Quarrier', x: 6, y: 14, direction: 'down', repeatable: true,
        dialogue: [
          'Welcome to Earthenhold, city of stone and mud!',
          'The Earth Lodge to the west has a nurse, a shopkeeper, and someone who can remind your creatures of old moves.',
        ],
      },
      {
        id: 'earthen_villager2', name: 'Mason', x: 20, y: 18, direction: 'up', repeatable: true,
        dialogue: [
          'That\'s the Earthen Dungeon gate to the east.',
          'Nine trainers guard the hall, and their Dungeon Master waits at the end.',
          'Word is you have to beat all nine in a row — leave, and you start over!',
        ],
      },
      {
        id: 'lodge_sign', name: 'Sign', x: 2, y: 6, direction: 'down', repeatable: true,
        dialogue: [
          '🏥 EARTH LODGE',
          'Nurse Joy heals your party for FREE.',
          'The Shopkeeper sells supplies, and the Move Reminder can restore forgotten moves.',
        ],
      },
      {
        id: 'earthen_sign', name: 'Sign', x: 28, y: 10, direction: 'down', repeatable: true,
        dialogue: [
          '⛰️ EARTHEN DUNGEON',
          'Defeat all 9 trainers in a single streak to face the Dungeon Master.',
          'Leaving the dungeon resets your progress!',
        ],
      },
      {
        id: 'earthenhold_gatekeeper1', name: 'Earthen Sentinel', x: 13, y: 22, direction: 'down', repeatable: true,
        gatekeeperRequires: 'earth_dungeon_master',
        dialogue: ['You are not worthy of the path south yet.', 'Prove yourself against the Earthen Dungeon\'s master first.'],
      },
      {
        // Two guards standing adjacent is unavoidable here — unlike
        // Waveshore's fence-narrowed lanes, this road has no walls forcing
        // single-file movement, so both (13,22) and (14,22) (the two cells
        // directly above the border gap) must be blocked or the route
        // isn't actually sealed. Fixed the label collision at the
        // rendering level instead (see OverworldScene's name-tag wrapping)
        // rather than repositioning, since repositioning either of these
        // two specific cells reopens the route.
        id: 'earthenhold_gatekeeper2', name: 'Earthen Sentinel', x: 14, y: 22, direction: 'down', repeatable: true,
        gatekeeperRequires: 'earth_dungeon_master',
        dialogue: ['You are not worthy of the path south yet.', 'Prove yourself against the Earthen Dungeon\'s master first.'],
      },
    ],
    exits: [
      { x: 13, y: 1,  width: 1, height: 1, targetMap: 'route2', targetX: 13, targetY: 22 },
      { x: 5,  y: 5,  width: 1, height: 1, targetMap: 'earthLodge', targetX: 6, targetY: 8 },
      { x: 25, y: 8,  width: 1, height: 1, targetMap: 'earthenDungeon', targetX: 10, targetY: 18 },
      { x: 26, y: 8,  width: 1, height: 1, targetMap: 'earthenDungeon', targetX: 11, targetY: 18 },
      { x: 13, y: 23, width: 1, height: 1, targetMap: 'caveRoute', targetX: 13, targetY: 1 },
      { x: 14, y: 23, width: 1, height: 1, targetMap: 'caveRoute', targetX: 14, targetY: 1 },
    ],
    encounters: [],
    music: 'town',
    isCity: true,
  },

  earthLodge: {
    id: 'earthLodge', name: 'Earth Lodge', width: 14, height: 10,
    tiles: EARTH_LODGE_TILES,
    npcs: [
      {
        id: 'nurse', name: 'Nurse Joy', x: 4, y: 3, direction: 'down',
        isNurse: true,
        dialogue: [
          'Welcome to the Earth Lodge!',
          'I\'ll heal your creatures back to full health!',
          'Good luck in the dungeon!',
        ],
      },
      {
        id: 'shopkeeper', name: 'Shopkeeper', x: 9, y: 3, direction: 'down',
        isShop: true,
        shopItems: [
          { id: 1,  price: 200  },
          { id: 2,  price: 600  },
          { id: 3,  price: 1500 },
          { id: 10, price: 100  },
          { id: 11, price: 300  },
          { id: 12, price: 800  },
          { id: 30, price: 1000  },
          { id: 31, price: 6000 },
          { id: 50, price: 350  },
          { id: 51, price: 700  },
        ],
        dialogue: ['Welcome! Stocking up before the dungeon, are you?'],
      },
      {
        id: 'move_reminder', name: 'Move Reminder', x: 9, y: 6, direction: 'down',
        dialogue: ['I can help your creatures remember forgotten moves.'],
      },
    ],
    exits: [{ x: 6, y: 9, width: 1, height: 1, targetMap: 'earthenhold', targetX: 5, targetY: 6 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  earthenDungeon: {
    id: 'earthenDungeon', name: 'Earthen Dungeon', width: 22, height: 20,
    tiles: EARTHEN_DUNGEON_TILES,
    npcs: [
      { id: 'earth_trainer1', name: 'Digger Tam', x: 5, y: 16, direction: 'up', dungeonId: 'earthen',
        dialogue: ['You\'ll have to get through me first!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 10, level: 10 }, { creatureId: 22, level: 10 }] },
      { id: 'earth_trainer2', name: 'Miner Bo', x: 16, y: 16, direction: 'up', dungeonId: 'earthen',
        dialogue: ['These tunnels are mine to guard!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 11, level: 12 }, { creatureId: 9, level: 11 }] },
      { id: 'earth_trainer3', name: 'Crusher Vik', x: 5, y: 13, direction: 'up', dungeonId: 'earthen',
        dialogue: ['Hope your creatures can take a hit!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 23, level: 13 }, { creatureId: 26, level: 12 }] },
      { id: 'earth_trainer4', name: 'Prospector Ren', x: 16, y: 13, direction: 'up', dungeonId: 'earthen',
        dialogue: ['I\'ve struck gold in battle before!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 21, level: 13 }, { creatureId: 27, level: 12 }] },
      { id: 'earth_trainer5', name: 'Boulder Sage', x: 5, y: 10, direction: 'up', dungeonId: 'earthen',
        dialogue: ['Three creatures, one unshakable will!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 10, level: 14 }, { creatureId: 22, level: 14 }, { creatureId: 11, level: 15 }] },
      { id: 'earth_trainer6', name: 'Stonewarden Elka', x: 11, y: 10, direction: 'up', dungeonId: 'earthen',
        dialogue: ['The dungeon tests everyone equally!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 9, level: 15 }, { creatureId: 21, level: 14 }, { creatureId: 23, level: 15 }] },
      { id: 'earth_trainer7', name: 'Magmason Ito', x: 16, y: 10, direction: 'up', dungeonId: 'earthen',
        dialogue: ['Fire and stone — a tough combination!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 26, level: 15 }, { creatureId: 27, level: 15 }, { creatureId: 10, level: 16 }] },
      { id: 'earth_trainer8', name: 'Tunneler Gus', x: 5, y: 7, direction: 'up', dungeonId: 'earthen',
        dialogue: ['Almost to the Dungeon Master — almost!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 11, level: 16 }, { creatureId: 23, level: 16 }, { creatureId: 22, level: 16 }] },
      { id: 'earth_trainer9', name: 'Vanguard Priya', x: 16, y: 7, direction: 'up', dungeonId: 'earthen',
        dialogue: ['I\'m the last line before the Dungeon Master!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 22, level: 17 }, { creatureId: 21, level: 17 }, { creatureId: 11, level: 17 }] },
      { id: 'earth_dungeon_master', name: 'Dungeon Master Tarrok', x: 11, y: 4, direction: 'down',
        dungeonId: 'earthen', isDungeonMaster: true, dungeonMasterRequires: 9,
        dialogue: [
          'So — you\'ve made it this far.',
          'Beat all nine of my trainers in a single streak, and I am yours to challenge.',
          'Prove your resolve, unbroken!',
        ],
        isTrainer: true,
        trainerCreatures: [
          { creatureId: 11, level: 20 }, { creatureId: 23, level: 20 },
          { creatureId: 9, level: 20 }, { creatureId: 26, level: 22 },
        ] },
    ],
    exits: [
      { x: 10, y: 19, width: 1, height: 1, targetMap: 'earthenhold', targetX: 25, targetY: 9 },
      { x: 11, y: 19, width: 1, height: 1, targetMap: 'earthenhold', targetX: 26, targetY: 9 },
    ],
    encounters: [], isIndoor: true, isCave: true, music: 'indoor',
  },

  caveRoute: {
    id: 'caveRoute', name: 'Cave Route', width: 22, height: 20,
    tiles: CAVE_ROUTE_TILES,
    npcs: [
      {
        id: 'cave_route_sign_entry', name: 'Sign', x: 10, y: 2, direction: 'down', repeatable: true,
        dialogue: [
          '⛏️ CAVE ROUTE',
          'The path ahead is flooded. You\'ll need to SURF to cross.',
        ],
      },
      {
        id: 'cave_trainer1', name: 'Spelunker Dax', x: 12, y: 7, direction: 'down',
        dialogue: ['Careful — these tunnels aren\'t as empty as they look!', 'My Craglet has cracked tougher rocks than you.'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 22, level: 16 }, { creatureId: 27, level: 15 }],
      },
      {
        id: 'cave_route_sign_far', name: 'Sign', x: 10, y: 15, direction: 'down', repeatable: true,
        dialogue: [
          'The cave breathes cool, salt-tinged air here...',
          'A flooded passage continues south — the Water Cave, and the sea beyond it.',
        ],
      },
      {
        id: 'cave_trainer2', name: 'Miner Petra', x: 11, y: 17, direction: 'up',
        dialogue: ['You made it past the pool, huh?', 'Let\'s see if you can handle what I dug up down here.'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 26, level: 18 }, { creatureId: 23, level: 17 }],
      },
    ],
    exits: [
      { x: 13, y: 0,  width: 1, height: 1, targetMap: 'earthenhold', targetX: 13, targetY: 22 },
      { x: 14, y: 0,  width: 1, height: 1, targetMap: 'earthenhold', targetX: 14, targetY: 22 },
      { x: 13, y: 19, width: 1, height: 1, targetMap: 'waterCave', targetX: 13, targetY: 1 },
      { x: 14, y: 19, width: 1, height: 1, targetMap: 'waterCave', targetX: 14, targetY: 1 },
    ],
    encounters: [
      { creatureId: 22, minLevel: 14, maxLevel: 18, weight: 25 },
      { creatureId: 27, minLevel: 14, maxLevel: 19, weight: 20 },
      { creatureId: 26, minLevel: 15, maxLevel: 19, weight: 20 },
      { creatureId: 23, minLevel: 16, maxLevel: 19, weight: 5  },
    ],
    isCave: true, music: 'route',
  },

  waterCave: {
    id: 'waterCave', name: 'Water Cave', width: 22, height: 22,
    tiles: WATER_CAVE_TILES,
    npcs: [
      {
        id: 'water_cave_sign', name: 'Sign', x: 12, y: 2, direction: 'down', repeatable: true,
        dialogue: [
          '🌊 WATER CAVE',
          'Deep water the whole way through — keep Surfing south.',
        ],
      },
      {
        id: 'water_cave_trainer1', name: 'Diver Talia', x: 9, y: 9, direction: 'down',
        dialogue: ['You surf well! But can you battle just as well?', 'Mistfin, dive in!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 24, level: 20 }, { creatureId: 29, level: 19 }],
      },
      {
        id: 'water_cave_trainer2', name: 'Angler Boyd', x: 13, y: 14, direction: 'up',
        dialogue: ['These waters run deep, and so does my team.', 'Let\'s see what you\'ve got!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 5, level: 22 }, { creatureId: 25, level: 21 }],
      },
    ],
    exits: [
      { x: 13, y: 0,  width: 1, height: 1, targetMap: 'caveRoute', targetX: 13, targetY: 18 },
      { x: 14, y: 0,  width: 1, height: 1, targetMap: 'caveRoute', targetX: 14, targetY: 18 },
      { x: 13, y: 21, width: 1, height: 1, targetMap: 'waterCity', targetX: 13, targetY: 2 },
      { x: 14, y: 21, width: 1, height: 1, targetMap: 'waterCity', targetX: 14, targetY: 2 },
    ],
    encounters: [
      { creatureId: 24, minLevel: 18, maxLevel: 23, weight: 25 },
      { creatureId: 29, minLevel: 19, maxLevel: 24, weight: 20 },
      { creatureId: 5,  minLevel: 20, maxLevel: 24, weight: 5  },
      { creatureId: 25, minLevel: 20, maxLevel: 24, weight: 5  },
    ],
    isCave: true, music: 'route',
  },

  waterCity: {
    id: 'waterCity', name: 'Waveshore', width: 26, height: 20,
    tiles: WATER_CITY_TILES,
    decorations: WATER_CITY_DECORATIONS,
    buildings: [
      { x: 4, y: 3, texture: 'building_water_lodge', widthTiles: 6, heightTiles: 4, doors: [{ x: 6, y: 6 }] },
      { x: 16, y: 4, texture: 'building_water_gate', widthTiles: 8, heightTiles: 6, doors: [{ x: 19, y: 9 }, { x: 20, y: 9 }] },
    ],
    npcs: [
      {
        id: 'water_villager1', name: 'Tidecaller', x: 6, y: 12, direction: 'down', repeatable: true,
        dialogue: [
          'Welcome to Waveshore, the floating city of the sea!',
          'The Water Lodge to the west has a nurse, a shopkeeper, and a Move Reminder.',
        ],
      },
      {
        id: 'water_villager2', name: 'Pearl Diver', x: 19, y: 16, direction: 'up', repeatable: true,
        dialogue: [
          'That grand archway to the east is the Water Dungeon.',
          'Trainers say its Dungeon Master commands the tides themselves.',
        ],
      },
      {
        id: 'water_lodge_sign', name: 'Sign', x: 4, y: 8, direction: 'down', repeatable: true,
        dialogue: [
          '🏥 WATER LODGE',
          'Nurse Joy heals your party for FREE.',
          'The Shopkeeper sells supplies, and the Move Reminder can restore forgotten moves.',
        ],
      },
      {
        // Moved from (22,8) — that fell inside the new standardized 8×6
        // dungeon-gate building footprint (x:16-23, y:4-9) once the gate
        // was converted from tiles to a whole-building sprite.
        id: 'water_dungeon_sign', name: 'Sign', x: 22, y: 11, direction: 'down', repeatable: true,
        dialogue: [
          '🌊 WATER DUNGEON',
          'Defeat all of the trainers in a single streak to face the Dungeon Master.',
          'Leaving the dungeon resets your progress!',
        ],
      },
      {
        id: 'waveshore_gatekeeper1', name: 'Tide Sentinel', x: 6, y: 16, direction: 'down', repeatable: true,
        gatekeeperRequires: 'water_dungeon_master',
        dialogue: ['You are not worthy of the storm yet.', 'Prove yourself against the Water Dungeon\'s master first.'],
      },
      {
        // Staggered diagonally (7,17 instead of 7,16) from gatekeeper1 —
        // side-by-side on the same row made their name labels overlap into
        // unreadable text ("Tide Tide Sentinel"). This still fully seals
        // the lane: the fence at row 17 leaves (6,17)/(7,17) as the only
        // entry into the corridor at all, and gatekeeper1 already blocks
        // the sole route into (6,17) from above, so blocking (7,17)
        // directly closes the other entry without needing to also stand at
        // (7,16).
        id: 'waveshore_gatekeeper2', name: 'Tide Sentinel', x: 7, y: 17, direction: 'down', repeatable: true,
        gatekeeperRequires: 'water_dungeon_master',
        dialogue: ['You are not worthy of the storm yet.', 'Prove yourself against the Water Dungeon\'s master first.'],
      },
      {
        // Moved one tile south of its original (20,16) — that was directly
        // adjacent to the existing Pearl Diver NPC at (19,16), and their
        // name labels overlapped into unreadable text ("Pear Volt
        // Sentinel"). (20,17) is still the sole 1-wide dock chokepoint, so
        // the seal is unaffected.
        id: 'waveshore_gatekeeper3', name: 'Volt Sentinel', x: 20, y: 17, direction: 'down', repeatable: true,
        gatekeeperRequires: 'volt_dungeon_master',
        dialogue: ['This path leads toward Wildhaven — you\'re not ready for it yet.', 'Prove yourself against Voltspire\'s Dungeon Master first.'],
      },
    ],
    exits: [
      { x: 13, y: 0,  width: 1, height: 1, targetMap: 'waterCave', targetX: 13, targetY: 20 },
      { x: 14, y: 0,  width: 1, height: 1, targetMap: 'waterCave', targetX: 14, targetY: 20 },
      { x: 6,  y: 6,  width: 1, height: 1, targetMap: 'waterLodge', targetX: 6, targetY: 8 },
      { x: 19, y: 9,  width: 1, height: 1, targetMap: 'waterDungeon', targetX: 11, targetY: 20 },
      { x: 20, y: 9,  width: 1, height: 1, targetMap: 'waterDungeon', targetX: 12, targetY: 20 },
      // South dock onward to the Electric region — requires Surf, same as
      // any other open-water tile here, which fits: this route out of
      // Waveshore starts as more open sea before it reaches land.
      { x: 6,  y: 19, width: 1, height: 1, targetMap: 'stormCoast', targetX: 6, targetY: 1 },
      { x: 7,  y: 19, width: 1, height: 1, targetMap: 'stormCoast', targetX: 7, targetY: 1 },
      // Second path to the Electric region — the forest maze, reached on
      // dry land rather than by surfing (a single-tile trail opening, not
      // a wide dock, to match "forest path" rather than "boat launch").
      { x: 20, y: 19, width: 1, height: 1, targetMap: 'stormThicket', targetX: 11, targetY: 1 },
    ],
    encounters: [],
    music: 'town',
    isCity: true,
  },

  waterLodge: {
    id: 'waterLodge', name: 'Water Lodge', width: 14, height: 10,
    tiles: WATER_LODGE_TILES,
    npcs: [
      {
        id: 'water_nurse', name: 'Nurse Joy', x: 4, y: 3, direction: 'down',
        isNurse: true,
        dialogue: [
          'Welcome to the Water Lodge!',
          'I\'ll heal your creatures back to full health!',
          'Good luck out on the tides!',
        ],
      },
      {
        id: 'water_shopkeeper', name: 'Shopkeeper', x: 9, y: 3, direction: 'down',
        isShop: true,
        shopItems: [
          { id: 1,  price: 200  },
          { id: 2,  price: 600  },
          { id: 3,  price: 1500 },
          { id: 10, price: 100  },
          { id: 11, price: 300  },
          { id: 12, price: 800  },
          { id: 30, price: 1000  },
          { id: 31, price: 6000 },
          { id: 50, price: 350  },
          { id: 51, price: 700  },
        ],
        dialogue: ['Welcome! The tides bring good customers.'],
      },
      {
        id: 'move_reminder', name: 'Move Reminder', x: 9, y: 6, direction: 'down',
        dialogue: ['I can help your creatures remember forgotten moves.'],
      },
    ],
    exits: [{ x: 6, y: 9, width: 1, height: 1, targetMap: 'waterCity', targetX: 6, targetY: 7 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  waterDungeon: {
    id: 'waterDungeon', name: 'Water Dungeon', width: 24, height: 22,
    tiles: WATER_DUNGEON_TILES,
    npcs: [
      { id: 'water_trainer1', name: 'Tidepool Nim', x: 5, y: 18, direction: 'up', dungeonId: 'water',
        dialogue: ['The current favors me here!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 4, level: 24 }, { creatureId: 24, level: 23 }] },
      { id: 'water_trainer2', name: 'Pearl Sena', x: 18, y: 18, direction: 'up', dungeonId: 'water',
        dialogue: ['Few can out-swim me!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 5, level: 25 }, { creatureId: 4, level: 24 }] },
      { id: 'water_trainer3', name: 'Reef Kato', x: 5, y: 15, direction: 'up', dungeonId: 'water',
        dialogue: ['My creatures know these depths well!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 24, level: 26 }, { creatureId: 25, level: 25 }] },
      { id: 'water_trainer4', name: 'Undine Wren', x: 18, y: 15, direction: 'up', dungeonId: 'water',
        dialogue: ['Ripples never lie — you\'ll lose!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 5, level: 27 }, { creatureId: 29, level: 26 }] },
      { id: 'water_trainer5', name: 'Current Mira', x: 5, y: 11, direction: 'up', dungeonId: 'water',
        dialogue: ['Three tides, one relentless swell!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 4, level: 27 }, { creatureId: 25, level: 27 }, { creatureId: 5, level: 28 }] },
      { id: 'water_trainer6', name: 'Depthkeeper Sol', x: 12, y: 11, direction: 'up', dungeonId: 'water',
        dialogue: ['The dungeon judges everyone equally!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 24, level: 28 }, { creatureId: 5, level: 27 }, { creatureId: 29, level: 28 }] },
      { id: 'water_trainer7', name: 'Squallmage Iona', x: 18, y: 11, direction: 'up', dungeonId: 'water',
        dialogue: ['Wind and water — a tough combination!', 'Go, my pride and joy!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 25, level: 28 }, { creatureId: 6, level: 24 }, { creatureId: 30, level: 29 }] },
      { id: 'water_dungeon_master', name: 'Dungeon Master Nerissa', x: 12, y: 4, direction: 'down',
        dungeonId: 'water', isDungeonMaster: true, dungeonMasterRequires: 7,
        dialogue: [
          'So — you\'ve crossed the flooded cave to reach me.',
          'Beat all seven of my trainers in a single streak, and I am yours to challenge.',
          'Let\'s see if your resolve holds against the tide.',
        ],
        isTrainer: true,
        trainerCreatures: [
          { creatureId: 5, level: 32 }, { creatureId: 25, level: 32 },
          { creatureId: 24, level: 31 }, { creatureId: 6, level: 34 },
        ] },
    ],
    exits: [
      { x: 11, y: 21, width: 1, height: 1, targetMap: 'waterCity', targetX: 19, targetY: 10 },
      { x: 12, y: 21, width: 1, height: 1, targetMap: 'waterCity', targetX: 20, targetY: 10 },
    ],
    encounters: [], isIndoor: true, isCave: true, music: 'indoor',
  },

  stormCoast: {
    id: 'stormCoast', name: 'Storm Coast', width: 32, height: 24,
    tiles: STORM_COAST_TILES,
    forceNight: true,
    ambientWeather: 'storm',
    npcs: [
      {
        id: 'stormcoast_sign_north', name: 'Sign', x: 8, y: 8, direction: 'down', repeatable: true,
        dialogue: ['STORM COAST', 'The sea keeps rolling south — you\'ll need Surf a while longer yet.', 'Lightning\'s been striking the flats all night. Stay sharp.'],
      },
      {
        id: 'stormcoast_trainer1', name: 'Surfer Kai', x: 17, y: 16, direction: 'left',
        dialogue: ['Storm\'s not gonna stop me from riding these swells!', 'Let\'s see what you\'ve got!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 5, level: 33 }, { creatureId: 24, level: 32 }],
      },
      {
        id: 'stormcoast_trainer2', name: 'Stormwatcher Reyna', x: 14, y: 20, direction: 'right',
        dialogue: ['Every strike of lightning charges my partner right up.', 'Feel the voltage!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 19, level: 35 }, { creatureId: 25, level: 34 }],
      },
      {
        id: 'stormcoast_sign_south', name: 'Sign', x: 16, y: 22, direction: 'down', repeatable: true,
        dialogue: ['Voltspire\'s lights, just ahead through the rain.'],
      },
    ],
    exits: [
      { x: 6, y: 0, width: 1, height: 1, targetMap: 'waterCity', targetX: 6, targetY: 18 },
      { x: 7, y: 0, width: 1, height: 1, targetMap: 'waterCity', targetX: 7, targetY: 18 },
      { x: 15, y: 23, width: 1, height: 1, targetMap: 'voltspire', targetX: 8, targetY: 1 },
      { x: 16, y: 23, width: 1, height: 1, targetMap: 'voltspire', targetX: 9, targetY: 1 },
    ],
    encounters: [
      { creatureId: 5,  minLevel: 30, maxLevel: 35, weight: 25 },
      { creatureId: 24, minLevel: 31, maxLevel: 36, weight: 25 },
      { creatureId: 19, minLevel: 32, maxLevel: 37, weight: 20 },
      { creatureId: 25, minLevel: 33, maxLevel: 38, weight: 10 },
      { creatureId: 37, minLevel: 32, maxLevel: 37, weight: 3  },
    ],
    music: 'route',
  },

  stormThicket: {
    id: 'stormThicket', name: 'Storm Thicket', width: STORM_THICKET_TILES[0].length, height: STORM_THICKET_TILES.length,
    tiles: STORM_THICKET_TILES,
    forceNight: true,
    ambientWeather: 'storm',
    npcs: [
      {
        id: 'stormthicket_sign_north', name: 'Sign', x: thicketSignNorthTile[0], y: thicketSignNorthTile[1], direction: 'down', repeatable: true,
        dialogue: ['STORM THICKET', 'Hedges as far as the lightning shows. Watch your footing — and don\'t be afraid to backtrack.', 'Some branches lead nowhere... and some lead somewhere worth finding.'],
      },
      {
        id: 'stormthicket_trainer1', name: 'Forester Bram', x: thicketTrainer1Tile[0], y: thicketTrainer1Tile[1], direction: 'down',
        dialogue: ['Lost already? Happens to everyone their first time through.', 'But you\'re not getting past me that easily!'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 20, level: 33 }, { creatureId: 14, level: 32 }],
      },
      {
        id: 'stormthicket_trainer2', name: 'Ranger Sable', x: thicketTrainer2Tile[0], y: thicketTrainer2Tile[1], direction: 'up',
        dialogue: ['The static in the air out here does something to my creatures.', 'You\'ll feel it too, soon enough.'],
        isTrainer: true,
        trainerCreatures: [{ creatureId: 21, level: 36 }, { creatureId: 18, level: 34 }],
      },
      {
        id: 'stormthicket_chest', name: 'Treasure Chest', x: thicketChestTile[0], y: thicketChestTile[1], direction: 'down',
        dialogue: ['You pry open an old chest, half-buried under wet hedge leaves...'],
        givesItem: { id: 31, quantity: 1 },
      },
      {
        id: 'stormthicket_sign_south', name: 'Sign', x: thicketSignSouthTile[0], y: thicketSignSouthTile[1], direction: 'down', repeatable: true,
        dialogue: ['Warm lantern-light glows just past the last hedges...'],
      },
    ],
    exits: [
      { x: thicketEntranceTile[0], y: 0, width: 1, height: 1, targetMap: 'waterCity', targetX: 20, targetY: 18 },
      { x: thicketEntranceTile[0], y: STORM_THICKET_TILES.length - 1, width: 1, height: 1, targetMap: 'natureCity', targetX: 15, targetY: 1 },
    ],
    encounters: [
      { creatureId: 20, minLevel: 30, maxLevel: 35, weight: 30 },
      { creatureId: 14, minLevel: 31, maxLevel: 36, weight: 25 },
      { creatureId: 21, minLevel: 33, maxLevel: 38, weight: 15 },
      { creatureId: 18, minLevel: 30, maxLevel: 34, weight: 15 },
      { creatureId: 37, minLevel: 32, maxLevel: 36, weight: 3  },
      { creatureId: 31, minLevel: 30, maxLevel: 33, weight: 1  },
    ],
    music: 'route',
  },

  playerHouse: {
    id: 'playerHouse', name: 'Your House', width: 12, height: 10,
    tiles: HOUSE_TILES,
    npcs: [
      {
        id: 'mom', name: 'Mom', x: 6, y: 4, direction: 'down',
        dialogue: [
          'Welcome home, dear!',
          'Professor Rowan\'s lab is just south of here — go see him!',
          'Don\'t forget to visit the Pokémon Center to heal your creatures.',
          'Stay safe out there!',
        ],
      },
    ],
    exits: [{ x: 5, y: 9, width: 1, height: 1, targetMap: 'oakwind', targetX: 3, targetY: 6 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  pokecenter: {
    id: 'pokecenter', name: 'Pokémon Center', width: 14, height: 10,
    tiles: POKECENTER_TILES,
    npcs: [
      {
        id: 'nurse', name: 'Nurse Joy', x: 4, y: 3, direction: 'down',
        isNurse: true,
        dialogue: [
          'Welcome to the Pokémon Center!',
          'I\'ll heal your creatures back to full health!',
          'Please come again!',
        ],
      },
      {
        id: 'shopkeeper', name: 'Shopkeeper', x: 9, y: 3, direction: 'down',
        isShop: true,
        shopItems: [
          { id: 1,  price: 200  },
          { id: 2,  price: 600  },
          { id: 3,  price: 1500 },
          { id: 10, price: 100  },
          { id: 11, price: 300  },
          { id: 12, price: 800  },
          { id: 30, price: 1000  },
          { id: 31, price: 6000 },
          { id: 50, price: 350  },
          { id: 51, price: 700  },
        ],
        dialogue: ['Welcome! Take a look at our wares!'],
      },
      {
        id: 'move_reminder', name: 'Move Reminder', x: 9, y: 6, direction: 'down',
        dialogue: ['I can help your creatures remember forgotten moves.'],
      },
    ],
    exits: [{ x: 6, y: 9, width: 1, height: 1, targetMap: 'oakwind', targetX: 21, targetY: 6 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  labInterior: {
    id: 'labInterior', name: 'Professor\'s Lab', width: 16, height: 12,
    tiles: LAB_TILES,
    npcs: [
      {
        id: 'rowan', name: 'Prof. Rowan', x: 8, y: 6, direction: 'down',
        triggersStarter: true,
        dialogue: [
          'Ah, there you are! I\'ve been waiting for a new trainer!',
          'The world of Aetheria is full of amazing creatures.',
          'Each one has a unique bond with their trainer.',
          'Here — choose your very first partner creature!',
        ],
      },
      {
        id: 'assistant', name: 'Lab Assistant', x: 3, y: 4, direction: 'right', repeatable: true,
        dialogue: [
          'The Professor has been researching creature energy signatures.',
          'Strange signals have been detected north of here...',
          'Something big is coming.',
        ],
      },
    ],
    exits: [{ x: 7, y: 11, width: 1, height: 1, targetMap: 'oakwind', targetX: 4, targetY: 17 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  voltspire: {
    id: 'voltspire', name: 'Voltspire', width: 32, height: 24,
    tiles: VOLTSPIRE_TILES,
    forceNight: true,
    buildings: [
      { x: 4, y: 3, texture: 'building_volt_lodge', widthTiles: 7, heightTiles: 5, doors: [{ x: 7, y: 7 }] },
      { x: 21, y: 2, texture: 'building_volt_gate', widthTiles: 8, heightTiles: 6, doors: [{ x: 24, y: 7 }, { x: 25, y: 7 }] },
    ],
    npcs: [
      {
        id: 'volt_villager1', name: 'Lineworker', x: 12, y: 10, direction: 'down', repeatable: true,
        dialogue: [
          'Welcome to Voltspire, city of light!',
          'The streetlamps you see everywhere keep the whole city lit, storm or not.',
        ],
      },
      {
        id: 'volt_villager2', name: 'Signal Tech', x: 20, y: 14, direction: 'up', repeatable: true,
        dialogue: [
          'Made it through the storm coast, huh? Rough way to arrive.',
          'That gate to the east is the Volt Dungeon. Seven trainers guard it, streak-style.',
        ],
      },
      {
        id: 'volt_lodge_sign', name: 'Sign', x: 4, y: 8, direction: 'down', repeatable: true,
        dialogue: [
          '🏥 VOLT LODGE',
          'Nurse Joy heals your party for FREE.',
          'The Shopkeeper sells supplies, and the Move Reminder can restore forgotten moves.',
        ],
      },
      {
        id: 'volt_dungeon_sign', name: 'Sign', x: 28, y: 8, direction: 'down', repeatable: true,
        dialogue: [
          '⚡ VOLT DUNGEON',
          'Defeat all 7 trainers in a single streak to face the Dungeon Master.',
          'Leaving the dungeon resets your progress!',
        ],
      },
      {
        id: 'voltspire_sign_south', name: 'Sign', x: 16, y: 21, direction: 'down', repeatable: true,
        dialogue: ['The road onward is still being charted.', '(Come back soon!)'],
      },
    ],
    exits: [
      { x: 8,  y: 0, width: 1, height: 1, targetMap: 'stormCoast', targetX: 15, targetY: 22 },
      { x: 9,  y: 0, width: 1, height: 1, targetMap: 'stormCoast', targetX: 16, targetY: 22 },
      { x: 7,  y: 7, width: 1, height: 1, targetMap: 'voltLodge', targetX: 6, targetY: 8 },
      { x: 24, y: 7, width: 1, height: 1, targetMap: 'voltDungeon', targetX: 11, targetY: 20 },
      { x: 25, y: 7, width: 1, height: 1, targetMap: 'voltDungeon', targetX: 12, targetY: 20 },
    ],
    encounters: [], isCity: true, music: 'town',
  },

  voltLodge: {
    id: 'voltLodge', name: 'Volt Lodge', width: 14, height: 10,
    tiles: VOLT_LODGE_TILES,
    npcs: [
      {
        id: 'volt_nurse', name: 'Nurse Joy', x: 4, y: 3, direction: 'down',
        isNurse: true,
        dialogue: [
          'Welcome to the Volt Lodge!',
          'I\'ll heal your creatures back to full health!',
          'Good luck out there — the storms don\'t let up easily.',
        ],
      },
      {
        id: 'volt_shopkeeper', name: 'Shopkeeper', x: 9, y: 3, direction: 'down',
        isShop: true,
        shopItems: [
          { id: 1,  price: 200  },
          { id: 2,  price: 600  },
          { id: 3,  price: 1500 },
          { id: 10, price: 100  },
          { id: 11, price: 300  },
          { id: 12, price: 800  },
          { id: 30, price: 1000  },
          { id: 31, price: 6000 },
          { id: 50, price: 350  },
          { id: 51, price: 700  },
        ],
        dialogue: ['Welcome! Storm-worn trainers get first pick of the good stock.'],
      },
      {
        id: 'move_reminder', name: 'Move Reminder', x: 9, y: 6, direction: 'down',
        dialogue: ['I can help your creatures remember forgotten moves.'],
      },
    ],
    exits: [{ x: 6, y: 9, width: 1, height: 1, targetMap: 'voltspire', targetX: 7, targetY: 8 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  voltDungeon: {
    id: 'voltDungeon', name: 'Volt Dungeon', width: 24, height: 22,
    tiles: VOLT_DUNGEON_TILES,
    npcs: [
      { id: 'volt_trainer1', name: 'Circuit Runner Zeke', x: 5, y: 18, direction: 'up', dungeonId: 'volt',
        dialogue: ['Speed is everything out here!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 18, level: 36 }, { creatureId: 37, level: 37 }] },
      { id: 'volt_trainer2', name: 'Windvane Priya', x: 18, y: 18, direction: 'up', dungeonId: 'volt',
        dialogue: ['The gales favor the swift!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 19, level: 37 }, { creatureId: 38, level: 38 }] },
      { id: 'volt_trainer3', name: 'Frostwatch Elin', x: 5, y: 15, direction: 'up', dungeonId: 'volt',
        dialogue: ['Even lightning has a bite to it.'],
        isTrainer: true, trainerCreatures: [{ creatureId: 37, level: 38 }, { creatureId: 18, level: 39 }] },
      { id: 'volt_trainer4', name: 'Quarryhand Dez', x: 18, y: 15, direction: 'up', dungeonId: 'volt',
        dialogue: ['A live wire beats solid ground any day!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 38, level: 39 }, { creatureId: 19, level: 40 }] },
      { id: 'volt_trainer5', name: 'Cindermason Rho', x: 5, y: 11, direction: 'up', dungeonId: 'volt',
        dialogue: ['Three sparks, one forge!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 18, level: 40 }, { creatureId: 37, level: 40 }, { creatureId: 19, level: 41 }] },
      { id: 'volt_trainer6', name: 'Stormbind Talia', x: 12, y: 11, direction: 'up', dungeonId: 'volt',
        dialogue: ['The dungeon judges everyone equally!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 38, level: 41 }, { creatureId: 19, level: 41 }, { creatureId: 39, level: 42 }] },
      { id: 'volt_trainer7', name: 'Vanguard Orin', x: 18, y: 11, direction: 'up', dungeonId: 'volt',
        dialogue: ['Almost to the Dungeon Master — almost!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 37, level: 42 }, { creatureId: 38, level: 42 }, { creatureId: 18, level: 43 }] },
      { id: 'volt_dungeon_master', name: 'Dungeon Master Ozym', x: 12, y: 4, direction: 'down',
        dungeonId: 'volt', isDungeonMaster: true, dungeonMasterRequires: 7,
        dialogue: [
          'So — you\'ve weathered both storms to reach me.',
          'Beat all seven of my trainers in a single streak, and I am yours to challenge.',
          'Let\'s see if you can withstand a real storm.',
        ],
        isTrainer: true,
        trainerCreatures: [
          { creatureId: 39, level: 48 }, { creatureId: 19, level: 47 },
          { creatureId: 38, level: 46 }, { creatureId: 18, level: 49 },
        ] },
    ],
    exits: [
      { x: 11, y: 21, width: 1, height: 1, targetMap: 'voltspire', targetX: 24, targetY: 8 },
      { x: 12, y: 21, width: 1, height: 1, targetMap: 'voltspire', targetX: 25, targetY: 8 },
    ],
    encounters: [], isIndoor: true, isCave: true, music: 'indoor',
  },

  natureCity: {
    id: 'natureCity', name: 'Wildhaven', width: 32, height: 24,
    tiles: NATURE_CITY_TILES,
    decorations: NATURE_CITY_DECORATIONS,
    forceDusk: true,
    ambientLeaves: true,
    buildings: [
      { x: 4, y: 2, texture: 'building_nature_lodge', widthTiles: 7, heightTiles: 6, doors: [{ x: 7, y: 7 }] },
      { x: 21, y: 2, texture: 'building_nature_gate', widthTiles: 8, heightTiles: 6, doors: [{ x: 24, y: 7 }, { x: 25, y: 7 }] },
    ],
    npcs: [
      {
        id: 'nature_villager1', name: 'Canopy Keeper', x: 12, y: 10, direction: 'down', repeatable: true,
        dialogue: [
          'Welcome to Wildhaven — every home here grows from a living tree.',
          'The Nature Lodge to the west has a nurse, a shopkeeper, and a Move Reminder.',
        ],
      },
      {
        id: 'nature_villager2', name: 'Root Warden', x: 20, y: 14, direction: 'up', repeatable: true,
        dialogue: [
          'You made it through the thicket maze — not everyone does on the first try.',
          'That gate to the east is the Nature Dungeon. Seven trainers stronger than Voltspire\'s guard it.',
        ],
      },
      {
        id: 'nature_lodge_sign', name: 'Sign', x: 4, y: 8, direction: 'down', repeatable: true,
        dialogue: [
          '🏥 NATURE LODGE',
          'Nurse Joy heals your party for FREE.',
          'The Shopkeeper sells supplies, and the Move Reminder can restore forgotten moves.',
        ],
      },
      {
        id: 'nature_dungeon_sign', name: 'Sign', x: 28, y: 8, direction: 'down', repeatable: true,
        dialogue: [
          '🌿 NATURE DUNGEON',
          'Defeat all 7 trainers in a single streak to face the Dungeon Master.',
          'Leaving the dungeon resets your progress!',
        ],
      },
      {
        id: 'naturecity_sign_south', name: 'Sign', x: 16, y: 21, direction: 'down', repeatable: true,
        dialogue: ['The road onward is still being charted.', '(Come back soon!)'],
      },
    ],
    exits: [
      { x: 15, y: 0, width: 1, height: 1, targetMap: 'stormThicket', targetX: thicketEntranceTile[0], targetY: STORM_THICKET_TILES.length - 2 },
      { x: 16, y: 0, width: 1, height: 1, targetMap: 'stormThicket', targetX: thicketEntranceTile[0], targetY: STORM_THICKET_TILES.length - 2 },
      { x: 7,  y: 7, width: 1, height: 1, targetMap: 'natureLodge', targetX: 6, targetY: 8 },
      { x: 24, y: 7, width: 1, height: 1, targetMap: 'natureDungeon', targetX: 11, targetY: 20 },
      { x: 25, y: 7, width: 1, height: 1, targetMap: 'natureDungeon', targetX: 12, targetY: 20 },
    ],
    encounters: [], isCity: true, music: 'town',
  },

  natureLodge: {
    id: 'natureLodge', name: 'Nature Lodge', width: 14, height: 10,
    tiles: NATURE_LODGE_TILES,
    npcs: [
      {
        id: 'nature_nurse', name: 'Nurse Joy', x: 4, y: 3, direction: 'down',
        isNurse: true,
        dialogue: [
          'Welcome to the Nature Lodge!',
          'I\'ll heal your creatures back to full health!',
          'Rest easy — the forest looks after its own.',
        ],
      },
      {
        id: 'nature_shopkeeper', name: 'Shopkeeper', x: 9, y: 3, direction: 'down',
        isShop: true,
        shopItems: [
          { id: 1,  price: 200  },
          { id: 2,  price: 600  },
          { id: 3,  price: 1500 },
          { id: 10, price: 100  },
          { id: 11, price: 300  },
          { id: 12, price: 800  },
          { id: 30, price: 1000  },
          { id: 31, price: 6000 },
          { id: 50, price: 350  },
          { id: 51, price: 700  },
        ],
        dialogue: ['Welcome! Everything here is grown, gathered, or good as new.'],
      },
      {
        id: 'move_reminder', name: 'Move Reminder', x: 9, y: 6, direction: 'down',
        dialogue: ['I can help your creatures remember forgotten moves.'],
      },
    ],
    exits: [{ x: 6, y: 9, width: 1, height: 1, targetMap: 'natureCity', targetX: 7, targetY: 8 }],
    encounters: [], isIndoor: true, music: 'indoor',
  },

  natureDungeon: {
    id: 'natureDungeon', name: 'Nature Dungeon', width: 24, height: 22,
    tiles: NATURE_DUNGEON_TILES,
    npcs: [
      { id: 'nature_trainer1', name: 'Vinewalker Talia', x: 5, y: 18, direction: 'up', dungeonId: 'nature',
        dialogue: ['The roots run deep here — so does my resolve!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 20, level: 50 }, { creatureId: 21, level: 51 }] },
      { id: 'nature_trainer2', name: 'Windshade Oz', x: 18, y: 18, direction: 'up', dungeonId: 'nature',
        dialogue: ['Fernix rides the wind through these very trees!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 8, level: 51 }, { creatureId: 7, level: 52 }] },
      { id: 'nature_trainer3', name: 'Mossbrook Nia', x: 5, y: 15, direction: 'up', dungeonId: 'nature',
        dialogue: ['Even a forest needs a steady hand to tend it!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 9, level: 52 }, { creatureId: 20, level: 53 }] },
      { id: 'nature_trainer4', name: 'Rootbound Kai', x: 18, y: 15, direction: 'up', dungeonId: 'nature',
        dialogue: ['My roots reach deeper than you\'d think.'],
        isTrainer: true, trainerCreatures: [{ creatureId: 21, level: 53 }, { creatureId: 7, level: 54 }] },
      { id: 'nature_trainer5', name: 'Stonepath Rui', x: 5, y: 11, direction: 'up', dungeonId: 'nature',
        dialogue: ['Three growths, one unshakable root!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 8, level: 54 }, { creatureId: 9, level: 55 }, { creatureId: 20, level: 55 }] },
      { id: 'nature_trainer6', name: 'Sparkgrove Leni', x: 12, y: 11, direction: 'up', dungeonId: 'nature',
        dialogue: ['The dungeon judges everyone equally!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 21, level: 55 }, { creatureId: 7, level: 56 }, { creatureId: 8, level: 56 }] },
      { id: 'nature_trainer7', name: 'Twilight Warden Sable', x: 18, y: 11, direction: 'up', dungeonId: 'nature',
        dialogue: ['Almost to the Dungeon Master — almost!'],
        isTrainer: true, trainerCreatures: [{ creatureId: 9, level: 56 }, { creatureId: 20, level: 57 }, { creatureId: 21, level: 57 }] },
      { id: 'nature_dungeon_master', name: 'Dungeon Master Sylvaine', x: 12, y: 4, direction: 'down',
        dungeonId: 'nature', isDungeonMaster: true, dungeonMasterRequires: 7,
        dialogue: [
          'So — you\'ve crossed two storms and a thicket maze to reach me.',
          'Beat all seven of my trainers in a single streak, and I am yours to challenge.',
          'The forest does not go easy on anyone.',
        ],
        isTrainer: true,
        trainerCreatures: [
          { creatureId: 9, level: 62 }, { creatureId: 21, level: 61 },
          { creatureId: 8, level: 60 }, { creatureId: 20, level: 63 },
        ] },
    ],
    exits: [
      { x: 11, y: 21, width: 1, height: 1, targetMap: 'natureCity', targetX: 24, targetY: 8 },
      { x: 12, y: 21, width: 1, height: 1, targetMap: 'natureCity', targetX: 25, targetY: 8 },
    ],
    encounters: [], isIndoor: true, isCave: true, music: 'indoor',
  },
};