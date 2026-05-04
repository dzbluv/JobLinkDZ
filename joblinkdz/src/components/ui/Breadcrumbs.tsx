import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { motion } from 'motion/react';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex mb-8" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            to="/" 
            className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest"
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 text-slate-600" />
            {item.path ? (
              <Link
                to={item.path}
                className="text-slate-400 hover:text-indigo-400 transition-colors text-xs font-bold uppercase tracking-widest"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-widest italic truncate max-w-[200px]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
