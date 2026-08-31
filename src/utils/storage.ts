import { PlayedGame, UserStats } from '../types';

const GAMES_KEY = 'chesslab_played_games';
const STATS_KEY = 'chesslab_user_stats';

const DEFAULT_STATS: UserStats = {
  gamesPlayed: 14,
  wins: 9,
  losses: 4,
  draws: 1,
  puzzlesSolved: 28,
  puzzleStreak: 4,
  lastPuzzleDate: '2026-08-15',
  favoriteOpening: 'Defesa Siciliana (B20)',
  ratingEstimate: 1420,
};

const SAMPLE_INITIAL_GAMES: PlayedGame[] = [
  {
    id: 'game-sample-1',
    date: '15/08/2026',
    botId: 'bytemaster',
    botName: 'ByteMaster',
    botLevel: 12,
    botAvatarSeed: 'ByteMasterAI',
    playerColor: 'w',
    result: '1-0',
    resultReason: 'Xeque-mate',
    movesCount: 28,
    openingName: 'Defesa Siciliana (B20)',
    ecoCode: 'B20',
    pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e5 7. Nb3 Be6 8. Qd2 Nbd7 9. O-O-O Be7 10. f3 b5 11. g4 b4 12. Nd5 Bxd5 13. exd5 Nb6 14. Qxb4',
    moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be3', 'e5', 'Nb3', 'Be6', 'Qd2', 'Nbd7', 'O-O-O', 'Be7', 'f3', 'b5', 'g4', 'b4', 'Nd5', 'Bxd5', 'exd5', 'Nb6', 'Qxb4'],
    playerAccuracy: 88,
  },
  {
    id: 'game-sample-2',
    date: '14/08/2026',
    botId: 'spark',
    botName: 'Spark',
    botLevel: 6,
    botAvatarSeed: 'SparkBot',
    playerColor: 'w',
    result: '1-0',
    resultReason: 'Desistência do Bot',
    movesCount: 21,
    openingName: 'Abertura Italiana (C50)',
    ecoCode: 'C50',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. c3 Nf6 5. d3 d6 6. O-O O-O 7. Bg5 h6 8. Bh4 Bg4 9. Nbd2 g5 10. Bg3 Nh5 11. Re1',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'O-O', 'Bg5', 'h6', 'Bh4', 'Bg4', 'Nbd2', 'g5', 'Bg3', 'Nh5', 'Re1'],
    playerAccuracy: 92,
  },
  {
    id: 'game-sample-3',
    date: '12/08/2026',
    botId: 'nova',
    botName: 'Nova',
    botLevel: 9,
    botAvatarSeed: 'NovaVoxel',
    playerColor: 'b',
    result: '0-1',
    resultReason: 'Ataque na Ala do Rei',
    movesCount: 34,
    openingName: 'Gambito da Dama (D06)',
    ecoCode: 'D06',
    pgn: '1. d4 d5 2. c4 e6 3. Nc3 Nf6 4. Bg5 Be7 5. e3 O-O 6. Nf3 Nbd7 7. Rc1 c6 8. Bd3 dxc4 9. Bxc4 Nd5',
    moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e3', 'O-O', 'Nf3', 'Nbd7', 'Rc1', 'c6', 'Bd3', 'dxc4', 'Bxc4', 'Nd5'],
    playerAccuracy: 76,
  },
];

export function getStoredGames(): PlayedGame[] {
  try {
    const raw = localStorage.getItem(GAMES_KEY);
    if (!raw) {
      localStorage.setItem(GAMES_KEY, JSON.stringify(SAMPLE_INITIAL_GAMES));
      return SAMPLE_INITIAL_GAMES;
    }
    return JSON.parse(raw);
  } catch {
    return SAMPLE_INITIAL_GAMES;
  }
}

export function savePlayedGame(game: PlayedGame) {
  try {
    const current = getStoredGames();
    const updated = [game, ...current];
    localStorage.setItem(GAMES_KEY, JSON.stringify(updated));

    // Update user stats
    const stats = getUserStats();
    stats.gamesPlayed += 1;
    if (game.result === '1-0' && game.playerColor === 'w' || game.result === '0-1' && game.playerColor === 'b') {
      stats.wins += 1;
    } else if (game.result === '1/2-1/2') {
      stats.draws += 1;
    } else {
      stats.losses += 1;
    }
    if (game.openingName) {
      stats.favoriteOpening = game.openingName;
    }
    saveUserStats(stats);
  } catch (err) {
    console.error('Failed to save game', err);
  }
}

export function getUserStats(): UserStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
      return DEFAULT_STATS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveUserStats(stats: UserStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats', err);
  }
}

export function incrementPuzzleSolved(isCorrect: boolean) {
  const stats = getUserStats();
  if (isCorrect) {
    stats.puzzlesSolved += 1;
    stats.puzzleStreak += 1;
    stats.ratingEstimate += 12;
  } else {
    stats.puzzleStreak = 0;
    stats.ratingEstimate = Math.max(800, stats.ratingEstimate - 8);
  }
  saveUserStats(stats);
}

const USER_AVATAR_KEY = 'chesslab_user_avatar';
export const USER_AVATAR_UPDATED_EVENT = 'chesslab:avatar-updated';

export function getUserAvatarOptions(): import('../types/avatar').VoxelAvatarOptions {
  try {
    const raw = localStorage.getItem(USER_AVATAR_KEY);
    if (!raw) {
      return {
        topVariant: 'spiky',
        topProbability: 100,
        outfitVariant: 'hoodie',
        eyesVariant: 'open',
        mouthVariant: 'smile',
        eyebrowsVariant: 'flat',
        eyebrowsProbability: 100,
        noseVariant: 'block',
        beardVariant: 'none',
        beardProbability: 0,
        glassesVariant: 'none',
        glassesProbability: 0,
        cheeksVariant: 'none',
        cheeksProbability: 0,
        animationVariant: 'none',
        skinColor: 'f5d0b0',
        hairColor: '2c222b',
        shirtColor: '228be6',
        jacketColor: '3b5b8c',
        hatColor: '8d95d6',
        pantsColor: '3b5b8c',
        shoesColor: 'f1f3f5',
        backgroundColor: ['8aa7e1'],
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      topVariant: 'spiky',
      topProbability: 100,
      outfitVariant: 'hoodie',
      eyesVariant: 'open',
      mouthVariant: 'smile',
      eyebrowsVariant: 'flat',
      eyebrowsProbability: 100,
      noseVariant: 'block',
      beardVariant: 'none',
      beardProbability: 0,
      glassesVariant: 'none',
      glassesProbability: 0,
      cheeksVariant: 'none',
      cheeksProbability: 0,
      animationVariant: 'none',
      skinColor: 'f5d0b0',
      hairColor: '2c222b',
      shirtColor: '228be6',
      jacketColor: '3b5b8c',
      hatColor: '8d95d6',
      pantsColor: '3b5b8c',
      shoesColor: 'f1f3f5',
      backgroundColor: ['8aa7e1'],
    };
  }
}

export function saveUserAvatarOptions(options: import('../types/avatar').VoxelAvatarOptions) {
  try {
    localStorage.setItem(USER_AVATAR_KEY, JSON.stringify(options));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(USER_AVATAR_UPDATED_EVENT, { detail: options }));
    }
  } catch (err) {
    console.error('Failed to save avatar options', err);
  }
}

