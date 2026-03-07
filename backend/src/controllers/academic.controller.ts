import { Response, NextFunction } from 'express';
import academicService from '../services/academic.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { GradeDTO, AttendanceDTO, TimetableDTO, AcademicRecordsDTO } from '../dtos/academic.dto';
import { asyncHandler } from '../middlewares/error.middleware';

export class AcademicController {
  getStudentProfile = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const profile = await academicService.getStudentProfile(req.userId!, req.user?.role);
    res.json({ success: true, data: profile });
  });

  getGrades = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const grades = await academicService.getGrades(req.userId!, req.user?.role);
    const response = grades.map(g => GradeDTO.fromGrade(g));
    res.json({ success: true, data: response });
  });

  getAttendance = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const attendance = await academicService.getAttendance(req.userId!, req.user?.role);
    const response = attendance.map(a => AttendanceDTO.fromAttendance(a));
    res.json({ success: true, data: response });
  });

  getTimetable = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const timetable = await academicService.getTimetable(req.userId!, req.user?.role);
    const response = timetable.map(t => TimetableDTO.fromTimetable(t));
    res.json({ success: true, data: response });
  });

  getAcademicRecords = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { grades, attendance, timetable } = await academicService.getAcademicRecords(req.userId!, req.user?.role);
    const response = AcademicRecordsDTO.create(grades, attendance, timetable);
    res.json({ success: true, data: response });
  });

  getAcademicStatistics = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const statistics = await academicService.getAcademicStatistics(req.userId!, req.user?.role);
    res.json({ success: true, data: statistics });
  });
}

export default new AcademicController();
