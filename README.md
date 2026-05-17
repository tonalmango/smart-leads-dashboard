# Smart Leads Dashboard

A production-grade lead management system built with React, Node.js, and MongoDB. Includes JWT authentication, role-based access control, and comprehensive lead management features.

## Features

**Authentication & Authorization**
- JWT-based authentication with bcrypt password hashing
- Role-based access control (Admin and Sales roles)
- Persistent authentication tokens using Zustand

**Lead Management**
- Full CRUD operations for lead records
- Advanced filtering by status and source
- Debounced text search across lead fields
- Server-side pagination (10 items per page)
- Lead statistics and pipeline overview

**Admin Features**
- CSV export functionality respecting active filters
- Complete access to all leads and operations
- User and lead management

**Sales Features**
- View and manage assigned leads
- Create and edit lead records
- Limited to their own data with no delete access

**Technical Features**
- Full TypeScript implementation with strict mode
- Zod validation on all API endpoints
- Dark mode toggle for UI
- Responsive design with Tailwind CSS
- Docker Compose for production deployment
- Multi-stage Docker builds for optimization

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts          MongoDB connection setup
│   │   │   └── env.ts         Environment variable configuration
│   │   ├── modules/
│   │   │   ├── auth/          Authentication routes and services
│   │   │   └── leads/         Lead CRUD routes and services
│   │   ├── middleware/
│   │   │   ├── auth.ts        JWT verification and role authorization
│   │   │   ├── errorHandler.ts Error handling and response formatting
│   │   │   └── validate.ts    Zod schema validation
│   │   ├── models/
│   │   │   ├── User.ts        User schema with Mongoose
│   │   │   └── Lead.ts        Lead schema with Mongoose
│   │   ├── types/             TypeScript interfaces and enums
│   │   └── utils/             Helper functions and utilities
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          Authentication components
│   │   │   ├── layout/        Page layout components
│   │   │   ├── leads/         Lead management components
│   │   │   └── ui/            Reusable UI components
│   │   ├── config/            Application constants
│   │   ├── hooks/             Custom React hooks
│   │   ├── pages/             Page components (Login, Register, Dashboard)
│   │   ├── services/          API client and service functions
│   │   ├── store/             Zustand state management
│   │   ├── types/             TypeScript types and interfaces
│   │   └── utils/             Utility functions
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── docker-compose.yml         Multi-service orchestration
├── vercel.json                Vercel deployment configuration
├── API_DOCUMENTATION.md       Complete API reference
└── README.md                  This file
```

## Getting Started

### Prerequisites

- Node.js version 20 or later
- npm or yarn package manager
- MongoDB (for development) or Docker + Docker Compose
- Git for version control

### Option 1: Docker Compose (Recommended for Production)

This approach starts MongoDB, the Express API, and React frontend with Nginx all in containers.

```bash
# Clone the repository
git clone https://github.com/tonalmango/smart-leads-dashboard.git
cd smart-leads-dashboard

# Copy environment file
cp .env.example .env

# Edit .env and set these required values:
# - MONGODB_URI: Your MongoDB Atlas connection string
# - JWT_SECRET: A long random string (32+ characters)
# - CLIENT_URL: Your frontend URL (http://localhost for Docker)

# Build and start containers
docker-compose up --build
```

The application will be available at `http://localhost`
- Frontend: http://localhost/
- API: http://localhost:5000/api
- MongoDB: Runs in a container (data persisted in `mongo-data` volume)

To stop the services:
```bash
docker-compose down      # Stop but keep data
docker-compose down -v   # Stop and remove all volumes
```

### Option 2: Local Development

Run the backend and frontend separately on your machine.

**Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp ../.env.example .env

# Edit .env with your configuration:
# - MONGODB_URI: MongoDB connection string
# - JWT_SECRET: Your JWT signing secret
# - Other variables as needed

# Start development server with hot-reload
npm run dev
```

The API will run on `http://localhost:5000`

**Frontend Setup**

In a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Deployment

This project is configured for deployment on Vercel (frontend) and Render (backend).

**Frontend (Vercel)**
- Automatically deploys from GitHub
- Configuration: `vercel.json` handles SPA routing
- Environment: Set `VITE_API_URL` in Vercel dashboard

