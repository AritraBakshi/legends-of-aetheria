import type { CreatureData, LearnableMove } from './types';

export const CREATURES: CreatureData[] = [
  // ─── STARTERS ───────────────────────────────────────────────────────────────
  {
    id: 1, name: 'Embrix', type: ['Fire'], isStarter: true,
    description: 'A spirited fox cub whose tail tip burns with a tiny flame.',
    baseStats: { hp: 45, atk: 49, def: 44, spatk: 65, spdef: 44, spd: 45 },
    ability: 'Blaze — boosts Fire moves at low HP', abilityId: 'blaze', catchRate: 45, rarity: 'rare',
    evolutionLevel: 16, evolvesInto: 2,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 10 }, { level: 1, moveId: 300 },
      { level: 5, moveId: 4 }, { level: 9, moveId: 14 }, { level: 14, moveId: 11 },
    ],
  },
  {
    id: 2, name: 'Inferox', type: ['Fire'],
    description: 'Inferox runs with blazing speed, leaving scorched footprints.',
    baseStats: { hp: 60, atk: 62, def: 58, spatk: 80, spdef: 55, spd: 62 },
    ability: 'Blaze — boosts Fire moves at low HP', abilityId: 'blaze', catchRate: 45, rarity: 'rare',
    evolutionLevel: 36, evolvesInto: 3,
    learnset: [
      { level: 16, moveId: 110 }, { level: 22, moveId: 15 },
      { level: 30, moveId: 12 }, { level: 38, moveId: 13 },
    ],
  },
  {
    id: 3, name: 'Pyroar', type: ['Fire', 'Shadow'],
    description: 'A majestic fire lion that commands both flame and darkness.',
    baseStats: { hp: 80, atk: 84, def: 78, spatk: 109, spdef: 75, spd: 90 },
    ability: 'Inferno — Fire moves always burn', abilityId: 'inferno', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 71 }, { level: 36, moveId: 111 },
      { level: 44, moveId: 72 }, { level: 50, moveId: 115 }, { level: 58, moveId: 82 },
    ],
  },
  {
    id: 4, name: 'Aquril', type: ['Water'], isStarter: true,
    description: 'A playful water sprite that dances in rain puddles.',
    baseStats: { hp: 44, atk: 48, def: 46, spatk: 65, spdef: 44, spd: 43 },
    ability: 'Torrent — boosts Water moves at low HP', abilityId: 'torrent', catchRate: 45, rarity: 'rare',
    evolutionLevel: 16, evolvesInto: 5,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 20 }, { level: 1, moveId: 301 },
      { level: 5, moveId: 4 }, { level: 9, moveId: 24 }, { level: 14, moveId: 21 },
    ],
  },
  {
    id: 5, name: 'Aqueron', type: ['Water'],
    description: 'A powerful water warrior that controls ocean currents.',
    baseStats: { hp: 59, atk: 63, def: 61, spatk: 80, spdef: 62, spd: 57 },
    ability: 'Torrent — boosts Water moves at low HP', abilityId: 'torrent', catchRate: 45, rarity: 'rare',
    evolutionLevel: 36, evolvesInto: 6,
    learnset: [
      { level: 16, moveId: 120 }, { level: 22, moveId: 124 },
      { level: 30, moveId: 22 }, { level: 38, moveId: 121 },
    ],
  },
  {
    id: 6, name: 'Tidalon', type: ['Water', 'Dragon'],
    description: 'A radiant sea dragon that shines like sunlight through water.',
    baseStats: { hp: 79, atk: 83, def: 84, spatk: 109, spdef: 82, spd: 75 },
    ability: 'Deep Torrent — water moves always lower Sp.Def', abilityId: 'deep_torrent', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 83 }, { level: 36, moveId: 23 },
      { level: 40, moveId: 201 }, { level: 42, moveId: 231 }, { level: 44, moveId: 180 },
      { level: 50, moveId: 123 }, { level: 54, moveId: 207 }, { level: 58, moveId: 82 },
    ],
  },
  {
    id: 7, name: 'Leafling', type: ['Nature'], isStarter: true,
    description: 'A tiny sprout with leaf-shaped ears. Always smells of fresh rain.',
    baseStats: { hp: 45, atk: 49, def: 45, spatk: 65, spdef: 45, spd: 45 },
    ability: 'Overgrow — boosts Nature moves at low HP', abilityId: 'overgrow', catchRate: 45, rarity: 'rare',
    evolutionLevel: 16, evolvesInto: 8,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 30 }, { level: 1, moveId: 302 },
      { level: 5, moveId: 4 }, { level: 9, moveId: 34 }, { level: 14, moveId: 31 },
    ],
  },
  {
    id: 8, name: 'Fernix', type: ['Nature'],
    description: 'A swift nature spirit that rides the wind through ancient forests.',
    baseStats: { hp: 60, atk: 62, def: 63, spatk: 80, spdef: 63, spd: 57 },
    ability: 'Overgrow — boosts Nature moves at low HP', abilityId: 'overgrow', catchRate: 45, rarity: 'rare',
    evolutionLevel: 36, evolvesInto: 9,
    learnset: [
      { level: 16, moveId: 130 }, { level: 22, moveId: 35 },
      { level: 30, moveId: 33 }, { level: 38, moveId: 32 },
    ],
  },
  {
    id: 9, name: 'Verdance', type: ['Nature', 'Earth'],
    description: 'A titan of the forest who speaks with the roots of ancient trees.',
    baseStats: { hp: 80, atk: 82, def: 85, spatk: 109, spdef: 82, spd: 75 },
    ability: 'Deep Roots — Nature moves always entangle', abilityId: 'deep_roots', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 53 }, { level: 36, moveId: 151 },
      { level: 44, moveId: 135 }, { level: 50, moveId: 52 },
    ],
  },

  // ─── ROUTE 1 / COMMON ───────────────────────────────────────────────────────
  {
    id: 10, name: 'Pebbit', type: ['Earth'],
    description: 'A rabbit-like creature with pebble-hard ears.',
    baseStats: { hp: 45, atk: 55, def: 50, spatk: 30, spdef: 40, spd: 55 },
    ability: 'Rock Solid — immune to Critical Hits', abilityId: 'rock_solid', catchRate: 255, rarity: 'common',
    evolutionLevel: 20, evolvesInto: 11,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 50 }, { level: 6, moveId: 5 },
      { level: 12, moveId: 51 }, { level: 20, moveId: 54 },
    ],
  },
  {
    id: 11, name: 'Bouldrake', type: ['Earth', 'Dragon'],
    description: 'A hulking stone dragon that shrugs off most attacks.',
    baseStats: { hp: 65, atk: 80, def: 75, spatk: 40, spdef: 55, spd: 65 },
    ability: 'Rock Solid — immune to Critical Hits', abilityId: 'rock_solid', catchRate: 120, rarity: 'uncommon',
    learnset: [
      { level: 21, moveId: 150 }, { level: 28, moveId: 153 },
      { level: 36, moveId: 151 }, { level: 40, moveId: 200 },
      { level: 46, moveId: 52 }, { level: 52, moveId: 202 },
    ],
  },
  {
    id: 12, name: 'Fluttail', type: ['Wind'],
    description: 'A delicate butterfly that rides air currents with ease.',
    baseStats: { hp: 38, atk: 35, def: 32, spatk: 50, spdef: 45, spd: 80 },
    ability: 'Gale Wings — Wind moves have +1 priority', abilityId: 'gale_wings', catchRate: 255, rarity: 'common',
    evolutionLevel: 18, evolvesInto: 13,
    learnset: [
      { level: 1, moveId: 2 }, { level: 1, moveId: 60 }, { level: 7, moveId: 34 },
      { level: 12, moveId: 61 }, { level: 18, moveId: 63 },
    ],
  },
  {
    id: 13, name: 'Galewyn', type: ['Wind', 'Dragon'],
    description: 'A wind wyrm so fast it leaves after-images behind.',
    baseStats: { hp: 55, atk: 50, def: 45, spatk: 80, spdef: 60, spd: 100 },
    ability: 'Gale Wings — Wind moves have +1 priority', abilityId: 'gale_wings', catchRate: 45, rarity: 'uncommon',
    learnset: [
      { level: 19, moveId: 160 }, { level: 26, moveId: 62 },
      { level: 34, moveId: 161 }, { level: 42, moveId: 201 },
      { level: 40, moveId: 162 }, { level: 48, moveId: 204 },
    ],
  },
  {
    id: 14, name: 'Shadling', type: ['Shadow'],
    description: 'A sleek ferret that melts into shadows to avoid danger.',
    baseStats: { hp: 45, atk: 60, def: 40, spatk: 55, spdef: 38, spd: 62 },
    ability: 'Intimidate — lowers foe\'s Attack on entry', abilityId: 'intimidate', catchRate: 190, rarity: 'common',
    evolutionLevel: 22, evolvesInto: 15,
    learnset: [
      { level: 1, moveId: 2 }, { level: 1, moveId: 70 }, { level: 8, moveId: 5 },
      { level: 14, moveId: 71 }, { level: 22, moveId: 73 },
    ],
  },
  {
    id: 15, name: 'Nightshroud', type: ['Shadow'],
    description: 'A creature born from living darkness that haunts moonless nights.',
    baseStats: { hp: 62, atk: 90, def: 55, spatk: 70, spdef: 50, spd: 85 },
    ability: 'Intimidate — lowers foe\'s Attack on entry', abilityId: 'intimidate', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 23, moveId: 170 }, { level: 30, moveId: 72 },
      { level: 36, moveId: 171 }, { level: 42, moveId: 173 },
    ],
  },
  {
    id: 16, name: 'Gloworm', type: ['Light'],
    description: 'A gentle worm that glows softly to comfort frightened creatures.',
    baseStats: { hp: 50, atk: 35, def: 40, spatk: 60, spdef: 55, spd: 35 },
    ability: 'Illuminate — prevents wild encounters', abilityId: 'illuminate', catchRate: 190, rarity: 'common',
    evolutionLevel: 20, evolvesInto: 17,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 80 }, { level: 7, moveId: 83 },
      { level: 14, moveId: 81 }, { level: 20, moveId: 182 },
    ],
  },
  {
    id: 17, name: 'Luminary', type: ['Light'],
    description: 'A radiant butterfly whose wings shine like twin suns.',
    baseStats: { hp: 68, atk: 45, def: 55, spatk: 90, spdef: 78, spd: 60 },
    ability: 'Solar Power — boosts Sp.Atk in sunny weather', abilityId: 'solar_power', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 21, moveId: 180 }, { level: 28, moveId: 181 },
      { level: 38, moveId: 82 }, { level: 46, moveId: 184 },
    ],
  },
  {
    id: 18, name: 'Sparkit', type: ['Electric'],
    description: 'A zippy lizard with a tail that crackles with static electricity.',
    baseStats: { hp: 40, atk: 55, def: 40, spatk: 50, spdef: 40, spd: 65 },
    ability: 'Static — may paralyze on contact', abilityId: 'static', catchRate: 190, rarity: 'common',
    evolutionLevel: 20, evolvesInto: 19,
    learnset: [
      { level: 1, moveId: 2 }, { level: 1, moveId: 40 }, { level: 6, moveId: 43 },
      { level: 12, moveId: 44 }, { level: 20, moveId: 41 },
    ],
  },
  {
    id: 19, name: 'Voltaur', type: ['Electric'],
    description: 'A bull-like electric beast whose horns generate enormous voltage.',
    baseStats: { hp: 60, atk: 80, def: 55, spatk: 75, spdef: 55, spd: 95 },
    ability: 'Motor Drive — boosts Speed when hit by Electric', abilityId: 'motor_drive', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 21, moveId: 140 }, { level: 28, moveId: 141 },
      { level: 36, moveId: 42 }, { level: 44, moveId: 144 },
    ],
  },
  {
    id: 20, name: 'Thornbud', type: ['Nature'],
    description: 'A small bud covered in protective thorns that bloom beautifully.',
    baseStats: { hp: 44, atk: 45, def: 55, spatk: 58, spdef: 50, spd: 38 },
    ability: 'Thorn Coat — damages attackers on contact', abilityId: 'thorn_coat', catchRate: 255, rarity: 'common',
    evolutionLevel: 25, evolvesInto: 21,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 30 }, { level: 6, moveId: 5 },
      { level: 12, moveId: 31 }, { level: 20, moveId: 34 },
    ],
  },
  {
    id: 21, name: 'Bramblord', type: ['Nature', 'Earth'],
    description: 'A thorny golem that has grown from ancient earth magic.',
    baseStats: { hp: 70, atk: 70, def: 80, spatk: 80, spdef: 70, spd: 50 },
    ability: 'Thorn Coat — damages attackers on contact', abilityId: 'thorn_coat', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 25, moveId: 153 }, { level: 34, moveId: 33 },
      { level: 44, moveId: 151 }, { level: 50, moveId: 32 },
    ],
  },
  {
    id: 22, name: 'Craglet', type: ['Earth'],
    description: 'A puppy-like creature with a granite body and warm heart.',
    baseStats: { hp: 50, atk: 52, def: 60, spatk: 35, spdef: 55, spd: 40 },
    ability: 'Sturdy — survives a KO hit with 1 HP', abilityId: 'sturdy', catchRate: 190, rarity: 'common',
    evolutionLevel: 28, evolvesInto: 23,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 50 }, { level: 6, moveId: 54 },
      { level: 12, moveId: 51 }, { level: 22, moveId: 53 },
    ],
  },
  {
    id: 23, name: 'Stonewulf', type: ['Earth'],
    description: 'A mighty stone wolf whose howl echoes through mountain passes.',
    baseStats: { hp: 75, atk: 80, def: 85, spatk: 45, spdef: 70, spd: 55 },
    ability: 'Sturdy — survives a KO hit with 1 HP', abilityId: 'sturdy', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 29, moveId: 150 }, { level: 36, moveId: 152 },
      { level: 40, moveId: 153 }, { level: 46, moveId: 151 },
    ],
  },
  {
    id: 24, name: 'Mistfin', type: ['Wind', 'Water'],
    description: 'A mist fish that floats between rain clouds and ocean waves.',
    baseStats: { hp: 48, atk: 42, def: 42, spatk: 65, spdef: 50, spd: 70 },
    ability: 'Swift Swim — doubles Speed in rain', abilityId: 'swift_swim', catchRate: 120, rarity: 'uncommon',
    evolutionLevel: 30, evolvesInto: 25,
    learnset: [
      { level: 1, moveId: 20 }, { level: 1, moveId: 60 }, { level: 8, moveId: 120 },
      { level: 14, moveId: 61 }, { level: 22, moveId: 22 },
    ],
  },
  {
    id: 25, name: 'Aeromanta', type: ['Wind', 'Water'],
    description: 'A graceful manta ray that soars on wind currents above the sea.',
    baseStats: { hp: 70, atk: 60, def: 60, spatk: 95, spdef: 75, spd: 95 },
    ability: 'Swift Swim — doubles Speed in rain', abilityId: 'swift_swim', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 30, moveId: 161 }, { level: 38, moveId: 23 },
      { level: 46, moveId: 121 }, { level: 50, moveId: 62 },
    ],
  },
  {
    id: 26, name: 'Embersaur', type: ['Fire', 'Earth'],
    description: 'An ancient reptile whose dorsal plates smolder with molten rock.',
    baseStats: { hp: 75, atk: 75, def: 60, spatk: 65, spdef: 55, spd: 50 },
    ability: 'Rock Head — no recoil from recoil moves', abilityId: 'rock_head', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 10 }, { level: 1, moveId: 50 }, { level: 10, moveId: 14 },
      { level: 18, moveId: 51 }, { level: 28, moveId: 12 }, { level: 38, moveId: 52 },
      { level: 46, moveId: 111 }, { level: 54, moveId: 151 },
    ],
  },
  {
    id: 27, name: 'Crypthorn', type: ['Shadow', 'Earth'],
    description: 'A horned beast that emerges from underground crypts at dusk.',
    baseStats: { hp: 70, atk: 80, def: 70, spatk: 60, spdef: 60, spd: 50 },
    ability: 'Pressure — drains opponent PP faster', abilityId: 'pressure', catchRate: 75, rarity: 'uncommon',
    learnset: [
      { level: 1, moveId: 70 }, { level: 1, moveId: 50 }, { level: 10, moveId: 73 },
      { level: 20, moveId: 53 }, { level: 30, moveId: 71 }, { level: 40, moveId: 72 },
      { level: 48, moveId: 174 }, { level: 56, moveId: 151 },
    ],
  },
  {
    id: 28, name: 'Sunpuff', type: ['Light', 'Fire'],
    description: 'A fluffy cloud creature that basks in sunlight and radiates warmth.',
    baseStats: { hp: 60, atk: 55, def: 50, spatk: 80, spdef: 65, spd: 75 },
    ability: 'Drought — summons sunny weather on entry', abilityId: 'drought', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 1, moveId: 80 }, { level: 1, moveId: 10 }, { level: 10, moveId: 83 },
      { level: 18, moveId: 230 }, { level: 20, moveId: 81 }, { level: 30, moveId: 13 }, { level: 40, moveId: 82 },
      { level: 48, moveId: 111 }, { level: 56, moveId: 180 },
    ],
  },
  {
    id: 29, name: 'Frostpine', type: ['Ice'],
    description: 'A pine tree creature encrusted in permafrost and icicles.',
    baseStats: { hp: 55, atk: 50, def: 65, spatk: 55, spdef: 70, spd: 45 },
    ability: 'Snow Cloak — evasion raised in snow', abilityId: 'snow_cloak', catchRate: 120, rarity: 'uncommon',
    evolutionLevel: 32, evolvesInto: 30,
    learnset: [
      { level: 1, moveId: 190 }, { level: 1, moveId: 54 }, { level: 8, moveId: 194 },
      { level: 16, moveId: 193 }, { level: 22, moveId: 232 }, { level: 24, moveId: 195 },
    ],
  },
  {
    id: 30, name: 'Glacivern', type: ['Ice', 'Dragon'],
    description: 'A frozen dragon that rides blizzards through glacial mountain ranges.',
    baseStats: { hp: 80, atk: 65, def: 90, spatk: 75, spdef: 95, spd: 55 },
    ability: 'Ice Body — restores HP in snow', abilityId: 'ice_body', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 33, moveId: 191 }, { level: 40, moveId: 192 },
      { level: 44, moveId: 203 }, { level: 48, moveId: 196 },
      { level: 55, moveId: 197 }, { level: 58, moveId: 206 },
    ],
  },

  // ─── CHIMLET LINE — split evolution by learned move type ────────────────────
  {
    id: 31, name: 'Chimlet', type: ['Normal'],
    description: 'A curious young ape whose instincts haven\'t settled — what it becomes depends on what it learns.',
    baseStats: { hp: 50, atk: 58, def: 42, spatk: 35, spdef: 42, spd: 55 },
    ability: 'Adaptive — takes on traits of whatever it eats', abilityId: 'adaptive', catchRate: 120, rarity: 'uncommon',
    evolutionLevel: 26,
    evolutionBranches: [
      { requiresMoveType: 'Fighting', evolvesInto: 33 }, // Wildstrike
      { requiresMoveType: 'Ice', evolvesInto: 32 },       // Permafist
    ],
    // Neither branch move survives the natural level-up cycle by level 26 —
    // Chimlet simply won't evolve until the player deliberately visits the
    // Move Reminder to reclaim EITHER Ice Shard (-> Permafist) or Karate
    // Chop (-> Wildstrike), a real symmetric choice for either branch.
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 4 }, { level: 8, moveId: 5 },
      { level: 12, moveId: 190 }, { level: 16, moveId: 210 }, { level: 18, moveId: 105 },
      { level: 20, moveId: 103 }, { level: 22, moveId: 100 }, { level: 24, moveId: 106 },
    ],
  },
  {
    id: 32, name: 'Permafist', type: ['Ice', 'Fighting'],
    description: 'A hulking yeti whose ice-hardened fists can shatter boulders in a single blow.',
    baseStats: { hp: 95, atk: 105, def: 95, spatk: 40, spdef: 70, spd: 35 },
    ability: 'Frozen Fists — Ice moves may freeze on contact', abilityId: 'frozen_fists', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 28, moveId: 194 }, { level: 32, moveId: 214 },
      { level: 38, moveId: 192 }, { level: 46, moveId: 217 },
    ],
  },
  {
    id: 33, name: 'Wildstrike', type: ['Fighting', 'Normal'],
    description: 'An elusive forest brawler, faster and lighter than its icy cousin, striking before it\'s even seen.',
    baseStats: { hp: 72, atk: 98, def: 58, spatk: 35, spdef: 55, spd: 105 },
    ability: 'Adrenaline Rush — Speed rises when HP is low', abilityId: 'adrenaline_rush', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 28, moveId: 211 }, { level: 32, moveId: 215 },
      { level: 38, moveId: 213 }, { level: 46, moveId: 212 },
    ],
  },

  // ─── GLIMMANE LINE — split evolution by learned move type ───────────────────
  {
    id: 34, name: 'Glimmane', type: ['Fairy'],
    description: 'A foal wrapped in unformed magic, its sparkling mane hinting at power yet to bloom.',
    baseStats: { hp: 48, atk: 40, def: 45, spatk: 60, spdef: 55, spd: 52 },
    ability: 'Unbound Grace — raises evasion when healthy', abilityId: 'unbound_grace', catchRate: 120, rarity: 'uncommon',
    evolutionLevel: 26,
    evolutionBranches: [
      { requiresMoveType: 'Earth', evolvesInto: 36 }, // Gleamhorn
      { requiresMoveType: 'Wind', evolvesInto: 35 },  // Cloudmane
    ],
    // Same fix as Chimlet: neither Gust nor Pebble Toss survives natural
    // leveling by level 26 — Glimmane won't evolve until the player
    // deliberately reclaims one via the Move Reminder.
    learnset: [
      { level: 1, moveId: 220 }, { level: 1, moveId: 4 }, { level: 8, moveId: 5 },
      { level: 12, moveId: 60 }, { level: 16, moveId: 50 }, { level: 18, moveId: 224 },
      { level: 20, moveId: 105 }, { level: 22, moveId: 103 }, { level: 24, moveId: 100 },
    ],
  },
  {
    id: 35, name: 'Cloudmane', type: ['Fairy', 'Wind'],
    description: 'A pegasus of cloud and light, said to outrace the wind itself.',
    baseStats: { hp: 68, atk: 50, def: 55, spatk: 98, spdef: 72, spd: 108 },
    ability: 'Tailwind Spirit — Speed rises in clear skies', abilityId: 'tailwind_spirit', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 26, moveId: 61 }, { level: 30, moveId: 221 },
      { level: 36, moveId: 222 }, { level: 44, moveId: 161 },
    ],
  },
  {
    id: 36, name: 'Gleamhorn', type: ['Fairy', 'Earth'],
    description: 'A unicorn whose crystalline horn channels the earth\'s own ancient magic.',
    baseStats: { hp: 88, atk: 58, def: 92, spatk: 88, spdef: 98, spd: 48 },
    ability: 'Gentle Ward — Sp.Def rises when healed', abilityId: 'gentle_ward', catchRate: 45, rarity: 'rare',
    learnset: [
      { level: 26, moveId: 54 }, { level: 30, moveId: 225 },
      { level: 36, moveId: 223 }, { level: 44, moveId: 151 },
    ],
  },

  // ─── SPARKUB LINE — straight 3-stage line, no branching ─────────────────────
  {
    id: 37, name: 'Sparkub', type: ['Electric'],
    description: 'A lion cub whose mane crackles faintly with static whenever it gets excited.',
    baseStats: { hp: 48, atk: 58, def: 40, spatk: 60, spdef: 42, spd: 68 },
    ability: 'Static Mane — may paralyze on contact', abilityId: 'static', catchRate: 150, rarity: 'uncommon',
    evolutionLevel: 20, evolvesInto: 38,
    learnset: [
      { level: 1, moveId: 1 }, { level: 1, moveId: 40 }, { level: 6, moveId: 4 },
      { level: 12, moveId: 44 }, { level: 18, moveId: 43 },
    ],
  },
  {
    id: 38, name: 'Boltmane', type: ['Electric'],
    description: 'An adult lion whose mane has become a crown of living lightning.',
    baseStats: { hp: 68, atk: 88, def: 62, spatk: 85, spdef: 60, spd: 95 },
    ability: 'Static Mane — may paralyze on contact', abilityId: 'static', catchRate: 75, rarity: 'uncommon',
    evolutionLevel: 38, evolvesInto: 39,
    learnset: [
      { level: 22, moveId: 141 }, { level: 28, moveId: 41 }, { level: 34, moveId: 143 },
    ],
  },
  {
    id: 39, name: 'Stormgryph', type: ['Electric', 'Wind'],
    description: 'A storm-crowned griffin that commands lightning and wind together, said to nest only above the clouds.',
    baseStats: { hp: 88, atk: 105, def: 85, spatk: 112, spdef: 88, spd: 118 },
    ability: 'Storm Caller — Wind moves strike first in a storm', abilityId: 'storm_caller', catchRate: 30, rarity: 'rare',
    learnset: [
      { level: 40, moveId: 61 }, { level: 43, moveId: 233 }, { level: 45, moveId: 142 },
      { level: 50, moveId: 161 }, { level: 56, moveId: 42 },
    ],
  },
];

