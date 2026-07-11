import { useState, useEffect, useRef } from 'preact/hooks';
import { slotText } from 'slot-text';
import { showToast } from '../utils/toast';

interface ContactFormProps {
  endpoint?: string;
}

export function ContactForm({ endpoint = '/api/contact' }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submitTextRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<ReturnType<typeof slotText> | null>(null);

  useEffect(() => {
    if (submitTextRef.current) {
      labelRef.current = slotText(submitTextRef.current, 'Send me your idea', {
        duration: 200, stagger: 30,
      });
    }
  }, []);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setLoading(true);
    labelRef.current?.set("Sending…", { direction: "up" });

    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('message', message);
    params.append('website', website);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        showToast('Server error. Please try again later.');
        setLoading(false);
        labelRef.current?.set("Send me your idea", { direction: "down" });
        return;
      }

      if (res.ok && data.success) {
        setSubmitted(true);
        setName('');
        setEmail('');
        setMessage('');
        setWebsite('');
        setLoading(false);
      } else {
        showToast(data.error || 'Something went wrong.');
        setLoading(false);
        labelRef.current?.set("Send me your idea", { direction: "down" });
      }
    } catch {
      showToast('Connection error. Check your internet and try again.');
      setLoading(false);
      labelRef.current?.set("Send me your idea", { direction: "down" });
    }
  }

  function handleResend() {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setWebsite('');
    labelRef.current?.set("Send me your idea", { direction: "down" });
  }

  if (submitted) {
    return (
      <div class="flex flex-col items-center justify-center flex-1 min-h-[300px]">
        <div class="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
          <span class="text-accent text-xl">&#10003;</span>
        </div>
        <p class="text-surface-200 text-lg font-medium mb-2">Message sent!</p>
        <p class="text-surface-500 text-sm mb-8">Thanks, I'll be in touch soon.</p>
        <button
          type="button"
          onClick={handleResend}
          class="rounded-input border border-surface-700 px-6 py-3 text-sm text-surface-400 transition-all duration-base hover:border-accent hover:text-accent hover:bg-accent/5 active:scale-95"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} class="text-left space-y-5">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onInput={(e) => setWebsite((e.target as HTMLInputElement).value)}
        class="absolute -left-[9999px] top-0 h-0 w-0 opacity-0 pointer-events-none overflow-hidden"
      />

      <div class="group">
        <label htmlFor="name" class="block text-xs text-surface-500 tracking-widest uppercase mb-2 transition-colors duration-micro group-focus-within:text-accent">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={name}
          onInput={(e) => setName((e.target as HTMLInputElement).value)}
          class="w-full bg-surface-950/60 border border-surface-700/60 rounded-input px-4 py-3 text-sm text-surface-200 placeholder-surface-600/60 outline-none transition-all duration-base ease-expo-out focus:border-accent/60 focus:bg-surface-950 focus:shadow-[0_0_24px_-12px] focus:shadow-accent/30"
          placeholder="Your name"
        />
      </div>

      <div class="group">
        <label htmlFor="email" class="block text-xs text-surface-500 tracking-widest uppercase mb-2 transition-colors duration-micro group-focus-within:text-accent">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={email}
          onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
          class="w-full bg-surface-950/60 border border-surface-700/60 rounded-input px-4 py-3 text-sm text-surface-200 placeholder-surface-600/60 outline-none transition-all duration-base ease-expo-out focus:border-accent/60 focus:bg-surface-950 focus:shadow-[0_0_24px_-12px] focus:shadow-accent/30"
          placeholder="your@email.com"
        />
      </div>

      <div class="group">
        <label htmlFor="message" class="block text-xs text-surface-500 tracking-widest uppercase mb-2 transition-colors duration-micro group-focus-within:text-accent">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={message}
          onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
          class="w-full bg-surface-950/60 border border-surface-700/60 rounded-input px-4 py-3 text-sm text-surface-200 placeholder-surface-600/60 outline-none transition-all duration-base ease-expo-out focus:border-accent/60 focus:bg-surface-950 focus:shadow-[0_0_24px_-12px] focus:shadow-accent/30 resize-none"
          placeholder="What's on your mind?"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        class="w-full rounded-input bg-surface-50 text-surface-950 font-medium px-6 py-3 text-sm border border-surface-50 transition-all duration-base ease-expo-out hover:bg-accent hover:text-surface-50 hover:border-accent hover:shadow-[0_0_28px_-10px] hover:shadow-accent/40 active:scale-95"
      >
        <span ref={submitTextRef}>Send me your idea</span>
        {loading && (
          <span
            class="inline-block w-[14px] h-[14px] border-2 border-current border-t-transparent rounded-full animate-spin align-middle mr-[6px]"
            style="animation-duration: 0.6s"
          />
        )}
      </button>
    </form>
  );
}
