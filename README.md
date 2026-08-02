# OriginLock

**Every use, traced. Every creator, paid.**

OriginLock is a Web3 licensing and royalty ledger for AI training data. Creators register their work — images, audio, manuscripts, code — set on-chain licensing terms, and get paid automatically in USDC every time their content is verifiably used to train an AI model.

---

## How it works

1. **Tag your work** — Upload content through the dashboard. OriginLock generates a cryptographic fingerprint (content hash) and stores your licensing terms (price per use) alongside it.
2. **It gets matched** — When training data is checked against the registry, a match against your fingerprint is detected and logged to an on-chain, tamper-evident ledger.
3. **You get paid** — Every verified use triggers an automatic royalty payment through the smart contract, straight to your wallet.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Auth & data | Supabase (wallet-signature signup + username/password login, `creators` table) |
| Smart contract | Solidity, Foundry, deployed to Ethereum Sepolia |
| AI classification | Gemini API |
| Hosting | Vercel |

---

## Project structure
originlock/
├── app/
│ ├── signup/ # Wallet-signature based signup
│ ├── login/ # Username/password login
│ ├── dashboard/ # Per-user content & royalty dashboard
│ ├── upload/ # Content registration flow
│ ├── how-it-works/ # Explainer page
│ ├── for-creators/ # Explainer page
│ ├── for-ai-labs/ # Explainer page
│ └── api/
│ ├── auth/ # Auth endpoints
│ ├── account/ # Account management
│ ├── classify/ # AI classification pipeline
│ ├── content/ # Content CRUD (price updates, etc.)
│ ├── profile/ # Profile management
│ └── upload/ # File upload handling
├── components/ # Shared React components (icons, logo, nav, dashboard UI)
├── lib/
│ ├── ai/providers/ # Gemini API integration
│ ├── web3/ # Wallet & chain interaction helpers
│ └── auth/ # Session/auth helpers
├── contracts/ # Foundry project
│ ├── src/ # OriginLock.sol
│ ├── script/ # Deploy.s.sol
│ └── test/ # Contract tests
└── supabase/ # Supabase schema/migrations

---

## Getting started

### Prerequisites

- Node.js 18+
- npm
- A Supabase project
- A wallet with Sepolia ETH (for contract interaction/testing)
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (for contract development)

### Environment variables

Create a `.env.local` file in the project root:

\```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI classification
GEMINI_API_KEY=

# Web3 / contract
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_SEPOLIA_RPC_URL=
\```

### Install and run

\```bash
npm install
npm run dev
\```

Visit [http://localhost:3000](http://localhost:3000).

### Database

Run the Supabase migration for the `creators` table and related tables before using auth/signup (see `supabase/` for schema).

---

## Smart contract (Foundry)

\```bash
cd contracts

# Install dependencies
forge install

# Build
forge build

# Run tests
forge test

# Deploy to Sepolia
forge script script/Deploy.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
\```

---

## Deployment

The frontend is deployed on Vercel, connected to this repository's `main` branch — pushing to `main` triggers an automatic deployment.

\```bash
git add .
git commit -m "Your message"
git push
\```

---

## License

Proprietary — all rights reserved.