# API Integration Guide — GearUp Frontend

This document explains how the **GearUp frontend** consumes the **GearUp backend REST API**.

The frontend is built with **Next.js App Router**, uses **Server Actions** for mutations and server-side fetching, and uses **SWR** for authenticated client-side data fetching inside dashboards.

---

## 1. Base API Configuration

The frontend expects the backend base URL to be available as a public environment variable.

### Frontend environment

Create a `.env` file in the frontend root:

```env
NEXT_PUBLIC_API_URL=https://gearup-rose.vercel.app/api
```

> `NEXT_PUBLIC_API_URL` must include the `/api` prefix because all frontend fetch calls append endpoint paths directly to this value.

Example:

```ts
fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`);
```

---

## 2. Backend CORS and Stripe Redirect Configuration

The backend currently uses `APP_URL` for:

1. CORS origin
2. Stripe success/cancel redirect URLs

For this frontend implementation, the backend `.env` should point `APP_URL` to the **frontend origin**, not the backend origin.

### Recommended backend environment for local development

```env
APP_URL=https://rental-gearup.vercel.app
```

This allows:

- Browser-side SWR requests from `https://rental-gearup.vercel.app` to pass CORS
- Stripe Checkout to redirect back to the frontend callback routes:
    - `https://rental-gearup.vercel.app/api/payments/success`
    - `https://rental-gearup.vercel.app/api/payments/cancel`

The frontend then handles the final redirect to:

- `/payment/success`
- `/payment/cancel`

---

## 3. API Response Shape

The backend returns responses in this format:

### Success response

```json
{
	"success": true,
	"statusCode": 200,
	"message": "Operation successful",
	"data": {}
}
```

Some list endpoints also return pagination metadata:

```json
{
	"success": true,
	"statusCode": 200,
	"message": "Gears retrieved successfully",
	"data": [],
	"meta": {
		"page": 1,
		"limit": 10,
		"total": 25,
		"totalPages": 3
	}
}
```

### Error response

```json
{
	"success": false,
	"message": "Something went wrong",
	"errorDetails": {}
}
```

The frontend handles errors by reading `message` and, where available, `errorDetails`.

---

## 4. Authentication Integration

### Auth endpoints used

| Feature              | Method | Endpoint              | Access               |
| -------------------- | -----: | --------------------- | -------------------- |
| Register user        | `POST` | `/auth/register`      | Public               |
| Login user           | `POST` | `/auth/login`         | Public               |
| Get current user     |  `GET` | `/auth/me`            | Authenticated        |
| Refresh access token | `POST` | `/auth/refresh-token` | Refresh token cookie |

---

## 5. Registration

### Frontend route

`/register`

### Backend endpoint

```http
POST /auth/register
```

### Request body

```json
{
	"name": "Shanto Paul",
	"email": "shantoopaul@gmail.com",
	"password": "Password1",
	"role": "CUSTOMER"
}
```

Allowed roles during registration:

```ts
"CUSTOMER" | "PROVIDER";
```

Admin accounts are not self-registered. They must be seeded directly in the backend database.

### Frontend validation

Frontend registration validation matches backend expectations:

- Name: 2 to 100 characters
- Email: valid email
- Password:
    - Minimum 6 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one number
- Role:
    - `CUSTOMER`
    - `PROVIDER`

---

## 6. Login

### Frontend route

`/login`

### Backend endpoint

```http
POST /auth/login
```

### Request body

```json
{
	"email": "admin@gearup.com",
	"password": "Admin123"
}
```

### Expected response

```json
{
	"success": true,
	"statusCode": 200,
	"message": "User logged in successfully",
	"data": {
		"accessToken": "jwt-access-token",
		"refreshToken": "jwt-refresh-token",
		"user": {
			"id": "user-id",
			"name": "Admin",
			"email": "admin@gearup.com",
			"role": "ADMIN",
			"status": "ACTIVE"
		}
	}
}
```

### Frontend behavior after login

After successful login, the frontend:

