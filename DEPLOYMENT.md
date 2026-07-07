# Deployment Guide — Hostinger + Render + Neon (no credit card)

Three pieces, three free homes:

- **Frontend** — Vite/React SPA → **Hostinger** (Business Web Hosting, `public_html`)
- **Backend** — Express API → **Render** (free web service, no card)
- **Database** — PostgreSQL → **Neon** (free, no card)

Do the steps **in order** — the frontend build needs the API URL, and the API
needs the database URL.

---

## 0. Get your secrets ready

| Secret | Where |
|---|---|
| `GROQ_API_KEY` | https://console.groq.com → API Keys (needed for AI tools) |
| Google OAuth (optional) | Google Cloud Console → Credentials (only if using "Sign in with Google") |

---

## 1. Database — Neon (free, no card)

1. Go to **https://neon.tech** → sign up (GitHub login is fine) → **Create project**.
2. Name it anything (e.g. `truelancer`), pick a region near you → **Create**.
3. On the project dashboard, click **Connect** and copy the **connection string**.
   It looks like:
   ```
   postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. Keep this handy — it's your `DATABASE_URL`.

> No card required. The app auto-creates its tables on first boot.

---

## 2. Backend API — Render (free web service, no card)

1. Go to **https://dashboard.render.com** → **New +** → **Blueprint**.
2. Select your repo **`Abdulwasikhn14/truelancer-ai-assistant`** → Render reads
   `render.yaml` and shows one **web service** `truelancer-api` (no database — good,
   that's why there's no card prompt).
3. Click **Apply / Create**.
4. Open the **`truelancer-api`** service → **Environment**, and set the blank
   (`sync:false`) values:
   - `DATABASE_URL` = your Neon connection string from Step 1
   - `GROQ_API_KEY` = your Groq key
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` = Google creds (skip if unused)
   - Leave `FRONTEND_URL` and `GOOGLE_CALLBACK_URL` blank for now.
5. Save → it deploys. Copy the service URL, e.g. **`https://truelancer-api.onrender.com`**.
6. Sanity check: open that URL — you should see `{"message":"Truelancer API is running"}`,
   and the **Logs** tab should show `PostgreSQL connected`.

> `JWT_SECRET` and `SESSION_SECRET` are generated automatically.

---

## 3. Frontend — build with the API URL, upload to Hostinger

On your computer, in the project folder:

```bash
# Windows PowerShell
$env:VITE_API_URL = "https://truelancer-api.onrender.com"   # your Render URL, no trailing slash
npm install
npm run build
```

This produces a **`dist/`** folder (it already includes the `.htaccess` for SPA routing).

Then upload it to Hostinger:

1. hPanel → **Files → File Manager** (or use FTP).
2. Open **`public_html`**. If deploying to your main domain, delete the default
   `default.php`/placeholder files already there.
3. Upload **everything inside `dist/`** (not the `dist` folder itself) into
   `public_html` — including the hidden **`.htaccess`**.
   - In File Manager, use **Upload** and select all files; to include `.htaccess`,
     enable "show hidden files" or upload the zip and extract.
   - Tip: zip the *contents* of `dist`, upload the zip, then **Extract** in `public_html`.
4. Visit your domain — the site should load. Refreshing `/dashboard` should work
   (that's the `.htaccess` doing its job).

---

## 4. Connect them (CORS + OAuth)

Back on Render → **`truelancer-api`** → **Environment**:

- `FRONTEND_URL` = your Hostinger site URL (e.g. `https://yourdomain.com`) — **no trailing slash**
- `GOOGLE_CALLBACK_URL` = `https://truelancer-api.onrender.com/api/auth/google/callback`

Save → Render redeploys.

### If using Google login
Google Cloud Console → your OAuth client → add:
- **Authorized redirect URI:** `https://truelancer-api.onrender.com/api/auth/google/callback`
- **Authorized JavaScript origin:** `https://yourdomain.com`

---

## 5. Verify

1. Open your Hostinger domain → sign up / log in.
2. Try a tool (Proposal, Chatbot, Pricing). If it responds, the whole chain works.
3. If something fails, check Render **Logs** and your browser **DevTools → Network** tab.

---

## Updating later

- **Frontend change:** re-run `npm run build` and re-upload `dist/` to `public_html`.
  (Hostinger shared hosting has no git auto-deploy — it's a manual upload each time.)
- **Backend change:** just `git push` — Render auto-redeploys from `main`.

## Gotchas

- **Render free tier sleeps** after ~15 min idle; first request then takes ~30–50s to wake.
- **No trailing slashes** on `VITE_API_URL` / `FRONTEND_URL`, or CORS will reject requests.
- **`VITE_API_URL` is baked in at build time** — if the API URL changes, rebuild and re-upload the frontend.
