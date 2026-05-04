import React from 'react';
import { Link } from 'react-router-dom';
import { SearchX, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <div className="relative mb-12">
           <h1 className="text-[12rem] font-black text-slate-100 dark:text-slate-900 leading-none select-none">404</h1>
           <div className="absolute inset-0 flex items-center justify-center">
              <SearchX className="w-24 h-24 text-primary animate-float" />
           </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Page Lost in the Clouds</h2>
        <p className="text-lg text-slate-500 mb-10">
          The recruitment opportunity you're looking for might have been closed, or the link is broken.
        </p>
        <Link to="/">
           <Button size="lg" className="px-10 gap-2"> <Home className="w-5 h-5" /> Back to Safety</Button>
        </Link>
      </motion.div>
    </div>
  );
}
