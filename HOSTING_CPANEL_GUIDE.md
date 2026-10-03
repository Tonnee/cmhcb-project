# cPanel Deployment & Upgrade Guide for `cmhcb-project` (Option B)

This document provides the complete roadmap and step-by-step instructions for upgrading your hosting package and deploying this **Next.js 16 (App Router)** platform to your **FNF Server cPanel** account.

---

## 1. Quick Access: How to Access Your cPanel Right Now

Because the domain `cmhcb.com` currently points to Vercel, trying to visit `https://cmhcb.com:2083` or `https://cmhcb.com/cpanel` will fail or time out. 

Use either of these direct server links to log in:

* **Primary (Recommended - Valid SSL):**  
  👉 **[https://fnfserver.com:2083](https://fnfserver.com:2083)**
* **Direct Server IP:**  
  👉 **[https://207.180.236.237:2083](https://207.180.236.237:2083)**  
  *(If your browser displays an SSL warning on the IP address, click "Advanced" → "Proceed / Accept Risk")*.

### Your Current Server Profile
* **cPanel Username:** `cmhcb`
* **Home Directory:** `/home/cmhcb`
* **Shared IP:** `207.180.236.237`
* **Current Package:** `xyzfnfhost_PACKX-512-MB` (512 MB RAM limit — requires upgrade)

---

## 2. Phase 1: Upgrading Your Hosting Package (Pre-Requisite)

Your current plan caps RAM at **512 MB**, which will cause `npm run build` or Prisma generation to crash with **`Exit Code 137 (Out of Memory)`**. 

Before deploying, contact **FNF Server Support** or submit a support ticket to upgrade your plan:

### Support Ticket Copy-Paste Template:
> **Subject:** Plan Upgrade Request for cmhcb (Node.js 20+ & 2GB+ RAM)  
>  
> **Message:**  
> Hello FNF Server Support,  
>  
> I am hosting a Next.js full-stack application on my cPanel account (`cmhcb`). My current package is `xyzfnfhost_PACKX-512-MB`.  
>  
> I would like to upgrade my account to a package with:  
> 1. **At least 2 GB (2048 MB) RAM limit** (4 GB preferred if available).  
> 2. **Node.js 20.x or 22.x LTS** enabled in the CloudLinux "Setup Node.js App" selector.  
> 3. Sufficient Entry Processes (EP $\ge$ 50) and Inode allowance.  
>  
> Please let me know the available package options, upgrade costs, and payment procedure.  
>  
> Thank you,  
> CMHCB Team

---

## 3. Phase 2: Architecture & Database Strategy

To ensure optimal performance and avoid exhausting your cPanel memory limits:

1. **Keep Database on Supabase:**  
   Keep your PostgreSQL database hosted on **Supabase**. Do not run a local PostgreSQL instance inside cPanel. Supabase handles database connection pooling, backups, and security independently.
2. **Keep Media on Supabase Storage:**  
   The admin panel uploads photos (therapists, hero banners, trainings) directly to Supabase Storage buckets, saving cPanel disk space and bandwidth.

---

## 4. Phase 3: Project Preparation

A custom entry point file ([server.js](file:///f:/cmhcb-project/server.js)) has already been added to your project root. This bridges cPanel's **Phusion Passenger** reverse proxy with the Next.js App Router engine:

```javascript
// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;
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
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
```

---

## 5. Phase 4: Step-by-Step cPanel Deployment

Once FNF Server completes your plan upgrade:

### Step 1: Upload Project Files
1. Log into cPanel via **[https://fnfserver.com:2083](https://fnfserver.com:2083)**.
2. Open **File Manager**.
3. Create a folder in your home root named `cmhcb-app` (Path: `/home/cmhcb/cmhcb-app`).  
   *(⚠️ Do **not** place your project code directly inside `public_html`).*
4. Upload your project files (via File Manager ZIP upload, FTP, or Git Version Control in cPanel).
   * **Files to upload:** `app/`, `components/`, `data/`, `features/`, `lib/`, `prisma/`, `public/`, `types/`, `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`, `server.js`.
   * **Do NOT upload:** `node_modules` or `.git`.

---

### Step 2: Configure the Node.js App in cPanel
1. In cPanel, navigate to the **Software** section and click **Setup Node.js App**.
2. Click **Create Application**.
3. Configure the following fields:
   * **Node.js version:** Select `20.x` (or `22.x`).
   * **Application mode:** `Production`.
   * **Application root:** `cmhcb-app`
   * **Application URL:** Select `cmhcb.com` (or a subdomain like `stage.cmhcb.com` for testing).
   * **Application startup file:** `server.js`
4. Click **Create** (at the top right).

---

### Step 3: Add Environment Variables in cPanel
Under the Node.js App settings, scroll to the **Environment variables** section and click **Add Variable** for each:

| Variable Name | Value / Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | Your Supabase pooled PostgreSQL URL (`postgresql://postgres:[PASSWORD]@...:6543/postgres?pgbouncer=true`) |
| `DIRECT_URL` | Your Supabase direct PostgreSQL URL (`postgresql://postgres:[PASSWORD]@...:5432/postgres`) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[YOUR_PROJECT_ID].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Your Supabase Anon Public Key)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Your Supabase Service Role Key)* |
| `APP_URL` | `https://www.cmhcb.com` |

Click **Save**.

---

### Step 4: Install Dependencies & Build Application
1. In cPanel, open the **Terminal** tool (under the **Advanced** section).
2. Copy the virtual environment command shown at the top of your "Setup Node.js App" page (it looks like `source /home/cmhcb/nodevenv/cmhcb-app/20/bin/activate && cd /home/cmhcb/cmhcb-app`).
3. Paste and run it in the Terminal.
4. Run the installation and build commands:
   ```bash
   # Install dependencies
   npm install

   # Generate Prisma client for database models
   npx prisma generate

   # Build Next.js production bundle
   npm run build
   ```

---

### Step 5: Start & Verify the Application
1. Go back to **Setup Node.js App** in cPanel.
2. Click **Restart** or **Run JS App**.
3. If everything started correctly, the status will show green with **Running**.

---

## 6. Phase 5: Domain DNS Cutover (Pointing `cmhcb.com` to cPanel)

Currently, `cmhcb.com` is pointed to Vercel (`216.198.79.1`). When you are ready to switch live traffic over to your cPanel server:

1. In cPanel, open **Zone Editor** (under the **Domains** section).
2. Find `cmhcb.com`:
   * Change the **A Record** for `cmhcb.com` from `216.198.79.1` to `207.180.236.237`.
   * Ensure `www.cmhcb.com` also points to `207.180.236.237` (or CNAME to `cmhcb.com`).
3. Check the **SSL/TLS Status** in cPanel and click **Run AutoSSL** to issue a free Let's Encrypt / cPanel SSL certificate.

---

## 7. Operational Cheatsheet & Troubleshooting

* **Restarting after updates:** Whenever you make code changes, run `npm run build` in Terminal and click **Restart Application** in the Node.js App interface.
* **Logs & Errors:** If the application ever shows a 500 error or fails to start, check the logs located in `/home/cmhcb/cmhcb-app/` (`stderr.log` and `stdout.log`).
* **Memory Limit Workaround:** If building on the server ever runs low on RAM during heavy traffic, build locally on your PC (`npm run build`) and upload the compiled `.next` folder to `/home/cmhcb/cmhcb-app/.next`.
