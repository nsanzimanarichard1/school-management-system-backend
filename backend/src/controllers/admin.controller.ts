import { Response, NextFunction } from 'express';
import adminService from '../services/admin.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/error.middleware';

export class AdminController {
  verifyDevice = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { deviceId } = req.body;
    const device = await adminService.verifyDevice(deviceId);
    res.json({ success: true, message: 'Device verified successfully', data: device });
  });

  getPendingDevices = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const devices = await adminService.getPendingDevices();
    res.json({ success: true, data: devices });
  });

  processWithdrawal = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { transactionId, action } = req.body;
    const transaction = await adminService.processWithdrawal(transactionId, req.userId!, action);
    res.json({ success: true, message: `Withdrawal ${action.toLowerCase()}`, data: transaction });
  });

  getPendingWithdrawals = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const withdrawals = await adminService.getPendingWithdrawals();
    res.json({ success: true, data: withdrawals });
  });

  getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const stats = await adminService.getDashboardStats();
    res.json({ success: true, data: stats });
  });

  getAllStudents = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const students = await adminService.getAllStudents();
    res.json({ success: true, data: students });
  });

  getAllTeachers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const teachers = await adminService.getAllTeachers();
    res.json({ success: true, data: teachers });
  });

  getAllClasses = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const classes = await adminService.getAllClasses();
    res.json({ success: true, data: classes });
  });

  getAllUsers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const users = await adminService.getAllUsers();
    res.json({ success: true, data: users });
  });

  verifyUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await adminService.verifyUser(id);
    res.json({ success: true, message: 'User verified successfully', data: user });
  });

  deleteUser = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await adminService.deleteUser(id);
    res.json({ success: true, message: 'User deleted successfully' });
  });

  deleteClass = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await adminService.deleteClass(id);
    res.json({ success: true, message: 'Class deleted successfully' });
  });

  getAllGrades = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const grades = await adminService.getAllGrades();
    res.json({ success: true, data: grades });
  });

  getAllAttendance = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const attendance = await adminService.getAllAttendance();
    res.json({ success: true, data: attendance });
  });

  getAllTimetable = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const timetable = await adminService.getAllTimetable();
    res.json({ success: true, data: timetable });
  });

  deleteSubject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await adminService.deleteSubject(id);
    res.json({ success: true, message: 'Subject deleted successfully' });
  });

  updateTeacher = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const teacher = await adminService.updateTeacher(id, req.body);
    res.json({ success: true, message: 'Teacher updated successfully', data: teacher });
  });

  deleteTeacher = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await adminService.deleteTeacher(id);
    res.json({ success: true, message: 'Teacher deleted successfully' });
  });

  updateStudent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const student = await adminService.updateStudent(id, req.body);
    res.json({ success: true, message: 'Student updated successfully', data: student });
  });

  deleteStudent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await adminService.deleteStudent(id);
    res.json({ success: true, message: 'Student deleted successfully' });
  });

  updateParent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const parent = await adminService.updateParent(id, req.body);
    res.json({ success: true, message: 'Parent updated successfully', data: parent });
  });

  deleteParent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await adminService.deleteParent(id);
    res.json({ success: true, message: 'Parent deleted successfully' });
  });

  updateSubject = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const subject = await adminService.updateSubject(id, req.body);
    res.json({ success: true, message: 'Subject updated successfully', data: subject });
  });

  updateClass = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const classData = await adminService.updateClass(id, req.body);
    res.json({ success: true, message: 'Class updated successfully', data: classData });
  });

  deleteAttendance = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await adminService.deleteAttendance(id);
    res.json({ success: true, message: 'Attendance deleted successfully' });
  });
}

export default new AdminController();
