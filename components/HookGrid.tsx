'use client'
import { useState, useCallback } from 'react'
import { HookItem, HistoryEntry } from '@/types'
import { HookCard } from './HookCard'
import { isFavorited as checkFavorited, toggleFavorite } from '@/lib/storage'

interface HookGridProps {
  hooks: HookItem[]
  currentEntry: HistoryEntry | null
}

export function HookGrid({ hooks, currentEntry }: HookGridProps) {
  const [entryFavorited, setEntryFavorited] = useState(() => {
    if (typeof window === 'undefined' || !currentEntry) return false
    return checkFavorited(currentEntry.id)
  })

  const handleFavorite = useCallback(() => {
    if (!currentEntry) return
    const isNowFav = toggleFavorite(currentEntry)
    setEntryFavorited(isNowFav)
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
            isFavorited={entryFavorited}
            onFavorite={handleFavorite}
          />
        ))}
      </div>
    </section>
  )
}
