import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Puzzle } from '../types';
import { PUZZLES_LIST } from '../data/puzzlesData';
import { Chess, Square } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';
import { usePuzzleSession } from '../hooks/usePuzzleSession';
import { PuzzleFilterScreen } from '../components/PuzzleFilterScreen';
import { PuzzleSessionSummary } from '../components/PuzzleSessionSummary';
import { DIFFICULTY_OPTIONS, getThemeLabel } from '../utils/puzzleFilter';
import {
  Puzzle as PuzzleIcon,
  Flame,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Eye,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  SlidersHorizontal,
  ArrowRight,
  XCircle,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from 'lucide-react';

export interface SolutionStep {
  index: number;
  fen: string;
  san: string;
  from: string;
  to: string;
  color: 'w' | 'b';
  label: string;
  moveNumberLabel: string;
}

export const PuzzlesView: React.FC = () => {
  const {
    sessionState,
    difficulty,
    setDifficulty,
    selectedThemes,
    toggleTheme,
    clearFilters,
    availableThemes,
    availableCount,
    currentIndex,
    totalInQueue,
    currentPuzzle,
    stats,
    startSession,
    nextPuzzle,
    recordResult,
    restartSession,
    returnToSelection,
  } = usePuzzleSession({
    allPuzzles: PUZZLES_LIST,
  });

  const [chess, setChess] = useState<Chess>(new Chess());
  const [solutionStepIndex, setSolutionStepIndex] = useState<number>(1);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [puzzleState, setPuzzleState] = useState<'solving' | 'correct' | 'failed'>('solving');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [playerOrientation, setPlayerOrientation] = useState<'white' | 'black'>('white');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  
  // Solution navigation state
  const [solutionNavIndex, setSolutionNavIndex] = useState<number>(0);
  const [isAutoPlayingSolution, setIsAutoPlayingSolution] = useState<boolean>(false);

  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState(0);

  useEffect(() => {
    const leftColumn = leftColumnRef.current;
    if (!leftColumn) return;

    const updateHeight = () => {
      setLeftHeight(leftColumn.getBoundingClientRect().height);
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(leftColumn);

    return () => observer.disconnect();
  }, [sessionState, currentPuzzle, showSolution]);

  // Pre-calculate all solution steps with algebraic notation (SAN) & FENs
  const solutionSteps = useMemo<SolutionStep[]>(() => {
    if (!currentPuzzle) return [];
    const temp = new Chess(currentPuzzle.fen);

    // Apply moves[0] (setup move)
    let setupFrom = '';
    let setupTo = '';
    if (currentPuzzle.moves.length > 0) {
      const setupUci = currentPuzzle.moves[0];
      setupFrom = setupUci.substring(0, 2);
      setupTo = setupUci.substring(2, 4);
      const promotion = setupUci.length > 4 ? setupUci[4] : undefined;
      temp.move({ from: setupFrom as Square, to: setupTo as Square, promotion });
    }

    const steps: SolutionStep[] = [
      {
        index: 0,
        fen: temp.fen(),
        san: 'Início',
        from: setupFrom,
        to: setupTo,
        color: temp.turn() === 'w' ? 'b' : 'w',
        label: 'Posição Inicial',
        moveNumberLabel: 'Início',
      },
    ];

    for (let i = 1; i < currentPuzzle.moves.length; i++) {
      const uci = currentPuzzle.moves[i];
      const from = uci.substring(0, 2) as Square;
      const to = uci.substring(2, 4) as Square;
      const promotion = uci.length > 4 ? uci[4] : undefined;
      const colorBefore = temp.turn();
      const moveRes = temp.move({ from, to, promotion });

      if (moveRes) {
        // Calculate move number representation (e.g. "1. e4" or "1... c5")
        const stepNum = Math.ceil(i / 2);
        const prefix = colorBefore === 'w' ? `${stepNum}. ` : `${stepNum}... `;

        steps.push({
          index: i,
          fen: temp.fen(),
          san: moveRes.san,
          from,
          to,
          color: colorBefore,
          label: `${prefix}${moveRes.san}`,
          moveNumberLabel: prefix,
        });
      }
    }

    return steps;
  }, [currentPuzzle]);

  // Clean up auto-advance and autoplay on puzzle change
  useEffect(() => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
    setIsAutoPlayingSolution(false);

    if (!currentPuzzle) return;

    loadPuzzle(currentPuzzle);

    return () => {
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, [currentPuzzle]);

  const loadPuzzle = (puz: Puzzle) => {
    const newChess = new Chess(puz.fen);

    // Apply moves[0] automatically (opponent's setup move)
    if (puz.moves.length > 0) {
      const firstMoveUci = puz.moves[0];
      const from = firstMoveUci.substring(0, 2);
      const to = firstMoveUci.substring(2, 4);
      const promotion = firstMoveUci.length > 4 ? firstMoveUci[4] : undefined;
      newChess.move({ from: from as Square, to: to as Square, promotion });
      setLastMove({ from, to });
    } else {
      setLastMove(null);
    }

    setChess(newChess);
    setSolutionStepIndex(1);
    setShowSolution(false);
    setShowHint(false);
    setPuzzleState('solving');
    setSolutionNavIndex(0);
    setIsAutoPlayingSolution(false);

    const puzzleTurn = newChess.turn();
    setPlayerOrientation(puzzleTurn === 'w' ? 'white' : 'black');
    setFeedbackMessage(
      `Vez das ${puzzleTurn === 'w' ? 'brancas' : 'pretas'}. Encontre o melhor lance!`
    );
  };

  const handlePuzzleMove = (moveData: {
    from: string;
    to: string;
    promotion?: string;
  }): boolean => {
    if (!currentPuzzle || puzzleState === 'correct' || showSolution) return false;

    const expectedMove = currentPuzzle.moves[solutionStepIndex];
    const testChess = new Chess(chess.fen());

    try {
      const moveResult = testChess.move({
        from: moveData.from as Square,
        to: moveData.to as Square,
        promotion: moveData.promotion || 'q',
      });

      if (!moveResult) return false;

      // Check if move matches expected solution (compare UCI format)
      const uciMove = `${moveData.from}${moveData.to}${moveData.promotion || ''}`;
      if (uciMove === expectedMove) {
        sounds.playMove();
        const nextStep = solutionStepIndex + 1;
        setSolutionStepIndex(nextStep);
        setChess(testChess);
        setLastMove({ from: moveData.from, to: moveData.to });

        // If puzzle is completely finished
        if (nextStep >= currentPuzzle.moves.length) {
          sounds.playVictory();
          setPuzzleState('correct');
          setFeedbackMessage('🎉 Excelente! Solução correta!');
          recordResult(true);

          confetti({
            particleCount: 70,
            spread: 55,
            origin: { y: 0.6 },
            colors: ['#8AA7E1', '#BDE7C9', '#EDE7FF'],
          });

          // Auto-advance to next puzzle in queue after 1.6s
          autoAdvanceTimeoutRef.current = setTimeout(() => {
            nextPuzzle();
          }, 1600);

          return true;
        }

        // Opponent auto-reply (alternating: player move at odd indices, opponent at even indices)
        setFeedbackMessage('Boa jogada! O oponente respondeu...');
        setTimeout(() => {
          if (nextStep < currentPuzzle.moves.length) {
            const oppMoveUci = currentPuzzle.moves[nextStep];
            const from = oppMoveUci.substring(0, 2);
            const to = oppMoveUci.substring(2, 4);
            const promotion = oppMoveUci.length > 4 ? oppMoveUci[4] : undefined;
            const autoChess = new Chess(testChess.fen());
            const autoRes = autoChess.move({
              from: from as Square,
              to: to as Square,
              promotion,
            });

            if (autoRes) {
              if (autoRes.captured) sounds.playCapture();
              else sounds.playMove();

              setChess(autoChess);
              setLastMove({ from, to });
              const afterOpponentStep = nextStep + 1;
              setSolutionStepIndex(afterOpponentStep);

              // Check if puzzle is finished after opponent's reply
              if (afterOpponentStep >= currentPuzzle.moves.length) {
                sounds.playVictory();
                setPuzzleState('correct');
                setFeedbackMessage('🎉 Excelente! Sequência completada!');
                recordResult(true);

                confetti({
                  particleCount: 70,
                  spread: 55,
                  origin: { y: 0.6 },
                  colors: ['#8AA7E1', '#BDE7C9', '#EDE7FF'],
                });

                // Auto-advance after 1.6s
                autoAdvanceTimeoutRef.current = setTimeout(() => {
                  nextPuzzle();
                }, 1600);
              } else {
                setFeedbackMessage('Sua vez novamente. Encontre o próximo lance!');
              }
            }
          }
        }, 500);

        return true;
      } else {
        // Incorrect move
        sounds.playDefeat();
        setPuzzleState('failed');
        setFeedbackMessage('❌ Lance incorreto. Tente novamente ou veja a solução!');
        recordResult(false);
        return false;
      }
    } catch {
      return false;
    }
  };

  // Navigate to a specific step in the solution
  const jumpToSolutionStep = (stepIndex: number, playAudio = true) => {
    if (stepIndex < 0 || stepIndex >= solutionSteps.length) return;

    const targetStep = solutionSteps[stepIndex];
    setSolutionNavIndex(stepIndex);
    setChess(new Chess(targetStep.fen));

    if (targetStep.from && targetStep.to) {
      setLastMove({ from: targetStep.from, to: targetStep.to });
    } else {
      setLastMove(null);
    }

    if (playAudio && stepIndex > 0) {
      sounds.playMove();
    }
  };

  // Open Solution Mode and automatically start step-by-step playback
  const handleRevealSolution = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }

    setShowSolution(true);
    sounds.playHint();

    // Start at initial position and automatically start playback
    jumpToSolutionStep(0, false);
    setIsAutoPlayingSolution(true);
  };

  // Auto-play interval effect for stepping through moves
  useEffect(() => {
    if (!isAutoPlayingSolution) {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
      return;
    }

    autoPlayIntervalRef.current = setInterval(() => {
      setSolutionNavIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex < solutionSteps.length) {
          const targetStep = solutionSteps[nextIndex];
          setChess(new Chess(targetStep.fen));
          if (targetStep.from && targetStep.to) {
            setLastMove({ from: targetStep.from, to: targetStep.to });
          }
          sounds.playMove();
          return nextIndex;
        } else {
          // Finished auto-playing
          setIsAutoPlayingSolution(false);
          return prevIndex;
        }
      });
    }, 900);

    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [isAutoPlayingSolution, solutionSteps]);

  const toggleAutoPlay = () => {
    if (isAutoPlayingSolution) {
      setIsAutoPlayingSolution(false);
    } else {
      // If at end, restart from beginning
      if (solutionNavIndex >= solutionSteps.length - 1) {
        jumpToSolutionStep(0, false);
      }
      setIsAutoPlayingSolution(true);
    }
  };

  const handleManualNext = () => {
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
    setIsAutoPlayingSolution(false);
    nextPuzzle();
  };

  const handleRetryCurrent = () => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current);
      autoPlayIntervalRef.current = null;
    }
    setIsAutoPlayingSolution(false);
    if (currentPuzzle) {
      loadPuzzle(currentPuzzle);
    }
  };

  // Turn in current position
  const turn = useMemo(() => {
    return chess.turn();
  }, [chess]);

  // Active difficulty label
  const difficultyLabel = useMemo(() => {
    return DIFFICULTY_OPTIONS.find((d) => d.id === difficulty)?.label || 'Todas';
  }, [difficulty]);

  // Primary theme label of current puzzle
  const currentPrimaryTheme = useMemo(() => {
    if (!currentPuzzle || !currentPuzzle.themes || currentPuzzle.themes.length === 0) {
      return 'Tático';
    }
    return getThemeLabel(currentPuzzle.themes[0]);
  }, [currentPuzzle]);

  // RENDER: 1. Filter Selection Screen
  if (sessionState === 'filter_selection') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PuzzleFilterScreen
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          selectedThemes={selectedThemes}
          onToggleTheme={toggleTheme}
          onClearFilters={clearFilters}
          availableThemes={availableThemes}
          availableCount={availableCount}
          onStartSession={() => startSession()}
        />
      </div>
    );
  }

  // RENDER: 2. Session Summary Screen
  if (sessionState === 'session_completed' || !currentPuzzle) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <PuzzleSessionSummary
          stats={stats}
          difficultyLabel={difficultyLabel}
          selectedThemesCount={selectedThemes.length}
          onRestartSession={restartSession}
          onNewSession={returnToSelection}
        />
      </div>
    );
  }

  // RENDER: 3. In-Session Solving View
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
      {/* Session Top Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#DDE3EA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD6E0]/50 border border-[#FFD6E0] flex items-center justify-center text-[#9F1239]">
            <PuzzleIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Puzzle {currentIndex + 1} de {totalInQueue}
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EDE7FF] text-[#5B21B6] border border-[#DDD6FE]">
                {difficultyLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>Tema: <strong className="text-slate-700">{currentPrimaryTheme}</strong></span>
              <span>•</span>
              <span>Rating: <strong className="text-slate-700">~{currentPuzzle.rating}</strong></span>
            </p>
          </div>
        </div>

        {/* Session live scoreboard & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Live Solved Count */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#BDE7C9]/30 border border-[#BDE7C9] rounded-xl text-xs font-bold text-[#166534]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats.solved}</span>
          </div>

          {/* Live Failed Count */}
          {stats.failed > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFD6E0]/40 border border-[#FFD6E0] rounded-xl text-xs font-bold text-[#9F1239]">
              <XCircle className="w-3.5 h-3.5" />
              <span>{stats.failed}</span>
            </div>
          )}

          {/* Live Streak */}
          {stats.currentStreak > 1 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-700">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{stats.currentStreak} seguidos</span>
            </div>
          )}

          {/* Change Filters / Exit Session Button */}
          <button
            onClick={returnToSelection}
            className="px-3 py-1.5 bg-[#F7F9FC] hover:bg-slate-100 border border-[#DDE3EA] rounded-xl text-xs font-bold text-slate-600 transition-all flex items-center gap-1.5"
            title="Alterar filtros de dificuldade e temas"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mudar Filtros</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Board + Puzzle Interaction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Tactical Board */}
        <div ref={leftColumnRef} className="lg:col-span-6 flex flex-col items-center">
          <ChessBoard
            chess={chess}
            onMove={handlePuzzleMove}
            interactive={!showSolution && puzzleState !== 'correct'}
            orientation={playerOrientation}
            lastMove={lastMove}
          />

          {/* Interactive Solution Stepper Controls when Solution is active */}
          {showSolution ? (
            <div className="w-full max-w-[560px] mt-4 space-y-3">
              {/* Stepper Toolbar */}
              <div className="bg-white p-3 rounded-2xl border border-[#BDE7C9] shadow-xs flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setIsAutoPlayingSolution(false);
                    jumpToSolutionStep(0);
                  }}
                  disabled={solutionNavIndex === 0}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-700 transition-all"
                  title="Posição Inicial"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsAutoPlayingSolution(false);
                    jumpToSolutionStep(solutionNavIndex - 1);
                  }}
                  disabled={solutionNavIndex === 0}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>

                {/* Auto Play / Pause Button */}
                <button
                  onClick={toggleAutoPlay}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                    isAutoPlayingSolution
                      ? 'bg-[#EAB308] text-white hover:bg-[#CA8A04]'
                      : 'bg-[#8AA7E1] text-white hover:bg-[#7292D6]'
                  }`}
                >
                  {isAutoPlayingSolution ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-white" />
                      <span>Pausar</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Reproduzir</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setIsAutoPlayingSolution(false);
                    jumpToSolutionStep(solutionNavIndex + 1);
                  }}
                  disabled={solutionNavIndex >= solutionSteps.length - 1}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                >
                  <span>Próximo</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setIsAutoPlayingSolution(false);
                    jumpToSolutionStep(solutionSteps.length - 1);
                  }}
                  disabled={solutionNavIndex >= solutionSteps.length - 1}
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-30 text-slate-700 transition-all"
                  title="Fim da Linha"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons in Solution Mode */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleRetryCurrent}
                  className="py-3 px-4 bg-white hover:bg-slate-50 border border-[#DDE3EA] text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Tentar Resolver Novamente</span>
                </button>

                <button
                  onClick={handleManualNext}
                  className="py-3 px-4 bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Próximo Puzzle</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Normal Mode Feedback & Action Buttons */
            <div className="w-full max-w-[560px] mt-4 text-center">
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  puzzleState === 'correct'
                    ? 'bg-[#BDE7C9]/40 border-[#BDE7C9] text-[#166534]'
                    : puzzleState === 'failed'
                    ? 'bg-[#FFD6E0]/40 border-[#FFD6E0] text-[#9F1239]'
                    : 'bg-white border-[#DDE3EA] text-slate-800'
                }`}
              >
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {turn === 'w' ? 'Vez das brancas' : 'Vez das pretas'}
                </div>
                <div className="text-sm font-black mb-1">
                  {puzzleState === 'correct'
                    ? '🎉 Desafio Concluído!'
                    : puzzleState === 'failed'
                    ? '❌ Lance Incorreto'
                    : 'Encontre o melhor lance!'}
                </div>
                <p className="text-xs opacity-90">{feedbackMessage}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <button
                  id="reveal-solution-btn"
                  onClick={handleRevealSolution}
                  className="py-3 px-3 bg-[#8AA7E1] hover:bg-[#7292D6] active:scale-95 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>SOLUÇÃO</span>
                </button>

                <button
                  onClick={() => setShowHint(true)}
                  className="py-3 px-3 bg-[#FFF1C7] hover:bg-[#FFE699] text-[#854D0E] font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 border border-[#EAB308]/30"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>DICA</span>
                </button>

                <button
                  onClick={handleManualNext}
                  className="py-3 px-3 bg-[#166534] hover:bg-[#14532D] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <span>PRÓXIMO</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Info, Themes, Interactive Solution & Progress */}
        <div
          className="lg:col-span-6 flex flex-col gap-4 overflow-hidden min-h-0"
          style={{ height: leftHeight ? `${leftHeight}px` : 'auto' }}
        >
          {/* Card: Themes and Details */}
          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs flex-shrink-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Temas deste Desafio
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {currentPuzzle.themes.map((t) => (
                <span
                  key={t}
                  className="text-xs font-bold px-3 py-1 rounded-xl bg-[#EDE7FF] text-[#5B21B6] border border-[#DDD6FE]"
                >
                  {getThemeLabel(t)}
                </span>
              ))}
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-3 pt-2 border-t border-slate-100">
              <span>Sequência: <strong>{Math.floor(currentPuzzle.moves.length / 2)} lances</strong></span>
              <span>•</span>
              <span>Progresso na fila: <strong>{currentIndex + 1} / {totalInQueue}</strong></span>
            </div>
          </div>

          {/* Interactive Solution Box */}
          {showSolution && (
            <div className="bg-white rounded-3xl p-5 border border-[#BDE7C9] shadow-xs animate-fadeIn flex-shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#166534]">
                  <Sparkles className="w-4 h-4" />
                  <span>Solução Tática Interativa:</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {solutionNavIndex === 0 ? 'Posição Inicial' : `Lance ${solutionNavIndex} de ${solutionSteps.length - 1}`}
                </span>
              </div>

              {/* Clickable Moves Sequence Chips */}
              <div className="flex flex-wrap gap-1.5 p-2 bg-[#F7F9FC] rounded-2xl border border-slate-200">
                {solutionSteps.map((step) => {
                  const isCurrent = solutionNavIndex === step.index;
                  return (
                    <button
                      key={step.index}
                      type="button"
                      onClick={() => {
                        setIsAutoPlayingSolution(false);
                        jumpToSolutionStep(step.index);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                        isCurrent
                          ? 'bg-[#8AA7E1] text-white shadow-xs scale-105 ring-2 ring-[#8AA7E1]/30'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <span>{step.label}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                💡 Clique em qualquer lance para visualizar a posição no tabuleiro ou use o botão <strong>Reproduzir</strong> para navegar automaticamente.
              </p>
            </div>
          )}

          {/* Hint Box (when active and not showing solution) */}
          {showHint && !showSolution && (
            <div className="bg-[#FFF1C7]/50 rounded-3xl p-5 border border-[#EAB308]/30 animate-fadeIn flex-shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-[#854D0E] mb-1">
                <Lightbulb className="w-4 h-4" />
                <span>Dica Tática:</span>
              </div>
              <p className="text-xs text-[#854D0E] leading-relaxed">
                Analise os temas ({currentPuzzle.themes.map(getThemeLabel).join(', ')}). Procure peças cravadas, ataques duplos ou fraquezas no rei oponente.
              </p>
            </div>
          )}

          {/* Session Progress Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs flex-1 flex flex-col justify-between min-h-[140px]">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Andamento da Sessão
              </h3>
              <p className="text-xs text-slate-600">
                Ao acertar ou errar, você pode avançar para o próximo desafio da fila. Os puzzles são selecionados e embaralhados conforme seus filtros.
              </p>
            </div>

            <div className="space-y-2 pt-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Progresso do Treino</span>
                <span className="text-slate-800">
                  {Math.round(((currentIndex + 1) / totalInQueue) * 100)}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8AA7E1] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round(((currentIndex + 1) / totalInQueue) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
