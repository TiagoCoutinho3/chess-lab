import React from 'react';

interface PieceIconProps {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: 'w' | 'b';
  className?: string;
}

export const PieceIcon: React.FC<PieceIconProps> = ({ type, color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';

  // Crisp, modern SVG chess piece shapes
  switch (type) {
    case 'p':
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          {isWhite ? (
            <path
              d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
              fill="#FFFFFF"
              stroke="#2C3E50"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
              fill="#263238"
              stroke="#0F172A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      );

    case 'n':
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          {isWhite ? (
            <path
              d="M22 10c-3.5 0-6 2-7 6 0 1-1 4-2 5s-2 3-2 5c0 3 2 5 4 5h1c0 2 1 4 2 5 2 2 4 3 7 3 2 0 4-1 6-3 1-1 2-3 2-5 0-4-3-7-3-10 0-4-3-6-8-6z M14 18c.5-1.5 1.5-2 3-2 M20 25c1 0 2 .5 2 1.5s-.5 1.5-2 1.5"
              fill="#FFFFFF"
              stroke="#2C3E50"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : (
            <path
              d="M22 10c-3.5 0-6 2-7 6 0 1-1 4-2 5s-2 3-2 5c0 3 2 5 4 5h1c0 2 1 4 2 5 2 2 4 3 7 3 2 0 4-1 6-3 1-1 2-3 2-5 0-4-3-7-3-10 0-4-3-6-8-6z M14 18c.5-1.5 1.5-2 3-2 M20 25c1 0 2 .5 2 1.5s-.5 1.5-2 1.5"
              fill="#263238"
              stroke="#0F172A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
      );

    case 'b':
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          {isWhite ? (
            <g stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill="#FFFFFF" />
              <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill="#FFFFFF" />
              <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="#FFFFFF" />
              <path d="M17.5 26h10M15 30h15" />
            </g>
          ) : (
            <g stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" fill="#263238" />
              <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" fill="#263238" />
              <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" fill="#263238" />
              <path d="M17.5 26h10M15 30h15" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      );

    case 'r':
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          {isWhite ? (
            <g stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" fill="#FFFFFF" />
              <path d="M34 14l-3 3H14l-3-3" fill="#FFFFFF" />
              <path d="M31 17v12.5H14V17" fill="#FFFFFF" />
              <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" fill="#FFFFFF" />
            </g>
          ) : (
            <g stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" fill="#263238" />
              <path d="M34 14l-3 3H14l-3-3" fill="#263238" />
              <path d="M31 17v12.5H14V17" fill="#263238" />
              <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" fill="#263238" />
            </g>
          )}
        </svg>
      );

    case 'q':
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          {isWhite ? (
            <g stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" fill="#FFFFFF" />
              <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#FFFFFF" />
              <circle cx="6" cy="12" r="2" fill="#FFFFFF" />
              <circle cx="14" cy="9" r="2" fill="#FFFFFF" />
              <circle cx="22.5" cy="8" r="2" fill="#FFFFFF" />
              <circle cx="31" cy="9" r="2" fill="#FFFFFF" />
              <circle cx="39" cy="12" r="2" fill="#FFFFFF" />
            </g>
          ) : (
            <g stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25l-7-11 2 12z" fill="#263238" />
              <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" fill="#263238" />
              <circle cx="6" cy="12" r="2" fill="#263238" />
              <circle cx="14" cy="9" r="2" fill="#263238" />
              <circle cx="22.5" cy="8" r="2" fill="#263238" />
              <circle cx="31" cy="9" r="2" fill="#263238" />
              <circle cx="39" cy="12" r="2" fill="#263238" />
            </g>
          )}
        </svg>
      );

    case 'k':
      return (
        <svg viewBox="0 0 45 45" className={className} fill="none">
          {isWhite ? (
            <g stroke="#2C3E50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.5 11.63V6M20 8h5" />
              <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#FFFFFF" />
              <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-6 2.5-6 2.5s-.5-1.5-2-2.5c-3-2-4-1.5-4-1.5s-1-2.5-3-2.5-3 2.5-3 2.5-1-.5-4 1.5c-1.5 1-2 2.5-2 2.5s-2-3.5-6-2.5c-3 6 6 10.5 6 10.5v7z" fill="#FFFFFF" />
              <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" />
            </g>
          ) : (
            <g stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.5 11.63V6M20 8h5" stroke="#FFFFFF" strokeWidth="2" />
              <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#263238" />
              <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-6 2.5-6 2.5s-.5-1.5-2-2.5c-3-2-4-1.5-4-1.5s-1-2.5-3-2.5-3 2.5-3 2.5-1-.5-4 1.5c-1.5 1-2 2.5-2 2.5s-2-3.5-6-2.5c-3 6 6 10.5 6 10.5v7z" fill="#263238" />
              <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" stroke="#FFFFFF" strokeWidth="1.5" />
            </g>
          )}
        </svg>
      );

    default:
      return null;
  }
};
