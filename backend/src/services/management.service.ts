import prisma from '../config/database';

export class ManagementService {
  // ==================== STUDENT MANAGEMENT ====================
  
  async assignStudentToClass(studentId: string, classId: string) {
    return await prisma.student.update({
      where: { id: studentId },
      data: { classId }
    });
  }

  async removeStudentFromClass(studentId: string) {
    return await prisma.student.update({
      where: { id: studentId },
      data: { classId: null }
    });
  }

  // ==================== TEACHER MANAGEMENT ====================
  
  async assignTeacherToClass(teacherId: string, classId: string) {
    return await prisma.class.update({
      where: { id: classId },
      data: { teacherId }
    });
  }

  // ==================== SUBJECT MANAGEMENT ====================
  
  async createSubject(name: string, code: string) {
    return await prisma.subject.create({
      data: { name, code }
    });
  }

  async getAllSubjects() {
    return await prisma.subject.findMany({
      include: {
        _count: {
          select: {
            grades: true,
            timetable: true
          }
        }
      }
    });
  }

  // ==================== CLASS MANAGEMENT ====================
  
  async createClass(name: string, teacherId?: string) {
    return await prisma.class.create({
      data: {
        name,
        teacherId: teacherId || null
      }
    });
  }

  // ==================== TIMETABLE MANAGEMENT ====================
  
  async createTimetable(data: {
    classId: string;
    subjectId: string;
    teacherId: string;
    day: string;
    startTime: string;
    endTime: string;
    room?: string;
  }) {
    return await prisma.timetable.create({
      data
    });
  }

  async updateTimetable(id: string, data: {
    day?: string;
    startTime?: string;
    endTime?: string;
    room?: string;
  }) {
    return await prisma.timetable.update({
      where: { id },
      data
    });
  }

  async deleteTimetable(id: string) {
    return await prisma.timetable.delete({
      where: { id }
    });
  }

  // ==================== GRADE MANAGEMENT ====================
  
  async createGrade(data: {
    studentId: string;
    subjectId: string;
    score: number;
    term: string;
  }, teacherId?: string) {
    // If teacher, validate they own the student's class
    if (teacherId) {
      const student = await prisma.student.findUnique({
        where: { id: data.studentId },
        include: { class: true }
      });
      if (!student?.class || student.class.teacherId !== teacherId) {
        throw new Error('You can only add grades to students in your class');
      }
    }
    return await prisma.grade.create({
      data
    });
  }

  async updateGrade(id: string, score: number, teacherId?: string) {
    // If teacher, validate ownership
    if (teacherId) {
      const grade = await prisma.grade.findUnique({
        where: { id },
        include: { student: { include: { class: true } } }
      });
      if (!grade?.student.class || grade.student.class.teacherId !== teacherId) {
        throw new Error('You can only update grades for students in your class');
      }
    }
    return await prisma.grade.update({
      where: { id },
      data: { score }
    });
  }

  async deleteGrade(id: string) {
    return await prisma.grade.delete({
      where: { id }
    });
  }

  async getGradesByClass(classId: string) {
    return await prisma.grade.findMany({
      where: {
        student: {
          classId
        }
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        subject: true
      }
    });
  }

  // ==================== ATTENDANCE MANAGEMENT ====================
  
  async createAttendance(data: {
    studentId: string;
    date: Date;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
  }, teacherId?: string) {
    // If teacher, validate they own the student's class
    if (teacherId) {
      const student = await prisma.student.findUnique({
        where: { id: data.studentId },
        include: { class: true }
      });
      if (!student?.class || student.class.teacherId !== teacherId) {
        throw new Error('You can only record attendance for students in your class');
      }
    }
    return await prisma.attendance.create({
      data
    });
  }

  async updateAttendance(id: string, status: 'PRESENT' | 'ABSENT' | 'LATE', teacherId?: string) {
    // If teacher, validate ownership
    if (teacherId) {
      const attendance = await prisma.attendance.findUnique({
        where: { id },
        include: { student: { include: { class: true } } }
      });
      if (!attendance?.student.class || attendance.student.class.teacherId !== teacherId) {
        throw new Error('You can only update attendance for students in your class');
      }
    }
    return await prisma.attendance.update({
      where: { id },
      data: { status }
    });
  }

  async getAttendanceByClass(classId: string, date?: Date) {
    const where: any = {
      student: {
        classId
      }
    };

    if (date) {
      where.date = date;
    }

    return await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
  }

  // ==================== BULK OPERATIONS ====================
  
  async bulkCreateAttendance(classId: string, date: Date, attendanceData: Array<{
    studentId: string;
    status: 'PRESENT' | 'ABSENT' | 'LATE';
  }>, teacherId?: string) {
    // If teacher, validate they own the class
    if (teacherId) {
      const classData = await prisma.class.findUnique({
        where: { id: classId }
      });
      if (!classData || classData.teacherId !== teacherId) {
        throw new Error('You can only record attendance for your own class');
      }
    }
    return await prisma.attendance.createMany({
      data: attendanceData.map(item => ({
        studentId: item.studentId,
        date,
        status: item.status
      })),
      skipDuplicates: true
    });
  }
}

export default new ManagementService();
