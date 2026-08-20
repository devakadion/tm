const runCommand = useCallback((raw: string) => {
  setTabs((prev) =>
    prev.map((tab) => {
      if (tab.id !== activeTabId) return tab;
      const result = processCommand(raw, tab.lines);
      if (result.thought) addThought(result.thought);
      return { ...tab, lines: result.lines };
    })
  );
}, [activeTabId, addThought, processCommand, setTabs]);