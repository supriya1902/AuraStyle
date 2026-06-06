# AuraStyle AI MVP

A premium AI personal styling website built with Next.js 15, Supabase, and Framer Motion.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Backend:** Supabase (Auth, DB, Storage)
- **Language:** TypeScript

## Setup Instructions

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Supabase
1. Create a new project on [Supabase](https://supabase.com).
2. Run the SQL in `supabase_setup.sql` in the SQL Editor.
3. Create a storage bucket named `user-photos`.
4. Copy your project URL and Anon Key to `.env.local`.

### 3. Run Locally
```bash
npm run dev
```

## AI Agent Structure
The project uses a structured agentic approach in `src/lib/agents/index.ts`:
1. **Photo Analysis Agent:** Analyzes visual details.
2. **Style Recommendation Agent:** Suggests outfits and colors.
3. **Final Report Agent:** Structures the result into JSON.

## Design System
- **Theme:** Dark mode by default.
- **Accents:** Violet-to-pink gradients (`#8B5CF6` to `#EC4899`).
- **Components:** Glassmorphic cards with smooth Framer Motion transitions.

## Privacy & Safety
- No beauty/body scores are generated.
- Photos are used exclusively for styling reports.
- RLS policies ensure data privacy.
