/* ================= COMPETITIVO =================
   Patentes, linha do rival, "fulano te passou", desafio diário, prêmios Top 3/Top 10, conquistas,
   perfil do jogador e card de recorde pra compartilhar. */
const dayKey=(d=new Date(nowSrv()))=>'d_'+d.getUTCFullYear()+'_'+pad2(d.getUTCMonth()+1)+'_'+pad2(d.getUTCDate());
const prevDayKey=()=>dayKey(new Date(nowSrv()-864e5));
const dayEndMs=()=>{const d=new Date(nowSrv());return Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()+1)+(Date.now()-nowSrv())};
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const seedOf=str=>[...str].reduce((h,c)=>Math.imul(h^c.charCodeAt(0),16777619)>>>0,2166136261);

S.st=Object.assign({runs:0,floors:0,perf:0,combo:0,time:0,bestPos:0,lastPos:0},S.st||{});
S.ach=S.ach||{};S.med=S.med||[];S.dwon=S.dwon||{};S.cp=S.cp||{k:'',below:[]};
S.dly=Object.assign({k:'',tries:0,best:0,sent:0,bestEver:0,days:0},S.dly||{});
if(!S.st.combo&&S.best)S.st.floors=Math.max(S.st.floors,S.best);

/* ---- patentes (pelo recorde do mês) ---- */
const TIERS=[{k:'bronze',at:1,c1:'#f3b27a',c2:'#8a4a1f'},{k:'silver',at:40,c1:'#f4f7fc',c2:'#7d8aa0'},{k:'gold',at:80,c1:'#ffe79a',c2:'#c7870e'},{k:'diamond',at:130,c1:'#c4f6ff',c2:'#2f8fd6'},{k:'legend',at:200,c1:'#ffc2f3',c2:'#8a2bd6'}];
const tierOf=s=>{let r=null;for(const tr of TIERS)if(s>=tr.at)r=tr;return r};
const SHIELD='M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z';
const TMARK={bronze:'M8 11l4 3 4-3v2.4l-4 3-4-3z',silver:'M8 8.5l4 3 4-3v2.4l-4 3-4-3zM8 13l4 3 4-3v2.4l-4 3-4-3z',gold:'M12 6.5l1.7 3.5 3.8.5-2.8 2.6.7 3.8L12 15l-3.4 1.9.7-3.8-2.8-2.6 3.8-.5z',diamond:'M12 6l4.5 5L12 17.5 7.5 11z',legend:'M6.5 15.5l-1-7 3.5 3 3-4.5 3 4.5 3.5-3-1 7z'};
function tierSVG(tr,sz=18){if(!tr)return '';const id='tg'+tr.k;return `<svg class="tier" width="${sz}" height="${sz}" viewBox="0 0 24 24"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${tr.c1}"/><stop offset="1" stop-color="${tr.c2}"/></linearGradient></defs><path d="${SHIELD}" fill="url(#${id})" stroke="rgba(0,0,0,.35)" stroke-width="1"/><path d="${TMARK[tr.k]}" fill="#fff" fill-opacity=".92"/></svg>`}
function drawTier(c,tr,x,y,sz){if(!tr)return;c.save();c.translate(x,y);c.scale(sz/24,sz/24);const g=c.createLinearGradient(0,2,0,22);g.addColorStop(0,tr.c1);g.addColorStop(1,tr.c2);c.fillStyle=g;c.fill(new Path2D(SHIELD));c.lineWidth=1;c.strokeStyle='rgba(0,0,0,.35)';c.stroke(new Path2D(SHIELD));c.fillStyle='rgba(255,255,255,.92)';c.fill(new Path2D(TMARK[tr.k]));c.restore()}
const monthBest=()=>S.lb.mk===monthKey()?S.lb.ms:0;

/* ---- linha do rival (durante a partida) ---- */
const RV={rows:[],board:'',t:0,passed:{}};
const curBoard=()=>mode==='daily'?dayKey():monthKey();
const curBest=()=>mode==='daily'?(S.dly.k===dayKey()?S.dly.best:0):S.best;
async function loadRivals(board,myS){const on=OL();if(!on||!on.above)return;
  try{const rows=await on.above(board,myS,10);const uid=on.uid();RV.rows=dedupeRows(rows.filter(r=>r.id!==uid),uid).sort((a,b)=>a.s-b.s);RV.board=board;RV.t=Date.now()}catch(e){}}
