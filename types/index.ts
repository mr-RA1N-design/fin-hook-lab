export interface HookItem {
  id: number
  style: string
  hook: string
  score: number
  reason: string
}

export type Platform = '小红书' | '抖音' | 'B站' | 'Instagram'
export type ContentType = '视频' | '图文' | '产品广告' | '教程' | '观点帖'
export type Language = 'zh' | 'en'

export interface GenerateRequest {
  topic: string
  platform: Platform
  contentType: ContentType
  language: Language
}

export interface GenerateResponse {
  hooks: HookItem[]
}

export interface HistoryEntry {
  id: string
  createdAt: string
  request: GenerateRequest
  hooks: HookItem[]
}
