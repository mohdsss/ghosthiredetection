import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HalloweenHeroSection from './components/HalloweenHeroSection';
import GhostRadarVisual from './components/GhostRadarVisual';
import OpportunityScanner from './components/OpportunityScanner';
import RiskReportCard from './components/RiskReportCard';
import CommunityRadar from './components/CommunityRadar';
import PitchDeckViewer from './components/PitchDeckViewer';
import ArchitectureModal from './components/ArchitectureModal';
import HistoryDrawer from './components/HistoryDrawer';
import HollowParticles from './components/HollowParticles';
import { Ghost, ShieldCheck, Flame, ExternalLink, Sparkles, Scroll, Compass } from 'lucide-react';
import { playClickSound, playHoverSound } from './utils/soundFx';

export default function App() {
  const [activeView, setActiveView] = useState('scanner'); // 'scanner' | 'community'
  const [currentReport, setCurrentReport] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [awsStatus, setAwsStatus] = useState(null);
  const [samples, setSamples] = useState([]);
  const [prefilledDomain, setPrefilledDomain] = useState('');
  
  // Modals
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Fetch initial backend configuration & samples
    fetchConfig();
    fetchSamples();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setAwsStatus(data);
      }
    } catch (err) {
      console.error('Config fetch failed', err);
    }
  };

  const fetchSamples = async () => {
    try {
      const res = await fetch('/api/samples');
      if (res.ok) {
        const data = await res.json();
        setSamples(data);
      }
    } catch (err) {
      console.error('Samples fetch failed', err);
    }
  };

  // Scroll to scanner section
  const handleScrollToScanner = () => {
    setActiveView('scanner');
    setTimeout(() => {
      const el = document.getElementById('scanner-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  // Analyze text via backend API
  const handleAnalyzeText = async (text) => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentReport(data);
      } else {
        const err = await res.json();
        alert(`Analysis failed: ${err.detail || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Error connecting to backend API. Please make sure the backend is running.');
    } finally {
      setIsScanning(false);
    }
  };

  // Analyze screenshot image via backend API
  const handleAnalyzeImage = async (file) => {
    setIsScanning(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/analyze/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentReport(data);
      } else {
        const err = await res.json();
        alert(`Screenshot OCR failed: ${err.detail || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Error uploading screenshot for OCR processing.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleReportToCommunity = (domain, evidence) => {
    setPrefilledDomain(domain);
    setActiveView('community');
  };

  return (
    <div className="min-h-screen bg-[#0A0612] text-[#F3EEFF] flex flex-col relative selection:bg-hollow-amber selection:text-black">
      {/* 3D Atmospheric HollowKeep Ember Particles Canvas */}
      <HollowParticles />

      {/* Atmospheric Ambient Light Fog Orbs */}
      <div className="fixed top-0 left-1/4 w-[32rem] h-[32rem] bg-hollow-purple/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[32rem] h-[32rem] bg-hollow-amber/12 rounded-full blur-[160px] pointer-events-none" />

      {/* Navigation Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        awsStatus={awsStatus}
        onOpenArchitecture={() => setShowArchitecture(true)}
        onOpenPitchDeck={() => setShowPitchDeck(true)}
        onOpenHistory={() => setShowHistory(true)}
      />

      {/* Hero Welcome Ribbon */}
      <div className="border-b border-hollow-border/60 bg-gradient-to-r from-hollow-amber/10 via-hollow-purple/10 to-transparent py-2 px-4 text-center relative z-10 backdrop-blur-sm">
        <p className="text-xs font-mono text-hollow-muted flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-hollow-amber animate-pulse" />
          <span>Hack-to-ween 2026: Evidence-based opportunity risk verification for students.</span>
          <button 
            onClick={() => {
              playClickSound();
              setShowPitchDeck(true);
            }}
            onMouseEnter={playHoverSound}
            className="text-hollow-amber hover:underline font-bold font-cinzel ml-1"
          >
            Open 7-Slide Pitch Deck →
          </button>
        </p>
      </div>

      {/* Interactive Spooky Halloween Hero Section (Haunted Forest & Crystal Altar) */}
      <HalloweenHeroSection 
        onScrollToScanner={handleScrollToScanner}
        onOpenCommunity={() => setActiveView('community')}
        onOpenPitchDeck={() => setShowPitchDeck(true)}
      />

      {/* Main Content Area */}
      <main id="scanner-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 scroll-mt-20">
        {activeView === 'scanner' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Ghost-Radar HUD (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
              <GhostRadarVisual
                isScanning={isScanning}
                score={currentReport?.risk_score}
                riskLevel={currentReport?.risk_level}
                findingsCount={currentReport?.findings?.length}
              />

              {/* The HollowKeep Detection Codex Card */}
              <div className="hollow-card-3d hollow-frame rounded-2xl p-4 sm:p-5 text-xs text-hollow-muted space-y-2.5">
                <div className="flex items-center gap-2 text-hollow-text font-bold font-cinzel">
                  <Flame className="w-4 h-4 text-hollow-amber" />
                  <span>The HollowKeep Grimoire of Rules</span>
                </div>
                <ul className="space-y-1.5 font-mono text-[11px] list-none">
                  <li className="flex items-center justify-between p-1.5 rounded-lg bg-hollow-abyss/60 border border-hollow-border/40">
                    <span>Upfront Fee Demand:</span>
                    <span className="text-hollow-crimson font-bold">+25 pts</span>
                  </li>
                  <li className="flex items-center justify-between p-1.5 rounded-lg bg-hollow-abyss/60 border border-hollow-border/40">
                    <span>Sender Domain Mismatch:</span>
                    <span className="text-hollow-crimson font-bold">+20 pts</span>
                  </li>
                  <li className="flex items-center justify-between p-1.5 rounded-lg bg-hollow-abyss/60 border border-hollow-border/40">
                    <span>Guaranteed Direct Selection:</span>
                    <span className="text-hollow-amber font-bold">+15 pts</span>
                  </li>
                  <li className="flex items-center justify-between p-1.5 rounded-lg bg-hollow-abyss/60 border border-hollow-border/40">
                    <span>Shortened / Masked URL:</span>
                    <span className="text-hollow-amber font-bold">+15 pts</span>
                  </li>
                  <li className="flex items-center justify-between p-1.5 rounded-lg bg-hollow-abyss/60 border border-hollow-border/40">
                    <span>Credential / OTP Phishing:</span>
                    <span className="text-hollow-crimson font-bold">+15 pts</span>
                  </li>
                  <li className="flex items-center justify-between p-1.5 rounded-lg bg-hollow-abyss/60 border border-hollow-border/40">
                    <span>Artificial Panic (&lt;30m Urgency):</span>
                    <span className="text-hollow-lavender font-bold">+10 pts</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Opportunity Scanner & Report Card (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <OpportunityScanner
                onAnalyzeText={handleAnalyzeText}
                onAnalyzeImage={handleAnalyzeImage}
                isLoading={isScanning}
                samples={samples}
              />

              {currentReport && (
                <div id="report-section">
                  <RiskReportCard
                    report={currentReport}
                    onReportToCommunity={handleReportToCommunity}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Community View */
          <div className="max-w-4xl mx-auto">
            <CommunityRadar
              initialDomain={prefilledDomain}
              onReportSuccess={fetchConfig}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-hollow-border/80 bg-[#07040E] py-6 text-center text-xs text-hollow-muted relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Ghost className="w-4 h-4 text-hollow-amber" />
            <span className="font-bold text-hollow-text font-cinzel">GhostHire</span>
            <span className="font-mono text-[11px]">— Dispel predatory opportunities before they ghost you.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>AWS Textract • S3 • DynamoDB</span>
            <span>•</span>
            <button 
              onClick={() => {
                playClickSound();
                setShowArchitecture(true);
              }} 
              onMouseEnter={playHoverSound}
              className="hover:text-hollow-amber transition"
            >
              Architecture
            </button>
            <span>•</span>
            <button 
              onClick={() => {
                playClickSound();
                setShowPitchDeck(true);
              }} 
              onMouseEnter={playHoverSound}
              className="hover:text-hollow-amber transition"
            >
              Pitch Deck
            </button>
          </div>
        </div>
      </footer>

      {/* Pitch Deck Modal */}
      {showPitchDeck && (
        <PitchDeckViewer onClose={() => setShowPitchDeck(false)} />
      )}

      {/* Architecture Modal */}
      {showArchitecture && (
        <ArchitectureModal onClose={() => setShowArchitecture(false)} awsStatus={awsStatus} />
      )}

      {/* Scan History Drawer */}
      {showHistory && (
        <HistoryDrawer
          onClose={() => setShowHistory(false)}
          onSelectScan={(scan) => setCurrentReport(scan)}
        />
      )}
    </div>
  );
}
