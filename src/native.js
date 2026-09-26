// Ponte entre o jogo (www/index.html) e os recursos nativos do Android.
// É empacotado pelo esbuild em www/native.js (npm run build).
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { AdMob, RewardAdPluginEvents, AdmobConsentStatus } from '@capacitor-community/admob';
import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

const CFG = window.EMPILHA_CONFIG || {};
// IDs de teste oficiais do Google. São usados enquanto você não configurar o seu.
const TEST_REWARDED = 'ca-app-pub-3940256099942544/5224354917';
const REWARDED_ID = CFG.rewardedId || TEST_REWARDED;
const IS_TEST_AD = REWARDED_ID === TEST_REWARDED;

const isNative = Capacitor.isNativePlatform();
let adReady = false, adLoading = false, adsOk = false;

async function loadAd() {
  if (!adsOk || adReady || adLoading) return;
  adLoading = true;
  try {
    await AdMob.prepareRewardVideoAd({ adId: REWARDED_ID, isTesting: IS_TEST_AD });
    adReady = true;
  } catch (e) {
    adReady = false;
    setTimeout(loadAd, 30000); // tenta de novo em 30 s
  } finally { adLoading = false; }
}

async function initAds() {
  try {
    await AdMob.initialize({ initializeForTesting: IS_TEST_AD });
    try {
      const info = await AdMob.requestConsentInfo();
      if (info.isConsentFormAvailable && info.status === AdmobConsentStatus.REQUIRED) await AdMob.showConsentForm();
    } catch (e) { /* formulário de consentimento só existe em alguns países */ }
    adsOk = true;
    loadAd();
  } catch (e) { adsOk = false; }
}

// Mostra o vídeo premiado. Resolve true só se o jogador assistiu até ganhar a recompensa.
function showRewarded() {
  return new Promise(async (resolve) => {
    if (!adsOk) { resolve(false); return; }
    if (!adReady) { await loadAd(); if (!adReady) { resolve(false); return; } }
    let rewarded = false;
    const subs = [];
    const done = (v) => { subs.forEach(s => s.then(h => h.remove())); adReady = false; loadAd(); resolve(v); };
    subs.push(AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { rewarded = true; }));
    subs.push(AdMob.addListener(RewardAdPluginEvents.Dismissed, () => done(rewarded)));
    subs.push(AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => done(false)));
    try { const r = await AdMob.showRewardVideoAd(); if (r) rewarded = true; }
    catch (e) { done(false); }
  });
}

// ---------- Compras (Google Play Billing) ----------
let billingOk = false;
async function initBilling(productIds, grant) {
  try {
    const { isBillingSupported } = await NativePurchases.isBillingSupported();
    billingOk = !!isBillingSupported;
    if (!billingOk) return {};
    // Recupera compras que ficaram sem entregar (ex.: app fechou no meio da compra)
    try {
      const { purchases } = await NativePurchases.getPurchases({ productType: PURCHASE_TYPE.INAPP });
      for (const p of purchases || []) {
        const id = p.productIdentifier;
        if (productIds.includes(id) && p.purchaseToken && String(p.purchaseState) === '1') {
          grant(id, p.purchaseToken); // o jogo ignora tokens já entregues
          try { await NativePurchases.consumePurchase({ purchaseToken: p.purchaseToken }); } catch (e) {}
        }
      }
    } catch (e) {}
    const { products } = await NativePurchases.getProducts({ productIdentifiers: productIds, productType: PURCHASE_TYPE.INAPP });
    const prices = {};
    (products || []).forEach(p => { prices[p.identifier] = p.priceString; });
    return prices;
  } catch (e) { billingOk = false; return {}; }
}

async function buy(productId) {
  if (!billingOk) throw new Error('indisponivel');
  const t = await NativePurchases.purchaseProduct({ productIdentifier: productId, productType: PURCHASE_TYPE.INAPP, quantity: 1, isConsumable: true });
  return t && t.purchaseToken ? t.purchaseToken : null;
}

window.Native = {
  isNative,
  initAds, showRewarded, initBilling, buy,
  onBack(fn) { if (isNative) App.addListener('backButton', fn); },
  exitApp() { if (isNative) App.exitApp(); },
  onPause(fn) { if (isNative) App.addListener('pause', fn); },
  // cópia do save no armazenamento oficial do Android (entra no backup automático da conta Google)
  prefSet(k, v) { if (isNative) return Preferences.set({ key: k, value: v }).catch(() => {}); },
  async prefGet(k) { if (!isNative) return null; try { const r = await Preferences.get({ key: k }); return r.value; } catch (e) { return null; } },
};
window.dispatchEvent(new Event('native-ready'));
