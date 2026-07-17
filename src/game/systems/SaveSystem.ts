import type { ActiveCreature, InventoryItem } from '../data/types';

const SAVE_KEY = 'legends_of_aetheria_save';

export interface SaveData {
  playerName: string;
  mapId: string;
  playerX: number;
  playerY: number;
  /** Where the player last visited a healing Nurse — used to respawn them
   * there after losing a battle, instead of always Oakwind Village.
   * Optional so saves from before this feature still load fine. */
  lastHealMapId?: string;
  lastHealX?: number;
  lastHealY?: number;
  party: ActiveCreature[];
  storage: ActiveCreature[];
  inventory: InventoryItem[];
  money: number;
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  seenCreatures: number[];
  caughtCreatures: number[];
  playTime: number;
  savedAt: number;
}

export function saveGame(data: SaveData): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save:', e);
  }
}

export function loadGame(): SaveData | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

export function hasSaveData(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}

export function deleteSaveData(): void {
  localStorage.removeItem(SAVE_KEY);
}