'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Cloud,
  FileText,
  Shield,
  Search,
  MessageSquare,
  Cpu,
  Database,
  ArrowRight,
  Layers,
  CheckCircle2,
  HardDrive,
  Lock,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { UploadDropzone } from '@/components/upload/upload-dropzone';

export default function LandingPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [demoInput, setDemoInput] = useState('What are the key conclusions regarding cloud elasticity?');
  const [demoResponse, setDemoResponse] = useState(
    'Cloud elasticity allows systems to autonomously scale computing resources commensurate with incoming demand, reducing idle capacity costs by up to 64% (Page 4, Chunk 2).'
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full glass border border-indigo-500/20 text-xs font-semibold text-indigo-500 dark:text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>DocuMind AI • Cloud Computing + Artificial Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Your Documents.{' '}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Smarter.
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Upload your documents to the cloud and let AI summarize, analyze, search, and answer questions about them.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => setShowUploadModal(true)}
                  className="w-full sm:w-auto px-8 shadow-xl shadow-indigo-600/25"
                >
                  <Cloud className="h-4 w-4 mr-2" />
                  Upload a Document
                </Button>
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto px-8">
                    Explore Demo Workspace
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              {/* Tagline */}
              <p className="text-xs font-medium text-slate-400 uppercase tracking-widest pt-2">
                Upload. Understand. Ask.
              </p>
            </div>

            {/* Hero Visual Mockup */}
            <div className="mt-12 sm:mt-16 max-w-4xl mx-auto">
              <div className="rounded-3xl p-2 sm:p-3 glass-card shadow-2xl border border-slate-200/80 dark:border-slate-800/80">
                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 space-y-6">
                  {/* Top document bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-xs">
                        PDF
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Research_Paper_Cloud_Scalability.pdf
                        </h4>
                        <p className="text-xs text-slate-400">12 Pages • Analyzed by Gemini AI</p>
                      </div>
                    </div>
                    <Badge variant="success">Cloud Verified ✓</Badge>
                  </div>

                  {/* AI Summary card inside visual */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>AI Executive Summary</span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                      This paper investigates multi-tenant cloud architectures, demonstrating how serverless autoscaling mitigates traffic spikes while enforcing cryptographic data isolation across distributed storage partitions.
                    </p>
                  </div>

                  {/* Key Topics */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Key Topics Extracted
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="purple">Artificial Intelligence</Badge>
                      <Badge variant="default">Cloud Computing</Badge>
                      <Badge variant="success">Security & Isolation</Badge>
                      <Badge variant="secondary">Serverless Functions</Badge>
                    </div>
                  </div>

                  {/* Interactive Q&A bar in hero */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Ask anything about this document
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={demoInput}
                        onChange={(e) => setDemoInput(e.target.value)}
                        className="flex-1 h-11 px-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          setDemoResponse(
                            `DocuMind AI verified from Section 3 (Page 4): "${demoInput}" addresses core elasticity metrics, highlighting autonomous capacity rebalancing.`
                          );
                        }}
                      >
                        Ask
                      </Button>
                    </div>

                    {demoResponse && (
                      <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 animate-fade-in flex items-start space-x-2.5">
                        <MessageSquare className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium">{demoResponse}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Sources: 📄 Page 4 • Chunk 3
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="indigo">Core Capabilities</Badge>
              <h2 className="text-3xl font-extrabold text-foreground">
                Engineered for Cloud Computing & AI
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A complete suite of intelligent document tools powered by modern cloud infrastructure.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'AI Summarization',
                  desc: 'Generate concise executive summaries and detailed technical breakdowns in seconds.',
                  icon: Sparkles,
                },
                {
                  title: 'Document Q&A',
                  desc: 'Chat directly with your documents. Receive grounded answers with exact page and chunk citations.',
                  icon: MessageSquare,
                },
                {
                  title: 'Smart Search',
                  desc: 'Search across your entire cloud library by topic, keyword, or deep text semantics.',
                  icon: Search,
                },
                {
                  title: 'Key Insight Extraction',
                  desc: 'Automatically identify core findings, difficulty levels, sentiment, and reading times.',
                  icon: Zap,
                },
                {
                  title: 'Cloud Storage',
                  desc: 'Securely store files in Firebase Cloud Storage with strict per-user authorization boundaries.',
                  icon: Cloud,
                },
                {
                  title: 'Secure Access & RBAC',
                  desc: 'Firebase Auth and granular Firestore Security Rules safeguard private enterprise data.',
                  icon: Shield,
                },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <Card key={i} className="p-6 hover:shadow-xl transition-all space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-foreground">{feat.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="secondary">Pipeline Workflow</Badge>
              <h2 className="text-3xl font-extrabold text-foreground">How DocuMind AI Works</h2>
              <p className="text-sm text-slate-500">
                End-to-end serverless lifecycle from upload to interactive intelligence
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { step: '01', title: 'Upload', desc: 'Client uploads PDF, DOCX, or TXT to Cloud Storage' },
                { step: '02', title: 'Process', desc: 'Cloud function extracts and sanitizes raw text' },
                { step: '03', title: 'Analyze', desc: 'Text is chunked, indexed, and analyzed via AI' },
                { step: '04', title: 'Ask', desc: 'User asks questions via RAG vector/lexical retrieval' },
                { step: '05', title: 'Understand', desc: 'Receive grounded answers with verifiable sources' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-3 relative overflow-hidden"
                >
                  <span className="text-3xl font-black text-indigo-500/20 dark:text-indigo-400/20">
                    {item.step}
                  </span>
                  <h4 className="text-base font-bold text-foreground">{item.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cloud Architecture Preview Section */}
        <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <Badge variant="purple">Cloud Architecture</Badge>
              <h2 className="text-3xl font-extrabold">Cloud-Native Technology Stack</h2>
              <p className="text-sm text-slate-400">
                Architected to fulfill B.Tech Cloud Computing requirements
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Database className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold">Cloud Database</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cloud Firestore provides a flexible, scalable NoSQL database for document metadata, analysis summaries, and chat sessions with millisecond query responses.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <HardDrive className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold">Cloud Storage</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Firebase Storage offers object storage with strong consistency and custom access control rules, ensuring files are partition-isolated by user ID.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Cpu className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold">Serverless Functions & AI</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cloud Functions automatically trigger upon storage events to parse documents, chunk text, and communicate with Google Gemini without provisioning server hardware.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto rounded-3xl glass-card p-8 sm:p-12 border border-slate-200 dark:border-slate-800 text-center space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
                <Lock className="h-6 w-6" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Enterprise-Grade Cloud Security
              </h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                Your documents belong solely to you. DocuMind AI enforces zero-trust data isolation with cryptographic authorization checks at the storage and database layer.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Per-user storage partition isolation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Strict Firestore declarative rules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>No client-side AI API key exposure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Token & size validation before ingestion</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-indigo-500/5 to-transparent text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Start analyzing your documents with AI.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Ready to explore? Try the interactive live demo with pre-seeded cloud computing notes.
            </p>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button size="lg" className="px-10 shadow-xl shadow-indigo-600/25">
                  Launch DocuMind Workspace
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <UploadDropzone onClose={() => setShowUploadModal(false)} />
        </div>
      )}

      <Footer />
    </div>
  );
}
