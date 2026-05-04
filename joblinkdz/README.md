# JobLinkDZ - Recruitment Platform

A modern recruitment platform demo built with React, Vite, and Tailwind CSS.

## 🚀 Built With
- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS 4.0 (with Glassmorphism)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router 7
- **Authentication**: Custom Mock context (Role-based)

## 📁 Project Structure
- `src/components`: Reusable UI elements, layout components, and specific job/dashboard cards.
- `src/context`: Authentication and Theme (Dark/Light) management.
- `src/data`: Mock datasets for Users, Jobs, and Applications.
- `src/pages`: 12+ unique pages covering Candidate and Admin flows.
- `src/lib`: Styling utilities.

## 🔑 Demo Access
### Candidate
- **Email**: `candidate@joblinkdz.com`
- **Password**: `password123`

### Admin / Recruiter
- **Email**: `admin@joblinkdz.com`
- **Password**: `admin123`

## 🛠️ Future Supabase Integration
This project is structured for easy migration to Supabase:
1. **Auth**: Replace `AuthContext` logic with `supabase.auth`.
2. **Database**: Replace mock data imports with real `useEffect` fetches from `supabase.from('jobs').select()`.
3. **Storage**: Integrate `supabase.storage` in the `FileUpload` component to handle real resume uploads.

## 📦 Run Locally
1. `npm install`
2. `npm run dev`
