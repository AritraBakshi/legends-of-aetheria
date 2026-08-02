import type { ActiveCreature, Move, StatusEffect, WeatherType } from '../data/types';
import { getMoveById } from '../data/moves';
import { getTypeMultiplier } from '../data/typeChart';
import { getCreatureById, getFullLearnset } from '../data/creatures';

export function calcMaxHp(baseHp: number, level: number): number {
  return Math.floor((2 * baseHp * level) / 100 + level + 10);
}

export function calcStat(baseStat: number, level: number): number {
  return Math.floor((2 * baseStat * level) / 100 + 5);
}

export function calcExpForLevel(level: number): number {
  return Math.floor((level * level * level * 4) / 5);
}

/**
 * Repairs a creature's move list in place, replacing any slot whose moveId
 * no longer resolves via getMoveById with a safe fallback (Tackle).
 *
 * This can happen to creatures that existed in a save file from before a
 * moves.ts data change (an id renamed/removed, or just old debug/test
 * data) — without this, such a slot silently disappears from the battle
 * move menu instead of showing something, which can leave a creature with
 * fewer usable moves than it should have.
 */
export function sanitizeMoves(creature: ActiveCreature): void {
  for (const slot of creature.moves) {
    if (!getMoveById(slot.moveId)) {
      slot.moveId = 1; // Tackle — always exists, always safe
      slot.pp = 35;
      slot.maxPp = 35;
    }
  }
  if (creature.moves.length === 0) {
    creature.moves.push({ moveId: 1, pp: 35, maxPp: 35 });
  }
}

export function createActiveCreature(creatureId: number, level: number): ActiveCreature {
  const data = getCreatureById(creatureId);
  if (!data) throw new Error(`Unknown creature ID: ${creatureId}`);
  const maxHp = calcMaxHp(data.baseStats.hp, level);
  const moves = getFullLearnset(creatureId)
    .filter(m => m.level <= level)
    .sort((a, b) => b.level - a.level)
    .slice(0, 4)
    .map(m => ({ moveId: m.moveId, pp: getMoveById(m.moveId)?.pp ?? 10, maxPp: getMoveById(m.moveId)?.pp ?? 10 }));
  if (moves.length === 0) moves.push({ moveId: 1, pp: 35, maxPp: 35 });

  return {
    dataId: creatureId,
    level,
    currentHp: maxHp,
    maxHp,
    stats: {
      atk: calcStat(data.baseStats.atk, level),
      def: calcStat(data.baseStats.def, level),
      spatk: calcStat(data.baseStats.spatk, level),
      spdef: calcStat(data.baseStats.spdef, level),
      spd: calcStat(data.baseStats.spd, level),
    },
    moves,
    exp: calcExpForLevel(level),
    expToNext: calcExpForLevel(level + 1),
    status: null,
    isCaught: false,
  };
}

const STAGE_MULT = [0.25, 0.28, 0.33, 0.40, 0.50, 0.66, 1, 1.5, 2, 2.5, 3, 3.5, 4];

export function getStageMultiplier(stage: number): number {
  return STAGE_MULT[Math.max(0, Math.min(12, stage + 6))];
}

export interface BattleStats {
  atk: number; def: number; spatk: number; spdef: number; spd: number; acc: number; eva: number;
}

export interface BattleCreature {
  creature: ActiveCreature;
  stages: { atk: number; def: number; spatk: number; spdef: number; spd: number; acc: number; eva: number };
  confusionTurns: number;
}

export function getEffectiveStat(bc: BattleCreature, stat: keyof typeof bc.stages): number {
  const base = bc.creature.stats[stat as keyof typeof bc.creature.stats] ?? 1;
  return Math.floor(base * getStageMultiplier(bc.stages[stat]));
}

export interface DamageResult {
  damage: number;
  typeMultiplier: number;
  isCrit: boolean;
  effectivenessMsg: string;
}

/** Ability IDs that boost their matching move type by 1.5x when the user is at 1/3 HP or less. */
const LOW_HP_BOOST_ABILITY_TYPE: Record<string, string> = {
  blaze: 'Fire',
  torrent: 'Water',
  overgrow: 'Nature',
};

export function getAbilityId(creature: ActiveCreature): string | undefined {
  return getCreatureById(creature.dataId)?.abilityId;
}

