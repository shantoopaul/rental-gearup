# Rental GearUp — Frontend

Rental GearUp is a modern, responsive **Next.js App Router** frontend for a sports and outdoor equipment rental platform.

Customers can browse gear, select rental dates, place orders, and complete payments through Stripe Checkout. Providers manage their gear inventory and incoming rental orders. Admins moderate users, gear listings, orders, and categories.

---

## Project Overview

This is the frontend for the **GearUp** rental marketplace.

It consumes a separate backend REST API and implements:

- Public gear browsing
- Search, filtering, and pagination
- Role-based authentication
- Customer rental flow
- Stripe Checkout payment redirect flow
- Provider inventory management
- Provider order fulfillment
- Admin moderation dashboard
- Loading, error, and empty states

---

## Tech Stack

| Technology         | Purpose                                        |
| ------------------ | ---------------------------------------------- |
| Next.js App Router | React framework, routing, server components    |
| React 19           | UI library                                     |
| TypeScript         | Type safety                                    |
| Tailwind CSS v4    | Styling                                        |
| Shadcn UI          | Component system                               |
| Base UI            | Primitive UI components                        |
| SWR                | Client-side data fetching and cache management |
| React Hook Form    | Form handling                                  |
| Zod                | Schema validation                              |
| Sonner             | Toast notifications                            |
| Zustand            | Lightweight client state store                 |
| Motion             | Animation                                      |
| Stripe Checkout    | Payment redirect flow via backend              |

---

## Core Features

### Public Features

- Responsive landing page
- Featured gear section
- Category grid
- Gear browse page
- Search bar with debounce
- Category, brand, and price filters
- Pagination
- Gear details page
- Image gallery
- Provider information
- Rental date selection form
- Loading skeletons
- Error and not-found pages

---

### Customer Features

- Register and login
- Customer dashboard overview
- Rental order history
- Order details page
- Payment initiation for confirmed orders
- Stripe Checkout redirect
- Payment success and cancel pages
- Payment history
- Review submission after gear is returned

---

### Provider Features

- Provider dashboard overview
- Add new gear
- Manage gear inventory
- Update stock quantity
- Toggle gear availability
- Soft delete gear
- View incoming rental orders
- Confirm orders
- Mark orders as picked up
- Mark orders as returned

---

### Admin Features

- Admin dashboard overview
- Platform statistics
- User management
- Suspend and activate users
- View all gear listings
- View all rental orders
- Create, update, and delete categories

---

## Role-Based Dashboards

The UI dynamically adapts based on the authenticated user's role.

| Role     | Dashboard Route       | Description                                  |
| -------- | --------------------- | -------------------------------------------- |
| Customer | `/dashboard`          | View rentals, payments, and reviews          |
| Provider | `/provider-dashboard` | Manage gear and incoming orders              |
| Admin    | `/admin-dashboard`    | Moderate users, gear, orders, and categories |

---

## Protected Routes

Route protection is implemented using JWT decoding and role checks.

| Route Prefix          | Required Role |
| --------------------- | ------------- |
| `/dashboard`          | `CUSTOMER`    |
| `/provider-dashboard` | `PROVIDER`    |
| `/admin-dashboard`    | `ADMIN`       |

If a user is not authenticated, they are redirected to:

```txt
/login?callbackUrl=<original-path>
```

If a user tries to access a dashboard that does not match their role, they are redirected to their correct dashboard.

---

## Getting Started

### Prerequisites

Make sure you have:

- Node.js LTS or later
- pnpm installed
- A running GearUp backend API
- Backend database migrated and seeded as needed

---

## Installation

Clone the repository and install dependencies:

```bash
pnpm install
```

or if using npm:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://gearup-rose.vercel.app/api
```

> The value must include the `/api` prefix.

---

## Backend Configuration Note

For local development, the backend should allow the frontend origin and redirect Stripe Checkout back to the frontend.

In the backend `.env`, set:

```env
APP_URL=https://rental-gearup.vercel.app
```

This ensures:

- CORS allows the frontend origin
- Stripe success/cancel redirects hit the frontend callback routes

---

## Run the Development Server

```bash
pnpm dev
```

or

```bash
npm run dev
```

Open:

```txt
https://rental-gearup.vercel.app
```

---

## Available Scripts

| Script       | Description                      |
| ------------ | -------------------------------- |
| `pnpm dev`   | Start the development server     |
| `pnpm build` | Build the production application |
| `pnpm start` | Start the production server      |
| `pnpm lint`  | Run ESLint                       |

---

## Project Structure

```txt
app/
├── (auth)/
│   ├── login/
│   ├── register/
│   ├── _actions/
│   └── _components/
├── (dashboard)/
│   ├── admin-dashboard/
│   ├── dashboard/
│   ├── provider-dashboard/
│   ├── _actions/
│   ├── _components/
│   ├── _config/
│   └── _hooks/
├── (public)/
│   ├── gear/
│   ├── _actions/
│   └── _components/
├── api/
│   └── payments/
│       ├── cancel/
│       └── success/
├── payment/
│   ├── cancel/
│   └── success/
├── error.tsx
├── globals.css
├── layout.tsx
├── loading.tsx
└── not-found.tsx

components/
├── shared/
└── ui/

lib/
├── store/
├── validations/
├── cookies.ts
├── types.ts
└── utils.ts

providers/
└── SWRProvider.tsx

services/
├── getAccessToken.ts
└── getMe.ts

