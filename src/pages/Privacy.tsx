import React from 'react';
import { GlassCard } from '../components/ui/Shared';
import { motion } from 'motion/react';

export default function Privacy() {
  return (
    <div className="min-h-screen pt-24 px-8 pb-12 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">Privacy Policy</h1>
        <GlassCard className="p-8 space-y-6 text-slate-600 dark:text-slate-300">
          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">1. Information We Collect</h2>
            <p>
              When you use JobLinkDZ, we collect information that you provide to us directly, such as your name, email address, resume details, and any other information you choose to provide in your profile.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, including matching you with potential job opportunities and communicating with you about your account and our services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">3. Information Sharing</h2>
            <p>
              We share your profile and resume information with prospective employers when you apply for jobs through our platform. We do not sell your personal information to third parties.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">4. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
        </GlassCard>
      </motion.div>
    </div>
  );
}
