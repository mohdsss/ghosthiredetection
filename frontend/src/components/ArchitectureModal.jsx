import React from 'react';
import { Cpu, Server, Database, Cloud, ShieldCheck, ArrowRight, Lock, Download } from 'lucide-react';

export default function ArchitectureModal({ onClose, awsStatus }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#181226] border border-ghost-border rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-ghost-border/70 flex items-center justify-between bg-ghost-bg/60">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-ghost-lavender" />
            <h3 className="text-base font-bold text-ghost-text">AWS Serverless Architecture</h3>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/api/download-architecture-pdf"
              target="_blank"
              download="GhostHire_System_Architecture.pdf"
              className="px-3 py-1.5 rounded-lg bg-ghost-orange hover:bg-[#FFA566] text-black font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-ghost-orange/20"
              title="Download official PDF report for judges"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </a>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-ghost-muted hover:text-ghost-text transition font-mono text-sm"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Data Path Flow */}
          <div className="p-4 rounded-xl bg-ghost-bg border border-ghost-border">
            <span className="text-xs font-mono uppercase tracking-wider text-ghost-orange block mb-2 font-bold">
              End-to-End Opportunity Data Flow
            </span>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-center">
              <span className="px-3 py-1.5 rounded-lg bg-ghost-card border border-ghost-border text-ghost-text">
                1. React Browser
              </span>
              <ArrowRight className="w-4 h-4 text-ghost-muted hidden sm:inline" />
              <span className="px-3 py-1.5 rounded-lg bg-ghost-card border border-ghost-border text-ghost-orange">
                2. S3 Presigned URL
              </span>
              <ArrowRight className="w-4 h-4 text-ghost-muted hidden sm:inline" />
              <span className="px-3 py-1.5 rounded-lg bg-ghost-card border border-ghost-border text-ghost-lavender">
                3. Textract OCR
              </span>
              <ArrowRight className="w-4 h-4 text-ghost-muted hidden sm:inline" />
              <span className="px-3 py-1.5 rounded-lg bg-ghost-card border border-ghost-border text-ghost-text">
                4. Lambda Risk Engine
              </span>
              <ArrowRight className="w-4 h-4 text-ghost-muted hidden sm:inline" />
              <span className="px-3 py-1.5 rounded-lg bg-ghost-card border border-ghost-border text-emerald-400">
                5. DynamoDB
              </span>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#151021] border border-ghost-border">
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="w-4 h-4 text-ghost-orange" />
                <h4 className="font-bold text-ghost-text">Amazon S3 (Screenshots)</h4>
              </div>
              <p className="text-ghost-muted leading-relaxed">
                Stores uploaded opportunity screenshots temporarily. Utilizes short-lived presigned upload URLs with automated 24-hour lifecycle cleanup to respect user privacy.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#151021] border border-ghost-border">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-ghost-lavender" />
                <h4 className="font-bold text-ghost-text">Amazon Textract (OCR)</h4>
              </div>
              <p className="text-ghost-muted leading-relaxed">
                Accurately detects and extracts text blocks and lines from messy mobile screenshots, chat bubbles, and formatted PDF letters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#151021] border border-ghost-border">
              <div className="flex items-center gap-2 mb-2">
                <Server className="w-4 h-4 text-ghost-orange" />
                <h4 className="font-bold text-ghost-text">AWS Lambda + API Gateway</h4>
              </div>
              <p className="text-ghost-muted leading-relaxed">
                Runs the modular Python risk rules engine serverlessly with sub-second execution latency, scaling to thousands of concurrent campus queries.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#151021] border border-ghost-border">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-ghost-text">Amazon DynamoDB</h4>
              </div>
              <p className="text-ghost-muted leading-relaxed">
                Stores analysis scan results, audit logs, and anonymized student-consented community reports with single-digit millisecond retrieval.
              </p>
            </div>
          </div>

          {/* Security & Implementation Guardrails */}
          <div className="p-4 rounded-xl bg-[#151021] border border-ghost-border flex items-start gap-3 text-xs">
            <Lock className="w-5 h-5 text-ghost-orange shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-ghost-text">Zero-Secret Frontend Principle</h4>
              <p className="text-ghost-muted">
                No AWS credentials or access keys are ever embedded into browser code. Direct uploads use short-lived presigned S3 URLs generated securely by backend Lambda execution roles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
