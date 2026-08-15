import React from 'react';
import { MoveQuality } from '../types';
import { Sparkles, CheckCircle2, ThumbsUp, AlertCircle, XCircle, HelpCircle, BookOpen } from 'lucide-react';

interface MoveEvaluationBadgeProps {
  quality: MoveQuality;
  showLabel?: boolean;
  className?: string;
}

export const MoveEvaluationBadge: React.FC<MoveEvaluationBadgeProps> = ({
  quality,
  showLabel = true,
  className = '',
}) => {
  switch (quality) {
    case 'brilliant':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#EDE7FF] text-[#5B21B6] border border-[#8B5CF6]/30 ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
          {showLabel && <span>Brilhante</span>}
        </span>
      );

    case 'best':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#BDE7C9] text-[#166534] border border-[#22C55E]/30 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />
          {showLabel && <span>Melhor Lance</span>}
        </span>
      );

    case 'good':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#A6C8FF]/40 text-[#1E40AF] border border-[#3B82F6]/30 ${className}`}
        >
          <ThumbsUp className="w-3.5 h-3.5 text-[#1E40AF]" />
          {showLabel && <span>Boa Jogada</span>}
        </span>
      );

    case 'inaccuracy':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFF1C7] text-[#854D0E] border border-[#EAB308]/30 ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-[#854D0E]" />
          {showLabel && <span>Imprecisão</span>}
        </span>
      );

    case 'mistake':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFD6E0] text-[#9F1239] border border-[#F43F5E]/30 ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-[#9F1239]" />
          {showLabel && <span>Erro</span>}
        </span>
      );

    case 'blunder':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFD6E0] text-[#9F1239] border-2 border-[#E11D48] animate-pulse ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#E11D48]" />
          {showLabel && <span>Gaffe (Blunder)</span>}
        </span>
      );

    case 'book':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#CDB4DB]/40 text-[#6B21A8] border border-[#A855F7]/30 ${className}`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#6B21A8]" />
          {showLabel && <span>Teoria</span>}
        </span>
      );

    default:
      return null;
  }
};
