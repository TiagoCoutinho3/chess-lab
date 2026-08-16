import { Chess, Move } from 'chess.js';
import { MoveAnalysis, MoveQuality } from '../types';
import { getBestMoves } from './stockfishEngine';

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
 * Finds the best move and calculates evaluation using Stockfish
 */
export async function findBestMove(
  chess: Chess,
  searchDepth = 3
): Promise<{ bestMove: Move | null; score: number; evaluationFormatted: string }> {
  const bestMoves = await getBestMoves(chess.fen(), searchDepth, 1);
  
  if (bestMoves.length === 0) {
    return {
      bestMove: null,
      score: 0,
      evaluationFormatted: '0.00',
    };
  }

  const { move: uciMove, evaluationCp } = bestMoves[0];
  
  // Convert UCI move to chess.js Move
  const from = uciMove.substring(0, 2);
  const to = uciMove.substring(2, 4);
  const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
  
  const moveResult = chess.move({ from, to, promotion });
  chess.undo(); // Undo to restore board state

  const evalInPawns = evaluationCp / 100;
  const formattedScore = evalInPawns >= 0 ? `+${evalInPawns.toFixed(2)}` : `${evalInPawns.toFixed(2)}`;

  return {
    bestMove: moveResult || null,
    score: evaluationCp,
    evaluationFormatted: formattedScore,
  };
}

/**
 * Selects a move for a bot based on skill level and blunder rate using Stockfish MultiPV
 */
export async function getBotMove(
  chess: Chess,
  botName: string,
  skillLevel: number, // 1 to 20
  blunderRate: number,
  depth: number
): Promise<{ move: Move; evaluationFormatted: string }> {
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) {
    throw new Error('No legal moves available');
  }

  // Get multiple candidate moves using MultiPV
  const multiPvCount = 3;
  const bestMoves = await getBestMoves(chess.fen(), depth, multiPvCount);
  
  if (bestMoves.length === 0) {
    // Fallback to random legal move if Stockfish fails
    const chosen = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return { move: chosen, evaluationFormatted: '0.00' };
  }

  // Sort candidates by evaluation (best first)
  // evaluationCp is from White's perspective, so Black wants the LOWEST evaluation
  const isBlack = chess.turn() === 'b';
  const sortedCandidates = [...bestMoves].sort((a, b) => 
    isBlack ? a.evaluationCp - b.evaluationCp : b.evaluationCp - a.evaluationCp
  );
  
  // Determine if bot should blunder
  const shouldBlunder = Math.random() < blunderRate;
  
  // Diagnostic logging
  console.log(`[Bot Move] ${botName} | skillLevel: ${skillLevel}, blunderRate: ${blunderRate}, depth: ${depth}`);
  console.log(`[Bot Move] Candidates:`, sortedCandidates.map(c => `${c.move} (${(c.evaluationCp / 100).toFixed(2)})`).join(', '));
  
  let chosenCandidate: { move: string; evaluationCp: number };
  
  if (shouldBlunder && sortedCandidates.length > 1) {
    // Pick from worst candidates (but avoid checkmate if possible)
    const nonMateCandidates = sortedCandidates.filter(c => Math.abs(c.evaluationCp) < 90000);
    const candidatesToChooseFrom = nonMateCandidates.length > 0 ? nonMateCandidates : sortedCandidates;
    // Pick from the worse half
    const worseHalf = candidatesToChooseFrom.slice(Math.floor(candidatesToChooseFrom.length / 2));
    chosenCandidate = worseHalf[Math.floor(Math.random() * worseHalf.length)];
  } else {
    // Pick from best candidates
    chosenCandidate = sortedCandidates[0];
  }
  
  // Convert UCI move to chess.js Move
  const uciMove = chosenCandidate.move;
  const from = uciMove.substring(0, 2);
  const to = uciMove.substring(2, 4);
  const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
  
  const moveResult = chess.move({ from, to, promotion });
  chess.undo(); // Undo to restore board state

  const chosenMove = moveResult || legalMoves[0];
  const evalInPawns = chosenCandidate.evaluationCp / 100;
  // Invert sign for Black so positive always means "good for current player"
  const adjustedEval = isBlack ? -evalInPawns : evalInPawns;
  const formatted = adjustedEval >= 0 ? `+${adjustedEval.toFixed(2)}` : `${adjustedEval.toFixed(2)}`;
  
  console.log(`[Bot Move] Blunder occurred: ${shouldBlunder} | Chosen: ${chosenCandidate.move} (${formatted})`);

  return { move: chosenMove, evaluationFormatted: formatted };
}

/**
 * Analyzes a played move and returns its quality and pedagogy explanation using Stockfish
 */
export async function analyzeMove(
  fenBefore: string,
  playedMoveSan: string
): Promise<MoveAnalysis> {
  const chess = new Chess(fenBefore);
  const isWhite = chess.turn() === 'w';

  // Find the theoretical best move from this position using Stockfish
  const { bestMove, score: evalBest } = await findBestMove(chess, 3);
  
  // Make the played move
  const moveResult = chess.move(playedMoveSan);
  
  // Get evaluation after the move using Stockfish
  const { score: evalAfter } = await findBestMove(chess, 1);
  chess.undo(); // Undo to restore original state

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
    evaluationBefore: evalBest, // Use evalBest as evaluation before (position before move)
    evaluationAfter: evalAfter,
    bestMoveSan,
    bestMoveFrom,
    bestMoveTo,
    explanation,
  };
}
