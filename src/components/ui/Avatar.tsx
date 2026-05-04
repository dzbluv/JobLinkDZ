import React from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps {
  name: string;
  initials?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'profile';
  className?: string;
  role?: string;
}

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-400' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  violet: { bg: 'bg-violet-500/20', text: 'text-violet-400' },
  slate: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  fuchsia: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400' },
  teal: { bg: 'bg-teal-500/20', text: 'text-teal-400' },
  orange: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  sky: { bg: 'bg-sky-500/20', text: 'text-sky-400' },
  pink: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
};

export const COLOR_PALETTE = AVATAR_COLORS;
const COLOR_NAMES = Object.keys(AVATAR_COLORS);

export function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_NAMES[Math.abs(hash) % COLOR_NAMES.length];
}

export function getInitials(name: string, customInitials?: string): string {
  if (customInitials) return customInitials.slice(0, 2).toUpperCase();
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const sizeClasses: Record<string, string> = {
  sm: 'w-8 h-8 text-xs font-black',
  md: 'w-10 h-10 text-sm font-black',
  lg: 'w-12 h-12 text-base font-black',
  xl: 'w-16 h-16 text-xl font-black',
  '2xl': 'w-24 h-24 text-3xl font-black',
  profile: 'w-32 h-32 text-4xl font-black',
};

export function Avatar({ name, initials, color, size = 'md', className, role }: AvatarProps) {
  const resolvedColor = color || getColorForName(name);
  const colorStyle = AVATAR_COLORS[resolvedColor] || AVATAR_COLORS.indigo;
  const displayInitials = getInitials(name, initials);

  const isLarge = size === 'profile' || size === '2xl' || size === 'xl';

  return (
    <div
      className={cn(
        'flex items-center justify-center overflow-hidden select-none',
        'rounded-[2rem] border-2',
        sizeClasses[size],
        colorStyle.bg,
        colorStyle.text,
        isLarge ? 'border-indigo-500/20 shadow-2xl' : 'border-transparent',
        className
      )}
    >
      {displayInitials}
    </div>
  );
}
