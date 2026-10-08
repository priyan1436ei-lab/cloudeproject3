/**
 * DocuMind AI - RAG (Retrieval-Augmented Generation) Engine
 * Implements semantic chunk retrieval, TF-IDF / term scoring, and context grounding.
 */

import { DocumentChunk } from '@/types';

export interface RetrievedChunk {
  chunk: DocumentChunk;
  score: number;
}

// Tokenize and clean text into lowercase keywords
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'were', 'which',
  'what', 'when', 'where', 'how', 'who', 'about', 'some', 'there', 'their', 'them',
  'these', 'those', 'been', 'being', 'will', 'would', 'could', 'should', 'each',
  'into', 'than', 'more', 'also', 'such', 'very', 'does', 'tell', 'show', 'give'
]);

export function retrieveRelevantChunks(
  chunks: DocumentChunk[],
  query: string,
  topK: number = 4
): RetrievedChunk[] {
  if (!chunks || chunks.length === 0) return [];
  if (!query || !query.trim()) {
    // Return first chunks as default preview
    return chunks.slice(0, topK).map((chunk) => ({ chunk, score: 1.0 }));
  }

  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return chunks.slice(0, topK).map((chunk) => ({ chunk, score: 1.0 }));
  }

  // Calculate IDF for query tokens across chunks
  const docCount = chunks.length;
  const tokenDocFreq: Record<string, number> = {};

  for (const token of queryTokens) {
    let freq = 0;
    for (const chunk of chunks) {
      if (chunk.text.toLowerCase().includes(token)) {
        freq++;
      }
    }
    tokenDocFreq[token] = freq;
  }

  // Score each chunk
  const scored: RetrievedChunk[] = chunks.map((chunk) => {
    const chunkLower = chunk.text.toLowerCase();
    const chunkTokens = tokenize(chunk.text);
    const chunkLength = chunkTokens.length || 1;

    let score = 0;

    for (const token of queryTokens) {
      // Term frequency in chunk
      const count = (chunkLower.match(new RegExp(`\\b${token}\\b`, 'g')) || []).length;
      if (count > 0) {
        const idf = Math.log(1 + (docCount - (tokenDocFreq[token] || 0) + 0.5) / ((tokenDocFreq[token] || 0) + 0.5));
        const tf = (count * 2.2) / (count + 1.2 * (0.25 + 0.75 * (chunkLength / 250)));
        score += tf * Math.max(0.1, idf);
      }
    }

    // Exact phrase match bonus
    const cleanQuery = query.toLowerCase().trim();
    if (chunkLower.includes(cleanQuery)) {
      score += 5.0;
    }

    return { chunk, score };
  });

  // Sort descending by score
  const sorted = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (sorted.length === 0) {
    // Fallback: return top 2 initial chunks with 0 score
    return chunks.slice(0, 2).map((chunk) => ({ chunk, score: 0 }));
  }

  return sorted.slice(0, topK);
}

export function buildRAGPrompt(
  retrievedChunks: RetrievedChunk[],
  question: string,
  documentTitle: string
): string {
  const contextSections = retrievedChunks
    .map((r, i) => {
      return `[Source Document: "${documentTitle}", Page ${r.chunk.pageNumber}, Chunk ${r.chunk.chunkIndex + 1}]:\n"${r.chunk.text}"`;
    })
    .join('\n\n---\n\n');

  return `You are DocuMind AI, an intelligent Cloud Document Assistant.
You must answer the user's question based strictly on the provided document context below.

DOCUMENT TITLE: "${documentTitle}"

DOCUMENT CONTEXT:
${contextSections}

USER QUESTION:
"${question}"

STRICT INSTRUCTIONS:
1. Ground your answer PRIMARILY in the provided context excerpts above.
2. If the excerpts do not contain sufficient information to answer the question, state:
   "I couldn't find enough information about this in the uploaded document."
3. Cite the page numbers or chunk sections when stating facts, e.g. "(Page ${retrievedChunks[0]?.chunk.pageNumber || 1})".
4. Be concise, professional, clear, and informative. Never hallucinate facts outside the context.`;
}
