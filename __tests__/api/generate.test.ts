/**
 * @jest-environment node
 */
import { POST } from '@/app/api/generate/route'
import { NextRequest } from 'next/server'

const mockHooks = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  style: `S${i + 1}`,
  hook: `H${i + 1}`,
  score: 8.0,
  reason: `R${i + 1}`,
}))

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/generate', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

describe('POST /api/generate', () => {
  const saved = process.env.DEEPSEEK_API_KEY

  afterEach(() => {
    process.env.DEEPSEEK_API_KEY = saved
    jest.restoreAllMocks()
  })

  it('returns MISSING_API_KEY when env var not set', async () => {
    delete process.env.DEEPSEEK_API_KEY
    const res = await POST(
      makeRequest({ topic: 'test', platform: '小红书', contentType: '图文', language: 'zh' })
    )
    expect(res.status).toBe(500)
    expect((await res.json()).error).toBe('MISSING_API_KEY')
  })

  it('returns MISSING_TOPIC when topic is blank', async () => {
    process.env.DEEPSEEK_API_KEY = 'key'
    const res = await POST(
      makeRequest({ topic: '   ', platform: '小红书', contentType: '图文', language: 'zh' })
    )
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('MISSING_TOPIC')
  })

  it('returns hooks array on success', async () => {
    process.env.DEEPSEEK_API_KEY = 'key'
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ hooks: mockHooks }) } }],
      }),
    }) as jest.Mock

    const res = await POST(
      makeRequest({
        topic: '黄金涨价',
        platform: '抖音',
        contentType: '视频',
        language: 'zh',
      })
    )
    expect(res.status).toBe(200)
    expect((await res.json()).hooks).toHaveLength(10)
  })

  it('returns DEEPSEEK_ERROR when upstream fails', async () => {
    process.env.DEEPSEEK_API_KEY = 'key'
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Error',
    }) as jest.Mock

    const res = await POST(
      makeRequest({ topic: '黄金', platform: '小红书', contentType: '图文', language: 'zh' })
    )
    expect(res.status).toBe(500)
    expect((await res.json()).error).toBe('DEEPSEEK_ERROR')
  })
})