/** Weather's multiplier on a move's raw power, before any other modifiers. */
function getWeatherTypeMultiplier(moveType: string, weather: WeatherType): number {
  if (weather === 'sun') {
    if (moveType === 'Fire') return 1.5;
    if (moveType === 'Water') return 0.5;
  } else if (weather === 'rain') {
    if (moveType === 'Water') return 1.5;
    if (moveType === 'Fire') return 0.5;
  } else if (weather === 'storm') {
    if (moveType === 'Wind' || moveType === 'Electric') return 1.3;
  }
  return 1;
}

export function calcDamage(
  attacker: BattleCreature,
  defender: BattleCreature,
  move: Move,
  weather: WeatherType = 'clear'
): DamageResult {
  if (move.category === 'Status') return { damage: 0, typeMultiplier: 1, isCrit: false, effectivenessMsg: '' };

  const defCreatureData = getCreatureById(defender.creature.dataId)!;
  const defenderAbility = getAbilityId(defender.creature);

  // Fixed-damage moves (e.g. Sonic Boom) ignore stats/STAB/crit entirely,
  // but are still blocked by a type immunity (0x multiplier).
  if (move.fixedDamage) {
    const fixedTypeMult = getTypeMultiplier(move.type, defCreatureData.type);
    if (fixedTypeMult === 0) return { damage: 0, typeMultiplier: 0, isCrit: false, effectivenessMsg: 'It had no effect...' };
    return { damage: move.fixedDamage, typeMultiplier: 1, isCrit: false, effectivenessMsg: '' };
  }

  if (move.power === 0) return { damage: 0, typeMultiplier: 1, isCrit: false, effectivenessMsg: '' };

  const level = attacker.creature.level;
  const atkCreatureData = getCreatureById(attacker.creature.dataId)!;
  const attackerAbility = getAbilityId(attacker.creature);

  const isPhys = move.category === 'Physical';
  const atk = isPhys ? getEffectiveStat(attacker, 'atk') : getEffectiveStat(attacker, 'spatk');
  const def = isPhys ? getEffectiveStat(defender, 'def') : getEffectiveStat(defender, 'spdef');

  // Rock Solid: never lands a critical hit against this creature.
  const isCrit = defenderAbility !== 'rock_solid' && Math.random() < 0.0625;
  const critMult = isCrit ? 1.5 : 1;
  const randMult = (Math.random() * 0.15 + 0.85);
  const stab = atkCreatureData.type.includes(move.type) ? 1.5 : 1;
  const typeMultiplier = getTypeMultiplier(move.type, defCreatureData.type);
  const weatherMult = getWeatherTypeMultiplier(move.type, weather);

  // Blaze/Torrent/Overgrow: 1.5x when the user is at 1/3 HP or less and the
  // move matches the ability's element.
  let abilityMult = 1;
  if (attackerAbility && LOW_HP_BOOST_ABILITY_TYPE[attackerAbility] === move.type
      && attacker.creature.currentHp <= attacker.creature.maxHp / 3) {
    abilityMult *= 1.5;
  }
  // Solar Power: Special moves hit 1.5x harder in the sun.
  if (attackerAbility === 'solar_power' && weather === 'sun' && move.category === 'Special') {
    abilityMult *= 1.5;
  }

  const damage = Math.max(1, Math.floor(
    ((2 * level / 5 + 2) * move.power * atk / def / 50 + 2)
      * critMult * randMult * stab * typeMultiplier * weatherMult * abilityMult
  ));

  let effectivenessMsg = '';
  if (typeMultiplier >= 2) effectivenessMsg = "It's super effective!";
  else if (typeMultiplier === 0) effectivenessMsg = "It had no effect...";
  else if (typeMultiplier <= 0.5) effectivenessMsg = "It's not very effective.";
  if (isCrit) effectivenessMsg = (effectivenessMsg ? effectivenessMsg + ' ' : '') + 'A critical hit!';

  return { damage, typeMultiplier, isCrit, effectivenessMsg };
}

export function calcCatchRate(creature: ActiveCreature, catchRate: number, ballMult: number): number {
  const hpFactor = (creature.maxHp * 3 - creature.currentHp * 2) / (creature.maxHp * 3);
  const statusBonus = creature.status !== null ? 1.5 : 1;
  const rate = hpFactor * catchRate * ballMult * statusBonus / 255;
  return Math.min(0.95, rate);
}

// ─── ACCURACY / EVASION ───────────────────────────────────────────────────────

