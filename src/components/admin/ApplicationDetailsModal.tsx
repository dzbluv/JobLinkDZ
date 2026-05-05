import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  X,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { motion } from "motion/react";
import { Application, getAppCandidateName, getAppCandidateEmail, getAppCandidatePhone, getAppCandidateLocation, getAppJobTitle } from "../../data/mockApplications";
import { storageAPI } from "../../services/api";
import { Badge } from "../ui/Shared";
import { Button } from "../ui/Button";

interface ApplicationDetailsModalProps {
  app: Application;
  onClose: () => void;
  onStatusChange: (id: string, status: Application["status"]) => void;
}

export default function ApplicationDetailsModal({
  app,
  onClose,
  onStatusChange,
}: ApplicationDetailsModalProps) {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (app.resume_url) {
      storageAPI.getResumeUrl(app.resume_url).then((url) => {
        if (url) setResumeUrl(url);
      });
    }
  }, [app.resume_url]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden glass rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white italic flex flex-col">
                <span>{getAppCandidateName(app)}</span>
                <span className="text-sm font-medium text-indigo-400 not-italic tracking-wide">
                  {getAppCandidateEmail(app)}
                </span>
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Application for{" "}
                <span className="text-indigo-400">{getAppJobTitle(app)}</span>
              </p>
              <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-400 font-medium">
                {getAppCandidateEmail(app) !== 'N/A' && (
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {getAppCandidateEmail(app)}</span>
                )}
                {getAppCandidatePhone(app) !== 'N/A' && (
                  <span className="flex items-center gap-1.5">📞 {getAppCandidatePhone(app)}</span>
                )}
                {getAppCandidateLocation(app) !== 'N/A' && (
                  <span className="flex items-center gap-1.5">📍 {getAppCandidateLocation(app)}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> Cover Message
                </h3>
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  {app.cover_letter || "No cover letter provided."}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> CV Preview
                </h3>
                <div className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-900 border-b border-white/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white italic">
                        {app.resume_url ? "Resume Attached" : "No file"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {resumeUrl && (
                        <>
                          <a
                            href={resumeUrl}
                            download
                            className="h-7 w-7 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 w-7 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-md transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-900 flex flex-col selection:bg-indigo-100" style={{ height: '500px' }}>
                    {app.resume_url ? (
                      resumeUrl ? (
                        <div className="flex-1 relative flex flex-col">
                          <iframe 
                            src={resumeUrl} 
                            title="CV Preview" 
                            className="w-full h-full border-0 flex-1"
                          />
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg"
                              onClick={() => window.open(resumeUrl, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" /> Open in New Tab
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                          <span className="ml-2 text-slate-500">Loading document...</span>
                        </div>
                      )
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-500">
                        No CV provided for this application.
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                  Details
                </h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                      Status
                    </p>
                    <Badge
                      variant={
                        app.status === "accepted"
                          ? "success"
                          : app.status === "pending"
                            ? "warning"
                            : "info"
                      }
                      className="mt-1"
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                      Applied On
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {new Date(app.created_at).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      })}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">
                      Job ID
                    </p>
                    <p className="text-sm font-mono text-indigo-400">
                      #{app.job_id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="w-full text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 gap-2 text-xs"
                    onClick={() => {
                      onStatusChange(app.id, "accepted");
                      onClose();
                    }}
                  >
                    <CheckCircle className="w-4 h-4" /> Accept
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-rose-400 border-rose-500/20 hover:bg-rose-500/10 gap-2 text-xs"
                    onClick={() => {
                      onStatusChange(app.id, "rejected");
                      onClose();
                    }}
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end">
          <Button onClick={onClose} variant="ghost">
            Close Details
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
