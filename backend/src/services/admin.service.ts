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

  // Get all users
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        devices: {
          select: {
            verified: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Verify user (verify all their devices)
  async verifyUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    await prisma.device.updateMany({
      where: { userId },
      data: { verified: true }
    });

    await notificationService.create(
      userId,
      'ACCOUNT_VERIFIED',
      'Your account has been verified by admin. You can now access all features.'
    );

    return user;
  }

  // Delete user
  async deleteUser(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // Delete related records based on role
    if (user.role === 'STUDENT') {
      await prisma.student.deleteMany({ where: { userId } });
    } else if (user.role === 'TEACHER') {
      await prisma.teacher.deleteMany({ where: { userId } });
    } else if (user.role === 'PARENT') {
      await prisma.parent.deleteMany({ where: { userId } });
    }

    await prisma.user.delete({ where: { id: userId } });
  }

  // Delete class
  async deleteClass(classId: string) {
    const classExists = await prisma.class.findUnique({ where: { id: classId } });
    if (!classExists) throw new Error('Class not found');

    await prisma.class.delete({ where: { id: classId } });
  }

  // Get all grades
  async getAllGrades() {
    return await prisma.grade.findMany({
      include: {
        student: {
          include: {
            user: {
              select: { name: true, email: true }
            },
            class: {
              select: { name: true }
            }
          }
        },
        subject: {
          select: { name: true, code: true }
        }
      },
      orderBy: { term: 'desc' }
    });
  }

  // Get all attendance
  async getAllAttendance() {
    return await prisma.attendance.findMany({
      include: {
        student: {
          include: {
            user: {
              select: { name: true, email: true }
            },
            class: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });
  }

  // Get all timetable
  async getAllTimetable() {
    return await prisma.timetable.findMany({
      include: {
        class: {
          select: { name: true }
        },
        subject: {
          select: { name: true, code: true }
        },
        teacher: {
          include: {
            user: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: [{ day: 'asc' }, { startTime: 'asc' }]
    });
  }

  // Delete subject
  async deleteSubject(subjectId: string) {
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) throw new Error('Subject not found');

    await prisma.subject.delete({ where: { id: subjectId } });
  }

  // Update teacher
  async updateTeacher(teacherId: string, data: any) {
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId }, include: { user: true } });
    if (!teacher) throw new Error('Teacher not found');

    if (data.name || data.email) {
      await prisma.user.update({
        where: { id: teacher.userId },
        data: { name: data.name, email: data.email }
      });
    }

    return await prisma.teacher.findUnique({ where: { id: teacherId }, include: { user: true } });
  }

  // Delete teacher
  async deleteTeacher(teacherId: string) {
    const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
    if (!teacher) throw new Error('Teacher not found');

    await prisma.teacher.delete({ where: { id: teacherId } });
    await prisma.user.delete({ where: { id: teacher.userId } });
  }

  // Update student
  async updateStudent(studentId: string, data: any) {
    const student = await prisma.student.findUnique({ where: { id: studentId }, include: { user: true } });
    if (!student) throw new Error('Student not found');

    if (data.name || data.email) {
      await prisma.user.update({
        where: { id: student.userId },
        data: { name: data.name, email: data.email }
      });
    }

    if (data.classId) {
      await prisma.student.update({
        where: { id: studentId },
        data: { classId: data.classId }
      });
    }

    return await prisma.student.findUnique({ where: { id: studentId }, include: { user: true, class: true } });
  }

  // Delete student
  async deleteStudent(studentId: string) {
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) throw new Error('Student not found');

    await prisma.student.delete({ where: { id: studentId } });
    await prisma.user.delete({ where: { id: student.userId } });
  }

  // Update parent
  async updateParent(parentId: string, data: any) {
    const parent = await prisma.parent.findUnique({ where: { id: parentId }, include: { user: true } });
    if (!parent) throw new Error('Parent not found');

    if (data.name || data.email) {
      await prisma.user.update({
        where: { id: parent.userId },
        data: { name: data.name, email: data.email }
      });
    }

    return await prisma.parent.findUnique({ where: { id: parentId }, include: { user: true } });
  }

  // Delete parent
  async deleteParent(parentId: string) {
    const parent = await prisma.parent.findUnique({ where: { id: parentId } });
    if (!parent) throw new Error('Parent not found');

    await prisma.parent.delete({ where: { id: parentId } });
    await prisma.user.delete({ where: { id: parent.userId } });
  }

  // Update subject
  async updateSubject(subjectId: string, data: any) {
    const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
    if (!subject) throw new Error('Subject not found');

    return await prisma.subject.update({
      where: { id: subjectId },
      data: { name: data.name, code: data.code }
    });
  }

  // Update class
  async updateClass(classId: string, data: any) {
    const classExists = await prisma.class.findUnique({ where: { id: classId } });
    if (!classExists) throw new Error('Class not found');

    return await prisma.class.update({
      where: { id: classId },
      data: { name: data.name, teacherId: data.teacherId }
    });
  }

  // Delete attendance
  async deleteAttendance(attendanceId: string) {
    const attendance = await prisma.attendance.findUnique({ where: { id: attendanceId } });
    if (!attendance) throw new Error('Attendance not found');

    await prisma.attendance.delete({ where: { id: attendanceId } });
  }
}

export default new AdminService();