/**
 * Whether a move hits, factoring in the attacker's accuracy stage, the
 * defender's evasion stage, and evasion-boosting abilities (Snow Cloak in
 * snow, Unbound Grace while healthy). Previously this was a flat
 * `Math.random()*100 > move.accuracy` roll with acc/eva stages tracked but
 * never actually consulted.
 */
export function checkMoveHits(attacker: BattleCreature, defender: BattleCreature, move: Move, weather: WeatherType = 'clear'): boolean {
  const accMult = getStageMultiplier(attacker.stages.acc);
  let evaMult = getStageMultiplier(defender.stages.eva);

  const defAbility = getAbilityId(defender.creature);
  if (defAbility === 'snow_cloak' && weather === 'snow') evaMult *= 1.25;
  if (defAbility === 'unbound_grace' && defender.creature.currentHp > defender.creature.maxHp / 2) evaMult *= 1.15;

  const effectiveAccuracy = move.accuracy * (accMult / evaMult);
  return Math.random() * 100 < effectiveAccuracy;
}

// ─── CONTACT-TRIGGERED ABILITIES ──────────────────────────────────────────────

export interface ContactAbilityResult {
  /** Damage dealt back to the attacker as this creature's contact "punishment" (Thorn Coat). */
  recoilToAttacker?: number;
  /** Status inflicted on the attacker (Static/Static Mane). */
  inflictOnAttacker?: StatusEffect;
  message?: string;
}

/**
 * Resolves a defender's contact-triggered ability after being hit by a
 * physical move (Static/Static Mane may paralyze the attacker, Thorn Coat
 * damages it). Call only when move.category === 'Physical' and the hit
 * actually landed and dealt damage.
 */
export function checkContactAbility(defender: BattleCreature, attackerName: string): ContactAbilityResult {
  const ability = getAbilityId(defender.creature);
  if (ability === 'static' && !defender.creature.status && Math.random() < 0.3) {
    return { inflictOnAttacker: 'paralysis', message: `${attackerName} was paralyzed by static!` };
  }
  if (ability === 'thorn_coat') {
    const recoil = Math.max(1, Math.floor(defender.creature.maxHp / 8));
    return { recoilToAttacker: recoil, message: `${attackerName} was hurt by thorns!` };
  }
  return {};
}

/**
 * Motor Drive: if the defender has it and the incoming move is Electric,
 * the hit is fully negated and the defender's Speed rises instead. Check
 * this BEFORE damage is applied/rolled — it replaces the hit entirely.
 */
export function checkMotorDrive(defender: BattleCreature, move: Move): boolean {
  if (getAbilityId(defender.creature) === 'motor_drive' && move.type === 'Electric') {
    defender.stages.spd = Math.min(6, defender.stages.spd + 1);
    return true;
  }
  return false;
}

/** Sturdy: surviving a would-be KO with 1 HP left, if the creature was at full HP. */
export function applySturdy(defender: BattleCreature, incomingDamage: number): { damage: number; triggered: boolean } {
  const ability = getAbilityId(defender.creature);
  const wasFullHp = defender.creature.currentHp === defender.creature.maxHp;
  if (ability === 'sturdy' && wasFullHp && incomingDamage >= defender.creature.currentHp) {
    return { damage: defender.creature.currentHp - 1, triggered: true };
  }
  return { damage: incomingDamage, triggered: false };
}

/** Rock Head: no recoil damage from the user's own recoil moves. */
export function blocksRecoil(attacker: BattleCreature): boolean {
  return getAbilityId(attacker.creature) === 'rock_head';
}

// ─── GUARANTEED / BOOSTED SECONDARY EFFECTS ──────────────────────────────────

/**
 * Some abilities guarantee or boost a move's own secondary status chance:
 * Inferno guarantees burn on the user's Fire moves, Frozen Fists roughly
 * doubles the freeze chance on the user's Ice moves, Deep Torrent/Deep
 * Roots guarantee a stat-drop side effect on the user's Water/Nature moves
 * even when the move itself doesn't normally carry one.
 */
export function getBoostedEffectChance(attacker: BattleCreature, move: Move): number | null {
  const ability = getAbilityId(attacker.creature);
  if (ability === 'inferno' && move.type === 'Fire' && move.category !== 'Status') return 100;
  if (ability === 'frozen_fists' && move.type === 'Ice' && move.category !== 'Status') {
    return move.effect?.type === 'status' && move.effect.status === 'freeze'
      ? Math.min(100, (move.effect.chance ?? 10) * 2)
      : null;
  }
  return null;
}

