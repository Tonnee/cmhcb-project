# CMHCB Admin Panel — Complete Technical & Operational Documentation

**Platform**: Center for Mental Health and Care Bangladesh (CMHCB)  
**Last Updated**: September 2026  
**Stack**: Next.js 16 (App Router) · React 19 · TypeScript 5 (Strict) · Tailwind CSS 4 · Prisma ORM · PostgreSQL · Supabase SSR Auth & Storage  

---

## 1. Executive Overview

The CMHCB Admin Panel is a secure, full-stack management portal designed to give administrators comprehensive control over the entire website without touching code. It allows real-time customization of:
- **All Section Titles, Subtitles, and Descriptive Texts** across every public webpage.
- **Hero Banners, Feature Artwork, and Media Uploads** with automatic Supabase Cloud Storage integration and live client previews.
- **Clinical Service Offerings & Professional Trainings** including curricula, fees, and assigned trainers.
- **Therapists & Clinicians Directory** with professional roles, credentials, fees, and ordering.
- **Client Appointments & Trainee Requests** with optimistic status toggles (`PENDING`, `APPROVED`, `CANCELLED`, `COMPLETED`).
- **Events, Workshops & Psychoeducational Blog Posts**.
- **Role-Based Access Control (RBAC)** with strict security email whitelisting and administrative activity audit logging.

In addition to this repository document, an interactive, searchable in-app documentation portal is available at **`/admin/docs`** directly inside the admin panel.

---

## 2. Authentication & Access Security

