import { Resend } from 'resend';

// In-memory rate limit — best-effort on serverless. Vercel can scale to
// concurrent instances, each with its own Map. For a portfolio contact form
// this is acceptable; the origin check + honeypot handle the rest.
const rateLimitStore = new Map();
const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 60 * 1000;
const EMAIL_REGEX = /^(?!.*\.\.)(?!\.)(?!.*\.@)[^\s@]+@[^\s@]+\.[^\s@]+$/;


function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  return (forwarded && forwarded.split(',')[0].trim()) || 'unknown';
}

function parseFormData(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString();
      const params = new URLSearchParams(raw);
      const data = {};
      for (const [key, value] of params) {
        data[key] = value;
      }
      resolve(data);
    });
  });
}

function send(res, status, body, extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': 'https://aemine.vercel.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    send(res, 405, { error: 'Method not allowed.' });
    return;
  }

  const origin = req.headers['origin'];
  const referer = req.headers['referer'];
  if (origin || referer) {
    const allowed = ['https://aemine.vercel.app', 'http://localhost:4321'];
    const matchOrigin = origin && allowed.some((a) => origin === a);
    const matchReferer = referer && allowed.some((a) => referer.startsWith(a));
    if (!matchOrigin && !matchReferer) {
      send(res, 403, { error: 'Forbidden.' });
      return;
    }
  }

    for (const [ip, entry] of rateLimitStore) {
      if (entry.resetTime <= Date.now()) rateLimitStore.delete(ip);
    }

  const ip = getClientIP(req);
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (entry && now < entry.resetTime) {
    if (entry.count >= MAX_REQUESTS) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      send(res, 429, { error: 'Too many requests. Please try again later.' }, {
        'Retry-After': String(retryAfter),
      });
      return;
    }
    entry.count++;
  } else {
    rateLimitStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const data = await parseFormData(req);

    const honeypot = (data.website || '').trim();
    if (honeypot) {
      send(res, 200, { success: true });
      return;
    }

    const name = (data.name || '').trim();
    const email = (data.email || '').trim();
    const message = (data.message || '').trim();

    if (name.length < 2 || name.length > 100) {
      send(res, 400, { error: 'Name must be between 2 and 100 characters.' });
      return;
    }

    if (email.length < 5 || email.length > 254) {
      send(res, 400, { error: 'Email must be between 5 and 254 characters.' });
      return;
    }

    if (message.length < 10 || message.length > 2000) {
      send(res, 400, { error: 'Message must be between 10 and 2000 characters.' });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      send(res, 400, { error: 'Please provide a valid email address.' });
      return;
    }

    const sanitize = (input) =>
      input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');

    const cleanName = sanitize(name);
    const cleanMessage = sanitize(message);

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'aturserviceassassin@gmail.com',
      replyTo: email,
      subject: `Portfolio message from ${cleanName}`,
      text: `Name: ${cleanName}\nEmail: ${email}\n\nMessage:\n${cleanMessage}`,
    });

    if (error) {
      send(res, 500, { error: 'Failed to send message. Please try again later.' });
      return;
    }

    send(res, 200, { success: true });
  } catch {
    send(res, 500, { error: 'Something went wrong. Please try again later.' });
  }
  }
