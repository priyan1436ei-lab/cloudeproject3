'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderOpen,
  GitCompare,
  Search,
  BarChart3,
  ShieldAlert,
  UploadCloud,
  HardDrive,
  Cpu,
  Layers,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';

export function Sidebar({ onOpenUpload }: { onOpenUpload?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Document Library', href: '/documents', icon: FolderOpen },
    { label: 'Compare Documents', href: '/compare', icon: GitCompare },
    { label: 'Smart Search', href: '/search', icon: Search },
    { label: 'AI Analytics', href: '/analytics', icon: BarChart3 },
    ...(user?.role === 'admin'
      ? [{ label: 'Admin Metrics', href: '/admin', icon: ShieldAlert }]
      : []),
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Upload Action */}
        <div className="pt-2">
          <Button
            onClick={onOpenUpload}
            className="w-full justify-center shadow-lg shadow-indigo-600/20"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Cloud Infrastructure Telemetry Card */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-850">
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
              <HardDrive className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
              Cloud Storage
            </span>
            <span className="text-[11px] font-semibold text-slate-500">2.4%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full w-[24%]" />
          </div>

          <p className="text-[10px] text-slate-400">
            11.87 MB of 500 MB cloud quota
          </p>
        </div>

        {/* Live Cloud Architecture Tag */}
        <div className="px-2 flex items-center space-x-2 text-[11px] text-emerald-500 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Firebase & Gemini Live</span>
        </div>
      </div>
    </aside>
  );
}
