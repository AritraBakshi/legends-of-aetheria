export interface NewsEntry {
  title: string;
  date: string; // display label, not necessarily a real calendar date
  bullets: string[];
}

/**
 * Player-facing changelog for the title screen's News panel. This is
 * intentionally written for players, not developers — it should always
 * read like "here's what's new to play with," never like a commit log
 * ("edited BattleScene.ts"). Newest entry first.
 */
export const NEWS: NewsEntry[] = [
  {
    title: 'Nine New Creatures, Two New Types, Coming Soon !!',
    date: 'Next Update',
    bullets: [
      'Chimlet, Glimmane, and Sparkub have joined the world, each with their own evolution line.',
      'Chimlet and Glimmane can evolve into one of two different forms depending on what move they know when they\'re ready — try teaching them something new before they level up.',
      'Two brand-new elements have entered the world: Fighting and Fairy, each with their own strengths and weaknesses.',
    ],
  },
  {
    title: 'Evolution, Your Way',
    date: 'Recent Update',
    bullets: [
      'Evolution now asks first — decline it if you\'d rather keep a creature\'s current form a little longer.',
      'A declined evolution isn\'t gone for good — it\'ll offer again the next time that creature levels up.',
    ],
  },
  {
    title: 'Smarter Battles',
    date: 'Recent Update',
    bullets: [
      'Battles now play out by speed — whichever creature is faster (after any boosts or drops) strikes first, not just you by default.',
      'Priority moves like Quick Attack still cut ahead of everything else, exactly as you\'d expect.',
    ],
  },
  {
    title: 'The Tides Rise: Waveshore',
    date: 'Major Update',
    bullets: [
      'A new path opens south of Earthenhold — a cave route, a flooded cavern, and beyond it, the coastal city of Waveshore.',
      'Waveshore has its own Lodge, its own Dungeon, and its own Dungeon Master.',
      'A new field ability, Surf, is earned by defeating the Earth Dungeon Master twice — it lets you cross open water anywhere in the world, not just in one spot.',
    ],
  },
  {
    title: 'Trainers in the Caves, Repels on the Shelves',
    date: 'Update',
    bullets: [
      'Cave Route and Water Cave now have their own trainers to challenge.',
      'Repel and Super Repel are now sold in shops, for keeping weaker wild creatures away while you travel.',
      'Wild encounters across the early routes have been rebalanced — no more finding almost everything on the very first route.',
    ],
  },
];