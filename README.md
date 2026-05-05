<p align="center">
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
</p>

<h1 align="center">🇩🇿 JobLinkDZ</h1>

<p align="center">
  <strong>Algeria's Modern Job Recruitment Platform</strong><br/>
  A full-stack web application connecting job seekers with recruiters across Algeria — featuring real-time job listings, application tracking, company profiles, and a glassmorphic design system.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-database-schema">Database</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## 📸 Overview

JobLinkDZ is a recruitment platform tailored for the Algerian job market. It provides two distinct experiences:

- **Candidates** can browse job listings, apply with resumes and cover letters, track application statuses, save favorite jobs, and manage their professional profile.
- **Recruiters (Admin)** can post job vacancies, manage their company profile, review incoming applications with detailed candidate information, and control application pipelines through a dedicated admin dashboard.

The platform features a premium glassmorphic UI with dark/light theme support, smooth page transitions, and full internationalization (English, French, Arabic).

---

## ✨ Features

### 🔍 For Candidates
- **Job Discovery** — Browse, search, and filter jobs by type, salary range, company size, industry, and required skills
- **Job Application** — Apply to positions with resume upload (Supabase Storage) and cover letter
- **Application Tracking** — Monitor the status of all submitted applications (Pending → Reviewed → Accepted/Rejected)
- **Favorites** — Save interesting job listings for later review
- **Profile Management** — Build a professional profile with bio, skills, social links (GitHub, LinkedIn, Portfolio)
- **Job Alerts** — Create custom alerts based on search criteria to be notified of new matches
- **Company Profiles** — View detailed company information, follow companies, and explore their open positions

### 🏢 For Recruiters
- **Admin Dashboard** — Overview of total jobs posted, applications received, and pipeline analytics
- **Job Management** — Create, edit, and delete job postings with full details (requirements, responsibilities, skills, salary)
- **Application Pipeline** — Review applications with candidate details, update statuses, view resumes and cover letters
- **Company Settings** — Manage company profile, logo, industry, and description

### 🌐 Platform-Wide
- **Authentication** — Secure email/password authentication via Supabase Auth with role-based access control
- **Dark / Light Theme** — System-aware theming with manual toggle, persistent across sessions
- **Internationalization (i18n)** — Full support for English, French, and Arabic via `react-i18next`
- **Responsive Design** — Mobile-first layouts that adapt from phone to desktop
- **Animated Page Transitions** — Smooth route transitions powered by Motion (Framer Motion)
- **Glassmorphic Design System** — Custom glass cards, frosted backgrounds, gradient accents, and micro-animations
- **Protected Routes** — Role-based route guards (candidate-only, admin-only) with access denied handling
- **Password Recovery** — Forgot password flow with email reset via Supabase

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Vite 6** | Build tool & dev server with HMR |
| **Tailwind CSS 4** | Utility-first styling via `@tailwindcss/vite` plugin |
| **Motion (Framer Motion)** | Page transitions & micro-animations |
| **React Router DOM v7** | Client-side routing with animated transitions |
| **Lucide React** | Icon library (500+ icons) |
| **react-i18next / i18next** | Internationalization (EN / FR / AR) |
| **clsx + tailwind-merge** | Conditional class merging utility |

### Backend
| Technology | Purpose |
|---|---|
| **Supabase** | PostgreSQL database, Auth, Storage, and Row-Level Security |
| **Express.js** | Lightweight API server for admin operations |
| **Node.js** | Server runtime |
| **dotenv** | Environment variable management |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Vercel** | Frontend hosting & deployment |
| **Supabase Cloud** | Database, Auth, and File Storage hosting |
| **Nodemon** | Development auto-reload for Express server |
| **Concurrently** | Run Vite + Express dev servers simultaneously |

---

## 📁 Project Structure

