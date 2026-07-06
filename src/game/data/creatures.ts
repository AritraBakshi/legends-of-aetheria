import type { CreatureData } from './types';

export const CREATURES: CreatureData[] = [
  // ─── STARTERS ───────────────────────────────────────────────────────────────
  {
    id: 1, name: 'Embrix', type: ['Fire'], isStarter: true,
    description: 'A spirited fox cub whose tail tip burns with a tiny flame.',
    baseStats: { hp: 45, atk: 49, def: 44, spatk: 65, spdef: 44, spd: 45 },
    ability: 'Blaze — boosts Fire moves at low HP', catchRate: 45, rarity: 'rare',
    evolutionLevel: 16, evolvesInto: 2,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 10 }, { level: 5, moveId: 4 },
      { level: 9, moveId: 14 }, { level: 14, moveId: 11 }, { level: 20, moveId: 15 },
      { level: 28, moveId: 12 }, { level: 36, moveId: 13 },
    ],
  },
  {
    id: 2, name: 'Inferox', type: ['Fire'],
    description: 'Inferox runs with blazing speed, leaving scorched footprints.',
    baseStats: { hp: 60, atk: 62, def: 58, spatk: 80, spdef: 55, spd: 62 },
    ability: 'Blaze — boosts Fire moves at low HP', catchRate: 45, rarity: 'rare',
    evolutionLevel: 36, evolvesInto: 3,
    learnset: [
      { level: 1, moveId: 10 }, { level: 1, moveId: 11 }, { level: 16, moveId: 14 },
      { level: 22, moveId: 15 }, { level: 30, moveId: 12 }, { level: 38, moveId: 13 },
    ],
  },
  {
    id: 3, name: 'Pyroar', type: ['Fire', 'Shadow'],
    description: 'A majestic fire lion that commands both flame and darkness.',
    baseStats: { hp: 80, atk: 84, def: 78, spatk: 109, spdef: 75, spd: 90 },
    ability: 'Inferno — Fire moves always burn', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 10 }, { level: 1, moveId: 71 }, { level: 36, moveId: 13 },
      { level: 42, moveId: 72 }, { level: 50, moveId: 82 },
    ],
  },
  {
    id: 4, name: 'Aquril', type: ['Water'], isStarter: true,
    description: 'A playful water sprite that dances in rain puddles.',
    baseStats: { hp: 44, atk: 48, def: 46, spatk: 65, spdef: 44, spd: 43 },
    ability: 'Torrent — boosts Water moves at low HP', catchRate: 45, rarity: 'rare',
    evolutionLevel: 16, evolvesInto: 5,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 20 }, { level: 5, moveId: 4 },
      { level: 9, moveId: 24 }, { level: 14, moveId: 21 }, { level: 20, moveId: 80 },
      { level: 28, moveId: 22 }, { level: 36, moveId: 23 },
    ],
  },
  {
    id: 5, name: 'Aqueron', type: ['Water'],
    description: 'A powerful water warrior that controls ocean currents.',
    baseStats: { hp: 59, atk: 63, def: 61, spatk: 80, spdef: 62, spd: 57 },
    ability: 'Torrent — boosts Water moves at low HP', catchRate: 45, rarity: 'rare',
    evolutionLevel: 36, evolvesInto: 6,
    learnset: [
      { level: 1, moveId: 20 }, { level: 1, moveId: 21 }, { level: 16, moveId: 24 },
      { level: 22, moveId: 81 }, { level: 30, moveId: 22 }, { level: 38, moveId: 23 },
    ],
  },
  {
    id: 6, name: 'Tidalon', type: ['Water', 'Light'],
    description: 'A radiant sea dragon that shines like sunlight through water.',
    baseStats: { hp: 79, atk: 83, def: 84, spatk: 109, spdef: 82, spd: 75 },
    ability: 'Deep Torrent — water moves always lower Sp.Def', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 20 }, { level: 1, moveId: 83 }, { level: 36, moveId: 23 },
      { level: 42, moveId: 82 }, { level: 50, moveId: 62 },
    ],
  },
  {
    id: 7, name: 'Leafling', type: ['Nature'], isStarter: true,
    description: 'A tiny sprout with leaf-shaped ears. Always smells of fresh rain.',
    baseStats: { hp: 45, atk: 49, def: 45, spatk: 65, spdef: 45, spd: 45 },
    ability: 'Overgrow — boosts Nature moves at low HP', catchRate: 45, rarity: 'rare',
    evolutionLevel: 16, evolvesInto: 8,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 30 }, { level: 5, moveId: 4 },
      { level: 9, moveId: 34 }, { level: 14, moveId: 31 }, { level: 20, moveId: 54 },
      { level: 28, moveId: 33 }, { level: 36, moveId: 32 },
    ],
  },
  {
    id: 8, name: 'Fernix', type: ['Nature'],
    description: 'A swift nature spirit that rides the wind through ancient forests.',
    baseStats: { hp: 60, atk: 62, def: 63, spatk: 80, spdef: 63, spd: 57 },
    ability: 'Overgrow — boosts Nature moves at low HP', catchRate: 45, rarity: 'rare',
    evolutionLevel: 36, evolvesInto: 9,
    learnset: [
      { level: 1, moveId: 30 }, { level: 1, moveId: 31 }, { level: 16, moveId: 34 },
      { level: 22, moveId: 35 }, { level: 30, moveId: 33 }, { level: 38, moveId: 32 },
    ],
  },
  {
    id: 9, name: 'Verdance', type: ['Nature', 'Earth'],
    description: 'A titan of the forest who speaks with the roots of ancient trees.',
    baseStats: { hp: 80, atk: 82, def: 85, spatk: 109, spdef: 82, spd: 75 },
    ability: 'Deep Roots — Nature moves always entangle', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 30 }, { level: 1, moveId: 53 }, { level: 36, moveId: 32 },
      { level: 42, moveId: 52 }, { level: 50, moveId: 33 },
    ],
  },

  // ─── ROUTE 1 / COMMON ───────────────────────────────────────────────────────
  {
    id: 10, name: 'Pebbit', type: ['Earth'],
    description: 'A rabbit-like creature with pebble-hard ears.',
    baseStats: { hp: 45, atk: 55, def: 50, spatk: 30, spdef: 40, spd: 55 },
    ability: 'Rock Solid — immune to Critical Hits', catchRate: 255, rarity: 'common',
    evolutionLevel: 20, evolvesInto: 11,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 50 }, { level: 6, moveId: 5 },
      { level: 12, moveId: 51 }, { level: 20, moveId: 54 }, { level: 30, moveId: 52 },
    ],
  },
  {
    id: 11, name: 'Bouldrake', type: ['Earth'],
    description: 'A hulking stone dragon that shrugs off most attacks.',
    baseStats: { hp: 65, atk: 80, def: 75, spatk: 40, spdef: 55, spd: 65 },
    ability: 'Rock Solid — immune to Critical Hits', catchRate: 120, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 50 }, { level: 1, moveId: 51 }, { level: 20, moveId: 54 },
      { level: 28, moveId: 53 }, { level: 38, moveId: 52 },
    ],
  },
  {
    id: 12, name: 'Fluttail', type: ['Wind'],
    description: 'A delicate butterfly that rides air currents with ease.',
    baseStats: { hp: 38, atk: 35, def: 32, spatk: 50, spdef: 45, spd: 80 },
    ability: 'Gale Wings — Wind moves have +1 priority', catchRate: 255, rarity: 'common',
    evolutionLevel: 18, evolvesInto: 13,
    learnset: [
      { level: 1, moveId: 2 }, { level: 1, moveId: 60 }, { level: 7, moveId: 34 },
      { level: 12, moveId: 61 }, { level: 18, moveId: 63 }, { level: 26, moveId: 62 },
    ],
  },
  {
    id: 13, name: 'Galewyn', type: ['Wind'],
    description: 'A wind wyrm so fast it leaves after-images behind.',
    baseStats: { hp: 55, atk: 50, def: 45, spatk: 80, spdef: 60, spd: 100 },
    ability: 'Gale Wings — Wind moves have +1 priority', catchRate: 45, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 60 }, { level: 1, moveId: 61 }, { level: 18, moveId: 63 },
      { level: 26, moveId: 62 }, { level: 36, moveId: 61 },
    ],
  },
  {
    id: 14, name: 'Shadling', type: ['Shadow'],
    description: 'A sleek ferret that melts into shadows to avoid danger.',
    baseStats: { hp: 45, atk: 60, def: 40, spatk: 55, spdef: 38, spd: 62 },
    ability: 'Intimidate — lowers foe\'s Attack on entry', catchRate: 190, rarity: 'common',
    evolutionLevel: 22, evolvesInto: 15,
    learnset: [
      { level: 1, moveId: 2 }, { level: 1, moveId: 70 }, { level: 8, moveId: 5 },
      { level: 14, moveId: 71 }, { level: 22, moveId: 73 }, { level: 30, moveId: 72 },
    ],
  },
  {
    id: 15, name: 'Nightshroud', type: ['Shadow'],
    description: 'A creature born from living darkness that haunts moonless nights.',
    baseStats: { hp: 62, atk: 90, def: 55, spatk: 70, spdef: 50, spd: 85 },
    ability: 'Intimidate — lowers foe\'s Attack on entry', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 70 }, { level: 1, moveId: 71 }, { level: 22, moveId: 73 },
      { level: 30, moveId: 72 }, { level: 40, moveId: 71 },
    ],
  },
  {
    id: 16, name: 'Gloworm', type: ['Light'],
    description: 'A gentle worm that glows softly to comfort frightened creatures.',
    baseStats: { hp: 50, atk: 35, def: 40, spatk: 60, spdef: 55, spd: 35 },
    ability: 'Illuminate — prevents wild encounters', catchRate: 190, rarity: 'common',
    evolutionLevel: 20, evolvesInto: 17,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 80 }, { level: 7, moveId: 83 },
      { level: 14, moveId: 81 }, { level: 20, moveId: 80 }, { level: 28, moveId: 82 },
    ],
  },
  {
    id: 17, name: 'Luminary', type: ['Light'],
    description: 'A radiant butterfly whose wings shine like twin suns.',
    baseStats: { hp: 68, atk: 45, def: 55, spatk: 90, spdef: 78, spd: 60 },
    ability: 'Solar Power — boosts Sp.Atk in sunny weather', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 80 }, { level: 1, moveId: 83 }, { level: 20, moveId: 81 },
      { level: 28, moveId: 82 }, { level: 38, moveId: 82 },
    ],
  },
  {
    id: 18, name: 'Sparkit', type: ['Electric'],
    description: 'A zippy lizard with a tail that crackles with static electricity.',
    baseStats: { hp: 40, atk: 55, def: 40, spatk: 50, spdef: 40, spd: 65 },
    ability: 'Static — may paralyze on contact', catchRate: 190, rarity: 'common',
    evolutionLevel: 20, evolvesInto: 19,
    learnset: [
      { level: 1, moveId: 2 }, { level: 1, moveId: 40 }, { level: 6, moveId: 43 },
      { level: 12, moveId: 44 }, { level: 20, moveId: 41 }, { level: 30, moveId: 42 },
    ],
  },
  {
    id: 19, name: 'Voltaur', type: ['Electric'],
    description: 'A bull-like electric beast whose horns generate enormous voltage.',
    baseStats: { hp: 60, atk: 80, def: 55, spatk: 75, spdef: 55, spd: 95 },
    ability: 'Motor Drive — boosts Speed when hit by Electric', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 40 }, { level: 1, moveId: 41 }, { level: 20, moveId: 43 },
      { level: 28, moveId: 44 }, { level: 38, moveId: 42 },
    ],
  },
  {
    id: 20, name: 'Thornbud', type: ['Nature'],
    description: 'A small bud covered in protective thorns that bloom beautifully.',
    baseStats: { hp: 44, atk: 45, def: 55, spatk: 58, spdef: 50, spd: 38 },
    ability: 'Thorn Coat — damages attackers on contact', catchRate: 255, rarity: 'common',
    evolutionLevel: 25, evolvesInto: 21,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 30 }, { level: 6, moveId: 5 },
      { level: 12, moveId: 31 }, { level: 20, moveId: 34 }, { level: 30, moveId: 33 },
    ],
  },
  {
    id: 21, name: 'Bramblord', type: ['Nature', 'Earth'],
    description: 'A thorny golem that has grown from ancient earth magic.',
    baseStats: { hp: 70, atk: 70, def: 80, spatk: 80, spdef: 70, spd: 50 },
    ability: 'Thorn Coat — damages attackers on contact', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 30 }, { level: 1, moveId: 53 }, { level: 25, moveId: 54 },
      { level: 34, moveId: 33 }, { level: 44, moveId: 32 },
    ],
  },
  {
    id: 22, name: 'Craglet', type: ['Earth'],
    description: 'A puppy-like creature with a granite body and warm heart.',
    baseStats: { hp: 50, atk: 52, def: 60, spatk: 35, spdef: 55, spd: 40 },
    ability: 'Sturdy — survives a KO hit with 1 HP', catchRate: 190, rarity: 'common',
    evolutionLevel: 28, evolvesInto: 23,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 50 }, { level: 6, moveId: 54 },
      { level: 12, moveId: 51 }, { level: 22, moveId: 53 }, { level: 32, moveId: 52 },
    ],
  },
  {
    id: 23, name: 'Stonewulf', type: ['Earth'],
    description: 'A mighty stone wolf whose howl echoes through mountain passes.',
    baseStats: { hp: 75, atk: 80, def: 85, spatk: 45, spdef: 70, spd: 55 },
    ability: 'Sturdy — survives a KO hit with 1 HP', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 50 }, { level: 1, moveId: 53 }, { level: 28, moveId: 54 },
      { level: 36, moveId: 51 }, { level: 46, moveId: 52 },
    ],
  },
  {
    id: 24, name: 'Mistfin', type: ['Wind', 'Water'],
    description: 'A mist fish that floats between rain clouds and ocean waves.',
    baseStats: { hp: 48, atk: 42, def: 42, spatk: 65, spdef: 50, spd: 70 },
    ability: 'Swift Swim — doubles Speed in rain', catchRate: 120, rarity: 'uncommon',
    evolutionLevel: 30, evolvesInto: 25,
    learnset: [
      { level: 1, moveId: 20 }, { level: 1, moveId: 60 }, { level: 8, moveId: 21 },
      { level: 14, moveId: 61 }, { level: 22, moveId: 22 }, { level: 32, moveId: 62 },
    ],
  },
  {
    id: 25, name: 'Aeromanta', type: ['Wind', 'Water'],
    description: 'A graceful manta ray that soars on wind currents above the sea.',
    baseStats: { hp: 70, atk: 60, def: 60, spatk: 95, spdef: 75, spd: 95 },
    ability: 'Swift Swim — doubles Speed in rain', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 20 }, { level: 1, moveId: 61 }, { level: 30, moveId: 62 },
      { level: 38, moveId: 23 }, { level: 46, moveId: 82 },
    ],
  },
  {
    id: 26, name: 'Embersaur', type: ['Fire', 'Earth'],
    description: 'An ancient reptile whose dorsal plates smolder with molten rock.',
    baseStats: { hp: 75, atk: 75, def: 60, spatk: 65, spdef: 55, spd: 50 },
    ability: 'Rock Head — no recoil from recoil moves', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 10 }, { level: 1, moveId: 50 }, { level: 10, moveId: 14 },
      { level: 18, moveId: 51 }, { level: 28, moveId: 12 }, { level: 38, moveId: 52 },
    ],
  },
  {
    id: 27, name: 'Crypthorn', type: ['Shadow', 'Earth'],
    description: 'A horned beast that emerges from underground crypts at dusk.',
    baseStats: { hp: 70, atk: 80, def: 70, spatk: 60, spdef: 60, spd: 50 },
    ability: 'Pressure — drains opponent PP faster', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 70 }, { level: 1, moveId: 50 }, { level: 10, moveId: 73 },
      { level: 20, moveId: 53 }, { level: 30, moveId: 71 }, { level: 40, moveId: 72 },
    ],
  },
  {
    id: 28, name: 'Sunpuff', type: ['Light', 'Fire'],
    description: 'A fluffy cloud creature that basks in sunlight and radiates warmth.',
    baseStats: { hp: 60, atk: 55, def: 50, spatk: 80, spdef: 65, spd: 75 },
    ability: 'Drought — summons sunny weather on entry', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 80 }, { level: 1, moveId: 10 }, { level: 10, moveId: 83 },
      { level: 20, moveId: 81 }, { level: 30, moveId: 13 }, { level: 40, moveId: 82 },
    ],
  },
  {
    id: 29, name: 'Frostpine', type: ['Nature'],
    description: 'A pine tree creature encrusted in permafrost and icicles.',
    baseStats: { hp: 55, atk: 50, def: 65, spatk: 55, spdef: 70, spd: 45 },
    ability: 'Snow Cloak — evasion raised in snow', catchRate: 120, rarity: 'uncommon',
    evolutionLevel: 32, evolvesInto: 30,
    learnset: [
      { level: 1, moveId: 20 }, { level: 1, moveId: 54 }, { level: 1, moveId: 31 }, { level: 10, moveId: 21 },
      { level: 20, moveId: 32 }, { level: 30, moveId: 35 }, { level: 40, moveId: 33 },
    ],
  },
  {
    id: 30, name: 'Glacivern', type: ['Water', 'Nature'],
    description: 'A frozen dragon that rides blizzards through glacial mountain ranges.',
    baseStats: { hp: 80, atk: 65, def: 90, spatk: 75, spdef: 95, spd: 55 },
    ability: 'Ice Body — restores HP in snow', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 35 }, { level: 1, moveId: 61 }, { level: 32, moveId: 53 },
      { level: 40, moveId: 22 }, { level: 50, moveId: 82 },
    ],
  },
];

export function getCreatureById(id: number): CreatureData | undefined {
  return CREATURES.find(c => c.id === id);
}

export function getStarterCreatures(): CreatureData[] {
  return CREATURES.filter(c => c.isStarter);
}
