# How the FGT Trading OPC online store is built and deployed

## 1. What the system is

Three parts, all in this repo:

| Part | Folder | What it is | Address on AWS |
|---|---|---|---|
| Customer storefront | `src/store-app` + `src/pages/storefront` | React app customers use to browse, quote, order and pay | `https://fgttrading.ph` |
| Admin portal | `src/admin-app` + `src/pages/admin` | React app staff use for products, orders, quotes | `https://admin.fgttrading.ph` |
| API | `server/` | Node + Express + MongoDB. Prices every order itself, takes payments, serves photos and videos | `/api` on both addresses |

The storefront and the admin are built separately (`dist/store`, `dist/admin`), so no admin code is ever sent to customers. Both call the API on their own address (`/api`). Shared code (`src/lib`, `src/store`, `src/data`, `src/components`) is compiled into whichever app uses it.

```
Customer browser ─┐                       ┌─ /srv/store  (storefront files)
                  ├─► Caddy (HTTPS) ──────┤
Admin browser ────┘   on the Lightsail    ├─ /srv/admin  (admin files)
                      server              └─ /api, /uploads ─► API container ─► MongoDB
                                                                  │
                                                                  └─► Maya (payments)
```

## 2. Where things run

| | Demo (now) | Real site (AWS) |
|---|---|---|
| Purpose | Live preview for the client | Production, FGT's own accounts |
| Hosting | Vercel, one project, builds `main` | One AWS Lightsail server, Docker Compose |
| Addresses | `e-com-project-blush.vercel.app` and `/admin` | `fgttrading.ph` and `admin.fgttrading.ph` |
| Database | MongoDB Atlas | MongoDB Atlas (recommended) or the bundled MongoDB container |
| Photo upload | Not available (use image links) | Works (saved on the server disk, included in backups) |
| Payments | Maya sandbox, shared public keys | Maya live keys, FGT's own account |

The demo keeps working as it is. Nothing below changes it.

## 3. Run it on your computer

Needs Node 22.

```
npm install
npm install --prefix server
cp server/.env.example server/.env      # fill in MONGODB_URI, JWT_SECRET (see section 6)
npm run seed --prefix server            # first time only: loads the demo catalog
npm run dev --prefix server             # API on http://localhost:4000
npm run dev:store                       # storefront on http://localhost:8443
npm run dev:admin                       # admin on http://localhost:8444 (separate terminal)
```

Build both apps: `npm run build` (creates `dist/store` and `dist/admin`).

## 4. Build the real site on AWS (one Lightsail server)

Do this with FGT's own AWS account. Estimated cost: see the setup checklist given to the client.

### 4.1 One-time AWS setup

1. In Lightsail, create an instance: Linux, **Ubuntu 22.04**, plan **2 GB RAM** (4 GB if traffic grows). Name it `fgt-store`.
2. Attach a **static IP** (Networking tab) so the address never changes.
3. Firewall (Networking tab): allow TCP **22** (SSH), **80** and **443**. Nothing else.
4. Turn on **automatic snapshots** (daily backups) for the instance.

### 4.2 Domain

1. Buy the `.ph` domain (for example at Namecheap) under FGT's account.
2. Add two DNS **A records** pointing to the static IP: `@` (fgttrading.ph) and `admin`. Add `www` too if wanted.
3. Wait until both addresses resolve (a few minutes to a few hours). HTTPS cannot start before this.

### 4.3 Database

Recommended: **MongoDB Atlas** (managed, has its own backups). Create a cluster, a database user, and under Network Access allow the server's static IP. Copy the connection string and put the database name in it, for example `.../fgt?retryWrites=true&w=majority`.

Alternative: skip Atlas and use the bundled `mongo` container. It lives on the same server and is covered by the Lightsail snapshots.

### 4.4 Install and start

SSH into the server, then:

```
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER      # log out and back in once
git clone https://github.com/Seraphslayer/E-com-project.git
cd E-com-project
cp .env.example .env
nano .env                          # fill in as in section 6
docker compose up -d --build
docker compose exec api node dist/seed/run.js    # first time only (loads the product catalog)
```

Open `https://fgttrading.ph` and `https://admin.fgttrading.ph`. Caddy gets the HTTPS certificates by itself. If the sites do not open, run `docker compose logs web` and check that the DNS records point to the server.

### 4.5 Update the site later

```
cd E-com-project && git pull && docker compose up -d --build
```

Uploaded photos and the bundled database are stored in Docker volumes and survive updates.

## 5. Online payments (Maya)

The code is finished and works with Maya's sandbox. To accept real money:

1. FGT opens its own Maya Business account and gets approved (see the Online Payment Go-Live Checklist).
2. Put the live keys in `.env`: `MAYA_PUBLIC_KEY`, `MAYA_SECRET_KEY`, and `MAYA_API_URL=https://pg.maya.ph`.
3. `docker compose up -d` to apply, then make one small real payment and refund it.

How it is protected: amounts always come from the order saved on the server, never from the browser. A payment is marked paid only after the server asks Maya for the checkout's status.

## 6. Settings (`.env` on the server)

| Setting | What to put |
|---|---|
| `STORE_DOMAIN` | `fgttrading.ph` |
| `ADMIN_DOMAIN` | `admin.fgttrading.ph` |
| `CORS_ORIGINS` | `https://fgttrading.ph,https://admin.fgttrading.ph` |
| `SITE_URL` | `https://fgttrading.ph` (used for the return links after payment) |
| `VITE_STORE_URL` | `https://fgttrading.ph` (admin "Back to site" link) |
| `JWT_SECRET` | 32+ random characters (command inside `.env.example`). Keep private. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First admin login. Created only when no users exist. Change it after the first login. |
| `MONGODB_URI` | Atlas connection string (leave out to use the bundled database) |
| `MAYA_*` | Section 5 |

## 7. Backups and care

- **Server:** Lightsail daily snapshots. This covers the code, uploaded photos and the bundled database.
- **Database on Atlas:** Atlas backups (turn on in the cluster settings).
- **Restore:** create a new instance from the latest snapshot, move the static IP to it.
- **Logs:** `docker compose logs -f api` and `docker compose logs -f web`.
- **Health check:** `https://fgttrading.ph/api/health` should answer `{"ok":true,...}`.
- **Updates:** run `sudo apt upgrade` on the server monthly.

## 8. What is not built yet

- Order and quote emails (no email sending is wired in; the Amazon SES account in the checklist is for this later step).
- The admin Dashboard, Customers and Payments pages still show demo numbers.
- Online orders keep their stock reserved until an admin cancels an unpaid one.
- Customer web addresses begin with `/store` (for example `fgttrading.ph/store/products`).
- The Docker and Caddy files have not been run on a real server yet (the Docker Compose file was checked, the Caddyfile was not). Expect a short first-deploy test.
