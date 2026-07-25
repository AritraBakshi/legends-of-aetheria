import type { Item } from './types';

export const ITEMS: Item[] = [
  { id: 1, name: 'Capture Orb', type: 'capture', catchMultiplier: 1, description: 'A basic orb for capturing wild creatures.' },
  { id: 2, name: 'Advanced Orb', type: 'capture', catchMultiplier: 1.5, description: 'A better orb with higher catch rate.' },
  { id: 3, name: 'Ultra Orb', type: 'capture', catchMultiplier: 2, description: 'An ultra-powerful capture orb.' },
  { id: 10, name: 'Small Herb', type: 'heal', healAmount: 30, description: 'Restores 30 HP to a creature.' },
  { id: 11, name: 'Herb Potion', type: 'heal', healAmount: 60, description: 'Restores 60 HP to a creature.' },
  { id: 12, name: 'Great Potion', type: 'heal', healAmount: 120, description: 'Restores 120 HP to a creature.' },
  { id: 13, name: 'Full Restore', type: 'heal', healPercent: 100, description: 'Fully restores a creature\'s HP and cures status.' },
  { id: 20, name: 'Antidote', type: 'status_cure', curesStatus: ['poison'], description: 'Cures poison.' },
  { id: 21, name: 'Burn Salve', type: 'status_cure', curesStatus: ['burn'], description: 'Cures a burn.' },
  { id: 22, name: 'Paralysis Cure', type: 'status_cure', curesStatus: ['paralysis'], description: 'Cures paralysis.' },
  { id: 23, name: 'Awakening', type: 'status_cure', curesStatus: ['sleep'], description: 'Wakes up a sleeping creature.' },
  { id: 24, name: 'Full Cure', type: 'status_cure', curesStatus: ['burn', 'poison', 'paralysis', 'sleep', 'freeze', 'confusion'], description: 'Cures any status condition.' },
  { id: 30, name: 'XP-Shot', type: 'xp_boost', xpAmount: 1000, description: 'Grants 1000 EXP to one creature.' },
  { id: 31, name: 'XP-Shot Plus', type: 'xp_boost', xpAmount: 20000, description: 'Grants 20000 EXP to one creature.' },
  { id: 40, name: 'Surf', type: 'key', description: 'A weathered board humming with Earth-forged energy. Lets you glide across any open water in the overworld.' },
  { id: 50, name: 'Repel', type: 'repel', repelSteps: 100, description: 'Keeps weak wild creatures away for 100 steps.' },
  { id: 51, name: 'Super Repel', type: 'repel', repelSteps: 200, description: 'Keeps weak wild creatures away for 200 steps.' },
];

export function getItemById(id: number): Item | undefined {
  return ITEMS.find(i => i.id === id);
}
