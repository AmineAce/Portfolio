import { useEffect, useRef } from 'preact/hooks';
import { slotText } from 'slot-text';

export function StatCounters() {
  const projectsRef = useRef<HTMLSpanElement>(null);
  const lighthouseRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rafIds: number[] = [];
    const timeoutIds: ReturnType<typeof setTimeout>[] = [];

    // -- Projects counter --
    if (projectsRef.current) {
      const p = slotText(projectsRef.current, '0+', {
        duration: 150, stagger: 30, bounce: 0.5, interrupt: false,
      });
      [1, 2, 3].forEach((n, i) => {
        timeoutIds.push(setTimeout(() => p.set(n + '+', { direction: 'up' }), (i + 1) * 200));
      });
    }

    // -- Lighthouse counter --
    if (lighthouseRef.current) {
      const l = slotText(lighthouseRef.current, '0', {
        duration: 50, stagger: 10, bounce: 0.3, interrupt: false,
      });
      const start = performance.now();

      function phase1(now: number) {
        const elapsed = now - start;
        const t = Math.min(elapsed / 700, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        l.set(String(Math.round(82 * eased)), { direction: 'up' });

        if (t < 1) {
          rafIds.push(requestAnimationFrame(phase1));
        } else {
          const phase2Start = performance.now();
          function phase2(now: number) {
            const elapsed = now - phase2Start;
            const t = Math.min(elapsed / 900, 1);
            const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            l.set(String(Math.round(82 + 15 * eased)), { direction: 'up' });

            if (t < 1) {
              rafIds.push(requestAnimationFrame(phase2));
            } else {
              timeoutIds.push(setTimeout(() => l.set('98', { direction: 'up', duration: 120, stagger: 25 }), 80));
              timeoutIds.push(setTimeout(() => l.set('99', { direction: 'up', duration: 120, stagger: 25 }), 175));
              timeoutIds.push(setTimeout(() => l.set('100', { direction: 'up', duration: 120, stagger: 25 }), 270));
            }
          }
          rafIds.push(requestAnimationFrame(phase2));
        }
      }
      rafIds.push(requestAnimationFrame(phase1));
    }

    return () => {
      rafIds.forEach(id => cancelAnimationFrame(id));
      timeoutIds.forEach(id => clearTimeout(id));
    };
  }, []);

  return (
    <div
      class="flex gap-10 border-t border-surface-900 pt-10 mt-16"
      style="animation: hero-fade-up 0.4s ease-out 0.8s both;"
    >
      <div style="animation: hero-fade-up 0.35s ease-out 0s both;">
        <span ref={projectsRef} data-stat-to="3+" class="text-2xl font-medium tracking-tight text-surface-white">0+</span>
        <div class="mt-1 text-xs text-surface-500">Projects shipped</div>
      </div>
      <div style="animation: hero-fade-up 0.35s ease-out 0.08s both;">
        <span ref={lighthouseRef} data-stat-to="100" class="text-2xl font-medium tracking-tight text-surface-white">0</span>
        <div class="mt-1 text-xs text-surface-500">Lighthouse score</div>
      </div>
      <div style="animation: hero-fade-up 0.35s ease-out 0.16s both;">
        <span class="text-2xl font-medium tracking-tight text-surface-white">&#8734;</span>
        <div class="mt-1 text-xs text-surface-500">Attention to detail</div>
      </div>
    </div>
  );
}
