'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileText,
  Cpu,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Server,
  Activity,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnalyticsCharts } from '@/components/analytics/analytics-charts';
import { useAuth } from '@/context/auth-context';
import { PlatformMetrics } from '@/types';
import { formatBytes } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { user, loginDemo } = useAuth();
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);

  useEffect(() => {
    setMetrics({
      totalUsers: 48,
      totalDocuments: 30,
      documentsAnalyzed: 26,
      totalQuestionsAsked: 142,
      storageUsedBytes: 56800000,
      failedJobs: 0,
      activeAiRequests: 3,
      dailyUploads: [
        { date: 'Mon', uploads: 6 },
        { date: 'Tue', uploads: 9 },
        { date: 'Wed', uploads: 14 },
        { date: 'Thu', uploads: 12 },
        { date: 'Fri', uploads: 18 },
        { date: 'Sat', uploads: 8 },
        { date: 'Sun', uploads: 11 },
      ],
      fileTypeDistribution: [
        { name: 'PDF', value: 72 },
        { name: 'DOCX', value: 18 },
        { name: 'TXT', value: 10 },
      ],
      topicDistribution: [
        { topic: 'Cloud Computing', count: 28 },
        { topic: 'AI & Neural Nets', count: 22 },
        { topic: 'Data Engineering', count: 16 },
        { topic: 'Cybersecurity', count: 12 },
        { topic: 'Distributed Systems', count: 9 },
      ],
    });
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <Badge variant="purple" className="gap-1">
                  <ShieldAlert className="h-3 w-3" /> System Console
                </Badge>
                <span className="text-xs text-emerald-500 font-medium">All Cloud Nodes Online</span>
              </div>
              <h1 className="text-2xl font-extrabold text-foreground mt-1">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">
                Platform-level telemetry, serverless function health, and multi-tenant resource usage
              </p>
            </div>

            {!isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => loginDemo('admin')}
                className="text-xs border-purple-500/30 text-purple-400"
              >
                Switch to Admin Role (Viva Mode)
              </Button>
            )}
          </div>

          {!isAdmin ? (
            <Card className="p-8 text-center max-w-lg mx-auto space-y-4">
              <Lock className="h-10 w-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-foreground">Admin Access Restricted</h3>
              <p className="text-xs text-slate-400">
                You are currently viewing as regular user ({user?.email}). Switch to the administrator role to view system-wide cloud telemetry.
              </p>
              <Button onClick={() => loginDemo('admin')}>
                Enable Admin Demo View
              </Button>
            </Card>
          ) : (
            <>
              {/* Platform Metrics KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                <Card className="p-4 space-y-1">
                  <p className="text-[11px] text-slate-400 font-medium">Total Users</p>
                  <h3 className="text-xl font-bold text-foreground">48</h3>
                  <p className="text-[10px] text-emerald-500 font-medium">+6 this month</p>
                </Card>

                <Card className="p-4 space-y-1">
                  <p className="text-[11px] text-slate-400 font-medium">Total Documents</p>
                  <h3 className="text-xl font-bold text-foreground">30</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Across all tenants</p>
                </Card>

                <Card className="p-4 space-y-1">
                  <p className="text-[11px] text-slate-400 font-medium">Analyzed</p>
                  <h3 className="text-xl font-bold text-foreground">26</h3>
                  <p className="text-[10px] text-emerald-500 font-medium">86.6% indexed</p>
                </Card>

                <Card className="p-4 space-y-1">
                  <p className="text-[11px] text-slate-400 font-medium">AI Requests</p>
                  <h3 className="text-xl font-bold text-foreground">142</h3>
                  <p className="text-[10px] text-slate-400 font-medium">~320ms avg latency</p>
                </Card>

                <Card className="p-4 space-y-1">
                  <p className="text-[11px] text-slate-400 font-medium">Storage Usage</p>
                  <h3 className="text-xl font-bold text-foreground">56.8 MB</h3>
                  <p className="text-[10px] text-slate-400 font-medium">11.3% pool quota</p>
                </Card>

                <Card className="p-4 space-y-1">
                  <p className="text-[11px] text-slate-400 font-medium">Failed Jobs</p>
                  <h3 className="text-xl font-bold text-emerald-500">0</h3>
                  <p className="text-[10px] text-emerald-500 font-medium">100% reliability</p>
                </Card>
              </div>

              {/* Charts */}
              {metrics && (
                <AnalyticsCharts
                  dailyUploads={metrics.dailyUploads}
                  fileTypeDistribution={metrics.fileTypeDistribution}
                  topicDistribution={metrics.topicDistribution}
                />
              )}

              {/* Cloud Services Health Table */}
              <Card className="p-6 space-y-4">
                <h3 className="text-base font-bold text-foreground">
                  Cloud Infrastructure Health Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Firebase Storage Bucket</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-slate-400">gs://documind-ai.appspot.com</p>
                    <span className="text-emerald-500 font-mono text-[10px]">Latency: 48ms</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Cloud Firestore NoSQL</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-slate-400">us-central1 region</p>
                    <span className="text-emerald-500 font-mono text-[10px]">Composite indexes ready</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Serverless AI Pipeline</span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-slate-400">Google Gemini & Local RAG</p>
                    <span className="text-emerald-500 font-mono text-[10px]">Auto-failover active</span>
                  </div>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
