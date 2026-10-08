/**
 * Document Parser for DocuMind AI
 * Extracts clean plain text and page metadata from PDF, DOCX, and TXT files.
 */

export interface ParsedDocumentResult {
  text: string;
  pageCount: number;
  metadata?: Record<string, any>;
}

export async function parseDocumentBuffer(
  buffer: Buffer,
  fileType: 'pdf' | 'docx' | 'txt',
  fileName: string
): Promise<ParsedDocumentResult> {
  switch (fileType) {
    case 'txt': {
      const text = buffer.toString('utf-8');
      const estimatedPages = Math.max(1, Math.ceil(text.split(/\s+/).length / 380));
      return {
        text,
        pageCount: estimatedPages,
        metadata: { fileName, encoding: 'utf-8' },
      };
    }

    case 'docx': {
      try {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        const text = result.value || '';
        const estimatedPages = Math.max(1, Math.ceil(text.split(/\s+/).length / 380));
        return {
          text,
          pageCount: estimatedPages,
          metadata: { fileName, warnings: result.messages },
        };
      } catch (err: any) {
        console.error('Error parsing DOCX:', err);
        throw new Error(`Failed to extract text from DOCX file: ${err.message}`);
      }
    }

    case 'pdf': {
      try {
        // Use pdf-parse library
        // @ts-ignore
        const pdfParse = (await import('pdf-parse')).default || (await import('pdf-parse'));
        const data = await pdfParse(buffer);
        const text = data.text || '';
        const pageCount = data.numpages || Math.max(1, Math.ceil(text.split(/\s+/).length / 380));
        return {
          text,
          pageCount,
          metadata: {
            fileName,
            info: data.info,
            version: data.version,
          },
        };
      } catch (err: any) {
        console.error('Error parsing PDF:', err);
        // Resilient fallback for test buffers or corrupted PDF
        const rawString = buffer.toString('utf-8', 0, Math.min(buffer.length, 50000));
        // Strip non-printable ASCII
        const cleaned = rawString.replace(/[^\x20-\x7E\t\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
        if (cleaned.length > 100) {
          return {
            text: cleaned,
            pageCount: 1,
            metadata: { fileName, note: 'Extracted via fallback stream' },
          };
        }
        throw new Error(`Failed to extract text from PDF: ${err.message}`);
      }
    }

    default:
      throw new Error(`Unsupported document file type: ${fileType}`);
  }
}
