import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Play, Bot, User } from 'lucide-react';
import { TerminalLine, ThoughtTag } from '@/types';
import { LogoType } from '@/hooks/useSettings';
import { Logo } from '@/components/Logo';

interface TerminalTabProps {
  lines: TerminalLine[];
  onCommand: (cmd: string) => void;
  logoType: LogoType;
  logoAnimated: boolean;
  accent?: string;
  icon?: React.ReactNode;
  title?: string;
  emptyText?: string;
  prompt?: string;
  showHeader?: boolean;
  showHalfLogo?: boolean;
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

export function TerminalTab({
  lines,
  onCommand,
  logoType,
  logoAnimated,
  accent = 'text-orange-400',
  icon,
  title,
  emptyText = 'Type a command to start.',
  prompt = 'think feature add dark mode toggle...',
  showHeader = false,
  showHalfLogo = true,
}: TerminalTabProps) {
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
      {showHeader && (
        <div className={`flex shrink-0 items-center gap-2 border-b border-stone-800 px-1 py-2 ${accent}`}>
          {icon}
          <span className="font-mono text-xs font-semibold uppercase tracking-wide">{title}</span>
          <span className="ml-auto text-[10px] text-stone-600">{lines.length} entries</span>
        </div>
      )}

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
        )}
      </div>

      {showHalfLogo && (
        <div className="pointer-events-none relative z-0 mb-3 flex shrink-0 flex-col items-center">
          <Logo type={logoType} animated={logoAnimated} half />
        </div>
      )}

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