import { animate, inView } from 'motion';

type RevealStep = {
  selector: string;
  /** y offset for slide-up (default 24) */
  y?: number;
  /** animation duration in seconds (default 0.55) */
  duration?: number;
  /** per-element delay override (default 0) */
  delay?: number;
  /** stagger between consecutive matches of the same selector (default 0.1) */
  stagger?: number;
  /** custom easing curve (default [0.16, 1, 0.3, 1]) */
  easing?: number[];
  /** inView threshold 0-1, only applies in scroll mode (default 0.15) */
  threshold?: number;
  /** 'scroll' = animate when scrolled into view, 'immediate' = animate on DOM ready */
  mode?: 'scroll' | 'immediate';
};

type RevealConfig = {
  steps: RevealStep[];
};

const DEFAULTS = {
  y: 24,
  duration: 0.55,
  delay: 0,
  stagger: 0.1,
  easing: [0.16, 1, 0.3, 1] as [number, number, number, number],
  threshold: 0.15,
  mode: 'scroll' as 'scroll' | 'immediate',
};

function getFlag(id: string): boolean {
  const key = `__reveal_${id}`;
  if ((window as any)[key]) return true;
  (window as any)[key] = true;
  return false;
}

export function setupReveal(config: RevealConfig, id: string) {
  if (getFlag(id)) return;

  const run = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      config.steps.forEach((step) => {
        document.querySelectorAll(step.selector).forEach((el) => {
          const htmlEl = el as HTMLElement;
          htmlEl.style.opacity = '1';
          htmlEl.style.transform = 'none';
        });
      });
      return;
    }

    config.steps.forEach((step) => {
      const y = step.y ?? DEFAULTS.y;
      const duration = step.duration ?? DEFAULTS.duration;
      const easing = step.easing ?? DEFAULTS.easing;
      const stagger = step.stagger ?? DEFAULTS.stagger;
      const threshold = step.threshold ?? DEFAULTS.threshold;
      const mode = step.mode ?? DEFAULTS.mode;

      const elements = document.querySelectorAll(step.selector) as NodeListOf<HTMLElement>;
      if (!elements.length) return;

      if (mode === 'immediate') {
        elements.forEach((el) => {
          (animate as any)(
            el,
            { opacity: [0, 1], y: [y, 0] },
            { duration, delay: step.delay ?? DEFAULTS.delay, easing }
          );
        });
      } else {
        elements.forEach((el, i) => {
          inView(
            el,
            () => {
              (animate as any)(
                el,
                { opacity: [0, 1], y: [y, 0] },
                { duration, delay: (step.delay ?? DEFAULTS.delay) + i * stagger, easing }
              );
            },
            { threshold } as any
          );
        });
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  document.addEventListener('astro:page-load', run);
}
