import { useEffect, useRef } from 'preact/hooks';
import { slotText } from 'slot-text';

export function StatCounters() {
  const projectsRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rafIds: number[] = [];
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // -- Projects counter --
    if (projectsRef.current) {
      if (reduceMotion) {
        projectsRef.current.textContent = '3+';
      } else {
        const p = slotText(projectsRef.current, '0+', {
          duration: 150, stagger: 30, bounce: 0.5, interrupt: false,
        });
        [1, 2, 3].forEach((n, i) => {
          timeoutIds.push(setTimeout(() => p.set(n + '+', { direction: 'up' }), (i + 1) * 200));
        });
      }
    }

    return () => {
      rafIds.forEach(id => cancelAnimationFrame(id));
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <div
      class="flex gap-10 border-t border-surface-900 pt-10 mt-16 hero-animate"
      style="animation: hero-fade-up 0.4s ease-out 0.8s both;"
    >
      <div class="hero-animate" style="animation: hero-fade-up 0.35s ease-out 0s both;">
        <span ref={projectsRef} data-stat-to="3+" class="text-2xl font-medium tracking-tight text-surface-50">0+</span>
        <div class="mt-1 text-xs text-surface-500">Projects shipped</div>
      </div>
      <div class="hero-animate" style="animation: hero-fade-up 0.35s ease-out 0.08s both;">
        <span class="text-2xl font-medium tracking-tight text-surface-50">100</span>
        <div class="mt-1 text-xs text-surface-500">Lighthouse score</div>
      </div>
      <div class="hero-animate" style="animation: hero-fade-up 0.35s ease-out 0.16s both;">
        <span class="text-2xl font-medium tracking-tight text-surface-50">&#8734;</span>
        <div class="mt-1 text-xs text-surface-500">Attention to detail</div>
      </div>
    </div>
  );
}
