# Expense Tracker MERN

Production-ready MERN expense tracker with JWT authentication, protected routes, income and expense CRUD, filters, dashboard metrics, and analytics charts.

## Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` in `backend/.env`.

## Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_URL` to your backend API base URL, for example `http://localhost:5000/api`.

## Deployment

- Frontend: deploy `frontend` to Vercel and set `VITE_API_URL`.
- Backend: deploy `backend` to Render/Railway/Vercel serverless-compatible hosting and set `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.
