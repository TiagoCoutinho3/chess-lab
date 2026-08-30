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
} from "lucide-react";

interface HeaderProps {
  currentTab: ViewTab;
  onTabChange: (tab: ViewTab) => void;
  onOpenBotSelector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onTabChange }) => {
  const [soundActive, setSoundActive] = useState<boolean>(sounds.isEnabled());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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

    </header>
  );
};
