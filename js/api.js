// api.js — Groq API handler using .env via backend proxy / local server / Firebase Hosting
let GROQ_MODEL = 'openai/gpt-oss-120b';
const GROQ_DIRECT_URL = 'https://api.groq.com/openai/v1/chat/completions';
const LOCAL_PROXY_URL = '/api/groq';

let cachedApiKey = '';

async function resolveGroqKey() {
  if (cachedApiKey) return cachedApiKey;

  // 1. Check window global
  if (window.ENV_GROQ_API_KEY) {
    cachedApiKey = window.ENV_GROQ_API_KEY.trim();
    return cachedApiKey;
  }

  // 2. Check localStorage
  const localKey = (localStorage.getItem('cx_groq_key') || '').trim();
  if (localKey) {
    cachedApiKey = localKey;
    return cachedApiKey;
  }

  // 3. Try loading /js/env.json (synced from .env for Firebase Hosting)
  const paths = ['/js/env.json?t=' + Date.now(), 'js/env.json?t=' + Date.now(), '/js/env.json', 'js/env.json'];
  for (const p of paths) {
    try {
      const res = await fetch(p, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.GROQ_MODEL) GROQ_MODEL = data.GROQ_MODEL;
        if (data.GROQ_API_KEY) {
          cachedApiKey = data.GROQ_API_KEY.trim();
          return cachedApiKey;
        }
      }
    } catch (_) {}
  }

  return '';
}

const SYSTEM_PROMPT = `You are CyberX AI — a senior penetration tester and cybersecurity mentor with 15 years of experience.
You teach like a no-nonsense hacker: direct, technical, practical, zero fluff.
The user is a 1st-year CSE (AI/ML) student at Chitkara University, Punjab, learning cybersecurity from scratch.
They want to build real knowledge AND sound impressive to peers.

Rules:
- Use → for bullet points
- Use [SECTION] headers in ALL CAPS for structure
- Be dense and informative, not verbose
- Include real commands, tools, examples where relevant
- Always emphasize ethical/legal use briefly
- Calibrate depth: explain jargon, use analogies
- Keep responses under 450 words unless asked for more
- Occasionally drop a "pro hacker insight" that sounds impressive`;

/**
 * Call Groq API via local server proxy (reads key from .env) or Firebase Hosting direct call
 * @param {Array} messages - [{role, content}, ...]
 * @param {string} [systemOverride] - optional system prompt override
 * @returns {Promise<string>}
 */
async function callGroq(messages, systemOverride) {
  const system = systemOverride || SYSTEM_PROMPT;

  const payload = {
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: system },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 800,
    stream: false
  };

  // 1. Primary: Use local server proxy endpoint if running locally with server.js
  try {
    const res = await fetch(LOCAL_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        try { if (window.Stats) window.Stats.inc('ai_queries'); } catch (_) {}
        return data.choices[0].message.content;
      }
    }
  } catch (_) {
    // Local proxy unreachable (e.g. running on Firebase Hosting), fallback to direct call
  }

  // 2. Direct Groq API call using key from js/env.json (Firebase Hosting) or fallback
  const apiKey = await resolveGroqKey();
  if (apiKey) {
    const res = await fetch(GROQ_DIRECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'API Error: ' + res.status);
    }
    const data = await res.json();
    try { if (window.Stats) window.Stats.inc('ai_queries'); } catch (_) {}
    return data.choices[0].message.content;
  }

  throw new Error('GROQ_API_KEY is not defined in your .env file. Please check .env and run "npm run deploy".');
}

/**
 * Single-turn shortcut
 * @param {string} userMsg
 * @param {string} [systemOverride]
 * @returns {Promise<string>}
 */
async function askGroq(userMsg, systemOverride) {
  return callGroq([{ role: 'user', content: userMsg }], systemOverride);
}
