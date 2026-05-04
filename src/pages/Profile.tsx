import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Camera, Save, Globe, Linkedin, Twitter, Link as LinkIcon, X, Tag, Sparkles, Github, Check, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GlassCard, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { Avatar, getColorForName, getInitials, COLOR_PALETTE } from '../components/ui/Avatar';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const COMMON_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Python', 'Next.js', 'Tailwind CSS', 
  'Figma', 'UI Design', 'Project Management', 'Agile', 'Docker', 'AWS',
  'Java', 'Spring Boot', 'SQL', 'MongoDB', 'GraphQL', 'Redux'
];

const COLOR_OPTIONS = Object.keys(COLOR_PALETTE);

export default function Profile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: 'Experienced professional looking for new challenges in the tech industry. Specialized in React development and modern UI practices.',
    githubUrl: 'github.com/mounib',
    portfolioUrl: 'https://behance.net/mounib',
    linkedin: 'linkedin.com/in/mounib',
    skills: ['React', 'TypeScript', 'Tailwind CSS']
  });
  
  // Avatar customization state
  const [avatarInitials, setAvatarInitials] = useState(user?.avatar_initials || '');
  const [avatarColor, setAvatarColor] = useState(user?.avatar_color || getColorForName(user?.full_name || 'User'));
  
  const [skillInput, setSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // For recruiters (admin role), they can customize initials and colors
  const isRecruiter = user?.role === 'admin';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
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
           <GlassCard className="p-8 text-center bg-white/5 border-white/10" hover={false}>
              <div className="relative inline-block group mb-6">
                 <Avatar 
                   name={formData.fullName} 
                   initials={isRecruiter && avatarInitials ? avatarInitials : undefined}
                   color={avatarColor}
                   size="profile"
                   role={user?.role}
                 />
                 {isRecruiter && (
                   <div className="absolute -bottom-2 -right-2 flex gap-1">
                     <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500 cursor-pointer">
                       <Camera className="w-4 h-4" />
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
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-bold text-center uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
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
                        const colorStyle = COLOR_PALETTE[colorName];
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
                 {[
                   { icon: Linkedin, color: 'hover:text-blue-400' },
                   { icon: Github, color: 'hover:text-slate-900 dark:hover:text-white' },
                   { icon: Globe, color: 'hover:text-emerald-400' }
                 ].map((social, i) => (
                   <React.Fragment key={i}>
                     <Button variant="ghost" size="icon" className={`text-slate-500 transition-colors bg-white/5 rounded-xl ${social.color}`}>
                       <social.icon className="w-5 h-5" />
                     </Button>
                   </React.Fragment>
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="p-8 bg-indigo-500/5 border-indigo-500/20" hover={false}>
              <h4 className="font-bold mb-6 text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                 <Sparkles className="w-4 h-4 text-indigo-400" /> Core Strengths
              </h4>
              <div className="flex flex-wrap gap-2">
                 {formData.skills.map(skill => (
                   <span key={skill} className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400">
                     {skill}
                   </span>
                 ))}
              </div>
           </GlassCard>
        </div>

        <div className="lg:col-span-2">
           <GlassCard className="p-10 bg-white/5 border-white/10 shadow-2xl" hover={false}>
              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="md:col-span-2">
                      <h3 className="text-xl font-bold mb-2 text-white italic flex items-center gap-2">
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
                     onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                </div>

                <div className="space-y-6">
                   <div className="md:col-span-2">
                      <h3 className="text-xl font-bold mb-2 text-white italic flex items-center gap-2">
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
                                 className="w-full text-left px-4 py-3 hover:bg-white/5 rounded-xl text-sm text-slate-300 transition-colors flex items-center justify-between group"
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
                      <h3 className="text-xl font-bold mb-2 text-white italic flex items-center gap-2">
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
