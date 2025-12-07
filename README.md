# ⚔️ IOTA Warriors - NFT Marketplace & Game

**Cyber-Warriors-2** is a full-stack decentralized application (dApp) built on the **IOTA Rebased (Devnet)** network using the **Move** programming language.

This project demonstrates a complete NFT ecosystem where users can **Mint** unique Heroes, **Trade** them on a global marketplace, and **Manage** their inventory with a dynamic rarity system.

![Uploading image.png…]()


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
