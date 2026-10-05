/* ================= LOBBY (v1.6) =================
   Tela inicial limpa (você, recorde, 1 cartão de destaque, modo + JOGAR) e uma barra de abas embaixo:
   LOJA · COLEÇÃO · INÍCIO · TEMPORADA · SOCIAL. Cada aba é uma tela; bolinhas avisam quando tem prêmio. */
let curTab='home';
function lobbyOn(on){$('wrap').classList.toggle('lob',on);$('nav').hidden=!on;$('meChip').hidden=!on;if(on){meChipUI();navSync()}}
function navSync(){document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.go===curTab));
  const cl=anyClaim();$('nbSeason').hidden=!cl;$('nbSeason').textContent=cl?'!':'';
  $('nbShop').hidden=!offersNew();$('nbColl').hidden=!albumNew()}
function goTab(k,sub){
  if(k==='home'){showMenu();return}
  if(state!=='menu')showMenu();
  hideAll();curTab=k;lobbyOn(true);
  if(k==='shop'||k==='coll'){shopSec=k;tab=sub||(k==='coll'?'skins':'offers');if(k==='coll'&&!sub&&shopCat!=='mine'&&!catOf(shopCat).length)shopCat='mine';$('shop').hidden=false;$('shop').scrollTop=0;renderShop();if(k==='shop')offersSeen();if(k==='coll'&&tab==='album')albumSeen()}
  else if(k==='season'){$('mis').hidden=false;$('mis').scrollTop=0;seaTab(sub||'mis')}
  else if(k==='social'){openRank()}
  navSync()}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{if(curTab===b.dataset.go&&b.dataset.go!=='home')return;goTab(b.dataset.go)});
