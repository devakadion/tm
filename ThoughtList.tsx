import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Thought, ThoughtTag } from '@/types';
import { cn } from '@/lib/utils';

interface ThoughtListProps {
  thoughts: Thought[];
  onDelete: (id: string) => void;
  onClear: () => void;
  tags: ThoughtTag[];
}

const TAG_COLORS: Record<ThoughtTag, string> = {
  feature: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  bug: 'bg-rose-100 text-rose-800 border-rose-200',
  refactor: 'bg-amber-100 text-amber-800 border-amber-200',
  snippet: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  task: 'bg-violet-100 text-violet-800 border-violet-200',
  note: 'bg-slate-100 text-slate-800 border-slate-200',
};

const TAG_DOT: Record<ThoughtTag, string> = {
  feature: 'bg-emerald-500',
  bug: 'bg-rose-500',
  refactor: 'bg-amber-500',
  snippet: 'bg-cyan-500',
  task: 'bg-violet-500',
  note: 'bg-slate-400',
};

export function ThoughtList({ thoughts, onDelete, onClear, tags }: ThoughtListProps) {
  const [filter, setFilter] = useState<ThoughtTag | 'all'>('all');

  const filtered =
    filter === 'all' ? thoughts : thoughts.filter((t) => t.tag === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition active:scale-95',
              filter === 'all'
                ? 'border-teal-300 bg-teal-100 text-teal-900'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            all
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition active:scale-95',
                filter === tag
                  ? 'border-teal-300 bg-teal-100 text-teal-900'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              /{tag}
            </button>
          ))}
        </div>
        {thoughts.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-slate-500 hover:text-rose-600"
          >
            Clear all
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
          <p className="font-mono text-sm text-slate-400">
            {thoughts.length === 0
              ? '> no thoughts yet. start typing above.'
              : '> no entries match this filter.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((thought) => (
            <li key={thought.id}>
              <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={cn('h-2 w-2 rounded-full', TAG_DOT[thought.tag])} />
                        <Badge
                          variant="outline"
                          className={cn(
                            'rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                            TAG_COLORS[thought.tag]
                          )}
                        >
                          {thought.tag}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {new Date(thought.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700">
                        {thought.text}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(thought.id)}
                      className="h-7 text-xs text-slate-400 hover:text-rose-600"
                    >
                      rm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}