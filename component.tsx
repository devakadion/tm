const processCommand = useCallback((raw: string, currentLines: TerminalLine[], thoughts: Thought[] = []): CommandResult => {
  // ...
  if (['features', 'bugs', 'refactor', 'snippets', 'tasks', 'notes', 'all'].includes(lower)) {
    const tagMap: Record<string, ThoughtTag | null> = {
      features: 'feature',
      bugs: 'bug',
      refactor: 'refactor',
      snippets: 'snippet',
      tasks: 'task',
      notes: 'note',
      all: null,
    };
    const tag = tagMap[lower];
    const filtered = tag ? thoughts.filter((t) => t.tag === tag) : thoughts;
    if (filtered.length === 0) {
      lines.push({ type: 'success', text: `no ${lower} recorded yet.` });
    } else {
      filtered.forEach((t) => lines.push({ type: 'agent', tag: t.tag, text: t.text, createdAt: t.createdAt, id: t.id }));
    }
    return { lines };
  }
  // ...
});