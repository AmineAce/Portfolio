import { animate } from 'motion';

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
  const styles = TOAST_STYLES[type];
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
    fontFamily: '"Geist Sans", ui-sans-serif, system-ui, sans-serif',
  });

  const msg = document.createElement('span');
  msg.textContent = message;
  toast.appendChild(msg);

  const close = document.createElement('button');
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
  close.addEventListener('click', () => dismiss(toast));
  toast.appendChild(close);

  container.appendChild(toast);

  (animate as any)(toast, { opacity: [0, 1], y: [-12, 0] }, { duration: 0.2, easing: [0.16, 1, 0.3, 1] });

  let timer = setTimeout(() => dismiss(toast), duration);

  toast.addEventListener('mouseenter', () => clearTimeout(timer));
  toast.addEventListener('mouseleave', () => {
    timer = setTimeout(() => dismiss(toast), duration);
  });
}

function dismiss(toast: HTMLElement) {
  if (!toast.isConnected) return;
  (animate as any)(toast, { opacity: [1, 0], y: [0, -8] }, { duration: 0.15, easing: [0.16, 1, 0.3, 1] }).finished.then(() => {
    toast.remove();
  });
}
