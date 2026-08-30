import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import { Bot, PlayedGame, MoveAnalysis } from '../types';
import { BOTS_LIST, getBoardColors } from '../data/botsData';
import { findMatchingOpening } from '../data/openingsData';
import { findBestMove, getBotMove, analyzeMove, generateMoveExplanation } from '../engine/chessEngine';
import { pickTraitDialogue } from '../data/traitDialogue';
import { pickIdentityDialogue, BIG_EVAL_SWING_CP } from '../data/botIdentityDialogue';
import { sounds } from '../utils/audio';
import { savePlayedGame } from '../utils/storage';
import { ChessBoard } from '../components/ChessBoard';
import { HintModal } from '../components/HintModal';
import { BotSelectionModal } from '../components/BotSelectionModal';
import { MoveEvaluationBadge } from '../components/MoveEvaluationBadge';
import { BotSpeechBubble } from '../components/BotSpeechBubble';
import { BotAvatar, BotAvatarMood, PlayerAvatar } from '../components/BotAvatar';
import confetti from 'canvas-confetti';
import {
  Lightbulb,
  RotateCcw,
  Flag,
  Users,
  RefreshCw,
  Trophy,
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

  // Detected opening
  const currentOpening = findMatchingOpening(gameMoves);
  const [botSpeech, setBotSpeech] = useState<string | null>(null);
  const [speechVisible, setSpeechVisible] = useState(false);
  const [botMood, setBotMood] = useState<BotAvatarMood>('idle');
  const announcedOpeningRef = useRef<string | null>(null);
  const lastEvalSwingRef = useRef<number | null>(null);
  const gameOverSpeechRef = useRef(false);
  const moodTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setTemporaryMood = useCallback((mood: BotAvatarMood, durationMs: number) => {
    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    setBotMood(mood);
    moodTimeoutRef.current = setTimeout(() => {
      setBotMood(speechVisible ? 'speaking' : 'idle');
      moodTimeoutRef.current = null;
    }, durationMs);
  }, [speechVisible]);

  const showBotSpeech = useCallback((message: string | null) => {
    if (!message) return;
    setBotSpeech(message);
    setSpeechVisible(true);
    setBotMood('speaking');
  }, []);

  const hideBotSpeech = useCallback(() => {
    setSpeechVisible(false);
    setBotSpeech(null);
    setBotMood((current) => (current === 'speaking' ? 'idle' : current));
  }, []);

  const handleSpeechTypingComplete = useCallback(() => {
    setBotMood((current) => (current === 'speaking' ? 'idle' : current));
  }, []);

  useEffect(() => {
    if (speechVisible) {
      setBotMood((current) => (current === 'idle' || current === 'speaking' ? 'speaking' : current));
    }
  }, [speechVisible]);

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
    announcedOpeningRef.current = null;
    lastEvalSwingRef.current = null;
    gameOverSpeechRef.current = false;
    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    setBotMood('idle');
    hideBotSpeech();
    if (botToUse) {
      setCurrentBot(botToUse);
    }
    if (colorToUse) {
      setPlayerColor(colorToUse);
    }
    
    // If player chose black, bot (white) moves first
    if (colorToUse === 'b' || (colorToUse === undefined && playerColor === 'b')) {
      triggerBotMove(newChess);
    }
  };

  // Handle Game Over
  const handleGameOver = useCallback(
    (winner: 'player' | 'bot' | 'draw', reason: string, score: '1-0' | '0-1' | '1/2-1/2') => {
      setGameOverResult({ isOver: true, winner, reason, score });

      if (!gameOverSpeechRef.current) {
        gameOverSpeechRef.current = true;
        const event =
          winner === 'player' ? 'defeat' : winner === 'bot' ? 'victory' : 'draw';
        const line = pickIdentityDialogue(currentBot.id, event);
        showBotSpeech(line);
      }

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
    [currentBot, currentOpening, gameMoves, chess, showBotSpeech]
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

  // Opening speech when first detected
  useEffect(() => {
    if (!currentOpening || announcedOpeningRef.current === currentOpening.eco) return;
    if (gameMoves.length < 2) return;

    announcedOpeningRef.current = currentOpening.eco;
    const line = pickTraitDialogue(currentBot.traits, 'opening');
    showBotSpeech(line);
  }, [currentOpening, currentBot.traits, gameMoves.length, showBotSpeech]);

  // Bot Turn Trigger
  const triggerBotMove = useCallback(
    async (chessInstance: Chess) => {
      const botTurn = playerColor === 'w' ? 'b' : 'w';
      if (chessInstance.isGameOver() || chessInstance.turn() !== botTurn) return;

      setIsBotThinking(true);

      const botMoveNumber = Math.ceil((gameMoves.length + 1) / 2);
      const botColor = playerColor === 'w' ? 'b' : 'w';
      try {
        const { move: botMove, evaluationCp } = await getBotMove(
          chessInstance,
          currentBot.name,
          currentBot.level,
          currentBot.blunderRate,
          currentBot.searchDepth,
          currentBot.traits,
          botMoveNumber
        );

        const fenBefore = chessInstance.fen();
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
              const line = pickTraitDialogue(
                currentBot.traits,
                'capture',
                result.san.includes('x') && currentBot.traits.includes('artista') ? 'artista' : undefined
              );
              showBotSpeech(line);
            } else if (chessInstance.inCheck()) {
              sounds.playCheck();
              const line = pickTraitDialogue(currentBot.traits, 'check');
              showBotSpeech(line);
            } else {
              sounds.playMove();
            }

            const botEvalCp = botColor === 'w' ? evaluationCp : -evaluationCp;
            const prevSwing = lastEvalSwingRef.current;
            if (prevSwing !== null) {
              if (botEvalCp >= BIG_EVAL_SWING_CP && prevSwing < BIG_EVAL_SWING_CP) {
              showBotSpeech(pickIdentityDialogue(currentBot.id, 'bigAdvantage'));
              setTemporaryMood('happy', 3500);
            } else if (botEvalCp <= -BIG_EVAL_SWING_CP && prevSwing > -BIG_EVAL_SWING_CP) {
              showBotSpeech(pickIdentityDialogue(currentBot.id, 'bigDisadvantage'));
              setTemporaryMood('angry', 3500);
            }
            }
            lastEvalSwingRef.current = botEvalCp;

            setChess(new Chess(chessInstance.fen()));
            checkGameState(chessInstance);

            // Analyze bot move in background (fire-and-forget, never blocks the game)
            analyzeMove(fenBefore, result.san)
              .then((analysis) => {
                setMoveAnalyses((prev) => [...prev, analysis]);
              })
              .catch(() => { /* analysis failure is non-fatal */ });
        }
      } catch (err) {
        console.error('Bot move failed', err);
      } finally {
        setIsBotThinking(false);
      }
    },
    [currentBot, checkGameState, playerColor, gameMoves.length, showBotSpeech, setTemporaryMood]
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

    setLastMove({ from: moveResult.from, to: moveResult.to });
    setHintMove(null);
    setGameMoves((prev) => [...prev, moveResult.san]);

    if (moveResult.captured) {
      sounds.playCapture();
      if (moveResult.color === playerColor) {
        setTemporaryMood('angry', 3000);
      }
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
      .then((analysis) => {
        setMoveAnalyses((prev) => [...prev, analysis]);

        const isGoodMove = ['best', 'brilliant'].includes(analysis.quality);
        const isBadMove = ['mistake', 'blunder', 'inaccuracy'].includes(analysis.quality);
        if (isGoodMove || isBadMove) {
          const event = isGoodMove ? 'playerGoodMove' : 'playerBadMove';
          const line = pickTraitDialogue(currentBot.traits, event);
          showBotSpeech(line);
        }
      })
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

  const isPlayerTurnActive = chess.turn() === playerColor && !gameOverResult?.isOver;

  const botMoodRingClass =
    botMood === 'speaking'
      ? 'border-[#8B5CF6] shadow-md'
      : botMood === 'angry'
        ? 'border-[#F87171] shadow-md'
        : botMood === 'happy'
          ? 'border-[#22C55E] shadow-md'
        : isBotThinking
            ? 'border-[#8AA7E1] shadow-md'
            : 'border-[#DDE3EA] shadow-xs';

  return (
    <div className="min-h-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-2 sm:py-3 overflow-visible animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 items-start">
        {/* Coluna 1: Bot (topo) + Tabuleiro + Jogador (baixo) */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* Tabuleiro */}
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-full aspect-square">
              <ChessBoard
                chess={chess}
                onMove={handlePlayerMove}
                disabled={isBotThinking || gameOverResult?.isOver}
                hintMove={hintMove}
                lastMove={lastMove}
                orientation={playerColor === 'w' ? 'white' : 'black'}
                boardColors={getBoardColors(currentBot)}
                className="w-full h-auto max-w-none mx-0 aspect-square"
              />
            </div>
          </div>

          <div className="shrink-0 grid grid-cols-3 gap-2">
            <button
              id="game-resign-btn"
              onClick={handleResign}
              disabled={gameOverResult?.isOver}
              className="py-2.5 sm:py-3 px-2 rounded-2xl border border-[#FFD6E0] bg-white hover:bg-[#FFD6E0]/40 active:scale-95 text-[#9F1239] text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs disabled:opacity-50"
            >
              <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>DESISTIR</span>
            </button>
            <button
              id="game-hint-btn"
              onClick={handleRequestHint}
              disabled={gameOverResult?.isOver || isBotThinking}
              className="py-2.5 sm:py-3 px-2 rounded-2xl bg-[#BDE7C9] hover:bg-[#A6DEB4] active:scale-95 text-[#166534] text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm border border-[#22C55E]/30 disabled:opacity-50"
            >
              <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>★ DICA</span>
            </button>
            <button
              id="game-undo-btn"
              onClick={handleUndo}
              disabled={gameOverResult?.isOver || isBotThinking || gameMoves.length === 0}
              className="py-2.5 sm:py-3 px-2 rounded-2xl border border-[#DDE3EA] bg-white hover:bg-slate-50 active:scale-95 text-slate-700 text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>DESFAZER</span>
            </button>
          </div>

          <button
            onClick={() => resetGame()}
            className="shrink-0 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reiniciar jogo</span>
          </button>
        </div>

        {/* Coluna 2: Notação, abertura, tempo e controles */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* Bot — topo */}
          <div
            className="shrink-0 rounded-2xl border border-[#DDE3EA] bg-white shadow-xs overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(135deg, ${currentBot.personalityTagColor.bg}22 0%, white 55%)`,
            }}
          >
            <div className="p-3 sm:p-4 flex gap-3 sm:gap-4 items-start">
              <div className="relative shrink-0">
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border bg-[#F7F9FC] transition-all duration-300 ${botMoodRingClass}`}>
                  <BotAvatar
                    seed={currentBot.avatarSeed}
                    botId={currentBot.id}
                    style={currentBot.avatarStyle ?? 'voxel-art'}
                    mood={botMood}
                    alt={currentBot.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isBotThinking && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#8AA7E1] border-2 border-white" />
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-black text-base text-slate-800">{currentBot.name}</h4>
                  <span
                    style={{
                      backgroundColor: currentBot.personalityTagColor.bg,
                      color: currentBot.personalityTagColor.text,
                    }}
                    className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  >
                    {currentBot.personality}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-0.5">Nível {currentBot.level}</div>
                <BotSpeechBubble
                  message={botSpeech}
                  visible={speechVisible}
                  onHide={hideBotSpeech}
                  onTypingComplete={handleSpeechTypingComplete}
                  variant="inline"
                />
                {isBotThinking && !speechVisible && (
                  <p className="text-xs font-semibold text-[#8AA7E1] animate-pulse mt-2">
                    Calculando o próximo lance...
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 px-3 pb-3 sm:px-4 sm:pb-4">
              <button
                id="change-bot-btn"
                onClick={() => setIsBotModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F9FC] hover:bg-[#EDE7FF] border border-[#DDE3EA] hover:border-[#8B5CF6] text-[11px] font-bold text-slate-700 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-[#8AA7E1]" />
                <span>Trocar ({currentBot.name})</span>
              </button>
              <button
                id="change-color-btn"
                onClick={() => resetGame(currentBot, playerColor === 'w' ? 'b' : 'w')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F9FC] hover:bg-[#EDE7FF] border border-[#DDE3EA] hover:border-[#8B5CF6] text-[11px] font-bold text-slate-700 transition-all"
              >
                <span>Jogar {playerColor === 'w' ? 'Pretas' : 'Brancas'}</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 max-h-[38vh] bg-white rounded-2xl p-3 sm:p-4 border border-[#DDE3EA] shadow-xs flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-4 h-4 text-[#8AA7E1] shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-800">Notação da partida</h3>
                  <p className="text-[10px] text-slate-500 truncate">
                    {currentOpening ? `${currentOpening.name} (${currentOpening.eco})` : 'Abertura customizada'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 shrink-0">
                {Math.ceil(gameMoves.length / 2)} lances
              </span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto py-2 space-y-0.5 text-xs">
              {gameMoves.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center px-4">
                  <p>Faça seu primeiro lance para começar!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-0.5">
                  {Array.from({ length: Math.ceil(gameMoves.length / 2) }).map((_, idx) => {
                    const whiteMove = gameMoves[idx * 2];
                    const blackMove = gameMoves[idx * 2 + 1];
                    const whiteAnalysis = moveAnalyses[idx * 2];
                    const blackAnalysis = moveAnalyses[idx * 2 + 1];

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-2.5 py-1 rounded-lg hover:bg-slate-50 font-mono"
                      >
                        <span className="text-slate-400 w-7 font-semibold">{idx + 1}.</span>
                        <div className="flex-1 flex items-center gap-1.5 font-bold text-slate-800">
                          <span>{whiteMove}</span>
                          {whiteAnalysis && (
                            <MoveEvaluationBadge quality={whiteAnalysis.quality} showLabel={false} />
                          )}
                        </div>
                        <div className="flex-1 flex items-center gap-1.5 font-medium text-slate-600">
                          <span>{blackMove || ''}</span>
                          {blackAnalysis && (
                            <MoveEvaluationBadge quality={blackAnalysis.quality} showLabel={false} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Jogador */}
          <div
            className={`shrink-0 rounded-2xl border p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-xs ${
              isPlayerTurnActive
                ? 'bg-[#BDE7C9]/30 border-[#22C55E]/40'
                : 'bg-white border-[#DDE3EA]'
            }`}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#DDE3EA] bg-[#8AA7E1]/10 shrink-0">
              <PlayerAvatar
                alt="Você"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-black text-base sm:text-lg text-slate-800">
                Você ({playerColor === 'w' ? 'Brancas' : 'Pretas'})
              </h4>
              {lastPlayerAnalysis && (
                <div className="mt-1">
                  <MoveEvaluationBadge quality={lastPlayerAnalysis.quality} showLabel={false} />
                </div>
              )}
            </div>
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
