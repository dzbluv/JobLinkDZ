import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle2, Building2, Briefcase, Loader2 } from 'lucide-react';
import type { JobOffer } from '../data/mockJobs';
import { jobsAPI, applicationsAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { GlassCard, Input, Badge } from '../components/ui/Shared';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { FileUpload } from '../components/ui/FileUpload';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotFound from './NotFound';

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [job, setJob] = useState<JobOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      try {
        const data = await jobsAPI.getById(id);
        setJob(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (isSuccess) {
      interval = setInterval(() => {
        setCountdown(prev => Math.max(0, prev - 1));
      }, 1000);

      timer = setTimeout(() => {
        navigate('/candidate-dashboard');
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isSuccess, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-32 flex justify-center text-indigo-500">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!job) return <NotFound />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !user?.id) return;

    setIsSubmitting(true);
    
    try {
      await applicationsAPI.create({
        candidate_id: user.id,
        candidate_name: user.full_name || 'Anonymous candidate',
        job_offer_id: job.id,
        status: 'pending',
        cv_url: selectedFile.name, // Pseudo url
        cover_message: message,
        job_title: job.title,
        company_name: job.company,
        company_id: job.company_id,
        created_at: new Date().toISOString()
      });

      addNotification({
        userId: job.owner_id || 'admin', 
        title: 'New Job Application',
        message: `${user?.full_name} has applied for the ${job.title} position at ${job.company}.`,
        type: 'application',
        meta: { jobId: job.id, applicantId: user?.id }
      });

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert('Failed to submit application. Ensure you are signed in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <Breadcrumbs 
        items={[
          { label: 'Jobs', path: '/jobs' },
          { label: job.title, path: `/jobs/${job.id}` },
          { label: 'Apply' }
        ]} 
      />
      <Link to={`/jobs/${id}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-8 transition-colors group">
         <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to job details
      </Link>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="apply-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="mb-10 text-center">
              <Badge variant="info">Applying for</Badge>
              <h1 className="text-4xl font-bold mt-4 mb-2">{job.title}</h1>
              <div className="flex items-center justify-center gap-2 text-slate-500">
                 <Building2 className="w-4 h-4" /> {job.company} • {job.location}
              </div>
            </div>

            <GlassCard className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div>
                   <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</div>
                     Your Information
                   </h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input label="Full Name" value={user?.full_name || ''} readOnly disabled />
                      <Input label="Email Address" value={user?.email || ''} readOnly disabled />
                   </div>
                   <p className="text-xs text-slate-400 mt-4">
                     These details are pulled from your profile. Update them in your profile settings if needed.
                   </p>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-800" />

                <div>
                   <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">2</div>
                     Upload your CV
                   </h3>
                   <FileUpload onFileSelect={setSelectedFile} />
                   {/* 
                     NOTE FOR SUPABASE INTEGRATION:
                     1. Use supabase-js storage API: supabase.storage.from('cvs').upload(...)
                     2. Then insert a record into 'applications' table with candidate_id, job_offer_id, and the returned cv_url.
                   */}
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-800" />

                <div>
                   <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">3</div>
                     Message to recruiter (Optional)
                   </h3>
                   <textarea 
                     rows={5}
                     placeholder="Why are you a great fit for this role?"
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     className="w-full px-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                   />
                </div>

                <div className="pt-4">
                   <Button 
                     type="submit" 
                     className="w-full h-14 text-xl" 
                     disabled={!selectedFile || isSubmitting}
                     isLoading={isSubmitting}
                   >
                     Submit Application <Send className="w-5 h-5 ml-2" />
                   </Button>
                   {!selectedFile && (
                     <p className="text-center text-sm text-rose-500 mt-2 font-medium">
                       Please upload your CV before submitting.
                     </p>
                   )}
                </div>
              </form>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="apply-success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="relative mb-12">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0, rotate: -45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    className="w-28 h-28 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 relative z-10"
                  >
                     <CheckCircle2 className="w-14 h-14" />
                  </motion.div>
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1.6], opacity: [0.5, 0.2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-emerald-500 rounded-[2.5rem]"
                  />
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-slate-950 z-20">
                    <Briefcase className="w-6 h-6" />
                  </div>
                </div>
                
                <h1 className="text-6xl font-black mb-6 text-slate-900 dark:text-white italic tracking-tighter">SUCCESS!</h1>
                <p className="text-xl text-slate-400 max-w-lg mx-auto leading-relaxed mb-10">
                  Your application for <span className="text-slate-900 dark:text-white font-bold">{job.title}</span> has been securely delivered to <span className="text-indigo-600 dark:text-indigo-400 font-bold">{job.company}</span>.
                </p>

                <div className="w-full max-w-sm glass-card border-white/5 p-8 rounded-[2rem] mb-12">
                  <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                    <span>Redirecting to Dashboard</span>
                    <span className="text-indigo-400 italic text-sm">{countdown}s</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 3, ease: "linear" }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                   <Link to="/jobs">
                     <Button className="h-14 px-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-2xl shadow-indigo-600/20 text-xs font-black uppercase tracking-widest gap-2">
                       Browse More Jobs <ArrowLeft className="w-4 h-4 rotate-180" />
                     </Button>
                   </Link>
                   <Link to="/dashboard">
                     <Button variant="ghost" className="h-14 px-10 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 text-xs font-black uppercase tracking-widest transition-all">
                       My Dashboard
                     </Button>
                   </Link>
                </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
