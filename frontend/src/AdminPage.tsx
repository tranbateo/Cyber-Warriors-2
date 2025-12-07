import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useIotaClientQuery } from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";
import { PACKAGE_ID, MODULE_NAME } from "./constants";

const getRarityClass = (rarity: string) => {
  switch (rarity) {
    case "Uncommon": return "rarity-uncommon";
    case "Rare": return "rarity-rare";
    case "Legendary": return "rarity-legendary";
    case "Mythical": return "rarity-mythical";
    default: return "rarity-common";
  }
};

export default function AdminPage() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  
  const [formData, setFormData] = useState({
    name: "", stars: 1, rarity: "Common", power: 50, agility: 50, intelligence: 50, price: 1
  });

  // Lấy danh sách Hero ĐANG SỞ HỮU trong ví
  // Khi bạn bán đi (List), vật phẩm này sẽ TỰ ĐỘNG BIẾN MẤT khỏi danh sách này
  const { data: myHeroes, refetch } = useIotaClientQuery("getOwnedObjects", {
    owner: account?.address || "",
    filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::Hero` },
    options: { showContent: true, showDisplay: true },
  }, { enabled: !!account });

  // --- HÀM SẢN XUẤT ---
  const handleMint = () => {
    if (!account) return alert("Please connect wallet!");
    if (!formData.name) return alert("Nhập tên Hero!");

    const tx = new Transaction();
    const dummyImage = `https://api.dicebear.com/9.x/adventurer/svg?seed=${formData.name}&backgroundColor=b6e3f4`;

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::create_hero`,
      arguments: [
        tx.pure.string(formData.name),
        tx.pure.string(dummyImage),
        tx.pure.u8(Number(formData.stars)),
        tx.pure.string(formData.rarity),
        tx.pure.u64(BigInt(formData.power)),
        tx.pure.u64(BigInt(formData.agility)),
        tx.pure.u64(BigInt(formData.intelligence)),
      ],
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: () => { alert("✅ In production! In stock..."); setTimeout(refetch, 2000); },
      onError: (err) => alert("Lỗi: " + err.message)
    });
  };

  // --- HÀM BÁN (LIST) ---
  const sellHero = (heroId: string) => {
    const tx = new Transaction();
    const priceMist = BigInt(formData.price * 1_000_000_000);

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::list_hero`,
      arguments: [tx.object(heroId), tx.pure.u64(priceMist)]
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: () => { 
          alert("✅ Pushed to Market! Hero will disappear from this inventory."); 
          setTimeout(refetch, 2000); 
      },
      onError: (err) => alert("Lỗi: " + err.message)
    });
  }

  if (!account) return <div style={{textAlign:'center', marginTop: 100, color: 'white'}}><h2>🔌 Please connect Admin wallet</h2></div>;

  return (
    <div className="admin-container">
      {/* FORM SẢN XUẤT */}
      <div className="panel-card">
        <h2 style={{color: 'var(--primary)'}}>🏭 Production line</h2>
        <div className="form-group"><label>Name</label><input type="text" onChange={e => setFormData({...formData, name: e.target.value})} /></div>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}}>
            <div className="form-group">
                <label>Rarity</label>
                <select onChange={e => setFormData({...formData, rarity: e.target.value})} style={{background:'#02060b', color:'white', padding:10, borderRadius:8, width:'100%'}}>
                    <option value="Common">⚪ Common</option><option value="Uncommon">🟢 Uncommon</option><option value="Rare">🟡 Rare</option><option value="Legendary">🔴 Legendary</option><option value="Mythical">🟣 Mythical</option>
                </select>
            </div>
            <div className="form-group"><label>
Star</label><input type="number" min="1" max="5" value={formData.stars} onChange={e => setFormData({...formData, stars: Number(e.target.value)})} /></div>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10}}>
            <input type="number" placeholder="STR" onChange={e => setFormData({...formData, power: Number(e.target.value)})} />
            <input type="number" placeholder="AGI" onChange={e => setFormData({...formData, agility: Number(e.target.value)})} />
            <input type="number" placeholder="INT" onChange={e => setFormData({...formData, intelligence: Number(e.target.value)})} />
        </div>
        <button className="btn-neon" style={{marginTop: 20}} onClick={handleMint}>⚡ MANUFACTURE</button>
      </div>

      {/* KHO CỦA TÔI */}
      <div className="panel-card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #333', paddingBottom:10, marginBottom:15}}>
             <h2 style={{color: 'var(--secondary)', margin:0}}>📦 Admin Warehouse</h2>
             <button onClick={() => refetch()} style={{background:'none', border:'1px solid #555', color:'white', cursor:'pointer', padding:'5px 10px', borderRadius:5}}>🔄 
Refresh</button>
        </div>
        
        <div style={{marginBottom: 15, display:'flex', alignItems:'center'}}>
            <label style={{marginRight:10}}>General selling price (IOTA):</label>
            <input type="number" value={formData.price} style={{width: 80}} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
        </div>

        <div className="hero-grid">
            {myHeroes?.data.map((obj: any) => {
                const f = obj.data?.content?.fields;
                if(!f) return null;
                const rarityClass = getRarityClass(f.rarity);

                return (
                    <div key={obj.data.objectId} className={`hero-card ${rarityClass}`}>
                        <img src={f.img_url} alt="avatar" className="hero-avatar" />
                        <h4 style={{margin: '5px 0'}}>{f.name}</h4>
                        <div style={{fontSize: 12, color: '#aaa', marginBottom:10}}>{f.rarity} | {f.stars}⭐</div>
                        <button className="btn-sell" onClick={() => sellHero(obj.data.objectId)}>💰 Push to market</button>
                    </div>
                )
            })}
             {myHeroes?.data.length === 0 && <p style={{color:'#666', textAlign:'center', width:'100%'}}>Empty warehouse. Make more!</p>}
        </div>
      </div>
    </div>
  );
}