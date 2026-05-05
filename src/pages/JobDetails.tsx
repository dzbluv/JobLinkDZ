import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, MapPin, Briefcase, Coins, Calendar, Clock, 
  ChevronLeft, Share2, Bookmark, CheckCircle2, AlertCircle, Loader2 
} from 'lucide-react';
import type { JobOffer } from '../data/mockJobs';
import { jobsAPI } from '../services/api';
import { Button } from '../components/ui/Button';
import { GlassCard, Badge } from '../components/ui/Shared';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import NotFound from './NotFound';

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState<JobOffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-32 flex justify-center text-indigo-500">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  if (!job) return <NotFound />;

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <Breadcrumbs 
        items={[
          { label: 'Jobs', path: '/jobs' },
          { label: job.title }
        ]} 
      />
      <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary mb-8 transition-colors group">
         <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to job search
      </Link>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column: Content */}
        <div className="flex-1 space-y-10">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                 <Badge variant="info">{job.job_type}</Badge>
                 <Badge variant="default">{job.location}</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white italic">{job.title}</h1>
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium text-sm">
                 <Link to={`/companies/${job.company_id}`} className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Building2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> {job.company}
                 </Link>
                 <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
                 <span>Posted on {new Date(job.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex gap-4">
               <Button variant="outline" size="icon" className="rounded-full"><Share2 className="w-5 h-5" /></Button>
               <Button variant="outline" size="icon" className="rounded-full"><Bookmark className="w-5 h-5" /></Button>
            </div>
          </header>

          <GlassCard className="p-8 space-y-8" hover={false}>
            <div>
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {job.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white italic">
                     <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Requirements
                  </h3>
                  <ul className="space-y-3">
                     {job.requirements.map((req, i) => (
                       <li key={i} className="flex gap-3 text-slate-400 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                          {req}
                       </li>
                     ))}
                  </ul>
               </div>
               <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white italic">
                     <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Responsibilities
                  </h3>
                  <ul className="space-y-3">
                     {job.responsibilities.map((res, i) => (
                       <li key={i} className="flex gap-3 text-slate-400 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                          {res}
                       </li>
                     ))}
                  </ul>
               </div>
            </div>

            <div>
               <h3 className="text-lg font-bold mb-4">Required Skills</h3>
               <div className="flex flex-wrap gap-3">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
                       {skill}
                    </span>
                  ))}
               </div>
            </div>
          </GlassCard>

          <div className="flex flex-col md:flex-row items-center gap-6 p-8 glass rounded-3xl border border-warning/20 bg-warning/5">
             <AlertCircle className="w-10 h-10 text-amber-500" />
             <div className="max-w-xl">
                <h4 className="font-bold">Security Advice</h4>
                <p className="text-sm text-slate-500 mt-1">
                   Beware of scammers asking for payment while recruiting. JobLinkDZ never asks for money to apply for a job. If you notice something suspicious, report the job offer immediately.
                </p>
             </div>
          </div>
        </div>

        <aside className="lg:w-96 space-y-8 sticky top-24 self-start h-fit">
           <GlassCard className="p-8 border-indigo-500/20 bg-indigo-500/5" hover={false}>
              <h3 className="text-xl font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-tighter">Job Overview</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Location', value: job.location, icon: MapPin, color: 'text-indigo-400' },
                   { label: 'Job Type', value: job.job_type, icon: Briefcase, color: 'text-indigo-400' },
                   { label: 'Salary', value: job.salary_range, icon: Coins, color: 'text-indigo-400' },
                   { label: 'Hiring Status', value: job.status.toUpperCase(), icon: Calendar, color: 'text-indigo-400' },
                   { label: 'Working Hours', value: '40 hours / week', icon: Clock, color: 'text-indigo-400' },
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center flex-shrink-0">
                         <item.icon className={cn("w-5 h-5", item.color)} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">{item.label}</p>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{item.value}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="h-px bg-white/10 my-8" />
              <Link to={`/apply/${job.id}`}>
                <Button className="w-full h-14 text-lg">Apply for this position</Button>
              </Link>
              <p className="text-center text-[10px] text-slate-500 mt-4 leading-relaxed uppercase font-bold tracking-widest">
                 System Secure • Official Posting
              </p>
           </GlassCard>

           <div className="p-8 rounded-3xl bg-white/2 border border-slate-200 dark:border-white/10 text-center backdrop-blur-md">
              <h4 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Company Profile</h4>
              {job.logo && (
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-3 mx-auto mb-4 border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl">
                   <img src={job.logo} alt={job.company} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              )}
              <p className="text-indigo-400 font-bold text-xl mb-4 italic">{job.company}</p>
              <p className="text-xs text-slate-400 mb-8 line-clamp-3 leading-relaxed italic">
                 Explore innovation and career growth at {job.company}. Be part of a team defining the future in Algeria.
              </p>
              <Link to={`/companies/${job.company_id}`}>
                <Button variant="outline" size="sm" className="w-full">View Company Profile</Button>
              </Link>
           </div>
        </aside>
      </div>
    </div>
  );
}
