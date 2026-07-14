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

---

## 5. Domain Configuration & Production Deployment Steps

This section details the steps to launch the website under a custom domain.

### Cost Breakdown
- **Custom Domain Purchase**: ~$10/year (via Porkbun, Cloudflare, or Namecheap).
- **Vercel Hosting**: $0/month (Hobby Plan supports custom domains & SSL).
- **Supabase Database & Auth**: $0/month (Free Tier).

### Setup Action Items

1. **Vercel Custom Domain Configuration**:
   - Go to your Vercel project dashboard -> **Settings** -> **Domains**.
   - Add your custom domain (e.g., `cmhcb.org`). Add both the root domain and the `www` subdomain.

2. **DNS Record Verification**:
   - Log into your domain registrar dashboard and configure the DNS records provided by Vercel:
     - **Apex Domain (`cmhcb.org`)**: Add an `A` record pointing to `76.76.21.21`.
     - **Subdomain (`www.cmhcb.org`)**: Add a `CNAME` record pointing to `cname.vercel-dns.com`.

3. **Supabase Redirect URL Alignment**:
   - Log into the Supabase Dashboard, select your project, and navigate to **Settings** -> **Auth**.
   - Update **Site URL** to `https://www.cmhcb.org` (or your chosen primary URL format).
   - In **Additional Redirect URLs**, add `https://www.cmhcb.org/**` and `https://cmhcb.org/**` to ensure secure authentication flows work globally.

