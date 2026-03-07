import { Response, NextFunction } from 'express';
import managementService from '../services/management.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/error.middleware';

export class ManagementController {
  // Student Management
  assignStudentToClass = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { studentId, classId } = req.body;
    const student = await managementService.assignStudentToClass(studentId, classId);
    res.json({ success: true, message: 'Student assigned to class', data: student });
  });

  removeStudentFromClass = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { studentId } = req.body;
    const student = await managementService.removeStudentFromClass(studentId);
    res.json({ success: true, message: 'Student removed from class', data: student });
  });

  // Teacher Management
  assignTeacherToClass = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { teacherId, classId } = req.body;
    const classData = await managementService.assignTeacherToClass(teacherId, classId);
    res.json({ success: true, message: 'Teacher assigned to class', data: classData });
  });

  // Subject Management
  createSubject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, code } = req.body;
    const subject = await managementService.createSubject(name, code);
    res.status(201).json({ success: true, message: 'Subject created', data: subject });
  });

  getAllSubjects = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const subjects = await managementService.getAllSubjects();
    res.json({ success: true, data: subjects });
  });

  // Class Management
  createClass = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, teacherId } = req.body;
    const classData = await managementService.createClass(name, teacherId);
    res.status(201).json({ success: true, message: 'Class created', data: classData });
  });

  // Timetable Management
  createTimetable = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const timetable = await managementService.createTimetable(req.body);
    res.status(201).json({ success: true, message: 'Timetable entry created', data: timetable });
  });

  updateTimetable = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const timetable = await managementService.updateTimetable(id, req.body);
    res.json({ success: true, message: 'Timetable updated', data: timetable });
  });

  deleteTimetable = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await managementService.deleteTimetable(id);
    res.json({ success: true, message: 'Timetable entry deleted' });
  });

  // Grade Management
  createGrade = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const teacherId = req.user?.role === 'TEACHER' ? req.user.teacherId : undefined;
    const grade = await managementService.createGrade(req.body, teacherId);
    res.status(201).json({ success: true, message: 'Grade created', data: grade });
  });

  updateGrade = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { score } = req.body;
    const teacherId = req.user?.role === 'TEACHER' ? req.user.teacherId : undefined;
    const grade = await managementService.updateGrade(id, score, teacherId);
    res.json({ success: true, message: 'Grade updated', data: grade });
  });

  deleteGrade = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await managementService.deleteGrade(id);
    res.json({ success: true, message: 'Grade deleted' });
  });

  getGradesByClass = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { classId } = req.params;
    const grades = await managementService.getGradesByClass(classId);
    res.json({ success: true, data: grades });
  });

  // Attendance Management
  createAttendance = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const teacherId = req.user?.role === 'TEACHER' ? req.user.teacherId : undefined;
    const attendance = await managementService.createAttendance(req.body, teacherId);
    res.status(201).json({ success: true, message: 'Attendance recorded', data: attendance });
  });

  updateAttendance = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { status } = req.body;
    const teacherId = req.user?.role === 'TEACHER' ? req.user.teacherId : undefined;
    const attendance = await managementService.updateAttendance(id, status, teacherId);
    res.json({ success: true, message: 'Attendance updated', data: attendance });
  });

  getAttendanceByClass = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { classId } = req.params;
    const { date } = req.query;
    const attendance = await managementService.getAttendanceByClass(
      classId,
      date ? new Date(date as string) : undefined
    );
    res.json({ success: true, data: attendance });
  });

  bulkCreateAttendance = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { classId, date, attendanceData } = req.body;
    const teacherId = req.user?.role === 'TEACHER' ? req.user.teacherId : undefined;
    const result = await managementService.bulkCreateAttendance(classId, new Date(date), attendanceData, teacherId);
    res.status(201).json({ success: true, message: 'Bulk attendance recorded', data: result });
  });
}

export default new ManagementController();
