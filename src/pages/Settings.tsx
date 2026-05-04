import React, { useState } from 'react';
import { Bell, Lock, Shield, User as UserIcon, Palette, Smartphone, Globe, Mail, Save, Trash2, Eye, EyeOff, Search, MapPin, Briefcase, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobAlerts } from '../context/JobAlertContext';
import { GlassCard, Badge, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Settings() {
  const { user } = useAuth();
  const { alerts, addAlert, removeAlert } = useJobAlerts();
  const [activeTab, setActiveTab] = useState('notifications');
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  
  const [newAlert, setNewAlert] = useState({ keyword: '', location: '', jobType: '' });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'alerts', label: 'Job Alerts', icon: Search },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 italic">Settings</h1>
          <p className="text-slate-500">Manage your account preferences and security settings.</p>
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
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            
            <div className="pt-8 mt-8 border-t border-white/5">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-500/5 transition-all font-medium text-sm">
                <Trash2 className="w-4 h-4" />
                Delete Account
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
                      { id: 'jobs', label: 'New job recommendations', desc: 'Get updates when new jobs matching your profile are posted.' },
                      { id: 'status', label: 'Application status updates', desc: 'Be notified when an employer updates the status of your application.' },
                      { id: 'tips', label: 'Recruitment tips & news', desc: 'Receive monthly newsletter with career advice.' },
                      { id: 'security', label: 'Security alerts', desc: 'Notifications about your account security and login attempts.' }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
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

              {activeTab === 'alerts' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Job Alerts</h3>
                    <p className="text-xs text-slate-500">Stay notified when new jobs match your interests.</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white italic">Create New Alert</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">Keyword</label>
                        <Input 
                          placeholder="e.g. Developer, Designer" 
                          value={newAlert.keyword}
                          onChange={(e) => setNewAlert({...newAlert, keyword: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">Location</label>
                        <Input 
                          placeholder="e.g. Algiers, Remote" 
                          value={newAlert.location}
                          onChange={(e) => setNewAlert({...newAlert, location: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">Job Type</label>
                        <select 
                          className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all"
                          value={newAlert.jobType}
                          onChange={(e) => setNewAlert({...newAlert, jobType: e.target.value})}
                        >
                          <option value="">Any Type</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Remote">Remote</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-2" 
                      onClick={() => {
                        addAlert(newAlert);
                        setNewAlert({ keyword: '', location: '', jobType: '' });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Alert
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white italic">Your Active Alerts</h4>
                    {alerts.length === 0 ? (
                      <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                        <Search className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 italic">No custom alerts set up yet.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {alerts.map((alert) => (
                          <div key={alert.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-indigo-500/30 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <Bell className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white">
                                  {alert.keyword || 'All Jobs'}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500 uppercase font-bold tracking-tight">
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {alert.location || 'Anywhere'}</span>
                                  <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {alert.jobType || 'Any type'}</span>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => removeAlert(alert.id)}
                              className="p-2 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
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
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                       <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">Public Profile</p>
                          <p className="text-[10px] text-slate-500">
                            {isPublic 
                              ? ' recruiters can find your profile in search results.' 
                              : 'Your profile is hidden from search results and only visible to you.'}
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
                          <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all">
                             <option value="en">English (US)</option>
                             <option value="fr">Français</option>
                             <option value="ar">العربية</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">Timezone</label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-all">
                             <option value="dz">Algiers (GMT+1)</option>
                             <option value="utc">UTC / GMT</option>
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
                      <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest px-2">Current Password</label>
                      <div className="relative">
                        <input type="password" value="••••••••" disabled className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/50 cursor-not-allowed" />
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                      </div>
                    </div>

                    <Button variant="outline" size="sm">Change Password</Button>

                    <div className="mt-8 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Shield className="w-8 h-8 text-indigo-400" />
                          <div>
                             <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Two-Factor Authentication</p>
                             <p className="text-[10px] text-slate-500">Add an extra layer of security to your account.</p>
                          </div>
                       </div>
                       <Button size="sm">Enable</Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-white/5 flex justify-end">
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
