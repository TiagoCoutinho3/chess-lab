import React from 'react';
import { Bot } from '../types';
import { BotAvatar } from './BotAvatar';
import { Swords } from 'lucide-react';

interface BotCardProps {
  bot: Bot;
  onSelect: (bot: Bot) => void;
  isSelected?: boolean;
}

export const BotCard: React.FC<BotCardProps> = ({ bot, onSelect, isSelected = false }) => {
  return (
    <div
      id={`bot-card-${bot.id}`}
      onClick={() => onSelect(bot)}
      className={`group relative bg-white rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected
          ? 'border-[#8AA7E1] ring-2 ring-[#8AA7E1] bg-[#F7F9FC]'
          : 'border-[#DDE3EA] hover:border-[#8AA7E1]/60'
      }`}
    >
      <div>
        {/* Top: Avatar & Info */}
        <div className="flex items-start gap-4 mb-3.5">
          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#F7F9FC] border border-[#DDE3EA] shadow-xs group-hover:scale-105 transition-transform">
            <BotAvatar
              seed={bot.avatarSeed}
              botId={bot.id}
              style={bot.avatarStyle ?? 'voxel-art'}
              mood="idle"
              alt={bot.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1.5 right-1.5 w-3 h-3 bg-emerald-500 border border-white rounded-full" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-bold text-base text-slate-800 truncate">{bot.name}</h3>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                ~{bot.rating}
              </span>
            </div>

            {/* Personality & Level */}
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span
                style={{
                  backgroundColor: bot.personalityTagColor.bg,
                  color: bot.personalityTagColor.text,
                }}
                className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              >
                {bot.personality}
              </span>
              <span className="text-xs text-slate-500 font-medium">Nível {bot.level}</span>
            </div>
          </div>
        </div>

        {/* Description & Quote */}
        <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
          {bot.description}
        </p>

        {/* Level Indicator Dots */}
        <div className="flex items-center gap-1 mb-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Nível</span>
          <div className="flex gap-0.5 flex-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < bot.level ? 'bg-[#8AA7E1]' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        id={`select-bot-btn-${bot.id}`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(bot);
        }}
        className="w-full py-2.5 px-4 bg-[#8AA7E1] hover:bg-[#7292D6] active:scale-[0.98] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
      >
        <Swords className="w-4 h-4" />
        <span>Jogar Contra {bot.name}</span>
      </button>
    </div>
  );
};
