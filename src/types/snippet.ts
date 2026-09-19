export type SnippetLanguage = 'typescript' | 'javascript' | 'python' | 'go' | 'java' | 'css' | 'html' | 'other';

export interface Snippet {
  id: number;
  title: string;
  language: SnippetLanguage;
  code: string;
  tags: string[];
}
