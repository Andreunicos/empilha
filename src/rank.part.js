/* ================= RANKING MUNDIAL ================= */
// Placar mensal (o Nº1 ganha 50 cristais e zera todo dia 1) + placar geral fixo, com a bandeira do país.
const OL=()=>window.Online&&window.Online.configured?window.Online:null;
const pad2=n=>(n<10?'0':'')+n;
const nowSrv=()=>Date.now()-(typeof srvSkew==='number'?srvSkew:0); // hora do Google (não a do celular)
const monthKey=(d=new Date(nowSrv()))=>'m_'+d.getUTCFullYear()+'_'+pad2(d.getUTCMonth()+1);
const prevMonthKey=()=>{const d=new Date(nowSrv());d.setUTCDate(1);d.setUTCHours(12,0,0,0);d.setUTCMonth(d.getUTCMonth()-1);return monthKey(d)};
const monthEndMs=()=>{const d=new Date(nowSrv());return Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,1)+(Date.now()-nowSrv())};
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
// nome no ranking: vem da conta do Play Games (não dá pra digitar). Sem Play Games: nome automático "Jogador1234"
if(!S.lb.auto)S.lb.auto=/^(Jogador|Player|Jugador)\d{4}$/.test(S.lb.name||'')?S.lb.name:t('rkDefName')+(1000+Math.floor(Math.random()*9000));
if(!S.lb.pg&&S.lb.name!==S.lb.auto){if(S.lb.name)S.lb.dirty=true;S.lb.name=S.lb.auto}
save();
const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const BAD=/(porra|caralh|buceta|piroc|puta|merda|foda|viad|cuzao|arrombad|fuck|shit|bitch|cunt|nigg|dick|pussy|coño|pendej|mierda|joder|hitler|nazi)/i;
function cleanName(v){let n=String(v||'').replace(/[^\p{L}\p{N} ._-]/gu,'').replace(/\s+/g,' ').trim().slice(0,14);if(!n||BAD.test(n.replace(/[ ._-]/g,'')))return '';return n}

/* ---- enviar recordes ---- */
function trackMonth(sc){const k=monthKey();if(S.lb.mb.k!==k)S.lb.mb={k,s:0};if(sc>S.lb.mb.s)S.lb.mb.s=sc;save()}
const RA={s:-1,p:0,t:0}; // posição no geral (cache: só pergunta de novo se o recorde mudar)
let lbBusy=null;
// envia; se o servidor recusar (ex.: lá já tem um recorde maior, de um save antigo restaurado), adota o valor de lá
async function submitSafe(on,board,v){try{await on.submit(board,v,S.lb.name,S.lb.cc);return v}
  catch(e){if(!/permission|PERMISSION/.test(String(e&&(e.code||e.message))))throw e;const m=await on.mine(board);if(m&&m.s>v){await on.submit(board,m.s,S.lb.name,S.lb.cc);return m.s}throw e}}
function syncScores(force){
  const on=OL();if(!on)return Promise.resolve(false);if(lbBusy)return lbBusy;force=force||S.lb.dirty;const nameAt=S.lb.name+'|'+S.lb.cc;
  lbBusy=(async()=>{let ok=true;
    try{if(S.lb.rb>S.lb.all||(force&&S.lb.all>0)){const v=Math.max(S.lb.rb,S.lb.all);S.lb.all=await submitSafe(on,'all',v);save()}}catch(e){ok=false}
    try{const k=monthKey();if(S.lb.mk!==k){S.lb.mk=k;S.lb.ms=0}
      if(S.lb.mb.k===k&&(S.lb.mb.s>S.lb.ms||(force&&S.lb.ms>0))){const v=Math.max(S.lb.mb.s,S.lb.ms);S.lb.ms=await submitSafe(on,k,v);save()}}catch(e){ok=false}
    // desafio diário que não chegou a ser enviado (sem internet, erro...)
    try{if(typeof dayKey==='function'&&S.dly&&S.dly.k===dayKey()&&S.dly.best>S.dly.sent){await on.submit(dayKey(),S.dly.best,S.lb.name,S.lb.cc);S.dly.sent=S.dly.best;save()}}catch(e){}
    // só limpa o "precisa reenviar" se o nome/país não mudou no meio do envio
    if(ok&&force&&S.lb.dirty&&nameAt===S.lb.name+'|'+S.lb.cc){S.lb.dirty=false;save()}
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
    if(Date.now()-(S.cp.t||0)>120000){S.cp.t=Date.now();snapBelow()}
    const k=monthKey();const ms=S.lb.mk===k?S.lb.ms:0;if(!ms||$('over').hidden)return;
    try{const allPos=async()=>{if(!S.lb.all)return 0;if(RA.s===S.lb.all&&Date.now()-RA.t<6e5)return RA.p;const p=await on.rank('all',S.lb.all);Object.assign(RA,{s:S.lb.all,p,t:Date.now()});return p};const [rm,ra]=await Promise.all([on.rank(k,ms),allPos()]);if($('over').hidden)return;
      S.st.lastPos=rm;S.st.bestPos=S.st.bestPos?Math.min(S.st.bestPos,rm):rm;save();checkAch();el.innerHTML=`<span>${flag(S.lb.cc)} <b>#${rm}</b> ${t('rkInMonth')}</span>`+(ra?`<span><b>#${ra}</b> ${t('rkInAll')}</span>`:'');el.hidden=false;rkCache={}}catch(e){}
  });
}

