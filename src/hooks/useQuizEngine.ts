import { useState, useCallback, useMemo, useRef } from 'react';
import type { Question, QuizSessionMetrics, QuizEngineState } from '../types/quiz';
import rawQuestions from '../data/questions.json';
import { generateAdaptiveQuestion } from '../services/ai';

const allQuestions: Question[] = rawQuestions.map((q: any) => ({
  ...q, answer: Number(q.answer) as 1 | 2 | 3 | 4, category: q.category || 'General', 
}));

const initialMetrics: QuizSessionMetrics = {
  totalQuestions: 0,
  correctAnswers: 0,
  score: 0,
  startTime: 0,
  endTime: null,
  timePerQuestionMs: [],
  hesitationMs: [],
  adaptiveTriggers: 0,
};

export function useQuizEngine() {
  const [state, setState] = useState<QuizEngineState>({
    status: 'idle',
    questions: [],
    currentIndex: 0,
    metrics: initialMetrics,
  });

  const questionStartTime = useRef<number>(0);

  const availableTopics = useMemo(() => Array.from(new Set(allQuestions.map(q => q.category))) as string[], []);

  const startQuiz = useCallback((selectedTopic: string = 'All', questionCount: number = 10, apiKey?: string) => {
    const worker = new Worker(new URL('../workers/quizWorker.ts', import.meta.url), { type: 'module' });
    
    worker.onmessage = (e) => {
      const finalQuestions = e.data;
      const now = Date.now();
      setState({
        status: 'active',
        questions: finalQuestions,
        currentIndex: 0,
        apiKey,
        metrics: { ...initialMetrics, totalQuestions: finalQuestions.length, startTime: now },
      });
      questionStartTime.current = now;
      worker.terminate();
    };

    worker.postMessage({ questions: allQuestions, topic: selectedTopic, count: questionCount });
  }, []);

  const loadDynamicQuestions = useCallback((newQuestions: Question[]) => {
    setState(prev => ({
      ...prev,
      questions: newQuestions
    }));
  }, []);

  const answerQuestion = useCallback(async (selectedAnswer: 1 | 2 | 3 | 4, hesitation: number) => {
    setState((prev) => {
      if (prev.status !== 'active') return prev;

      const currentQ = prev.questions[prev.currentIndex];
      const isCorrect = selectedAnswer === currentQ.answer;
      
      const timeTakenMs = Date.now() - questionStartTime.current;
      const isLastQuestion = prev.currentIndex === prev.questions.length - 1;

      const isPerformingExceptionally = isCorrect && timeTakenMs < 4000;
      
      if (isPerformingExceptionally && prev.apiKey && !isLastQuestion) {
        generateAdaptiveQuestion(currentQ.category || 'General', prev.apiKey)
          .then((hardQ) => {
            setState(s => ({
              ...s,
              questions: [...s.questions.slice(0, s.currentIndex + 2), hardQ, ...s.questions.slice(s.currentIndex + 2)],
              metrics: { ...s.metrics, totalQuestions: s.metrics.totalQuestions + 1, adaptiveTriggers: s.metrics.adaptiveTriggers + 1 }
            }));
          }).catch(() => {});
      }

      const updatedMetrics: QuizSessionMetrics = {
        ...prev.metrics,
        correctAnswers: prev.metrics.correctAnswers + (isCorrect ? 1 : 0),
        score: prev.metrics.score + (isCorrect ? (currentQ.isAdaptive ? 25 : 10) : 0),
        timePerQuestionMs: [...prev.metrics.timePerQuestionMs, timeTakenMs],
        hesitationMs: [...prev.metrics.hesitationMs, hesitation],
        endTime: isLastQuestion ? Date.now() : prev.metrics.endTime,
      };

      questionStartTime.current = Date.now();

      return {
        ...prev,
        status: isLastQuestion ? 'completed' : 'active',
        currentIndex: isLastQuestion ? prev.currentIndex : prev.currentIndex + 1,
        metrics: updatedMetrics,
      };
    });
  }, []);

  const resetQuiz = useCallback(() => {
    setState({ status: 'idle', questions: [], currentIndex: 0, metrics: initialMetrics });
  }, []);

  return { 
    ...state, 
    currentQuestion: state.questions[state.currentIndex], 
    availableTopics, 
    startQuiz, 
    answerQuestion, 
    resetQuiz,
    loadDynamicQuestions 
  };
}