# ShopHub — Full-Stack REST API Project

Stack: Express.js + TypeScript + Prisma ORM + PostgreSQL (backend) · React + Vite + TypeScript + Tailwind (frontend)

## 1. Project Structure

```
project/
├── server/                  # Backend (Express + TS + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── app.ts
│   │   ├── server.ts
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   │   ├── user/
│   │   │   ├── category/
│   │   │   ├── product/
│   │   │   ├── review/
│   │   │   └── order/
│   │   ├── middlewares/
│   │   ├── lib/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── client/                  # Frontend (React + Vite + Tailwind)
    ├── src/
    │   ├── api/
    │   ├── context/
    │   ├── pages/
    │   ├── components/
    │   └── types/
    ├── .env.example
    └── package.json
```

## 2. Database Design

**Enums:** `Role` (USER, ADMIN), `ProductStatus` (ACTIVE, INACTIVE, OUT_OF_STOCK), `OrderStatus` (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)

**Models:** User, Category, Product, Review, Order, OrderItem — all with `id`, `createdAt`, `updatedAt`, `isDeleted` (soft delete), and `@@map()` table names. Relations: Category 1—N Product, Product 1—N Review, User 1—N Review, User 1—N Order, Order 1—N OrderItem, Product 1—N OrderItem.

## 3. Local Setup — Step by Step

### Step 1 — Get a free PostgreSQL database (Neon)
1. Go to https://neon.tech and sign up (free tier).
2. Create a new project → copy the connection string it gives you (looks like `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require`).

### Step 2 — Backend setup
```bash
cd server
npm install
cp .env.example .env
```
Open `.env` and paste your Neon connection string into `DATABASE_URL`, and set a random long string for `JWT_SECRET`.

```bash
npx prisma migrate dev --name init
npx prisma generate
npm run seed        # creates an admin user + sample categories/products
npm run dev          # starts on http://localhost:5000
```
Admin login after seeding: `admin@example.com` / `Admin@123`

Open Prisma Studio any time to browse your DB visually:
```bash
npx prisma studio
```

### Step 3 — Frontend setup
```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL should point to http://localhost:5000/api
npm run dev             # starts on http://localhost:5173
```

Visit `http://localhost:5173`, register an account, browse products, place an order, leave a review. Log in as the seeded admin to access `/admin` and add categories/products.

## 4. API Documentation

Base URL: `/api` · All responses follow: `{ "success": boolean, "message": string, "data": {...} }`

### Auth
| Method | Endpoint | Description | Body | Auth |
|---|---|---|---|---|
| POST | /api/auth/register | Register new user | `{ name, email, password }` | No |
| POST | /api/auth/login | Login | `{ email, password }` | No |

### Users
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/users/me | Get logged-in profile | User |
| GET | /api/users | List all users | Admin |
| GET | /api/users/:id | Get user by id | Admin |
| PATCH | /api/users/:id | Update user | Admin |
| DELETE | /api/users/:id | Soft-delete user | Admin |

### Categories
| Method | Endpoint | Description | Body | Auth |
|---|---|---|---|---|
| GET | /api/categories | List categories | — | No |
| GET | /api/categories/:id | Get category | — | No |
| POST | /api/categories | Create category | `{ name, description? }` | Admin |
| PATCH | /api/categories/:id | Update category | `{ name?, description? }` | Admin |
| DELETE | /api/categories/:id | Soft-delete category | — | Admin |

### Products
| Method | Endpoint | Description | Query/Body | Auth |
|---|---|---|---|---|
| GET | /api/products | List products (paginated) | `?categoryId&status&search&page&limit` | No |
| GET | /api/products/:id | Get product + reviews | — | No |
| POST | /api/products | Create product | `{ title, price, categoryId, description?, stock?, imageUrl?, status? }` | Admin |
| PATCH | /api/products/:id | Update product | partial body | Admin |
| DELETE | /api/products/:id | Soft-delete product | — | Admin |

### Reviews
| Method | Endpoint | Description | Body | Auth |
|---|---|---|---|---|
| GET | /api/reviews | List reviews | `?productId` | No |
| GET | /api/reviews/:id | Get review | — | No |
| POST | /api/reviews | Create review | `{ productId, rating, comment? }` | User |
| PATCH | /api/reviews/:id | Update own review | `{ rating?, comment? }` | User |
| DELETE | /api/reviews/:id | Delete own review | — | User |

### Orders
| Method | Endpoint | Description | Body | Auth |
|---|---|---|---|---|
| POST | /api/orders | Place order | `{ items: [{ productId, quantity }], address? }` | User |
| GET | /api/orders | List own orders (all orders for admin) | — | User |
| GET | /api/orders/:id | Get order | — | User |
| PATCH | /api/orders/:id/status | Update order status | `{ status }` | Admin |
| DELETE | /api/orders/:id | Soft-delete order | — | User |

**Status codes:** 200 OK · 201 Created · 400 Bad Request · 401 Unauthorized · 403 Forbidden · 404 Not Found · 409 Conflict · 500 Server Error

## 5. Deployment

### Backend → Render
1. Push the `server/` folder to a GitHub repo.
2. On https://render.com create a new **Web Service**, connect the repo.
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npm start`
5. Add environment variables: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (your Vercel URL), `NODE_ENV=production`.
6. After first deploy, run migrations once from the Render shell: `npx prisma migrate deploy`.

### Frontend → Vercel
1. Push `client/` to GitHub (or same repo, different root directory).
2. Import into https://vercel.com, set root directory to `client`.
3. Add env var `VITE_API_URL` = `https://your-backend.onrender.com/api`.
4. Deploy.

## 6. Submission Checklist
- [ ] Live backend URL (Render)
- [ ] Live frontend URL (Vercel)
- [ ] GitHub repo link
- [ ] This README as API documentation
