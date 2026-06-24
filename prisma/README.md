# Prisma Setup with Supabase

## Setup Instructions

### 1. Get Supabase Connection Strings

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Database**
3. Find the **Connection string** section
4. Copy both connection strings:
   - **Connection pooling** (port 6543) - for DATABASE_URL
   - **Direct connection** (port 5432) - for DIRECT_URL

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply migrations
npx prisma migrate dev --name init

# Or push schema directly (for development)
npx prisma db push
```

### 4. Open Prisma Studio (Optional)

```bash
npx prisma studio
```

## Database Schema

The schema includes:

- **Users** - User accounts with roles (USER/ADMIN)
- **Categories** - Product categories
- **Products** - Product catalog with pricing, stock, images
- **Orders** - Customer orders with status tracking
- **OrderItems** - Individual items in orders
- **Earnings** - Revenue tracking per order
- **Reviews** - Product reviews and ratings

## Usage in Your App

```javascript
import prisma from '@/lib/prisma'

// Example: Get all products
const products = await prisma.product.findMany({
  include: {
    category: true
  }
})

// Example: Create an order
const order = await prisma.order.create({
  data: {
    orderNumber: 'ORD-001',
    userId: 'user-id',
    totalAmount: 100.00,
    shippingAddress: '123 Main St',
    city: 'City',
    postalCode: '12345',
    phone: '+1234567890',
    paymentMethod: 'card',
    orderItems: {
      create: [
        {
          productId: 'product-id',
          quantity: 2,
          price: 50.00
        }
      ]
    }
  }
})
```
