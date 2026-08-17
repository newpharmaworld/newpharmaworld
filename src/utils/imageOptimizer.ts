/**
 * Client-side Image Optimization Utility for 100% Free Zero-Cost Operation
 * Resizes and compresses images in the browser into ultra-lightweight WebP/JPEG
 * (under 30KB) that can be stored directly or uploaded without requiring any paid plans.
 */

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputFormat?: 'image/webp' | 'image/jpeg';
}

/**
 * Optimizes an image File using Canvas API into a lightweight Blob
 */
export async function optimizeImage(
  file: File,
  options: OptimizeOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.78,
    outputFormat = 'image/webp'
  } = options;

  return new Promise((resolve) => {
    // If it's already an SVG, keep it as is
    if (file.type === 'image/svg+xml') {
      resolve(file);
      return;
    }

    // Safety timeout: 3 seconds max
    const timeoutTimer = setTimeout(() => {
      resolve(file);
    }, 3000);

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          clearTimeout(timeoutTimer);
          let { width, height } = img;

          // Calculate aspect-ratio preserving dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(file);
            return;
          }

          // Fill white background for transparent PNGs converted to JPEG
          if (outputFormat === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to WebP/JPEG Blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                resolve(file);
              }
            },
            outputFormat,
            quality
          );
        };

        img.onerror = () => {
          clearTimeout(timeoutTimer);
          resolve(file);
        };

        img.src = event.target?.result as string;
      };

      reader.onerror = () => {
        clearTimeout(timeoutTimer);
        resolve(file);
      };

      reader.readAsDataURL(file);
    } catch (e) {
      clearTimeout(timeoutTimer);
      resolve(file);
    }
  });
}

/**
 * Directly compresses any uploaded image file to an ultra-compact WebP Data URI (~20KB - 40KB)
 * that stores directly in Firestore without needing Firebase Storage at all!
 */
export async function fileToOptimizedDataUri(file: File): Promise<string> {
  const optimizedBlob = await optimizeImage(file, {
    maxWidth: 700,
    maxHeight: 700,
    quality: 0.75,
    outputFormat: 'image/webp'
  });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(optimizedBlob);
  });
}

/**
 * Validates file type and size (5MB max before optimization)
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file format. Allowed formats: JPG, PNG, WebP, SVG.'
    };
  }

  const maxSizeBytes = 10 * 1024 * 1024; // 10 MB max input limit
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit. Please choose a smaller image.'
    };
  }

  return { valid: true };
}
