import prisma from '../config/database';

export class AcademicService {
  async getStudentProfile(userId: string, role?: string) {
    // If parent, get first child's profile
    let studentUserId = userId;
    if (role === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: { students: { take: 1 } }
      });
      if (!parent || parent.students.length === 0) {
        throw new Error('No students found for this parent');
      }
      studentUserId = parent.students[0].userId;
    }

    const student = await prisma.student.findUnique({
      where: { userId: studentUserId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        class: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            },
            timetable: {
              include: {
                subject: true
              },
              distinct: ['subjectId']
            },
            _count: {
              select: {
                students: true
              }
            }
          }
        }
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Extract unique subjects from timetable
    const subjects = student.class?.timetable.map(t => t.subject) || [];

    return {
      id: student.id,
      user: student.user,
      class: student.class ? {
        id: student.class.id,
        name: student.class.name,
        teacher: student.class.teacher ? {
          name: student.class.teacher.user.name,
          email: student.class.teacher.user.email
        } : null,
        totalStudents: student.class._count.students
      } : null,
      subjects
    };
  }

  async getGrades(userId: string, role?: string) {
    let studentUserId = userId;
    if (role === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: { students: { take: 1 } }
      });
      if (!parent || parent.students.length === 0) {
        throw new Error('No students found for this parent');
      }
      studentUserId = parent.students[0].userId;
    }

    const student = await prisma.student.findUnique({
      where: { userId: studentUserId },
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

  async getAttendance(userId: string, role?: string) {
    let studentUserId = userId;
    if (role === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: { students: { take: 1 } }
      });
      if (!parent || parent.students.length === 0) {
        throw new Error('No students found for this parent');
      }
      studentUserId = parent.students[0].userId;
    }

    const student = await prisma.student.findUnique({
      where: { userId: studentUserId },
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

  async getTimetable(userId: string, role?: string) {
    let studentUserId = userId;
    if (role === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: { students: { take: 1 } }
      });
      if (!parent || parent.students.length === 0) {
        throw new Error('No students found for this parent');
      }
      studentUserId = parent.students[0].userId;
    }

    const student = await prisma.student.findUnique({
      where: { userId: studentUserId },
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

  async getAcademicRecords(userId: string, role?: string) {
    const [grades, attendance, timetable] = await Promise.all([
      this.getGrades(userId, role),
      this.getAttendance(userId, role),
      this.getTimetable(userId, role)
    ]);

    return { grades, attendance, timetable };
  }

  async getAcademicStatistics(userId: string, role?: string) {
    let studentUserId = userId;
    if (role === 'PARENT') {
      const parent = await prisma.parent.findUnique({
        where: { userId },
        include: { students: { take: 1 } }
      });
      if (!parent || parent.students.length === 0) {
        throw new Error('No students found for this parent');
      }
      studentUserId = parent.students[0].userId;
    }

    const student = await prisma.student.findUnique({
      where: { userId: studentUserId },
      include: {
        grades: {
          include: { subject: true }
        },
        attendance: true
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Grade statistics
    const grades = student.grades;
    const totalGrades = grades.length;
    const averageScore = totalGrades > 0 
      ? grades.reduce((sum, g) => sum + g.score, 0) / totalGrades 
      : 0;
    const highestGrade = totalGrades > 0 
      ? grades.reduce((max, g) => g.score > max.score ? g : max) 
      : null;
    const lowestGrade = totalGrades > 0 
      ? grades.reduce((min, g) => g.score < min.score ? g : min) 
      : null;

    // Attendance statistics
    const attendance = student.attendance;
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'PRESENT').length;
    const absentDays = attendance.filter(a => a.status === 'ABSENT').length;
    const lateDays = attendance.filter(a => a.status === 'LATE').length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      grades: {
        total: totalGrades,
        average: Math.round(averageScore * 10) / 10,
        highest: highestGrade ? {
          subject: highestGrade.subject.name,
          score: highestGrade.score
        } : null,
        lowest: lowestGrade ? {
          subject: lowestGrade.subject.name,
          score: lowestGrade.score
        } : null
      },
      attendance: {
        totalDays,
        present: presentDays,
        absent: absentDays,
        late: lateDays,
        rate: Math.round(attendanceRate * 10) / 10
      }
    };
  }
}

export default new AcademicService();
