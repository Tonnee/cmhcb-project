# Project Refactoring TODO

## Phase 1: Immediate Action Required
- [x] Fix broken event registration form in `app/events/[slug]/page.tsx` by moving to a client component.
- [x] Fix broken workshop registration form in `features/workshops/components/workshop-detail.tsx` by moving to a client component.
- [x] Update contact details in `app/contact/page.tsx` (Phone, Email, Address, and Google Map location).
- [x] Remove unused `ExperienceStat` from `app/therapists/[slug]/page.tsx` to fix ESLint warning.
- [x] Remove dead design tokens code in `lib/design-tokens.ts`.
- [x] Fix typo `"Jhon Doe"` in `data/testimonials.ts` and placeholder text `"Target company Inc"` in `data/footer.ts`.

## Phase 2: High Priority Improvements
- [x] Add dynamic `generateMetadata` exports to:
  - `app/therapists/[slug]/page.tsx`
  - `app/blog/[slug]/page.tsx`
  - `app/services/[slug]/page.tsx`
  - `app/training/[slug]/page.tsx`
  - `app/events/[slug]/page.tsx`
  - `app/workshops/[slug]/page.tsx`
- [x] Query and filter `THERAPISTS_DATA` dynamically in `services/[slug]/page.tsx` and `training/[slug]/page.tsx` instead of using static duplicate arrays.
- [x] Resolve memory leak in `components/ui/animated-counter.tsx` by canceling `requestAnimationFrame` on component unmount.
- [x] Generate dynamic `app/robots.ts` and `app/sitemap.ts` files for search engine indexing.

## Phase 3: Accessibility & Future Work
- [x] Add keyboard focus trap behavior to the media gallery lightbox modal inside `features/gallery/components/gallery-view.tsx`.
- [x] Standardize email domains across the application to `cmhcbd.com`.
- [x] Implement Zod schema validation for forms.
