/**
 * DocuMind AI - In-Memory and Client-Side Store
 * Provides persistent local state for documents, chunks, chat messages, notifications,
 * and analytics when Firebase is not configured or in Demo Mode.
 */

import {
  CloudDocument,
  DocumentChunk,
  DocumentAnalysis,
  ChatMessage,
  NotificationItem,
  ActivityLog,
} from '@/types';
import { chunkDocumentText } from '@/lib/document-processing/chunker';
import { analyzeDocumentOffline } from '@/lib/ai/mock-engine';

const SAMPLE_CLOUD_TEXT = `Chapter 1: Cloud Computing Architecture and Deployment Models
Cloud computing is a model for enabling ubiquitous, convenient, on-demand network access to a shared pool of configurable computing resources (e.g., networks, servers, storage, applications, and services) that can be rapidly provisioned and released with minimal management effort or service provider interaction.

1.1 Essential Characteristics
- On-demand self-service: A consumer can unilaterally provision computing capabilities, such as server time and network storage, as needed automatically.
- Broad network access: Capabilities are available over the network and accessed through standard mechanisms that promote use by heterogeneous thin or thick client platforms.
- Resource pooling: The provider's computing resources are pooled to serve multiple consumers using a multi-tenant model, with physical and virtual resources dynamically assigned.
- Rapid elasticity: Capabilities can be elastically provisioned and released, in some cases automatically, to scale rapidly outward and inward commensurate with demand.
- Measured service: Cloud systems automatically control and optimize resource use by leveraging a metering capability at some level of abstraction appropriate to the type of service.

1.2 Service Models
- Infrastructure as a Service (IaaS): Provisioning processing, storage, networks, and other fundamental computing resources where the consumer deploys arbitrary software.
- Platform as a Service (PaaS): Consumer deploys onto the cloud infrastructure consumer-created or acquired applications created using programming languages, libraries, services, and tools supported by the provider.
- Software as a Service (SaaS): Use provider applications running on a cloud infrastructure accessible from various client devices through thin client interfaces such as web browsers.

1.3 Cloud Security and Data Isolation
Data isolation in multi-tenant cloud storage is enforced through strict role-based access control (RBAC), end-to-end cryptographic encryption at rest (AES-256), and transport layer security (TLS 1.3). User documents are partition-isolated with security rules that inspect request authentication claims before any read or write operation is permitted.`;

const SAMPLE_AI_TEXT = `Title: Advancements in Retrieval-Augmented Generation for Cloud Document Intelligence
Authors: DocuMind AI Research Lab

Abstract:
Large language models (LLMs) often suffer from hallucination and out-of-date knowledge when reasoning over private enterprise documents. Retrieval-Augmented Generation (RAG) resolves this bottleneck by dynamically fetching context-specific passages from a vector or hybrid lexical store and augmenting the prompt given to the generative model.

1. System Architecture
Our pipeline introduces a four-stage process:
1. Document ingestion and clean text extraction from heterogeneous formats (PDF, DOCX, TXT).
2. Semantic chunking with sliding context overlap (150-200 characters) to preserve contextual boundaries.
3. Hybrid ranking: Combining BM25 lexical relevance scoring with dense vector embeddings to ensure precise recall across technical vocabularies.
4. Grounded response synthesis with precise attribution metadata (document ID, page number, and chunk index).

2. Evaluation and Results
Benchmark experiments across 500 enterprise technical manuals demonstrate that grounded RAG reduces factual hallucination rates from 24.3% in ungrounded models to under 1.2% in grounded pipelines. Latency remains sub-400ms when utilizing serverless edge function routing.`;

const SAMPLE_ML_TEXT = `Machine Learning Foundations: Supervised, Unsupervised, and Optimization
Course Notes - Department of Computer Science

1. Supervised Learning Paradigms
Supervised learning models optimize a cost function parameterized by weight vector W against ground-truth labels Y. Gradient descent computes the partial derivative of the empirical loss with respect to each parameter.
Learning rate decay and momentum methods such as Adam (Adaptive Moment Estimation) prevent premature convergence into local minima and saddle points.

2. Model Evaluation and Regularization
To mitigate overfitting on high-dimensional datasets, L1 (Lasso) and L2 (Ridge) regularization penalties are incorporated into the loss function. K-Fold Cross-Validation ensures generalized performance estimation across heterogeneous data folds. Precision, Recall, and F1-score provide robust metrics in class-imbalanced distributions.`;

