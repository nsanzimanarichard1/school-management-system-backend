import prisma from '../config/database';

export class AcademicService {
  async getGrades(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        grades: {
          include: {
            subject: true
          },
          orderBy: {
            term: 'desc'
          }
        }
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return student.grades;
  }

  async getAttendance(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        attendance: {
          orderBy: {
            date: 'desc'
          },
          take: 30 // Last 30 records
        }
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return student.attendance;
  }

  async getTimetable(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: {
        class: {
          include: {
            timetable: {
              include: {
                subject: true,
                teacher: {
                  include: {
                    user: true
                  }
                }
              },
              orderBy: {
                day: 'asc'
              }
            }
          }
        }
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    if (!student.class) {
      return [];
    }

    return student.class.timetable;
  }

  async getAcademicRecords(userId: string) {
    const [grades, attendance, timetable] = await Promise.all([
      this.getGrades(userId),
      this.getAttendance(userId),
      this.getTimetable(userId)
    ]);

    return { grades, attendance, timetable };
  }
}

export default new AcademicService();
