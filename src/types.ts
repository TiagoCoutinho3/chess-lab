export type BotPersonality =
  | 'Agressivo'
  | 'Estratégico'
  | 'Calmo'
  | 'Criativo'
  | 'Defensivo'
  | 'Tático';

export type PersonalityTrait =
  | 'ansioso'
  | 'cabeca-quente'
  | 'experiente'
  | 'medroso'
  | 'artista'
  | 'calmo'
  | 'estrategico'
  | 'tatico';

export const TRAIT_LABELS: Record<PersonalityTrait, string> = {
  ansioso: 'Ansioso',
  'cabeca-quente': 'Cabeça-quente',
  experiente: 'Experiente',
  medroso: 'Medroso',
  artista: 'Artista',
  calmo: 'Calmo',
  estrategico: 'Estratégico',
  tatico: 'Tático',
};

export interface Bot {
  id: string;
  name: string;
  avatarSeed: string;
  avatarStyle: 'voxel-art' | 'voxel-bot';
  level: number; // 1 to 20
  rating: number;
  personality: BotPersonality;
  traits: PersonalityTrait[];
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
  eco: string;
  name: string;
  pgn: string;
}

export interface Puzzle {
  fen: string;
  moves: string[];
  rating: number;
  themes: string[];
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
