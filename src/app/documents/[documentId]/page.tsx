'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FileText,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Tag,
  Gauge,
  Smile,
  BookOpen,
  Download,
  Share2,
  Copy,
  Check,
  FileCode,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CloudDocument } from '@/types';
import { formatBytes, formatRelativeTime } from '@/lib/utils';

export default function DocumentAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const [document, setDocument] = useState<CloudDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(`/api/demo-seed?userId=all`);
        if (res.ok) {
          const data = await res.json();
          const target = data.documents?.find((d: CloudDocument) => d.id === documentId);
          if (target) {
            setDocument(target);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [documentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center space-x-3 text-sm text-slate-400">
            <Sparkles className="h-5 w-5 animate-spin text-indigo-500" />
            <span>Loading cloud analysis...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 max-w-xl mx-auto flex flex-col items-center justify-center text-center p-8 space-y-4">
          <FileText className="h-12 w-12 text-slate-400" />
          <h2 className="text-xl font-bold text-foreground">Document not found</h2>
          <p className="text-xs text-slate-400">
            This document might have been removed or does not exist.
          </p>
          <Link href="/documents">
            <Button size="sm">Back to Library</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const analysis = document.analysis;

  const handleCopySummary = () => {
    if (analysis?.detailedSummary) {
      navigator.clipboard.writeText(analysis.detailedSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Top bar with back button & actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/documents"
            className="inline-flex items-center text-xs text-slate-500 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Document Library
          </Link>

          <div className="flex items-center space-x-2">
            <Link href={`/documents/${document.id}/report`}>
              <Button variant="outline" size="sm">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
                AI Report
              </Button>
            </Link>
            <Link href={`/documents/${document.id}/chat`}>
              <Button size="sm" className="shadow-lg shadow-indigo-600/25">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat With Document
              </Button>
            </Link>
          </div>
        </div>

        {/* Document Header Hero Banner */}
        <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start space-x-4">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <FileText className="h-7 w-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    {document.fileName}
                  </h1>
                  <Badge variant="success" className="gap-1 text-xs">
                    <CheckCircle2 className="h-3 w-3" /> Analyzed ✓
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">
                  {document.fileType.toUpperCase()} • {formatBytes(document.fileSize)} •{' '}
                  {document.pageCount} pages • Indexed in Cloud Storage
                </p>
              </div>
            </div>

            {/* Quick telemetry badges */}
            <div className="flex flex-wrap sm:flex-col gap-2 text-right">
              <div className="flex items-center space-x-2 text-xs text-slate-500 justify-end">
                <Clock className="h-3.5 w-3.5" />
                <span>Reading Time: ~{analysis?.readingTimeMinutes || 3} min</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-500 justify-end">
                <Gauge className="h-3.5 w-3.5" />
                <span>Difficulty: {analysis?.difficulty || 'Intermediate'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Classification & Metadata Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Document Type</p>
              <h4 className="text-sm font-bold text-foreground">
                {analysis?.documentType || 'Research Paper'}
              </h4>
            </div>
          </Card>

          <Card className="p-4 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Gauge className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Technical Depth</p>
              <h4 className="text-sm font-bold text-foreground">
                {analysis?.difficulty || 'Intermediate'}
              </h4>
            </div>
          </Card>

          <Card className="p-4 flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Smile className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Tone & Sentiment</p>
              <h4 className="text-sm font-bold text-foreground">
                {analysis?.sentiment || 'Neutral'}
              </h4>
            </div>
          </Card>
        </div>

        {/* AI Summary Section */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-sm font-bold flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              <span>AI Executive Summary</span>
            </CardTitle>
            <button
              onClick={handleCopySummary}
              className="text-xs text-slate-400 hover:text-foreground flex items-center space-x-1"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Summary'}</span>
            </button>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/15">
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">
                Short Overview
              </p>
              <p className="text-sm text-foreground font-medium leading-relaxed">
                {analysis?.shortSummary}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Detailed Technical Synthesis
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {analysis?.detailedSummary}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Points & Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold">Key Insights & Takeaways</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis?.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800/60 flex items-start space-x-3 text-xs text-foreground"
              >
                <span className="h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-500 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{point}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Topics & Keywords Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center space-x-2">
                <Tag className="h-4 w-4 text-indigo-500" />
                <span>Core Topics</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis?.topics.map((topic, i) => (
                  <Badge key={i} variant="purple" className="text-xs py-1 px-3">
                    {topic}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center space-x-2">
                <Layers className="h-4 w-4 text-indigo-500" />
                <span>Extracted Keywords</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis?.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-mono"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Raw Text Preview Drawer */}
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowRawText(!showRawText)}
            className="text-xs text-slate-400 hover:text-foreground"
          >
            <FileCode className="h-3.5 w-3.5 mr-1.5" />
            {showRawText ? 'Hide Extracted Text' : 'View Extracted Text Preview'}
          </Button>

          {showRawText && (
            <div className="mt-3 p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap max-h-80 overflow-y-auto">
              {document.rawTextPreview || 'No preview available.'}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
