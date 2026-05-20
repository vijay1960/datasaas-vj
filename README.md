# DataSaaS - Task Management Platform

AI-powered task management SaaS with payment integration and admin approval system.

## Features

- **Free 3-day trial** for new users
- **Payment methods**: PayPal, Bank Transfer (Bankmuscat), Stripe
- **Admin approval flow** via WhatsApp receipt verification
- **Monthly plan**: $50/month (1 month access)
- **Lifetime plan**: $199 one-time (forever access)
- **Dark mode** UI with task management (Table/Kanban/List views)

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions (Node.js)
- **Auth**: JWT tokens + bcrypt password hashing
- **Database**: JSON file storage (upgrade to Supabase/Neon for production)

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

### Admin Login
- **Email**: `Vijayaraghavan1960@gmail.com`
- **Password**: `admin123`

## Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/datasaas.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Vercel auto-detects Vite + React
5. Click **"Deploy"**

### Step 3: Set Environment Variables

Go to Project Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `JWT_SECRET` | Your secure random string |

### Step 4: Redeploy

After adding environment variables, trigger a redeploy.

## Payment Flow

1. User signs up → gets 3-day free trial
2. Trial expires → redirected to `/payment` page
3. User pays via PayPal, IBAN, or Stripe
4. User sends receipt via WhatsApp to **968-99061298**
5. Admin reviews in `/admin` dashboard
6. Admin approves → subscription activated

## Payment Info (Customer View - Masked)

| Method | Details |
|--------|---------|
| PayPal | Vijayaraghavan1960@gmail.com |
| IBAN (Bankmuscat) | OM76xxxxxxxxx520018 |
| Stripe | pk_test_51T9gQs1y89aWCXv8xxxxxxxx...Vfz |
| WhatsApp | 968-99061298 |

**Full details** only visible in Admin Dashboard → Payment Config tab.

## Security

- JWT authentication on all API routes
- Admin-only access to `/admin` routes
- Stripe key & IBAN masked for customers
- Password hashing with bcrypt
- Route protection based on subscription status
- Customers can only access frontend payment page, NOT backend

## API Endpoints

### Public
- `POST /api/auth/register` - Register (3-day trial)
- `POST /api/auth/login` - Login

### Protected
- `GET /api/auth/me` - Current user
- `POST /api/payment/submit` - Submit payment receipt
- `GET /api/payment/status` - Subscription status
- `GET /api/payment/my-receipts` - User receipts

### Admin Only
- `GET /api/admin/dashboard` - Stats
- `GET /api/admin/receipts` - All receipts
- `POST /api/admin/receipts/approve?id=X` - Approve
- `POST /api/admin/receipts/reject?id=X` - Reject
- `GET /api/admin/users` - User list
- `GET /api/admin/config` - Payment config (full keys)

## License

© 2026 DataSaaS. All rights reserved.
