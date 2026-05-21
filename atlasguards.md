[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/your-org/atlasguards)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# AtlasGuards

> Secure digital release management for media professionals

A secure digital release management platform for media professionals. Capture legally-binding guest releases with biometric signatures, store them securely, and verify authenticity anytime.

## What It Does

AtlasGuards helps media professionals collect and manage guest release agreements digitally. Hosts create shows/properties, invite guests to sign releases via magic links, and store signed PDFs securely.

### How It Works

1. **Host creates a show** (media property)
2. **Host invites guests** via email or shareable link
3. **Guest signs** via biometric signature pad
4. **PDF is generated** and stored securely
5. **Verification** - anyone can verify release authenticity

## Tech Stack
TESTTING TESTING
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend**: Next.js Server Actions, Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Paddle (Subscription billing)
- **Email**: Resend
- **PDF**: pdf-lib
- **Testing**: Jest, Playwright
- **Error Tracking**: Sentry
- **Rate Limiting**: Upstash Redis

## Getting Started

### Prerequisites

- Node.js 18+ (works with 20+)
- npm
- Supabase account (free tier works for dev)
- Paddle sandbox account (free)
- Resend account (free: 100 emails/month)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/your-org/atlasguards.git
cd atlasguards
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

4. **Configure your environment variables** (see Environment Variables section below)

