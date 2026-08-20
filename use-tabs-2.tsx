import { useState, useCallback } from 'react';
import { Tab } from '@/components/Tabs';

const DEFAULT_TABS: Tab[] = [
  { id: 'features', label: 'features' },
  { id: 'bugs', label: 'bugs' },
  { id: 'refactor', label: 'refactor' },
  { id: 'snippets', label: 'snippets' },
  { id: 'tasks', label: 'tasks' },
  { id: 'notes', label: 'notes' },
  { id: 'all', label: 'all' },
  { id: 'settings', label: 'settings' },
];

export function useTabs() {
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState<string>('all');

  const addTab = useCallback(() => {
    const id = `tab-${Date.now()}`;
    const nextNumber = tabs.filter((t) => t.label.startsWith('new')).length + 1;
    const label = nextNumber === 1 ? 'new' : `new (${nextNumber})`;
    setTabs((prev) => [...prev, { id, label, lines: [] }]);
    setActiveTabId(id);
  }, [tabs]);

  const closeTab = useCallback((id: string) => {
    setTabs((prev) => {
      if (prev.length <= 1) return prev;
      const idx = prev.findIndex((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id);
      if (activeTabId === id) {
        const fallback = prev[idx - 1] ?? prev[idx + 1];
        setActiveTabId(fallback.id);
      }
      return next;
    });
  }, [activeTabId]);

  const activateTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  return { tabs, setTabs, activeTabId, setActiveTabId, addTab, closeTab, activateTab };
}