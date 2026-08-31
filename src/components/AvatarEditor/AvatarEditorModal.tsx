import React, { useState, useEffect } from 'react';
import {
  X,
  Shuffle,
  RotateCcw,
  Check,
  Sparkles,
  Palette,
  Layers,
  Smile,
} from 'lucide-react';
import { useAvatarBuilder } from '../../hooks/useAvatarBuilder';
import {
  VOXEL_CATEGORIES,
  VOXEL_COLOR_GROUPS,
} from '../../data/voxelArtSchema';
import { CategorySelector } from './CategorySelector';
import { ColorSwatchSelector } from './ColorSwatchSelector';
import { VoxelColorGroup } from '../../types/avatar';

interface AvatarEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarEditorModal: React.FC<AvatarEditorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    options,
    svgDataUri,
    isDirty,
    getVariantsForCategory,
    getCurrentVariantId,
    nextVariant,
    prevVariant,
    setColor,
    randomize,
    save,
    reset,
    reloadFromStorage,
  } = useAvatarBuilder();

  const [activeTab, setActiveTab] = useState<'parts' | 'colors'>('parts');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Reload saved options whenever modal opens
  useEffect(() => {
    if (isOpen) {
      reloadFromStorage();
      setSavedSuccess(false);
    }
  }, [isOpen, reloadFromStorage]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    save();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 450);
  };

  const getColorGroupValue = (group: VoxelColorGroup): string => {
    if (group === 'backgroundColor') {
      return options.backgroundColor?.[0] ?? '8aa7e1';
    }
    return (options[group] as string) ?? '2c222b';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-editor-title"
        className="relative w-full max-w-4xl bg-[#F7F9FC] rounded-3xl border border-[#DDE3EA] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] z-10 animate-scaleUp"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-white border-b border-[#DDE3EA] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE7FF] text-[#6D5ACF] flex items-center justify-center shadow-xs">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h2
                id="avatar-editor-title"
                className="text-lg sm:text-xl font-black text-slate-900 tracking-tight"
              >
                Editor de Avatar
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Personalize seu visual 3D voxel exclusivo para as partidas
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar editor"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Column: Preview & Quick Actions */}
          <div className="md:col-span-5 bg-white/80 p-5 sm:p-6 border-b md:border-b-0 md:border-r border-[#DDE3EA] flex flex-col items-center justify-between gap-5 overflow-y-auto">
            <div className="w-full flex flex-col items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8AA7E1]" />
                Visualização em Tempo Real
              </span>

              {/* Avatar Preview Card */}
              <div className="relative group">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl p-3 bg-white border-2 border-[#8AA7E1]/30 shadow-lg shadow-[#8AA7E1]/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]">
                  <img
                    src={svgDataUri}
                    alt="Preview do seu Avatar"
                    className="w-full h-full object-contain rounded-2xl drop-shadow-md"
                    draggable={false}
                  />
                </div>

                {/* Badge style indicator */}
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slate-700">
                  Estilo Voxel-Art
                </div>
              </div>
            </div>

            {/* Quick Actions (Random & Reset) */}
            <div className="w-full grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={randomize}
                className="flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-2xl bg-[#EDE7FF] hover:bg-[#E0D7FE] text-[#5B21B6] font-bold text-xs shadow-xs hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border border-[#D5C6FD]"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Aleatório</span>
              </button>

              <button
                type="button"
                onClick={reset}
                disabled={!isDirty}
                className={`flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-2xl font-bold text-xs shadow-xs transition-all border ${
                  isDirty
                    ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#DDE3EA] hover:scale-[1.02] active:scale-95 cursor-pointer'
                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar</span>
              </button>
            </div>
          </div>

          {/* Right Column: Customization Selectors */}
          <div className="md:col-span-7 flex flex-col min-h-0 bg-[#F7F9FC]">
            {/* Customization Tabs */}
            <div className="flex items-center gap-2 p-3 sm:px-6 bg-white/60 border-b border-[#DDE3EA] shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('parts')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'parts'
                    ? 'bg-[#8AA7E1] text-white shadow-sm shadow-[#8AA7E1]/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Partes & Roupas ({VOXEL_CATEGORIES.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('colors')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'colors'
                    ? 'bg-[#8AA7E1] text-white shadow-sm shadow-[#8AA7E1]/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Cores & Tons ({VOXEL_COLOR_GROUPS.length})</span>
              </button>
            </div>

            {/* Selectors Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {activeTab === 'parts' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VOXEL_CATEGORIES.map((category) => {
                    const variants = getVariantsForCategory(category.id);
                    const currentVariantId = getCurrentVariantId(category.id);

                    return (
                      <CategorySelector
                        key={category.id}
                        category={category}
                        variants={variants}
                        currentVariantId={currentVariantId}
                        onPrev={() => prevVariant(category.id)}
                        onNext={() => nextVariant(category.id)}
                      />
                    );
                  })}
                </div>
              )}

              {activeTab === 'colors' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {VOXEL_COLOR_GROUPS.map((colorGroup) => {
                    const currentColor = getColorGroupValue(colorGroup.id);

                    return (
                      <ColorSwatchSelector
                        key={colorGroup.id}
                        colorGroup={colorGroup}
                        currentColor={currentColor}
                        onSelectColor={(hex) => setColor(colorGroup.id, hex)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-white border-t border-[#DDE3EA] shrink-0">
          <div className="text-xs text-slate-500 font-medium hidden sm:block">
            {isDirty ? (
              <span className="text-amber-600 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Alterações não salvas
              </span>
            ) : (
              <span className="text-slate-400">Avatar atualizado</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#DDE3EA] text-slate-600 font-bold text-xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md shadow-[#8AA7E1]/30 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-[#8AA7E1] hover:bg-[#7896D2]'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{savedSuccess ? 'Avatar Salvo!' : 'Salvar avatar'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
