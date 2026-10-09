export interface Question {
  id: string;
  category?: string;
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  answer: 1 | 2 | 3 | 4;
  isAdaptive?: boolean; // Flags harder questions injected mid-quiz
}

export interface QuizSessionMetrics {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  startTime: number;
  endTime: number | null;
  timePerQuestionMs: number[];
  hesitationMs: number[]; // Tracks how long users hovered before clicking
  adaptiveTriggers: number; // Tracks how many times the AI scaled difficulty
}

export interface QuizEngineState {
  status: 'idle' | 'active' | 'completed';
  questions: Question[];
  currentIndex: number;
  metrics: QuizSessionMetrics;
  apiKey?: string; // Stored to allow mid-quiz background LLM generation
}