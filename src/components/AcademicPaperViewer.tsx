import React, { useState } from "react";
import Markdown from "react-markdown";
import { 
  Copy, 
  Check, 
  Printer, 
  Type, 
  BookOpen, 
  FileCheck, 
  Code, 
  Sparkles,
  ExternalLink,
  Download
} from "lucide-react";
import { ParsedAssignment, copyToClipboard } from "../utils/academicParser";
import { PeelInspector } from "./PeelInspector";
import { RubricBadge } from "./RubricBadge";

interface AcademicPaperViewerProps {
  content: string;
  parsed: ParsedAssignment;
  isStreaming: boolean;
  query: string;
  academicLevel: string;
  onPrint: () => void;
}

export const AcademicPaperViewer: React.FC<AcademicPaperViewerProps> = ({
  content,
  parsed,
  isStreaming,
  query,
  academicLevel,
  onPrint,
}) => {
  const [activeTab, setActiveTab] = useState<"paper" | "peel" | "markdown">("paper");
  const [useSerif, setUseSerif] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<"normal" | "large">("normal");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const handleCopy = async (type: "full" | "references" | "markdown") => {
    let textToCopy = content;
    if (type === "references") {
      textToCopy = parsed.sections.references?.join("\n\n") || "No references extracted.";
    }
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2200);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `academic-assignment-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-[#E0D8CF] rounded-2xl shadow-xs overflow-hidden transition-all">
      {/* Top Controls & Navigation Bar */}
      <div className="no-print border-b border-[#E0D8CF] bg-[#F1EDE6]/80 p-3 sm:px-6 flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Tabs */}
        <div className="flex items-center space-x-1 bg-[#E0D8CF]/60 p-1 rounded-xl font-sans">
          <button
            id="tab-paper-view"
            type="button"
            onClick={() => setActiveTab("paper")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "paper"
                ? "bg-white text-[#2D2A26] shadow-xs font-semibold"
                : "text-[#7A736B] hover:text-[#2D2A26]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Collegiate Manuscript</span>
          </button>

          <button
            id="tab-peel-inspector"
            type="button"
            onClick={() => setActiveTab("peel")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "peel"
                ? "bg-white text-[#2D2A26] shadow-xs font-semibold"
                : "text-[#7A736B] hover:text-[#2D2A26]"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-[#5E6B5D]" />
            <span>PEEL & Framework Breakdown</span>
          </button>

          <button
            id="tab-raw-markdown"
            type="button"
            onClick={() => setActiveTab("markdown")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "markdown"
                ? "bg-white text-[#2D2A26] shadow-xs font-semibold"
                : "text-[#7A736B] hover:text-[#2D2A26]"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Markdown</span>
          </button>
        </div>

        {/* Reader Customization & Export Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Font Serif / Sans switch */}
          {activeTab === "paper" && (
            <div className="flex items-center bg-[#F7F3EE] p-0.5 rounded-full border border-[#D0C7BC]">
              <button
                type="button"
                onClick={() => setUseSerif(true)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  useSerif
                    ? "bg-white text-[#2D2A26] font-serif font-bold shadow-xs"
                    : "text-[#7A736B] hover:text-[#2D2A26]"
                }`}
                title="Serif Academic Font (Lora)"
              >
                Serif
              </button>
              <button
                type="button"
                onClick={() => setUseSerif(false)}
                className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                  !useSerif
                    ? "bg-white text-[#2D2A26] font-sans font-bold shadow-xs"
                    : "text-[#7A736B] hover:text-[#2D2A26]"
                }`}
                title="Sans-Serif Font"
              >
                Sans
              </button>
            </div>
          )}

          {/* Size switch */}
          {activeTab === "paper" && (
            <button
              type="button"
              onClick={() => setFontSize(fontSize === "normal" ? "large" : "normal")}
              className="p-1.5 rounded-full text-[#7A736B] hover:text-[#2D2A26] hover:bg-[#EAE2D8] border border-[#D0C7BC] text-xs font-medium"
              title="Toggle font size"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Copy Full Paper */}
          <button
            id="copy-paper-btn"
            type="button"
            onClick={() => handleCopy("full")}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans font-medium bg-white hover:bg-[#EAE2D8] text-[#3D3B39] border border-[#D0C7BC] shadow-xs transition-colors"
            title="Copy entire formatted assignment"
          >
            {copiedType === "full" ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#5E6B5D]" />
                <span className="text-[#5E6B5D] font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#7A736B]" />
                <span>Copy Paper</span>
              </>
            )}
          </button>

          {/* Copy References */}
          {parsed.sections.references && parsed.sections.references.length > 0 && (
            <button
              id="copy-references-btn"
              type="button"
              onClick={() => handleCopy("references")}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-sans font-medium bg-white hover:bg-[#EAE2D8] text-[#3D3B39] border border-[#D0C7BC] shadow-xs transition-colors"
              title="Copy APA 7th Edition References only"
            >
              {copiedType === "references" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#5E6B5D]" />
                  <span className="text-[#5E6B5D] font-medium">Citations Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#7A736B]" />
                  <span>APA Citations</span>
                </>
              )}
            </button>
          )}

          {/* Download MD */}
          <button
            id="download-markdown-btn"
            type="button"
            onClick={handleDownloadMarkdown}
            className="p-1.5 rounded-full text-[#7A736B] hover:text-[#2D2A26] hover:bg-[#EAE2D8] border border-[#D0C7BC] transition-colors"
            title="Download as Markdown file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Print / Save PDF */}
          <button
            id="viewer-print-btn"
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium bg-[#5E6B5D] hover:bg-[#4E594D] text-white transition-colors shadow-xs"
            title="Print formatted paper or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#E0D8CF]" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Word Count, Stats & Rubric Metrics Bar */}
      <div className="no-print border-b border-[#E0D8CF] bg-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between text-xs text-[#7A736B] gap-2 font-sans">
        <div className="flex items-center flex-wrap gap-3">
          <span className="inline-flex items-center gap-1 font-medium text-[#3D3B39]">
            <span className="font-semibold text-[#2D2A26]">{parsed.wordCount}</span> words
          </span>
          <span className="text-[#D0C7BC]">•</span>
          <span className="inline-flex items-center gap-1">
            Approx. <span className="font-medium text-[#3D3B39]">{parsed.readingTimeMinutes} min</span> reading time
          </span>
          <span className="text-[#D0C7BC]">•</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F1EDE6] text-[#5E6B5D] font-medium text-[11px] border border-[#D0C7BC]">
            {academicLevel}
          </span>
        </div>

        {/* Active Command Words */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] uppercase font-mono text-[#948B81]">Command:</span>
          {parsed.commandWords.map((cmd, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1EDE6] text-[#5E6B5D] border border-[#D0C7BC]"
            >
              {cmd}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-8 lg:p-12">
        {/* Rubric Badge (Shows current compliance with 6 prompt rules) */}
        <div className="no-print">
          <RubricBadge
            hasAnalysis={Boolean(parsed.sections.analysis)}
            hasThesis={Boolean(parsed.sections.thesis)}
            hasPeelBody={Boolean(parsed.sections.body)}
            hasAcademicTone={Boolean(parsed.wordCount > 150)}
            hasConclusion={Boolean(parsed.sections.conclusion)}
            hasReferences={Boolean(parsed.sections.references && parsed.sections.references.length > 0)}
          />
        </div>

        {activeTab === "paper" && (
          <article
            className={`academic-paper-container max-w-3xl mx-auto ${
              useSerif ? "font-serif-academic" : "font-sans-modern"
            } ${fontSize === "large" ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}
          >
            {/* Collegiate Header / Title Cover Block */}
            <div className="border-b border-[#E0D8CF] pb-5 mb-8 text-center sm:text-left">
              <div className="inline-flex items-center px-3 py-1 bg-[#F1EDE6] rounded-full text-xs font-sans font-bold text-[#5E6B5D] uppercase tracking-wide mb-3">
                Assignment Analysis
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif italic text-[#2D2A26] tracking-tight mb-2 leading-tight">
                {query}
              </h2>
              <div className="text-xs text-[#7A736B] font-sans mt-3 flex flex-wrap items-center gap-4 border-t border-[#F1EDE6] pt-3">
                <span><strong>Discipline:</strong> {parsed.inferredDiscipline}</span>
                <span><strong>Standard:</strong> PEEL Framework & APA 7th</span>
                <span><strong>Level:</strong> {academicLevel}</span>
              </div>
            </div>

            {/* Rendered Academic Prose */}
            <div className="academic-prose">
              <Markdown
                components={{
                  // Highlight section headers with distinguished academic styling
                  h1: ({ children }) => (
                    <h1 className="text-lg sm:text-xl font-bold font-serif text-[#2D2A26] mt-8 mb-3 pb-2 border-b border-[#E0D8CF] tracking-tight">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base sm:text-lg font-bold font-serif text-[#2D2A26] mt-6 mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm sm:text-base font-semibold font-serif text-[#4A4743] mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  // Render paragraphs with academic line height
                  p: ({ children }) => (
                    <p className="mb-4 leading-relaxed text-[#3D3B39]">
                      {children}
                    </p>
                  ),
                  // Render strong tags with Natural Tones accents
                  strong: ({ children }) => {
                    const text = String(children);
                    if (text.startsWith("Point") || text === "Point") {
                      return <strong className="text-[#3D473C] font-bold bg-[#7D8C7C]/20 px-1.5 py-0.5 rounded">{children}</strong>;
                    }
                    if (text.startsWith("Evidence") || text === "Evidence / Explanation") {
                      return <strong className="text-[#4E4437] font-bold bg-[#D0C7BC]/60 px-1.5 py-0.5 rounded">{children}</strong>;
                    }
                    if (text.startsWith("Example") || text === "Example") {
                      return <strong className="text-[#5E6B5D] font-bold bg-[#F1EDE6] border border-[#D0C7BC] px-1.5 py-0.5 rounded">{children}</strong>;
                    }
                    if (text.startsWith("Link") || text === "Link") {
                      return <strong className="text-[#2D2A26] font-bold bg-[#7D8C7C]/25 px-1.5 py-0.5 rounded">{children}</strong>;
                    }
                    return <strong className="font-semibold text-[#2D2A26]">{children}</strong>;
                  },
                  // Render lists
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 mb-4 space-y-1 text-[#3D3B39]">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 mb-4 space-y-1 text-[#3D3B39]">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <div className="bg-[#F7F3EE] p-5 rounded-2xl border-l-4 border-[#7D8C7C] my-5">
                      <div className="text-xs uppercase font-sans font-black text-[#7D8C7C] mb-1.5">Thesis Statement / Core Evidence</div>
                      <blockquote className="italic text-[#2D2A26] leading-relaxed">
                        {children}
                      </blockquote>
                    </div>
                  ),
                }}
              >
                {content}
              </Markdown>

              {/* Streaming Cursor */}
              {isStreaming && (
                <span className="inline-block w-2.5 h-4 bg-[#7D8C7C] animate-pulse ml-1 align-middle" />
              )}
            </div>

            {/* University Footer Signature */}
            <div className="mt-12 pt-6 border-t border-[#E0D8CF] text-xs text-[#948B81] font-sans flex items-center justify-between">
              <span>ScholarNexus • Collegiate Writing Assistant</span>
              <span>APA 7th Edition Reference Compliant</span>
            </div>
          </article>
        )}

        {activeTab === "peel" && (
          <div className="max-w-4xl mx-auto">
            <PeelInspector parsed={parsed} />
          </div>
        )}

        {activeTab === "markdown" && (
          <div className="max-w-4xl mx-auto font-sans">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase font-mono text-[#7A736B]">
                Raw Markdown Source (Standard GFM)
              </span>
              <button
                type="button"
                onClick={() => handleCopy("full")}
                className="text-xs text-[#5E6B5D] hover:text-[#2D2A26] font-medium inline-flex items-center gap-1"
              >
                <Copy className="w-3 h-3" />
                Copy Raw
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-[#2D2A26] text-[#F7F3EE] text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[700px] border border-[#3D3B39]">
              {content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