1. Stores `accessToken` in a non-httpOnly cookie
2. Stores `refreshToken` in an httpOnly cookie
3. Redirects the user based on role:
    - `ADMIN` → `/admin-dashboard`
    - `PROVIDER` → `/provider-dashboard`
    - `CUSTOMER` → `/dashboard`

If a `callbackUrl` exists in the query string, the user is redirected there instead.

---

## 7. Cookie Strategy

| Cookie         | HttpOnly | Purpose                                                          |
| -------------- | -------: | ---------------------------------------------------------------- |
| `accessToken`  |       No | Used by browser-side SWR fetcher and decoded by route protection |
| `refreshToken` |      Yes | Used by server action to refresh expired access tokens           |

The access token is intentionally readable from `document.cookie` because the SWR fetcher runs in the browser and attaches the `Authorization` header manually.

---

## 8. Authenticated Requests

All protected endpoints require:

```http
Authorization: Bearer <accessToken>
```

The SWR fetcher automatically attaches this header.

Example:

```ts
fetch(`${apiUrl}/rentals`, {
	headers: {
		Authorization: `Bearer ${accessToken}`,
		"Content-Type": "application/json",
	},
});
```

---

## 9. Access Token Refresh Flow

The frontend implements a single-flight refresh flow inside `providers/SWRProvider.tsx`.

### Flow

1. SWR request receives `401 Unauthorized`
2. Frontend calls server action `refreshAccessToken`
3. Server action reads `refreshToken` cookie
4. Server action calls:

```http
POST /auth/refresh-token
```

5. If refresh succeeds:
    - New `accessToken` cookie is set
    - Original SWR request is retried
6. If refresh fails:
    - Auth cookies are cleared
    - User is redirected to `/login`

### Backend refresh endpoint

```http
POST /auth/refresh-token
```

Expected response:

```json
{
	"success": true,
	"statusCode": 200,
	"message": "Access token generated successfully",
	"data": {
		"accessToken": "new-access-token"
	}
}
```

---

## 10. Current User

### Backend endpoint

```http
GET /auth/me
```

Used by:

- `services/getMe.ts`
- Public navbar
- Dashboard layouts

### Expected response

```json
{
	"success": true,
	"statusCode": 200,
	"message": "User retrieved successfully",
	"data": {
		"id": "user-id",
		"name": "Shanto Paul",
		"email": "shantoopaul@gmail.com",
		"role": "CUSTOMER",
		"status": "ACTIVE",
		"createdAt": "2026-01-01T00:00:00.000Z"
	}
}
```

---

## 11. Route Protection

The frontend protects dashboards by decoding the JWT access token and checking the user role.

| Frontend Route Prefix | Required Role |
| --------------------- | ------------- |
| `/dashboard`          | `CUSTOMER`    |
| `/provider-dashboard` | `PROVIDER`    |
| `/admin-dashboard`    | `ADMIN`       |

Protection is implemented in `proxy.ts`.

### Behavior

If no access token exists:

- Redirect to `/login?callbackUrl=<protected-path>`

If role does not match:

- Redirect user to their correct dashboard:
    - `ADMIN` → `/admin-dashboard`
    - `PROVIDER` → `/provider-dashboard`
    - `CUSTOMER` → `/dashboard`

Dashboard layouts also perform server-side checks using:

- cookies
- JWT decode
- `GET /auth/me`

---

## 12. Public API Endpoints

These endpoints do not require authentication.

| Frontend Feature   | Method | Backend Endpoint |
| ------------------ | -----: | ---------------- |
| Home category grid |  `GET` | `/categories`    |
| Featured gear      |  `GET` | `/gear`          |
| Browse gear page   |  `GET` | `/gear`          |
| Gear filters       |  `GET` | `/categories`    |
| Gear details page  |  `GET` | `/gear/:id`      |

---

## 13. Categories

### Endpoint

```http
GET /categories
```

### Used in

- Home page category grid
- Gear listing filters
- Provider add-gear form
- Admin categories table

### Example response

