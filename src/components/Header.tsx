import React, { useState } from "react";
import { ViewTab } from "../types";
import { sounds } from "../utils/audio";
import { PieceIcon } from "./PieceIcon";
import {
  Home,
  Swords,
  Puzzle as PuzzleIcon,
  BookOpen,
  History,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Info,
} from "lucide-react";

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenBotSelector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const [soundActive, setSoundActive] = useState<boolean>(sounds.isEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showBrandGuideModal, setShowBrandGuideModal] =
    useState<boolean>(false);

  const handleToggleSound = () => {
    const newState = sounds.toggleSound();
    setSoundActive(newState);
  };

  const navItems: {
    id: ViewTab;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: "home", label: "Início", icon: Home },
    { id: "play", label: "Jogar vs Bot", icon: Swords },
    { id: "puzzles", label: "Puzzles Diários", icon: PuzzleIcon },
    { id: "openings", label: "Aberturas", icon: BookOpen },
    { id: "history", label: "Histórico", icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#DDE3EA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => onTabChange("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Knight Logo Badge */}
            <div className="w-11 h-11 rounded-2xl bg-[#8AA7E1] flex items-center justify-center shadow-md shadow-[#8AA7E1]/30 group-hover:scale-105 transition-transform">
              <PieceIcon type="n" color="w" className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  Chess
                </span>
                <span className="text-xl font-black text-[#8AA7E1] tracking-tight">
                  Lab
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 tracking-wider hidden sm:block">
                Jogue. Aprenda. Evolua.
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F7F9FC] p-1.5 rounded-2xl border border-[#DDE3EA]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-white text-[#8AA7E1] shadow-xs border border-[#8AA7E1]/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-[#8AA7E1]" : "text-slate-400"}`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2">
            {/* Brand Guide / Info Button */}
            <button
              id="brand-info-btn"
              onClick={() => setShowBrandGuideModal(true)}
              title="Guia de Marca ChessLab"
              className="p-2.5 rounded-xl border border-[#DDE3EA] hover:border-[#8AA7E1] text-slate-500 hover:text-[#8AA7E1] hover:bg-[#F7F9FC] transition-colors"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={handleToggleSound}
              title={soundActive ? "Desativar Sons" : "Ativar Sons"}
              className="p-2.5 rounded-xl border border-[#DDE3EA] hover:border-[#8AA7E1] text-slate-500 hover:text-[#8AA7E1] hover:bg-[#F7F9FC] transition-colors"
            >
              {soundActive ? (
                <Volume2 className="w-4 h-4 text-[#8AA7E1]" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-xl border border-[#DDE3EA] text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#DDE3EA] flex flex-col gap-1.5 animate-fadeIn">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${
                    isActive
                      ? "bg-[#EDE7FF] text-[#5B21B6]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Brand Guide Modal */}
      {showBrandGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#DDE3EA] p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#8AA7E1] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    ChessLab — Sistema de Design
                  </h3>
                  <p className="text-xs text-slate-500">
                    Guia de identidade visual e especificações
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBrandGuideModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-3 bg-[#F7F9FC] rounded-2xl border border-[#DDE3EA]">
                <h4 className="font-bold text-slate-800 mb-2">
                  Paleta de Cores Oficial
                </h4>
                <div className="grid grid-cols-5 gap-2 text-[10px] text-center font-bold">
                  <div className="p-2 rounded-xl bg-[#8AA7E1] text-white">
                    #8AA7E1
                    <br />
                    Azul Suave
                  </div>
                  <div className="p-2 rounded-xl bg-[#A6C8FF] text-slate-800">
                    #A6C8FF
                    <br />
                    Azul Claro
                  </div>
                  <div className="p-2 rounded-xl bg-[#CDB4DB] text-slate-800">
                    #CDB4DB
                    <br />
                    Roxo Suave
                  </div>
                  <div className="p-2 rounded-xl bg-[#FFD6E0] text-slate-800">
                    #FFD6E0
                    <br />
                    Rosa Suave
                  </div>
                  <div className="p-2 rounded-xl bg-[#BDE7C9] text-slate-800">
                    #BDE7C9
                    <br />
                    Verde Pastel
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F7F9FC] rounded-2xl border border-[#DDE3EA]">
                <h4 className="font-bold text-slate-800 mb-2">
                  Personalidades dos Bots
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-[#FFD6E0] text-[#9F1239] font-bold">
                    Agressivo
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#EDE7FF] text-[#5B21B6] font-bold">
                    Estratégico
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#BDE7C9] text-[#166534] font-bold">
                    Calmo
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#CDB4DB] text-[#6B21A8] font-bold">
                    Criativo
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#FFF1C7] text-[#854D0E] font-bold">
                    Defensivo
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#A6C8FF] text-[#1E40AF] font-bold">
                    Tático
                  </span>
                </div>
              </div>

              <p className="text-slate-500 italic text-[11px] leading-relaxed">
                Plataforma de xadrez pessoal para jogar contra bots inteligentes
                e evoluir com ferramentas de aprendizado integradas, 100%
                client-side com Stockfish/ChessEngine e banco ECO.
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
