import { HOOK_STYLES } from '@/lib/hook-styles'

describe('HOOK_STYLES', () => {
  it('has exactly 10 styles', () => {
    expect(HOOK_STYLES).toHaveLength(10)
  })

  it('ids are 1 through 10 in order', () => {
    HOOK_STYLES.forEach((s, i) => {
      expect(s.id).toBe(i + 1)
    })
  })

  it('each style has required string fields', () => {
    HOOK_STYLES.forEach(s => {
      expect(typeof s.label).toBe('string')
      expect(s.label.length).toBeGreaterThan(0)
      expect(typeof s.tagColor).toBe('string')
      expect(s.tagColor.length).toBeGreaterThan(0)
    })
  })
})