```json
{
	"success": true,
	"statusCode": 200,
	"message": "Categories retrieved successfully",
	"data": [
		{
			"id": "category-id",
			"name": "Camping"
		}
	]
}
```

---

## 14. Gear Listing

### Endpoint

```http
GET /gear
```

### Frontend routes

- `/`
- `/gear`

### Supported query parameters

| Parameter   | Example      | Description              |
| ----------- | ------------ | ------------------------ |
| `category`  | `Camping`    | Filter by category name  |
| `brand`     | `North Face` | Filter by brand          |
| `minPrice`  | `10`         | Minimum price per day    |
| `maxPrice`  | `100`        | Maximum price per day    |
| `search`    | `backpack`   | Search title/description |
| `page`      | `1`          | Page number              |
| `limit`     | `10`         | Items per page           |
| `sortBy`    | `createdAt`  | Sort field               |
| `sortOrder` | `desc`       | Sort direction           |

### Sortable backend fields

- `title`
- `brand`
- `pricePerDay`
- `createdAt`

### Frontend usage

Home page featured gear uses:

```ts
{
  limit: "6",
  page: "1",
  sortBy: "createdAt",
  sortOrder: "desc",
}
```

Gear browse page uses:

```ts
{
  page: "1",
  limit: "10",
  sortBy: "createdAt",
  sortOrder: "desc",
}
```

### Example response

```json
{
	"success": true,
	"statusCode": 200,
	"message": "Gears retrieved successfully",
	"data": [
		{
			"id": "gear-id",
			"title": "Trekking Backpack 50L",
			"description": "Durable backpack for long hikes.",
			"brand": "North Face",
			"pricePerDay": "12.00",
			"quantity": 5,
			"isAvailable": true,
			"images": ["https://images.unsplash.com/photo-example"],
			"categoryId": "category-id",
			"category": {
				"id": "category-id",
				"name": "Camping"
			}
		}
	],
	"meta": {
		"page": 1,
		"limit": 10,
		"total": 24,
		"totalPages": 3
	}
}
```

---

## 15. Gear Details

### Endpoint

```http
GET /gear/:id
```

### Frontend route

`/gear/[id]`

### Used for

- Image gallery
- Gear specifications
- Provider information
- Rent form
- Review section

### Expected data

The frontend expects:

```ts
{
  id: string;
  title: string;
  description: string;
  brand: string;
  pricePerDay: number | string;
  quantity: number;
  isAvailable: boolean;
  images: string[];
  category: Category;
  provider?: {
    id: string;
    name: string;
    email: string;
  };
  reviews?: Review[];
}
```

### Important integration note

The gear details page renders a review section using:

```ts
gear.reviews;
```

For full functionality, `GET /gear/:id` should include reviews with customer information.

Recommended backend include:

```ts
reviews: {
  include: {
    customer: {
      select: {
        id: true,
        name: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
}
```

---

## 16. Creating a Rental Order

### Frontend route

`/gear/[id]`

### Backend endpoint

```http
POST /rentals
```

### Required role

`CUSTOMER`

### Request body

```json
{
	"gearItemId": "gear-id",
	"startDate": "2026-07-10T00:00:00.000Z",
	"endDate": "2026-07-12T00:00:00.000Z",
	"quantity": 2
}
```

### Frontend behavior

The rent form:

- Prevents past start dates
- Prevents invalid end dates
- Calculates total price client-side
- Sends ISO date strings to the backend
- Redirects to `/dashboard/my-orders?rental_created=true` after success

### Backend rules

- Gear must exist
- Gear must be available
- Requested quantity must not exceed stock
- `endDate` must be after `startDate`
- Total price is calculated as:

```ts
pricePerDay * days * quantity;
```

---

## 17. Customer Rental Orders

### Endpoints

| Feature              |  Method | Endpoint              |
| -------------------- | ------: | --------------------- |
| Customer order list  |   `GET` | `/rentals`            |
| Single order details |   `GET` | `/rentals/:id`        |
| Cancel order         | `PATCH` | `/rentals/:id/cancel` |

