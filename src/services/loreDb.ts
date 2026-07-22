import { assetsData, type AssetItem } from '../data/assetsData';

export interface LoreEntry {
  id: string;
  title: string;
  category: string;
  description: string;
  lore: string;
  imagePath?: string;
  attributes?: Record<string, string | undefined>;
  planetOrigin?: string;
  dangerLevel?: string;
  clearanceLevel?: string;
  status?: string;
  isBookmarked?: boolean;
  author?: string;
  createdAt?: string;
}

export interface AgentLog {
  id: string;
  agentId: string;
  agentName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface BookmarkRecord {
  id: string;
  bookmarkedAt: string;
}

const DB_NAME = 'DIW_Alien_Lore_DB';
const DB_VERSION = 1;
const STORE_LORE = 'lore_entries';
const STORE_BOOKMARKS = 'bookmarks';
const STORE_LOGS = 'agent_logs';

const LOCAL_STORAGE_LORE_KEY = 'DIW_LORE_ENTRIES';
const LOCAL_STORAGE_BOOKMARKS_KEY = 'DIW_BOOKMARKS';
const LOCAL_STORAGE_LOGS_KEY = 'DIW_AGENT_LOGS';

let dbInstance: IDBDatabase | null = null;
let isFallbackMode = false;

/**
 * Converts AssetItem from assetsData.ts to LoreEntry interface
 */

function assetToLoreEntry(asset: AssetItem): LoreEntry {
  return {
    id: asset.id,
    title: asset.title,
    category: asset.category,
    description: asset.description,
    lore: asset.lore,
    imagePath: asset.imagePath,
    attributes: asset.attributes,
    planetOrigin: asset.attributes.planetOrigin || 'Unknown',
    dangerLevel: asset.attributes.dangerLevel || 'Low',
    clearanceLevel: asset.attributes.clearanceLevel || 'Standard',
    status: asset.attributes.status || 'Active',
    isBookmarked: false,
    author: 'Archive System',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Checks if IndexedDB is supported in current environment
 */
function isIndexedDbSupported(): boolean {
  try {
    return typeof window !== 'undefined' && 'indexedDB' in window && window.indexedDB !== null;
  } catch {
    return false;
  }
}

/**
 * Open or retrieve the IndexedDB instance
 */
function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) return Promise.resolve(dbInstance);

  return new Promise((resolve, reject) => {
    if (!isIndexedDbSupported()) {
      isFallbackMode = true;
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_LORE)) {
        db.createObjectStore(STORE_LORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_BOOKMARKS)) {
        db.createObjectStore(STORE_BOOKMARKS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_LOGS)) {
        db.createObjectStore(STORE_LOGS, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      console.warn('IndexedDB failed to open, switching to localStorage fallback:', (event.target as IDBOpenDBRequest).error);
      isFallbackMode = true;
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

// ----------------------------------------------------------------------
// LocalStorage Fallback Helpers
// ----------------------------------------------------------------------

function getLocalStorageLore(): LoreEntry[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_LORE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalStorageLore(entries: LoreEntry[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_LORE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to write lore to localStorage:', e);
  }
}

function getLocalStorageBookmarks(): string[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalStorageBookmarks(ids: string[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_BOOKMARKS_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error('Failed to write bookmarks to localStorage:', e);
  }
}

function getLocalStorageLogs(): AgentLog[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalStorageLogs(logs: AgentLog[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Failed to write agent logs to localStorage:', e);
  }
}

// ----------------------------------------------------------------------
// Database Core API
// ----------------------------------------------------------------------

/**
 * Initializes database and seeds initial entries from assetsData.ts if empty.
 */
export async function initDb(): Promise<void> {
  try {
    const db = await openDatabase();

    // Check count in IDB
    const count = await new Promise<number>((resolve, reject) => {
      const tx = db.transaction(STORE_LORE, 'readonly');
      const store = tx.objectStore(STORE_LORE);
      const req = store.count();
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });

    if (count === 0) {
      // Seed entries
      const initialEntries = assetsData.map(assetToLoreEntry);
      const tx = db.transaction(STORE_LORE, 'readwrite');
      const store = tx.objectStore(STORE_LORE);
      for (const entry of initialEntries) {
        store.put(entry);
      }
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      // Also update localStorage as secondary sync
      setLocalStorageLore(initialEntries);
    }
  } catch (error) {
    console.warn('Using LocalStorage Fallback mode for DIW_Alien_Lore_DB:', error);
    isFallbackMode = true;
    let localEntries = getLocalStorageLore();
    if (localEntries.length === 0) {
      localEntries = assetsData.map(assetToLoreEntry);
      setLocalStorageLore(localEntries);
    }
  }
}

/**
 * Retrieves all lore entries from database.
 */
export async function getAllEntries(): Promise<LoreEntry[]> {
  if (isFallbackMode) {
    return getLocalStorageLore();
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LORE, 'readonly');
      const store = tx.objectStore(STORE_LORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getLocalStorageLore();
  }
}

/**
 * Retrieves single entry by ID.
 */
export async function getEntryById(id: string): Promise<LoreEntry | undefined> {
  if (isFallbackMode) {
    return getLocalStorageLore().find((item) => item.id === id);
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LORE, 'readonly');
      const store = tx.objectStore(STORE_LORE);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getLocalStorageLore().find((item) => item.id === id);
  }
}

/**
 * Adds a new custom user/agent lore entry.
 */
export async function addEntry(
  entryData: Omit<LoreEntry, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
): Promise<LoreEntry> {
  const id = entryData.id || `custom_lore_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newEntry: LoreEntry = {
    ...entryData,
    id,
    createdAt: entryData.createdAt || new Date().toISOString(),
    isBookmarked: entryData.isBookmarked ?? false,
    author: entryData.author || 'Nexus Agent',
  };

  if (isFallbackMode) {
    const entries = getLocalStorageLore();
    entries.unshift(newEntry);
    setLocalStorageLore(entries);
    return newEntry;
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_LORE, 'readwrite');
      const store = tx.objectStore(STORE_LORE);
      const req = store.put(newEntry);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Mirror to localStorage
    const entries = getLocalStorageLore();
    const existingIndex = entries.findIndex((e) => e.id === id);
    if (existingIndex >= 0) {
      entries[existingIndex] = newEntry;
    } else {
      entries.unshift(newEntry);
    }
    setLocalStorageLore(entries);

    return newEntry;
  } catch {
    const entries = getLocalStorageLore();
    entries.unshift(newEntry);
    setLocalStorageLore(entries);
    return newEntry;
  }
}

/**
 * Toggles bookmark status for a lore entry.
 */
export async function toggleBookmark(id: string): Promise<boolean> {
  const entry = await getEntryById(id);
  if (!entry) return false;

  const newBookmarkState = !entry.isBookmarked;
  const updatedEntry: LoreEntry = { ...entry, isBookmarked: newBookmarkState };

  if (isFallbackMode) {
    const entries = getLocalStorageLore();
    const idx = entries.findIndex((e) => e.id === id);
    if (idx >= 0) {
      entries[idx].isBookmarked = newBookmarkState;
      setLocalStorageLore(entries);
    }
    const bookmarks = getLocalStorageBookmarks();
    if (newBookmarkState) {
      if (!bookmarks.includes(id)) bookmarks.push(id);
    } else {
      const bIdx = bookmarks.indexOf(id);
      if (bIdx >= 0) bookmarks.splice(bIdx, 1);
    }
    setLocalStorageBookmarks(bookmarks);
    return newBookmarkState;
  }

  try {
    const db = await openDatabase();
    const tx = db.transaction([STORE_LORE, STORE_BOOKMARKS], 'readwrite');
    const loreStore = tx.objectStore(STORE_LORE);
    const bookmarkStore = tx.objectStore(STORE_BOOKMARKS);

    loreStore.put(updatedEntry);

    if (newBookmarkState) {
      bookmarkStore.put({ id, bookmarkedAt: new Date().toISOString() });
    } else {
      bookmarkStore.delete(id);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Sync fallback
    const entries = getLocalStorageLore();
    const idx = entries.findIndex((e) => e.id === id);
    if (idx >= 0) {
      entries[idx].isBookmarked = newBookmarkState;
      setLocalStorageLore(entries);
    }

    return newBookmarkState;
  } catch {
    const entries = getLocalStorageLore();
    const idx = entries.findIndex((e) => e.id === id);
    if (idx >= 0) {
      entries[idx].isBookmarked = newBookmarkState;
      setLocalStorageLore(entries);
    }
    return newBookmarkState;
  }
}

/**
 * Retrieves all bookmarked entries.
 */
export async function getBookmarks(): Promise<LoreEntry[]> {
  const allEntries = await getAllEntries();
  return allEntries.filter((entry) => entry.isBookmarked);
}

/**
 * Performs search and category filtering on lore entries.
 */
export async function searchEntries(query: string, category?: string): Promise<LoreEntry[]> {
  const allEntries = await getAllEntries();
  const q = query.trim().toLowerCase();
  const cat = category ? category.trim().toLowerCase() : 'all';

  return allEntries.filter((entry) => {
    const matchesCategory = cat === 'all' || entry.category.toLowerCase() === cat;
    if (!matchesCategory) return false;

    if (!q) return true;

    const matchesTitle = entry.title.toLowerCase().includes(q);
    const matchesDesc = entry.description.toLowerCase().includes(q);
    const matchesLore = entry.lore.toLowerCase().includes(q);
    const matchesOrigin = entry.planetOrigin?.toLowerCase().includes(q);

    return matchesTitle || matchesDesc || matchesLore || matchesOrigin;
  });
}

/**
 * Adds an agent log to the database.
 */
export async function addAgentLog(
  log: Omit<AgentLog, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): Promise<AgentLog> {
  const newLog: AgentLog = {
    ...log,
    id: log.id || `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: log.timestamp || new Date().toISOString(),
  };

  if (isFallbackMode) {
    const logs = getLocalStorageLogs();
    logs.unshift(newLog);
    setLocalStorageLogs(logs);
    return newLog;
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_LOGS, 'readwrite');
      const store = tx.objectStore(STORE_LOGS);
      const req = store.put(newLog);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    const logs = getLocalStorageLogs();
    logs.unshift(newLog);
    setLocalStorageLogs(logs);
    return newLog;
  } catch {
    const logs = getLocalStorageLogs();
    logs.unshift(newLog);
    setLocalStorageLogs(logs);
    return newLog;
  }
}

/**
 * Retrieves all agent logs from database.
 */
export async function getAgentLogs(): Promise<AgentLog[]> {
  if (isFallbackMode) {
    return getLocalStorageLogs();
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LOGS, 'readonly');
      const store = tx.objectStore(STORE_LOGS);
      const req = store.getAll();
      req.onsuccess = () => {
        const result = (req.result || []).sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        resolve(result);
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return getLocalStorageLogs();
  }
}
