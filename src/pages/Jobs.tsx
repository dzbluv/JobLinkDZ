import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, Briefcase, Bell, Building, Coins, Sparkles, Loader2 } from 'lucide-react';
import { jobsAPI, companiesAPI } from '../services/api';
import type { JobOffer } from '../data/mockJobs';
import type { Company } from '../data/mockCompanies';
import { JobCard } from '../components/dashboard/Cards';
import { Input, Badge, GlassCard } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { useJobAlerts } from '../context/JobAlertContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Jobs() {
  const { addAlert } = useJobAlerts();
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
        const [fetchedJobs, fetchedCompanies] = await Promise.all([
          jobsAPI.getAll(),
          companiesAPI.getAll()
        ]);
                
        setJobs(fetchedJobs);
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error('Error fetching jobs/companies:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];
  const companySizes = ['Small', 'Medium', 'Large'];
  const salaryRanges = ['Under 50,000 DA', '50,000 - 100,000 DA', '100,000 - 150,000 DA', 'Above 150,000 DA'];

  const allIndustries = useMemo(() => {
    const industries = new Set<string>();
    companies.forEach(company => {
      if (company.industry) industries.add(company.industry);
    });
    return Array.from(industries).sort();
  }, [companies]);

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
  }, [search, filterType, filterSize, filterSalary, selectedSkills, filterIndustry]);

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Explore Career Opportunities</h1>
        <p className="text-slate-500">Discover and apply to the best jobs in Algeria's growing market.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 space-y-8 hidden lg:block sticky top-24 self-start h-fit">
          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Filter by Type
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterType(null)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterType === null ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
              >
                All Vacancies
              </button>
              {jobTypes.map(type => (
                <button 
                  key={type} 
                  onClick={() => setFilterType(type)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterType === type ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Building className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Company Size
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterSize(null)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterSize === null ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
              >
                All Sizes
              </button>
              {companySizes.map(size => (
                <button 
                  key={size} 
                  onClick={() => setFilterSize(size)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterSize === size ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Industry
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterIndustry(null)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterIndustry === null ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
              >
                All Industries
              </button>
              {allIndustries.map(industry => (
                <button 
                  key={industry} 
                  onClick={() => setFilterIndustry(industry)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterIndustry === industry ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Coins className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Salary Range
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => setFilterSalary(null)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterSalary === null ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
              >
                All Salaries
              </button>
              {salaryRanges.map(range => (
                <button 
                  key={range} 
                  onClick={() => setFilterSalary(range)}
                  className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-all ${filterSalary === range ? 'bg-indigo-500 text-white font-bold' : 'hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6" hover={false}>
            <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-900 dark:text-white italic">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Key Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setSelectedSkills([])}
                className={`px-3 py-1.5 rounded-xl text-xs transition-all ${selectedSkills.length === 0 ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 shadow-sm'}`}
              >
                Any Skill
              </button>
              {allSkills.map(skill => (
                <button 
                  key={skill} 
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all ${selectedSkills.includes(skill) ? 'bg-indigo-500 text-white font-bold' : 'bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 shadow-sm'}`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 bg-indigo-500/5 border-indigo-500/20" hover={false}>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Job Alert</p>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Not finding the right fit? Create an alert for this search to be notified immediately when a match appears.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-[10px] h-8"
              onClick={() => {
                addAlert({ keyword: search, location: '', jobType: filterType || '' });
                alert('Alert created! You will be notified of new matches.');
              }}
            >
              <Bell className="w-3 h-3 mr-1" /> Create Alert
            </Button>
          </GlassCard>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
               <input 
                 type="text"
                 placeholder="Search by title, company, industry, or skills..."
                 className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none shadow-sm transition-all"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
            <Button variant="outline" className="lg:hidden gap-2" onClick={() => setIsFilterOpen(!isFilterOpen)}>
               <SlidersHorizontal className="w-4 h-4" /> Filters
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
                <h4 className="font-bold text-sm">Select Job Type</h4>
                <div className="flex flex-wrap gap-2">
                   {['All', ...jobTypes].map(type => (
                     <button 
                       key={type} 
                       onClick={() => {
                         setFilterType(type === 'All' ? null : type);
                       }}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${((type === 'All' && filterType === null) || filterType === type) ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {type}
                     </button>
                   ))}
                </div>

                <h4 className="font-bold text-sm mt-4">Company Size</h4>
                <div className="flex flex-wrap gap-2">
                   {['All', ...companySizes].map(size => (
                     <button 
                       key={size} 
                       onClick={() => {
                         setFilterSize(size === 'All' ? null : size);
                       }}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${((size === 'All' && filterSize === null) || filterSize === size) ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {size}
                     </button>
                   ))}
                </div>

                <h4 className="font-bold text-sm mt-4">Industry</h4>
                <div className="flex flex-wrap gap-2">
                   {['All', ...allIndustries].map(industry => (
                     <button 
                       key={industry} 
                       onClick={() => {
                         setFilterIndustry(industry === 'All' ? null : industry);
                       }}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${((industry === 'All' && filterIndustry === null) || filterIndustry === industry) ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {industry}
                     </button>
                   ))}
                </div>

                <h4 className="font-bold text-sm mt-4">Salary Range</h4>
                <div className="flex flex-wrap gap-2">
                   {['All', ...salaryRanges].map(range => (
                     <button 
                       key={range} 
                       onClick={() => {
                         setFilterSalary(range === 'All' ? null : range);
                       }}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${((range === 'All' && filterSalary === null) || filterSalary === range) ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {range}
                     </button>
                   ))}
                </div>

                <h4 className="font-bold text-sm mt-4">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                   {allSkills.map(skill => (
                     <button 
                       key={skill} 
                       onClick={() => toggleSkill(skill)}
                       className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${selectedSkills.includes(skill) ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}
                     >
                       {skill}
                     </button>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between text-sm text-slate-500">
             <p>Showing <span className="font-bold text-foreground">{filteredJobs.length}</span> jobs found</p>
             <div className="flex items-center gap-2">
                <span>Sort by:</span>
                <select className="bg-transparent font-bold text-foreground outline-none cursor-pointer">
                   <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Newest First</option>
                   <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Salary Range</option>
                   <option className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">Company Name</option>
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
              <div className="col-span-full py-20 text-center glass-card">
                 <p className="text-xl font-bold mb-2">No jobs match your criteria</p>
                 <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                 <Button variant="ghost" className="mt-4" onClick={() => {setSearch(''); setFilterType(null); setFilterSize(null); setFilterSalary(null); setSelectedSkills([]); setFilterIndustry(null);}}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
