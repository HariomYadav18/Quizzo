import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Wand2, Loader2, FileText, Type } from 'lucide-react';
import { generateDynamicQuiz } from '../services/ai';
import { DocumentDropzone } from './DocumentDropzone';
import type { Question } from '../types/quiz';

interface GenAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionsGenerated: (questions: Question[]) => void;
}

export function GenAIModal({ isOpen, onClose, onQuestionsGenerated }: GenAIModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [topic, setTopic] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'pdf'>('text');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const sourceMaterial = inputMode === 'pdf' ? extractedText : topic;

    if (!apiKey || !sourceMaterial) {
      setError('Both an API Key and Source Material are required.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      // If it's a document, append strict instructions to the payload
      const promptPayload = inputMode === 'pdf' 
        ? `Generate an assessment strictly based on the following extracted document text. Do not include outside information: \n\n ${sourceMaterial}` 
        : sourceMaterial;

      const questions = await generateDynamicQuiz(promptPayload, apiKey);
      onQuestionsGenerated(questions);
      
      // Reset state on success
      onClose();
      setTopic(''); 
      setExtractedText('');
    } catch (err: any) {
      setError(err.message || 'Generation failed. Check your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle Dark Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50 p-4"
          >
            <div className="bg-surface border border-border p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 text-muted hover:text-primary transition-colors bg-gray-50 rounded-full border border-border"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#212836] flex items-center justify-center shadow-sm">
                  <Wand2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-medium text-primary tracking-tight">AI Generation</h2>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* API Key Input */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted mb-2 uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5" /> OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full bg-white border border-border rounded-xl px-4 py-3 text-primary text-sm focus:outline-none focus:border-gray-400 transition-colors shadow-sm font-mono"
                  />
                </div>

                {/* Input Mode Toggle */}
                <div className="flex bg-gray-50 p-1 rounded-xl border border-border">
                  <button
                    onClick={() => setInputMode('text')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                      inputMode === 'text' ? 'bg-white text-primary shadow-sm border border-border/50' : 'text-muted hover:text-primary'
                    }`}
                  >
                    <Type className="w-4 h-4" /> Text / Topic
                  </button>
                  <button
                    onClick={() => setInputMode('pdf')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
                      inputMode === 'pdf' ? 'bg-white text-primary shadow-sm border border-border/50' : 'text-muted hover:text-primary'
                    }`}
                  >
                    <FileText className="w-4 h-4" /> Document (PDF)
                  </button>
                </div>

                {/* Conditional Input Area */}
                <div>
                  {inputMode === 'text' ? (
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Type a topic (e.g., 'React Hooks') or paste a Wikipedia URL..."
                      rows={4}
                      className="w-full bg-white border border-border rounded-xl px-4 py-3 text-primary text-sm focus:outline-none focus:border-gray-400 transition-colors shadow-sm resize-none"
                    />
                  ) : (
                    <DocumentDropzone onExtracted={(text) => setExtractedText(text)} />
                  )}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || (inputMode === 'pdf' && !extractedText)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#212836] hover:bg-[#1a1f2b] text-white text-sm font-medium rounded-full shadow-sm transition-all disabled:opacity-50 mt-4"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Synthesizing Knowledge...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate Assessment
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}