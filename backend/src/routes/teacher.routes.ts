import { Router } from 'express';
import { body } from 'express-validator';
import managementController from '../controllers/management.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All routes require ADMIN or TEACHER role

/**
 * @swagger
 * /api/teacher/grades:
 *   post:
 *     summary: Create grade (Teachers can only grade their own class students)
 *     tags: [Teacher - Grades]
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
 *               - subjectId
 *               - score
 *               - term
 *             properties:
 *               studentId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               score:
 *                 type: number
 *               term:
 *                 type: string
 *     responses:
 *       201:
 *         description: Grade created
 */
router.post(
  '/grades',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  [
    body('studentId').notEmpty(),
    body('subjectId').notEmpty(),
    body('score').isFloat({ min: 0, max: 100 }),
    body('term').notEmpty(),
    validate
  ],
  managementController.createGrade
);

router.put('/grades/:id', authenticate, authorize('ADMIN', 'TEACHER'), managementController.updateGrade);
router.delete('/grades/:id', authenticate, authorize('ADMIN'), managementController.deleteGrade);
router.get('/grades/class/:classId', authenticate, authorize('ADMIN', 'TEACHER'), managementController.getGradesByClass);

/**
 * @swagger
 * /api/teacher/attendance:
 *   post:
 *     summary: Record attendance (Teachers can only mark their own class)
 *     tags: [Teacher - Attendance]
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
 *               - date
 *               - status
 *             properties:
 *               studentId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [PRESENT, ABSENT, LATE]
 *     responses:
 *       201:
 *         description: Attendance recorded
 */
router.post(
  '/attendance',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  [
    body('studentId').notEmpty(),
    body('date').isISO8601(),
    body('status').isIn(['PRESENT', 'ABSENT', 'LATE']),
    validate
  ],
  managementController.createAttendance
);

router.put('/attendance/:id', authenticate, authorize('ADMIN', 'TEACHER'), managementController.updateAttendance);
router.get('/attendance/class/:classId', authenticate, authorize('ADMIN', 'TEACHER'), managementController.getAttendanceByClass);

/**
 * @swagger
 * /api/teacher/attendance/bulk:
 *   post:
 *     summary: Bulk record attendance for a class
 *     tags: [Teacher - Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - date
 *               - attendanceData
 *             properties:
 *               classId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               attendanceData:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     studentId:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [PRESENT, ABSENT, LATE]
 *     responses:
 *       201:
 *         description: Bulk attendance recorded
 */
router.post(
  '/attendance/bulk',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  managementController.bulkCreateAttendance
);

/**
 * @swagger
 * /api/teacher/timetable:
 *   post:
 *     summary: Create timetable entry
 *     tags: [Teacher - Schedule]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - subjectId
 *               - teacherId
 *               - day
 *               - startTime
 *               - endTime
 *             properties:
 *               classId:
 *                 type: string
 *               subjectId:
 *                 type: string
 *               teacherId:
 *                 type: string
 *               day:
 *                 type: string
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               room:
 *                 type: string
 *     responses:
 *       201:
 *         description: Timetable created
 */
router.post(
  '/timetable',
  authenticate,
  authorize('ADMIN', 'TEACHER'),
  [
    body('classId').notEmpty(),
    body('subjectId').notEmpty(),
    body('teacherId').notEmpty(),
    body('day').notEmpty(),
    body('startTime').notEmpty(),
    body('endTime').notEmpty(),
    validate
  ],
  managementController.createTimetable
);

router.put('/timetable/:id', authenticate, authorize('ADMIN', 'TEACHER'), managementController.updateTimetable);
router.delete('/timetable/:id', authenticate, authorize('ADMIN'), managementController.deleteTimetable);

export default router;
