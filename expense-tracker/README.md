# Personal Expense Tracker

A minimal full-stack expense tracker built with Django REST Framework + React.

## Architecture

### Backend (Django + DRF)
- **Language**: Python 3.11
- **Framework**: Django 4.2 + Django REST Framework
- **Auth**: JWT via `djangorestframework-simplejwt`
- **Database**: SQLite (dev) — swap to PostgreSQL via `DATABASE_URL` env var in production
- **Persistence choice**: SQLite for zero-config local dev; the model uses `DECIMAL(12,2)` (never float) for correct monetary arithmetic

### Frontend (React + Vite)
- **Framework**: React 18 with Vite
- **State**: Custom `useExpenses` hook — no external state library
- **HTTP client**: Axios with auto JWT refresh interceptor

## Key Design Decisions

### Idempotency (Reliability)
The API supports client-supplied `idempotency_key` (UUID) on `POST /api/expenses/`.  
On the **frontend**, a UUID is generated and stored in `sessionStorage` before submission; it's reused on retries and cleared only on confirmed success. This means:
- Double-clicks → one expense
- Page refresh mid-submit → one expense
- Slow/failed network → safe to retry

A `UniqueConstraint(user, idempotency_key)` on the DB level is the last line of defence against race conditions.

### Money as Decimal
`amount` is `DecimalField(max_digits=12, decimal_places=2)` — never `float` — to avoid IEEE 754 rounding errors with real monetary values.

---

## Running Locally

### Backend

```bash
cd backend
python -m venv venv 
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API runs at `http://localhost:8000/api/`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI runs at `http://localhost:5173/` (proxies `/api` to Django).

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | — | Create account |
| POST | `/api/auth/login/` | — | Get JWT tokens |
| POST | `/api/auth/refresh/` | — | Refresh access token |
| GET | `/api/expenses/` | List expenses (`?category=food&sort=date_desc`) |
| POST | `/api/expenses/` | Create expense (idempotent) |
| GET | `/api/expenses/summary/` | Totals per category |

### POST /api/expenses/ — Request Body

```json
{
  "amount": "250.00",
  "category": "food",
  "description": "Lunch at office",
  "date": "2024-04-27",
  "idempotency_key": "uuid-v4-here"
}
```

---

## Nice-to-haves Implemented
- ✅ Idempotency (retry-safe submissions)
- ✅ Validation: positive amount, required date, max_length on description
- ✅ Category summary view (top 3 shown in dashboard header)
- ✅ Error and loading states in the UI
- ✅ JWT auto-refresh on 401
