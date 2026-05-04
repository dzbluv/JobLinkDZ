import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { GlassCard, Badge, Input } from '../components/ui/Shared';
import { motion, AnimatePresence } from 'motion/react';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('loading');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setResetStatus('success');
    setTimeout(() => {
      setIsResetModalOpen(false);
      setResetStatus('idle');
      setResetEmail('');
    }, 2500);
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
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to your JobLinkDZ account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Button 
              type="button" 
              onClick={async () => {
                setIsLoading(true);
                const loggedInUser = await loginWithGoogle();
                if (loggedInUser) {
                  navigate(loggedInUser.role === 'admin' ? '/admin-dashboard' : '/dashboard');
                } else {
                  setError('Login failed or popup cancelled');
                }
                setIsLoading(false);
              }}
              className="w-full h-14 text-lg bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/10" 
              isLoading={isLoading}
            >
              Sign in with Google <LogIn className="w-5 h-5 ml-2" />
            </Button>
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