function rivalStart(){RV.passed={};const b=curBoard();const myS=mode==='daily'?(S.dly.k===dayKey()?S.dly.sent:0):monthBest();
  if(RV.board!==b)RV.rows=[];if(RV.board!==b||Date.now()-RV.t>180000||RV.myS!==myS){RV.myS=myS;loadRivals(b,myS)}}
function rivalStep(){if(!RV.rows.length||RV.board!==curBoard())return;
  for(const r of RV.rows){if(!RV.passed[r.id]&&score>r.s){RV.passed[r.id]=1;run.passed=(run.passed||0)+1;addFloat(W/2,yOf(score)-78,t('passedX',r.n),'#ffc23d',19);sfx.coin();buzz(20)}}}
function rivalLine(y,col,label,dash){ctx.save();ctx.globalAlpha=.9;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash(dash?[9,7]:[]);ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();ctx.setLineDash([]);
  ctx.font='900 13px Nunito, sans-serif';const tw=ctx.measureText(label).width+18;const x=W-tw-8;ctx.fillStyle='rgba(15,16,36,.82)';rr(ctx,x,y-12,tw,24,12);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=1.5;rr(ctx,x,y-12,tw,24,12);ctx.stroke();
  ctx.fillStyle=col;ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(label,x+9,y+.5);ctx.restore()}
function drawRival(){if(state!=='play'&&state!=='pause'&&state!=='revive')return;
  const best=curBest();if(best>score){const y=yOf(best);if(y>-20&&y<H+20)rivalLine(y,'#4fe39a',t('yourBest',best),true)}
  if(RV.board!==curBoard())return;
  const nx=RV.rows.find(r=>!RV.passed[r.id]&&r.s>=score);if(!nx)return;const y=yOf(nx.s);
  if(y>-20&&y<H+20)rivalLine(y,'#ffc23d',`${flag(nx.c)} ${nx.n} · ${nx.s}`,false)}

/* ---- "fulano te passou!" ---- */
async function snapBelow(){const on=OL();if(!on||!on.below)return;const k=monthKey(),ms=monthBest();if(!ms)return;
  try{const rows=await on.below(k,ms,7);const uid=on.uid();S.cp={k,ms,t:Date.now(),below:rows.filter(r=>r.id!==uid&&r.n!==S.lb.name).map(r=>r.id).slice(0,6)};save()}catch(e){}}
async function checkOvertakes(){const on=OL();const k=monthKey(),ms=monthBest();if(!on||!on.above||S.cp.k!==k||!S.cp.below.length||!ms)return;
  try{const rows=await on.above(k,ms,10);const who=rows.filter(r=>S.cp.below.includes(r.id));if(!who.length)return;
    const pos=await on.rank(k,ms);whenMenu(()=>showOvertake(who,pos))}catch(e){}}
function showOvertake(who,pos){if(!$('ovt').hidden)return;
  $('ovtList').innerHTML=who.slice(0,3).map(r=>`<div><span>${flag(r.c)}</span><span>${esc(r.n)}</span><b>${r.s}</b></div>`).join('');
  $('ovtP').textContent=t('ovtP',pos);$('ovt').hidden=false;sfx.whoosh()}
$('ovtGo').onclick=()=>{$('ovt').hidden=true;mode='normal';startGame()};
$('ovtNo').onclick=()=>{$('ovt').hidden=true};

/* ---- desafio diário: mesma sequência de blocos pra todo mundo, 3 tentativas, ranking do dia ---- */
const DAILY_TRIES=3,DPRIZE=[10,6,4];
function dailyInfo(){const k=dayKey();if(S.dly.k!==k){S.dly.k=k;S.dly.tries=0;S.dly.best=0;S.dly.sent=0}return S.dly}
function dailyBtn(){const d=dailyInfo(),left=DAILY_TRIES-d.tries;$('dlyLeft').textContent=left>0?t('dlyLeft',left):t('dlyDone');$('openDaily').classList.toggle('done',left<=0)}
function startDaily(){const d=dailyInfo();if(d.tries>=DAILY_TRIES){toast(t('dlyNoTries'));openRank();setRankTab('day');return}
  d.tries++;if(d.tries===1)S.dly.days++;save();mode='daily';startGame();run.dk=d.k}
