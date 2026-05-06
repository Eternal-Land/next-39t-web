# AGENTS.md

Instructions for AI coding agents working in this repository.

## Tech Stack

- **Runtime**: Bun (not npm/yarn/pnpm)
- **Framework**: Next.js 16.x (prerelease), React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (radix-nova style)
- **Database**: MySQL 8.0 via Prisma with MariaDB adapter
- **Auth**: Better-Auth with email/password
- **Validation**: Zod + react-hook-form
- **Language**: TypeScript (strict mode)

## Commands

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Build (includes prisma generate)
bun run build

# Production server
bun run start

# Lint all files
bun run lint

# Lint single file
bunx eslint path/to/file.ts
```

### Database Commands

```bash
# Start MySQL container
docker compose up -d

# Run migrations (required before first build)
bunx prisma migrate dev

# Generate Prisma client
bunx prisma generate

# Open Prisma Studio
bunx prisma studio
```

### Testing

No test framework is currently configured. If adding tests:
- Prefer Vitest for unit tests
- Run single test: `bunx vitest run path/to/file.test.ts`

## Project Structure

```
app/                    # Next.js App Router (server components by default)
  admin/(auth)/         # Auth pages (login) - route group
  admin/(dashboard)/    # Protected admin pages - route group
  api/auth/[...all]/    # Better-Auth API catch-all
actions/                # Server actions ("use server")
  [feature]/            # Feature-specific folder structure:
    actions.ts          # Server action functions
    types.ts            # Zod schemas and TypeScript types
    index.ts            # Barrel exports (export * from "./actions"; export * from "./types")
components/
  pages/                # Page-specific client components
  shared/               # Shared components
  ui/                   # shadcn/ui components
