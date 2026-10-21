// sync-env.js — automatically syncs .env to js/env.json for Firebase Hosting
const fs = require('fs');

if (fs.existsSync('.env')) {
  let apiKey = '';
  let model = 'llama-3.3-70b-versatile';
  const lines = fs.readFileSync('.env', 'utf-8').split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (m) {
      const k = m[1];
      let v = (m[2] || '').trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (k === 'GROQ_API_KEY') apiKey = v;
      if (k === 'GROQ_MODEL') model = v;
    }
  }

  if (apiKey) {
    fs.writeFileSync('js/env.json', JSON.stringify({ GROQ_API_KEY: apiKey, GROQ_MODEL: model }, null, 2));
    console.log('[CyberX] Successfully synced .env -> js/env.json');
  } else {
    console.warn('[CyberX] Warning: GROQ_API_KEY not found in .env');
  }
} else {
  console.warn('[CyberX] .env file does not exist');
}
