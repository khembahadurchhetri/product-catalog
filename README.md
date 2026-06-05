# Product Catalog — Fullstack Next.js App

A small e-commerce product catalog with search, filters, sorting, product details, and a **server-persisted cart** for authenticated users.

## Tech stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS**
- **PostgreSQL** + **Drizzle ORM**
- **NextAuth.js** (credentials provider)

## Features

- Product listing with image, name, price, rating, short description
- Debounced search (name + description)
- Multi-select category filters + price range sliders
- Sort by price (asc/desc) and rating (high → low)
- Product detail pages at `/products/[slug]`
- Cart in navbar; persisted in PostgreSQL for signed-in users only
- Responsive, accessible UI (semantic HTML, labels, focus styles, alt text)

## Quick start

### 1. Database

```bash
docker compose up -d
```

### 2. Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` and set `AUTH_SECRET` (e.g. `openssl rand -base64 32`).

### 3. Install & migrate

```bash
npm install
npm run db:migrate
npm run db:seed
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo account:** `demo@shop.dev` / `password123`

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply SQL migrations |
| `npm run db:seed` | Seed 18 products + demo user |
| `npm run db:studio` | Open Drizzle Studio |

## Deploy (Vercel + Neon)

1. Create a [Neon](https://neon.tech) PostgreSQL database and copy `DATABASE_URL`.
2. Push this repo to GitHub.
3. Import the project in [Vercel](https://vercel.com).
4. Set environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL` = your production URL (e.g. `https://your-app.vercel.app`)
5. Deploy, then run migrations and seed against production (from your machine):

   ```bash
   DATABASE_URL="your-neon-url" npm run db:migrate
   DATABASE_URL="your-neon-url" npm run db:seed
   ```

## API routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | No | List/filter products |
| GET | `/api/products/[slug]` | No | Single product |
| POST | `/api/register` | No | Create account |
| GET/POST/PATCH/DELETE | `/api/cart` | Yes | Cart CRUD |

## Design reference

UI matches the [Figma Internship Test](https://www.figma.com/design/6tQwfFiO4kwfPbhHA6ChSR/Internship-Test): black/white **Catalog** branding, sidebar filters (category, color swatches, price), pagination, mobile category chips + bottom nav, and product detail gallery with color selection.
