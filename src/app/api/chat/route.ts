import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/firebase/mock-store';
import { retrieveRelevantChunks } from '@/lib/retrieval/rag-engine';
import { AIService } from '@/lib/ai/provider';
import { ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { documentId, question, userId = 'demo_user' } = await req.json();

    if (!documentId || !question) {
      return NextResponse.json(
        { error: 'documentId and question are required fields.' },
        { status: 400 }
      );
    }

    const document = mockStore.getDocument(documentId);
    if (!document) {
      return NextResponse.json({ error: 'Document not found.' }, { status: 404 });
    }

    const chunks = mockStore.getChunks(documentId);
    if (!chunks || chunks.length === 0) {
      return NextResponse.json(
        { error: 'No extracted chunks available for this document.' },
        { status: 400 }
      );
    }

    // 1. Retrieve relevant chunks using RAG semantic scoring
    const relevantChunks = retrieveRelevantChunks(chunks, question, 4);

    // 2. Query AI model with grounded prompt
    const { answer, sources } = await AIService.answerQuestion(
      question,
      relevantChunks,
      document.fileName
    );

    // 3. Save User message
    const userMessage: ChatMessage = {
      id: generateId('msg'),
      sessionId: `sess_${documentId}`,
      sender: 'user',
      content: question,
      timestamp: new Date().toISOString(),
    };
    mockStore.addChatMessage(documentId, userMessage);

    // 4. Save Assistant message with sources
    const assistantMessage: ChatMessage = {
      id: generateId('msg'),
      sessionId: `sess_${documentId}`,
      sender: 'assistant',
      content: answer,
      sources,
      timestamp: new Date().toISOString(),
    };
    mockStore.addChatMessage(documentId, assistantMessage);

    // Log activity
    mockStore.addActivityLog({
      id: generateId('act'),
      userId,
      action: 'chat',
      documentName: document.fileName,
      details: `Asked: "${question.substring(0, 45)}..."`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      sources,
    });
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error processing document question.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get('documentId');

  if (!documentId) {
    return NextResponse.json({ error: 'documentId is required.' }, { status: 400 });
  }

  const messages = mockStore.getChatMessages(documentId);
  return NextResponse.json({ messages });
}