/* ---- prêmio do mês passado ---- */
const MPRIZE=[50,30,20,10,10,10,10,10,10,10];
async function checkPrize(){
  const on=OL();if(!on)return;const pk=prevMonthKey();if(S.lb.chk===pk)return;
  try{let top=await on.top(pk,15);S.lb.chk=pk;top=dedupeRows(top,on.uid());const idx=top.findIndex(r=>r.id===on.uid());
    if(idx>=0&&idx<10&&top[idx].s>0&&!S.lb.won[pk]){const g=MPRIZE[idx];S.lb.won[pk]=true;S.gems+=g;S.med.push({k:pk,p:idx+1,s:top[idx].s});if(!S.st.bestPos||idx+1<S.st.bestPos)S.st.bestPos=idx+1;save();wallet();whenMenu(()=>showPrizeWin(pk,idx+1,g))}
    save()}catch(e){}
}
function monthLabel(k){const m=/m_(\d{4})_(\d{2})/.exec(k);if(!m)return '';return new Date(Date.UTC(+m[1],+m[2]-1,15)).toLocaleDateString({pt:'pt-BR',en:'en-US',es:'es-ES'}[LANG],{month:'long',year:'numeric',timeZone:'UTC'})}
function showPrizeWin(pk,pos=1,g=50){$('rkWin').querySelector('h2').textContent=t(pos===1?'rkWinT':pos<=3?'rkWinT3':'rkWinT10');$('rkWinP').innerHTML=esc(pos===1?t('rkWinP',monthLabel(pk)):t('rkWinPn',pos,monthLabel(pk)))+`<br><b style="font-size:24px"><i class="gem"></i>+${g}</b>`;$('rkWin').hidden=false;sfx.fanfare();setTimeout(()=>sfx.coin(),500);bump('pGems')}
$('rkWinOk').onclick=()=>{$('rkWin').hidden=true;sfx.coin()};

