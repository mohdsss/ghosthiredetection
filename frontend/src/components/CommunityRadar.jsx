import React, { useState, useEffect } from 'react';
import { Search, ShieldAlert, CheckCircle, PlusCircle, AlertTriangle, User, Calendar, ExternalLink, Sparkles, Scroll, Flame } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/soundFx';

export default function CommunityRadar({ initialDomain, onReportSuccess }) {
  const [searchDomain, setSearchDomain] = useState(initialDomain || '');
  const [domainResult, setDomainResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recentFeed, setRecentFeed] = useState([]);

  // Modal form state
  const [formData, setFormData] = useState({
    domain: initialDomain || '',
    keywords: '',
    opportunity_title: '',
    notes: '',
    reporter_alias: 'Campus Student',
    user_consent: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const fetchRecentReports = async () => {
    try {
      const res = await fetch('/api/community-feed?limit=10');
      if (res.ok) {
        const data = await res.json();
        setRecentFeed(data);
      }
    } catch (e) {
      console.error('Failed to load recent reports', e);
    }
  };

  useEffect(() => {
    fetchRecentReports();
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
      alert('Please fill domain/keyword, notes and grant consent.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        keywords: formData.keywords ? formData.keywords.split(',').map(k => k.trim()).filter(Boolean) : []
      };
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const submittedIdentifier = formData.domain;
        setSubmitMessage('Threat report recorded! Identifier and student report are now live in Community Radar.');
        setTimeout(() => {
          setShowModal(false);
          setSubmitMessage(null);
          setSearchDomain(submittedIdentifier);
          fetchDomainIntelligence(submittedIdentifier);
          fetchRecentReports();
          if (onReportSuccess) onReportSuccess();
        }, 1200);
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
              placeholder="Search keyword, company, or domain (e.g. 'Nexora Labs', 'deposit fee', 'bit.ly')..."
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
              <span className="text-xs font-mono text-hollow-muted uppercase tracking-wider">Target Query / Keyword</span>
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

          {domainResult.total_reports > 0 && (
            <div className="mb-4 p-3.5 rounded-xl bg-hollow-crimson/15 border border-hollow-crimson/60 flex items-start gap-3 relative z-10">
              <AlertTriangle className="w-5 h-5 text-hollow-crimson flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-hollow-crimson font-cinzel">COMMUNITY THREAT RADAR ACTIVE</div>
                <p className="text-[11px] text-hollow-text/90 font-mono mt-0.5">
                  Keyword or domain <span className="text-hollow-amber font-bold">"{domainResult.domain}"</span> is actively flagged. Any opportunity or WhatsApp screenshot scanned containing this keyword will automatically be flagged as High Risk in the scanner!
                </p>
              </div>
            </div>
          )}

          {domainResult.reports.length === 0 ? (
            <div className="text-center py-8 relative z-10">
              <CheckCircle className="w-9 h-9 text-emerald-400 mx-auto mb-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <p className="text-sm font-medium text-hollow-text font-cinzel">No reports logged against this keyword or domain.</p>
              <p className="text-xs text-hollow-muted mt-1 font-mono">
                Notice anything suspicious? Submit a report with this keyword to protect other students.
              </p>
            </div>
          ) : (
            <div className="space-y-4 relative z-10">
              {domainResult.reports.map((rep) => (
                <div 
                  key={rep.id} 
                  onMouseEnter={playHoverSound}
                  className="p-5 rounded-xl bg-hollow-abyss/90 border border-hollow-border hover:border-hollow-amber/60 transition duration-200 shadow-lg space-y-3"
                >
                  {/* Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pb-2 border-b border-hollow-border/60">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-hollow-crimson/20 border border-hollow-crimson/50 text-hollow-crimson font-bold flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        FLAGGED: {rep.domain}
                      </span>
                      {rep.keywords && rep.keywords.length > 0 && (
                        <span className="px-2 py-0.5 rounded bg-hollow-purple/20 border border-hollow-purple/40 text-hollow-lavender text-[10px]">
                          Tags: {rep.keywords.slice(0, 4).join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-hollow-muted">
                      <span className="flex items-center gap-1.5 text-hollow-lavender">
                        <User className="w-3.5 h-3.5" />
                        {rep.reporter_alias}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(rep.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Opportunity Title */}
                  <h4 className="text-sm font-bold text-hollow-amber font-cinzel flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-hollow-amber" />
                    {rep.opportunity_title || 'Unspecified Suspicious Opportunity'}
                  </h4>

                  {/* Written Student Report Description / Notes */}
                  <div className="p-3.5 rounded-xl bg-hollow-surface/95 border border-hollow-border/80 font-mono shadow-inner">
                    <div className="text-[10px] uppercase tracking-wider text-hollow-muted font-bold mb-1 flex items-center gap-1.5">
                      <Scroll className="w-3 h-3 text-hollow-amber" />
                      Student Evidence & Scam Report:
                    </div>
                    <p className="text-xs text-hollow-text/95 leading-relaxed whitespace-pre-wrap">
                      "{rep.notes}"
                    </p>
                  </div>

                  {/* Active Protection Note */}
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 pt-1">
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                    <span>Active Protection: Any scan matching "{rep.domain}" triggers automated High Risk alert.</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Live Recent Community Reports Feed */}
      {recentFeed.length > 0 && (
        <div className="hollow-card-3d hollow-frame rounded-2xl p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-hollow-border/80 mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <Scroll className="w-4 h-4 text-hollow-amber" />
              <h3 className="text-sm font-bold text-hollow-text font-cinzel">
                Recent Campus Threat Reports ({recentFeed.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-hollow-muted">
              Live Feed from Student Guild Registry
            </span>
          </div>

          <div className="space-y-3 relative z-10">
            {recentFeed.slice(0, 5).map((feedItem) => (
              <div
                key={feedItem.id}
                onClick={() => {
                  setSearchDomain(feedItem.domain);
                  fetchDomainIntelligence(feedItem.domain);
                }}
                className="p-3.5 rounded-xl bg-hollow-abyss/70 border border-hollow-border/80 hover:border-hollow-amber/60 cursor-pointer transition text-xs font-mono space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-hollow-amber flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-hollow-crimson" />
                    {feedItem.domain}
                  </span>
                  <span className="text-[10px] text-hollow-muted">
                    {new Date(feedItem.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-hollow-text/80 line-clamp-2 text-[11px]">
                  "{feedItem.notes}"
                </p>
              </div>
            ))}
          </div>
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
                <div className="p-3 rounded-xl bg-hollow-amber/10 border border-hollow-amber/40 text-[11px] text-hollow-amber flex items-start gap-2">
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>⚡ Automatic Risk Sync:</strong> Once submitted, any student who scans text or a WhatsApp chat containing this keyword will automatically be warned with a High Risk alert!
                  </span>
                </div>

                <div>
                  <label className="block text-hollow-muted font-bold mb-1">Domain, Company, or Threat Keyword *</label>
                  <input
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="e.g. Nexora Labs, telegram-task, bit.ly/offer, ₹2000 deposit"
                    className="w-full bg-hollow-abyss border border-hollow-border rounded-lg p-2.5 text-hollow-text focus:outline-none focus:border-hollow-amber font-mono"
                  />
                </div>

                <div>
                  <label className="block text-hollow-muted font-bold mb-1">Additional Trigger Keywords (Optional, comma-separated)</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="e.g. nexora, telegram bonus, ₹1500 registration"
                    className="w-full bg-hollow-abyss border border-hollow-border rounded-lg p-2.5 text-hollow-text focus:outline-none focus:border-hollow-amber font-mono"
                  />
                  <span className="text-[10px] text-hollow-muted mt-0.5 block">
                    Comma-separated terms that should trigger community radar warnings.
                  </span>
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
