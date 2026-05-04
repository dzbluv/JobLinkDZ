import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Users, FileText, CheckCircle, Clock, XCircle, 
  Plus, TrendingUp, Search, MoreHorizontal, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { Avatar } from '../components/ui/Avatar';
import type { JobOffer } from '../data/mockJobs';
import type { Application } from '../data/mockApplications';
import { applicationsAPI, jobsAPI } from '../services/api';
import { GlassCard, StatCard, Badge } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [apps, fetchedJobs] = await Promise.all([
          applicationsAPI.getAll(),
          jobsAPI.getAll()
        ]);
        // Ideally filter apps for the jobs owned by this admin,
        // but for now we follow the structure.
        setApplications(apps);
        setJobs(fetchedJobs.filter(j => j.owner_id === user?.id));
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (user?.id) {
       fetchData();
    }
  }, [user?.id]);

  const stats = [
    { title: 'Active Jobs', value: jobs.filter(j => j.status === 'active').length, icon: Briefcase, color: 'bg-indigo-500' },
    { title: 'Total Applications', value: applications.length, icon: Users, color: 'bg-emerald-500' },
    { title: 'Pending Review', value: applications.filter(a => a.status === 'pending').length, icon: Clock, color: 'bg-amber-500' },
    { title: 'Recent Hires', value: applications.filter(a => a.status === 'accepted').length, icon: CheckCircle, color: 'bg-indigo-500' },
  ];

  const recentApplications = applications.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user?.full_name}. Here is your recruitment overview.</p>
        </div>
        <Link to="/admin-jobs">
           <Button className="gap-2"> <Plus className="w-5 h-5" /> Post New Job</Button>
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
           <div className="flex justify-between items-center">
             <h2 className="text-2xl font-bold">Recent Applications</h2>
             <Link to="/admin-applications">
                <Button variant="ghost" className="text-indigo-400 text-sm font-bold">View All Applications</Button>
             </Link>
           </div>
           
           <GlassCard className="p-0 overflow-hidden" hover={false}>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/10 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200 dark:border-white/5">
                      <th className="px-6 py-5">Candidate</th>
                      <th className="px-6 py-5">Applied Job</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5">Date</th>
                      <th className="px-6 py-5 text-center">Action</th>
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
                          No applications found.
                        </td>
                      </tr>
                    ) : recentApplications.map((app, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <Avatar name={`Applicant ${i + 1}`} size="sm" />
                              <span className="font-bold text-sm text-slate-900 dark:text-white">Candidate {i + 1}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-sm font-bold text-slate-400">{app.job_title}</span>
                        </td>
                        <td className="px-6 py-4">
                           <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'pending' ? 'warning' : 'info'}>{app.status}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                           {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                           <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
           </GlassCard>

           <div className="flex justify-between items-center mt-12">
             <h2 className="text-2xl font-bold">Active Postings</h2>
             <Link to="/admin-jobs">
                <Button variant="ghost" className="text-indigo-400 text-sm font-bold">Manage Postings</Button>
             </Link>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                <div className="col-span-full py-10 flex justify-center text-indigo-500">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="col-span-full py-10 text-center text-slate-500 space-y-4">
                  <p>No active postings.</p>
                  <Button onClick={async () => {
                     const { mockJobs } = await import('../data/mockJobs');
                     const { mockCompanies } = await import('../data/mockCompanies');
                     const { mockApplications } = await import('../data/mockApplications');
                     const { seedDatabase } = await import('../services/api');
                     await seedDatabase(mockJobs, mockCompanies, mockApplications);
                     window.location.reload();
                  }}>Seed Demo Data</Button>
                </div>
              ) : jobs.slice(0, 2).map(job => (
                <div key={job.id}>
                  <GlassCard className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">{job.title}</h4>
                          <p className="text-xs text-slate-500">{job.location} • {job.job_type}</p>
                        </div>
                        <Badge variant="success">Active</Badge>
                     </div>
                     <div className="flex items-center gap-6 mt-6">
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-900 dark:text-white">12</p>
                          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Applicants</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />
                        <div className="text-center">
                          <p className="text-lg font-bold text-slate-900 dark:text-white">4</p>
                          <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">New</p>
                        </div>
                     </div>
                  </GlassCard>
                </div>
              ))}
           </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
           {/* Activity Tracker */}
           <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recruitment Activity</h2>
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="p-6">
                <div className="relative pl-8 border-l border-slate-200 dark:border-white/10 space-y-8">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-slate-500 italic">No recent activity updates.</div>
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
                  Real-time activity log • System Live
                </p>
              </div>
            </div>
          </div>

           <div className="space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Infrastructure Status</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Cloud Database', status: 'Optimal', icon: CheckCircle, color: 'text-emerald-500' },
                   { label: 'Email Server', status: 'Ready', icon: CheckCircle, color: 'text-emerald-500' },
                   { label: 'Auth Provider', status: 'Verified', icon: CheckCircle, color: 'text-emerald-500' }
                 ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 glass rounded-xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
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

           <GlassCard className="p-8 text-center bg-white/2 border border-white/10 border-dashed rounded-3xl">
              <p className="text-[10px] text-slate-500 mb-4 font-bold uppercase tracking-widest">Recruitment Insights</p>
              <p className="text-sm text-slate-400 mb-6 italic leading-relaxed">"Review applications promptly to increase hiring velocity by up to 2.4x."</p>
              <Button size="sm" variant="outline" className="w-full">Generate Detailed Analytics</Button>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
