import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Clock, CheckCircle, XCircle, Search, 
  Settings, User as UserIcon, Bell, ExternalLink, ArrowRight, Star, Sparkles,
  AlertCircle, Loader2, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Avatar } from '../components/ui/Avatar';
import type { Application } from '../data/mockApplications';
import type { JobOffer } from '../data/mockJobs';
import { applicationsAPI, jobsAPI } from '../services/api';
import { GlassCard, StatCard, Badge } from '../components/ui/Shared';
import { ApplicationCard, JobCard } from '../components/dashboard/Cards';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [allJobs, setAllJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllApplications, setShowAllApplications] = useState(false);

  const handleDeleteApplication = async (appId: string) => {
    try {
      await applicationsAPI.delete(appId);
      setApplications(prev => prev.filter(app => app.id !== appId));
    } catch (error) {
      console.error("Failed to delete application:", error);
    }
  };



  useEffect(() => {
    async function fetchData() {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const [apps, jobs] = await Promise.all([
          applicationsAPI.getByUserId(user.id),
          jobsAPI.getAll()
        ]);
        setApplications(apps);
        setAllJobs(jobs);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user?.id]);
  
  const stats = [
    { title: 'Total Applications', value: applications.length, icon: FileText, color: 'bg-indigo-500' },
    { title: 'Pending', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'bg-amber-500' },
    { title: 'Accepted', value: applications.filter(a => a.status === 'accepted').length, icon: CheckCircle, color: 'bg-emerald-500' },
    { title: 'Rejected', value: applications.filter(a => a.status === 'rejected').length, icon: XCircle, color: 'bg-rose-500' },
  ];

  // Logic for recommended jobs based on application history
  const recommendedJobs = useMemo(() => {
    if (!user || allJobs.length === 0) return [];

    // 1. Get IDs of jobs user already applied to
    const appliedJobIds = new Set(applications.map(app => app.job_id));

    // 2. Get the actual job objects user applied to
    const appliedJobs = allJobs.filter(job => appliedJobIds.has(job.id));

    // 3. Collect skills from those applied jobs
    const userSkillsSet = new Set<string>();
    appliedJobs.forEach(job => {
      job.skills?.forEach(skill => userSkillsSet.add(skill));
    });

    const userSkills = Array.from(userSkillsSet);

    // 4. Find jobs user hasn't applied to and rank them by matching skills
    const recommendations = allJobs
      .filter(job => !appliedJobIds.has(job.id))
      .map(job => {
        const matchingSkills = job.skills?.filter(skill => userSkills.includes(skill)) || [];
        return {
          job,
          matchCount: matchingSkills.length
        };
      })
      .filter(item => item.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .map(item => item.job);

    // If no specific matches based on skills, just show most recent active jobs
    if (recommendations.length === 0) {
      return allJobs
        .filter(job => !appliedJobIds.has(job.id) && job.status === 'active')
        .slice(0, 3);
    }

    return recommendations.slice(0, 3);
  }, [user, applications, allJobs]);

  const completionPercentage = 65; // Demo value below 80% to show CTA
  
  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold italic text-slate-950 dark:text-white flex items-center gap-3">
             Welcome back, {user?.full_name}! 
             <span className="text-2xl not-italic">👋</span>
          </h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your career journey.</p>
        </div>
        <div className="flex gap-4">
           <Link to="/profile">
              <Button variant="outline" className="gap-2 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"> 
                <Settings className="w-4 h-4" /> Account Settings
              </Button>
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         {stats.map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
           >
             <StatCard 
               title={stat.title}
               value={stat.value}
               icon={stat.icon}
               colorClass={stat.color}
             />
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-12">
           
           {/* Recommended for You */}
           <section className="space-y-6">
             <div className="flex justify-between items-center px-2">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                   <Sparkles className="w-4 h-4" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic">Recommended for You</h2>
               </div>
               <Link to="/jobs" className="text-indigo-400 text-sm font-bold hover:underline transition-all flex items-center gap-1 group">
                 Explore All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
             </div>

             <div className="grid grid-cols-1 gap-6">
               {recommendedJobs.map((job, i) => (
                 <motion.div
                   key={job.id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 0.2 + (i * 0.1) }}
                 >
                   <JobCard job={job} />
                 </motion.div>
               ))}
               {recommendedJobs.length === 0 && (
                 <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                   <Search className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                   <p className="text-xs text-slate-500 italic">Browse jobs to help us learn your preferences.</p>
                 </div>
               )}
             </div>
           </section>

           {/* Recent Applications */}
           <section className="space-y-6">
             <div className="flex justify-between items-center px-2">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic">Recent Applications</h2>
               <button 
                 onClick={() => setShowAllApplications(true)}
                 className="text-slate-500 text-sm font-bold hover:text-slate-900 dark:text-white transition-colors"
               >
                 View All
               </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {isLoading ? (
                  <div className="col-span-full py-10 flex justify-center text-indigo-500">
                    <Loader2 className="w-10 h-10 animate-spin" />
                  </div>
               ) : (
                 applications.slice(0, 4).map((app, i) => (
                   <motion.div 
                     key={app.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 + (i * 0.1) }}
                   >
                     <ApplicationCard application={app} />
                   </motion.div>
                 ))
               )}
             </div>

             {!isLoading && applications.length === 0 && (
               <div className="text-center py-20 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] backdrop-blur-md">
                 <FileText className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                 <p className="text-lg font-bold text-slate-900 dark:text-white italic">No applications yet</p>
                 <p className="text-sm text-slate-500 mb-8">Start applying to jobs to track your progress here.</p>
                 <Link to="/jobs"><Button className="rounded-full px-8">Browse All Jobs</Button></Link>
               </div>
             )}
           </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           {/* Quick Profile Overlay */}
           <GlassCard className="p-8 text-center bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10" hover={false}>
              <div className="relative inline-block mb-6">
                <Avatar name={user?.full_name || 'User'} initials={user?.avatar_initials || undefined} color={user?.avatar_color || undefined} size="2xl" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white border-4 border-[#020617] shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white italic mb-1">{user?.full_name}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-8 font-black">Verified {user?.role}</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 tracking-tight">
                   <span className="italic">Profile Completion</span>
                   <span className={cn(completionPercentage < 80 ? "text-amber-600 dark:text-amber-400" : "text-indigo-600 dark:text-indigo-400")}>
                     {completionPercentage}%
                   </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/5">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${completionPercentage}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className={cn(
                       "h-full rounded-full transition-all duration-500",
                       completionPercentage < 80 
                         ? "bg-gradient-to-r from-amber-500 to-orange-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                         : "bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                     )} 
                   />
                </div>

                {completionPercentage < 80 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 mt-4"
                  >
                    <div className="flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-left">
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-1">Incomplete Profile</p>
                        <p className="text-[11px] text-slate-400 leading-tight">Complete your profile to unlock premium job opportunities.</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <Link to="/profile">
                <Button className="w-full h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20">
                  Update My Profile
                </Button>
              </Link>
           </GlassCard>

          {/* Activity Tracker */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white italic">Recent Activity</h2>
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-sm dark:shadow-none">
              <div className="p-8">
                <div className="relative pl-8 border-l border-slate-100 dark:border-white/5 space-y-8">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-slate-500 italic py-4">No recent updates yet.</div>
                  ) : (
                    notifications.slice(0, 5).map((n, i) => (
                      <div key={n.id} className="relative">
                        <div className={cn(
                          "absolute -left-[41px] top-1 w-4 h-4 rounded-full border-4 border-white dark:border-[#020617]",
                          n.type === 'status_change' ? "bg-cyan-500" : "bg-indigo-500",
                          i === 0 && "animate-pulse"
                        )} />
                        <h5 className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">{n.title}</h5>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed italic">{n.message}</p>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black mt-2 uppercase tracking-[0.1em]">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5">
                <Link to="/settings" className="text-[10px] font-bold text-slate-500 hover:text-slate-950 dark:hover:text-slate-900 dark:text-white transition-colors flex items-center justify-between group">
                  MANAGE NOTIFICATIONS
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {showAllApplications && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 overscroll-contain">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setShowAllApplications(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-950 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 dark:border-white/5 shrink-0">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic">All Your Applications</h2>
                <button 
                  onClick={() => setShowAllApplications(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {applications.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-500 font-medium">No applications found.</div>
                  ) : (
                    applications.map((app, i) => (
                      <motion.div 
                        key={app.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.05, 0.5) }}
                      >
                        <ApplicationCard application={app} onDelete={handleDeleteApplication} />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

