/* ================= RANKING MUNDIAL ================= */
// Placar mensal (o Nº1 ganha 50 cristais e zera todo dia 1) + placar geral fixo, com a bandeira do país.
const OL=()=>window.Online&&window.Online.configured?window.Online:null;
const pad2=n=>(n<10?'0':'')+n;
const monthKey=(d=new Date())=>'m_'+d.getUTCFullYear()+'_'+pad2(d.getUTCMonth()+1);
const prevMonthKey=()=>{const d=new Date();d.setUTCDate(1);d.setUTCHours(12,0,0,0);d.setUTCMonth(d.getUTCMonth()-1);return monthKey(d)};
const monthEndMs=()=>{const d=new Date();return Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)};
const CCS='AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FR GA GB GD GE GH GM GN GQ GR GT GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KM KN KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MK ML MM MN MO MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NZ OM PA PE PG PH PK PL PR PS PT PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TW TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW'.split(' ');
const flag=cc=>/^[A-Z]{2}$/.test(cc||'')?String.fromCodePoint(...[...cc].map(ch=>127397+ch.charCodeAt(0))):'🏳️';
function ccName(cc){try{return new Intl.DisplayNames([{pt:'pt-BR',en:'en',es:'es'}[LANG]||'en'],{type:'region'}).of(cc)||cc}catch(e){return cc}}
function guessCC(){
  for(const l of (navigator.languages||[navigator.language||''])){const m=/[-_]([A-Za-z]{2})$/.exec(l||'');if(m&&CCS.includes(m[1].toUpperCase()))return m[1].toUpperCase()}
  try{const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
    if(/^America\/(Sao_Paulo|Fortaleza|Recife|Bahia|Manaus|Belem|Cuiaba|Campo_Grande|Porto_Velho|Boa_Vista|Rio_Branco|Araguaina|Maceio|Noronha|Santarem)$/.test(tz))return 'BR';
    const TZ={'Europe/Lisbon':'PT','America/Mexico_City':'MX','America/Argentina/Buenos_Aires':'AR','America/Bogota':'CO','America/Santiago':'CL','America/Lima':'PE','Europe/Madrid':'ES','America/New_York':'US','America/Chicago':'US','America/Denver':'US','America/Los_Angeles':'US','Europe/London':'GB','America/Caracas':'VE','America/Montevideo':'UY','America/Asuncion':'PY','America/La_Paz':'BO','America/Guayaquil':'EC','Africa/Luanda':'AO','Africa/Maputo':'MZ'};
    if(TZ[tz])return TZ[tz]}catch(e){}
  return {pt:'BR',es:'ES',en:'US'}[LANG]||'BR';
}
S.lb=Object.assign({name:'',cc:'',all:0,mk:'',ms:0,mb:{k:'',s:0},won:{},chk:'',edited:false},S.lb||{});
if(S.lb.rb===undefined)S.lb.rb=S.tamper?0:S.best; // melhor recorde de partidas limpas (é o que vai pro ranking)
if(!S.lb.cc)S.lb.cc=guessCC();
if(!S.lb.name)S.lb.name=t('rkDefName')+(1000+Math.floor(Math.random()*9000));
save();
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const BAD=/(porra|caralh|buceta|piroc|puta|merda|foda|viad|cuzao|arrombad|fuck|shit|bitch|cunt|nigg|dick|pussy|coño|pendej|mierda|joder|hitler|nazi)/i;
function cleanName(v){let n=String(v||'').replace(/[^\p{L}\p{N} ._-]/gu,'').replace(/\s+/g,' ').trim().slice(0,14);if(!n||BAD.test(n.replace(/[ ._-]/g,'')))return '';return n}

