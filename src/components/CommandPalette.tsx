import { useState, useEffect, useRef } from 'preact/hooks';

interface Command {
  id: string;
  label: string;
  keywords: string;
  icon: string;
  action: 'section' | 'external' | 'function';
  value: string;
}

const COMMANDS: Command[] = [
  { id: 'work',    label: 'Scroll to Work',    keywords: 'projects, portfolio',      icon: '\u2192', action: 'section',  value: 'work' },
  { id: 'about',   label: 'Scroll to About',   keywords: 'bio, info',                icon: '\u2192', action: 'section',  value: 'about' },
  { id: 'faq',     label: 'Open FAQ',          keywords: 'questions, help',          icon: '\u2192', action: 'external', value: '/faq' },
  { id: 'contact', label: 'Scroll to Contact', keywords: 'email, message, reach',    icon: '\u2192', action: 'section',  value: 'contact' },
  { id: 'github',  label: 'Open GitHub',       keywords: 'gh, repo, source, code',   icon: '\u2192', action: 'external', value: 'https://github.com/AmineAce' },
  { id: 'top',     label: 'Scroll to Top',     keywords: 'top, start, home, up',     icon: '\u2191', action: 'function', value: 'scrollTop' },
];

function fuzzyScore(query: string, text: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let qi = 0;
  let prev = -1;
  let gaps = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) {
      if (prev >= 0) gaps += i - prev - 1;
      prev = i;
      qi++;
    }
  }
  if (qi < q.length) return 0;
  if (t.length === 0) return 0;
  return (qi / t.length) - (gaps / t.length);
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const filtered = query
    ? COMMANDS
        .map(c => ({ cmd: c, score: fuzzyScore(query, c.label + ' ' + c.keywords) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(x => x.cmd)
    : COMMANDS;

  function open() {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }

  function close() {
    previousFocusRef.current?.focus();
    previousFocusRef.current = null;
    setIsOpen(false);
    setQuery('');
  }

  function run(cmd: Command) {
    close();
    setTimeout(() => {
      if (cmd.action === 'section') {
        const el = document.getElementById(cmd.value);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (cmd.action === 'external') {
        if (cmd.value.startsWith('/')) {
          location.href = cmd.value;
        } else {
          window.open(cmd.value, '_blank');
        }
      } else if (cmd.action === 'function' && cmd.value === 'scrollTop') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        open();
      }
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) run(filtered[selectedIndex]);
    }
  }

  return (
    <>
      <button
        onClick={open}
        aria-label="Open command palette"
        class="fixed bottom-4 left-4 z-[99] rounded-pill border border-surface-700 bg-surface-900/80 backdrop-blur-sm px-3 py-1.5 text-xs text-surface-400 transition-all duration-base ease-expo-out hover:border-accent hover:text-accent hover:bg-accent/5 active:scale-95"
      >
        {'\u2318K'}
      </button>

      {isOpen && (
        <div
          class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-surface-black/60 backdrop-blur-sm"
          onClick={close}
        >
          <div
            class="w-full max-w-md bg-surface-900 border border-surface-800 rounded-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="px-4 pt-4 pb-3">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onInput={(e) => {
                  setQuery((e.target as HTMLInputElement).value);
                  setSelectedIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Type a command\u2026"
                class="w-full bg-surface-950/60 border border-surface-700/60 rounded-input px-4 py-2.5 text-sm text-surface-200 placeholder-surface-600/60 outline-none transition-all duration-base ease-expo-out focus:border-accent/60 focus:bg-surface-950 focus:shadow-[0_0_24px_-12px] focus:shadow-accent/30"
              />
            </div>

            <div class="max-h-64 overflow-y-auto pb-2">
              {filtered.length === 0 && (
                <div class="px-4 py-6 text-center text-xs text-surface-500">No results found</div>
              )}
              {filtered.map((cmd, i) => (
                <div
                  key={cmd.id}
                  onClick={() => run(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  class={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-micro ${
                    i === selectedIndex
                      ? 'bg-accent-dim text-accent'
                      : 'text-surface-400 hover:bg-surface-800/60'
                  }`}
                >
                  <span class="w-4 text-center flex-shrink-0">{cmd.icon}</span>
                  <span>{cmd.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
