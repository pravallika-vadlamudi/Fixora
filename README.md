# Fixora – Home Services Booking Platform

A full-stack MERN application that helps customers discover home services, request appointments, and track bookings. Service providers can manage assigned requests, while administrators manage the service catalogue, users, and bookings.

## Features

### Customer
- Register and log in with JWT authentication.
- Browse and search home services by category.
- View service details, pricing, duration, and description.
- Book a service with date, time, address, and optional notes.
- View booking history and cancel pending bookings.
- Submit a rating and review after a completed booking.

### Service provider
- View assigned service requests.
- Accept or reject pending requests.
- Update accepted bookings to `in-progress` and `completed`.

### Administrator
- View dashboard statistics.
- Create, update, and delete service listings.
- View and manage all bookings.
- Assign a provider to a booking.
- View registered users.

## Technology stack
- Frontend: React, Vite, React Router, Axios, plain CSS
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JSON Web Tokens and bcryptjs
- Deployment-ready: Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project structure

```text
fixora-home-services/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── index.html
│   └── package.json
├── presentation/Fixora_Project_Presentation.pptx
└── README.md
```

## Requirements
- Node.js 18 or later
- npm
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

1. Extract the ZIP file and open the project folder in VS Code.
2. Install the root helper dependency:

   ```bash
   npm install
   ```

3. Configure the backend:

   ```bash
   cd backend
   npm install
   ```

4. Copy `backend/.env.example` to `backend/.env` and fill in your MongoDB connection string and a long JWT secret.

   Example:

   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/fixora
   JWT_SECRET=replace_this_with_a_long_random_secret
   CLIENT_URL=http://localhost:5173
   ```

5. Start the backend in one terminal:

   ```bash
   npm run dev
   ```

6. In a second terminal, start the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

7. Open the local URL printed by Vite (normally `http://localhost:5173`).

You can also install both apps from the project root with `npm run install:all`, then run `npm run dev`.

## Demo accounts

There are no hard-coded public demo credentials. Register a customer account through the UI. To create an administrator or provider, register normally and update that user's `role` field in MongoDB to `admin` or `provider` for a controlled academic demonstration. Do not expose admin role selection in a public registration form.

## API overview

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/health` | Public | API health check |
| POST | `/auth/register` | Public | Create customer account |
| POST | `/auth/login` | Public | Login |
| GET | `/auth/me` | Logged in | Current user |
| GET | `/services` | Public | List/search services |
| GET | `/services/:id` | Public | Service details |
| POST | `/services` | Admin | Create service |
| PUT | `/services/:id` | Admin | Update service |
| DELETE | `/services/:id` | Admin | Delete service |
| POST | `/bookings` | Customer | Create booking |
| GET | `/bookings/my` | Logged in | Customer/provider bookings |
| GET | `/bookings` | Admin | All bookings |
| PATCH | `/bookings/:id/status` | Provider/Admin | Update booking status |
| PATCH | `/bookings/:id/assign` | Admin | Assign provider |
| PATCH | `/bookings/:id/cancel` | Customer | Cancel pending booking |
| POST | `/reviews` | Customer | Review completed booking |
| GET | `/reviews/service/:serviceId` | Public | Service reviews |
| GET | `/admin/stats` | Admin | Dashboard counts |
| GET | `/admin/users` | Admin | User list |

## Testing without Postman
- Use the application screens to register, log in, browse services, create bookings, and manage them.
- Open `http://localhost:5000/api/health` in a browser to check the server.
- Optional: use Thunder Client in VS Code or `curl` for direct API checks.

## Deployment notes

### Backend (Render)
- Create a new Web Service connected to this repository.
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, and `NODE_ENV=production`.

### Frontend (Vercel)
- Import the same repository.
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`.

Update the backend `CLIENT_URL` to your deployed frontend origin. Configure MongoDB Atlas network access and database user permissions securely. Replace placeholder URLs with the real deployment URLs after deployment.


V.Pravallika
