import { Response, NextFunction } from 'express';
import { Notification } from './notification.model.js';
import { AuthenticatedRequest } from '../../types/index.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export async function getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false,
    });

    return sendSuccess(res, 'Notifications retrieved', {
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    if (id === 'all') {
      await Notification.updateMany({ userId: req.user?.userId }, { isRead: true });
    } else {
      await Notification.findByIdAndUpdate(id, { isRead: true });
    }
    return sendSuccess(res, 'Notification marked as read', null);
  } catch (error) {
    next(error);
  }
}
