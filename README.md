# ShopZone - E-Commerce Website

A complete, production-ready e-commerce shopping website inspired by thesouledstore.com and kyrosstore.com.

**Tech Stack:**
- Backend: Python Flask REST API
- Frontend: Vue 3 + Vite + Tailwind CSS v4
- Database: SQLite
- State Management: Pinia
- Routing: Vue Router

## Project Structure

```
/shopping
├── /backend
│   ├── app.py                 # Flask app with all API routes
│   ├── models.py              # SQLAlchemy models
│   ├── seed.py                # Seed 20 sample products
│   ├── requirements.txt       # Python dependencies
│   └── database.db            # SQLite database (auto-created)
│
└── /frontend
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── /src
        ├── main.js
        ├── App.vue
        ├── style.css          # Tailwind CSS v4
        │
        ├── /router            # Vue Router with guards
        ├── /stores            # Pinia stores (auth, cart, product, wishlist, toast)
        ├── /services          # Axios API service
        ├── /components        # 11 Vue components (Navbar, Footer, ProductCard, etc.)
        └── /views             # 10 Vue views (Home, Products, ProductDetail, Cart, etc.)
```

## Features

### Backend API
- **Auth Routes**: Register, Login, Get current user
- **Product Routes**: Get products (with filters, search, pagination), Get by ID, Featured products, Related products, Categories
- **Cart Routes**: Get cart, Add item, Update quantity, Remove item, Clear cart
- **Wishlist Routes**: Get wishlist, Add/Remove items
- **Order Routes**: Checkout, Get orders, Get order by ID
- **Address Routes**: CRUD operations for delivery addresses

### Frontend Features
- ✅ Beautiful dark-themed design with orange accents
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Product catalog with filters, search, and sorting
- ✅ Product detail page with size/color selection
- ✅ Shopping cart with quantity management
- ✅ Wishlist functionality
- ✅ User authentication (login/register)
- ✅ Checkout flow with address and payment
- ✅ Toast notifications for user feedback
- ✅ Cart drawer slide-in
- ✅ Category navigation
- ✅ Hero banner with animations
- ✅ Featured and bestseller sections
- ✅ Protected routes for checkout and orders

## How to Run

### Backend (Terminal 1)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with 20 products
python seed.py

# Run the Flask server
python app.py
```

The backend will run on **http://localhost:5000**

### Frontend (Terminal 2)

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will run on **http://localhost:5173**

Open your browser and navigate to **http://localhost:5173**

## Default Data

The application seeds 20 products across multiple categories:
- 5 × T-Shirts (Anime: Demon Slayer, One Piece, Attack on Titan, Naruto, Dragon Ball)
- 3 × Shirts (Marvel, DC, Linkin Park)
- 2 × Joggers (Mocha Korean, Olive Slim)
- 2 × Sneakers (White Canvas, Black Kyros)
- 2 × Phone Cases (iPhone, Android)
- 2 × Posters (Anime Wall Art, Avengers)
- 2 × Accessories (Watch Tray, Watch Roll)
- 2 × Mugs (Friends Quote, NASA)

All products include:
- Indian pricing (₹499 to ₹5999)
- Discount percentages
- Ratings and reviews
- Multiple sizes and colors
- Badges (NEW, BESTSELLER, SALE, HOT, LIMITED)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Products
- `GET /api/products` - Get all products (with query params for filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/related/:id` - Get related products
- `GET /api/categories` - Get all categories
- `GET /api/subcategories` - Get all subcategories

### Cart (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:id` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Wishlist (Protected)
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `DELETE /api/wishlist/remove/:id` - Remove from wishlist

### Orders (Protected)
- `POST /api/orders/checkout` - Place order from cart
- `GET /api/orders` - Get user's order history
- `GET /api/orders/:id` - Get single order details

### Addresses (Protected)
- `GET /api/addresses` - Get user's addresses
- `POST /api/addresses/add` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

## Color Palette

- Primary Background: `#ffffff` (white)
- Dark Background: `#0d0d0d` (near black - navbar, footer)
- Primary Accent: `#ff6b00` (orange - buttons, badges, highlights)
- Secondary Accent: `#1a1a2e` (deep navy)
- Text Primary: `#111111`
- Text Secondary: `#666666`
- Border/Divider: `#e5e5e5`
- Sale Badge: `#e63946` (red)
- New Badge: `#2ec4b6` (teal)
- Bestseller Badge: `#f4a261` (amber)

## Notes

- Cart persists in localStorage
- Authentication uses JWT tokens
- All routes are protected with navigation guards
- Responsive design for mobile, tablet, and desktop
- Toast notifications for user feedback
- Image hover effects on product cards
- Smooth animations throughout

## Build for Production

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`

---

Built with ❤️ using Vue 3, Flask, and Tailwind CSS v4