$('openDaily').onclick=startDaily;
function dailyAfterRun(sc){const el=$('oRank');el.hidden=true;
  // a partida começou num dia e terminou no outro (meia-noite UTC): não vale pro ranking de hoje
  if(run.dk&&run.dk!==dayKey()){$('oDly').innerHTML=`<b>${t('dlyTag')}</b><br>${t('dlyExpired')}`;$('oDly').hidden=false;$('again').textContent=t('again');return}
  const d=dailyInfo();const left=DAILY_TRIES-d.tries;
  $('oDly').innerHTML=`<b>${t('dlyTag')}</b><br>${left>0?t('dlyLeftLong',left):t('dlyOver')}`;$('oDly').hidden=false;
  $('again').textContent=left>0?t('dlyAgain'):t('again');
  const why=runVerdict(sc);if(why.length){S.lb.flag=(S.lb.flag||0)+1;S.lb.why=why.join(',');save();if(sc>0){el.innerHTML=`<span>${t('rkNotSent')}</span>`;el.hidden=false}return}
  if(sc>d.best){d.best=sc;S.dly.bestEver=Math.max(S.dly.bestEver,sc)}save();
  const on=OL();if(!on||d.best<=d.sent||d.best<=0){showDayPos();return}
  on.submit(dayKey(),d.best,S.lb.name,S.lb.cc).then(()=>{d.sent=d.best;save();rkCache={};showDayPos()}).catch(()=>{});
}
async function showDayPos(){const on=OL(),d=dailyInfo();if(!on||!d.sent||$('over').hidden)return;
  try{const pos=await on.rank(dayKey(),d.sent);if($('over').hidden)return;$('oRank').innerHTML=`<span>${flag(S.lb.cc)} <b>#${pos}</b> ${t('rkInDay')}</span>`;$('oRank').hidden=false}catch(e){}}
async function checkDailyPrize(){const on=OL();if(!on)return;const keys=[];for(let k=1;k<=7;k++){const dk=dayKey(new Date(nowSrv()-k*864e5));if(dk===S.dwon.chk)break;keys.push(dk)}
  for(const pk of keys.reverse()){try{let top=await on.top(pk,5);top=dedupeRows(top,on.uid());const idx=top.findIndex(r=>r.id===on.uid());
    if(idx>=0&&idx<3&&top[idx].s>0&&!S.dwon[pk]){const g=DPRIZE[idx];S.dwon[pk]=idx+1;S.gems+=g;wallet();bump('pGems');sfx.fanfare();toast(t('dlyWon',idx+1,g))}
    S.dwon.chk=pk;save()}catch(e){return}}}
// voltou pro app (ex.: deixou aberto de um dia pro outro): confere prêmios e reenvia o que faltou
let resumeAt=0;function onResumeOnline(){if(Date.now()-resumeAt<60000)return;resumeAt=Date.now();const on=OL();if(!on)return;
  syncScores().then(()=>{checkPrize();checkDailyPrize()}).catch(()=>{})}
/* ---- estatísticas ---- */
function trackStats(){const st=S.st;st.runs++;st.floors+=score;st.perf+=perfects;st.combo=Math.max(st.combo,maxCombo);st.time+=Math.round((run.play||0)/1000)}