/** Deep Torrent (Water) / Deep Roots (Nature): always apply a -1 stat drop on hit, even on moves with no listed effect. */
export function getForcedStatDrop(attacker: BattleCreature, move: Move): { stat: 'spdef' | 'spd'; stages: number } | null {
  const ability = getAbilityId(attacker.creature);
  if (ability === 'deep_torrent' && move.type === 'Water' && move.category !== 'Status') return { stat: 'spdef', stages: -1 };
  if (ability === 'deep_roots' && move.type === 'Nature' && move.category !== 'Status') return { stat: 'spd', stages: -1 };
  return null;
}

// ─── WEATHER ──────────────────────────────────────────────────────────────────

/** Speed multiplier from weather-reactive abilities (Swift Swim in rain, Tailwind Spirit in clear skies). */
export function getWeatherSpeedMultiplier(creature: ActiveCreature, weather: WeatherType): number {
  const ability = getAbilityId(creature);
  if (ability === 'swift_swim' && weather === 'rain') return 2;
  if (ability === 'tailwind_spirit' && weather === 'clear') return 1.5;
  return 1;
}

/** End-of-turn weather effect (currently just Ice Body's heal in snow). Returns HP restored, 0 if none. */
export function getWeatherTickHeal(creature: ActiveCreature, weather: WeatherType): number {
  if (getAbilityId(creature) === 'ice_body' && weather === 'snow' && creature.currentHp < creature.maxHp) {
    return Math.max(1, Math.floor(creature.maxHp / 16));
  }
  return 0;
}

/** Drought: sets sunny weather the moment this creature enters battle. */
export function getEntryWeather(creature: ActiveCreature): WeatherType | null {
  return getAbilityId(creature) === 'drought' ? 'sun' : null;
}

/** Intimidate: lowers the opponent's Attack by 1 stage the moment this creature enters battle. */
export function hasIntimidate(creature: ActiveCreature): boolean {
  return getAbilityId(creature) === 'intimidate';
}

/** Pressure: moves used against this creature cost an extra PP. */
export function hasPressure(creature: ActiveCreature): boolean {
  return getAbilityId(creature) === 'pressure';
}

/** Illuminate: while leading the party, wild encounters never trigger — an always-on Repel. */
export function hasIlluminate(creature: ActiveCreature): boolean {
  return getAbilityId(creature) === 'illuminate';
}

/** Storm Caller: this creature's Wind moves gain +1 priority while a storm is active. */
export function getWeatherPriorityBonus(creature: ActiveCreature, move: Move, weather: WeatherType): number {
  if (getAbilityId(creature) === 'storm_caller' && weather === 'storm' && move.type === 'Wind') return 1;
  return 0;
}

/** Gale Wings: this creature's Wind moves always get +1 priority (no weather requirement). */
export function getAbilityPriorityBonus(creature: ActiveCreature, move: Move): number {
  if (getAbilityId(creature) === 'gale_wings' && move.type === 'Wind') return 1;
  return 0;
}

export function tryCapture(creature: ActiveCreature, catchRate: number, ballMult: number): boolean {
  return Math.random() < calcCatchRate(creature, catchRate, ballMult);
}

export function calcExpGain(defeated: ActiveCreature): number {
  const data = getCreatureById(defeated.dataId)!;
  const baseExp = data.baseStats.hp + data.baseStats.atk + data.baseStats.spd;
  return Math.floor(baseExp * defeated.level / 7);
}

export function applyExpGain(creature: ActiveCreature, exp: number): { leveled: boolean; newLevel: number } {
  creature.exp += exp;
  let leveled = false;
  while (creature.exp >= creature.expToNext && creature.level < 100) {
    creature.level++;
    creature.expToNext = calcExpForLevel(creature.level + 1);
    const data = getCreatureById(creature.dataId)!;
    const newMaxHp = calcMaxHp(data.baseStats.hp, creature.level);
    creature.currentHp = Math.min(creature.currentHp + (newMaxHp - creature.maxHp), newMaxHp);
    creature.maxHp = newMaxHp;
    creature.stats.atk = calcStat(data.baseStats.atk, creature.level);
    creature.stats.def = calcStat(data.baseStats.def, creature.level);
    creature.stats.spatk = calcStat(data.baseStats.spatk, creature.level);
    creature.stats.spdef = calcStat(data.baseStats.spdef, creature.level);
    creature.stats.spd = calcStat(data.baseStats.spd, creature.level);
    leveled = true;
  }
  return { leveled, newLevel: creature.level };
}

