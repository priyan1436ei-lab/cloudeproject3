import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/firebase/mock-store';
import { AIService } from '@/lib/ai/provider';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { docIdA, docIdB } = await req.json();

    if (!docIdA || !docIdB) {
      return NextResponse.json(
        { error: 'Both docIdA and docIdB are required for comparison.' },
        { status: 400 }
      );
    }

    const docA = mockStore.getDocument(docIdA);
    const docB = mockStore.getDocument(docIdB);

    if (!docA || !docB) {
      return NextResponse.json(
        { error: 'One or both documents could not be found.' },
        { status: 404 }
      );
    }

    const comparison = await AIService.compareDocuments(
      {
        id: docA.id,
        name: docA.fileName,
        text: docA.rawTextPreview || docA.analysis?.detailedSummary || '',
      },
      {
        id: docB.id,
        name: docB.fileName,
        text: docB.rawTextPreview || docB.analysis?.detailedSummary || '',
      }
    );

    return NextResponse.json({
      success: true,
      comparison,
    });
  } catch (error: any) {
    console.error('API /api/compare error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error comparing documents.' },
      { status: 500 }
    );
  }
}
