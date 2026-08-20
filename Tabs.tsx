import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Bot, User, Zap, Bug, FileCode, CheckSquare, StickyNote, Cpu } from 'lucide-react';
import { LogoType } from '@/hooks/useSettings';
import { Logo } from '@/components/Logo';

export type ThoughtTag = 'feature' | 'bug' | 'refactor' | 'snippet' | 'task' | 'note';

export interface Thought {
  id: string;
  text: string;
  tag: ThoughtTag;
  createdAt: number;
}

export type TerminalLineType = 'system' | 'user' | 'agent' | 'error' | 'success';

export interface TerminalLine {
  id: string;
  type: TerminalLineType;
  text: string;
  tag?: ThoughtTag;
  createdAt: number;
}

export interface Tab {
  id: string;
  label: string;
  lines: TerminalLine[];
}

interface TabProps {
  lines: TerminalLine[];
  onCommand: (cmd: string) => void;
  logoType: LogoType;
  logoAnimated: boolean;
}

const TAG_COLORS: Record<ThoughtTag, string> = {
  feature: 'text-emerald-400',
  bug: 'text-rose-400',
  refactor: 'text-amber-400',
  snippet: 'text-cyan-400',
  task: 'text-violet-400',
  note: 'text-slate-400',
};

const TAG_BG: Record<ThoughtTag, string> = {
  feature: 'bg-emerald-500/15',
  bug: 'bg-rose-500/15',
  refactor: 'bg-amber-500/15',
  snippet: 'bg-cyan-500/15',
  task: 'bg-violet-500/15',
  note: 'bg-slate-500/15',
};

const TYPE_COLORS: Record<TerminalLine['type'], string> = {
  system: 'text-orange-400',
  user: 'text-orange-500',
  agent: 'text-stone-200',
  error: 'text-rose-500',
  success: 'text-orange-400',
};

