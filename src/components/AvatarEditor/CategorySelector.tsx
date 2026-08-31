import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CategoryDefinition } from '../../types/avatar';

interface CategorySelectorProps {
  category: CategoryDefinition;
  variants: { id: string; label: string }[];
  currentVariantId: string;
  onPrev: () => void;
  onNext: () => void;
  onSelectVariant?: (id: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  category,
  variants,
  currentVariantId,
  onPrev,
  onNext,
}) => {
  const currentIndex = variants.findIndex((v) => v.id === currentVariantId);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentVariant = variants[safeIndex] || { id: 'none', label: 'Padrão' };

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#DDE3EA] shadow-xs hover:border-[#8AA7E1]/50 transition-colors flex flex-col gap-2">
      {/* Top Header: Category Name & Index Counter */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-slate-700 tracking-tight">
          {category.label}
        </span>
        <span className="text-[11px] font-mono font-bold text-[#8AA7E1] bg-[#F7F9FC] px-2 py-0.5 rounded-md border border-[#DDE3EA]/60">
          ‹ {safeIndex + 1}/{variants.length} ›
        </span>
      </div>

      {/* Navigation Arrow Controls & Current Variant Name */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          aria-label={`Opção anterior para ${category.label}`}
          className="p-2 rounded-xl bg-[#F7F9FC] hover:bg-[#8AA7E1]/15 text-slate-600 hover:text-[#8AA7E1] border border-[#DDE3EA] hover:border-[#8AA7E1]/40 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex-1 text-center py-1.5 px-3 bg-[#F7F9FC]/80 rounded-xl border border-[#DDE3EA]/80 flex items-center justify-center min-w-0">
          <span className="text-xs font-semibold text-slate-800 truncate" title={currentVariant.label}>
            {currentVariant.label}
          </span>
        </div>

        <button
          type="button"
          onClick={onNext}
          aria-label={`Próxima opção para ${category.label}`}
          className="p-2 rounded-xl bg-[#F7F9FC] hover:bg-[#8AA7E1]/15 text-slate-600 hover:text-[#8AA7E1] border border-[#DDE3EA] hover:border-[#8AA7E1]/40 active:scale-95 transition-all cursor-pointer shrink-0"
        >
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
