# Production Deployment Settings Verification Guide

Follow these checklist items to configure and verify your production email and database settings when launching the site on your live hosting platform (e.g., Vercel) and Supabase.

---

## 1. Environment Variables Configuration (Vercel/Hosting Platform)

Verify that the following variables are configured under your hosting platform's **Environment Variables** settings page:

| Variable Name | Production Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` | Transaction pool connection string from Supabase (typically port 6543 with PgBouncer). |
| `APP_URL` | `https://www.cmhcbd.com` | Your live custom production domain (no trailing slash). |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[project-id].supabase.co` | Production Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Production Supabase public anonymous key. |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Production Supabase service role key (keep secret, never expose to frontend). |

---

## 2. Supabase Authentication & SMTP Settings

By default, Supabase projects use a built-in email provider with a rate limit of 3 emails per hour. For production, you **must** configure a custom SMTP server.

### A. Setup Custom SMTP
1. Navigate to the [Supabase Dashboard](https://supabase.com/dashboard) and open your project.
2. Go to **Settings** -> **Auth** -> scroll down to **SMTP Settings**.
3. Toggle **Enable Custom SMTP** on.
4. Enter the details from your transactional email provider (such as Resend, SendGrid, Mailgun, or Amazon SES):
   - **Sender Email**: `noreply@cmhcbd.com` (must be authenticated on your email service provider).
   - **Sender Name**: `Center for Mental Health and Care Bangladesh`
   - **SMTP Provider Host**: e.g., `smtp.resend.com`
   - **Port**: `587` (TLS) or `465` (SSL)
   - **SMTP Username**: e.g., `resend`
   - **SMTP Password**: Your email API key / SMTP password.

### B. Configure Redirect URLs
1. Navigate to **Settings** -> **Auth** -> **URL Configuration**.
2. Update the **Site URL** to `https://www.cmhcbd.com` (or your chosen production domain).
3. In **Redirect URLs**, add the wildcard patterns to allow redirection back to the admin dashboard:
   - `https://www.cmhcbd.com/**`
   - `https://cmhcbd.com/**`

### C. Verify Email Templates
1. Go to **Authentication** -> **Email Templates**.
2. Verify that **Confirm Signup**, **Reset Password**, and **Change Email** templates are active.
3. Verify that the redirect links in templates resolve correctly using `{{ .ConfirmationURL }}` rather than hardcoded URLs.

---

## 3. Row-Level Security (RLS) & Media Storage Policies

Ensure that client-side file uploads and database records are secure.

### A. Database Table RLS
1. Go to **Authentication** -> **Policies** (or **Database** -> **Policies**).
2. For public intake tables (`Appointment`, `TrainingRequest`, `WorkshopRegistration`):
   - **Insert (Public)**: Allow public anonymous insertion (`true` or `public` access) so visitors can submit forms.
   - **Read/Write/Delete (Admin)**: Restrict actions only to users whose email exists in the `AdminProfile` whitelist database.

### B. Storage Buckets (Media Uploads)
1. Go to **Storage** -> **Buckets** in your Supabase project.
2. Select the `cmhcb-media` bucket.
3. Click **Policies** on the sidebar.
4. Ensure the following rules are active:
   - **Read Policies**: Allow public read access to everyone (`public` bucket is active).
   - **Write/Upload Policies**: Restrict upload privileges to authorized administrative users only. A template policy:
     ```sql
     (bucket_id = 'cmhcb-media'::text) AND (auth.role() = 'authenticated'::text)
     ```
   - **Delete Policies**: Allow delete access only to authenticated administrators.

---

## 4. Domain Name DNS Records (Email Deliverability)

To prevent password recovery and notification emails from going to users' spam/junk folders, set up the following TXT records at your domain registrar (e.g., Cloudflare, Namecheap):

- **SPF Record**:
  - Name: `@`
  - Value: `v=spf1 include:[your-email-provider-domain] ~all`
- **DKIM Record**:
  - Add the specific CNAME / TXT keys provided by your SMTP host (e.g., Resend or SendGrid).
- **DMARC Record** (Highly Recommended):
  - Name: `_dmarc`
  - Value: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc-reports@cmhcbd.com`
