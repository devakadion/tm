export type ThoughtTag = 'feature' | 'bug' | 'refactor' | 'snippet' | 'task' | 'note';

export interface Thought {
  id: string;
  text: string;
  tag: ThoughtTag;
  createdAt: number;
}

export type TerminalLineType = 'system' | 'user' | 'agent' | 'error' | 'success';

export interface TerminalLine {
  id: string;
  type: TerminalLineType;
  text: string;
  tag?: ThoughtTag;
  createdAt: number;
}

export interface Tab {
  id: string;
  title: string;
  icon?: string;
}