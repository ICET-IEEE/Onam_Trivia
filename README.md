# Maveli's Trial — A Mythology CTF

A prototype landing experience for **Maveli's Trial**, an Onam / Mahabali &
Vamana-themed CTF and puzzle competition. This build establishes the visual
identity, navigation, and information architecture — the real CTF/flag logic
is intentionally not implemented yet.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- lucide-react icons
- pnpm

## Getting started

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

## Structure

```
app/
  page.tsx            Landing page
  signin/page.tsx      Sign in (prototype, no real auth)
  signup/page.tsx      Sign up (prototype, no real auth)
  dashboard/page.tsx   Placeholder player dashboard
  leaderboard/page.tsx Full leaderboard page
  chapters/page.tsx    All chapters page
components/            Reusable UI building blocks
lib/
  data.ts              Mock data (chapters, leaderboard, features, skills)
  types.ts             Shared TypeScript types
```

## Design system

- **Palette:** ivory/off-white background, deep Kerala green, muted gold,
  warm rust-orange, dark charcoal text.
- **Type:** Marcellus (display/headings) + Inter (body/UI).
- **Signature motif:** a pookalam-inspired medallion enclosing Vamana's three
  ascending steps (`components/Insignia.tsx`), reused in the hero, navbar
  mark, footer mark, and auth screens.

## Next steps (not in this prototype)

- Real authentication (e.g. Supabase auth)
- Flag submission + validation backend
- Live leaderboard data
- Team creation/join flow
- Per-chapter challenge pages
