# Expert Audit Roles & Refactoring Directives

When writing, refactoring, or optimizing code in this repository, evaluate all changes against the following expert role domains:

## 1. Senior Next.js & React Architect
- Enforce clean App Router server vs client component boundaries (`'use client'` only at leaf interactivity).
- Maintain repository service abstractions (`lib/services/articles.ts`) to decouple data fetching from UI components.
- Ensure error boundaries (`error.tsx`), route fallbacks (`not-found.tsx`), and Suspense boundaries (`loading.tsx`) are preserved.

## 2. Accessibility (WCAG 2.2 AA) Specialist
- Enforce semantic HTML5 tags and ARIA standard attributes (`role="dialog"`, `aria-modal="true"`, `aria-label`).
- Use `<fieldset>` and `<legend>` for filter option groups.
- Maintain strict keyboard focus traps and focus restoration in modal dialogs (`SearchModal`).
- Ensure text color contrast ratios meet or exceed 4.5:1 against backgrounds.

## 3. Performance & Core Web Vitals Engineer
- Ensure dynamic imports are used for heavy modal dialogs and client-only scripts (`SearchModal`, GSAP).
- Optimize Google Fonts with `display: "swap"` and scope font weight subsets.
- Prevent render-blocking payloads and keep hydration light.

## 4. Security & DevOps Engineer
- Protect against XSS, clickjacking, and MIME sniffing with HTTP Security Headers in `next.config.ts`.
- Enforce strict Content Security Policy (CSP) headers.
- Sanitize all user inputs in comments, author direct messages, and form submissions.

## 5. SEO & AEO (Search & Answer Engine Optimization) Lead
- Include dynamic `generateMetadata()` on dynamic routes (`/articles/[slug]`, `/themes/[slug]`) with complete Open Graph, Twitter cards, and canonical URLs.
- Maintain dynamic `app/sitemap.ts`, `app/robots.ts`, AI discovery files (`public/llms.txt`), and rich structured JSON-LD schemas (`Article`, `BreadcrumbList`, `FAQPage`, `Organization`).
- Structure content for AI search engines (Perplexity, SearchGPT, Gemini): use semantic HTML5, explicit heading hierarchy, key takeaway/summary blocks, and direct answer formats.

## 6. Database & Backend Security Architect
- Design clean TypeScript interfaces for domain entities (`UserProfile`, `ReadArticleItem`, `SavedArticleItem`, `AuthorMessage`).
- Ensure all mutation functions support future database integration (PostgreSQL / Prisma / Supabase) with Row-Level Security (RLS).

## 7. i18n & Arabic Script Specialist
- Ensure Quranic text, diacritics, and translations maintain proper font styling (`font-tinos`, `font-caladea`) and layout spacing.
- Support Right-to-Left (RTL) compatibility for Arabic script rendering.

## 8. Design System Architect & UI Visual Lead
- Use global layout spacing tokens (`page-top-padding`, `page-bottom-padding`) instead of ad-hoc bracket classes.
- Follow Tailwind 4 semantic color utilities (`bg-brand-dark`, `text-brand-red`, `bg-brand-background`).
- Maintain consistent visual aesthetics, pill badges, and responsive layouts across all viewports.

