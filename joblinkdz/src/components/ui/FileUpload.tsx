import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export function FileUpload({ onFileSelect, accept = ".pdf" }: { onFileSelect: (file: File | null) => void, accept?: string }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file || null);
  };

  const validateAndSetFile = (file: File | null) => {
    setError(null);
    if (!file) return;

    if (accept === ".pdf" && file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("File size should be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    simulateUpload(file);
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileSelect(file);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-primary/5 hover:border-primary",
              error && "border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-900/10"
            )}
          >
            <Upload className="w-10 h-10 text-slate-400 dark:text-slate-600 mb-2" />
            <p className="text-lg font-medium">Click to upload CV</p>
            <p className="text-sm text-slate-500">Only PDF accepted (Max 5MB)</p>
            {error && (
              <div className="mt-4 flex items-center gap-2 text-rose-500 text-sm bg-rose-100 dark:bg-rose-900/30 px-3 py-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="progress"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 bg-white/50 dark:bg-slate-800/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <File className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile} disabled={isUploading}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full bg-primary"
                />
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-500">{isUploading ? 'Uploading...' : 'Ready to submit'}</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>

            {!isUploading && uploadProgress === 100 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 text-emerald-500 text-sm font-medium"
              >
                <CheckCircle2 className="w-4 h-4" />
                File verified and ready
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { SearchX } from 'lucide-react';

export function EmptyState({ title, description }: { title: string, description: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 transition-transform hover:rotate-12">
        <SearchX className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm">{description}</p>
    </div>
  );
}
