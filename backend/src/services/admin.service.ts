import prisma from '../config/database';
import notificationService from './notification.service';

export class AdminService {
  // Verify device
  async verifyDevice(deviceId: string) {
    const device = await prisma.device.findFirst({
      where: { id: deviceId },
      include: { user: true }
    });

    if (!device) {
      throw new Error('Device not found');
    }

    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data: { verified: true }
    });

    // Send notification to user
    await notificationService.create(
      device.userId,
      'DEVICE_VERIFIED',
      'Your device has been verified by admin. You can now log in.'
    );

    return updatedDevice;
  }

  // Get pending devices
  async getPendingDevices() {
    return await prisma.device.findMany({
      where: { verified: false },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Approve/Reject withdrawal
  async processWithdrawal(transactionId: string, adminId: string, action: 'APPROVED' | 'REJECTED') {
    const transaction = await prisma.feeTransaction.findUnique({
      where: { id: transactionId },
      include: {
        fee: {
          include: {
            student: {
              include: { user: true }
            }
          }
        }
      }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.type !== 'WITHDRAW') {
      throw new Error('Only withdrawal requests can be processed');
    }

    if (transaction.status !== 'PENDING') {
      throw new Error('Transaction already processed');
    }

    // Update transaction
    const updated = await prisma.feeTransaction.update({
      where: { id: transactionId },
      data: {
        status: action,
        processedBy: adminId,
        processedAt: new Date()
      }
    });

    // If approved, deduct balance
    if (action === 'APPROVED') {
      await prisma.fee.update({
        where: { id: transaction.feeId },
        data: {
          balance: {
            decrement: transaction.amount
          }
        }
      });
    }

    // Send notification
    await notificationService.create(
      transaction.fee.student.userId,
      'REFUND_STATUS',
      action === 'APPROVED'
        ? `Your refund request of $${transaction.amount} has been approved.`
        : `Your refund request of $${transaction.amount} has been rejected.`
    );

    return updated;
  }

  // Get pending withdrawals
  async getPendingWithdrawals() {
    return await prisma.feeTransaction.findMany({
      where: {
        type: 'WITHDRAW',
        status: 'PENDING'
      },
      include: {
        fee: {
          include: {
            student: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Dashboard statistics
  async getDashboardStats() {
    const [totalStudents, totalTeachers, totalParents, totalClasses, feeStats, pendingWithdrawals, totalAttendance] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.class.count(),
      prisma.fee.aggregate({ 
        _sum: { balance: true },
        _avg: { balance: true }
      }),
      prisma.feeTransaction.count({ where: { type: 'WITHDRAW', status: 'PENDING' } }),
      prisma.attendance.groupBy({
        by: ['status'],
        _count: true
      })
    ]);

    // Calculate attendance rate
    const totalAttendanceRecords = totalAttendance.reduce((sum, record) => sum + record._count, 0);
    const presentCount = totalAttendance.find(r => r.status === 'PRESENT')?._count || 0;
    const attendanceRate = totalAttendanceRecords > 0 
      ? ((presentCount / totalAttendanceRecords) * 100).toFixed(2)
      : '0.00';

    // Get total fees collected
    const completedDeposits = await prisma.feeTransaction.aggregate({
      where: {
        type: 'DEPOSIT',
        status: 'COMPLETED'
      },
      _sum: { amount: true }
    });

    return {
      totalStudents,
      totalTeachers,
      totalParents,
      totalClasses,
      totalFeeBalance: feeStats._sum.balance || 0,
      averageFeeBalance: feeStats._avg.balance || 0,
      totalFeesCollected: completedDeposits._sum.amount || 0,
      pendingWithdrawals,
      attendanceRate: `${attendanceRate}%`,
      attendanceBreakdown: {
        present: totalAttendance.find(r => r.status === 'PRESENT')?._count || 0,
        absent: totalAttendance.find(r => r.status === 'ABSENT')?._count || 0,
        late: totalAttendance.find(r => r.status === 'LATE')?._count || 0
      }
    };
  }

  // Get all students
  async getAllStudents() {
    return await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        },
        class: true,
        parent: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        fee: true
      }
    });
  }

  // Get all teachers
  async getAllTeachers() {
    return await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
          }
        },
        classes: true
      }
    });
  }

  // Get all classes
  async getAllClasses() {
    return await prisma.class.findMany({
      include: {
        teacher: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        students: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        _count: {
          select: {
            students: true
          }
        }
      }
    });
  }
}

export default new AdminService();
