import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt'

describe('buildSystemPrompt', () => {
  it('contains JSON hooks format instruction', () => {
    expect(buildSystemPrompt()).toContain('"hooks"')
  })

  it('instructs returning only JSON', () => {
    expect(buildSystemPrompt()).toContain('只返回JSON')
  })
})

describe('buildUserPrompt', () => {
  it('includes topic', () => {
    const result = buildUserPrompt({ topic: '黄金涨价', platform: '小红书', contentType: '图文', language: 'zh' })
    expect(result).toContain('黄金涨价')
  })

  it('includes platform', () => {
    const result = buildUserPrompt({ topic: 'test', platform: '抖音', contentType: '视频', language: 'zh' })
    expect(result).toContain('抖音')
  })

  it('adds English instruction when language is en', () => {
    const result = buildUserPrompt({ topic: 'Gold', platform: 'Instagram', contentType: '视频', language: 'en' })
    expect(result).toContain('English')
  })

  it('does not add English instruction for zh', () => {
    const result = buildUserPrompt({ topic: '黄金', platform: '小红书', contentType: '图文', language: 'zh' })
    expect(result).not.toContain('English')
  })

  it('lists all 10 style labels', () => {
    const result = buildUserPrompt({ topic: 'test', platform: 'B站', contentType: '教程', language: 'zh' })
    expect(result).toContain('悬念钩子')
    expect(result).toContain('数据冲击')
    expect(result).toContain('权威背书')
  })
})
