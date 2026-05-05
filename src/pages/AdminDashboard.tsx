import React, { useState, useEffect } from 'react';
import {
  Briefcase, Users, FileText, CheckCircle, Clock, XCircle,
  Plus, TrendingUp, Search, MoreHorizontal, Loader2, Eye, Building2, Edit2, MapPin, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '../context/NotificationContext';
import { Avatar } from '../components/ui/Avatar';
import type { JobOffer } from '../data/mockJobs';
import type { Application } from '../data/mockApplications';
import type { Company } from '../data/mockCompanies';
import { applicationsAPI, jobsAPI, companiesAPI } from '../services/api';
import { GlassCard, StatCard, Badge, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import {
  getAppCandidateName,
  getAppCandidateEmail,
  getAppJobTitle
} from '../data/mockApplications';
import ApplicationDetailsModal from '../components/admin/ApplicationDetailsModal';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { notifications } = useNotifications();

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Edit Company State
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
  const [isUpdatingCompany, setIsUpdatingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState<{
    name: string;
    industry: string;
    size: "Small" | "Medium" | "Large" | "";
    location: string;
    description: string;
    website: string;
  }>({
    name: '',
    industry: '',
    size: '',
    location: '',
    description: '',
    website: ''
  });

  const handleStatusChange = async (id: string, newStatus: Application["status"]) => {
    setProcessingId(id);
    setOpenMenuId(null);
    try {
      await applicationsAPI.updateStatus(id, newStatus);
      setApplications(apps => apps.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        let currentCompany = await companiesAPI.getByOwnerId(user.id);

        // Auto-fix: if recruiter has no company, create a default one (consistent with AdminJobs)
        if (!currentCompany && user.role === 'admin') {
          const newCompanyId = await companiesAPI.create({
            owner_id: user.id,
            name: t('admin_jobs.defaults.auto_company_name', { name: user.full_name }),
            industry: 'Technology',
            size: 'Medium',
            location: 'Algiers',
            description: t('admin_jobs.defaults.auto_company_desc'),
            website: 'https://example.com'
          });
          currentCompany = await companiesAPI.getById(newCompanyId);
        }

        if (!currentCompany) {
          setJobs([]);
          setApplications([]);
          return;
        }

        setCompany(currentCompany);
        setCompanyForm({
          name: currentCompany.name,
          industry: currentCompany.industry || '',
          size: currentCompany.size || '',
          location: currentCompany.location || '',
          description: currentCompany.description || '',
          website: currentCompany.website || ''
        });

        const [fetchedJobs, allApps] = await Promise.all([
          jobsAPI.getByCompanyId(currentCompany.id),
          applicationsAPI.getAll()
        ]);

        const jobIds = new Set(fetchedJobs.map(j => j.id));
        const filteredApps = allApps.filter(a => jobIds.has(a.job_id));

        setApplications(filteredApps);
        setJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user?.id, user?.role, user?.full_name]);

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;
    setIsUpdatingCompany(true);
    try {
      const updatedData = {
        name: companyForm.name,
        industry: companyForm.industry,
        size: companyForm.size as "Small" | "Medium" | "Large",
        location: companyForm.location,
        description: companyForm.description,
        website: companyForm.website,
      };
      await companiesAPI.update(company.id, updatedData);
      setCompany(prev => prev ? { ...prev, ...updatedData } : null);
      setIsEditCompanyModalOpen(false);
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company profile.");
    } finally {
      setIsUpdatingCompany(false);
    }
  };

  const stats = [
    { title: t('admin_dashboard.stats.active_jobs'), value: jobs.filter(j => j.status === 'active').length, icon: Briefcase, color: 'bg-indigo-500' },
    { title: t('admin_dashboard.stats.total_applications'), value: applications.length, icon: Users, color: 'bg-emerald-500' },
    { title: t('admin_dashboard.stats.pending_review'), value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'bg-amber-500' },
    { title: t('admin_dashboard.stats.recent_hires'), value: applications.filter(a => a.status === 'accepted').length, icon: CheckCircle, color: 'bg-indigo-500' },
  ];

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold">{t('admin_dashboard.title')}</h1>
          <p className="text-slate-500">{t('admin_dashboard.welcome', { name: user?.full_name })}</p>
        </div>
        <Link to="/admin-jobs">
          <Button className="gap-2"> <Plus className="w-5 h-5" /> {t('admin_dashboard.post_new_job')}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i}>
            <StatCard
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              colorClass={stat.color}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold italic text-slate-900 dark:text-white">{t('admin_dashboard.recent_applications')}</h2>
            <Link to="/admin-applications">
              <Button variant="ghost" className="text-indigo-500 font-bold text-sm">{t('admin_dashboard.view_all')}</Button>
            </Link>
          </div>

          <GlassCard className="p-0 border border-white/5 bg-white dark:bg-white/5 backdrop-blur-md" hover={false}>
            <div className="overflow-visible">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/10 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200 dark:border-white/5">
                    <th className="px-6 py-5">{t('admin_applications.table.candidate')}</th>
                    <th className="px-6 py-5">{t('admin_applications.table.job_offer')}</th>
                    <th className="px-6 py-5">{t('admin_applications.table.status')}</th>
                    <th className="px-6 py-5">{t('admin_applications.table.applied_date')}</th>
                    <th className="px-6 py-5 text-center">{t('admin_applications.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center font-bold text-indigo-500">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                      </td>
                    </tr>
                  ) : recentApplications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-slate-500">
                        {t('admin_dashboard.no_applications')}
                      </td>
                    </tr>
                  ) : recentApplications.map((app, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 dark:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={getAppCandidateName(app)} size="sm" />
                          <div className="flex flex-col">
                            <Link
                              to={`/profile/${app.user_id}`}
                              className="text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-500 transition-colors"
                            >
                              {getAppCandidateName(app)}
                            </Link>
                            <span className="text-[10px] text-slate-500 font-medium">{getAppCandidateEmail(app)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-400">{getAppJobTitle(app)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'pending' ? 'warning' : 'info'}>{t(`admin_applications.status.${app.status}`)}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block text-left">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={processingId === app.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === app.id ? null : app.id);
                            }}
                          >
                            {processingId === app.id ? <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> : <MoreHorizontal className="w-4 h-4" />}
                          </Button>

                          <AnimatePresence>
                            {openMenuId === app.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className={cn(
                                    "absolute right-0 w-48 glass rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50",
                                    i >= recentApplications.length - 2 && i !== 0 ? "bottom-full mb-1" : "top-full mt-1"
                                  )}
                                >
                                  <button onClick={() => { setSelectedApp(app); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                                    <Eye className="w-4 h-4 text-indigo-400" /> {t('admin_applications.view')}
                                  </button>
                                  <button onClick={() => { navigate(`/profile/${app.user_id}`); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-2 font-medium">
                                    <Users className="w-4 h-4 text-indigo-400" /> {t('admin_applications.view')} {t('common.profile')}
                                  </button>
                                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                  <button
                                    disabled={app.status === 'accepted'}
                                    onClick={() => { handleStatusChange(app.id, 'accepted'); setOpenMenuId(null); }}
                                    className="w-full text-left px-4 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg text-sm transition-colors text-emerald-600 dark:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold"
                                  >
                                    <CheckCircle className="w-4 h-4" /> {t('admin_applications.accept')}
                                  </button>
                                  <button
                                    disabled={app.status === 'rejected'}
                                    onClick={() => { handleStatusChange(app.id, 'rejected'); setOpenMenuId(null); }}
                                    className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg text-sm transition-colors text-rose-600 dark:text-rose-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-bold"
                                  >
                                    <XCircle className="w-4 h-4" /> {t('admin_applications.reject')}
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <div className="flex justify-between items-center mt-12">
            <h2 className="text-2xl font-bold">{t('admin_dashboard.active_postings')}</h2>
            <Link to="/admin-jobs">
              <Button variant="ghost" className="text-indigo-400 text-sm font-bold">{t('admin_dashboard.manage_postings')}</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-full py-10 flex justify-center text-indigo-500">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            ) : jobs.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-500 space-y-4">
                <p>{t('admin_dashboard.no_active_postings')}</p>
              </div>
            ) : jobs.slice(0, 2).map(job => (
              <div key={job.id}>
                <GlassCard className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{job.title}</h4>
                      <p className="text-xs text-slate-500">{job.location} • {t(`jobs.types.${job.job_type.toLowerCase().replace('-', '_')}`)}</p>
                    </div>
                    <Badge variant="success">{t('common.active')}</Badge>
                  </div>
                  <div className="flex items-center gap-6 mt-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">12</p>
                      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">{t('admin_jobs.applied')}</p>
                    </div>
                    <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-900 dark:text-white">4</p>
                      <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">{t('admin_jobs.new')}</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">

          {/* Company Profile Widget */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('admin_dashboard.company_profile')}</h2>
               {company && (
                 <Button variant="ghost" size="sm" className="gap-2 text-indigo-500" onClick={() => setIsEditCompanyModalOpen(true)}>
                   <Edit2 className="w-4 h-4" /> {t('admin_dashboard.edit')}
                 </Button>
               )}
            </div>
            
            {isLoading ? (
               <div className="p-8 text-center text-indigo-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
            ) : company ? (
               <GlassCard className="p-6" hover={false}>
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-2xl font-bold border border-indigo-500/20">
                      {company.logo || <Building2 className="w-8 h-8 text-indigo-400" />}
                   </div>
                   <div>
                     <h3 className="font-bold text-slate-900 dark:text-white text-lg">{company.name}</h3>
                     <p className="text-xs text-indigo-500 font-bold uppercase tracking-widest">{t(`admin_dashboard.edit_company.industries.${company.industry.toLowerCase().replace(' ', '_')}`)}</p>
                   </div>
                 </div>
                 
                 <div className="space-y-3 mb-6">
                   <div className="flex items-center gap-3 text-sm text-slate-500">
                     <MapPin className="w-4 h-4 text-slate-400" /> {company.location}
                   </div>
                   <div className="flex items-center gap-3 text-sm text-slate-500">
                     <Users className="w-4 h-4 text-slate-400" /> {t(`admin_dashboard.edit_company.sizes.${company.size.toLowerCase()}`)} {t('admin_dashboard.employees')}
                   </div>
                 </div>

                 <div className="pt-6 border-t border-slate-200 dark:border-white/10">
                   <p className="text-xs text-slate-500 italic line-clamp-3 leading-relaxed">
                     {company.description || t('admin_dashboard.no_description')}
                   </p>
                 </div>
               </GlassCard>
            ) : (
               <div className="text-sm text-slate-500 italic">{t('admin_dashboard.no_company')}</div>
            )}
          </div>

          {/* Activity Tracker */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('admin_dashboard.recruitment_activity')}</h2>
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="p-6">
                <div className="relative pl-8 border-l border-slate-200 dark:border-white/10 space-y-8">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">{t('admin_dashboard.no_activity')}</div>
                  ) : (
                    notifications.slice(0, 5).map((n, i) => (
                      <div key={n.id} className="relative">
                        <div className={cn(
                          "absolute -left-[41px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-[#020617]",
                          n.type === 'application' ? "bg-indigo-500" : "bg-cyan-500",
                          i === 0 && "animate-pulse"
                        )} />
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h5>
                        <p className="text-[10px] text-slate-500 mt-1">{n.message}</p>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black mt-2 uppercase tracking-tighter">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="p-4 bg-indigo-600/5 dark:bg-indigo-600/10 border-t border-slate-100 dark:border-white/5">
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-black tracking-tighter">
                  {t('admin_dashboard.real_time_log')}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{t('admin_dashboard.infrastructure_status')}</h3>
            <div className="space-y-4">
              {[
                { label: t('admin_dashboard.cloud_database'), status: t('admin_dashboard.optimal'), icon: CheckCircle, color: 'text-emerald-500' },
                { label: t('admin_dashboard.email_server'), status: t('admin_dashboard.ready'), icon: CheckCircle, color: 'text-emerald-500' },
                { label: t('admin_dashboard.auth_provider'), status: t('admin_dashboard.verified'), icon: CheckCircle, color: 'text-emerald-500' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 glass rounded-xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-indigo-500/10 dark:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                      <item.icon className={cn("w-4 h-4", item.color)} />
                    </div>
                    <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-tight">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedApp && (
          <ApplicationDetailsModal
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>

      {/* Edit Company Modal */}
      <AnimatePresence>
        {isEditCompanyModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditCompanyModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic">{t('admin_dashboard.edit_company.title')}</h2>
                <button onClick={() => setIsEditCompanyModalOpen(false)} className="p-2 hover:bg-white dark:bg-white/5 rounded-full transition-colors text-slate-500">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <form className="grid grid-cols-2 gap-6 relative z-10" onSubmit={handleUpdateCompany}>
                <div className="col-span-2">
                  <Input 
                    label={t('admin_dashboard.edit_company.name')} 
                    placeholder={t('admin_dashboard.edit_company.name_placeholder')} 
                    value={companyForm.name}
                    onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1 relative group">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">{t('admin_dashboard.edit_company.industry')}</label>
                  <div className="relative">
                    <select 
                      className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 transition-all font-medium appearance-none pr-10"
                      value={companyForm.industry}
                      onChange={(e) => setCompanyForm({...companyForm, industry: e.target.value})}
                    >
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="">{t('admin_dashboard.edit_company.select_industry')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Technology">{t('admin_dashboard.edit_company.industries.technology')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Healthcare">{t('admin_dashboard.edit_company.industries.healthcare')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Finance">{t('admin_dashboard.edit_company.industries.finance')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Education">{t('admin_dashboard.edit_company.industries.education')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Manufacturing">{t('admin_dashboard.edit_company.industries.manufacturing')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Retail">{t('admin_dashboard.edit_company.industries.retail')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Construction">{t('admin_dashboard.edit_company.industries.construction')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Agriculture">{t('admin_dashboard.edit_company.industries.agriculture')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Energy">{t('admin_dashboard.edit_company.industries.energy')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Transportation">{t('admin_dashboard.edit_company.industries.transportation')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Hospitality">{t('admin_dashboard.edit_company.industries.hospitality')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Media">{t('admin_dashboard.edit_company.industries.media')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Real Estate">{t('admin_dashboard.edit_company.industries.real_estate')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Telecommunications">{t('admin_dashboard.edit_company.industries.telecommunications')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Software Development">{t('admin_dashboard.edit_company.industries.software_development')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="E-commerce">{t('admin_dashboard.edit_company.industries.ecommerce')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Logistics">{t('admin_dashboard.edit_company.industries.logistics')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Marketing">{t('admin_dashboard.edit_company.industries.marketing')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Consulting">{t('admin_dashboard.edit_company.industries.consulting')}</option>
                       <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Other">{t('admin_dashboard.edit_company.industries.other')}</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">{t('admin_dashboard.edit_company.size')}</label>
                  <select 
                    className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 transition-all font-medium appearance-none"
                    value={companyForm.size}
                    onChange={(e) => setCompanyForm({...companyForm, size: e.target.value as "Small" | "Medium" | "Large" | ""})}
                  >
                     <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Small">{t('admin_dashboard.edit_company.sizes.small')}</option>
                     <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Medium">{t('admin_dashboard.edit_company.sizes.medium')}</option>
                     <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Large">{t('admin_dashboard.edit_company.sizes.large')}</option>
                  </select>
                </div>
                <Input 
                  label={t('admin_dashboard.edit_company.location')} 
                  placeholder={t('admin_dashboard.edit_company.location_placeholder')} 
                  value={companyForm.location}
                  onChange={(e) => setCompanyForm({...companyForm, location: e.target.value})}
                />
                <Input 
                  label={t('admin_dashboard.edit_company.website')} 
                  placeholder={t('admin_dashboard.edit_company.website_placeholder')} 
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                />
                <div className="col-span-2 space-y-1">
                  <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">{t('admin_dashboard.edit_company.description')}</label>
                  <textarea 
                    rows={4} 
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500/50 transition-all" 
                    placeholder={t('admin_dashboard.edit_company.description_placeholder')} 
                    value={companyForm.description} 
                    onChange={(e) => setCompanyForm({...companyForm, description: e.target.value})} 
                  />
                </div>
                <div className="col-span-2 pt-6">
                  <Button type="submit" className="w-full h-14 text-lg" isLoading={isUpdatingCompany}>
                    {isUpdatingCompany ? t('admin_dashboard.edit_company.saving') : t('admin_dashboard.edit_company.save')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

