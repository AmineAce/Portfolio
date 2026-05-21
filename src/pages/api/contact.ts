import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 60 * 1000;
const EMAIL_REGEX = /^(?!.*\.\.)(?!\.)(?!.*\.@)[^\s@]+@[^\s@]+\.[^\s@]+$/;

let cleanupCounter = 0;

function getClientIP(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export const OPTIONS: APIRoute = async () => {
  return new Response(null, { status: 204 });
};

export const POST: APIRoute = async ({ request }) => {
  cleanupCounter++;
  if (cleanupCounter >= 10) {
    cleanupCounter = 0;
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore) {
      if (entry.resetTime <= now) {
        rateLimitStore.delete(ip);
      }
    }
  }

  const ip = getClientIP(request);
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (entry && now < entry.resetTime) {
    if (entry.count >= MAX_REQUESTS) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter),
          },
        }
      );
    }
    entry.count++;
  } else {
    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  try {
    const formData = await request.formData();

    const honeypot = formData.get('website')?.toString().trim() || '';
    if (honeypot) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const name = formData.get('name')?.toString().trim() || '';
    const email = formData.get('email')?.toString().trim() || '';
    const message = formData.get('message')?.toString().trim() || '';

    if (name.length < 2 || name.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Name must be between 2 and 100 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (email.length < 5 || email.length > 254) {
      return new Response(
        JSON.stringify({ error: 'Email must be between 5 and 254 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (message.length < 10 || message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message must be between 10 and 2000 characters.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sanitizeInput = (input: string): string =>
      input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');

    const cleanName = sanitizeInput(name);
    const cleanMessage = sanitizeInput(message);

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'aturserviceassassin@gmail.com',
      replyTo: email,
      subject: `Portfolio message from ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${email}\n\nMessage:\n${cleanMessage}`,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to send message. Please try again later.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again later.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
