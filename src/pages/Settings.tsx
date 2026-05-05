import React, { useState, useEffect } from 'react';
import { Bell, Lock, Shield, User as UserIcon, Palette, Smartphone, Globe, Mail, Save, Trash2, Eye, EyeOff, Search, MapPin, Briefcase, Plus, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobAlerts } from '../context/JobAlertContext';
import { GlassCard, Badge, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function Settings() {
  const { user } = useAuth();
  const { alerts, addAlert, removeAlert } = useJobAlerts();
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  
  const [newAlert, setNewAlert] = useState({ keyword: '', location: '', jobType: '' });
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState('');
  
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      setPasswordStatus('Please enter both passwords.');
      return;
    }
    if (!user?.email) return;

    try {
      setPasswordStatus('Verifying...');
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        setPasswordStatus('Incorrect current password.');
        return;
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      setPasswordStatus('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setPasswordStatus(err.message || 'Error updating password.');
    }
  };

  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [mfaQrCode, setMfaQrCode] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [mfaStatus, setMfaStatus] = useState('');

  // Check initial MFA status
  useEffect(() => {
    const checkMfa = async () => {
      const { data } = await supabase.auth.mfa.listFactors();
      if (data && data.totp.length > 0 && data.totp[0].status === 'verified') {
        setIsMfaEnabled(true);
      }
    };
    checkMfa();
  }, []);

  const handleEnableMfa = async () => {
    try {
      setMfaStatus('Loading...');
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
      if (error) throw error;
      setMfaFactorId(data.id);
      setMfaQrCode(data.totp.qr_code);
      setMfaStatus('Scan the QR code and enter the 6-digit code.');
    } catch (err: any) {
      setMfaStatus(err.message || 'Error enabling MFA');
    }
  };

  const handleVerifyMfa = async () => {
    if (!mfaFactorId || !mfaCode) return;
    try {
      setMfaStatus('Verifying...');
      const challenge = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
      if (challenge.error) throw challenge.error;

      const verify = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: challenge.data.id,
        code: mfaCode
      });
      if (verify.error) throw verify.error;

      setIsMfaEnabled(true);
      setMfaFactorId(null);
      setMfaQrCode(null);
      setMfaStatus('Two-Factor Authentication is now enabled!');
    } catch (err: any) {
      setMfaStatus(err.message || 'Invalid code. Try again.');
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user?.id) return;
    if (!confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) return;
    
    setIsDeleting(true);
    try {
      // Point to backend admin route to fully wipe the user
      const response = await fetch(`http://localhost:4000/api/admin/delete-user/${user.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete account');
      await supabase.auth.signOut();
      window.location.href = '/'; // force reload to clear states
    } catch (err) {
      console.error(err);
      alert('Error deleting account from database. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isRecruiter = user?.role === 'recruiter';
  
  const tabs = [
    { id: 'profile', label: isRecruiter ? t('Company Profile') : t('Profile'), icon: UserIcon },
    { id: 'notifications', label: t('Notifications'), icon: Bell },
    { id: 'security', label: t('Security'), icon: Lock },
    { id: 'appearance', label: t('Appearance'), icon: Palette },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-8 transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 italic">{t('Settings')}</h1>
          <p className="text-slate-500">{t('Manage your account preferences and security settings.')}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <aside className="md:col-span-1 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium text-sm ${
                  activeTab === tab.id 
                    ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:bg-slate-50 dark:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            
            <div className="pt-8 mt-8 border-t border-slate-200 dark:border-white/5">
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/5 transition-all font-medium text-sm"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </aside>

          {/* Settings Content */}
          <main className="md:col-span-3">
            <GlassCard className="p-8" hover={false}>
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Email Notifications</h3>
                    <p className="text-xs text-slate-500">Choose when you want to be notified via email.</p>
                  </div>

                  <div className="space-y-6">
                    {[
                      { id: 'jobs', label: isRecruiter ? 'New candidate recommendations' : 'New job recommendations', desc: isRecruiter ? 'Get updates when new candidates matching your job posts are found.' : 'Get updates when new jobs matching your profile are posted.' },
                      { id: 'status', label: isRecruiter ? 'New job applications' : 'Application status updates', desc: isRecruiter ? 'Be notified when a candidate applies to your job listings.' : 'Be notified when an employer updates the status of your application.' },
                      { id: 'tips', label: 'Recruitment tips & news', desc: 'Receive monthly newsletter with career advice and hiring trends.' },
                      { id: 'security', label: 'Security alerts', desc: 'Notifications about your account security and login attempts.' }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.label}</p>
                          <p className="text-[10px] text-slate-500">{item.desc}</p>
                        </div>
                        <div className="w-12 h-6 rounded-full p-1 cursor-pointer transition-all bg-indigo-500">
                           <div className="w-4 h-4 rounded-full bg-white transition-all transform translate-x-6" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Profile Visibility</h3>
                    <p className="text-xs text-slate-500">Manage who can see your profile and activity.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                       <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Public Profile</p>
                          <p className="text-[10px] text-slate-500">
                            {isPublic 
                              ? (isRecruiter ? 'Other companies and candidates can find your company profile.' : 'Recruiters can find your profile in search results.') 
                              : (isRecruiter ? 'Your company profile is hidden from search results.' : 'Your profile is hidden from search results and only visible to you.')}
                          </p>
                       </div>
                       <div 
                         onClick={() => setIsPublic(!isPublic)}
                         className={cn(
                           "w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300",
                           isPublic ? "bg-indigo-500" : "bg-slate-700"
                         )}
                       >
                           <div className={cn(
                             "w-4 h-4 rounded-full bg-white transition-all duration-300 transform",
                             isPublic ? "translate-x-6" : "translate-x-0"
                           )} />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">Language</label>
                          <select 
                              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 transition-all"
                              value={i18n.language}
                              onChange={(e) => {
                                i18n.changeLanguage(e.target.value);
                                localStorage.setItem('i18nextLng', e.target.value);
                                if (e.target.value === 'ar') document.dir = 'rtl';
                                else document.dir = 'ltr';
                              }}
                            >
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-900 dark:text-white" value="en">English (US)</option>
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-900 dark:text-white" value="fr">Français</option>
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-900 dark:text-white" value="ar">العربية</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">Timezone</label>
                          <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 transition-all">
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-900 dark:text-white" value="dz">Algiers (GMT+1)</option>
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-900 dark:text-white" value="utc">UTC / GMT</option>
                          </select>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Security Settings</h3>
                    <p className="text-xs text-slate-500">Protect your account with advanced security features.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">{t('Current Password')}</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? 'text' : 'password'} 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all pr-10" 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">{t('New Password')}</label>
                      <div className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                          <input 
                            type={showNewPassword ? 'text' : 'password'} 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all pr-10" 
                          />
                          <button 
                            type="button" 
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleChangePassword}>{t('Change Password')}</Button>
                      </div>
                      {passwordStatus && <p className="text-xs font-bold text-indigo-500 px-2 mt-1">{passwordStatus}</p>}
                    </div>

                    <div className="mt-8 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col gap-4">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8 text-indigo-400" />
                            <div>
                               <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Two-Factor Authentication</p>
                               <p className="text-[10px] text-slate-500">{isMfaEnabled ? 'Your account is secured with 2FA.' : 'Add an extra layer of security to your account.'}</p>
                            </div>
                         </div>
                         {!isMfaEnabled && !mfaFactorId && (
                           <Button size="sm" onClick={handleEnableMfa}>Enable</Button>
                         )}
                         {isMfaEnabled && (
                           <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Enabled</span>
                         )}
                       </div>

                       {mfaFactorId && !isMfaEnabled && (
                         <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-white/10 mt-2">
                           <p className="text-sm text-slate-900 dark:text-white mb-4">1. Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
                           {mfaQrCode && (
                             <div className="bg-white p-2 rounded-lg inline-block mb-4" dangerouslySetInnerHTML={{ __html: mfaQrCode }} />
                           )}
                           <p className="text-sm text-slate-900 dark:text-white mb-2">2. Enter the 6-digit code from the app:</p>
                           <div className="flex gap-2">
                             <input 
                               type="text" 
                               value={mfaCode}
                               onChange={(e) => setMfaCode(e.target.value)}
                               placeholder="000000"
                               className="w-32 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all text-center tracking-widest font-mono"
                             />
                             <Button size="sm" onClick={handleVerifyMfa}>Verify</Button>
                           </div>
                           {mfaStatus && <p className="text-xs font-bold text-indigo-500 mt-2">{mfaStatus}</p>}
                         </div>
                       )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('Theme')}</h3>
                    <p className="text-xs text-slate-500">Customize the look and feel of JobLinkDZ.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`flex-1 p-6 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-200 dark:border-slate-200 dark:border-white/10 hover:border-indigo-500/30'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <div className="w-6 h-6 rounded-full bg-yellow-400" />
                      </div>
                      <p className="font-bold text-center text-slate-900 dark:text-white">{t('Light')}</p>
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`flex-1 p-6 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-200 dark:border-slate-200 dark:border-white/10 hover:border-indigo-500/30'}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-400" />
                      </div>
                      <p className="font-bold text-center text-slate-900 dark:text-white">{t('Dark')}</p>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-200 dark:border-white/5 flex justify-end">
                <Button 
                  onClick={handleSave} 
                  isLoading={isSaving}
                  className="px-10"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </GlassCard>
          </main>
        </div>
      </div>
    </div>
  );
}