5. **Set up the Supabase database:**

   a. Create a new project at [supabase.com](https://supabase.com)
   
   b. Go to **SQL Editor** and run:
   ```sql
   -- Run contents of supabase/migrations/000_INITIAL_SCHEMA_DESTRUCTIVE.sql
   -- ⚠️ WARNING: This wipes all existing data! Fresh installs only.
   ```
   
   c. Go to **Authentication → Providers** and enable Email provider
   
   d. Go to **Storage** and create bucket: `signed-agreements`

6. **Start development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Database Setup

**⚠️ WARNING: The file `supabase/migrations/000_INITIAL_SCHEMA_DESTRUCTIVE.sql` wipes all existing data. Use only for fresh installs. Do NOT run on a production database with live user data.**

The database requires one SQL file to be applied:

1. **000_INITIAL_SCHEMA_DESTRUCTIVE.sql** - Creates all tables and RLS policies:
   - `shows` - Media properties
   - `releases` - Guest releases
   - `profiles` - User billing info
   - `signature_ledger` - Anti-exploit tracking
   - `processed_events` - Webhook idempotency

Run this in Supabase Dashboard → SQL Editor

**For production databases with existing data:** Create incremental migration files instead (e.g., `001_add_column.sql`, `002_add_index.sql`). Never run the destructive schema file on production.

## Environment Variables

### Where to Find Each Variable

#### Supabase
1. Go to [supabase.com](https://supabase.com) → Your Project → Settings → API
2. **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **service_role** key (click "reveal") → `SUPABASE_SERVICE_ROLE_KEY`

**⚠️ Important:** Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code!

#### Resend
1. Go to [resend.com](https://resend.com) → API Keys
2. Create API key → `RESEND_API_KEY`
3. Verify your domain or use default `resend.dev` emails

#### Paddle (Payments)
1. Go to [paddle.com](https://paddle.com) → Developer Tools

2. **Environment Toggle** - Use "Sandbox" for testing, "Live" for production

3. **Client-side Token** → `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
   - Found in: Developer Tools → Client-side tokens

4. **API Key** → `PADDLE_API_KEY`
   - Found in: Developer Tools → API keys

5. **Webhook Signing Secret** → `PADDLE_WEBHOOK_SECRET`
   - Found in: Developer Tools → Webhooks → Your webhook → Signing secret

6. **Price IDs** → `NEXT_PUBLIC_PADDLE_PRICE_PRO/AGENCY`
   - Found in: Product Catalog → Your products → Price ID

#### Sentry (Optional - Error Tracking)
1. Go to [sentry.io](https://sentry.io) → Your Project → Settings → Client Keys (DSN)
2. Copy the DSN URL → `NEXT_PUBLIC_SENTRY_DSN`

#### Upstash Redis (Optional - Rate Limiting)
1. Go to [upstash.com](https://upstash.com) → Console → Redis
2. Create database → Copy REST URL and Token

### Required Variables

```env
# App
NEXT_PUBLIC_SITE_URL=https://atlasguards.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Paddle (Payments)
PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=your-client-token
PADDLE_API_KEY=your-api-key
PADDLE_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_PADDLE_PRICE_PRO=pri_your-pro-price-id
NEXT_PUBLIC_PADDLE_PRICE_AGENCY=your-agency-price-id

# Resend (Email)
RESEND_API_KEY=re_your-api-key
RESEND_FROM=AtlasGuards <support@atlasguards.com>
```

### Optional Variables

```env
# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# Upstash (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## Project Structure

```
src/
├── actions/           # Server Actions
│   ├── auth.ts       # Authentication actions
│   ├── billing.ts    # Billing actions
│   ├── releases.ts   # Release management
│   └── shows.ts      # Show management
├── app/              # Next.js App Router
│   ├── (auth)/       # Auth pages
│   ├── (public)/     # Public pages
│   ├── api/          # API routes
│   │   └── webhooks/ # Webhook handlers
│   └── dashboard/    # Protected dashboard
├── components/       # React components
│   ├── billing/      # Billing components
│   ├── navigation/  # Nav components
│   ├── releases/    # Release components
│   └── ui/          # UI primitives
└── lib/             # Utilities
    ├── constants/   # Constants (tiers, etc.)
    ├── pdf/         # PDF generation
    ├── services/    # External services
    ├── supabase/    # Supabase clients
    └── validations/ # Zod schemas
```

## Tier System

| Feature | ESTABLISH (Free) | PROFESSIONAL ($14.99/mo) | AGENCY ($39.99/mo) |
|---------|------------------|--------------------------|---------------------|
| Vault Limit | 3/30 days | 20/30 days | 200/30 days |
| Media Properties | 1 | 3 | 15 |
| PDF | Watermarked | Clean | Clean |
| Email Dispatch | Manual | Direct | Direct |
| Reminders | ❌ | ❌ | Automated |
| Verification | ✅ | ✅ | ✅ |

## Testing

### Running Tests

```bash
# Run all unit tests (Jest)
npm test

# Run all E2E tests (Playwright)
npm run test:e2e

# Run specific test file
npm test -- --testPathPattern=shows.test

# Run tests in watch mode
npm test -- --watch

# Run E2E tests with UI (interactive)
npm run test:e2e -- --ui
```

### Test Structure

```
src/
├── actions/          # Server action tests
├── lib/
│   ├── constants/   # Tier config tests
│   ├── pdf/         # PDF generation tests
│   ├── supabase/    # Database/client tests
│   ├── validations/ # Schema validation tests
│   └── utils/       # Utility function tests
└── app/
    └── api/
        └── webhooks/
            └── paddle/  # Webhook handler tests
e2e/                   # E2E tests (Playwright)
```

### Test Coverage

| Type | Count | Description |
|------|-------|-------------|
| Unit Tests | 195 | Business logic, validation, utilities |
| E2E Tests | 339 | Full user flows |
| **Total** | **534** | **Unit tests passing, some E2E need updates** |

### Test Types

#### Unit Tests (Jest)
- **Validation** - Zod schemas for forms
- **Business Logic** - Tier limits, billing rules
- **Utilities** - Slugify, formatting
- **Constants** - Tier configuration

#### E2E Tests (Playwright)
- **Auth** - Login, signup, password reset
- **Guest Flow** - Signature submission
- **Dashboard** - Show management, releases
- **Billing** - Pricing, upgrades, webhooks

### Writing Tests

#### Unit Test Example
```typescript
import { ShowSchema } from '@/lib/validations/show';

describe('Show Validation', () => {
  test('should validate show name', () => {
    const result = ShowSchema.safeParse({ name: 'My Show' });
    expect(result.success).toBe(true);
  });
});
```

#### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('should load pricing page', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.getByRole('heading', { name: 'PRICING' })).toBeVisible();
});
```

### CI/CD Integration

#### GitHub Actions (Example)
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
```

### Troubleshooting

**Tests fail with "SUPABASE_SERVICE_ROLE_KEY not set"**
- Ensure `.env.local` has the key
- Run `npm test` from project root

**E2E tests timeout**
- Check dev server is running (`npm run dev`)
- Increase timeout in `playwright.config.ts`

**Port already in use**
- Kill process on port 3000: `lsof -ti:3000 | xargs kill`

## API Endpoints

### Public Routes
- `GET /` - Landing page
- `GET /pricing` - Pricing page
- `GET /protocol` - How it works
- `GET /guest/[uuid]` - Guest signature page

### Protected Routes (Dashboard)
- `GET /dashboard` - User dashboard
- `GET /dashboard/[id]` - Show details
- `GET /dashboard/billing` - Billing management

### API Routes
- `POST /api/webhooks/paddle` - Paddle webhooks
- `GET /api/user/tier` - Get user tier

## Security

- Row Level Security (RLS) policies on all tables
- Rate limiting on signature submissions
- CSRF protection via Next.js
- Secure HTTP-only cookies for sessions
- Input validation via Zod schemas

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
vercel --prod
```

## License

MIT License - see LICENSE file for details.

## Support

- Email: support@atlasguards.com
- Website: https://atlasguards.com
