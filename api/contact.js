import { Resend } from 'resend';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const MAX_BODY_BYTES = 8 * 1024; // 8 KB — contact form is small
const MAX_REQUESTS = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const EMAIL_REGEX =
  /^(?!.*\.\.)(?!\.)(?!.*\.@)[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** In-memory fallback for local dev when Upstash is not configured. */
const memoryStore = new Map();

let upstashLimiter = null;
function getUpstashLimiter() {
  if (upstashLimiter) return upstashLimiter;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  upstashLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(MAX_REQUESTS, '1 h'),
    prefix: 'portfolio:contact',
    analytics: false,
  });
  return upstashLimiter;
}

function getAllowedOrigins() {
  const origins = new Set([
    'https://aemine.vercel.app',
    'http://localhost:4321',
    'http://127.0.0.1:4321',
  ]);

  // Current Vercel deployment URL (preview + production)
  if (process.env.VERCEL_URL) {
    origins.add(`https://${process.env.VERCEL_URL}`);
  }

  // Optional comma-separated list (custom domains, extra previews)
  const extra = process.env.ALLOWED_ORIGINS;
  if (extra) {
    for (const o of extra.split(',')) {
      const trimmed = o.trim();
      if (trimmed) origins.add(trimmed);
    }
  }

  return origins;
}

function isAllowedOrigin(value, allowed) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return allowed.has(url.origin);
  } catch {
    return false;
  }
}

/**
 * Strict origin gate: at least one of Origin/Referer must be present
 * AND match an allowed origin. Missing both headers is rejected
 * (blocks curl/script spam that omits browser headers).
 */
function assertAllowedRequest(req) {
  const allowed = getAllowedOrigins();
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];

  if (isAllowedOrigin(origin, allowed)) {
    return { ok: true, allowOrigin: new URL(origin).origin };
  }
  if (isAllowedOrigin(referer, allowed)) {
    return { ok: true, allowOrigin: new URL(referer).origin };
  }
  return { ok: false };
}

function getClientIP(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim() || 'unknown';
  }
  return (
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/** Strip CR/LF/NUL so values cannot inject email headers. */
function stripHeaderUnsafe(input) {
  return String(input).replace(/[\r\n\0]/g, '').trim();
}

function parseFormData(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let settled = false;

    const fail = (status, message) => {
      if (settled) return;
      settled = true;
      req.removeAllListeners('data');
      req.removeAllListeners('end');
      req.removeAllListeners('error');
      // Drain remaining data so the socket can close cleanly
      req.resume();
      reject(Object.assign(new Error(message), { status }));
    };

    req.on('data', (chunk) => {
      total += chunk.length;
      if (total > MAX_BODY_BYTES) {
        fail(413, 'Request body too large.');
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (settled) return;
      settled = true;
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        const params = new URLSearchParams(raw);
        const data = {};
        for (const [key, value] of params) {
          data[key] = value;
        }
        resolve(data);
      } catch {
        reject(Object.assign(new Error('Invalid form body.'), { status: 400 }));
      }
    });

    req.on('error', () => {
      fail(400, 'Failed to read request body.');
    });
  });
}

function send(res, status, body, extraHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...extraHeaders };
  res.writeHead(status, headers);
  res.end(JSON.stringify(body));
}

function corsHeaders(allowOrigin) {
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

async function checkRateLimit(ip) {
  const limiter = getUpstashLimiter();

  if (limiter) {
    const result = await limiter.limit(ip);
    if (!result.success) {
      const retryAfter = Math.max(
        1,
        Math.ceil((result.reset - Date.now()) / 1000),
      );
      return { allowed: false, retryAfter };
    }
    return { allowed: true };
  }

  // Dev / misconfigured production: best-effort in-memory (per instance)
  if (process.env.VERCEL_ENV === 'production') {
    console.warn(
      '[contact] UPSTASH_REDIS_REST_URL/TOKEN not set — using in-memory rate limit (not durable across instances).',
    );
  }

  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (entry.resetTime <= now) memoryStore.delete(key);
  }

  const entry = memoryStore.get(ip);
  if (entry && now < entry.resetTime) {
    if (entry.count >= MAX_REQUESTS) {
      return {
        allowed: false,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      };
    }
    entry.count += 1;
  } else {
    memoryStore.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  }
  return { allowed: true };
}

export default async function handler(req, res) {
  const gate = assertAllowedRequest(req);

  if (req.method === 'OPTIONS') {
    if (!gate.ok) {
      send(res, 403, { error: 'Forbidden.' });
      return;
    }
    res.writeHead(204, corsHeaders(gate.allowOrigin));
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    send(res, 405, { error: 'Method not allowed.' });
    return;
  }

  if (!gate.ok) {
    send(res, 403, { error: 'Forbidden.' });
    return;
  }

  const cors = corsHeaders(gate.allowOrigin);

  const apiKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_TO;
  const resendFrom = process.env.RESEND_FROM;

  if (!apiKey || !contactTo || !resendFrom) {
    console.error(
      '[contact] Missing required env: RESEND_API_KEY, CONTACT_TO, and/or RESEND_FROM',
    );
    send(res, 500, { error: 'Contact form is not configured.' }, cors);
    return;
  }

  try {
    const data = await parseFormData(req);

    // Honeypot: pretend success, do not rate-limit or send mail
    const honeypot = (data.website || '').trim();
    if (honeypot) {
      send(res, 200, { success: true }, cors);
      return;
    }

    const name = stripHeaderUnsafe(data.name || '');
    const email = stripHeaderUnsafe(data.email || '');
    const message = stripHeaderUnsafe(data.message || '');

    if (name.length < 2 || name.length > 100) {
      send(
        res,
        400,
        { error: 'Name must be between 2 and 100 characters.' },
        cors,
      );
      return;
    }

    if (email.length < 5 || email.length > 254) {
      send(
        res,
        400,
        { error: 'Email must be between 5 and 254 characters.' },
        cors,
      );
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      send(res, 400, { error: 'Please provide a valid email address.' }, cors);
      return;
    }

    if (message.length < 10 || message.length > 2000) {
      send(
        res,
        400,
        { error: 'Message must be between 10 and 2000 characters.' },
        cors,
      );
      return;
    }

    // Rate-limit only after honeypot + validation (real submission attempts)
    const ip = getClientIP(req);
    const limit = await checkRateLimit(ip);
    if (!limit.allowed) {
      send(
        res,
        429,
        { error: 'Too many requests. Please try again later.' },
        { ...cors, 'Retry-After': String(limit.retryAfter || 3600) },
      );
      return;
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: resendFrom,
      to: contactTo,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      send(
        res,
        500,
        { error: 'Failed to send message. Please try again later.' },
        cors,
      );
      return;
    }

    send(res, 200, { success: true }, cors);
  } catch (err) {
    const status = err?.status || 500;
    const message =
      status === 413
        ? 'Request body too large.'
        : status === 400
          ? err.message || 'Bad request.'
          : 'Something went wrong. Please try again later.';
    if (status >= 500) {
      console.error('[contact] Handler error:', err);
    }
    send(res, status, { error: message }, cors);
  }
}
