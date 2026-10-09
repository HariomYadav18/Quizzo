import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Trophy, Wand2, Home, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (mode: 'dashboard' | 'concept-book' | 'leaderboard') => void;
  onOpenAi: () => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate, onOpenAi }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { id: 'home', label: 'Go to Dashboard', icon: Home, action: () => { onNavigate('dashboard'); onClose(); } },
    { id: 'concept', label: 'Open Concept Book', icon: BookOpen, action: () => { onNavigate('concept-book'); onClose(); } },
    { id: 'leaderboard', label: 'View Rankings', icon: Trophy, action: () => { onNavigate('leaderboard'); onClose(); } },
    { id: 'ai', label: 'Generate AI Assessment', icon: Wand2, action: () => { onOpenAi(); onClose(); } },
  ].filter(item => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 flex items-start justify-center pt-32 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="flex items-center px-4 py-3 border-b border-border">
            <Search className="w-5 h-5 text-muted mr-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              autoFocus
              className="w-full bg-transparent text-primary text-sm focus:outline-none placeholder:text-muted"
            />
            <button onClick={onClose} className="p-1 text-muted hover:text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-2 space-y-1">
            {actions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted">No commands found.</div>
            ) : (
              actions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 text-sm font-medium text-primary transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-muted" />
                    {item.label}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}