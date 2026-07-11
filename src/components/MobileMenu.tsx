import { useState, useEffect, useRef } from 'preact/hooks';

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  links: NavLink[];
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  function clearAnimTimeouts() {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }

  function open() {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setIsOpen(true);
    document.documentElement.style.overflow = 'hidden';

    if (panelRef.current && !prefersReducedMotion()) {
      const linkEls = panelRef.current.querySelectorAll<HTMLAnchorElement>('a');
      linkEls.forEach((link, i) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(12px)';
        const id = setTimeout(() => {
          link.style.opacity = '1';
          link.style.transform = 'translateY(0)';
        }, i * 60);
        timeoutsRef.current.push(id);
      });
    }
  }

  function close() {
    setIsOpen(false);
    document.documentElement.style.overflow = '';
    clearAnimTimeouts();

    if (panelRef.current) {
      if (prefersReducedMotion()) {
        panelRef.current.classList.add('hidden');
        const linkEls = panelRef.current.querySelectorAll<HTMLAnchorElement>('a');
        linkEls.forEach((link) => {
          link.style.opacity = '';
          link.style.transform = '';
        });
      } else {
        panelRef.current.style.opacity = '0';
        setTimeout(() => {
          if (!panelRef.current) return;
          panelRef.current.classList.add('hidden');
          panelRef.current.style.opacity = '';
          const linkEls = panelRef.current.querySelectorAll<HTMLAnchorElement>('a');
          linkEls.forEach((link) => {
            link.style.opacity = '';
            link.style.transform = '';
          });
        }, 200);
      }
    }

    requestAnimationFrame(() => {
      (previousFocusRef.current || toggleRef.current)?.focus();
      previousFocusRef.current = null;
    });
  }

  function onLinkClick() {
    setTimeout(close, 100);
  }

  useEffect(() => {
    if (!isOpen) return;

    // Focus first control inside the panel
    requestAnimationFrame(() => {
      closeBtnRef.current?.focus();
    });

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }

      if (e.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

      if (focusable.length === 0) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    return () => {
    document.documentElement.style.overflow = '';
      clearAnimTimeouts();
    };
  }, []);

  return (
    <>
      <button
        ref={toggleRef}
        id="menu-toggle"
        type="button"
        onClick={() => (isOpen ? close() : open())}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        class="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] gap-1 md:hidden focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 active:scale-95 transition-transform duration-micro"
      >
        <div
          data-bar="1"
          aria-hidden="true"
          class="h-[1.5px] w-[18px] bg-surface-400 transition-all duration-base ease-expo-out"
          style={isOpen ? { transform: 'translateY(5.5px) rotate(45deg)' } : undefined}
        />
        <div
          data-bar="2"
          aria-hidden="true"
          class="h-[1.5px] w-[18px] bg-surface-400 transition-all duration-base ease-expo-out"
          style={isOpen ? { opacity: 0 } : undefined}
        />
        <div
          data-bar="3"
          aria-hidden="true"
          class="h-[1.5px] w-[18px] bg-surface-400 transition-all duration-base ease-expo-out"
          style={isOpen ? { transform: 'translateY(-5.5px) rotate(-45deg)' } : undefined}
        />
      </button>

      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        hidden={!isOpen}
        class={`fixed inset-0 z-[60] flex-col bg-surface-950/95 backdrop-blur-xl ${isOpen ? 'flex' : 'hidden'}`}
        style="transition: opacity 0.2s ease-out;"
      >
        <div class="flex justify-end px-6 pt-6">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            class="min-w-[48px] min-h-[48px] text-surface-400 text-2xl leading-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            aria-label="Close navigation menu"
          >
            &times;
          </button>
        </div>
        <nav class="flex flex-1 flex-col items-center justify-center gap-8" aria-label="Mobile">
          {links.map((link) => (
            <a
              href={link.href}
              data-nav-link-mobile
              class="text-2xl text-surface-400 transition-all duration-base ease-expo-out hover:text-accent active:scale-95 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
              style="transition: opacity 0.25s ease-out, transform 0.25s ease-out;"
              onClick={onLinkClick}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
