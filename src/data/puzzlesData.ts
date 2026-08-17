import { Puzzle } from '../types';
import puzzlesJson from './puzzles.json';

export const PUZZLES_LIST: Puzzle[] = puzzlesJson as Puzzle[];

// Helper function to get a daily puzzle based on date
export const getDailyPuzzle = (): Puzzle => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = dayOfYear % PUZZLES_LIST.length;
  return PUZZLES_LIST[index];
};

// Helper function to get formatted today's date
export const getFormattedTodayDate = (): string => {
  const today = new Date();
  return today.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};
