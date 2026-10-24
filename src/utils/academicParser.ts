export interface ParsedAssignment {
  rawText: string;
  wordCount: number;
  readingTimeMinutes: number;
  commandWords: string[];
  inferredDiscipline: string;
  sections: {
    analysis?: string;
    thesis?: string;
    body?: string;
    toneNotes?: string;
    conclusion?: string;
    references?: string[];
  };
  hasAllStages: boolean;
}

export function computeWordCount(text: string): number {
  if (!text) return 0;
  const clean = text.replace(/#+ /g, " ").replace(/[*_`]/g, "");
  const words = clean.trim().match(/\b\w+\b/g);
  return words ? words.length : 0;
}

export function computeReadingTime(wordCount: number): number {
  // Academic texts average 200-220 words per minute
  return Math.max(1, Math.ceil(wordCount / 210));
}

const COMMON_COMMAND_WORDS = [
  "Analyze", "Evaluate", "Critique", "Compare", "Contrast", 
  "Synthesize", "Examine", "Delineate", "Assess", "Justify", 
  "Investigate", "Elucidate", "Explicate"
];

export function extractCommandWords(query: string, text: string): string[] {
  const combined = `${query} ${text}`;
  const found: string[] = [];
  
  for (const cmd of COMMON_COMMAND_WORDS) {
    const regex = new RegExp(`\\b${cmd}\\b`, "i");
    if (regex.test(combined)) {
      found.push(cmd);
    }
  }
  
  return found.length > 0 ? Array.from(new Set(found)) : ["Analyze", "Evaluate"];
}

export function parseAcademicMarkdown(text: string): ParsedAssignment {
  const wordCount = computeWordCount(text);
  const readingTimeMinutes = computeReadingTime(wordCount);

  const sections: ParsedAssignment["sections"] = {};

  // Split by markdown headers
  const lines = text.split("\n");
  let currentSectionKey: keyof ParsedAssignment["sections"] | null = null;
  const sectionBuffers: Record<string, string[]> = {};

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("# 1") || lower.includes("assignment analysis")) {
      currentSectionKey = "analysis";
    } else if (lower.includes("# 2") || lower.includes("core answer") || lower.includes("thesis statement")) {
      currentSectionKey = "thesis";
    } else if (lower.includes("# 3") || lower.includes("structured body") || lower.includes("body paragraphs")) {
      currentSectionKey = "body";
    } else if (lower.includes("# 4") || lower.includes("academic tone") || lower.includes("tone & restraint")) {
      currentSectionKey = "toneNotes";
    } else if (lower.includes("# 5") || lower.includes("conclusion")) {
      currentSectionKey = "conclusion";
    } else if (lower.includes("# 6") || lower.includes("references") || lower.includes("works cited")) {
      currentSectionKey = "references";
    }

    if (currentSectionKey) {
      if (!sectionBuffers[currentSectionKey]) {
        sectionBuffers[currentSectionKey] = [];
      }
      sectionBuffers[currentSectionKey].push(line);
    }
  }

  sections.analysis = sectionBuffers["analysis"]?.join("\n");
  sections.thesis = sectionBuffers["thesis"]?.join("\n");
  sections.body = sectionBuffers["body"]?.join("\n");
  sections.toneNotes = sectionBuffers["toneNotes"]?.join("\n");
  sections.conclusion = sectionBuffers["conclusion"]?.join("\n");

  // Extract individual references if available
  if (sectionBuffers["references"]) {
    const rawRefs = sectionBuffers["references"].join("\n");
    const refLines = rawRefs
      .split("\n")
      .filter((l) => l.trim() && !l.startsWith("#") && !l.toLowerCase().includes("reference"))
      .map((l) => l.replace(/^[-*•\d.]+\s*/, "").trim())
      .filter((l) => l.length > 20);
    sections.references = refLines;
  }

  // Detect discipline from section analysis or overall text
  let inferredDiscipline = "General Academic";
  if (sections.analysis) {
    const discMatch = sections.analysis.match(/discipline[^:]*:\s*([^\n\r*]+)/i);
    if (discMatch && discMatch[1]) {
      inferredDiscipline = discMatch[1].trim();
    }
  }

  const hasAllStages = Boolean(
    sections.analysis &&
    sections.thesis &&
    sections.body &&
    sections.conclusion &&
    sections.references &&
    sections.references.length > 0
  );

  return {
    rawText: text,
    wordCount,
    readingTimeMinutes,
    commandWords: extractCommandWords("", text),
    inferredDiscipline,
    sections,
    hasAllStages,
  };
}

export function copyToClipboard(content: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(content).then(() => true).catch(() => false);
  } else {
    // Fallback
    try {
      const textarea = document.createElement("textarea");
      textarea.value = content;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      return Promise.resolve(success);
    } catch {
      return Promise.resolve(false);
    }
  }
}
