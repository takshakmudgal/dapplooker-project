# Token Insight & Analytics API

A backend service providing token market insights using AI and wallet PnL analysis from HyperLiquid.

## Tech Stack

- Node.js / Express / TypeScript
- PostgreSQL / Prisma
- Google Gemini AI
- CoinGecko API
- HyperLiquid API
- Docker

## Quick Start

### Docker (Recommended)

```bash
# Clone and enter directory
git clone <repo-url>
cd dapplooker-assignment

# Create .env file
cp .env.example .env
# Edit .env with your API keys

# Run
docker-compose up --build
```

### Local Development

```bash
npm install
npx prisma generate
npm run dev
```

## Environment Variables

```
DATABASE_URL="postgresql://user:password@localhost:5432/tokeninsight"
COINGECKO_API_KEY="your_coingecko_api_key"
GEMINI_API_KEY="your_gemini_api_key"
PORT=3000
```

## API Endpoints

### Health Check
```
GET /health
```

### Token Insight API
```
POST /api/token/:id/insight
```

**Request Body (optional):**
```json
{
  "vs_currency": "usd",
  "history_days": 30
}
```

**Response:**
```json
{
  "source": "coingecko",
  "token": {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "market_data": {
      "current_price_usd": 87192,
      "market_cap_usd": 1741514744444,
      "total_volume_usd": 54226290424,
      "price_change_percentage_24h": -0.45585
    }
  },
  "insight": {
    "reasoning": "...",
    "sentiment": "Neutral"
  },
  "model": {
    "provider": "google",
    "model": "gemini-2.0-flash"
  }
}
```

### HyperLiquid Wallet PnL API
```
GET /api/hyperliquid/:wallet/pnl?start=YYYY-MM-DD&end=YYYY-MM-DD
```

**Response:**
```json
{
  "wallet": "0x...",
  "start": "2024-01-01",
  "end": "2024-01-07",
  "daily": [
    {
      "date": "2024-01-01",
      "realized_pnl_usd": 0,
      "unrealized_pnl_usd": 0,
      "fees_usd": 0,
      "funding_usd": 0,
      "net_pnl_usd": 0,
      "equity_usd": 0
    }
  ],
  "summary": {
    "total_realized_usd": 0,
    "total_unrealized_usd": 0,
    "total_fees_usd": 0,
    "total_funding_usd": 0,
    "net_pnl_usd": 0
  },
  "diagnostics": {
    "data_source": "hyperliquid_api",
    "last_api_call": "2025-12-29T22:30:00.000Z",
    "notes": "PnL calculated using daily close prices"
  }
}
```

## Scripts

```bash
npm run build    # Build TypeScript
npm run dev      # Development server
npm run start    # Production server
npm test         # Run tests
```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # External API integrations
├── routes/          # API routes
├── utils/           # Business logic
├── config/          # Configuration
├── app.ts           # Express app
└── server.ts        # Entry point
```

## Testing

```bash
npm test
```

## AI Setup

This project uses Google Gemini AI. Get your API key from [Google AI Studio](https://aistudio.google.com/).

Set `GEMINI_API_KEY` in your `.env` file.
