import { render, screen, fireEvent, act } from '@testing-library/react'
import { HookCard } from '@/components/HookCard'
import { HookItem } from '@/types'

const mockItem: HookItem = {
  id: 1,
  style: '悬念钩子',
  hook: '没人告诉你的是，这次加息背后有个更大的秘密…',
  score: 9.2,
  reason: '信息缺口激发好奇心，适合图文开篇。',
}

describe('HookCard', () => {
  it('renders style label', () => {
    render(<HookCard item={mockItem} index={0} isFavorited={false} onFavorite={jest.fn()} />)
    expect(screen.getByText('悬念钩子')).toBeInTheDocument()
  })

  it('renders hook text', () => {
    render(<HookCard item={mockItem} index={0} isFavorited={false} onFavorite={jest.fn()} />)
    expect(screen.getByText(/没人告诉你的是/)).toBeInTheDocument()
  })

  it('renders score', () => {
    render(<HookCard item={mockItem} index={0} isFavorited={false} onFavorite={jest.fn()} />)
    expect(screen.getByText('9.2')).toBeInTheDocument()
  })

  it('reason is hidden by default, shown after toggle click', () => {
    render(<HookCard item={mockItem} index={0} isFavorited={false} onFavorite={jest.fn()} />)
    expect(screen.queryByText(/信息缺口/)).not.toBeInTheDocument()
    fireEvent.click(screen.getByText(/查看推荐理由/))
    expect(screen.getByText(/信息缺口/)).toBeInTheDocument()
  })

  it('calls onFavorite when favorite button clicked', () => {
    const onFavorite = jest.fn()
    render(<HookCard item={mockItem} index={0} isFavorited={false} onFavorite={onFavorite} />)
    fireEvent.click(screen.getByText(/收藏/))
    expect(onFavorite).toHaveBeenCalledTimes(1)
  })

  it('shows 已收藏 when isFavorited is true', () => {
    render(<HookCard item={mockItem} index={0} isFavorited={true} onFavorite={jest.fn()} />)
    expect(screen.getByText('★ 已收藏')).toBeInTheDocument()
  })
})
