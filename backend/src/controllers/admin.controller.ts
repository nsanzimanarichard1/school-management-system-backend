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
}

export default new AdminController();