function MessageList({ lines }: { lines: TerminalLine[] }) {
  return (
    <div className="flex flex-col gap-5">
      {lines.map((line) => (
        <motion.div
          key={line.id}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`flex w-full ${line.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {line.type === 'user' && (
            <div className="flex max-w-[88%] items-end gap-2 sm:max-w-[70%]">
              <div className="bg-orange-700/20 px-4 py-2.5 font-mono text-sm text-orange-100">
                {line.text}
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-orange-700/20 text-orange-400">
                <User size={14} />
              </div>
            </div>
          )}

          {line.type === 'agent' && line.tag && (
            <div className="flex max-w-[88%] items-end gap-2 sm:max-w-[70%]">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center bg-orange-700/20 text-orange-400">
                <Bot size={14} />
              </div>
              <div className="bg-stone-900 px-4 py-2.5 font-mono text-sm text-stone-200">
                <div className="mb-1 flex items-center gap-2">
                  <span className={`rounded-none px-1.5 py-0.5 text-[10px] font-bold ${TAG_BG[line.tag]} ${TAG_COLORS[line.tag]}`}>
                    {line.tag}
                  </span>
                  <span className="text-[10px] text-stone-600">[{line.id.slice(0, 8)}]</span>
                </div>
                <div>{line.text}</div>
              </div>
            </div>
          )}

          {(line.type === 'system' || line.type === 'success' || line.type === 'error') && (
            <div className="flex items-center gap-2 bg-stone-900/60 px-3 py-1 font-mono text-xs">
              <span className={TYPE_COLORS[line.type]}>
                {line.type === 'system' && '//'}
                {line.type === 'success' && 'ok'}
                {line.type === 'error' && '!'}
              </span>
              <span className="text-stone-400">{line.text}</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function TabShell({
  lines,
  onCommand,
  logoType,
  logoAnimated,
  accent,
  icon,
  title,
  emptyText,
  prompt,
}: TabProps & {
  accent: string;
  icon: React.ReactNode;
  title: string;
  emptyText: string;
  prompt: string;
}) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    onCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className={`flex shrink-0 items-center gap-2 border-b border-stone-800 px-1 py-2 ${accent}`}>
        {icon}
        <span className="font-mono text-xs font-semibold uppercase tracking-wide">{title}</span>
        <span className="ml-auto text-[10px] text-stone-600">{lines.length} entries</span>
      </div>

      <div
        ref={scrollRef}
        className="no-scrollbar flex-1 overflow-y-auto px-1 py-4 sm:px-2"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center font-mono text-sm text-stone-600">
            <span>{emptyText}</span>
            <span className="text-xs text-stone-700">{prompt}</span>
          </div>
        ) : (
          <MessageList lines={lines} />
        )}
      </div>

      <div className="pointer-events-none relative z-0 mb-3 flex shrink-0 flex-col items-center">
        <Logo type={logoType} animated={logoAnimated} half />
      </div>

      <div className="mb-10 shrink-0">
        <div className="relative z-10 w-full shrink-0">
          <div className="flex w-full items-center gap-3 border border-stone-800 bg-stone-900 px-4 py-3 shadow-lg">
            <span className="font-mono text-sm text-orange-500">&gt;_</span>
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={prompt}
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
    </div>
  );
}

export function FeatureTab(props: TabProps) {
  return (
    <TabShell
      {...props}
      accent="text-emerald-400"
      icon={<Zap size={14} />}
      title="features"
      emptyText="no features planned yet."
      prompt="think feature add dark mode toggle..."
    />
  );
}

export function BugTab(props: TabProps) {
  return (
    <TabShell
      {...props}
      accent="text-rose-400"
      icon={<Bug size={14} />}
      title="bugs"
      emptyText="no bugs reported."
      prompt="think bug login redirect fails..."
    />
  );
}

export function RefactorTab(props: TabProps) {
  return (
    <TabShell
      {...props}
      accent="text-amber-400"
      icon={<FileCode size={14} />}
      title="refactor"
      emptyText="no refactor ideas yet."
      prompt="think refactor extract api client..."
    />
  );
}

export function SnippetTab(props: TabProps) {
  return (
    <TabShell
      {...props}
      accent="text-cyan-400"
      icon={<FileCode size={14} />}
      title="snippets"
      emptyText="no code snippets saved."
      prompt="think snippet useEffect hook..."
    />
  );
}

export function TaskTab(props: TabProps) {
  return (
    <TabShell
      {...props}
      accent="text-violet-400"
      icon={<CheckSquare size={14} />}
      title="tasks"
      emptyText="no tasks tracked."
      prompt="think task write tests for auth..."
    />
  );
}

export function NoteTab(props: TabProps) {
  return (
    <TabShell
      {...props}
      accent="text-slate-400"
      icon={<StickyNote size={14} />}
      title="notes"
      emptyText="no notes taken."
      prompt="think note remember to update docs..."
    />
  );
}

export function AllTab(props: TabProps) {
  return (
    <TabShell
      {...props}
      accent="text-orange-400"
      icon={<Cpu size={14} />}
      title="all entries"
      emptyText="no entries anywhere yet."
      prompt="think feature, bug, task, note..."
    />
  );
}

export function SettingsTab({
  logoType,
  setLogoType,
  logoAnimated,
  setLogoAnimated,
}: {
  logoType: LogoType;
  setLogoType: (type: LogoType) => void;
  logoAnimated: boolean;
  setLogoAnimated: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="mb-6 border-b border-stone-800 pb-3">
        <h2 className="font-mono text-lg font-semibold text-orange-400">settings</h2>
        <p className="text-xs text-stone-500">customize the workspace look</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col border border-stone-800 bg-stone-900">
          <div className="border-b border-stone-800 px-4 py-2 font-mono text-xs text-stone-500">
            preview
          </div>
          <div className="flex flex-1 items-center justify-center py-12">
            <Logo type={logoType} animated={logoAnimated} />
          </div>
        </div>

        <div className="flex flex-col border border-stone-800 bg-stone-900">
          <div className="border-b border-stone-800 px-4 py-2 font-mono text-xs text-stone-500">
            options
          </div>
          <div className="space-y-6 p-4">
            <div className="space-y-3">
              <Label className="text-xs font-medium text-stone-400">logo type</Label>
              <div className="flex flex-wrap gap-2">
                {(['ascii', 'devthink', 'minimal'] as LogoType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setLogoType(type)}
                    className={`border px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition active:scale-95 ${
                      logoType === type
                        ? 'border-orange-700 bg-orange-700 text-white'
                        : 'border-stone-700 bg-stone-800 text-stone-400 hover:border-stone-600 hover:text-stone-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-stone-800 pt-6">
              <div className="space-y-1">
                <Label className="text-xs font-medium text-stone-400">animated logo</Label>
                <p className="text-[10px] text-stone-600">toggle a subtle glow pulse</p>
              </div>
              <button
                onClick={() => setLogoAnimated(!logoAnimated)}
                className={`relative h-6 w-11 transition ${
                  logoAnimated ? 'bg-orange-700' : 'bg-stone-700'
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 bg-white transition ${
                    logoAnimated ? 'left-6' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}