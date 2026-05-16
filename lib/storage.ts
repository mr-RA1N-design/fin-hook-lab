import { HistoryEntry, HookItem, FavoriteHookEntry } from '@/types'

const HISTORY_KEY = 'fin-history'
const FAVORITES_KEY = 'fin-favorites'
const HOOK_FAVORITES_KEY = 'fin-hook-favorites'
const MAX_HISTORY = 20
const MAX_FAVORITES = 100
const MAX_HOOK_FAVORITES = 200

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export function saveHistory(entry: HistoryEntry): void {
  const existing = getHistory()
  const updated = [entry, ...existing].slice(0, MAX_HISTORY)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
}

export function getFavorites(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export function toggleFavorite(entry: HistoryEntry): boolean {
  const favorites = getFavorites()
  const idx = favorites.findIndex(f => f.id === entry.id)
  if (idx >= 0) {
    favorites.splice(idx, 1)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    return false
  }
  const updated = [entry, ...favorites].slice(0, MAX_FAVORITES)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
  return true
}

export function isFavorited(id: string): boolean {
  return getFavorites().some(f => f.id === id)
}

export function getHookFavorites(): FavoriteHookEntry[] {
  try {
    const raw = localStorage.getItem(HOOK_FAVORITES_KEY)
    return raw ? (JSON.parse(raw) as FavoriteHookEntry[]) : []
  } catch {
    return []
  }
}

export function toggleHookFavorite(hook: HookItem, entry: HistoryEntry): boolean {
  const favorites = getHookFavorites()
  const id = `${entry.id}-${hook.id}`
  const idx = favorites.findIndex(f => f.id === id)
  if (idx >= 0) {
    favorites.splice(idx, 1)
    localStorage.setItem(HOOK_FAVORITES_KEY, JSON.stringify(favorites))
    return false
  }
  const newFav: FavoriteHookEntry = {
    id,
    hookId: hook.id,
    entryId: entry.id,
    hook,
    request: entry.request,
    savedAt: new Date().toISOString(),
  }
  const updated = [newFav, ...favorites].slice(0, MAX_HOOK_FAVORITES)
  localStorage.setItem(HOOK_FAVORITES_KEY, JSON.stringify(updated))
  return true
}

export function isHookFavorited(entryId: string, hookId: number): boolean {
  return getHookFavorites().some(f => f.entryId === entryId && f.hookId === hookId)
}
