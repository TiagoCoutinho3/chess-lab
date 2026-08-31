import React, { useState, useMemo } from 'react';
import {
  PuzzleDifficulty,
  DIFFICULTY_OPTIONS,
  ThemeStat,
} from '../utils/puzzleFilter';
import {
  Sparkles,
  Play,
  Check,
  Search,
  SlidersHorizontal,
  Flame,
  Layers,
  RotateCcw,
  Target,
  Trophy,
} from 'lucide-react';

interface PuzzleFilterScreenProps {
  difficulty: PuzzleDifficulty;
  onDifficultyChange: (difficulty: PuzzleDifficulty) => void;
  selectedThemes: string[];
  onToggleTheme: (theme: string) => void;
  onClearFilters: () => void;
  availableThemes: ThemeStat[];
  availableCount: number;
  onStartSession: () => void;
}

export const PuzzleFilterScreen: React.FC<PuzzleFilterScreenProps> = ({
  difficulty,
  onDifficultyChange,
  selectedThemes,
  onToggleTheme,
  onClearFilters,
  availableThemes,
  availableCount,
  onStartSession,
}) => {
  const [themeSearch, setThemeSearch] = useState('');

  // Filter themes list by search query
  const filteredThemes = useMemo(() => {
    if (!themeSearch.trim()) return availableThemes;
    const query = themeSearch.toLowerCase().trim();
    return availableThemes.filter(
      (t) =>
        t.label.toLowerCase().includes(query) ||
        t.theme.toLowerCase().includes(query)
    );
  }, [availableThemes, themeSearch]);

  const hasActiveFilters = difficulty !== 'all' || selectedThemes.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn py-2">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DDE3EA] shadow-xs relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-[#EDE7FF]/50 to-transparent rounded-full pointer-events-none -mr-20 -mt-20" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE7FF] border border-[#DDD6FE] text-[#5B21B6] text-xs font-bold">
              <Target className="w-3.5 h-3.5" />
              <span>Modo Treino Personalizado</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Treino de Puzzles Táticos
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Escolha a dificuldade e os temas táticos desejados para iniciar uma sessão focada com puzzles selecionados do banco Lichess.
            </p>
          </div>

          <button
            onClick={onStartSession}
            disabled={availableCount === 0}
            className="px-6 py-3.5 bg-[#8AA7E1] hover:bg-[#7292D6] active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white font-black text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 flex-shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Começar Treino ({availableCount.toLocaleString('pt-BR')})</span>
          </button>
        </div>
      </div>

      {/* 1. Difficulty Selector Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#DDE3EA] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              1. Faixa de Dificuldade (Rating)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtre os desafios pelo nível de habilidade e complexidade de cálculo.
            </p>
          </div>
          {difficulty !== 'all' && (
            <button
              onClick={() => onDifficultyChange('all')}
              className="text-xs text-[#5B21B6] hover:underline font-semibold"
            >
              Resetar para Todas
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isSelected = difficulty === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onDifficultyChange(opt.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all relative flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#8AA7E1] text-white border-[#8AA7E1] shadow-xs ring-2 ring-[#8AA7E1]/20'
                    : 'bg-[#F7F9FC] hover:bg-slate-100/80 border-[#DDE3EA] text-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs block">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <span
                    className={`text-[10px] font-semibold mt-0.5 block ${
                      isSelected ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    {opt.sublabel}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md inline-block self-start ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {opt.ratingRange}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Themes Selector Section */}
      <div className="bg-white rounded-3xl p-6 border border-[#DDE3EA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                2. Temas Táticos ({selectedThemes.length === 0 ? 'Todos selecionados' : `${selectedThemes.length} selecionado${selectedThemes.length > 1 ? 's' : ''}`})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Escolha um ou vários temas para treinar padrões específicos (deixe vazio para incluir todos).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedThemes.length > 0 && (
              <button
                onClick={() => selectedThemes.forEach((t) => onToggleTheme(t))}
                className="text-xs text-[#9F1239] hover:underline font-semibold mr-2"
              >
                Limpar temas
              </button>
            )}

            {/* Quick search input for themes */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={themeSearch}
                onChange={(e) => setThemeSearch(e.target.value)}
                placeholder="Buscar tema..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#F7F9FC] focus:bg-white border border-[#DDE3EA] focus:border-[#8AA7E1] rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Themes Multi-Select Chips Container */}
        <div className="max-h-64 overflow-y-auto pr-1 flex flex-wrap gap-2 pt-1 custom-scrollbar">
          {filteredThemes.map(({ theme, label, count }) => {
            const isSelected = selectedThemes.includes(theme);

            return (
              <button
                key={theme}
                type="button"
                onClick={() => onToggleTheme(theme)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-[#EDE7FF] border-[#8B5CF6] text-[#5B21B6] shadow-xs'
                    : 'bg-[#F7F9FC] hover:bg-slate-100 border-[#DDE3EA] text-slate-600'
                }`}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected
                      ? 'bg-[#5B21B6]/10 text-[#5B21B6]'
                      : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {count}
                </span>
                {isSelected && <Check className="w-3 h-3 text-[#5B21B6]" />}
              </button>
            );
          })}

          {filteredThemes.length === 0 && (
            <div className="text-center py-6 w-full text-slate-400 text-xs font-semibold">
              Nenhum tema encontrado com o termo "{themeSearch}".
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#DDE3EA] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#BDE7C9]/40 border border-[#BDE7C9] flex items-center justify-center text-[#166534]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              {availableCount === 0 ? (
                <span className="text-[#9F1239]">Nenhum puzzle disponível</span>
              ) : (
                <span>
                  {availableCount.toLocaleString('pt-BR')} puzzles encontrados na fila
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {difficulty !== 'all' ? `Dificuldade ${DIFFICULTY_OPTIONS.find((d) => d.id === difficulty)?.label}` : 'Todas as dificuldades'}
              {selectedThemes.length > 0 && ` • ${selectedThemes.length} tema(s) selecionado(s)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}

          <button
            onClick={onStartSession}
            disabled={availableCount === 0}
            className="px-6 py-2.5 bg-[#8AA7E1] hover:bg-[#7292D6] active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Começar treino</span>
          </button>
        </div>
      </div>
    </div>
  );
};
