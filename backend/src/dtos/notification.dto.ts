import { Notification } from '@prisma/client';

export class NotificationDTO {
  id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;

  static fromNotification(notification: Notification): NotificationDTO {
    return {
      id: notification.id,
      type: notification.type,
      message: notification.message,
      read: notification.read,
      createdAt: notification.createdAt
    };
  }
}

export class NotificationListDTO {
  notifications: NotificationDTO[];
  unreadCount: number;

  static create(notifications: Notification[]): NotificationListDTO {
    return {
      notifications: notifications.map(n => NotificationDTO.fromNotification(n)),
      unreadCount: notifications.filter(n => !n.read).length
    };
  }
}
