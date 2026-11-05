import React from 'react';
import { Ghost, ShieldAlert, Radio, Flame, Sparkles, Skull, Eye } from 'lucide-react';
import { playHoverSound } from '../utils/soundFx';

export default function GhostRadarVisual({ isScanning, score, riskLevel, findingsCount }) {
  // Dynamic theme colors matching HollowKeep Midnight Palette
  const getTheme = () => {
    if (score === null || score === undefined) {
      return { 
        color: '#A855F7', 
        name: 'ARCANE WARD ACTIVE', 
        tier: 'SYSTEM IDLE',
        border: 'border-hollow-purple/50', 
        badge: 'bg-hollow-purple/15 text-hollow-lavender border-hollow-purple/40',
        glow: 'rgba(168, 85, 247, 0.35)',
        levelText: 'STANDBY'
      };
    }
    if (score >= 60) {
      return { 
        color: '#FF2E63', 
        name: 'CURSED PHANTOM DETECTED', 
        tier: 'CLASS-IV HAZARD',
        border: 'border-hollow-crimson/80', 
        badge: 'bg-hollow-crimson/20 text-hollow-crimson border-hollow-crimson/60',
        glow: 'rgba(255, 46, 99, 0.55)',
        levelText: 'HIGH RISK'
      };
    }
    if (score >= 30) {
      return { 
        color: '#FF7A00', 
        name: 'SHADOW MIMIC SIGNALS', 
        tier: 'CLASS-II SUSPICIOUS',
        border: 'border-hollow-amber/80', 
        badge: 'bg-hollow-amber/20 text-hollow-amber border-hollow-amber/60',
        glow: 'rgba(255, 122, 0, 0.45)',
        levelText: 'MEDIUM RISK'
      };
    }
    return { 
      color: '#10B981', 
      name: 'SANCTUARY SEAL VERIFIED', 
      tier: 'BENIGN SIGNAL',
      border: 'border-hollow-emerald/80', 
      badge: 'bg-hollow-emerald/20 text-hollow-emerald border-hollow-emerald/60',
      glow: 'rgba(16, 185, 129, 0.45)',
      levelText: 'LOW RISK'
    };
  };

  const theme = getTheme();

  return (
    <div 
      onMouseEnter={playHoverSound}
      className="relative hollow-card-3d hollow-frame rounded-2xl p-6 overflow-hidden select-none group border border-hollow-border/80"
    >
      {/* Dynamic 3D Volumetric Ambient Aura */}
      <div 
        className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-all duration-700 opacity-30"
        style={{ backgroundColor: theme.color }}
      />
      <div 
        className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] pointer-events-none transition-all duration-700 opacity-20"
        style={{ backgroundColor: isScanning ? '#FF7A00' : '#A855F7' }}
      />

      {/* Top HUD Bar */}
      <div className="w-full flex items-center justify-between mb-3 z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="relative p-2 rounded-xl bg-hollow-abyss/80 border border-hollow-border shadow-inner">
            <Radio className={`w-4 h-4 ${isScanning ? 'text-hollow-amber animate-spin' : 'text-hollow-lavender'}`} />
            {isScanning && (
              <span className="absolute inset-0 rounded-xl border border-hollow-amber animate-ping opacity-75"></span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-hollow-amber font-bold flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> HOLLOW-HUD V2.0
              </span>
            </div>
            <h3 className="text-sm font-bold tracking-wider text-hollow-text font-cinzel">
              Arcane Opportunity Radar
            </h3>
          </div>
        </div>

        {/* Threat Level Badge */}
        <div className="text-right">
          <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider border shadow-lg transition-all duration-500 ${theme.badge}`}>
            {isScanning ? 'SWEEPING ANOMALIES...' : theme.levelText}
          </span>
          <p className="text-[9px] font-mono text-hollow-muted mt-1 tracking-widest uppercase">
            {theme.tier}
          </p>
        </div>
      </div>

      {/* 3D Perspective Hologram Radar Container */}
      <div className="relative w-full py-4 flex items-center justify-center perspective-800">
        <div 
          className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center preserve-3d transition-transform duration-500"
          style={{
            transform: 'rotateX(24deg) rotateZ(0deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Ground Holographic Grid Plane */}
          <div className="absolute inset-0 rounded-full border border-hollow-border/60 hollow-radar-grid shadow-[0_0_50px_rgba(124,58,237,0.15)]" />

          {/* Outer Runic Ring (Ornate Game Compass) */}
          <div className="absolute inset-1 rounded-full border-2 border-dashed border-hollow-purple/30 animate-spin-reverse pointer-events-none" />

          {/* Cardinal Compass Runes (N, S, E, W) */}
          <span className="absolute top-1 text-[9px] font-mono font-bold text-hollow-amber tracking-widest z-10">▲ N [VOID]</span>
          <span className="absolute bottom-1 text-[9px] font-mono font-bold text-hollow-muted tracking-widest z-10">▼ S [SANCTUARY]</span>
          <span className="absolute left-2 text-[9px] font-mono font-bold text-hollow-lavender tracking-widest z-10">◄ W</span>
          <span className="absolute right-2 text-[9px] font-mono font-bold text-hollow-cyan tracking-widest z-10">E ►</span>

          {/* Ring 2: High Risk Perimeter (60+ Threshold) */}
          <div className="absolute inset-8 rounded-full border border-hollow-crimson/30 shadow-[0_0_15px_rgba(255,46,99,0.1)]" />

          {/* Ring 3: Medium Risk Perimeter (30+ Threshold) */}
          <div className="absolute inset-16 rounded-full border border-hollow-amber/30 shadow-[0_0_12px_rgba(255,122,0,0.1)]" />

          {/* Ring 4: Safe Core Sanctum */}
          <div className="absolute inset-24 rounded-full border border-hollow-emerald/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]" />

          {/* Crosshair Optical Axes */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-hollow-border/70 to-transparent" />
            <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-hollow-border/70 to-transparent" />
          </div>

          {/* 360-degree Sweeping Hologram Radar Arm */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              animation: 'radarSweep 3s linear infinite',
              background: 'conic-gradient(from 0deg at 50% 50%, rgba(255, 122, 0, 0.45) 0deg, rgba(168, 85, 247, 0.25) 30deg, transparent 75deg, transparent 360deg)'
            }}
          />

          {/* 3D Floating Threat Orbs in 3D Space */}
          {score !== null && score > 0 && (
            <>
              {/* Upfront Fee Blip (Elevated in 3D) */}
              <div 
                className="absolute top-10 left-14 flex items-center gap-1.5 animate-bounce z-20"
                style={{ transform: 'translateZ(35px)' }}
              >
                <div className="relative">
                  <span className="w-3.5 h-3.5 rounded-full bg-hollow-crimson block shadow-[0_0_15px_#FF2E63] animate-ping" />
                  <span className="w-3.5 h-3.5 rounded-full bg-hollow-crimson absolute inset-0 block shadow-[0_0_10px_#FF2E63]" />
                </div>
                <span className="text-[10px] font-mono font-bold text-hollow-crimson bg-hollow-abyss/95 px-2 py-0.5 rounded-md border border-hollow-crimson/50 shadow-lg">
                  Fee!
                </span>
              </div>

              {/* Urgency Blip */}
              {score >= 30 && (
                <div 
                  className="absolute bottom-12 right-12 flex items-center gap-1.5 animate-pulse z-20"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  <span className="w-3 h-3 rounded-full bg-hollow-amber block shadow-[0_0_12px_#FF7A00]" />
                  <span className="text-[10px] font-mono font-bold text-hollow-amber bg-hollow-abyss/95 px-2 py-0.5 rounded-md border border-hollow-amber/50 shadow-lg">
                    Urgency
                  </span>
                </div>
              )}

              {/* Masked URL Blip */}
              {score >= 50 && (
                <div 
                  className="absolute top-16 right-12 flex items-center gap-1.5 z-20"
                  style={{ transform: 'translateZ(30px)' }}
                >
                  <span className="w-3 h-3 rounded-full bg-hollow-lavender block shadow-[0_0_12px_#A855F7]" />
                  <span className="text-[10px] font-mono font-bold text-hollow-lavender bg-hollow-abyss/95 px-2 py-0.5 rounded-md border border-hollow-lavender/50 shadow-lg">
                    URL Mask
                  </span>
                </div>
              )}
            </>
          )}

          {/* Central 3D Ghost Sanctuary Core (Elevated 3D Mascot) */}
          <div 
            className="relative z-30 w-28 h-28 rounded-full bg-gradient-to-b from-[#23143E] to-[#120922] border-2 flex flex-col items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-all duration-300"
            style={{ 
              borderColor: theme.color,
              boxShadow: `0 0 30px ${theme.glow}, inset 0 2px 4px rgba(255,255,255,0.2)`,
              transform: 'translateZ(40px)'
            }}
          >
            {score === null || score === undefined ? (
              <div className="flex flex-col items-center animate-float-3d">
                <Ghost className="w-10 h-10 text-hollow-lavender drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
                <span className="text-[10px] font-mono font-bold text-hollow-lavender mt-1 tracking-wider">
                  RADAR IDLE
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span 
                  className="text-3xl font-extrabold tracking-tight font-cinzel"
                  style={{ color: theme.color, textShadow: `0 0 20px ${theme.glow}` }}
                >
                  {score}
                </span>
                <span className="text-[9px] font-mono text-hollow-muted tracking-widest font-semibold uppercase">
                  / 100 THREAT
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Live Diagnostic Stats */}
      <div className="mt-3 pt-3 border-t border-hollow-border/60 grid grid-cols-3 gap-2 text-center z-10 relative">
        <div className="p-2 rounded-xl bg-hollow-abyss/60 border border-hollow-border/50">
          <p className="text-[9px] font-mono text-hollow-muted uppercase">ANOMALIES</p>
          <p className="text-sm font-bold text-hollow-text font-cinzel mt-0.5">
            {findingsCount !== undefined ? findingsCount : '0'}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-hollow-abyss/60 border border-hollow-border/50">
          <p className="text-[9px] font-mono text-hollow-muted uppercase">CORRIDOR</p>
          <p className="text-sm font-bold text-hollow-amber font-cinzel mt-0.5">
            {score >= 60 ? 'RED ZONE' : score >= 30 ? 'AMBER' : 'SAFE'}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-hollow-abyss/60 border border-hollow-border/50">
          <p className="text-[9px] font-mono text-hollow-muted uppercase">WARD STATUS</p>
          <p className="text-sm font-bold text-hollow-lavender font-cinzel mt-0.5">
            {isScanning ? 'LOCKING...' : 'ONLINE'}
          </p>
        </div>
      </div>
    </div>
  );
}
