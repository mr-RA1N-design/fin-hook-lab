import { getHistory, saveHistory, getFavorites, toggleFavorite, isFavorited } from '@/lib/storage'
import { HistoryEntry } from '@/types'

const makeEntry = (id: string): HistoryEntry => ({
  id,
  createdAt: new Date().toISOString(),
  request: { topic: 'test', platform: '小红书', contentType: '图文', language: 'zh' },
  hooks: [],
})

describe('storage', () => {
  beforeEach(() => localStorage.clear())

  it('getHistory returns empty array when nothing stored', () => {
    expect(getHistory()).toEqual([])
  })

  it('saveHistory prepends new entries', () => {
    saveHistory(makeEntry('a'))
    saveHistory(makeEntry('b'))
    const history = getHistory()
    expect(history[0].id).toBe('b')
    expect(history[1].id).toBe('a')
  })

  it('saveHistory limits to 20 entries', () => {
    for (let i = 0; i < 22; i++) saveHistory(makeEntry(`id-${i}`))
    expect(getHistory()).toHaveLength(20)
    expect(getHistory()[0].id).toBe('id-21')
  })

  it('getFavorites returns empty array initially', () => {
    expect(getFavorites()).toEqual([])
  })

  it('toggleFavorite adds entry and returns true', () => {
    const entry = makeEntry('x')
    expect(toggleFavorite(entry)).toBe(true)
    expect(getFavorites()).toHaveLength(1)
  })

  it('toggleFavorite removes entry and returns false when already favorited', () => {
    const entry = makeEntry('x')
    toggleFavorite(entry)
    expect(toggleFavorite(entry)).toBe(false)
    expect(getFavorites()).toHaveLength(0)
  })

  it('isFavorited returns true after adding', () => {
    toggleFavorite(makeEntry('y'))
    expect(isFavorited('y')).toBe(true)
  })

  it('isFavorited returns false after removing', () => {
    const entry = makeEntry('z')
    toggleFavorite(entry)
    toggleFavorite(entry)
    expect(isFavorited('z')).toBe(false)
  })
})
