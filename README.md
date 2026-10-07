# ♻️ Online E-Waste Management & Recycling System

A modern, full-stack web application designed to optimize e-waste collection, incentivize electronic recycling, track carbon emission reductions with AI, and connect recycling customers with authorized collection agents and administrators.

---

## 🌟 Key Features

### 1. 🤖 EcoBot AI — Smart Device & Carbon Emission Analyzer
- **Device Diagnosis**: Identifies gadgets (smartphones, laptops, PCs, tablets, monitors, appliances), evaluates age, specs, and condition.
- **Decision Engine**: Recommends whether to **Sell Now** (high market value), **Keep & Use** (smart refurbishment), or **Recycle Safely** (end-of-life hazardous waste prevention).
- **Carbon Footprint Calculator**: Computes exact **kg of CO₂e emissions saved**, tree equivalents, and avoided car driving kilometers.
- **1-Click Listing**: Seamlessly transfers analyzed device details directly into the collection submission form with pre-filled estimates.

### 2. 🌙 Modern Dark Mode UI & Glassmorphism
- High-tech obsidian (`#090d16`) and glowing emerald green (`#10b981`) aesthetic.
- Glassmorphic panels, animated floating AI launcher, modern status badges, and responsive tables.

### 3. 🔐 Unified Authentication with Staff Portal
- Unified **Sign In** and **Create Account** interface with seamless tab switching.
- Dedicated **Corner Staff Portal** switch for quick access to **Admin** and **Collection Agent** portals.
- Built-in quick demo credentials for effortless testing.

### 4. 👥 Three Specialized User Roles
- **Customer**: Submit e-waste items, upload device photos, view doorstep pickup statuses, track payments, and calculate environmental impact.
- **Collection Agent**: Access assigned pickups in real-time, inspect customer addresses, and update status (`Pending` ➔ `Collected` ➔ `Paid` / `Cancelled`).
- **System Admin**: Overview metrics (total customers, agents, items, pending pickups), manage customer & agent registries, and audit payments.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Lucide Icons |
| **Backend** | Node.js, Express.js, JWT Authentication, bcryptjs |
| **Database** | AWS DynamoDB (with persistent local fallback for offline/local dev) |
| **Storage** | AWS S3 Presigned URLs for photo uploads |
| **Cloud Hosting** | Vercel Serverless Functions / AWS SAM (Lambda + API Gateway) |

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
# Install backend and client dependencies
npm run install:all
```

### 2. Run the Application
In your terminal, start both the backend API and the frontend client:

```bash
# Terminal 1 — Start Backend Server (port 5000)
npm run server

# Terminal 2 — Start Frontend Client (port 3000)
npm run client
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Default Demo Credentials

| Role | Username | Password |
|---|---|---|
| 🛡️ **Admin** | `admin` | `admin123` |
| 🚚 **Collection Agent** | `agent1` | `agent123` |
| 🧑‍💻 **Customer** | *(Register any account)* | *(Your password)* |

---

## ☁️ Deployment

### Deploy on Vercel
1. Push this project to a GitHub repository:
   ```bash
   git add .
   git commit -m "feat: complete e-waste platform"
   git push origin main
   ```
2. Import repository into [Vercel](https://vercel.com).
3. The included `vercel.json` and `api/index.js` automatically route API requests to Serverless Functions and serve the React SPA.

### Deploy on AWS (SAM CLI)
```bash
npm run sam:build
npm run sam:deploy
```

---

## 📁 Project Structure

```
Jatin Project/
├── api/
│   └── index.js              # Vercel serverless function entrypoint
├── backend/
│   ├── config/
│   │   ├── dynamo.js         # AWS DynamoDB DocumentClient & environment loader
│   │   └── localStore.js      # Persistent local fallback store for offline dev
│   ├── middleware/
│   │   └── auth.js           # JWT authentication & role-based route guards
│   ├── models/
│   │   ├── User.js           # User data access functions
│   │   ├── Product.js        # Product data access functions
│   │   └── Payment.js        # Payment data access functions
│   ├── routes/
│   │   ├── admin.js          # Admin overview & metrics routes
│   │   ├── auth.js           # Registration, login & profile routes
│   │   ├── payments.js       # Status updates & transaction records
│   │   ├── products.js       # Customer item submissions & listings
│   │   └── uploads.js        # S3 presigned URL generation
│   ├── scripts/
│   │   └── seed-admin.js     # Database seeder script
│   └── server.js             # Express application & HTTP server
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DeviceAiBot.jsx  # EcoBot AI diagnosis modal & floating FAB
│   │   │   ├── Navbar.jsx       # Dark mode header with corner staff portal
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global authentication provider
│   │   ├── pages/
│   │   │   ├── Auth.jsx         # Unified Sign In / Register page
│   │   │   ├── Dashboard.jsx    # Hero landing & AI banner
│   │   │   ├── CustomerDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AgentDashboard.jsx
│   │   │   ├── AddProduct.jsx   # Product submission (with AI pre-fill)
│   │   │   ├── ProductList.jsx  # Product catalog & photo rendering
│   │   │   ├── PaymentList.jsx  # Pickup status updates
│   │   │   └── Profile.jsx      # User profile details
│   │   ├── index.css            # Obsidian & emerald dark mode styles
│   │   └── App.jsx
│   └── vite.config.js
├── template.yaml             # AWS SAM Infrastructure as Code template
├── vercel.json               # Vercel routing configuration
└── package.json              # Monorepo workspace commands
```