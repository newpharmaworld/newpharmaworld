import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Link as LinkIcon, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { uploadImage, StorageFolder } from '../../firebase/storage';
import { useToast } from '../../context/ToastContext';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  folder?: StorageFolder;
  label?: string;
  customPrefix?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  folder = 'products',
  label = 'Product Image',
  customPrefix = 'item',
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsProcessing(true);

    try {
      // Automatically compresses to ultra-lightweight WebP (< 30KB) - 100% Free, zero upgrade needed
      const { url } = await uploadImage(file, folder, customPrefix);
      setPreviewUrl(url);
      onImageUploaded(url);
      success('Image optimized and attached successfully!');
    } catch (err: any) {
      console.error('Image processing error:', err);
      error(err.message || 'Failed to process image. You can paste an image URL directly.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleManualUrlApply = () => {
    if (!manualUrl.trim()) return;
    setPreviewUrl(manualUrl.trim());
    onImageUploaded(manualUrl.trim());
    setManualUrl('');
    setUseUrlInput(false);
    success('Image URL applied successfully!');
  };

  const handleClearImage = () => {
    setPreviewUrl('');
    onImageUploaded('');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setUseUrlInput(!useUrlInput)}
          className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1"
        >
          {useUrlInput ? <Upload className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
          <span>{useUrlInput ? 'Upload Image File' : 'Paste Direct Image URL'}</span>
        </button>
      </div>

      {useUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-... or any image link"
            className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          />
          <button
            type="button"
            onClick={handleManualUrlApply}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
          >
            Apply URL
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Upload Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`w-full sm:flex-1 border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              isProcessing
                ? 'bg-slate-50 border-teal-400'
                : 'border-slate-300 hover:border-teal-500 hover:bg-teal-50/50 bg-slate-50/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
              disabled={isProcessing}
            />

            {isProcessing ? (
              <div className="flex items-center gap-2 text-teal-700 py-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs font-semibold">Compressing & optimizing image...</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-700">
                  <span className="font-bold text-teal-700">Choose Image</span> from device
                </div>
                <p className="text-[11px] text-slate-400">Auto-compressed to ultra-light WebP (100% Free • No storage upgrade needed)</p>
              </>
            )}
          </div>

          {/* Preview Container */}
          {previewUrl && (
            <div className="relative w-24 h-24 rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm flex-shrink-0 group flex items-center justify-center p-1">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Invalid';
                }}
              />
              <button
                type="button"
                onClick={handleClearImage}
                className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-sm"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
