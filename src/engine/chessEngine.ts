import { Chess, Move, Square } from 'chess.js';
import { MoveAnalysis, MoveQuality } from '../types';

// Piece value mapping in centipawns
const PIECE_VALUES: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece Square Tables (White's perspective; flipped for Black)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20
];

const ROOK_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  5, 10, 10, 10, 10, 10, 10,  5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
 -5,  0,  0,  0,  0,  0,  0, -5,
  0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_TABLE_MIDDLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

function getSquareIndex(square: string): number {
  const file = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const rank = 8 - parseInt(square[1]);
  return rank * 8 + file;
}

/**
 * Static evaluation of a board position from White's perspective (+ means White is better)
 */
export function evaluateBoard(chess: Chess): number {
  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      return chess.turn() === 'w' ? -100000 : 100000;
    }
    return 0; // Draw (stalemate, repetition, 50-move, insufficient material)
  }

  let totalScore = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const squareIndex = r * 8 + c;
      const flippedIndex = (7 - r) * 8 + c;
      const isWhite = piece.color === 'w';

      let pieceVal = PIECE_VALUES[piece.type] || 0;
      let positionalBonus = 0;

      switch (piece.type) {
        case 'p':
          positionalBonus = isWhite ? PAWN_TABLE[squareIndex] : PAWN_TABLE[flippedIndex];
          break;
        case 'n':
          positionalBonus = isWhite ? KNIGHT_TABLE[squareIndex] : KNIGHT_TABLE[flippedIndex];
          break;
        case 'b':
          positionalBonus = isWhite ? BISHOP_TABLE[squareIndex] : BISHOP_TABLE[flippedIndex];
          break;
        case 'r':
          positionalBonus = isWhite ? ROOK_TABLE[squareIndex] : ROOK_TABLE[flippedIndex];
          break;
        case 'q':
          positionalBonus = isWhite ? QUEEN_TABLE[squareIndex] : QUEEN_TABLE[flippedIndex];
          break;
        case 'k':
          positionalBonus = isWhite ? KING_TABLE_MIDDLE[squareIndex] : KING_TABLE_MIDDLE[flippedIndex];
          break;
      }

      const val = pieceVal + positionalBonus;
      totalScore += isWhite ? val : -val;
    }
  }

  // Small bonus for mobility
  const legalMoves = chess.moves().length;
  totalScore += chess.turn() === 'w' ? legalMoves * 2 : -legalMoves * 2;

  return totalScore;
}

/**
 * Quiescence search to handle captures and quiet positions
 */
function quiescence(chess: Chess, alpha: number, beta: number, isMaximizing: boolean, depth = 2): number {
  const standPat = evaluateBoard(chess);
  if (depth === 0) return standPat;

  if (isMaximizing) {
    if (standPat >= beta) return beta;
    if (alpha < standPat) alpha = standPat;

    const moves = chess.moves({ verbose: true }).filter(m => m.captured);
    for (const move of moves) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, false, depth - 1);
      chess.undo();

      if (score >= beta) return beta;
      if (score > alpha) alpha = score;
    }
    return alpha;
  } else {
    if (standPat <= alpha) return alpha;
    if (beta > standPat) beta = standPat;

    const moves = chess.moves({ verbose: true }).filter(m => m.captured);
    for (const move of moves) {
      chess.move(move);
      const score = quiescence(chess, alpha, beta, true, depth - 1);
      chess.undo();

      if (score <= alpha) return alpha;
      if (score < beta) beta = score;
    }
    return beta;
  }
}

/**
 * Minimax with Alpha-Beta pruning
 */
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): { score: number; bestMove?: Move } {
  if (depth === 0 || chess.isGameOver()) {
    return { score: quiescence(chess, alpha, beta, isMaximizing) };
  }

  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) {
    return { score: evaluateBoard(chess) };
  }

  // Move ordering: sort captures and checks first
  moves.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (a.captured) scoreA += (PIECE_VALUES[a.captured] || 0) * 10 - (PIECE_VALUES[a.piece] || 0);
    if (b.captured) scoreB += (PIECE_VALUES[b.captured] || 0) * 10 - (PIECE_VALUES[b.piece] || 0);
    if (a.san.includes('+')) scoreA += 50;
    if (b.san.includes('+')) scoreB += 50;
    return scoreB - scoreA;
  });

  let bestMove: Move = moves[0];

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const { score } = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();

      if (score > maxEval) {
        maxEval = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return { score: maxEval, bestMove };
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const { score } = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();

      if (score < minEval) {
        minEval = score;
        bestMove = move;
      }
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return { score: minEval, bestMove };
  }
}

