import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save, Globe, Linkedin, Twitter, Link as LinkIcon, X, Tag, Sparkles, Github, Check, Palette, AlertCircle, Building2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import { GlassCard, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { Avatar, getColorForName, getInitials, COLOR_PALETTE } from '../components/ui/Avatar';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';

const COMMON_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Next.js', 'Tailwind CSS', 
  'Figma', 'UI Design', 'Project Management', 'Agile', 'Docker', 'AWS',
  'Java', 'Spring Boot', 'SQL', 'MongoDB', 'GraphQL', 'Redux'
];

const COLOR_OPTIONS = Object.keys(COLOR_PALETTE);

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    githubUrl: user?.github_url || '',
    portfolioUrl: user?.portfolio_url || '',
    linkedin: user?.linkedin_url || '',
    skills: user?.skills || []
  });
  
  // Avatar customization state
  const [avatarInitials, setAvatarInitials] = useState(user?.avatar_initials || '');
  const [avatarColor, setAvatarColor] = useState(user?.avatar_color || getColorForName(user?.full_name || 'User'));
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [skillInput, setSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync form state when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        githubUrl: user.github_url || '',
        portfolioUrl: user.portfolio_url || '',
        linkedin: user.linkedin_url || '',
        skills: user.skills || []
      });
      setAvatarInitials(user.avatar_initials || '');
      setAvatarColor(user.avatar_color || getColorForName(user.full_name || 'User'));
    }
  }, [user]);

  // For recruiters (admin role), they can customize initials and colors
  const isRecruiter = user?.role === 'admin';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Build the payload
      const payload: Record<string, any> = {
        full_name: formData.fullName,
        phone: formData.phone || null,
        location: formData.location || null,
        bio: formData.bio || null,
        github_url: formData.githubUrl || null,
        portfolio_url: formData.portfolioUrl || null,
        linkedin_url: formData.linkedin || null,
        skills: formData.skills.length > 0 ? formData.skills : null,
        avatar_initials: isRecruiter && avatarInitials ? avatarInitials : null,
        avatar_color: avatarColor || null,
        avatar_url: avatarUrl || null,
      };

      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Update directly via Supabase client
      const { error: updateError } = await supabase
        .from('users')
        .update(payload)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh user context to get updated data
      await refreshUser();
      
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError(err?.message || 'Failed to save profile. Please try again.');
      setIsSaving(false);
    }
  };

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !formData.skills.includes(trimmedSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, trimmedSkill] });
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const suggestions = COMMON_SKILLS.filter(s => 
    s.toLowerCase().includes(skillInput.toLowerCase()) && 
    !formData.skills.includes(s)
  ).slice(0, 5);

  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white italic">Profile Settings</h1>
        <p className="text-slate-500 font-medium">Elevate your professional presence and unlock new opportunities.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
           <GlassCard className="p-8 text-center bg-white dark:bg-white/5 border-slate-200 dark:border-white/10" hover={false}>
              <div className="relative inline-block group mb-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                  {avatarUrl ? (
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-white/10 mx-auto relative group">
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative inline-block group">
                      <Avatar 
                        name={formData.fullName} 
                        initials={isRecruiter && avatarInitials ? avatarInitials : undefined}
                        color={avatarColor}
                        size="profile"
                        role={user?.role}
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  )}
               </div>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic mb-1">{formData.fullName}</h2>
               <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-8 font-black">{user?.role} Identity</p>
               
               {/* Avatar Customization for Recruiters */}
               {isRecruiter && (
                 <div className="mb-8 p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl text-left space-y-4">
                   <div className="flex items-center gap-2 text-indigo-400">
                     <Palette className="w-4 h-4" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">Customize Avatar</span>
                   </div>
                   
                   {/* Initials input */}
                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                       Custom Initials
                     </label>
                     <input
                       type="text"
                       maxLength={2}
                       value={avatarInitials}
                       onChange={(e) => setAvatarInitials(e.target.value.toUpperCase().slice(0, 2))}
                       placeholder={getInitials(formData.fullName)}
                       className="w-full px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white font-bold text-center uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
                     />
                     <p className="text-[9px] text-slate-600 mt-1 italic">Leave empty for auto-initials</p>
                   </div>
                   
                   {/* Color picker */}
                   <div>
                     <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                       Accent Color
                     </label>
                     <div className="flex flex-wrap gap-2">
                       {COLOR_OPTIONS.map((colorName) => {
                         const colorStyle = COLOR_PALETTE[colorName as keyof typeof COLOR_PALETTE];
                         return (
                           <button
                             key={colorName}
                             type="button"
                             onClick={() => setAvatarColor(colorName)}
                             className={cn(
                               'w-8 h-8 rounded-xl border-2 transition-all',
                               colorStyle.bg,
                               colorStyle.text,
                               'hover:scale-110',
                               avatarColor === colorName 
                                 ? 'border-white scale-110 shadow-lg' 
                                 : 'border-transparent'
                             )}
                             title={colorName}
                           >
                             <span className="text-[10px] font-black">A</span>
                           </button>
                         );
                       })}
                     </div>
                   </div>
                 </div>
               )}
              
              <div className="flex justify-center gap-4">
                 <a href={formData.linkedin ? `https://${formData.linkedin}` : '#'} target="_blank" rel="noopener noreferrer">
                   <Button variant="ghost" size="icon" className={`text-slate-500 transition-colors bg-white dark:bg-white/5 rounded-xl hover:text-blue-400 ${!formData.linkedin ? 'opacity-30 pointer-events-none' : ''}`}>
                     <Linkedin className="w-5 h-5" />
                   </Button>
                 </a>
                 <a href={formData.githubUrl ? `https://${formData.githubUrl}` : '#'} target="_blank" rel="noopener noreferrer">
                   <Button variant="ghost" size="icon" className={`text-slate-500 transition-colors bg-white dark:bg-white/5 rounded-xl hover:text-slate-900 dark:hover:text-slate-900 dark:text-white ${!formData.githubUrl ? 'opacity-30 pointer-events-none' : ''}`}>
                     <Github className="w-5 h-5" />
                   </Button>
                 </a>
                 <a href={formData.portfolioUrl ? `https://${formData.portfolioUrl}` : '#'} target="_blank" rel="noopener noreferrer">
                   <Button variant="ghost" size="icon" className={`text-slate-500 transition-colors bg-white dark:bg-white/5 rounded-xl hover:text-emerald-400 ${!formData.portfolioUrl ? 'opacity-30 pointer-events-none' : ''}`}>
                     <Globe className="w-5 h-5" />
                   </Button>
                 </a>
              </div>
           </GlassCard>

            <GlassCard className="p-8 bg-indigo-500/5 border-indigo-500/20" hover={false}>
               <h4 className="font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" /> Core Strengths
               </h4>
               <div className="flex flex-wrap gap-2">
                  {formData.skills.length > 0 ? formData.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      {skill}
                    </span>
                  )) : (
                    <p className="text-[10px] text-slate-500 italic">No skills added yet</p>
                  )}
               </div>
            </GlassCard>

            <FollowedCompanies />
        </div>

        <div className="lg:col-span-2">
           <GlassCard className="p-10 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 shadow-2xl" hover={false}>
              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="md:col-span-2">
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white italic flex items-center gap-2">
                         <User className="w-5 h-5 text-indigo-400" /> Personal Identity
                      </h3>
                      <div className="h-px w-full bg-gradient-to-r from-indigo-500/30 to-transparent" />
                   </div>
                   <Input 
                     label="Full Name" 
                     value={formData.fullName} 
                     onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                   />
                   <Input 
                     label="Email Address" 
                     type="email" 
                     value={formData.email} 
                     disabled
                   />
                   <Input 
                     label="Phone Number" 
                     placeholder="+213 5XX XX XX XX" 
                     value={formData.phone} 
                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
                   />
                   <Input 
                     label="Location" 
                     placeholder="Algiers, Algeria" 
                     value={formData.location} 
                     onChange={(e) => setFormData({...formData, location: e.target.value})}
                   />
                   <div className="md:col-span-2">
                     <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                       Bio / About Me
                     </label>
                     <textarea
                       value={formData.bio}
                       onChange={(e) => setFormData({...formData, bio: e.target.value})}
                       placeholder="Tell us about yourself, your experience, and what you're looking for..."
                       rows={4}
                       className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all resize-none"
                     />
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="md:col-span-2">
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white italic flex items-center gap-2">
                         <Tag className="w-5 h-5 text-indigo-400" /> Expertise & Skills
                      </h3>
                      <div className="h-px w-full bg-gradient-to-r from-indigo-500/30 to-transparent" />
                   </div>
                   
                   <div className="space-y-4">
                     <div className="relative">
                       <Input 
                         label="Add Skills" 
                         placeholder="Type a skill and press Enter" 
                         value={skillInput}
                         onChange={(e) => setSkillInput(e.target.value)}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                             e.preventDefault();
                             addSkill(skillInput);
                           }
                         }}
                       />
                       <AnimatePresence>
                         {skillInput && (
                           <motion.div 
                             initial={{ opacity: 0, y: -10 }}
                             animate={{ opacity: 1, y: 0 }}
                             exit={{ opacity: 0, y: -10 }}
                             className="absolute z-50 left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2"
                           >
                             {suggestions.length > 0 ? suggestions.map(skill => (
                               <button
                                 key={skill}
                                 type="button"
                                 onClick={() => addSkill(skill)}
                                 className="w-full text-left px-4 py-3 hover:bg-white dark:bg-white/5 rounded-xl text-sm text-slate-300 transition-colors flex items-center justify-between group"
                               >
                                 {skill}
                                 <Plus className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" />
                               </button>
                             )) : (
                               <div className="px-4 py-3 text-xs text-slate-500 italic">Press Enter to add "{skillInput}"</div>
                             )}
                           </motion.div>
                         )}
                       </AnimatePresence>
                     </div>

                     <div className="flex flex-wrap gap-2 pt-2">
                       {formData.skills.map(skill => (
                         <motion.span 
                           layout
                           initial={{ scale: 0.8, opacity: 0 }}
                           animate={{ scale: 1, opacity: 1 }}
                           key={skill} 
                           className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-2xl text-xs font-bold text-slate-900 dark:text-white group"
                         >
                           {skill}
                           <button 
                             type="button"
                             onClick={() => removeSkill(skill)}
                             className="text-slate-500 hover:text-rose-400 transition-colors"
                           >
                             <X className="w-3 h-3" />
                           </button>
                         </motion.span>
                       ))}
                     </div>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="md:col-span-2">
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white italic flex items-center gap-2">
                         <Globe className="w-5 h-5 text-indigo-400" /> Links & Presence
                      </h3>
                      <div className="h-px w-full bg-gradient-to-r from-indigo-500/30 to-transparent" />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Input 
                       label="GitHub Profile" 
                       placeholder="github.com/username" 
                       value={formData.githubUrl} 
                       onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                     />
                     <Input 
                       label="Portfolio URL" 
                       placeholder="https://behance.net/username" 
                       value={formData.portfolioUrl} 
                       onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                     />
                     <Input 
                       label="LinkedIn Profile" 
                       placeholder="linkedin.com/in/username" 
                       value={formData.linkedin} 
                       onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                     />
                   </div>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      <p className="text-sm text-rose-300 font-medium">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-8 flex items-center justify-end gap-6">
                   <AnimatePresence>
                     {showSuccess && (
                       <motion.div
                         initial={{ opacity: 0, x: 10 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, x: 10 }}
                         className="flex items-center gap-2 text-emerald-400 font-medium italic text-sm"
                       >
                         <Check className="w-4 h-4" />
                         Profile updated successfully
                       </motion.div>
                     )}
                   </AnimatePresence>
                   <Button 
                     type="submit" 
                     className={cn(
                       "h-14 px-12 gap-3 rounded-[1.5rem] transition-all duration-300 text-lg italic",
                       showSuccess 
                        ? "bg-emerald-500 hover:bg-emerald-400 shadow-xl shadow-emerald-500/20" 
                        : "bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/20"
                     )} 
                     isLoading={isSaving}
                   >
                      <Save className="w-6 h-6" /> 
                      {showSuccess ? "Success!" : "Save Profile"}
                   </Button>
                </div>
              </form>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}

function FollowedCompanies() {
  const { preferences, toggleFollowCompany } = useUserPreferences();
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (preferences.followedCompanies.length === 0) {
        setCompanies([]);
        return;
      }
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .in('id', preferences.followedCompanies);
        if (data && !error) setCompanies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, [preferences.followedCompanies]);

  return (
    <GlassCard className="p-8 bg-white dark:bg-white/5 border-slate-200 dark:border-white/10" hover={false}>
      <h4 className="font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
        <Building2 className="w-4 h-4 text-indigo-400" /> Followed Companies
      </h4>
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-indigo-500" /></div>
        ) : companies.length > 0 ? companies.map(company => (
          <div key={company.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 flex items-center justify-center overflow-hidden p-1.5">
                {company.logo_url ? <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" /> : <Building2 className="w-5 h-5 text-slate-400" />}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 italic">{company.name}</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{company.industry}</p>
              </div>
            </div>
            <button 
              onClick={() => toggleFollowCompany(company.id)}
              className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )) : (
          <p className="text-[10px] text-slate-500 italic text-center py-4">You aren't following any companies yet.</p>
        )}
      </div>
    </GlassCard>
  );
}

const Plus = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14"/><path d="M12 5v14"/>
  </svg>
);
