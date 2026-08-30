export type CreatureType = 'Fire' | 'Water' | 'Nature' | 'Electric' | 'Earth' | 'Wind' | 'Shadow' | 'Light' | 'Normal' | 'Ice' | 'Dragon' | 'Fighting' | 'Fairy';

export type MoveCategory = 'Physical' | 'Special' | 'Status';

export type StatusEffect = 'burn' | 'poison' | 'paralysis' | 'sleep' | 'freeze' | 'confusion' | null;

export type WeatherType = 'clear' | 'sun' | 'rain' | 'snow' | 'storm';

export interface MoveEffect {
  type: 'stat' | 'status' | 'heal' | 'recoil' | 'priority' | 'weather';
  target: 'self' | 'opponent';
  stat?: 'atk' | 'def' | 'spatk' | 'spdef' | 'spd' | 'acc';
  stages?: number;
  status?: StatusEffect;
  chance?: number;
  healPercent?: number;
  priority?: number;
  /** Flat HP damage dealt back to the user (used by recoil effects). */
  recoilFlat?: number;
  /** Weather summoned by this move (e.g. Sunny Day -> 'sun'). */
  weather?: WeatherType;
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
  /**
   * Machine-readable ability key used to look up actual mechanical effects
   * (see src/game/systems/Abilities.ts). `ability` above stays as flavor
   * text shown in the Dex/party screens — this is what battle code checks.
   */
  abilityId?: string;
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
  /**
   * Turns remaining for duration-based statuses (sleep, confusion). Unused
   * for burn/poison/paralysis (no duration) and freeze (pure per-turn thaw
   * chance instead). Set when the status is first inflicted.
   */
  statusTurns?: number;
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
  /**
   * Renders as a treasure chest instead of a person, and grants this item
   * once on first interaction (tracked via the same npc_done_${id} flag
   * ordinary non-repeatable NPCs use) — reads as "already opened" on
   * repeat visits rather than being farmable. Meant for maze/dungeon
   * rewards tucked down a dead-end branch.
   */
  givesItem?: { id: number; quantity: number };
  /**
   * Gatekeeper NPC: blocks movement into its tile (an ordinary side effect
   * of being an NPC at all, not special logic) until the referenced
   * dungeon master's id has a `beaten_${id}` flag set — checked fresh every
   * time the map loads (see OverworldScene.createNPCs). Once beaten, this
   * NPC isn't added to the map at all, for anyone, including saves that
   * beat that dungeon master before this field ever existed — no separate
   * "already seen him vanish" bookkeeping needed. No badge item/sprite
   * required; the flag itself IS the badge.
   */
  gatekeeperRequires?: string;
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
  /**
   * Locks this map's day/night overlay to a heavy, fixed nighttime darkness
   * instead of following the normal real-time day/night cycle
   * (see OverworldScene.createDayNightOverlay / getOverlayAlpha). For
   * permanently-dark settings (storm routes, a neon night city) rather than
   * places that should still brighten up in daytime.
   */
  forceNight?: boolean;
  /**
   * Locks this map to a fixed warm dusk/sunset tint instead of the normal
   * day/night cycle — distinct from forceNight's heavy dark storm/city
   * overlay, this is meant for a permanently-golden-hour setting (the
   * Nature City) that should read as "evening", not "pitch dark". Mutually
   * exclusive with forceNight in practice, though nothing enforces that.
   */
  forceDusk?: boolean;
  /**
   * Ambient overworld weather shown for flavor on this map (rain streaks +
   * periodic lightning flashes for 'storm'). Purely visual — distinct from
   * the in-battle WeatherType mechanics in BattleSystem, though it reuses
   * the same type since the concepts (and 'storm' in particular) line up.
   */
  ambientWeather?: WeatherType;
  /**
   * Drifting autumn leaves for the Nature City's evening ambience. Separate
   * from ambientWeather (not a WeatherType/battle-relevant concept at all)
   * since "leaves" has no in-battle weather equivalent.
   */
  ambientLeaves?: boolean;
}