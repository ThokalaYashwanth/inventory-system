# Inventory & Order Management System

Full-stack Inventory & Order Management System built with React, FastAPI, and PostgreSQL.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Containerization**: Docker + Docker Compose

## Features
- Product Management (CRUD + stock tracking)
- Customer Management (CRUD)
- Order Management (create, view, cancel with auto stock reduction)
- Dashboard with summary stats and low stock alerts

## Run Locally with Docker

```bash
cp .env.example .env
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Deploy Backend on Render

1. Push code to GitHub
2. Go to render.com → New Web Service → Connect repo
3. Set **Root Directory**: `backend`
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable:
   - `DATABASE_URL` = your PostgreSQL connection string (use Render PostgreSQL or Supabase)

## Deploy Frontend on Vercel

1. Go to vercel.com → New Project → Import repo
2. Set **Root Directory**: `frontend`
3. **Framework Preset**: Vite
4. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g. https://your-backend.onrender.com)
5. Deploy

## API Endpoints

### Products
- `POST /products` - Create product
- `GET /products` - List all products
- `GET /products/{id}` - Get product
- `PUT /products/{id}` - Update product
- `DELETE /products/{id}` - Delete product

### Customers
- `POST /customers` - Create customer
- `GET /customers` - List all customers
- `GET /customers/{id}` - Get customer
- `DELETE /customers/{id}` - Delete customer

### Orders
- `POST /orders` - Create order (auto reduces stock)
- `GET /orders` - List all orders
- `GET /orders/{id}` - Get order details
- `DELETE /orders/{id}` - Cancel order (restores stock)

### Dashboard
- `GET /dashboard` - Summary stats + low stock
