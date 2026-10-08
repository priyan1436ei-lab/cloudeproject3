/**
 * Document Chunker for RAG (Retrieval-Augmented Generation)
 * Slices raw text into overlapping semantic windows with page/chunk indexing
 */

import { DocumentChunk } from '@/types';
import { generateId } from '@/lib/utils';

export interface ChunkOptions {
  chunkSize?: number; // approx chars per chunk (e.g. 1000)
  overlap?: number;   // overlap characters (e.g. 150)
  wordsPerPage?: number; // estimated words per page for DOCX/TXT (e.g. 400)
}

export function chunkDocumentText(
  documentId: string,
  rawText: string,
  options: ChunkOptions = {}
): DocumentChunk[] {
  const { chunkSize = 1000, overlap = 150, wordsPerPage = 380 } = options;

  if (!rawText || !rawText.trim()) {
    return [];
  }

  // Normalize line endings and extra whitespace
  const cleanText = rawText.replace(/\r\n/g, '\n').trim();

  // If text contains explicit form-feeds or page breaks
  const rawPages = cleanText.split(/\f|\n---+page \d+---\n/i);
  
  const chunks: DocumentChunk[] = [];
  let chunkIndex = 0;
  let runningWordCount = 0;

  // Split into paragraphs first to avoid cutting sentences harshly
  const paragraphs = cleanText.split(/\n\s*\n/);
  let currentBuffer = '';

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if ((currentBuffer.length + trimmed.length) > chunkSize && currentBuffer.length > 0) {
      // Create a chunk from currentBuffer
      const wordsInChunk = currentBuffer.split(/\s+/).length;
      runningWordCount += wordsInChunk;
      const estimatedPage = Math.max(1, Math.ceil(runningWordCount / wordsPerPage));

      chunks.push({
        chunkId: generateId('chk'),
        documentId,
        chunkIndex: chunkIndex++,
        text: currentBuffer.trim(),
        pageNumber: estimatedPage,
        tokensCount: Math.ceil(currentBuffer.length / 4),
      });

      // Maintain overlap by retaining the trailing characters/words
      const slicePoint = Math.max(0, currentBuffer.length - overlap);
      currentBuffer = currentBuffer.substring(slicePoint) + '\n\n' + trimmed;
    } else {
      currentBuffer = currentBuffer ? `${currentBuffer}\n\n${trimmed}` : trimmed;
    }
  }

  // Push remaining buffer
  if (currentBuffer.trim().length > 0) {
    const wordsInChunk = currentBuffer.split(/\s+/).length;
    runningWordCount += wordsInChunk;
    const estimatedPage = Math.max(1, Math.ceil(runningWordCount / wordsPerPage));

    chunks.push({
      chunkId: generateId('chk'),
      documentId,
      chunkIndex: chunkIndex++,
      text: currentBuffer.trim(),
      pageNumber: estimatedPage,
      tokensCount: Math.ceil(currentBuffer.length / 4),
    });
  }

  return chunks;
}
