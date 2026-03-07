# Quick Start Guide

## Prerequisites
- Node.js v18+
- PostgreSQL v14+
- npm

## Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Database
Edit `.env` file:
```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/school_db"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

### 3. Setup Database
```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Server
```bash
npm run dev
```

Server starts at: `http://localhost:5000`

## Testing with Swagger

1. Open: `http://localhost:5000/api-docs`

2. **Register a Student:**
   - POST `/api/auth/register`
   - Body:
   ```json
   {
     "email": "student@test.com",
     "password": "password123",
     "name": "John Doe",
     "role": "STUDENT",
     "deviceId": "device-123"
   }
   ```

3. **Verify Device (Manual):**
   - Open Prisma Studio: `npm run prisma:studio`
   - Go to `Device` table
   - Find your device and set `verified = true`

4. **Login:**
   - POST `/api/auth/login`
   - Body:
   ```json
   {
     "email": "student@test.com",
     "password": "password123",
     "deviceId": "device-123"
   }
   ```
   - Copy the `token` from response

5. **Authorize in Swagger:**
   - Click "Authorize" button (top right)
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"

6. **Test Protected Endpoints:**
   - POST `/api/fees/deposit` - Add money
   - GET `/api/fees/balance` - Check balance
   - GET `/api/notifications` - See notifications
   - POST `/api/fees/withdraw` - Request refund

## API Endpoints Summary

### Public (No Auth)
- POST `/api/auth/register`
- POST `/api/auth/login`

### Protected (Requires JWT)
- GET `/api/auth/verify-status`
- POST `/api/fees/deposit`
- POST `/api/fees/withdraw`
- GET `/api/fees/balance`
- GET `/api/fees/history`
- GET `/api/academic/grades`
- GET `/api/academic/attendance`
- GET `/api/academic/timetable`
- GET `/api/academic/records`
- GET `/api/notifications`
- GET `/api/notifications/unread`
- PATCH `/api/notifications/:id/read`
- PATCH `/api/notifications/read-all`

## Common Issues

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Create database: `createdb school_db`

### Device Not Verified
- Login fails if device not verified
- Use Prisma Studio to manually verify
- Or build admin app to verify devices

### JWT Token Expired
- Tokens expire after 1 hour
- Login again to get new token

## Development Commands

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open database GUI
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1h"
PORT=5000
NODE_ENV="development"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Testing Flow

1. Register → Device unverified
2. Manually verify device in database
3. Login → Get JWT token
4. Use token for all protected endpoints
5. Deposit money → Check notifications
6. Check balance → Low balance alert if < $1000
7. Request withdrawal → Pending status
8. View transaction history

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production database
4. Run `npm run build`
5. Start with `npm start`
6. Use reverse proxy (nginx)
7. Enable HTTPS

---

**Ready to test!** 🚀

For full documentation, see `README.md` and `IMPLEMENTATION.md`
