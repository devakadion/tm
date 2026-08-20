import { useState, useCallback } from 'react';
import { Tab, TerminalLine } from '@/components/Tabs';
import { useTabs } from '@/hooks/useTabs';
import { useTerminal } from '@/hooks/useTerminal';
import { useThoughts } from '@/hooks/useThoughts';
import { useSettings } from '@/hooks/useSettings';

export interface WorkspaceTab extends Tab {}

export function useWorkspace() {
  const { tabs, setTabs, activeTabId, addTab, closeTab, activateTab } = useTabs();
  const { processCommand } = useTerminal();
  const { thoughts, addThought } = useThoughts();
  const settings = useSettings();
  const [entered, setEntered] = useState(false);

  const enterWorkspace = useCallback(() => setEntered(true), []);

  const runCommand = useCallback(
    (raw: string) => {
      const lower = raw.trim().toLowerCase();

      if (lower === 'settings') {
        activateTab('settings');
        return;
      }

      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id !== activeTabId) return tab;
          const result = processCommand(raw, tab.lines, thoughts);
          if (result.thought) addThought(result.thought);
          return { ...tab, lines: result.lines };
        })
      );
    },
    [activeTabId, activateTab, addThought, processCommand, setTabs, thoughts]
  );

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const allLines = tabs
    .filter((t) => t.label !== 'settings')
    .flatMap((t) => t.lines)
    .sort((a, b) => a.createdAt - b.createdAt);

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