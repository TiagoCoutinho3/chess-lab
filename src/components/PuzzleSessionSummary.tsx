import React from 'react';
import { SessionStats } from '../hooks/usePuzzleSession';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Flame,
  RotateCcw,
  SlidersHorizontal,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface PuzzleSessionSummaryProps {
  stats: SessionStats;
  difficultyLabel: string;
  selectedThemesCount: number;
  onRestartSession: () => void;
  onNewSession: () => void;
}

export const PuzzleSessionSummary: React.FC<PuzzleSessionSummaryProps> = ({
  stats,
  difficultyLabel,
  selectedThemesCount,
  onRestartSession,
  onNewSession,
}) => {
  const accuracy =
    stats.totalAttempted > 0
      ? Math.round((stats.solved / stats.totalAttempted) * 100)
      : 0;

  const isHighAccuracy = accuracy >= 70;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 border border-[#DDE3EA] shadow-xs text-center space-y-6">
        {/* Trophy / Badge Icon */}
        <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center bg-gradient-to-tr from-[#EDE7FF] to-[#F7F9FC] border border-[#DDD6FE] text-[#5B21B6] shadow-sm">
          {isHighAccuracy ? (
            <Trophy className="w-10 h-10 text-[#5B21B6]" />
          ) : (
            <Target className="w-10 h-10 text-[#8AA7E1]" />
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isHighAccuracy
              ? '🎉 Treino Concluído com Sucesso!'
              : 'Treino Finalizado! Bom esforço!'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            Você completou a fila de puzzles para a faixa de dificuldade{' '}
            <span className="font-bold text-slate-700">{difficultyLabel}</span>
            {selectedThemesCount > 0 && ` (${selectedThemesCount} temas selecionados)`}.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-[#F7F9FC] rounded-2xl border border-[#DDE3EA]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
              Tentativas
            </span>
            <span className="text-xl font-black text-slate-900">
              {stats.totalAttempted}
            </span>
          </div>

          <div className="p-4 bg-[#BDE7C9]/30 rounded-2xl border border-[#BDE7C9]/60">
            <span className="text-[10px] uppercase font-bold text-[#166534] block mb-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Acertos
            </span>
            <span className="text-xl font-black text-[#166534]">
              {stats.solved}
            </span>
          </div>

          <div className="p-4 bg-[#FFD6E0]/40 rounded-2xl border border-[#FFD6E0]/80">
            <span className="text-[10px] uppercase font-bold text-[#9F1239] block mb-1 flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3" />
              Erros
            </span>
            <span className="text-xl font-black text-[#9F1239]">
              {stats.failed}
            </span>
          </div>

          <div className="p-4 bg-[#EDE7FF] rounded-2xl border border-[#DDD6FE]">
            <span className="text-[10px] uppercase font-bold text-[#5B21B6] block mb-1 flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              Precisão
            </span>
            <span className="text-xl font-black text-[#5B21B6]">
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRestartSession}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-[#DDE3EA] hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repetir com Mesmos Filtros</span>
          </button>

          <button
            onClick={onNewSession}
            className="w-full sm:w-auto px-6 py-3 bg-[#8AA7E1] hover:bg-[#7292D6] active:scale-95 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Escolher Novos Filtros</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
