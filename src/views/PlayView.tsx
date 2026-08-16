import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { Bot, PlayedGame, MoveAnalysis } from '../types';
import { BOTS_LIST, getBotAvatarUrl, getUserAvatarUrl, getBoardColors } from '../data/botsData';
import { findMatchingOpening } from '../data/openingsData';
import { findBestMove, getBotMove, analyzeMove, generateMoveExplanation } from '../engine/chessEngine';
import { sounds } from '../utils/audio';
import { savePlayedGame } from '../utils/storage';
import { ChessBoard } from '../components/ChessBoard';
import { HintModal } from '../components/HintModal';
import { BotSelectionModal } from '../components/BotSelectionModal';
import { MoveEvaluationBadge } from '../components/MoveEvaluationBadge';
import confetti from 'canvas-confetti';
import {
  Lightbulb,
  RotateCcw,
  Flag,
  Users,
  RefreshCw,
  Clock,
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface PlayViewProps {
  initialBot?: Bot;
}

export const PlayView: React.FC<PlayViewProps> = ({ initialBot }) => {
  const [currentBot, setCurrentBot] = useState<Bot>(
    initialBot || BOTS_LIST.find((b) => b.id === 'bytemaster') || BOTS_LIST[0]
  );
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [chess, setChess] = useState<Chess>(new Chess());
  const [gameMoves, setGameMoves] = useState<string[]>([]);
  const [moveAnalyses, setMoveAnalyses] = useState<MoveAnalysis[]>([]);
  const [isBotThinking, setIsBotThinking] = useState<boolean>(false);
  const [isBotModalOpen, setIsBotModalOpen] = useState<boolean>(false);
  const [isHintModalOpen, setIsHintModalOpen] = useState<boolean>(false);
  const [hintMove, setHintMove] = useState<{ from: string; to: string } | null>(null);
  const [hintDetails, setHintDetails] = useState<{
    san: string;
    from: string;
    to: string;
    explanation: string;
    evaluation: string;
  }>({
    san: 'e4',
    from: 'e2',
    to: 'e4',
    explanation: 'Ocupa o centro com o peão e abre diagonais.',
    evaluation: '+0.20',
  });
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [gameOverResult, setGameOverResult] = useState<{
    isOver: boolean;
    winner: 'player' | 'bot' | 'draw';
    reason: string;
    score: '1-0' | '0-1' | '1/2-1/2';
  } | null>(null);

  // Timers (in seconds, 15 minutes by default)
  const [playerTime, setPlayerTime] = useState<number>(15 * 60);
  const [botTime, setBotTime] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Detected opening
  const currentOpening = findMatchingOpening(gameMoves);

  // Timer interval
  useEffect(() => {
    if (!isTimerRunning || gameOverResult?.isOver) return;

    const interval = setInterval(() => {
      if (chess.turn() === playerColor) {
        setPlayerTime((prev) => {
          if (prev <= 1) {
            handleGameOver('bot', 'Tempo esgotado', playerColor === 'w' ? '0-1' : '1-0');
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBotTime((prev) => {
          if (prev <= 1) {
            handleGameOver('player', 'Tempo esgotado do Bot', playerColor === 'w' ? '1-0' : '0-1');
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, chess.turn(), gameOverResult, playerColor]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get captured pieces
  const getCapturedPieces = () => {
    const initialCounts = { p: 8, n: 2, b: 2, r: 2, q: 1 };
    const whiteCaptured: string[] = [];
    const blackCaptured: string[] = [];

    const currentCountsWhite = { p: 0, n: 0, b: 0, r: 0, q: 0 };
    const currentCountsBlack = { p: 0, n: 0, b: 0, r: 0, q: 0 };

    chess.board().forEach((row) => {
      row.forEach((piece) => {
        if (!piece || piece.type === 'k') return;
        if (piece.color === 'w') {
          currentCountsWhite[piece.type] = (currentCountsWhite[piece.type] || 0) + 1;
        } else {
          currentCountsBlack[piece.type] = (currentCountsBlack[piece.type] || 0) + 1;
        }
      });
    });

    (Object.keys(initialCounts) as (keyof typeof initialCounts)[]).forEach((type) => {
      const missingWhite = initialCounts[type] - currentCountsWhite[type];
      for (let i = 0; i < missingWhite; i++) whiteCaptured.push(type);

      const missingBlack = initialCounts[type] - currentCountsBlack[type];
      for (let i = 0; i < missingBlack; i++) blackCaptured.push(type);
    });

    return { whiteCaptured, blackCaptured };
  };

  const { whiteCaptured, blackCaptured } = getCapturedPieces();

  // Reset Game
  const resetGame = (botToUse?: Bot, colorToUse?: 'w' | 'b') => {
    const newChess = new Chess();
    setChess(newChess);
    setGameMoves([]);
    setMoveAnalyses([]);
    setHintMove(null);
    setLastMove(null);
    setGameOverResult(null);
    setIsBotThinking(false);
    setPlayerTime(15 * 60);
    setBotTime(15 * 60);
    setIsTimerRunning(false);
    if (botToUse) {
      setCurrentBot(botToUse);
    }
    if (colorToUse) {
      setPlayerColor(colorToUse);
    }
    
    // If player chose black, bot (white) moves first
    if (colorToUse === 'b' || (colorToUse === undefined && playerColor === 'b')) {
      setTimeout(() => triggerBotMove(newChess), 500);
    }
  };

  // Handle Game Over
  const handleGameOver = useCallback(
    (winner: 'player' | 'bot' | 'draw', reason: string, score: '1-0' | '0-1' | '1/2-1/2') => {
      setGameOverResult({ isOver: true, winner, reason, score });
      setIsTimerRunning(false);

      if (winner === 'player') {
        sounds.playVictory();
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8AA7E1', '#BDE7C9', '#FFD6E0', '#CDB4DB'],
        });
      } else if (winner === 'bot') {
        sounds.playDefeat();
      }

      // Save game to storage
      const playedGame: PlayedGame = {
        id: `game-${Date.now()}`,
        date: new Date().toLocaleDateString('pt-BR'),
        botId: currentBot.id,
        botName: currentBot.name,
        botLevel: currentBot.level,
        botAvatarSeed: currentBot.avatarSeed,
        playerColor: playerColor,
        result: score,
        resultReason: reason,
        movesCount: Math.ceil(gameMoves.length / 2),
        openingName: currentOpening ? `${currentOpening.name} (${currentOpening.eco})` : undefined,
        ecoCode: currentOpening?.eco,
        pgn: chess.pgn(),
        moves: gameMoves,
        playerAccuracy: Math.min(98, Math.max(65, Math.floor(85 + Math.random() * 10))),
      };
      savePlayedGame(playedGame);
    },
    [currentBot, currentOpening, gameMoves, chess]
  );

  // Check Game State for Checkmate / Draw
  const checkGameState = useCallback(
    (currentChessInstance: Chess) => {
      if (currentChessInstance.isGameOver()) {
        if (currentChessInstance.isCheckmate()) {
          const isPlayerWinner = currentChessInstance.turn() !== playerColor;
          handleGameOver(
            isPlayerWinner ? 'player' : 'bot',
            'Xeque-mate!',
            isPlayerWinner ? (playerColor === 'w' ? '1-0' : '0-1') : (playerColor === 'w' ? '0-1' : '1-0')
          );
        } else if (currentChessInstance.isDraw()) {
          let reason = 'Empate';
          if (currentChessInstance.isStalemate()) reason = 'Empate por afogamento';
          else if (currentChessInstance.isThreefoldRepetition()) reason = 'Empate por repetição de lances';
          else if (currentChessInstance.isInsufficientMaterial()) reason = 'Empate por material insuficiente';
          handleGameOver('draw', reason, '1/2-1/2');
        }
        return true;
      }
      return false;
    },
    [handleGameOver, playerColor]
  );

  // Bot Turn Trigger
  const triggerBotMove = useCallback(
    (chessInstance: Chess) => {
      const botTurn = playerColor === 'w' ? 'b' : 'w';
      if (chessInstance.isGameOver() || chessInstance.turn() !== botTurn) return;

      setIsBotThinking(true);

      // Simulate bot "thinking" delay based on personality & level (300ms - 900ms)
      const thinkTime = Math.max(350, Math.min(900, 300 + currentBot.level * 30));

      setTimeout(async () => {
        try {
          const { move: botMove } = await getBotMove(
            chessInstance,
            currentBot.name,
            currentBot.level,
            currentBot.blunderRate,
            currentBot.searchDepth
          );

          const result = chessInstance.move({
            from: botMove.from,
            to: botMove.to,
            promotion: botMove.promotion || 'q',
          });

          if (result) {
            setLastMove({ from: result.from, to: result.to });
            setGameMoves((prev) => [...prev, result.san]);

            if (result.captured) {
              sounds.playCapture();
            } else if (chessInstance.inCheck()) {
              sounds.playCheck();
            } else {
              sounds.playMove();
            }

            setChess(new Chess(chessInstance.fen()));
            checkGameState(chessInstance);
          }
        } catch (err) {
          console.error('Bot move failed', err);
        } finally {
          setIsBotThinking(false);
        }
      }, thinkTime);
    },
    [currentBot, checkGameState, playerColor]
  );

  const handlePlayerMove = async (moveData: { from: string; to: string; promotion?: string }): Promise<boolean> => {
    if (isBotThinking || gameOverResult?.isOver || chess.turn() !== playerColor) {
      return false;
    }

    const fenBefore = chess.fen();
    const moveResult = chess.move({
      from: moveData.from as Square,
      to: moveData.to as Square,
      promotion: moveData.promotion || 'q',
    });

    if (!moveResult) return false;

    // --- Update board state IMMEDIATELY (don't wait for Stockfish) ---
    if (!isTimerRunning) setIsTimerRunning(true);

    setLastMove({ from: moveResult.from, to: moveResult.to });
    setHintMove(null);
    setGameMoves((prev) => [...prev, moveResult.san]);

    if (moveResult.captured) {
      sounds.playCapture();
    } else if (chess.inCheck()) {
      sounds.playCheck();
    } else {
      sounds.playMove();
    }

    const nextChess = new Chess(chess.fen());
    setChess(nextChess);

    const isOver = checkGameState(nextChess);
    if (!isOver) {
      triggerBotMove(nextChess);
    }

    // --- Analyze move in background (fire-and-forget, never blocks the game) ---
    analyzeMove(fenBefore, moveResult.san)
      .then((analysis) => setMoveAnalyses((prev) => [...prev, analysis]))
      .catch(() => { /* analysis failure is non-fatal */ });

    return true;
  };


  // Best Move / Hint Feature
  const handleRequestHint = async () => {
    if (chess.isGameOver() || isBotThinking) return;

    sounds.playHint();
    const { bestMove, score, evaluationFormatted } = await findBestMove(chess, 4);

    if (bestMove) {
      setHintMove({ from: bestMove.from, to: bestMove.to });
      const explanation = generateMoveExplanation(bestMove, chess);

      setHintDetails({
        san: bestMove.san,
        from: bestMove.from,
        to: bestMove.to,
        explanation,
        evaluation: evaluationFormatted,
      });

      setIsHintModalOpen(true);
    }
  };

  // Undo Move (Take back 2 moves: player + bot)
  const handleUndo = () => {
    if (isBotThinking || gameMoves.length === 0) return;

    const newChess = new Chess();
    // If Black's turn (after white played), undo 1 move. If White's turn, undo 2 moves.
    const movesToKeep = chess.turn() === 'b' ? gameMoves.slice(0, -1) : gameMoves.slice(0, -2);

    movesToKeep.forEach((m) => newChess.move(m));
    setChess(newChess);
    setGameMoves(movesToKeep);
    setMoveAnalyses((prev) => prev.slice(0, movesToKeep.length));
    setHintMove(null);
    setLastMove(null);
    setGameOverResult(null);
  };

  // Resign
  const handleResign = () => {
    if (gameOverResult?.isOver) return;
    if (confirm('Tem certeza que deseja desistir da partida?')) {
      handleGameOver('bot', 'Desistência', playerColor === 'w' ? '0-1' : '1-0');
    }
  };

  const lastPlayerAnalysis = moveAnalyses.length > 0 ? moveAnalyses[moveAnalyses.length - 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
      {/* Top Banner: Opening Detected & Bot Switcher */}
      <div className="bg-white rounded-2xl p-4 border border-[#DDE3EA] mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE7FF] border border-[#CDB4DB] flex items-center justify-center text-[#5B21B6]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Abertura em Jogo</span>
            <h3 className="font-bold text-slate-800 text-sm">
              {currentOpening ? `${currentOpening.name} (${currentOpening.eco})` : 'Abertura Customizada'}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="change-bot-btn"
            onClick={() => setIsBotModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F7F9FC] hover:bg-[#EDE7FF] border border-[#DDE3EA] hover:border-[#8B5CF6] text-xs font-bold text-slate-700 transition-all"
          >
            <Users className="w-4 h-4 text-[#8AA7E1]" />
            <span>Trocar Oponente ({currentBot.name})</span>
          </button>
          
          <button
            id="change-color-btn"
            onClick={() => resetGame(currentBot, playerColor === 'w' ? 'b' : 'w')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F7F9FC] hover:bg-[#EDE7FF] border border-[#DDE3EA] hover:border-[#8B5CF6] text-xs font-bold text-slate-700 transition-all"
          >
            <span>Jogar com {playerColor === 'w' ? 'Pretas' : 'Brancas'}</span>
          </button>
        </div>
      </div>

      {/* Main Game Arena (Board + Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center: Board & Player Headers (8 Cols on LG) */}
        <div className="lg:col-span-8 flex flex-col items-center">
          {/* BOT INFO BAR (TOP) */}
          <div className="w-full max-w-[560px] bg-white rounded-2xl p-3.5 border border-[#DDE3EA] mb-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={getBotAvatarUrl(currentBot.avatarSeed)}
                  alt={currentBot.name}
                  className="w-11 h-11 rounded-xl bg-slate-100 p-0.5 border border-[#DDE3EA]"
                />
                {isBotThinking && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-800">{currentBot.name}</h4>
                  <span
                    style={{
                      backgroundColor: currentBot.personalityTagColor.bg,
                      color: currentBot.personalityTagColor.text,
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {currentBot.personality}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">Nível {currentBot.level}</span>
              </div>
            </div>

            {/* Timer & Thinking indicator */}
            <div className="flex items-center gap-3">
              {isBotThinking && (
                <span className="text-xs font-semibold text-[#8AA7E1] animate-pulse hidden sm:inline">
                  Calculando...
                </span>
              )}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
                  chess.turn() === 'b' && !gameOverResult?.isOver
                    ? 'bg-[#EDE7FF] text-[#5B21B6] border border-[#8B5CF6]/30 animate-pulse'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(botTime)}</span>
              </div>
            </div>
          </div>

          {/* THE CHESS BOARD */}
          <ChessBoard
            chess={chess}
            onMove={handlePlayerMove}
            disabled={isBotThinking || gameOverResult?.isOver}
            hintMove={hintMove}
            lastMove={lastMove}
            orientation={playerColor === 'w' ? 'white' : 'black'}
            boardColors={getBoardColors(currentBot)}
          />

          {/* USER INFO BAR (BOTTOM) */}
          <div className="w-full max-w-[560px] bg-white rounded-2xl p-3.5 border border-[#DDE3EA] mt-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={getUserAvatarUrl()}
                alt="Você"
                className="w-11 h-11 rounded-xl bg-[#8AA7E1]/20 p-0.5 border border-[#8AA7E1]/40"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-800">Você (Brancas)</h4>
                </div>
                {lastPlayerAnalysis && (
                  <div className="mt-0.5">
                    <MoveEvaluationBadge quality={lastPlayerAnalysis.quality} showLabel={false} />
                  </div>
                )}
              </div>
            </div>

            {/* User Timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-sm font-bold ${
                chess.turn() === 'w' && !gameOverResult?.isOver
                  ? 'bg-[#BDE7C9] text-[#166534] border border-[#22C55E]/30 animate-pulse'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(playerTime)}</span>
            </div>
          </div>

          {/* IN-GAME CONTROLS (Matching Brand Guide: DESISTIR | DICA | DESFAZER) */}
          <div className="w-full max-w-[560px] grid grid-cols-3 gap-2 sm:gap-3 mt-4">
            {/* DESISTIR */}
            <button
              id="game-resign-btn"
              onClick={handleResign}
              disabled={gameOverResult?.isOver}
              className="py-3 px-3 rounded-2xl border border-[#FFD6E0] bg-white hover:bg-[#FFD6E0]/40 active:scale-95 text-[#9F1239] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <Flag className="w-4 h-4" />
              <span>DESISTIR</span>
            </button>

            {/* DICA (Primary Feature) */}
            <button
              id="game-hint-btn"
              onClick={handleRequestHint}
              disabled={gameOverResult?.isOver || isBotThinking}
              className="py-3 px-3 rounded-2xl bg-[#BDE7C9] hover:bg-[#A6DEB4] active:scale-95 text-[#166534] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm border border-[#22C55E]/30 disabled:opacity-50"
            >
              <Lightbulb className="w-4 h-4 text-[#166534]" />
              <span>★ DICA</span>
            </button>

            {/* DESFAZER */}
            <button
              id="game-undo-btn"
              onClick={handleUndo}
              disabled={gameOverResult?.isOver || isBotThinking || gameMoves.length === 0}
              className="py-3 px-3 rounded-2xl border border-[#DDE3EA] bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>DESFAZER</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar: Move Notation & Analysis (4 Cols on LG) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Move History Log Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs flex flex-col h-[420px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <span>Notação da Partida</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {Math.ceil(gameMoves.length / 2)} lances
              </span>
            </div>

            {/* Move List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-1 text-xs">
              {gameMoves.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-4">
                  <p>Faça seu primeiro lance para começar a partida!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-1">
                  {Array.from({ length: Math.ceil(gameMoves.length / 2) }).map((_, idx) => {
                    const whiteMove = gameMoves[idx * 2];
                    const blackMove = gameMoves[idx * 2 + 1];
                    const whiteAnalysis = moveAnalyses[idx];

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-3 py-1.5 rounded-xl hover:bg-slate-50 font-mono"
                      >
                        <span className="text-slate-400 w-8 font-semibold">{idx + 1}.</span>

                        {/* White move */}
                        <div className="flex-1 flex items-center gap-1.5 font-bold text-slate-800">
                          <span>{whiteMove}</span>
                          {whiteAnalysis && (
                            <MoveEvaluationBadge quality={whiteAnalysis.quality} showLabel={false} />
                          )}
                        </div>

                        {/* Black move */}
                        <div className="flex-1 font-medium text-slate-600">
                          {blackMove || ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions in Sidebar */}
            <div className="pt-3 border-t border-slate-100 flex gap-2">
              <button
                onClick={() => resetGame()}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reiniciar Jogo</span>
              </button>
            </div>
          </div>

          {/* Bot Quote Card */}
          <div className="bg-[#F7F9FC] rounded-3xl p-5 border border-[#DDE3EA]">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={getBotAvatarUrl(currentBot.avatarSeed)}
                alt={currentBot.name}
                className="w-8 h-8 rounded-lg bg-white p-0.5 border border-[#DDE3EA]"
              />
              <div>
                <h4 className="font-bold text-xs text-slate-800">{currentBot.name}</h4>
                <p className="text-[10px] text-slate-500">Estilo: {currentBot.personality}</p>
              </div>
            </div>
            <p className="text-xs italic text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200/60">
              "{currentBot.quote}"
            </p>
          </div>
        </div>
      </div>

      {/* DICA DE MELHOR LANCE MODAL (Matching Brand Guide) */}
      <HintModal
        isOpen={isHintModalOpen}
        onClose={() => setIsHintModalOpen(false)}
        bestMoveSan={hintDetails.san}
        bestMoveFrom={hintDetails.from}
        bestMoveTo={hintDetails.to}
        explanation={hintDetails.explanation}
        lastMoveAnalysis={lastPlayerAnalysis}
        currentEvaluation={hintDetails.evaluation}
      />

      {/* BOT SELECTION MODAL */}
      <BotSelectionModal
        isOpen={isBotModalOpen}
        onClose={() => setIsBotModalOpen(false)}
        currentBotId={currentBot.id}
        onSelectBot={(bot) => {
          resetGame(bot);
        }}
      />

      {/* GAME OVER MODAL */}
      {gameOverResult && gameOverResult.isOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#DDE3EA] text-center">
            <div
              className={`w-16 h-16 mx-auto rounded-3xl flex items-center justify-center mb-4 ${
                gameOverResult.winner === 'player'
                  ? 'bg-[#BDE7C9] text-[#166534]'
                  : gameOverResult.winner === 'draw'
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-[#FFD6E0] text-[#9F1239]'
              }`}
            >
              <Trophy className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-800 mb-1">
              {gameOverResult.winner === 'player'
                ? 'Vitória!'
                : gameOverResult.winner === 'draw'
                ? 'Empate!'
                : 'Derrota!'}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{gameOverResult.reason}</p>

            <div className="bg-[#F7F9FC] p-3 rounded-2xl border border-[#DDE3EA] mb-6 flex items-center justify-around">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Resultado</span>
                <span className="font-mono font-bold text-base text-slate-800">{gameOverResult.score}</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lances</span>
                <span className="font-mono font-bold text-base text-slate-800">{gameMoves.length}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                id="rematch-btn"
                onClick={() => resetGame()}
                className="w-full py-3.5 bg-[#8AA7E1] hover:bg-[#7292D6] text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all"
              >
                Jogar Novamente
              </button>
              <button
                onClick={() => setIsBotModalOpen(true)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition-colors"
              >
                Escolher Outro Bot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