/* ---- conquistas (no jogo + Google Play Games) ---- */
const ACH=[
 {id:'first',ic:'play',c:['#7fe3ff','#2a7fd6'],n:1,f:()=>S.st.runs},
 {id:'f25',ic:'25',c:['#a8e8ff','#3d8fd6'],n:25,f:()=>Math.max(S.best,S.dly.bestEver)},
 {id:'f50',ic:'50',c:['#8dffc9','#1f9c62'],n:50,f:()=>Math.max(S.best,S.dly.bestEver)},
 {id:'f100',ic:'100',c:['#c9b3ff','#5a3fd6'],n:100,f:()=>Math.max(S.best,S.dly.bestEver)},
 {id:'f150',ic:'150',c:['#ffb3e6','#b0268a'],n:150,f:()=>Math.max(S.best,S.dly.bestEver)},
 {id:'f250',ic:'250',c:['#ffd27a','#d9560b'],n:250,f:()=>Math.max(S.best,S.dly.bestEver)},
 {id:'c5',ic:'x5',c:['#fff09a','#d99a0b'],n:5,f:()=>S.st.combo},
 {id:'c10',ic:'x10',c:['#ffae8a','#d6362f'],n:10,f:()=>S.st.combo},
 {id:'p100',ic:'star',c:['#fff3b0','#e0a100'],n:100,f:()=>S.st.perf},
 {id:'r100',ic:'runs',c:['#b8f5d0','#2a9d6a'],n:100,f:()=>S.st.runs},
 {id:'daily',ic:'cal',c:['#9ff0ff','#1f8fb8'],n:1,f:()=>S.dly.days},
 {id:'top10',ic:'trophy',c:['#ffe79a','#c7870e'],n:1,f:()=>S.st.bestPos&&S.st.bestPos<=10?1:0},
 {id:'skins10',ic:'skins',c:['#ffc2f3','#8a2bd6'],n:10,f:()=>S.owned.length},
];
// IDs das conquistas criadas no Play Console (Serviços do Play Games → Conquistas). Vazio = só no jogo.
const PGS_ACH={};
function pgsUnlock(id){const g=N&&N.games;if(g&&PGS_ACH[id]&&typeof clPlayer!=='undefined'&&clPlayer)g.unlock(PGS_ACH[id])}
function pgsSyncAll(){for(const id in S.ach)pgsUnlock(id)}
function checkAch(){const got=[];for(const a of ACH){if(S.ach[a.id])continue;if(a.f()>=a.n){S.ach[a.id]=Date.now();got.push(a);pgsUnlock(a.id)}}
  if(got.length){save();got.forEach((a,k)=>setTimeout(()=>{toast(t('achGot',t('ach_'+a.id)));sfx.fanfare()},900+k*1800))}}
const ICONS={};
function achIcon(a,sz=96,sq=false){const key=a.id+sz+sq;if(ICONS[key])return ICONS[key];const cv=document.createElement('canvas');cv.width=cv.height=sz;const c=cv.getContext('2d');const u=sz/96;c.scale(u,u);
  const g=c.createLinearGradient(0,0,0,96);g.addColorStop(0,a.c[0]);g.addColorStop(1,a.c[1]);c.fillStyle=g;rr(c,0,0,96,96,sq?0:22);c.fill();
  c.fillStyle='rgba(255,255,255,.25)';rr(c,0,0,96,40,sq?0:22);c.fill();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=3;c.beginPath();c.arc(48,48,34,0,TAU);c.stroke();
  c.fillStyle='#fff';c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=5;c.lineJoin='round';c.textAlign='center';c.textBaseline='middle';
  const txt=s=>{c.font=`${s.length>=3?26:32}px Bungee, Impact, sans-serif`;c.strokeText(s,48,51);c.fillText(s,48,51)};
  const path=d=>{c.save();c.translate(20,20);c.scale(56/24,56/24);const p=new Path2D(d);c.lineWidth=2;c.stroke(p);c.fill(p);c.restore()};
  ({play:()=>path('M8 5v14l11-7z'),star:()=>path('M12 3l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.4l-5.2 2.8 1-5.9L3.5 9.2l5.9-.8z'),
    runs:()=>path('M5 18h14v2H5zM7 14h10v3H7zM9 10h6v3H9zM10.5 6h3v3h-3z'),cal:()=>path('M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 4v9h14v-9zM8 3h2v4H8zm6 0h2v4h-2z'),
    trophy:()=>path('M7 3h10v3h3v2a4 4 0 0 1-4 4 5 5 0 0 1-3 2.7V17h3v3H8v-3h3v-2.3A5 5 0 0 1 8 12a4 4 0 0 1-4-4V6h3z'),
    skins:()=>path('M4 15h16v4H4zM6 10h12v4H6zM8 5h8v4H8z')}[a.ic]||(()=>txt(a.ic)))();
  return ICONS[key]=cv.toDataURL()}