```
JobLinkDZ/
├── public/                     # Static assets (favicon)
├── server/                     # Express.js backend
│   ├── src/
│   │   ├── index.js            # Server entry point (port 4000)
│   │   └── routes/
│   │       ├── adminAuth.js    # Admin user creation endpoint
│   │       └── users.js        # User management routes
│   └── package.json
├── src/                        # React frontend source
│   ├── components/
│   │   ├── admin/              # Admin-specific components
│   │   │   └── ApplicationDetailsModal.tsx
│   │   ├── dashboard/          # Dashboard cards & widgets
│   │   │   └── Cards.tsx       # JobCard, StatCard components
│   │   ├── layout/             # App shell components
│   │   │   ├── Navbar.tsx      # Navigation bar + Footer
│   │   │   └── ProtectedRoute.tsx
│   │   └── ui/                 # Reusable UI primitives
│   │       ├── Avatar.tsx      # Color-coded avatar system
│   │       ├── Breadcrumbs.tsx
│   │       ├── Button.tsx      # Variant-based button
│   │       ├── FileUpload.tsx  # Drag & drop file upload
│   │       ├── InteractiveCircles.tsx  # Hero animation
│   │       └── Shared.tsx      # GlassCard, Input, Badge
│   ├── context/                # React Context providers
│   │   ├── AuthContext.tsx     # Authentication state & methods
│   │   ├── JobAlertContext.tsx # Job alert preferences
│   │   ├── LanguageContext.tsx # i18n language switching
│   │   ├── NotificationContext.tsx
│   │   ├── ThemeContext.tsx    # Dark/Light mode
│   │   └── UserPreferencesContext.tsx  # Favorites, follows
│   ├── data/                   # Type definitions & mock data
│   │   ├── mockJobs.ts         # JobOffer interface + seed data
│   │   └── mockCompanies.ts    # Company interface + seed data
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client initialization
│   │   └── utils.ts            # cn() class merge utility
│   ├── pages/                  # Route-level page components
│   │   ├── Landing.tsx         # Marketing homepage
│   │   ├── Login.tsx           # Auth login + demo accounts
│   │   ├── Register.tsx        # New account registration
│   │   ├── Jobs.tsx            # Job listing with filters
│   │   ├── JobDetails.tsx      # Individual job view
│   │   ├── Apply.tsx           # Application form
│   │   ├── CandidateDashboard.tsx  # Candidate home
│   │   ├── Profile.tsx         # User profile editor
│   │   ├── Settings.tsx        # Account settings
│   │   ├── Favorites.tsx       # Saved jobs
│   │   ├── CompanyProfile.tsx  # Public company page
│   │   ├── AdminDashboard.tsx  # Recruiter analytics
│   │   ├── AdminJobs.tsx       # Job CRUD management
│   │   ├── AdminApplications.tsx  # Application review
│   │   ├── Privacy.tsx         # Privacy policy
│   │   ├── Support.tsx         # Help & support
│   │   └── UpdatePassword.tsx  # Password reset handler
│   ├── services/
│   │   └── api.ts              # Supabase API layer (CRUD)
│   ├── i18n.ts                 # i18next configuration
│   ├── App.tsx                 # Root component & routing
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles & design tokens
├── db/                         # Database utilities
│   └── add_profile_columns.sql
├── supabase/
│   └── migrations/
│       ├── 00_init.sql         # Core schema (users, jobs, applications, companies)
│       └── 01_profile_fields.sql
├── .env.example                # Environment variable template
├── index.html                  # Vite HTML entry
├── package.json
├── tsconfig.json
├── vite.config.ts              # Vite + Tailwind + proxy config
└── vercel.json                 # Vercel deployment settings
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Supabase** project ([supabase.com](https://supabase.com))

### 1. Clone the repository

```bash
git clone https://github.com/dzbluv/JobLinkDZ.git
cd JobLinkDZ
```

### 2. Install dependencies

```bash
# Frontend dependencies
npm install

# Backend server dependencies
cd server && npm install && cd ..
```

### 3. Configure environment variables

Create a `.env` file in the project root (and optionally in `server/`):

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Server
PORT=4000
```

> You can copy `.env.example` as a starting template.

### 4. Set up the database

Run the SQL migrations in your Supabase SQL editor in order:

1. `supabase/migrations/00_init.sql` — Creates `users`, `jobs`, `applications`, and `companies` tables with RLS policies
2. `supabase/migrations/01_profile_fields.sql` — Adds profile extension columns (bio, skills, social links)

