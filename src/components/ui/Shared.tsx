import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export function GlassCard({ children, className, hover = true, onClick }: { children: React.ReactNode, className?: string, hover?: boolean, onClick?: (e: React.MouseEvent) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.18 }}
      className={cn('glass-card p-6 border border-slate-200 dark:border-white/10 will-change-transform', className)}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export function Badge({ children, variant = 'default', className, title }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'error' | 'info', className?: string, title?: string }) {
  const variants = {
    default: 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    info: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20',
  };

  return (
    <span 
      title={title}
      className={cn('px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', variants[variant], className)}
    >
      {children}
    </span>
  );
}

export function Input({ label, error, rightElement, ...props }: { label?: string, error?: string, rightElement?: React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1 w-full">
      {label && <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">{label}</label>}
      <div className="relative">
        <input
          className={cn(
            "w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-950 dark:text-white",
            error && "border-rose-500 ring-1 ring-rose-500",
            rightElement && "pr-10",
            props.className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-500 ml-1">{error}</p>}
    </div>
  );
}

export function StatCard({ title, value, icon: Icon, colorClass }: { title: string, value: string | number, icon: React.ElementType, colorClass: string }) {
  return (
    <GlassCard className="flex items-center gap-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors" hover={false}>
      <div className={cn("p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm text-indigo-600 dark:text-indigo-400", colorClass.includes('emerald') && "text-emerald-600 dark:text-emerald-400", colorClass.includes('amber') && "text-amber-600 dark:text-amber-400", colorClass.includes('rose') && "text-rose-600 dark:text-rose-400")}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black">{title}</p>
        <p className="text-2xl font-black text-slate-950 dark:text-white tracking-tighter italic">{value}</p>
      </div>
    </GlassCard>
  );
}
