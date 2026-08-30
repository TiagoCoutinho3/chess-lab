/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ViewTab, Bot } from './types';
import { Header } from './components/Header';
import { HomeView } from './views/HomeView';
import { PlayView } from './views/PlayView';
import { OpeningsView } from './views/OpeningsView';
import { PuzzlesView } from './views/PuzzlesView';
import { HistoryView } from './views/HistoryView';
import { BOTS_LIST } from './data/botsData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ViewTab>('home');
  const [selectedBotForPlay, setSelectedBotForPlay] = useState<Bot>(BOTS_LIST[0]);

  const handleSelectBotToPlay = (bot: Bot) => {
    setSelectedBotForPlay(bot);
    setCurrentTab('play');
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1E293B] flex flex-col font-sans selection:bg-[#8AA7E1]/30">
      {/* Top Brand Header */}
      <Header currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Main Content Area */}
      <main className={`flex-1 min-h-0 ${currentTab === 'play' ? 'overflow-y-auto pb-12' : 'pb-12'}`}>
        {currentTab === 'home' && (
          <HomeView
            onNavigate={setCurrentTab}
            onSelectBotToPlay={handleSelectBotToPlay}
          />
        )}
        {currentTab === 'play' && (
          <PlayView initialBot={selectedBotForPlay} />
        )}
        {currentTab === 'openings' && <OpeningsView />}
        {currentTab === 'puzzles' && <PuzzlesView />}
        {currentTab === 'history' && <HistoryView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DDE3EA] bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span>ChessLab</span>
            <span className="text-[#8AA7E1] font-normal">• Jogue. Aprenda. Evolua.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
