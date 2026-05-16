'use client'

interface ErrorBannerProps {
  message: string
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="w-full bg-red-50 border-b border-red-200 px-4 py-3">
      <p className="text-sm text-red-700 text-center max-w-2xl mx-auto">{message}</p>
    </div>
  )
}
