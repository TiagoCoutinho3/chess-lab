import { Bot } from '../types';
import { Chess } from 'chess.js';
import { countPieces } from './moveFeatures';

export function calculateBotThinkDelay(bot: Bot, chess: Chess, isBotLosing: boolean): number {
  const baseDelay = 300 + bot.level * 25;
  const legalMoves = chess.moves().length;
  const pieceCount = countPieces(chess);
  const complexityFactor = Math.min(1.4, 0.8 + legalMoves * 0.02 + (32 - pieceCount) * 0.01);

  let delay = baseDelay * complexityFactor;

  if (bot.traits.includes('ansioso')) {
    delay = Math.min(delay, 350 + bot.level * 8);
  }

  if (bot.traits.includes('experiente')) {
    delay = Math.max(delay, 400 + legalMoves * 15 + (32 - pieceCount) * 8);
  }

  if (bot.traits.includes('cabeca-quente') && isBotLosing) {
    delay *= 0.65;
  }

  if (bot.traits.includes('calmo')) {
    delay *= 1.1;
  }

  return Math.max(280, Math.min(1400, Math.round(delay)));
}
