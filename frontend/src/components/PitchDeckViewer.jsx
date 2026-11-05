import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Ghost, ShieldAlert, Cpu, Sparkles, 
  Target, Award, CheckCircle, ArrowRight, Layers
} from 'lucide-react';

export default function PitchDeckViewer({ onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      number: "01",
      title: "GhostHire",
      subtitle: "Expose Fake Opportunities Before They Ghost You",
      tagline: "Hack-to-ween 2026 / Open Innovation Track",
      icon: Ghost,
      color: "text-ghost-orange",
      bgGradient: "from-ghost-orange/15 to-transparent",
      content: (
        <div className="space-y-4">
          <p className="text-base text-ghost-text leading-relaxed">
            An evidence-based opportunity verification platform empowering college students and early-career jobseekers to detect scam offers before paying money or leaking credentials.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-4 rounded-xl bg-ghost-bg border border-ghost-border">
              <span className="text-xs font-mono text-ghost-orange block mb-1">01 / INPUT</span>
              <p className="text-xs text-ghost-muted">WhatsApp messages, screenshot offers, Telegram notices, campus DMs.</p>
            </div>
            <div className="p-4 rounded-xl bg-ghost-bg border border-ghost-border">
              <span className="text-xs font-mono text-ghost-lavender block mb-1">02 / CORE</span>
              <p className="text-xs text-ghost-muted">AWS Textract OCR + Explainable Heuristic Rule Engine.</p>
            </div>
            <div className="p-4 rounded-xl bg-ghost-bg border border-ghost-border">
              <span className="text-xs font-mono text-emerald-400 block mb-1">03 / OUTPUT</span>
              <p className="text-xs text-ghost-muted">Score (0-100), itemized red-flag evidence, and safe next-step actions.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      number: "02",
      title: "The Problem",
      subtitle: "The Campus Scam Pandemic Exploiting Student Anxiety",
      icon: ShieldAlert,
      color: "text-ghost-danger",
      bgGradient: "from-ghost-danger/15 to-transparent",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-ghost-text leading-relaxed">
            Millions of students receive deceptive internship and job announcements via social media and messaging channels. Desperate for career breakthroughs, students lack fast verification tools.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-ghost-bg border border-ghost-danger/30">
              <h4 className="text-xs font-bold text-ghost-danger uppercase mb-1">Upfront Registration Traps</h4>
              <p className="text-xs text-ghost-muted">Asking ₹999 to ₹5,000 for "exam fees", "laptop insurance", or "document verification".</p>
            </div>
            <div className="p-3.5 rounded-xl bg-ghost-bg border border-ghost-danger/30">
              <h4 className="text-xs font-bold text-ghost-danger uppercase mb-1">Brand Impersonation</h4>
              <p className="text-xs text-ghost-muted">Recruiters using @gmail.com or lookalike domains posing as Microsoft, Google, or TCS.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-ghost-bg border border-ghost-danger/30">
              <h4 className="text-xs font-bold text-ghost-danger uppercase mb-1">Artificial Urgency Tactics</h4>
              <p className="text-xs text-ghost-muted">"Reply within 30 minutes to secure your seat", provoking panicked payments.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-ghost-bg border border-ghost-danger/30">
              <h4 className="text-xs font-bold text-ghost-danger uppercase mb-1">Credential Harvesting</h4>
              <p className="text-xs text-ghost-muted">Collecting Aadhaar OTP, UPI PIN, or bank credentials under onboarding pretext.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      number: "03",
      title: "The Solution",
      subtitle: "Explainable Verification, Not Black-Box Guesswork",
      icon: Target,
      color: "text-ghost-orange",
      bgGradient: "from-ghost-orange/15 to-transparent",
      content: (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-ghost-orange/10 border border-ghost-orange/40">
            <span className="text-xs font-bold uppercase text-ghost-orange block mb-1">The Product Promise</span>
            <p className="text-sm font-semibold text-ghost-text">
              Not "AI says this is a scam." Instead: "Here are the specific signals we found, the exact evidence behind each one, and how you can independently verify the opportunity."
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            {["1. Paste / Upload", "2. OCR Extraction", "3. Heuristic Rules", "4. Evidence Report", "5. Community Guard"].map((step, idx) => (
              <div key={idx} className="flex-1 w-full text-center p-2 rounded-lg bg-ghost-bg border border-ghost-border text-xs font-mono">
                {step}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      number: "04",
      title: "Product Experience & Live Demo",
      subtitle: "From Screenshot to Transparent Risk Breakdown in Seconds",
      icon: Sparkles,
      color: "text-ghost-lavender",
      bgGradient: "from-ghost-lavender/15 to-transparent",
      content: (
        <div className="space-y-4">
          <p className="text-xs text-ghost-text">
            Judges can test the exact Nexora Labs scenario right in the dashboard:
          </p>
          <div className="p-3.5 rounded-xl bg-ghost-bg border border-ghost-border font-mono text-xs text-ghost-muted">
            <span className="text-ghost-orange font-bold block mb-1">Live Demo Input:</span>
            "Congratulations! You have been shortlisted for the Nexora Labs internship. Pay ₹999 registration fees today. Selection is guaranteed. Apply through bit.ly/example. Reply within 30 minutes to secure your seat."
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded bg-ghost-bg border border-ghost-border">
              <span className="text-ghost-danger font-bold block">+25</span>
              Upfront Fee
            </div>
            <div className="p-2 rounded bg-ghost-bg border border-ghost-border">
              <span className="text-ghost-orange font-bold block">+15</span>
              Guaranteed
            </div>
            <div className="p-2 rounded bg-ghost-bg border border-ghost-border">
              <span className="text-ghost-orange font-bold block">+15</span>
              Shortened URL
            </div>
            <div className="p-2 rounded bg-ghost-bg border border-ghost-border">
              <span className="text-ghost-lavender font-bold block">+10</span>
              30m Urgency
            </div>
          </div>
          <div className="text-center font-mono font-bold text-sm text-ghost-danger">
            Result: 65 / 100 [HIGH RISK] with clear verification action
          </div>
        </div>
      )
    },
    {
      number: "05",
      title: "AWS Cloud Architecture",
      subtitle: "Real Cloud Services Doing Real Work",
      icon: Cpu,
      color: "text-ghost-orange",
      bgGradient: "from-ghost-orange/15 to-transparent",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-ghost-bg border border-ghost-border">
              <strong className="text-ghost-orange block mb-1">Amazon Textract</strong>
              <p className="text-ghost-muted">Extracts raw text blocks from screenshots (WhatsApp, emails, job posts).</p>
            </div>
            <div className="p-3 rounded-xl bg-ghost-bg border border-ghost-border">
              <strong className="text-ghost-orange block mb-1">Amazon S3</strong>
              <p className="text-ghost-muted">Temporary screenshot uploads using secure presigned URLs with auto-deletion lifecycle.</p>
            </div>
            <div className="p-3 rounded-xl bg-ghost-bg border border-ghost-border">
              <strong className="text-ghost-orange block mb-1">AWS Lambda (Python) + Mangum</strong>
              <p className="text-ghost-muted">Serverless execution of the explainable risk engine and OCR orchestration.</p>
            </div>
            <div className="p-3 rounded-xl bg-ghost-bg border border-ghost-border">
              <strong className="text-ghost-orange block mb-1">Amazon DynamoDB</strong>
              <p className="text-ghost-muted">Stores scan metadata, audit logs, and student-reported community intelligence.</p>
            </div>
          </div>
          <p className="text-[11px] text-ghost-muted font-mono text-center pt-1">
            Browser ➔ Presigned S3 URL ➔ Textract OCR ➔ Lambda Analysis ➔ DynamoDB Result
          </p>
        </div>
      )
    },
    {
      number: "06",
      title: "Innovation & Impact",
      subtitle: "Why GhostHire Stands Apart",
      icon: Award,
      color: "text-emerald-400",
      bgGradient: "from-emerald-500/15 to-transparent",
      content: (
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-ghost-bg border border-ghost-border">
            <strong className="text-emerald-400 block mb-1">1. Explainability First</strong>
            <p className="text-ghost-muted">Unlike generative LLMs prone to hallucinated verdicts, GhostHire presents exact quotes, signal codes, and points.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-ghost-bg border border-ghost-border">
            <strong className="text-emerald-400 block mb-1">2. Guardrail Mindset</strong>
            <p className="text-ghost-muted">We prioritize evidence over accusations. GhostHire flags risk indicators, not declarations of criminal guilt.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-ghost-bg border border-ghost-border">
            <strong className="text-emerald-400 block mb-1">3. Privacy-Conscious Community Intelligence</strong>
            <p className="text-ghost-muted">User-consented anonymized pattern sharing creates collective campus defense against predatory networks.</p>
          </div>
        </div>
      )
    },
    {
      number: "07",
      title: "Future Scope & Roadmap",
      subtitle: "Scaling from Campus Protection to Enterprise Trust",
      icon: Layers,
      color: "text-ghost-lavender",
      bgGradient: "from-ghost-lavender/15 to-transparent",
      content: (
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-ghost-bg border border-ghost-border">
              <span className="font-bold text-ghost-orange block mb-1">Placement Cell Portal</span>
              <p className="text-ghost-muted">College placement boards can integrate GhostHire as an automated vetting gateway for incoming recruiter drives.</p>
            </div>
            <div className="p-4 rounded-xl bg-ghost-bg border border-ghost-border">
              <span className="font-bold text-ghost-lavender block mb-1">Regional Languages</span>
              <p className="text-ghost-muted">Support vernacular job messages in Hindi, Tamil, Telugu, and other languages via Amazon Translate.</p>
            </div>
            <div className="p-4 rounded-xl bg-ghost-bg border border-ghost-border">
              <span className="font-bold text-emerald-400 block mb-1">Corporate Domain Registry</span>
              <p className="text-ghost-muted">Partner with official job boards and verified ATS providers to confirm authorized recruitment emails.</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-ghost-card border border-ghost-orange/30 text-center font-mono text-xs text-ghost-orange">
            "Every fake opportunity begins with a message. GhostHire turns suspicious messages into actionable evidence."
          </div>
        </div>
      )
    }
  ];

  const current = slides[currentSlide];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#181226] border border-ghost-border rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Pitch Deck Header */}
        <div className="px-6 py-4 border-b border-ghost-border/70 flex items-center justify-between bg-ghost-bg/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-ghost-orange">SLIDE {current.number} OF {slides.length}</span>
            <span className="text-xs text-ghost-muted">| GhostHire Hackathon Pitch Deck</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ghost-muted hover:text-ghost-text transition font-mono text-sm"
          >
            ✕ Close
          </button>
        </div>

        {/* Slide Body */}
        <div className={`p-6 sm:p-8 flex-1 overflow-y-auto bg-gradient-to-b ${current.bgGradient}`}>
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-2xl bg-ghost-bg border border-ghost-border ${current.color}`}>
              <Icon className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-ghost-muted">Slide {current.number}</span>
              <h2 className="text-2xl font-black text-ghost-text tracking-tight">{current.title}</h2>
              <p className="text-xs sm:text-sm font-medium text-ghost-orange mt-0.5">{current.subtitle}</p>
            </div>
          </div>

          <div className="mt-4">
            {current.content}
          </div>
        </div>

        {/* Slide Navigation Footer */}
        <div className="px-6 py-4 border-t border-ghost-border/70 bg-ghost-bg/80 flex items-center justify-between">
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-6 bg-ghost-orange' : 'w-2 bg-ghost-border hover:bg-ghost-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className={`p-2 rounded-lg border border-ghost-border transition ${
                currentSlide === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-ghost-border/50 text-ghost-text'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
              className={`p-2 rounded-lg border border-ghost-border transition ${
                currentSlide === slides.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-ghost-border/50 text-ghost-text'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
