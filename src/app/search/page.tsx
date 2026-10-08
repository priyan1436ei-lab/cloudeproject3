'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  FileText,
  Sparkles,
  ArrowRight,
  Tag,
  FolderOpen,
  MessageSquare,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudDocument } from '@/types';
import { formatBytes } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export default function DocumentSearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState<CloudDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
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
    fetchDocs();
  }, [user]);

  const cleanQ = query.toLowerCase().trim();

  const searchResults = documents.filter((doc) => {
    if (!cleanQ) return true;
    const nameMatch = doc.fileName.toLowerCase().includes(cleanQ);
    const topicMatch = doc.analysis?.topics.some((t) => t.toLowerCase().includes(cleanQ));
    const keywordMatch = doc.analysis?.keywords.some((k) => k.toLowerCase().includes(cleanQ));
    const summaryMatch = doc.analysis?.detailedSummary.toLowerCase().includes(cleanQ);
    const rawMatch = doc.rawTextPreview?.toLowerCase().includes(cleanQ);

    return nameMatch || topicMatch || keywordMatch || summaryMatch || rawMatch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Global Document Search</h1>
            <p className="text-xs text-slate-400 mt-1">
              Search across your cloud library by filename, topics, extracted keywords, or deep content text.
            </p>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <Search className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search across documents... (e.g. 'virtualization', 'machine learning', 'resiliency')"
              className="pl-12 h-14 text-sm sm:text-base rounded-2xl shadow-sm"
              autoFocus
            />
          </div>

          {/* Popular Search Suggestions */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Quick filters:</span>
            {['Cloud Computing', 'Artificial Intelligence', 'Security', 'Architecture'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-indigo-500/10 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Found <strong>{searchResults.length}</strong> matching document{searchResults.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Results list */}
          <div className="space-y-4">
            {searchResults.map((doc) => (
              <Card key={doc.id} className="p-6 hover:shadow-xl transition-all space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs">
                      {doc.fileType.toUpperCase()}
                    </div>
                    <div>
                      <Link href={`/documents/${doc.id}`} className="hover:text-indigo-400">
                        <h3 className="text-base font-bold text-foreground">{doc.fileName}</h3>
                      </Link>
                      <p className="text-xs text-slate-400">
                        {formatBytes(doc.fileSize)} • {doc.pageCount} pages •{' '}
                        {doc.analysis?.documentType || 'Technical Document'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link href={`/documents/${doc.id}/chat`}>
                      <Button size="sm" variant="outline" className="text-xs">
                        <MessageSquare className="h-3.5 w-3.5 mr-1" />
                        Chat
                      </Button>
                    </Link>
                    <Link href={`/documents/${doc.id}`}>
                      <Button size="sm" className="text-xs">
                        Inspect
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Excerpt */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  {doc.analysis?.shortSummary || 'Document text indexed.'}
                </p>

                {/* Topics and Keywords */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {doc.analysis?.topics.map((t, idx) => (
                    <Badge key={idx} variant="purple" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                  {doc.analysis?.keywords.slice(0, 4).map((kw, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px]">
                      #{kw}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}

            {searchResults.length === 0 && (
              <div className="text-center py-16 rounded-3xl glass-card border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
                <Search className="h-10 w-10 text-slate-400 mx-auto" />
                <h4 className="text-sm font-semibold text-foreground">No matching documents</h4>
                <p className="text-xs text-slate-400">Try searching for broader terms or keywords.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
