# Finance Dashboard API

A role-based finance data management backend built with Node.js, Express, TypeScript, Prisma, and SQLite.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma |
| Database | SQLite |
| Auth | JWT (jsonwebtoken) |
| Validation | Zod |
| Password Hashing | bcryptjs |

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/your-username/finance-dashboard-api.git
cd finance-dashboard-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set JWT_SECRET to a strong secret string

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Seed the database with sample data
npm run seed

# 6. Start the development server
npm run dev
```

Server runs at `http://localhost:3000`

### Seed Credentials

After running `npm run seed`, these test accounts are available:
```
ADMIN      admin@test.com    / secret123
ANALYST    analyst@test.com  / secret123
VIEWER     viewer@test.com   / secret123
```

The seed also creates 30 financial records spanning 6 months across
categories like Salary, Rent, Food, Freelance, Consulting, Utilities,
and Travel — enough to see meaningful data in all dashboard endpoints.

---

## Environment Variables

Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-this-with-a-strong-secret"
JWT_EXPIRES_IN="7d"
PORT=3000
```

---

## Role Model

Three roles are supported. Access is enforced at the route level via middleware.

| Permission | VIEWER | ANALYST | ADMIN |
|---|---|---|---|
| View own profile | ✓ | ✓ | ✓ |
| View financial records | ✓ | ✓ | ✓ |
| View dashboard summary | ✓ | ✓ | ✓ |
| View recent activity | ✓ | ✓ | ✓ |
| View category breakdown | — | ✓ | ✓ |
| View monthly trends | — | ✓ | ✓ |
| Create records | — | — | ✓ |
| Update records | — | — | ✓ |
| Delete records | — | — | ✓ |
| Manage users | — | — | ✓ |

---

## API Reference

All endpoints except `/auth/*` require a Bearer token in the `Authorization` header.
```
Authorization: Bearer <token>
```

---

### Auth

#### Register
```
POST /api/v1/auth/register
```
```json
{
  "name": "Abhay Sardar",
  "email": "sardarabhay90@gmail.com",
  "password": "secret123",
  "role": "ADMIN"
}
```
> `role` is optional. Defaults to `VIEWER` if omitted.

**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "clx1...",
    "name": "Abhay Sardar",
    "email": "sardarabhay90@gmail.com",
    "role": "ADMIN"
  }
}
```

---

#### Login
```
POST /api/v1/auth/login
```
```json
{
  "email": "sardarabhay90@gmail.com",
  "password": "secret123"
}
```

**Response**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "user": {
      "id": "clx1...",
      "name": "Abhay Sardar",
      "email": "sardarabhay90@gmail.com",
      "role": "ADMIN"
    }
  }
}
```

---

### Users

#### Get Own Profile
```
GET /api/v1/users/me
```
Available to all authenticated roles. Returns the profile of the currently logged-in user.

---

#### List All Users `ADMIN only`
```
GET /api/v1/users
```

---

#### Get User by ID `ADMIN only`
```
GET /api/v1/users/:id
```

---

#### Update User `ADMIN only`
```
PATCH /api/v1/users/:id
```
All fields optional — send only what needs to change.
```json
{
  "name": "Updated Name",
  "role": "ANALYST",
  "isActive": true
}
```

---

#### Deactivate User `ADMIN only`
```
DELETE /api/v1/users/:id
```
Users are soft deleted by setting `isActive` to `false`. An admin cannot deactivate their own account.

---

### Financial Records

#### List Records
```
GET /api/v1/records
```

**Query Parameters**

| Parameter | Type | Description |
|---|---|---|
| `type` | `INCOME` \| `EXPENSE` | Filter by record type |
| `category` | string | Partial match on category name |
| `from` | ISO 8601 datetime | Records on or after this date |
| `to` | ISO 8601 datetime | Records on or before this date |
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page, max 100 (default: 10) |

**Example**
```
GET /api/v1/records?type=EXPENSE&category=food&from=2024-01-01T00:00:00.000Z&page=1&limit=10
```

**Response**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "records": [...],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

#### Get Record by ID
```
GET /api/v1/records/:id
```

---

#### Create Record `ADMIN only`
```
POST /api/v1/records
```
```json
{
  "amount": 5000.00,
  "type": "INCOME",
  "category": "Salary",
  "date": "2024-03-01T00:00:00.000Z",
  "notes": "March salary credit"
}
```

---

#### Update Record `ADMIN only`
```
PATCH /api/v1/records/:id
```
All fields optional — send only what needs to change.
```json
{
  "amount": 5500.00,
  "notes": "Updated after bonus"
}
```

---

#### Delete Record `ADMIN only`
```
DELETE /api/v1/records/:id
```
Records are soft deleted via a `deletedAt` timestamp and excluded from all queries. The row is retained for audit purposes.

---

### Dashboard

#### Summary
```
GET /api/v1/dashboard/summary
```
**Response**
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "totalIncome": 150000,
    "totalExpenses": 87500,
    "netBalance": 62500,
    "totalRecords": 48
  }
}
```

---

#### Recent Activity
```
GET /api/v1/dashboard/recent
```
Returns the 5 most recently created records.

---

#### Category Breakdown `ANALYST, ADMIN`
```
GET /api/v1/dashboard/categories
```
**Response**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    { "category": "Salary", "type": "INCOME", "total": 120000, "count": 3 },
    { "category": "Rent", "type": "EXPENSE", "total": 45000, "count": 3 },
    { "category": "Food", "type": "EXPENSE", "total": 12500, "count": 18 }
  ]
}
```

---

#### Monthly Trends `ANALYST, ADMIN`
```
GET /api/v1/dashboard/trends
```
Returns income, expenses, and net balance grouped by month for the last 6 months.

**Response**
```json
{
  "success": true,
  "message": "Success",
  "data": [
    { "month": "2024-01", "income": 50000, "expenses": 28000, "net": 22000 },
    { "month": "2024-02", "income": 50000, "expenses": 31000, "net": 19000 },
    { "month": "2024-03", "income": 55000, "expenses": 29500, "net": 25500 }
  ]
}
```

---

## Error Responses

All errors follow the same shape:
```json
{
  "success": false,
  "message": "Role 'VIEWER' is not permitted to perform this action",
  "data": null
}
```

| Status Code | Meaning |
|---|---|
| `400` | Bad request — validation failed or invalid input |
| `401` | Unauthorized — missing or invalid token |
| `403` | Forbidden — authenticated but insufficient role |
| `404` | Resource not found |
| `500` | Internal server error |

---

## Project Structure
```
src/
├── config/           # Environment variable loading
├── middlewares/      # Auth, role, validation, error handling
├── modules/          # Feature modules
│   ├── auth/         # Register and login
│   ├── users/        # User management and own profile
│   ├── records/      # Financial records CRUD and filtering
│   └── dashboard/    # Summary, trends, categories, recent activity
├── utils/            # ApiResponse, ApiError, Prisma client singleton
├── types/            # Express type augmentation (req.user)
├── routes/           # Root router
└── app.ts            # Express app setup
```

---

## Design Decisions and Assumptions

**Soft deletes on both users and records**
Financial records are never permanently erased — `deletedAt` preserves an audit trail, which is standard in any finance system. Users are deactivated via `isActive: false` rather than deletion, so their records and history remain intact.

**Financial records are organisational data**
Records are not scoped to the user who created them. Any authenticated user can view all records because this is a shared finance dashboard, not a personal finance app. The `createdById` field tracks who created each entry for auditing purposes, not for access control.

**SQLite for persistence**
Chosen for zero-configuration local setup. Prisma abstracts the database layer entirely — switching to PostgreSQL in production requires only changing one line in `schema.prisma` with no application code changes.

**Role assigned at registration**
In a production system, role assignment would be a privileged admin-only action. For this assessment, role can be passed at registration to make testing all permission levels straightforward without extra tooling.

**Monthly trends aggregated in the application layer**
SQLite does not support `date_trunc`. Rather than writing raw SQL with `strftime`, records for the last 6 months are fetched and grouped in JavaScript. For a PostgreSQL backend this would move into a single DB-level `GROUP BY` query.

**Consistent response envelope**
Every response — success or failure — uses `{ success, message, data }`. This makes frontend integration predictable and error handling uniform across the entire API.

**Service layer owns all business logic**
Controllers are intentionally thin — they extract input, call a service, and return a response. All database access, validation logic, and error throwing lives in the service layer. This makes the code easier to test and reason about independently of the HTTP layer.

**Self-deactivation guard**
An admin cannot deactivate their own account. This prevents accidental lockout where no admin remains active in the system.

---

## Tradeoffs

| Decision | Tradeoff |
|---|---|
| SQLite | Zero setup friction; not suitable for concurrent production workloads |
| JWT stateless auth | No server-side session management; token revocation requires a denylist |
| In-app monthly aggregation | Simple and readable; less efficient than DB-level grouping at scale |
| No refresh tokens | Simpler auth flow for assessment scope; production would need token rotation |
| Role at registration | Convenient for testing; production would restrict this to admin actions only |

---

## What I Would Add in Production

- Refresh token rotation
- Request rate limiting per user
- PostgreSQL with connection pooling
- Structured logging with Winston or Pino
- Integration test suite with Jest and Supertest
- CI pipeline with lint and test checks
- Role management endpoints to promote or demote users
- Pagination on user listing endpoints