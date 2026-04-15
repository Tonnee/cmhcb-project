# Project Rules

This document defines **strict, enforceable** development standards for this repository. Every rule is a hard constraint — not a suggestion. Both human developers and AI assistants MUST comply with every rule on every change.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5 (strict) · Tailwind CSS 4 · ESLint 9

---

## 0. AI Execution Protocol (MANDATORY — Gate All Output)

Before generating ANY code, the AI MUST complete this checklist:

1. **Read** this entire document and the `AGENTS.md` file.
2. **Classify** every component to create or modify:
   - Rendering: Server Component (default) or Client Component (justify with reason)
   - Target directory (must match §2)
   - File name (must match §4)
3. **Verify** every import resolves to a module in `package.json` or the local codebase. If it does not exist, STOP — do not invent it.
4. **State the plan** in ≤5 bullet points BEFORE writing code.

### Hard Constraints

| Constraint | Violation = Rejected Output |
|---|---|
| Skip planning step | ✗ |
| Import package not in `package.json` | ✗ |
| Generate stub, placeholder, or `// TODO` in production code | ✗ |
| Output partial file (missing imports, missing return, truncated) | ✗ |
| Add `"use client"` without explicit justification | ✗ |
| Create file outside §2 folder structure | ✗ |
| Use `any`, `as any`, or `@ts-ignore` | ✗ |
| Produce code that would emit TypeScript or ESLint warnings | ✗ |

---

## 1. Core Principles (Ordered by Priority)

1. **Server-first** — default to Server Components; push client boundaries to the smallest leaf node possible.
2. **Type safety** — strict TypeScript everywhere; zero `any`, zero `@ts-ignore`.
3. **Simplicity (YAGNI / KISS)** — "You aren't gonna need it". Avoid over-engineering. Build only what is necessary for the current requirement. Delete code before adding code.
4. **Composition over Prop Drilling** — Use React children to pass server-rendered components into client wrappers. Avoid prop drilling > 2 levels.
5. **Zero warnings** — no TypeScript errors, no ESLint warnings, no browser console errors in production.

---

## 2. Folder Structure (STRICT)

Create directories only when the first file is added. Do not create empty directories.

```
/
├── app/                    # Routes, layouts, loading/error states ONLY
│   ├── (group)/            # Route groups for layout segmentation
│   ├── route-name/
│   │   ├── page.tsx
│   │   ├── layout.tsx      # Optional: route-specific layout
│   │   ├── loading.tsx     # Optional: streaming fallback
│   │   └── error.tsx       # Optional: error boundary (must be Client Component)
│   ├── globals.css
│   └── layout.tsx          # Root layout
├── components/
│   ├── ui/                 # Atomic: Button, Input, Card, Badge, etc.
│   ├── layout/             # Structural: Header, Footer, Sidebar, Container
│   └── shared/             # Composed: shared across multiple features
├── features/               # Domain-specific scaling (feature slices)
│   └── feature-name/
│       ├── components/     # Feature-scoped components
│       ├── hooks/          # Feature-scoped hooks
│       ├── actions/        # Feature-scoped server actions
│       ├── lib/            # Feature-scoped utilities
│       └── types.ts        # Feature-scoped types
├── lib/                    # Pure global utilities, constants, helpers
├── types/                  # Global shared type definitions
├── hooks/                  # Global shared custom hooks
├── data/                   # Static data, content arrays, config objects
└── public/                 # Static assets (images, fonts, icons)
```

### Placement Rules

| File type | Location | Violation |
|---|---|---|
| Page route | `app/**/page.tsx` | Any component logic in page files beyond composition |
| Layout | `app/**/layout.tsx` | Business logic in layouts |
| Reusable UI primitive | `components/ui/` | Placing in `features/` or `app/` |
| Feature-specific component | `features/<name>/components/` | Placing in global `components/` |
| Custom hook (global) | `hooks/` | Inline hook definitions in components |
| Custom hook (feature) | `features/<name>/hooks/` | Placing in global `hooks/` |
| Utility function (no React) | `lib/` | Placing in `components/` or `hooks/` |
| Type definition (global) | `types/` | Scattered `type` exports across unrelated files |
| Static content/data | `data/` | Hardcoded arrays/objects inside components |