export function checkEvolution(creature: ActiveCreature): number | null {
  const data = getCreatureById(creature.dataId)!;
  if (!data.evolutionLevel || creature.level < data.evolutionLevel) return null;

  if (data.evolutionBranches && data.evolutionBranches.length > 0) {
    for (const branch of data.evolutionBranches) {
      const knowsQualifyingMove = creature.moves.some(m => getMoveById(m.moveId)?.type === branch.requiresMoveType);
      if (knowsQualifyingMove) return branch.evolvesInto;
    }
    // Hasn't learned a qualifying move yet — stays as-is, re-checked on the
    // next level-up. No timeout/fallback: it can wait indefinitely.
    return null;
  }

  if (data.evolvesInto) return data.evolvesInto;
  return null;
}

export function applyStatusDamage(creature: ActiveCreature): number {
  if (creature.status === 'burn' || creature.status === 'poison') {
    const dmg = Math.max(1, Math.floor(creature.maxHp / 8));
    creature.currentHp = Math.max(0, creature.currentHp - dmg);
    return dmg;
  }
  return 0;
}

/**
 * Inflicts a status, setting up its duration counter where one applies.
 * Always use this (not a bare `creature.status = x` assignment) so sleep
 * and confusion actually get a duration — otherwise checkStatusBlocksAction
 * has nothing to count down and the status silently does nothing.
 */
export function inflictStatus(creature: ActiveCreature, status: StatusEffect): void {
  creature.status = status;
  if (status === 'sleep') creature.statusTurns = 1 + Math.floor(Math.random() * 3); // 1-3 turns
  else if (status === 'confusion') creature.statusTurns = 2 + Math.floor(Math.random() * 3); // 2-4 turns
  else creature.statusTurns = undefined; // burn/poison/paralysis/freeze don't use a turn counter
}

export interface StatusActionCheck {
  /** True if the creature cannot use its chosen move this turn. */
  blocked: boolean;
  /** Message to show, if any (e.g. "X is paralyzed!", "X woke up!"). */
  message?: string;
  /** Set if the creature hurt itself in confusion — apply this damage instead of the move. */
  selfDamage?: number;
}

/**
 * Resolves paralysis/sleep/freeze/confusion for the creature about to act.
 * Call this AFTER applyStatusDamage (burn/poison tick) and BEFORE running
 * the creature's chosen move. Cures sleep/freeze/confusion on their own
 * when they naturally end, same as applyStatusDamage never cures
 * burn/poison (those are only cured by items).
 */
export function checkStatusBlocksAction(creature: ActiveCreature): StatusActionCheck {
  const status = creature.status;

  if (status === 'paralysis') {
    if (Math.random() < 0.25) {
      return { blocked: true, message: `is paralyzed! It can't move!` };
    }
    return { blocked: false };
  }

  if (status === 'sleep') {
    creature.statusTurns = Math.max(0, (creature.statusTurns ?? 1) - 1);
    if (creature.statusTurns <= 0) {
      creature.status = null;
      creature.statusTurns = undefined;
      return { blocked: false, message: `woke up!` };
    }
    return { blocked: true, message: `is fast asleep.` };
  }

  if (status === 'freeze') {
    if (Math.random() < 0.2) {
      creature.status = null;
      return { blocked: false, message: `thawed out!` };
    }
    return { blocked: true, message: `is frozen solid!` };
  }

  if (status === 'confusion') {
    creature.statusTurns = Math.max(0, (creature.statusTurns ?? 1) - 1);
    if (creature.statusTurns <= 0) {
      creature.status = null;
      creature.statusTurns = undefined;
      return { blocked: false, message: `snapped out of confusion!` };
    }
    if (Math.random() < 1 / 3) {
      const selfDamage = Math.max(1, Math.floor(creature.maxHp / 10));
      creature.currentHp = Math.max(0, creature.currentHp - selfDamage);
      return { blocked: true, message: `is confused! It hurt itself in its confusion!`, selfDamage };
    }
    return { blocked: false, message: `is confused!` };
  }

  return { blocked: false };
}

export function isFainted(creature: ActiveCreature): boolean {
  return creature.currentHp <= 0;
}

export function learnNewMoves(creature: ActiveCreature): number[] {
  const currentMoveIds = creature.moves.map(m => m.moveId);
  return getFullLearnset(creature.dataId)
    .filter(m => m.level === creature.level && !currentMoveIds.includes(m.moveId))
    .map(m => m.moveId);
}