$('plusCoins').onclick=e=>{e.stopPropagation();goTab('shop','offers')};$('plusGems').onclick=e=>{e.stopPropagation();goTab('shop','gems')};
$('meChip').onclick=()=>openPP();
// ---- TEMPORADA: missões | metas ----
let seaCur='mis';
function seaTab(k){seaCur=k;$('seaSeg').querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',b.dataset.s===k));$('seaMis').hidden=k!=='mis';$('seaGoals').hidden=k!=='goals';if(k==='mis')renderMis();else renderGoals()}
$('seaSeg').querySelectorAll('button').forEach(b=>b.onclick=()=>seaTab(b.dataset.s));
// ---- você (canto de cima): nível com anel de XP, nome e liga do mês ----
function meChipUI(){$('meLvl').textContent=S.lvl;$('meAv').style.setProperty('--p',Math.round(S.xp/need(S.lvl)*100)+'%');
  $('meName').textContent=(S.lb&&S.lb.name)||t('player');const tr=tierOf(monthBest());const ti=goalTitle();
  $('meTier').innerHTML=tr?`<svg viewBox="0 0 24 24" width="11" height="11"><path fill="${tr.c1}" d="${SHIELD}"/></svg>${t('tier_'+tr.k)}`:(ti?'🏅 '+ti:t('lvlN',S.lvl))}
// ---- cartão de destaque (troca sozinho a cada 5 s; dá pra arrastar) ----
let evtI=0,evtT=0,evtList=[];
function evtItems(){const L=[];
  if(anyClaim())L.push({ic:'🎁',c:['#ffd46b','#ff9a3d'],h:t('ev_claimT'),p:t('ev_claimP'),go:()=>goTab('season')});
  {const d=dailyInfo(),left=DAILY_TRIES-d.tries;if(left>0)L.push({ic:'📅',c:['#6fd0ff','#2a86d8'],h:t('mode_daily'),p:t('dlyTries',left),go:()=>pickMode('daily')})}
  L.push({ic:'🎯',c:['#c7b3ff','#7a5ae0'],h:t('mode_weekly'),p:t('wr_'+weekRule())+' · '+t('daysLeft',weekLeftD()),go:()=>pickMode('weekly')});
  L.push({ic:'🛍️',c:['#ff7a9c','#e0305a'],h:t('ev_shopT'),p:t('ev_shopP',shopLeftH()),go:()=>goTab('shop','offers')});
  {const a=albumCur();if(a)L.push({ic:a.ic,c:['#6ff0a8','#1fa864'],h:t('album_'+a.k),p:t('ev_albumP',a.have,a.n),bar:a.have/a.n,go:()=>goTab('coll','album')})}
  if(S.best<50)L.push({ic:'👹',c:['#ff9a5c','#b3285a'],h:t('ev_bossT'),p:t('ev_bossP'),go:null});
  return L}
function renderEvt(){evtList=evtItems();evtI=Math.min(evtI,evtList.length-1);if(evtI<0)evtI=0;
  $('evtTrack').innerHTML=evtList.map(e=>`<button class="ec"><span class="ic" style="background:linear-gradient(160deg,${e.c[0]},${e.c[1]})">${e.ic}</span><span class="tx"><b>${e.h}</b><small>${e.p}</small>${e.bar!=null?`<span class="pbar"><i style="width:${Math.round(e.bar*100)}%"></i></span>`:''}</span><span class="go">›</span></button>`).join('');
  $('evtTrack').querySelectorAll('.ec').forEach((b,k)=>b.onclick=()=>{if(evtDrag)return;const e=evtList[k];e.go&&e.go()});
  $('evtDots').innerHTML=evtList.map((_,k)=>`<i class="${k===evtI?'on':''}"></i>`).join('');evtMove(false);clearInterval(evtT);evtT=setInterval(()=>{if(state!=='menu'||$('menu').hidden)return;evtI=(evtI+1)%evtList.length;evtMove(true)},5000)}
function evtMove(anim){const tr=$('evtTrack');tr.style.transition=anim?'transform .45s cubic-bezier(.3,.9,.3,1)':'none';tr.style.transform=`translateX(${-evtI*100}%)`;$('evtDots').querySelectorAll('i').forEach((d,k)=>d.classList.toggle('on',k===evtI))}
let evtDrag=false;{let x0=0,dx=0,down=false;const el=$('evt');
  el.addEventListener('pointerdown',e=>{down=true;evtDrag=false;x0=e.clientX;dx=0});
  el.addEventListener('pointermove',e=>{if(!down)return;dx=e.clientX-x0;if(Math.abs(dx)>8){evtDrag=true;const tr=$('evtTrack');tr.style.transition='none';tr.style.transform=`translateX(calc(${-evtI*100}% + ${dx}px))`}});
  const up=()=>{if(!down)return;down=false;if(evtDrag){if(dx<-40&&evtI<evtList.length-1)evtI++;else if(dx>40&&evtI>0)evtI--;evtMove(true);clearInterval(evtT);evtT=setInterval(()=>{if(state!=='menu'||$('menu').hidden)return;evtI=(evtI+1)%evtList.length;evtMove(true)},5000);setTimeout(()=>evtDrag=false,50)}};
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);el.addEventListener('pointerleave',up)}
// ---- seletor de modo (setas) e lista de modos ----
function modeUI(){const m=MODES.find(x=>x.k===S.selMode)||MODES[0];$('modeName').textContent=t('mode_'+m.k).toUpperCase();$('modeSub').textContent=modeSub(m);$('play').classList.toggle('lockd',!!modeLocked(m))}
function pickMode(k){S.selMode=k;save();modeUI();$('modes').hidden=true}
function stepMode(d){let i=MODES.findIndex(x=>x.k===S.selMode);i=(i+d+MODES.length)%MODES.length;S.selMode=MODES[i].k;save();modeUI();sfx.ui()}
$('modePrev').onclick=()=>stepMode(-1);$('modeNext').onclick=()=>stepMode(1);
$('modeBtn').onclick=()=>{renderModes();$('modes').hidden=false};
$('modes').onclick=e=>{if(e.target.id==='modes')$('modes').hidden=true};
function renderModes(){$('modeList').innerHTML=MODES.map(m=>{const lk=modeLocked(m),on=m.k===S.selMode;
  const chip=on?`<span class="chip cur">${t('mCur')}</span>`:lk?`<span class="chip lk">${t('lvlBtn',m.lvl)}</span>`:m.k==='daily'?`<span class="chip">${DAILY_TRIES-dailyInfo().tries}/${DAILY_TRIES}</span>`:m.k==='weekly'?`<span class="chip">${t('daysLeft',weekLeftD())}</span>`:'';
  return `<button class="mrow${on?' on':''}${lk?' lk':''}" data-k="${m.k}"><span class="ic" style="background:linear-gradient(160deg,${m.c[0]},${m.c[1]})">${m.ic}</span><span class="tx"><b>${t('mode_'+m.k)}</b><small>${t('m_'+m.k+'D')}</small></span>${chip}</button>`}).join('');
  $('modeList').querySelectorAll('.mrow').forEach(b=>b.onclick=()=>{const m=MODES.find(x=>x.k===b.dataset.k);if(modeLocked(m)){toast(t('mLock',m.lvl));return}pickMode(m.k)})}
// ---- tela inicial ----
function renderHome(){$('bestMenu').innerHTML=S.best?'🏆 '+t('bestN',S.best):'';modeUI();renderEvt();meChipUI();navSync()}