/* ---- tela do ranking ---- */
let rkTab='month',rkBack='menu',rkCache={};
function fmtLeft(){return fmtLeftTo(monthEndMs())}
function fmtLeftTo(end){const ms=end-Date.now();const d=Math.floor(ms/864e5),h=Math.floor(ms%864e5/36e5),mi=Math.floor(ms%36e5/6e4);return d>0?t('dLeft',d,h):t('hLeft',h,mi)}
function renderRankHead(){
  $('rkFlag').textContent=flag(S.lb.cc);$('rkName').textContent=S.lb.name;
  document.querySelectorAll('.rtab').forEach(b=>b.setAttribute('aria-selected',b.dataset.rt===rkTab));
  $('rkPrize').hidden=rkTab==='all';const tro=`<svg viewBox="0 0 24 24" class="tro"><path d="M7 3h10v3h3v2a4 4 0 0 1-4 4 5 5 0 0 1-3 2.7V17h3v3H8v-3h3v-2.3A5 5 0 0 1 8 12a4 4 0 0 1-4-4V6h3zM4 8a2 2 0 0 0 3 1.7V8zm16 0h-3v1.7A2 2 0 0 0 20 8z" fill="#ffc23d"/></svg>`;
  $('rkPrize').innerHTML=rkTab==='day'
    ?`${tro}<span>${t('rkDayPrize')} <b>🥇<i class="gem"></i>10 · 🥈6 · 🥉4</b></span><small>${t('rkEnds',fmtLeftTo(dayEndMs()))} · ${t('dlyRule')}</small>`
    :`${tro}<span>${t('rkPrize2')} <b>🥇<i class="gem"></i>50 · 🥈30 · 🥉20</b></span><small>${t('rkTop10')} · ${t('rkEnds',fmtLeft())}</small>`;
}
function openRank(){rkBack=state==='over'?'over':'menu';hideAll();$('rank').hidden=false;renderRankHead();loadRank();if(!S.lb.edited)setTimeout(()=>{if(!$('rank').hidden&&!S.lb.edited)openProf()},500)}
function rowHTML(r,pos,me){return `<div class="rrow${me?' me':''}${pos<=3?' p'+pos:''}"><b class="pos">${pos<=3?`<i>${pos}</i>`:pos}</b><span class="fl">${flag(r.c)}</span>${tierSVG(tierOf(r.s),17)}<span class="nm">${esc(r.n)}</span><span class="sc">${r.s}</span></div>`}
// mesmo jogador com 2 entradas (ex.: reinstalou o app e ganhou outro ID): mostra só a melhor.
// As suas entradas antigas somem e fica só a atual.
function dedupeRows(rows,uid){const old=S.lb.uids||[];const auto=n=>/^(Jogador|Player|Jugador)\d{4}$/.test(n||'');
  const key=r=>auto(r.n)?'#'+r.id:String(r.n||'').toLowerCase()+'|'+r.c;const mineR=rows.find(r=>r.id===uid);
  const myK=mineR?key(mineR):S.lb.pg?(S.lb.name.toLowerCase()+'|'+S.lb.cc):'#'+uid;const seen=new Set();
  return rows.filter(r=>{if(r.id===uid)return true;if(old.includes(r.id))return false;const k=key(r);if(k===myK)return false;if(seen.has(k))return false;seen.add(k);return true})}
async function loadRank(){
  const L=$('rkList'),mine=$('rkMine'),note=$('rkNote');mine.hidden=true;note.textContent='';
  const on=OL();
  if(!on){L.innerHTML=`<div class="rempty">${t(window.Online&&!window.Online.configured?'rkSoon':'rkOff')}</div>`;return}
  const board=rkTab==='month'?monthKey():rkTab==='day'?dayKey():'all',tabAt=rkTab;
  const c=rkCache[board];
  if(!c||Date.now()-c.t>60000)L.innerHTML=`<div class="rempty"><span class="spin"></span>${t('rkLoading')}</div>`;
  try{
    await syncScores();
    let rows=c&&Date.now()-c.t<60000?c.rows:null;
    if(!rows){rows=await on.top(board,50);rkCache[board]={t:Date.now(),rows}}
    if(rkTab!==tabAt||$('rank').hidden)return;
    const uid=on.uid();const myS=board==='all'?S.lb.all:rkTab==='day'?(S.dly.k===board?S.dly.sent:0):(S.lb.mk===board?S.lb.ms:0);
    rows=dedupeRows(rows,uid);
    L.innerHTML=rows.length?rows.map((r,k)=>rowHTML(r,k+1,r.id===uid)).join(''):`<div class="rempty">${t(board==='all'?'rkNoScore':'rkEmpty')}</div>`;
    const idx=rows.findIndex(r=>r.id===uid);
    if(idx<0){
      if(myS>0){const pos=await on.rank(board,myS);if(rkTab!==tabAt)return;mine.innerHTML=rowHTML({n:S.lb.name,c:S.lb.cc,s:myS},pos,true);mine.hidden=false}
      else{mine.innerHTML=`<div class="rempty sm">${t('rkNoScore')}</div>`;mine.hidden=false}
    }else if(idx===0&&board!=='all'){note.textContent=t('rkTop1Now')}
    if(rkTab==='month'&&idx>=0){S.st.lastPos=idx+1;S.st.bestPos=S.st.bestPos?Math.min(S.st.bestPos,idx+1):idx+1}
    else{const me=L.querySelector('.me');me&&me.scrollIntoView({block:'center'})}
  }catch(e){if(rkTab===tabAt)L.innerHTML=`<div class="rempty">${t('rkOff')}</div>`}
}
function setRankTab(k){rkTab=k;renderRankHead();loadRank()}
document.querySelectorAll('.rtab').forEach(b=>b.onclick=()=>setRankTab(b.dataset.rt));
$('openRank').onclick=openRank;$('oRank').onclick=openRank;
$('closeRank').onclick=()=>{$('rank').hidden=true;rkBack==='over'?$('over').hidden=false:showMenu()};
$('rkMe').onclick=()=>openProf();

