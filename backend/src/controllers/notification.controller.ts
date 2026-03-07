import { Response, NextFunction } from 'express';
import notificationService from '../services/notification.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { NotificationDTO, NotificationListDTO } from '../dtos/notification.dto';
import { asyncHandler } from '../middlewares/error.middleware';

export class NotificationController {
  getAll = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const notifications = await notificationService.getAll(req.userId!);
    const response = NotificationListDTO.create(notifications);
    res.json({ success: true, data: response });
  });

  getUnread = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const notifications = await notificationService.getUnread(req.userId!);
    const response = notifications.map(n => NotificationDTO.fromNotification(n));
    res.json({ success: true, data: response });
  });

  markAsRead = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    await notificationService.markAsRead(id, req.userId!);
    res.json({ success: true, message: 'Notification marked as read' });
  });

  markAllAsRead = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction) => {
    await notificationService.markAllAsRead(req.userId!);
    res.json({ success: true, message: 'All notifications marked as read' });
  });
}

export default new NotificationController();
