import { NextRequest, NextResponse } from 'next/server';
import { parseDocumentBuffer } from '@/lib/document-processing/parser';
import { chunkDocumentText } from '@/lib/document-processing/chunker';
import { validateFile, sanitizeFileName } from '@/lib/document-processing/validator';
import { AIService } from '@/lib/ai/provider';
import { mockStore } from '@/lib/firebase/mock-store';
import { CloudDocument } from '@/types';
import { generateId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = (formData.get('userId') as string) || 'demo_user';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request.' }, { status: 400 });
    }

    // 1. Validation
    const validation = validateFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });

    if (!validation.valid || !validation.normalizedType) {
      return NextResponse.json({ error: validation.error || 'Invalid file.' }, { status: 400 });
    }

    const cleanFileName = sanitizeFileName(file.name);
    const documentId = generateId('doc');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Parse text from buffer
    const parsed = await parseDocumentBuffer(buffer, validation.normalizedType, cleanFileName);

    if (!parsed.text || parsed.text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Document appears to be empty or contains no extractable text.' },
        { status: 422 }
      );
    }

    // 3. Chunk text for RAG
    const chunks = chunkDocumentText(documentId, parsed.text);
    mockStore.saveChunks(documentId, chunks);

    // 4. Generate AI analysis
    const analysis = await AIService.analyzeDocument(parsed.text, cleanFileName);
    analysis.documentId = documentId;
    analysis.userId = userId;

    // 5. Create Cloud Document record
    const cloudDoc: CloudDocument = {
      id: documentId,
      userId,
      fileName: cleanFileName,
      fileType: validation.normalizedType,
      fileSize: file.size,
      storagePath: `documents/${userId}/${documentId}/original/${cleanFileName}`,
      status: 'analyzed',
      pageCount: parsed.pageCount,
      textLength: parsed.text.length,
      favorite: false,
      rawTextPreview: parsed.text.substring(0, 4000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      analysis,
    };

    mockStore.saveDocument(cloudDoc);

    // Add activity log and notification
    mockStore.addActivityLog({
      id: generateId('act'),
      userId,
      action: 'upload',
      documentName: cleanFileName,
      details: `Analyzed ${parsed.pageCount} pages, created ${chunks.length} RAG chunks.`,
      timestamp: new Date().toISOString(),
    });

    mockStore.addNotification({
      id: generateId('notif'),
      userId,
      title: 'Analysis Complete',
      message: `${cleanFileName} has been processed and is ready for AI Q&A.`,
      type: 'success',
      read: false,
      createdAt: new Date().toISOString(),
      link: `/documents/${documentId}`,
    });

    return NextResponse.json({
      success: true,
      document: cloudDoc,
      analysis,
      chunksCount: chunks.length,
    });
  } catch (error: any) {
    console.error('API /api/analyze error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error while analyzing document.' },
      { status: 500 }
    );
  }
}
