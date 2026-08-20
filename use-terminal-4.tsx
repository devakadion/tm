import { useCallback } from 'react';
import { TerminalLine, ThoughtTag, Thought } from '@/components/Tabs';

const TAGS: ThoughtTag[] = ['feature', 'bug', 'refactor', 'snippet', 'task', 'note'];
const generateId = () => Math.random().toString(36).slice(2, 10);

export interface CommandResult {
  lines: TerminalLine[];
  thought?: Thought;
}

export function useTerminal() {
  const processCommand = useCallback((raw: string, currentLines: TerminalLine[]): CommandResult => {
    const trimmed = raw.trim();
    if (!trimmed) return { lines: currentLines };

    const lower = trimmed.toLowerCase();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();

    const userLine: TerminalLine = {
      id: generateId(),
      type: 'user',
      text: trimmed,
      createdAt: Date.now(),
    };

    if (lower === 'clear') {
      return { lines: [] };
    }

    const lines: TerminalLine[] = [...currentLines, userLine];

    if (lower === 'help') {
      lines.push({
        id: generateId(),
        type: 'success',
        text: 'commands: think <tag> <note> | features | bugs | refactor | snippets | tasks | notes | all | settings | clear',
        createdAt: Date.now(),
      });
      return { lines };
    }

    if (cmd === 'think' && parts.length >= 3) {
      const maybeTag = parts[1].toLowerCase();
      if (TAGS.includes(maybeTag as ThoughtTag)) {
        const text = parts.slice(2).join(' ');
        lines.push({
          id: generateId(),
          type: 'agent',
          tag: maybeTag as ThoughtTag,
          text,
          createdAt: Date.now(),
        });
        lines.push({
          id: generateId(),
          type: 'success',
          text: `logged ${maybeTag}.`,
          createdAt: Date.now(),
        });
        const thought: Thought = { id: generateId(), tag: maybeTag as ThoughtTag, text, createdAt: Date.now() };
        return { lines, thought };
      }
    }

    lines.push({
      id: generateId(),
      type: 'error',
      text: `unknown command: ${cmd}`,
      createdAt: Date.now(),
    });
    return { lines };
  }, []);

  return { processCommand };
}