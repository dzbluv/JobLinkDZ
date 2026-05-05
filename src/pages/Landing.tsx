import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Star, ArrowRight, CheckCircle2, TrendingUp, Globe, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard, Badge } from '../components/ui/Shared';
import InteractiveCircles from '../components/ui/InteractiveCircles';
import { motion } from 'motion/react';
import type { JobOffer } from '../data/mockJobs';
import { jobsAPI } from '../services/api';
import { JobCard } from '../components/dashboard/Cards';

export default function Landing() {
  const [featuredJobs, setFeaturedJobs] = useState<JobOffer[]>([]);

  useEffect(() => {
    async function loadJobs() {
      try {
        const jobs = await jobsAPI.getAll();
        setFeaturedJobs(jobs.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured jobs", err);
      }
    }
    loadJobs();
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="overflow-x-hidden min-h-screen text-foreground transition-colors duration-500">

      {/* Abstract Background Glows */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-indigo-600/10 dark:bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] rounded-full animate-float" />

      <div className="relative overflow-hidden w-full">
        <InteractiveCircles />
        <section className="relative px-8 pt-20 pb-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div 
          className="flex-1 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="info">Recruitment Reinvented</Badge>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mt-6 mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
            Find your next opportunity with <span className="font-extrabold italic text-indigo-600 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:to-accent">JobLinkDZ</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed">
            Discover thousands of jobs, apply with one click using your digital CV, and track your applications in real-time. The future of hiring in Algeria starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/jobs">
              <Button size="lg" className="w-full sm:w-auto h-14 px-10">Browse All Jobs</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10">Get Started</Button>
            </Link>
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center md:justify-start gap-8 opacity-60">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800" />)}
            </div>
            <p className="text-sm font-medium">Joined by <span className="font-bold underline decoration-primary decoration-2 underline-offset-2">5,000+</span> professionals this month</p>
          </div>
        </motion.div>

        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="relative z-10 glass rounded-[2.5rem] p-2 shadow-2xl overflow-hidden border border-white/20">
            <img 
              src="https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=600&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="rounded-[2.2rem] shadow-inner"
            />
          </div>
          {/* Floating UI Elements */}
          <GlassCard className="absolute -bottom-6 -left-6 md:-left-12 p-4 flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 z-20" hover={false}>
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-slate-900 dark:text-white">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Application Status</p>
              <p className="font-bold">Successfully Offered!</p>
            </div>
          </GlassCard>

          <GlassCard className="absolute -top-6 -right-6 md:-right-12 p-4 flex items-center gap-4 bg-white/90 dark:bg-slate-900/90 z-20" hover={false}>
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-slate-900 dark:text-white">
               <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Market Value</p>
              <p className="font-bold">+15% Salary Increase</p>
            </div>
          </GlassCard>
        </motion.div>
      </section>
      </div>

      {/* Stats Section */}
      <section className="px-8 py-20 bg-primary/5 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { label: 'Active Jobs', value: '2,500+', icon: Briefcase },
             { label: 'Companies', value: '450+', icon: Globe },
             { label: 'Total Candidates', value: '12,000+', icon: Users },
             { label: 'Successful Placements', value: '3,200+', icon: star }
           ].map((stat, i) => (
             <div key={i} className="text-center group">
               <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                 {/* Lucide icons need title case when dynamically accessed, or just direct use */}
                 <stat.icon className="w-6 h-6 text-primary" />
               </div>
               <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
               <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="px-8 py-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <Badge>Featured Jobs</Badge>
            <h2 className="text-4xl font-bold mt-4">Discover the hottest opportunities</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Personalized job recommendations just for you</p>
          </div>
          <Link to="/jobs">
            <Button variant="ghost" className="gap-2 group">View All Jobs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button>
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredJobs.map(job => (
            <motion.div key={job.id} variants={itemVariants}>
              <JobCard job={job} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits */}
      <section className="px-8 py-24 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 blur-3xl rounded-full" />
             <div className="grid grid-cols-2 gap-4 relative z-10">
                <GlassCard className="aspect-square flex flex-col items-center justify-center text-center p-8">
                   <ShieldCheck className="w-12 h-12 text-primary mb-4" />
                   <h4 className="font-bold">Verified Jobs</h4>
                   <p className="text-xs text-slate-500 mt-2">Every listing is manually verified by our team.</p>
                </GlassCard>
                <GlassCard className="aspect-square flex flex-col items-center justify-center text-center p-8 mt-12">
                   <Users className="w-12 h-12 text-accent mb-4" />
                   <h4 className="font-bold">Direct Connection</h4>
                   <p className="text-xs text-slate-500 mt-2">Chat directly with hiring managers.</p>
                </GlassCard>
                <GlassCard className="aspect-square flex flex-col items-center justify-center text-center p-8 -mt-6">
                   <Briefcase className="w-12 h-12 text-black dark:text-white mb-4" />
                   <h4 className="font-bold">Career Growth</h4>
                   <p className="text-xs text-slate-500 mt-2">Access exclusive workshops and webinars.</p>
                </GlassCard>
                <GlassCard className="aspect-square flex flex-col items-center justify-center text-center p-8 mt-6">
                   <Star className="w-12 h-12 text-secondary mb-4" />
                   <h4 className="font-bold">Premium Roles</h4>
                   <p className="text-xs text-slate-500 mt-2">Discover hand-picked opportunities from top employers.</p>
                </GlassCard>
             </div>
          </div>
          <div>
            <Badge variant="success">Why Choose Us?</Badge>
            <h2 className="text-4xl font-bold mt-4 mb-8 leading-tight">Elevate your career with tools designed for high-performers</h2>
            <div className="space-y-6">
               {[
                 { title: 'Digital CV Builder', desc: 'Create a professional CV in minutes using our responsive builder tool.' },
                 { title: 'Real-time Analytics', desc: 'See who viewed your profile and how you compare to other candidates.' },
                 { title: 'Global Opportunities', desc: 'Reach companies worldwide from the comfort of your home.' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                   <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                   </div>
                   <div>
                     <h4 className="font-bold">{item.title}</h4>
                     <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
            <Link to="/register" className="inline-block mt-12">
              <Button size="lg" className="rounded-full shadow-2xl">Start journey for free <ArrowRight className="w-4 h-4 ml-2" /></Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Fix for Star icon reference
const star = Star;
