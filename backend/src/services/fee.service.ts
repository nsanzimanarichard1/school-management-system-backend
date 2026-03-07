import prisma from '../config/database';
import { DepositInputDTO, WithdrawInputDTO } from '../dtos/fee.dto';
import notificationService from './notification.service';

export class FeeService {
  async deposit(userId: string, data: DepositInputDTO) {
    // Get student
    const student = await prisma.student.findUnique({
      where: { userId },
      include: { fee: true }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    if (!student.fee) {
      throw new Error('Fee account not found');
    }

    // Create transaction with COMPLETED status
    const transaction = await prisma.feeTransaction.create({
      data: {
        feeId: student.fee.id,
        type: 'DEPOSIT',
        amount: data.amount,
        status: 'COMPLETED',
        description: data.description || 'Fee deposit'
      }
    });

    // Update balance
    const updatedFee = await prisma.fee.update({
      where: { id: student.fee.id },
      data: {
        balance: {
          increment: data.amount
        }
      }
    });

    // Send payment confirmation notification
    await notificationService.create(
      userId,
      'PAYMENT_CONFIRMATION',
      `Payment of $${data.amount} received successfully. New balance: $${updatedFee.balance}`
    );

    return transaction;
  }

  async withdraw(userId: string, data: WithdrawInputDTO) {
    // Get student
    const student = await prisma.student.findUnique({
      where: { userId },
      include: { fee: true }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    if (!student.fee) {
      throw new Error('Fee account not found');
    }

    // Check balance
    if (student.fee.balance < data.amount) {
      throw new Error('Insufficient balance');
    }

    // Create transaction with PENDING status (requires admin approval)
    const transaction = await prisma.feeTransaction.create({
      data: {
        feeId: student.fee.id,
        type: 'WITHDRAW',
        amount: data.amount,
        status: 'PENDING',
        description: data.description
      }
    });

    // Send refund request notification
    await notificationService.create(
      userId,
      'REFUND_STATUS',
      `Refund request of $${data.amount} submitted. Waiting for admin approval.`
    );

    return transaction;
  }

  async getBalance(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        fee: true,
        user: true
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    if (!student.fee) {
      throw new Error('Fee account not found');
    }

    // Check for low balance and send notification
    if (student.fee.balance < student.fee.lowBalanceThreshold) {
      const existingNotification = await prisma.notification.findFirst({
        where: {
          userId,
          type: 'LOW_BALANCE',
          read: false,
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
          }
        }
      });

      if (!existingNotification) {
        await notificationService.create(
          userId,
          'LOW_BALANCE',
          `Your fee balance ($${student.fee.balance}) is below the threshold ($${student.fee.lowBalanceThreshold}). Please top up soon.`
        );
      }
    }

    return {
      balance: student.fee.balance,
      studentName: student.user.name,
      lowBalanceThreshold: student.fee.lowBalanceThreshold,
      isLowBalance: student.fee.balance < student.fee.lowBalanceThreshold
    };
  }

  async getTransactionHistory(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        fee: {
          include: {
            transactions: {
              orderBy: {
                createdAt: 'desc'
              }
            }
          }
        }
      }
    });

    if (!student || !student.fee) {
      throw new Error('Student or fee account not found');
    }

    return student.fee.transactions;
  }

  async updateLowBalanceThreshold(userId: string, threshold: number) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: { fee: true }
    });

    if (!student || !student.fee) {
      throw new Error('Student or fee account not found');
    }

    return await prisma.fee.update({
      where: { id: student.fee.id },
      data: { lowBalanceThreshold: threshold }
    });
  }
}

export default new FeeService();
