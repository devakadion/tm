import { useState, useCallback } from 'react';
import { TerminalLine, Tab, ThoughtTag, Thought } from '@/components/Tabs';
import { useTabs } from '@/hooks/useTabs';
import { useTerminal } from '@/hooks/useTerminal';
import { useThoughts } from '@/hooks/useThoughts';
import { useSettings, LogoType } from '@/hooks/useSettings';

const TAGS: ThoughtTag[] = ['feature', 'bug', 'refactor', 'snippet', 'task', 'note'];

export function useWorkspace() {
  const { tabs, setTabs, activeTabId, addTab, closeTab, activateTab } = useTabs();
  const { thoughts, addThought } = useThoughts();
  const { processCommand } = useTerminal();
  const settings = useSettings();
  const [entered, setEntered] = useState(false);

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const lower = trimmed.toLowerCase();
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id !== activeTabId) return tab;

        const userLine: TerminalLine = {
          id: generateId(),
          type: 'user',
          text: trimmed,
          createdAt: Date.now(),
        };

        if (lower === 'clear') {
          return { ...tab, lines: [] };
        }

        const newLines: TerminalLine[] = [...tab.lines, userLine];

        if (lower === 'help') {
          newLines.push({
            id: generateId(),
            type: 'success',
            text: 'commands: think <tag> <note> | features | bugs | refactor | snippets | tasks | notes | all | settings | clear',
            createdAt: Date.now(),
          });
          return { ...tab, lines: newLines };
        }

        if (cmd === 'think' && parts.length >= 3) {
          const maybeTag = parts[1].toLowerCase();
          if (TAGS.includes(maybeTag as ThoughtTag)) {
            const text = parts.slice(2).join(' ');
            const thought: Thought = { id: generateId(), tag: maybeTag as ThoughtTag, text, createdAt: Date.now() };
            addThought(thought);
            newLines.push({
              id: generateId(),
              type: 'agent',
              tag: maybeTag as ThoughtTag,
              text,
              createdAt: Date.now(),
            });
            newLines.push({
              id: generateId(),
              type: 'success',
              text: `logged ${maybeTag}.`,
              createdAt: Date.now(),
            });
            return { ...tab, lines: newLines };
          }
        }

        newLines.push({
          id: generateId(),
          type: 'error',
          text: `unknown command: ${cmd}`,
          createdAt: Date.now(),
        });
        return { ...tab, lines: newLines };
      })
    );
  }, [activeTabId, addThought, setTabs]);

  const enterWorkspace = useCallback(() => setEntered(true), []);

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const allLines = tabs.flatMap((t) => t.lines).sort((a, b) => a.createdAt - b.createdAt);

  return {
    tabs,
    activeTab,
    activeTabId,
    entered,
    enterWorkspace,
    addTab,
    closeTab,
    activateTab,
    runCommand,
    allLines,
    settings,
  };
}