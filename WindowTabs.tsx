import { X, Plus } from 'lucide-react';
import { Tab } from '@/types';

interface WindowTabsProps {
  tabs: Tab[];
  activeTabId: string;
  onActivate: (id: string) => void;
  onClose: (id: string) => void;
  onAdd: () => void;
}

export function WindowTabs({ tabs, activeTabId, onActivate, onClose, onAdd }: WindowTabsProps) {
  return (
    <div className="flex h-10 w-full items-end gap-0.5 bg-stone-900 px-2 pt-2">
      {tabs.map((tab) => {
        const active = tab.id === activeTabId;
        return (
          <button
            key={tab.id}
            onClick={() => onActivate(tab.id)}
            className={`group relative flex h-8 max-w-[12rem] flex-1 items-center justify-between gap-2 rounded-t-lg border-t border-l border-r px-3 text-xs font-medium transition ${
              active
                ? 'z-10 border-stone-700 bg-stone-950 text-orange-400'
                : 'border-transparent bg-stone-800/60 text-stone-400 hover:bg-stone-800 hover:text-stone-200'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <span>{tab.icon}</span>
              <span className="truncate">{tab.title}</span>
            </span>
            {tabs.length > 1 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(tab.id);
                }}
                className={`ml-1 rounded-md p-0.5 transition ${
                  active ? 'hover:bg-stone-800 hover:text-white' : 'hover:bg-stone-700 hover:text-white'
                }`}
              >
                <X size={12} />
              </span>
            )}
          </button>
        );
      })}

      <button
        onClick={onAdd}
        className="mb-1 ml-1 flex h-6 w-6 items-center justify-center rounded-md text-stone-400 transition hover:bg-stone-800 hover:text-white"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}