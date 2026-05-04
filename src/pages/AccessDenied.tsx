import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';

export default function AccessDenied() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-8">
           <ShieldAlert className="w-12 h-12 text-rose-500" />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 uppercase tracking-tighter">Access Denied</h1>
        <p className="text-xl text-slate-500 mb-10 leading-relaxed">
          Whoops! You don't have the necessary clearance to view this high-level recruiter area.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <Button variant="outline" className="gap-2" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" /> Go Back
           </Button>
           <Link to="/">
              <Button className="gap-2"> <Home className="w-4 h-4" /> Return Home</Button>
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
