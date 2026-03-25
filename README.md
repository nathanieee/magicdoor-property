# MagicDoor Property Rental Platform

The project aims to revolutionize the property rental experience by integrating blockchain technology into the leasing process. The platform enables seamless cryptocurrency payments between property owners and tenants while ensuring security, transparency, and efficiency.

---

## Key Features

- Cryptocurrency-enabled property transactions
- Smart contract integration for secure transactions
- Advanced Search & Discovery
- Booking & Availability Calendar
- Integrated Messaging System
- Rich Media Support
- Analytics Dashboard
- Mobile-Responsive Design

---

## Technical Overview

**Frontend**
- React / Next.js for performance-focused rendering
- Redux / Zustand fo reliable state control
- TailwindCSS for scalable styling consistency
- React Router for structured navigation
- Web3.js / Ether.js for blockchain and multichain wallet integrations

**Backend**
- Node.js for high-throughput backend operations
- Express.js for modular API design
- MongoDB / PostgreSQL for flexible data persistence
- JWT Authentication for secure, statelss auth flows
- Socket.io for optional real-time features
- Web3 Providers (Infura / Alchemy) for multichain support
- Smart Contract Integration (Solidity) enabling cross-network rental logic and escrow features

**Blockchain Layer**
- Ethereum / Polygon as the underlying blockchain networks
- Smart Contracts for On-chain rental escrow, Ownership verification or etc.,
- Multichain Wallet Support (Metamask, WalletConnect, Coinbase, OKX, ...)
- IPFS / Pinata for decentralized storage of property metadata or media assets
- Event Listeners (via Web3/Ethers)

## How to Run

Make sure you’re using **Node.js v20** or later.

Clone the repository and install dependencies:

```bash
npm install
```

Run the local frontend server:

```bash
npm start
```

Run the local backend server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.
