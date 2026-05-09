# 🕳️ ShopHole — Ultra-Modern E-Commerce

**ShopHole** is a premium, full-stack e-commerce platform designed with an ultra-modern dark-theme aesthetic. It features a seamless user experience for customers, a robust dashboard for sellers, and a comprehensive control panel for administrators.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

## ✨ Key Features

### 🎨 Design & UX
- **Premium Dark Mode**: A sleek, high-contrast interface using neon cyan accents and slate/black surfaces.
- **Glassmorphism**: Backdrop-blur effects on navigation bars, cards, and modals for a high-end feel.
- **Dynamic Animations**: Powered by Framer Motion for smooth transitions, floating elements, and glowing hover states.
- **Fully Responsive**: Optimized for every device, from ultra-wide monitors to mobile phones.

### 🛍️ Customer Experience
- **Advanced Product Search**: Real-time filtering by category, price range, and sorting options.
- **Modern Landing Page**: High-impact hero section, featured product grids, and interactive CTAs.
- **Seamless Auth**: Secure Login and Registration flows with persistent sessions.
- **About & Contact Pages**: Dedicated professional pages with built-in inquiry forms.

### 🏪 Seller Hub
- **Product Management**: A dedicated dashboard for merchants to list and track their inventory.
- **Device Image Upload**: Innovative drag-and-drop file uploader that converts images to Base64 for instant, reliable storage without external cloud dependencies.
- **Inventory Tracking**: Visual badges for stock levels (Green=High, Yellow=Low, Red=Out of Stock).

### 🛡️ Admin Control Panel
- **Real-Time Overview**: Monitor total users, products, orders, and revenue from a single dashboard.
- **User Management**: Activate or suspend users with a single click.
- **Order Management**: Track and update order statuses (Placed → Confirmed → Shipped → Delivered).
- **Platform Moderation**: Full control over all products listed on the platform.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS
- **State Management**: Redux Toolkit
- **Database**: MongoDB with Mongoose
- **Animations**: Framer Motion
- **Icons**: React Icons (Feather & Fi)
- **Notifications**: React Hot Toast
- **Deployment**: Vercel

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18.x or later
- A MongoDB Connection String

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
```

### 3. Installation
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🚢 Deployment (Vercel)

The project is optimized for Vercel deployment:
1. Push your code to GitHub.
2. Connect your repo to Vercel.
3. Add your Environment Variables in the Vercel Dashboard.
4. Deployment is automatic!

---

## 👤 Admin Access
To access the admin panel (`/admin`):
1. Go to the [Register Page](http://localhost:3000/auth/register).
2. Select **"Admin"** from the "Register as" dropdown.
3. Once logged in, navigate to `/admin`.
*(Note: It is recommended to remove the Admin registration option after creating your primary admin account for security.)*

---

Designed with ❤️ by the **ShopHole** Team.
