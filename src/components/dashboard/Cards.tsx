import React from 'react';
import { MapPin, Briefcase, DollarSign, Clock, ChevronRight, User, Calendar, Search, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import type { JobOffer } from '../../data/mockJobs';
import { GlassCard, Badge } from '../ui/Shared';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { type Application, getAppCandidateName, getAppJobTitle, getAppCompanyName } from '../../data/mockApplications';

export function JobCard({ job }: { job: JobOffer }) {
  return (
    <GlassCard className="flex flex-col h-full border-l-4 border-l-indigo-500 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <Link to={`/companies/${job.company_id}`} className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center p-2 flex-shrink-0 overflow-hidden border border-slate-200 dark:border-white/10 group-hover:border-indigo-500/50 transition-all group/logo">
             {job.logo ? (
               <img src={job.logo} alt={job.company} className="w-full h-full object-contain group-hover/logo:scale-110 transition-transform" referrerPolicy="no-referrer" />
             ) : (
               <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold uppercase transition-transform group-hover/logo:scale-110">
                 {job.company.substring(0, 1)}
               </div>
             )}
          </Link>
          <div>
            <Link to={`/jobs/${job.id}`}>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 italic">{job.title}</h3>
            </Link>
            <Link to={`/companies/${job.company_id}`} className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline transition-colors block mt-0.5">
              {job.company}
            </Link>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              <MapPin className="w-3 h-3" />
              {job.location}
            </div>
          </div>
        </div>
        <Badge 
          variant={job.job_type === 'Full-time' ? 'info' : 'default'}
          className="group-hover:scale-105 transition-transform"
          title={`${job.job_type} position - ${
            job.job_type === 'Full-time' ? 'Standard 40h/week commitment' :
            job.job_type === 'Part-time' ? 'Flexible hours under 40h/week' :
            job.job_type === 'Remote' ? 'Work from anywhere' :
            job.job_type === 'Contract' ? 'Fixed-term project engagement' :
            job.job_type === 'Internship' ? 'Learning and development role' :
            job.job_type
          }`}
        >
          {job.job_type}
        </Badge>
      </div>

      <div className="space-y-2 mb-6 flex-grow">
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic group-hover:text-slate-300 transition-colors">
          {job.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
        <span className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{job.salary_range}</span>
        <Link to={`/jobs/${job.id}`} className="group/btn">
          <Button size="sm" className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white group-hover/btn:bg-indigo-600 group-hover/btn:text-slate-900 dark:text-white transition-all gap-2 flex items-center border-none">
            View Details
            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}

export function ApplicationCard({ application }: { application: Application }) {
  const statusConfig = {
    pending: { label: 'Pending', variant: 'warning', icon: Clock, color: 'text-amber-600 dark:text-amber-400' },
    reviewing: { label: 'Reviewing', variant: 'info', icon: Search, color: 'text-indigo-600 dark:text-indigo-400' },
    accepted: { label: 'Accepted', variant: 'success', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400' },
    rejected: { label: 'Rejected', variant: 'error', icon: XCircle, color: 'text-rose-600 dark:text-rose-400' },
  };

  const config = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = config.icon;

  return (
    <GlassCard className="flex flex-col h-full border-t-4 border-t-indigo-500 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all group" hover={true}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white italic group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase tracking-tight line-clamp-1">{getAppJobTitle(application)}</h3>
          <Link to={`/companies/${application.jobs?.company_id || 'c1'}`} className="text-xs font-black text-slate-500 uppercase tracking-widest mt-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block">
            {getAppCompanyName(application)}
          </Link>
        </div>
        <Badge variant={config.variant as any} className="capitalize flex items-center gap-1.5 px-3 py-1 group-hover:scale-105 transition-transform">
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </Badge>
      </div>

      <div className="flex items-center gap-4 p-4 mb-6 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/5 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/20 transition-all">
        <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 group-hover:scale-110 transition-transform">
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-0.5">Applicant</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{getAppCandidateName(application)}</p>
        </div>
        <Link to={`/candidate/${application.user_id}`}>
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-white hover:bg-indigo-600 transition-all">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      <div className="flex items-center justify-between mt-auto pt-5 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <p className="text-[10px] font-bold uppercase tracking-widest">
            Applied {new Date(application.created_at).toLocaleDateString()}
          </p>
        </div>
        <Link to={`/jobs/${application.job_id}`} className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-tighter hover:text-slate-950 dark:hover:text-slate-900 dark:text-white transition-colors italic group/specs">
          Job Specs
          <ChevronRight className="w-3.5 h-3.5 group-hover/specs:translate-x-1 transition-transform" />
        </Link>
      </div>
    </GlassCard>
  );
}

