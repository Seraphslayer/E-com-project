# FGT Trading OPC — API

Express 5 + MongoDB (Mongoose) backend for the storefront and admin portal.
Handles products, product photo/video uploads, orders, quote requests, reviews, blog posts and admin login.

## Run it locally (with your own MongoDB)

```bash
cd server
npm install
cp .env.example .env      # then fill in the values (see below)
npm run seed              # loads the 13 demo products, reviews and posts (only into empty collections)
npm run dev               # http://localhost:4000
```

`.env` needs at least:

| Variable | What to put |
|---|---|
| `MONGODB_URI` | Your connection string. Local: `mongodb://127.0.0.1:27017/fgt`. Atlas: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/fgt?retryWrites=true&w=majority` (also allow your IP in Atlas → Network Access). |
| `JWT_SECRET` | 32+ random characters: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | The first admin login. Created automatically on startup when there are no users (password: 8+ characters). |
| `CORS_ORIGINS` | Addresses the website is served from, comma separated. Dev default covers `http://localhost:8443` (Vite) and `:5173`. |

The Vite dev server (`pnpm run dev` in the project root) already forwards `/api` and `/uploads` to `http://localhost:4000`, so the frontend can call the API with relative URLs.

Check it's up: `GET http://localhost:4000/api/health` → `{"ok":true,"db":"connected"}`.

## Run everything in Docker (client's server / AWS)

From the project root:

```bash
cp .env.example .env            # fill in JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, CORS_ORIGINS
docker compose up -d --build
docker compose exec api node dist/seed/run.js    # optional: load the demo catalog
```

This starts MongoDB, the API, and nginx serving the website (port 80, change with `WEB_PORT`). nginx forwards `/api` and `/uploads` to the API, so the whole site lives at one address.
To use Atlas or another existing MongoDB instead, set `MONGODB_URI` in `.env`.

Data lives in two Docker volumes: `mongo-data` (database) and `uploads` (product photos/videos). **Back both up.**
For HTTPS, put a reverse proxy or load balancer in front of port 80 (Caddy, an AWS ALB/CloudFront, etc.) and set `CORS_ORIGINS` to the https address.

## API overview

Public = no login. Admin = `Authorization: Bearer <token>` from `POST /api/auth/login`.

| Method & path | Who | What |
|---|---|---|
| `POST /api/auth/login` | public | `{email, password}` → `{token, user}` |
| `GET /api/auth/me` | admin | Current admin |
| `GET /api/products` | public | List. Filters: `category`, `brand` (comma separated), `search`, `sort` (`price-asc`, `price-desc`, `rating`, `reviews`, `newest`), `limit`, `skip`. Total in `X-Total-Count`. |
| `GET /api/products/:id` | public | One product |
| `POST /api/products` · `PUT /api/products/:id` · `DELETE /api/products/:id` | admin | Create / update (partial OK) / delete |
| `POST /api/media` | admin | Multipart upload, field `files` (up to 10). Returns `[{url, type, size}]`; `url` is like `/uploads/….jpg` and goes into a product's `image`, `images` or `video`. |
| `DELETE /api/media/:filename` | admin | Remove an uploaded file |
| `POST /api/orders` | public | Place an order. Send customer, address, `items: [{productId, quantity}]`, `shippingMethod`, `paymentMethod`. Prices and totals are **calculated by the server**. |
| `GET /api/orders/track?id=ORD-20101&email=…` | public | Customer order lookup |
| `GET /api/orders` · `GET /api/orders/:id` · `PATCH /api/orders/:id` | admin | List (`status`, `search`, `limit`, `skip`) / view / update status, payment status, tracking. Cancelling returns stock. |
| `POST /api/quotes` | public | Quote request form |
| `GET /api/quotes` · `PATCH /api/quotes/:id` · `DELETE /api/quotes/:id` | admin | Manage quote requests |
| `GET /api/reviews?productId=` · `POST /api/reviews` | public | Published reviews / submit one (waits for approval) |
| `GET /api/reviews/admin/all` · `PATCH /api/reviews/:id` · `DELETE /api/reviews/:id` | admin | Moderate; product ratings update automatically |
| `GET /api/posts` | public | Published blog posts |
| `GET /api/posts/admin/all` · `POST` · `PUT /:id` · `DELETE /:id` | admin | Manage posts |
| `GET /api/admin/stats` | admin | Dashboard numbers |

Errors are JSON: `{"error": "message", "details": [...]}` with a proper status code (400 validation, 401 sign-in, 404, 409 stock/duplicate, 429 rate limit).

Order pricing (matches the storefront cart): VAT 12%, shipping ₱850 (free over ₱20,000), plus ₱650 for priority or ₱1,500 for delivery with installation. Quote-only products can't be ordered, they must go through a quote request. Stock is reserved when an order is placed.

## Connecting the frontend (next step)

Nothing in the frontend calls this API yet. The swap points are small:

- `src/store/productStore.ts` — load from `GET /api/products`; save/delete via the admin endpoints.
- `src/store/mediaStore.ts` — `uploadMedia()` becomes a `POST /api/media` call returning the `/uploads/…` URL.
- Checkout → `POST /api/orders`, Quote page → `POST /api/quotes`, Orders page → `/api/orders/track`.
- Admin login screen → `POST /api/auth/login`, keep the token for admin calls.

## Not done yet

- **Payments.** Orders store `paymentMethod`, `paymentStatus` and `paymentReference`, but PayMongo isn't wired in (create the payment on order, a webhook to mark it `paid`). Until then every order starts as `pending`.
- Customer accounts (checkout is guest + order lookup by order number and email), email notifications, and a "forgot password" flow.
- Uploaded files are stored on disk. For AWS you may want S3 instead; `routes/media.ts` is the only place to change.
- Verified so far: the code compiles and the route logic (login, admin protection, validation, order totals, stock reservation and rollback, CORS) passes tests with the database calls stubbed. It has **not** been run against a real MongoDB yet, and the Docker images haven't been built, so do a first run on your machine and tell me what breaks.

## Security notes

- Passwords are hashed with bcrypt; admin tokens are signed JWTs that expire (`JWT_EXPIRES_IN`).
- All input is validated; order totals can't be set by the browser; uploads are limited to JPG/PNG/WebP/GIF/MP4/WebM, renamed randomly, size-capped, and admin-only.
- Login, orders, quotes, reviews and order lookup are rate limited per IP.
- Never commit `.env`. Use a fresh `JWT_SECRET` and a strong admin password in production.
