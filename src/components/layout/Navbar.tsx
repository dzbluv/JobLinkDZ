import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard, Briefcase, User as UserIcon, Settings, ChevronRight, Bell, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = user?.role === 'admin' 
    ? [
        { label: 'Admin Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
        { label: 'Manage Jobs', path: '/admin-jobs', icon: Briefcase },
        { label: 'Applications', path: '/admin-applications', icon: UserIcon },
      ]
    : [
        { label: 'Browse Jobs', path: '/jobs', icon: Briefcase },
        ...(user ? [
          { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
          { label: 'My Profile', path: '/profile', icon: UserIcon },
          { label: 'Settings', path: '/settings', icon: Settings },
        ] : [])
      ];

  const activeLinkStyle = "text-primary dark:text-primary-dark font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full";
  const inactiveLinkStyle = "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary-dark transition-colors font-medium";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 px-8 flex items-center justify-between border-b border-slate-200 dark:border-white/5 backdrop-blur-xl bg-white/70 dark:bg-white/5 z-50 transition-colors duration-500">
        <Link to="/" className="flex items-center gap-2 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-transform"
          >
            <Briefcase className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-white transition-colors">JobLink<span className="text-cyan-600 dark:text-cyan-400 italic">DZ</span></span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className="relative py-1 transition-colors"
            >
              <motion.span
                className={cn(
                  "hover:text-slate-950 dark:hover:text-white inline-block transition-colors",
                  location.pathname === link.path ? "text-slate-950 dark:text-white font-bold" : ""
                )}
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
              >
                {link.label}
              </motion.span>
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Notification Center */}
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors relative text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 dark:bg-indigo-500 border-2 border-white dark:border-[#020617] rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowNotifications(false)}
                        className="fixed inset-0 z-40"
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9, rotateX: -15 }}
                        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95, rotateX: -10 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="absolute right-0 mt-4 w-80 max-h-[400px] glass rounded-3xl z-50 border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden origin-top-right perspective-1000 bg-white/95 dark:bg-slate-900/95"
                      >
                        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50  dark:bg-transparent">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Activity Log</h4>
                          <button 
                            onClick={markAllAsRead}
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Mark all as read
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto py-2">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 italic text-xs">
                              No recent activity.
                            </div>
                          ) : (
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                              {notifications.map((n) => (
                                <div key={n.id} className={cn("p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors", n.status === 'unread' ? "bg-indigo-50/50 dark:bg-white/[0.02]" : "opacity-60")}>
                                  <div className="flex gap-3">
                                    <div className={cn(
                                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                                      n.type === 'application' ? "bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : 
                                      n.type === 'status_change' ? "bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400" : "bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400"
                                    )}>
                                      {n.type === 'status_change' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    </div>
                                    <div>
                                      <p className="text-xs font-bold text-slate-900 dark:text-white mb-0.5">{n.title}</p>
                                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic">{n.message}</p>
                                      <p className="text-[8px] text-slate-400 dark:text-slate-500 mt-1 uppercase font-black">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{user.full_name}</span>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter transition-colors">{user.role}</span>
              </div>
              <Avatar name={user.full_name} initials={user.avatar_initials || undefined} color={user.avatar_color || undefined} size="sm" />
              <button onClick={handleLogout} className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-rose-100 dark:hover:bg-white/10 transition-colors text-slate-500 hover:text-rose-600 dark:hover:text-rose-400">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-400 dark:hover:text-white"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[55] md:hidden"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.5 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl z-[60] shadow-2xl flex flex-col md:hidden overflow-hidden"
            >
              <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-white/5">
                <span className="text-xl font-bold text-slate-950 dark:text-white uppercase tracking-tighter italic">Navigation</span>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)} 
                  className="p-2 text-slate-400 hover:text-slate-950 dark:hover:text-white"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <motion.div 
                  initial="closed"
                  animate="open"
                  variants={{
                    open: {
                      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
                    },
                    closed: {
                      transition: { staggerChildren: 0.05, staggerDirection: -1 }
                    }
                  }}
                  className="flex flex-col gap-3"
                >
                  {navLinks.map((link) => (
                    <motion.div
                      key={link.path}
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: 20 }
                      }}
                    >
                      <Link 
                        to={link.path} 
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl transition-all border border-transparent",
                          location.pathname === link.path 
                            ? "bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 font-bold" 
                            : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <link.icon className="w-5 h-5" />
                          {link.label}
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="p-6 mt-auto border-t border-white/5 flex flex-col gap-4"
              >
                {user ? (
                  <>
                    <div className="flex items-center gap-4 px-2 py-2">
                       <Avatar name={user.full_name} initials={user.avatar_initials || undefined} color={user.avatar_color || undefined} size="md" />
                       <div>
                         <p className="font-bold text-slate-900 dark:text-white">{user.full_name}</p>
                         <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user.role}</p>
                       </div>
                    </div>
                    <Button variant="danger" className="w-full h-12 rounded-xl gap-2 font-black uppercase tracking-widest text-xs" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full h-12 rounded-xl font-bold text-sm">Login</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full h-12 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500">Join</Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="h-24 md:h-28" /> {/* Spacer for fixed nav */}
    </>
  );
}

export function Footer() {
  return (
    <footer className="h-10 px-8 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/2 backdrop-blur-md transition-colors">
      <div className="flex gap-6">
        <span className="font-bold opacity-60 italic">&copy; {new Date().getFullYear()} JobLinkDZ Career Platforms</span>
        <Link to="/privacy" className="hover:text-indigo-600 dark:hover:text-slate-300 transition-colors font-black tracking-widest uppercase">Privacy</Link>
        <Link to="/support" className="hover:text-indigo-600 dark:hover:text-slate-300 transition-colors font-black tracking-widest uppercase">Support</Link>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
        <span className="uppercase tracking-[0.2em] font-black text-slate-400 dark:text-slate-500">System Responsive</span>
      </div>
    </footer>
  );
}
