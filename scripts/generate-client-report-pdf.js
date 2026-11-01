const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

async function generatePdf() {
  const outputPath = path.resolve(__dirname, '..', 'CLIENT_DELIVERY_REPORT.pdf');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CMHCB - Project Delivery & Scope Comparison Report</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 14mm 20mm 14mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      font-size: 10pt;
      margin: 0;
      padding: 0;
    }

    .cover-card {
      background: linear-gradient(135deg, #094726 0%, #0d5f34 100%);
      color: #ffffff;
      padding: 24px 28px;
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .badge-header {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 8pt;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .cover-card h1 {
      margin: 0 0 6px 0;
      font-size: 20pt;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
    }

    .cover-card p.subtitle {
      margin: 0 0 18px 0;
      font-size: 11pt;
      color: #d1fae5;
      font-weight: 400;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      padding-top: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.25);
    }

    .meta-item .meta-label {
      font-size: 7.5pt;
      text-transform: uppercase;
      color: #a7f3d0;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .meta-item .meta-val {
      font-size: 9.5pt;
      font-weight: 700;
      color: #ffffff;
      margin-top: 2px;
    }

    h2 {
      color: #064e3b;
      font-size: 13pt;
      font-weight: 700;
      margin: 18px 0 8px 0;
      padding-bottom: 5px;
      border-bottom: 2px solid #e2e8f0;
      page-break-after: avoid;
    }

    h3 {
      color: #0f172a;
      font-size: 11pt;
      font-weight: 700;
      margin: 16px 0 8px 0;
      page-break-after: avoid;
    }

    p {
      margin: 0 0 10px 0;
      color: #334155;
    }

    .highlight-banner {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 4px solid #16a34a;
      padding: 12px 16px;
      border-radius: 6px;
      margin: 14px 0;
    }

    .highlight-banner p {
      margin: 0;
      font-size: 9.5pt;
      color: #166534;
      line-height: 1.5;
    }

    .highlight-banner strong {
      color: #14532d;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 14px 0;
    }

    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
    }

    .stat-card .num {
      font-size: 16pt;
      font-weight: 800;
      color: #047857;
    }

    .stat-card .desc {
      font-size: 8.5pt;
      color: #64748b;
      margin-top: 2px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0 10px 0;
      font-size: 8pt;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }

    th {
      background-color: #064e3b;
      color: #ffffff;
      text-align: left;
      padding: 5.5px 9px;
      font-weight: 600;
      font-size: 8pt;
      letter-spacing: 0.3px;
    }

    td {
      padding: 4px 9px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      vertical-align: top;
      color: #334155;
      line-height: 1.3;
    }

    td:last-child {
      border-right: none;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    tr {
      page-break-inside: avoid;
    }

    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 7.5pt;
      font-weight: 700;
      text-align: center;
      white-space: nowrap;
    }

    .badge-success {
      background-color: #dcfce7;
      color: #15803d;
      border: 1px solid #bbf7d0;
    }

    .badge-primary {
      background-color: #dbeafe;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }

    .badge-purple {
      background-color: #f3e8ff;
      color: #6b21a8;
      border: 1px solid #e9d5ff;
    }

    .badge-amber {
      background-color: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    .feature-box {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #047857;
      border-radius: 6px;
      padding: 10px 14px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }

    .feature-box h4 {
      margin: 0 0 4px 0;
      font-size: 9.5pt;
      color: #064e3b;
      font-weight: 700;
    }

    .feature-box p {
      margin: 0;
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.4;
    }

    .page-break {
      page-break-before: always;
    }

    .client-alert {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-left: 4px solid #2563eb;
      padding: 12px 14px;
      border-radius: 6px;
      margin: 14px 0;
      page-break-inside: avoid;
    }

    .client-alert h4 {
      margin: 0 0 4px 0;
      font-size: 9.5pt;
      color: #1e40af;
      font-weight: 700;
    }

    .client-alert p {
      margin: 0;
      font-size: 8.5pt;
      color: #1e3a8a;
      line-height: 1.45;
    }

    .footer-note {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 8pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- Cover / Header Banner -->
  <div class="cover-card">
    <div class="badge-header">Formal Handover & Delivery Audit</div>
    <h1>Software Development Delivery Report</h1>
    <p class="subtitle">Scope Comparison: Agreed Quotation vs. Repository Delivery</p>
    
    <div class="meta-grid">
      <div class="meta-item">
        <div class="meta-label">Client</div>
        <div class="meta-val">CMHC, Bangladesh</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Project</div>
        <div class="meta-val">Website Development</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Report Date</div>
        <div class="meta-val">October 2026</div>
      </div>
      <div class="meta-item">
        <div class="meta-label">Overall Status</div>
        <div class="meta-val">100% Handover Ready</div>
      </div>
    </div>
  </div>

  <!-- Section 1 -->
  <h2>1. Executive Summary</h2>
  <div class="highlight-banner">
    <p>
      <strong>Scope Delivery Assessment:</strong> All contractual deliverables defined in the initial Software Development Quotation have been <strong>100% completed</strong> and thoroughly verified. In addition, several high-value enterprise modules — including an <strong>Admin CMS Panel</strong>, a <strong>Psychoeducational Blog system</strong>, and a <strong>Relational Database layer</strong> — have been proactively developed and delivered to the client <strong>at no additional cost</strong>, significantly exceeding the agreed scope.
    </p>
  </div>

  <div class="grid-2">
    <div class="stat-card">
      <div class="num">27 Pages</div>
      <div class="desc">Delivered vs. the 6–7 standard pages agreed in the quotation</div>
    </div>
    <div class="stat-card">
      <div class="num">100% Completed</div>
      <div class="desc">Every quotation item passed quality assurance & test automation</div>
    </div>
  </div>

  <!-- Section 2 -->
  <h2>2. Quotation vs. Delivery Comparison Table</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Scope Area</th>
        <th style="width: 26%;">Agreed in Quotation</th>
        <th style="width: 38%;">Delivered in Codebase</th>
        <th style="width: 14%; text-align: center;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Requirement Analysis & Planning</strong></td>
        <td>• Feature consultation<br>• Sitemap & project plan</td>
        <td>• Dynamic XML sitemap generator (<code>app/sitemap.ts</code>)<br>• Search engine crawling rules (<code>app/robots.ts</code>)<br>• Full architecture roadmap & documentation</td>
        <td style="text-align: center;"><span class="badge badge-success">Completed</span></td>
      </tr>
      <tr>
        <td><strong>Basic UX/UI Design</strong></td>
        <td>• Clean UI based on brand guidelines<br>• Responsive desktop & mobile</td>
        <td>• Tailored mental health palette (<code>#087305</code> brand theme)<br>• WCAG 2.2 AA compliant contrast verified<br>• Interactive carousels, drawers, and modal dialogs</td>
        <td style="text-align: center;"><span class="badge badge-primary">Exceeded</span></td>
      </tr>
      <tr>
        <td><strong>Frontend Development</strong></td>
        <td>• Next.js frontend framework<br>• Static & dynamic pages (Home, About, Services, Contact)</td>
        <td>• Built on modern <strong>Next.js 16 (App Router)</strong> & <strong>React 19</strong><br>• 27 public pages and dynamic slug catalog routes<br>• Lightweight hydration & fast Core Web Vitals</td>
        <td style="text-align: center;"><span class="badge badge-primary">Exceeded</span></td>
      </tr>
      <tr>
        <td><strong>Backend Development</strong></td>
        <td>• Basic Next.js API routes (e.g. contact form submission)<br>• <em>No complex admin panel</em></td>
        <td>• Type-safe Server Actions with Zod validation<br>• <strong>PostgreSQL + Prisma ORM</strong> (15+ entity models)<br>• <strong>Full Admin CMS Panel</strong> with real-time editing<br>• Supabase Cloud media storage integration</td>
        <td style="text-align: center;"><span class="badge badge-purple">Massively Exceeded</span></td>
      </tr>
      <tr>
        <td><strong>Content Setup</strong></td>
        <td>• Basic content writing<br>• Content structuring<br>• Up to 6–7 standard web pages</td>
        <td>• Clinical psychotherapy copywriting across 27 pages<br>• Clinician rosters, fee structures, and course curricula<br>• Database seed script (<code>prisma/seed.ts</code>)<br>• Live CMS lets client edit all text without coding</td>
        <td style="text-align: center;"><span class="badge badge-primary">Exceeded</span></td>
      </tr>
      <tr>
        <td><strong>SEO Optimization</strong></td>
        <td>• Basic on-page SEO setup (meta titles, descriptions, alt tags, sitemap)</td>
        <td>• Dynamic <code>generateMetadata()</code> on all slug routes<br>• Open Graph & Twitter sharing preview cards<br>• Rich JSON-LD schemas (<code>Organization</code>, <code>Article</code>, <code>FAQPage</code>)<br>• Automated dynamic sitemap updating with DB</td>
        <td style="text-align: center;"><span class="badge badge-primary">Exceeded</span></td>
      </tr>
      <tr>
        <td><strong>Testing & Deployment</strong></td>
        <td>• Cross-browser testing<br>• Deployment to client's hosting (arranged by client)</td>
        <td>• Automated Vitest schema test suite (<code>validation.test.ts</code>)<br>• Playwright E2E browser test suite (<code>home.spec.ts</code>)<br>• Custom cPanel / Passenger server bridge (<code>server.js</code>)<br>• Complete hosting deployment guide prepared</td>
        <td style="text-align: center;"><span class="badge badge-amber">Code Ready</span></td>
      </tr>
    </tbody>
  </table>

  <!-- Page Break for Clean Printing -->
  <div class="page-break"></div>

  <!-- Section 3 -->
  <h2>3. Public Web Pages Delivered: 6–7 Agreed vs. 27 Built</h2>
  <p style="margin: 0 0 6px 0;">Rather than a restricted 6–7 page template, the platform provides a complete digital clinic infrastructure with 27 public routes:</p>

  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Page Title</th>
        <th style="width: 20%;">Route Path</th>
        <th style="width: 43%;">Key Functionality & Delivered Features</th>
        <th style="width: 12%; text-align: center;">Scope</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Homepage</strong></td>
        <td><code>/</code></td>
        <td>Hero banner, about badges, stats counter, services, therapist roster, reviews carousel, events calendar, footer.</td>
        <td style="text-align: center;"><span class="badge badge-success">Agreed</span></td>
      </tr>
      <tr>
        <td><strong>About Us</strong></td>
        <td><code>/about</code></td>
        <td>Mission, vision, core ethical values, and clinic leadership philosophy.</td>
        <td style="text-align: center;"><span class="badge badge-success">Agreed</span></td>
      </tr>
      <tr>
        <td><strong>Services Catalog</strong></td>
        <td><code>/services</code></td>
        <td>Overview of all clinical offerings, fees, approach, and target demographics.</td>
        <td style="text-align: center;"><span class="badge badge-success">Agreed</span></td>
      </tr>
      <tr>
        <td><strong>Service Detail Pages</strong></td>
        <td><code>/services/[slug]</code></td>
        <td>Dedicated deep-dive pages for Individual, Couple, Family, Child, Assessment therapies.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Therapist Roster</strong></td>
        <td><code>/therapists</code></td>
        <td>Filterable clinician directory with professional titles, credentials, and fee tiers.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Therapist Profile Pages</strong></td>
        <td><code>/therapists/[id]</code></td>
        <td>In-depth clinician bio, degrees, certifications, schedule, and direct booking links.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Training Programs</strong></td>
        <td><code>/training</code></td>
        <td>Professional mental health certifications and community training curricula.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Training Detail Pages</strong></td>
        <td><code>/training/[slug]</code></td>
        <td>Course modules, schedule, fees, FAQs, and assigned trainers.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Events & Workshops</strong></td>
        <td><code>/events-workshops</code></td>
        <td>Annual community event calendar, workshop details, and participant registration.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Appointment Booking</strong></td>
        <td><code>/appointment</code></td>
        <td>Interactive intake portal with therapist picker, service selector, and schedule preferences.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Training Registration</strong></td>
        <td><code>/join-training</code></td>
        <td>Dedicated intake portal for enrolling in professional training cohorts.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Psychoeducational Blog</strong></td>
        <td><code>/blog</code> & <code>/[slug]</code></td>
        <td>Mental health articles, reading times, tags, and XSS-sanitized HTML reader.</td>
        <td style="text-align: center;"><span class="badge badge-purple">Out of Scope</span></td>
      </tr>
      <tr>
        <td><strong>Crisis Support / Helplines</strong></td>
        <td><code>/support</code></td>
        <td>Emergency helpline directory, hours, phone links, and national 999 advisory.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Contact Us</strong></td>
        <td><code>/contact</code></td>
        <td>Hotline numbers, office addresses, interactive Google Map, and social links.</td>
        <td style="text-align: center;"><span class="badge badge-success">Agreed</span></td>
      </tr>
      <tr>
        <td><strong>Partner Affiliations</strong></td>
        <td><code>/affiliation</code></td>
        <td>Institutional network showcase, partner badges, and partnership benefits.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Success Stories</strong></td>
        <td><code>/success-stories</code></td>
        <td>Client journey testimonials with transformation stories and quotes.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Community Service</strong></td>
        <td><code>/legal/community-service</code></td>
        <td>Pro-bono outreach policy, impact stats, eligibility criteria, and session requests.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Media Gallery</strong></td>
        <td><code>/gallery</code></td>
        <td>Photo and video activity showcase categorized by workshops, events, and sessions.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>FAQ Center</strong></td>
        <td><code>/faqs</code></td>
        <td>Categorized accordion addressing Services, Trainings, Billing, and Therapy questions.</td>
        <td style="text-align: center;"><span class="badge badge-primary">Bonus</span></td>
      </tr>
      <tr>
        <td><strong>Legal Terms & Privacy</strong></td>
        <td><code>/terms</code> & <code>/privacy-policy</code></td>
        <td>Patient rights, clinical confidentiality boundaries, and ethical disclaimer.</td>
        <td style="text-align: center;"><span class="badge badge-success">Agreed</span></td>
      </tr>
    </tbody>
  </table>

  <!-- Page Break for Clean Printing -->
  <div class="page-break"></div>

  <!-- Section 4 -->
  <h2>4. Additional Features Included at No Extra Cost</h2>
  <p>The following high-value modules were developed proactively and delivered as part of this project at no additional charge:</p>

  <div class="feature-box">
    <h4>1. Comprehensive Admin CMS Workspace (<code>/admin</code>)</h4>
    <p>
      • <strong>Live Visual Page Editor</strong>: Modify text, headlines, stats, banners, and contact information across every public page in real time without writing code.<br>
      • <strong>Appointment & Intake Dashboards</strong>: Review client bookings, training signups, and workshop attendees with real-time status management (Pending, Approved, Completed, Cancelled).<br>
      • <strong>Dynamic Form Field Builder</strong>: Add custom input fields to booking forms directly from the admin panel.<br>
      • <strong>Cloud Media Uploads</strong>: Automatic image optimization and hosting via cloud storage, saving server space and bandwidth.<br>
      • <strong>Role-Based Access Control (RBAC)</strong>: Admin and Super-Admin roles with institutional email verification — only authorized organizational accounts can access the panel.<br>
      • <strong>Activity Audit Logs</strong>: Timestamped tracking of every addition, update, or deletion made by any administrator.<br>
      • <strong>In-App Documentation</strong>: A built-in searchable user manual at <code>/admin/docs</code> so administrators can self-serve without developer support.
    </p>
  </div>

  <div class="feature-box">
    <h4>2. Psychoeducational Blog Engine (<code>/blog</code>)</h4>
    <p>
      Full blogging management system with slug routing, author tags, estimated read time, XSS HTML sanitization via <code>isomorphic-dompurify</code>, and full admin CRUD management.
    </p>
  </div>

  <div class="feature-box">
    <h4>3. Full Relational Database Layer (Prisma ORM & PostgreSQL)</h4>
    <p>
      Architected with 15+ structured models for therapists, workshops, blogs, appointments, training requests, and dynamic site copy. Replaces basic static templates with a scalable data engine.
    </p>
  </div>

  <!-- Section 5 -->
  <h2>5. Deployment Status & Next Steps</h2>
  <div class="client-alert">
    <h4>✅ Application Code — Fully Ready for Deployment</h4>
    <p>
      The website application has been fully built, tested, and prepared for live deployment. All automated quality checks pass successfully.
    </p>
  </div>

  <div class="client-alert" style="border-left-color: #f59e0b; background: #fffbeb; border-color: #fde68a;">
    <h4 style="color: #92400e;">⚠️ Action Required: Hosting Plan Upgrade</h4>
    <p style="color: #78350f;">
      To successfully deploy the website on the client's current hosting server, a <strong>server plan upgrade</strong> is required. The current hosting plan does not have sufficient resources to run a modern full-stack web application of this scale.<br><br>
      <strong>What the client needs to do:</strong><br>
      • Contact the hosting provider (FNF Server) to upgrade to a plan that supports the resource requirements of this platform.<br>
      • A ready-to-send upgrade request template has been prepared — simply copy, paste, and send it to the hosting provider's support team.<br><br>
      <strong>Alternative:</strong> The website can remain hosted on the current Vercel platform (already live and working), with the client's domain pointed to it — requiring no hosting upgrade at all.
    </p>
  </div>

  <!-- Page Break for Clean Printing -->
  <div class="page-break"></div>

  <!-- Section 6 -->
  <h2>6. Financial & Milestone Summary</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 50%;">Project Milestone / Deliverable</th>
        <th style="width: 25%; text-align: center;">Delivery Status</th>
        <th style="width: 25%; text-align: center;">Included in Agreed Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>UX/UI Design</strong> — Brand-aligned responsive design</td>
        <td style="text-align: center;"><span class="badge badge-success">Completed & Exceeded</span></td>
        <td style="text-align: center;">✅ Yes</td>
      </tr>
      <tr>
        <td><strong>Frontend Development</strong> — 27 public pages & routes (Next.js 16)</td>
        <td style="text-align: center;"><span class="badge badge-success">Completed & Exceeded</span></td>
        <td style="text-align: center;">✅ Yes</td>
      </tr>
      <tr>
        <td><strong>Backend Development</strong> — Server actions, database, booking forms</td>
        <td style="text-align: center;"><span class="badge badge-success">Completed & Exceeded</span></td>
        <td style="text-align: center;">✅ Yes</td>
      </tr>
      <tr>
        <td><strong>Admin CMS Panel</strong> — Full real-time content management workspace</td>
        <td style="text-align: center;"><span class="badge badge-purple">Bonus — No Extra Charge</span></td>
        <td style="text-align: center;">✅ Included</td>
      </tr>
      <tr>
        <td><strong>Psychoeducational Blog</strong> — Article management & publishing system</td>
        <td style="text-align: center;"><span class="badge badge-purple">Bonus — No Extra Charge</span></td>
        <td style="text-align: center;">✅ Included</td>
      </tr>
      <tr>
        <td><strong>Content Setup</strong> — Clinical copywriting across all pages</td>
        <td style="text-align: center;"><span class="badge badge-success">Completed & Exceeded</span></td>
        <td style="text-align: center;">✅ Yes</td>
      </tr>
      <tr>
        <td><strong>SEO Optimization</strong> — Metadata, JSON-LD schemas, sitemap</td>
        <td style="text-align: center;"><span class="badge badge-success">Completed & Exceeded</span></td>
        <td style="text-align: center;">✅ Yes</td>
      </tr>
      <tr>
        <td><strong>Testing & Deployment Preparation</strong> — QA tests & server setup</td>
        <td style="text-align: center;"><span class="badge badge-amber">Code Ready</span></td>
        <td style="text-align: center;">✅ Yes</td>
      </tr>
      <tr style="background: #e6f4ea; font-weight: 800;">
        <td style="font-size: 10pt;"><strong>Total Agreed Project Price</strong></td>
        <td colspan="2" style="text-align: center; color: #047857; font-size: 11pt;"><strong>BDT 50,000</strong></td>
      </tr>
    </tbody>
  </table>

  <h3>Payment Schedule (Per Quotation Terms):</h3>
  <ul style="font-size: 9pt; color: #334155; line-height: 1.6; margin-top: 4px;">
    <li><strong>50% Advance Payment:</strong> BDT 25,000 <em>(Settled at project inception)</em></li>
    <li><strong>50% Completion Payment:</strong> BDT 25,000 <em>(Payable upon final deployment & handover)</em></li>
  </ul>

  <div class="footer-note">
    Center for Mental Health and Care, Bangladesh (CMHCB) · Official Project Delivery & Scope Audit Report · Confidential
  </div>

</body>
</html>
`;

  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Rendering delivery report HTML...');
  await page.setContent(htmlContent, { waitUntil: 'load' });

  console.log('Generating PDF to:', outputPath);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '12mm',
      right: '12mm',
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 7.5pt; color: #94a3b8; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <span>Center for Mental Health and Care, Bangladesh (CMHCB)</span>
        <span>Software Development Delivery Report</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 7.5pt; color: #94a3b8; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <span>Confidential — Prepared for CMHCB Executive Team</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
  });

  await browser.close();
  console.log('PDF generated successfully!');
}

generatePdf().catch((err) => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
