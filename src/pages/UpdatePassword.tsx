import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft, ShieldCheck, AlertTriangle, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GlassCard, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

/* ─── Password strength helpers ─── */
interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

function getStrengthLevel(score: number, t: any): { label: string; color: string; barColor: string } {
  if (score <= 1) return { label: t('auth.strength.weak'), color: 'text-rose-500', barColor: 'bg-rose-500' };
  if (score <= 2) return { label: t('auth.strength.fair'), color: 'text-amber-500', barColor: 'bg-amber-500' };
  if (score <= 3) return { label: t('auth.strength.good'), color: 'text-blue-500', barColor: 'bg-blue-500' };
  return { label: t('auth.strength.strong'), color: 'text-emerald-500', barColor: 'bg-emerald-500' };
}

/* ─── Component ─── */
export default function UpdatePassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isRecoverySession, setIsRecoverySession] = useState(false);

  // Listen for Supabase PASSWORD_RECOVERY event — this fires when the user
  // clicks the magic link in their email and lands on this page.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoverySession(true);
      }
    });

    // Also check if we already have a session (user might have arrived before
    // the event fired, e.g. via a browser that auto-restores sessions).
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setIsRecoverySession(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* Password validation */
  const PASSWORD_RULES: PasswordRule[] = useMemo(() => [
    { label: t('auth.rules.length'), test: (pw: string) => pw.length >= 6 },
    { label: t('auth.rules.number'), test: (pw: string) => /\d/.test(pw) },
    { label: t('auth.rules.uppercase'), test: (pw: string) => /[A-Z]/.test(pw) },
    { label: t('auth.rules.special'), test: (pw: string) => /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(pw) },
  ], [t]);

  const ruleResults = useMemo(() => PASSWORD_RULES.map((r) => r.test(password)), [password, PASSWORD_RULES]);
  const strengthScore = ruleResults.filter(Boolean).length;
  const strength = getStrengthLevel(strengthScore, t);
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;
  const canSubmit = strengthScore >= 2 && passwordsMatch;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || t('auth.errors.update_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('auth.back_to_login')}
        </Link>

        <GlassCard className="p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto mb-6">
              {success ? (
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              ) : (
                <ShieldCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {success ? t('auth.password_updated') : t('auth.set_new_password')}
            </h1>
            <p className="text-slate-500 text-sm">
              {success
                ? t('auth.password_success_msg')
                : t('auth.password_strong_msg')
              }
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium flex items-start gap-3"
              >
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)} className="shrink-0 hover:opacity-70 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* No valid session warning */}
          {!isRecoverySession && !success && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                No recovery session detected. Please use the reset link from your email, or{' '}
                <Link to="/login" className="underline font-bold hover:no-underline">
                  request a new one
                </Link>.
              </span>
            </div>
          )}

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
                >
                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                </motion.div>
                <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{t('auth.all_set')}</p>
                <p className="text-sm text-slate-500 mt-2">{t('auth.redirecting')}</p>
              </div>

              <Button
                onClick={() => navigate('/login')}
                className="w-full h-12"
              >
                {t('auth.go_to_login')}
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('auth.password_label')}</label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('auth.password_placeholder')}
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

                {/* Strength bar */}
                {password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-1.5 flex-1 rounded-full transition-all duration-300',
                            i < strengthScore ? strength.barColor : 'bg-slate-200 dark:bg-slate-700'
                          )}
                        />
                      ))}
                    </div>
                    <p className={cn('text-xs font-bold', strength.color)}>
                      {strength.label}
                    </p>

                    {/* Rules checklist */}
                    <div className="space-y-1.5 mt-3">
                      {PASSWORD_RULES.map((rule, i) => (
                        <div
                          key={i}
                          className={cn(
                            'flex items-center gap-2 text-xs font-medium transition-colors duration-200',
                            ruleResults[i] ? 'text-emerald-500' : 'text-slate-400'
                          )}
                        >
                          {ruleResults[i] ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <X className="w-3.5 h-3.5" />
                          )}
                          {rule.label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('auth.confirm_password_label')}</label>
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder={t('auth.confirm_password_label')}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {confirmPassword.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      'text-xs font-medium flex items-center gap-1',
                      passwordsMatch ? 'text-emerald-500' : 'text-rose-500'
                    )}
                  >
                    {passwordsMatch ? (
                      <><Check className="w-3.5 h-3.5" /> {t('auth.passwords_match')}</>
                    ) : (
                      <><X className="w-3.5 h-3.5" /> {t('auth.passwords_dont_match')}</>
                    )}
                  </motion.p>
                )}
              </div>

              <Button
                type="submit"
                className="h-12 w-full mt-2"
                isLoading={isLoading}
                disabled={!canSubmit}
              >
                <Lock className="w-4 h-4 mr-2" />
                {t('auth.update_password_button')}
              </Button>
            </form>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
