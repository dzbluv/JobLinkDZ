import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, Briefcase, Bell, Building, Coins, Sparkles, Loader2 } from 'lucide-react';
import { jobsAPI, companiesAPI } from '../services/api';
import type { JobOffer } from '../data/mockJobs';
import type { Company } from '../data/mockCompanies';
import { JobCard } from '../components/dashboard/Cards';
import { Input, Badge, GlassCard } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { useTranslation } from 'react-i18next';

import { motion, AnimatePresence } from 'motion/react';

export default function Jobs() {
  const { t } = useTranslation();

  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterSize, setFilterSize] = useState<string | null>(null);
  const [filterSalary, setFilterSalary] = useState<string | null>(null);
  const [filterIndustry, setFilterIndustry] = useState<string | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        console.log('[Jobs] Fetching jobs and companies...');
        const [fetchedJobs, fetchedCompanies] = await Promise.all([
          jobsAPI.getAll(),
          companiesAPI.getAll()
        ]);
                
        console.log('[Jobs] Fetched jobs count:', fetchedJobs.length);
        console.log('[Jobs] Fetched companies count:', fetchedCompanies.length);
        
        setJobs(fetchedJobs);
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('[Jobs] Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const jobTypes = [
    { value: 'Full-time', label: t('jobs.types.full_time') },
    { value: 'Part-time', label: t('jobs.types.part_time') },
    { value: 'Remote', label: t('jobs.types.remote') },
    { value: 'Contract', label: t('jobs.types.contract') },
    { value: 'Internship', label: t('jobs.types.internship') }
  ];

  const companySizes = [
    { value: 'Small', label: t('jobs.sizes.small') },
    { value: 'Medium', label: t('jobs.sizes.medium') },
    { value: 'Large', label: t('jobs.sizes.large') }
  ];

  const salaryRanges = [
    { value: 'Under 50,000 DA', label: t('jobs.salaries.under_50k') },
    { value: '50,000 - 100,000 DA', label: t('jobs.salaries.50k_100k') },
    { value: '100,000 - 150,000 DA', label: t('jobs.salaries.100k_150k') },
    { value: 'Above 150,000 DA', label: t('jobs.salaries.above_150k') }
  ];

  const allIndustries = [
    { value: 'Technology', label: t('jobs.industries.technology') },
    { value: 'Healthcare', label: t('jobs.industries.healthcare') },
    { value: 'Finance', label: t('jobs.industries.finance') },
    { value: 'Education', label: t('jobs.industries.education') },
    { value: 'Manufacturing', label: t('jobs.industries.manufacturing') },
    { value: 'Retail', label: t('jobs.industries.retail') },
    { value: 'Construction', label: t('jobs.industries.construction') },
    { value: 'Agriculture', label: t('jobs.industries.agriculture') },
    { value: 'Energy', label: t('jobs.industries.energy') },
    { value: 'Transportation', label: t('jobs.industries.transportation') },
    { value: 'Hospitality', label: t('jobs.industries.hospitality') },
    { value: 'Media', label: t('jobs.industries.media') },
    { value: 'Real Estate', label: t('jobs.industries.real_estate') },
    { value: 'Telecommunications', label: t('jobs.industries.telecommunications') },
    { value: 'Software Development', label: t('jobs.industries.software_development') },
    { value: 'E-commerce', label: t('jobs.industries.e_commerce') },
    { value: 'Logistics', label: t('jobs.industries.logistics') },
    { value: 'Marketing', label: t('jobs.industries.marketing') },
    { value: 'Consulting', label: t('jobs.industries.consulting') },
    { value: 'Other', label: t('jobs.industries.other') }
  ];

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    jobs.forEach(job => {
      job.skills?.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [jobs]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const parseSalary = (salaryStr: string) => {
    const numbers = salaryStr.match(/\d+/g);
    if (!numbers) return { min: 0, max: 0 };
    const min = parseInt(numbers[0]);
    const max = numbers.length > 1 ? parseInt(numbers[1]) : min;
    return { min, max };
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const searchTerm = search.toLowerCase().trim();
      
      const company = companies.find(c => c.id === job.company_id);
      
      const matchSearch = searchTerm === '' || 
                          job.title.toLowerCase().includes(searchTerm) || 
                          job.company.toLowerCase().includes(searchTerm) ||
                          (company?.industry?.toLowerCase() || '').includes(searchTerm) ||
                          (job.skills || []).some(s => s.toLowerCase().includes(searchTerm));
      
      const matchType = filterType ? job.job_type === filterType : true;
      
      const matchSize = filterSize ? company?.size === filterSize : true;
      const matchIndustry = filterIndustry ? company?.industry === filterIndustry : true;

      const matchSalary = filterSalary ? (() => {
        const { min, max } = parseSalary(job.salary_range);
        switch (filterSalary) {
          case 'Under 50,000 DA': return min < 50000;
          case '50,000 - 100,000 DA': return (min < 100000 && max >= 50000);
          case '100,000 - 150,000 DA': return (min < 150000 && max >= 100000);
          case 'Above 150,000 DA': return max >= 150000;
          default: return true;
        }
      })() : true;

      const matchSkills = selectedSkills.length === 0 || 
                          (job.skills || []).some(s => selectedSkills.includes(s));

      return matchSearch && matchType && matchSize && matchSalary && matchSkills && matchIndustry;
    });
  }, [search, filterType, filterSize, filterSalary, selectedSkills, filterIndustry, jobs, companies]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">{t('jobs.title')}</h1>
        <p className="text-slate-500">{t('jobs.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-8 hidden lg:block sticky top-24 self-start h-fit">
          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {t('jobs.filter_type')}
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterType(null)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterType === null ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
              >
                {t('jobs.all_vacancies')}
              </button>
              {jobTypes.map(type => (
                <button 
                  key={type.value} 
                  onClick={() => setFilterType(type.value)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterType === type.value ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {t('jobs.company_size')}
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterSize(null)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterSize === null ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
              >
                {t('jobs.all_sizes')}
              </button>
              {companySizes.map(size => (
                <button 
                  key={size.value} 
                  onClick={() => setFilterSize(size.value)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterSize === size.value ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {t('jobs.industry')}
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterIndustry(null)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterIndustry === null ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
              >
                {t('jobs.all_industries')}
              </button>
              {allIndustries.map(industry => (
                <button 
                  key={industry.value} 
                  onClick={() => setFilterIndustry(industry.value)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterIndustry === industry.value ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                >
                  {industry.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Coins className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {t('jobs.salary_range')}
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterSalary(null)}
                className={`w-full text-left px-2 py-2 rounded-xl text-sm transition-all ${filterSalary === null ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
              >
                {t('jobs.all_salaries')}
              </button>
              {salaryRanges.map(range => (
                <button 
                  key={range.value} 
                  onClick={() => setFilterSalary(range.value)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterSalary === range.value ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> {t('jobs.key_skills')}
            </h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedSkills([])}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all ${selectedSkills.length === 0 ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 shadow-sm'}`}
              >
                {t('jobs.any_skill')}
              </button>
              {allSkills.map(skill => (
                <button 
                  key={skill} 
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all ${selectedSkills.includes(skill) ? 'bg-indigo-500 text-slate-900 dark:text-white font-bold' : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 shadow-sm'}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </GlassCard>


        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <input 
                 type="text"
                 placeholder={t('jobs.search_placeholder')}
                 className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none shadow-sm transition-all"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <Button variant="outline" className="lg:hidden gap-2" onClick={() => setIsFilterOpen(!isFilterOpen)}>
               <SlidersHorizontal className="w-4 h-4" /> {t('common.filters')}
            </Button>
          </div>

          {/* Mobile Filter */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 space-y-4"
              >
                <h4 className="font-bold text-sm">{t('jobs.select_job_type')}</h4>
                <div className="flex flex-wrap gap-2">
                   {[{ value: null, label: t('common.all') }, ...jobTypes].map(type => (
                     <button 
                       key={type.value || 'all'} 
                       onClick={() => setFilterType(type.value)}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterType === type.value ? 'bg-primary text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {type.label}
                     </button>
                   ))}
                </div>

                <h4 className="font-bold text-sm mt-4">{t('jobs.company_size')}</h4>
                <div className="flex flex-wrap gap-2">
                   {[{ value: null, label: t('common.all') }, ...companySizes].map(size => (
                     <button 
                       key={size.value || 'all'} 
                       onClick={() => setFilterSize(size.value)}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterSize === size.value ? 'bg-primary text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {size.label}
                     </button>
                   ))}
                </div>

                <h4 className="font-bold text-sm mt-4">{t('jobs.industry')}</h4>
                <div className="flex flex-wrap gap-2">
                   {[{ value: null, label: t('common.all') }, ...allIndustries].map(industry => (
                     <button 
                       key={industry.value || 'all'} 
                       onClick={() => setFilterIndustry(industry.value)}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterIndustry === industry.value ? 'bg-primary text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {industry.label}
                     </button>
                   ))}
                </div>

                <h4 className="font-bold text-sm mt-4">{t('jobs.salary_range')}</h4>
                <div className="flex flex-wrap gap-2">
                   {[{ value: null, label: t('common.all') }, ...salaryRanges].map(range => (
                     <button 
                       key={range.value || 'all'} 
                       onClick={() => setFilterSalary(range.value)}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterSalary === range.value ? 'bg-primary text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {range.label}
                     </button>
                   ))}
                </div>

                <h4 className="font-bold text-sm mt-4">{t('jobs.key_skills')}</h4>
                <div className="flex flex-wrap gap-2">
                   {allSkills.map(skill => (
                     <button 
                       key={skill} 
                       onClick={() => toggleSkill(skill)}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedSkills.includes(skill) ? 'bg-primary text-slate-900 dark:text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {skill}
                     </button>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between text-sm text-slate-500">
             <p>{t('jobs.showing_results', { count: filteredJobs.length })}</p>
             <div className="flex items-center gap-2">
                <span>{t('common.sort_by')}</span>
                <select className="bg-transparent font-bold text-foreground outline-none cursor-pointer">
                   <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">{t('common.newest')}</option>
                   <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">{t('common.salary')}</option>
                   <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">{t('common.company')}</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-full py-20 flex justify-center text-indigo-500">
                <Loader2 className="w-10 h-10 animate-spin" />
              </div>
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass-card bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-12">
                 <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-500">
                    <Search className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{t('jobs.no_jobs_found')}</h2>
                 <p className="text-slate-500 max-w-md mx-auto mb-8">
                   {jobs.length === 0 
                     ? t('jobs.empty_board')
                     : t('jobs.no_matches')}
                 </p>
                 <div className="flex justify-center gap-4">
                   <Button variant="outline" onClick={() => {setSearch(''); setFilterType(null); setFilterSize(null); setFilterSalary(null); setSelectedSkills([]); setFilterIndustry(null);}}>
                     {t('common.clear_filters')}
                   </Button>
                   {jobs.length === 0 && (
                     <Button onClick={() => window.location.reload()}>
                       {t('common.refresh')}
                     </Button>
                   )}
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
