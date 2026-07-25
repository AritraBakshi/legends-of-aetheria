export type CreatureType = 'Fire' | 'Water' | 'Nature' | 'Electric' | 'Earth' | 'Wind' | 'Shadow' | 'Light' | 'Normal' | 'Ice' | 'Dragon' | 'Fighting' | 'Fairy';

export type MoveCategory = 'Physical' | 'Special' | 'Status';

export type StatusEffect = 'burn' | 'poison' | 'paralysis' | 'sleep' | 'freeze' | 'confusion' | null;

export interface MoveEffect {
  type: 'stat' | 'status' | 'heal' | 'recoil' | 'priority';
  target: 'self' | 'opponent';
  stat?: 'atk' | 'def' | 'spatk' | 'spdef' | 'spd' | 'acc';
  stages?: number;
  status?: StatusEffect;
  chance?: number;
  healPercent?: number;
  priority?: number;
  /** Flat HP damage dealt back to the user (used by recoil effects). */
  recoilFlat?: number;
}

export interface Move {
  id: number;
  name: string;
  type: CreatureType;
  category: MoveCategory;
  power: number;
  accuracy: number;
  pp: number;
  description: string;
  effect?: MoveEffect;
  /** If set, this move always deals exactly this much damage (still blocked
   * by type immunity), ignoring stats, STAB, crits, and the normal formula. */
  fixedDamage?: number;
}

export interface LearnableMove {
  level: number;
  moveId: number;
}

export interface CreatureData {
  id: number;
  name: string;
  type: CreatureType[];
  description: string;
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spatk: number;
    spdef: number;
    spd: number;
  };
  ability: string;
  catchRate: number;
  evolutionLevel?: number;
  evolvesInto?: number;
  /**
   * For split-evolution lines (e.g. a base form that can become one of two
   * different species): at evolutionLevel and every level after, checked
   * in order — the first branch whose requiresMoveType is found among the
   * creature's current moves wins. If none match, the creature simply
   * doesn't evolve yet and is re-checked again on its next level-up (no
   * fallback/timeout — it can stay unevolved indefinitely). Takes priority
   * over evolvesInto when present.
   */
  evolutionBranches?: { requiresMoveType: CreatureType; evolvesInto: number }[];
  learnset: LearnableMove[];
  isStarter?: boolean;
  isLegendary?: boolean;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export interface ActiveCreature {
  dataId: number;
  nickname?: string;
  level: number;
  currentHp: number;
  maxHp: number;
  stats: {
    atk: number;
    def: number;
    spatk: number;
    spdef: number;
    spd: number;
  };
  moves: { moveId: number; pp: number; maxPp: number }[];
  exp: number;
  expToNext: number;
  status: StatusEffect;
  isCaught: boolean;
}

export interface InventoryItem {
  id: number;
  quantity: number;
}

export interface Item {
  id: number;
  name: string;
  description: string;
  type: 'capture' | 'heal' | 'status_cure' | 'evolution' | 'key' | 'xp_boost' | 'repel';
  catchMultiplier?: number;
  healAmount?: number;
  healPercent?: number;
  curesStatus?: StatusEffect[];
  xpAmount?: number;
  repelSteps?: number;
}

export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  dialogue: string[];
  isTrainer?: boolean;
  trainerCreatures?: Array<{ creatureId: number; level: number }>;
  isNurse?: boolean;
  isShop?: boolean;
  isGuide?: boolean;
  shopItems?: Array<{ id: number; price: number }>;
  triggersStarter?: boolean;
  repeatable?: boolean;
  /** Dungeon streak system: trainers/master share a dungeonId to track a no-leave streak. */
  dungeonId?: string;
  isDungeonMaster?: boolean;
  /** Number of dungeon trainers (with the same dungeonId) that must be beaten this run before the master can be challenged. */
  dungeonMasterRequires?: number;
}

export interface MapExit {
  x: number;
  y: number;
  width: number;
  height: number;
  targetMap: string;
  targetX: number;
  targetY: number;
}

export interface MapData {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: number[][];
  npcs: NPC[];
  exits: MapExit[];
  encounters: { creatureId: number; minLevel: number; maxLevel: number; weight: number }[];
  music?: string;
  isIndoor?: boolean;
  /** Caves/dungeons: floor and rock-path tiles here can roll wild encounters,
   * unlike ordinary indoor buildings (lodges, labs, Pokémon Centers). */
  isCave?: boolean;
  /** Overworld towns/cities never roll wild encounters, even on tiles that
   * would otherwise trigger them (tall grass, cave floor, open water). */
  isCity?: boolean;
}