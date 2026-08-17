import { Chess, Move } from 'chess.js';

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
};

export interface MoveFeatures {
  isCapture: boolean;
  isEquivalentExchange: boolean;
  isCheck: boolean;
  isKingAttack: boolean;
  isSpeculativeSacrifice: boolean;
  isOpening: boolean;
  isEndgame: boolean;
  isQuiet: boolean;
  isPawnMove: boolean;
}

export interface PositionContext {
  moveNumber: number;
  pieceCount: number;
  botEvalCp: number;
  isBotWinning: boolean;
  isBotLosing: boolean;
  isBalanced: boolean;
}

export function countPieces(chess: Chess): number {
  let count = 0;
  chess.board().forEach((row) => {
    row.forEach((piece) => {
      if (piece && piece.type !== 'k') count++;
    });
  });
  return count;
}

export function getPositionContext(
  chess: Chess,
  moveNumber: number,
  positionEvalCp: number,
  botColor: 'w' | 'b'
): PositionContext {
  const botEvalCp = botColor === 'w' ? positionEvalCp : -positionEvalCp;

  return {
    moveNumber,
    pieceCount: countPieces(chess),
    botEvalCp,
    isBotWinning: botEvalCp > 80,
    isBotLosing: botEvalCp < -80,
    isBalanced: Math.abs(botEvalCp) <= 40,
  };
}

function attacksKing(chess: Chess, move: Move): boolean {
  const testChess = new Chess(chess.fen());
  testChess.move({ from: move.from, to: move.to, promotion: move.promotion });
  const enemyColor = move.color === 'w' ? 'b' : 'w';
  return testChess.turn() === enemyColor && testChess.inCheck();
}

function isEquivalentExchange(chess: Chess, move: Move): boolean {
  if (!move.captured) return false;

  const movingValue = PIECE_VALUES[move.piece] ?? 0;
  const capturedValue = PIECE_VALUES[move.captured] ?? 0;
  if (movingValue === 0) return false;

  const testChess = new Chess(chess.fen());
  testChess.move({ from: move.from, to: move.to, promotion: move.promotion });

  const recaptures = testChess
    .moves({ verbose: true })
    .filter((m) => m.to === move.to && m.captured);

  if (recaptures.length === 0) {
    return movingValue <= capturedValue;
  }

  const bestRecaptureValue = Math.min(
    ...recaptures.map((m) => PIECE_VALUES[m.piece] ?? 99)
  );

  return Math.abs(movingValue - capturedValue) <= 1 && bestRecaptureValue <= capturedValue + 1;
}

function isSpeculativeSacrifice(chess: Chess, move: Move): boolean {
  if (!move.captured) {
    const movingValue = PIECE_VALUES[move.piece] ?? 0;
    if (movingValue <= 1) return false;

    const testChess = new Chess(chess.fen());
    const result = testChess.move({ from: move.from, to: move.to, promotion: move.promotion });
    if (!result) return false;

    const recaptures = testChess.moves({ verbose: true }).filter((m) => m.to === move.to);
    return recaptures.length === 0 && movingValue >= 3;
  }

  const movingValue = PIECE_VALUES[move.piece] ?? 0;
  const capturedValue = PIECE_VALUES[move.captured] ?? 0;
  return movingValue > capturedValue + 1;
}

export function analyzeMoveFeatures(
  chess: Chess,
  uciMove: string,
  moveNumber: number
): MoveFeatures | null {
  const from = uciMove.substring(0, 2);
  const to = uciMove.substring(2, 4);
  const promotion = uciMove.length > 4 ? uciMove[4] : undefined;

  const testChess = new Chess(chess.fen());
  const move = testChess.move({ from, to, promotion });
  if (!move) return null;
  testChess.undo();

  const pieceCount = countPieces(chess);
  const isCheck = move.san.includes('+') || move.san.includes('#');

  return {
    isCapture: Boolean(move.captured),
    isEquivalentExchange: isEquivalentExchange(chess, move),
    isCheck,
    isKingAttack: isCheck || attacksKing(chess, move),
    isSpeculativeSacrifice: isSpeculativeSacrifice(chess, move),
    isOpening: moveNumber <= 10,
    isEndgame: pieceCount <= 12,
    isQuiet: !move.captured && !isCheck,
    isPawnMove: move.piece === 'p',
  };
}

export function uciToMove(chess: Chess, uciMove: string): Move | null {
  const from = uciMove.substring(0, 2);
  const to = uciMove.substring(2, 4);
  const promotion = uciMove.length > 4 ? uciMove[4] : undefined;

  const result = chess.move({ from, to, promotion });
  if (result) chess.undo();
  return result;
}
