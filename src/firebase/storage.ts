import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';
import { optimizeImage, validateImageFile, fileToOptimizedDataUri } from '../utils/imageOptimizer';

export type StorageFolder = 'products' | 'specialities' | 'brands' | 'homepage' | 'site';

/**
 * Universal Image Processor:
 * 1. Automatically compresses image client-side to lightweight WebP (~25KB)
 * 2. Attempts Firebase Storage upload if available, or seamlessly returns the ultra-compact WebP Data URI
 * This guarantees 100% FREE operation without ever needing to upgrade to a paid Firebase plan!
 */
export async function uploadImage(
  file: File,
  folder: StorageFolder = 'products',
  customName?: string
): Promise<{ url: string; path?: string }> {
  // 1. Validate file format
  const validation = validateImageFile(file);
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid image file');
  }

  // 2. Generate ultra-optimized compact WebP data URI (~20KB - 35KB)
  const compactDataUri = await fileToOptimizedDataUri(file);

  // 3. Optional attempt to upload to Firebase Storage if bucket is configured
  try {
    const extension = file.type === 'image/svg+xml' ? 'svg' : 'webp';
    const safeName = customName
      ? `${customName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}.${extension}`
      : `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;

    const storagePath = `${folder}/${safeName}`;
    const storageRef = ref(storage, storagePath);

    const optimizedBlob = await optimizeImage(file, {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.78,
      outputFormat: 'image/webp'
    });

    const uploadPromise = uploadBytes(storageRef, optimizedBlob, { contentType: 'image/webp' })
      .then(async () => {
        const downloadUrl = await getDownloadURL(storageRef);
        return { url: downloadUrl, path: storagePath };
      });

    // 4-second timeout for Firebase Storage; if not configured or requires Blaze upgrade, use compactDataUri
    const timeoutPromise = new Promise<{ url: string; path?: string }>((_, reject) => {
      setTimeout(() => reject(new Error('Storage unavailable, using local compact image')), 3500);
    });

    return await Promise.race([uploadPromise, timeoutPromise]);
  } catch (storageErr) {
    // Zero-cost fallback: Use compact Data URI directly
    console.info('Using compact zero-cost image storage (no paid Firebase Storage needed):', storageErr);
    return { url: compactDataUri };
  }
}

/**
 * Deletes an image from Firebase Storage if it was a storage URL
 */
export async function deleteStorageFile(pathOrUrl: string): Promise<void> {
  if (!pathOrUrl || pathOrUrl.startsWith('data:') || !pathOrUrl.includes('firebasestorage')) {
    return;
  }
  try {
    const fileRef = ref(storage, pathOrUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.warn('Could not delete storage file:', error);
  }
}
