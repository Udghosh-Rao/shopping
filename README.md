# DripStore - Fashion Ecommerce

A modern, premium fashion e-commerce platform built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

## 🎨 Design System

**Souled Store + Kyros Inspired Premium Design**
- **Color Palette**: White background, near-black text (#0A0A0A), red accent (#E63946), cream sections (#F8F5F0)
- **Typography**: Inter font family (400-900 weights), bold tracking, large heading scale
- **Layout**: Product-first, category navigation prominent
- **Animations**: Smooth Framer Motion transitions on all interactive elements

## 🏗️ Homepage Components

### Navbar
- Announcement bar with free shipping message
- Bold category navigation (MEN/WOMEN/SNEAKERS/NEW DROPS/SALE)
- Search, Wishlist, Cart icons with badge counter
- Responsive mobile menu with slide animation
- Scroll-triggered shadow effect

### HeroBanner
- 3 auto-rotating slides with different color schemes
- Large typography (72px-96px fonts)
- CTA buttons with hover scale effects
- Manual dot navigation with smooth transitions

### ProductCard
- 3:4 aspect ratio images
- NEW badge (black), discount badge (red), SOLD OUT (gray)
- Wishlist button with red on-hover state
- Quick Add bar animates up on hover
- Second product image fades in on hover
- Price display with discount strike-through

### NewArrivals
- "JUST DROPPED" section with red accent tag
- 4-column responsive grid
- Mock product data with staggered animations
- View All link with navigation arrow

### CategoryCards
- 3 featured categories (Men/Women/Sneakers)
- 500px height with image overlays
- Bold titles at bottom with red underline animation
- Hover scale effect on cards

### Footer
- Dark premium design (#0A0A0A background)
- Newsletter signup section
- 4-column link structure (Brand/Shop/Help/Company)
- Social media icons
- Copyright and legal links

## 🚀 Features

- ✅ Product catalog with filtering and sorting
- ✅ Shopping cart with local storage
- ✅ User authentication (NextAuth.js)
- ✅ Product search functionality
- ✅ Responsive mobile design
- ✅ Admin dashboard for product management
- ✅ Payment integration (Razorpay)
- ✅ Order management system
- ✅ Image optimization with Cloudinary

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4, PostCSS
- **Animation**: Framer Motion
- **Database**: MongoDB
- **Authentication**: NextAuth.js
- **Payment**: Razorpay
- **Image Storage**: Cloudinary
- **UI Icons**: Lucide React
- **Form Handling**: React Hook Form, Zod

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB connection string
- Razorpay API credentials
- Cloudinary credentials
- NextAuth.js configuration

### Installation

```bash
# Clone the repository
git clone https://github.com/Udghosh-Rao/shopping.git
cd shopping

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📝 Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## 🏗️ Project Structure

```
shopping/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Homepage
│   ├── shop/                # Shop/catalog pages
│   ├── product/[slug]/      # Product detail pages
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout process
│   ├── api/                 # API routes
│   └── admin/               # Admin dashboard
├── components/
│   ├── store/               # Store components
│   │   ├── Navbar.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── ProductCard.tsx
│   │   ├── NewArrivals.tsx
│   │   ├── CategoryCards.tsx
│   │   ├── Footer.tsx
│   └── Providers.tsx        # Context providers
├── lib/
│   ├── mongodb.ts           # DB connection
│   ├── cartStore.tsx        # Cart context
│   ├── auth.ts              # Auth utilities
│   └── cloudinary.ts        # Image upload
├── models/                  # MongoDB models
│   ├── Product.ts
│   ├── User.ts
│   └── Order.ts
├── public/                  # Static assets
└── app/globals.css          # Global styles
```

## 🎯 Key Features

### Product Management
- Create, read, update, delete products
- Image uploads with Cloudinary
- Product filtering and search
- Stock management

### Shopping Cart
- Add/remove items
- Quantity management
- Local storage persistence
- Real-time price calculation

### Checkout & Payment
- Secure payment with Razorpay
- Order confirmation emails
- Order tracking
- Payment history

### Admin Dashboard
- Product management
- Order management
- Customer management
- Sales statistics

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 1024px, 1280px
- Touch-friendly UI
- Optimized images

## 🔒 Security

- NextAuth.js for authentication
- Secure password hashing (bcryptjs)
- Protected API routes
- CORS configuration
- Input validation with Zod

## 📈 Performance

- Next.js image optimization
- Code splitting and lazy loading
- CSS minification with Tailwind
- API response caching
- Optimized database queries

## 🚢 Deployment

Deploy to Vercel (recommended for Next.js):

```bash
# Push to GitHub
git push origin main

# Connect to Vercel
# https://vercel.com/new

# Set environment variables in Vercel dashboard
# Deploy automatically on push
```

## 📄 License

MIT License - feel free to use this for your projects!

## 👨‍💻 Author

**Udghosh Rao**
- GitHub: [@Udghosh-Rao](https://github.com/Udghosh-Rao)
- Repository: [shopping](https://github.com/Udghosh-Rao/shopping)

---

**Built with ❤️ using Next.js and Modern Web Technologies**
