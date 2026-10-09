import { useState, useEffect, useCallback } from 'react';
import type { PlayerScore, QuizSessionMetrics } from '../types/quiz';

export function useHighScores() {
  const [highScores, setHighScores] = useState<PlayerScore[]>([]);

  // Load scores on mount
  useEffect(() => {
    const stored = localStorage.getItem('quick-quiz-telemetry');
    if (stored) {
      try {
        setHighScores(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse telemetry data');
      }
    }
  }, []);

  const saveScore = useCallback((name: string, metrics: QuizSessionMetrics) => {
    const newScore: PlayerScore = {
      id: crypto.randomUUID(),
      name,
      score: metrics.score,
      accuracy: Math.round((metrics.correctAnswers / metrics.totalQuestions) * 100),
      timestamp: new Date().toISOString(),
    };

    setHighScores((prev) => {
      // Add new score, sort descending by score, and keep only the top 10
      const updated = [...prev, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      localStorage.setItem('quick-quiz-telemetry', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { highScores, saveScore };
}