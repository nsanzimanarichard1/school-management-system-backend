import { Router } from 'express';
import { body } from 'express-validator';
import adminController from '../controllers/admin.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/admin/devices/pending:
 *   get:
 *     summary: Get pending device verifications
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 *     tags: [Admin]
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
 * /api/admin/students:
 *   get:
 *     summary: Get all students
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Students retrieved
 */
router.get('/students', authenticate, authorize('ADMIN'), adminController.getAllStudents);

/**
 * @swagger
 * /api/admin/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Teachers retrieved
 */
router.get('/teachers', authenticate, authorize('ADMIN'), adminController.getAllTeachers);

/**
 * @swagger
 * /api/admin/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Classes retrieved
 */
router.get('/classes', authenticate, authorize('ADMIN'), adminController.getAllClasses);

export default router;
