'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FileCode,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatBytes } from '@/lib/utils';
import { validateFile } from '@/lib/document-processing/validator';
import { useAuth } from '@/context/auth-context';

interface UploadDropzoneProps {
  onSuccess?: (docId: string) => void;
  onClose?: () => void;
}

export function UploadDropzone({ onSuccess, onClose }: UploadDropzoneProps) {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setError(null);
    const validation = validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid) {
      setError(validation.error || 'Invalid file format or size.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    try {
      setStatus('uploading');
      setUploadProgress(15);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 15;
        });
      }, 150);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('userId', user?.uid || 'demo_user');

      // Call API
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to process document');
      }

      setUploadProgress(100);
      setStatus('processing');

      const data = await res.json();
      setStatus('done');

      setTimeout(() => {
        if (onSuccess) {
          onSuccess(data.document.id);
        } else {
          router.push(`/documents/${data.document.id}`);
        }
      }, 700);
    } catch (err: any) {
      setStatus('idle');
      setError(err.message || 'An error occurred during cloud processing.');
    }
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setError(null);
    setStatus('idle');
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl glass-card p-6 sm:p-8 shadow-2xl relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-foreground">Upload to Cloud Storage</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Secure multi-tenant cloud storage with serverless text parsing & AI indexing
        </p>
      </div>

      {/* Drop area */}
      {!selectedFile && status === 'idle' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleChange}
            className="hidden"
          />
          <div className="h-16 w-16 mx-auto rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 shadow-inner">
            <UploadCloud className="h-8 w-8" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Supported formats: PDF (up to 20MB), DOCX (20MB), TXT (10MB)
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge variant="secondary">PDF</Badge>
            <Badge variant="secondary">DOCX</Badge>
            <Badge variant="secondary">TXT</Badge>
          </div>
        </div>
      ) : null}

      {/* Selected File State */}
      {selectedFile && status === 'idle' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3 truncate">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(selectedFile.size)}</p>
              </div>
            </div>
            <button
              onClick={resetSelection}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="w-1/2" onClick={resetSelection}>
              Cancel
            </Button>
            <Button className="w-1/2" onClick={handleUploadAndAnalyze}>
              Start AI Analysis
            </Button>
          </div>
        </div>
      )}

      {/* Uploading & Processing State */}
      {(status === 'uploading' || status === 'processing' || status === 'done') && (
        <div className="space-y-5 py-4">
          <div className="text-center space-y-2">
            {status === 'uploading' && (
              <>
                <p className="text-sm font-semibold text-foreground">
                  Uploading to Firebase Storage...
                </p>
                <p className="text-xs text-slate-400">{uploadProgress}% complete</p>
              </>
            )}
            {status === 'processing' && (
              <>
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                  <p className="text-sm font-semibold text-foreground">
                    Extracting text & generating AI embeddings...
                  </p>
                </div>
                <p className="text-xs text-slate-400">
                  Executing serverless pipeline & chunk indexing
                </p>
              </>
            )}
            {status === 'done' && (
              <div className="flex items-center justify-center space-x-2 text-emerald-500">
                <CheckCircle2 className="h-5 w-5" />
                <p className="text-sm font-semibold">Uploaded & Analyzed successfully!</p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
