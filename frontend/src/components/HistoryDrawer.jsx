import React, { useState, useEffect } from 'react';
import { History, Clock, ChevronRight, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

export default function HistoryDrawer({ onClose, onSelectScan }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/history?limit=20');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history', err);
    } finally {
      setLoading(false);
    }
  };

  const getPill = (score) => {
    if (score >= 60) return 'bg-ghost-danger/15 text-ghost-danger border-ghost-danger/40';
    if (score >= 30) return 'bg-ghost-orange/15 text-ghost-orange border-ghost-orange/40';
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
      <div className="bg-[#181226] border-l border-ghost-border w-full max-w-md h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-ghost-border/70 flex items-center justify-between bg-ghost-bg/70">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-ghost-lavender" />
            <h3 className="text-sm font-bold text-ghost-text">Recent Verification Scans</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ghost-muted hover:text-ghost-text transition font-mono text-sm"
          >
            ✕ Close
          </button>
        </div>

        {/* List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {loading ? (
            <div className="text-center py-12 text-ghost-muted text-xs">
              Loading past scans...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-ghost-muted text-xs">
              No scans recorded yet. Scan an opportunity to see it here!
            </div>
          ) : (
            history.map((scan) => (
              <div
                key={scan.id}
                onClick={() => {
                  onSelectScan(scan);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-ghost-bg hover:bg-ghost-card border border-ghost-border transition cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getPill(scan.risk_score)}`}>
                      {scan.risk_score}/100 {scan.risk_level}
                    </span>
                    <span className="text-[10px] font-mono text-ghost-muted">#{scan.id}</span>
                  </div>
                  <p className="text-xs text-ghost-text/90 line-clamp-2">
                    {scan.extracted_text || 'Text analysis'}
                  </p>
                  <span className="text-[10px] text-ghost-muted flex items-center gap-1 mt-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {scan.analyzed_at ? new Date(scan.analyzed_at).toLocaleTimeString() : 'Just now'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-ghost-muted group-hover:text-ghost-orange transition" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
