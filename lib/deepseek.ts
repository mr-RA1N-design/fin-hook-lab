import { GenerateRequest, HookItem } from '@/types'
import { buildSystemPrompt, buildUserPrompt } from './prompt'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions'

export async function generateHooks(
  req: GenerateRequest,
  apiKey: string
): Promise<HookItem[]> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.9,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt() },
        { role: 'user', content: buildUserPrompt(req) },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('Empty response from DeepSeek')

  const parsed = JSON.parse(content) as { hooks?: HookItem[] }
  if (!Array.isArray(parsed.hooks)) {
    throw new Error('missing hooks array')
  }

  return parsed.hooks
}
