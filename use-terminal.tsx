export function useTerminal() {
  const processCommand = useCallback((raw, currentLines) => { ... }, []);
  return { processCommand };
}