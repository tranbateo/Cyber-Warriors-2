import { useEffect, useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useIotaClient, useIotaClientQuery } from "@iota/dapp-kit";
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

const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Uncommon": return "#22c55e";
      case "Rare": return "#eab308";
      case "Legendary": return "#ef4444";
      case "Mythical": return "#a855f7";
      default: return "#ffffff";
    }
};

export default function MarketPage() {
  const account = useCurrentAccount();
  const client = useIotaClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [activeListings, setActiveListings] = useState<any[]>([]);

  // 1. Lấy tất cả sự kiện "HeroListed"
  const { data: events } = useIotaClientQuery("queryEvents", {
    query: { MoveModule: { package: PACKAGE_ID, module: MODULE_NAME } }
  });

  // 2. Lọc những Listing còn tồn tại (Chưa bị mua)
  useEffect(() => {
    const fetchActiveListings = async () => {
        if (!events || events.data.length === 0) return;

        // Lấy danh sách Listing ID từ events
        const listedItems = events.data
            .filter((ev: any) => ev.type.includes("HeroListed"))
            .map((ev: any) => {
                const data = ev.parsedJson;
                return {
                    id: data.listing_id,
                    ...data
                };
            });

        // Chỉ lấy các ID duy nhất
        const uniqueIds = [...new Set(listedItems.map((item: any) => item.id))];
        
        if (uniqueIds.length === 0) return;

        // Gọi blockchain để kiểm tra xem listing ID này còn sống không (nếu đã mua thì nó bị xóa rồi)
        const objects = await client.multiGetObjects({
            ids: uniqueIds as string[],
            options: { showContent: true }
        });

        // Lọc ra những item còn tồn tại (không bị null hoặc deleted)
        const validListings = objects
            .filter((obj: any) => obj.data && obj.data.content)
            .map((obj: any) => {
                const fields = obj.data.content.fields;
                // Listing object chứa Hero bên trong, ta lấy thông tin Hero ra để hiển thị
                return {
                    listing_id: obj.data.objectId,
                    price: fields.price,
                    hero: fields.hero.fields // Lấy thông tin chi tiết Hero
                };
            });

        setActiveListings(validListings);
    };

    fetchActiveListings();
  }, [events, client]);

  const buyHero = (listingId: string, price: string) => {
    if (!account) return alert("Connect wallet to buy!");
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(price)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::${MODULE_NAME}::buy_hero`,
      arguments: [tx.object(listingId), coin]
    });

    signAndExecute({ transaction: tx }, {
      onSuccess: () => {
        alert("🎉 Purchase successful! Check wallet.");
        // Reload lại trang sau 2s để cập nhật danh sách
        setTimeout(() => window.location.reload(), 2000);
      }
    });
  };

  return (
    <div className="container">
      <div className="market-header">
        <h2>🏪 
GLOBAL ELECTRONIC MARKETPLACE</h2>
        <p style={{color: '#888'}}>Possess the strongest warriors.</p>
      </div>

      <div className="hero-grid">
        {activeListings.map((item: any) => {
            const rarityClass = getRarityClass(item.hero.rarity);
            const rarityColor = getRarityColor(item.hero.rarity);

            return (
                <div key={item.listing_id} className={`hero-card ${rarityClass}`}>
                    <div style={{background: rarityColor, color: 'black', display: 'inline-block', padding: '2px 10px', borderRadius: 4, marginBottom: 10, fontSize: 12, fontWeight: 'bold'}}>
                        {item.hero.rarity.toUpperCase()}
                    </div>
                    
                    {/* Hiển thị Avatar */}
                    <img src={item.hero.img_url} alt="hero" className="hero-avatar" />
                    
                    <h3 style={{margin: '10px 0', color: rarityColor}}>{item.hero.name}</h3>
                    <div style={{fontSize: 14, color: '#bbb', marginBottom: 10}}>
                        Power: {item.hero.power} | {item.hero.stars}⭐
                    </div>

                    <div className="price-tag">💎 {Number(item.price)/1e9} IOTA</div>
                    <button className="btn-neon" onClick={() => buyHero(item.listing_id, item.price)}>BUY NOW</button>
                </div>
            );
        })}
        {activeListings.length === 0 && <p style={{textAlign:'center', width:'100%', color:'#666'}}>There is no one selling yet...</p>}
      </div>
    </div>
  );
}