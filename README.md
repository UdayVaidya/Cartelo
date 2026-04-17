# Cartelo Marketplace 🛒

**Shop the world. Sell yours.**

Cartelo is a modern, high-performance marketplace platform designed to connect millions of buyers with sellers. Discover an endless array of products across categories, or spin up your seller dashboard with live analytics to sell your own items.

This repository contains the monorepo for the complete Cartelo web application, split into distinct modular components.

## 🌟 Features

- **Seamless Authentication Pipeline:** Integrated robust user management system using JWTs.
- **Optimized & Blazing Fast UI:** Front-end built on React + Vite, delivering rich animations powered by Framer Motion and GSAP. 
- **Modern State Management:** Fully typed global state modeled with Redux Toolkit and custom hooks.
- **Premium Design System:** Fully bespoke pure dark and yellow (#f5c518) UI, complete with smooth layout transitions and glassmorphic touches.
- **Robust API & Database:** Back-end architected on Express.js and Mongoose/MongoDB, fully CORS integrated and scalable.

---

## 🏗️ Project Architecture

```
Cartelo/
├── frontend/  # React app (Powered by Vite, TailwindCSS, GSAP, Framer Motion)
├── backend/   # Node.js REST API (Express.js, Mongoose/MongoDB, morgan)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)

### Local Development Setup

1. **Clone the repository and install root dependencies (if any)**
   ```bash
   git clone <your-repo-link>
   cd Cartelo
   ```

2. **Run the Backend**
   Navigate to the backend, duplicate your `.env.example` file to create a `.env` configuring your `MONGODB_URI` and `PORT`.
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Run the Frontend**
   In a new terminal window, spin up the front-end Vite server. Note: By default, the vite proxy handles routing `/api` directly to your local backend.
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🛠️ Built With
* **Frontend:** React, Vite, TailwindCSS, Redux Toolkit, Framer Motion, GSAP.
* **Backend:** Express.js, Mongoose, MongoDB.
* **Styling/Iconography:** Internal custom SVG system + generic unified custom color schemes.

## 📄 License
© 2024 Cartelo International S.A. All rights reserved.
