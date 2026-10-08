import React from 'react';
import Link from 'next/link';
import { Cloud, Heart, Shield, Cpu, Database, Server } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 backdrop-blur-md py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Cloud className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-foreground">
                DocuMind AI
              </span>
              <p className="text-xs text-slate-500">
                Cloud Computing & Artificial Intelligence Mini Project
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Database className="h-3.5 w-3.5 text-indigo-500" /> Cloud Firestore
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Server className="h-3.5 w-3.5 text-indigo-500" /> Firebase Storage
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5 text-indigo-500" /> Serverless Cloud Functions
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-indigo-500" /> Firebase Auth
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center md:text-right">
            Designed for B.Tech Cloud Computing Viva & Demonstration
          </p>
        </div>
      </div>
    </footer>
  );
}