const SAMPLE_SWE_TEXT = `Software Engineering Report: Microservices Architecture and Cloud Resiliency
Prepared by Engineering Systems Directorate

Executive Summary:
Modern web applications require high availability, zero-downtime continuous deployment, and modular service boundaries. This report outlines our migration from monolithic deployment to containerized microservices managed via cloud-native orchestrators.

Key Architectural Recommendations:
1. Decoupled Service Communication: Utilize asynchronous event streams (Pub/Sub) for non-blocking operations and REST/gRPC for synchronous service-to-service calls.
2. Centralized Observability: Structured logging, distributed tracing, and real-time telemetry allow site reliability engineers to diagnose bottlenecks across distributed endpoints.
3. Automated CI/CD Pipelines: Automated testing suites validate code quality, security vulnerabilities, and container build integrity before staging releases.`;

function createInitialDocuments(): CloudDocument[] {
  const doc1Id = 'doc_cloud_101';
  const doc2Id = 'doc_ai_202';
  const doc3Id = 'doc_ml_303';
  const doc4Id = 'doc_swe_404';

  const doc1Ana = analyzeDocumentOffline(SAMPLE_CLOUD_TEXT, 'Cloud_Computing_Notes.pdf', 'demo_user', doc1Id);
  const doc2Ana = analyzeDocumentOffline(SAMPLE_AI_TEXT, 'AI_Research_Report.pdf', 'demo_user', doc2Id);
  const doc3Ana = analyzeDocumentOffline(SAMPLE_ML_TEXT, 'Machine_Learning_Notes.pdf', 'demo_user', doc3Id);
  const doc4Ana = analyzeDocumentOffline(SAMPLE_SWE_TEXT, 'Software_Engineering_Report.pdf', 'demo_user', doc4Id);

  return [
    {
      id: doc1Id,
      userId: 'demo_user',
      fileName: 'Cloud_Computing_Notes.pdf',
      fileType: 'pdf',
      fileSize: 2450000,
      storagePath: `documents/demo_user/${doc1Id}/original/Cloud_Computing_Notes.pdf`,
      status: 'analyzed',
      pageCount: 12,
      textLength: SAMPLE_CLOUD_TEXT.length,
      favorite: true,
      rawTextPreview: SAMPLE_CLOUD_TEXT,
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      processedAt: new Date(Date.now() - 3600000 * 4.9).toISOString(),
      analysis: doc1Ana,
    },
    {
      id: doc2Id,
      userId: 'demo_user',
      fileName: 'AI_Research_Report.pdf',
      fileType: 'pdf',
      fileSize: 1820000,
      storagePath: `documents/demo_user/${doc2Id}/original/AI_Research_Report.pdf`,
      status: 'analyzed',
      pageCount: 8,
      textLength: SAMPLE_AI_TEXT.length,
      favorite: true,
      rawTextPreview: SAMPLE_AI_TEXT,
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      processedAt: new Date(Date.now() - 3600000 * 17.8).toISOString(),
      analysis: doc2Ana,
    },
    {
      id: doc3Id,
      userId: 'demo_user',
      fileName: 'Machine_Learning_Notes.pdf',
      fileType: 'pdf',
      fileSize: 3100000,
      storagePath: `documents/demo_user/${doc3Id}/original/Machine_Learning_Notes.pdf`,
      status: 'analyzed',
      pageCount: 15,
      textLength: SAMPLE_ML_TEXT.length,
      favorite: false,
      rawTextPreview: SAMPLE_ML_TEXT,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      processedAt: new Date(Date.now() - 86400000 * 2 + 120000).toISOString(),
      analysis: doc3Ana,
    },
    {
      id: doc4Id,
      userId: 'demo_user',
      fileName: 'Software_Engineering_Report.pdf',
      fileType: 'pdf',
      fileSize: 4500000,
      storagePath: `documents/demo_user/${doc4Id}/original/Software_Engineering_Report.pdf`,
      status: 'analyzed',
      pageCount: 22,
      textLength: SAMPLE_SWE_TEXT.length,
      favorite: false,
      rawTextPreview: SAMPLE_SWE_TEXT,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      processedAt: new Date(Date.now() - 86400000 * 4 + 180000).toISOString(),
      analysis: doc4Ana,
    },
  ];
}

