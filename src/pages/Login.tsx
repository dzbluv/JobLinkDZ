import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Send, Sparkles, UserCircle, Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { GlassCard, Input } from '../components/ui/Shared';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const DEMO_ACCOUNTS = [
  {
    label: 'Candidate',
    email: 'candidatedemo@joblinkdz.com',
    password: 'demo123456',
    role: 'candidate' as const,
    icon: UserCircle,
  },
  {
    label: 'Recruiter',
    email: 'recruiterdemo@joblinkdz.com',
    password: 'demo123456',
    role: 'admin' as const,
    icon: Building2,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const { user, error: loginError } = await login(email, password);
    if (user) {
      navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
    } else {
      setError(loginError || 'Invalid email or password');
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('loading');
    try {
      // Use Supabase password reset when available; otherwise simulate
      if (supabase.auth && typeof (supabase.auth as any).resetPasswordForEmail === 'function') {
        const { error } = await (supabase.auth as any).resetPasswordForEmail(resetEmail, {
          redirectTo: `${window.location.origin}/update-password`
        });
        if (error) throw error;
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setResetStatus('success');
    } catch (err) {
      console.error('Reset error', err);
      setResetStatus('success');
    } finally {
      setTimeout(() => {
        setIsResetModalOpen(false);
        setResetStatus('idle');
        setResetEmail('');
      }, 1800);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>

        <GlassCard className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Welcome</h1>
            <p className="text-slate-500">Sign in to your JobLinkDZ account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            
            <div className="space-y-1">
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Your password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setIsResetModalOpen(true)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <Button type="submit" className="h-12 w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </div>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 justify-center mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Demo Accounts</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = account.icon;
                return (
                  <button
                    key={account.role}
                    type="button"
                    onClick={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                    }}
                    className={cn(
                      'group relative p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                      'border-slate-200 dark:border-slate-800 hover:border-indigo-500/30',
                      'bg-white dark:bg-slate-900/50 hover:bg-indigo-500/5',
                      email === account.email && password === account.password
                        ? 'border-indigo-500/50 bg-indigo-500/10 ring-2 ring-indigo-500/20'
                        : ''
                    )}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={cn(
                        'w-9 h-9 rounded-xl flex items-center justify-center text-slate-900 dark:text-white text-xs font-black',
                        account.role === 'admin' ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{account.label}</p>
                        <p className="text-[9px] text-slate-500 font-medium">{account.role === 'admin' ? 'Recruiter' : 'Job Seeker'}</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      {account.email}
                    </div>
                    <div className="text-[9px] text-slate-500 mt-0.5 font-mono flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> {account.password}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register now</Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
              onClick={() => setIsResetModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 shadow-2xl overflow-hidden bg-white dark:bg-slate-900"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16" />

              <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6 text-indigo-600 dark:text-indigo-400">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black italic text-slate-950 dark:text-white tracking-tighter mb-2 uppercase">RESET PASSWORD</h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  Enter your email address and we'll send you instructions to reset your password.
                </p>
              </div>

              {resetStatus === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-6 h-6" />
                  </div>
                  <p className="text-slate-950 dark:text-white font-bold italic">Email Sent!</p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Check your inbox for the reset link.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-6 relative z-10">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setIsResetModalOpen(false)}
                      disabled={resetStatus === 'loading'}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      isLoading={resetStatus === 'loading'}
                    >
                      Send
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
