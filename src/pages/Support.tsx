import React, { useState } from 'react';
import { GlassCard, Input } from '../components/ui/Shared';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { Mail, MessageSquare, Send } from 'lucide-react';

export default function Support() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate sending support request
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 px-8 pb-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Help & Support</h1>
          <p className="text-slate-500 dark:text-slate-400">How can we assist you today? Send us a message and our team will get back to you shortly.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <GlassCard className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
              <p className="text-sm text-slate-500">support@joblinkdz.com</p>
            </GlassCard>
            
            <GlassCard className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Live Chat</h3>
              <p className="text-sm text-slate-500">Available Mon-Fri, 9am - 5pm</p>
            </GlassCard>
          </div>

          <div className="md:col-span-2">
            <GlassCard className="p-8">
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-500">We'll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                      <Input type="text" required placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                      <Input type="text" required placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <Input type="email" required placeholder="john@example.com" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                    <textarea 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 outline-none focus:border-primary dark:focus:border-primary-dark transition-colors resize-none"
                      rows={5}
                      required
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-12" isLoading={status === 'sending'}>
                    Send Message
                  </Button>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
