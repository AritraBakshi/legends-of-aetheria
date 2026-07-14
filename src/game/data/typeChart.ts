import type { CreatureType } from './types';

const TYPES: CreatureType[] = ['Normal', 'Fire', 'Water', 'Nature', 'Electric', 'Earth', 'Wind', 'Shadow', 'Light', 'Ice', 'Dragon'];

// typeChart[attacker][defender] = multiplier
// 0=Normal,1=Fire,2=Water,3=Nature,4=Electric,5=Earth,6=Wind,7=Shadow,8=Light,9=Ice,10=Dragon
const RAW_CHART: number[][] = [
  // vs Nor  Fir  Wat  Nat  Ele  Ear  Win  Sha  Lig  Ice  Dra
  [    1,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1 ], // Normal
  [    1, 0.5, 0.5,   2,   1,   2,   1,   1, 0.5,   2,   1 ], // Fire
  [    1,   2, 0.5, 0.5,   1,   2,   1,   1,   1,   1,   1 ], // Water
  [    1, 0.5,   2, 0.5,   1,   2,   1,   1,   2,   1,   1 ], // Nature
  [    1,   1,   2,   1, 0.5, 0.5,   2,   1,   1,   1,   1 ], // Electric
  [    1, 0.5,   1,   1,   2, 0.5, 0.5,   2,   1,   1,   1 ], // Earth
  [    1,   1,   1,   2,   2, 0.5, 0.5,   1,   1,   1,   1 ], // Wind
  [    1,   1,   1,   1,   1,   2,   1, 0.5,   2,   1,   1 ], // Shadow
  [    1,   2, 0.5,   2,   1,   1,   1,   2, 0.5,   1,   2 ], // Light
  [    1, 0.5, 0.5,   2,   1,   2,   2,   1,   1, 0.5,   2 ], // Ice
  [    1,   1,   1,   1,   1,   1,   1,   1, 0.5,   1,   2 ], // Dragon
];

export function getTypeMultiplier(attackerType: CreatureType, defenderTypes: CreatureType[]): number {
  const aIdx = TYPES.indexOf(attackerType);
  if (aIdx === -1) return 1;
  let multiplier = 1;
  for (const dt of defenderTypes) {
    const dIdx = TYPES.indexOf(dt);
    if (dIdx !== -1) multiplier *= RAW_CHART[aIdx][dIdx];
  }
  return multiplier;
}

export function getEffectivenessMessage(multiplier: number): string {
  if (multiplier >= 4) return "It's super effective!!";
  if (multiplier >= 2) return "It's super effective!";
  if (multiplier === 0) return "It had no effect...";
  if (multiplier <= 0.25) return "It's not very effective...";
  if (multiplier <= 0.5) return "It's not very effective.";
  return '';
}

export const TYPE_COLORS: Record<CreatureType, number> = {
  Normal:   0xa8a878,
  Fire:     0xf08030,
  Water:    0x6890f0,
  Nature:   0x78c850,
  Electric: 0xf8d030,
  Earth:    0xe0c068,
  Wind:     0xa890f0,
  Shadow:   0x705898,
  Light:    0xffe066,
  Ice:      0x98d8d8,
  Dragon:   0x7038f8,
};