'use client'
import { useState, useEffect } from 'react'
import { HistoryEntry, FavoriteHookEntry } from '@/types'
import { getHistory, getHookFavorites } from '@/lib/storage'

interface HistoryPanelProps {
  open: boolean
  onClose: () => void
  onRestore: (entry: HistoryEntry) => void
}

export function HistoryPanel({ open, onClose, onRestore }: HistoryPanelProps) {
  const [tab,           setTab]           = useState<'history' | 'favorites'>('history')
  const [history,       setHistory]       = useState<HistoryEntry[]>([])
  const [hookFavorites, setHookFavorites] = useState<FavoriteHookEntry[]>([])

  useEffect(() => {
    if (open) {
      setHistory(getHistory())
      setHookFavorites(getHookFavorites())
    }
  }, [open])

  const fmt = (iso: string) => {
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />}

      <div className={`fixed top-0 right-0 h-full w-80 bg-white border-l border-[#e8e4de] z-50 flex flex-col transform transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e4de]">
          <h2 className="text-sm font-semibold text-[#1a1a1a]">记录</h2>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#1a1a1a] text-lg leading-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#e8e4de]">
          {(['history', 'favorites'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                tab === t ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a]' : 'text-[#9ca3af] hover:text-[#6b7280]'
              }`}
            >
              {t === 'history' ? '历史' : '收藏'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {tab === 'history' ? (
            history.length === 0 ? (
              <p className="text-center text-xs text-[#9ca3af] mt-12">暂无历史记录</p>
            ) : (
              history.map(entry => (
                <button
                  key={entry.id}
                  onClick={() => { onRestore(entry); onClose() }}
                  className="w-full text-left px-5 py-3.5 border-b border-[#f0ede8] hover:bg-[#f8f7f4] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-[#1a1a1a] truncate max-w-[180px]">{entry.request.topic}</span>
                    <span className="text-xs text-[#9ca3af] flex-none ml-2">{fmt(entry.createdAt)}</span>
                  </div>
                  <div className="flex gap-1.5 mb-1.5">
                    <span className="text-xs bg-[#f0ede8] text-[#6b7280] px-2 py-0.5 rounded">{entry.request.platform}</span>
                    <span className="text-xs bg-[#f0ede8] text-[#6b7280] px-2 py-0.5 rounded">{entry.request.contentType}</span>
                  </div>
                  {entry.hooks.slice(0, 3).map(h => (
                    <p key={h.id} className="text-xs text-[#9ca3af] truncate">{h.style}：{h.hook.slice(0, 28)}…</p>
                  ))}
                </button>
              ))
            )
          ) : (
            hookFavorites.length === 0 ? (
              <p className="text-center text-xs text-[#9ca3af] mt-12">暂无收藏记录</p>
            ) : (
              hookFavorites.map(fav => (
                <div key={fav.id} className="px-5 py-3.5 border-b border-[#f0ede8]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-800`}>
                      {fav.hook.style}
                    </span>
                    <span className="text-xs text-[#d4a843] font-bold">{fav.hook.score.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-[#1a1a1a] leading-relaxed mb-2">{fav.hook.hook}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="text-xs bg-[#f0ede8] text-[#6b7280] px-2 py-0.5 rounded">{fav.request.platform}</span>
                      <span className="text-xs text-[#9ca3af]">{fav.request.topic.slice(0, 12)}{fav.request.topic.length > 12 ? '…' : ''}</span>
                    </div>
                    <span className="text-xs text-[#9ca3af]">{fmt(fav.savedAt)}</span>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </div>
    </>
  )
}
