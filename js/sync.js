// js/sync.js — CyberX Real-Time Firestore Cloud Sync Engine (Laptop ⇄ Mobile)
const FIREBASE_CONFIG = {
  projectId: "cyb-erx",
  appId: "1:813964126751:web:0e327896bb6830bda8432a",
  storageBucket: "cyb-erx.firebasestorage.app",
  apiKey: "AIzaSyCCl8V670s6GyabW5uExBaTK7NMvIcZWKQ",
  authDomain: "cyb-erx.firebaseapp.com",
  messagingSenderId: "813964126751",
  measurementId: "G-E7V2H2E2L2"
};

(function() {
  let db = null;
  let isSyncing = false;
  let pendingSaveTimeout = null;

  function updateSyncIndicator(status, text) {
    const el = document.getElementById('sb-sync-status');
    const dot = document.getElementById('sb-sync-dot');
    const label = document.getElementById('sb-sync-text');
    if (!el || !dot || !label) return;

    if (status === 'online') {
      dot.className = 'sb-dot g';
      label.textContent = text || 'SYNC LIVE';
    } else if (status === 'syncing') {
      dot.className = 'sb-dot b';
      label.textContent = text || 'SYNCING...';
    } else if (status === 'offline') {
      dot.className = 'sb-dot r';
      label.textContent = text || 'OFFLINE';
    }
  }

  function injectSyncStatusBar() {
    const sb = document.querySelector('.status-bar');
    if (!sb || document.getElementById('sb-sync-status')) return;

    const item = document.createElement('div');
    item.className = 'sb-item';
    item.id = 'sb-sync-status';
    item.title = 'Real-time Firestore Cloud Sync';
    item.innerHTML = `<div class="sb-dot b" id="sb-sync-dot"></div><span id="sb-sync-text">INIT...</span>`;

    const clock = document.getElementById('sb-clock');
    if (clock) sb.insertBefore(item, clock);
    else sb.appendChild(item);
  }

  // Load Firebase SDKs dynamically if not already loaded
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function initFirebaseSync() {
    injectSyncStatusBar();

    if (typeof firebase === 'undefined') {
      try {
        await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
        await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js');
      } catch (err) {
        console.warn('[CyberX Sync] Failed to load Firebase SDK, operating in offline localStorage mode.');
        updateSyncIndicator('offline', 'LOCAL');
        return;
      }
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG);
      }
      db = firebase.firestore();

      // Enable IndexedDB offline persistence
      db.enablePersistence({ synchronizeTabs: true }).catch(() => {});

      window.cxDb = db;
      updateSyncIndicator('online', 'CLOUD LIVE');
      startRealtimeListener();
    } catch (e) {
      console.warn('[CyberX Sync] Firestore init warning:', e);
      updateSyncIndicator('offline', 'LOCAL ONLY');
    }
  }

  // Listen to remote changes on Firestore
  function startRealtimeListener() {
    if (!db) return;

    db.collection('cyberx_hub').doc('sync_data').onSnapshot((doc) => {
      if (!doc.exists) {
        // If first time, push local data to seed the cloud
        pushAllLocalToCloud();
        return;
      }

      const remote = doc.data();
      if (!remote) return;

      let changed = false;

      // Sync Notes
      if (remote.notes && JSON.stringify(remote.notes) !== localStorage.getItem('cx_notes')) {
        localStorage.setItem('cx_notes', JSON.stringify(remote.notes));
        changed = true;
      }

      // Sync Stats
      if (remote.stats && JSON.stringify(remote.stats) !== localStorage.getItem('cx_stats')) {
        localStorage.setItem('cx_stats', JSON.stringify(remote.stats));
        changed = true;
      }

      // Sync Streak
      if (remote.streak && String(remote.streak) !== localStorage.getItem('cx_streak')) {
        localStorage.setItem('cx_streak', String(remote.streak));
        changed = true;
      }

      // Sync Roadmap
      if (remote.roadmap && JSON.stringify(remote.roadmap) !== localStorage.getItem('cx_roadmap')) {
        localStorage.setItem('cx_roadmap', JSON.stringify(remote.roadmap));
        changed = true;
      }

      if (changed) {
        window.dispatchEvent(new CustomEvent('cx_sync_update', { detail: remote }));
      }

      updateSyncIndicator('online', 'SYNC LIVE');
    }, (err) => {
      console.warn('[CyberX Sync] Snapshot listener warning:', err);
      updateSyncIndicator('offline', 'OFFLINE');
    });
  }

  // Save specific data to cloud (debounced)
  function pushToCloud(key, value) {
    if (!db) return;
    updateSyncIndicator('syncing', 'SAVING...');

    clearTimeout(pendingSaveTimeout);
    pendingSaveTimeout = setTimeout(async () => {
      try {
        const payload = {
          last_updated: Date.now()
        };
        payload[key] = value;
        await db.collection('cyberx_hub').doc('sync_data').set(payload, { merge: true });
        updateSyncIndicator('online', 'SYNC LIVE');
      } catch (err) {
        console.warn('[CyberX Sync] Cloud push error:', err);
        updateSyncIndicator('offline', 'CACHED');
      }
    }, 400);
  }

  // Push all existing local data
  function pushAllLocalToCloud() {
    if (!db) return;
    try {
      const payload = {
        notes: JSON.parse(localStorage.getItem('cx_notes') || '[]'),
        stats: JSON.parse(localStorage.getItem('cx_stats') || '{}'),
        streak: parseInt(localStorage.getItem('cx_streak') || '1'),
        roadmap: JSON.parse(localStorage.getItem('cx_roadmap') || '{}'),
        last_updated: Date.now()
      };
      db.collection('cyberx_hub').doc('sync_data').set(payload, { merge: true });
    } catch (_) {}
  }

  window.cxCloudSync = {
    push: pushToCloud,
    pushAll: pushAllLocalToCloud
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebaseSync);
  } else {
    initFirebaseSync();
  }
})();
