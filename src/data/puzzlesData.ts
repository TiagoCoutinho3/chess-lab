import { DailyPuzzleData, Puzzle } from '../types';
import puzzlesJson from './puzzles.json';
import dailyPuzzleJson from './dailyPuzzle.json';

export const PUZZLES_LIST: Puzzle[] = puzzlesJson as Puzzle[];
const dailyPuzzleData = dailyPuzzleJson as DailyPuzzleData;

export const getDailyPuzzle = (): Puzzle => {
  return dailyPuzzleData.current.puzzle;
};

// Helper function to get formatted today's date
export const getFormattedTodayDate = (): string => {
  const today = new Date();
  return today.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};
