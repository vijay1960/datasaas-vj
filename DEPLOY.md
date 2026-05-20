# DataSaaS - Complete Deployment Guide

## Step 1: Push to GitHub

Open PowerShell and run these commands:

```powershell
cd C:\datasaas-deploy
git init
git add .
git commit -m "DataSaaS - Task Management with Payment Integration"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/datasaas.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `datasaas` with your repo name.

Create the repo first at: https://github.com/new

## Step 2: Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Find and import your `datasaas` repository
4. Vercel auto-detects Vite + React settings
5. Click **"Deploy"**

## Step 3: Set Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

| Key | Value |
|-----|-------|
| `JWT_SECRET` | `datasaas-jwt-secret-2026-vijay-secure-key` |

Click **Save** then **Redeploy**.

## Step 4: Test Your Deployment

Visit your Vercel URL (e.g., `https://datasaas-yourname.vercel.app`)

- Register a new account → get 3-day free trial
- Admin login: `Vijayaraghavan1960@gmail.com` / `admin123`

## Payment Flow Summary

1. **Customer signs up** → 3-day free trial starts
2. **Trial expires** → Customer redirected to `/payment` page
3. **Customer sees masked payment info**:
   - PayPal: `Vijayaraghavan1960@gmail.com`
   - IBAN: `OM76xxxxxxxxx520018` (Bankmuscat)
   - Stripe: `pk_test_51T9gQs1y89aWCXv8xxxxxxxx...Vfz`
   - WhatsApp: `968-99061298`
4. **Customer pays** using any method
5. **Customer sends receipt** to WhatsApp `968-99061298`
6. **Customer clicks "I've Sent Payment"** on the payment page
7. **Admin reviews** in `/admin` → Payment Receipts tab
8. **Admin approves** → System activates subscription:
   - Monthly: $50 → 1 month access
   - Lifetime: $199 → forever access

## Security

- Customers CANNOT access `/admin` (JWT role check)
- Stripe key & IBAN are **masked** on customer-facing pages
- **Full payment details** only visible in Admin Dashboard → Payment Config
- All API routes protected with JWT tokens
- Passwords hashed with bcrypt

## File Structure

```
datasaas-deploy/
├── api/                    # Vercel serverless functions
│   ├── auth/               # register.js, login.js, me.js
│   ├── payment/            # submit.js, status.js, my-receipts.js
│   ├── admin/              # dashboard.js, receipts.js, users.js, config.js
│   │   └── receipts/[id]/  # approve.js, reject.js
│   ── lib/                # db.js, auth.js
├── src/                    # React frontend
│   ├── pages/              # Landing, Login, Payment, Dashboard, etc.
│   ├── components/         # Navbar, Sidebar, TaskTable, etc.
│   ├── context/            # AuthContext.jsx
│   ├── hooks/              # useTheme, useTasks, useFilters
│   ├── data/               # sampleData.js
│   └── utils/              # csvExport.js
├── vercel.json             # Vercel config
├── package.json
├── vite.config.js
── tailwind.config.js
└── README.md
```

## Troubleshooting

**Build fails**: Run `npm install` then `npm run build`

**API 404 errors**: Check Vercel deployment logs, ensure `api/` folder is included

**Auth not working**: Verify `JWT_SECRET` environment variable is set in Vercel

**Database not persisting**: JSON file storage resets on cold starts. For production, migrate to Supabase or Neon PostgreSQL.
