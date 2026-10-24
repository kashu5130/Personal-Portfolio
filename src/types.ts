export type AcademicLevel = 
  | "Upper-Division Undergraduate"
  | "Honors Senior Capstone"
  | "Graduate / Master's Seminar"
  | "Introductory Collegiate";

export type WordCountTarget = 
  | "Standard (900 - 1,300 words)"
  | "In-Depth (1,400 - 2,000 words)"
  | "Concise (500 - 800 words)";

export interface AssignmentRequest {
  query: string;
  discipline?: string;
  academicLevel: AcademicLevel;
  wordCountTarget: WordCountTarget;
}

export interface AssignmentMetadata {
  query: string;
  academicLevel: string;
  discipline: string;
  timestamp: string;
  wordCount?: number;
  readingTimeMinutes?: number;
}

export interface SavedAssignment {
  id: string;
  query: string;
  discipline: string;
  academicLevel: string;
  content: string;
  createdAt: string;
  wordCount: number;
}

export interface SamplePrompt {
  id: string;
  discipline: string;
  commandWord: string;
  title: string;
  query: string;
  iconName: string;
}

export interface FrameworkSection {
  title: string;
  stageNumber: number;
  stageName: string;
  content: string;
  description: string;
}
