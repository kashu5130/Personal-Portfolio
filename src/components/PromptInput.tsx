import React, { useState } from "react";
import { Sparkles, SlidersHorizontal, Send, Square, RefreshCw, Layers } from "lucide-react";
import { AcademicLevel, WordCountTarget, SamplePrompt } from "../types";
import { SAMPLE_PROMPTS } from "../data/samplePrompts";

interface PromptInputProps {
  query: string;
  onQueryChange: (val: string) => void;
  academicLevel: AcademicLevel;
  onAcademicLevelChange: (val: AcademicLevel) => void;
  wordCountTarget: WordCountTarget;
  onWordCountTargetChange: (val: WordCountTarget) => void;
  discipline: string;
  onDisciplineChange: (val: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  onCancelStream: () => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  query,
  onQueryChange,
  academicLevel,
  onAcademicLevelChange,
  wordCountTarget,
  onWordCountTargetChange,
  discipline,
  onDisciplineChange,
  isLoading,
  onSubmit,
  onCancelStream,
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);

  const handleSelectSample = (sample: SamplePrompt) => {
    onQueryChange(sample.query);
    onDisciplineChange(sample.discipline);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (!isLoading && query.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <section className="no-print bg-white border border-[#E0D8CF] rounded-2xl shadow-xs p-4 sm:p-6 mb-6 transition-all">
      {/* Sample Prompts Pills */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#948B81] flex items-center gap-1.5 font-sans">
            <Layers className="w-3.5 h-3.5 text-[#7D8C7C]" />
            Curated College Disciplines & Prompts
          </span>
          <span className="text-[11px] text-[#948B81] font-sans">Click to load exemplar prompt</span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SAMPLE_PROMPTS.map((sample) => (
            <button
              id={`sample-prompt-${sample.id}`}
              key={sample.id}
              type="button"
              onClick={() => handleSelectSample(sample)}
              disabled={isLoading}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F1EDE6] hover:bg-[#EAE2D8] text-[#3D3B39] hover:text-[#2D2A26] border border-[#D0C7BC] transition-colors disabled:opacity-50 text-left font-sans cursor-pointer"
            >
              <span className="text-[#5E6B5D] font-bold">{sample.commandWord}:</span>
              <span className="text-[#7A736B] truncate max-w-[140px] sm:max-w-[200px]">
                {sample.discipline}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <label htmlFor="assignment-prompt-input" className="sr-only">
          Academic Query or Assignment Prompt
        </label>
        <textarea
          id="assignment-prompt-input"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={4}
          placeholder="Enter any assignment prompt, exam essay question, or research query (e.g., 'Analyze the socio-economic and political catalysts of the 1917 Russian Revolutions...' or 'Evaluate the efficacy of quantitative easing in addressing a persistent liquidity trap...')"
          className="w-full text-[#2D2A26] placeholder:text-[#948B81] bg-[#F7F3EE]/60 hover:bg-[#F7F3EE] focus:bg-white rounded-2xl border border-[#D0C7BC] focus:border-[#7D8C7C] focus:ring-2 focus:ring-[#7D8C7C]/20 text-sm sm:text-base leading-relaxed p-3.5 sm:p-4 outline-hidden transition-all resize-y disabled:opacity-60 font-serif"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
          {/* Advanced Framework Parameters Toggle */}
          <button
            id="toggle-options-btn"
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="inline-flex items-center gap-1.5 text-xs font-sans font-medium text-[#7A736B] hover:text-[#2D2A26] py-1.5 px-3 rounded-full hover:bg-[#F1EDE6] transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#7D8C7C]" />
            <span>Academic Parameters</span>
            <span className="text-[#948B81] text-[11px]">({academicLevel})</span>
          </button>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <button
                id="cancel-stream-btn"
                type="button"
                onClick={onCancelStream}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans font-medium bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Halt Synthesis</span>
              </button>
            ) : null}

            <button
              id="synthesize-assignment-btn"
              type="button"
              onClick={onSubmit}
              disabled={isLoading || !query.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-sans font-semibold bg-[#5E6B5D] hover:bg-[#4E594D] active:bg-[#3D473C] text-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                  <span>Synthesizing Academic Paper...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Synthesize Assignment Response</span>
                  <span className="text-[11px] text-white/80 hidden sm:inline font-mono">⌘↵</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Academic Parameters Drawer */}
      {showOptions && (
        <div className="mt-4 pt-4 border-t border-[#E0D8CF] grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in fade-in duration-200">
          {/* Academic Level */}
          <div>
            <label className="block text-xs font-sans font-semibold text-[#2D2A26] mb-1.5">
              Academic Level
            </label>
            <select
              id="academic-level-select"
              value={academicLevel}
              onChange={(e) => onAcademicLevelChange(e.target.value as AcademicLevel)}
              disabled={isLoading}
              className="w-full text-xs font-sans bg-[#F7F3EE] border border-[#D0C7BC] rounded-xl p-2 text-[#3D3B39] focus:border-[#7D8C7C] focus:ring-1 focus:ring-[#7D8C7C]/30 outline-hidden"
            >
              <option value="Upper-Division Undergraduate">Upper-Division Undergraduate (Junior/Senior)</option>
              <option value="Honors Senior Capstone">Honors Senior Capstone / Thesis</option>
              <option value="Graduate / Master's Seminar">Graduate / Master's Seminar</option>
              <option value="Introductory Collegiate">Introductory Collegiate (Freshman/Sophomore)</option>
            </select>
          </div>

          {/* Word Count Depth */}
          <div>
            <label className="block text-xs font-sans font-semibold text-[#2D2A26] mb-1.5">
              Target Depth
            </label>
            <select
              id="target-depth-select"
              value={wordCountTarget}
              onChange={(e) => onWordCountTargetChange(e.target.value as WordCountTarget)}
              disabled={isLoading}
              className="w-full text-xs font-sans bg-[#F7F3EE] border border-[#D0C7BC] rounded-xl p-2 text-[#3D3B39] focus:border-[#7D8C7C] focus:ring-1 focus:ring-[#7D8C7C]/30 outline-hidden"
            >
              <option value="Standard (900 - 1,300 words)">Standard Paper (900 - 1,300 words)</option>
              <option value="In-Depth (1,400 - 2,000 words)">Comprehensive / In-Depth (1,400 - 2,000 words)</option>
              <option value="Concise (500 - 800 words)">Concise / Short Essay (500 - 800 words)</option>
            </select>
          </div>

          {/* Discipline Override */}
          <div>
            <label className="block text-xs font-sans font-semibold text-[#2D2A26] mb-1.5">
              Discipline / Intellectual Domain
            </label>
            <input
              id="discipline-input"
              type="text"
              value={discipline}
              onChange={(e) => onDisciplineChange(e.target.value)}
              disabled={isLoading}
              placeholder="Auto-detected (e.g. Macroeconomics)"
              className="w-full text-xs font-sans bg-[#F7F3EE] border border-[#D0C7BC] rounded-xl p-2 text-[#3D3B39] focus:border-[#7D8C7C] focus:ring-1 focus:ring-[#7D8C7C]/30 outline-hidden"
            />
          </div>
        </div>
      )}
    </section>
  );
};
