import { useState, useEffect, useRef } from 'preact/hooks';

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  links: NavLink[];
}

export function MobileMenu({ links }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function open() {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';

    if (panelRef.current) {
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
    document.body.style.overflow = '';

    timeoutsRef.current.forEach(id => clearTimeout(id));
    timeoutsRef.current = [];

    if (panelRef.current) {
      panelRef.current.style.opacity = '0';
      setTimeout(() => {
        if (!panelRef.current) return;
        panelRef.current.classList.add('hidden');
        panelRef.current.style.opacity = '';
        const linkEls = panelRef.current.querySelectorAll<HTMLAnchorElement>('a');
        linkEls.forEach(link => {
          link.style.opacity = '';
          link.style.transform = '';
        });
      }, 200);
    }
  }

  function onLinkClick() {
    setTimeout(close, 100);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) close();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      timeoutsRef.current.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <>
      <button
        id="menu-toggle"
        onClick={() => (isOpen ? close() : open())}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        class="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] gap-1 md:hidden focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 active:scale-95 transition-transform duration-micro"
      >
        <div
          data-bar="1"
          class="h-[1.5px] w-[18px] bg-surface-400 transition-all duration-base ease-expo-out"
          style={isOpen ? { transform: 'translateY(5.5px) rotate(45deg)' } : undefined}
        />
        <div
          data-bar="2"
          class="h-[1.5px] w-[18px] bg-surface-400 transition-all duration-base ease-expo-out"
          style={isOpen ? { opacity: 0 } : undefined}
        />
        <div
          data-bar="3"
          class="h-[1.5px] w-[18px] bg-surface-400 transition-all duration-base ease-expo-out"
          style={isOpen ? { transform: 'translateY(-5.5px) rotate(-45deg)' } : undefined}
        />
      </button>

      <div
        ref={panelRef}
        id="mobile-menu"
        class={`fixed inset-0 z-[60] flex-col bg-surface-black/95 backdrop-blur-xl ${isOpen ? 'flex' : 'hidden'}`}
        style="transition: opacity 0.2s ease-out;"
      >
        <div class="flex justify-end px-6 pt-6">
          <button
            onClick={close}
            class="text-surface-400 text-2xl leading-none focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
            aria-label="Close navigation menu"
          >
            &times;
          </button>
        </div>
        <div class="flex flex-1 flex-col items-center justify-center gap-8">
          {links.map((link) => (
            <a
              href={link.href}
              data-nav-link-mobile
              class="text-2xl text-surface-400 transition-all duration-base ease-expo-out hover:text-accent active:scale-95"
              style="transition: opacity 0.25s ease-out, transform 0.25s ease-out;"
              onClick={onLinkClick}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
