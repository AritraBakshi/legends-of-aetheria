import type { ActiveCreature, Move, StatusEffect } from '../data/types';
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

export function calcDamage(
  attacker: BattleCreature,
  defender: BattleCreature,
  move: Move
): DamageResult {
  if (move.category === 'Status') return { damage: 0, typeMultiplier: 1, isCrit: false, effectivenessMsg: '' };

  const defCreatureData = getCreatureById(defender.creature.dataId)!;

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

  const isPhys = move.category === 'Physical';
  const atk = isPhys ? getEffectiveStat(attacker, 'atk') : getEffectiveStat(attacker, 'spatk');
  const def = isPhys ? getEffectiveStat(defender, 'def') : getEffectiveStat(defender, 'spdef');

  const isCrit = Math.random() < 0.0625;
  const critMult = isCrit ? 1.5 : 1;
  const randMult = (Math.random() * 0.15 + 0.85);
  const stab = atkCreatureData.type.includes(move.type) ? 1.5 : 1;
  const typeMultiplier = getTypeMultiplier(move.type, defCreatureData.type);

  const damage = Math.max(1, Math.floor(
    ((2 * level / 5 + 2) * move.power * atk / def / 50 + 2) * critMult * randMult * stab * typeMultiplier
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
  if (data.evolutionLevel && creature.level >= data.evolutionLevel && data.evolvesInto) {
    return data.evolvesInto;
  }
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

export function isFainted(creature: ActiveCreature): boolean {
  return creature.currentHp <= 0;
}

export function learnNewMoves(creature: ActiveCreature): number[] {
  const currentMoveIds = creature.moves.map(m => m.moveId);
  return getFullLearnset(creature.dataId)
    .filter(m => m.level === creature.level && !currentMoveIds.includes(m.moveId))
    .map(m => m.moveId);
}