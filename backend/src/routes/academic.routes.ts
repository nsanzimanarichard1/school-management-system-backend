import { Router } from 'express';
import academicController from '../controllers/academic.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/academic/profile:
 *   get:
 *     summary: Get student profile (class, subjects, teacher)
 *     tags: [Student/Parent - Academic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student profile retrieved
 */
router.get('/profile', authenticate, authorize('STUDENT', 'PARENT'), academicController.getStudentProfile);

/**
 * @swagger
 * /api/academic/grades:
 *   get:
 *     summary: Get student grades
 *     tags: [Student/Parent - Academic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Grades retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/grades', authenticate, authorize('STUDENT', 'PARENT'), academicController.getGrades);

/**
 * @swagger
 * /api/academic/attendance:
 *   get:
 *     summary: Get student attendance records
 *     tags: [Student/Parent - Academic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attendance records retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/attendance', authenticate, authorize('STUDENT', 'PARENT'), academicController.getAttendance);

/**
 * @swagger
 * /api/academic/timetable:
 *   get:
 *     summary: Get class timetable
 *     tags: [Student/Parent - Academic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Timetable retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/timetable', authenticate, authorize('STUDENT', 'PARENT'), academicController.getTimetable);

/**
 * @swagger
 * /api/academic/records:
 *   get:
 *     summary: Get all academic records (grades, attendance, timetable)
 *     tags: [Student/Parent - Academic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Academic records retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/records', authenticate, authorize('STUDENT', 'PARENT'), academicController.getAcademicRecords);

/**
 * @swagger
 * /api/academic/statistics:
 *   get:
 *     summary: Get academic statistics (average grade, attendance rate, etc.)
 *     tags: [Student/Parent - Academic]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/statistics', authenticate, authorize('STUDENT', 'PARENT'), academicController.getAcademicStatistics);

export default router;
