# Backend Notification Integration Design

## 1. Goal
Integrate the frontend `NotificationContext` with the Supabase backend to persist notifications for users. This ensures that notifications generated when a candidate applies for a job or a recruiter updates an application status are stored in the database and fetched when the user loads the application. No real-time updates are required; fetching on load is sufficient.

## 2. Architecture

### 2.1 Database Schema (Supabase)
We will introduce a new `notifications` table to store all notifications.
- **Table Name**: `public.notifications`
- **Columns**:
  - `id`: `uuid` (Primary Key, default `gen_random_uuid()`)
  - `user_id`: `uuid` (Foreign Key referencing `public.users.id` ON DELETE CASCADE)
  - `title`: `text` (Not Null)
  - `message`: `text` (Not Null)
  - `type`: `text` (Not Null, e.g., 'application', 'status_change', 'system')
  - `status`: `text` (Not Null, default 'unread')
  - `meta`: `jsonb` (Optional, for storing dynamic link context like `jobId`)
  - `created_at`: `timestamp with time zone` (Not Null, default `now()`)

### 2.2 Row Level Security (RLS)
The `notifications` table will have RLS enabled:
- **SELECT**: Users can only view notifications where `auth.uid() = user_id`.
- **UPDATE**: Users can only update notifications where `auth.uid() = user_id` (e.g., to mark as read).
- **INSERT**: Any authenticated user can insert notifications (to allow candidates to send notifications to recruiters, and vice-versa). 

### 2.3 API Service Layer
We will extend `src/services/api.ts` to include a `notificationsAPI` object containing the following asynchronous methods:
- `getByUserId(userId: string)`: Fetches all notifications for the given user, ordered by `created_at` descending.
- `create(notification)`: Inserts a new notification into the database.
- `markAsRead(id: string)`: Updates the status of a specific notification to 'read'.
- `markAllAsRead(userId: string)`: Updates all 'unread' notifications for the user to 'read'.

### 2.4 Frontend Context Integration
`src/context/NotificationContext.tsx` will be refactored:
- **Initialization**: Added a `useEffect` that triggers when the user logs in (`user.id` is available) to fetch existing notifications using `notificationsAPI.getByUserId`.
- **`addNotification`**: Will be updated to call `notificationsAPI.create` before updating local state.
- **`markAsRead`**: Will call `notificationsAPI.markAsRead` and update local state.
- **`markAllAsRead`**: Will call `notificationsAPI.markAllAsRead` and update local state.

## 3. Data Flow
1. **Triggering**: A component (e.g., `Apply.tsx` or `AdminApplications.tsx`) calls `addNotification` from the context.
2. **API Call**: The context executes `notificationsAPI.create` and awaits confirmation, then pushes the new notification to its local React state.
3. **Retrieval**: When a user logs in, `NotificationContext` retrieves all relevant notifications via `notificationsAPI.getByUserId` and populates the local state.
4. **Interaction**: When a user clicks a notification or "Mark all as read" in the UI, the context fires the respective update API method and syncs the UI immediately.

## 4. Error Handling
- The `notificationsAPI` methods will catch errors and log them to the console, similar to existing API objects.
- In case of a failure during `create`, `markAsRead`, or `markAllAsRead`, the system will gracefully log the error without breaking the user experience.

## 5. Testing
- Verify the new migration runs successfully against Supabase.
- Log in as a candidate and apply for a job; log in as the recruiter and verify the notification appears on load.
- Log in as a recruiter and change application status; log in as the candidate and verify the notification appears on load.
- Ensure marking notifications as read persists after refreshing the page.