/* ---- enviar recordes ---- */
function trackMonth(sc){const k=monthKey();if(S.lb.mb.k!==k)S.lb.mb={k,s:0};if(sc>S.lb.mb.s)S.lb.mb.s=sc;save()}
let lbBusy=null;
function syncScores(force){
  const on=OL();if(!on)return Promise.resolve(false);if(lbBusy)return lbBusy;force=force||S.lb.dirty;
  lbBusy=(async()=>{let ok=true;
    try{if(S.lb.rb>S.lb.all||(force&&S.lb.all>0)){const v=Math.max(S.lb.rb,S.lb.all);await on.submit('all',v,S.lb.name,S.lb.cc);S.lb.all=v;save()}}catch(e){ok=false}
    try{const k=monthKey();if(S.lb.mk!==k){S.lb.mk=k;S.lb.ms=0}
      if(S.lb.mb.k===k&&(S.lb.mb.s>S.lb.ms||(force&&S.lb.ms>0))){const v=Math.max(S.lb.mb.s,S.lb.ms);await on.submit(k,v,S.lb.name,S.lb.cc);S.lb.ms=v;save()}}catch(e){ok=false}
    if(ok&&force&&S.lb.dirty){S.lb.dirty=false;save()}
    return ok})().finally(()=>{lbBusy=null});
  return lbBusy;
}
// depois de cada partida: guarda o recorde do mês, envia e mostra a posição na tela de fim
function rankAfterRun(sc){
  const el=$('oRank');el.hidden=true;
  const why=runVerdict(sc);
  if(why.length){S.lb.flag=(S.lb.flag||0)+1;S.lb.why=why.join(',');save();if(sc>0){el.innerHTML=`<span>${t('rkNotSent')}</span>`;el.hidden=false}return}
  if(sc>(S.lb.rb||0))S.lb.rb=sc;trackMonth(sc);
  const on=OL();if(!on||sc<=0)return;
  syncScores().then(async()=>{
    const k=monthKey();const ms=S.lb.mk===k?S.lb.ms:0;if(!ms||$('over').hidden)return;
    try{const [rm,ra]=await Promise.all([on.rank(k,ms),S.lb.all?on.rank('all',S.lb.all):Promise.resolve(0)]);if($('over').hidden)return;
      el.innerHTML=`<span>${flag(S.lb.cc)} <b>#${rm}</b> ${t('rkInMonth')}</span>`+(ra?`<span><b>#${ra}</b> ${t('rkInAll')}</span>`:'');el.hidden=false;rkCache={}}catch(e){}
  });
}

/* ---- prêmio do mês passado ---- */
async function checkPrize(){
  const on=OL();if(!on)return;const pk=prevMonthKey();if(S.lb.chk===pk)return;
  try{const top=await on.top(pk,1);S.lb.chk=pk;
    if(top[0]&&top[0].id===on.uid()&&top[0].s>0&&!S.lb.won[pk]){S.lb.won[pk]=true;S.gems+=50;save();wallet();showPrizeWin(pk)}
    save()}catch(e){}
}
function monthLabel(k){const m=/m_(\d{4})_(\d{2})/.exec(k);if(!m)return '';return new Date(Date.UTC(+m[1],+m[2]-1,15)).toLocaleDateString({pt:'pt-BR',en:'en-US',es:'es-ES'}[LANG],{month:'long',year:'numeric',timeZone:'UTC'})}
function showPrizeWin(pk){$('rkWinP').textContent=t('rkWinP',monthLabel(pk));$('rkWin').hidden=false;sfx.fanfare();setTimeout(()=>sfx.coin(),500);bump('pGems')}
$('rkWinOk').onclick=()=>{$('rkWin').hidden=true;sfx.coin()};

