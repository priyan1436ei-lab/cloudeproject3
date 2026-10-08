/**
 * Document Validator for DocuMind AI
 * Implements strict cloud security validation for file uploads
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
  normalizedType?: 'pdf' | 'docx' | 'txt';
}

const MAX_SIZES_BYTES: Record<string, number> = {
  pdf: (Number(process.env.MAX_PDF_SIZE_MB) || 20) * 1024 * 1024,
  docx: (Number(process.env.MAX_DOCX_SIZE_MB) || 20) * 1024 * 1024,
  txt: (Number(process.env.MAX_TXT_SIZE_MB) || 10) * 1024 * 1024,
};

const ALLOWED_MIME_TYPES: Record<string, 'pdf' | 'docx' | 'txt'> = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'text/plain': 'txt',
};

const EXTENSION_MAPPING: Record<string, 'pdf' | 'docx' | 'txt'> = {
  pdf: 'pdf',
  docx: 'docx',
  txt: 'txt',
};

export function validateFile(file: { name: string; size: number; type?: string }): ValidationResult {
  if (!file || !file.name) {
    return { valid: false, error: 'No file provided.' };
  }

  // 1. Check extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !EXTENSION_MAPPING[extension]) {
    return {
      valid: false,
      error: `Unsupported file type ".${extension || 'unknown'}". Only PDF, DOCX, and TXT are supported.`,
    };
  }

  const normalizedType = EXTENSION_MAPPING[extension];

  // 2. MIME type check if supplied
  if (file.type && ALLOWED_MIME_TYPES[file.type] && ALLOWED_MIME_TYPES[file.type] !== normalizedType) {
    return {
      valid: false,
      error: 'File extension does not match MIME content type.',
    };
  }

  // 3. Size validation
  const maxAllowed = MAX_SIZES_BYTES[normalizedType] || 20 * 1024 * 1024;
  if (file.size > maxAllowed) {
    const maxMb = Math.round(maxAllowed / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds the cloud limit of ${maxMb}MB for ${normalizedType.toUpperCase()} files.`,
    };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty (0 bytes).' };
  }

  return { valid: true, normalizedType };
}

export function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}