### Frontend routes

- `/dashboard`
- `/dashboard/my-orders`
- `/dashboard/my-orders/[id]`

### Customer order list

```http
GET /rentals
```

Returns orders belonging to the authenticated customer.

Expected response data:

```ts
RentalOrder[]
```

Each order includes:

- gear item
- payment
- status
- dates
- quantity
- total price

### Single rental order

```http
GET /rentals/:id
```

Used on the order details page.

Access rules:

- Customer can view own order
- Provider can view orders for their gear
- Admin can view all orders

### Cancel rental order

```http
PATCH /rentals/:id/cancel
```

Backend allows cancellation only when status is:

```ts
PLACED;
```

Current frontend note:

- The backend endpoint exists
- The frontend does not currently expose a cancel button in the orders UI
- This endpoint can be wired into a future customer cancellation feature

---

## 18. Payment Integration

Payment integration is mandatory and is implemented using **Stripe Checkout redirect**.

The frontend does not use Stripe.js client-side keys directly. Instead:

1. Backend creates a Stripe Checkout Session
2. Backend returns `checkoutUrl`
3. Frontend redirects the user to Stripe Checkout
4. Stripe redirects back to frontend callback routes
5. Frontend confirms payment using backend API
6. User sees success or cancel page

---

## 19. Create Payment Session

### Frontend route

`/dashboard/my-orders/[id]/pay`

### Backend endpoint

```http
POST /payments/create
```

### Required role

`CUSTOMER`

### Request body

```json
{
	"rentalOrderId": "rental-order-id"
}
```

### Backend rules

Payment can only be created when:

```ts
order.status === "CONFIRMED";
```

and no payment already exists for the order.

### Expected response

```json
{
	"success": true,
	"statusCode": 201,
	"message": "Payment session created successfully",
	"data": {
		"checkoutUrl": "https://checkout.stripe.com/session-id",
		"payment": {
			"id": "payment-id",
			"transactionId": "stripe-session-id",
			"amount": "120.00",
			"method": "STRIPE",
			"status": "PENDING",
			"rentalOrderId": "rental-order-id"
		}
	}
}
```

### Frontend behavior

The server action `initiatePayment`:

1. Reads authenticated user cookie
2. Calls `POST /payments/create`
3. Receives `checkoutUrl`
4. Redirects the user to Stripe Checkout

---

## 20. Payment Success Callback

### Frontend API route

```http
GET /api/payments/success
```

### Query parameter

```txt
session_id
```

### Flow

1. Stripe redirects to:

```txt
/api/payments/success?session_id=stripe-session-id
```

2. Frontend reads `session_id`
3. Frontend calls backend:

```http
POST /payments/confirm
```

4. Backend verifies the Stripe session and marks payment completed
5. Frontend redirects to:

```txt
/payment/success
```

---

## 21. Confirm Payment

### Backend endpoint

```http
POST /payments/confirm
```

### Request body

```json
{
	"sessionId": "stripe-session-id"
}
```

### Backend behavior

The backend:

1. Finds payment by Stripe session ID
2. Retrieves session from Stripe
3. Confirms payment status is paid
4. Marks payment as `COMPLETED`
5. Updates rental order status to `PAID`

### Expected response

```json
{
	"success": true,
	"statusCode": 200,
	"message": "Payment confirmed successfully",
	"data": {
		"id": "payment-id",
		"transactionId": "stripe-session-id",
		"amount": "120.00",
		"method": "STRIPE",
		"status": "COMPLETED",
		"paidAt": "2026-07-07T12:00:00.000Z",
		"rentalOrderId": "rental-order-id"
	}
}
```

---

## 22. Payment Cancel Callback

### Frontend API route

```http
GET /api/payments/cancel
```

### Behavior

Redirects user to:

```txt
/payment/cancel
```

No backend call is required for the cancel page.

---

## 23. Customer Payment History

### Frontend route

`/dashboard/payment-history`

### Backend endpoint

```http
GET /payments
```

### Required role

Authenticated user

