export type BotPersonality =
  | 'Agressivo'
  | 'Estratégico'
  | 'Calmo'
  | 'Criativo'
  | 'Defensivo'
  | 'Tático';

export interface Bot {
  id: string;
  name: string;
  avatarSeed: string;
  avatarStyle?: 'voxel-art' | 'voxel-bot';
  level: number; // 1 to 20
  rating: number;
  personality: BotPersonality;
  personalityTagColor: {
    bg: string;
    text: string;
    border: string;
  };
  boardColors?: {
    light: string;
    dark: string;
  };
  description: string;
  quote: string;
  openings: string[];
  blunderRate: number; // 0 to 1
  searchDepth: number;
}

export type MoveQuality =
  | 'brilliant'
  | 'best'
  | 'good'
  | 'inaccuracy'
  | 'mistake'
  | 'blunder'
  | 'book';

export interface MoveAnalysis {
  san: string;
  from: string;
  to: string;
  quality: MoveQuality;
  evaluationBefore: number; // in centipawns
  evaluationAfter: number; // in centipawns
  bestMoveSan?: string;
  bestMoveFrom?: string;
  bestMoveTo?: string;
  explanation: string;
}

export interface GameMoveRecord {
  moveNumber: number;
  white: {
    san: string;
    from: string;
    to: string;
    analysis?: MoveAnalysis;
  };
  black?: {
    san: string;
    from: string;
    to: string;
    analysis?: MoveAnalysis;
  };
}

export interface PlayedGame {
  id: string;
  date: string;
  botId: string;
  botName: string;
  botLevel: number;
  botAvatarSeed: string;
  playerColor: 'w' | 'b';
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  resultReason: string; // 'Xeque-mate', 'Desistência', 'Afogamento', 'Tempo esgotado', etc.
  movesCount: number;
  openingName?: string;
  ecoCode?: string;
  pgn: string;
  moves: string[];
  playerAccuracy?: number;
}

export interface Opening {
  id: string;
  name: string;
  eco: string;
  moves: string[]; // e.g. ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"]
  movesSan: string[];
  fen: string;
  mainIdea: string;
  whitePlan: string;
  blackPlan: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  category: 'Abertas' | 'Semi-Abertas' | 'Fechadas' | 'Flanco';
  keyVariations?: { name: string; moves: string[] }[];
}

export interface Puzzle {
  id: string;
  title: string;
  theme: 'Mate em 1' | 'Mate em 2' | 'Garfo' | 'Cravada' | 'Ataque Descoberto' | 'Ganho de Material' | 'Fim de Jogo';
  rating: number;
  initialFen: string;
  turn: 'w' | 'b';
  moves: string[]; // UCI format e.g. ["e2e4", "e7e5"] or SAN format
  movesSan: string[];
  description: string;
  hint: string;
  solutionExplanation: string;
}

export interface UserStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  puzzlesSolved: number;
  puzzleStreak: number;
  lastPuzzleDate: string;
  favoriteOpening: string;
  ratingEstimate: number;
}

export type ViewTab = 'home' | 'play' | 'openings' | 'puzzles' | 'history';
