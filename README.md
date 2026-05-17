<h1 align="center">
  <img src="https://via.placeholder.com/40/2563eb/ffffff?text=⚡" alt="logo" />
  <br/>Smart Leads Dashboard
</h1>

<p align="center">
  A production-grade lead management system built on the MERN stack with TypeScript.
  <br/>Features JWT auth, role-based access control, Zod validation, dark mode, and CSV export.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Node.js-20-green?logo=node.js" />
  <img src="https://img.shields.io/badge/MongoDB-7-green?logo=mongodb" />
  <img src="https://img.shields.io/badge/Docker-ready-blue?logo=docker" />
</p>

---

## ✨ Features

| Category | Feature |
|----------|---------|
| **Auth** | JWT register / login · bcrypt password hashing · token persistence |
| **RBAC** | Admin (full access) · Sales (own leads only, no delete / no CSV export) |
| **Leads** | Full CRUD · status & source filtering · debounced text search · sort |
| **Pagination** | Server-side · 10 per page · full metadata |
| **CSV Export** | Admin-only · respects active filters |
| **Dashboard** | Live stats from aggregation endpoint · progress bars · pipeline status |
| **Validation** | Zod schemas on every route (body, query, params) |
| **UI** | Tailwind CSS · dark mode toggle · loading / empty / error states |
| **DevOps** | Docker Compose · multi-stage Dockerfiles · Nginx reverse proxy |

---

## 🏗️ Architecture

```
smart-leads-dashboard/
├── backend/
│   └── src/
│       ├── config/           # db.ts, env.ts
│       ├── modules/
│       │   ├── auth/         # schemas · service · controller · routes
│       │   └── leads/        # schemas · service · controller · routes
│       ├── middleware/        # auth · errorHandler · validate (Zod)
│       ├── models/            # User · Lead (Mongoose)
│       ├── types/             # Shared TS interfaces & enums
│       └── utils/             # AppError · asyncHandler · jwt · response
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── auth/          # ProtectedRoute
│       │   ├── layout/        # Layout · Sidebar · Header
│       │   ├── leads/         # LeadTable · LeadFiltersBar · LeadFormModal
│       │   │                  # LeadForm · Pagination · StatsCards
│       │   └── ui/            # Badge · Spinner · LoadingState · EmptyState
│       │                      # ErrorState · ErrorMessage · Modal
│       ├── config/            # constants.ts (no hardcoded values elsewhere)
│       ├── hooks/             # useLeads · useLeadStats · useDebounce
│       ├── pages/             # DashboardPage · LeadsPage · LoginPage · RegisterPage
│       ├── services/          # apiClient (Axios + interceptors) · auth.service · lead.service
│       ├── store/             # authStore (Zustand + persist) · themeStore
│       └── types/             # Shared TS interfaces & enums
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20
- MongoDB (local) **or** Docker + Docker Compose

---

### Option A — Docker Compose (recommended)

```bash
# 1. Clone
git clone <your-repo-url>
cd smart-leads-dashboard

# 2. Configure secrets
cp .env.example .env
# Edit .env: set JWT_SECRET to a long random string

# 3. Build and run
docker-compose up --build

# 4. Open
open http://localhost
```

Starts MongoDB, the Express API on `:5000`, and the React app on `:80` via Nginx.

To stop:

```bash
docker-compose down          # keep data
docker-compose down -v       # remove data volumes too
```

---

### Option B — Local Development

#### Backend

```bash
cd backend
cp ../.env.example .env
# Set MONGODB_URI, JWT_SECRET, etc.
npm install
npm run dev          # ts-node-dev with hot-reload on :5000
```

#### Frontend

```bash
cd frontend
# Create frontend/.env
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm install
npm run dev          # Vite dev server on :5173
```

---

## 🔐 Role-Based Access Control

| Action | Admin | Sales |
|--------|:-----:|:-----:|
| View all leads | ✅ | ❌ (own only) |
| Create lead | ✅ | ✅ |
| Edit own lead | ✅ | ✅ |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ❌ |
| View dashboard stats | ✅ | ✅ (own) |

Register a user and set `"role": "admin"` in the request body to create an admin account.

---

## 🌐 API Reference

See **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** for the full endpoint reference.

Base URL: `http://localhost:5000/api`  
All protected routes require: `Authorization: Bearer <token>`

---

## 🧩 Tech Stack

### Backend
| Package | Purpose |
|---------|---------|
| Express 4 | HTTP framework |
| Mongoose 8 | MongoDB ODM |
| Zod 3 | Request validation (body, query, params) |
| jsonwebtoken | JWT generation & verification |
| bcryptjs | Password hashing (salt rounds: 12) |
| TypeScript 5 (strict) | Type safety |

### Frontend
| Package | Purpose |
|---------|---------|
| React 18 + Vite | UI framework & build tool |
| React Router 6 | Client-side routing |
| TanStack Query 5 | Server state, caching, refetch |
| Zustand + persist | Auth & theme state |
| React Hook Form | Form state & validation |
| Axios | HTTP client with interceptors |
| Tailwind CSS 3 | Utility-first styling |
| lucide-react | Icon set |

---

## 🐳 Docker Details

```yaml
services:
  mongo    # MongoDB 7 with health-check
  backend  # Node 20 multi-stage build → production binary
  frontend # Node 20 build → Nginx serving static files + /api proxy
```

The Nginx config proxies `/api/*` → `backend:5000` so the frontend and API share port 80 in production.

---

## ⚙️ Environment Variables

| Variable | Service | Description | Default |
|----------|---------|-------------|---------|
| `MONGODB_URI` | backend | MongoDB connection string | — (required) |
| `JWT_SECRET` | backend | JWT signing secret | — (required) |
| `JWT_EXPIRES_IN` | backend | Token expiry | `7d` |
| `PORT` | backend | HTTP port | `5000` |
| `NODE_ENV` | backend | Environment | `development` |
| `CLIENT_URL` | backend | CORS allowed origin | `http://localhost:5173` |
| `VITE_API_URL` | frontend | API base URL | `/api` |

---

## 📝 Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add CSV export with active filter support
fix: restrict export endpoint to Admin role
refactor: extract lead business logic into service layer
docs: add API_DOCUMENTATION.md
chore: install zod v3 for request validation
```

---

## 📄 License

MIT
