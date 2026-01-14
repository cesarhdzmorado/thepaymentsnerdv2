# The Payments Nerd

An AI-powered daily newsletter delivering curated payments industry news, insights, and analysis.

## Overview

The Payments Nerd is an automated newsletter platform that uses AI to discover, curate, and summarize the latest news in the payments industry. The system generates daily newsletters with trending topics, company updates, and industry insights, delivered directly to subscribers' inboxes.

**Live Site:** https://thepaymentsnerd.co

## Features

- **AI-Powered Content Generation:** Uses OpenAI GPT-4 to analyze RSS feeds, search results, and web content
- **Daily Automated Newsletters:** Scheduled generation and delivery via GitHub Actions and Vercel cron
- **Email Marketing Platform:** Built on Resend with SPF/DKIM/DMARC authentication
- **Subscriber Management:** Double opt-in flow with email confirmation and one-click unsubscribe
- **Referral System:** Track subscriber referrals with analytics
- **Modern Web Interface:** Next.js 15 with React 19 and Tailwind CSS v4
- **Dark Mode Support:** Full dark mode across all pages including legal pages
- **Newsletter Archive:** Browse and share past newsletters online
- **UK Legal Compliance:** Privacy, Terms, and Cookie policies compliant with UK GDPR, DPA 2018, and PECR 2003

## Quick Start

### Prerequisites

- Node.js 20+ and npm
- Python 3.11+ with pip
- OpenAI API key
- Resend account (for email delivery)
- Supabase project (for database)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/thepaymentsnerdv2.git
cd thepaymentsnerdv2

# Install web dependencies
cd web
npm install

# Install AI dependencies
cd ../ai
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp ../.env.example ../.env
# Edit .env with your API keys
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# OpenAI (required for newsletter generation)
OPENAI_API_KEY=your_openai_api_key_here

# Resend (required for email delivery)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=newsletter@thepaymentsnerd.co

# Supabase (required for subscriber database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Security tokens (generate random strings)
SUBSCRIBE_TOKEN_SECRET=your_random_secret_key_here
CRON_SECRET=your_cron_secret_here

# Site configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

See [docs/SETUP.md](docs/SETUP.md) for detailed configuration instructions.

### Running Locally

```bash
# Start the development server
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Tech Stack

### Frontend (Next.js App)
- **Framework:** Next.js 15.3.8 with App Router
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 with custom typography (Archivo, Inter)
- **Email Templates:** React Email components
- **Icons:** Lucide React
- **Analytics:** Vercel Analytics

### Backend & Services
- **Email Delivery:** Resend API with custom domain authentication
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Email token-based confirmation
- **Hosting:** Vercel (serverless functions + cron)
- **CI/CD:** GitHub Actions for automated newsletter generation

### AI Newsletter Generation (Python)
- **LLM:** OpenAI GPT-4 via LangChain
- **Orchestration:** LangChain agents and tools
- **Data Sources:** RSS feeds, web scraping, search APIs
- **Web Scraping:** BeautifulSoup4 + lxml
- **Feed Parsing:** feedparser
- **Search:** DuckDuckGo Search API
- **Storage:** Chroma vector database (SQLite)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    GitHub Actions (Daily 7 AM UTC)          │
│  Runs Python AI agent → Generates newsletter.json          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Vercel Cron (Daily 7 AM UTC)                │
│  Triggers /api/send-daily → Sends emails via Resend        │
└─────────────────────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌───────────────┐         ┌──────────────────┐
│   Supabase    │         │     Resend       │
│  (Subscribers)│         │  (Email Delivery)│
└───────────────┘         └──────────────────┘
```

### Data Flow

1. **Newsletter Generation (AI):**
   - GitHub Actions triggers Python script (`ai/src/main.py`)
   - AI agent fetches RSS feeds, searches web, scrapes articles
   - GPT-4 analyzes content and generates structured newsletter
   - Output saved to `web/public/newsletter.json`

2. **Email Delivery (Automated):**
   - Vercel cron triggers `/api/send-daily` endpoint
   - API fetches active subscribers from Supabase
   - Newsletter rendered using React Email template
   - Emails sent via Resend with tracking headers

3. **Subscription Flow (User-Initiated):**
   - User submits email on homepage
   - Confirmation email sent with secure token
   - User clicks link to confirm subscription
   - Subscriber saved to Supabase with `active` status

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed system design.

