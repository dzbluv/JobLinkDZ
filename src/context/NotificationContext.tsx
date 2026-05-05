import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationsAPI, type NotificationData } from '../services/api';
import { useAuth } from './AuthContext';

// Keep the frontend format consistent with existing usage
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'application' | 'status_change' | 'system';
  status: 'unread' | 'read';
  createdAt: string;
  meta?: any;
}

// Mapper from backend data to frontend Notification
const mapToFrontend = (data: NotificationData): Notification => ({
  id: data.id,
  userId: data.user_id,
  title: data.title,
  message: data.message,
  type: data.type as any,
  status: data.status as any,
  createdAt: data.created_at,
  meta: data.meta
});

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      notificationsAPI.getByUserId(user.id).then(data => {
        setNotifications(data.map(mapToFrontend));
      });
    } else {
      setNotifications([]);
    }
  }, [user?.id]);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const addNotification = async (notif: Omit<Notification, 'id' | 'createdAt' | 'status'>) => {
    const createdData = await notificationsAPI.create({
      user_id: notif.userId,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      meta: notif.meta
    });

    if (createdData && createdData.user_id === user?.id) {
      setNotifications(prev => [mapToFrontend(createdData), ...prev]);
    }
  };

  const markAsRead = async (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));
    await notificationsAPI.markAsRead(id);
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
    await notificationsAPI.markAllAsRead(user.id);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
