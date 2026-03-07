import prisma from '../config/database';
import { hashPassword } from '../utils/hash';

export class UserManagementService {
  // ==================== CREATE USERS ====================
  
  async createTeacher(data: { name: string; email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashPassword(data.password),
        role: 'TEACHER',
        teacher: {
          create: {}
        }
      },
      include: {
        teacher: true
      }
    });

    return user;
  }

  async createStudent(data: { 
    name: string; 
    email: string; 
    password: string;
    parentId?: string;
    classId?: string;
  }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashPassword(data.password),
        role: 'STUDENT',
        student: {
          create: {
            parentId: data.parentId || null,
            classId: data.classId || null
          }
        }
      },
      include: {
        student: true
      }
    });

    // Create fee account for student
    await prisma.fee.create({
      data: {
        studentId: user.student!.id,
        balance: 0,
        lowBalanceThreshold: 1000
      }
    });

    return user;
  }

  async createParent(data: { name: string; email: string; password: string }) {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashPassword(data.password),
        role: 'PARENT',
        parent: {
          create: {}
        }
      },
      include: {
        parent: true
      }
    });

    return user;
  }

  // ==================== GET USERS ====================
  
  async getAllTeachers() {
    return await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            classes: true
          }
        }
      }
    });
  }

  async getAllStudents() {
    return await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        class: {
          select: {
            name: true
          }
        },
        parent: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });
  }

  async getAllParents() {
    return await prisma.parent.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
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

export default new UserManagementService();
