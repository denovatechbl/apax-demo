# Demo APAX App

A minimal Web3 demo showcasing a portfolio vault with a modern frontend, backend API, and smart contracts.

## 🧱 Stack

- **Frontend**: Next.js
- **Backend**: Node.js + Express + ethers
- **Smart Contracts**: Solidity (Hardhat)

## 🔁 Architecture Flow

Frontend → Backend → Blockchain

- The frontend never talks directly to the blockchain
- The backend provides clean APIs and reads on-chain data
- The smart contract is the source of truth

---

## 📁 Project Structure

```text
/apax
├── /smart-contracts          # Hardhat and Smart Contracts
│   ├── /contracts
│   ├── /scripts
│   ├── /test
│   ├── hardhat.config.ts
│   ├── package.json
│   └── .env
│
├── /web                 # Web frontend (Next.js)
│   ├── /app
│   ├── /components
│   ├── /hooks
│   ├── /lib
│   ├── /public
│   ├── /src
│   ├── package.json
│   └── tsconfig.json
│
├── /shared                   # Shared resources (like ABIs)
│   ├── /abi
│   └── constants.ts
│
└── README.md                 # Project documentation

```

## Install Dependencies

From the **root of the repository**:

```bash
cd /web
npm install
```

## Run the Project

From the **root of the repository**:

```bash
npm run dev
```

## Once running, open your browser and go to: http://localhost:3000 to view the app locally.