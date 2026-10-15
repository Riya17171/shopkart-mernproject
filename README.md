# ShopKart 🛒

A full-stack e-commerce web application built with the **MERN** stack (MongoDB, Express, React, Node.js). Customers can sign up, browse a product catalogue, save items to a wishlist, manage a cart, pay through **Razorpay (Test Mode)**, and review their order history.

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0C2451?logo=razorpay&logoColor=white)

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [API reference](#api-reference)
- [How it works](#how-it-works)
- [Troubleshooting](#troubleshooting)
- [Author](#author)

---

## Features

**Authentication**
- Customer registration, login, session restore and logout
- Passwords hashed with bcrypt
- JWT stored in an **HttpOnly cookie** (7-day expiry), so it can't be read by page scripts
- Protected and public-only routes on the frontend

**Shopping**
- Product catalogue with name search, category filter and price sorting
- Product details page
- Persistent wishlist saved to the customer's account
- Persistent cart with quantity controls and stock validation
- Cart count and subtotal shared across the app through React Context

**Checkout & orders**
- Shipping address form with validation
- Payment through **Razorpay Test Mode**
- Order total calculated on the server, not trusted from the browser
- Razorpay payment signature verified on the server before an order is placed
- Order history and order details pages

**UX**
- Loading, empty and error states on every data-driven page

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Axios, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens, bcrypt, cookie-parser |
| Payments | Razorpay (Test Mode) |
| Tooling | nodemon, concurrently, oxlint |

---

## Project structure

```text
shopkart/
├── package.json            # Root scripts: run backend + frontend together
├── backend/
│   ├── index.js            # Express app and MongoDB connection
│   ├── seed.js             # Adds sample products to an empty database
│   ├── config/             # Razorpay client
│   ├── controllers/        # Request handling and business logic
│   ├── middlewares/        # Authentication check
│   ├── models/             # Mongoose schemas (Customer, Product, Order)
│   ├── routes/             # API endpoint definitions
│   └── utils/              # JWT helper
└── frontend/
    └── src/
        ├── components/     # Navbar, ProductCard, route guards, page states
        ├── context/        # Auth and cart state
        ├── pages/          # Route-level screens
        ├── services/       # Shared Axios instance
        └── utils/          # Currency formatting, Razorpay script loader
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer
- A MongoDB database: [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works) or a local MongoDB running as a replica set (checkout uses a transaction)
- A [Razorpay](https://razorpay.com/) account with **Test Mode** turned on (only needed for checkout)

### 1. Clone the repository

```bash
git clone https://github.com/Rajeevgit29/shopkart_mern_lab_project.git
cd shopkart_mern_lab_project
```

### 2. Configure environment variables

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

```env
PORT=8084
DB_URL=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

| Variable | Description |
|---|---|
| `PORT` | Port the API listens on |
| `DB_URL` | MongoDB connection string (the app uses the `shopkart` database) |
| `JWT_SECRET` | Long random string used to sign login tokens |
| `CLIENT_URL` | Frontend URL allowed by CORS |
| `RAZORPAY_KEY_ID` | Razorpay Test Mode key ID (starts with `rzp_test_`) |
| `RAZORPAY_KEY_SECRET` | Razorpay Test Mode key secret, which must stay on the backend |

Optionally, create `frontend/.env` if your API runs somewhere other than `http://localhost:8084`:

```bash
cp frontend/.env.example frontend/.env
```

```env
VITE_API_URL=http://localhost:8084
```

> ⚠️ Never commit `.env` files or put the Razorpay key secret in the frontend. `.env` is already listed in `.gitignore`.

### 3. Install dependencies

From the project root:

```bash
npm run install:all
```

This installs the root, backend and frontend dependencies.

### 4. Seed sample products

```bash
npm run seed
```

This adds 8 sample products across Electronics, Fashion, Books and Home. It only runs when the product collection is empty and never deletes existing data.

### 5. Run the app

```bash
npm run dev
```

This starts both servers in one terminal:

- Frontend: <http://localhost:5173>
- API: <http://localhost:8084>

Open the frontend, register an account, and start shopping.

### Testing payments

Checkout runs in Razorpay **Test Mode**, so no real money is charged. Use the test cards and UPI IDs from the [Razorpay test payment docs](https://razorpay.com/docs/payments/payments/test-card-details/) to complete a payment.

---

## Available scripts

Run these from the project root:

| Command | Description |
|---|---|
| `npm run install:all` | Install root, backend and frontend dependencies |
| `npm run dev` | Start backend (nodemon) and frontend (Vite) together |
| `npm run seed` | Add sample products to an empty database |

Inside `backend/`: `npm run dev`, `npm start`, `npm run seed`
Inside `frontend/`: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`

---

## API reference

Base URL: `http://localhost:8084`. 🔒 marks routes that require a logged-in customer (the auth cookie is sent automatically).

### Customers

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| POST | `/customers/register` | | Create an account |
| POST | `/customers/login` | | Log in and set the auth cookie |
| GET | `/customers/me` | 🔒 | Get the logged-in customer's profile |
| POST | `/customers/logout` | 🔒 | Clear the auth cookie |

### Products

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| GET | `/products` | | List products. Query: `search`, `category`, `sort` (`price_asc` / `price_desc`) |
| GET | `/products/:id` | | Get one product |
| POST | `/products` | | Create a product |

### Wishlist

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| GET | `/wishlist` | 🔒 | Get the wishlist |
| POST | `/wishlist/:productId` | 🔒 | Add a product |
| DELETE | `/wishlist/:productId` | 🔒 | Remove a product |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| GET | `/cart` | 🔒 | Get the cart |
| POST | `/cart/:productId` | 🔒 | Add a product or increase its quantity |
| PATCH | `/cart/:productId` | 🔒 | Set the quantity |
| DELETE | `/cart/:productId` | 🔒 | Remove a product |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| POST | `/orders/create-payment-order` | 🔒 | Validate the cart and create a Razorpay order |
| POST | `/orders/verify-payment` | 🔒 | Verify the payment signature and place the order |
| GET | `/orders` | 🔒 | List the customer's orders |
| GET | `/orders/:id` | 🔒 | Get one of the customer's orders |

All responses are JSON with a `success` boolean, plus either the requested data or a `message`.

---

## How it works

**Architecture.** Routes map URLs to controllers, controllers validate input and run business logic, models define how data is stored in MongoDB, and middleware protects routes before a controller runs.

**Authentication.** On login the server signs a JWT and stores it in an HttpOnly cookie. The `isAuthenticated` middleware reads that cookie, verifies the token and attaches the customer to `req.user`.

**Wishlist and cart.** Both store references to products, not copies. `populate()` swaps those references for the current product data, so prices and stock are always up to date. Cart subtotal and item count are calculated from cart state rather than stored.

**Checkout flow.**

1. The frontend sends the shipping address to `/orders/create-payment-order`.
2. The server checks stock, calculates the total from database prices, saves a `PENDING_PAYMENT` order and creates a matching Razorpay order.
3. The Razorpay checkout popup collects the test payment.
4. The frontend sends the payment result to `/orders/verify-payment`.
5. The server verifies the HMAC signature with the key secret, then, in a single MongoDB transaction, marks the order as paid and placed and clears the cart.

**Order history.** Each order item stores a snapshot of the product's name, price and image at purchase time, so past orders stay accurate even if a product changes later.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `DB Connection failed` | Check `DB_URL` in `backend/.env`, and in MongoDB Atlas allow your IP address under **Network Access**. |
| `querySrv` / DNS errors with Atlas | `backend/index.js` and `backend/seed.js` already switch Node's DNS to `8.8.8.8` / `1.1.1.1`. If your network blocks those, remove the `dns.setServers(...)` line. |
| Logged out on every refresh / CORS errors | Make sure `CLIENT_URL` exactly matches the frontend URL (default `http://localhost:5173`). |
| `Razorpay Test Mode keys are not configured` | Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `backend/.env` and restart the backend. |
| `Unable to verify payment` with a local MongoDB | Transactions need a replica set. Use MongoDB Atlas or start your local server as a single-node replica set. |
| Products page is empty | Run `npm run seed`. |

---

## Author

**Rajeevgit29** · [GitHub](https://github.com/Rajeevgit29)

Built as a MERN stack lab project.
