'use client'
import { useState, useCallback } from 'react'
import { HookItem } from '@/types'
import { HOOK_STYLES } from '@/lib/hook-styles'

interface HookCardProps {
  item: HookItem
  index: number
  isFavorited: boolean
  onFavorite: () => void
}

export function HookCard({ item, index, isFavorited, onFavorite }: HookCardProps) {
  const [reasonOpen, setReasonOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const style = HOOK_STYLES.find(s => s.id === item.id)
  const scorePercent = (item.score / 10) * 100

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(item.hook)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [item.hook])

  return (
    <div
      className="bg-white border border-[#e8e4de] rounded-xl p-4 flex flex-col gap-3 opacity-0 animate-fadein"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
    >
      {/* Header: style tag + score bar */}
      <div className="flex items-center justify-between gap-2">
        <span className={`text-xs px-2 py-0.5 rounded font-medium ${style?.tagColor ?? 'bg-gray-100 text-gray-700'}`}>
          {item.style}
        </span>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-[#f0ede8] rounded-full overflow-hidden">
            <div className="h-full bg-[#d4a843] rounded-full" style={{ width: `${scorePercent}%` }} />
          </div>
          <span className="text-xs font-bold text-[#d4a843]">{item.score.toFixed(1)}</span>
        </div>
      </div>

      {/* Hook text */}
      <p className="text-sm text-[#1a1a1a] leading-relaxed flex-1">{item.hook}</p>

      {/* Reason toggle */}
      <button
        className="w-full text-left border-t border-[#e8e4de] pt-2 text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors"
        onClick={() => setReasonOpen(o => !o)}
      >
        {reasonOpen ? '▲ 收起理由' : '▼ 查看推荐理由'}
      </button>
      {reasonOpen && (
        <p className="text-xs text-[#6b7280] leading-relaxed -mt-1">{item.reason}</p>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-1 border-t border-[#e8e4de]">
        <button
          onClick={handleCopy}
          className="text-xs px-3 py-1.5 border border-[#e8e4de] rounded-lg text-[#6b7280] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
        >
          {copied ? '✓ 已复制' : '📋 复制'}
        </button>
        <button
          onClick={onFavorite}
          className={`text-xs px-3 py-1.5 border rounded-lg transition-colors ${
            isFavorited
              ? 'border-[#d4a843] text-[#d4a843]'
              : 'border-[#e8e4de] text-[#9ca3af] hover:border-[#d4a843] hover:text-[#d4a843]'
          }`}
        >
          {isFavorited ? '★ 已收藏' : '☆ 收藏'}
        </button>
      </div>
    </div>
  )
}