/* ---- perfil do jogador ---- */
const MEDC={1:'linear-gradient(160deg,#ffe79a,#e0a100)',2:'linear-gradient(160deg,#f4f7fc,#9aa6ba)',3:'linear-gradient(160deg,#f3b27a,#b0662c)'};
function fmtTime(s){const h=Math.floor(s/3600),m=Math.floor(s%3600/60);return h?`${h}h ${m}min`:`${m}min`}
function openPP(){hideAll();$('pp').hidden=false;checkAch();
  const ms=monthBest(),tr=tierOf(ms),trBest=tierOf(Math.max(S.best,ms));
  $('ppHead').innerHTML=`<span class="fl">${flag(S.lb.cc)}</span><div><div class="nm">${esc(S.lb.name)}</div><div class="tr">${tr?tierSVG(tr,20)+t('tier_'+tr.k):`<span style="color:var(--muted)">${t('tierNone')}</span>`}</div><div class="lv">${t('level')} ${S.lvl}${trBest&&trBest!==tr?' · '+t('tierBest',t('tier_'+trBest.k)):''}</div></div>`;
  const st=S.st;const rows=[[S.best,t('best')],[ms,t('ppMonth')],[st.runs,t('ppRuns')],[st.floors,t('ppFloors')],[st.perf,t('ppPerf')],[st.combo,t('ppCombo')],[S.dly.bestEver,t('ppDaily')],[st.bestPos?'#'+st.bestPos:'—',t('ppPos')],[fmtTime(st.time),t('ppTime')],[Object.keys(S.ach).length+'/'+ACH.length,t('ppAch')]];
  $('ppStats').innerHTML=rows.map(r=>`<div><b>${r[0]}</b><span>${r[1]}</span></div>`).join('');
  $('ppMed').innerHTML=S.med.length?S.med.slice().reverse().map(m=>`<div class="md"><i style="background:${MEDC[m.p]||'linear-gradient(160deg,#9ff0ff,#2a7fd6)'}">${m.p}</i>${monthLabel(m.k)}</div>`).join(''):`<div class="none">${t('ppNoMed')}</div>`;
  $('ppAch').innerHTML=ACH.map(a=>{const ok=!!S.ach[a.id];const v=Math.min(a.f(),a.n);return `<div class="ach${ok?'':' lock'}"><img src="${achIcon(a)}" alt=""><div style="flex:1"><b>${t('ach_'+a.id)}</b><span>${t('achd_'+a.id)}</span>${!ok&&a.n>1?`<div class="bar"><i style="width:${v/a.n*100}%"></i></div>`:''}</div>${ok?'<span style="font-size:20px">✅</span>':''}</div>`}).join('');
  $('ppPG').hidden=!(N&&N.games&&typeof clPlayer!=='undefined'&&clPlayer&&Object.keys(PGS_ACH).length)}
$('openPP').onclick=openPP;$('closePP').onclick=showMenu;
$('ppShare').onclick=()=>shareCard(Math.max(S.best,monthBest()));
$('ppPG').onclick=()=>{N&&N.games&&N.games.showAchievements().catch(()=>toast(t('clFail')))};

