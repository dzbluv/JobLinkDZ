import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Building2, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/Shared';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Register() {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [role, setRole] = useState<'candidate' | 'admin'>('candidate');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background relative overflow-hidden transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
        
        <GlassCard className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Create Account</h1>
            <p className="text-slate-500">Join the JobLinkDZ professional network today</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <button 
              onClick={() => setRole('candidate')}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 ${role === 'candidate' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${role === 'candidate' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <UserCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className={cn("font-bold text-lg", role === 'candidate' ? "text-slate-950 dark:text-white" : "text-slate-600 dark:text-slate-400")}>Candidate</h3>
                <p className="text-sm text-slate-500 font-medium italic">I want to find a job</p>
              </div>
            </button>

            <button 
              onClick={() => setRole('admin')}
              className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-4 ${role === 'admin' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${role === 'admin' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className={cn("font-bold text-lg", role === 'admin' ? "text-slate-950 dark:text-white" : "text-slate-600 dark:text-slate-400")}>Recruiter</h3>
                <p className="text-sm text-slate-500 font-medium italic">I am looking for talent</p>
              </div>
            </button>
          </div>

          <div className="flex flex-col md:col-span-2 mt-4 space-y-4">
            <Button 
              type="button" 
              onClick={async () => {
                setIsLoading(true);
                const loggedInUser = await loginWithGoogle(role);
                if (loggedInUser) {
                  navigate(loggedInUser.role === 'admin' ? '/admin-dashboard' : '/dashboard');
                }
                setIsLoading(false);
              }}
              className="w-full h-14 text-xl" 
              isLoading={isLoading}
            >
              Sign Up with Google <UserPlus className="w-5 h-5 ml-2" />
            </Button>
            <div className="text-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs text-slate-500">
               By clicking "Sign Up with Google", you agree to our Terms of Service and Privacy Policy. We will never share your information without your consent.
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
