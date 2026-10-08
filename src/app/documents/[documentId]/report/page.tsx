'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FileText,
  Printer,
  Download,
  ArrowLeft,
  Sparkles,
  Cloud,
  CheckCircle2,
  Calendar,
  Layers,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CloudDocument, ChatMessage } from '@/types';
import { formatBytes, formatDate } from '@/lib/utils';

export default function DocumentReportPage() {
  const params = useParams();
  const documentId = params.documentId as string;

  const [document, setDocument] = useState<CloudDocument | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const resDocs = await fetch(`/api/demo-seed?userId=all`);
        if (resDocs.ok) {
          const data = await resDocs.json();
          const target = data.documents?.find((d: CloudDocument) => d.id === documentId);
          if (target) setDocument(target);
        }

        const resChat = await fetch(`/api/chat?documentId=${documentId}`);
        if (resChat.ok) {
          const chatData = await resChat.json();
          setMessages(chatData.messages || []);
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
      <div className="min-h-screen flex items-center justify-center p-8 bg-white dark:bg-slate-950">
        <Sparkles className="h-6 w-6 animate-spin text-indigo-500 mr-2" />
        <span className="text-sm">Compiling AI Report...</span>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <p>Document not found.</p>
      </div>
    );
  }

  const analysis = document.analysis;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 sm:px-6 print:p-0 print:bg-white text-foreground">
      {/* Action toolbar (hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/documents/${document.id}`}
          className="inline-flex items-center text-xs text-slate-500 hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 mr-1" />
          Back to Analysis
        </Link>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1.5" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Formal Paper Report Sheet */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:rounded-none space-y-8">
        {/* Report Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                DocuMind AI • Intelligence Report
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {document.fileName}
            </h1>
            <p className="text-xs text-slate-400">
              Generated: {formatDate(new Date().toISOString())} • File Size: {formatBytes(document.fileSize)} • {document.pageCount} Pages
            </p>
          </div>

          <Badge variant="indigo" className="text-xs">
            {analysis?.documentType || 'Technical Report'}
          </Badge>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Executive Summary
          </h3>
          <p className="text-sm text-foreground leading-relaxed">
            {analysis?.detailedSummary}
          </p>
        </div>

        {/* Key Takeaways */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Key Findings & Insights
          </h3>
          <ul className="space-y-2">
            {analysis?.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Topics & Keywords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Core Topics
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {analysis?.topics.map((t, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Indexed Keywords
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {analysis?.keywords.map((k, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300"
                >
                  #{k}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Q&A Transcripts (if any) */}
        {messages.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Document Q&A Log
            </h3>
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1 text-xs"
                >
                  <p className="font-semibold text-foreground">
                    {m.sender === 'user' ? 'Q: User Query' : 'A: Grounded AI Response'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                    {m.content}
                  </p>
                  {m.sources && m.sources.length > 0 && (
                    <p className="text-[10px] text-slate-400">
                      Sources: {m.sources.map((s) => `Page ${s.pageNumber} (Chunk ${s.chunkIndex})`).join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          <p>DocuMind AI Cloud Platform • B.Tech Cloud Computing & Artificial Intelligence</p>
          <p className="text-[10px] mt-0.5">Firebase Storage & Firestore Verified Data Pipeline</p>
        </div>
      </div>
    </div>
  );
}
