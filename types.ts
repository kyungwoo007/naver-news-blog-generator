export enum Tone {
  ACADEMIC = 'Professional Academic',
  CASUAL = 'General Public/Casual',
  ENTHUSIASTIC = 'Marketing/Enthusiastic'
}

export enum Length {
  SHORT = 'Short (500 words)',
  STANDARD = 'Standard (500-1000 words)',
  DEEP = 'Deep Dive (1000-2000 words)'
}

export interface GeneratorConfig {
  keywords: string;
  dateRange: string;
  tone: Tone;
  length: Length;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface BlogPost {
  title: string;
  content: string; // HTML string
  tags: string[];
  sources: { title: string; url: string }[];
}
