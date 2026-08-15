import React from 'react';
import { ViewTab, Bot } from '../types';
import { BOTS_LIST, getBotAvatarUrl, getUserAvatarUrl } from '../data/botsData';
import { getStoredGames, getUserStats } from '../utils/storage';
import { getDailyPuzzle, getFormattedTodayDate } from '../data/puzzlesData';
import {
  Bot as BotIcon,
  Puzzle as PuzzleIcon,
  BookOpen,
  History,
  Swords,
  ChevronRight,
  Trophy,
  Flame,
  Award,
  Sparkles,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: ViewTab) => void;
  onSelectBotToPlay: (bot: Bot) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onSelectBotToPlay }) => {
  const stats = getUserStats();
  const games = getStoredGames();
  const lastGame = games.length > 0 ? games[0] : null;
  const dailyPuzzle = getDailyPuzzle();
  const todayDateStr = getFormattedTodayDate();

  // Featured bot is ByteMaster (or top bot)
  const byteMaster = BOTS_LIST.find((b) => b.id === 'bytemaster') || BOTS_LIST[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-br from-white via-[#F7F9FC] to-[#EDE7FF]/40 rounded-3xl p-6 sm:p-8 border border-[#DDE3EA] shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE7FF] text-[#5B21B6] text-xs font-bold mb-3 border border-[#8B5CF6]/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ChessLab v1.0 • Plataforma Pessoal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Bem-vindo de volta!
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
            O que você quer fazer hoje? Jogue contra nossos bots com personalidades únicas, pratique aberturas ou desafie sua mente com o puzzle do dia.
          </p>

          {/* Quick Stats Pill Bar */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-6 pt-6 border-t border-slate-200/70 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#A6C8FF]/30 text-[#1E40AF] flex items-center justify-center font-bold">
                <Trophy className="w-4 h-4 text-[#1E40AF]" />
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Partidas</span>
                <span className="font-bold text-slate-800 text-sm">{stats.gamesPlayed} jogos ({stats.wins}V)</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#FFF1C7] text-[#854D0E] flex items-center justify-center font-bold">
                <Flame className="w-4 h-4 text-[#854D0E]" />
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Ofensiva</span>
                <span className="font-bold text-slate-800 text-sm">{stats.puzzleStreak} dias seguidos</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#BDE7C9] text-[#166534] flex items-center justify-center font-bold">
                <Award className="w-4 h-4 text-[#166534]" />
              </div>
              <div>
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Rating Estimado</span>
                <span className="font-bold text-slate-800 text-sm font-mono">{stats.ratingEstimate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Floating Chess Icon Shape */}
        <div className="absolute right-4 -bottom-6 w-48 h-48 opacity-10 sm:opacity-20 pointer-events-none text-[#8AA7E1]">
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
            <path d="M19 22H5v-2h14v2M19 19H5l1-5h12l1 5m-4.5-9.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5c-1.4 0-2-1.5-3.5-1.5s-2 1.5-3.5 1.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5c1.4 0 2 1.5 3.5 1.5s2.1-1.5 3.5-1.5M16 4l2 4H6l2-4h8z" />
          </svg>
        </div>
      </div>

      {/* Main 4 Action Cards Grid (Matching the Brand Guide) */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Acesso Rápido
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. JOGAR */}
          <div
            id="home-action-play"
            onClick={() => onNavigate('play')}
            className="group bg-white rounded-3xl p-6 border border-[#DDE3EA] hover:border-[#8AA7E1] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#A6C8FF]/30 border border-[#A6C8FF]/50 flex items-center justify-center text-[#1E40AF] mb-4 group-hover:scale-110 transition-transform">
                <BotIcon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-[#8AA7E1] transition-colors flex items-center justify-between">
                <span>JOGAR</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Partida contra bots</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                12 oponentes virtuais com diferentes estilos e níveis de dificuldade.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#8AA7E1]">
              <span>Iniciar partida</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* 2. PUZZLES */}
          <div
            id="home-action-puzzles"
            onClick={() => onNavigate('puzzles')}
            className="group bg-white rounded-3xl p-6 border border-[#DDE3EA] hover:border-[#FFD6E0] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FFD6E0]/40 border border-[#FFD6E0] flex items-center justify-center text-[#9F1239] mb-4 group-hover:scale-110 transition-transform">
                <PuzzleIcon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-[#9F1239] transition-colors flex items-center justify-between">
                <span>PUZZLES</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Desafio do dia</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Treine sua visão tática com problemas de mates, garfos e cravadas.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#9F1239]">
              <span>Resolver puzzle</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* 3. ABERTURAS */}
          <div
            id="home-action-openings"
            onClick={() => onNavigate('openings')}
            className="group bg-white rounded-3xl p-6 border border-[#DDE3EA] hover:border-[#BDE7C9] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#BDE7C9]/40 border border-[#BDE7C9] flex items-center justify-center text-[#166534] mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-[#166534] transition-colors flex items-center justify-between">
                <span>ABERTURAS</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Estude e treine</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Banco ECO com explicações estratégicas e modo interativo de treino.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#166534]">
              <span>Explorar banco</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>

          {/* 4. HISTÓRICO */}
          <div
            id="home-action-history"
            onClick={() => onNavigate('history')}
            className="group bg-white rounded-3xl p-6 border border-[#DDE3EA] hover:border-[#CDB4DB] hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#EDE7FF] border border-[#CDB4DB] flex items-center justify-center text-[#5B21B6] mb-4 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-[#5B21B6] transition-colors flex items-center justify-between">
                <span>HISTÓRICO</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">Suas partidas</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Revise suas jogadas, taxa de vitórias e evolução em cada abertura.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-[#5B21B6]">
              <span>Ver estatísticas</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Última Partida & Puzzle do Dia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ÚLTIMA PARTIDA CARD (Matching mockup) */}
        <div className="bg-white rounded-3xl p-6 border border-[#DDE3EA] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Última Partida
              </h3>
              {lastGame && (
                <span className="text-xs text-slate-500 font-medium">{lastGame.date}</span>
              )}
            </div>

            {lastGame ? (
              <div className="bg-[#F7F9FC] rounded-2xl p-4 border border-[#DDE3EA]">
                <div className="flex items-center justify-between gap-4">
                  {/* Player side */}
                  <div className="flex items-center gap-3">
                    <img
                      src={getUserAvatarUrl()}
                      alt="Você"
                      className="w-12 h-12 rounded-xl bg-[#8AA7E1]/20 p-1 border border-[#8AA7E1]/30"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Você</h4>
                      <span className="text-[11px] font-semibold text-emerald-600">
                        {lastGame.result === '1-0' ? 'Vitória' : lastGame.result === '1/2-1/2' ? 'Empate' : 'Derrota'}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-center px-3 py-1.5 bg-white rounded-xl border border-[#DDE3EA] shadow-xs">
                    <span className="font-mono font-black text-lg text-slate-800">
                      {lastGame.result}
                    </span>
                  </div>

                  {/* Bot side */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <h4 className="font-bold text-sm text-slate-800">{lastGame.botName}</h4>
                      <span className="text-[11px] text-slate-500">Nível {lastGame.botLevel}</span>
                    </div>
                    <img
                      src={getBotAvatarUrl(lastGame.botAvatarSeed)}
                      alt={lastGame.botName}
                      className="w-12 h-12 rounded-xl bg-slate-100 p-1 border border-[#DDE3EA]"
                    />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Abertura: {lastGame.openingName || 'Partida Aberta'}</span>
                  <span>{lastGame.movesCount} lances</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                Nenhuma partida registrada ainda. Inicie um jogo contra um bot!
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onNavigate('play')}
              className="flex-1 py-3 px-4 bg-[#8AA7E1] hover:bg-[#7292D6] text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4" />
              <span>Jogar Novamente</span>
            </button>
            <button
              onClick={() => onNavigate('history')}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all"
            >
              Rever
            </button>
          </div>
        </div>

        {/* PUZZLE DO DIA PREVIEW */}
        <div className="bg-white rounded-3xl p-6 border border-[#DDE3EA] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Puzzle do Dia
              </h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FFD6E0] text-[#9F1239]">
                {todayDateStr}
              </span>
            </div>

            <div className="bg-[#F7F9FC] rounded-2xl p-4 border border-[#DDE3EA]">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{dailyPuzzle.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{dailyPuzzle.description}</p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-white border border-[#DDE3EA] rounded-md text-slate-700">
                  {dailyPuzzle.rating} pts
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#166534] bg-[#BDE7C9]/40 p-2.5 rounded-xl">
                <Sparkles className="w-4 h-4 text-[#166534]" />
                <span>Tema: {dailyPuzzle.theme} — Vez das {dailyPuzzle.turn === 'w' ? 'Brancas' : 'Pretas'}</span>
              </div>
            </div>
          </div>

          <button
            id="home-solve-puzzle-btn"
            onClick={() => onNavigate('puzzles')}
            className="mt-4 w-full py-3 px-4 bg-[#8AA7E1] hover:bg-[#7292D6] text-white text-xs font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <PuzzleIcon className="w-4 h-4" />
            <span>Resolver Desafio de Hoje</span>
          </button>
        </div>
      </div>
    </div>
  );
};
