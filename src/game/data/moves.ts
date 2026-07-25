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
  { id: 100, name: 'Body Slam', type: 'Normal', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'A full-body slam.', effect: { type: 'status', target: 'opponent', status: 'paralysis', chance: 30 } },
  { id: 101, name: 'Hyper Voice', type: 'Normal', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'A tremendous roar of sound.' },
  { id: 102, name: 'Slam', type: 'Normal', category: 'Physical', power: 55, accuracy: 85, pp: 20, description: 'Slams the foe with a heavy blow.' },
  { id: 103, name: 'Sonic Boom', type: 'Normal', category: 'Special', power: 20, accuracy: 90, pp: 20, description: 'Always deals exactly 20 damage.', fixedDamage: 20 },
  { id: 104, name: 'Agility', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Sharply boosts the user\'s Speed.', effect: { type: 'stat', target: 'self', stat: 'spd', stages: 2, chance: 100 } },
  { id: 105, name: 'Screech', type: 'Normal', category: 'Status', power: 0, accuracy: 85, pp: 20, description: 'Harshly lowers the foe\'s Defense.', effect: { type: 'stat', target: 'opponent', stat: 'def', stages: -2, chance: 100 } },
  { id: 106, name: 'Facade', type: 'Normal', category: 'Physical', power: 70, accuracy: 100, pp: 20, description: 'A simple, reliable strike.' },
  { id: 107, name: 'Charm', type: 'Normal', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Harshly lowers the foe\'s Attack.', effect: { type: 'stat', target: 'opponent', stat: 'atk', stages: -2, chance: 100 } },

  // Fire
  { id: 10, name: 'Ember', type: 'Fire', category: 'Special', power: 40, accuracy: 100, pp: 25, description: 'A weak fire attack.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 10 } },
  { id: 11, name: 'Flame Burst', type: 'Fire', category: 'Special', power: 60, accuracy: 95, pp: 15, description: 'A burst of flame.' },
  { id: 12, name: 'Inferno Blast', type: 'Fire', category: 'Special', power: 90, accuracy: 85, pp: 10, description: 'A powerful inferno.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 30 } },
  { id: 13, name: 'Heat Wave', type: 'Fire', category: 'Special', power: 95, accuracy: 90, pp: 10, description: 'A scorching wave of heat.' },
  { id: 14, name: 'Scorch', type: 'Fire', category: 'Physical', power: 50, accuracy: 100, pp: 15, description: 'Sears the foe.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 30 } },
  { id: 15, name: 'Flare Up', type: 'Fire', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts own Attack sharply.', effect: { type: 'stat', target: 'self', stat: 'atk', stages: 2, chance: 100 } },
  { id: 110, name: 'Fire Fang', type: 'Fire', category: 'Physical', power: 65, accuracy: 95, pp: 15, description: 'Bites with flame-wreathed fangs.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 20 } },
  { id: 111, name: 'Flamethrower', type: 'Fire', category: 'Special', power: 85, accuracy: 100, pp: 15, description: 'A steady stream of searing flame.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 10 } },
  { id: 112, name: 'Fire Spin', type: 'Fire', category: 'Special', power: 45, accuracy: 85, pp: 15, description: 'Traps the foe in a vortex of flame.' },
  { id: 113, name: 'Will-O-Wisp', type: 'Fire', category: 'Status', power: 0, accuracy: 85, pp: 15, description: 'A ghostly flame that inflicts a burn.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 100 } },
  { id: 114, name: 'Ember Veil', type: 'Fire', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Wreathes the user in warmth, raising Sp.Def.', effect: { type: 'stat', target: 'self', stat: 'spdef', stages: 1, chance: 100 } },
  { id: 115, name: 'Magma Bomb', type: 'Fire', category: 'Special', power: 35, accuracy: 85, pp: 10, description: 'Always deals exactly 35 damage.', fixedDamage: 35 },

  // Water
  { id: 20, name: 'Splash', type: 'Water', category: 'Special', power: 40, accuracy: 100, pp: 25, description: 'Splashes the foe with water.' },
  { id: 21, name: 'Water Jet', type: 'Water', category: 'Special', power: 65, accuracy: 100, pp: 20, description: 'A powerful stream of water.' },
  { id: 22, name: 'Tidal Wave', type: 'Water', category: 'Special', power: 90, accuracy: 85, pp: 10, description: 'A massive tidal wave.' },
  { id: 23, name: 'Aqua Burst', type: 'Water', category: 'Special', power: 110, accuracy: 80, pp: 5, description: 'Explosive aqua force.' },
  { id: 24, name: 'Soak', type: 'Water', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Lowers the foe\'s Sp.Def.', effect: { type: 'stat', target: 'opponent', stat: 'spdef', stages: -1, chance: 100 } },
  { id: 120, name: 'Bubble Beam', type: 'Water', category: 'Special', power: 65, accuracy: 100, pp: 20, description: 'A stream of bursting bubbles.', effect: { type: 'stat', target: 'opponent', stat: 'spd', stages: -1, chance: 20 } },
  { id: 121, name: 'Hydro Pump', type: 'Water', category: 'Special', power: 100, accuracy: 80, pp: 5, description: 'An enormous, high-pressure blast of water.' },
  { id: 122, name: 'Aqua Jet', type: 'Water', category: 'Physical', power: 40, accuracy: 100, pp: 20, description: 'A quick, darting strike of water.', effect: { type: 'priority', target: 'self', priority: 1 } },
  { id: 123, name: 'Whirlpool', type: 'Water', category: 'Special', power: 25, accuracy: 85, pp: 10, description: 'Always deals exactly 25 damage.', fixedDamage: 25 },
  { id: 124, name: 'Withdraw', type: 'Water', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Withdraws into its shell, raising Defense.', effect: { type: 'stat', target: 'self', stat: 'def', stages: 1, chance: 100 } },
  { id: 125, name: 'Icy Splash', type: 'Water', category: 'Special', power: 55, accuracy: 90, pp: 15, description: 'A chilling blast of near-frozen water.', effect: { type: 'status', target: 'opponent', status: 'freeze', chance: 10 } },

  // Nature
  { id: 30, name: 'Leaf Toss', type: 'Nature', category: 'Physical', power: 40, accuracy: 100, pp: 25, description: 'Tosses sharp leaves.' },
  { id: 31, name: 'Vine Whip', type: 'Nature', category: 'Physical', power: 65, accuracy: 100, pp: 20, description: 'Strikes with a vine.' },
  { id: 32, name: 'Solar Beam', type: 'Nature', category: 'Special', power: 120, accuracy: 100, pp: 10, description: 'Charges then blasts light.' },
  { id: 33, name: 'Petal Storm', type: 'Nature', category: 'Special', power: 90, accuracy: 85, pp: 10, description: 'A storm of sharp petals.' },
  { id: 34, name: 'Entangle', type: 'Nature', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'Lowers foe\'s Speed.', effect: { type: 'stat', target: 'opponent', stat: 'spd', stages: -1, chance: 100 } },
  { id: 35, name: 'Spore', type: 'Nature', category: 'Status', power: 0, accuracy: 75, pp: 15, description: 'Scatters spores causing sleep.', effect: { type: 'status', target: 'opponent', status: 'sleep', chance: 100 } },
  { id: 130, name: 'Razor Leaf', type: 'Nature', category: 'Physical', power: 55, accuracy: 95, pp: 25, description: 'Slashes with razor-edged leaves.' },
  { id: 131, name: 'Giga Drain', type: 'Nature', category: 'Special', power: 60, accuracy: 100, pp: 10, description: 'Drains the foe\'s energy to recover HP.', effect: { type: 'heal', target: 'self', healPercent: 50 } },
  { id: 132, name: 'Toxic Spores', type: 'Nature', category: 'Status', power: 0, accuracy: 75, pp: 20, description: 'Releases toxic spores that poison the foe.', effect: { type: 'status', target: 'opponent', status: 'poison', chance: 100 } },
  { id: 133, name: 'Bloom', type: 'Nature', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Bursts into bloom, sharply boosting Sp.Atk.', effect: { type: 'stat', target: 'self', stat: 'spatk', stages: 2, chance: 100 } },
  { id: 134, name: 'Thorn Whip', type: 'Nature', category: 'Physical', power: 65, accuracy: 100, pp: 15, description: 'Lashes with a thorned vine.', effect: { type: 'stat', target: 'opponent', stat: 'atk', stages: -1, chance: 30 } },
  { id: 135, name: 'Nature\'s Wrath', type: 'Nature', category: 'Special', power: 30, accuracy: 85, pp: 10, description: 'Always deals exactly 30 damage.', fixedDamage: 30 },

  // Electric
  { id: 40, name: 'Shock', type: 'Electric', category: 'Special', power: 40, accuracy: 100, pp: 30, description: 'A small electric shock.' },
  { id: 41, name: 'Thunder Bolt', type: 'Electric', category: 'Special', power: 90, accuracy: 100, pp: 15, description: 'A crackling thunderbolt.', effect: { type: 'status', target: 'opponent', status: 'paralysis', chance: 10 } },
  { id: 42, name: 'Lightning Strike', type: 'Electric', category: 'Special', power: 110, accuracy: 70, pp: 10, description: 'A fierce lightning strike.' },
  { id: 43, name: 'Static Surge', type: 'Electric', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Boosts own Speed.', effect: { type: 'stat', target: 'self', stat: 'spd', stages: 1, chance: 100 } },
  { id: 44, name: 'Zap', type: 'Electric', category: 'Special', power: 50, accuracy: 100, pp: 20, description: 'A zapping shock.', effect: { type: 'status', target: 'opponent', status: 'paralysis', chance: 10 } },
  { id: 140, name: 'Thunder Wave', type: 'Electric', category: 'Status', power: 0, accuracy: 90, pp: 20, description: 'A weak jolt that paralyzes the foe.', effect: { type: 'status', target: 'opponent', status: 'paralysis', chance: 100 } },
  { id: 141, name: 'Spark', type: 'Electric', category: 'Physical', power: 55, accuracy: 100, pp: 20, description: 'Tackles the foe with an electric charge.', effect: { type: 'status', target: 'opponent', status: 'paralysis', chance: 20 } },
  { id: 142, name: 'Discharge', type: 'Electric', category: 'Special', power: 70, accuracy: 100, pp: 15, description: 'Releases a burst of electricity in all directions.', effect: { type: 'status', target: 'opponent', status: 'paralysis', chance: 30 } },
  { id: 143, name: 'Charge', type: 'Electric', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Builds up an electric charge, boosting Sp.Atk.', effect: { type: 'stat', target: 'self', stat: 'spatk', stages: 1, chance: 100 } },
  { id: 144, name: 'Volt Tackle', type: 'Electric', category: 'Physical', power: 90, accuracy: 90, pp: 10, description: 'A reckless, electricity-charged full-body slam.', effect: { type: 'recoil', target: 'self', recoilFlat: 15 } },
  { id: 145, name: 'Volt Cannon', type: 'Electric', category: 'Special', power: 25, accuracy: 90, pp: 10, description: 'Always deals exactly 25 damage.', fixedDamage: 25 },

  // Earth
  { id: 50, name: 'Pebble Toss', type: 'Earth', category: 'Physical', power: 40, accuracy: 100, pp: 25, description: 'Hurls small pebbles.' },
  { id: 51, name: 'Rock Slam', type: 'Earth', category: 'Physical', power: 65, accuracy: 90, pp: 20, description: 'Slams with a boulder.' },
  { id: 52, name: 'Boulder Crash', type: 'Earth', category: 'Physical', power: 100, accuracy: 75, pp: 10, description: 'Crashes a huge boulder.' },
  { id: 53, name: 'Seismic Force', type: 'Earth', category: 'Physical', power: 80, accuracy: 100, pp: 10, description: 'Shakes the earth.' },
  { id: 54, name: 'Harden', type: 'Earth', category: 'Status', power: 0, accuracy: 100, pp: 30, description: 'Raises own Defense.', effect: { type: 'stat', target: 'self', stat: 'def', stages: 1, chance: 100 } },
  { id: 150, name: 'Mud Slap', type: 'Earth', category: 'Physical', power: 40, accuracy: 100, pp: 25, description: 'Flings mud in the foe\'s eyes.', effect: { type: 'stat', target: 'opponent', stat: 'acc', stages: -1, chance: 100 } },
  { id: 151, name: 'Earthquake', type: 'Earth', category: 'Physical', power: 100, accuracy: 100, pp: 10, description: 'A devastating quake that shakes the whole battlefield.' },
  { id: 152, name: 'Stone Edge', type: 'Earth', category: 'Physical', power: 80, accuracy: 80, pp: 10, description: 'Sharp stones pierce the foe.' },
  { id: 153, name: 'Bulk Up', type: 'Earth', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Tenses its muscles, boosting Attack.', effect: { type: 'stat', target: 'self', stat: 'atk', stages: 1, chance: 100 } },
  { id: 154, name: 'Gravity Crush', type: 'Earth', category: 'Physical', power: 35, accuracy: 75, pp: 5, description: 'Always deals exactly 35 damage.', fixedDamage: 35 },
  { id: 155, name: 'Mud Bomb', type: 'Earth', category: 'Special', power: 65, accuracy: 85, pp: 15, description: 'Launches a glob of mud.', effect: { type: 'stat', target: 'opponent', stat: 'acc', stages: -1, chance: 30 } },

  // Wind
  { id: 60, name: 'Gust', type: 'Wind', category: 'Special', power: 40, accuracy: 100, pp: 35, description: 'A blast of wind.' },
  { id: 61, name: 'Air Slash', type: 'Wind', category: 'Special', power: 75, accuracy: 95, pp: 15, description: 'Cuts with a sharp air blade.' },
  { id: 62, name: 'Cyclone', type: 'Wind', category: 'Special', power: 110, accuracy: 70, pp: 10, description: 'A violent cyclone.' },
  { id: 63, name: 'Tailwind', type: 'Wind', category: 'Status', power: 0, accuracy: 100, pp: 15, description: 'Boosts own Speed greatly.', effect: { type: 'stat', target: 'self', stat: 'spd', stages: 2, chance: 100 } },
  { id: 160, name: 'Aerial Ace', type: 'Wind', category: 'Physical', power: 60, accuracy: 100, pp: 20, description: 'A quick, precise aerial strike.' },
  { id: 161, name: 'Hurricane', type: 'Wind', category: 'Special', power: 100, accuracy: 75, pp: 10, description: 'A ferocious storm-force hurricane.' },
  { id: 162, name: 'Feather Dance', type: 'Wind', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'A dance of feathers that harshly lowers Attack.', effect: { type: 'stat', target: 'opponent', stat: 'atk', stages: -2, chance: 100 } },
  { id: 163, name: 'Whirlwind Slash', type: 'Wind', category: 'Physical', power: 70, accuracy: 95, pp: 15, description: 'A spinning slash of compressed air.', effect: { type: 'stat', target: 'opponent', stat: 'def', stages: -1, chance: 30 } },
  { id: 164, name: 'Sky Fall', type: 'Wind', category: 'Physical', power: 25, accuracy: 85, pp: 10, description: 'Always deals exactly 25 damage.', fixedDamage: 25 },

  // Shadow
  { id: 70, name: 'Shadow Claw', type: 'Shadow', category: 'Physical', power: 70, accuracy: 100, pp: 15, description: 'Slashes with a shadowy claw.' },
  { id: 71, name: 'Darkness', type: 'Shadow', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Engulfs foe in darkness.' },
  { id: 72, name: 'Night Strike', type: 'Shadow', category: 'Physical', power: 100, accuracy: 90, pp: 10, description: 'Strikes from the shadows.' },
  { id: 73, name: 'Confuse Ray', type: 'Shadow', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Confuses the foe.', effect: { type: 'status', target: 'opponent', status: 'confusion', chance: 100 } },
  { id: 170, name: 'Shadow Sneak', type: 'Shadow', category: 'Physical', power: 45, accuracy: 100, pp: 20, description: 'Strikes from the target\'s own shadow, first.', effect: { type: 'priority', target: 'self', priority: 1 } },
  { id: 171, name: 'Dark Pulse', type: 'Shadow', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Releases a pulse of dark, unsettling energy.', effect: { type: 'status', target: 'opponent', status: 'confusion', chance: 20 } },
  { id: 172, name: 'Nightmare', type: 'Shadow', category: 'Status', power: 0, accuracy: 100, pp: 15, description: 'Haunts the foe with nightmares, harshly lowering Sp.Atk.', effect: { type: 'stat', target: 'opponent', stat: 'spatk', stages: -2, chance: 100 } },
  { id: 173, name: 'Shadow Ball', type: 'Shadow', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Hurls a ball of dark, spectral energy.', effect: { type: 'stat', target: 'opponent', stat: 'spdef', stages: -1, chance: 20 } },
  { id: 174, name: 'Doom Strike', type: 'Shadow', category: 'Physical', power: 30, accuracy: 80, pp: 5, description: 'Always deals exactly 30 damage.', fixedDamage: 30 },

  // Light
  { id: 80, name: 'Flash', type: 'Light', category: 'Special', power: 40, accuracy: 100, pp: 30, description: 'A blinding flash of light.', effect: { type: 'stat', target: 'opponent', stat: 'acc', stages: -1, chance: 100 } },
  { id: 81, name: 'Radiance', type: 'Light', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'A burst of radiant energy.' },
  { id: 82, name: 'Sunburst', type: 'Light', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'An intense solar burst.' },
  { id: 83, name: 'Heal Pulse', type: 'Light', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'Restores half the user\'s HP.', effect: { type: 'heal', target: 'self', healPercent: 50 } },
  { id: 180, name: 'Moonblast', type: 'Light', category: 'Special', power: 95, accuracy: 100, pp: 15, description: 'Channels lunar energy into a powerful blast.', effect: { type: 'stat', target: 'opponent', stat: 'spatk', stages: -1, chance: 30 } },
  { id: 181, name: 'Dazzling Gleam', type: 'Light', category: 'Special', power: 80, accuracy: 100, pp: 10, description: 'A wide, dazzling flash of light.' },
  { id: 182, name: 'Guard Up', type: 'Light', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Raises a radiant barrier, boosting Sp.Def.', effect: { type: 'stat', target: 'self', stat: 'spdef', stages: 1, chance: 100 } },
  { id: 183, name: 'Purify', type: 'Light', category: 'Status', power: 0, accuracy: 100, pp: 10, description: 'A gentle light that mends the user\'s wounds.', effect: { type: 'heal', target: 'self', healPercent: 30 } },
  { id: 184, name: 'Prism Beam', type: 'Light', category: 'Special', power: 30, accuracy: 85, pp: 10, description: 'Always deals exactly 30 damage.', fixedDamage: 30 },

  // Ice (new type)
  { id: 190, name: 'Ice Shard', type: 'Ice', category: 'Physical', power: 40, accuracy: 100, pp: 30, description: 'Launches a shard of ice at high speed.', effect: { type: 'priority', target: 'self', priority: 1 } },
  { id: 191, name: 'Ice Beam', type: 'Ice', category: 'Special', power: 85, accuracy: 100, pp: 15, description: 'A freezing beam of concentrated cold.', effect: { type: 'status', target: 'opponent', status: 'freeze', chance: 10 } },
  { id: 192, name: 'Blizzard', type: 'Ice', category: 'Special', power: 100, accuracy: 80, pp: 10, description: 'A howling, freezing blizzard.', effect: { type: 'status', target: 'opponent', status: 'freeze', chance: 20 } },
  { id: 193, name: 'Frost Fang', type: 'Ice', category: 'Physical', power: 60, accuracy: 95, pp: 20, description: 'Bites with frost-covered fangs.', effect: { type: 'status', target: 'opponent', status: 'freeze', chance: 10 } },
  { id: 194, name: 'Icy Wind', type: 'Ice', category: 'Special', power: 55, accuracy: 95, pp: 15, description: 'A chilling wind that slows the foe.', effect: { type: 'stat', target: 'opponent', stat: 'spd', stages: -1, chance: 100 } },
  { id: 195, name: 'Mist Veil', type: 'Ice', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Wraps the user in icy mist, boosting Sp.Def.', effect: { type: 'stat', target: 'self', stat: 'spdef', stages: 1, chance: 100 } },
  { id: 196, name: 'Glacial Spike', type: 'Ice', category: 'Physical', power: 30, accuracy: 85, pp: 10, description: 'Always deals exactly 30 damage.', fixedDamage: 30 },
  { id: 197, name: 'Freeze-Dry', type: 'Ice', category: 'Special', power: 70, accuracy: 100, pp: 15, description: 'Rapidly chills the foe to the core.' },

  // Dragon (new type)
  { id: 200, name: 'Dragon Rage', type: 'Dragon', category: 'Special', power: 40, accuracy: 100, pp: 10, description: 'Always deals exactly 40 damage, a classic draconic technique.', fixedDamage: 40 },
  { id: 201, name: 'Dragon Breath', type: 'Dragon', category: 'Special', power: 70, accuracy: 100, pp: 15, description: 'A blast of draconic energy that may paralyze.', effect: { type: 'status', target: 'opponent', status: 'paralysis', chance: 30 } },
  { id: 202, name: 'Dragon Claw', type: 'Dragon', category: 'Physical', power: 80, accuracy: 100, pp: 15, description: 'Rends the foe with huge, sharp claws.' },
  { id: 203, name: 'Dragon Pulse', type: 'Dragon', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'Releases a shockwave of draconic energy.' },
  { id: 204, name: 'Twister', type: 'Dragon', category: 'Special', power: 55, accuracy: 100, pp: 20, description: 'Whips up a vicious tornado.', effect: { type: 'stat', target: 'opponent', stat: 'spd', stages: -1, chance: 20 } },
  { id: 205, name: 'Dragon Dance', type: 'Dragon', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'A mystical dance that boosts Attack.', effect: { type: 'stat', target: 'self', stat: 'atk', stages: 1, chance: 100 } },
  { id: 206, name: 'Outrage', type: 'Dragon', category: 'Physical', power: 110, accuracy: 90, pp: 10, description: 'A powerful, reckless draconic rampage.' },
  { id: 207, name: 'Draco Meteor', type: 'Dragon', category: 'Special', power: 130, accuracy: 75, pp: 5, description: 'Summons meteors for massive damage, but harshly lowers the user\'s Sp.Atk.', effect: { type: 'stat', target: 'self', stat: 'spatk', stages: -2, chance: 100 } },

  // Fighting (new type)
  { id: 210, name: 'Karate Chop', type: 'Fighting', category: 'Physical', power: 40, accuracy: 100, pp: 30, description: 'A basic chopping strike.' },
  { id: 211, name: 'Mach Punch', type: 'Fighting', category: 'Physical', power: 40, accuracy: 100, pp: 20, description: 'A punch thrown at blinding speed.', effect: { type: 'priority', target: 'self', priority: 1 } },
  { id: 212, name: 'Focus Blast', type: 'Fighting', category: 'Special', power: 100, accuracy: 75, pp: 10, description: 'A concentrated blast of fighting spirit.' },
  { id: 213, name: 'Brick Break', type: 'Fighting', category: 'Physical', power: 75, accuracy: 100, pp: 15, description: 'A sharp, disciplined strike.' },
  { id: 214, name: 'Bulk Up', type: 'Fighting', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Tenses its muscles, boosting Attack.', effect: { type: 'stat', target: 'self', stat: 'atk', stages: 1, chance: 100 } },
  { id: 215, name: 'Low Sweep', type: 'Fighting', category: 'Physical', power: 55, accuracy: 95, pp: 20, description: 'A low kick that may slow the foe.', effect: { type: 'stat', target: 'opponent', stat: 'spd', stages: -1, chance: 60 } },
  { id: 216, name: 'Counter Slam', type: 'Fighting', category: 'Physical', power: 45, accuracy: 90, pp: 10, description: 'Always deals exactly 45 damage.', fixedDamage: 45 },
  { id: 217, name: 'Close Combat', type: 'Fighting', category: 'Physical', power: 120, accuracy: 100, pp: 5, description: 'An all-out flurry that lowers the user\'s Defense.', effect: { type: 'stat', target: 'self', stat: 'def', stages: -1, chance: 100 } },

  // Fairy (new type)
  { id: 220, name: 'Fairy Wind', type: 'Fairy', category: 'Special', power: 40, accuracy: 100, pp: 30, description: 'A gentle gust of sparkling wind.' },
  { id: 221, name: 'Sweet Kiss', type: 'Fairy', category: 'Status', power: 0, accuracy: 90, pp: 15, description: 'A dazzling kiss that leaves the foe confused.', effect: { type: 'status', target: 'opponent', status: 'confusion', chance: 100 } },
  { id: 222, name: 'Moonblast', type: 'Fairy', category: 'Special', power: 90, accuracy: 100, pp: 10, description: 'A beam of moonlight energy.', effect: { type: 'stat', target: 'opponent', stat: 'spatk', stages: -1, chance: 30 } },
  { id: 223, name: 'Dazzling Gleam', type: 'Fairy', category: 'Special', power: 80, accuracy: 100, pp: 15, description: 'Releases a blinding, radiant flash.' },
  { id: 224, name: 'Charm Aura', type: 'Fairy', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'An overwhelming charm that harshly lowers the foe\'s Attack.', effect: { type: 'stat', target: 'opponent', stat: 'atk', stages: -2, chance: 100 } },
  { id: 225, name: 'Fairy Veil', type: 'Fairy', category: 'Status', power: 0, accuracy: 100, pp: 20, description: 'Wraps the user in a protective shimmer, raising Sp.Def.', effect: { type: 'stat', target: 'self', stat: 'spdef', stages: 1, chance: 100 } },
  { id: 226, name: 'Starlight Burst', type: 'Fairy', category: 'Special', power: 35, accuracy: 90, pp: 10, description: 'Always deals exactly 35 damage.', fixedDamage: 35 },
  { id: 227, name: 'Fey Radiance', type: 'Fairy', category: 'Special', power: 110, accuracy: 85, pp: 5, description: 'An overwhelming surge of fey magic that lowers the user\'s Sp.Atk.', effect: { type: 'stat', target: 'self', stat: 'spatk', stages: -1, chance: 100 } },

  // Starter signature moves — each learned only by the base starter at level 1;
  // their evolutions inherit them automatically via getFullLearnset().
  { id: 300, name: 'Ember Core', type: 'Fire', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Embrix\'s signature move: a concentrated core of pure flame.', effect: { type: 'status', target: 'opponent', status: 'burn', chance: 20 } },
  { id: 301, name: 'Tidal Heart', type: 'Water', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Aquril\'s signature move: a surge of pure aquatic force.', effect: { type: 'stat', target: 'opponent', stat: 'spdef', stages: -1, chance: 20 } },
  { id: 302, name: 'Verdant Pulse', type: 'Nature', category: 'Special', power: 75, accuracy: 100, pp: 10, description: 'Leafling\'s signature move: a pulse of primal life energy.', effect: { type: 'stat', target: 'self', stat: 'spatk', stages: 1, chance: 100 } },
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