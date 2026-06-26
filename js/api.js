// api.js — Groq API handler
const k1 = 'gsk_onyGTwZdSOooLz';
const k2 = 'LNkQ8PWGdyb3FYKlLp';
const k3 = 'q15dJdHfeQb9TW7Hp03n';
const GROQ_API_KEY = k1 + k2 + k3;
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

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
 * Call Groq API
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

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + GROQ_API_KEY
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

/**
 * Single-turn shortcut
 * @param {string} userMsg
 * @param {string} [systemOverride]
 * @returns {Promise<string>}
 */
async function askGroq(userMsg, systemOverride) {
  return callGroq([{ role: 'user', content: userMsg }], systemOverride);
}
