import { generateHooks } from '@/lib/deepseek'

const mockHooks = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  style: `Style ${i + 1}`,
  hook: `Hook text ${i + 1}`,
  score: 8.0,
  reason: `Reason ${i + 1}`,
}))

const mockReq = {
  topic: '美联储加息',
  platform: '小红书' as const,
  contentType: '图文' as const,
  language: 'zh' as const,
}

describe('generateHooks', () => {
  afterEach(() => jest.restoreAllMocks())

  it('returns 10 HookItems on success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ hooks: mockHooks }) } }],
      }),
    }) as jest.Mock

    const result = await generateHooks(mockReq, 'test-key')
    expect(result).toHaveLength(10)
    expect(result[0].id).toBe(1)
    expect(result[0].hook).toBe('Hook text 1')
  })

  it('throws when API response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    }) as jest.Mock

    await expect(generateHooks(mockReq, 'test-key')).rejects.toThrow(
      'DeepSeek API error: 429'
    )
  })

  it('throws when response has no choices', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [] }),
    }) as jest.Mock

    await expect(generateHooks(mockReq, 'test-key')).rejects.toThrow('Empty response')
  })

  it('throws when JSON has no hooks array', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({ data: [] }) } }],
      }),
    }) as jest.Mock

    await expect(generateHooks(mockReq, 'test-key')).rejects.toThrow(
      'missing hooks array'
    )
  })
})
