# GigFlow – Smart Leads Dashboard: API Documentation

**Base URL:** `http://localhost:5000/api`  
**Auth:** Bearer JWT — include `Authorization: Bearer <token>` on all protected routes.  
**Content-Type:** `application/json`

---

## Standard Response Envelopes

### Success
```json
{ "success": true, "message": "...", "data": { ... } }
```

### Paginated Success
```json
{
  "success": true,
  "message": "...",
  "data": [ ... ],
  "pagination": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Error
```json
{ "success": false, "message": "Human-readable error", "error": "Optional detail" }
```

---

## Health Check

### `GET /health`
Returns server status. No auth required.

**Response 200**
```json
{ "status": "ok", "environment": "development", "timestamp": "2024-01-15T10:30:00.000Z" }
```

---

## Auth

### `POST /api/auth/register`
Register a new user account.

**Body**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | ✅ | 2–50 chars |
| email | string | ✅ | Valid email |
| password | string | ✅ | Min 6 chars |
| role | string | — | `"admin"` or `"sales"` (default: `"sales"`) |

**Example Request**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "sales"
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6789abc0001",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "sales"
    }
  }
}
```

**Errors**
| Code | Message |
|------|---------|
| 400 | Validation error (field-level message) |
| 409 | User with this email already exists |

---

### `POST /api/auth/login`
Authenticate and receive a JWT.

**Body**
| Field | Type | Required |
|-------|------|----------|
| email | string | ✅ |
| password | string | ✅ |

**Example Request**
```json
{ "email": "jane@example.com", "password": "secret123" }
```

**Response 200**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6789abc0001",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "sales"
    }
  }
}
```

**Errors**
| Code | Message |
|------|---------|
| 400 | Validation error |
| 401 | Invalid credentials |

---

### `GET /api/auth/me` 🔒
Get the authenticated user's profile.

**Response 200**
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "65a1b2c3d4e5f6789abc0001",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "sales",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Errors**
| Code | Message |
|------|---------|
| 401 | Access denied. No token provided. |
| 401 | Invalid or expired token. |

---

## Leads

All lead routes require authentication (`Authorization: Bearer <token>`).  
`admin` users see **all** leads. `sales` users see **only their own** leads.

---

### `GET /api/leads` 🔒
List leads with filtering, sorting, search, and pagination.

**Query Parameters**
| Param | Type | Default | Notes |
|-------|------|---------|-------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Max 100 |
| status | string | — | `New` \| `Contacted` \| `Qualified` \| `Lost` |
| source | string | — | `Website` \| `Instagram` \| `Referral` |
| search | string | — | Case-insensitive match on name or email |
| sort | string | `latest` | `latest` \| `oldest` |

**Example**
```
GET /api/leads?page=1&limit=10&status=New&sort=latest
GET /api/leads?search=jane&source=Website
```

**Response 200**
```json
{
  "success": true,
  "message": "Leads fetched successfully",
  "data": [
    {
      "_id": "65a1b2c3d4e5f6789abc0002",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "New",
      "source": "Website",
      "notes": "Found us via Google",
      "createdBy": { "_id": "65a1...", "name": "Jane Smith", "email": "jane@example.com" },
      "createdAt": "2024-01-15T10:00:00.000Z",
      "updatedAt": "2024-01-15T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

### `GET /api/leads/stats` 🔒
Aggregated stats for the current user's leads.

**Response 200**
```json
{
  "success": true,
  "message": "Stats fetched successfully",
  "data": {
    "total": 42,
    "byStatus": {
      "New": 12,
      "Contacted": 15,
      "Qualified": 10,
      "Lost": 5
    },
    "bySource": {
      "Website": 20,
      "Instagram": 14,
      "Referral": 8
    }
  }
}
```

---

### `GET /api/leads/export` 🔒 👑 Admin only
Download a CSV file of leads matching the given filters.

**Query Parameters** — same filter params as `GET /api/leads` (except `page`, `limit`, `sort`).

**Response 200**
- `Content-Type: text/csv`
- `Content-Disposition: attachment; filename="leads-YYYY-MM-DD.csv"`

**CSV Columns:** Name, Email, Status, Source, Notes, Created By, Created At

**Errors**
| Code | Message |
|------|---------|
| 403 | Access denied. Insufficient permissions. |

---

### `GET /api/leads/:id` 🔒
Get a single lead by ID.

**Path Params**
| Param | Type | Notes |
|-------|------|-------|
| id | string | 24-char MongoDB ObjectId |

**Response 200**
```json
{
  "success": true,
  "message": "Lead fetched successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6789abc0002",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "New",
    "source": "Website",
    "notes": "Found us via Google",
    "createdBy": { "_id": "...", "name": "Jane Smith", "email": "jane@example.com" },
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

**Errors**
| Code | Message |
|------|---------|
| 400 | Invalid lead ID |
| 403 | Access denied (Sales user viewing another's lead) |
| 404 | Lead not found |

---

### `POST /api/leads` 🔒
Create a new lead.

**Body**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | string | ✅ | 2–100 chars |
| email | string | ✅ | Valid email |
| source | string | ✅ | `Website` \| `Instagram` \| `Referral` |
| status | string | — | Default: `New` |
| notes | string | — | Max 500 chars |

**Example Request**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "source": "Website",
  "notes": "Interested in the Pro plan"
}
```

**Response 201**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": { "_id": "65a1...", "name": "John Doe", ... }
}
```

**Errors**
| Code | Message |
|------|---------|
| 400 | Validation error (field-level message) |

---

### `PUT /api/leads/:id` 🔒
Update an existing lead. Sales users can only edit their own leads.  
All fields are optional — send only what you want to change.

**Body** (all optional)
| Field | Type | Notes |
|-------|------|-------|
| name | string | 2–100 chars |
| email | string | Valid email |
| status | string | `New` \| `Contacted` \| `Qualified` \| `Lost` |
| source | string | `Website` \| `Instagram` \| `Referral` |
| notes | string | Max 500 chars |

**Example Request**
```json
{ "status": "Qualified", "notes": "Ready for proposal" }
```

**Response 200**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": { "_id": "65a1...", "status": "Qualified", ... }
}
```

**Errors**
| Code | Message |
|------|---------|
| 400 | Validation error |
| 403 | Access denied (Sales user editing another's lead) |
| 404 | Lead not found |

---

### `DELETE /api/leads/:id` 🔒 👑 Admin only
Permanently delete a lead.

**Response 200**
```json
{ "success": true, "message": "Lead deleted successfully" }
```

**Errors**
| Code | Message |
|------|---------|
| 403 | Access denied. Insufficient permissions. |
| 404 | Lead not found |

---

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (authenticated but insufficient role) |
| 404 | Not Found |
| 409 | Conflict (e.g. duplicate email) |
| 500 | Internal Server Error |

---

## Enum Values

**LeadStatus:** `New` · `Contacted` · `Qualified` · `Lost`  
**LeadSource:** `Website` · `Instagram` · `Referral`  
**UserRole:** `admin` · `sales`

---

## Authentication Flow

```
1. POST /api/auth/register  →  receive { token, user }
2. Store token client-side (Zustand persist → localStorage)
3. Attach on every request: Authorization: Bearer <token>
4. On 401 response → auto-logout via Axios interceptor
```

---

🔒 = Requires authentication  
👑 = Admin role required
