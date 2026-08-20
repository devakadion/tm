export function useThoughts() {
  const [thoughts, setThoughts] = useState<Thought[]>(load);
  const addThought = useCallback((thought: Thought) => {
    setThoughts(prev => { const next = [...prev, thought]; save(next); return next; });
  }, []);
  return { thoughts, addThought };
}