const fs = require('fs');

let settingsCode = fs.readFileSync('src/pages/Settings.tsx', 'utf-8');

// Imports
settingsCode = settingsCode.replace(
  "import { motion } from 'motion/react';",
  `import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';`
);

// inside component
settingsCode = settingsCode.replace(
  "const [newAlert, setNewAlert] = useState({ keyword: '', location: '', jobType: '' });",
  `const [newAlert, setNewAlert] = useState({ keyword: '', location: '', jobType: '' });
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState('');
  
  const handleChangePassword = async () => {
    if (!newPassword) return;
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordStatus('Password updated successfully!');
      setNewPassword('');
    } catch (err) {
      setPasswordStatus('Error updating password.');
    }
  };`
);

// Tab names and headers
settingsCode = settingsCode.replace(/\{ id: 'profile', label: 'Profile', icon: UserIcon \}/g, "{ id: 'profile', label: t('Profile'), icon: UserIcon }");
settingsCode = settingsCode.replace(/\{ id: 'notifications', label: 'Notifications', icon: Bell \}/g, "{ id: 'notifications', label: t('Notifications'), icon: Bell }");
settingsCode = settingsCode.replace(/\{ id: 'alerts', label: 'Job Alerts', icon: Search \}/g, "{ id: 'alerts', label: t('Job Alerts'), icon: Search }");
settingsCode = settingsCode.replace(/\{ id: 'security', label: 'Security', icon: Lock \}/g, "{ id: 'security', label: t('Security'), icon: Lock }");
settingsCode = settingsCode.replace(/\{ id: 'appearance', label: 'Appearance', icon: Palette \}/g, "{ id: 'appearance', label: t('Appearance'), icon: Palette }");

settingsCode = settingsCode.replace(
  `<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 italic">Settings</h1>
          <p className="text-slate-500">Manage your account preferences and security settings.</p>`,
  `<h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 italic">{t('Settings')}</h1>
          <p className="text-slate-500">{t('Manage your account preferences and security settings.')}</p>`
);

// Language changer
settingsCode = settingsCode.replace(
  `<select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all">
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="en">English (US)</option>
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="fr">Français</option>
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="ar">العربية</option>
                          </select>`,
  `<select 
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 transition-all"
                              value={i18n.language}
                              onChange={(e) => {
                                i18n.changeLanguage(e.target.value);
                                localStorage.setItem('i18nextLng', e.target.value);
                                if (e.target.value === 'ar') document.dir = 'rtl';
                                else document.dir = 'ltr';
                              }}
                            >
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="en">English (US)</option>
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="fr">Français</option>
                             <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="ar">العربية</option>
                          </select>`
);

// Security section
settingsCode = settingsCode.replace(
  `<div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">Current Password</label>
                      <div className="relative">
                        <input type="password" value="••••••••" disabled className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/50 cursor-not-allowed" />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      </div>
                    </div>

                    <Button variant="outline" size="sm">Change Password</Button>`,
  `<div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">{t('Current Password')}</label>
                      <div className="relative">
                        <input type="password" value="••••••••" disabled className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-500 dark:text-white/50 cursor-not-allowed" />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
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
                    </div>`
);

// Appearance
settingsCode = settingsCode.replace(
  `<div className="mt-12 pt-8 border-t border-white/5 flex justify-end">`,
  `{activeTab === 'appearance' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('Theme')}</h3>
                    <p className="text-xs text-slate-500">Customize the look and feel of JobLinkDZ.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setTheme('light')}
                      className={\`flex-1 p-6 rounded-2xl border-2 transition-all \${theme === 'light' ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-200 dark:border-white/10 hover:border-indigo-500/30'}\`}
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <div className="w-6 h-6 rounded-full bg-yellow-400" />
                      </div>
                      <p className="font-bold text-center text-slate-900 dark:text-white">{t('Light')}</p>
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={\`flex-1 p-6 rounded-2xl border-2 transition-all \${theme === 'dark' ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-200 dark:border-white/10 hover:border-indigo-500/30'}\`}
                    >
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
                        <div className="w-6 h-6 rounded-full bg-indigo-400" />
                      </div>
                      <p className="font-bold text-center text-slate-900 dark:text-white">{t('Dark')}</p>
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex justify-end">`
);

fs.writeFileSync('src/pages/Settings.tsx', settingsCode);
