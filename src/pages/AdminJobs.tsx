import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, TrendingUp, Search, MoreHorizontal, Filter, 
  Trash2, Edit2, Copy, Download, Eye, Clock, CheckCircle, XCircle, Loader2, MapPin, Building2, Check
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { JobOffer } from '../data/mockJobs';
import type { Application } from '../data/mockApplications';
import { jobsAPI, applicationsAPI, companiesAPI } from '../services/api';
import { GlassCard, Badge, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useJobAlerts } from '../context/JobAlertContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export default function AdminJobs() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { checkJobAgainstAlerts } = useJobAlerts();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const [isPosting, setIsPosting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    type: 'Full-time',
    description: '',
    workHours: '40'
  });

  useEffect(() => {
     async function fetchData() {
        if (!user?.id) return;
        setIsLoading(true);
        try {
           let company = await companiesAPI.getByOwnerId(user.id);
           
            if (!company && user.role === 'admin') {
              const newCompanyId = await companiesAPI.create({
                owner_id: user.id,
                name: t('admin_jobs.defaults.auto_company_name', { name: user.full_name }),
                industry: 'Technology',
                size: 'Medium',
                location: 'Algiers',
                description: t('admin_jobs.defaults.auto_company_desc')
              });
              company = await companiesAPI.getById(newCompanyId);
            }

           if (company) {
             setCompanyId(company.id);
             setCompanyName(company.name);
             setForm(prev => ({ ...prev, company: company.name }));
             
             const [fetchedJobs, allApps] = await Promise.all([
               jobsAPI.getByCompanyId(company.id),
               applicationsAPI.getAll()
             ]);
             
             const jobIds = new Set(fetchedJobs.map(j => j.id));
             setJobs(fetchedJobs);
             setApplications(allApps.filter(a => jobIds.has(a.job_id)));
           }
        } catch(e) {
           console.error('[AdminJobs] fetchData error:', e);
        } finally {
           setIsLoading(false);
        }
     }
     fetchData();
  }, [user?.id, user?.role, user?.full_name]);

  useEffect(() => {
    if (editingJobId) {
      const job = jobs.find(j => j.id === editingJobId);
      if (job) {
        setForm({
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary_range,
          type: job.job_type,
          description: job.description,
          workHours: job.work_hours_per_week?.toString() || '40'
        });
      }
    } else {
      setForm({ 
        title: '', 
        company: companyName, 
        location: 'Algiers', 
        salary: '', 
        type: 'Full-time', 
        description: '', 
        workHours: '40' 
      });
    }
  }, [editingJobId, jobs, companyName]);

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !companyId) {
      alert(t('admin_jobs.alerts.company_setup'));
      return;
    }
    setIsPosting(true);

    try {
      if (editingJobId) {
        const updateData = {
          title: form.title,
          company: form.company,
          location: form.location,
          job_type: form.type as any,
          salary_range: form.salary,
          description: form.description,
          work_hours_per_week: parseInt(form.workHours) || 40
        };
        await jobsAPI.update(editingJobId, updateData);
        setJobs(prev => prev.map(j => j.id === editingJobId ? { ...j, ...updateData } : j));
        setIsModalOpen(false);
        setEditingJobId(null);
      } else {
        const newJob: Omit<JobOffer, 'id'> = {
          title: form.title,
          company: form.company,
          company_id: companyId,
          location: form.location,
          job_type: form.type as any,
          salary_range: form.salary || t('admin_jobs.defaults.competitive'),
          description: form.description || t('admin_jobs.defaults.no_description'),
          skills: [],
          requirements: [],
          responsibilities: [],
          status: 'active',
          created_at: new Date().toISOString(),
          work_hours_per_week: parseInt(form.workHours) || 40
        };

        const newId = await jobsAPI.create(newJob);
        if (newId) {
           const createdJob = { ...newJob, id: newId } as JobOffer;
           setJobs([createdJob, ...jobs]);
           checkJobAgainstAlerts(createdJob);
           setIsModalOpen(false);
        } else {
           alert(t('admin_jobs.alerts.create_failed'));
        }
      }
    } catch (err) {
      console.error('Failed to post job:', err);
      alert(t('admin_jobs.alerts.post_failed'));
    } finally {
      setIsPosting(false);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.company.toLowerCase().includes(search.toLowerCase())
  );

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  const handleBulkClose = async () => {
    for (const id of selectedJobs) {
       await jobsAPI.update(id, { status: 'closed' });
    }
    setJobs(prev => prev.map(job => 
      selectedJobs.includes(job.id) ? { ...job, status: 'closed' as any } : job
    ));
    setSelectedJobs([]);
  };

  const handleBulkDelete = async () => {
    if (confirm(t('admin_jobs.bulk_delete_confirm', { count: selectedJobs.length }))) {
      for (const id of selectedJobs) {
         await jobsAPI.delete(id);
      }
      setJobs(prev => prev.filter(job => !selectedJobs.includes(job.id)));
      setSelectedJobs([]);
    }
  };

  const handleExportCSV = () => {
    const jobsToExport = selectedJobs.length > 0 
      ? jobs.filter(j => selectedJobs.includes(j.id))
      : filteredJobs;
    
    if (jobsToExport.length === 0) return;

    const headers = [
      t('admin_jobs.table.headers.title'),
      t('admin_jobs.table.headers.company'),
      t('admin_jobs.table.headers.location'),
      t('admin_jobs.table.headers.type'),
      t('admin_jobs.table.headers.salary'),
      t('admin_jobs.table.headers.status'),
      t('admin_jobs.table.headers.date_posted')
    ];
    const rows = jobsToExport.map(job => [
      job.title,
      job.company,
      job.location,
      t(`jobs.types.${job.job_type.toLowerCase().replace('-', '_')}`),
      job.salary_range,
      t(`admin_jobs.status.${job.status}`),
      new Date(job.created_at).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `job_postings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('admin_jobs.title')}</h1>
          <p className="text-slate-500">{t('admin_jobs.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}> <Download className="w-4 h-4" /> {t('admin_jobs.export_csv')}</Button>
          <Button className="gap-2" onClick={() => { setEditingJobId(null); setIsModalOpen(true); }}> <Plus className="w-5 h-5" /> {t('admin_jobs.create_new')}</Button>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder={t('admin_jobs.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-11 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-all w-64"
          />
        </div>
        <Button variant="outline" className="gap-2"> <Filter className="w-4 h-4" /> {t('admin_jobs.filters')}</Button>
      </div>

      <div className="space-y-6 pb-24">
        {isLoading ? (
           <div className="py-20 flex justify-center text-indigo-500">
             <Loader2 className="w-12 h-12 animate-spin" />
           </div>
        ) : filteredJobs.length === 0 ? (
           <div className="py-20 text-center text-slate-500">
             {t('admin_jobs.no_jobs_found')}
           </div>
        ) : filteredJobs.map((job) => {
          const jobApplications = applications.filter(app => app.job_id === job.id);
          const totalApplicants = jobApplications.length;
          const newApplicants = jobApplications.filter(app => app.status === 'pending').length;
          const isSelected = selectedJobs.includes(job.id);

          return (
            <motion.div key={job.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard 
                className={`p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 border transition-all duration-300 ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-indigo-500/5' : 'border-white/5'}`} 
                hover={false}
              >
                   <button 
                     onClick={() => toggleJobSelection(job.id)}
                     className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                       isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-200 dark:border-white/10 hover:border-white/30'
                     }`}
                   >
                     {isSelected && <Check className="w-4 h-4 text-slate-900 dark:text-white" />}
                   </button>
                   
                   <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                         <h3 className="text-xl font-bold text-slate-900 dark:text-white italic">{job.title}</h3>
                         <Badge variant={job.status === 'active' ? 'success' : 'error'}>{t(`admin_jobs.status.${job.status}`)}</Badge>
                      </div>
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                         <span className="flex items-center gap-1"><Building2 className="w-4 h-4 text-indigo-400" /> {job.company}</span>
                         <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-indigo-400" /> {job.location}</span>
                         <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-indigo-400" /> {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                   </div>
  
                   <div className="flex items-center gap-10 text-center">
                      <div>
                         <p className="text-xl font-bold text-slate-900 dark:text-white">{totalApplicants}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('admin_jobs.table.applicants')}</p>
                      </div>
                   </div>
  
                   <div className="flex gap-2">
                       <Button variant="ghost" size="icon" onClick={() => {
                          setEditingJobId(job.id);
                          setIsModalOpen(true);
                       }}><Edit2 className="w-5 h-5" /></Button>
                       <Button variant="ghost" size="icon" className="text-rose-500" onClick={async () => {
                          if (confirm(t('admin_jobs.confirm_delete_simple'))) {
                             await jobsAPI.delete(job.id);
                             setJobs(prev => prev.filter(j => j.id !== job.id));
                          }
                       }}><Trash2 className="w-5 h-5" /></Button>
                    </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
             <motion.div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
              <motion.div className="relative z-10 w-full max-w-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 italic">{editingJobId ? t('admin_jobs.modal.edit_title') : t('admin_jobs.modal.post_title')}</h2>
                 <form className="grid grid-cols-2 gap-6" onSubmit={handlePostJob}>
                    <div className="col-span-2">
                      <Input label={t('admin_jobs.modal.job_title')} value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
                    </div>
                    <Input label={t('admin_jobs.modal.salary')} value={form.salary} onChange={(e) => setForm({...form, salary: e.target.value})} />
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest">{t('admin_jobs.modal.job_type')}</label>
                      <select className="w-full bg-white dark:bg-white/5 border border-slate-200 rounded-xl px-4 py-3 text-sm" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
                         <option value="Full-time">{t('admin_jobs.modal.job_type_full_time')}</option>
                         <option value="Contract">{t('admin_jobs.modal.job_type_contract')}</option>
                      </select>
                    </div>
                     <div className="col-span-2 space-y-1">
                        <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest">{t('admin_jobs.modal.description')}</label>
                        <textarea rows={3} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
                     </div>
                     <div className="col-span-2 pt-6">
                        <Button type="submit" className="w-full h-14 text-lg" isLoading={isPosting}>{editingJobId ? t('admin_jobs.modal.update_button') : t('admin_jobs.modal.create_button')}</Button>
                     </div>
                 </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
