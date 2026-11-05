import React, { useState, useEffect, useRef } from 'react';
import { 
  Ghost, Sparkles, ShieldCheck, ArrowRight, Flame, 
  MessageCircle, Zap, ShieldAlert, Scroll, Eye, Compass
} from 'lucide-react';
import { playHoverSound, playClickSound, playShrineSound, playPumpkinSound } from '../utils/soundFx';

export default function HalloweenHeroSection({ onScrollToScanner, onOpenCommunity, onOpenPitchDeck }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [altarCharges, setAltarCharges] = useState(13);
  const [pumpkinFlicker, setPumpkinFlicker] = useState(false);
  const [shrineBurst, setShrineBurst] = useState(false);
  const heroRef = useRef(null);

  // Parallax tracking
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleActivateShrine = () => {
    playShrineSound();
    setAltarCharges(prev => prev + 1);
    setShrineBurst(true);
    setTimeout(() => setShrineBurst(false), 800);
  };

  const handlePumpkinTap = () => {
    playPumpkinSound();
    setPumpkinFlicker(true);
    setTimeout(() => setPumpkinFlicker(false), 600);
  };

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[640px] lg:min-h-[700px] flex flex-col justify-center overflow-hidden border-b border-hollow-border/70 select-none"
    >
      {/* Background 1: High-Def Haunted Forest Crystal Altar Backdrop */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out pointer-events-none"
        style={{
          backgroundImage: "url('/images/haunted_forest_crystal_altar.jpg')",
          transform: `scale(1.05) translate(${mousePos.x * -12}px, ${mousePos.y * -8}px)`
        }}
      />

      {/* Dark Vignette & Gradient Overlays for Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0612] via-[#0A0612]/75 to-[#0A0612]/60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Animated Flying Bats in Sky */}
      <div className="absolute top-8 left-10 w-full h-32 pointer-events-none overflow-hidden opacity-75">
        <div 
          className="absolute flex items-center gap-12 animate-float-slow"
          style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 10}px)` }}
        >
          {/* Bat 1 */}
          <svg className="w-8 h-8 text-hollow-lavender/70 fill-current animate-pulse" viewBox="0 0 24 24">
            <path d="M12 8c-2 0-3 2-3 2s-2-2-4-2-4 3-4 6c3 0 5-1 7-3 1 2 3 3 4 3s3-1 4-3c2 2 4 3 7 3 0-3-2-6-4-6s-2 2-4 2-1-2-3-2z"/>
          </svg>
          {/* Bat 2 */}
          <svg className="w-6 h-6 text-hollow-amber/60 fill-current mt-4 animate-bounce" viewBox="0 0 24 24">
            <path d="M12 8c-2 0-3 2-3 2s-2-2-4-2-4 3-4 6c3 0 5-1 7-3 1 2 3 3 4 3s3-1 4-3c2 2 4 3 7 3 0-3-2-6-4-6s-2 2-4 2-1-2-3-2z"/>
          </svg>
          {/* Bat 3 */}
          <svg className="w-10 h-10 text-hollow-purple/50 fill-current ml-24" viewBox="0 0 24 24">
            <path d="M12 8c-2 0-3 2-3 2s-2-2-4-2-4 3-4 6c3 0 5-1 7-3 1 2 3 3 4 3s3-1 4-3c2 2 4 3 7 3 0-3-2-6-4-6s-2 2-4 2-1-2-3-2z"/>
          </svg>
        </div>
      </div>

      {/* Hero Content Grid */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Story & Call-To-Action (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Quest Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-hollow-surface/90 border border-hollow-amber/40 shadow-[0_0_20px_rgba(255,122,0,0.25)] backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-hollow-amber animate-ping"></span>
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-hollow-amber flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Hack-to-ween 2026 • Open Innovation
              </span>
            </div>

            {/* Main Title with Gothic Glow */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-hollow-text font-cinzel leading-tight tracking-wide">
                DISPEL FAKE OFFERS{' '}
                <span className="block bg-gradient-to-r from-hollow-amber via-[#FFAA44] to-hollow-lavender bg-clip-text text-transparent text-glow-amber">
                  BEFORE THEY GHOST YOU.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-hollow-muted font-normal max-w-xl leading-relaxed pt-2">
                College students lose lakhs to predatory ₹999 training fees, spoofed recruiter domains, and deceptive WhatsApp job offers. GhostHire arms students with <strong className="text-hollow-text">Amazon Textract OCR</strong> &amp; <strong className="text-hollow-amber">explainable heuristic risk scoring</strong> to expose scams in seconds.
              </p>
            </div>

            {/* Interactive Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Primary: Jump to Scanner */}
              <button
                onClick={() => {
                  playClickSound();
                  onScrollToScanner();
                }}
                onMouseEnter={playHoverSound}
                className="hollow-btn-primary px-6 py-3.5 rounded-xl font-cinzel font-extrabold text-sm sm:text-base tracking-wider flex items-center gap-2.5 shadow-2xl group"
              >
                <Zap className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                <span>SUMMON SCANNER (Ctrl + V)</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary: Community Radar */}
              <button
                onClick={() => {
                  playClickSound();
                  onOpenCommunity();
                }}
                onMouseEnter={playHoverSound}
                className="hollow-btn-secondary px-5 py-3.5 rounded-xl font-cinzel font-bold text-xs sm:text-sm tracking-wider flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-hollow-lavender" />
                <span>Guild Pattern Radar</span>
              </button>

              {/* Pitch Deck Button */}
              <button
                onClick={() => {
                  playClickSound();
                  onOpenPitchDeck();
                }}
                onMouseEnter={playHoverSound}
                className="px-4 py-3 rounded-xl border border-hollow-purple/40 bg-hollow-purple/15 hover:bg-hollow-purple/25 text-hollow-lavender font-cinzel font-bold text-xs sm:text-sm tracking-wider transition flex items-center gap-1.5"
              >
                <Scroll className="w-4 h-4 text-hollow-lavender" />
                <span>View Pitch Deck</span>
              </button>
            </div>

            {/* Quick Live Stats Ribbon */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg border-t border-hollow-border/60">
              <div className="p-2.5 rounded-xl bg-hollow-abyss/80 border border-hollow-border/80 shadow-inner">
                <span className="text-[10px] font-mono text-hollow-muted uppercase block">Risk Dial</span>
                <span className="text-base font-bold text-hollow-amber font-cinzel">0 - 100 Score</span>
              </div>
              <div className="p-2.5 rounded-xl bg-hollow-abyss/80 border border-hollow-border/80 shadow-inner">
                <span className="text-[10px] font-mono text-hollow-muted uppercase block">Scam Signals</span>
                <span className="text-base font-bold text-hollow-lavender font-cinzel">6 Heuristics</span>
              </div>
              <div className="p-2.5 rounded-xl bg-hollow-abyss/80 border border-hollow-border/80 shadow-inner">
                <span className="text-[10px] font-mono text-hollow-muted uppercase block">AWS Cloud</span>
                <span className="text-base font-bold text-emerald-400 font-cinzel">Textract OCR</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Altar & Relic Stage (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div 
              className="relative w-full max-w-md preserve-3d"
              style={{
                transform: `perspective(900px) rotateX(${mousePos.y * -8}deg) rotateY(${mousePos.x * 10}deg)`,
                transition: 'transform 0.2s ease-out'
              }}
            >
              {/* 3D Floating Relic Card with Ghost & Pumpkin Mascot */}
              <div className="hollow-card-3d hollow-frame rounded-3xl p-5 border-2 border-hollow-amber/40 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden relative group">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-3 border-b border-hollow-border/80 mb-3">
                  <div className="flex items-center gap-2">
                    <Ghost className="w-5 h-5 text-hollow-amber animate-float-3d" />
                    <span className="text-xs font-mono font-bold tracking-wider text-hollow-text uppercase">
                      Hollow Altar of Verification
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-hollow-amber/20 text-hollow-amber border border-hollow-amber/40">
                    INTERACTIVE 3D
                  </span>
                </div>

                {/* 3D Visual Centerpiece: Ghost Mascot & Glowing Pumpkin */}
                <div className="relative rounded-2xl overflow-hidden border border-hollow-border/80 bg-hollow-abyss/90 shadow-2xl group">
                  <img 
                    src="/images/3d_ghost_pumpkin_mascot.jpg" 
                    alt="3D Ghost and Glowing Jack-o-Lantern Mascot" 
                    className={`w-full h-64 object-cover object-center transition-all duration-500 ${
                      pumpkinFlicker ? 'scale-105 brightness-125 filter drop-shadow-[0_0_25px_#FF7A00]' : 'group-hover:scale-102'
                    }`}
                  />

                  {/* Dynamic Shimmer Light Sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Altar Shockwave Pulse when Clicked */}
                  {shrineBurst && (
                    <div className="absolute inset-0 border-4 border-hollow-amber rounded-2xl animate-ping pointer-events-none" />
                  )}

                  {/* Interactive Altar Controls Overlay */}
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 p-2 rounded-xl bg-hollow-abyss/85 backdrop-blur-md border border-hollow-border">
                    <button
                      onClick={handlePumpkinTap}
                      onMouseEnter={playHoverSound}
                      className="px-3 py-1.5 rounded-lg bg-hollow-amber/20 hover:bg-hollow-amber/30 text-hollow-amber font-mono text-xs font-bold border border-hollow-amber/40 transition flex items-center gap-1.5"
                      title="Click to ignite pumpkin ward"
                    >
                      <Flame className="w-3.5 h-3.5 text-hollow-amber animate-pulse" />
                      <span>Ignite Flame</span>
                    </button>

                    <button
                      onClick={handleActivateShrine}
                      onMouseEnter={playHoverSound}
                      className="px-3 py-1.5 rounded-lg bg-hollow-purple/20 hover:bg-hollow-purple/30 text-hollow-lavender font-mono text-xs font-bold border border-hollow-purple/40 transition flex items-center gap-1.5"
                      title="Click to channel verification shrine"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-hollow-lavender" />
                      <span>Channel Ward ({altarCharges})</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Relic Strip: 3D Floating Crystal Orb */}
                <div className="mt-3.5 p-3 rounded-xl bg-hollow-abyss/80 border border-hollow-border flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-hollow-purple/50 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    <img 
                      src="/images/3d_floating_crystal_orb.jpg" 
                      alt="3D Floating Crystal Orb Relic" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-hollow-text font-cinzel truncate">
                        Floating Arcane Crystal Orb
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">CHARGED</span>
                    </div>
                    <p className="text-[11px] text-hollow-muted font-mono truncate">
                      Deciphers hidden scam signals & OCR traps
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Feature Showcase Cards Below Hero */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-10 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Feature 1 */}
          <div 
            onMouseEnter={playHoverSound}
            className="p-4 rounded-xl hollow-card-3d border border-hollow-border hover:border-emerald-500/50 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2.5 shadow-sm group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-xs font-bold text-hollow-text font-cinzel">WhatsApp Screenshot OCR</h3>
            <p className="text-[11px] text-hollow-muted mt-1 font-mono leading-relaxed">
              Upload screenshot or paste with <kbd className="text-hollow-amber">Ctrl + V</kbd>. Amazon Textract extracts chat text instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div 
            onMouseEnter={playHoverSound}
            className="p-4 rounded-xl hollow-card-3d border border-hollow-border hover:border-hollow-amber/50 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-hollow-amber/10 border border-hollow-amber/30 flex items-center justify-center text-hollow-amber mb-2.5 shadow-sm group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 text-hollow-amber" />
            </div>
            <h3 className="text-xs font-bold text-hollow-text font-cinzel">Explainable Scoring</h3>
            <p className="text-[11px] text-hollow-muted mt-1 font-mono leading-relaxed">
              Deterministic 0-100 risk score with exact points: upfront fees (+25), urgency (+10), domain mismatch (+20).
            </p>
          </div>

          {/* Feature 3 */}
          <div 
            onMouseEnter={playHoverSound}
            className="p-4 rounded-xl hollow-card-3d border border-hollow-border hover:border-hollow-purple/50 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-hollow-purple/10 border border-hollow-purple/30 flex items-center justify-center text-hollow-lavender mb-2.5 shadow-sm group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 text-hollow-lavender" />
            </div>
            <h3 className="text-xs font-bold text-hollow-text font-cinzel">Guild Pattern Radar</h3>
            <p className="text-[11px] text-hollow-muted mt-1 font-mono leading-relaxed">
              Crowdsourced registry of reported scam domains. Verify recruiter handles before committing your details.
            </p>
          </div>

          {/* Feature 4 */}
          <div 
            onMouseEnter={playHoverSound}
            className="p-4 rounded-xl hollow-card-3d border border-hollow-border hover:border-hollow-crimson/50 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-hollow-crimson/10 border border-hollow-crimson/30 flex items-center justify-center text-hollow-crimson mb-2.5 shadow-sm group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-hollow-crimson" />
            </div>
            <h3 className="text-xs font-bold text-hollow-text font-cinzel">1-Click WhatsApp Shield</h3>
            <p className="text-[11px] text-hollow-muted mt-1 font-mono leading-relaxed">
              Generates a formatted warning alert with score and evidence breakdown to protect campus student groups.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