utils/
└── jwt.ts
```

---

## Main Application Routes

### Public Routes

| Route        | Description                                 |
| ------------ | ------------------------------------------- |
| `/`          | Home page with featured gear and categories |
| `/gear`      | Browse, search, filter, and paginate gear   |
| `/gear/[id]` | Gear details, gallery, and rent form        |

---

### Auth Routes

| Route       | Description                           |
| ----------- | ------------------------------------- |
| `/login`    | Login form                            |
| `/register` | Registration form with role selection |

---

### Customer Routes

| Route                           | Description                         |
| ------------------------------- | ----------------------------------- |
| `/dashboard`                    | Customer overview and recent orders |
| `/dashboard/my-orders`          | Customer rental orders              |
| `/dashboard/my-orders/[id]`     | Order details                       |
| `/dashboard/my-orders/[id]/pay` | Checkout page                       |
| `/dashboard/payment-history`    | Payment history                     |

---

### Provider Routes

| Route                           | Description             |
| ------------------------------- | ----------------------- |
| `/provider-dashboard`           | Provider overview       |
| `/provider-dashboard/add-gear`  | Add new gear form       |
| `/provider-dashboard/my-gears`  | Provider gear inventory |
| `/provider-dashboard/my-orders` | Incoming rental orders  |

---

### Admin Routes

| Route                         | Description             |
| ----------------------------- | ----------------------- |
| `/admin-dashboard`            | Admin platform overview |
| `/admin-dashboard/users`      | User management         |
| `/admin-dashboard/gears`      | All gear listings       |
| `/admin-dashboard/orders`     | All rental orders       |
| `/admin-dashboard/categories` | Category management     |

---

### Payment Routes

| Route                   | Description                     |
| ----------------------- | ------------------------------- |
| `/payment/success`      | Payment success page            |
| `/payment/cancel`       | Payment cancel page             |
| `/api/payments/success` | Stripe success callback handler |
| `/api/payments/cancel`  | Stripe cancel callback handler  |

---

## Authentication Flow

1. User registers or logs in
2. Backend returns:
    - access token
    - refresh token
    - user object
3. Frontend stores tokens in cookies
4. Protected routes decode the JWT and verify role
5. Dashboard layouts fetch current user from `/auth/me`
6. SWR requests attach the access token automatically
7. If access token expires, frontend attempts refresh using `/auth/refresh-token`

---

## Data Fetching Strategy

This project uses a hybrid data-fetching approach.

### Server Components and Server Actions

Used for:

- Initial page data
- Authentication checks
- Mutations
- Redirect flows
- Payment initiation

Examples:

- `getGears`
- `getGearDetails`
- `getCategories`
- `createRental`
- `initiatePayment`
- `createGear`
- `updateOrderStatus`

---

### SWR Client Fetching

Used for dashboard tables and live UI updates.

Examples:

- Customer orders
- Customer payments
- Provider gear
- Provider orders
- Admin users
- Admin gear
- Admin rentals
- Admin categories

SWR is configured in:

```txt
providers/SWRProvider.tsx
```

The SWR fetcher:

- prepends `NEXT_PUBLIC_API_URL`
- attaches the access token
- handles `401` responses
- refreshes expired tokens
- redirects to login when the session expires

---

## Payment Flow

The payment flow uses Stripe Checkout via the backend.

### Customer payment journey

1. Customer creates a rental order
2. Provider confirms the order
3. Order status becomes `CONFIRMED`
4. Customer opens the pay page
5. Frontend calls backend:

```http
POST /payments/create
```

6. Backend creates a Stripe Checkout Session
7. Frontend redirects user to Stripe Checkout
8. User completes or cancels payment
9. Stripe redirects to frontend callback route
10. Frontend confirms payment with backend
11. User sees success or cancel page

---

## Order Status Flow

| Status      | Meaning                      |
| ----------- | ---------------------------- |
| `PLACED`    | Order created by customer    |
| `CONFIRMED` | Provider confirmed the order |
| `PAID`      | Payment completed            |
| `PICKED_UP` | Customer picked up the gear  |
| `RETURNED`  | Gear returned                |
| `CANCELLED` | Order cancelled              |

---

## Review Flow

Customers can leave a review only after the order status becomes:

```ts
RETURNED;
```

The review form submits:

```json
{
	"rentalOrderId": "order-id",
	"rating": 5,
	"comment": "Optional comment"
}
```

---

## Image Optimization

The app uses `next/image` for optimized gear images.

The current `next.config.ts` allows images from:

```txt
https://images.unsplash.com
```

If your backend or providers use another image host, add it to `next.config.ts`:

```ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    {
      protocol: "https",
      hostname: "your-image-domain.com",
    },
  ],
}
```

---

## Loading, Error, and Empty States

The app includes global and local UX handling:

- `app/loading.tsx`
- `app/error.tsx`
- `app/not-found.tsx`
- Skeleton loaders for tables and gear grids
- Empty states for no data
- Error states for failed API requests
- Toast notifications for success and failure feedback

---

## Default Admin Login

Admin accounts are not created through the public registration form.

If your backend seeds the default admin, use:

```txt
Email: admin@gearup.com
Password: Admin123
```

Customers and providers can register through:

```txt
/register
```

---

## API Integration

For complete endpoint mapping, authentication flow, payment flow, and backend integration details, see:

```txt
API_INTEGRATION.md
```

---

## Deployment Checklist

Before deploying:

- [ ] Set production `NEXT_PUBLIC_API_URL`
- [ ] Set backend `APP_URL` to the production frontend origin
- [ ] Configure backend CORS for the frontend domain
- [ ] Configure Stripe production keys
- [ ] Configure Stripe webhook
- [ ] Add allowed image domains in `next.config.ts`
- [ ] Test role-based route protection
- [ ] Test payment success and cancel redirects
- [ ] Test token refresh flow
- [ ] Build and start the production app

---

## Build for Production

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

---

## License

Private project for GearUp.
