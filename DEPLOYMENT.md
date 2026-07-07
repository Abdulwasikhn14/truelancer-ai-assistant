# Deployment Guide — Vercel (frontend) + Render (API + PostgreSQL)

This app has three parts:

- **Frontend** — Vite/React SPA → **Vercel**
- **Backend** — Express API → **Render** (web service)
- **Database** — PostgreSQL → **Render** (managed database)

The repo already contains everything needed: `vercel.json` (SPA routing) and
`render.yaml` (API + database blueprint). Follow the steps in order.

---

## 0. Before you start — gather secrets

You'll need these ready to paste:

| Secret | Where to get it |
|---|---|
| `GROQ_API_KEY` | https://console.groq.com → API Keys |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console → APIs & Services → Credentials (only if you use "Sign in with Google") |

`JWT_SECRET` and `SESSION_SECRET` are generated automatically by Render — you don't need to create them.

---

## 1. Deploy the backend + database on Render

1. Go to **https://dashboard.render.com** → **New +** → **Blueprint**.
2. Connect your GitHub and select **`Abdulwasikhn14/truelancer-ai-assistant`**.
3. Render reads `render.yaml` and shows a web service **`truelancer-api`** + database **`truelancer-db`**. Click **Apply**.
4. The database provisions and the API starts building. When the web service is
   live, copy its URL — it looks like **`https://truelancer-api.onrender.com`**.
5. Open the **`truelancer-api`** service → **Environment** and fill the secrets
   that were left blank (`sync: false`):
   - `GROQ_API_KEY` = your Groq key
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` = your Google creds (skip if not using Google login)
   - Leave `FRONTEND_URL` and `GOOGLE_CALLBACK_URL` for **Step 3** (we need the Vercel URL first).

> The `DATABASE_URL`, `JWT_SECRET`, and `SESSION_SECRET` are already wired/generated automatically.

---

## 2. Deploy the frontend on Vercel

1. Go to **https://vercel.com** → **Add New… → Project** → import the same GitHub repo.
2. Vercel auto-detects Vite. Leave the defaults (Build `vite build`, Output `dist`).
3. Under **Environment Variables**, add:
   - `VITE_API_URL` = your Render API URL from Step 1 (e.g. `https://truelancer-api.onrender.com`) — **no trailing slash**.
4. Click **Deploy**. When it's done, copy your Vercel URL (e.g. `https://truelancer.vercel.app`).

---

## 3. Connect the two (fixes CORS + OAuth)

Back on Render → **`truelancer-api`** → **Environment**, set:

- `FRONTEND_URL` = your Vercel URL (e.g. `https://truelancer.vercel.app`) — **no trailing slash**
- `GOOGLE_CALLBACK_URL` = `https://truelancer-api.onrender.com/api/auth/google/callback`

Save → Render redeploys automatically.

### If you use Google login
In **Google Cloud Console → Credentials → your OAuth client**, add:

- **Authorized redirect URI:** `https://truelancer-api.onrender.com/api/auth/google/callback`
- **Authorized JavaScript origin:** `https://truelancer.vercel.app`

---

## 4. Verify

1. Open the Render API URL directly → you should see `{"message":"Truelancer API is running"}`.
2. Open your Vercel URL → sign up / log in → try a tool (Proposal, Chatbot, etc.).
3. Check the Render **Logs** tab for `PostgreSQL connected` and `Server running on port …`.

---

## Notes & gotchas

- **Render free tier sleeps** after ~15 min idle; the first request afterward
  takes ~30–50s to wake. Fine for demos; upgrade for always-on.
- **Trailing slashes matter** — `FRONTEND_URL` / `VITE_API_URL` must not end in `/`,
  or CORS will reject requests.
- **Env changes require a redeploy.** Render redeploys on save; on Vercel, changing
  an env var needs a **Redeploy** from the Deployments tab.
- **Auto-deploys:** both platforms redeploy automatically on every push to `main`.
- **Local dev** is unchanged: copy `.env.example` → `.env` in both root and `server/`,
  run the API (`cd server && npm run dev`) and the app (`npm run dev`).
