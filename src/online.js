// Placar mundial do Big Stack (Firebase: login anônimo + Firestore Lite).
// Empacotado pelo esbuild em www/online.js. Se não houver configuração ou internet, o jogo segue normal.
import { initializeApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence, signInAnonymously, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth';
import {
  getFirestore, connectFirestoreEmulator, doc, setDoc, getDoc, getDocs, collection,
  query, orderBy, limit, where, getCount, serverTimestamp,
} from 'firebase/firestore/lite';

const CFG = window.FIREBASE_CONFIG;
const configured = !!(CFG && CFG.apiKey && CFG.projectId);
let app, auth, db, user = null, readyP;

function withTimeout(p, ms = 9000) {
  return Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
}

if (configured) {
  app = initializeApp(CFG);
  // sem popup/redirect (não usamos), o que evita travar dentro do app Android
  auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence] });
  db = getFirestore(app);
  const emu = window.FIREBASE_EMULATOR; // só para testes locais
  if (emu) {
    connectAuthEmulator(auth, 'http://' + emu.auth, { disableWarnings: true });
    const [h, port] = emu.firestore.split(':');
    connectFirestoreEmulator(db, h, +port);
  }
  readyP = new Promise((res) => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) { user = u; unsub(); res(u); return; }
      signInAnonymously(auth).catch(() => res(null));
    });
  });
} else {
  readyP = Promise.resolve(null);
}

async function ensureUser() {
  const u = await withTimeout(readyP, 10000).catch(() => null);
  if (!u) throw new Error('offline');
  return u;
}

const rowOf = (d) => ({ id: d.id, n: d.get('n'), c: d.get('c'), s: d.get('s') });

window.Online = {
  configured,
  uid: () => (user ? user.uid : null),
  // grava o recorde do jogador num placar ('all' ou 'm_AAAA_MM')
  async submit(board, s, n, c) {
    const u = await ensureUser();
    await withTimeout(setDoc(doc(db, board, u.uid), { n, c, s, t: serverTimestamp() }));
    return true;
  },
  async top(board, n = 50) {
    await ensureUser();
    const snap = await withTimeout(getDocs(query(collection(db, board), orderBy('s', 'desc'), limit(n))));
    return snap.docs.map(rowOf);
  },
  // posição do jogador: quantos têm recorde maior + 1
  async rank(board, s) {
    await ensureUser();
    const snap = await withTimeout(getCount(query(collection(db, board), where('s', '>', s))));
    return snap.data().count + 1;
  },
  async mine(board) {
    const u = await ensureUser();
    const d = await withTimeout(getDoc(doc(db, board, u.uid)));
    return d.exists() ? rowOf(d) : null;
  },
};
window.dispatchEvent(new Event('online-ready'));
