# ShopCart (Comeerc)

A full-featured e-commerce application built with Next.js 16, React 19, Prisma, and Tailwind CSS v4.

## Tech Stack

| Layer     | Technology                                    |
| --------- | --------------------------------------------- |
| Framework | Next.js 16 (App Router)                       |
| UI        | React 19, Tailwind CSS v4, shadcn UI, Lucide  |
| Database  | PostgreSQL (Supabase) via Prisma ORM           |
| Cache     | Upstash Redis / Vercel KV                     |
| Storage   | Supabase Storage (product images)             |
| Auth      | Custom (email/password with Supabase)         |

## Project Structure

```
comeerc/
├── app/
│   ├── (store)/          # Public store pages
│   │   ├── page.jsx      # Home (featured products)
│   │   ├── shop/         # Shop listing with search & category filter
│   │   ├── product/[id]/ # Product detail with stock status
│   │   ├── cart/         # Full cart page
│   │   ├── checkout/     # Checkout form
│   │   ├── categories/   # Category browsing
│   │   ├── deal/         # Hot deals page
│   │   └── blog/         # Blog page
│   ├── (auth)/           # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── admin/            # Admin dashboard
│   │   ├── page.jsx      # Dashboard with stats & orders
│   │   ├── products/     # Product list with profit/margin
│   │   ├── add-proudect/ # Add product form with image upload
│   │   ├── orders/       # Order management
│   │   ├── categories/   # Category management
│   │   ├── users/        # User list
│   │   ├── settings/     # Store configuration
│   │   └── bulk-upload/  # CSV product import
│   └── api/              # REST API routes
│       ├── products/     # CRUD + search/filter
│       ├── orders/       # Create & list orders
│       ├── categories/   # List categories
│       ├── upload/       # Image upload to Supabase
│       ├── inventory/    # Stock management
│       ├── profit/       # Profit calculations
│       └── admin/        # Order processing queue
├── components/           # Shared UI components
│   ├── ui/               # shadcn base components
│   ├── Header.jsx        # Store Navbar
│   ├── navbar.jsx        # Navigation menu
│   ├── search.jsx        # Search modal
│   ├── card.jsx          # Product card
│   ├── cart.jsx          # Cart drawer
│   ├── footer.jsx        # Footer
│   └── adminNavbar.jsx   # Admin sidebar
├── context/              # React context
│   └── CartContext.jsx    # Cart state (localStorage)
├── constant/data.js      # Sample data & constants
├── prisma/schema.prisma  # Database schema
└── lib/                  # Utilities (api-client, cache, storage, profit, order-processor, inventory)
```

## Database Models

- **User** - email/password auth with role (USER/ADMIN)
- **Product** - name, price, stock, images, category relation
- **Category** - product groupings
- **Order** - full order lifecycle (PENDING → PROCESSING → SHIPPED → DELIVERED / CANCELLED)
- **OrderItem** - line items per order
- **Earning** - per-order profit tracking
- **Review** - product reviews with ratings

## Features

### Storefront
- Product listing with grid layout
- Full-text search with modal
- Category filtering
- Product detail with stock indicators (In Stock / Low Stock / Out of Stock)
- Shopping cart with localStorage persistence
- Cart drawer (slide-over)
- Checkout form
- Responsive design

### Admin Dashboard
- Stats cards (revenue, profit, orders, products, customers)
- Order management with inline status change
- Product management with profit/margin display
- Add product form with Supabase image upload
- Bulk CSV product import
- Category CRUD
- User management
- Store settings

### Technical
- API route caching via Upstash Redis
- Page caching with Next.js `"use cache"` directive
- Order processing queue (Redis-backed)
- Inventory management API
- Profit tracking (buy price → sell price margin)
- Rate limiting (Upstash)

## Current Status

This project is under active development. Key areas:
- ✅ Storefront pages (home, shop, product, cart, checkout, categories)
- ✅ Admin dashboard, products, orders, categories, users
- ✅ Product CRUD API with caching
- ✅ Order creation and processing pipeline
- ✅ Image upload to Supabase
- ✅ Stock and inventory management
- ✅ Cart context with localStorage
- ✅ Search functionality
- ✅ Caching layer (Redis + use cache)
- ⚠️ Authentication UI exists but backend integration is partial
- ⚠️ Sample data used as fallback when DB is unavailable
- ⏳ Payment integration (TODO)
- ⏳ Wishlist (UI icon present, backend pending)

## Getting Started

```bash
npm install
cp .env.example .env  # configure DATABASE_URL, DIRECT_URL, SUPABASE keys, UPSTASH_REDIS_URL
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront.
Admin panel at `/admin`.
