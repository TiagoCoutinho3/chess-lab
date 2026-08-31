import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Opening } from '../types';
import { OPENINGS_DATABASE } from '../data/openingsData';
import { Chess, Square } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { OpeningsTreeList } from '../components/OpeningsTreeList';
import { sounds } from '../utils/audio';
import {
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Award,
} from 'lucide-react';

export const OpeningsView: React.FC = () => {
  const [selectedOpening, setSelectedOpening] = useState<Opening>(OPENINGS_DATABASE[1]); // Skip first entry which is a template
  const [mode, setMode] = useState<'explorar' | 'treinar'>('explorar');
  const [chess, setChess] = useState<Chess>(new Chess());
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState(0);
  const [trainingFeedback, setTrainingFeedback] = useState<{
    status: 'idle' | 'correct' | 'wrong' | 'completed';
    message: string;
  }>({ status: 'idle', message: '' });

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

  // Parse PGN to get moves
  const movesSan = useMemo(() => {
    if (!selectedOpening.pgn) return [];
    const tempChess = new Chess();
    const moves: string[] = [];
    const pgnMoves = selectedOpening.pgn.split(/\d+\./).filter(m => m.trim());
    pgnMoves.forEach(movePair => {
      const individualMoves = movePair.trim().split(/\s+/);
      individualMoves.forEach(move => {
        if (move && move !== '*' && !move.includes('1-0') && !move.includes('0-1') && !move.includes('1/2')) {
          moves.push(move);
        }
      });
    });
    return moves;
  }, [selectedOpening.pgn]);

  // Reset board when opening or mode changes
  useEffect(() => {
    resetOpeningBoard();
  }, [selectedOpening, mode]);

  const resetOpeningBoard = () => {
    const newChess = new Chess();
    setChess(newChess);
    setCurrentStepIndex(0);
    setLastMove(null);
    setTrainingFeedback({
      status: 'idle',
      message: mode === 'treinar' ? 'Faça o lance das Brancas no tabuleiro!' : '',
    });
  };

  // Step Forward in Explorar Mode
  const handleStepForward = () => {
    if (currentStepIndex < movesSan.length) {
      const nextMoveSan = movesSan[currentStepIndex];
      const newChess = new Chess(chess.fen());
      const res = newChess.move(nextMoveSan);
      if (res) {
        setChess(newChess);
        setCurrentStepIndex((prev) => prev + 1);
        setLastMove({ from: res.from, to: res.to });
        if (res.captured) sounds.playCapture();
        else sounds.playMove();
      }
    }
  };

  // Step Backward in Explorar Mode
  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      const newChess = new Chess();
      let lastMoveFrom = '';
      let lastMoveTo = '';
      for (let i = 0; i < currentStepIndex - 1; i++) {
        const result = newChess.move(movesSan[i]);
        if (result) {
          lastMoveFrom = result.from;
          lastMoveTo = result.to;
        }
      }
      setChess(newChess);
      setCurrentStepIndex((prev) => prev - 1);
      if (currentStepIndex - 1 > 0 && lastMoveFrom && lastMoveTo) {
        setLastMove({ from: lastMoveFrom, to: lastMoveTo });
      } else {
        setLastMove(null);
      }
      sounds.playMove();
    }
  };

  // Interactive Move in Treinar Mode
  const handleTrainingMove = (moveData: { from: string; to: string; promotion?: string }): boolean => {
    if (mode !== 'treinar') return false;
    if (currentStepIndex >= movesSan.length) return false;

    const expectedSan = movesSan[currentStepIndex];
    const testChess = new Chess(chess.fen());

    try {
      const moveResult = testChess.move({
        from: moveData.from as Square,
        to: moveData.to as Square,
        promotion: moveData.promotion || 'q',
      });

      if (!moveResult) return false;

      // Check if move matches expected theory move
      if (moveResult.san === expectedSan) {
        sounds.playMove();
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setChess(testChess);
        setLastMove({ from: moveResult.from, to: moveResult.to });

        // Check if finished
        if (nextIndex >= movesSan.length) {
          sounds.playVictory();
          setTrainingFeedback({
            status: 'completed',
            message: '🎉 Parabéns! Você completou toda a linha principal desta abertura com perfeição!',
          });
          return true;
        }

        // Auto-respond with Black's theoretical move after 500ms
        setTrainingFeedback({
          status: 'correct',
          message: `Ótimo lance! (${moveResult.san})`,
        });

        setTimeout(() => {
          if (nextIndex < movesSan.length) {
            const blackMoveSan = movesSan[nextIndex];
            const autoChess = new Chess(testChess.fen());
            const autoRes = autoChess.move(blackMoveSan);
            if (autoRes) {
              if (autoRes.captured) sounds.playCapture();
              else sounds.playMove();
              setChess(autoChess);
              setLastMove({ from: autoRes.from, to: autoRes.to });
              setCurrentStepIndex(nextIndex + 1);

              if (nextIndex + 1 >= movesSan.length) {
                sounds.playVictory();
                setTrainingFeedback({
                  status: 'completed',
                  message: '🎉 Linha completada com sucesso!',
                });
              } else {
                setTrainingFeedback({
                  status: 'idle',
                  message: 'Sua vez! Encontre o próximo lance das Brancas.',
                });
              }
            }
          }
        }, 500);

        return true;
      } else {
        // Wrong move
        sounds.playDefeat();
        setTrainingFeedback({
          status: 'wrong',
          message: `Lance incorreto (${moveResult.san}). O lance teórico era ${expectedSan}. Tente novamente!`,
        });
        return false;
      }
    } catch {
      return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#DDE3EA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#BDE7C9]/40 border border-[#BDE7C9] flex items-center justify-center text-[#166534]">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">{selectedOpening.name}</h1>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-[#EDE7FF] text-[#5B21B6]">
                {selectedOpening.eco}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Código ECO
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs (EXPLORAR vs TREINAR) */}
        <div className="flex items-center gap-1 bg-[#F7F9FC] p-1.5 rounded-2xl border border-[#DDE3EA]">
          <button
            id="opening-tab-explore"
            onClick={() => setMode('explorar')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'explorar'
                ? 'bg-white text-[#8AA7E1] shadow-xs border border-[#8AA7E1]/30'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            EXPLORAR
          </button>
          <button
            id="opening-tab-train"
            onClick={() => setMode('treinar')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'treinar'
                ? 'bg-white text-[#166534] shadow-xs border border-[#22C55E]/30'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            TREINAR
          </button>
        </div>
      </div>

      {/* Main Grid: Board + Opening Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Chess Board */}
        <div ref={leftColumnRef} className="lg:col-span-6 flex flex-col items-center">
          <ChessBoard
            chess={chess}
            onMove={handleTrainingMove}
            interactive={mode === 'treinar'}
            lastMove={lastMove}
          />

          {/* Controls Bar for Explorar Mode */}
          {mode === 'explorar' && (
            <div className="w-full max-w-[560px] flex items-center justify-between gap-3 mt-4 bg-white p-3 rounded-2xl border border-[#DDE3EA]">
              <button
                onClick={resetOpeningBoard}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Início</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStepBackward}
                  disabled={currentStepIndex === 0}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs rounded-xl transition-all"
                >
                  ← Anterior
                </button>
                <span className="text-xs font-mono text-slate-500 px-2">
                  {currentStepIndex} / {movesSan.length}
                </span>
                <button
                  onClick={handleStepForward}
                  disabled={currentStepIndex >= movesSan.length}
                  className="px-4 py-2 bg-[#8AA7E1] hover:bg-[#7292D6] disabled:opacity-40 text-white font-bold text-xs rounded-xl transition-all shadow-xs"
                >
                  Próximo →
                </button>
              </div>
            </div>
          )}

          {/* Feedback Banner for Treinar Mode */}
          {mode === 'treinar' && (
            <div className="w-full max-w-[560px] mt-4">
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                  trainingFeedback.status === 'completed'
                    ? 'bg-[#BDE7C9]/40 border-[#BDE7C9] text-[#166534]'
                    : trainingFeedback.status === 'correct'
                    ? 'bg-[#BDE7C9]/30 border-[#BDE7C9] text-[#166534]'
                    : trainingFeedback.status === 'wrong'
                    ? 'bg-[#FFD6E0]/40 border-[#FFD6E0] text-[#9F1239]'
                    : 'bg-white border-[#DDE3EA] text-slate-700'
                }`}
              >
                {trainingFeedback.status === 'completed' ? (
                  <Award className="w-6 h-6 text-[#166534] shrink-0" />
                ) : trainingFeedback.status === 'wrong' ? (
                  <AlertCircle className="w-5 h-5 text-[#9F1239] shrink-0" />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#8AA7E1] shrink-0" />
                )}
                <div className="flex-1 text-xs font-semibold">
                  {trainingFeedback.message || 'Faça os lances teóricos no tabuleiro para praticar a abertura.'}
                </div>
                {trainingFeedback.status === 'completed' && (
                  <button
                    onClick={resetOpeningBoard}
                    className="px-3 py-1.5 bg-[#166534] text-white text-xs font-bold rounded-xl"
                  >
                    Treinar de Novo
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Theory, Main Lines & Opening Selector */}
        <div
          className="lg:col-span-6 flex flex-col gap-4 overflow-hidden min-h-0"
          style={{ height: leftHeight ? `${leftHeight}px` : 'auto' }}
        >

          {/* Linha Principal Moves List */}
          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs flex-shrink-0">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Linha Principal (PGN)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Array.from({ length: Math.ceil(movesSan.length / 2) }).map((_, i) => {
                const whiteM = movesSan[i * 2];
                const blackM = movesSan[i * 2 + 1];
                const isCurrent = currentStepIndex >= i * 2;

                return (
                  <div
                    key={i}
                    className={`p-2 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all ${
                      isCurrent
                        ? 'bg-[#EDE7FF] border-[#8B5CF6]/30 text-slate-900 font-bold'
                        : 'bg-[#F7F9FC] border-[#DDE3EA] text-slate-500'
                    }`}
                  >
                    <span className="text-slate-400">{i + 1}.</span>
                    <span className="text-slate-800">{whiteM}</span>
                    <span className="text-slate-600">{blackM || ''}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Banco de Aberturas List Selector */}
          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs flex-1 flex flex-col min-h-[360px] overflow-hidden">
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Outras Aberturas no Banco ECO
              </h3>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <OpeningsTreeList
                openings={OPENINGS_DATABASE.slice(1)}
                selectedOpening={selectedOpening}
                onSelectOpening={setSelectedOpening}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
