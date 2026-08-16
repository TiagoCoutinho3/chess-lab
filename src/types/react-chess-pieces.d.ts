declare module 'react-chess-pieces' {
  import { ComponentType } from 'react';

  interface PieceProps {
    piece: string;
    className?: string;
    [key: string]: any;
  }

  const Piece: ComponentType<PieceProps>;
  export default Piece;
}
