import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, UploadCloud, Sparkles, 
  Trash2, ShieldCheck, ArrowRight, Zap,
  MessageCircle, Flame, Scroll
} from 'lucide-react';
import { playHoverSound, playClickSound, playScanSound } from '../utils/soundFx';

export default function OpportunityScanner({ 
  onAnalyzeText, 
  onAnalyzeImage, 
  isLoading, 
  samples 
}) {
  const [activeTab, setActiveTab] = useState('image'); // default to image for WhatsApp screenshot scanning!
  const [pastedText, setPastedText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loadingSampleImage, setLoadingSampleImage] = useState(false);
  const fileInputRef = useRef(null);

  // Listen for Clipboard Paste (Ctrl+V) anywhere on the page
  useEffect(() => {
    const handlePaste = (e) => {
      if (e.clipboardData && e.clipboardData.items) {
        for (let i = 0; i < e.clipboardData.items.length; i++) {
          const item = e.clipboardData.items[i];
          if (item.type.indexOf('image') !== -1) {
            const blob = item.getAsFile();
            setActiveTab('image');
            handleFileSelected(blob);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP)');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      playClickSound();
    };
    reader.readAsDataURL(file);
  };

  const clearSelectedFile = () => {
    playClickSound();
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load realistic WhatsApp sample screenshot
  const handleLoadSampleWhatsAppImage = async () => {
    playClickSound();
    setLoadingSampleImage(true);
    try {
      const res = await fetch('/api/sample-whatsapp-image');
      if (res.ok) {
        const blob = await res.blob();
        const file = new File([blob], 'whatsapp_scam_chat.png', { type: 'image/png' });
        setActiveTab('image');
        handleFileSelected(file);
      }
    } catch (err) {
      console.error('Failed to load sample WhatsApp image', err);
    } finally {
      setLoadingSampleImage(false);
    }
  };

  const handleScanSubmit = () => {
    playScanSound();
    if (activeTab === 'text') {
      if (!pastedText.trim()) return;
      onAnalyzeText(pastedText);
    } else {
      if (!selectedFile) return;
      onAnalyzeImage(selectedFile);
    }
  };

  return (
    <div className="hollow-card-3d hollow-frame rounded-2xl p-5 sm:p-7 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-hollow-amber/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header and Slot Tabs */}
      <div className="flex items-center justify-between border-b border-hollow-border/70 pb-4 mb-5 gap-3 flex-wrap relative z-10">
        <div className="flex items-center bg-hollow-abyss/80 p-1 rounded-xl border border-hollow-border/80 shadow-inner">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('image');
            }}
            onMouseEnter={playHoverSound}
            className={`px-4 py-2 rounded-lg font-cinzel text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'image'
                ? 'hollow-btn-primary font-bold shadow-md'
                : 'text-hollow-muted hover:text-hollow-text'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            WhatsApp Screenshot (OCR)
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('text');
            }}
            onMouseEnter={playHoverSound}
            className={`px-4 py-2 rounded-lg font-cinzel text-xs sm:text-sm flex items-center gap-2 transition-all ${
              activeTab === 'text'
                ? 'bg-gradient-to-r from-hollow-purple to-hollow-lavender text-black font-bold shadow-md shadow-hollow-purple/30'
                : 'text-hollow-muted hover:text-hollow-text'
            }`}
          >
            <FileText className="w-4 h-4" />
            Paste Opportunity Text
          </button>
        </div>

        {/* Quick Sample WhatsApp Loader (Ancient Relic Button) */}
        <button
          type="button"
          onClick={handleLoadSampleWhatsAppImage}
          onMouseEnter={playHoverSound}
          disabled={loadingSampleImage}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/40 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:-translate-y-0.5"
          title="Load sample WhatsApp offer screenshot"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>{loadingSampleImage ? 'Summoning Scroll...' : 'Try WhatsApp Chat Sample'}</span>
        </button>
      </div>

      {/* Input Area */}
      {activeTab === 'image' ? (
        /* WhatsApp & Image Upload Area */
        <div className="space-y-4 relative z-10">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative min-h-[210px] flex flex-col items-center justify-center ${
              dragActive
                ? 'border-hollow-amber bg-hollow-amber/10 shadow-[0_0_30px_rgba(255,122,0,0.3)]'
                : previewUrl
                ? 'border-hollow-border bg-hollow-abyss/90'
                : 'border-hollow-border/90 hover:border-hollow-amber/70 hover:bg-hollow-amber/5 bg-hollow-abyss/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="w-full flex flex-col items-center">
                <div className="relative max-h-60 overflow-hidden rounded-xl border-2 border-hollow-amber/50 mb-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  <img src={previewUrl} alt="WhatsApp Screenshot Preview" className="object-contain max-h-60 rounded-lg" />
                  <div className="absolute inset-0 border border-hollow-amber/30 pointer-events-none rounded-lg" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-hollow-muted font-mono">{selectedFile?.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelectedFile();
                    }}
                    className="px-3 py-1 text-xs bg-hollow-crimson/20 text-hollow-crimson hover:bg-hollow-crimson/30 rounded-lg border border-hollow-crimson/40 transition flex items-center gap-1.5 font-mono font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Change Screenshot
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center pointer-events-none">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-hollow-abyss border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.25)] animate-float-3d">
                  <MessageCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-hollow-text font-cinzel tracking-wide">
                  Drop WhatsApp Chat Screenshot Here or Press <kbd className="px-2 py-0.5 rounded bg-hollow-abyss border border-hollow-amber/50 text-hollow-amber text-xs font-mono font-bold shadow-sm">Ctrl + V</kbd> to Paste
                </h4>
                <p className="text-xs text-hollow-muted mt-2 max-w-md">
                  Detects fake appointment letters, Telegram group traps, paid training demands, and impersonated recruiter profiles.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full bg-hollow-abyss/80 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono shadow-sm">
                    ✦ Amazon Textract OCR
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-hollow-abyss/80 border border-hollow-purple/30 text-[11px] text-hollow-lavender font-mono shadow-sm">
                    ✦ Heuristic Detection Engine
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Paste Text Area */
        <div className="space-y-4 relative z-10">
          <div className="relative">
            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste the suspicious job, internship, or scholarship message here... (e.g. WhatsApp message, email, LinkedIn DM, or Telegram notice)"
              rows={6}
              className="w-full bg-hollow-abyss/80 border border-hollow-border/90 rounded-xl p-4 text-hollow-text placeholder-hollow-muted/50 text-sm focus:outline-none focus:border-hollow-amber focus:ring-1 focus:ring-hollow-amber transition resize-none leading-relaxed font-mono shadow-inner"
            />
            {pastedText && (
              <button
                onClick={() => {
                  playClickSound();
                  setPastedText('');
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-hollow-card hover:bg-hollow-border text-hollow-muted hover:text-hollow-text transition"
                title="Clear text"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-hollow-muted font-mono">
            <span>Characters: {pastedText.length}</span>
            <span>Rules: <strong className="text-hollow-amber">6 Explainable Risk Signals</strong></span>
          </div>
        </div>
      )}

      {/* 3D Primary Game Push-Button */}
      <div className="mt-6 relative z-10">
        <button
          onClick={handleScanSubmit}
          onMouseEnter={playHoverSound}
          disabled={isLoading || (activeTab === 'text' && !pastedText.trim()) || (activeTab === 'image' && !selectedFile)}
          className={`w-full py-4 px-6 rounded-xl font-cinzel font-extrabold text-sm sm:text-base tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl ${
            isLoading || (activeTab === 'text' && !pastedText.trim()) || (activeTab === 'image' && !selectedFile)
              ? 'bg-hollow-surface text-hollow-muted/60 border border-hollow-border cursor-not-allowed'
              : 'hollow-btn-primary'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>
                {activeTab === 'image' ? 'Summoning Amazon Textract OCR...' : 'Channeling Risk Verification Engine...'}
              </span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              <span>
                {activeTab === 'image' ? 'DISPEL & SCAN WHATSAPP SCREENSHOT' : 'DISPEL & SCAN MESSAGE'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
