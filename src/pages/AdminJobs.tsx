import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Eye, MapPin, 
  Briefcase, MoreVertical, CheckCircle, Clock, Building2,
  Check, XCircle, Slash, Loader2
} from 'lucide-react';
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
           
           // Auto-fix: if recruiter has no company, create a default one
           if (!company && user.role === 'admin') {
             console.log('[AdminJobs] Creating missing company for recruiter...');
             const newCompanyId = await companiesAPI.create({
               owner_id: user.id,
               name: user.full_name + "'s Company",
               industry: 'Technology',
               size: 'Medium',
               location: 'Algiers',
               description: 'Automatically created company profile.'
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
      alert('Your company profile is still being set up. Please try again in a moment.');
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
        setForm({ title: '', company: companyName, location: '', salary: '', type: 'Full-time', description: '', workHours: '40' });
      } else {
        const newJob: Omit<JobOffer, 'id'> = {
          title: form.title,
          company: form.company,
          company_id: companyId,
          location: form.location,
          job_type: form.type as any,
          salary_range: form.salary || 'Competitive',
          description: form.description || 'No description provided.',
          skills: [],
          requirements: [],
          responsibilities: [],
          status: 'active',
          created_at: new Date().toISOString(),
          work_hours_per_week: parseInt(form.workHours) || 40
        };

        console.log('[AdminJobs] Posting job:', newJob);
        const newId = await jobsAPI.create(newJob);
        console.log('[AdminJobs] Created job ID:', newId);
        
        if (newId) {
           const createdJob = { ...newJob, id: newId } as JobOffer;
           setJobs([createdJob, ...jobs]);
           checkJobAgainstAlerts(createdJob);
           setIsModalOpen(false);
           setForm({ title: '', company: companyName, location: '', salary: '', type: 'Full-time', description: '', workHours: '40' });
        } else {
           alert('Failed to create job. Check the browser console for details.');
        }
      }
    } catch (err) {
      console.error('Failed to post job:', err);
      alert('Failed to post job. Please check your connection.');
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

  const handleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(j => j.id));
    }
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
    if (confirm(`Are you sure you want to delete ${selectedJobs.length} selected jobs?`)) {
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

    const headers = ['Title', 'Company', 'Location', 'Type', 'Salary', 'Status', 'Date Posted'];
    const rows = jobsToExport.map(job => [
      job.title,
      job.company,
      job.location,
      job.job_type,
      job.salary_range,
      job.status,
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
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold italic text-slate-900 dark:text-white">Manage Job Offers</h1>
          <p className="text-slate-500">Create, edit, and monitor your current job openings.</p>
        </div>
        <Button className="gap-2" onClick={() => { setEditingJobId(null); setForm({ title: '', company: companyName, location: '', salary: '', type: 'Full-time', description: '', workHours: '40' }); setIsModalOpen(true); }}>
          <Plus className="w-5 h-5" /> Post Job Offer
        </Button>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
           <input 
             type="text"
             placeholder="Search postings..."
             className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 transition-all font-medium"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <Button variant="ghost" className="flex-1 md:flex-none gap-2 text-slate-400 hover:text-slate-900 dark:text-white" onClick={handleSelectAll}>
              {selectedJobs.length === filteredJobs.length && filteredJobs.length > 0 ? 'Deselect All' : 'Select All'}
           </Button>
           <Button variant="outline" className="flex-1 md:flex-none" onClick={handleExportCSV}>Export CSV</Button>
        </div>
      </div>

      <div className="space-y-6 pb-24">
        {isLoading ? (
           <div className="py-20 flex justify-center text-indigo-500">
             <Loader2 className="w-12 h-12 animate-spin" />
           </div>
        ) : filteredJobs.length === 0 ? (
           <div className="py-20 text-center text-slate-500">
             No jobs found.
           </div>
        ) : filteredJobs.map((job) => {
          const jobApplications = applications.filter(app => app.job_id === job.id);
          const totalApplicants = jobApplications.length;
          const newApplicants = jobApplications.filter(app => app.status === 'pending').length;
          const isSelected = selectedJobs.includes(job.id);

          return (
            <motion.div key={job.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <GlassCard 
                className={`p-0 overflow-hidden border transition-all duration-300 ${isSelected ? 'border-indigo-500 ring-1 ring-indigo-500/50 bg-indigo-500/5' : 'border-white/5'}`} 
                hover={false}
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                   <button 
                     onClick={() => toggleJobSelection(job.id)}
                     className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                       isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-200 dark:border-white/10 hover:border-white/30'
                     }`}
                   >
                     {isSelected && <Check className="w-4 h-4 text-slate-900 dark:text-white" />}
                   </button>

                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-200 dark:border-white/10 overflow-hidden p-2">
                      {job.logo ? (
                        <img src={job.logo} alt={job.company} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      ) : (
                        <Briefcase className="w-8 h-8 text-indigo-400" />
                      )}
                   </div>
                   
                   <div className="flex-1 text-center md:text-left">
                      <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-2">
                         <h3 className="text-xl font-bold text-slate-900 dark:text-white italic">{job.title}</h3>
                         <Badge variant={job.status === 'active' ? 'success' : 'error'}>{job.status}</Badge>
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
                         <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Applied</p>
                      </div>
                      <div className="h-10 w-px bg-white/10" />
                      <div>
                         <p className="text-xl font-bold text-slate-900 dark:text-white text-emerald-400">{newApplicants}</p>
                         <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">New</p>
                      </div>
                   </div>
  
                   <div className="flex gap-2">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="text-slate-500 hover:text-indigo-500" 
                         title="View Public Post"
                         onClick={() => window.open(`/jobs/${job.id}`, '_blank')}
                       >
                         <Eye className="w-5 h-5" />
                       </Button>
                       <Button variant="ghost" size="icon" className="text-slate-500 hover:text-indigo-500" title="Edit Job" onClick={() => {
                          setEditingJobId(job.id);
                          setForm({
                             title: job.title,
                             company: job.company,
                             location: job.location,
                             salary: job.salary_range || '',
                             type: job.job_type,
                             description: job.description || '',
                             workHours: (job.work_hours_per_week || 40).toString()
                          });
                          setIsModalOpen(true);
                       }}><Edit2 className="w-5 h-5" /></Button>
                       <Button variant="ghost" size="icon" className="text-slate-500 hover:text-rose-500" title="Delete Job" onClick={async () => {
                          if (confirm('Are you sure you want to delete this job?')) {
                             try {
                               await jobsAPI.delete(job.id);
                               setJobs(prev => prev.filter(j => j.id !== job.id));
                             } catch (err) {
                               console.error("Failed to delete job:", err);
                               alert("Failed to delete job. It might have active applications.");
                             }
                          }
                       }}><Trash2 className="w-5 h-5" /></Button>
                    </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Bulk Actions Bar */}
      <AnimatePresence>
        {selectedJobs.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 glass px-8 py-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl flex items-center gap-8 min-w-[400px]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-slate-900 dark:text-white font-bold animate-pulse">
                {selectedJobs.length}
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Jobs Selected</p>
            </div>
            
            <div className="h-8 w-px bg-white/10" />
            
            <div className="flex gap-4">
              <Button 
                variant="ghost" 
                className="gap-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                onClick={handleBulkClose}
              >
                <XCircle className="w-4 h-4" /> Close Positions
              </Button>
              <Button 
                variant="ghost" 
                className="gap-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4" /> Delete Forever
              </Button>
            </div>
            
            <button 
              onClick={() => setSelectedJobs([])}
              className="ml-4 p-2 hover:bg-white dark:bg-white/5 rounded-full transition-colors text-slate-500"
            >
              <Plus className="w-5 h-5 rotate-45" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsModalOpen(false)}
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
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic">{editingJobId ? 'Edit Job Offer' : 'Post a New Job'}</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white dark:bg-white/5 rounded-full transition-colors text-slate-500">
                     <Plus className="w-6 h-6 rotate-45" />
                   </button>
                </div>
                
                <form className="grid grid-cols-2 gap-6 relative z-10" onSubmit={handlePostJob}>
                    <div className="col-span-2">
                      <Input 
                        label="Job Title" 
                        placeholder="e.g. Senior Backend Engineer" 
                        value={form.title}
                        onChange={(e) => setForm({...form, title: e.target.value})}
                        required
                      />
                    </div>
                    <Input 
                      label="Company" 
                      placeholder="Your Company Name" 
                      value={form.company}
                      onChange={(e) => setForm({...form, company: e.target.value})}
                      required
                      readOnly
                      className="cursor-default"
                    />
                    <Input 
                      label="Location" 
                      placeholder="e.g. Algiers" 
                      value={form.location}
                      onChange={(e) => setForm({...form, location: e.target.value})}
                      required
                    />
                    <Input 
                      label="Salary Range" 
                      placeholder="e.g. 120000 - 180000 DA" 
                      value={form.salary}
                      onChange={(e) => setForm({...form, salary: e.target.value})}
                    />
                    <div className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Job Type</label>
                      <select 
                        className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500/50 transition-all font-medium appearance-none"
                        value={form.type}
                        onChange={(e) => setForm({...form, type: e.target.value})}
                      >
                         <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Full-time">Full-time</option>
                         <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Part-time">Part-time</option>
                         <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Remote">Remote</option>
                         <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white" value="Contract">Contract</option>
                      </select>
                    </div>
                    <Input 
                      label="Work Hours / Week" 
                      placeholder="e.g. 40" 
                      type="number"
                      value={form.workHours}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({...form, workHours: e.target.value})}
                    />
                    <div className="col-span-2 space-y-1">
                       <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest ml-1">Description</label>
                       <textarea rows={3} className="w-full px-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm outline-none focus:border-indigo-500/50 transition-all" placeholder="Enter job description..." value={form.description || ''} onChange={(e) => setForm({...form, description: e.target.value})} />
                    </div>
                    <div className="col-span-2 pt-6">
                       <Button type="submit" className="w-full h-14 text-lg" isLoading={isPosting}>
                         {isPosting ? (editingJobId ? 'Updating...' : 'Posting Live...') : (editingJobId ? 'Update Job Posting' : 'Create Job Posting')}
                       </Button>
                       <p className="text-center text-[10px] text-slate-600 mt-4 uppercase font-bold tracking-widest">
                         {editingJobId ? 'Updates will reflect immediately.' : 'Posting will trigger relevant job alerts to registered candidates.'}
                       </p>
                    </div>
                 </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
