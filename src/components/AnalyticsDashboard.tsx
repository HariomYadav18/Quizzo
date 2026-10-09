import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { RotateCcw, Activity, Clock, Target, Sparkles, Key, Loader2, Save } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePostQuizAnalysis } from '../services/ai';
import { useHighScores } from '../hooks/useHighScores';
import { Leaderboard } from './Leaderboard';
import type { QuizSessionMetrics, Question } from '../types/quiz';

interface AnalyticsDashboardProps {
  metrics: QuizSessionMetrics;
  questions: Question[];
  onReset: () => void;
}

export function AnalyticsDashboard({ metrics, questions, onReset }: AnalyticsDashboardProps) {
  const [apiKey, setApiKey] = useState('');
  const [insight, setInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { highScores, saveScore } = useHighScores();
  const [playerName, setPlayerName] = useState('');
  const [hasSavedScore, setHasSavedScore] = useState(false);

  const accuracy = Math.round((metrics.correctAnswers / metrics.totalQuestions) * 100);

  // Trigger confetti physics on high accuracy finish
  useEffect(() => {
    if (accuracy >= 75) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [accuracy]);
  
  const chartData = metrics.timePerQuestionMs.map((time, index) => ({
    question: `Q${index + 1}`,
    time: Number((time / 1000).toFixed(1)), 
  }));

  const averageTime = chartData.length 
    ? (chartData.reduce((acc, curr) => acc + curr.time, 0) / chartData.length).toFixed(1)
    : 0;

  const handleGenerateInsights = async () => {
    if (!apiKey) {
      setError('An OpenAI API key is required for synthesis.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const feedback = await generatePostQuizAnalysis(metrics, questions, apiKey);
      setInsight(feedback);
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Verify your API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveScore = () => {
    if (!playerName.trim()) return;
    saveScore(playerName, metrics);
    setHasSavedScore(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-surface border border-border p-8 md:p-12 rounded-3xl shadow-xl my-10 relative overflow-hidden">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-border">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-border flex items-center justify-center">
            <Activity className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-medium text-primary tracking-tight">Assessment Complete</h2>
            <p className="text-muted font-mono text-xs mt-1">Session ID: {metrics.startTime}</p>
          </div>
        </div>

        {/* Top Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-gray-50/50 border border-border rounded-2xl relative overflow-hidden">
            <div className="text-xs font-semibold text-muted mb-2 uppercase tracking-wider">Total Score</div>
            <div className="text-4xl font-medium text-primary">{metrics.score}</div>
          </div>
          
          <div className="p-6 bg-gray-50/50 border border-border rounded-2xl relative overflow-hidden">
            <div className="text-xs font-semibold text-muted mb-2 uppercase tracking-wider">Accuracy</div>
            <div className="text-4xl font-medium text-emerald-600">{accuracy}%</div>
          </div>

          <div className="p-6 bg-gray-50/50 border border-border rounded-2xl relative overflow-hidden">
            <div className="text-xs font-semibold text-muted mb-2 uppercase tracking-wider">Avg Speed</div>
            <div className="text-4xl font-medium text-blue-600">{averageTime}s</div>
          </div>
        </div>

        {/* AI Insights Section */}
        <div className="mb-12 p-8 bg-white border border-border rounded-3xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-medium text-primary">AI Performance Synthesis</h3>
          </div>
          
          {!insight ? (
            <div className="space-y-6">
              <p className="text-sm text-muted font-medium">
                Unlock an editorial breakdown of your cognitive performance and knowledge gaps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-proj-..."
                    className="w-full bg-gray-50/50 border border-border rounded-xl pl-11 pr-4 py-3.5 text-primary text-sm focus:outline-none focus:border-gray-400 font-mono"
                  />
                </div>
                <button
                  onClick={handleGenerateInsights}
                  disabled={isGenerating}
                  className="px-6 py-3.5 bg-[#212836] hover:bg-[#1a1f2b] text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Synthesize'}
                </button>
              </div>
              {error && <p className="text-red-500 font-medium text-sm">{error}</p>}
            </div>
          ) : (
            <div className="p-6 bg-gray-50/50 border border-border rounded-2xl">
              <p className="text-primary font-normal leading-relaxed text-sm md:text-base">
                {insight}
              </p>
            </div>
          )}
        </div>

        {/* Persistence Logic: Save Score & Leaderboard */}
        {!hasSavedScore ? (
          <div className="mb-12 p-8 bg-gray-50/50 border border-border rounded-3xl flex flex-col md:flex-row gap-6 items-center justify-between">
            <div>
              <h4 className="text-primary font-medium text-xl mb-1">Archive Results</h4>
              <p className="text-muted text-sm font-medium">Save your score to the global local registry.</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Operative Name..."
                maxLength={12}
                className="w-full md:w-48 bg-white border border-border rounded-xl px-4 py-3 text-primary text-sm font-mono focus:outline-none focus:border-gray-400"
              />
              <button
                onClick={handleSaveScore}
                disabled={!playerName.trim()}
                className="px-6 py-3 bg-white hover:bg-gray-50 text-primary border border-border text-sm font-medium rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        ) : (
          <Leaderboard scores={highScores} />
        )}

        {/* Action Button */}
        <button
          onClick={onReset}
          className="mt-6 flex items-center justify-center gap-2 w-full p-4 bg-[#212836] hover:bg-[#1a1f2b] text-white text-sm font-medium rounded-2xl transition-all shadow-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Initialize New Assessment
        </button>
      </div>
    </div>
  );
}