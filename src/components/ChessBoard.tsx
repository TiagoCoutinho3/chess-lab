import React, { useState, useEffect, useRef } from 'react';
import { Chess, Square, PieceSymbol, Color } from 'chess.js';
import { PieceIcon } from './PieceIcon';
import { sounds } from '../utils/audio';

interface ChessBoardProps {
  chess: Chess;
  onMove: (move: { from: string; to: string; promotion?: string }) => boolean | Promise<boolean>;
  orientation?: 'white' | 'black';
  disabled?: boolean;
  hintMove?: { from: string; to: string } | null;
  lastMove?: { from: string; to: string } | null;
  customSquareStyles?: Record<string, string>;
  interactive?: boolean;
  boardColors?: { light: string; dark: string };
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  chess,
  onMove,
  orientation = 'white',
  disabled = false,
  hintMove = null,
  lastMove = null,
  customSquareStyles = {},
  interactive = true,
  boardColors = { light: '#FFFFFF', dark: '#C2D8F7' },
}) => {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [draggedSquare, setDraggedSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Files and Ranks based on orientation
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayFiles = orientation === 'white' ? files : [...files].reverse();
  const displayRanks = orientation === 'white' ? ranks : [...ranks].reverse();

  // Reset selection on external turn change or game reset
  useEffect(() => {
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [chess.fen()]);

  // Calculate king in check square
  const inCheck = chess.inCheck();
  let kingInCheckSquare: string | null = null;
  if (inCheck) {
    const turn = chess.turn();
    const board = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === turn) {
          kingInCheckSquare = `${files[c]}${8 - r}`;
          break;
        }
      }
    }
  }

  const handleSquareClick = (square: string) => {
    if (disabled || !interactive) return;

    // If currently selecting a promotion piece, ignore square clicks
    if (pendingPromotion) return;

    const piece = chess.get(square as Square);

    // If a square was already selected
    if (selectedSquare) {
      if (selectedSquare === square) {
        // Deselect
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Check if target square is in legal moves
      if (legalMoves.includes(square)) {
        attemptMove(selectedSquare, square);
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // If clicked on own piece of same turn, select that instead
      if (piece && piece.color === chess.turn()) {
        selectSquare(square);
        return;
      }

      // Otherwise cancel selection
      setSelectedSquare(null);
      setLegalMoves([]);
    } else {
      // First click on a piece
      if (piece && piece.color === chess.turn()) {
        selectSquare(square);
      }
    }
  };

  const selectSquare = (square: string) => {
    setSelectedSquare(square);
    const moves = chess.moves({ square: square as Square, verbose: true });
    setLegalMoves(moves.map(m => m.to));
  };

  const attemptMove = async (from: string, to: string) => {
    const piece = chess.get(from as Square);
    if (!piece) return;

    // Check for pawn promotion (reaching 8th or 1st rank)
    const isPawn = piece.type === 'p';
    const isPromotionRank = (piece.color === 'w' && to.endsWith('8')) || (piece.color === 'b' && to.endsWith('1'));

    if (isPawn && isPromotionRank) {
      setPendingPromotion({ from, to });
      return;
    }

    const success = await onMove({ from, to });
    if (success) {
      // sounds played inside onMove handler
    }
  };

  const handlePromotionChoice = async (promotionPiece: 'q' | 'r' | 'b' | 'n') => {
    if (!pendingPromotion) return;
    await onMove({ from: pendingPromotion.from, to: pendingPromotion.to, promotion: promotionPiece });
    setPendingPromotion(null);
  };

  // Drag and Drop
  const handleDragStart = (e: React.DragEvent, square: string) => {
    if (disabled || !interactive) {
      e.preventDefault();
      return;
    }
    const piece = chess.get(square as Square);
    if (!piece || piece.color !== chess.turn()) {
      e.preventDefault();
      return;
    }
    setDraggedSquare(square);
    selectSquare(square);
    e.dataTransfer.setData('text/plain', square);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSquare: string) => {
    e.preventDefault();
    const sourceSquare = e.dataTransfer.getData('text/plain') || draggedSquare;
    if (sourceSquare && sourceSquare !== targetSquare) {
      if (legalMoves.includes(targetSquare)) {
        attemptMove(sourceSquare, targetSquare);
      }
    }
    setDraggedSquare(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  // Helper to get SVG coordinates for Hint Arrow
  const getSquareCenter = (square: string): { x: number; y: number } => {
    const file = square[0];
    const rank = square[1];
    const colIdx = displayFiles.indexOf(file);
    const rowIdx = displayRanks.indexOf(rank);
    return {
      x: colIdx * 12.5 + 6.25,
      y: rowIdx * 12.5 + 6.25,
    };
  };

  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto select-none rounded-2xl shadow-xl overflow-hidden border-4 border-[#8AA7E1]/30 bg-[#8AA7E1]/10">
      <div
        ref={boardRef}
        className="w-full h-full grid grid-cols-8 grid-rows-8"
        id="chess-board"
      >
        {displayRanks.map((rank, rIdx) =>
          displayFiles.map((file, cIdx) => {
            const square = `${file}${rank}`;
            const isLight = (files.indexOf(file) + parseInt(rank)) % 2 !== 0;
            const piece = chess.get(square as Square);

            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);
            const isLastMoveSource = lastMove?.from === square;
            const isLastMoveTarget = lastMove?.to === square;
            const isHintSource = hintMove?.from === square;
            const isHintTarget = hintMove?.to === square;
            const isKingInCheck = kingInCheckSquare === square;

            // Colors matching ChessLab Brand Guide or custom bot colors
            let bgStyle: React.CSSProperties = isLight 
              ? { backgroundColor: boardColors.light } 
              : { backgroundColor: boardColors.dark };
            let bgClass = '';

            if (isLastMoveSource || isLastMoveTarget) {
              bgClass = isLight ? 'bg-[#FFF1C7]' : 'bg-[#FFE699]';
              bgStyle = {};
            }
            if (isSelected) {
              bgClass = 'bg-[#EDE7FF] ring-2 ring-inset ring-[#8B5CF6]';
              bgStyle = {};
            }
            if (isHintSource || isHintTarget) {
              bgClass = 'bg-[#BDE7C9]/80 ring-2 ring-inset ring-[#166534]';
              bgStyle = {};
            }
            if (isKingInCheck) {
              bgClass = 'bg-[#FFD6E0] ring-4 ring-inset ring-[#F43F5E] animate-pulse';
              bgStyle = {};
            }

            return (
              <div
                key={square}
                id={`square-${square}`}
                onClick={() => handleSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 ${bgClass}`}
                style={bgStyle}
              >
                {/* Coordinates labels */}
                {cIdx === 0 && (
                  <span
                    className={`absolute top-1 left-1.5 text-[10px] sm:text-[11px] font-bold pointer-events-none ${
                      isLight ? 'text-[#8AA7E1]' : 'text-[#4A6FA5]'
                    }`}
                  >
                    {rank}
                  </span>
                )}
                {rIdx === 7 && (
                  <span
                    className={`absolute bottom-1 right-1.5 text-[10px] sm:text-[11px] font-bold pointer-events-none ${
                      isLight ? 'text-[#8AA7E1]' : 'text-[#4A6FA5]'
                    }`}
                  >
                    {file}
                  </span>
                )}

                {/* Piece Icon */}
                {piece && (
                  <div
                    draggable={interactive && !disabled && piece.color === chess.turn()}
                    onDragStart={(e) => handleDragStart(e, square)}
                    className={`w-[84%] h-[84%] flex items-center justify-center z-10 transition-transform ${
                      piece.color === chess.turn() && interactive && !disabled
                        ? 'hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing'
                        : ''
                    }`}
                  >
                    <PieceIcon type={piece.type} color={piece.color} />
                  </div>
                )}

                {/* Legal Move Indicators */}
                {isLegalMove && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    {piece ? (
                      // Capture target ring
                      <div className="w-[85%] h-[85%] rounded-full border-4 border-[#8AA7E1] bg-[#8AA7E1]/20 animate-pulse" />
                    ) : (
                      // Quiet move dot
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#8AA7E1] shadow-md ring-2 ring-white/80" />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Dynamic Hint Arrow Overlay */}
      {hintMove && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-30"
          viewBox="0 0 100 100"
        >
          <defs>
            <marker
              id="hint-arrowhead"
              markerWidth="6"
              markerHeight="6"
              refX="4"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 6 3, 0 6" fill="#166534" />
            </marker>
          </defs>
          {(() => {
            const start = getSquareCenter(hintMove.from);
            const end = getSquareCenter(hintMove.to);
            return (
              <>
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="#166534"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                  markerEnd="url(#hint-arrowhead)"
                  opacity="0.85"
                />
                <circle cx={end.x} cy={end.y} r="3" fill="#BDE7C9" stroke="#166534" strokeWidth="1.5" />
              </>
            );
          })()}
        </svg>
      )}

      {/* Pawn Promotion Modal */}
      {pendingPromotion && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-4 rounded-2xl shadow-2xl border-2 border-[#8AA7E1] text-center max-w-[280px]">
            <h4 className="text-sm font-bold text-slate-800 mb-3">Escolha a Promoção</h4>
            <div className="grid grid-cols-4 gap-2">
              {(['q', 'r', 'b', 'n'] as const).map((pType) => (
                <button
                  key={pType}
                  id={`promote-${pType}`}
                  onClick={() => handlePromotionChoice(pType)}
                  className="w-14 h-14 bg-[#F7F9FC] hover:bg-[#EDE7FF] border border-[#DDE3EA] hover:border-[#8B5CF6] rounded-xl flex items-center justify-center p-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
                >
                  <PieceIcon type={pType} color={chess.turn()} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
