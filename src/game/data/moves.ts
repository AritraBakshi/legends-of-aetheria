import type { Move } from './types';

export const MOVES: Move[] = [
  // Normal
  { id: 1, name: 'Tackle', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 35, description: 'A basic tackle attack.' },
  { id: 2, name: 'Scratch', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 35, description: 'Scratches with sharp claws.' },
  { id: 3, name: 'Quick Attack', type: 'Normal', category: 'Physical', power: 40, accuracy: 100, pp: 30, description: 'Attacks with blinding speed.', effect: { type: 'priority', target: 'self', priority: 1 } },
  { id: 4, name: 'Growl', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 40, description: 'Lowers the foe\'s Attack.', effect: { type: 'stat', target: 'opponent', stat: 'atk', stages: -1, chance: 100 } },
  { id: 5, name: 'Leer', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Lowers the foe\'s Defense.', effect: { type: 'stat', target: 'opponent', stat: 'def', stages: -1, chance: 100 } },
  { id: 6, name: 'Rest', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores full HP but causes sleep.', effect: { type: 'heal', target: 'self', healPercent: 100 } },
  { id: 7, name: 'Double Hit', type: 'Normal', category: 'Physical', power: 35, accuracy: 90, pp: 15, description: 'Hits the foe twice in a row.' },
  { id: 8, name: 'Haze', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Clears all stat changes.' },

  // Fire
  { id: 10, name: 'Ember', type: 'Fire', category: 'Special', power: 40, accuracy: 100, pp: 25, description: 'A weak fire attack.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 10 } },
  { id: 11, name: 'Flame Burst', type: 'Fire', category: 'Special', power: 60, accuracy: 95, pp: 15, description: 'A burst of flame.' },
  { id: 12, name: 'Inferno Blast', type: 'Fire', category: 'Special', power: 90, accuracy: 85, pp: 10, description: 'A powerful inferno.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 30 } },
  { id: 13, name: 'Heat Wave', type: 'Fire', category: 'Special', power: 95, accuracy: 90, pp: 10, description: 'A scorching wave of heat.' },
  { id: 14, name: 'Scorch', type: 'Fire', category: 'Physical', power: 50, accuracy: 100, pp: 15, description: 'Sears the foe.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 30 } },
  { id: 15, name: 'Flare Up', type: 'Fire', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts own Attack sharply.', effect: { type: 'stat', target: 'self', stat: 'atk', stages: 2, chance: 100 } },

  // Water
  { id: 20, name: 'Splash', type: 'Water', category: 'Special', power: 40, accuracy: 100, pp: 25, description: 'Splashes the foe with water.' },
  { id: 21, name: 'Water Jet', type: 'Water', category: 'Special', power: 65, accuracy: 100, pp: 20, description: 'A powerful stream of water.' },
  { id: 22, name: 'Tidal Wave', type: 'Water', category: 'Special', power: 90, accuracy: 85, pp: 10, description: 'A massive tidal wave.' },
  { id: 23, name: 'Aqua Burst', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Explosive aqua force.' },
  { id: 24, name: 'Soak', type: 'Water', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lowers the foe\'s Sp.Def.', effect: { type: 'stat', target: 'opponent', stat: 'spdef', stages: -1, chance: 100 } },

  // Nature
  { id: 30, name: 'Leaf Toss', type: 'Nature', category: 'Physical', power: 40, accuracy: 100, pp: 25, description: 'Tosses sharp leaves.' },
  { id: 31, name: 'Vine Whip', type: 'Nature', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Strikes with a vine.' },
  { id: 32, name: 'Solar Beam', type: 'Nature', category: 'Special', power: 120, accuracy: 100, pp: 10, description: 'Charges then blasts light.' },
  { id: 33, name: 'Petal Storm', type: 'Nature', category: 'Special', power: 90, accuracy: 85, pp: 10, description: 'A storm of sharp petals.' },
  { id: 34, name: 'Entangle', type: 'Nature', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Lowers foe\'s Speed.', effect: { type: 'stat', target: 'opponent', stat: 'spd', stages: -1, chance: 100 } },
  { id: 35, name: 'Spore', type: 'Nature', category: 'Status', power: 0, accuracy: 75, pp: 15, description: 'Scatters spores causing sleep.', effect: { type: 'status', target: 'opponent', status: 'sleep', chance: 100 } },

  // Electric
  { id: 40, name: 'Shock', type: 'Electric', category: 'Special', power: 40, accuracy: 100, pp: 30, description: 'A small electric shock.' },
  { id: 41, name: 'Thunder Bolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'A crackling thunderbolt.', effect: { type: 'status', target: 'opponent', status: 'paralysis', chance: 10 } },
  { id: 42, name: 'Lightning Strike', type: 'Electric', category: 'Special', power: 110, accuracy: 70, pp: 10, description: 'A fierce lightning strike.' },
  { id: 43, name: 'Static Surge', type: 'Electric', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts own Speed.', effect: { type: 'stat', target: 'self', stat: 'spd', stages: 1, chance: 100 } },
  { id: 44, name: 'Zap', type: 'Electric', category: 'Special', power: 50, accuracy: 100, pp: 20, description: 'A zapping shock.', effect: { type: 'status', target: 'opponent', status: 'paralysis', chance: 10 } },

  // Earth
  { id: 50, name: 'Pebble Toss', type: 'Earth', category: 'Physical', power: 40, accuracy: 100, pp: 25, description: 'Hurls small pebbles.' },
  { id: 51, name: 'Rock Slam', type: 'Earth', category: 'Physical', power: 65, accuracy: 90, pp: 20, description: 'Slams with a boulder.' },
  { id: 52, name: 'Boulder Crash', type: 'Earth', category: 'Physical', power: 100, accuracy: 75, pp: 10, description: 'Crashes a huge boulder.' },
  { id: 53, name: 'Seismic Force', type: 'Earth', category: 'Physical', power: 80, accuracy: 100, pp: 10, description: 'Shakes the earth.' },
  { id: 54, name: 'Harden', type: 'Earth', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Raises own Defense.', effect: { type: 'stat', target: 'self', stat: 'def', stages: 1, chance: 100 } },

  // Wind
  { id: 60, name: 'Gust', type: 'Wind', category: 'Special', power: 40, accuracy: 100, pp: 35, description: 'A blast of wind.' },
  { id: 61, name: 'Air Slash', type: 'Wind', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Cuts with a sharp air blade.' },
  { id: 62, name: 'Cyclone', type: 'Wind', category: 'Special', power: 110, accuracy: 70, pp: 10, description: 'A violent cyclone.' },
  { id: 63, name: 'Tailwind', type: 'Wind', category: 'Status', power: 0, accuracy: 100, pp: 15, description: 'Boosts own Speed greatly.', effect: { type: 'stat', target: 'self', stat: 'spd', stages: 2, chance: 100 } },

  // Shadow
  { id: 70, name: 'Shadow Claw', type: 'Shadow', category: 'Physical', power: 70, accuracy: 100, pp: 15, description: 'Slashes with a shadowy claw.' },
  { id: 71, name: 'Darkness', type: 'Shadow', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Engulfs foe in darkness.' },
  { id: 72, name: 'Night Strike', type: 'Shadow', category: 'Physical', power: 100, accuracy: 90, pp: 10, description: 'Strikes from the shadows.' },
  { id: 73, name: 'Confuse Ray', type: 'Shadow', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Confuses the foe.', effect: { type: 'status', target: 'opponent', status: 'confusion', chance: 100 } },

  // Light
  { id: 80, name: 'Flash', type: 'Light', category: 'Special', power: 40, accuracy: 100, pp: 30, description: 'A blinding flash of light.', effect: { type: 'stat', target: 'opponent', stat: 'acc', stages: -1, chance: 100 } },
  { id: 81, name: 'Radiance', type: 'Light', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'A burst of radiant energy.' },
  { id: 82, name: 'Sunburst', type: 'Light', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'An intense solar burst.' },
  { id: 83, name: 'Heal Pulse', type: 'Light', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores half the user\'s HP.', effect: { type: 'heal', target: 'self', healPercent: 50 } },
];

export function getMoveById(id: number): Move | undefined {
  return MOVES.find(m => m.id === id);
}

/**
 * Not a learnable move — never appears in MOVES, learnsets, or move-list UI.
 * This is the last-resort action a creature can take when every one of its
 * actual moves is out of PP, so a battle can never soft-lock. Equivalent to
 * "Struggle" in the classic games: always available, always hits, and hurts
 * the user on top of the damage it deals.
 */
export const FINAL_CRASHOUT_MOVE: Move = {
  id: -1,
  name: 'Final Crashout',
  type: 'Normal',
  category: 'Physical',
  power: 100,
  accuracy: 100,
  pp: 1,
  description: 'A desperate, all-or-nothing strike used only when no other move has PP left.',
  effect: { type: 'recoil', target: 'self', recoilFlat: 50 },
};
