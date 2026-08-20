export function useTerminal() {
  const processCommand = useCallback((raw: string, currentLines: TerminalLine[], thoughts: Thought[]) => {
    // return new lines
  }, []);
  
  return { processCommand };
}