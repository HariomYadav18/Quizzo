import { useState, useEffect } from 'react';
import { useQuizEngine } from './hooks/useQuizEngine';
import { useHighScores } from './hooks/useHighScores';
import { QuizCard } from './components/QuizCard';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { ConceptBook } from './components/ConceptBook';
import { GenAIModal } from './components/GenAIModal';
import { HistoryModal } from './components/HistoryModal';
import { CommandPalette } from './components/CommandPalette';
import { Leaderboard } from './components/Leaderboard';
import { ArrowRight, Wand2 } from 'lucide-react';

function App() {
  const { 
    status, currentQuestion, currentIndex, metrics, questions, 
    availableTopics, startQuiz, answerQuestion, resetQuiz, loadDynamicQuestions
  } = useQuizEngine();
  
  const { highScores } = useHighScores();

  const [appMode, setAppMode] = useState<'dashboard' | 'concept-book' | 'leaderboard'>('dashboard');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  // Assessment Config State
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [questionCount, setQuestionCount] = useState(10);

  // Global Cmd+K / Ctrl+K Listener
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      
      {/* ARC UI Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/60 blur-[120px] mix-blend-multiply opacity-70" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-rose-100/60 blur-[120px] mix-blend-multiply opacity-70" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-amber-50/80 blur-[120px] mix-blend-multiply opacity-80" />
      </div>

      {/* Minimal Navigation Bar */}
      <header className="w-full z-20 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { setAppMode('dashboard'); resetQuiz(); }}
          >
            <span className="font-bold text-xl tracking-tight text-primary">Quizzo.</span>
          </div>

          {status === 'idle' && (
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => setAppMode('dashboard')} className={`text-sm font-medium transition-colors ${appMode === 'dashboard' ? 'text-primary' : 'text-muted hover:text-primary'}`}>
                Dashboard
              </button>
              <button onClick={() => setAppMode('concept-book')} className={`text-sm font-medium transition-colors ${appMode === 'concept-book' ? 'text-primary' : 'text-muted hover:text-primary'}`}>
                Concept Book
              </button>
              <button onClick={() => setAppMode('leaderboard')} className={`text-sm font-medium transition-colors ${appMode === 'leaderboard' ? 'text-primary' : 'text-muted hover:text-primary'}`}>
                Rankings
              </button>
              <button onClick={() => setIsHistoryOpen(true)} className="text-sm font-medium text-muted hover:text-primary transition-colors">
                History
              </button>
            </nav>
          )}
          
          <div className="flex items-center gap-4">
            {status === 'active' && (
              <span className="font-mono text-sm font-medium text-primary bg-white px-4 py-1.5 rounded-full border border-border shadow-sm">
                Score: {metrics.score}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full max-w-5xl mx-auto">
        
        {appMode === 'dashboard' && status === 'idle' && (
          <div className="w-full text-center flex flex-col items-center animate-in fade-in duration-700 mt-10">
            
            <h1 className="text-5xl md:text-[5.5rem] font-medium text-primary tracking-tight leading-[1.05] mb-6 max-w-4xl">
              Evaluate skills <br className="hidden md:block"/>
              with precision.
            </h1>
            
            <p className="text-muted text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Dynamic assessments and cognitive telemetry built in. Configure your parameters below, or point your AI at a topic and let it build.
            </p>

            {/* Quiz Configuration Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full max-w-lg mx-auto">
              <select 
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm border border-border rounded-full px-5 py-3 text-sm font-medium text-primary focus:outline-none focus:border-gray-400 transition-colors cursor-pointer shadow-sm"
              >
                <option value="All">Comprehensive (All Topics)</option>
                {availableTopics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              
              <select 
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-white/50 backdrop-blur-sm border border-border rounded-full px-5 py-3 text-sm font-medium text-primary focus:outline-none focus:border-gray-400 transition-colors cursor-pointer shadow-sm"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={25}>25 Questions</option>
              </select>
            </div>

            {/* Arc UI Style Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto">
              <button
                onClick={() => startQuiz(selectedTopic, questionCount)}
                className="flex items-center justify-center gap-2 bg-[#212836] hover:bg-[#1a1f2b] text-white text-sm font-medium px-6 py-3 rounded-full transition-all w-full shadow-sm"
              >
                Start Assessment <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsAiModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#fdfdfd] hover:bg-gray-50 text-primary border border-gray-200 text-sm font-medium px-6 py-3 rounded-full transition-all w-full shadow-sm"
              >
                <Wand2 className="w-4 h-4" /> Generate with AI
              </button>
            </div>
          </div>
        )}

        {appMode === 'concept-book' && status === 'idle' && (
          <ConceptBook availableTopics={availableTopics} onBack={() => setAppMode('dashboard')} />
        )}

        {appMode === 'leaderboard' && status === 'idle' && (
          <div className="w-full max-w-4xl animate-in fade-in">
             <div className="bg-surface p-8 rounded-3xl border border-border shadow-xl">
                <Leaderboard scores={highScores} />
             </div>
          </div>
        )}

        {status === 'active' && currentQuestion && (
          <QuizCard 
            question={currentQuestion} 
            currentIndex={currentIndex} 
            totalQuestions={metrics.totalQuestions} 
            onAnswer={answerQuestion} 
          />
        )}

        {status === 'completed' && (
          <AnalyticsDashboard 
            metrics={metrics} 
            questions={questions} 
            onReset={resetQuiz} 
          />
        )}
      </main>

      {/* Global Modals & Command Palette */}
      <GenAIModal 
        isOpen={isAiModalOpen} 
        onClose={() => setIsAiModalOpen(false)} 
        onQuestionsGenerated={(newQuestions) => {
          loadDynamicQuestions(newQuestions);
          startQuiz(selectedTopic, newQuestions.length); 
        }} 
      />
      <HistoryModal 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)} 
        scores={highScores} 
      />
      <CommandPalette 
        isOpen={isCmdOpen} 
        onClose={() => setIsCmdOpen(false)} 
        onNavigate={(mode) => setAppMode(mode)} 
        onOpenAi={() => setIsAiModalOpen(true)} 
      />
    </div>
  );
}

export default App;