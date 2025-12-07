import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ConnectButton } from "@iota/dapp-kit";
import AdminPage from "./AdminPage";
import MarketPage from "./MarketPage";
// 👇 Import trang mới
import InventoryPage from "./InventoryPage"; 
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav className="navbar">
          <div className="logo">⚔️ IOTA WARRIORS</div>
          <div className="nav-links">
            <Link to="/">🏪 Market</Link>
            {/* 👇 Thêm link này */}
            <Link to="/inventory">🎒 
Stuff Bag</Link> 
            <Link to="/admin">🏭 Admin</Link>
          </div>
          <ConnectButton />
        </nav>

        <Routes>
          <Route path="/" element={<MarketPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* 👇 Thêm route này */}
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;