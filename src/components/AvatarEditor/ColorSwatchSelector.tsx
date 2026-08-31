import React from 'react';
import { Check } from 'lucide-react';
import { ColorGroupDefinition } from '../../types/avatar';

interface ColorSwatchSelectorProps {
  colorGroup: ColorGroupDefinition;
  currentColor: string;
  onSelectColor: (hex: string) => void;
}

export const ColorSwatchSelector: React.FC<ColorSwatchSelectorProps> = ({
  colorGroup,
  currentColor,
  onSelectColor,
}) => {
  const normalizedCurrent = currentColor.replace(/^#/, '').toLowerCase();

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#DDE3EA] shadow-xs flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 tracking-tight">
          {colorGroup.label}
        </span>
        <span className="text-[10px] font-mono font-medium text-slate-400">
          #{normalizedCurrent}
        </span>
      </div>

      {/* Swatches Row / Grid */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {colorGroup.colors.map((c) => {
          const cleanHex = c.hex.replace(/^#/, '').toLowerCase();
          const isSelected = normalizedCurrent === cleanHex;

          return (
            <button
              key={cleanHex}
              type="button"
              onClick={() => onSelectColor(cleanHex)}
              title={c.label ? `${c.label} (#${cleanHex})` : `#${cleanHex}`}
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border transition-all cursor-pointer flex items-center justify-center relative active:scale-95 ${
                isSelected
                  ? 'ring-2 ring-[#8AA7E1] ring-offset-2 scale-110 shadow-sm border-white'
                  : 'border-black/10 hover:scale-105 hover:border-slate-400'
              }`}
              style={{ backgroundColor: `#${cleanHex}` }}
            >
              {isSelected && (
                <Check
                  className={`w-3.5 h-3.5 stroke-[3] ${
                    // Dark background gets white check, light background gets dark check
                    ['f5d0b0', 'eab890', 'dda878', 'f1f3f5', 'f8f9fa', 'f2f2f2', 'fff1c7', 'ffd6e0', 'bde7c9', 'ede7ff', 'cdb4db', 'a6c8ff', 'b6e3f4'].includes(cleanHex)
                      ? 'text-slate-800'
                      : 'text-white'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
