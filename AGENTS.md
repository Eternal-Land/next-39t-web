# AGENTS.md

## Developer Commands

```bash
# Install dependencies
bun install

# Development server
bunx run dev

# Build (includes prisma generate)
bun run build

# Run production server
bun run start

# Lint
bun run lint
```

## Database Commands

Prisma requires custom configuration (see `prisma.config.ts`):

```bash
# Run migrations (required before first build)
bunx prisma migrate dev

# Generate Prisma client
bunx prisma generate

# Studio
bunx prisma studio
```

## Important Notes

- **Runner**: Bun (not npm/yarn/pnpm)
- **Prisma output**: Generates to `generated/prisma` (custom path in schema.prisma)
- **Database**: MySQL 8.0 via MariaDB adapter
- **Auth**: Better-Auth with sessions and accounts
- **Next.js 16.x**: This is a prerelease version. Check `node_modules/next/dist/docs/` for breaking changes.
- **Better-Auth Usage**: Use `authClient` from `@/lib/auth-client` in client components (useSignIn, signIn, etc.). Use `auth` from `@/lib/auth` in server components/route handlers.

## Agent Workflow Rules

- Always update AGENTS.md when user requests contain new rules, changes in structure, or workflow updates
- Always use shadcn with Tailwind CSS when coding UI. Install components if they don't exist via `npx shadcn@latest add [component]`
- When creating a server component, also create its corresponding client component for frontend logic/hooks.

## Environment Required

Create `.env` from `.env.example` before running:

```bash
# Start MySQL container
docker compose up -d

# Then run migrations
bunx prisma migrate dev
bunx prisma generate
```

## Project Structure

- `app/` - Next.js App Router pages and API routes
- `app/admin/(auth)/` - Auth pages (login)
- `app/admin/(dashboard)/` - Protected admin dashboard
- `app/api/auth/[...all]/` - Better-Auth API route
- `prisma/schema.prisma` - Database schema
- `lib/` - Shared utilities (auth, prisma client)
- `components/ui/` - shadcn/ui components
