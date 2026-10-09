import { motion, AnimatePresence } from 'framer-motion';
import { X, History, Target, Clock } from 'lucide-react';
import type { PlayerScore } from '../types/quiz';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scores: PlayerScore[];
}

export function HistoryModal({ isOpen, onClose, scores }: HistoryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-40"
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 p-4"
          >
            <div className="bg-surface border border-white h-full rounded-3xl shadow-float flex flex-col overflow-hidden relative">
              <div className="p-6 border-b border-border/50 flex items-center justify-between bg-surface/80 backdrop-blur-xl z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background shadow-inner-3d rounded-lg">
                    <History className="w-5 h-5 text-accent-sky" />
                  </div>
                  <h2 className="text-2xl font-display font-bold text-primary">Session History</h2>
                </div>
                <button onClick={onClose} className="p-2 bg-background shadow-inner-3d rounded-full text-muted hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {scores.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                    <History className="w-12 h-12 text-muted mb-4" />
                    <p className="text-muted font-bold">No telemetry recorded yet.</p>
                  </div>
                ) : (
                  scores.map((score) => (
                    <div key={score.id} className="p-5 bg-background shadow-inner-3d rounded-2xl flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-bold text-accent-blue uppercase tracking-widest bg-white shadow-3d-soft px-3 py-1 rounded-full border border-white">
                            Assessed
                          </span>
                          <h4 className="font-display font-bold text-lg text-primary mt-3">{score.name}</h4>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-display font-bold text-primary">{score.score}</div>
                          <div className="text-xs font-bold text-muted uppercase tracking-wider">Points</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 pt-3 border-t border-border/50">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                          <Target className="w-4 h-4" /> {score.accuracy}% Acc
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-muted">
                          <Clock className="w-4 h-4" /> {new Date(score.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}