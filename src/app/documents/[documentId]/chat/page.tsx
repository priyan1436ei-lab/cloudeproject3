'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Sparkles, FileText } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ChatWindow } from '@/components/chat/chat-window';
import { CloudDocument, ChatMessage } from '@/types';

export default function DocumentChatPage() {
  const params = useParams();
  const documentId = params.documentId as string;

  const [document, setDocument] = useState<CloudDocument | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDocs = await fetch(`/api/demo-seed?userId=all`);
        if (resDocs.ok) {
          const data = await resDocs.json();
          const target = data.documents?.find((d: CloudDocument) => d.id === documentId);
          if (target) {
            setDocument(target);
          }
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
    fetchData();
  }, [documentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center space-x-3 text-sm text-slate-400">
            <Sparkles className="h-5 w-5 animate-spin text-indigo-500" />
            <span>Loading RAG vector index...</span>
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
          <Link href="/documents">
            <Button size="sm">Back to Library</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {/* Navigation breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href={`/documents/${document.id}`}
            className="inline-flex items-center text-xs text-slate-500 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Back to Document Analysis
          </Link>

          <Link href={`/documents/${document.id}/report`}>
            <Button variant="outline" size="sm" className="text-xs">
              View AI Executive Report
            </Button>
          </Link>
        </div>

        {/* Flagship RAG Chat UI */}
        <ChatWindow document={document} initialMessages={messages} />
      </main>

      <Footer />
    </div>
  );
}
