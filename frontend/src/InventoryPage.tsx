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

export default function InventoryPage() {
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [resellPrice, setResellPrice] = useState<{[key:string]: number}>({});

  // Query này chỉ lấy những gì ĐANG Ở TRONG VÍ
  const { data: myHeroes, refetch } = useIotaClientQuery("getOwnedObjects", {
    owner: account?.address || "",
    filter: { StructType: `${PACKAGE_ID}::${MODULE_NAME}::Hero` },
    options: { showContent: true, showDisplay: true },
  }, { enabled: !!account });

  // Hàm bán lại (Người mua trở thành Người bán)
  const resellHero = (heroId: string) => {
    const price = resellPrice[heroId];
    if(!price) return alert("Enter selling price!");

    const tx = new Transaction();
    const priceMist = BigInt(price * 1_000_000_000);

    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::list_hero`,
      arguments: [tx.object(heroId), tx.pure.u64(priceMist)]
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: () => {
        alert("✅Reposted for sale on the market!");
        setTimeout(refetch, 2000);
      }
    });
  }

  if (!account) return <div style={{textAlign:'center', marginTop: 100, color:'white'}}><h2>🎒 Please connect wallet to see inventory</h2></div>;

  return (
    <div className="container">
      <div className="market-header">
        <h2>🎒 MY BAG</h2>
        <p style={{color: '#888'}}>The warriors you possess ({myHeroes?.data.length || 0})</p>
      </div>

      <div className="hero-grid">
        {myHeroes?.data.map((obj: any) => {
            const f = obj.data?.content?.fields;
            if(!f) return null;
            const rarityClass = getRarityClass(f.rarity);

            return (
                <div key={obj.data.objectId} className={`hero-card ${rarityClass}`}>
                    <img src={f.img_url} className="hero-avatar" />
                    <h3 style={{margin: '10px 0', color: 'var(--primary)'}}>{f.name}</h3>
                    
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:13, color:'#ccc', marginBottom:15}}>
                        <span>⚔️ {f.power}</span><span>⚡ {f.agility}</span><span>🧠 {f.intelligence}</span>
                    </div>

                    <div style={{borderTop:'1px solid #333', paddingTop:10}}>
                        <input 
                            type="number" placeholder="Giá bán lại" 
                            style={{width:'60%', padding:5, fontSize:13, marginRight:5}}
                            onChange={(e) => setResellPrice({...resellPrice, [obj.data.objectId]: Number(e.target.value)})}
                        />
                        <button className="btn-sell" style={{width:'30%', margin:0, padding:5}} onClick={() => resellHero(obj.data.objectId)}>SELL</button>
                    </div>
                </div>
            )
        })}
      </div>
      {myHeroes?.data.length === 0 && <p style={{textAlign:'center', color:'#888', marginTop:50}}>Empty bag.</p>}
    </div>
  );
}