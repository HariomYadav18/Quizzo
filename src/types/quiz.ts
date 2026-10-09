export interface Question {
  id: string;
  category?: string;
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  answer: 1 | 2 | 3 | 4;
  isAdaptive?: boolean;
}

export interface QuizSessionMetrics {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  startTime: number;
  endTime: number | null;
  timePerQuestionMs: number[];
  hesitationMs: number[];
  adaptiveTriggers: number;
}

export interface QuizEngineState {
  status: 'idle' | 'active' | 'completed';
  questions: Question[];
  currentIndex: number;
  metrics: QuizSessionMetrics;
  apiKey?: string;
}

export interface PlayerScore {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  timestamp: number;
}