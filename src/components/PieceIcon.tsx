import React from 'react';
import Piece from 'react-chess-pieces';

interface PieceIconProps {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
  className?: string;
}

export const PieceIcon: React.FC<PieceIconProps> = ({ type, color, className = 'w-full h-full' }) => {
  const pieceKey = `${color === 'w' ? 'w' : 'b'}${type.toUpperCase()}`;

  return (
    <Piece
      piece={pieceKey}
      className={className}
    />
  );
};
