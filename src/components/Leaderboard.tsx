import { Trophy, Medal, Award } from 'lucide-react';
import type { PlayerScore } from '../types/quiz';

interface LeaderboardProps {
  scores: PlayerScore[];
}

export function Leaderboard({ scores }: LeaderboardProps) {
  if (scores.length === 0) return null;

  return (
    <div className="mt-10 p-6 md:p-8 bg-black/40 border border-white/[0.05] rounded-3xl">
      <h3 className="text-lg font-medium text-zinc-100 mb-6 flex items-center gap-3 tracking-tight">
        <Trophy className="w-5 h-5 text-accent-emerald" />
        Global Telemetry Rankings
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.05] text-xs font-mono text-zinc-500 uppercase tracking-widest">
              <th className="pb-4 pl-4 font-normal">Rank</th>
              <th className="pb-4 font-normal">Operative</th>
              <th className="pb-4 font-normal text-right">Accuracy</th>
              <th className="pb-4 pr-4 font-normal text-right">Score</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {scores.map((score, index) => (
              <tr 
                key={score.id} 
                className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group"
              >
                <td className="py-4 pl-4 text-zinc-500 flex items-center h-full">
                  {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                  {index === 1 && <Medal className="w-4 h-4 text-zinc-400" />}
                  {index === 2 && <Award className="w-4 h-4 text-amber-700" />}
                  {index > 2 && <span className="pl-1 text-zinc-600">0{index + 1}</span>}
                </td>
                <td className="py-4 text-zinc-100 font-sans font-medium">{score.name}</td>
                <td className="py-4 text-accent-emerald text-right">{score.accuracy}%</td>
                <td className="py-4 pr-4 text-accent-cyan font-bold text-right">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}