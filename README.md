# Center for Mental Health and Care Bangladesh (CMHCB) Platform

A full-stack, enterprise-grade mental health web platform built with **Next.js 16 (App Router)**, **React 19**, **TypeScript 5**, **Tailwind CSS 4**, **Prisma ORM**, and **Supabase (Auth & Storage)**.

---

## 🌟 Key Highlights

- **Complete Public Platform**: Interactive appointment booking, clinical services directory, professional training curricula, crisis helplines, events and workshops, psychoeducational blog, affiliation network, and community outreach policy.
- **Dynamic Content Administration**: Full administrative control over all section titles, subtitles, narratives, hero banners, and media uploads across every page.
- **Enterprise Security**: Role-based access control (RBAC), Supabase SSR authentication with session guards, strict email whitelisting (`admin@cmhcb.org`, `satonnee@gmail.com`), and HTML sanitization (`isomorphic-dompurify`).
- **Interactive Workspaces**: Real-time management of client appointment requests and trainee enrollment applications with optimistic UI updates.
- **Accessibility & SEO**: WCAG 2.2 AA compliant text contrast ratios, semantic HTML5, dynamic metadata generation (`generateMetadata`), and structured JSON-LD schemas.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **Database**: PostgreSQL (via Supabase or local instance)

### 2. Environment Setup
Configure your `.env` or `.env.local` file with the required environment variables:
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"
DIRECT_URL="postgresql://user:password@host:port/database"

# Supabase Auth & Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# App URL
APP_URL="http://localhost:3000"
```

### 3. Database Synchronization
```bash
npx prisma db push
```

### 4. Running the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public website.

---

## 🛠️ Admin Panel & Documentation

- **Admin Login**: [http://localhost:3000/login](http://localhost:3000/login) (Authorized administrators only).
- **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin).
- **Interactive In-App Documentation**: [http://localhost:3000/admin/docs](http://localhost:3000/admin/docs) — Searchable operations cheatsheet with step-by-step editing guides and image upload specifications.
- **Comprehensive Technical Admin Guide**: See [ADMIN_DOCUMENTATION.md](./ADMIN_DOCUMENTATION.md) for full architecture, route mappings, data models, and operational workflows.

---

## 🧪 Testing & Validation

```bash
# Type checking
npx tsc --noEmit

# Unit tests (Vitest)
npm run test

# End-to-end tests (Playwright)
npm run test:e2e
```
