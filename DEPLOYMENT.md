# Vercel Deployment Guide — YHAM

## Prerequisites

- A [Vercel](https://vercel.com) account
- The GitHub repo `YHAM-26` pushed (see below)
- Neon PostgreSQL database (already configured)
- Cloudinary account (already configured)

---

## Step 1: Import Project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select the `YHAM-26` repository
4. Framework Preset will auto-detect **Next.js**

---

## Step 2: Configure Environment Variables

In the Vercel project settings → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:...@ep-shy-mode-ao48v3n6-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require` |
| `DATABASE_URL_UNPOOLED` | `postgresql://neondb_owner:...@ep-shy-mode-ao48v3n6.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
| `CLOUDINARY_CLOUD_NAME` | `ds8xvoub8` |
| `CLOUDINARY_API_KEY` | `545693256635473` |
| `CLOUDINARY_API_SECRET` | `lg42PhKzlGE0MBc-lL1SydMOtrc` |
| `AUTH_SECRET` | (generate a random string for production) |

> Copy the full connection strings from your `.env` file. Do NOT commit `.env` to git.

---

## Step 3: Build Settings

These are already configured in `vercel.json`, but verify:

- **Framework**: Next.js
- **Build Command**: `prisma generate && next build`
- **Install Command**: `bun install`
- **Output Directory**: `.next`

---

## Step 4: Deploy

Click **Deploy**. Vercel will:
1. Install dependencies with `bun install`
2. Run `prisma generate` to create the Prisma client
3. Run `next build` to build the Next.js app
4. Deploy to the edge

---

## Step 5: Post-Deployment

1. Visit your deployed URL
2. Go to `/admin` and log in with `admin@yham.org` / `admin123`
3. **Change the default password immediately** in production
4. Click "Seed Data" in the Site Builder to populate default content
5. Upload leader images via the admin panel

---

## Custom Domain (Optional)

1. Go to Vercel Project → **Settings** → **Domains**
2. Add your domain (e.g., `yham.org`)
3. Update DNS records as instructed by Vercel

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails with Prisma error | Ensure `DATABASE_URL` env var is set in Vercel |
| Images not loading | Verify `CLOUDINARY_CLOUD_NAME` is set |
| Login not working | Check `DATABASE_URL` connects to Neon; run seed |
| 500 errors on API routes | Check Vercel function logs for details |

---

## Architecture

```
Next.js App (Vercel Serverless)
    ├── Frontend (Static + SSR)
    ├── API Routes (Serverless Functions)
    ├── Prisma ORM → Neon PostgreSQL
    └── Media Upload → Cloudinary CDN
```
