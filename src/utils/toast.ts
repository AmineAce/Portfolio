type ToastType = 'error';

const TOAST_STYLES = {
  error: {
    bg: '#2d1114',
    border: '#7f1d1d',
    color: '#fca5a5',
  },
};

export function showToast(message: string, type: ToastType = 'error', duration = 5000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.setAttribute('aria-live', 'assertive');
    container.setAttribute('aria-relevant', 'additions text');
    container.setAttribute('aria-atomic', 'false');
    Object.assign(container.style, {
      position: 'fixed',
      top: '80px',
      right: '16px',
      zIndex: '9999',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      pointerEvents: 'none',
    });
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');

  const styles = TOAST_STYLES[type];
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Object.assign(toast.style, {
    pointerEvents: 'auto',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    lineHeight: '1.4',
    maxWidth: '360px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
    background: styles.bg,
    border: `1px solid ${styles.border}`,
    color: styles.color,
    fontFamily: 'var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif',
    transition: reduceMotion
      ? 'none'
      : 'opacity 0.25s ease-out, transform 0.25s ease-out',
    opacity: reduceMotion ? '1' : '0',
    transform: reduceMotion ? 'none' : 'translateY(-12px)',
  });

  const msg = document.createElement('span');
  msg.textContent = message;
  toast.appendChild(msg);

  const close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Dismiss notification');
  close.textContent = '×';
  Object.assign(close.style, {
    background: 'none',
    border: 'none',
    color: 'inherit',
    opacity: '0.6',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    lineHeight: '1',
    flexShrink: '0',
  });
  close.addEventListener('click', () => dismiss(toast, reduceMotion));
  toast.appendChild(close);

  container.appendChild(toast);

  if (!reduceMotion) {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
  }

  let timer = setTimeout(() => dismiss(toast, reduceMotion), duration);

  toast.addEventListener('mouseenter', () => clearTimeout(timer));
  toast.addEventListener('mouseleave', () => {
    timer = setTimeout(() => dismiss(toast, reduceMotion), duration);
  });
}

function dismiss(toast: HTMLElement, reduceMotion = false) {
  if (!toast.isConnected) return;
  if (reduceMotion) {
    toast.remove();
    return;
  }
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(-8px)';
  setTimeout(() => {
    toast.remove();
  }, 250);
}
