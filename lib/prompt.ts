import { GenerateRequest } from '@/types'
import { HOOK_STYLES } from './hook-styles'

const PLATFORM_TONES: Record<string, string> = {
  '小红书':    '亲切、生活化、有情绪感，语气像朋友分享',
  '抖音':      '短促有力、前3秒必须抓人，节奏感强',
  'B站':       '可以稍长、有内容深度感，带一点geek气质，欢迎讲逻辑',
  'Instagram': '国际化、简洁、数据感强，专业但不冷漠',
}

export function buildSystemPrompt(): string {
  return `你是一位专业的财经内容创作顾问，擅长为各大社交平台写爆款开头文案（Hook）。

你的任务是按照10种指定风格各写一个财经内容开头hook，以合法JSON对象返回，格式如下：
{"hooks": [{"id":1,"style":"悬念钩子","hook":"...","score":9.2,"reason":"..."}, ...]}

要求：
- 严格按照10种风格顺序输出，id从1到10
- 每个hook正文30-80字（English时20-60 words）
- score为该hook在目标平台的点击欲评分，范围1.0-10.0，保留一位小数
- reason为1-2句推荐理由，说明该风格在此场景有效的原因
- 只返回JSON，不要任何额外说明文字`
}

export function buildUserPrompt(req: GenerateRequest): string {
  const styleList = HOOK_STYLES.map((s, i) => `${i + 1}. ${s.label}`).join(' ')
  const langNote = req.language === 'en'
    ? '输出语言：English（所有hook和reason用英文）'
    : '输出语言：中文'
  const platformTone = PLATFORM_TONES[req.platform] ?? ''

  return `财经主题：${req.topic}
目标平台：${req.platform}（调性参考：${platformTone}）
内容类型：${req.contentType}
${langNote}

请按以下10种风格顺序各写一个hook：
${styleList}`
}
