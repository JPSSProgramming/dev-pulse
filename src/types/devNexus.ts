export type ReviewSeverity = 'error' | 'warning' | 'info';

export interface DevNexusFile {
  id: string;
  name: string;
  language: 'typescript' | 'javascript' | 'python' | 'css';
  path: string;
  code: string;
}

export interface ReviewFinding {
  id: string;
  severity: ReviewSeverity;
  title: string;
  description: string;
  line?: number;
}

export type ReviewResults = Record<string, ReviewFinding[]>;
