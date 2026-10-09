import { useState } from 'react';
import { BookOpen, Key, Loader2, Sparkles, ArrowLeft } from 'lucide-react';
import { generateConceptGuide } from '../services/ai';

interface ConceptBookProps {
  availableTopics: string[];
  onBack: () => void;
}

export function ConceptBook({ availableTopics, onBack }: ConceptBookProps) {
  const [selectedTopic, setSelectedTopic] = useState(availableTopics[0] || '');
  const [apiKey, setApiKey] = useState('');
  const [guide, setGuide] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('An API key is required to generate the concept guide.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setGuide(null);
    
    try {
      const content = await generateConceptGuide(selectedTopic, apiKey);
      setGuide(content);
    } catch (err: any) {
      setError(err.message || 'Failed to generate guide.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-muted font-bold hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="bg-surface border border-white p-8 md:p-12 rounded-3xl shadow-3d-soft relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-surface shadow-3d-soft flex items-center justify-center border border-white">
              <BookOpen className="w-7 h-7 text-accent-sky" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary tracking-tight">Concept Book</h2>
              <p className="text-muted font-medium mt-1">Master the fundamentals before testing.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <label className="block text-sm font-bold text-muted mb-3 uppercase tracking-widest">Select Subject</label>
            <select 
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full bg-background shadow-inner-3d rounded-xl px-5 py-4 text-primary font-bold focus:outline-none focus:ring-2 focus:ring-accent-sky/50 transition-all font-sans cursor-pointer border-none"
            >
              {availableTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-muted mb-3 uppercase tracking-widest">
              <Key className="w-4 h-4" /> Provider Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-background shadow-inner-3d rounded-xl px-5 py-4 text-primary font-bold placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent-sky/50 transition-all font-mono text-sm border-none"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedTopic}
          className="w-full py-5 bg-white text-accent-sky font-display font-bold text-lg rounded-2xl shadow-3d-soft hover:-translate-y-1 hover:shadow-float transition-all disabled:opacity-50 flex items-center justify-center gap-3 mb-8 border border-transparent hover:border-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" /> Synthesizing Knowledge Base...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" /> Generate Study Guide
            </>
          )}
        </button>

        {error && <p className="text-red-500 font-bold text-sm text-center mb-6">{error}</p>}

        {guide && (
          <div className="p-8 bg-background shadow-inner-3d rounded-2xl border border-transparent animate-in fade-in">
            <h3 className="font-display font-bold text-xl text-primary mb-4 border-b border-border/50 pb-4">
              Study Guide: {selectedTopic}
            </h3>
            <div className="whitespace-pre-wrap font-medium text-slate-700 leading-relaxed text-base">
              {guide}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}