Token Insight & Analytics API

Backend service for token market insights and HyperLiquid wallet PnL.

Stack
Node.js, Express, TypeScript
PostgreSQL, Prisma
CoinGecko API
Google Gemini AI
HyperLiquid API
Docker

Setup (Docker)
git clone [<repo-url>](https://github.com/takshakmudgal/dapplooker-project.git)
cd dapplooker-assignment
cp .env.example .env
docker-compose up --build

Setup (Local)
npm install
npx prisma generate
npm run dev

Environment
DATABASE_URL=postgresql://user:password@localhost:5432/tokeninsight
COINGECKO_API_KEY=your_key
GEMINI_API_KEY=your_key
PORT=3000

Endpoints
GET /health
POST /api/token/:id/insight
GET /api/hyperliquid/:wallet/pnl?start=YYYY-MM-DD&end=YYYY-MM-DD

example curl:
```
curl --request GET \
  --url 'http://localhost:3000/api/hyperliquid/0x4129c62faf652fea61375dcd9ca8ce24b2bb8b95/pnl?start=2025-12-01&end=2025-12-30' \
  --header 'Accept: application/json'
```

Notes
PnL uses HyperLiquid realized PnL, daily mark-to-market, funding, and fees
Wallet must have traded on HyperLiquid or values will be zero
