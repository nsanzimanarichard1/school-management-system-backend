import { Response, NextFunction } from 'express';
import userManagementService from '../services/user-management.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../middlewares/error.middleware';

export class UserManagementController {
  // Create Users
  createTeacher = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const teacher = await userManagementService.createTeacher({ name, email, password });
    res.status(201).json({ 
      success: true, 
      message: 'Teacher created successfully', 
      data: {
        userId: teacher.id,
        teacherId: teacher.teacher!.id,
        name: teacher.name,
        email: teacher.email
      }
    });
  });

  createStudent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, email, password, parentId, classId } = req.body;
    const student = await userManagementService.createStudent({ name, email, password, parentId, classId });
    res.status(201).json({ 
      success: true, 
      message: 'Student created successfully', 
      data: {
        userId: student.id,
        studentId: student.student!.id,
        name: student.name,
        email: student.email
      }
    });
  });

  createParent = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const parent = await userManagementService.createParent({ name, email, password });
    res.status(201).json({ 
      success: true, 
      message: 'Parent created successfully', 
      data: {
        userId: parent.id,
        parentId: parent.parent!.id,
        name: parent.name,
        email: parent.email
      }
    });
  });

  // Get Users
  getAllTeachers = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const teachers = await userManagementService.getAllTeachers();
    res.json({ success: true, data: teachers });
  });

  getAllStudents = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const students = await userManagementService.getAllStudents();
    res.json({ success: true, data: students });
  });

  getAllParents = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const parents = await userManagementService.getAllParents();
    res.json({ success: true, data: parents });
  });
}

export default new UserManagementController();
