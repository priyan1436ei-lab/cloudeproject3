export type DocumentStatus = 'uploaded' | 'processing' | 'analyzed' | 'failed';

export type DocumentTypeCategory =
  | 'Research Paper'
  | 'Academic Notes'
  | 'Resume'
  | 'Report'
  | 'Invoice'
  | 'Article'
  | 'Book'
  | 'Other';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SentimentType = 'Positive' | 'Neutral' | 'Negative' | 'Mixed';

export interface DocumentChunk {
  chunkId: string;
  documentId: string;
  chunkIndex: number;
  text: string;
  pageNumber: number;
  tokensCount?: number;
  embedding?: number[];
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  userId: string;
  shortSummary: string;
  detailedSummary: string;
  keyPoints: string[];
  topics: string[];
  keywords: string[];
  documentType: DocumentTypeCategory;
  difficulty: DifficultyLevel;
  sentiment: SentimentType;
  sentimentExplanation?: string;
  readingTimeMinutes: number;
  entities?: { name: string; type: string }[];
  analyzedAt: string;
}

export interface CloudDocument {
  id: string;
  userId: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'txt';
  fileSize: number; // in bytes
  storagePath: string;
  downloadUrl?: string;
  status: DocumentStatus;
  pageCount: number;
  textLength: number;
  favorite?: boolean;
  rawTextPreview?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  analysis?: DocumentAnalysis;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'user' | 'assistant';
  content: string;
  sources?: {
    chunkIndex: number;
    pageNumber: number;
    snippet: string;
    relevanceScore?: number;
  }[];
  timestamp: string;
}

export interface ChatSession {
  id: string;
  documentId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messagesCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: 'upload' | 'analyze' | 'chat' | 'delete' | 'export' | 'compare';
  documentName?: string;
  details: string;
  timestamp: string;
}

export interface DocumentComparisonResult {
  docA: { id: string; name: string };
  docB: { id: string; name: string };
  commonTopics: string[];
  differentTopicsA: string[];
  differentTopicsB: string[];
  contradictions: string[];
  uniqueInsightsA: string[];
  uniqueInsightsB: string[];
  summaryComparison: string;
  recommendation: string;
  comparedAt: string;
}

export interface PlatformMetrics {
  totalUsers: number;
  totalDocuments: number;
  documentsAnalyzed: number;
  totalQuestionsAsked: number;
  storageUsedBytes: number;
  failedJobs: number;
  activeAiRequests: number;
  dailyUploads: { date: string; uploads: number }[];
  fileTypeDistribution: { name: string; value: number }[];
  topicDistribution: { topic: string; count: number }[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: string;
  storageQuotaBytes: number;
  usedStorageBytes: number;
}