/**
 * Generates natural language pedagogical explanation in Portuguese for why a move is good
 */
export function generateMoveExplanation(move: Move, chess: Chess): string {
  const isWhite = move.color === 'w';
  const san = move.san;

  // Checkmate
  if (san.includes('#')) {
    return 'Lance definitivo de xeque-mate! Encerra a partida com uma vitória brilhante.';
  }

  // Castling
  if (san === 'O-O' || san === 'O-O-O') {
    return 'Protege o rei com segurança através do roque e ativa a torre na coluna central.';
  }

  // Check
  if (san.includes('+')) {
    return 'Aplica um xeque direto forçando o rei adversário a se mover e perder a coordenação.';
  }

  // Queen capture
  if (move.captured === 'q') {
    return 'Captura a peça mais poderosa do adversário, estabelecendo vantagem material decisiva.';
  }

  // Piece capture
  if (move.captured) {
    const pieceNames: Record<string, string> = {
      p: 'um peão',
      n: 'um cavalo',
      b: 'um bispo',
      r: 'uma torre',
      q: 'a dama',
    };
    const capturedName = pieceNames[move.captured] || 'uma peça';
    if (['d4', 'd5', 'e4', 'e5'].includes(move.to)) {
      return `Essa jogada captura ${capturedName} central e desenvolve sua peça com vantagem.`;
    }
    return `Captura ${capturedName} adversário, ganhando material e simplificando a posição.`;
  }

  // Pawn center advance
  if (move.piece === 'p') {
    if (['e4', 'd4', 'e5', 'd5', 'c4', 'c5'].includes(move.to)) {
      return 'Ocupa e controla as casas centrais mais importantes, abrindo linhas para suas peças menores.';
    }
    if (['e3', 'd3', 'e6', 'd6', 'c3', 'c6'].includes(move.to)) {
      return 'Estrutura sólida de peões que sustenta o centro e abre diagonais para desenvolvimento.';
    }
  }

  // Knight development
  if (move.piece === 'n') {
    if (['f3', 'c3', 'f6', 'c6'].includes(move.to)) {
      return 'Desenvolve o cavalo em direção ao centro, controlando casas-chave e preparando o roque.';
    }
    if (['d5', 'e5', 'd4', 'e4'].includes(move.to)) {
      return 'Instala um posto avançado de cavalo no coração da posição inimiga.';
    }
  }

  // Bishop development
  if (move.piece === 'b') {
    if (['c4', 'b5', 'c5', 'b4', 'g5', 'g4'].includes(move.to)) {
      return 'Ativa o bispo numa diagonal ativa, cravando ou pressionando peças adversárias importantes.';
    }
    if (['e2', 'd2', 'e7', 'd7'].includes(move.to)) {
      return 'Desenvolvimento cauteloso que completa a ligação entre as peças e protege o rei.';
    }
  }

  // Rook to open file
  if (move.piece === 'r') {
    return 'Posiciona a torre na coluna central/aberta para dominar as linhas de invasão.';
  }

  // Queen maneuver
  if (move.piece === 'q') {
    return 'Ativa a dama coordenando ameaças múltiplas e mantendo alta pressão sobre o oponente.';
  }

  return 'Desenvolve e harmoniza as peças no tabuleiro, melhorando o controle espacial.';
}

/**
 * Finds the best move and calculates evaluation
 */