### 2.1 Route Protection & Session Validation
- **Admin Entry Route**: `/login` (redirects authenticated admins to `/admin`).
- **Session Layer**: Supabase SSR Auth with session cookie exchange and server-side verification in `getRequiredAdminSession()` ([admin-management.ts](file:///d:/Sabiha/cmhcb-project/app/(admin)/admin/admin-management.ts)).
- **Role-Based Access Control (RBAC)**:
  - `super_admin`: Full administrative control, user provisioning, role promotion, and audit log inspection.
  - `admin`: Operational content management, appointment tracking, and catalog updates.

### 2.2 Security Whitelist Enforcement
To prevent unauthorized auto-provisioning, the system enforces a strict email whitelist. Only authenticated users matching verified institutional emails are provisioned with admin privileges:
- `admin@cmhcb.org`
- `satonnee@gmail.com`

Any unlisted account attempting to access `/admin` triggers an immediate `AccessDeniedError` and redirect to `/login`.

---

## 3. Architecture & Data Flow

```mermaid
flowchart LR
    subgraph Client UI
        AdminForm[Admin Edit Form (Client Component)]
        PublicPage[Public Webpage (Server Component)]
    end

    subgraph Storage & Media
        SupaStorage[Supabase Bucket 'cmhcb-media']
    end

    subgraph Server Actions
        ServerAction[Zod Validated Server Action in actions.ts]
        PrismaClient[Prisma Client (lib/prisma.ts)]
        Revalidation[revalidatePath Cache Invalidation]
    end

    subgraph Database
        PostgresDB[(PostgreSQL / Supabase Database)]
    end

    AdminForm -- "1. Upload File" --> SupaStorage
    SupaStorage -- "2. Return Public URL" --> AdminForm
    AdminForm -- "3. Submit Payload" --> ServerAction
    ServerAction -- "4. Upsert Record" --> PrismaClient
    PrismaClient --> PostgresDB
    ServerAction -- "5. Revalidate Cache" --> Revalidation
    Revalidation -.-> PublicPage
    PostgresDB -- "6. Dynamic Render" --> PublicPage
```

### 3.1 Media Upload Pipeline
1. Images selected in admin forms are immediately uploaded via `uploadImageToSupabase()` to the public Supabase bucket `cmhcb-media`.
2. The permanent HTTPS URL is returned and bound to the form state with an instant preview.
3. Upon form submission, the URL is saved to the database via Prisma ORM.

### 3.2 Server Actions & Cache Invalidation
All mutations run through strictly typed Server Actions in [actions.ts](file:///d:/Sabiha/cmhcb-project/app/(admin)/admin/actions.ts):
- Every payload is validated against a schema using **Zod**.
- After database persistence, `revalidatePath()` is called on both `/admin/*` and the corresponding public route (e.g. `/services`, `/about`, `/`), providing instant updates for site visitors without requiring manual rebuilds or cache clearing.

---

## 4. Comprehensive Page & Section Management Directory

| Page | Admin Route | Database Model | Managed Elements & Features |
| :--- | :--- | :--- | :--- |
| **Homepage** | `/admin/landing-page` | `LandingPageContent` | • Hero Title, Subtitle, Background Banner & Floating Counselor Artwork<br>• Section Headings & Subtitles for Services, Therapists, Events, and Guide<br>• Annual Event Calendar narrative<br>• About Mission statement with inline badge tokens (`[therapist]`, `[brain]`, `[heart]`) & badge avatars<br>• Well-Being Commitment headline, summary & 4 animated counters<br>• Training Program CTA banner & graphic<br>• Global Footer contact phone, email, 3-line address, and social channel toggles |
| **Services** | `/admin/pages/services`<br>`/admin/services` | `ServicesPageContent`<br>`Service` | • Hero Title, Description & Hero Background Image<br>• Catalog Section Title ("All Services")<br>• Full clinical service catalog, slugs, fees, duration, icons, target audience, format, info blocks, and FAQs |
| **Training** | `/admin/pages/training`<br>`/admin/trainings` | `TrainingPageContent`<br>`Training` | • Hero Title, Description & Hero Background Image<br>• Catalog Section Title ("All Training Programs")<br>• Professional courses, syllabus modules, highlight lists, course fees, schedules, FAQs, and assigned trainers |
| **About Us** | `/admin/pages/about` | `AboutPageContent` | • Hero Title, Description & Hero Background Image<br>• Mission & Vision Section Heading and Subtitle Badge<br>• Dedicated Mission Statement narrative & Mission Card Photo upload<br>• Dedicated Vision Statement narrative & Vision Card Photo upload<br>• Core Values Section Heading, Subtitle Badge, and Description<br>• Core Values list (value title, description, and icon name) |
| **Success Stories** | `/admin/pages/success-stories` | `SuccessStoriesPageContent`<br>`Testimonial` | • Hero Title, Description & Hero Background Image<br>• Stories Section Heading ("Transformative Journeys") & Subtitle ("Real Stories")<br>• Client testimonials catalog: client name/alias, role, avatar photo upload, review text, and homepage carousel feature toggle |
| **Crisis Support** | `/admin/pages/support` | `SupportPageContent` | • Hero Title, Description & Hero Background Image<br>• Helpline Section Heading ("Emergency Helplines") & Subtitle ("Immediate Assistance")<br>• Critical Emergency Advisory notice disclaimer (e.g., 999 alert)<br>• Emergency helpline phone lines (title, phone, hours, description, icon, primary badge toggle) |
| **Affiliation** | `/admin/pages/affiliation` | `AffiliationPageContent` | • Hero Title, Description & Hero Background Image<br>• Trusted Partners Section Heading & Subtitle Badge<br>• Partner organizations list: name, type, abbreviation, logo image upload, website link<br>• Partnership Benefits Section Heading & Subtitle Badge<br>• Benefits list: title, description, vector icon<br>• Partnership CTA Banner: title, description & promises checklist |
| **Contact Us** | `/admin/pages/contact` | `ContactPageContent` | • Hero Title, Description, Background Image & Image Alt text<br>• "Get in Touch" Section Heading & Narrative Description<br>• Primary Phone, Inquiries Email, Physical Office Address (Lines 1, 2, 3)<br>• Google Maps iframe embed URL<br>• Social media profile URLs (Facebook, Instagram, Twitter/X, LinkedIn) |
| **FAQs** | `/admin/pages/faq` | `FaqPageContent` | • Hero Title, Description & Hero Background Image<br>• FAQ Section Heading, Subtitle Badge, and Intro Description paragraph<br>• Categorized Question & Answer accordions (Services, Trainings, Therapist, Others) |
| **Community Service** | `/admin/pages/community-service` | `CommunityServicePageContent` | • Hero Title, Subtitle, Description & Hero Background Image upload<br>• Introduction Block: Section Heading, Paragraph 1, Paragraph 2 & Seminar/Workshop Feature Photo upload<br>• Outreach Impact Statistics (metric value, title, description)<br>• Outreach Program Pillars: Section Heading, Badge, Description & Pillar Cards (badge, title, description, icon)<br>• Eligibility Verification: Title, Description & Criteria list<br>• Operational Guidelines: Title, Description & Guidelines list<br>• Outreach Session Request CTA: Title, Description & Coordinator email |
| **Book an Appointment** | `/admin/appointments` | `AppointmentPageContent`<br>`Appointment` | • Subtitle Badge ("Get Started"), Main Title ("Book an Appointment"), and Description Narrative<br>• Benefit Highlight Pillars (title, description, and vector icon selection e.g., Expert Care, Flexible Timing, Private & Confidential)<br>• Client booking request intake roster and optimistic status transitions |
| **Join Training Batch** | `/admin/training-requests` | `JoinTrainingPageContent`<br>`TrainingRequest` | • Subtitle Badge ("Get Started"), Main Title ("Join Training Batch"), and Description Narrative<br>• Benefit Highlight Pillars (title, description, and vector icon selection e.g., Expert Facilitators, Interactive Curriculum, Official Certification)<br>• Trainee registration intake roster and status transitions |
| **Media Gallery** | `/admin/pages/gallery` | `GalleryItem` | • Photographs and video stream links<br>• Alt text descriptions and display captions<br>• Categorization tags (Events, Workshops, Activities, Occasions) |

---

## 5. Interactive Operations Workspaces

### 5.1 Client Appointments & Page Content (`/admin/appointments`)
- **Dual Tab Architecture**: Seamlessly switch between **"Booked Appointments"** (client intake table) and **"Appointment Page Text & Highlights"** (live page content editor).
- **Page Content Customizer**:
  - Update left-column introductory subtitle badge ("Get Started"), title ("Book an Appointment"), and descriptive narrative.
  - Add, edit, or remove benefit highlight cards with instant icon picker (`HiUserGroup`, `HiClock`, `PhoneIcon`, `HiShieldCheck`, `HiHeart`, `HiSparkles`, `HiAcademicCap`).
  - Includes direct link to preview the live `/appointment` page.
- **Real-Time Bookings Feed**: Displays client booking requests sorted chronologically.
- **Filter Tabs**: Filter by status (`All`, `Pending`, `Approved`, `Completed`, `Cancelled`).
- **Client Details**: Client full name, age, gender, contact phone, email, preferred therapist, selected service, date, time slot, consultation medium (Online vs In-Person), and confidential intake notes.
- **Status Updates**: Instant status toggle with optimistic UI feedback and automatic admin activity logging.

### 5.2 Training Inquiries & Page Content (`/admin/training-requests`)
- **Dual Tab Architecture**: Seamlessly switch between **"Training Requests"** (intake table) and **"Join Training Page Text & Highlights"** (live page content editor).
- **Page Content Customizer**:
  - Update left-column introductory subtitle badge ("Get Started"), title ("Join Training Batch"), and descriptive narrative.
  - Add, edit, or remove benefit highlight cards with instant icon picker (`HiUserGroup`, `HiBookOpen`, `HiSparkles`, `HiAcademicCap`, `HiShieldCheck`, `HiClock`, `HiHeart`, `PhoneIcon`).
  - Includes direct link to preview the live `/join-training` page.
- **Trainee Applications**: Displays applicant names, contact phone, email, selected certification course, educational/professional background, and submission timestamp.
- **Status Transitions**: One-click approval or rejection upon payment or credential verification.

### 5.3 Clinicians & Therapists Management (`/admin/therapists`)
- **Profile Customization**: Full name, designation, biography, clinical philosophy, education, certifications, and clinical focus areas.
- **Ordering**: Numeric integer sorting (`0` displays first).
- **Fees & Appointments**: Set standard consultation fees and assign specific services.
- **Frequently Asked Questions (FAQs)**: Add, edit, and reorder therapist-specific Q&As. These dynamically surface on the therapist profile and are aggregated under the "Therapist" tab on `/faqs`.

### 5.4 Events & Workshops Portal (`/admin/events-workshops`)
- **Publishing**: Event title, date, time, venue, lead speaker, full agenda, and registration limits.
- **Media**: Promotional cover image and photo gallery.
- **Registration Roster**: View registered attendees for each workshop.

### 5.5 Psychoeducation Blog Management (`/admin/blogs`)
- **Article Studio**: Title, slug, excerpt, full article content, publication date, author byline, and tags.
- **Homepage Spotlight**: Toggle "Featured Article" to pin educational pieces to the homepage.

### 5.6 Admin Users & Security Audit Log (`/admin/admins`)
- **Role Assignment**: Manage roles (`super_admin`, `admin`).
- **Audit Logging**: Every create, update, or delete action records:
  - Administrator email and ID
  - Action performed
  - Target entity ID and table
  - Precise timestamp

---

## 6. Media & Image Upload Guidelines

To maintain optimum performance and visual quality across all viewports, follow these image specifications when uploading through the admin panel:

| Location | Recommended Dimensions | Aspect Ratio | Formats | Max File Size | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Background Banners** (All Pages) | **1920 × 1080 px** | 16:9 | `.webp`, `.jpg`, `.png` | < 5 MB | High-resolution photography; dark/subdued tones work best behind white typography |
| **Homepage Floating Counselor** | **800 × 950 px** | ~4:5 | `.png` | < 2 MB | **Must have a transparent background** (PNG alpha channel) |
| **Mission / Vision Photos** (`/about`) | **800 × 600 px** | 4:3 | `.webp`, `.jpg`, `.png` | < 3 MB | Clear real-world counseling or institutional photos |
| **Workshop / Seminar Feature Photo** (`/legal/community-service`) | **800 × 600 px** | 4:3 | `.webp`, `.jpg`, `.png` | < 3 MB | Community training sessions, workshops, or group discussions |
| **Therapist Portraits** | **800 × 1000 px** | 4:5 | `.webp`, `.png` | < 1.5 MB | Professional headshot on a neutral background |
| **Partner Logos** (`/affiliation`) | **200 × 200 px** | 1:1 (Square) | `.png` | < 1 MB | Clean institutional logos with transparent background |
| **Client Testimonial Avatars** | **200 × 200 px** | 1:1 (Square) | `.webp`, `.png` | < 500 KB | Clear facial avatars or avatars representing client demographics |
| **Blog & Workshop Covers** | **1200 × 700 px** | 16:9 | `.webp`, `.jpg` | < 2 MB | High-clarity editorial or promotional imagery |

---

## 7. Operational Cheatsheet & In-App Guide

Administrators can reference the live, interactive cheatsheet at:
> **`/admin/docs`** (Webpage Content Operations Cheatsheet)

This in-app page provides:
- Live search across all editable sections.
- Filter tabs for **Editable** vs **Static** elements.
- Step-by-step editing instructions with visual previews.
- Direct links to the relevant edit forms for every section of the website.
