import { useState, useEffect } from 'react';
import type { PlayerScore, QuizSessionMetrics } from '../types/quiz';

const STORAGE_KEY = 'quizzo_high_scores_v1';

export function useHighScores() {
  const [highScores, setHighScores] = useState<PlayerScore[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHighScores(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load high scores', e);
    }
  }, []);

  const saveScore = (name: string, metrics: QuizSessionMetrics) => {
    const accuracy = metrics.totalQuestions > 0 
      ? Math.round((metrics.correctAnswers / metrics.totalQuestions) * 100) 
      : 0;

    const newScore: PlayerScore = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      score: metrics.score,
      accuracy,
      timestamp: Date.now(), // Changed to Date.now() to return a number
    };

    const updated = [newScore, ...highScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10

    setHighScores(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save high score', e);
    }
  };

  return { highScores, saveScore };
}