For `CUSTOMER`, backend returns payments belonging to that customer's rental orders.

### Expected response data

```ts
Payment[]
```

Each payment includes:

- transaction ID
- amount
- method
- status
- paid date
- related rental order
- gear item title

---

## 24. Reviews

### Frontend feature

Customers can leave reviews after an order is returned.

### Backend endpoint

```http
POST /reviews
```

### Required role

`CUSTOMER`

### Request body

```json
{
	"rentalOrderId": "rental-order-id",
	"rating": 5,
	"comment": "Great gear, highly recommended."
}
```

### Backend rules

- Rental order must exist
- Rental order must belong to the authenticated customer
- Rental order status must be:

```ts
RETURNED;
```

- Only one review per rental order is allowed
- Rating must be between 1 and 5

### Frontend UI locations

- `/dashboard/my-orders`
- `/dashboard/my-orders/[id]`

Review button appears when:

```ts
order.status === "RETURNED";
```

---

## 25. Provider API Endpoints

Provider dashboard routes are protected and require:

```ts
role === "PROVIDER";
```

### Provider endpoints

| Feature             |   Method | Endpoint               |
| ------------------- | -------: | ---------------------- |
| Get provider gear   |    `GET` | `/provider/gear`       |
| Create gear         |   `POST` | `/provider/gear`       |
| Update gear         |    `PUT` | `/provider/gear/:id`   |
| Delete gear         | `DELETE` | `/provider/gear/:id`   |
| Get incoming orders |    `GET` | `/provider/orders`     |
| Update order status |  `PATCH` | `/provider/orders/:id` |

---

## 26. Provider Gear Listing

### Endpoint

```http
GET /provider/gear
```

### Frontend route

`/provider-dashboard/my-gears`

### Expected response

```ts
GearItem[]
```

Includes:

- category
- provider gear status
- stock quantity
- availability
- images
- price

---

## 27. Create Gear

### Frontend route

`/provider-dashboard/add-gear`

### Backend endpoint

```http
POST /provider/gear
```

### Request body

```json
{
	"title": "Trekking Backpack 50L",
	"description": "A durable backpack suitable for multi-day hikes.",
	"brand": "North Face",
	"pricePerDay": 12,
	"quantity": 5,
	"images": ["https://images.unsplash.com/photo-1"],
	"categoryId": "category-id"
}
```

### Frontend validation

- Title: 2 to 200 characters
- Description: minimum 10 characters
- Brand: required
- Price per day: positive number
- Quantity: positive integer
- Images: at least one valid URL
- Category: valid UUID

---

## 28. Update Gear

### Backend endpoint

```http
PUT /provider/gear/:id
```

The frontend currently uses this endpoint for:

### Update stock

```json
{
	"quantity": 10
}
```

### Toggle availability

```json
{
	"isAvailable": false
}
```

or

```json
{
	"isAvailable": true
}
```

---

## 29. Delete Gear

### Backend endpoint

```http
DELETE /provider/gear/:id
```

Backend performs a soft delete by setting:

```ts
isAvailable: false;
```

The frontend label says "Delete Gear", but the backend behavior is effectively:

- hide from public gear listing
- mark unavailable
- retain database record

---

## 30. Provider Orders

### Endpoint

```http
GET /provider/orders
```

### Frontend route

`/provider-dashboard/my-orders`

Returns rental orders for gear owned by the authenticated provider.

Expected response data:

```ts
RentalOrder[]
```

Each order includes:

- customer
- gear item
- payment
- status
- quantity
- dates
- total price

---

## 31. Provider Order Status Updates

### Backend endpoint

```http
PATCH /provider/orders/:id
```

### Request body

```json
{
	"status": "CONFIRMED"
}
```

Allowed provider status updates:

```ts
"CONFIRMED" | "PICKED_UP" | "RETURNED";
```

### Valid status transitions

| Current Status | Allowed Next Status |
| -------------- | ------------------- |
| `PLACED`       | `CONFIRMED`         |
| `PAID`         | `PICKED_UP`         |
| `PICKED_UP`    | `RETURNED`          |

