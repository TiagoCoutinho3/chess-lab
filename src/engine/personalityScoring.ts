import { PersonalityTrait } from '../types';
import { MoveFeatures, PositionContext } from './moveFeatures';

export const TECHNICAL_TIE_MARGIN_CP = 15;

export interface ScoredCandidate {
  move: string;
  evaluationCp: number;
  personalityScore: number;
  features: MoveFeatures;
}

export function getMultiPvCount(searchDepth: number): number {
  return searchDepth >= 18 ? 3 : 15;
}

export function filterTechnicalTieCandidates<T extends { evaluationCp: number }>(
  candidates: T[],
  isBlack: boolean
): T[] {
  if (candidates.length === 0) return [];

  const sorted = [...candidates].sort((a, b) =>
    isBlack ? a.evaluationCp - b.evaluationCp : b.evaluationCp - a.evaluationCp
  );

  const bestEval = sorted[0].evaluationCp;

  return sorted.filter((c) => {
    const diff = isBlack ? c.evaluationCp - bestEval : bestEval - c.evaluationCp;
    return diff <= TECHNICAL_TIE_MARGIN_CP;
  });
}

function scoreTrait(
  trait: PersonalityTrait,
  features: MoveFeatures,
  context: PositionContext,
  evalRank: number,
  candidateCount: number
): number {
  switch (trait) {
    case 'ansioso':
      if (context.moveNumber <= 10) {
        const normalizedRank = evalRank / Math.max(candidateCount - 1, 1);
        return normalizedRank * 8;
      }
      return 0;

    case 'cabeca-quente':
      if (context.isBotLosing && features.isKingAttack) return 12;
      if (context.isBotLosing && features.isCapture) return 6;
      return 0;

    case 'experiente':
      if (context.pieceCount <= 12) {
        return (candidateCount - evalRank) * 10;
      }
      return 0;

    case 'medroso':
      if (context.isBalanced && features.isEquivalentExchange) return 10;
      if (context.isBalanced && features.isQuiet) return 4;
      if (context.isBalanced && features.isSpeculativeSacrifice) return -8;
      return 0;

    case 'artista':
      if (features.isSpeculativeSacrifice) return 12;
      if (features.isKingAttack && !features.isCapture) return 5;
      return 0;

    case 'calmo':
      if (features.isQuiet) return 2;
      return 0;

    case 'estrategico':
      if (features.isPawnMove && features.isQuiet) return 6;
      if (features.isQuiet && !features.isCapture) return 4;
      if (features.isSpeculativeSacrifice) return -4;
      return 0;

    case 'tatico':
      if (features.isKingAttack) return 8;
      if (features.isCheck) return 6;
      if (features.isCapture) return 3;
      return 0;

    default:
      return 0;
  }
}

export function scoreCandidate(
  traits: PersonalityTrait[],
  features: MoveFeatures,
  context: PositionContext,
  evalRank: number,
  candidateCount: number
): number {
  if (traits.includes('experiente') && context.pieceCount <= 12) {
    return scoreTrait('experiente', features, context, evalRank, candidateCount);
  }

  return traits.reduce(
    (total, trait) => total + scoreTrait(trait, features, context, evalRank, candidateCount),
    0
  );
}

export function selectPersonalityCandidate(
  candidates: ScoredCandidate[],
  isBlack: boolean
): ScoredCandidate {
  const sorted = [...candidates].sort((a, b) => {
    if (b.personalityScore !== a.personalityScore) {
      return b.personalityScore - a.personalityScore;
    }
    return isBlack ? a.evaluationCp - b.evaluationCp : b.evaluationCp - a.evaluationCp;
  });

  const topScore = sorted[0].personalityScore;
  const tied = sorted.filter((c) => c.personalityScore === topScore);
  return tied[Math.floor(Math.random() * tied.length)];
}
