import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GlassCard, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if the user is here with a valid recovery token hash
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        console.log("Password recovery flow initiated.");
      }
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Error updating password.');
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
        <GlassCard className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Update Password</h1>
            <p className="text-slate-500">Enter your new password below.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">
              {error}
            </div>
          )}

          {success ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
              <p className="text-emerald-500 font-bold">Password updated successfully!</p>
              <p className="text-sm text-slate-500">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="flex flex-col gap-6">
              <div className="relative">
                <Input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="New password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="pr-10"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button type="submit" className="h-12 w-full" isLoading={isLoading}>
                Update Password
              </Button>
            </form>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
}
