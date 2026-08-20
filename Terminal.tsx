import { useState, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import {
  Zap,
  Bug,
  FileCode,
  CheckSquare,
  StickyNote,
  Play,
  Cpu,
  Settings,
  X,
  Plus,
} from 'lucide-react';
import { useWorkspace, WorkspaceTab } from '@/hooks/useWorkspace';
import { useSettings, LogoType } from '@/hooks/useSettings';
import {
  FeatureTab,
  BugTab,
  RefactorTab,
  SnippetTab,
  TaskTab,
  NoteTab,
  AllTab,
  SettingsTab,
} from '@/components/Tabs';
import { Logo } from '@/components/Logo';

const TAB_ICON: Record<string, React.ReactNode> = {
  features: <Zap size={12} />,
  bugs: <Bug size={12} />,
  snippets: <FileCode size={12} />,
  tasks: <CheckSquare size={12} />,
  notes: <StickyNote size={12} />,
  all: <Cpu size={12} />,
  settings: <Settings size={12} />,
};

export function Terminal() {
  const {
    tabs,
    activeTabId,
    entered,
    runCommand,
    addTab,
    closeTab,
    activateTab,
    enterWorkspace,
  } = useWorkspace();

  const {
    logoType,
    setLogoType,
    logoAnimated,
    setLogoAnimated,
  } = useSettings();

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];
  const lines = activeTab?.lines ?? [];

  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!input.trim()) return;
    if (!entered) enterWorkspace();
    runCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const allLines = tabs.flatMap((t) => t.lines).sort((a, b) => a.createdAt - b.createdAt);

  const knownLabels = ['features', 'bugs', 'refactor', 'snippets', 'tasks', 'notes', 'all', 'settings'];

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-stone-950 px-4 font-sans text-sm text-stone-200">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.35); }
        }
        .logo-animated { animation: glow 2.4s ease-in-out infinite; }
      `}</style>

      <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-1 flex-col items-center justify-center px-4"
            >
              <div className="flex w-full max-w-fit flex-col items-center gap-6">
                <Logo type={logoType} animated={logoAnimated} />
                <div className="relative z-10 w-full shrink-0">
                  <div className="flex w-full items-center gap-3 border border-stone-800 bg-stone-900 px-4 py-3 shadow-lg">
                    <span className="font-mono text-sm text-orange-500">&gt;_</span>
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="think feature add dark mode toggle..."
                      className="h-6 flex-1 rounded-none border-0 bg-transparent p-0 font-mono text-sm text-stone-200 shadow-none ring-0 placeholder:text-stone-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                      spellCheck={false}
                      autoComplete="off"
                      autoFocus
                    />
                    <button
                      onClick={handleSubmit}
                      className="flex h-8 items-center gap-1.5 bg-orange-700 px-4 text-xs font-semibold text-white transition hover:bg-orange-600"
                    >
                      <Play size={12} />
                      Run
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="flex shrink-0 items-center justify-center gap-1 overflow-x-auto pt-10 pb-2 no-scrollbar">
                {tabs.map((tab) => (
                  <TabChip
                    key={tab.id}
                    tab={tab}
                    active={tab.id === activeTabId}
                    closable={tab.label !== 'settings'}
                    onActivate={() => activateTab(tab.id)}
                    onClose={() => closeTab(tab.id)}
                  />
                ))}

                <button
                  onClick={addTab}
                  className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:bg-stone-900 hover:text-orange-400"
                >
                  <Plus size={12} />
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {activeTab.label === 'features' && (
                  <FeatureTab lines={lines} onCommand={runCommand} logoType={logoType} logoAnimated={logoAnimated} />
                )}
                {activeTab.label === 'bugs' && (
                  <BugTab lines={lines} onCommand={runCommand} logoType={logoType} logoAnimated={logoAnimated} />
                )}
                {activeTab.label === 'refactor' && (
                  <RefactorTab lines={lines} onCommand={runCommand} logoType={logoType} logoAnimated={logoAnimated} />
                )}
                {activeTab.label === 'snippets' && (
                  <SnippetTab lines={lines} onCommand={runCommand} logoType={logoType} logoAnimated={logoAnimated} />
                )}
                {activeTab.label === 'tasks' && (
                  <TaskTab lines={lines} onCommand={runCommand} logoType={logoType} logoAnimated={logoAnimated} />
                )}
                {activeTab.label === 'notes' && (
                  <NoteTab lines={lines} onCommand={runCommand} logoType={logoType} logoAnimated={logoAnimated} />
                )}
                {activeTab.label === 'all' && (
                  <AllTab lines={allLines} onCommand={runCommand} logoType={logoType} logoAnimated={logoAnimated} />
                )}
                {activeTab.label === 'settings' && (
                  <SettingsTab
                    logoType={logoType}
                    setLogoType={setLogoType}
                    logoAnimated={logoAnimated}
                    setLogoAnimated={setLogoAnimated}
                  />
                )}
                {!knownLabels.includes(activeTab.label) && (
                  <AllTab lines={lines} onCommand={runCommand} logoType={logoType} logoAnimated={logoAnimated} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabChip({
  tab,
  active,
  closable,
  onActivate,
  onClose,
}: {
  tab: WorkspaceTab;
  active: boolean;
  closable: boolean;
  onActivate: () => void;
  onClose: () => void;
}) {
  return (
    <button
      onClick={onActivate}
      className={`group relative flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'bg-stone-900 text-orange-400'
          : 'text-stone-500 hover:bg-stone-900 hover:text-orange-400'
      }`}
    >
      {TAB_ICON[tab.label] ?? <Cpu size={12} />}
      <span>{tab.label}</span>
      {closable && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={`ml-0.5 p-0.5 text-stone-600 transition hover:bg-stone-800 hover:text-white ${
            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <X size={12} />
        </span>
      )}
    </button>
  );
}