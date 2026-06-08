# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npx tsc --noEmit` — type-check without emitting files (no test suite exists in this project)

## Architecture

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4, backed by Supabase
(Postgres database + auth). Note the `AGENTS.md` warning above: this Next.js version
renamed Middleware to **Proxy** (`src/proxy.ts`, exporting a `proxy` function, not
`middleware`) — check `node_modules/next/dist/docs/` before assuming any API matches
training data.

### Supabase clients

There are two ways to get a Supabase client, and the choice matters:

- `src/utils/supabase/client.ts` — `createBrowserClient`, for use in Client Components
- `src/utils/supabase/server.ts` — async `createServerClient` wired to Next's `cookies()`,
  for use in Server Components and Server Actions
- `src/proxy.ts` — a third, request-scoped client used to refresh the auth session on
  every request and redirect unauthenticated users to `/login` (and authenticated users
  away from `/login`)

### Server Actions for all mutations

There is no API route layer — reads happen directly in Server Components via the server
Supabase client, and writes go through `'use server'` action files that call
`revalidatePath('/')` after mutating:

- `src/app/login/actions.ts` — `entrar`, `cadastrar`, `sair` (sign in/up/out, redirect
  based on result)
- `src/app/actions.ts` — `criarTarefa`, `alternarTarefa`, `apagarTarefa` (task CRUD,
  scoped to the logged-in user via `supabase.auth.getUser()`)

Forms bind these actions directly (`action={criarTarefa}`, `formAction={entrar}`,
`alternarTarefa.bind(null, id, concluida)`), so there's no client-side form state.

### Database (`tarefas` table)

Columns: `id`, `created_at`, `titulo` (text, required), `concluida` (bool, default
`false`), `usuario_id` (uuid, references the authenticated user), `prioridade`
(text, one of `alta` / `media` / `baixa`, default `media`, enforced by a CHECK
constraint). Row Level Security policies restrict every operation (select/insert/
update/delete) to rows where `auth.uid() = usuario_id` — there is no app-level
authorization check beyond relying on these policies plus passing `usuario_id` on
insert.

### Environment

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
`.env.local` (gitignored, not committed).
