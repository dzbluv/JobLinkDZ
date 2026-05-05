import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { JobAlertProvider } from './context/JobAlertContext';
import { UserPreferencesProvider } from './context/UserPreferencesContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar, Footer } from './components/layout/Navbar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AnimatePresence, motion } from 'motion/react';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Apply from './pages/Apply';
import CandidateDashboard from './pages/CandidateDashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CompanyProfile from './pages/CompanyProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminJobs from './pages/AdminJobs';
import AdminApplications from './pages/AdminApplications';
import AccessDenied from './pages/AccessDenied';
import NotFound from './pages/NotFound';
import Privacy from './pages/Privacy';
import Support from './pages/Support';
import UpdatePassword from './pages/UpdatePassword';
import Favorites from './pages/Favorites';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.995, y: 4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.005, y: -4 }}
        transition={{ 
          duration: 0.35,
          ease: [0.23, 1, 0.32, 1]
        }}
        className="will-change-[transform,opacity]"
      >
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies/:id" element={<CompanyProfile />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support" element={<Support />} />
          
          {/* Candidate Routes */}
          <Route 
            path="/apply/:id" 
            element={
              <ProtectedRoute allowedRole="candidate">
                <Apply />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRole="candidate">
                <CandidateDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/favorites" 
            element={
              <ProtectedRoute allowedRole="candidate">
                <Favorites />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/:userId" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-jobs" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminJobs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-applications" 
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminApplications />
              </ProtectedRoute>
            } 
          />

          {/* Special Routes */}
          <Route path="/access-denied" element={<AccessDenied />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <UserPreferencesProvider>
            <NotificationProvider>
              <JobAlertProvider>
                <Router>
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-grow pt-16">
                    <AnimatedRoutes />
                  </main>
                  <Footer />
                </div>
              </Router>
              </JobAlertProvider>
            </NotificationProvider>
          </UserPreferencesProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
