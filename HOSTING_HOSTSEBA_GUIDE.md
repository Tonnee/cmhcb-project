# HostSeba MERN Stack Hosting Guide for `cmhcb-project`

This document details the compatibility, prerequisites, memory requirements, and step-by-step setup instructions for hosting this Next.js project on **HostSeba MERN Stack Hosting**.

---

## 1. Tech Stack & Compatibility Matrix

| Requirement | Project Specification (`cmhcb-project`) | HostSeba MERN Stack Hosting | Status |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js 16** (App Router, React 19) | Node.js & Next.js supported | ✅ Compatible |
| **Runtime** | **Node.js 20+** | Node.js version selector in Webuzo | ✅ Compatible (Select Node.js 20+) |
| **Database** | **PostgreSQL** (Prisma ORM & Supabase) | PostgreSQL & MongoDB supported | ✅ Compatible |
| **Control Panel** | Webuzo / cPanel | Webuzo Control Panel | ✅ Compatible |

---

## 2. Key Prerequisites & Planning

### 2.1 Plan & Memory (RAM) Selection ⚠️
* The entry-level **MERN Basic** package offers **1 GB RAM** and **1 CPU Core**.
* **Next.js 16** server builds (`next build`) and Prisma Client compilation (`prisma generate`) are memory-intensive. Running `npm run build` directly on a 1 GB RAM shared server may trigger Out-Of-Memory (OOM) errors.
* **Recommendations:**
  * **Option A (Build directly on Server):** Purchase at least the **MERN Standard** or **MERN Pro** plan (which provides 2 GB to 4 GB RAM).
  * **Option B (Local/CI Build Deployment):** Build your application on your local machine or GitHub Actions (`npm run build`), then upload the generated `.next` folder and `node_modules` to HostSeba.

---

## 3. Database Configuration Options

Your application uses Prisma ORM connected to PostgreSQL (`prisma/schema.prisma`):

### Option A: External Supabase PostgreSQL (Recommended)
Keep your existing database hosted on Supabase and pass your connection environment variables into Webuzo:
* `DATABASE_URL`
* `DIRECT_URL`
* `NEXT_PUBLIC_SUPABASE_URL`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`
* `SUPABASE_SERVICE_ROLE_KEY`

### Option B: HostSeba Managed PostgreSQL
1. Create a PostgreSQL database and user via the Webuzo Control Panel.
2. Update your `.env` file with the HostSeba database credentials:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
   DIRECT_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
   ```
3. Run Prisma migrations on the server via SSH / Webuzo Terminal:
   ```bash
   npx prisma db push
   npx ts-node prisma/seed.ts
   ```

---

## 4. Webuzo Control Panel Setup (Step-by-Step)

HostSeba shared hosting runs Node.js applications through **Webuzo Node.js Manager (Phusion Passenger / Nginx reverse proxy)**.

### Step 1: Create Node.js Application
1. Log in to your HostSeba Webuzo Control Panel.
2. Search for and open **Setup Node.js App**.
3. Click **Create Application**.
4. Configure the settings:
   * **Node.js Version:** Select **20.x** (or highest available 20+).
   * **Application Mode:** `Production`
   * **Application Root:** `cmhcb-project` (or public_html directory where files are placed).
   * **Application URL:** Your domain name (e.g. `cmhcbd.com`).
   * **Application Startup File:** `server.js`

### Step 2: Configure Environment Variables
In the Webuzo Node.js App settings interface, add all environment variables specified in `.env.example`:
* `NODE_ENV=production`
* `PORT=3000`
* `DATABASE_URL=...`
* `DIRECT_URL=...`
* `NEXT_PUBLIC_SUPABASE_URL=...`
* `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
* `SUPABASE_SERVICE_ROLE_KEY=...`

### Step 3: Create Custom `server.js` (Wrapper for Next.js App Router)
Create a `server.js` file at the root of your project directory for Phusion Passenger to boot your Next.js server:

```javascript
// server.js
const { createServer } = require('http');
const parse = require('url').parse;
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

### Step 4: Install Dependencies & Build
Run the following commands in Webuzo Terminal or SSH in the application directory:

```bash
npm install
npx prisma generate
npm run build
```

### Step 5: Start & Verify
In Webuzo **Setup Node.js App**, click **Restart Application** or **Run JS App**. Visit your domain in the browser to verify the site is up and running.
