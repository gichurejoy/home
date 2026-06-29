import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, User, Users, CornerDownLeft, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useSearchStore } from '@/store/useSearchStore';

type SearchResultItem = 
  | { type: 'property'; id: string; title: string; subtitle: string; url: string }
  | { type: 'agent'; id: string; title: string; subtitle: string; url: string }
  | { type: 'customer'; id: string; title: string; subtitle: string; url: string };

export const CommandPalette: React.FC = () => {
  const { isOpen, close } = useSearchStore();
  const { properties, agents, customers } = useAppStore();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Key listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        useSearchStore.getState().toggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync keyboard shortcuts when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setQuery('');
        setActiveIndex(0);
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Generate and filter results
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const cleanQuery = query.toLowerCase().trim();
    const items: SearchResultItem[] = [];

    // Filter properties
    properties.forEach(p => {
      if (p.title.toLowerCase().includes(cleanQuery) || p.location.toLowerCase().includes(cleanQuery) || p.type.toLowerCase().includes(cleanQuery)) {
        items.push({
          type: 'property',
          id: p.id,
          title: p.title,
          subtitle: `${p.type} • ${p.location} • $${p.price.toLocaleString()}`,
          url: `/properties/${p.id}`
        });
      }
    });

    // Filter agents
    agents.forEach(a => {
      if (a.name.toLowerCase().includes(cleanQuery) || a.email.toLowerCase().includes(cleanQuery) || a.agency.toLowerCase().includes(cleanQuery)) {
        items.push({
          type: 'agent',
          id: a.id,
          title: a.name,
          subtitle: `${a.agency} • ${a.email} • ${a.status}`,
          url: `/agents/${a.id}`
        });
      }
    });

    // Filter customers
    customers.forEach(c => {
      if (c.name.toLowerCase().includes(cleanQuery) || c.email.toLowerCase().includes(cleanQuery) || c.phone.includes(cleanQuery)) {
        items.push({
          type: 'customer',
          id: c.id,
          title: c.name,
          subtitle: `Customer • ${c.email} • ${c.phone}`,
          url: `/customers/${c.id}`
        });
      }
    });

    return items.slice(0, 10); // Cap at 10 total results
  }, [query, properties, agents, customers]);

  const handleSelect = useCallback((item: SearchResultItem) => {
    router.push(item.url);
    close();
  }, [router, close]);

  // Handle keyboard list navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % Math.max(1, results.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + results.length) % Math.max(1, results.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[activeIndex]) {
          handleSelect(results[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, activeIndex, close, handleSelect]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9995] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-[2px]"
      />

      {/* Main Search Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[70vh]"
      >
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search properties, agents, customers... (Ctrl+K)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            className="flex-1 bg-transparent border-none text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Results Pane */}
        <div className="flex-1 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-muted-foreground text-[13px]">
              Type to start searching properties, agents, or customers...
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-[13px]">
              No results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex items-center gap-3 w-full p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <div className={`p-1.5 rounded-md flex-shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : 'bg-soft-primary text-primary'
                    }`}>
                      {item.type === 'property' && <Home className="h-4 w-4" />}
                      {item.type === 'agent' && <User className="h-4 w-4" />}
                      {item.type === 'customer' && <Users className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold truncate">{item.title}</p>
                      <p className={`text-[11px] truncate mt-0.5 ${
                        isActive ? 'text-white/80' : 'text-muted-foreground'
                      }`}>
                        {item.subtitle}
                      </p>
                    </div>
                    {isActive && (
                      <CornerDownLeft className="h-3.5 w-3.5 opacity-70" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-muted/30 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex gap-4">
            <span>
              <kbd className="border border-border bg-background px-1.5 py-0.5 rounded text-[10px]">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="border border-border bg-background px-1.5 py-0.5 rounded text-[10px]">↵</kbd> to select
            </span>
            <span>
              <kbd className="border border-border bg-background px-1.5 py-0.5 rounded text-[10px]">ESC</kbd> to close
            </span>
          </div>
          <span className="font-semibold select-none">waveron Search</span>
        </div>
      </motion.div>
    </div>
  );
};