/* ---- tela do ranking ---- */
let rkTab='month',rkBack='menu',rkCache={};
function fmtLeft(){const ms=monthEndMs()-Date.now();const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),mi=Math.floor(ms%36e5/6e4);return d>0?t('dLeft',d,h):t('hLeft',h,mi)}
function renderRankHead(){
  $('rkFlag').textContent=flag(S.lb.cc);$('rkName').textContent=S.lb.name;
  document.querySelectorAll('.rtab').forEach(b=>b.setAttribute('aria-selected',b.dataset.rt===rkTab));
  $('rkPrize').hidden=rkTab!=='month';
  $('rkPrize').innerHTML=`<svg viewBox="0 0 24 24" class="tro"><path d="M7 3h10v3h3v2a4 4 0 0 1-4 4 5 5 0 0 1-3 2.7V17h3v3H8v-3h3v-2.3A5 5 0 0 1 8 12a4 4 0 0 1-4-4V6h3zM4 8a2 2 0 0 0 3 1.7V8zm16 0h-3v1.7A2 2 0 0 0 20 8z" fill="#ffc23d"/></svg><span>${t('rkPrize')} <b><i class="gem"></i>50</b></span><small>${t('rkEnds',fmtLeft())}</small>`;
}
function openRank(){rkBack=state==='over'?'over':'menu';hideAll();$('rank').hidden=false;renderRankHead();loadRank();if(!S.lb.edited)setTimeout(()=>{if(!$('rank').hidden&&!S.lb.edited)openProf()},500)}
function rowHTML(r,pos,me){return `<div class="rrow${me?' me':''}${pos<=3?' p'+pos:''}"><b class="pos">${pos<=3?`<i>${pos}</i>`:pos}</b><span class="fl">${flag(r.c)}</span><span class="nm">${esc(r.n)}</span><span class="sc">${r.s}</span></div>`}
async function loadRank(){
  const L=$('rkList'),mine=$('rkMine'),note=$('rkNote');mine.hidden=true;note.textContent='';
  const on=OL();
  if(!on){L.innerHTML=`<div class="rempty">${t(window.Online&&!window.Online.configured?'rkSoon':'rkOff')}</div>`;return}
  const board=rkTab==='month'?monthKey():'all',tabAt=rkTab;
  const c=rkCache[board];
  if(!c||Date.now()-c.t>60000)L.innerHTML=`<div class="rempty"><span class="spin"></span>${t('rkLoading')}</div>`;
  try{
    await syncScores();
    let rows=c&&Date.now()-c.t<60000?c.rows:null;
    if(!rows){rows=await on.top(board,50);rkCache[board]={t:Date.now(),rows}}
    if(rkTab!==tabAt||$('rank').hidden)return;
    const uid=on.uid();const myS=board==='all'?S.lb.all:(S.lb.mk===board?S.lb.ms:0);
    L.innerHTML=rows.length?rows.map((r,k)=>rowHTML(r,k+1,r.id===uid)).join(''):`<div class="rempty">${t(board==='all'?'rkNoScore':'rkEmpty')}</div>`;
    const idx=rows.findIndex(r=>r.id===uid);
    if(idx<0){
      if(myS>0){const pos=await on.rank(board,myS);if(rkTab!==tabAt)return;mine.innerHTML=rowHTML({n:S.lb.name,c:S.lb.cc,s:myS},pos,true);mine.hidden=false}
      else{mine.innerHTML=`<div class="rempty sm">${t('rkNoScore')}</div>`;mine.hidden=false}
    }else if(idx===0&&board!=='all'){note.textContent=t('rkTop1Now')}
    else{const me=L.querySelector('.me');me&&me.scrollIntoView({block:'center'})}
  }catch(e){if(rkTab===tabAt)L.innerHTML=`<div class="rempty">${t('rkOff')}</div>`}
}
document.querySelectorAll('.rtab').forEach(b=>b.onclick=()=>{rkTab=b.dataset.rt;renderRankHead();loadRank()});
$('openRank').onclick=openRank;$('oRank').onclick=openRank;
$('closeRank').onclick=()=>{$('rank').hidden=true;rkBack==='over'?$('over').hidden=false:showMenu()};
$('rkMe').onclick=()=>openProf();

/* ---- perfil: nome e país ---- */
let pfCC='';
function openProf(){$('pfName').value=S.lb.name;$('pfName').placeholder=t('rkNamePh');pfCC=S.lb.cc;$('pfSearch').value='';$('pfSearch').placeholder=t('rkSearch');$('pfList').hidden=true;$('pfSearch').hidden=true;renderCCBtn();$('prof').hidden=false}
function renderCCBtn(){$('pfCC').innerHTML=`<span class="fl">${flag(pfCC)}</span><span>${esc(ccName(pfCC))}</span><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`}
function renderCCList(){const q=$('pfSearch').value.trim().toLowerCase();const first=guessCC();
  const all=CCS.map(cc=>({cc,n:ccName(cc)})).filter(o=>!q||o.n.toLowerCase().includes(q)||o.cc.toLowerCase()===q).sort((a,b)=>(b.cc===first)-(a.cc===first)||a.n.localeCompare(b.n));
  $('pfList').innerHTML=all.map(o=>`<button data-cc="${o.cc}"${o.cc===pfCC?' class="on"':''}><span class="fl">${flag(o.cc)}</span>${esc(o.n)}</button>`).join('');
  $('pfList').querySelectorAll('button').forEach(b=>b.onclick=()=>{pfCC=b.dataset.cc;renderCCBtn();$('pfList').hidden=true;$('pfSearch').hidden=true})}
$('pfCC').onclick=()=>{const open=$('pfList').hidden;$('pfList').hidden=!open;$('pfSearch').hidden=!open;if(open){renderCCList();$('pfList').scrollTop=0}};
$('pfSearch').oninput=renderCCList;
$('pfCancel').onclick=()=>{$('prof').hidden=true;S.lb.edited=true;save()};
$('pfSave').onclick=()=>{const n=cleanName($('pfName').value);if(!n){toast(t('rkNameBad'));return}
  const changed=n!==S.lb.name||pfCC!==S.lb.cc;S.lb.name=n;S.lb.cc=pfCC;S.lb.edited=true;if(changed)S.lb.dirty=true;save();$('prof').hidden=true;renderRankHead();
  if(changed){rkCache={};syncScores(true).then(()=>{if(!$('rank').hidden)loadRank()})}};

function onlineBoot(){const on=OL();if(on&&on.serverNow)on.serverNow().then(st=>{if(st){srvSkew=Date.now()-st;if(!$('mis').hidden)renderMis()}}).catch(()=>{});syncScores().then(()=>checkPrize())}
if(window.Online)onlineBoot();else addEventListener('online-ready',onlineBoot);
