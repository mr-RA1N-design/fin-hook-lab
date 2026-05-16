import { HistoryEntry } from '@/types'

const HISTORY_KEY = 'fin-history'
const FAVORITES_KEY = 'fin-favorites'
const MAX_HISTORY = 20
const MAX_FAVORITES = 100

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
