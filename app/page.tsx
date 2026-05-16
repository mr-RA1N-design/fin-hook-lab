'use client'
import { useState, useCallback } from 'react'
import { HookItem, HistoryEntry, GenerateRequest } from '@/types'
import { HookForm } from '@/components/HookForm'
import { HookGrid } from '@/components/HookGrid'
import { HistoryPanel } from '@/components/HistoryPanel'
import { ErrorBanner } from '@/components/ErrorBanner'
import { saveHistory } from '@/lib/storage'

export default function Home() {
  const [hooks,         setHooks]         = useState<HookItem[]>([])
  const [currentEntry,  setCurrentEntry]  = useState<HistoryEntry | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [historyOpen,   setHistoryOpen]   = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [formValues,    setFormValues]    = useState<Partial<GenerateRequest>>({})

  const handleGenerate = useCallback(async (req: GenerateRequest) => {
    setLoading(true)
    setError(null)
    setFormValues(req)

    try {
      const res  = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(req),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'MISSING_API_KEY') { setApiKeyMissing(true); return }
        if (data.error === 'PARSE_ERROR')     { setError('生成格式异常，请重试'); return }
        setError(data.message ?? '生成失败，请重试')
        return
      }

      const entry: HistoryEntry = {
        id:        crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        request:   req,
        hooks:     data.hooks,
      }
      setHooks(data.hooks)
      setCurrentEntry(entry)
      saveHistory(entry)
    } catch {
      setError('网络错误，请检查连接后重试')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRestore = useCallback((entry: HistoryEntry) => {
    setHooks(entry.hooks)
    setCurrentEntry(entry)
    setFormValues(entry.request)
    setError(null)
  }, [])

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      {/* Navbar */}
      <nav className="w-full bg-[#1a1a1a] px-6 py-3 flex items-center justify-between sticky top-0 z-30">
        <span className="text-[#d4a843] text-sm font-bold tracking-widest uppercase">FIN Hook Lab</span>
        <button
          onClick={() => setHistoryOpen(true)}
          className="text-xs text-[#9ca3af] hover:text-[#d4a843] transition-colors"
        >
          历史记录 ↗
        </button>
      </nav>

      {apiKeyMissing && (
        <ErrorBanner message="未配置 API Key，请在 .env.local 中添加 DEEPSEEK_API_KEY=sk-xxx 并重启服务" />
      )}

      <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <HookForm
          key={currentEntry?.id ?? 'new'}
          initialValues={formValues}
          onSubmit={handleGenerate}
          loading={loading}
          disabled={apiKeyMissing}
        />

        {error && (
          <p className="text-sm text-red-600 text-center py-2">{error}</p>
        )}

        {loading && (
          <p className="text-center text-sm text-[#9ca3af] py-8">
            正在生成 10 个爆款 Hook…
          </p>
        )}

        {!loading && hooks.length > 0 && (
          <HookGrid hooks={hooks} currentEntry={currentEntry} />
        )}
      </main>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onRestore={handleRestore}
      />
    </div>
  )
}
