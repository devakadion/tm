import { useState, useCallback } from 'react';
import { Thought } from '@/components/Tabs';

const STORAGE_KEY = 'devthink-thoughts-v1';
const generateId = () => Math.random().toString(36).slice(2, 10);

function loadThoughts(): Thought[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Thought[]) : [];
  } catch {
    return [];
  }
}

function saveThoughts(thoughts: Thought[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  } catch {}
}

export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>(loadThoughts);

  const addThought = useCallback((thought: Thought) => {
    setThoughts((prev) => {
      const next = [...prev, thought];
      saveThoughts(next);
      return next;
    });
  }, []);

  const removeThought = useCallback((id: string) => {
    setThoughts((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveThoughts(next);
      return next;
    });
  }, []);

  const clearThoughts = useCallback(() => {
    setThoughts([]);
    saveThoughts([]);
  }, []);

  return {
    thoughts,
    addThought,
    removeThought,
    clearThoughts,
  };
}