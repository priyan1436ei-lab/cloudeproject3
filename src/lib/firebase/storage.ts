/**
 * DocuMind AI - Firebase Cloud Storage Service
 * Manages document uploads, object paths, download URLs, and storage isolation.
 */

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTask,
} from 'firebase/storage';
import { storage, isLiveFirebaseConfigured } from './config';

export class StorageService {
  /**
   * Upload file to user-isolated path: documents/{userId}/{documentId}/original/{fileName}
   */
  static async uploadFile(
    userId: string,
    documentId: string,
    file: File | Blob,
    fileName: string,
    onProgress?: (progressPercent: number) => void
  ): Promise<{ storagePath: string; downloadUrl: string }> {
    const storagePath = `documents/${userId}/${documentId}/original/${fileName}`;

    if (isLiveFirebaseConfigured && storage) {
      try {
        const storageRef = ref(storage, storagePath);
        const uploadTask: UploadTask = uploadBytesResumable(storageRef, file);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (onProgress) onProgress(Math.round(progress));
            },
            (error) => {
              reject(error);
            },
            async () => {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ storagePath, downloadUrl });
            }
          );
        });
      } catch (err) {
        console.warn('Firebase Storage upload failed, using local simulation:', err);
      }
    }

    // Local / Demo simulation
    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      if (onProgress) onProgress(Math.min(100, current));
      if (current >= 100) clearInterval(interval);
    }, 100);

    await new Promise((res) => setTimeout(res, 450));
    return {
      storagePath,
      downloadUrl: typeof URL !== 'undefined' && file instanceof Blob ? URL.createObjectURL(file) : '',
    };
  }

  /**
   * Delete document file from cloud storage
   */
  static async deleteFile(storagePath: string): Promise<void> {
    if (isLiveFirebaseConfigured && storage) {
      try {
        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);
      } catch (err) {
        console.warn('Cloud storage delete failed:', err);
      }
    }
  }
}
