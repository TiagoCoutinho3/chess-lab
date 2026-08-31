import { useState, useMemo, useCallback } from 'react';
import { Puzzle } from '../types';
import {
  PuzzleDifficulty,
  filterPuzzles,
  shufflePuzzles,
  extractUniqueThemes,
} from '../utils/puzzleFilter';

export type SessionState = 'filter_selection' | 'in_session' | 'session_completed';

export interface SessionStats {
  totalAttempted: number;
  solved: number;
  failed: number;
  currentStreak: number;
  bestStreak: number;
}

export interface UsePuzzleSessionOptions {
  allPuzzles: Puzzle[];
  initialDifficulty?: PuzzleDifficulty;
  initialThemes?: string[];
  sessionSizeLimit?: number; // Optional cap per session (e.g. 10 or 20, or unlimited)
}

export function usePuzzleSession({
  allPuzzles,
  initialDifficulty = 'all',
  initialThemes = [],
  sessionSizeLimit,
}: UsePuzzleSessionOptions) {
  const [sessionState, setSessionState] = useState<SessionState>('filter_selection');
  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>(initialDifficulty);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(initialThemes);
  const [queue, setQueue] = useState<Puzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stats, setStats] = useState<SessionStats>({
    totalAttempted: 0,
    solved: 0,
    failed: 0,
    currentStreak: 0,
    bestStreak: 0,
  });

  // Extract all unique themes from the puzzle dataset once
  const availableThemes = useMemo(() => {
    return extractUniqueThemes(allPuzzles);
  }, [allPuzzles]);

  // Pre-calculate matching count for the selection screen in real-time
  const matchingPuzzles = useMemo(() => {
    return filterPuzzles(allPuzzles, difficulty, selectedThemes);
  }, [allPuzzles, difficulty, selectedThemes]);

  const availableCount = matchingPuzzles.length;

  const currentPuzzle = useMemo<Puzzle | null>(() => {
    if (sessionState !== 'in_session' || queue.length === 0) return null;
    return queue[currentIndex] || null;
  }, [sessionState, queue, currentIndex]);

  // Toggle a single theme chip in selection
  const toggleTheme = useCallback((theme: string) => {
    setSelectedThemes((prev) => {
      if (prev.includes(theme)) {
        return prev.filter((t) => t !== theme);
      }
      return [...prev, theme];
    });
  }, []);

  const clearFilters = useCallback(() => {
    setDifficulty('all');
    setSelectedThemes([]);
  }, []);

  // Start training session with current (or override) filters
  const startSession = useCallback(
    (customDifficulty?: PuzzleDifficulty, customThemes?: string[]) => {
      const diff = customDifficulty ?? difficulty;
      const themes = customThemes ?? selectedThemes;

      const filtered = filterPuzzles(allPuzzles, diff, themes);
      if (filtered.length === 0) {
        return false;
      }

      let shuffled = shufflePuzzles(filtered);
      if (sessionSizeLimit && sessionSizeLimit > 0) {
        shuffled = shuffled.slice(0, sessionSizeLimit);
      }

      setQueue(shuffled);
      setCurrentIndex(0);
      setStats({
        totalAttempted: 0,
        solved: 0,
        failed: 0,
        currentStreak: 0,
        bestStreak: 0,
      });
      setSessionState('in_session');
      return true;
    },
    [allPuzzles, difficulty, selectedThemes, sessionSizeLimit]
  );

  // Advance to next puzzle in queue, or finish session if queue ended
  const nextPuzzle = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = prev + 1;
      if (next >= queue.length) {
        setSessionState('session_completed');
        return prev;
      }
      return next;
    });
  }, [queue.length]);

  // Record if current puzzle was solved or failed
  const recordResult = useCallback((isCorrect: boolean) => {
    setStats((prev) => {
      const newStreak = isCorrect ? prev.currentStreak + 1 : 0;
      const bestStreak = Math.max(prev.bestStreak, newStreak);
      return {
        totalAttempted: prev.totalAttempted + 1,
        solved: isCorrect ? prev.solved + 1 : prev.solved,
        failed: !isCorrect ? prev.failed + 1 : prev.failed,
        currentStreak: newStreak,
        bestStreak,
      };
    });
  }, []);

  // Restart session with identical filters and fresh shuffle
  const restartSession = useCallback(() => {
    startSession(difficulty, selectedThemes);
  }, [startSession, difficulty, selectedThemes]);

  // Return back to filter selection screen
  const returnToSelection = useCallback(() => {
    setSessionState('filter_selection');
  }, []);

  return {
    sessionState,
    difficulty,
    setDifficulty,
    selectedThemes,
    setSelectedThemes,
    toggleTheme,
    clearFilters,
    availableThemes,
    availableCount,
    matchingPuzzles,
    queue,
    currentIndex,
    totalInQueue: queue.length,
    currentPuzzle,
    stats,
    startSession,
    nextPuzzle,
    recordResult,
    restartSession,
    returnToSelection,
  };
}
