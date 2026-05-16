import { NextRequest, NextResponse } from 'next/server'
import { generateHooks } from '@/lib/deepseek'
import { GenerateRequest } from '@/types'

export async function POST(request: NextRequest) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'MISSING_API_KEY' }, { status: 500 })
  }

  let body: GenerateRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_REQUEST' }, { status: 400 })
  }

  if (!body.topic?.trim()) {
    return NextResponse.json({ error: 'MISSING_TOPIC' }, { status: 400 })
  }

  try {
    const hooks = await generateHooks(body, apiKey)
    return NextResponse.json({ hooks })
  } catch (err) {
    if (err instanceof SyntaxError) {
      return NextResponse.json({ error: 'PARSE_ERROR' }, { status: 500 })
    }
    return NextResponse.json(
      {
        error: 'DEEPSEEK_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