export function findBestMove(
  chess: Chess,
  searchDepth = 3
): { bestMove: Move | null; score: number; evaluationFormatted: string } {
  const isWhite = chess.turn() === 'w';
  const { score, bestMove } = minimax(chess, searchDepth, -Infinity, Infinity, isWhite);

  const evalInPawns = score / 100;
  const formattedScore = evalInPawns >= 0 ? `+${evalInPawns.toFixed(2)}` : `${evalInPawns.toFixed(2)}`;

  return {
    bestMove: bestMove || null,
    score,
    evaluationFormatted: formattedScore,
  };
}

/**
 * Selects a move for a bot based on skill level and blunder rate
 */
export function getBotMove(
  chess: Chess,
  skillLevel: number, // 1 to 20
  blunderRate: number,
  depth: number
): { move: Move; evaluationFormatted: string } {
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) {
    throw new Error('No legal moves available');
  }

  // If bot is lower level and triggers blunder rate, pick a slightly weaker legal move
  const shouldBlunder = Math.random() < blunderRate;

  if (shouldBlunder && legalMoves.length > 1) {
    // Pick a non-blunder checkmate if possible, else random legal move
    const candidateMoves = legalMoves.filter(m => !m.san.includes('#'));
    const chosen = candidateMoves.length > 0
      ? candidateMoves[Math.floor(Math.random() * candidateMoves.length)]
      : legalMoves[Math.floor(Math.random() * legalMoves.length)];

    const currentScore = evaluateBoard(chess) / 100;
    const formatted = currentScore >= 0 ? `+${currentScore.toFixed(2)}` : `${currentScore.toFixed(2)}`;
    return { move: chosen, evaluationFormatted: formatted };
  }

  const { bestMove, score } = findBestMove(chess, Math.max(1, depth));
  const chosenMove = bestMove || legalMoves[0];
  const evalInPawns = score / 100;
  const formatted = evalInPawns >= 0 ? `+${evalInPawns.toFixed(2)}` : `${evalInPawns.toFixed(2)}`;

  return { move: chosenMove, evaluationFormatted: formatted };
}

/**
 * Analyzes a played move and returns its quality and pedagogy explanation
 */
export function analyzeMove(
  fenBefore: string,
  playedMoveSan: string
): MoveAnalysis {
  const chess = new Chess(fenBefore);
  const evalBefore = evaluateBoard(chess);
  const isWhite = chess.turn() === 'w';

  // Find the theoretical best move from this position
  const { bestMove, score: evalBest } = findBestMove(chess, 3);
  
  // Make the played move
  const moveResult = chess.move(playedMoveSan);
  const evalAfter = evaluateBoard(chess);

  const bestMoveSan = bestMove ? bestMove.san : playedMoveSan;
  const bestMoveFrom = bestMove ? bestMove.from : '';
  const bestMoveTo = bestMove ? bestMove.to : '';

  // Calculate loss in centipawns
  let centipawnLoss = 0;
  if (isWhite) {
    centipawnLoss = evalBest - evalAfter;
  } else {
    centipawnLoss = evalAfter - evalBest;
  }

  let quality: MoveQuality = 'good';

  if (playedMoveSan === bestMoveSan || centipawnLoss <= 15) {
    // Check if brilliant (great piece sacrifice leading to victory)
    if (moveResult && moveResult.captured && ['q', 'r', 'b', 'n'].includes(moveResult.captured) && Math.abs(evalAfter) > 200) {
      quality = 'brilliant';
    } else {
      quality = 'best';
    }
  } else if (centipawnLoss <= 45) {
    quality = 'good';
  } else if (centipawnLoss <= 110) {
    quality = 'inaccuracy';
  } else if (centipawnLoss <= 250) {
    quality = 'mistake';
  } else {
    quality = 'blunder';
  }

  let explanation = '';
  if (moveResult) {
    explanation = generateMoveExplanation(moveResult, chess);
  } else {
    explanation = 'Movimento tático no tabuleiro.';
  }

  return {
    san: playedMoveSan,
    from: moveResult ? moveResult.from : '',
    to: moveResult ? moveResult.to : '',
    quality,
    evaluationBefore: evalBefore,
    evaluationAfter: evalAfter,
    bestMoveSan,
    bestMoveFrom,
    bestMoveTo,
    explanation,
  };
}
