import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, CheckCircle, XCircle, Clock, 
  Eye, Download, MoreHorizontal, User, Mail, ChevronDown, X, FileText, ExternalLink,
  ArrowUpDown, ArrowUp, ArrowDown, Loader2
} from 'lucide-react';
import type { Application } from '../data/mockApplications';
import { applicationsAPI } from '../services/api';
import { GlassCard, Badge, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/ui/Avatar';

function ApplicationDetailsModal({ app, onClose, onStatusChange }: { app: Application, onClose: () => void, onStatusChange: (id: string, status: Application['status']) => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic">{app.candidate_name}</h2>
              <p className="text-sm text-slate-500 font-medium">Application for <span className="text-indigo-400">{app.job_title}</span></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Cover Message
                </h3>
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {app.cover_message}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> CV Preview
                </h3>
                <div className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden">
                  <div className="bg-slate-900 border-b border-white/5 p-4 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white italic">{app.cv_url}</span>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-white">
                           <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-indigo-400">
                           <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                     </div>
                  </div>
                  
                  <div className="aspect-[1/1.4] w-full bg-white p-8 md:p-12 text-slate-900 overflow-y-auto selection:bg-indigo-100 italic">
                    <div className="space-y-6">
                      <div className="border-b-2 border-indigo-600 pb-4">
                        <h1 className="text-3xl font-black uppercase tracking-tighter">{app.candidate_name}</h1>
                        <p className="text-indigo-600 font-bold uppercase tracking-widest text-[10px] mt-1">Full-stack Developer & UI Specialist</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-[9px] uppercase tracking-widest font-bold text-slate-400">
                        <p>Algiers, Algeria</p>
                        <p className="text-right">joblink.dz/profile/ahmed</p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 border-b border-indigo-100 pb-1">Professional Summary</h4>
                        <p className="text-xs leading-relaxed text-slate-700">Dedicated software professional with 5+ years of experience in modern web technologies. Expert in building responsive, accessible, and high-performance applications using React, Node.js, and TypeScript.</p>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 border-b border-indigo-100 pb-1">Experience</h4>
                        <div className="space-y-4">
                           <div className="relative pl-4 border-l-2 border-slate-100">
                              <p className="text-[10px] font-black italic">Senior Developer @ Digital Solutions</p>
                              <p className="text-[8px] text-slate-400 mb-1">2021 - Present</p>
                              <p className="text-[10px] leading-relaxed text-slate-600">Lead a team of 5 developers to deliver cloud-based SaaS products using React and AWS.</p>
                           </div>
                           <div className="relative pl-4 border-l-2 border-slate-100">
                              <p className="text-[10px] font-black italic">Frontend Engineer @ WebCraft DZ</p>
                              <p className="text-[8px] text-slate-400 mb-1">2018 - 2021</p>
                              <p className="text-[10px] leading-relaxed text-slate-600">Refactored legacy jQuery codebase to modern React, improving performance by 40%.</p>
                           </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 border-b border-indigo-100 pb-1">Core Competencies</h4>
                        <div className="flex flex-wrap gap-1.5">
                           {['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind', 'Docker'].map(skill => (
                             <span key={skill} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[8px] font-bold">{skill}</span>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Details</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Status</p>
                    <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'pending' ? 'warning' : 'info'} className="mt-1">
                      {app.status}
                    </Badge>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Applied On</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(app.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Job ID</p>
                    <p className="text-sm font-mono text-indigo-400">#{app.job_offer_id}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                   <Button 
                    variant="outline" 
                    className="w-full text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 gap-2 text-xs"
                    onClick={() => {
                        onStatusChange(app.id, 'accepted');
                        onClose();
                    }}
                  >
                    <CheckCircle className="w-4 h-4" /> Accept
                  </Button>
                   <Button 
                    variant="outline" 
                    className="w-full text-rose-400 border-rose-500/20 hover:bg-rose-500/10 gap-2 text-xs"
                    onClick={() => {
                        onStatusChange(app.id, 'rejected');
                        onClose();
                    }}
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end">
           <Button onClick={onClose} variant="ghost">Close Details</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminApplications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const { addNotification } = useNotifications();

  useEffect(() => {
    async function fetchApps() {
      try {
        const fetched = await applicationsAPI.getAll();
        setApps(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApps();
  }, []);

  const filteredAndSortedApps = useMemo(() => {
    return apps
      .filter(app => 
        (app.candidate_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        app.job_title.toLowerCase().includes(search.toLowerCase()) ||
        app.company_name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [apps, search, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: Application['status']) => {
    setProcessingId(id);
    try {
      await applicationsAPI.updateStatus(id, newStatus);
      const updatedApps = apps.map(app => {
        if (app.id === id) {
          addNotification({
            userId: app.candidate_id,
            title: 'Application Status Updated',
            message: `Your application for ${app.job_title} at ${app.company_name} has been updated to ${newStatus.toUpperCase()}.`,
            type: 'status_change',
            meta: { applicationId: app.id, status: newStatus }
          });
          return { ...app, status: newStatus };
        }
        return app;
      });
      setApps(updatedApps);
    } catch (err) {
      console.error("Status update failed:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteApplication = (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      const updatedApps = apps.filter(app => app.id !== id);
      setApps(updatedApps);
      // Optional: actually delete from API applicationsAPI.delete(id)
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold">All Applications</h1>
          <p className="text-slate-500">Review candidate submissions and manage their progress.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="gap-2"> <Download className="w-4 h-4" /> Export All</Button>
        </div>
      </div>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
           <input 
             type="text"
             placeholder="Search by candidate name or job title..."
             className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none shadow-sm"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
           />
        </div>
        <Button variant="outline" className="gap-2"> <Filter className="w-4 h-4" /> Filter Status</Button>
      </div>

      <GlassCard className="p-0 overflow-hidden" hover={false}>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Job Offer</th>
                  <th className="px-6 py-4">Status</th>
                  <th 
                    className="px-6 py-4 cursor-pointer hover:text-indigo-400 transition-colors group"
                    onClick={toggleSort}
                  >
                    <div className="flex items-center gap-2">
                      Applied Date
                      {sortOrder === 'asc' ? (
                        <ArrowUp className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center text-indigo-500">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto" />
                    </td>
                  </tr>
                ) : filteredAndSortedApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                      No applications found.
                    </td>
                  </tr>
                ) : filteredAndSortedApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center">
                             <Avatar name={app.candidate_name || 'Candidate'} size="sm" />
                          </div>
                          <div>
                             <p className="font-bold text-sm">{app.candidate_name || 'John Candidate'}</p>
                             <p className="text-[10px] text-slate-500">{app.candidate_name?.toLowerCase().replace(/\s+/g, '.')}@joblinkdz.com</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div>
                          <p className="text-sm font-bold truncate max-w-[200px]">{app.job_title}</p>
                          <p className="text-[10px] text-slate-500">{app.company_name}</p>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'pending' ? 'warning' : 'info'}>{app.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                       {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center justify-end gap-2">
                          <Button 
                             variant="outline" 
                             size="sm" 
                             className="text-xs gap-1.5 font-bold h-8 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/10"
                             onClick={() => setSelectedApp(app)}
                           >
                            <Eye className="w-3.5 h-3.5" /> View
                          </Button>
                          <Button 
                             disabled={app.status === 'accepted' || processingId === app.id}
                             onClick={() => handleStatusChange(app.id, 'accepted')}
                             variant="outline" 
                             size="sm" 
                             className="text-xs gap-1.5 font-bold h-8 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
                             isLoading={processingId === app.id}
                           >
                            <CheckCircle className="w-3.5 h-3.5" /> Accept
                          </Button>
                          <Button 
                             disabled={app.status === 'rejected' || processingId === app.id}
                             onClick={() => handleStatusChange(app.id, 'rejected')}
                             variant="outline" 
                             size="sm" 
                             className="text-xs gap-1.5 font-bold h-8 border-rose-500/20 text-rose-500 hover:bg-rose-500/10"
                             isLoading={processingId === app.id}
                           >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </Button>
                          <div className="relative group ml-2">
                             <Button variant="ghost" size="icon" className="h-8 w-8" disabled={processingId === app.id}><MoreHorizontal className="w-4 h-4" /></Button>
                             <div className="absolute right-0 top-full mt-2 w-48 glass rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 hidden group-hover:block z-20">
                                <button onClick={() => handleStatusChange(app.id, 'reviewing')} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors">Mark as Reviewing</button>
                                <button onClick={() => handleStatusChange(app.id, 'pending')} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm transition-colors">Reset to Pending</button>
                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                                <button onClick={() => handleDeleteApplication(app.id)} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-sm text-rose-500 transition-colors">Delete Application</button>
                             </div>
                          </div>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </GlassCard>

      <div className="mt-12 p-8 glass rounded-3xl border border-primary/20 bg-primary/5 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
               <Mail className="w-6 h-6" />
            </div>
            <div>
               <h4 className="font-bold">Mass Communication</h4>
               <p className="text-sm text-slate-500">Send personalized emails to multiple candidates simultaneously.</p>
            </div>
         </div>
         <Button>Open Bulk Emailer</Button>
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
    </div>
  );
}
