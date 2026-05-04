import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, MapPin, Users, Calendar, Briefcase, ChevronRight, ExternalLink, Bell, BellOff, Check, DollarSign, Clock, Zap, Loader2 } from 'lucide-react';
import type { Company } from '../data/mockCompanies';
import type { JobOffer } from '../data/mockJobs';
import { companiesAPI, jobsAPI } from '../services/api';
import { GlassCard, Badge } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import NotFound from './NotFound';

export default function CompanyProfile() {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [companyJobs, setCompanyJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const [compData, allJobs] = await Promise.all([
           companiesAPI.getById(id),
           jobsAPI.getAll()
        ]);
        setCompany(compData);
        setCompanyJobs(allJobs.filter(j => j.company_id === id));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-20">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!company) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 px-8 relative overflow-hidden transition-colors duration-500">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Breadcrumbs 
          items={[
            { label: 'Jobs', path: '/jobs' },
            { label: company.name }
          ]} 
        />
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Company Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard className="p-8 text-center" hover={false}>
              <div className="w-24 h-24 bg-indigo-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                <span className="text-3xl font-bold text-indigo-400">{company.logo}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white mb-2">{company.name}</h1>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold italic mb-6">{company.industry}</p>
              
              <div className="flex justify-center gap-4 mb-6">
                <a href={company.website} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Globe className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>

              <Button 
                onClick={handleFollow}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                variant={isFollowing ? (isHovered ? "danger" : "outline") : "primary"}
                className={cn(
                  "w-full mb-8 h-12 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 transition-all duration-300",
                  isFollowing && !isHovered && "border-emerald-500/20 text-emerald-400 bg-emerald-500/5",
                  !isFollowing && "bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20"
                )}
              >
                {isFollowing ? (
                  isHovered ? (
                    <>
                      <BellOff className="w-4 h-4" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Following
                    </>
                  )
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    Follow
                  </>
                )}
              </Button>

              <div className="space-y-4 text-left border-t border-white/5 pt-6">
                <div className="flex items-center gap-3 text-slate-400">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs">{company.location}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs">{company.employees} Employees</span>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs">Founded in {company.founded}</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 bg-indigo-600/5 border border-indigo-500/10" hover={false}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-widest">About Company</h3>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                {company.description}
              </p>
            </GlassCard>
          </div>

          {/* Job Offers Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic">Available Opportunities</h2>
              <Badge variant="info">{companyJobs.length} Positions</Badge>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {companyJobs.length > 0 ? (
                companyJobs.map((job, index) => (
                  <Link key={job.id} to={`/jobs/${job.id}`} className="block group">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-md transition-all hover:bg-white/[0.08] relative overflow-hidden group/card"
                    >
                      {/* Decorative Gradient Background */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover/card:bg-indigo-500/10 transition-colors" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant={job.job_type === 'Full-time' ? 'info' : 'warning'} className="px-3 py-1 text-[10px]">
                                {job.job_type}
                              </Badge>
                              {index === 0 && (
                                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  <Zap className="w-3 h-3 fill-emerald-400" /> Hot Role
                                </span>
                              )}
                            </div>
                             <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-2xl italic tracking-tight">{job.title}</h4>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium">{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-bold text-slate-900 dark:text-white">{job.salary_range}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-amber-600 dark:text-amber-400">
                                <Clock className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium italic">Posted {new Date(job.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {job.skills.map((skill) => (
                              <span key={skill} className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all font-sans">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-white/10 pt-6 md:pt-0 md:pl-8">
                          <Button variant="ghost" className="hidden lg:flex hover:text-indigo-600 dark:hover:text-indigo-400 group-hover:translate-x-1 transition-all">
                            View Specs <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex md:hidden lg:hidden items-center justify-center text-indigo-400">
                            <ChevronRight className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <div className="p-12 text-center glass rounded-3xl border-dashed border-2 border-slate-200 dark:border-white/10">
                  <p className="text-slate-500 italic">No open positions at the moment.</p>
                </div>
              )}
            </div>

            {/* Diversity and Culture Banner */}
            <GlassCard className="p-8 overflow-hidden relative bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10" hover={false}>
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Users className="w-32 h-32 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="relative z-10 max-w-md">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white italic mb-4">Why work at {company.name}?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  We believe in fostering a diverse and inclusive workplace where every individual can thrive. 
                  Join us and be part of a team that is shaping the future of technology in Algeria.
                </p>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">4.8</p>
                    <p className="text-[10px] uppercase text-slate-500 font-black">Glassdoor</p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-white/10 self-center" />
                  <div className="text-center">
                    <p className="text-xl font-black text-cyan-500 dark:text-cyan-400">85%</p>
                    <p className="text-[10px] uppercase text-slate-500 font-black">Diversity</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
