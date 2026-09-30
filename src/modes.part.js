/* ================= MODOS DE JOGO (v1.6) =================
   Clássico (vale ranking), Desafio diário (já existia), Contra o tempo (60 s), Desafio da semana (regra especial
   que muda toda segunda), Torre estreita (nível 10) e Zen (não perde, sem prêmios).
   Só o Clássico e o Diário vão pro ranking online; os outros guardam o recorde no celular. */
S.mb=Object.assign({time:0,narrow:0,zen:0,wk:{n:-1,best:0}},S.mb||{});
S.selMode=S.selMode||'normal';
const WEEK_RULES=['wind','crazy','narrow','fast','magnet'];
// semana começando na segunda (hora do servidor)
const weekNo=()=>Math.floor((nowSrv()/864e5+3)/7);
const weekRule=()=>WEEK_RULES[((weekNo()%WEEK_RULES.length)+WEEK_RULES.length)%WEEK_RULES.length];
const weekLeftD=()=>Math.max(1,Math.ceil((((weekNo()+1)*7-3)*864e5-nowSrv())/864e5));
const wkBest=()=>S.mb.wk.n===weekNo()?S.mb.wk.best:0;
// regras de cada modo
const MR={
  normal:{ranked:1,powers:1,revive:1,rw:1},
  daily:{ranked:1,rw:1},
  time:{powers:1,rw:1,keep:'penalty',timer:60000},
  weekly:{powers:1,rw:1},
  narrow:{powers:1,revive:1,rw:1.25,base:.34},
  zen:{keep:'free',calm:1,rw:0}
};
const MODES=[
  {k:'normal',ic:'🏗️',c:['#ffd46b','#ff9a3d']},
  {k:'daily',ic:'📅',c:['#6fd0ff','#2a86d8']},
  {k:'time',ic:'⏱️',c:['#ff7a9c','#e0305a']},
  {k:'weekly',ic:'🎯',c:['#c7b3ff','#7a5ae0']},
  {k:'narrow',ic:'📏',c:['#6ff0a8','#1fa864'],lvl:10},
  {k:'zen',ic:'🌙',c:['#a8e6ff','#5aa8ec']}
];
const MRc=()=>MR[mode]||MR.normal;
const modeLocked=m=>m.lvl&&S.lvl<m.lvl;
const wkRuleOn=r=>mode==='weekly'&&weekRule()===r;
// largura inicial da torre no modo atual
const baseW=()=>(MRc().base||(wkRuleOn('narrow')?.34:BASEW));
// perigos: zen não tem; desafio da semana pode ligar vento/velocidade maluca desde o começo
const hazOff=()=>!!MRc().calm;
function modeBest(k){return k==='normal'?S.best:k==='daily'?(S.dly.k===dayKey()?S.dly.best:0):k==='weekly'?wkBest():(S.mb[k]||0)}
function modeSub(m){if(modeLocked(m))return t('mLock',m.lvl);
  if(m.k==='daily'){const d=dailyInfo(),left=DAILY_TRIES-d.tries;return left>0?t('dlyTries',left):t('dlyDone')}
  if(m.k==='weekly')return t('wr_'+weekRule())+' · '+t('daysLeft',weekLeftD());
  if(m.k==='zen')return t('m_zenS');
  if(m.k==='normal')return t('m_normalS');const b=modeBest(m.k);return b?t('bestN',b):t('m_'+m.k+'S')}
function startMode(k){const m=MODES.find(x=>x.k===k)||MODES[0];if(modeLocked(m)){toast(t('mLock',m.lvl));buzz(30);return}
  S.selMode=m.k;if(m.k==='daily'){startDaily();return}mode=m.k;startGame()}
// fim da partida nos modos que não são de ranking: guarda o recorde do modo
function modeAfterRun(sc){let isNew=false;
  if(mode==='weekly'){if(S.mb.wk.n!==weekNo())S.mb.wk={n:weekNo(),best:0};if(sc>S.mb.wk.best){S.mb.wk.best=sc;isNew=sc>0}}
  else if(mode in S.mb&&mode!=='zen'){if(sc>S.mb[mode]){S.mb[mode]=sc;isNew=sc>0}}
  save();$('oRank').hidden=false;$('oRank').innerHTML=`<span>${(MODES.find(m=>m.k===mode)||{}).ic||''} ${t('mode_'+mode)}</span><b>${isNew?t('modeNew'):t('bestN',modeBest(mode))}</b>`}
// tag do modo no placar e cronômetro do Contra o tempo
function modeHud(){const tag=$('dlyTag');if(mode==='normal'){tag.hidden=true}else{tag.hidden=false;tag.textContent=(MODES.find(m=>m.k===mode)||{}).ic+' '+t('mode_'+mode).toUpperCase()}
  $('tmr').hidden=mode!=='time';if(mode==='time')tmrUI()}
function tmrUI(){const s=Math.max(0,Math.ceil(run.tl/1000));const el=$('tmr');const txt=s+'s';if(el.textContent!==txt){el.textContent=txt;el.classList.toggle('low',s<=10)}}
// errou no Contra o tempo ou no Zen: o bloco cai, mas a torre continua (no tempo custa 5 s)
function missKeep(m){debris.push({x:m.x,w:m.w,y:yOf(m.i),vy:0,vx:m.dir*1.5,r:0,vr:m.dir*.05,i:m.i});moving=null;sfx.fall();buzz([40,30,60]);combo=0;setCombo('');
  if(MRc().keep==='penalty'){run.tl-=5000;addFloat(W/2,yOf(stack.length)-20,'-5s','#ff5d8f',24);shake=8;tmrUI()}
  spawn()}
