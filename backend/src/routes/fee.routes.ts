import { Router } from 'express';
import { body } from 'express-validator';
import feeController from '../controllers/fee.controller';
import { validate } from '../middlewares/validation.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/fees/deposit:
 *   post:
 *     summary: Deposit fee payment
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Deposit successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/deposit',
  authenticate,
  authorize('STUDENT', 'PARENT'),
  [
    body('amount').isFloat({ min: 0.01 }),
    body('description').optional().trim(),
    validate
  ],
  feeController.deposit
);

/**
 * @swagger
 * /api/fees/withdraw:
 *   post:
 *     summary: Request fee refund (requires admin approval)
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Withdrawal request created
 *       400:
 *         description: Insufficient balance or validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/withdraw',
  authenticate,
  authorize('STUDENT', 'PARENT'),
  [
    body('amount').isFloat({ min: 0.01 }),
    body('description').trim().notEmpty(),
    validate
  ],
  feeController.withdraw
);

/**
 * @swagger
 * /api/fees/balance:
 *   get:
 *     summary: Get current fee balance
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Balance retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/balance', authenticate, authorize('STUDENT', 'PARENT'), feeController.getBalance);

/**
 * @swagger
 * /api/fees/history:
 *   get:
 *     summary: Get transaction history
 *     tags: [Fees]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transaction history retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/history', authenticate, authorize('STUDENT', 'PARENT'), feeController.getHistory);

export default router;
