# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm test         # Run all Jest tests
npx jest __tests__/path/to/file.test.ts  # Run single test file
```

## Architecture

Next.js 14 App Router app that generates 10 social-media hook headlines for a given finance topic via DeepSeek API.

**Data flow:** `app/page.tsx` (client) → POST `/api/generate` (route handler) → `lib/deepseek.ts` (DeepSeek `chat/completions`) → response returned to UI as `HookItem[]`. Results are saved to localStorage as `HistoryEntry` records.

**Key paths:**
- `app/page.tsx` — sole page; owns all state (hooks, loading, error, currentEntry) and passes callbacks down
- `app/api/generate/route.ts` — reads `process.env.DEEPSEEK_API_KEY`, validates request, calls `generateHooks()`, maps error codes (`MISSING_API_KEY`, `PARSE_ERROR`, `DEEPSEEK_ERROR`)
- `lib/deepseek.ts` — calls DeepSeek API with `deepseek-chat` model, temperature 0.9, `json_object` response format
- `lib/prompt.ts` — builds system prompt (10 style instructions) and user prompt with platform-specific tone (小红书/抖音/B站/Instagram)
- `lib/hook-styles.ts` — 10 fixed styles (悬念钩子, 数据冲击, etc.) each with a label, description, and Tailwind tag color
- `lib/storage.ts` — three localStorage keys: `fin-history` (max 20), `fin-favorites` (max 100), `fin-hook-favorites` (max 200). Per-hook favorites keyed by `${entryId}-${hookId}`
- `types/index.ts` — `HookItem`, `GenerateRequest`, `HistoryEntry`, `FavoriteHookEntry`

**Components:**
- `HookForm` — topic input + platform/type/language pill selectors; `initialValues` prop lets `page.tsx` pre-fill on history restore
- `HookGrid` — renders grid of `HookCard`, computes `favoritedIds` per `currentEntry` from localStorage
- `HookCard` — displays hook text, style tag, score bar, copy-to-clipboard, per-entry favorite toggle
- `HistoryPanel` — slide-out drawer with two tabs (历史/收藏); History tab lists full `HistoryEntry` records, Favorites tab lists individual `FavoriteHookEntry` records

**Styling:** Tailwind CSS with a custom `fadein` keyframe animation (opacity + translateY stagger). Design system colors: `#1a1a1a` (black), `#d4a843` (gold), `#f8f7f4` (bg), `#f0ede8` (chips), `#9ca3af` (muted text), `#e8e4de` (borders).

## Environment

`.env.local` must contain `DEEPSEEK_API_KEY=sk-xxx`. This is server-only — only `route.ts` reads `process.env`; the client never sees the key. Never commit `.env.local`.
