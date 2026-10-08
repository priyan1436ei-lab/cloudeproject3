'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  GitCompare,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Layers,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudDocument, DocumentComparisonResult } from '@/types';

export default function DocumentComparisonPage() {
  const [documents, setDocuments] = useState<CloudDocument[]>([]);
  const [docAId, setDocAId] = useState<string>('');
  const [docBId, setDocBId] = useState<string>('');
  const [comparison, setComparison] = useState<DocumentComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch('/api/demo-seed?userId=all');
        if (res.ok) {
          const data = await res.json();
          const docs: CloudDocument[] = data.documents || [];
          setDocuments(docs);
          if (docs.length >= 2) {
            setDocAId(docs[0].id);
            setDocBId(docs[1].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDocs();
  }, []);

  const handleCompare = async () => {
    if (!docAId || !docBId || docAId === docBId) return;

    setLoading(true);
    try {
      const res = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docIdA: docAId, docIdB: docBId }),
      });

      if (res.ok) {
        const data = await res.json();
        setComparison(data.comparison);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Differentiating AI Feature</span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">Compare Documents</h1>
            <p className="text-xs text-slate-400 mt-1">
              Select two documents to generate a semantic comparison, identifying shared themes, divergences, and unique takeaways.
            </p>
          </div>

          {/* Selectors */}
          <Card className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Document A</label>
                <select
                  value={docAId}
                  onChange={(e) => setDocAId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fileName} ({d.fileType.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">Document B</label>
                <select
                  value={docBId}
                  onChange={(e) => setDocBId(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.fileName} ({d.fileType.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button
                onClick={handleCompare}
                disabled={loading || docAId === docBId}
                isLoading={loading}
                className="shadow-lg shadow-indigo-600/20"
              >
                <GitCompare className="h-4 w-4 mr-2" />
                Analyze & Compare
              </Button>
            </div>
          </Card>

          {/* Comparison Output */}
          {comparison && (
            <div className="space-y-6 animate-slide-up">
              {/* Summary comparison banner */}
              <div className="p-6 rounded-3xl glass-card border border-indigo-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-500">
                  <Sparkles className="h-4 w-4" />
                  <span>Executive Comparison Synthesis</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-foreground">
                  {comparison.summaryComparison}
                </p>
                <div className="p-3.5 rounded-xl bg-indigo-500/10 text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  <strong>Recommendation:</strong> {comparison.recommendation}
                </div>
              </div>

              {/* Shared Topics & Differences */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Common Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {comparison.commonTopics.map((topic, i) => (
                      <Badge key={i} variant="success" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-indigo-500 truncate">
                    <Layers className="h-4 w-4 shrink-0" />
                    <span className="truncate">Only in {comparison.docA.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {comparison.differentTopicsA.map((topic, i) => (
                      <Badge key={i} variant="default" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-500 truncate">
                    <Layers className="h-4 w-4 shrink-0" />
                    <span className="truncate">Only in {comparison.docB.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {comparison.differentTopicsB.map((topic, i) => (
                      <Badge key={i} variant="purple" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Contradictions & Tradeoffs */}
              {comparison.contradictions.length > 0 && (
                <Card className="p-6 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Architectural Trade-offs & Contradictions</span>
                  </div>
                  <ul className="space-y-2">
                    {comparison.contradictions.map((c, i) => (
                      <li key={i} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-500/5 p-3 rounded-xl border border-amber-500/15">
                        {c}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {/* Unique Insights Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Unique to &ldquo;{comparison.docA.name}&rdquo;
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {comparison.uniqueInsightsA.map((ins, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Lightbulb className="h-3.5 w-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Unique to &ldquo;{comparison.docB.name}&rdquo;
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {comparison.uniqueInsightsB.map((ins, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Lightbulb className="h-3.5 w-3.5 text-purple-500 mt-0.5 shrink-0" />
                        <span>{ins}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