lib/                    # Shared utilities (auth, prisma, utils)
prisma/                 # Schema and migrations
generated/prisma/       # Generated Prisma client (gitignored)
```

## Code Style Guidelines

### File Naming

- **Components**: PascalCase (`AdminLoginPageClient.tsx`, `Button.tsx`)
- **Utilities/libs**: camelCase (`auth.ts`, `prisma.ts`, `utils.ts`)
- **Directories**: camelCase (`components/pages`, `components/ui`)

### Import Order

1. `"use client"` or `"use server"` directive (if needed)
2. React imports (`import * as React from "react"`)
3. External libraries (react-hook-form, zod, next/*)
4. Internal UI components (`@/components/ui/*`)
5. Internal lib imports (`@/lib/*`)
6. Relative imports

```typescript
"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
```

### Naming Conventions

- **Components/Types**: PascalCase (`LoginFormData`, `AdminLoginPageClient`)
- **Functions/Variables**: camelCase (`handleSubmit`, `adminEmail`)
- **Constants**: camelCase (`loginSchema`, `buttonVariants`)
- **Zod schemas**: camelCase with `Schema` suffix (`loginSchema`)

### TypeScript Patterns

```typescript
// Zod schema with inferred type
const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type LoginFormData = z.infer<typeof loginSchema>;

// Component props - inline typing
export default function Layout({ children }: { children: React.ReactNode }) {}

// Extending native element props
function Button({ className, ...props }: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {}
```

### Server Actions Structure

Organize server actions in feature folders under `actions/`:

```
actions/
  landing/
    actions.ts    # Server action functions with "use server"
    types.ts      # Zod schemas and TypeScript types
    index.ts      # Barrel exports
  auth.ts         # Simple actions can be single files
```

**`types.ts`** - Define Zod schemas and inferred types:
```typescript
import z from "zod";

// Zod schemas for validation
export const heroSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  techStack: z.array(z.string()),
});

// Inferred types from schemas
export type HeroFormData = z.infer<typeof heroSchema>;
```

**`actions.ts`** - Server actions that use the types:
```typescript
"use server";

import { prisma } from "@/lib/prisma";
import { HeroFormData } from "./types";

export async function upsertHeroSection(data: HeroFormData) {
  // Implementation
}
```

**`index.ts`** - Barrel exports:
```typescript
export * from "./actions";
export * from "./types";
```

**Importing in components:**
```typescript
import { heroSchema, HeroFormData, upsertHeroSection } from "@/actions/landing";
```

### Component Patterns

**Server Components** (default in `app/`):
- No directive needed
- Use `async` for data fetching
- Import client components for interactivity

**Client Components**:
- Add `"use client"` at file top
- Store in `components/pages/[PageName]/[PageName]Client.tsx`
- Handle all hooks, state, and interactivity

**Server Actions**:
- Add `"use server"` at file top (in `actions/`) or inline in function
- Use for form submissions and mutations

### Error Handling

```typescript
// API/async errors - try-catch with state
const [error, setError] = React.useState<string>("");

try {
  const result = await authClient.signIn.email({ email, password });
  if (result.error) {
    setError(result.error.message || "Login failed");
  }
} catch {
  setError("An unexpected error occurred");
}

// Form validation errors via react-hook-form
{errors.email && (
  <p className="text-sm text-destructive">{errors.email.message}</p>
)}
```

### Styling

- Use `cn()` utility from `@/lib/utils` for conditional classes
- Prefer Tailwind classes over custom CSS
- Use CSS variables for theming (defined in `app/globals.css`)

```typescript
import { cn } from "@/lib/utils";

<div className={cn("flex items-center", isActive && "bg-primary")} />
```

## Important Notes

### Better-Auth Usage

- **Client components**: Use `authClient` from `@/lib/auth-client`
- **Server components/actions**: Use `auth` from `@/lib/auth`

```typescript
// Client component
import { authClient } from "@/lib/auth-client";
await authClient.signIn.email({ email, password });

// Server component/action
import { auth } from "@/lib/auth";
const session = await auth.api.getSession({ headers: await headers() });
```

### Prisma

- Output path: `generated/prisma` (not default `node_modules`)
- Uses MariaDB adapter for MySQL 8.0 compatibility
- Database URL built from individual env vars (see `prisma.config.ts`)
- Uses `prisma-json-types-generator` for typed JSON fields

**JSON Fields with Type Safety:**

Use the `prisma-json-types-generator` to get TypeScript types for JSON columns:

```prisma
// In schema.prisma
generator json {
  provider = "prisma-json-types-generator"
}

model HeroSection {
  id        String @id @default(cuid())
  /// [String[]]
  techStack Json   @db.Json @default("[]")
}
```

The `/// [String[]]` comment tells the generator to type `techStack` as `string[]` instead of `Prisma.JsonValue`.

**Importing Prisma types:**
```typescript
// For browser/client-safe types (no server-only code)
import { Project, HeroSection } from "@/generated/prisma/browser";

// For server-side code with full Prisma client
import { prisma } from "@/lib/prisma";
```

### Next.js 16.x

This is a prerelease version. Check `node_modules/next/dist/docs/` for breaking changes if something behaves unexpectedly.

## Agent Workflow Rules

1. **Update AGENTS.md** when user requests contain new rules or workflow changes
2. **Use shadcn/ui** with Tailwind CSS for all UI components
3. **Install missing shadcn components**: `npx shadcn@latest add [component]`
4. **Server/Client pattern**: When creating a server component page, create its client component in `components/pages/[PageName]/[PageName]Client.tsx`
5. **Path aliases**: Always use `@/` imports instead of relative paths for non-local imports
6. **Centralize Zod schemas**: All Zod schemas and their inferred types MUST be defined in `actions/[feature]/types.ts`, not in component files. Components should import schemas and types from the actions barrel export (e.g., `import { projectSchema, ProjectFormData } from "@/actions/landing"`)

## Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Start database
docker compose up -d

# Run migrations and generate client
bunx prisma migrate dev
bunx prisma generate

# Start dev server
bun run dev
```

Required env vars (see `.env.example`):
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` (optional, for auto-seeding admin user)