export function getCreatureById(id: number): CreatureData | undefined {
  return CREATURES.find(c => c.id === id);
}

export function getStarterCreatures(): CreatureData[] {
  return CREATURES.filter(c => c.isStarter);
}

/**
 * Returns a creature's full learnable move pool: its own learnset PLUS every
 * pre-evolution's learnset it passed through on the way to its current form.
 *
 * This is what makes evolving not erase what a lower-stage creature could
 * already learn — e.g. if Embrix could learn Ember at level 1, Inferox and
 * Pyroar can still learn (or be taught, via the Move Reminder) Ember too,
 * exactly like evolution families work in the mainline games. Levels are
 * preserved as-is rather than collapsed, so a creature that evolved early
 * can still "catch up" on a pre-evolution move it hadn't reached yet.
 *
 * Each evolution stage's own data only needs to list the NEW moves it gains
 * — no need to hand-copy the whole ancestor chain into every stage.
 */
export function getFullLearnset(dataId: number): LearnableMove[] {
  const chain: CreatureData[] = [];
  let current = getCreatureById(dataId);
  while (current) {
    chain.unshift(current);
    const pre = CREATURES.find(c =>
      c.evolvesInto === current!.id ||
      c.evolutionBranches?.some(b => b.evolvesInto === current!.id)
    );
    current = pre;
  }

  const combined: LearnableMove[] = [];
  for (const stage of chain) combined.push(...stage.learnset);

  const seen = new Set<string>();
  return combined.filter(l => {
    const key = `${l.level}-${l.moveId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}