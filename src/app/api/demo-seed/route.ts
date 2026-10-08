import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/firebase/mock-store';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || 'demo_user';
  const docs = mockStore.getAllDocuments(userId);
  const notifs = mockStore.getNotifications(userId);
  const activities = mockStore.getActivityLogs(userId);

  return NextResponse.json({
    documents: docs,
    notifications: notifs,
    activityLogs: activities,
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get('documentId');

  if (!documentId) {
    return NextResponse.json({ error: 'documentId required' }, { status: 400 });
  }

  const success = mockStore.deleteDocument(documentId);
  return NextResponse.json({ success });
}

export async function PATCH(req: NextRequest) {
  const { documentId, action, value } = await req.json();

  if (action === 'toggleFavorite') {
    const favorite = mockStore.toggleFavorite(documentId);
    return NextResponse.json({ success: true, favorite });
  }

  if (action === 'rename') {
    const success = mockStore.renameDocument(documentId, value);
    return NextResponse.json({ success });
  }

  return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
}
