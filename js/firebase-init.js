// js/firebase-init.js — CyberX Firebase & Offline Firestore initialization
const firebaseConfig = {
  projectId: "cyb-erx",
  appId: "1:813964126751:web:0e327896bb6830bda8432a",
  storageBucket: "cyb-erx.firebasestorage.app",
  apiKey: "AIzaSyCCl8V670s6GyabW5uExBaTK7NMvIcZWKQ",
  authDomain: "cyb-erx.firebaseapp.com",
  messagingSenderId: "813964126751",
  measurementId: "G-E7V2H2E2L2"
};

(function() {
  if (typeof firebase === 'undefined') return;

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  try {
    const db = firebase.firestore();
    // Enable multi-tab offline persistence in browser IndexedDB
    db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('[CyberX Firebase] Multi-tab persistence active in primary tab');
      } else if (err.code === 'unimplemented') {
        console.warn('[CyberX Firebase] Browser does not support IndexedDB persistence');
      }
    });

    window.cxDb = db;
    console.log('[CyberX Firebase] Offline Firestore initialized successfully');
  } catch (e) {
    console.warn('[CyberX Firebase] Firestore initialization skipped:', e);
  }
})();
