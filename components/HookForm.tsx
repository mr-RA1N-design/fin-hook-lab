'use client'
import { useState } from 'react'
import { Platform, ContentType, Language, GenerateRequest } from '@/types'

const PLATFORMS: Platform[] = ['小红书', '抖音', 'B站', 'Instagram']
const CONTENT_TYPES: ContentType[] = ['视频', '图文', '产品广告', '教程', '观点帖']

interface HookFormProps {
  initialValues?: Partial<GenerateRequest>
  onSubmit: (req: GenerateRequest) => void
  loading: boolean
  disabled?: boolean
}

export function HookForm({ initialValues, onSubmit, loading, disabled }: HookFormProps) {
  const [topic,       setTopic]       = useState(initialValues?.topic       ?? '')
  const [platform,    setPlatform]    = useState<Platform>(initialValues?.platform    ?? '小红书')
  const [contentType, setContentType] = useState<ContentType>(initialValues?.contentType ?? '图文')
  const [language,    setLanguage]    = useState<Language>(initialValues?.language    ?? 'zh')
  const [topicError,  setTopicError]  = useState('')

  const handleSubmit = () => {
    if (!topic.trim()) { setTopicError('请输入财经主题'); return }
    setTopicError('')
    onSubmit({ topic: topic.trim(), platform, contentType, language })
  }

  const pill = (active: boolean) =>
    `text-xs px-3 py-1.5 rounded-lg transition-colors font-medium ${
      active ? 'bg-[#1a1a1a] text-white' : 'bg-[#f0ede8] text-[#6b7280] hover:bg-[#e8e4de]'
    }`

  return (
    <div className="bg-white border border-[#e8e4de] rounded-2xl p-6 flex flex-col gap-5">
      {/* Topic */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#9ca3af] tracking-widest uppercase">Topic · 主题</label>
        <input
          className={`w-full bg-[#f8f7f4] border rounded-lg px-3 py-2.5 text-sm text-[#1a1a1a] placeholder:text-[#9ca3af] outline-none focus:border-[#1a1a1a] transition-colors ${
            topicError ? 'border-red-400' : 'border-[#e8e4de]'
          }`}
          placeholder="例：美联储加息对A股的影响"
          value={topic}
          onChange={e => { setTopic(e.target.value); setTopicError('') }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {topicError && <p className="text-xs text-red-500">{topicError}</p>}
      </div>

      {/* Platform */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#9ca3af] tracking-widest uppercase">Platform · 平台</label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(p => (
            <button key={p} onClick={() => setPlatform(p)} className={pill(platform === p)}>{p}</button>
          ))}
        </div>
      </div>

      {/* Content type */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-[#9ca3af] tracking-widest uppercase">Type · 内容类型</label>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map(t => (
            <button key={t} onClick={() => setContentType(t)} className={pill(contentType === t)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Language + Submit */}
      <div className="flex items-end justify-between gap-4 pt-1">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#9ca3af] tracking-widest uppercase">Language</label>
          <div className="flex gap-1.5">
            {(['zh', 'en'] as Language[]).map(lang => (
              <button key={lang} onClick={() => setLanguage(lang)} className={pill(language === lang)}>
                {lang === 'zh' ? '中文' : 'English'}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading || disabled}
          className="bg-[#1a1a1a] text-[#d4a843] text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '生成中…' : '生成 Hook →'}
        </button>
      </div>
    </div>
  )
}
