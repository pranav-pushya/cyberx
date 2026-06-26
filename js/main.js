// main.js — shared utilities

function initChips(containerSel, callback) {
  const chips = document.querySelectorAll(containerSel + ' .cx-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (callback) callback(chip.dataset.value || chip.textContent.trim(), chip);
    });
  });
}

function setOutput(elId, text, type) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.textContent = text;
  el.className = 'cx-output' + (type ? ' ' + type : '');
}

function setLoading(elId, topic) {
  setOutput(elId, '> ACCESSING ' + (topic || 'DATA').toUpperCase() + '...\n> Decrypting knowledge base...\n> Loading_', 'loading');
}

function setBtnState(btnId, disabled) {
  const btn = document.getElementById(btnId);
  if (btn) btn.disabled = disabled;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function safeParseJSON(text) {
  const clean = text.replace(/```json|```/g, '').trim();
  try { return JSON.parse(clean); } catch (_) {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (_) {} }
  return null;
}

const Stats = {
  get()    { try { return JSON.parse(localStorage.getItem('cx_stats') || '{}'); } catch { return {}; } },
  set(d)   { try { localStorage.setItem('cx_stats', JSON.stringify(d)); } catch {} },
  inc(key) { const s = this.get(); s[key] = (s[key] || 0) + 1; this.set(s); },
  val(key) { return this.get()[key] || 0; }
};