---

## 3. Component Architecture

### Server vs. Client Decision Tree

```
Does the component need:
  ├─ useState / useReducer         → "use client"
  ├─ useEffect / useLayoutEffect   → "use client"
  ├─ Browser APIs (window, etc.)   → "use client"
  ├─ Event handlers (onClick, etc.)→ "use client"
  ├─ Third-party client-only lib   → "use client"
  └─ None of the above             → Server Component (NO directive)
```

### Rules

- **Default: Server Component.** Never add `"use client"` unless the component meets a condition above.
- **Leaf-node principle:** wrap only the interactive piece in a Client Component; keep parents as Server Components.
- **Max 200 lines per file.** If exceeded, extract sub-components or utilities.
- **Max 5 props per component.** Beyond 5, use a config object. Stop unnecessary prop drilling!
- **Single default export per component file.** Named exports are permitted only for co-located types.
- **No `"use client"` in `page.tsx` or `layout.tsx`.** Extract interactive parts into separate Client Components.
- **Error boundaries** (`error.tsx`) MUST be Client Components with `"use client"`.

### State Management & Prop Drilling

- **Zero Unnecessary Prop Drilling:** Prop drilling past 2 levels is an anti-pattern. If you find yourself passing props through intermediary components that don't need them, you are doing it wrong.
- **Use Composition:** Pass Server Components as `children` or explicit props directly to the Client Component wrappers that need them. 
- **React Context Minimization:** Use React context strictly for globally needed, interactive client state (e.g., Theme, deeply nested UI toggles). Never use context for server data — rely on Next.js fetch caching.

---

## 4. Naming Conventions

| Target | Convention | Example |
|---|---|---|
| Files & directories | `kebab-case` | `user-profile.tsx`, `auth-form/` |
| React components | `PascalCase` | `UserProfile`, `AuthForm` |
| Variables & functions | `camelCase` | `getUserName`, `isActive` |
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_BASE_URL` |
| Types & interfaces | `PascalCase` | `UserProfile`, `AuthFormProps` |
| Type props | `{ComponentName}Props` | `ButtonProps`, `CardProps` |
| Custom hooks | `use` prefix + `camelCase` | `useAuth`, `useMediaQuery` |
| Event handlers | `handle` prefix | `handleClick`, `handleSubmit` |
| Boolean variables | `is`/`has`/`should` prefix | `isOpen`, `hasError`, `shouldRender` |

### Import Alias

Always use the `@/` path alias. Relative imports (`../../`) are forbidden for cross-directory references.

```tsx
// ✓ Correct
import { Button } from "@/components/ui/button";

