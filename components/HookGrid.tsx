'use client'
import { useState, useCallback } from 'react'
import { HookItem, HistoryEntry } from '@/types'
import { HookCard } from './HookCard'
import { getHookFavorites, toggleHookFavorite } from '@/lib/storage'

interface HookGridProps {
  hooks: HookItem[]
  currentEntry: HistoryEntry | null
}

export function HookGrid({ hooks, currentEntry }: HookGridProps) {
  const [favoritedIds, setFavoritedIds] = useState<Set<number>>(() => {
    if (typeof window === 'undefined' || !currentEntry) return new Set()
    const favs = getHookFavorites()
    return new Set(
      favs.filter(f => f.entryId === currentEntry.id).map(f => f.hookId)
    )
  })

  const handleFavorite = useCallback((item: HookItem) => {
    if (!currentEntry) return
    const isNowFav = toggleHookFavorite(item, currentEntry)
    setFavoritedIds(prev => {
      const next = new Set(prev)
      if (isNowFav) next.add(item.id)
      else next.delete(item.id)
      return next
    })
  }, [currentEntry])

  if (hooks.length === 0) return null

  return (
    <section>
      <p className="text-xs text-[#9ca3af] mb-3">生成结果 · {hooks.length} 个 Hook</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {hooks.map((item, i) => (
          <HookCard
            key={item.id}
            item={item}
            index={i}
            isFavorited={favoritedIds.has(item.id)}
            onFavorite={() => handleFavorite(item)}
          />
        ))}
      </div>
    </section>
  )
}
