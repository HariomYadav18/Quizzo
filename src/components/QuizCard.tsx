import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Key, Loader2, Zap } from 'lucide-react';
import { generateQuestionHint } from '../services/ai';
import type { Question } from '../types/quiz';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (answer: 1 | 2 | 3 | 4, hesitationMs: number) => void;
}

export function QuizCard({ question, currentIndex, totalQuestions, onAnswer }: QuizCardProps) {
  // ... keep existing state ...
  
  // Hesitation Analytics State
  const hoverStartTime = useRef<number | null>(null);

  useEffect(() => {
    // Reset hesitation tracker on new question
    hoverStartTime.current = null;
  }, [question.id]);

  const handleMouseEnter = () => {
    if (hoverStartTime.current === null) {
      hoverStartTime.current = Date.now();
    }
  };

  const handleSelectAnswer = (id: 1 | 2 | 3 | 4) => {
    const hesitation = hoverStartTime.current ? Date.now() - hoverStartTime.current : 0;
    onAnswer(id, hesitation);
  };

  const choices = [
    { id: 1 as const, letter: 'A', text: question.choice1 },
    { id: 2 as const, letter: 'B', text: question.choice2 },
    { id: 3 as const, letter: 'C', text: question.choice3 },
    { id: 4 as const, letter: 'D', text: question.choice4 },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          className="bg-surface p-8 md:p-12 rounded-3xl border border-border relative overflow-hidden shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-primary font-medium uppercase tracking-widest bg-gray-100 px-4 py-1.5 rounded-full">
                Telemetry Active
              </span>
              {question.isAdaptive && (
                <span className="flex items-center gap-1 font-mono text-xs text-white font-medium uppercase tracking-widest bg-rose-500 px-4 py-1.5 rounded-full shadow-sm">
                  <Zap className="w-3 h-3" /> Adaptive Spike
                </span>
              )}
            </div>
            <div className="font-mono text-sm text-muted font-bold">
              <span className="text-primary">{currentIndex + 1}</span> / {totalQuestions}
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-primary mb-10 leading-snug">
            {question.question}
          </h2>

          <div className="flex flex-col gap-4 mb-8">
            {choices.map((choice) => (
              <button
                key={choice.id}
                onMouseEnter={handleMouseEnter}
                onClick={() => handleSelectAnswer(choice.id)}
                className="group relative flex items-center w-full p-5 text-left bg-white border border-border rounded-2xl hover:border-gray-400 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-border text-muted group-hover:text-primary font-mono font-bold transition-colors mr-5 shrink-0">
                  {choice.letter}
                </div>
                <span className="font-medium text-primary text-sm md:text-base">
                  {choice.text}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}