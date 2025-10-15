# 🚗 Electric Vehicle Dealer Management System - Frontend

This is the **Frontend** of the Electric Vehicle Dealer Management System,  
developed using **React + Vite**.  

The system allows dealers, managers, and admins to manage electric vehicle sales, customers, orders, and reports.

---

## 🚀 Tech Stack

- ⚡ [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- ⚛️ [React](https://react.dev/) - UI Library
- 🎨 [Ant Design / Tailwind CSS / Boostraps / MUI] - UI Components & Styling
- 🔗 [Axios](https://axios-http.com/) - API calls
- 🛠️ ESLint + Prettier - Code Quality

---

## 📂 Project Structure
```
src/
├── assets/ # Static files (images, icons, etc.)
├── components/ # Reusable UI components
├── pages/ # Application pages
├── routes/ # Routing configuration
├── services/ # API integration
├── App.jsx # Root component
└── main.jsx # Entry point
```
---

## 🏗️ Getting Started

### 1️⃣ Clone repository
```
git clone https://github.com/nguyew/ev-dealer-management-fe.git
cd ev-dealer-management-fe
```
### 2️⃣ Install dependencies
```
npm install
```
### 3️⃣ Run development server
```
npm run dev
```
### 4️⃣ Build for production
```
npm run build
```

---

## 🔌 API Connection

Create a `.env` file in the project root:

- .env.development → used when running npm run dev
```
VITE_API_BASE_URL=http://localhost:8080/api
```

- .env.production → used when running npm run build / npm run preview
```
VITE_API_BASE_URL=https://api.myapp.com/api
```

### 📦 Usage in code

Create a shared Axios instance (src/services/api.js):

```
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
```

Now you can import it anywhere:

```
import api from "../services/api";

async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}
```

---

## 🌐 Deployment

### 🚀 Deploy on Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variable VITE_API_BASE_URL in Vercel dashboard
4. Deploy 🚀

### 🌍 Deploy on Netlify

1. Run npm run build
2. Deploy /dist folder to Netlify (drag & drop or GitHub integration)
3. Add environment variable VITE_API_BASE_URL

---

## 👤 Roles in System
- Dealer Staff → Manage customers, create orders, check vehicle info
- Dealer Manager → Approve orders, view reports
- EVM Staff → Manage dealer network, warranty/maintenance
- Admin → Manage users, roles, and system configuration


