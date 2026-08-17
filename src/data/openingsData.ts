import { Opening } from '../types';
import openingsJson from './openings.json';

export const OPENINGS_DATABASE: Opening[] = openingsJson as Opening[];

// Helper function to convert move array to numbered PGN format
const movesToNumberedPgn = (moves: string[]): string => {
  if (moves.length === 0) return '';
  
  let pgn = '';
  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    pgn += `${moveNumber}. ${moves[i]}`;
    if (i + 1 < moves.length) {
      pgn += ` ${moves[i + 1]}`;
    }
    if (i + 2 < moves.length) {
      pgn += ' ';
    }
  }
  return pgn;
};

// Helper function to find matching opening based on current moves (EXACT match)
export const findMatchingOpening = (moves: string[]): Opening | null => {
  if (moves.length === 0) return null;
  
  // Convert current moves to numbered PGN format (e.g., "1. e4 e5 2. Nf3 Nc6")
  const currentPgn = movesToNumberedPgn(moves);
  
  // Find opening with EXACT PGN match
  const exactMatch = OPENINGS_DATABASE.find(opening => opening.pgn === currentPgn);
  
  return exactMatch || null;
};
