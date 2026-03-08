# Backend API Endpoints - Current Status

## ✅ EXISTING ENDPOINTS

### User Management
- POST /api/admin/teachers - Create teacher
- GET /api/admin/teachers - Get all teachers
- POST /api/admin/students - Create student
- GET /api/admin/students - Get all students
- POST /api/admin/parents - Create parent
- GET /api/admin/parents - Get all parents
- GET /api/admin/users - Get all users
- PUT /api/admin/users/:id/verify - Verify user
- DELETE /api/admin/users/:id - Delete user

### Class Management
- POST /api/admin/classes - Create class
- GET /api/admin/classes - Get all classes
- DELETE /api/admin/classes/:id - Delete class
- POST /api/admin/students/assign-class - Assign student to class
- POST /api/admin/teachers/assign-class - Assign teacher to class

### Subject Management
- POST /api/admin/subjects - Create subject
- GET /api/admin/subjects - Get all subjects
- DELETE /api/admin/subjects/:id - Delete subject

### Academic Records (Admin View)
- GET /api/admin/grades - Get all grades
- GET /api/admin/attendance - Get all attendance
- GET /api/admin/timetable - Get all timetable

### Approvals
- GET /api/admin/devices/pending - Get pending devices
- POST /api/admin/devices/verify - Verify device
- GET /api/admin/withdrawals/pending - Get pending withdrawals
- POST /api/admin/withdrawals/process - Process withdrawal

### Dashboard
- GET /api/admin/dashboard/stats - Get dashboard statistics

### Teacher Routes (for creating records)
- POST /api/teacher/grades - Create grade
- PUT /api/teacher/grades/:id - Update grade
- DELETE /api/teacher/grades/:id - Delete grade
- POST /api/teacher/attendance - Create attendance
- PUT /api/teacher/attendance/:id - Update attendance
- POST /api/teacher/attendance/bulk - Bulk create attendance
- POST /api/teacher/timetable - Create timetable
- PUT /api/teacher/timetable/:id - Update timetable
- DELETE /api/teacher/timetable/:id - Delete timetable

## ❌ MISSING ENDPOINTS (Need to Add)

### User Management - Edit
- PUT /api/admin/teachers/:id - Update teacher
- PUT /api/admin/students/:id - Update student
- PUT /api/admin/parents/:id - Update parent
- DELETE /api/admin/teachers/:id - Delete teacher
- DELETE /api/admin/students/:id - Delete student
- DELETE /api/admin/parents/:id - Delete parent

### Subject Management - Edit
- PUT /api/admin/subjects/:id - Update subject

### Class Management - Edit
- PUT /api/admin/classes/:id - Update class

### Academic Records - Admin Edit
- PUT /api/admin/grades/:id - Update grade (admin)
- DELETE /api/admin/grades/:id - Delete grade (admin)
- PUT /api/admin/attendance/:id - Update attendance (admin)
- DELETE /api/admin/attendance/:id - Delete attendance (admin)
- PUT /api/admin/timetable/:id - Update timetable (admin)
- DELETE /api/admin/timetable/:id - Delete timetable (admin)

### Fee Management - Admin
- GET /api/admin/fees/all - Get all fee records
- PUT /api/admin/fees/:id - Update fee balance
- POST /api/admin/fees/adjust - Adjust student fee balance

## 📝 RECOMMENDATION

Since teacher routes already have full CRUD for grades, attendance, and timetable,
we should add admin routes that allow admins to:
1. Edit/Delete any user (teacher, student, parent)
2. Edit/Delete any subject or class
3. Override/Edit/Delete any academic record (grades, attendance, timetable)
4. Manage fee balances directly
