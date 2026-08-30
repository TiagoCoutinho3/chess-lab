import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Puzzle } from '../types';
import { PUZZLES_LIST, getDailyPuzzle, getFormattedTodayDate } from '../data/puzzlesData';
import { Chess, Square } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { sounds } from '../utils/audio';
import { incrementPuzzleSolved, getUserStats } from '../utils/storage';
import confetti from 'canvas-confetti';
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
  Filter,
} from 'lucide-react';

export const PuzzlesView: React.FC = () => {
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(getDailyPuzzle());
  const [chess, setChess] = useState<Chess>(new Chess());
  const [solutionStepIndex, setSolutionStepIndex] = useState<number>(1); // Start at 1 since moves[0] is auto-applied
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [puzzleState, setPuzzleState] = useState<'solving' | 'correct' | 'failed'>('solving');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('Todos');
  const [stats, setStats] = useState(getUserStats());
  const [playerOrientation, setPlayerOrientation] = useState<'white' | 'black'>('white');
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
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
  }, []);

  // Determine turn from current chess position (after moves[0] is applied)
  const turn = useMemo(() => {
    return chess.turn();
  }, [chess]);

  // Get primary theme
  const primaryTheme = useMemo(() => {
    return currentPuzzle.themes[0] || 'Tático';
  }, [currentPuzzle.themes]);

  useEffect(() => {
    loadPuzzle(currentPuzzle);
  }, [currentPuzzle]);

  const loadPuzzle = (puz: Puzzle) => {
    const newChess = new Chess(puz.fen);
    
    // Apply moves[0] automatically (this is the setup move before the puzzle starts)
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
    setSolutionStepIndex(1); // Start at 1 since moves[0] is already applied
    setShowSolution(false);
    setShowHint(false);
    setPuzzleState('solving');
    const puzzleTurn = newChess.turn();
    setPlayerOrientation(puzzleTurn === 'w' ? 'white' : 'black');
    setFeedbackMessage(
      `Vez das ${puzzleTurn === 'w' ? 'brancas' : 'pretas'}. Encontre o melhor lance!`
    );
  };

  const handlePuzzleMove = (moveData: { from: string; to: string; promotion?: string }): boolean => {
    if (puzzleState === 'correct') return false;

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

        // If puzzle is finished
        if (nextStep >= currentPuzzle.moves.length) {
          sounds.playVictory();
          setPuzzleState('correct');
          setFeedbackMessage('🎉 Excelente! Você encontrou a solução perfeita!');
          incrementPuzzleSolved(true);
          setStats(getUserStats());

          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#8AA7E1', '#BDE7C9', '#FFD6E0'],
          });
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
            const autoRes = autoChess.move({ from: from as Square, to: to as Square, promotion });
            if (autoRes) {
              if (autoRes.captured) sounds.playCapture();
              else sounds.playMove();
              setChess(autoChess);
              setLastMove({ from, to });
              setSolutionStepIndex(nextStep + 1);
              
              // Check if puzzle is finished after opponent's reply
              if (nextStep + 1 >= currentPuzzle.moves.length) {
                sounds.playVictory();
                setPuzzleState('correct');
                setFeedbackMessage('🎉 Excelente! Você completou a sequência!');
                incrementPuzzleSolved(true);
                setStats(getUserStats());
                confetti({
                  particleCount: 80,
                  spread: 60,
                  origin: { y: 0.6 },
                  colors: ['#8AA7E1', '#BDE7C9', '#FFD6E0'],
                });
              } else {
                setFeedbackMessage('Sua vez novamente. Encontre o próximo lance!');
              }
            }
          }
        }, 500);

        return true;
      } else {
        // Incorrect Move
        sounds.playDefeat();
        setPuzzleState('failed');
        setFeedbackMessage('❌ Lance incorreto. Tente novamente ou use uma dica!');
        incrementPuzzleSolved(false);
        setStats(getUserStats());
        return false;
      }
    } catch {
      return false;
    }
  };

  const handleRevealSolution = () => {
    setShowSolution(true);
    sounds.playHint();
  };

  const handleNextPuzzle = () => {
    const currentIndex = PUZZLES_LIST.indexOf(currentPuzzle);
    const nextIndex = (currentIndex + 1) % PUZZLES_LIST.length;
    setCurrentPuzzle(PUZZLES_LIST[nextIndex]);
  };

  const filteredPuzzles = PUZZLES_LIST.filter((p) => {
    if (selectedTheme === 'Todos') return true;
    return p.themes.includes(selectedTheme);
  });

  // Extract unique themes from puzzles
  const themes = useMemo(() => {
    const uniqueThemes = new Set<string>();
    PUZZLES_LIST.forEach(p => p.themes.forEach(t => uniqueThemes.add(t)));
    return ['Todos', ...Array.from(uniqueThemes).slice(0, 10)];
  }, [PUZZLES_LIST]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#DDE3EA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFD6E0]/50 border border-[#FFD6E0] flex items-center justify-center text-[#9F1239]">
            <PuzzleIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Puzzle do Dia</h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFD6E0] text-[#9F1239]">
                {getFormattedTodayDate()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Tema: <span className="font-bold text-slate-700">{primaryTheme}</span> • Rating: ~{currentPuzzle.rating}
            </p>
          </div>
        </div>

        {/* Streak & Stats */}
        <div className="flex items-center gap-3 bg-[#F7F9FC] p-2 rounded-2xl border border-[#DDE3EA]">
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl shadow-xs border border-slate-200/60">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-slate-800">{stats.puzzleStreak} dias</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl shadow-xs border border-slate-200/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">{stats.puzzlesSolved} resolvidos</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Board + Puzzle Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Tactical Board (Matching Brand Guide Mockup) */}
        <div ref={leftColumnRef} className="lg:col-span-6 flex flex-col items-center">
          <ChessBoard
            chess={chess}
            onMove={handlePuzzleMove}
            orientation={playerOrientation}
            lastMove={lastMove}
          />

          {/* Turn and Goal Banner */}
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
                  ? 'Desafio Concluído!'
                  : puzzleState === 'failed'
                  ? 'Tente Novamente'
                  : 'Encontre o melhor lance!'}
              </div>
              <p className="text-xs opacity-90">{feedbackMessage}</p>
            </div>

            {/* Action Buttons: VER SOLUÇÃO | DICA | PRÓXIMO */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                id="reveal-solution-btn"
                onClick={handleRevealSolution}
                className="py-3 px-3 bg-[#8AA7E1] hover:bg-[#7292D6] active:scale-95 text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>VER SOLUÇÃO</span>
              </button>

              <button
                onClick={() => setShowHint(true)}
                className="py-3 px-3 bg-[#FFF1C7] hover:bg-[#FFE699] text-[#854D0E] font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5 border border-[#EAB308]/30"
              >
                <Lightbulb className="w-4 h-4" />
                <span>DICA</span>
              </button>

              <button
                onClick={handleNextPuzzle}
                className="py-3 px-3 bg-white hover:bg-slate-50 border border-[#DDE3EA] text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>PRÓXIMO</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Explanations, Hints, & Puzzle Library */}
        <div
          className="lg:col-span-6 flex flex-col gap-4 overflow-hidden min-h-0"
          style={{ height: leftHeight ? `${leftHeight}px` : 'auto' }}
        >
          {/* Puzzle Info & Hint Card */}
          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs flex-shrink-0">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Puzzle Tático</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Encontre a melhor sequência de lances para resolver este desafio.
            </p>

            {/* Hint Box */}
            {showHint && (
              <div className="p-3.5 bg-[#FFF1C7]/50 rounded-2xl border border-[#EAB308]/30 mb-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-bold text-[#854D0E] mb-1">
                  <Lightbulb className="w-4 h-4" />
                  <span>Dica Tática:</span>
                </div>
                <p className="text-xs text-[#854D0E] leading-relaxed">
                  Analise o tabuleiro cuidadosamente. Procure movimentos que criem ameaças múltiplas ou explorem fraquezas na posição do oponente.
                </p>
              </div>
            )}

            {/* Revealed Solution */}
            {showSolution && (
              <div className="p-3.5 bg-[#BDE7C9]/40 rounded-2xl border border-[#BDE7C9] animate-fadeIn">
                <div className="flex items-center gap-2 text-xs font-bold text-[#166534] mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Solução Completa:</span>
                </div>
                <div className="flex items-center gap-2 font-mono font-bold text-sm text-[#166534] mb-2">
                  {currentPuzzle.moves.join(' → ')}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Esta é a sequência correta de lances para resolver o puzzle.
                </p>
              </div>
            )}
          </div>

          {/* Banco de Puzzles Curados */}
          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs relative flex-1 min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Banco de Puzzles Táticos
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {filteredPuzzles.length} disponíveis
              </span>
            </div>

            {/* Theme filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3">
              {themes.map((th) => (
                <button
                  key={th}
                  onClick={() => setSelectedTheme(th)}
                  className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                    selectedTheme === th
                      ? 'bg-[#8AA7E1] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {th}
                </button>
              ))}
            </div>

            {/* Puzzles List */}
            <div className="absolute inset-x-5 top-[112px] bottom-5 overflow-y-auto pr-1">
              <div className="space-y-2">
              {filteredPuzzles.map((p, idx) => {
                const puzzleTurn = p.fen.split(' ')[1] as 'w' | 'b';
                const puzzleTheme = p.themes[0] || 'Tático';
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentPuzzle(p)}
                    className={`w-full p-3 rounded-2xl text-left border transition-all flex items-center justify-between ${
                      p === currentPuzzle
                        ? 'bg-[#EDE7FF] border-[#8B5CF6]/40 text-slate-900 shadow-xs'
                        : 'bg-[#F7F9FC] hover:bg-slate-100 border-[#DDE3EA] text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">Puzzle #{idx + 1}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                          {puzzleTheme}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Vez das {puzzleTurn === 'w' ? 'Brancas' : 'Pretas'} • Rating ~{p.rating}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
