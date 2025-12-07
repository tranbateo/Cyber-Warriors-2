# ⚔️ IOTA Warriors - NFT Marketplace & Game

**Cyber-Warriors-2** is a full-stack decentralized application (dApp) built on the **IOTA Rebased (Devnet)** network using the **Move** programming language.

This project demonstrates a complete NFT ecosystem where users can **Mint** unique Heroes, **Trade** them on a global marketplace, and **Manage** their inventory with a dynamic rarity system.

<img width="1737" height="823" alt="image" src="https://github.com/user-attachments/assets/b82364ee-8587-4a5e-afe1-ddc51cbe0b79" />



---

## ✨ Key Features

- **🏭 Admin Production Factory:** Mint new Heroes with custom stats (Power, Agility, Intelligence) and attributes.
- **🏪 Global Marketplace:** A decentralized listing system where users can buy Heroes using IOTA tokens.
- **🎒 User Inventory:** View owned Heroes and **Resell** them back to the market at a custom price.
- **💎 Rarity System:** Visual indicators for Hero rarity tiers (Common, Uncommon, Rare, Legendary, Mythical) with glowing effects.
- **🖼️ Dynamic Metadata:** Heroes feature unique names and generated avatars.

---

## 🛠️ Tech Stack

### Blockchain (Backend)
- **Network:** IOTA Rebased (Devnet)
- **Language:** Move
- **Framework:** IOTA Framework
- **Tools:** IOTA CLI

### Frontend (Client)
- **Framework:** ReactJS (Vite) + TypeScript
- **Routing:** React Router DOM
- **Blockchain Integration:** `@iota/dapp-kit`, `@iota/iota-sdk`
- **Styling:** Custom CSS (Cyberpunk/Dark Neon Theme)

---
### Contract address : https://explorer.iota.org/object/0xd220737f9cc29f07407dfc3f8b2961d0c21a94c6af88e5f9cfb0da23d8e87e7e?network=devnet
---

🚀 Installation & Setup Guide
1. Prerequisites
Node.js (v18+)

Rust & Cargo (For compiling Move)

IOTA CLI

IOTA Wallet Extension (Browser)

2. Clone Repository
Bash

git clone [https://github.com/YOUR_USERNAME/iota-warriors.git](https://github.com/YOUR_USERNAME/iota-warriors.git)
cd iota-warriors
3. Deploy Smart Contract
Navigate to the move directory to publish the contract.

Bash

cd move
# Switch to Devnet
iota client switch --env devnet
# Request Gas Tokens
iota client faucet --url [https://faucet.devnet.iota.cafe/gas](https://faucet.devnet.iota.cafe/gas)
# Publish Contract
iota client publish --gas-budget 100000000
⚠️ IMPORTANT: After publishing, copy the Package ID from the terminal output (under Published Objects).

4. Configure Frontend
Connect the frontend to your deployed contract.

Navigate to the frontend directory: cd ../frontend

Install dependencies: npm install

Open src/constants.ts and update the PACKAGE_ID:

TypeScript

export const PACKAGE_ID = "0x...YOUR_NEW_PACKAGE_ID_HERE...";
export const MODULE_NAME = "hero_game";
5. Run Application
Bash

npm run dev
Access the app at http://localhost:5173.

🎮 How to Play
Step 1: Connect Wallet
Ensure your IOTA Wallet is set to Devnet.

Request tokens via the wallet faucet if your balance is 0.

Click "Connect Wallet" in the top right corner.

Step 2: Minting (Admin Role)
Go to the "Admin Center" tab.

Enter Hero details (Name, Stats, Rarity, Stars).

Click "⚡ PRODUCE HERO" and approve the transaction.

Once minted, the Hero appears in your "Storage". You can set a price and click "💰 Sell Now" to list it on the market.

Step 3: Buying (User Role)
Go to the "Market" tab.

Browse available Heroes.

Click "BUY NOW" on any Hero. The IOTA amount will be deducted, and the Hero will be transferred to your wallet.

Step 4: Reselling (Inventory)
Go to the "Inventory" (Túi Đồ) tab.

View your collection.

Enter a new price for a Hero and click "SELL" to put it back on the market.
---

## 📂 Project Structure

```text
iota-warriors/
├── move/                       # Smart Contract
│   ├── Move.toml               # Dependency configuration
│   └── sources/
│       └── hero_game.move      # Core logic (Mint, List, Buy)
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── constants.ts        # Package ID configuration
│   │   ├── AdminPage.tsx       # Minting & Listing UI
│   │   ├── MarketPage.tsx      # Buying UI
│   │   ├── InventoryPage.tsx   # Asset Management & Reselling
