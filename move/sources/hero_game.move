module iota_hero::hero_game {
    use std::string::{Self, String};
    use iota::object::{Self, UID, ID};
    use iota::transfer;
    use iota::tx_context::{Self, TxContext};
    use iota::url::{Self, Url};
    use iota::coin::{Self, Coin};
    use iota::iota::IOTA;
    use iota::event;

    // --- STRUCTS ---
    struct Hero has key, store {
        id: UID,
        name: String,
        img_url: Url,
        level: u64,
        stars: u8,
        rarity: String,
        power: u64,
        agility: u64,
        intelligence: u64,
    }

    struct Listing has key, store {
        id: UID,
        seller: address,
        price: u64,
        hero_id: ID,
        hero: Hero,
    }

    // --- EVENTS ---
    struct HeroMinted has copy, drop { id: ID, owner: address, name: String }
    struct HeroListed has copy, drop { listing_id: ID, hero_id: ID, price: u64 }
    struct HeroSold has copy, drop { hero_id: ID, buyer: address, price: u64 }

    // --- FUNCTIONS ---

    // 1. Tạo Hero (Đầu vào là String cho dễ gọi từ JS)
    public entry fun create_hero(
        name: String,
        img_url: String,
        stars: u8,
        rarity: String,
        power: u64,
        agility: u64,
        intelligence: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let id = object::new(ctx);
        let hero_id = object::uid_to_inner(&id);

        // Chuyển đổi String sang Url an toàn
        let url_bytes = *string::bytes(&img_url);
        let url_obj = url::new_unsafe_from_bytes(url_bytes);

        let hero = Hero {
            id,
            name,
            img_url: url_obj,
            level: 1,
            stars,
            rarity,
            power,
            agility,
            intelligence
        };

        event::emit(HeroMinted { id: hero_id, owner: sender, name });
        transfer::transfer(hero, sender);
    }

    // 2. Treo bán
    public entry fun list_hero(hero: Hero, price: u64, ctx: &mut TxContext) {
        let seller = tx_context::sender(ctx);
        let hero_id = object::uid_to_inner(&hero.id);
        
        let listing = Listing {
            id: object::new(ctx),
            seller,
            price,
            hero_id,
            hero,
        };

        event::emit(HeroListed { 
            listing_id: object::uid_to_inner(&listing.id), 
            hero_id, 
            price 
        });

        transfer::share_object(listing);
    }

    // 3. Mua Hero
    public entry fun buy_hero(listing: Listing, payment: Coin<IOTA>, ctx: &mut TxContext) {
        let Listing { id, seller, price, hero_id, hero } = listing;
        
        assert!(coin::value(&payment) == price, 400);

        transfer::public_transfer(payment, seller);
        transfer::public_transfer(hero, tx_context::sender(ctx));
        object::delete(id);

        event::emit(HeroSold { hero_id, buyer: tx_context::sender(ctx), price });
    }
}