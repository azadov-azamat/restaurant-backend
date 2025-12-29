# Restaurant Management Backend

NestJS + Prisma + PostgreSQL + WebSocket

## Setup

1. Clone this folder to a separate directory
2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
DATABASE_URL="postgresql://restaurant_db_x93k_user:YOUR_PASSWORD@YOUR_HOST/restaurant_db_x93k"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
```

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

5. Seed database with default admin:
```bash
npx prisma db seed
```

6. Start development server:
```bash
npm run start:dev
```

## API Endpoints

### Auth
- POST /auth/login - Login
- POST /auth/register - Register (admin only)
- GET /auth/me - Current user

### Staff
- GET /staff - List all staff
- POST /staff - Create staff
- PATCH /staff/:id - Update staff
- DELETE /staff/:id - Delete staff

### Floors
- GET /floors - List all floors
- POST /floors - Create floor
- PATCH /floors/:id - Update floor
- DELETE /floors/:id - Delete floor

### Rooms
- GET /rooms - List all rooms
- GET /rooms/:id - Get room with elements
- POST /rooms - Create room
- PATCH /rooms/:id - Update room
- PATCH /rooms/:id/elements - Update room elements
- DELETE /rooms/:id - Delete room

### Categories
- GET /categories - List all categories
- POST /categories - Create category
- PATCH /categories/:id - Update category
- DELETE /categories/:id - Delete category

### Menu Items
- GET /menu - List all menu items
- POST /menu - Create menu item
- PATCH /menu/:id - Update menu item
- DELETE /menu/:id - Delete menu item

### Orders
- GET /orders - List orders (filtered by role)
- GET /orders/:id - Get order details
- POST /orders - Create order
- PATCH /orders/:id/items - Add/update items
- PATCH /orders/:id/item/:itemId/status - Update item status
- PATCH /orders/:id/pay - Mark order as paid
- DELETE /orders/:id - Cancel order

### WebSocket Events
- `order:new` - New order created
- `order:updated` - Order updated
- `order:item:status` - Order item status changed
- `kitchen:new` - New item sent to kitchen
- `kitchen:ready` - Item ready for pickup

## Project Structure

```
src/
├── auth/           # Authentication module
├── staff/          # Staff management
├── floors/         # Floor management
├── rooms/          # Room & layout management
├── categories/     # Category management
├── menu/           # Menu items management
├── orders/         # Orders & order items
├── websocket/      # Real-time WebSocket gateway
├── common/         # Guards, decorators, filters
└── prisma/         # Prisma service
