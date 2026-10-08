'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  FileText,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Info,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { ChatMessage, CloudDocument } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ChatWindowProps {
  document: CloudDocument;
  initialMessages?: ChatMessage[];
}

export function ChatWindow({ document, initialMessages = [] }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSourceIndex, setExpandedSourceIndex] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'What is the main purpose of this document?',
    'Explain the cloud architecture described here.',
    'What are the major conclusions and key findings?',
    'Summarize the essential concepts and methods.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionToSend?: string) => {
    const question = questionToSend || inputQuery;
    if (!question.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sessionId: `sess_${document.id}`,
      sender: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: document.id,
          question,
          userId: document.userId,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data.message]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sessionId: `sess_${document.id}`,
        sender: 'assistant',
        content: `I encountered an issue processing your query: ${err.message}. Please try again.`,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] rounded-3xl glass-card overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800/80">
      {/* Header bar */}
      <div className="p-4 px-6 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center space-x-3 truncate">
          <div className="h-9 w-9 rounded-xl bg-indigo-600/10 text-indigo-500 flex items-center justify-center shrink-0">
            <Bot className="h-5 w-5" />
          </div>
          <div className="truncate">
            <h3 className="text-sm font-semibold text-foreground truncate">
              Chatting with: {document.fileName}
            </h3>
            <p className="text-[11px] text-slate-400">
              RAG Active • Grounded in {document.pageCount} pages ({document.fileType.toUpperCase()})
            </p>
          </div>
        </div>

        <Badge variant="success" className="text-[10px] hidden sm:inline-flex">
          Vector / TF-IDF Grounded
        </Badge>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-10 space-y-6 max-w-lg mx-auto">
            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-foreground">
                Ask anything about {document.fileName}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Our RAG pipeline analyzes your query against document chunks and cites exact page references.
              </p>
            </div>

            {/* Suggested starter questions */}
            <div className="space-y-2 text-left">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Suggested Questions
              </p>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="p-3 text-left rounded-xl bg-slate-100/70 dark:bg-slate-850 hover:bg-indigo-500/10 hover:border-indigo-500/30 border border-transparent text-xs text-foreground transition-all flex items-center justify-between group"
                  >
                    <span>{q}</span>
                    <Sparkles className="h-3 w-3 text-slate-400 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0 shadow-md">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-slate-850 text-foreground border border-slate-200/50 dark:border-slate-800/50 rounded-tl-none'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {/* Source References Pill & Snippet inspection */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-750 space-y-2">
                  <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-indigo-500 dark:text-indigo-400">
                    <Bookmark className="h-3 w-3" />
                    <span>Supporting Cloud Sources:</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((src, i) => {
                      const sourceKey = `${msg.id}_${i}`;
                      const isExpanded = expandedSourceIndex === sourceKey;
                      return (
                        <div key={i} className="w-full">
                          <button
                            onClick={() =>
                              setExpandedSourceIndex(isExpanded ? null : sourceKey)
                            }
                            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-[11px] font-medium transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            <span>Page {src.pageNumber} • Chunk {src.chunkIndex}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3 ml-1" />
                            ) : (
                              <ChevronDown className="h-3 w-3 ml-1" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="mt-1.5 p-2.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-indigo-500/20 text-[11px] text-slate-600 dark:text-slate-300 italic animate-fade-in">
                              &ldquo;{src.snippet}&rdquo;
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>Grounded in document</span>
                  <button
                    onClick={() => handleCopy(msg.content, msg.id)}
                    className="hover:text-foreground flex items-center space-x-1"
                  >
                    {copiedId === msg.id ? (
                      <Check className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="h-8 w-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-foreground flex items-center justify-center text-xs shrink-0">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-850 rounded-2xl rounded-tl-none p-4 flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 ml-2">Retrieving relevant chunks...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask anything about this document... (e.g. Summarize architecture)"
            className="flex-1 h-11 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="h-11 px-5 shadow-lg shadow-indigo-600/25"
          >
            <Send className="h-4 w-4 mr-1.5" />
            <span>Ask AI</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
