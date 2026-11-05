import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, CheckCircle, PlusCircle, AlertTriangle, User, Calendar, ExternalLink, Sparkles, Scroll, Flame } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/soundFx';

export default function CommunityRadar({ initialDomain, onReportSuccess }) {
  const [searchDomain, setSearchDomain] = useState(initialDomain || '');
  const [domainResult, setDomainResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Modal form state
  const [formData, setFormData] = useState({
    domain: initialDomain || '',
    opportunity_title: '',
    notes: '',
    reporter_alias: 'Campus Student',
    user_consent: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => {
    if (initialDomain) {
      setSearchDomain(initialDomain);
      fetchDomainIntelligence(initialDomain);
      setFormData(prev => ({ ...prev, domain: initialDomain }));
    } else {
      // Default query common reported domain
      fetchDomainIntelligence('bit.ly');
    }
  }, [initialDomain]);

  const fetchDomainIntelligence = async (domain) => {
    if (!domain) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/community/${encodeURIComponent(domain)}`);
      if (res.ok) {
        const data = await res.json();
        setDomainResult(data);
      }
    } catch (err) {
      console.error('Failed to fetch community domain report', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    playClickSound();
    fetchDomainIntelligence(searchDomain);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    if (!formData.domain || !formData.notes || !formData.user_consent) {
      alert('Please fill domain, notes and grant consent.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitMessage('Report successfully recorded into Guild Bounty Registry!');
        setTimeout(() => {
          setShowModal(false);
          setSubmitMessage(null);
          fetchDomainIntelligence(formData.domain);
          if (onReportSuccess) onReportSuccess();
        }, 1500);
      }
    } catch (err) {
      alert('Error submitting report.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Search */}
      <div className="hollow-card-3d hollow-frame rounded-2xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <Scroll className="w-5 h-5 text-hollow-amber" />
              <h2 className="text-lg font-bold text-hollow-text font-cinzel">
                Guild Bounty & Pattern Intelligence
              </h2>
            </div>
            <p className="text-xs text-hollow-muted mt-1 font-mono">
              Cross-reference suspicious domains, links, and recruiter handles reported by students.
            </p>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setShowModal(true);
            }}
            onMouseEnter={playHoverSound}
            className="hollow-btn-primary px-4 py-2 rounded-xl text-xs sm:text-sm font-cinzel font-bold flex items-center gap-2 self-start md:self-auto shadow-lg"
          >
            <PlusCircle className="w-4 h-4" />
            Report Suspicious Offer
          </button>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 relative z-10">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-hollow-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchDomain}
              onChange={(e) => setSearchDomain(e.target.value)}
              placeholder="Search domain or short link (e.g. bit.ly, nexora-careers.xyz)..."
              className="w-full bg-hollow-abyss/80 border border-hollow-border/90 rounded-xl pl-10 pr-4 py-2.5 text-sm text-hollow-text placeholder-hollow-muted/50 focus:outline-none focus:border-hollow-amber focus:ring-1 focus:ring-hollow-amber transition font-mono shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            onMouseEnter={playHoverSound}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-hollow-purple to-hollow-lavender text-black font-cinzel font-bold text-xs sm:text-sm hover:opacity-90 transition shadow-lg shadow-hollow-purple/30"
          >
            {isSearching ? 'Scouting...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Domain Lookup Result */}
      {domainResult && (
        <div className="hollow-card-3d hollow-frame rounded-2xl p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-hollow-border/80 mb-5 relative z-10">
            <div>
              <span className="text-xs font-mono text-hollow-muted uppercase tracking-wider">Target Domain</span>
              <h3 className="text-xl font-bold font-mono text-hollow-amber flex items-center gap-2">
                <Flame className="w-4 h-4 text-hollow-amber" />
                {domainResult.domain}
              </h3>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border shadow-md ${
                domainResult.total_reports > 0
                  ? 'bg-hollow-crimson/15 text-hollow-crimson border-hollow-crimson/50'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/50'
              }`}>
                {domainResult.total_reports} Verified Student Reports
              </span>
            </div>
          </div>

          {domainResult.reports.length === 0 ? (
            <div className="text-center py-8 relative z-10">
              <CheckCircle className="w-9 h-9 text-emerald-400 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <p className="text-sm font-medium text-hollow-text font-cinzel">No reports logged against this domain.</p>
              <p className="text-xs text-hollow-muted mt-1 font-mono">
                Notice anything suspicious? Submit a report to protect other applicants.
              </p>
            </div>
          ) : (
            <div className="space-y-3 relative z-10">
              {domainResult.reports.map((rep) => (
                <div 
                  key={rep.id} 
                  onMouseEnter={playHoverSound}
                  className="p-4 rounded-xl bg-hollow-abyss/80 border border-hollow-border hover:border-hollow-amber/50 transition duration-200 shadow-md"
                >
                  <div className="flex items-center justify-between text-xs text-hollow-muted mb-2 font-mono">
                    <span className="flex items-center gap-1.5 text-hollow-lavender font-semibold">
                      <User className="w-3.5 h-3.5" />
                      {rep.reporter_alias}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(rep.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-hollow-text mb-1 font-cinzel">
                    {rep.opportunity_title || 'Unspecified Offer'}
                  </h4>

                  <p className="text-xs text-hollow-text/95 bg-hollow-surface/90 p-3 rounded-lg border border-hollow-border/70 font-mono shadow-inner">
                    "{rep.notes}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Submit Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="hollow-card-3d hollow-frame rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4 border-2 border-hollow-amber/40">
            <div className="flex items-center justify-between pb-3 border-b border-hollow-border/80">
              <h3 className="text-base font-bold text-hollow-text flex items-center gap-2 font-cinzel">
                <ShieldAlert className="w-5 h-5 text-hollow-amber" />
                Submit Opportunity for Guild Alert
              </h3>
              <button
                onClick={() => {
                  playClickSound();
                  setShowModal(false);
                }}
                className="text-hollow-muted hover:text-hollow-text text-sm font-mono p-1 rounded-lg hover:bg-hollow-border"
              >
                ✕
              </button>
            </div>

            {submitMessage ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm text-center font-mono">
                {submitMessage}
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block text-hollow-muted font-bold mb-1">Domain or Identifier *</label>
                  <input
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="e.g. bit.ly, nexora-careers.xyz"
                    className="w-full bg-hollow-abyss border border-hollow-border rounded-lg p-2.5 text-hollow-text focus:outline-none focus:border-hollow-amber"
                  />
                </div>

                <div>
                  <label className="block text-hollow-muted font-bold mb-1">Opportunity Title</label>
                  <input
                    type="text"
                    value={formData.opportunity_title}
                    onChange={(e) => setFormData({ ...formData, opportunity_title: e.target.value })}
                    placeholder="e.g. Data Entry Specialist / React Intern"
                    className="w-full bg-hollow-abyss border border-hollow-border rounded-lg p-2.5 text-hollow-text focus:outline-none focus:border-hollow-amber"
                  />
                </div>

                <div>
                  <label className="block text-hollow-muted font-bold mb-1">What made this suspicious? *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Demanded ₹999 registration fee via Google Pay, claimed selection without interview..."
                    className="w-full bg-hollow-abyss border border-hollow-border rounded-lg p-2.5 text-hollow-text focus:outline-none focus:border-hollow-amber resize-none"
                  />
                </div>

                <div>
                  <label className="block text-hollow-muted font-bold mb-1">Reporter Alias (Optional)</label>
                  <input
                    type="text"
                    value={formData.reporter_alias}
                    onChange={(e) => setFormData({ ...formData, reporter_alias: e.target.value })}
                    placeholder="e.g. Placement Rep / Anonymous Student"
                    className="w-full bg-hollow-abyss border border-hollow-border rounded-lg p-2.5 text-hollow-text focus:outline-none focus:border-hollow-amber"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.user_consent}
                    onChange={(e) => setFormData({ ...formData, user_consent: e.target.checked })}
                    className="mt-0.5 rounded border-hollow-border accent-hollow-amber"
                  />
                  <label htmlFor="consent" className="text-hollow-muted text-[11px] leading-relaxed cursor-pointer">
                    I consent to sharing this anonymized pattern with the campus student community to prevent fraud.
                  </label>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setShowModal(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-hollow-abyss hover:bg-hollow-border text-hollow-muted text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="hollow-btn-primary px-5 py-2 rounded-lg text-xs font-bold font-cinzel"
                  >
                    {submitting ? 'Recording...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