## Project Structure

```
thepaymentsnerdv2/
├── ai/                          # Python AI newsletter generator
│   ├── config.yml               # RSS feeds, search sources, topics
│   ├── requirements.txt         # Python dependencies
│   └── src/
│       ├── main.py              # AI agent orchestration
│       ├── config.py            # Configuration loader
│       └── tools.py             # Search, scrape, RSS tools
│
├── web/                         # Next.js frontend application
│   ├── app/
│   │   ├── api/                 # API routes (subscribe, send-daily, webhooks)
│   │   ├── page.tsx             # Homepage with newsletter preview
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components (Logo, SubscribeForm, etc.)
│   ├── emails/                  # React Email templates
│   ├── lib/                     # Utilities (Supabase, tokens, email)
│   ├── public/
│   │   └── newsletter.json      # Latest newsletter data (generated by AI)
│   └── package.json
│
├── db/
│   ├── chroma.sqlite3           # Vector database for AI content
│   └── migrations/              # SQL migrations
│
├── .github/
│   └── workflows/
│       └── generate_news.yml    # Automated newsletter generation
│
├── docs/                        # Documentation (see below)
├── .env.example                 # Environment variable template
└── vercel.json                  # Vercel cron configuration
```

## Documentation

- **[SETUP.md](docs/SETUP.md)** - Environment setup, API keys, DNS configuration
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System design, data flow, component details
- **[EMAIL_SYSTEM.md](docs/EMAIL_SYSTEM.md)** - Email delivery, authentication, compliance
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Vercel deployment, GitHub Actions, cron setup
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Development guidelines and workflow

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/subscribe` | POST | Subscribe new email with confirmation flow |
| `/api/confirm` | GET | Confirm email subscription via token |
| `/api/unsubscribe` | POST | Unsubscribe email address |
| `/api/send-daily` | POST | Trigger daily newsletter send (cron) |
| `/api/test-email` | GET | Send test email (dev only, requires secret) |
| `/api/webhooks/resend` | POST | Handle Resend webhooks (bounces, complaints) |

## Development

### Running Tests

```bash
cd web
npm test
```

### Building for Production

```bash
cd web
npm run build
npm start
```

### Generating Newsletter Manually

```bash
cd ai
source .venv/bin/activate
python src/main.py
```

This generates `web/public/newsletter.json`.

### Email Preview

```bash
cd web
npx tsx scripts/previewEmail.ts
```

Opens email preview in browser.

## Deployment

The application is deployed on Vercel with automated workflows:

1. **Web Application:** Vercel auto-deploys from `main` branch
2. **Newsletter Generation:** GitHub Actions runs daily at 07:00 UTC
3. **Email Delivery:** Vercel cron triggers daily at 07:00 UTC

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide.

## Email Deliverability

The platform uses industry-standard email authentication:

- **SPF Record:** Validates sending server
- **DKIM Signature:** Cryptographic authentication
- **DMARC Policy:** Email alignment verification
- **List-Unsubscribe:** One-click unsubscribe headers
- **Bounce Handling:** Automatic webhook processing

For Apple iCloud compliance and deliverability troubleshooting, see [docs/EMAIL_SYSTEM.md](docs/EMAIL_SYSTEM.md).

## Database Schema

**Subscribers Table:**
```sql
CREATE TABLE subscribers (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',  -- 'pending', 'active', 'unsubscribed'
  confirmed_at TIMESTAMP,
  referral_code TEXT,
  referred_by TEXT,
  consent_ip TEXT,
  consent_user_agent TEXT
);
```

**Newsletters Table:**
```sql
CREATE TABLE newsletters (
  id UUID PRIMARY KEY,
  publication_date DATE UNIQUE NOT NULL,
  content JSONB NOT NULL,
  sent_at TIMESTAMP
);
```

**Note:** Row Level Security (RLS) is enabled on the `subscribers` table. Server-side operations requiring full access should use the Supabase admin client (service role key).

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for complete schema.

## License

Private project - All rights reserved.

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: cesar@thepaymentsnerd.co

## Acknowledgments

- OpenAI for GPT-4 API
- Resend for email delivery infrastructure
- Supabase for database and authentication
- Vercel for hosting and serverless functions