### Frontend action buttons

| Order Status | Provider Button | New Status  |
| ------------ | --------------- | ----------- |
| `PLACED`     | Confirm         | `CONFIRMED` |
| `PAID`       | Picked Up       | `PICKED_UP` |
| `PICKED_UP`  | Returned        | `RETURNED`  |

---

## 32. Admin API Endpoints

Admin dashboard routes require:

```ts
role === "ADMIN";
```

### Admin endpoints

| Feature            |  Method | Endpoint           |
| ------------------ | ------: | ------------------ |
| Get all users      |   `GET` | `/admin/users`     |
| Update user status | `PATCH` | `/admin/users/:id` |
| Get all gear       |   `GET` | `/admin/gear`      |
| Get all rentals    |   `GET` | `/admin/rentals`   |

---

## 33. Admin User Management

### Get users

```http
GET /admin/users
```

### Update user status

```http
PATCH /admin/users/:id
```

### Request body

```json
{
	"status": "SUSPENDED"
}
```

or

```json
{
	"status": "ACTIVE"
}
```

### Frontend route

`/admin-dashboard/users`

### UI actions

- Suspend user
- Activate user

---

## 34. Admin Gear Moderation

### Endpoint

```http
GET /admin/gear
```

### Frontend route

`/admin-dashboard/gears`

Returns all gear listings across the platform.

Expected response includes:

- gear item
- category
- provider
- availability
- stock
- price

---

## 35. Admin Rental Moderation

### Endpoint

```http
GET /admin/rentals
```

### Frontend route

`/admin-dashboard/orders`

Returns all rental orders across the platform.

Expected response includes:

- customer
- gear item
- payment
- status
- dates
- total price

---

## 36. Admin Category Management

Admin categories are managed through the public `/categories` endpoint with admin-only write access.

| Action          |   Method | Endpoint          |
| --------------- | -------: | ----------------- |
| List categories |    `GET` | `/categories`     |
| Create category |   `POST` | `/categories`     |
| Update category |    `PUT` | `/categories/:id` |
| Delete category | `DELETE` | `/categories/:id` |

### Create category request

```json
{
	"name": "Camping"
}
```

### Update category request

```json
{
	"name": "Hiking"
}
```

### Delete category rule

Backend prevents deletion if the category has linked gear items.

---

## 37. SWR Client-Side Fetching

The frontend uses SWR inside dashboard components.

All SWR keys are mapped directly to backend API paths.

| SWR Key            | Backend Endpoint       | Hook                  |
| ------------------ | ---------------------- | --------------------- |
| `/categories`      | `GET /categories`      | `useAdminCategories`  |
| `/admin/users`     | `GET /admin/users`     | `useAdminUsers`       |
| `/admin/gear`      | `GET /admin/gear`      | `useAdminGear`        |
| `/admin/rentals`   | `GET /admin/rentals`   | `useAdminRentals`     |
| `/rentals`         | `GET /rentals`         | `useCustomerOrders`   |
| `/payments`        | `GET /payments`        | `useCustomerPayments` |
| `/provider/gear`   | `GET /provider/gear`   | `useProviderGear`     |
| `/provider/orders` | `GET /provider/orders` | `useProviderOrders`   |

The SWR fetcher automatically:

- prepends `NEXT_PUBLIC_API_URL`
- attaches the access token
- refreshes expired tokens
- throws backend error messages

---

## 38. Server Actions to API Mapping