/* ---- perfil: nome e país ---- */
let pfCC='';
function openProf(){$('pfName').textContent=S.lb.name;const c=typeof CL==='function'&&CL();
  $('pfNote').textContent=t(S.lb.pg?'pfPgOn':c?'pfPgOff':'pfAuto');$('pfPG').hidden=!!S.lb.pg||!c;
  pfCC=S.lb.cc;$('pfSearch').value='';$('pfSearch').placeholder=t('rkSearch');$('pfList').hidden=true;$('pfSearch').hidden=true;renderCCBtn();$('prof').hidden=false}
// chamado quando entra no Play Games: usa o nome da conta no ranking
function setPlayName(nm){const n=cleanName(nm);if(!n)return;if(n===S.lb.name&&S.lb.pg)return;
  S.lb.name=n;S.lb.pg=true;S.lb.dirty=true;save();rkCache={};if(!$('rank').hidden){renderRankHead();loadRank()}if(!$('prof').hidden)openProf();syncScores(true)}
$('pfPG').onclick=()=>{if(typeof clSignIn==='function')clSignIn(true).then(ok=>{if(ok)toast(t('clHi',clPlayer))})};
function renderCCBtn(){$('pfCC').innerHTML=`<span class="fl">${flag(pfCC)}</span><span>${esc(ccName(pfCC))}</span><svg viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>`}
function renderCCList(){const q=$('pfSearch').value.trim().toLowerCase();const first=guessCC();
  const all=CCS.map(cc=>({cc,n:ccName(cc)})).filter(o=>!q||o.n.toLowerCase().includes(q)||o.cc.toLowerCase()===q).sort((a,b)=>(b.cc===first)-(a.cc===first)||a.n.localeCompare(b.n));
  $('pfList').innerHTML=all.map(o=>`<button data-cc="${o.cc}"${o.cc===pfCC?' class="on"':''}><span class="fl">${flag(o.cc)}</span>${esc(o.n)}</button>`).join('');
  $('pfList').querySelectorAll('button').forEach(b=>b.onclick=()=>{pfCC=b.dataset.cc;renderCCBtn();$('pfList').hidden=true;$('pfSearch').hidden=true})}
$('pfCC').onclick=()=>{const open=$('pfList').hidden;$('pfList').hidden=!open;$('pfSearch').hidden=!open;if(open){renderCCList();$('pfList').scrollTop=0}};
$('pfSearch').oninput=renderCCList;
$('pfCancel').onclick=()=>{$('prof').hidden=true;S.lb.edited=true;save()};
$('pfSave').onclick=()=>{const changed=pfCC!==S.lb.cc;S.lb.cc=pfCC;S.lb.edited=true;if(changed)S.lb.dirty=true;save();$('prof').hidden=true;renderRankHead();
  if(changed){rkCache={};syncScores(true).then(()=>{if(!$('rank').hidden)loadRank()})}};

async function onlineBoot(){const on=OL();if(!on)return;
  try{const st=await on.serverNow();if(st){srvSkew=Date.now()-st;if(!$('mis').hidden)renderMis()}}catch(e){}
  // celular novo / reinstalado: o login anônimo muda, então reenvia os recordes na conta nova
  const uid=on.uid();if(uid&&S.lb.uid!==uid){if(S.lb.uid){S.lb.uids=(S.lb.uids||[]).concat(S.lb.uid).slice(-10);S.lb.all=0;S.lb.ms=0}S.lb.uid=uid;save()}
  await syncScores();
  // se a sua entrada foi apagada do ranking (ex.: limpeza), manda de novo o seu recorde
  try{if(S.lb.all>0&&!(await on.mine('all'))){S.lb.all=0;save()}
    const k=monthKey();if(S.lb.mk===k&&S.lb.ms>0&&!(await on.mine(k))){S.lb.ms=0;save()}
    if(S.lb.all===0||S.lb.ms===0)await syncScores()}catch(e){}
  await checkPrize();await checkDailyPrize();await checkOvertakes();snapBelow();checkAch()}
if(window.Online)onlineBoot();else addEventListener('online-ready',onlineBoot);
