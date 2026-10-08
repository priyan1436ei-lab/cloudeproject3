/**
 * DocuMind AI - Unified AI Provider Abstraction
 * Automatically routes requests to Gemini, OpenAI, or local high-fidelity engine.
 */

import { DocumentAnalysis, DocumentComparisonResult } from '@/types';
import { RetrievedChunk } from '@/lib/retrieval/rag-engine';
import { analyzeDocumentWithGemini, answerQuestionWithGemini } from './gemini';
import { analyzeDocumentWithOpenAI, answerQuestionWithOpenAI } from './openai';
import {
  analyzeDocumentOffline,
  answerQuestionOffline,
  compareDocumentsOffline,
} from './mock-engine';

export class AIService {
  static async analyzeDocument(text: string, fileName: string): Promise<DocumentAnalysis> {
    const provider = process.env.AI_PROVIDER?.toLowerCase() || 'demo';
    const geminiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (provider === 'gemini' && geminiKey) {
      return analyzeDocumentWithGemini(text, fileName, geminiKey);
    }

    if (provider === 'openai' && openAiKey) {
      return analyzeDocumentWithOpenAI(text, fileName, openAiKey);
    }

    // Default or Fallback
    return analyzeDocumentOffline(text, fileName);
  }

  static async answerQuestion(
    question: string,
    retrievedChunks: RetrievedChunk[],
    documentTitle: string
  ): Promise<{ answer: string; sources: any[] }> {
    const provider = process.env.AI_PROVIDER?.toLowerCase() || 'demo';
    const geminiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (provider === 'gemini' && geminiKey) {
      return answerQuestionWithGemini(question, retrievedChunks, documentTitle, geminiKey);
    }

    if (provider === 'openai' && openAiKey) {
      return answerQuestionWithOpenAI(question, retrievedChunks, documentTitle, openAiKey);
    }

    return answerQuestionOffline(question, retrievedChunks, documentTitle);
  }

  static async compareDocuments(
    docA: { id: string; name: string; text: string },
    docB: { id: string; name: string; text: string }
  ): Promise<DocumentComparisonResult> {
    return compareDocumentsOffline(docA, docB);
  }
}
