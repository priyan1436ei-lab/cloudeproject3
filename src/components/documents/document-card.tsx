'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  Trash2,
  Star,
  ExternalLink,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Edit2,
  FileSpreadsheet,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { CloudDocument } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatBytes, formatRelativeTime } from '@/lib/utils';

interface DocumentCardProps {
  document: CloudDocument;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
}

export function DocumentCard({
  document,
  onDelete,
  onToggleFavorite,
  onRename,
}: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamedTitle, setRenamedTitle] = useState(document.fileName);

  const getFileIcon = () => {
    switch (document.fileType) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'docx':
        return <FileSpreadsheet className="h-6 w-6 text-blue-500" />;
      case 'txt':
        return <FileCode className="h-6 w-6 text-emerald-500" />;
      default:
        return <FileText className="h-6 w-6 text-indigo-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (document.status) {
      case 'analyzed':
        return (
          <Badge variant="success" className="text-[10px] gap-1">
            <CheckCircle2 className="h-3 w-3" /> Analyzed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="warning" className="text-[10px] gap-1">
            <Clock className="h-3 w-3 animate-spin" /> Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="text-[10px] text-red-400 gap-1">
            <AlertTriangle className="h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary" className="text-[10px]">Uploaded</Badge>;
    }
  };

  const handleSaveRename = () => {
    if (onRename && renamedTitle.trim()) {
      onRename(document.id, renamedTitle.trim());
    }
    setIsRenaming(false);
  };

  return (
    <>
      <Card className="hover:border-indigo-500/50 hover:shadow-xl transition-all group overflow-hidden relative flex flex-col justify-between">
        <div className="p-5">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-850 flex items-center justify-center group-hover:scale-105 transition-transform">
                {getFileIcon()}
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {document.fileType.toUpperCase()} • {formatBytes(document.fileSize)}
                </span>
                {getStatusBadge()}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {/* Favorite button */}
              <button
                onClick={() => onToggleFavorite && onToggleFavorite(document.id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  document.favorite
                    ? 'text-amber-400'
                    : 'text-slate-400 hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={document.favorite ? 'Favorited' : 'Add to favorites'}
              >
                <Star className={`h-4 w-4 ${document.favorite ? 'fill-amber-400' : ''}`} />
              </button>

              {/* Action menu */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-2 w-44 rounded-2xl glass-card p-1.5 shadow-2xl z-20 animate-slide-up">
                    <button
                      onClick={() => {
                        setIsRenaming(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 text-foreground"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Rename</span>
                    </button>
                    <Link
                      href={`/documents/${document.id}/report`}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2 text-foreground"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      <span>AI Report</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-red-500 hover:bg-red-500/10 flex items-center space-x-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filename */}
          <div className="mt-4">
            {isRenaming ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={renamedTitle}
                  onChange={(e) => setRenamedTitle(e.target.value)}
                  className="w-full text-sm font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 px-2 py-1 text-foreground"
                  autoFocus
                />
                <Button size="sm" onClick={handleSaveRename}>Save</Button>
              </div>
            ) : (
              <Link href={`/documents/${document.id}`} className="group-hover:text-indigo-400 transition-colors">
                <h4 className="text-base font-semibold text-foreground truncate" title={document.fileName}>
                  {document.fileName}
                </h4>
              </Link>
            )}

            {/* AI Topics tags */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {(document.analysis?.topics || ['Cloud Storage', 'AI']).slice(0, 3).map((topic, i) => (
                <Badge key={i} variant="secondary" className="text-[10px]">
                  {topic}
                </Badge>
              ))}
            </div>

            {/* Short summary snippet */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2">
              {document.analysis?.shortSummary || 'Document text extracted and stored in cloud.'}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            {document.pageCount} pages • {formatRelativeTime(document.createdAt)}
          </span>

          <div className="flex items-center space-x-2">
            <Link href={`/documents/${document.id}/chat`}>
              <Button size="sm" variant="default" className="text-xs h-8 px-3">
                <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                Chat AI
              </Button>
            </Link>
            <Link href={`/documents/${document.id}`}>
              <Button size="sm" variant="outline" className="text-xs h-8 px-2.5">
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl glass-card p-6 shadow-2xl animate-slide-up space-y-4">
            <div className="h-12 w-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Delete this document?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will permanently remove <strong>{document.fileName}</strong>, its Firebase Storage file, RAG semantic chunks, and AI analysis data.
              </p>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (onDelete) onDelete(document.id);
                  setShowDeleteConfirm(false);
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
