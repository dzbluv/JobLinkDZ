# Backend Notifications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the frontend `NotificationContext` with a Supabase `notifications` table to persist application status and system notifications.

**Architecture:** A new `notifications` table will be created via SQL migration with appropriate RLS policies. The frontend `services/api.ts` will be extended with a `notificationsAPI` that handles CRUD operations. The existing React `NotificationContext` will be refactored to fetch and manage notifications via this new API instead of using in-memory state.

**Tech Stack:** React, TypeScript, Supabase Client

---

### Task 1: Create Database Migration for Notifications

**Files:**
- Create: `supabase/migrations/02_notifications.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- Migration: 02_notifications.sql

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  meta jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own notifications
DROP POLICY IF EXISTS "Users can view their own notifications." ON public.notifications;
CREATE POLICY "Users can view their own notifications." ON public.notifications 
FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own notifications (e.g. mark as read)
DROP POLICY IF EXISTS "Users can update their own notifications." ON public.notifications;
CREATE POLICY "Users can update their own notifications." ON public.notifications 
FOR UPDATE USING (auth.uid() = user_id);

-- Allow authenticated users to insert notifications (e.g., when a candidate applies)
DROP POLICY IF EXISTS "Users can insert notifications." ON public.notifications;
CREATE POLICY "Users can insert notifications." ON public.notifications 
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/02_notifications.sql
git commit -m "feat(db): add notifications table migration"
```

### Task 2: Implement API Service Layer

**Files:**
- Modify: `src/services/api.ts`

- [ ] **Step 1: Add Notification type and API to api.ts**

Append the following code to the end of `src/services/api.ts` (before the `seedDatabase` block, or update the imports if needed. `Notification` type from context will need to be defined here or imported). 

Since we can't easily rely on context type, add the `Notification` interface and `notificationsAPI` object before the `seedDatabase` block:

```typescript
// NOTIFICATIONS
export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  status: string;
  meta?: any;
  created_at: string;
}

export const notificationsAPI = {
  getByUserId: async (userId: string): Promise<NotificationData[]> => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as NotificationData[];
    } catch (e) {
      console.error("Error fetching notifications:", e);
      return [];
    }
  },
  create: async (payload: Omit<NotificationData, "id" | "created_at" | "status">): Promise<NotificationData | null> => {
    try {
      const { data, error } = await supabase
        .from("notifications")
        .insert({ ...payload, status: 'unread' })
        .select()
        .single();
      if (error) throw error;
      return data as NotificationData;
    } catch (e) {
      console.error("Error creating notification:", e);
      return null;
    }
  },
  markAsRead: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ status: 'read' })
        .eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("Error updating notification status:", e);
    }
  },
  markAllAsRead: async (userId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ status: 'read' })
        .eq("user_id", userId)
        .eq("status", "unread");
      if (error) throw error;
    } catch (e) {
      console.error("Error updating all notifications:", e);
    }
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/api.ts
git commit -m "feat(api): add notificationsAPI service"
```

### Task 3: Refactor NotificationContext

**Files:**
- Modify: `src/context/NotificationContext.tsx`

- [ ] **Step 1: Replace NotificationContext contents to integrate with the API**

Replace the entire contents of `src/context/NotificationContext.tsx`:

```tsx
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

    if (createdData) {
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
```

- [ ] **Step 2: Commit**

```bash
git add src/context/NotificationContext.tsx
git commit -m "refactor(context): link notifications to backend API"
```
