import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, ArrowLeft, Building2, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { GlassCard, Input } from '../components/ui/Shared';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState<'candidate' | 'admin'>('candidate');
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError(t('auth.errors.passwords_mismatch'));
      return;
    }
    setIsLoading(true);
    const { user: newUser, error: registerError } = await register({ full_name: fullName, email, password, role });
    if (newUser) {
      navigate(newUser.role === 'admin' ? '/admin-dashboard' : '/dashboard');
    } else {
      setError(registerError || t('auth.errors.registration_failed'));
    }
    setIsLoading(false);
  };

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
          {t('auth.back_to_home')}
        </Link>
        
        <GlassCard className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">{t('auth.create_account')}</h1>
            <p className="text-slate-500">{t('auth.join_network')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <button
              onClick={() => setRole('candidate')}
              className={`p-6 rounded-2xl border-2 transition-colors duration-150 ease-in-out transform will-change-transform flex flex-col items-center text-center gap-4 ${role === 'candidate' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'}`}
              type="button"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${role === 'candidate' ? 'bg-primary text-slate-900 dark:text-white shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <UserCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className={cn("font-bold text-lg", role === 'candidate' ? "text-slate-950 dark:text-white" : "text-slate-600 dark:text-slate-400")}>{t('auth.candidate')}</h3>
                <p className="text-sm text-slate-500 font-medium italic">{t('auth.i_want_job')}</p>
              </div>
            </button>

            <button
              onClick={() => setRole('admin')}
              className={`p-6 rounded-2xl border-2 transition-colors duration-150 ease-in-out transform will-change-transform flex flex-col items-center text-center gap-4 ${role === 'admin' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'}`}
              type="button"
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${role === 'admin' ? 'bg-primary text-slate-900 dark:text-white shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className={cn("font-bold text-lg", role === 'admin' ? "text-slate-950 dark:text-white" : "text-slate-600 dark:text-slate-400")}>{t('auth.recruiter')}</h3>
                <p className="text-sm text-slate-500 font-medium italic">{t('auth.i_look_talent')}</p>
              </div>
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t('auth.full_name_placeholder')} required />
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('auth.email_label')} type="email" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t('auth.password_label')} type="password" required />
              <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder={t('auth.confirm_password_label')} type="password" required />
            </div>

            {error && <div className="text-rose-500 text-sm">{error}</div>}

            <div className="flex flex-col md:col-span-2 mt-4">
              <Button type="submit" className="w-full h-14 text-xl" isLoading={isLoading}>
                {t('auth.create_account_button')}
              </Button>
            </div>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              {t('auth.already_have_account')} <Link to="/login" className="text-primary font-bold hover:underline">{t('auth.sign_in_link')}</Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
