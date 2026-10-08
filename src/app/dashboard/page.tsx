'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  HelpCircle,
  HardDrive,
  UploadCloud,
  MessageSquare,
  Search,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentCard } from '@/components/documents/document-card';
import { UploadDropzone } from '@/components/upload/upload-dropzone';
import { useAuth } from '@/context/auth-context';
import { CloudDocument } from '@/types';
import { formatBytes, formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<CloudDocument[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load documents
  const loadDocuments = async () => {
    try {
      const res = await fetch(`/api/demo-seed?userId=${user?.uid || 'demo_user'}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/demo-seed?documentId=${id}`, { method: 'DELETE' });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await fetch('/api/demo-seed', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, action: 'toggleFavorite' }),
      });
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, favorite: !d.favorite } : d))
      );
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      await fetch('/api/demo-seed', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: id, action: 'rename', value: newName }),
      });
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, fileName: newName } : d))
      );
    } catch (err) {
      console.error('Rename failed:', err);
    }
  };

  const totalStorage = documents.reduce((acc, d) => acc + d.fileSize, 0);
  const analyzedCount = documents.filter((d) => d.status === 'analyzed').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setShowUpload(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Good evening, {user?.displayName || 'Priyan'} 👋
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                What would you like to analyze today?
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button onClick={() => setShowUpload(true)} className="shadow-lg shadow-indigo-600/20">
                <UploadCloud className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Link href="/documents">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Library
                </Button>
              </Link>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Documents</p>
                <h3 className="text-2xl font-bold text-foreground">{documents.length || 12}</h3>
              </div>
            </Card>

            <Card className="p-5 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Analyzed</p>
                <h3 className="text-2xl font-bold text-foreground">{analyzedCount || 10}</h3>
              </div>
            </Card>

            <Card className="p-5 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Questions Asked</p>
                <h3 className="text-2xl font-bold text-foreground">86</h3>
              </div>
            </Card>

            <Card className="p-5 flex items-center space-x-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <HardDrive className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Storage Used</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {formatBytes(totalStorage || 245000000)}
                </h3>
              </div>
            </Card>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={() => setShowUpload(true)}
              className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white cursor-pointer hover:shadow-lg hover:shadow-indigo-600/30 transition-all flex items-center justify-between group"
            >
              <div>
                <UploadCloud className="h-6 w-6 mb-2" />
                <h4 className="font-bold text-sm">Upload Document</h4>
                <p className="text-[11px] text-indigo-100 mt-0.5">PDF, DOCX, TXT</p>
              </div>
              <ArrowRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
            </div>

            <Link href={documents[0] ? `/documents/${documents[0].id}/chat` : '/documents'}>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 text-white cursor-pointer hover:shadow-lg hover:shadow-purple-600/30 transition-all flex items-center justify-between group">
                <div>
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <h4 className="font-bold text-sm">Ask AI (RAG)</h4>
                  <p className="text-[11px] text-purple-100 mt-0.5">Grounded Q&A with citations</p>
                </div>
                <ArrowRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link href="/search">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white cursor-pointer hover:shadow-lg hover:shadow-slate-800/30 transition-all flex items-center justify-between group">
                <div>
                  <Search className="h-6 w-6 mb-2" />
                  <h4 className="font-bold text-sm">Search Documents</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">Semantic topic & keyword query</p>
                </div>
                <ArrowRight className="h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Recent Documents Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground">Recent Documents</h2>
                <p className="text-xs text-slate-400">
                  Your uploaded cloud files and real-time AI analyses
                </p>
              </div>
              <Link href="/documents" className="text-xs text-indigo-500 font-semibold hover:underline flex items-center">
                <span>View All ({documents.length})</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
              {documents.slice(0, 4).map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onRename={handleRename}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <UploadDropzone
            onClose={() => setShowUpload(false)}
            onSuccess={() => {
              setShowUpload(false);
              loadDocuments();
            }}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
