import { useState, useCallback } from 'react';
import { TerminalLine, ThoughtTag, Thought } from '@/components/Tabs';

const TAGS: ThoughtTag[] = ['feature', 'bug', 'refactor', 'snippet', 'task', 'note'];
const generateId = () => Math.random().toString(36).slice(2, 10);

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  
  const runCommand = useCallback((raw: string, thoughts: Thought[]) => {
    // parse and return lines
  }, []);
  
  return { lines, setLines, runCommand };
}