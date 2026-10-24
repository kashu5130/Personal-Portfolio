import React, { useState } from "react";
import { 
  Check, 
  Copy, 
  BookOpen, 
  Compass, 
  FileText, 
  Award, 
  Layers, 
  ShieldCheck, 
  Quote, 
  ExternalLink 
} from "lucide-react";
import { ParsedAssignment, copyToClipboard } from "../utils/academicParser";

interface PeelInspectorProps {
  parsed: ParsedAssignment;
}

export const PeelInspector: React.FC<PeelInspectorProps> = ({ parsed }) => {
  const [copiedRefIdx, setCopiedRefIdx] = useState<number | null>(null);

  const handleCopyRef = async (refText: string, idx: number) => {
    const ok = await copyToClipboard(refText);
    if (ok) {
      setCopiedRefIdx(idx);
      setTimeout(() => setCopiedRefIdx(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#2D2A26] text-[#F7F3EE] rounded-2xl p-6 border border-[#3D3B39] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-mono tracking-widest text-[#7D8C7C]">
              Pedagogical Framework Breakdown
            </span>
            <h3 className="text-xl font-serif font-bold text-white mt-1">
              College Assignment Structural Analysis
            </h3>
            <p className="text-xs text-[#D0C7BC] mt-1 max-w-2xl font-sans leading-relaxed">
              Inspect how the response satisfies each of the 6 rigorous criteria established for collegiate writing, including command words, PEEL paragraphs, and APA 7th edition referencing.
            </p>
          </div>

          <div className="flex items-center gap-3 font-sans">
            <div className="bg-[#3D3B39]/70 px-4 py-2.5 rounded-xl border border-[#4A4743] text-center">
              <span className="block text-[11px] text-[#948B81] uppercase font-mono">Word Count</span>
              <span className="text-base font-semibold text-[#F7F3EE]">{parsed.wordCount}</span>
            </div>
            <div className="bg-[#3D3B39]/70 px-4 py-2.5 rounded-xl border border-[#4A4743] text-center">
              <span className="block text-[11px] text-[#948B81] uppercase font-mono">Discipline</span>
              <span className="text-sm font-medium text-[#E0D8CF] truncate max-w-[140px]" title={parsed.inferredDiscipline}>
                {parsed.inferredDiscipline}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage 1: Assignment Analysis */}
      <div className="bg-white rounded-2xl border border-[#E0D8CF] p-6 shadow-xs">
        <div className="flex items-center space-x-3 text-[#2D2A26] mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#7D8C7C] text-white flex items-center justify-center font-bold text-xs">
            1
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#2D2A26] font-sans">Assignment Analysis</h4>
            <p className="text-xs text-[#7A736B] font-sans">Command word identification, intellectual context & scope</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 font-sans">
          <div className="bg-[#F7F3EE] rounded-xl p-3.5 border border-[#E0D8CF]">
            <span className="text-[11px] uppercase font-mono text-[#948B81] block mb-1.5 font-bold">
              Core Academic Command Words
            </span>
            <div className="flex flex-wrap gap-1.5">
              {parsed.commandWords.map((cmd, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1EDE6] text-[#5E6B5D] border border-[#D0C7BC]"
                >
                  {cmd}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-[#F7F3EE] rounded-xl p-3.5 border border-[#E0D8CF]">
            <span className="text-[11px] uppercase font-mono text-[#948B81] block mb-1.5 font-bold">
              Academic Context & Field
            </span>
            <span className="text-xs font-medium text-[#3D3B39]">
              {parsed.inferredDiscipline || "Interdisciplinary Collegiate Research"}
            </span>
          </div>
        </div>

        {parsed.sections.analysis && (
          <div className="text-xs text-[#3D3B39] bg-[#F7F3EE]/70 p-4 rounded-xl border border-[#E0D8CF] whitespace-pre-line leading-relaxed font-sans">
            {parsed.sections.analysis.replace(/#+ 1[^\n]*\n?/, "")}
          </div>
        )}
      </div>

      {/* Stage 2: Core Answer & Thesis Statement */}
      <div className="bg-white rounded-2xl border border-[#E0D8CF] p-6 shadow-xs">
        <div className="flex items-center space-x-3 text-[#2D2A26] mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#5E6B5D] text-white flex items-center justify-center font-bold text-xs">
            2
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#2D2A26] font-sans">Core Answer / Thesis Statement</h4>
            <p className="text-xs text-[#7A736B] font-sans">Immediate, sophisticated answer established in paragraph one</p>
          </div>
        </div>

        {parsed.sections.thesis ? (
          <div className="bg-[#F7F3EE] p-5 rounded-2xl border-l-4 border-[#7D8C7C] text-sm sm:text-base text-[#2D2A26] leading-relaxed font-serif italic">
            <h4 className="text-xs uppercase font-sans font-black text-[#7D8C7C] mb-2 not-italic">Asserted Central Thesis</h4>
            {parsed.sections.thesis.replace(/#+ 2[^\n]*\n?/, "")}
          </div>
        ) : (
          <p className="text-xs text-[#7A736B] italic font-serif">Synthesizing thesis statement...</p>
        )}
      </div>

      {/* Stage 3: Structured Body Paragraphs (PEEL Framework) */}
      <div className="bg-white rounded-2xl border border-[#E0D8CF] p-6 shadow-xs">
        <div className="flex items-center space-x-3 text-[#2D2A26] mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#7D8C7C] text-white flex items-center justify-center font-bold text-xs">
            3
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#2D2A26] font-sans">Structured Body Paragraphs (PEEL Framework)</h4>
            <p className="text-xs text-[#7A736B] font-sans">Logical thematic sections with explicit Point, Evidence, Example, and Link</p>
          </div>
        </div>

        {/* PEEL Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4 font-sans">
          <div className="p-3 rounded-xl bg-[#F1EDE6] border border-[#D0C7BC] text-left">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7D8C7C] text-white mb-1.5">
              P • Point
            </span>
            <p className="text-[11px] text-[#3D473C] font-medium leading-tight">
              Primary argument or conceptual claim
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F1EDE6] border border-[#D0C7BC] text-left">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5E6B5D] text-white mb-1.5">
              E • Evidence
            </span>
            <p className="text-[11px] text-[#2D332C] font-medium leading-tight">
              Scholarly theories, empirical data & mechanics
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F1EDE6] border border-[#D0C7BC] text-left">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#8C7D6B] text-white mb-1.5">
              E • Example
            </span>
            <p className="text-[11px] text-[#4E4437] font-medium leading-tight">
              Concrete case study or historical event
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#F1EDE6] border border-[#D0C7BC] text-left">
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#4A4743] text-white mb-1.5">
              L • Link
            </span>
            <p className="text-[11px] text-[#2D2A26] font-medium leading-tight">
              Explicit bridge back to central thesis
            </p>
          </div>
        </div>

        {parsed.sections.body ? (
          <div className="text-xs sm:text-sm text-[#3D3B39] bg-[#F7F3EE]/70 p-5 rounded-xl border border-[#E0D8CF] whitespace-pre-line leading-relaxed font-serif">
            {parsed.sections.body.replace(/#+ 3[^\n]*\n?/, "")}
          </div>
        ) : (
          <p className="text-xs text-[#7A736B] italic font-serif">Synthesizing thematic body sections...</p>
        )}
      </div>

      {/* Stage 4: Academic Tone & Restraint */}
      <div className="bg-white rounded-2xl border border-[#E0D8CF] p-6 shadow-xs">
        <div className="flex items-center space-x-3 text-[#2D2A26] mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#5E6B5D] text-white flex items-center justify-center font-bold text-xs">
            4
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#2D2A26] font-sans">Academic Tone & Scholarly Restraint</h4>
            <p className="text-xs text-[#7A736B] font-sans">Objective, formal third-person perspective and disciplinary lexicon</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-sans">
          <div className="bg-[#F7F3EE] rounded-xl p-3.5 border border-[#E0D8CF]">
            <span className="font-semibold text-[#2D2A26] block mb-1">3rd Person Scholarly Stance</span>
            <p className="text-[#7A736B]">Zero first-person rhetoric ("I think", "my opinion"); pure institutional neutrality.</p>
          </div>
          <div className="bg-[#F7F3EE] rounded-xl p-3.5 border border-[#E0D8CF]">
            <span className="font-semibold text-[#2D2A26] block mb-1">Lexical Precision</span>
            <p className="text-[#7A736B]">Advanced domain-specific terminology suitable for upper-level college coursework.</p>
          </div>
          <div className="bg-[#F7F3EE] rounded-xl p-3.5 border border-[#E0D8CF]">
            <span className="font-semibold text-[#2D2A26] block mb-1">Elimination of Fluff</span>
            <p className="text-[#7A736B]">No conversational pleasantries, contractions, or rhetorical trivialities.</p>
          </div>
        </div>
      </div>

      {/* Stage 5: Conclusion */}
      <div className="bg-white rounded-2xl border border-[#E0D8CF] p-6 shadow-xs">
        <div className="flex items-center space-x-3 text-[#2D2A26] mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#7D8C7C] text-white flex items-center justify-center font-bold text-xs">
            5
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#2D2A26] font-sans">Conclusion & Broader Implications</h4>
            <p className="text-xs text-[#7A736B] font-sans">Comprehensive synthesis of insights without introducing extraneous claims</p>
          </div>
        </div>

        {parsed.sections.conclusion ? (
          <div className="bg-[#F7F3EE]/80 border border-[#E0D8CF] rounded-xl p-5 text-xs sm:text-sm text-[#3D3B39] leading-relaxed font-serif">
            {parsed.sections.conclusion.replace(/#+ 5[^\n]*\n?/, "")}
          </div>
        ) : (
          <p className="text-xs text-[#7A736B] italic font-serif">Synthesizing conclusion...</p>
        )}
      </div>

      {/* Stage 6: APA 7th Edition References */}
      <div className="bg-white rounded-2xl border border-[#E0D8CF] p-6 shadow-xs">
        <div className="flex items-center space-x-3 text-[#2D2A26] mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#5E6B5D] text-white flex items-center justify-center font-bold text-xs">
            6
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#2D2A26] font-sans">References (APA 7th Edition)</h4>
            <p className="text-xs text-[#7A736B] font-sans">Peer-reviewed journals, foundational monographs & scholarly literature</p>
          </div>
        </div>

        {parsed.sections.references && parsed.sections.references.length > 0 ? (
          <div className="space-y-3">
            {parsed.sections.references.map((ref, idx) => (
              <div
                key={idx}
                className="bg-[#F7F3EE] hover:bg-[#F1EDE6] transition-colors p-3.5 rounded-xl border border-[#E0D8CF] flex items-start justify-between gap-3 group"
              >
                <div className="font-serif text-xs text-[#3D3B39] leading-relaxed apa-reference-entry flex-1">
                  {ref}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyRef(ref, idx)}
                  className="shrink-0 p-1.5 rounded-full text-[#7A736B] hover:text-[#2D2A26] bg-white border border-[#D0C7BC] transition-colors shadow-2xs cursor-pointer"
                  title="Copy APA Citation"
                >
                  {copiedRefIdx === idx ? (
                    <Check className="w-3.5 h-3.5 text-[#5E6B5D]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#7A736B] italic font-serif">Extracting APA references...</p>
        )}
      </div>
    </div>
  );
};