// ✗ Forbidden
import { Button } from "../../components/ui/button";
```

Relative imports are permitted ONLY for sibling files within the same directory (e.g., `./types`).

---

## 5. Tailwind CSS v4 Rules

This project uses **Tailwind CSS v4** with `@import "tailwindcss"` and `@theme inline` in `globals.css`. There is NO `tailwind.config.ts` file.

### Constraints

- **Tailwind utility classes only.** No inline `style={}` attributes except for truly dynamic computed values (e.g., `style={{ transform: \`translateX(${x}px)\` }}`).
- **No custom CSS files** beyond `globals.css`. All component styling via Tailwind classes.
- **Mobile-first** responsive design. Use `sm:`, `md:`, `lg:`, `xl:` breakpoints — never write desktop-first then override.
- **Design tokens** via `@theme inline` in `globals.css`. Reference as `var(--token-name)` or the corresponding Tailwind class.
- **No `@apply`** in component styles. Use utility classes directly in JSX.
- **Conditional classes:** use template literals or ternary expressions for simple conditionals. For complex cases with 3+ conditions, extract to a helper function in `lib/`.

```tsx
// ✓ Simple conditional
<div className={`rounded-lg ${isActive ? "bg-blue-500" : "bg-gray-200"}`} />

// ✓ Complex conditional — extract to lib/
function getButtonClasses(variant: "primary" | "secondary", size: "sm" | "lg"): string { ... }
```

---

## 6. TypeScript Rules

### Strict Constraints

- **`strict: true`** in `tsconfig.json` — already enforced. Do not weaken.
- **Zero `any`** — use `unknown` and narrow with type guards when the type is genuinely unknown.
- **Zero `@ts-ignore` / `@ts-expect-error`** — fix the underlying type issue instead.
- **Zero type assertions (`as Type`)** unless narrowing from `unknown` after a runtime check.
- **Explicit return types** on all exported functions and all functions longer than 5 lines.
- **`interface` for object shapes, `type` for unions/intersections/primitives.**
- **Props interface** co-located in the same component file, named `{ComponentName}Props`.

```tsx
// ✓ Correct
interface HeroSectionProps {
  title: string;
  subtitle?: string;
}

export default function HeroSection({ title, subtitle }: HeroSectionProps): React.JSX.Element {
  return ( ... );
}
```

### Forbidden Patterns

```tsx
// ✗ any
const data: any = fetchData();

// ✗ Type assertion without guard
const user = data as User;

// ✗ Non-null assertion
const name = user!.name;
```

---

## 7. Data, Server Actions & React 19

### Data Fetching

- **Server-side only.** Fetch data in Server Components (`layout.tsx`, `page.tsx`). Never use `useEffect` for data fetching.
- **React 19 `use()` Hook:** Use the `use()` hook when consuming promises or context in Server and Client components where streaming is prioritized.
- **Pass data down** via props from Server Components to leaf Client Components. Do not over-fetch and pass giant objects; extract only what the child needs.
- **No client-side fetch calls** (`fetch` inside `"use client"` components) unless absolutely necessary. Fall back to libraries like SWR / React Query if required.

### Server Actions & Form Mutations

- **Mark with `"use server"`** exclusively at the top of the file, keeping actions fully isolated from UI components.
- **React 19 Hooks:** Leverage `<form action={serverAction}>`, `useActionState`, `useFormStatus`, and `useOptimistic` to handle mutation states locally without writing complex `onSubmit` handler boilerplate.
- **Validate all inputs** using validation logic at the action boundary — never trust client data.
- **Return typed results** — define explicit return types, not `Promise<any>`. Do not return raw Next.js/DB errors to the client.
- **Location Requirements:** Place actions in `features/<name>/actions/` or closely co-locate in the relevant route. Avoid creating dumping grounds in a generic `app/actions/` folder.

---

## 8. Accessibility (Non-Negotiable)

Every component MUST satisfy:

| Requirement | Enforcement |
|---|---|
| Semantic HTML elements (`<nav>`, `<main>`, `<section>`, `<article>`, `<button>`) | Use over generic `<div>`/`<span>` |
| `alt` on every `<img>` and `next/image` | Empty string `alt=""` only for decorative images |
| Interactive elements keyboard-accessible | `<button>` for actions, `<a>` for navigation — never `<div onClick>` |
| ARIA attributes when semantic HTML is insufficient | `aria-label`, `aria-expanded`, `aria-hidden` |
| Color contrast minimum | WCAG AA (4.5:1 for text, 3:1 for large text) |
| Focus indicators visible | Never remove `outline` without providing alternative focus style |

---

## 9. Performance Rules

| Rule | Implementation |
|---|---|
| Images | Always use `next/image` with explicit `width`/`height` or `fill`. Never use raw `<img>`. |
| Fonts | Use `next/font` for custom fonts. No external font CDN links. |
| Dynamic imports | Use `next/dynamic` for heavy Client Components not needed on initial render. |
| Bundle size | No Client Component may exceed 50KB gzipped (including dependencies). Verify with build output. |
| Metadata | Export `metadata` or `generateMetadata` from every `page.tsx` and `layout.tsx`. |
| Loading states | Provide `loading.tsx` for routes with async data fetching. |
| Static content | Prefer static rendering. Use `dynamic = "force-dynamic"` only when required. |

---

## 10. Code Quality Standards

### Enforced Patterns

- **Early returns** — guard clauses before main logic; no deep nesting.
- **Max nesting depth: 3 levels.** Extract functions or components if exceeded.
- **Zero Redundancy (DRY):** If logic or JSX patterns duplicate, extract heavily. Check existing `components/ui/` and `components/shared/` or `lib/` files before writing anything new. Avoid having 3 different variants of a "Card" performing the same visual task.
- **Single-responsibility** — each function does one thing; each component renders one concept.
- **No magic numbers/strings** — extract to named constants in `UPPER_SNAKE_CASE`.
- **Destructure props** in the function signature, not in the function body.

### Forbidden Patterns

- `console.log` in committed code (use a logging utility or remove).
- Comments that restate what the code does. Comments should explain **why**, not **what**.
- Dead code (unused imports, unreachable branches, commented-out code).
- `var` keyword — use `const` (preferred) or `let`.

---

## 11. Refactoring Protocol

When modifying existing code:

1. **Zero functional changes** unless explicitly requested. Refactoring MUST preserve existing behavior.
2. **Atomic changes** — one concern per commit/change. Do not mix refactoring with feature work.
3. **Verify build passes** — `npm run build` must succeed with zero errors after every change.
4. **Max blast radius** — a single refactoring change should touch ≤5 files. If more are needed, break into sequential steps.

---

## 12. AI Output Validation Checklist

Before finalizing any output, the AI MUST verify:

- [ ] Every file is complete — no truncation, no `...`, no `// rest of component`.
- [ ] Every import resolves to `package.json` dependency or local file.
- [ ] No `any`, `@ts-ignore`, or `@ts-expect-error` present.
- [ ] `"use client"` appears ONLY with explicit justification provided.
- [ ] File placement matches §2 folder structure.
- [ ] File naming matches §4 conventions.
- [ ] Component is ≤200 lines.
- [ ] Props count is ≤5 (or uses config object pattern).
- [ ] All images use `next/image`.
- [ ] Semantic HTML is used (no `<div onClick>`).
- [ ] `@/` alias used for all cross-directory imports.
- [ ] No `console.log`, no dead code, no commented-out blocks.
- [ ] Tailwind classes only — no inline styles, no CSS modules, no `@apply`.
- [ ] Explicit return types on exported functions.

If ANY check fails, fix before delivering. Do not deliver with known violations.

---

## 13. Anti-Patterns (NEVER Do These)

| Anti-Pattern | Correct Approach |
|---|---|
| Over-engineering simple UI features | Apply KISS principles. Build what is required now without premature abstractions |
| `"use client"` on `page.tsx` or `layout.tsx` | Extract interactive parts into leaf Client Components |
| Component > 200 lines | Split into sub-components |
| Prop drilling > 2 levels | Stop passing unused props. Pass components as `children` or use Context |
| Redundant component creation | Reuse existing `components/ui/` primitives instead of duplicating |
| `useEffect` for data fetching | Fetch in Server Components or use React 19 `use()` hook |
| Raw `<img>` tag | `next/image` |
| `<div onClick={...}>` | `<button>` with proper semantics |
| Hardcoded strings/data in JSX | Extract to `data/` or constants |
| `fetch()` inside Client Components | Fetch in Server Components, pass via props |
| `import "../../../"` | Use `@/` alias |
| Empty `catch {}` blocks | Handle or rethrow with typed error |
| `export default function() {}` (anonymous) | Always name exported functions |


## 14. Design System Enforcement

- All UI MUST use design tokens
- No hardcoded Tailwind values (e.g. px-7, text-[#123456])
- Always use shared UI primitives
