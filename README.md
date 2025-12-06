## 🪩 Xchange — Share Coupons. Claim Offers. Save Together.

Xchange is a **community-powered coupon sharing platform** that prevents unused coupons from expiring.
Users can **share their unused offers**, **browse available deals**, and **claim coupons securely** — one claim per offer guaranteed.

Built with a **modern, glossy dark UI** and smooth gradients throughout the dashboard experience.

---

### 🚀 Features

| Feature                  | Description                                     |
| ------------------------ | ----------------------------------------------- |
| 🔐 Secure Auth           | Google Login + Magic Link (Supabase Auth)       |
| 🎁 Create Offers         | Share coupons before they expire                |
| 🔍 Browse Offers         | Filter & sort offers by category or expiry      |
| 🏆 Claim System          | Only one person can claim an offer              |
| 🔑 Private Coupon Access | Coupon code revealed only to the claimer        |
| 📊 Profile Dashboard     | Stats, latest offers, and editable profile      |
| 🍭 Glassmorphism UI      | Everywhere — glossy cards and neon glow effects |
| 🌙 Theme Support         | Fully compatible with dark mode                 |

---

### 🖼 Screenshots (Replace later)

| Page          | Screenshot                    |
| ------------- | ----------------------------- |
| Landing Page  | `./screenshots/home.png`      |
| Dashboard     | `./screenshots/dashboard.png` |
| Browse Offers | `./screenshots/browse.png`    |
| Offer Details | `./screenshots/details.png`   |
| Profile       | `./screenshots/profile.png`   |

---

## 🛠 Tech Stack

| Category   | Technology                                                       |
| ---------- | ---------------------------------------------------------------- |
| Frontend   | **Next.js 14 (App Router)** + **TypeScript**                     |
| UI         | **TailwindCSS** + **glassmorphism gradients** + **Lucide Icons** |
| Auth       | **Supabase Auth (Google OAuth + Magic Link)**                    |
| Database   | **Supabase PostgreSQL**                                          |
| Edge Logic | **Supabase Row Level Security (RLS)**                            |
| Hosting    | Vercel (recommended)                                             |

---

## 📂 Project Structure

```
/
├─ app
│  ├─ login/
│  ├─ dashboard/
│  │  ├─ create-offer/
│  │  ├─ browse-offers/
│  │  │  ├─ [id]/
│  │  ├─ claimed-offers/
│  │  ├─ profile/
│  ├─ loading.tsx (custom animated loading screen)
├─ lib/
│  ├─ supabase.ts
├─ public/
│  ├─ logo.svg
│  ├─ screenshots/
└─ README.md
```

---

## ⚙️ Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🔧 Install & Run Locally

```bash
git clone https://github.com/YOUR-USERNAME/xchange.git
cd xchange
npm install
npm run dev
```

Then visit 👉 `http://localhost:3000`

---

## 🧠 Login System

Xchange supports two login methods:

| Method               | Behavior                                     |
| -------------------- | -------------------------------------------- |
| Continue with Google | Redirects to Dashboard after successful auth |
| Magic Link           | User receives secure login link via email    |

---

## 💾 Database Schema (Simplified)

### `profiles`

| column     | type      |
| ---------- | --------- |
| id         | uuid (pk) |
| email      | text      |
| name       | text      |
| avatar     | text      |
| created_at | timestamp |

### `offers`

| column      | type                                                |
| ----------- | --------------------------------------------------- |
| id          | uuid (pk)                                           |
| owner_id    | uuid (fk → profiles)                                |
| title       | text                                                |
| description | text                                                |
| coupon_code | text                                                |
| category    | text                                                |
| expiry_date | timestamp                                           |
| status      | enum("available", "claimed", "expired", "reserved") |
| created_at  | timestamp                                           |

### `claims`

| column     | type                 |
| ---------- | -------------------- |
| id         | uuid (pk)            |
| offer_id   | uuid (fk → offers)   |
| claimer_id | uuid (fk → profiles) |
| claimed_at | timestamp            |

---

## ☁ Deployment Notes

| Provider        | Recommended Settings                          |
| --------------- | --------------------------------------------- |
| **Vercel**      | Root folder deploy, env vars configured       |
| **Supabase**    | Enable RLS + use row policies for safe claims |
| **GitHub Repo** | Optional CI/CD with Vercel                    |

---

## 🗺 Roadmap (Future Enhancements)

* 🔔 Real-time notifications when offers are claimed
* ⭐ Favorite / Watchlist for offers
* 🏅 Leaderboard for most helpful sharers
* 📱 Full mobile app using Flutter / React Native
* 💬 Chat between sharer & claimer (private)

---

## 🤝 Contributing

Pull requests are welcome!
Before contributing, please open an issue so features can be discussed.

---

## 📝 License

MIT License © 2025 — *Xchange by the Community.*

---

## 🌟 If you like this project…

Consider giving the repo a **star ⭐ on GitHub** — it helps a lot!


