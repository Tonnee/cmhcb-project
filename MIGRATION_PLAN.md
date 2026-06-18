# Migration Plan

This document outlines the architectural refactoring steps to fix critical validation bugs, improve SEO indexing, and ensure WCAG compliance for the CMHCB application.

---

## 1. Registration Forms Migration (Interactive client components)

### Current Architecture
- Both `app/events/[slug]/page.tsx` and `features/workshops/components/workshop-detail.tsx` contain a registration form with inputs and buttons directly inside Server Components without `"use client"` or `action` attributes. Clicking submit causes page refreshes and discards data.

### Migrated Architecture
- Keep the page routes and layout structures as **Server Components** for SEO benefits (SSR).
- Extract the registration form HTML markup and client validation states into clean, small Client Components:
  - `features/events/components/event-registration-form.tsx`
  - `features/workshops/components/workshop-registration-form.tsx`
- The Client Components will use standard React state (`useState`), event handlers (`onSubmit`), and display submit states (Submitting, Success message).

---

## 2. Dynamic Practitioner Lists

### Current Architecture
- Both `services/[slug]/page.tsx` and `training/[slug]/page.tsx` import and display a hardcoded list of dummy therapists named "Ruma Khondaker" with placeholder images.

### Migrated Architecture
- Delete the local mock lists.
- Query `THERAPISTS_DATA` directly inside the Server Component and filter using array lookup:
```typescript
const serviceTherapists = THERAPISTS_DATA.filter((therapist) =>
  therapist.services?.includes(slug)
);
```
- Pass the filtered array into `ServiceProfessionals`.

---

## 3. SEO Metadata Standardization

### Current Architecture
- Dynamic details pages lack `generateMetadata`. Search engines index all pages with the title and description from the root layout.

### Migrated Architecture
- Implement `generateMetadata` exports in all dynamic `page.tsx` files. The function will await the params, lookup the corresponding data item (Therapist, Service, Event, etc.), and return customized titles and descriptions.

---

## 4. Spacing & Design System Consolidation

### Current Architecture
- Spacings and color tokens are duplicated in the JavaScript object `lib/design-tokens.ts` and `app/globals.css`.

### Migrated Architecture
- Delete `lib/design-tokens.ts` since Tailwind CSS v4 compiles variables from `@theme` in `app/globals.css` into classes automatically. This leaves CSS variables as the single source of truth for UI configurations.
