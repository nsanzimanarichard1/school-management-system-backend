import prisma from '../config/database';

export class NotificationService {
  async create(userId: string, type: string, message: string) {
    return await prisma.notification.create({
      data: {
        userId,
        type: type as any,
        message
      }
    });
  }

  async getUnread(userId: string) {
    return await prisma.notification.findMany({
      where: {
        userId,
        read: false
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId
      },
      data: {
        read: true
      }
    });
  }

  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        read: false
      },
      data: {
        read: true
      }
    });
  }

  async getAll(userId: string) {
    return await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}

export default new NotificationService();
