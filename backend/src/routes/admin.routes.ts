import { Router } from 'express';
import { body } from 'express-validator';
import adminController from '../controllers/admin.controller';
import userManagementController from '../controllers/user-management.controller';
import managementController from '../controllers/management.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// ==================== USER MANAGEMENT (ADMIN ONLY) ====================

/**
 * @swagger
 * /api/admin/teachers:
 *   post:
 *     summary: Create new teacher
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Teacher created
 */
router.post(
  '/teachers',
  authenticate,
  authorize('ADMIN'),
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), validate],
  userManagementController.createTeacher
);

/**
 * @swagger
 * /api/admin/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teachers retrieved
 */
router.get('/teachers', authenticate, authorize('ADMIN'), userManagementController.getAllTeachers);

/**
 * @swagger
 * /api/admin/students:
 *   post:
 *     summary: Create new student
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               parentId:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student created
 */
router.post(
  '/students',
  authenticate,
  authorize('ADMIN'),
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), validate],
  userManagementController.createStudent
);

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Students retrieved
 */
router.get('/students', authenticate, authorize('ADMIN'), userManagementController.getAllStudents);

/**
 * @swagger
 * /api/admin/parents:
 *   post:
 *     summary: Create new parent
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parent created
 */
router.post(
  '/parents',
  authenticate,
  authorize('ADMIN'),
  [body('name').notEmpty(), body('email').isEmail(), body('password').isLength({ min: 6 }), validate],
  userManagementController.createParent
);

/**
 * @swagger
 * /api/admin/parents:
 *   get:
 *     summary: Get all parents
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Parents retrieved
 */
router.get('/parents', authenticate, authorize('ADMIN'), userManagementController.getAllParents);

/**
 * @swagger
 * /api/admin/students/assign-class:
 *   post:
 *     summary: Assign student to class
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - classId
 *             properties:
 *               studentId:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student assigned successfully
 */
router.post(
  '/students/assign-class',
  authenticate,
  authorize('ADMIN'),
  [body('studentId').notEmpty(), body('classId').notEmpty(), validate],
  managementController.assignStudentToClass
);

/**
 * @swagger
 * /api/admin/teachers/assign-class:
 *   post:
 *     summary: Assign teacher to class
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teacherId
 *               - classId
 *             properties:
 *               teacherId:
 *                 type: string
 *               classId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teacher assigned successfully
 */
router.post(
  '/teachers/assign-class',
  authenticate,
  authorize('ADMIN'),
  [body('teacherId').notEmpty(), body('classId').notEmpty(), validate],
  managementController.assignTeacherToClass
);

// ==================== ACADEMIC SETUP (ADMIN ONLY) ====================

/**
 * @swagger
 * /api/admin/subjects:
 *   post:
 *     summary: Create new subject
 *     tags: [Admin - Academic Setup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       201:
 *         description: Subject created
 */
router.post(
  '/subjects',
  authenticate,
  authorize('ADMIN'),
  [body('name').notEmpty(), body('code').notEmpty(), validate],
  managementController.createSubject
);

/**
 * @swagger
 * /api/admin/subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Admin - Academic Setup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subjects retrieved
 */
router.get('/subjects', authenticate, authorize('ADMIN'), managementController.getAllSubjects);

/**
 * @swagger
 * /api/admin/classes:
 *   post:
 *     summary: Create new class
 *     tags: [Admin - Academic Setup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               teacherId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class created
 */
router.post(
  '/classes',
  authenticate,
  authorize('ADMIN'),
  [body('name').notEmpty(), validate],
  managementController.createClass
);

/**
 * @swagger
 * /api/admin/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Admin - Academic Setup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classes retrieved
 */
router.get('/classes', authenticate, authorize('ADMIN'), adminController.getAllClasses);

// ==================== APPROVALS & VERIFICATION ====================

/**
 * @swagger
 * /api/admin/devices/pending:
 *   get:
 *     summary: Get pending device verifications
 *     tags: [Admin - Approvals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending devices retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/devices/pending', authenticate, authorize('ADMIN'), adminController.getPendingDevices);

/**
 * @swagger
 * /api/admin/devices/verify:
 *   post:
 *     summary: Verify a device
 *     tags: [Admin - Approvals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceId
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: The device UUID (id field from pending devices list)
 *                 example: "43eda5e1-aa8b-4f00-9ba4-ddf5f8ba1698"
 *     responses:
 *       200:
 *         description: Device verified
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post(
  '/devices/verify',
  authenticate,
  authorize('ADMIN'),
  [body('deviceId').notEmpty(), validate],
  adminController.verifyDevice
);

/**
 * @swagger
 * /api/admin/withdrawals/pending:
 *   get:
 *     summary: Get pending withdrawal requests
 *     tags: [Admin - Approvals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending withdrawals retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/withdrawals/pending', authenticate, authorize('ADMIN'), adminController.getPendingWithdrawals);

/**
 * @swagger
 * /api/admin/withdrawals/process:
 *   post:
 *     summary: Approve or reject withdrawal
 *     tags: [Admin - Approvals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *               - action
 *             properties:
 *               transactionId:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Withdrawal processed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post(
  '/withdrawals/process',
  authenticate,
  authorize('ADMIN'),
  [
    body('transactionId').notEmpty(),
    body('action').isIn(['APPROVED', 'REJECTED']),
    validate
  ],
  adminController.processWithdrawal
);

/**
 * @swagger
 * /api/admin/dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/dashboard/stats', authenticate, authorize('ADMIN'), adminController.getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved
 */
router.get('/users', authenticate, authorize('ADMIN'), adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}/verify:
 *   put:
 *     summary: Verify a user
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User verified
 */
