import { useState, useCallback } from 'react';
import { TerminalLine, WorkspaceTab } from '@/components/Tabs';
import { useTabs } from '@/hooks/useTabs';
import { useThoughts } from '@/hooks/useThoughts';
import { useTerminal } from '@/hooks/useTerminal';

export function useWorkspace() {
  const { tabs, activeTabId, addTab, closeTab, activateTab } = useTabs();
  const { thoughts, addThought } = useThoughts();
  const { processCommand } = useTerminal();
  
  const [entered, setEntered] = useState(false);
  
  const runCommand = useCallback((raw: string) => {
    setTabs(prev => prev.map(tab => {
      if (tab.id !== activeTabId) return tab;
      const newLines = processCommand(raw, tab.lines, thoughts);
      return { ...tab, lines: newLines };
    }));
  }, [activeTabId, thoughts, processCommand]);
  
  // ...
}