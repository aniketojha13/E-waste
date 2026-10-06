# Online E-Waste Management System (MERN Stack)

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** conversion of the Java Swing desktop application.

## 🚀 Features & Architecture

### 1. User Roles & Authentication
- **Admin**: System oversight, view registered customers, collection agents, all e-waste products, and payment/pickup statuses.
- **Collection Agent**: View assigned e-waste products for pickup and update payment & pickup statuses (`Pending`, `Collected`, `Paid`, `Completed`, `Rejected`).
- **Customer**: Register/Signup, submit new e-waste items for pickup with product age & estimated price, view submitted products & statuses, manage profile.

### 2. Tech Stack
- **Frontend**: React 18, React Router v6, Lucide Icons, Modern Responsive CSS with green theme styling matching original NetBeans UI palette (`#EDFCF3`).
- **Backend**: Node.js, Express.js, JWT Authentication, Password Hashing.
- **Database**: MongoDB & Mongoose schemas (`User`, `Product`, `Payment`).

---

## 🛠️ How to Run

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas URI configured in `server/.env`.

### 2. Seed Demo Data (Optional)
Populate default demo accounts and sample e-waste products:
```bash
cd server
node seed.js
```

### 3. Start Backend API Server
```bash
cd server
npm start
```
*Backend runs on `http://localhost:5000`*

### 4. Start Frontend React App
```bash
cd client
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 🔑 Demo Account Credentials

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `adminpassword` |
| **Collection Agent** | `agent1` | `agentpassword` |
| **Customer** | `customer1` | `customerpassword` |

---

## 📂 Project Structure

```
├── server/
│   ├── config/db.js          # MongoDB Connection
│   ├── controllers/         # Auth, Product, Payment, Admin Controllers
│   ├── middleware/auth.js    # JWT Verification & Role Authorization
│   ├── models/               # Mongoose Models (User, Product, Payment)
│   ├── routes/               # Express Routes
│   ├── seed.js               # Database Seeder Script
│   └── server.js             # Express App Entry Point
├── client/
│   ├── src/
│   │   ├── components/      # Navbar, ProtectedRoute
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # Dashboard, Login, Signup, Admin, Agent, Customer Pages
│   │   ├── services/api.js  # Axios API Interceptor
│   │   ├── App.jsx          # React Router Configuration
│   │   └── index.css        # Responsive Styling
│   ├── package.json
│   └── vite.config.js
└── package.json              # Workspace package scripts
```
