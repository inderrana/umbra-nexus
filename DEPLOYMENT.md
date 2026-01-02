# Serverless Deployment

## Email Capture Setup

The site now captures emails securely via serverless functions.

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Run locally:
```bash
npm run dev
```

Access at: http://localhost:3000

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. For production:
```bash
npm run deploy
```

### Deploy to Netlify

1. Create `netlify.toml`:
```toml
[build]
  functions = "api"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. Deploy via Netlify CLI or connect GitHub repo

### Email Storage Options

Edit `api/submit-email.js` to enable:

**Option 1: Email Notification**
- Uncomment SendGrid code
- Add `SENDGRID_API_KEY` to environment variables

**Option 2: Database Storage**
- Uncomment Supabase/MongoDB code
- Add database credentials to environment variables

**Option 3: Google Sheets**
- Use Google Sheets API
- Add credentials to environment variables

**Option 4: Simple Logging**
- Emails logged to console by default
- In production, Vercel logs are accessible in dashboard

### Environment Variables (Vercel)

Add in Vercel dashboard: Settings → Environment Variables

```
ADMIN_EMAIL=your-email@example.com
SENDGRID_API_KEY=your-key (optional)
SUPABASE_URL=your-url (optional)
SUPABASE_KEY=your-key (optional)
```

### Testing

Submit an email via the apply page. Check:
- Vercel dashboard → Functions → Logs
- Or your configured storage (database/email/sheets)

---

## UI Features

The UI remains completely unchanged:
- Same minimalist black aesthetic
- Same mysterious navigation
- All secret features still work
- Email submission happens seamlessly in background

### What Changed:
- ✅ Email now sent to serverless API
- ✅ Validates email format
- ✅ Logs timestamp and IP
- ✅ Same user experience
- ✅ Same mysterious behavior on submission
