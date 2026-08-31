import { Puzzle } from '../types';

export type PuzzleDifficulty = 'all' | 'beginner' | 'easy' | 'medium' | 'hard' | 'expert';

export interface DifficultyOption {
  id: PuzzleDifficulty;
  label: string;
  sublabel: string;
  ratingRange: string;
  min?: number;
  max?: number;
}

export const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { id: 'all', label: 'Todas', sublabel: 'Qualquer nível', ratingRange: 'Todos' },
  { id: 'beginner', label: 'Iniciante', sublabel: 'Conceitos básicos', ratingRange: '< 1200', max: 1200 },
  { id: 'easy', label: 'Fácil', sublabel: 'Táticas simples', ratingRange: '1200 - 1500', min: 1200, max: 1500 },
  { id: 'medium', label: 'Médio', sublabel: 'Sequências de cálculo', ratingRange: '1500 - 1800', min: 1500, max: 1800 },
  { id: 'hard', label: 'Difícil', sublabel: 'Visão aprofundada', ratingRange: '1800 - 2200', min: 1800, max: 2200 },
  { id: 'expert', label: 'Expert', sublabel: 'Desafios de mestre', ratingRange: '2200+', min: 2200 },
];

export const THEME_TRANSLATIONS: Record<string, string> = {
  crushing: 'Esmagamento',
  fork: 'Garfo / Ataque Duplo',
  pin: 'Cravação',
  skewer: 'Espeto',
  discoveredAttack: 'Ataque Descoberto',
  doubleCheck: 'Xeque Duplo',
  attraction: 'Atração',
  deflection: 'Desvio',
  clearance: 'Liberação de Casa',
  interference: 'Interferência',
  trappedPiece: 'Peça Encurralada',
  sacrifice: 'Sacrifício',
  hangingPiece: 'Peça Indefesa',
  mate: 'Xeque-mate',
  mateIn1: 'Mate em 1',
  mateIn2: 'Mate em 2',
  mateIn3: 'Mate em 3',
  mateIn4: 'Mate em 4',
  mateIn5: 'Mate em 5',
  smotheredMate: 'Mate Sufocado',
  backRankMate: 'Mate do Corredor',
  anastasiaMate: 'Mate de Anastácia',
  arabianMate: 'Mate Árabe',
  bodenMate: 'Mate de Boden',
  dovetailMate: 'Mate Cauda de Pomba',
  hookMate: 'Mate Gancho',
  endgame: 'Final de Jogo',
  middlegame: 'Meio-jogo',
  opening: 'Abertura',
  short: 'Curto (1-2 lances)',
  long: 'Longo (3-4 lances)',
  veryLong: 'Muito Longo (5+ lances)',
  oneMove: '1 Lance',
  advantage: 'Vantagem Material',
  equality: 'Igualdade',
  defensiveMove: 'Lance Defensivo',
  kingsideAttack: 'Ataque na Ala do Rei',
  queensideAttack: 'Ataque na Ala da Dama',
  advancedPawn: 'Peão Avançado',
  promotion: 'Promoção',
  underPromotion: 'Subpromoção',
  quietMove: 'Lance Silencioso',
  zugzwang: 'Zugzwang',
  pawnEndgame: 'Final de Peões',
  knightEndgame: 'Final de Cavalos',
  bishopEndgame: 'Final de Bispos',
  rookEndgame: 'Final de Torres',
  queenEndgame: 'Final de Damas',
  queenRookEndgame: 'Final Dama + Torre',
  master: 'Partida de Mestres',
  masterVsMaster: 'Mestre vs Mestre',
  superGM: 'Super GM',
};

/**
 * Returns human-readable translated label for a theme code.
 */
export function getThemeLabel(theme: string): string {
  if (THEME_TRANSLATIONS[theme]) {
    return THEME_TRANSLATIONS[theme];
  }
  // Fallback: format camelCase or snake_case
  return theme
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export interface ThemeStat {
  theme: string;
  label: string;
  count: number;
}

/**
 * Extracts unique themes sorted by frequency with labels.
 */
export function extractUniqueThemes(puzzles: Puzzle[]): ThemeStat[] {
  const counts = new Map<string, number>();

  puzzles.forEach((p) => {
    if (Array.isArray(p.themes)) {
      p.themes.forEach((theme) => {
        counts.set(theme, (counts.get(theme) || 0) + 1);
      });
    }
  });

  return Array.from(counts.entries())
    .map(([theme, count]) => ({
      theme,
      label: getThemeLabel(theme),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Checks whether a puzzle satisfies the given difficulty rating range.
 */
export function matchesDifficulty(puzzle: Puzzle, difficulty: PuzzleDifficulty): boolean {
  if (difficulty === 'all') return true;

  const opt = DIFFICULTY_OPTIONS.find((d) => d.id === difficulty);
  if (!opt) return true;

  if (opt.min !== undefined && puzzle.rating < opt.min) return false;
  if (opt.max !== undefined && puzzle.rating >= opt.max) return false;

  return true;
}

/**
 * Checks whether a puzzle has any intersection with the selected themes.
 * If selectedThemes is empty, matches any theme.
 */
export function matchesThemes(puzzle: Puzzle, selectedThemes: string[]): boolean {
  if (selectedThemes.length === 0) return true;
  if (!puzzle.themes || puzzle.themes.length === 0) return false;

  return puzzle.themes.some((t) => selectedThemes.includes(t));
}

/**
 * Filters the puzzle array by difficulty and theme intersection.
 */
export function filterPuzzles(
  puzzles: Puzzle[],
  difficulty: PuzzleDifficulty,
  selectedThemes: string[]
): Puzzle[] {
  return puzzles.filter(
    (p) => matchesDifficulty(p, difficulty) && matchesThemes(p, selectedThemes)
  );
}

/**
 * Fisher-Yates shuffle to randomize puzzle order in memory.
 */
export function shufflePuzzles<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