class MockDataStore {
  private documents: Map<string, CloudDocument> = new Map();
  private chunks: Map<string, DocumentChunk[]> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();
  private notifications: NotificationItem[] = [];
  private activityLogs: ActivityLog[] = [];

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const initialDocs = createInitialDocuments();
    for (const doc of initialDocs) {
      this.documents.set(doc.id, doc);
      if (doc.rawTextPreview) {
        const docChunks = chunkDocumentText(doc.id, doc.rawTextPreview);
        this.chunks.set(doc.id, docChunks);
      }
    }

    this.notifications = [
      {
        id: 'notif_1',
        userId: 'demo_user',
        title: 'Document Analysis Complete',
        message: 'Cloud_Computing_Notes.pdf has been indexed and analyzed with AI insights.',
        type: 'success',
        read: false,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        link: '/documents/doc_cloud_101',
      },
      {
        id: 'notif_2',
        userId: 'demo_user',
        title: 'Cloud Storage Quota',
        message: 'You have used 11.87 MB of your 500 MB cloud document storage.',
        type: 'info',
        read: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    this.activityLogs = [
      {
        id: 'act_1',
        userId: 'demo_user',
        action: 'upload',
        documentName: 'Cloud_Computing_Notes.pdf',
        details: 'Uploaded 2.45 MB to Firebase Storage',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'act_2',
        userId: 'demo_user',
        action: 'analyze',
        documentName: 'Cloud_Computing_Notes.pdf',
        details: 'AI summary and 5 key insights generated',
        timestamp: new Date(Date.now() - 3600000 * 4.9).toISOString(),
      },
      {
        id: 'act_3',
        userId: 'demo_user',
        action: 'chat',
        documentName: 'Cloud_Computing_Notes.pdf',
        details: 'Q&A RAG session started with 4 questions asked',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    ];
  }

  // Document methods
  getAllDocuments(userId: string = 'demo_user'): CloudDocument[] {
    return Array.from(this.documents.values()).filter(
      (d) => d.userId === userId || userId === 'admin'
    );
  }

  getDocument(documentId: string): CloudDocument | undefined {
    return this.documents.get(documentId);
  }

  saveDocument(doc: CloudDocument): CloudDocument {
    this.documents.set(doc.id, doc);
    return doc;
  }

  deleteDocument(documentId: string): boolean {
    this.chunks.delete(documentId);
    this.messages.delete(documentId);
    return this.documents.delete(documentId);
  }

  toggleFavorite(documentId: string): boolean {
    const doc = this.documents.get(documentId);
    if (doc) {
      doc.favorite = !doc.favorite;
      this.documents.set(documentId, doc);
      return doc.favorite;
    }
    return false;
  }

  renameDocument(documentId: string, newName: string): boolean {
    const doc = this.documents.get(documentId);
    if (doc) {
      doc.fileName = newName;
      doc.updatedAt = new Date().toISOString();
      this.documents.set(documentId, doc);
      return true;
    }
    return false;
  }

  // Chunks methods
  getChunks(documentId: string): DocumentChunk[] {
    return this.chunks.get(documentId) || [];
  }

  saveChunks(documentId: string, chunkList: DocumentChunk[]): void {
    this.chunks.set(documentId, chunkList);
  }

  // Chat methods
  getChatMessages(documentId: string): ChatMessage[] {
    return this.messages.get(documentId) || [];
  }

  addChatMessage(documentId: string, message: ChatMessage): void {
    const current = this.messages.get(documentId) || [];
    current.push(message);
    this.messages.set(documentId, current);
  }

  // Notifications
  getNotifications(userId: string = 'demo_user'): NotificationItem[] {
    return this.notifications.filter((n) => n.userId === userId || userId === 'admin');
  }

  markAllNotificationsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  addNotification(notification: NotificationItem): void {
    this.notifications.unshift(notification);
  }

  // Activity Logs
  getActivityLogs(userId: string = 'demo_user'): ActivityLog[] {
    return this.activityLogs.filter((a) => a.userId === userId || userId === 'admin');
  }

  addActivityLog(log: ActivityLog): void {
    this.activityLogs.unshift(log);
  }
}

// Singleton global mock data store for server-side route handlers & client-side hydration
const globalMockStoreKey = Symbol.for('documind.mockstore');
// @ts-ignore
const globalRef = globalThis as any;

if (!globalRef[globalMockStoreKey]) {
  globalRef[globalMockStoreKey] = new MockDataStore();
}

export const mockStore: MockDataStore = globalRef[globalMockStoreKey];
