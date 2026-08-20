import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThoughtTag } from '@/types';

interface ThoughtInputProps {
  onSubmit: (text: string) => void;
}

const TAGS: ThoughtTag[] = ['feature', 'bug', 'refactor', 'snippet', 'task', 'note'];

export function ThoughtInput({ onSubmit }: ThoughtInputProps) {
  const [value, setValue] = useState('');

  const handleSend = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertTag = (tag: ThoughtTag) => {
    const cleaned = value.replace(/^\/(feature|bug|refactor|snippet|task|note)\b\s?/, '');
    setValue(`/${tag} ${cleaned}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => insertTag(tag)}
            className="group flex items-center gap-1.5 rounded-full border border-teal-200/60 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800 transition hover:border-teal-300 hover:bg-teal-100 active:scale-95"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal-500 group-hover:bg-teal-600" />
            /{tag}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-teal-600">
            &gt;
          </span>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type /feature, /bug, /refactor ..."
            className="h-12 rounded-xl border-slate-200 bg-white pl-9 pr-4 font-mono text-sm shadow-sm placeholder:text-slate-400 focus-visible:ring-teal-500"
          />
        </div>
        <Button
          onClick={handleSend}
          className="h-12 rounded-xl bg-teal-600 px-6 font-semibold text-white shadow-sm hover:bg-teal-700 active:scale-95"
        >
          Enter
        </Button>
      </div>
    </div>
  );
}