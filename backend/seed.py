from app import app
from models import db, Product


def seed_products():
    """Seed 20 e-commerce products into the database"""

    if Product.query.count() > 0:
        print("⚠️  Products already exist. Skipping seed.")
        return

    products = [
        # ═════════════ T-SHIRTS (5) ═════════════
        {
            "name": "Demon Slayer Tanjiro T-Shirt",
            "description": "Premium 100% cotton t-shirt featuring Tanjiro Kamado from Demon Slayer. Officially licensed merchandise with high-quality print.",
            "category": "T-Shirts",
            "subcategory": "Anime",
            "price": 699,
            "original_price": 999,
            "discount_percent": 30,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Demon+Slayer+Tee",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Demon+Slayer+Back",
            "badge": "BESTSELLER",
            "sizes": "XS,S,M,L,XL,XXL",
            "colors": "Black,Navy,White",
            "in_stock": True,
            "rating": 4.8,
            "reviews": 1247
        },
        {
            "name": "One Piece Luffy Gear 5 T-Shirt",
            "description": "Exclusive One Piece t-shirt featuring Luffy's Gear 5 transformation. Super soft fabric with vibrant colors.",
            "category": "T-Shirts",
            "subcategory": "Anime",
            "price": 799,
            "original_price": 1099,
            "discount_percent": 27,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=One+Piece+Luffy",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Luffy+Gear+5",
            "badge": "HOT",
            "sizes": "S,M,L,XL,XXL",
            "colors": "Black,Red,Yellow",
            "in_stock": True,
            "rating": 4.9,
            "reviews": 1543
        },
        {
            "name": "Attack on Titan Scout Regiment T-Shirt",
            "description": "Join the Scout Regiment with this iconic Attack on Titan t-shirt. Features the Wings of Freedom emblem.",
            "category": "T-Shirts",
            "subcategory": "Anime",
            "price": 649,
            "original_price": 899,
            "discount_percent": 28,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Attack+on+Titan",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Scout+Regiment",
            "badge": "BESTSELLER",
            "sizes": "XS,S,M,L,XL,XXL",
            "colors": "Olive,Black,Navy",
            "in_stock": True,
            "rating": 4.7,
            "reviews": 982
        },
        {
            "name": "Naruto Uzumaki Clan T-Shirt",
            "description": "Represent the Uzumaki Clan with this premium Naruto t-shirt. Perfect for fans of the Hokage.",
            "category": "T-Shirts",
            "subcategory": "Anime",
            "price": 599,
            "original_price": 849,
            "discount_percent": 29,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Naruto+Tee",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Uzumaki+Clan",
            "badge": "NEW",
            "sizes": "S,M,L,XL,XXL",
            "colors": "Black,Orange,Navy",
            "in_stock": True,
            "rating": 4.6,
            "reviews": 756
        },
        {
            "name": "Dragon Ball Z Goku Super Saiyan T-Shirt",
            "description": "Legendary Dragon Ball Z t-shirt featuring Goku in Super Saiyan form. Epic design for DBZ fans.",
            "category": "T-Shirts",
            "subcategory": "Anime",
            "price": 749,
            "original_price": 1049,
            "discount_percent": 29,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=DBZ+Goku",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Super+Saiyan",
            "badge": "SALE",
            "sizes": "XS,S,M,L,XL,XXL",
            "colors": "Black,Purple,Navy",
            "in_stock": True,
            "rating": 4.8,
            "reviews": 1338
        },

        # ═════════════ SHIRTS (3) ═════════════
        {
            "name": "Marvel Avengers Logo Shirt",
            "description": "Premium casual shirt with embroidered Avengers logo. Perfect for Marvel fans. 100% cotton fabric.",
            "category": "Shirts",
            "subcategory": "Marvel",
            "price": 1499,
            "original_price": 2099,
            "discount_percent": 29,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Marvel+Shirt",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Avengers",
            "badge": "NEW",
            "sizes": "S,M,L,XL,XXL",
            "colors": "Black,Navy,Maroon",
            "in_stock": True,
            "rating": 4.5,
            "reviews": 543
        },
        {
            "name": "DC Batman Dark Knight Shirt",
            "description": "Stylish shirt featuring the iconic Batman logo. Premium quality fabric with modern fit.",
            "category": "Shirts",
            "subcategory": "DC",
            "price": 1599,
            "original_price": 2199,
            "discount_percent": 27,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Batman+Shirt",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Dark+Knight",
            "badge": "BESTSELLER",
            "sizes": "M,L,XL,XXL",
            "colors": "Black,Grey,Navy",
            "in_stock": True,
            "rating": 4.7,
            "reviews": 687
        },
        {
            "name": "Linkin Park Hybrid Theory Shirt",
            "description": "Classic Linkin Park shirt featuring artwork from the legendary Hybrid Theory album.",
            "category": "Shirts",
            "subcategory": "Music",
            "price": 1399,
            "original_price": 1999,
            "discount_percent": 30,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Linkin+Park",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Hybrid+Theory",
            "badge": "LIMITED",
            "sizes": "S,M,L,XL",
            "colors": "Black,White,Grey",
            "in_stock": True,
            "rating": 4.8,
            "reviews": 892
        },

        # ═════════════ JOGGERS (2) ═════════════
        {
            "name": "Mocha Korean Slim Fit Joggers",
            "description": "Trendy Korean-style joggers in mocha color. Comfortable fit with elastic waistband and ankle cuffs.",
            "category": "Joggers",
            "subcategory": "Lifestyle",
            "price": 1299,
            "original_price": 1799,
            "discount_percent": 28,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Mocha+Joggers",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Korean+Style",
            "badge": "NEW",
            "sizes": "S,M,L,XL,XXL",
            "colors": "Mocha,Black,Grey",
            "in_stock": True,
            "rating": 4.6,
            "reviews": 456
        },
        {
            "name": "Olive Slim Cargo Joggers",
            "description": "Premium olive green cargo joggers with multiple pockets. Perfect blend of style and utility.",
            "category": "Joggers",
            "subcategory": "Lifestyle",
            "price": 1399,
            "original_price": 1899,
            "discount_percent": 26,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Olive+Joggers",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Cargo+Style",
            "badge": "BESTSELLER",
            "sizes": "M,L,XL,XXL",
            "colors": "Olive,Black,Khaki",
            "in_stock": True,
            "rating": 4.7,
            "reviews": 623
        },

        # ═════════════ SNEAKERS (2) ═════════════
        {
            "name": "White Canvas Classic Sneakers",
            "description": "Timeless white canvas sneakers. Comfortable cushioned sole, perfect for everyday wear.",
            "category": "Sneakers",
            "subcategory": "Lifestyle",
            "price": 2499,
            "original_price": 3499,
            "discount_percent": 29,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=White+Sneakers",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Classic+Style",
            "badge": "BESTSELLER",
            "sizes": "7,8,9,10,11,12",
            "colors": "White,Off-White",
            "in_stock": True,
            "rating": 4.5,
            "reviews": 1145
        },
        {
            "name": "Black Kyros High-Top Sneakers",
            "description": "Premium black high-top sneakers with superior grip and ankle support. Urban street style.",
            "category": "Sneakers",
            "subcategory": "Sports",
            "price": 2999,
            "original_price": 4199,
            "discount_percent": 29,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Kyros+Sneakers",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=High+Top",
            "badge": "HOT",
            "sizes": "7,8,9,10,11",
            "colors": "Black,Navy",
            "in_stock": True,
            "rating": 4.6,
            "reviews": 834
        },

        # ═════════════ SHORTS (2) ═════════════
        {
            "name": "Streetcore Training Shorts",
            "description": "Breathable stretch training shorts with zipper pockets and moisture-wicking fabric.",
            "category": "Shorts",
            "subcategory": "Lifestyle",
            "price": 899,
            "original_price": 1299,
            "discount_percent": 31,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Training+Shorts",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Streetcore+Fit",
            "badge": "SALE",
            "sizes": "S,M,L,XL,XXL",
            "colors": "Black,Grey,Olive",
            "in_stock": True,
            "rating": 4.5,
            "reviews": 318
        },
        {
            "name": "Utility Cargo Shorts",
            "description": "Relaxed cargo shorts with utility pockets, designed for everyday city wear.",
            "category": "Shorts",
            "subcategory": "Lifestyle",
            "price": 1099,
            "original_price": 1499,
            "discount_percent": 27,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Cargo+Shorts",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Utility+Look",
            "badge": "HOT",
            "sizes": "S,M,L,XL",
            "colors": "Khaki,Black,Navy",
            "in_stock": True,
            "rating": 4.6,
            "reviews": 276
        },

        # ═════════════ HOODIES (2) ═════════════
        {
            "name": "Anime Crest Pullover Hoodie",
            "description": "Heavyweight brushed-fleece hoodie with front pocket and anime crest print.",
            "category": "Hoodies",
            "subcategory": "Anime",
            "price": 1799,
            "original_price": 2499,
            "discount_percent": 28,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Anime+Hoodie",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Pullover+Fit",
            "badge": "NEW",
            "sizes": "S,M,L,XL,XXL",
            "colors": "Black,Charcoal,Burgundy",
            "in_stock": True,
            "rating": 4.8,
            "reviews": 541
        },
        {
            "name": "Marvel Varsity Zip Hoodie",
            "description": "Soft terry zip hoodie with varsity-inspired Marvel patch detail.",
            "category": "Hoodies",
            "subcategory": "Marvel",
            "price": 1899,
            "original_price": 2699,
            "discount_percent": 30,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Marvel+Hoodie",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Zip+Hoodie",
            "badge": "BESTSELLER",
            "sizes": "M,L,XL,XXL",
            "colors": "Navy,Black,Grey",
            "in_stock": True,
            "rating": 4.7,
            "reviews": 483
        },

        # ═════════════ JACKETS (2) ═════════════
        {
            "name": "Korean Bomber Jacket",
            "description": "Minimal bomber jacket with ribbed trims and lightweight insulated lining.",
            "category": "Jackets",
            "subcategory": "Lifestyle",
            "price": 2499,
            "original_price": 3499,
            "discount_percent": 29,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Bomber+Jacket",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Street+Bomber",
            "badge": "HOT",
            "sizes": "S,M,L,XL",
            "colors": "Black,Olive,Navy",
            "in_stock": True,
            "rating": 4.6,
            "reviews": 362
        },
        {
            "name": "Denim Trucker Jacket",
            "description": "Classic trucker denim jacket with a modern tapered silhouette.",
            "category": "Jackets",
            "subcategory": "Lifestyle",
            "price": 2699,
            "original_price": 3799,
            "discount_percent": 29,
            "image_url": "https://via.placeholder.com/500x600/1a1a2e/ffffff?text=Denim+Jacket",
            "image_url_hover": "https://via.placeholder.com/500x600/0d0d0d/ff6b00?text=Trucker+Style",
            "badge": "LIMITED",
            "sizes": "M,L,XL,XXL",
            "colors": "Indigo,Black",
            "in_stock": True,
            "rating": 4.7,
            "reviews": 297
        },
    ]

    for product_data in products:
        product = Product(**product_data)
        db.session.add(product)

    db.session.commit()
    print(f"✅ Successfully seeded {len(products)} products into the database!")


if __name__ == "__main__":
    with app.app_context():
        seed_products()
