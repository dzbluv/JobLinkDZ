import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Send, Sparkles, UserCircle, Building2, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { GlassCard, Input } from '../components/ui/Shared';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const DEMO_ACCOUNTS = [
  {
    label: 'Candidate',
    email: 'zakihachemi201@gmail.com',
    password: '123123',
    role: 'candidate' as const,
    icon: UserCircle,
  },
  {
    label: 'Recruiter',
    email: 'dzbluv1@gmail.com',
    password: 'User_123456',
    role: 'admin' as const,
    icon: Building2,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot password state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resetError, setResetError] = useState<string | null>(null);

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
    setResetError(null);

    try {
      // Use VITE_SITE_URL so the email link always points to production,
      // even when the reset is triggered from localhost during development.
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${siteUrl}/update-password`,
      });

      if (error) throw error;

      setResetStatus('success');
    } catch (err: any) {
      console.error('Reset error:', err);
      setResetError(err.message || 'Failed to send reset email. Please try again.');
      setResetStatus('error');
    }
  };

  const closeResetModal = () => {
    setIsResetModalOpen(false);
    // Reset state after the exit animation completes
    setTimeout(() => {
      setResetStatus('idle');
      setResetEmail('');
      setResetError(null);
    }, 300);
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
            
            <Input 
              type={showPassword ? "text" : "password"} 
              placeholder="Your password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              rightElement={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
            
            <div className="text-right -mt-2">
              <button 
                type="button" 
                onClick={() => setIsResetModalOpen(true)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </button>
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
              onClick={closeResetModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 shadow-2xl overflow-hidden bg-white dark:bg-slate-900"
            >
              {/* Decorative blurs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-violet-500/10 blur-3xl -ml-12 -mb-12 pointer-events-none" />

              <div className="text-center mb-8 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6">
                  <motion.div
                    animate={resetStatus === 'loading' ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    {resetStatus === 'success' ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    ) : resetStatus === 'error' ? (
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                    ) : (
                      <KeyRound className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                    )}
                  </motion.div>
                </div>

                <h2 className="text-2xl font-black italic text-slate-950 dark:text-white tracking-tighter mb-2 uppercase">
                  {resetStatus === 'success' ? 'CHECK YOUR EMAIL' : resetStatus === 'error' ? 'SOMETHING WENT WRONG' : 'RESET PASSWORD'}
                </h2>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {resetStatus === 'success'
                    ? `We sent a password reset link to ${resetEmail}. Check your inbox and spam folder.`
                    : resetStatus === 'error'
                    ? resetError
                    : "Enter your email address and we'll send you a secure link to reset your password."
                  }
                </p>
              </div>

              <AnimatePresence mode="wait">
                {resetStatus === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative z-10 space-y-4"
                  >
                    {/* Steps visual */}
                    <div className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-5 space-y-3">
                      {[
                        { step: 1, text: 'Open your email inbox' },
                        { step: 2, text: 'Click the reset password link' },
                        { step: 3, text: 'Set your new password' },
                      ].map(({ step, text }) => (
                        <div key={step} className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-black shrink-0">
                            {step}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={closeResetModal}
                      >
                        Back to Login
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() => {
                          setResetStatus('idle');
                          setResetError(null);
                        }}
                      >
                        Resend Email
                      </Button>
                    </div>

                    <p className="text-[11px] text-slate-400 text-center font-medium">
                      Didn't receive it? Check your spam folder or try again with a different email.
                    </p>
                  </motion.div>
                ) : resetStatus === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="relative z-10 space-y-4"
                  >
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-1"
                        onClick={closeResetModal}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        className="flex-1"
                        onClick={() => {
                          setResetStatus('idle');
                          setResetError(null);
                        }}
                      >
                        Try Again
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <form onSubmit={handleResetPassword} className="space-y-6 relative z-10">
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />

                      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <ShieldCheck className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                          For security, we'll send a reset link even if the email isn't registered — no account info is revealed.
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="ghost"
                          className="flex-1"
                          onClick={closeResetModal}
                          disabled={resetStatus === 'loading'}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1"
                          isLoading={resetStatus === 'loading'}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Link
                        </Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
