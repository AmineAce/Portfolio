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

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

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

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const filtered = query
    ? COMMANDS
        .map(c => ({ cmd: c, score: fuzzyScore(query, c.label + ' ' + c.keywords) }))
        .filter(x => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(x => x.cmd)
    : COMMANDS;

  const activeOptionId =
    filtered[selectedIndex] != null
      ? `command-option-${filtered[selectedIndex].id}`
      : undefined;

  function open() {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
    setQuery('');
    setSelectedIndex(0);
  }

  function close() {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
    // Restore focus after paint so the dialog is gone first
    requestAnimationFrame(() => {
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    });
  }

  function run(cmd: Command) {
    close();
    const smooth = !prefersReducedMotion();
    setTimeout(() => {
      if (cmd.action === 'section') {
        const el = document.getElementById(cmd.value);
        if (el) el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
      } else if (cmd.action === 'external') {
        if (cmd.value.startsWith('/')) {
          location.href = cmd.value;
        } else {
          window.open(cmd.value, '_blank', 'noopener,noreferrer');
        }
      } else if (cmd.action === 'function' && cmd.value === 'scrollTop') {
        window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
      }
    }, 100);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) close();
        else open();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const t = setTimeout(() => inputRef.current?.focus(), 0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onDocKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => !el.hasAttribute('disabled') && el.offsetParent !== null);

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onDocKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onDocKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Keep selected option in view for keyboard users
  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[selectedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, isOpen, filtered]);

  function onInputKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) run(filtered[selectedIndex]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSelectedIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSelectedIndex(Math.max(filtered.length - 1, 0));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="command-palette-dialog"
        aria-label="Open command palette"
        class="fixed top-0 mt-4 z-[99] rounded-pill border border-surface-700/60 bg-surface-900/40 backdrop-blur-sm px-3 py-1.5 text-xs text-surface-400 transition-all duration-base ease-expo-out hover:border-accent hover:text-accent hover:bg-accent/15 active:scale-95 hidden md:block"
        style="right: max(1.5rem, calc((100vw - 1100px) / 2 + 24px));"
      >
        {'\u2318K'}
      </button>

      {isOpen && (
        <div
          class="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-surface-950/60 backdrop-blur-sm"
          onClick={close}
        >
          <div
            ref={dialogRef}
            id="command-palette-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            class="w-full max-w-md bg-surface-900 border border-surface-800 rounded-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="px-4 pt-4 pb-3">
              <label htmlFor="command-palette-input" class="sr-only">
                Search commands
              </label>
              <input
                ref={inputRef}
                id="command-palette-input"
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-palette-listbox"
                aria-autocomplete="list"
                aria-activedescendant={activeOptionId}
                value={query}
                onInput={(e) => {
                  setQuery((e.target as HTMLInputElement).value);
                  setSelectedIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Type a command\u2026"
                class="w-full bg-surface-950/60 border border-surface-700/60 rounded-input px-4 py-2.5 text-sm text-surface-200 placeholder-surface-600/60 outline-none transition-all duration-base ease-expo-out focus:border-accent/60 focus:bg-surface-950 focus:shadow-[0_0_24px_-12px] focus:shadow-accent/30"
              />
            </div>

            <div
              ref={listRef}
              id="command-palette-listbox"
              role="listbox"
              aria-label="Commands"
              class="max-h-64 overflow-y-auto pb-2"
            >
              {filtered.length === 0 && (
                <div class="px-4 py-6 text-center text-xs text-surface-500" role="status">
                  No results found
                </div>
              )}
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  type="button"
                  id={`command-option-${cmd.id}`}
                  role="option"
                  aria-selected={i === selectedIndex}
                  onClick={() => run(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  class={`flex w-full items-center gap-3 px-4 py-2.5 text-sm text-left cursor-pointer transition-colors duration-micro ${
                    i === selectedIndex
                      ? 'bg-accent-dim text-accent'
                      : 'text-surface-400 hover:bg-surface-800/60'
                  }`}
                >
                  <span class="w-4 text-center flex-shrink-0" aria-hidden="true">
                    {cmd.icon}
                  </span>
                  <span>{cmd.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
