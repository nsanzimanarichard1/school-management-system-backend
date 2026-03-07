import { Grade, Attendance, Timetable, Subject, Teacher, User } from '@prisma/client';

// OUTPUT DTOs
export class GradeDTO {
  id: string;
  subjectName: string;
  subjectCode: string;
  score: number;
  term: string;

  static fromGrade(grade: Grade & { subject: Subject }): GradeDTO {
    return {
      id: grade.id,
      subjectName: grade.subject.name,
      subjectCode: grade.subject.code,
      score: grade.score,
      term: grade.term
    };
  }
}

export class AttendanceDTO {
  id: string;
  date: Date;
  status: string;

  static fromAttendance(attendance: Attendance): AttendanceDTO {
    return {
      id: attendance.id,
      date: attendance.date,
      status: attendance.status
    };
  }
}

export class TimetableDTO {
  id: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  day: string;
  startTime: string;
  endTime: string;
  room?: string;

  static fromTimetable(timetable: Timetable & { subject: Subject; teacher: Teacher & { user: User } }): TimetableDTO {
    return {
      id: timetable.id,
      subjectName: timetable.subject.name,
      subjectCode: timetable.subject.code,
      teacherName: timetable.teacher.user.name,
      day: timetable.day,
      startTime: timetable.startTime,
      endTime: timetable.endTime,
      room: timetable.room || undefined
    };
  }
}

export class AcademicRecordsDTO {
  grades: GradeDTO[];
  attendance: AttendanceDTO[];
  timetable: TimetableDTO[];

  static create(
    grades: (Grade & { subject: Subject })[],
    attendance: Attendance[],
    timetable: (Timetable & { subject: Subject; teacher: Teacher & { user: User } })[]
  ): AcademicRecordsDTO {
    return {
      grades: grades.map(g => GradeDTO.fromGrade(g)),
      attendance: attendance.map(a => AttendanceDTO.fromAttendance(a)),
      timetable: timetable.map(t => TimetableDTO.fromTimetable(t))
    };
  }
}
