import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, CheckCircle, XCircle, Search, Building2, MapPin, Briefcase, Calendar, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, jobsAPI } from '../services/api';
import type { Application } from '../data/mockApplications';
import type { JobOffer } from '../data/mockJobs';
import { GlassCard, Badge } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';

export default function ApplicationDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [application, setApplication] = useState<Application | null>(null);
  const [job, setJob] = useState<JobOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplicationDetails() {
      if (!id || !user?.id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch user's applications to find this specific one
        const apps = await applicationsAPI.getByUserId(user.id);
        const currentApp = apps.find(a => a.id === id);
        
        if (!currentApp) {
          throw new Error("Application not found or you don't have permission to view it.");
        }
        
        setApplication(currentApp);
        
        // Fetch the corresponding job details
        const jobDetails = await jobsAPI.getById(currentApp.job_id);
        setJob(jobDetails || null);
        
      } catch (err: any) {
        console.error("Error fetching application details:", err);
        setError(err.message || "Failed to load application details.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchApplicationDetails();
  }, [id, user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-indigo-500">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest italic">Loading Application...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mb-6" />
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white italic mb-4">Application Not Found</h1>
        <p className="text-slate-500 max-w-md mb-8">{error || "The application you're looking for doesn't exist or has been removed."}</p>
        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const statusConfig = {
    pending: { label: 'Pending Review', description: 'Your application has been received and is waiting to be reviewed.', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
    reviewing: { label: 'Under Review', description: 'The employer is currently reviewing your application.', icon: Search, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    accepted: { label: 'Accepted', description: 'Congratulations! Your application has been accepted.', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    rejected: { label: 'Rejected', description: 'Unfortunately, the employer has decided to move forward with other candidates.', icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
  };

  const config = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <div className="max-w-4xl mx-auto px-8 py-12">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-500 transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <div className="space-y-8">
        {/* Status Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className={`p-8 border-2 ${config.bg} flex flex-col md:flex-row items-center gap-6 text-center md:text-left`} hover={false}>
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 ${config.bg} ${config.color}`}>
              <StatusIcon className="w-10 h-10" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold italic mb-2 ${config.color}`}>{config.label}</h1>
              <p className="text-slate-600 dark:text-slate-300 font-medium">{config.description}</p>
            </div>
          </GlassCard>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Job Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-8"
          >
            <section>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white italic mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" /> Application Details
              </h2>
              
              <GlassCard className="p-8 space-y-6" hover={false}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Applied For</p>
                  <Link to={`/jobs/${job?.id}`} className="inline-block group">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white italic group-hover:text-indigo-500 transition-colors">{job?.title || 'Unknown Job'}</h3>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {job?.company || 'Unknown Company'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {job?.location || 'Unknown Location'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Applied {new Date(application.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100 dark:bg-white/5" />

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Your Cover Letter</p>
                  <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 whitespace-pre-wrap italic">
                    {application.cover_letter || "No cover letter provided."}
                  </div>
                </div>
              </GlassCard>
            </section>
          </motion.div>

          {/* Actions / Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <GlassCard className="p-6" hover={false}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Next Steps</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  Application submitted successfully
                </li>
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400">
                  {application.status === 'pending' ? (
                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                  Employer reviews application
                </li>
                <li className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 opacity-50">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0" />
                  Interview scheduling
                </li>
              </ul>
            </GlassCard>

            <Link to={`/jobs/${job?.id}`} className="block">
              <Button variant="outline" className="w-full justify-between group">
                View Job Posting
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
