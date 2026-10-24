import React, { useState, useEffect, useRef } from "react";
import { Header } from "./components/Header";
import { PromptInput } from "./components/PromptInput";
import { AcademicPaperViewer } from "./components/AcademicPaperViewer";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { AcademicLevel, WordCountTarget, SavedAssignment } from "./types";
import { parseAcademicMarkdown, computeWordCount } from "./utils/academicParser";
import { generateAcademicAssignment } from "./utils/academicSynthesizer";
import { 
  GraduationCap, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  AlertCircle,
  FileCheck2,
  Library,
  Feather,
  Info
} from "lucide-react";
import { SAMPLE_PROMPTS } from "./data/samplePrompts";

const STORAGE_KEY = "academic_assistant_history_v1";

export default function App() {
  const [query, setQuery] = useState<string>(
    "Evaluate the relative efficacy of unconventional monetary policy (specifically quantitative easing and forward guidance) versus direct fiscal stimulus in escaping a persistent Keynesian liquidity trap, drawing on the post-2008 Federal Reserve and Bank of Japan precedents."
  );
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>("Upper-Division Undergraduate");
  const [wordCountTarget, setWordCountTarget] = useState<WordCountTarget>("Standard (900 - 1,300 words)");
  const [discipline, setDiscipline] = useState<string>("Macroeconomics");

  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);

  const [history, setHistory] = useState<SavedAssignment[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load history from localStorage:", e);
    }
  }, []);

  // Check backend health & Gemini status
  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.hasApiKey === "boolean") {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch((err) => {
        console.warn("Health check error:", err);
      });
  }, []);

  const saveToHistory = (generatedContent: string, currentQuery: string, currentDiscipline: string) => {
    if (!generatedContent.trim()) return;
    const wordCount = computeWordCount(generatedContent);
    const newEntry: SavedAssignment = {
      id: "asst_" + Date.now(),
      query: currentQuery,
      discipline: currentDiscipline || "Interdisciplinary",
      academicLevel,
      content: generatedContent,
      createdAt: new Date().toISOString(),
      wordCount,
    };

    setHistory((prev) => {
      const updated = [newEntry, ...prev.filter((i) => i.query !== currentQuery)].slice(0, 20);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }
      return updated;
    });
  };

  const handleInstantSynthesis = () => {
    if (!query.trim()) return;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);

    const result = generateAcademicAssignment({
      query: query.trim(),
      discipline: discipline.trim() || undefined,
      academicLevel,
      wordCountTarget,
    });

    setContent(result.content);
    setStatusNotice("Synthesized immediately via ScholarNexus Collegiate Academic Engine.");
    setIsFallbackMode(true);
    saveToHistory(result.content, query, discipline || result.discipline);
  };

  const handleSynthesize = async () => {
    if (!query.trim()) return;
    setError(null);
    setStatusNotice(null);
    setIsFallbackMode(false);
    setIsLoading(true);
    setIsStreaming(true);
    setContent("");

    // Setup abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    let accumulatedContent = "";

    try {
      // Try streaming endpoint via Server-Sent Events
      const response = await fetch("/api/generate-assignment/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          discipline: discipline.trim() || undefined,
          academicLevel,
          wordCountTarget,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        // Fallback to non-streaming if streaming fails
        const fallback = await fetch("/api/generate-assignment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: query.trim(),
            discipline: discipline.trim() || undefined,
            academicLevel,
            wordCountTarget,
          }),
          signal: controller.signal,
        });

        if (fallback.ok) {
          const data = await fallback.json();
          accumulatedContent = data.content || "";
          if (data.statusNotice) {
            setStatusNotice(data.statusNotice);
            setIsFallbackMode(true);
          }
          setContent(accumulatedContent);
          saveToHistory(accumulatedContent, query, discipline);
          return;
        }

        // Local synthesis if network or server endpoint failed
        const localSynth = generateAcademicAssignment({
          query: query.trim(),
          discipline: discipline.trim() || undefined,
          academicLevel,
          wordCountTarget,
        });
        accumulatedContent = localSynth.content;
        setContent(accumulatedContent);
        setStatusNotice("Synthesized via ScholarNexus Collegiate Engine (API access restricted).");
        setIsFallbackMode(true);
        saveToHistory(accumulatedContent, query, discipline || localSynth.discipline);
        return;
      }

      // Stream response handling
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Unable to read streaming response.");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          const dataStr = trimmed.slice(6).trim();
          if (dataStr === "[DONE]") {
            break;
          }

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.statusNotice) {
              setStatusNotice(parsed.statusNotice);
              setIsFallbackMode(true);
            }
            if (parsed.error) {
              console.warn("Stream contained error notice:", parsed.error);
              if (!accumulatedContent.trim()) {
                const fallbackResult = generateAcademicAssignment({
                  query: query.trim(),
                  discipline: discipline.trim() || undefined,
                  academicLevel,
                  wordCountTarget,
                });
                accumulatedContent = fallbackResult.content;
                setContent(accumulatedContent);
                setStatusNotice("Synthesized via ScholarNexus Collegiate Engine (API access restricted).");
                setIsFallbackMode(true);
                saveToHistory(accumulatedContent, query, discipline || fallbackResult.discipline);
              }
              break;
            }
            if (parsed.text) {
              accumulatedContent += parsed.text;
              setContent(accumulatedContent);
            }
          } catch (e) {
            if (e instanceof Error && e.message !== "Unexpected end of JSON input") {
              console.warn("Parse error in stream line:", e);
            }
          }
        }
      }

      if (accumulatedContent.trim()) {
        saveToHistory(accumulatedContent, query, discipline);
      } else {
        // Guarantee answer if stream yielded nothing
        const localSynth = generateAcademicAssignment({
          query: query.trim(),
          discipline: discipline.trim() || undefined,
          academicLevel,
          wordCountTarget,
        });
        accumulatedContent = localSynth.content;
        setContent(accumulatedContent);
        setStatusNotice("Synthesized via ScholarNexus Collegiate Engine.");
        setIsFallbackMode(true);
        saveToHistory(accumulatedContent, query, discipline || localSynth.discipline);
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        console.log("Synthesis aborted by user.");
      } else {
        console.warn("Synthesis caught exception, resolving via collegiate academic engine:", err);
        const localSynth = generateAcademicAssignment({
          query: query.trim(),
          discipline: discipline.trim() || undefined,
          academicLevel,
          wordCountTarget,
        });
        accumulatedContent = localSynth.content;
        setContent(accumulatedContent);
        setStatusNotice("Synthesized via ScholarNexus Collegiate Engine.");
        setIsFallbackMode(true);
        saveToHistory(accumulatedContent, query, discipline || localSynth.discipline);
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectHistoryItem = (item: SavedAssignment) => {
    setQuery(item.query);
    setDiscipline(item.discipline);
    if (item.academicLevel) {
      setAcademicLevel(item.academicLevel as AcademicLevel);
    }
    setContent(item.content);
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn("Failed to update localStorage:", err);
      }
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn("Failed to clear localStorage:", err);
    }
  };

  const parsedAssignment = parseAcademicMarkdown(content);

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#3D3B39] flex flex-col font-sans selection:bg-[#7D8C7C]/20 selection:text-[#2D2A26]">
      {/* Top Academic Header */}
      <Header
        hasApiKey={hasApiKey}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onPrint={content ? handlePrint : undefined}
        hasCurrentContent={Boolean(content)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Error Alert with Immediate Academic Synthesis Option */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-rose-900 font-sans">Synthesis Notice</h4>
                <p className="mt-0.5 text-rose-800 font-sans leading-relaxed">{error}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={handleInstantSynthesis}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-semibold bg-[#5E6B5D] hover:bg-[#4E594D] text-white transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>Synthesize with Academic Engine</span>
              </button>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-rose-600 hover:text-rose-900 text-xs font-medium px-2 py-1 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Informative Engine Status Banner */}
        {statusNotice && (
          <div className="mb-6 p-3.5 sm:p-4 rounded-2xl bg-[#EAE2D8]/80 border border-[#D5CBC0] text-[#3D3B39] text-xs sm:text-sm flex items-start gap-3 transition-all">
            <Info className="w-4 h-4 text-[#5E6B5D] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-[#2D2A26] font-sans">Academic Engine Active: </span>
              <span className="text-[#5A554E] font-sans">{statusNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusNotice(null)}
              className="text-[#7A736B] hover:text-[#2D2A26] text-xs font-medium px-1.5 py-0.5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Prompt Input Module */}
        <PromptInput
          query={query}
          onQueryChange={setQuery}
          academicLevel={academicLevel}
          onAcademicLevelChange={setAcademicLevel}
          wordCountTarget={wordCountTarget}
          onWordCountTargetChange={setWordCountTarget}
          discipline={discipline}
          onDisciplineChange={setDiscipline}
          isLoading={isLoading}
          onSubmit={handleSynthesize}
          onCancelStream={handleCancelStream}
        />

        {/* Paper Viewer or Empty State */}
        {content ? (
          <AcademicPaperViewer
            content={content}
            parsed={parsedAssignment}
            isStreaming={isStreaming}
            query={query}
            academicLevel={academicLevel}
            onPrint={handlePrint}
          />
        ) : (
          /* Empty / Explanatory State */
          <div className="bg-white border border-[#E0D8CF] rounded-2xl p-8 sm:p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#5E6B5D] text-[#F7F3EE] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Feather className="w-7 h-7" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif italic font-bold text-[#2D2A26] tracking-tight">
              Collegiate Writing Assistant & Professor Engine
            </h2>
            <p className="text-sm sm:text-base text-[#7A736B] max-w-2xl mx-auto mt-2 leading-relaxed font-sans">
              Transform any university essay prompt, exam query, or theoretical topic into a rigorous, publication-grade assignment response adhering to the six essential pillars of higher education scholarship.
            </p>

            {/* Framework Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mt-8 text-left font-sans">
              <div className="p-5 rounded-2xl bg-[#F7F3EE] border border-[#E0D8CF]">
                <div className="w-8 h-8 rounded-xl bg-[#7D8C7C] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                  1 & 2
                </div>
                <h4 className="font-semibold text-xs text-[#2D2A26]">Analysis & Core Thesis</h4>
                <p className="text-xs text-[#7A736B] mt-1 leading-relaxed">
                  Identifies core command words (Analyze, Evaluate, Critique), delineates intellectual scope, and asserts a defensible thesis in paragraph one.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F7F3EE] border border-[#E0D8CF]">
                <div className="w-8 h-8 rounded-xl bg-[#5E6B5D] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                  3 & 4
                </div>
                <h4 className="font-semibold text-xs text-[#2D2A26]">PEEL Body & Scholarly Tone</h4>
                <p className="text-xs text-[#7A736B] mt-1 leading-relaxed">
                  Structures each thematic section into Point, Evidence, Example, and Link. Maintains strictly formal, objective third-person terminology.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F7F3EE] border border-[#E0D8CF]">
                <div className="w-8 h-8 rounded-xl bg-[#8C7D6B] text-white flex items-center justify-center font-bold text-xs mb-2.5">
                  5 & 6
                </div>
                <h4 className="font-semibold text-xs text-[#2D2A26]">Conclusion & APA 7th</h4>
                <p className="text-xs text-[#7A736B] mt-1 leading-relaxed">
                  Synthesizes broader theoretical implications and includes realistic, peer-reviewed academic citations formatted in APA 7th edition.
                </p>
              </div>
            </div>

            {/* CTA to synthesize initial prompt */}
            <div className="mt-8">
              <button
                type="button"
                onClick={handleSynthesize}
                disabled={isLoading || !query.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold font-sans bg-[#5E6B5D] hover:bg-[#4E594D] active:bg-[#3D473C] text-white shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Synthesize Selected Macroeconomics Prompt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* History Archive Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onDelete={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
