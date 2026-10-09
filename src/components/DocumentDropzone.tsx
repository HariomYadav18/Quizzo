import { useState, useCallback, useRef } from 'react';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { extractTextFromFile } from '../utils/pdfParser';

interface DocumentDropzoneProps {
  onExtracted: (text: string) => void;
}

export function DocumentDropzone({ onExtracted }: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Centralized file processor for both drag and click events
  const processFile = async (file: File) => {
    if (!file || file.type !== 'application/pdf') return;
    
    setIsProcessing(true);
    try {
      const text = await extractTextFromFile(file);
      onExtracted(text);
      setIsSuccess(true);
    } catch (error) {
      console.error('Extraction failed', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [onExtracted]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div
      onClick={() => !isProcessing && !isSuccess && fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
        !isProcessing && !isSuccess ? 'cursor-pointer' : ''
      } ${
        isDragging ? 'border-accent-blue bg-blue-50/50' : 
        isSuccess ? 'border-emerald-500 bg-emerald-50/50' : 
        'border-border bg-gray-50/50 hover:bg-gray-100/50'
      }`}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="application/pdf" 
        onChange={handleFileSelect} 
      />
      
      {isProcessing ? (
        <Loader2 className="w-8 h-8 text-accent-blue animate-spin mb-3" />
      ) : isSuccess ? (
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-3" />
      ) : (
        <UploadCloud className={`w-8 h-8 mb-3 transition-colors ${isDragging ? 'text-accent-blue' : 'text-muted'}`} />
      )}
      
      <p className={`text-sm font-medium ${isSuccess ? 'text-emerald-700' : 'text-primary'}`}>
        {isProcessing ? 'Extracting knowledge base...' : 
         isSuccess ? 'Document processed successfully' : 
         'Drag and drop or click to browse'}
      </p>
      
      {!isSuccess && !isProcessing && (
        <p className="text-xs text-muted mt-1">Local processing. Max 15 pages.</p>
      )}
    </div>
  );
}