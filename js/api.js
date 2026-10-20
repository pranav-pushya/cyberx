// api.js — Groq API handler using .env via backend proxy / local server
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_DIRECT_URL = 'https://api.groq.com/openai/v1/chat/completions';
const LOCAL_PROXY_URL = '/api/groq';

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
 * Call Groq API via local server proxy (reads key from .env) or fallback
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

  // 1. Primary: Use local server proxy endpoint (reads .env directly)
  try {
    const res = await fetch(LOCAL_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      }
    } else {
      const err = await res.json().catch(() => ({}));
      if (err.error) throw new Error(err.error);
    }
  } catch (proxyErr) {
    if (proxyErr.message && proxyErr.message.includes('GROQ_API_KEY')) {
      throw proxyErr;
    }
    // If proxy unreachable (e.g. static file without server.js), try fallback below
  }

  // 2. Fallback: Check window.ENV_GROQ_API_KEY (from js/env.js) or localStorage
  const fallbackKey = (window.ENV_GROQ_API_KEY || localStorage.getItem('cx_groq_key') || '').trim();
  if (fallbackKey) {
    const res = await fetch(GROQ_DIRECT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + fallbackKey
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || 'API Error: ' + res.status);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  }

  throw new Error('GROQ_API_KEY is not defined in your .env file. Please add your key to .env and run "npm start".');
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
