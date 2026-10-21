// main.js — shared utilities

/* ════════════ THEME ENGINE ════════════ */
(function() {
  function applyTheme() {
    if (localStorage.getItem('cx_theme') === 'glass') {
      document.body.classList.add('glass-theme');
    } else {
      document.body.classList.remove('glass-theme');
    }
  }
  applyTheme();

  function initLogoTrigger() {
    const centerLogo = document.querySelector('.hero-title');
    if (centerLogo) {
      centerLogo.style.pointerEvents = 'auto';
      centerLogo.style.cursor = 'default';
      centerLogo.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const isGlass = document.body.classList.toggle('glass-theme');
        localStorage.setItem('cx_theme', isGlass ? 'glass' : 'default');
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogoTrigger);
  } else {
    initLogoTrigger();
  }
})();

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
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
window.escHtml = escHtml;
window.escapeHTML = escHtml; // Global backward compatibility alias

function safeParseJSON(text) {
  const clean = text.replace(/```json|```/g, '').trim();
  try { return JSON.parse(clean); } catch (_) {}
  const m = clean.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (_) {} }
  return null;
}

const Stats = {
  get()    { try { return JSON.parse(localStorage.getItem('cx_stats') || '{}'); } catch { return {}; } },
  set(d)   { 
    try { localStorage.setItem('cx_stats', JSON.stringify(d)); } catch {}
    if (window.cxCloudSync) window.cxCloudSync.push('stats', d);
  },
  inc(key) { const s = this.get(); s[key] = (s[key] || 0) + 1; this.set(s); },
  val(key) { return this.get()[key] || 0; }
};

/* ════════════ CLOUD SYNC UI RE-RENDER LISTENER ════════════ */
window.addEventListener('cx_sync_update', () => {
  if (typeof loadNotes === 'function' && typeof renderNotesList === 'function') {
    loadNotes();
    renderNotesList();
  }
  if (typeof updateProgress === 'function') {
    updateProgress();
  }
  if (typeof updateScore === 'function') {
    updateScore();
  }
});

/* ════════════ VISIT STREAK TRACKER ════════════ */
(function(){
  const today = new Date();
  today.setHours(0,0,0,0);
  const todayStr = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate();
  const lastVisitStr = localStorage.getItem('cx_last_visit');
  let streak = parseInt(localStorage.getItem('cx_streak') || '0');

  if(lastVisitStr === todayStr){
    // Already visited today — no change
  } else if(lastVisitStr){
    const parts = lastVisitStr.split('-');
    const last = new Date(parts[0], parts[1]-1, parts[2]);
    last.setHours(0,0,0,0);
    const diffTime = Math.abs(today - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if(diffDays === 1){
      streak += 1; // consecutive day
    } else {
      streak = 1;  // streak broken
    }
  } else {
    streak = 1; // first visit ever
  }

  localStorage.setItem('cx_last_visit', todayStr);
  localStorage.setItem('cx_streak', String(streak));
})();

/* ════════════ PWA SERVICE WORKER & INSTALL PROMPT ════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then((reg) => {
      // Force update check
      reg.update().catch(() => {});
    }).catch(() => {});
  });
}

/* ════════════ DYNAMIC CLOUD SYNC SCRIPT LOADER ════════════ */
(function() {
  if (!document.getElementById('cx-sync-script')) {
    const s = document.createElement('script');
    s.id = 'cx-sync-script';
    s.src = '/js/sync.js';
    document.head.appendChild(s);
  }
})();

let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;
  
  const sb = document.querySelector('.status-bar');
  if (sb && !document.getElementById('sb-install-btn')) {
    const btn = document.createElement('button');
    btn.id = 'sb-install-btn';
    btn.className = 'sb-item';
    btn.style.cssText = 'cursor:pointer;background:rgba(0,255,65,0.12);border:1px solid var(--g,#00ff41);color:var(--g,#00ff41);font-family:var(--hud,monospace);font-size:9px;padding:3px 8px;border-radius:2px;letter-spacing:1px;margin-right:8px;';
    btn.innerHTML = '📲 INSTALL';
    btn.onclick = async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        const { outcome } = await deferredInstallPrompt.userChoice;
        if (outcome === 'accepted') {
          btn.style.display = 'none';
        }
        deferredInstallPrompt = null;
      }
    };
    const clock = document.getElementById('sb-clock');
    if (clock) {
      sb.insertBefore(btn, clock);
    } else {
      sb.appendChild(btn);
    }
  }
});

