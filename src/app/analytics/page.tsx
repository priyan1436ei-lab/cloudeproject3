'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  Database,
  Tag,
  Hash,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { AnalyticsCharts } from '@/components/analytics/analytics-charts';
import { PlatformMetrics } from '@/types';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated live metrics calculation
    setMetrics({
      totalUsers: 42,
      totalDocuments: 12,
      documentsAnalyzed: 10,
      totalQuestionsAsked: 86,
      storageUsedBytes: 245000000,
      failedJobs: 0,
      activeAiRequests: 4,
      dailyUploads: [
        { date: 'Mon', uploads: 2 },
        { date: 'Tue', uploads: 5 },
        { date: 'Wed', uploads: 9 },
        { date: 'Thu', uploads: 7 },
        { date: 'Fri', uploads: 12 },
        { date: 'Sat', uploads: 4 },
        { date: 'Sun', uploads: 8 },
      ],
      fileTypeDistribution: [
        { name: 'PDF', value: 70 },
        { name: 'DOCX', value: 20 },
        { name: 'TXT', value: 10 },
      ],
      topicDistribution: [
        { topic: 'Cloud Computing', count: 18 },
        { topic: 'Artificial Intelligence', count: 14 },
        { topic: 'Distributed Systems', count: 11 },
        { topic: 'Cybersecurity', count: 8 },
        { topic: 'Data Engineering', count: 6 },
      ],
    });
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">AI Insights & Cloud Analytics</h1>
            <p className="text-xs text-slate-400 mt-1">
              Visual telemetry of document ingestion, semantic classifications, and RAG query trends
            </p>
          </div>

          {/* Analytics KPI Stat Cards (Matching section 21 requirements) */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Total Documents</p>
              <h3 className="text-2xl font-bold text-foreground">12</h3>
              <p className="text-[10px] text-emerald-500 font-medium">+2 this week</p>
            </Card>

            <Card className="p-4 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Avg. Document Length</p>
              <h3 className="text-2xl font-bold text-foreground">18 pages</h3>
              <p className="text-[10px] text-slate-400 font-medium">~3,400 words</p>
            </Card>

            <Card className="p-4 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Most Common Topic</p>
              <h3 className="text-lg font-bold text-indigo-400 truncate">Cloud Computing</h3>
              <p className="text-[10px] text-slate-400 font-medium">18 occurrences</p>
            </Card>

            <Card className="p-4 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Most Used Keyword</p>
              <h3 className="text-lg font-bold text-purple-400">#AI</h3>
              <p className="text-[10px] text-slate-400 font-medium">29 mentions</p>
            </Card>

            <Card className="p-4 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Questions Asked</p>
              <h3 className="text-2xl font-bold text-foreground">86</h3>
              <p className="text-[10px] text-emerald-500 font-medium">98.8% grounded</p>
            </Card>
          </div>

          {/* Recharts Visualizations */}
          {metrics && (
            <AnalyticsCharts
              dailyUploads={metrics.dailyUploads}
              fileTypeDistribution={metrics.fileTypeDistribution}
              topicDistribution={metrics.topicDistribution}
            />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