| Server Action            | Backend Endpoint             |
| ------------------------ | ---------------------------- |
| `registerUser`           | `POST /auth/register`        |
| `loginUser`              | `POST /auth/login`           |
| `refreshAccessToken`     | `POST /auth/refresh-token`   |
| `getMe`                  | `GET /auth/me`               |
| `getCategories`          | `GET /categories`            |
| `getGears`               | `GET /gear`                  |
| `getGearDetails`         | `GET /gear/:id`              |
| `createRental`           | `POST /rentals`              |
| `getRentalDetails`       | `GET /rentals/:id`           |
| `initiatePayment`        | `POST /payments/create`      |
| `createReview`           | `POST /reviews`              |
| `createGear`             | `POST /provider/gear`        |
| `updateGearStock`        | `PUT /provider/gear/:id`     |
| `toggleGearAvailability` | `PUT /provider/gear/:id`     |
| `deleteGear`             | `DELETE /provider/gear/:id`  |
| `updateOrderStatus`      | `PATCH /provider/orders/:id` |
| `updateUserStatus`       | `PATCH /admin/users/:id`     |
| `createCategory`         | `POST /categories`           |
| `updateCategory`         | `PUT /categories/:id`        |
| `deleteCategory`         | `DELETE /categories/:id`     |

---

## 39. Rental Status UI Mapping

The frontend uses colored badges for rental statuses.

| Status      | Badge Color | UI Meaning                        |
| ----------- | ----------- | --------------------------------- |
| `PLACED`    | Yellow      | Waiting for provider confirmation |
| `CONFIRMED` | Blue        | Customer can pay                  |
| `PAID`      | Purple      | Provider can mark picked up       |
| `PICKED_UP` | Green       | Customer has the gear             |
| `RETURNED`  | Gray        | Customer can leave a review       |
| `CANCELLED` | Red         | Order was cancelled               |

---

## 40. Payment Status UI Mapping

| Status      | Badge Color |
| ----------- | ----------- |
| `PENDING`   | Yellow      |
| `COMPLETED` | Green       |
| `FAILED`    | Red         |

---

## 41. User Status UI Mapping

| Status      | Badge Color |
| ----------- | ----------- |
| `ACTIVE`    | Green       |
| `SUSPENDED` | Red         |

---

## 42. Error Handling Strategy

### Server Actions

Server actions return a normalized result:

```ts
{
  success: boolean;
  message: string;
  errors?: unknown;
}
```

Forms display errors using:

- Zod validation messages
- Sonner toast notifications
- Backend error messages

### SWR

The SWR fetcher throws an error when:

```ts
!res.ok;
```

Dashboard components render error states using:

- `EmptyState`
- destructive border/background styles
- user-friendly messages

---

## 43. Known Integration Notes

### 1. Gear reviews on details page

The frontend gear details page expects:

```ts
gear.reviews;
```

For full review display, the backend `GET /gear/:id` endpoint should include reviews and customer names.

---

### 2. Customer cancellation

Backend supports:

```http
PATCH /rentals/:id/cancel
```

The frontend does not currently expose a cancellation button in the customer dashboard.

This can be added for orders with status:

```ts
PLACED;
```

---

### 3. Stripe redirect configuration

For the current frontend payment callback flow, backend `APP_URL` should be the frontend origin.

Example local backend `.env`:

```env
APP_URL=https://rental-gearup.vercel.app
```

This ensures Stripe redirects to:

```txt
https://rental-gearup.vercel.app/api/payments/success?session_id=...
```

---

### 4. Image optimization

The frontend uses `next/image`.

Currently allowed remote image host:

```ts
images.unsplash.com;
```

If gear images are hosted elsewhere, update `next.config.ts`:

```ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    {
      protocol: "https",
      hostname: "your-cdn-or-storage-domain.com",
    },
  ],
}
```

---

### 5. Provider gear deletion

The frontend uses `DELETE /provider/gear/:id`, but the backend performs a soft delete by setting:

```ts
isAvailable: false;
```

This is intentional but should be considered when displaying "deleted" gear in provider tables.

---

## 44. Local Integration Checklist

Before testing the full flow:

- [ ] Backend server is running
- [ ] Database migrations are applied
- [ ] Admin user is seeded
- [ ] Categories exist
- [ ] Provider gear exists
- [ ] Frontend `NEXT_PUBLIC_API_URL` is set
- [ ] Backend `APP_URL` points to frontend origin
- [ ] Stripe keys are configured in backend
- [ ] Stripe webhook is configured for `checkout.session.completed`
