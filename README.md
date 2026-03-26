# Full-Stack E-commerce (Flask + Vue 3 + Tailwind)

This repository is now fully converted to a Flask + Vue 3 e-commerce stack.

## Stack

- Frontend: Vue 3 (Composition API + `<script setup>`) + Vite
- Styling: Tailwind CSS v3
- Backend: Flask REST API
- Database: SQLite (`Flask-SQLAlchemy`)
- State: Pinia
- HTTP: Axios
- Routing: Vue Router v4
- Auth: JWT (`Flask-JWT-Extended`)

## Project Structure

```
/backend
  app.py
  models.py
  requirements.txt
  /routes
    auth.py
    products.py
    cart.py
    orders.py
/frontend
  index.html
  package.json
  vite.config.js
  tailwind.config.js
  /src
    App.vue
    main.js
    style.css
    /components
    /views
    /stores
    /services
    /router
```

## Backend Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Backend runs on `http://localhost:5000`.

Seeded defaults:

- 10 sample products across categories
- Admin user:
  - email: `admin@example.com`
  - password: `admin123`

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

### Products
- `GET /api/products` (search/category/pagination)
- `GET /api/products/<id>`
- `POST /api/products` (admin)
- `PUT /api/products/<id>` (admin)
- `DELETE /api/products/<id>` (admin)

### Cart
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update/<id>`
- `DELETE /api/cart/remove/<id>`
- `DELETE /api/cart/clear`

### Orders
- `POST /api/orders/checkout`
- `GET /api/orders`
- `GET /api/orders/<id>`
