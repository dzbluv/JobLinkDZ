import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Notification {
  id: string;
  userId: string; // Target user
  title: string;
  message: string;
  type: 'application' | 'status_change' | 'system';
  status: 'unread' | 'read';
  createdAt: string;
  meta?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'status'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'status'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    
    setNotifications(prev => [newNotif, ...prev]);
    
    // Simulate Email Send
    console.log(`%c[EMAIL SENDING] To: ${notif.userId} | Subject: ${notif.title}`, "color: #6366f1; font-weight: bold; font-size: 12px;");
    console.log(`%cContent: ${notif.message}`, "color: #94a3b8; font-style: italic;");
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
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
