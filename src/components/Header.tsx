import React from "react";
import { GraduationCap, BookOpen, Clock, Printer, Sparkles, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  hasApiKey: boolean;
  historyCount: number;
  onOpenHistory: () => void;
  onPrint?: () => void;
  hasCurrentContent: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  hasApiKey,
  historyCount,
  onOpenHistory,
  onPrint,
  hasCurrentContent,
}) => {
  return (
    <header className="no-print border-b border-[#E0D8CF] bg-white/70 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Crest */}
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-xl bg-[#7D8C7C] text-white flex items-center justify-center shadow-xs font-bold font-serif text-base">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-semibold text-[#2D2A26] text-base tracking-tight leading-none">
                ScholarNexus <span className="text-[#7D8C7C] font-normal hidden sm:inline">| Academic Assistant</span>
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-sans font-medium bg-[#F1EDE6] text-[#5E6B5D] border border-[#D0C7BC]">
                PEEL • APA 7th
              </span>
            </div>
            <p className="text-xs text-[#7A736B] mt-0.5 hidden sm:block font-sans">
              College Professor Assignment Synthesis Engine
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Engine Status */}
          <div
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium border ${
              hasApiKey
                ? "bg-[#7D8C7C]/10 text-[#5E6B5D] border-[#7D8C7C]/30"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
            title={hasApiKey ? "Gemini 3.7 Flash Engine Active" : "Waiting for API credentials"}
          >
            {hasApiKey ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5E6B5D]" />
                <span>Academic Engine Ready</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Configuring Engine...</span>
              </>
            )}
          </div>

          {/* Print / PDF Export */}
          {hasCurrentContent && onPrint && (
            <button
              id="print-paper-btn"
              type="button"
              onClick={onPrint}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium text-[#3D3B39] bg-white hover:bg-[#EAE2D8] transition-colors border border-[#D0C7BC] shadow-xs"
              title="Print formatted paper or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#7A736B]" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
          )}

          {/* History Drawer Trigger */}
          <button
            id="open-history-btn"
            type="button"
            onClick={onOpenHistory}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium text-[#3D3B39] hover:text-[#2D2A26] bg-white hover:bg-[#EAE2D8] transition-colors border border-[#D0C7BC] shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-[#7A736B]" />
            <span>Archive</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-[#5E6B5D] text-white">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
