import React from 'react';
import { Star, ThumbsUp, Sparkles, X } from 'lucide-react';
import { MoveAnalysis, MoveQuality } from '../types';
import { MoveEvaluationBadge } from './MoveEvaluationBadge';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestMoveSan: string;
  bestMoveFrom: string;
  bestMoveTo: string;
  explanation: string;
  lastMoveAnalysis?: MoveAnalysis | null;
  currentEvaluation: string;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  onClose,
  bestMoveSan,
  bestMoveFrom,
  bestMoveTo,
  explanation,
  lastMoveAnalysis,
  currentEvaluation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-[#DDE3EA] overflow-hidden p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          id="close-hint-modal-btn"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-5">
          <h3 className="text-lg font-bold text-slate-800">Melhor lance</h3>
          <p className="text-xs text-slate-500 mt-0.5">Sugestão da engine para a posição atual</p>
        </div>

        {/* Best Move Pill Banner */}
        <div className="bg-[#BDE7C9]/40 border border-[#BDE7C9] rounded-2xl py-3.5 px-6 flex items-center justify-center gap-3 mb-4 shadow-xs">
          <span className="text-2xl font-black tracking-wide text-[#166534] font-mono flex items-center gap-2">
            <span>{bestMoveSan}</span>
            <Star className="w-5 h-5 fill-[#22C55E] text-[#166534]" />
          </span>
          <span className="text-xs font-semibold text-[#166534]/80 bg-white/70 px-2 py-0.5 rounded-full">
            {bestMoveFrom} → {bestMoveTo}
          </span>
        </div>

        {/* Tactical / Pedagogical Explanation */}
        <div className="bg-[#F7F9FC] border border-[#DDE3EA] rounded-xl p-4 mb-5">
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {explanation || 'Essa jogada maximiza o controle espacial e a coordenação das suas peças.'}
          </p>
        </div>

        {/* Evaluation of Previous / Current Position */}
        <div className="border-t border-slate-100 pt-4 mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Avaliação da posição
          </h4>
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            {lastMoveAnalysis ? (
              <div className="flex items-center gap-2">
                <MoveEvaluationBadge quality={lastMoveAnalysis.quality} />
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                <Sparkles className="w-4 h-4 text-[#8AA7E1]" />
                <span>Posição Ativa</span>
              </div>
            )}
            <span
              className={`text-sm font-mono font-bold px-2.5 py-0.5 rounded-lg ${
                currentEvaluation.startsWith('+')
                  ? 'bg-[#BDE7C9] text-[#166534]'
                  : currentEvaluation.startsWith('-')
                  ? 'bg-[#FFD6E0] text-[#9F1239]'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {currentEvaluation}
            </span>
          </div>
        </div>

        {/* Entendi Action Button */}
        <button
          id="confirm-hint-btn"
          onClick={onClose}
          className="w-full py-3.5 bg-[#48BB78] hover:bg-[#38A169] active:scale-[0.98] text-white font-bold text-sm tracking-wider uppercase rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>ENTENDI</span>
        </button>
      </div>
    </div>
  );
};
