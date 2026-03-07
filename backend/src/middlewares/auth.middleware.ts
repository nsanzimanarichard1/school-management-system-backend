import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import prisma from '../config/database';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  deviceId?: string;
  user?: {
    role: string;
    teacherId?: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    // Check if device is verified
    const device = await prisma.device.findFirst({
      where: {
        userId: decoded.userId,
        deviceId: decoded.deviceId
      }
    });

    if (!device) {
      res.status(403).json({ error: 'Device not found' });
      return;
    }

    if (!device.verified) {
      res.status(403).json({ error: 'Device not verified by admin' });
      return;
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    req.deviceId = decoded.deviceId;
    req.user = { role: decoded.role };

    // If teacher, get teacherId
    if (decoded.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({
        where: { userId: decoded.userId }
      });
      if (teacher) {
        req.user.teacherId = teacher.id;
      }
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }
    next();
  };
};
