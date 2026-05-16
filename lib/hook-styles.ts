export interface HookStyle {
  id: number
  label: string
  description: string
  tagColor: string
}

export const HOOK_STYLES: HookStyle[] = [
  { id: 1,  label: '悬念钩子',   description: '制造信息缺口，让读者必须往下看',       tagColor: 'bg-amber-100 text-amber-800'   },
  { id: 2,  label: '数据冲击',   description: '用具体数字制造认知震撼',               tagColor: 'bg-red-100 text-red-800'       },
  { id: 3,  label: '反常识颠覆', description: '推翻大众认知，引发好奇',               tagColor: 'bg-purple-100 text-purple-800' },
  { id: 4,  label: '恐惧唤起',   description: '点出潜在风险，触发保护欲',             tagColor: 'bg-orange-100 text-orange-800' },
  { id: 5,  label: '利益诱惑',   description: '直接承诺收益或好处',                   tagColor: 'bg-green-100 text-green-800'   },
  { id: 6,  label: '故事开场',   description: '用具体场景代入，有画面感',             tagColor: 'bg-blue-100 text-blue-800'     },
  { id: 7,  label: '身份共鸣',   description: '精准喊话目标群体',                     tagColor: 'bg-indigo-100 text-indigo-800' },
  { id: 8,  label: '争议对立',   description: '制造观点冲突，激发讨论',               tagColor: 'bg-rose-100 text-rose-800'     },
  { id: 9,  label: '紧迫催促',   description: '制造时间压力或稀缺感',                 tagColor: 'bg-yellow-100 text-yellow-800' },
  { id: 10, label: '权威背书',   description: '借助数据来源或专家观点增信',           tagColor: 'bg-teal-100 text-teal-800'     },
]
