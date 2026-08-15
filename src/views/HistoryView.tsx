import React, { useState } from 'react';
import { PlayedGame, UserStats } from '../types';
import { getStoredGames, getUserStats } from '../utils/storage';
import { getBotAvatarUrl, getUserAvatarUrl } from '../data/botsData';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import {
  History,
  Trophy,
  Award,
  TrendingUp,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Eye,
  Calendar,
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const [games, setGames] = useState<PlayedGame[]>(getStoredGames());
  const [stats, setStats] = useState<UserStats>(getUserStats());
  const [selectedGameForReplay, setSelectedGameForReplay] = useState<PlayedGame | null>(
    games.length > 0 ? games[0] : null
  );

  // Replay state
  const [replayChess, setReplayChess] = useState<Chess>(new Chess());
  const [replayMoveIndex, setReplayMoveIndex] = useState<number>(0);

  const handleSelectGame = (game: PlayedGame) => {
    setSelectedGameForReplay(game);
    const newChess = new Chess();
    setReplayChess(newChess);
    setReplayMoveIndex(0);
  };

  const handleReplayStep = (index: number) => {
    if (!selectedGameForReplay) return;
    const targetChess = new Chess();
    for (let i = 0; i <= index && i < selectedGameForReplay.moves.length; i++) {
      targetChess.move(selectedGameForReplay.moves[i]);
    }
    setReplayChess(targetChess);
    setReplayMoveIndex(index + 1);
  };

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fadeIn">
      {/* Top Header & Analytics Cards */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE7FF] border border-[#CDB4DB] flex items-center justify-center text-[#5B21B6]">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Histórico de Partidas</h1>
            <p className="text-xs text-slate-500">
              Revise suas partidas, analise seus lances e acompanhe sua evolução
            </p>
          </div>
        </div>

        {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs">
            <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Total de Jogos</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">{stats.gamesPlayed}</span>
              <span className="text-xs font-semibold text-slate-500">partidas</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              {stats.wins}V • {stats.draws}E • {stats.losses}D
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs">
            <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Taxa de Vitória</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600">{winRate}%</span>
              <span className="text-xs font-semibold text-emerald-700">aproveitamento</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#BDE7C9] h-full" style={{ width: `${winRate}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs">
            <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Puzzles Resolvidos</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#1E40AF]">{stats.puzzlesSolved}</span>
              <span className="text-xs font-semibold text-slate-500">desafios</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Ofensiva: {stats.puzzleStreak} dias seguidos
            </span>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs">
            <span className="text-slate-400 text-xs uppercase font-bold block mb-1">Abertura Favorita</span>
            <span className="text-sm font-bold text-slate-800 line-clamp-1 mt-1 block">
              {stats.favoriteOpening}
            </span>
            <span className="text-[11px] text-slate-400 mt-3 block">
              Rating Estimado: <strong className="text-slate-700 font-mono">{stats.ratingEstimate}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Game List + Replay Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Games List */}
        <div className="lg:col-span-6 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Partidas Salvas
          </h2>

          <div className="space-y-2.5">
            {games.map((game) => {
              const isSelected = selectedGameForReplay?.id === game.id;
              const isWin = game.result === '1-0' && game.playerColor === 'w' || game.result === '0-1' && game.playerColor === 'b';
              const isDraw = game.result === '1/2-1/2';

              return (
                <div
                  key={game.id}
                  onClick={() => handleSelectGame(game)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white border-[#8AA7E1] ring-2 ring-[#8AA7E1] shadow-md'
                      : 'bg-white hover:bg-slate-50 border-[#DDE3EA]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={getBotAvatarUrl(game.botAvatarSeed)}
                      alt={game.botName}
                      className="w-12 h-12 rounded-2xl bg-slate-100 p-0.5 border border-[#DDE3EA]"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-800">{game.botName}</h4>
                        <span className="text-[10px] text-slate-400 font-semibold">Nível {game.botLevel}</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {game.openingName || 'Partida Casual'} • {game.movesCount} lances
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {game.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isWin
                          ? 'bg-[#BDE7C9] text-[#166534]'
                          : isDraw
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-[#FFD6E0] text-[#9F1239]'
                      }`}
                    >
                      {isWin ? 'Vitória' : isDraw ? 'Empate' : 'Derrota'} ({game.result})
                    </span>
                    {game.playerAccuracy && (
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Precisão: {game.playerAccuracy}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Interactive Replay Viewer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  Replay da Partida vs {selectedGameForReplay?.botName || 'Bot'}
                </h3>
                <span className="text-xs text-slate-500">
                  {selectedGameForReplay?.openingName || 'Revisão lance a lance'}
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                {selectedGameForReplay?.result}
              </span>
            </div>

            {/* Replay Board */}
            <ChessBoard chess={replayChess} interactive={false} onMove={() => false} />

            {/* Step Controls */}
            {selectedGameForReplay && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleReplayStep(-1)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold rounded-xl text-slate-700"
                  >
                    ⏮ Início
                  </button>
                  <button
                    onClick={() => handleReplayStep(Math.max(-1, replayMoveIndex - 2))}
                    disabled={replayMoveIndex <= 0}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-xs font-bold rounded-xl text-slate-700"
                  >
                    ◀ Anterior
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {replayMoveIndex} / {selectedGameForReplay.moves.length}
                  </span>
                  <button
                    onClick={() => handleReplayStep(Math.min(selectedGameForReplay.moves.length - 1, replayMoveIndex))}
                    disabled={replayMoveIndex >= selectedGameForReplay.moves.length}
                    className="px-4 py-2 bg-[#8AA7E1] hover:bg-[#7292D6] disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Próximo ▶
                  </button>
                </div>

                {/* Move List Badges */}
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#F7F9FC] rounded-2xl border border-slate-100">
                  {selectedGameForReplay.moves.map((m, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleReplayStep(idx)}
                      className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                        idx === replayMoveIndex - 1
                          ? 'bg-[#8AA7E1] text-white'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {idx % 2 === 0 ? `${idx / 2 + 1}. ` : ''}
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
