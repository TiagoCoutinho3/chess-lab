import React, { useState } from 'react';
import { Bot, BotPersonality } from '../types';
import { BOTS_LIST } from '../data/botsData';
import { BotCard } from './BotCard';
import { X, Filter, Sparkles } from 'lucide-react';

interface BotSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBot: (bot: Bot) => void;
  currentBotId?: string;
}

export const BotSelectionModal: React.FC<BotSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectBot,
  currentBotId,
}) => {
  const [selectedPersonality, setSelectedPersonality] = useState<BotPersonality | 'Todos'>('Todos');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Todos' | 'Iniciante' | 'Intermediário' | 'Avançado'>('Todos');

  if (!isOpen) return null;

  const personalities: (BotPersonality | 'Todos')[] = [
    'Todos',
    'Agressivo',
    'Estratégico',
    'Calmo',
    'Criativo',
    'Defensivo',
    'Tático',
  ];

  const filteredBots = BOTS_LIST.filter((bot) => {
    if (selectedPersonality !== 'Todos' && bot.personality !== selectedPersonality) {
      return false;
    }
    if (selectedDifficulty === 'Iniciante' && bot.level > 6) return false;
    if (selectedDifficulty === 'Intermediário' && (bot.level <= 6 || bot.level > 14)) return false;
    if (selectedDifficulty === 'Avançado' && bot.level <= 14) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#F7F9FC] w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-[#DDE3EA] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#DDE3EA] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8AA7E1]" />
              <h2 className="text-xl font-bold text-slate-800">Escolha seu Oponente</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Bots virtuais com personalidades únicas, do iniciante ao grande mestre
            </p>
          </div>
          <button
            id="close-bot-modal-btn"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 bg-white/70 border-b border-[#DDE3EA] flex flex-wrap items-center justify-between gap-3">
          {/* Personality pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Personalidade:
            </span>
            {personalities.map((pers) => (
              <button
                key={pers}
                onClick={() => setSelectedPersonality(pers)}
                className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${
                  selectedPersonality === pers
                    ? 'bg-[#8AA7E1] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {pers}
              </button>
            ))}
          </div>

          {/* Difficulty pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['Todos', 'Iniciante', 'Intermediário', 'Avançado'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white text-slate-800 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Bot Grid */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBots.map((bot) => (
            <BotCard
              key={bot.id}
              bot={bot}
              isSelected={bot.id === currentBotId}
              onSelect={(chosen) => {
                onSelectBot(chosen);
                onClose();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
