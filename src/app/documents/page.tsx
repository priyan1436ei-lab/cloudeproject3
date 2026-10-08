'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Search,
  UploadCloud,
  Star,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DocumentCard } from '@/components/documents/document-card';
import { UploadDropzone } from '@/components/upload/upload-dropzone';
import { useAuth } from '@/context/auth-context';
import { CloudDocument } from '@/types';

type FilterTab = 'all' | 'recent' | 'favorites' | 'analyzed' | 'processing';

export default function DocumentLibraryPage() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<CloudDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<FilterTab>('all');
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const res = await fetch(`/api/demo-seed?userId=${user?.uid || 'demo_user'}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const handleDelete = async (id: string) => {
    await fetch(`/api/demo-seed?documentId=${id}`, { method: 'DELETE' });
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleToggleFavorite = async (id: string) => {
    await fetch('/api/demo-seed', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: id, action: 'toggleFavorite' }),
    });
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, favorite: !d.favorite } : d))
    );
  };

  const handleRename = async (id: string, newName: string) => {
    await fetch('/api/demo-seed', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: id, action: 'rename', value: newName }),
    });
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, fileName: newName } : d))
    );
  };

  // Filtered documents
  const filtered = documents.filter((doc) => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.analysis?.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.analysis?.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (currentTab === 'favorites') return doc.favorite;
    if (currentTab === 'analyzed') return doc.status === 'analyzed';
    if (currentTab === 'processing') return doc.status === 'processing';
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenUpload={() => setShowUpload(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">Document Library</h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage, search, and inspect your cloud-stored documents
              </p>
            </div>

            <Button onClick={() => setShowUpload(true)}>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>

          {/* Search bar & Filter Tabs */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by name, topic, keyword..."
                className="pl-9 h-10"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              {(
                [
                  { id: 'all', label: 'All Docs' },
                  { id: 'favorites', label: 'Favorites', icon: Star },
                  { id: 'analyzed', label: 'Analyzed', icon: CheckCircle2 },
                  { id: 'processing', label: 'Processing', icon: Clock },
                ] as const
              ).map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id as FilterTab)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Document Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onRename={handleRename}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl glass-card border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                <FolderOpen className="h-7 w-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground">No documents found</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting your filter or upload a new file to get started.
                </p>
              </div>
              <Button size="sm" onClick={() => setShowUpload(true)}>
                Upload File Now
              </Button>
            </div>
          )}
        </main>
      </div>

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
