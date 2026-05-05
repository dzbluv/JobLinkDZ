import React, { useState, useEffect } from 'react';
import { Heart, Search, Loader2, ArrowLeft, Briefcase } from 'lucide-react';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { jobsAPI } from '../services/api';
import type { JobOffer } from '../data/mockJobs';
import { JobCard } from '../components/dashboard/Cards';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/ui/Shared';

export default function Favorites() {
  const { preferences } = useUserPreferences();
  const [favoriteJobs, setFavoriteJobs] = useState<JobOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (preferences.favoriteJobs.length === 0) {
        setFavoriteJobs([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const allJobs = await jobsAPI.getAll();
        const filtered = allJobs.filter(job => preferences.favoriteJobs.includes(job.id));
        setFavoriteJobs(filtered);
      } catch (err) {
        console.error('Error fetching favorites:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavorites();
  }, [preferences.favoriteJobs]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-12">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-500 mb-6 transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Browse
        </Link>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white italic flex items-center gap-4">
          <Heart className="w-8 h-8 text-rose-500 fill-current" /> My Saved Jobs
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Keep track of the positions that caught your eye.</p>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center text-indigo-500">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
      ) : favoriteJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoriteJobs.map(job => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </div>
      ) : (
        <GlassCard className="py-20 text-center border-slate-200 dark:border-white/10" hover={false}>
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-rose-500">
             <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Your favorites list is empty</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Click the heart icon on any job posting to save it here for later.
          </p>
          <Link to="/jobs">
            <Button className="gap-2">
              <Search className="w-4 h-4" /> Browse Jobs
            </Button>
          </Link>
        </GlassCard>
      )}
    </div>
  );
}
