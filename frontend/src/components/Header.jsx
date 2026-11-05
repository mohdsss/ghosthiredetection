import React, { useState } from 'react';
import { Ghost, ShieldAlert, Cpu, Presentation, History, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { playHoverSound, playClickSound, toggleSound, isSoundEnabled } from '../utils/soundFx';

export default function Header({ 
  activeView, 
  setActiveView, 
  awsStatus, 
  onOpenArchitecture, 
  onOpenPitchDeck,
  onOpenHistory 
}) {
  const [sfxOn, setSfxOn] = useState(true);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSfxOn(newState);
    if (newState) playClickSound();
  };

  return (
    <header className="border-b border-hollow-border/80 bg-hollow-abyss/90 backdrop-blur-md sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo and Game Crest */}
        <div 
          className="flex items-center space-x-3.5 cursor-pointer group"
          onClick={() => {
            playClickSound();
            setActiveView('scanner');
          }}
          onMouseEnter={playHoverSound}
        >
          {/* 3D Relic Crest */}
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-hollow-amber/25 via-hollow-purple/30 to-hollow-abyss border-2 border-hollow-amber/50 shadow-[0_0_20px_rgba(255,122,0,0.35)] group-hover:scale-105 group-hover:border-hollow-amber transition-all duration-300">
            <Ghost className="w-6 h-6 text-hollow-amber group-hover:text-white transition-colors duration-300 animate-float-3d" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-hollow-lavender rounded-full animate-ping opacity-75"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-hollow-amber via-[#FFB366] to-hollow-lavender bg-clip-text text-transparent font-cinzel">
                GhostHire
              </span>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-hollow-amber/15 text-hollow-amber border border-hollow-amber/40 shadow-[0_0_10px_rgba(255,122,0,0.2)]">
                HollowKeep Edition
              </span>
            </div>
            <p className="text-[11px] text-hollow-muted font-medium hidden sm:block tracking-wide">
              Dispel predatory fake opportunities before they ghost you.
            </p>
          </div>
        </div>

        {/* Navigation & Action Controls */}
        <div className="flex items-center flex-wrap gap-2 text-sm">
          {/* Main View Switcher (Inventory Style) */}
          <div className="bg-hollow-surface/90 border border-hollow-border/90 rounded-xl p-1 flex items-center shadow-inner">
            <button
              onClick={() => {
                playClickSound();
                setActiveView('scanner');
              }}
              onMouseEnter={playHoverSound}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-cinzel tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                activeView === 'scanner'
                  ? 'hollow-btn-primary shadow-lg font-bold'
                  : 'text-hollow-muted hover:text-hollow-text'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Scanner
            </button>
            <button
              onClick={() => {
                playClickSound();
                setActiveView('community');
              }}
              onMouseEnter={playHoverSound}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-cinzel tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
                activeView === 'community'
                  ? 'bg-gradient-to-r from-hollow-purple to-hollow-lavender text-black font-bold shadow-lg shadow-hollow-purple/30'
                  : 'text-hollow-muted hover:text-hollow-text'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Community Radar
            </button>
          </div>

          {/* Sound FX Toggle Button */}
          <button
            onClick={handleSoundToggle}
            onMouseEnter={playHoverSound}
            className={`p-2 rounded-xl border transition-all duration-200 flex items-center gap-1 text-xs ${
              sfxOn 
                ? 'border-hollow-amber/40 bg-hollow-amber/10 text-hollow-amber' 
                : 'border-hollow-border bg-hollow-card text-hollow-muted'
            }`}
            title={sfxOn ? 'Mute Game SFX' : 'Enable Game SFX'}
          >
            {sfxOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden xl:inline text-[10px] font-mono font-bold">
              {sfxOn ? 'SFX ON' : 'MUTED'}
            </span>
          </button>

          {/* Past Scans */}
          <button
            onClick={() => {
              playClickSound();
              onOpenHistory();
            }}
            onMouseEnter={playHoverSound}
            className="hollow-btn-secondary px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5"
            title="View scan history codex"
          >
            <History className="w-4 h-4 text-hollow-lavender" />
            <span className="hidden md:inline font-cinzel">History</span>
          </button>

          {/* 7-Slide Pitch Deck */}
          <button
            onClick={() => {
              playClickSound();
              onOpenPitchDeck();
            }}
            onMouseEnter={playHoverSound}
            className="px-3 py-1.5 rounded-xl border border-hollow-amber/50 bg-hollow-amber/15 hover:bg-hollow-amber/25 text-hollow-amber text-xs sm:text-sm font-cinzel font-bold transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,122,0,0.2)]"
            title="Open Pitch Deck for Judges"
          >
            <Presentation className="w-4 h-4 text-hollow-amber" />
            <span className="hidden lg:inline">Pitch Deck</span>
          </button>

          {/* Architecture */}
          <button
            onClick={() => {
              playClickSound();
              onOpenArchitecture();
            }}
            onMouseEnter={playHoverSound}
            className="hollow-btn-secondary px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1.5"
            title="View AWS Serverless Architecture"
          >
            <Cpu className="w-4 h-4 text-hollow-lavender" />
            <span className="hidden lg:inline font-cinzel">AWS Architecture</span>
          </button>

          {/* AWS Status indicator crystal */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-hollow-surface border border-hollow-border text-[11px] font-mono shadow-inner">
            <span className={`w-2 h-2 rounded-full ${awsStatus?.aws_connected ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]' : 'bg-hollow-amber'}`}></span>
            <span className="text-hollow-muted hidden sm:inline">AWS:</span>
            <span className={awsStatus?.aws_connected ? 'text-emerald-300 font-semibold' : 'text-hollow-amber'}>
              {awsStatus?.aws_connected ? 'Textract+S3 Live' : 'Active'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