router.put('/users/:id/verify', authenticate, authorize('ADMIN'), adminController.verifyUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete('/users/:id', authenticate, authorize('ADMIN'), adminController.deleteUser);

/**
 * @swagger
 * /api/admin/classes/{id}:
 *   delete:
 *     summary: Delete a class
 *     tags: [Admin - Academic Setup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Class deleted
 */
router.delete('/classes/:id', authenticate, authorize('ADMIN'), adminController.deleteClass);

// ==================== ACADEMIC RECORDS (ADMIN VIEW) ====================

/**
 * @swagger
 * /api/admin/grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Admin - Academic Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Grades retrieved
 */
router.get('/grades', authenticate, authorize('ADMIN'), adminController.getAllGrades);

/**
 * @swagger
 * /api/admin/attendance:
 *   get:
 *     summary: Get all attendance records
 *     tags: [Admin - Academic Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance records retrieved
 */
router.get('/attendance', authenticate, authorize('ADMIN'), adminController.getAllAttendance);

/**
 * @swagger
 * /api/admin/timetable:
 *   get:
 *     summary: Get all timetable entries
 *     tags: [Admin - Academic Records]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Timetable retrieved
 */
router.get('/timetable', authenticate, authorize('ADMIN'), adminController.getAllTimetable);

/**
 * @swagger
 * /api/admin/subjects/{id}:
 *   delete:
 *     summary: Delete a subject
 *     tags: [Admin - Academic Setup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject deleted
 */
router.delete('/subjects/:id', authenticate, authorize('ADMIN'), adminController.deleteSubject);

// ==================== ADMIN EDIT/UPDATE OPERATIONS ====================

/**
 * @swagger
 * /api/admin/teachers/{id}:
 *   put:
 *     summary: Update teacher
 *     tags: [Admin - User Management]
 */
router.put('/teachers/:id', authenticate, authorize('ADMIN'), adminController.updateTeacher);

/**
 * @swagger
 * /api/admin/teachers/{id}:
 *   delete:
 *     summary: Delete teacher
 *     tags: [Admin - User Management]
 */
router.delete('/teachers/:id', authenticate, authorize('ADMIN'), adminController.deleteTeacher);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   put:
 *     summary: Update student
 *     tags: [Admin - User Management]
 */
router.put('/students/:id', authenticate, authorize('ADMIN'), adminController.updateStudent);

/**
 * @swagger
 * /api/admin/students/{id}:
 *   delete:
 *     summary: Delete student
 *     tags: [Admin - User Management]
 */
router.delete('/students/:id', authenticate, authorize('ADMIN'), adminController.deleteStudent);

/**
 * @swagger
 * /api/admin/parents/{id}:
 *   put:
 *     summary: Update parent
 *     tags: [Admin - User Management]
 */
router.put('/parents/:id', authenticate, authorize('ADMIN'), adminController.updateParent);

/**
 * @swagger
 * /api/admin/parents/{id}:
 *   delete:
 *     summary: Delete parent
 *     tags: [Admin - User Management]
 */
router.delete('/parents/:id', authenticate, authorize('ADMIN'), adminController.deleteParent);

/**
 * @swagger
 * /api/admin/subjects/{id}:
 *   put:
 *     summary: Update subject
 *     tags: [Admin - Academic Setup]
 */
router.put('/subjects/:id', authenticate, authorize('ADMIN'), adminController.updateSubject);

/**
 * @swagger
 * /api/admin/classes/{id}:
 *   put:
 *     summary: Update class
 *     tags: [Admin - Academic Setup]
 */
router.put('/classes/:id', authenticate, authorize('ADMIN'), adminController.updateClass);

/**
 * @swagger
 * /api/admin/grades/{id}:
 *   put:
 *     summary: Update grade
 *     tags: [Admin - Academic Records]
 */
router.put('/grades/:id', authenticate, authorize('ADMIN'), managementController.updateGrade);

/**
 * @swagger
 * /api/admin/grades/{id}:
 *   delete:
 *     summary: Delete grade
 *     tags: [Admin - Academic Records]
 */
router.delete('/grades/:id', authenticate, authorize('ADMIN'), managementController.deleteGrade);

/**
 * @swagger
 * /api/admin/attendance/{id}:
 *   put:
 *     summary: Update attendance
 *     tags: [Admin - Academic Records]
 */
router.put('/attendance/:id', authenticate, authorize('ADMIN'), managementController.updateAttendance);

/**
 * @swagger
 * /api/admin/attendance/{id}:
 *   delete:
 *     summary: Delete attendance
 *     tags: [Admin - Academic Records]
 */
router.delete('/attendance/:id', authenticate, authorize('ADMIN'), adminController.deleteAttendance);

/**
 * @swagger
 * /api/admin/timetable/{id}:
 *   put:
 *     summary: Update timetable
 *     tags: [Admin - Academic Records]
 */
router.put('/timetable/:id', authenticate, authorize('ADMIN'), managementController.updateTimetable);

/**
 * @swagger
 * /api/admin/timetable/{id}:
 *   delete:
 *     summary: Delete timetable
 *     tags: [Admin - Academic Records]
 */
router.delete('/timetable/:id', authenticate, authorize('ADMIN'), managementController.deleteTimetable);

/**
 * @swagger
 * /api/admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Students retrieved
 */
// Removed - now using POST /api/admin/students above

/**
 * @swagger
 * /api/admin/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Admin - User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teachers retrieved
 */
// Removed - now using POST /api/admin/teachers above

/**
 * @swagger
 * /api/admin/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Admin - Academic Setup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classes retrieved
 */
// Removed - now using POST /api/admin/classes above

export default router;