/* ---- card de recorde pra compartilhar ---- */
function makeCard(sc){const Wc=1080,Hc=1350,cv=document.createElement('canvas');cv.width=Wc;cv.height=Hc;const c=cv.getContext('2d');
  const wd=WORLDS[worldOf(sc)];const col=a=>`rgb(${a.join(',')})`;const g=c.createLinearGradient(0,0,0,Hc);g.addColorStop(0,col(wd.top));g.addColorStop(1,col(wd.bot));c.fillStyle=g;c.fillRect(0,0,Wc,Hc);
  for(let k=0;k<120;k++){c.fillStyle=`rgba(255,255,255,${.25+hash(k*3.3)*.6})`;const s=1.5+hash(k*7.1)*3;c.fillRect(hash(k*1.7)*Wc,hash(k*2.9)*Hc*.7,s,s)}
  // torre com a skin do jogador
  c.save();c.translate(Wc/2,Hc-110);c.scale(2.3,2.3);const n=6;for(let k=0;k<n;k++){const w=170-k*6+(k%3)*4,x=-w/2+Math.sin(k*1.7)*7;block(x,-BH*(k+1),w,k,1,c)}c.restore();
  {const sh=c.createLinearGradient(0,700,0,800);sh.addColorStop(0,'rgba(10,8,30,0)');sh.addColorStop(1,'rgba(10,8,30,0)');}
  // logo
  const cols=['#ff5d8f','#ffc23d','#5ee0ff','#4fe39a','#8b7bff','#ff9a3d','#ff5d8f','#5ee0ff'];let ci=0;
  const tile=(ch,x,y)=>{c.fillStyle=cols[(ci++)%cols.length];rr(c,x,y,74,74,16);c.fill();c.fillStyle='rgba(255,255,255,.3)';rr(c,x,y,74,14,8);c.fill();c.fillStyle='#fff';c.font='44px Bungee, Impact, sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(ch,x+37,y+40)};
  [...'BIG'].forEach((ch,k)=>tile(ch,Wc/2-120+k*82,50));[...'STACK'].forEach((ch,k)=>tile(ch,Wc/2-202+k*82,134));
  c.textAlign='center';c.textBaseline='alphabetic';c.fillStyle='#fff';c.font='190px Bungee, Impact, sans-serif';c.lineWidth=14;c.strokeStyle='rgba(0,0,0,.35)';c.strokeText(String(sc),Wc/2,420);c.fillText(String(sc),Wc/2,420);
  c.font='900 40px Nunito, sans-serif';c.fillStyle='#ffc23d';c.fillText(t('floors').toUpperCase(),Wc/2,480);
  // jogador
  const tr=tierOf(Math.max(monthBest(),mode==='daily'?0:sc));c.font='900 48px Nunito, sans-serif';const nm=`${flag(S.lb.cc)} ${S.lb.name}`;const nw=c.measureText(nm).width+(tr?70:0);const px=Wc/2-nw/2;
  c.fillStyle='rgba(10,8,30,.72)';rr(c,px-30,550,nw+60,96,48);c.fill();c.strokeStyle='rgba(255,255,255,.15)';c.lineWidth=2;rr(c,px-30,550,nw+60,96,48);c.stroke();if(tr)drawTier(c,tr,px,566,62);c.fillStyle='#fff';c.textAlign='left';c.fillText(nm,px+(tr?70:0),620);
  c.textAlign='center';if(S.st.lastPos){c.font='900 40px Nunito, sans-serif';c.fillStyle='#fff';c.fillText(t('cardPos',S.st.lastPos),Wc/2,710)}
  c.fillStyle='rgba(10,8,30,.7)';c.fillRect(0,Hc-110,Wc,110);c.fillStyle='#fff';c.font='900 42px Nunito, sans-serif';c.fillText(t('cardCta'),Wc/2,Hc-62);c.font='800 30px Nunito, sans-serif';c.fillStyle='#b8b3e6';c.fillText(t('cardGet'),Wc/2,Hc-22);
  return cv.toDataURL('image/png')}
const STORE_URL='https://play.google.com/store/apps/details?id=com.bighouse.bigstack';
async function shareCard(sc){if(!sc){toast(t('rkNoScore'));return}const url=makeCard(sc);const txt=t('shareTxt',sc)+' '+STORE_URL;
  if(N&&N.share){try{await N.share(url,txt);return}catch(e){}}
  try{const blob=await (await fetch(url)).blob();const f=new File([blob],'bigstack.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],text:txt});return}}catch(e){}
  const a=document.createElement('a');a.href=url;a.download='bigstack-recorde.png';a.click()}
$('overShare').onclick=()=>shareCard(score);
function overExtras(){if(mode!=='daily'){$('oDly').hidden=true;$('again').textContent=t('again')}}