### 5. Run the development server

```bash
npm run dev
```

This starts both:
- **Vite** frontend on `http://localhost:5173`
- **Express** API server on `http://localhost:4000`

The Vite dev server proxies `/api/*` requests to the Express backend automatically.

---

## 🗄 Database Schema

The application uses **Supabase PostgreSQL** with Row-Level Security (RLS) enabled on all tables.

```
┌──────────────────┐       ┌──────────────────┐
│      users       │       │    companies     │
├──────────────────┤       ├──────────────────┤
│ id (PK, FK auth) │       │ id (PK, uuid)    │
│ full_name        │       │ owner_id (FK)    │
│ email            │       │ name             │
│ role             │       │ industry         │
│ phone            │       │ location         │
│ location         │       │ description      │
│ bio              │       │ size             │
│ github_url       │       │ logo             │
│ portfolio_url    │       │ website          │
│ linkedin_url     │       │ founded          │
│ skills (text[])  │       │ created_at       │
│ created_at       │       └──────────────────┘
└──────────────────┘
         │
         │ user_id
         ▼
┌──────────────────┐       ┌──────────────────┐
│  applications    │       │      jobs        │
├──────────────────┤       ├──────────────────┤
│ id (PK, uuid)    │       │ id (PK, uuid)    │
│ user_id (FK)     │──────▶│ title            │
│ job_id (FK)      │       │ company          │
│ status           │       │ company_id (FK)  │
│ resume_url       │       │ location         │
│ cover_letter     │       │ job_type         │
│ applied_at       │       │ salary_range     │
│ created_at       │       │ description      │
└──────────────────┘       │ requirements[]   │
                           │ responsibilities[]│
                           │ skills[]         │
                           │ status           │
                           │ owner_id         │
                           │ created_at       │
                           └──────────────────┘
```

### RLS Policies
- **users** — Users can only read and update their own profile
- **jobs** — Publicly readable by everyone
- **applications** — Users can only view their own applications; admins have extended access
- **companies** — Publicly readable by everyone

---

## 🌍 Internationalization

The platform supports three languages out of the box:

| Language | Code | Direction |
|---|---|---|
| 🇬🇧 English | `en` | LTR |
| 🇫🇷 French | `fr` | LTR |
| 🇩🇿 Arabic | `ar` | RTL |

Language preference is persisted in `localStorage` and can be changed from the **Settings** page.

---

## 🎨 Design System

JobLinkDZ uses a custom design system built on Tailwind CSS 4 with CSS custom properties:

- **Fonts**: Inter (body), Outfit (headings), JetBrains Mono (code/mono)
- **Colors**: Indigo primary (`#6366f1`), Cyan secondary (`#06b6d4`), Purple accent (`#a855f7`)
- **Glass Effects**: Frosted glass cards with `backdrop-filter: blur()` and translucent borders
- **Animations**: Float, pulse-slow, page transitions via Motion library
- **Theme**: Light and dark mode with smooth 500ms color transitions

---

## 🚢 Deployment

### Frontend (Vercel)

The project includes a `vercel.json` configured for Vite:

```bash
# Deploy via Vercel CLI
npx vercel --prod
```

All client-side routes are rewritten to `/index.html` for SPA routing support.

### Backend (Any Node.js host)

The Express server in `server/` can be deployed to any Node.js hosting provider (Render, Railway, Heroku, etc.):

```bash
cd server
npm start
```

### Database (Supabase)

The Supabase project handles:
- **PostgreSQL** database with RLS
- **Auth** for email/password authentication  
- **Storage** for resume file uploads

---

## 🔑 API Endpoints

### Express Server (`/api`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/admin/create-user` | Server-side user creation (bypasses client rate limits) |
| `GET/POST` | `/api/users/*` | User management routes |

### Supabase Client API

All primary data operations (jobs, companies, applications) are performed directly through the Supabase client SDK — see `src/services/api.ts` for the full CRUD layer.

---

## 📄 License

This project is developed as part of an academic project (SI Project). All rights reserved.

---

<p align="center">
  Built with ❤️ in Algeria
</p>