**Backend (Render)**
- Deploy from GitHub or use `render.yaml`
- Environment variables required:
  - `MONGODB_URI`: MongoDB Atlas connection string
  - `JWT_SECRET`: Your JWT secret key
  - `NODE_ENV`: Set to `production`
  - `CLIENT_URL`: Your frontend URL for CORS

## Access Control

The application implements role-based access control with two roles:

**Admin**
- Can create, read, update, and delete leads
- Can export leads to CSV file
- Can view all leads in the system
- Can manage user accounts

**Sales**
- Can create, read, and update lead records
- Can search and filter leads
- Cannot delete leads
- Cannot export to CSV
- Cannot manage other users' data

To register as admin, include `"role": "admin"` when calling the registration endpoint or select "Admin" in the role dropdown during registration.

## API Documentation

For complete API endpoint documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

**Base URL:** `http://localhost:5000/api` (development) or your deployed backend URL

**Authentication:** All protected endpoints require the `Authorization: Bearer <token>` header with a valid JWT token.

## Technology Stack

**Backend**
- Express.js 4 - HTTP framework and routing
- Node.js 20 - JavaScript runtime
- MongoDB 7 - NoSQL database
- Mongoose 8 - MongoDB object modeling
- TypeScript 5 - Static type checking (strict mode)
- Zod 3 - Runtime schema validation
- jsonwebtoken - JWT generation and verification
- bcryptjs - Password hashing (12 salt rounds)

**Frontend**
- React 18 - UI library
- Vite 5 - Build tool and dev server
- TypeScript 5 - Static type checking
- React Router 6 - Client-side routing
- Zustand + persist - State management with persistence
- React Hook Form - Form state and validation
- Axios - HTTP client with request/response interceptors
- Tailwind CSS 3 - Utility-first CSS framework
- Lucide React - Icon set

**DevOps & Deployment**
- Docker - Containerization
- Docker Compose - Multi-container orchestration
- Nginx - Reverse proxy and static file serving
- Vercel - Frontend deployment
- Render - Backend deployment

## Environment Configuration

**Backend (.env file)**

Required variables:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT signing (minimum 32 characters recommended)
- `JWT_EXPIRES_IN` - Token expiration time (default: `7d`)
- `PORT` - API server port (default: `5000`)
- `NODE_ENV` - Environment (`development`, `production`)
- `CLIENT_URL` - Frontend URL for CORS configuration

**Frontend (.env file)**

- `VITE_API_URL` - Backend API base URL (e.g., `http://localhost:5000/api`)

## Building for Production

**Build backend**
```bash
cd backend
npm run build    # Compiles TypeScript to JavaScript in dist/
npm start        # Runs compiled code
```

**Build frontend**
```bash
cd frontend
npm run build    # Creates optimized build in dist/
npm preview      # Preview production build locally
```

## Docker Architecture

The docker-compose.yml orchestrates three services:

**MongoDB Service**
- Image: mongodb:7
- Port: 27017 (internal only)
- Volume: `mongo-data` for persistent storage
- Health check: Verifies database is ready before other services start

**Backend Service**
- Multi-stage build: Compiles TypeScript in builder stage, runs from compiled code
- Port: 5000
- Depends on: MongoDB service
- Environment: Reads from .env file

**Frontend Service**
- Multi-stage build: Builds React app with Vite, serves with Nginx
- Port: 80
- Nginx config: Proxies `/api/*` requests to backend, serves SPA with client-side routing
- Depends on: Backend service

## Troubleshooting

**Port already in use**
```bash
# Find process using port 5000 (Linux/Mac)
lsof -i :5000
# Kill process
kill -9 <PID>

# Windows: Use netstat to find process
netstat -ano | findstr :5000
```

**MongoDB connection issues**
- Verify connection string in .env
- For MongoDB Atlas, ensure IP whitelist includes your machine
- Check firewall/VPN settings

**CORS errors in browser**
- Verify `CLIENT_URL` matches your frontend URL
- For production, set `CLIENT_URL` to your deployed frontend domain
- Clear browser cache and try hard refresh

**Docker containers not starting**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose up --build
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes following conventional commits
3. Push to your fork: `git push origin feature/your-feature`
4. Open a pull request with description of changes

## License

MIT License - see LICENSE file for details
