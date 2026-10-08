/**
 * DocuMind AI - OpenAI Compatible Client
 */

import { DocumentAnalysis } from '@/types';
import { RetrievedChunk, buildRAGPrompt } from '@/lib/retrieval/rag-engine';
import { analyzeDocumentOffline, answerQuestionOffline } from './mock-engine';

export async function analyzeDocumentWithOpenAI(
  text: string,
  fileName: string,
  apiKey: string,
  model = 'gpt-4o-mini'
): Promise<DocumentAnalysis> {
  const truncatedText = text.substring(0, 18000);

  const prompt = `You are DocuMind AI, an enterprise Document Analyzer.
Analyze the following document titled "${fileName}" and output a valid JSON object matching the exact format:
{
  "shortSummary": "A concise 2-sentence summary of the document",
  "detailedSummary": "A thorough 1-2 paragraph breakdown of content, objectives, and findings",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4"],
  "topics": ["Topic 1", "Topic 2", "Topic 3"],
  "keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "documentType": "Research Paper" | "Academic Notes" | "Resume" | "Report" | "Invoice" | "Article" | "Book" | "Other",
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "sentiment": "Positive" | "Neutral" | "Negative" | "Mixed",
  "sentimentExplanation": "Brief justification for sentiment rating"
}

Document:
"""
${truncatedText}
"""`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'You are an AI document analysis engine. Respond strictly with JSON.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      return analyzeDocumentOffline(text, fileName);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    return {
      id: `ana_${Date.now()}`,
      documentId: 'doc_openai',
      userId: 'user',
      shortSummary: parsed.shortSummary || 'Summary from OpenAI.',
      detailedSummary: parsed.detailedSummary || 'Analysis from OpenAI.',
      keyPoints: parsed.keyPoints || ['Key takeaway 1'],
      topics: parsed.topics || ['Cloud Architecture'],
      keywords: parsed.keywords || ['cloud', 'system'],
      documentType: parsed.documentType || 'Report',
      difficulty: parsed.difficulty || 'Intermediate',
      sentiment: parsed.sentiment || 'Neutral',
      sentimentExplanation: parsed.sentimentExplanation,
      readingTimeMinutes: Math.max(1, Math.ceil(text.split(/\s+/).length / 200)),
      analyzedAt: new Date().toISOString(),
    };
  } catch (err) {
    return analyzeDocumentOffline(text, fileName);
  }
}

export async function answerQuestionWithOpenAI(
  question: string,
  retrievedChunks: RetrievedChunk[],
  documentTitle: string,
  apiKey: string,
  model = 'gpt-4o-mini'
): Promise<{ answer: string; sources: any[] }> {
  const prompt = buildRAGPrompt(retrievedChunks, question, documentTitle);

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
      }),
    });

    if (!res.ok) {
      return answerQuestionOffline(question, retrievedChunks, documentTitle);
    }

    const data = await res.json();
    const answer = data.choices?.[0]?.message?.content || '';

    const sources = retrievedChunks.slice(0, 3).map((r) => ({
      chunkIndex: r.chunk.chunkIndex + 1,
      pageNumber: r.chunk.pageNumber,
      snippet: r.chunk.text.substring(0, 160) + '...',
      relevanceScore: Math.round(r.score * 10) / 10,
    }));

    return { answer, sources };
  } catch (err) {
    return answerQuestionOffline(question, retrievedChunks, documentTitle);
  }
}
