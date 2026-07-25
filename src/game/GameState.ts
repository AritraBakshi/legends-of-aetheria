import type { ActiveCreature, InventoryItem } from './data/types';
import { loadGame, saveGame, type SaveData } from './systems/SaveSystem';

class GameState {
  playerName = 'Aether';
  mapId = 'oakwind';
  playerX = 15;
  playerY = 10;
  /** Where the player last visited a healing Nurse — defaults to Oakwind's
   * Pokémon Center spot so a fresh save behaves exactly as before until
   * the player actually heals somewhere. */
  lastHealMapId = 'oakwind';
  lastHealX = 15;
  lastHealY = 10;
  party: ActiveCreature[] = [];
  storage: ActiveCreature[] = [];
  inventory: InventoryItem[] = [
    { id: 1, quantity: 5 },  // 5 Capture Orbs
    { id: 10, quantity: 3 }, // 3 Small Herbs
  ];
  money = 200;
  flags: Record<string, boolean> = {};
  counters: Record<string, number> = {};
  seenCreatures: Set<number> = new Set();
  caughtCreatures: Set<number> = new Set();
  playTime = 0;
  startTime = Date.now();

  // Runtime state (not saved)
  timeOfDay = 0;
  weather: 'clear' | 'rain' | 'storm' | 'snow' = 'clear';
  steps = 0;
  encounterSteps = 0;
  nextEncounterAt = Math.floor(Math.random() * 5) + 5;
  repelSteps = 0;

  load(): boolean {
    const data = loadGame();
    if (!data) return false;
    this.playerName = data.playerName;
    this.mapId = data.mapId;
    this.playerX = data.playerX;
    this.playerY = data.playerY;
    this.lastHealMapId = data.lastHealMapId ?? 'oakwind';
    this.lastHealX = data.lastHealX ?? 15;
    this.lastHealY = data.lastHealY ?? 10;
    this.party = data.party;
    this.storage = data.storage;
    this.inventory = data.inventory;
    this.money = data.money;
    this.flags = data.flags;
    this.counters = data.counters ?? {};
    this.seenCreatures = new Set(data.seenCreatures);
    this.caughtCreatures = new Set(data.caughtCreatures);
    this.playTime = data.playTime;
    return true;
  }

  save(): void {
    const data: SaveData = {
      playerName: this.playerName,
      mapId: this.mapId,
      playerX: this.playerX,
      playerY: this.playerY,
      lastHealMapId: this.lastHealMapId,
      lastHealX: this.lastHealX,
      lastHealY: this.lastHealY,
      party: this.party,
      storage: this.storage,
      inventory: this.inventory,
      money: this.money,
      flags: this.flags,
      counters: this.counters,
      seenCreatures: Array.from(this.seenCreatures),
      caughtCreatures: Array.from(this.caughtCreatures),
      playTime: this.playTime + (Date.now() - this.startTime) / 1000,
      savedAt: Date.now(),
    };
    saveGame(data);
  }

  addToParty(creature: ActiveCreature): boolean {
    if (this.party.length < 6) { this.party.push(creature); return true; }
    this.storage.push(creature);
    return false;
  }

  getItem(id: number): InventoryItem | undefined {
    return this.inventory.find(i => i.id === id);
  }

  addItem(id: number, qty = 1): void {
    const existing = this.inventory.find(i => i.id === id);
    if (existing) existing.quantity += qty;
    else this.inventory.push({ id, quantity: qty });
  }

  useItem(id: number): boolean {
    const item = this.inventory.find(i => i.id === id);
    if (!item || item.quantity <= 0) return false;
    item.quantity--;
    if (item.quantity === 0) this.inventory = this.inventory.filter(i => i.id !== id);
    return true;
  }

  setFlag(flag: string, value = true): void { this.flags[flag] = value; }
  getFlag(flag: string): boolean { return !!this.flags[flag]; }

  getCounter(key: string): number { return this.counters[key] ?? 0; }
  incrementCounter(key: string, by = 1): void {
    this.counters[key] = (this.counters[key] ?? 0) + by;
  }

  updateTime(): void {
    const minutes = (Date.now() - this.startTime) / 60000;
    this.timeOfDay = (minutes % 24) / 24;
  }

  getTimeAlpha(): number {
    const t = this.timeOfDay;
    if (t < 0.2) return 0.3 - t * 1.5;
    if (t < 0.3) return 0;
    if (t < 0.7) return 0;
    if (t < 0.8) return (t - 0.7) * 3;
    if (t < 0.9) return 0.3;
    return 0.3 - (t - 0.9) * 3;
  }
}

export const gameState = new GameState();