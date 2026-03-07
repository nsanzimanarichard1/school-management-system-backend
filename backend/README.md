# School Management System - Client Backend API

Backend API for Parent/Student portal - Fee management, grades, and attendance tracking.

## 🏗️ Architecture

**Layered Architecture:**
- **Routes** → Define API endpoints
- **Controllers** → Handle HTTP requests/responses
- **Services** → Business logic
- **DTOs** → Data transformation & security
- **Middlewares** → Authentication, validation, rate limiting
- **Config** → Database, JWT, Swagger

## 🔐 Security Features

- ✅ SHA-512 password hashing
- ✅ JWT authentication with device verification
- ✅ Helmet for secure HTTP headers
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Input validation & sanitization
- ✅ Role-based access control (RBAC)
- ✅ DTOs to prevent sensitive data exposure
- ✅ Low balance alerts with configurable thresholds
- ✅ Push notifications for all critical events

## 📋 Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Update `.env` with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/school_management_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=5000
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

## 📚 API Documentation

Access Swagger UI at: **http://localhost:5000/api-docs**

## 🔑 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/verify-status` | Check device verification | Yes |

### Fee Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/fees/deposit` | Deposit fee payment | Yes |
| POST | `/api/fees/withdraw` | Request refund | Yes |
| GET | `/api/fees/balance` | Get current balance | Yes |
| GET | `/api/fees/history` | Get transaction history | Yes |

### Academic Records

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/academic/grades` | Get student grades | Yes |
| GET | `/api/academic/attendance` | Get attendance records | Yes |
| GET | `/api/academic/timetable` | Get class timetable | Yes |
| GET | `/api/academic/records` | Get all academic data | Yes |

### Notifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/notifications` | Get all notifications | Yes |
| GET | `/api/notifications/unread` | Get unread notifications | Yes |
| PATCH | `/api/notifications/:id/read` | Mark notification as read | Yes |
| PATCH | `/api/notifications/read-all` | Mark all as read | Yes |

## 🔄 Authentication Flow

1. **Register**: User registers with email, password, name, role, and deviceId
2. **Device Verification**: Admin must verify the device (device.verified = true)
3. **Login**: User can only login if device is verified
4. **Access**: JWT token required for all protected endpoints

## 💳 Fee Transaction Workflow

### Deposit (Instant)
```
User deposits → Transaction created (COMPLETED) → Balance updated immediately → Notification sent
```

### Withdraw (Requires Approval)
```
User requests refund → Transaction created (PENDING) → Notification sent → Admin reviews → APPROVED/REJECTED → Notification sent
```

### Low Balance Alert
```
User checks balance → Balance < threshold → Notification sent (once per 24 hours)
```

## 🗂️ Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client
│   │   ├── config.ts          # Environment config
│   │   └── swagger.ts         # API documentation
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── fee.controller.ts
│   │   └── academic.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── fee.service.ts
│   │   └── academic.service.ts
│   ├── dtos/
│   │   ├── auth.dto.ts
│   │   ├── fee.dto.ts
│   │   └── academic.dto.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── fee.routes.ts
│   │   └── academic.routes.ts
│   ├── utils/
│   │   ├── hash.ts            # SHA-512 hashing
│   │   └── jwt.ts             # JWT utilities
│   └── server.ts              # Express app
├── .env.example
├── .env
├── package.json
└── tsconfig.json
```

## 🧪 Testing with Swagger

1. Start the server: `npm run dev`
2. Open Swagger UI: `http://localhost:5000/api-docs`
3. Register a user via `/api/auth/register`
4. Manually verify device in database (set `verified = true`)
5. Login via `/api/auth/login` to get JWT token
6. Click "Authorize" button in Swagger and paste token
7. Test protected endpoints

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
```

## 🛡️ Security Best Practices Implemented

1. **Password Security**: SHA-512 hashing (as required)
2. **JWT Expiration**: Tokens expire after 1 hour
3. **Device Verification**: Admin must approve devices
4. **Rate Limiting**: Prevents brute force attacks
5. **Input Validation**: All inputs sanitized
6. **DTOs**: Sensitive fields never exposed to frontend
7. **CORS**: Configured for security
8. **Helmet**: Secure HTTP headers

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | Secret key for JWT signing | - |
| JWT_EXPIRES_IN | Token expiration time | 1h |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| RATE_LIMIT_WINDOW_MS | Rate limit window | 900000 |
| RATE_LIMIT_MAX_REQUESTS | Max requests per window | 100 |

## 📬 Notification Types

1. **PAYMENT_CONFIRMATION** - Sent after successful deposit
2. **REFUND_STATUS** - Sent when refund is requested/approved/rejected
3. **LOW_BALANCE** - Sent when balance falls below threshold
4. **DEVICE_VERIFIED** - Sent when admin verifies device
5. **LOGIN_SUCCESS** - Sent after successful login

## 🚨 Important Notes

- Device verification is required before login
- Deposits are instant (COMPLETED status)
- Withdrawals require admin approval (PENDING → APPROVED/REJECTED)
- JWT tokens expire after 1 hour (session management)
- Rate limiting: 100 requests per 15 minutes per IP

## 👨‍💻 Developer

Built for Elevanda Ventures practical test.

## 📄 License

ISC
