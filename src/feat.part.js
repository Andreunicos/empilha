/* ================= JOGABILIDADE (v1.6): chefão, blocos especiais, câmera lenta, vibração com ritmo ================= */
/* ---- CHEFÃO a cada 50 andares: 10 blocos com uma regra maluca; passou = baú grande + figurinha ---- */
const BOSS_TYPES=['ghost','flip','fast','shrink'];
const bossOk=()=>mode!=='zen'&&mode!=='time';
function bossStart(){const k=BOSS_TYPES[((score/50|0)-1)%BOSS_TYPES.length];run.boss={k,left:10};sfx.fall();setTimeout(()=>sfx.power(),120);vib('boss');shake=Math.max(shake,6);
  setTimeout(()=>{banner(t('bossT'),t('boss_'+k));sfx.whoosh()},200);tip('boss',t('tipBoss'),'mid')}
function bossStep(){const b=run.boss;if(!b)return;b.left--;if(b.left>0)return;run.boss=null;run.bossWins=(run.bossWins||0)+1;
  const cg=60+Math.floor(score/2);run.chest+=cg;run.chests++;const y=yOf(stack.length-1);addFloat(W/2,y-60,t('bossWin'),'#ffc23d',24);addFloat(W/2,y-30,'+'+cg,'#ffc23d',20);burst(W/2,y,0,50,'#ffc23d');sfx.fanfare();vib('bossWin');
  const st=dropSticker();(run.stk=run.stk||[]).push(st.ic);setTimeout(()=>addFloat(W/2,yOf(stack.length-1)-80,(st.dup?'+40 ':'')+t('stkGot',st.ic),'#4fe39a',22),500)}
// o que o chefão faz com o bloco que está andando
function bossMove(m,dt){const b=run&&run.boss;if(!b||state!=='play')return 1;
  if(b.k==='fast')return 1.35;
  if(b.k==='flip'){if(m.fx==null)m.fx=W*(.25+Math.random()*.5);const c=m.x+m.w/2;if(!m.flipped&&((m.dir>0&&c>m.fx)||(m.dir<0&&c<m.fx))){m.flipped=true;if(Math.random()<.6)m.dir*=-1}}
  if(b.k==='shrink'){if(m.bw==null)m.bw=m.w;m.w=m.bw*(.86+.14*Math.abs(Math.sin(tNow*.004)))}
  return 1}
// fantasma: o bloco some no meio da tela
function bossAlpha(m){const b=run&&run.boss;if(!b||b.k!=='ghost'||state!=='play')return 1;const c=(m.x+m.w/2)/W;return c>.3&&c<.7?.07:c>.22&&c<.78?.5:1}

/* ---- BLOCOS ESPECIAIS (a partir do andar 10): OURO dá moedas, VIDRO dá bônus se cair perfeito, GELO escorrega um pouco ---- */
const SPB={gold:{col:'#ffc23d',ic:'★'},glass:{col:'#bfeaff',ic:'◆'},ice:{col:'#7fd1ff',ic:'❄'}};
function specialPick(m){if(mode==='zen'||score<10||m.pw||run.boss)return;const r=rnd();m.sp=r<.05?'gold':r<.09?'glass':r<.13?'ice':null}
function specialLand(m,b,perfect,cut){if(!m.sp)return;const x=b.x+b.w/2,y=yOf(b.i);
  if(m.sp==='gold'){run.blocks+=5;addFloat(x,y-34,'+5 '+t('sp_gold'),'#ffc23d',18);burst(x,y+BH/2,0,20,'#ffc23d');sfx.coin()}
  if(m.sp==='glass'){if(perfect){run.perf+=15;addFloat(x,y-34,'+15 '+t('sp_glass'),'#bfeaff',19);burst(x,y+BH/2,0,26,'#e6f8ff');sfx.coin()}else{if(cut){const d=debris[debris.length-1];if(d&&d.i===b.i){debris.pop();for(let k=0;k<16;k++)parts.push({x:d.x+Math.random()*d.w,y:d.y+Math.random()*BH,vx:(Math.random()-.5)*5,vy:-Math.random()*4,l:1,col:k%2?'#e6f8ff':'#9fd8f5'})}}addFloat(x,y-34,t('sp_glassBreak'),'#bfeaff',16)}}
  if(m.sp==='ice'&&!perfect){const d=clamp(b.x+m.dir*Math.min(10,b.w*.06),0,W-b.w)-b.x;if(Math.abs(d)>.5){b.sl={x0:b.x,d,t0:tNow};addFloat(x,y-34,t('sp_ice'),'#7fd1ff',16)}}}
// gelo escorregando (atualiza a posição do bloco de cima por 350 ms)
function iceStep(){const b=stack[stack.length-1];if(!b||!b.sl)return;const k=Math.min(1,(tNow-b.sl.t0)/350),e=1-Math.pow(1-k,3);b.x=b.sl.x0+b.sl.d*e;if(k>=1)b.sl=null}
function specialDraw(m,y){if(!m.sp)return;const s=SPB[m.sp],p=.5+.5*Math.sin(tNow*.012);ctx.save();ctx.strokeStyle=s.col;ctx.globalAlpha=.55+.45*p;ctx.lineWidth=3;rr(ctx,m.x-2,y-2,m.w+4,BH+4,7);ctx.stroke();ctx.globalAlpha=1;
  if(m.sp==='glass'){ctx.globalAlpha=.25+.2*p;ctx.fillStyle='#fff';rr(ctx,m.x,y,m.w,BH,5);ctx.fill();ctx.globalAlpha=1}
  if(m.sp==='gold'){for(let k=0;k<3;k++){const a=tNow*.005+k*2.1,sx=m.x+m.w/2+Math.cos(a)*(m.w/2+6),sy=y+BH/2+Math.sin(a)*(BH/2+6);ctx.fillStyle='#fff3b0';ctx.fillRect(sx-1.5,sy-1.5,3,3)}}
  const L=pwLabel(s.ic+' '+t('sp_'+m.sp),s.col);ctx.drawImage(L.cv,m.x+m.w/2-L.w/2,y+7,L.w,L.h);ctx.restore()}

/* ---- CÂMERA LENTA no combo 10, 20, 30... ---- */
let slowT=0;
function comboSlow(c){if(c>0&&c%10===0){slowT=tNow+1100;flash=RM()?0:1.2;addFloat(W/2,yOf(stack.length)-70,t('comboFire',c),'#ff9a3d',26);vib('combo10');sfx.fanfare()}}
const slowK=()=>tNow<slowT?.35:1;
function slowDraw(){if(tNow>=slowT)return;const k=(slowT-tNow)/1100;ctx.save();ctx.globalAlpha=.18*k;ctx.strokeStyle='#ffd46b';ctx.lineWidth=18;ctx.strokeRect(0,0,W,H);ctx.restore()}

/* ---- VIBRAÇÃO COM RITMO ---- */
const VIB={perfect:[14],combo:[10,30,14],combo10:[20,30,20,30,60],chest:[25,40,25],boss:[80,50,80],bossWin:[30,40,30,40,90]};
function vib(k){buzz(VIB[k]||[10])}

/* ---- ACESSIBILIDADE ---- */
const RM=()=>!!S.settings.rm;
function a11yApply(){document.body.classList.toggle('bigtxt',!!S.settings.big);document.body.classList.toggle('cblind',!!S.settings.cb);document.body.classList.toggle('rmotion',RM())}
a11yApply();

/* ---- TELA DE FIM: gráfico de precisão e dica ---- */
function precisionHTML(){const E=(run.errs||[]).slice(-36);if(E.length<4)return '';let early=0,late=0,perf=0;
  const bars=E.map(e=>{const r=Math.min(1,e.e/(e.tol*3||1)),p=e.e<e.tol;if(p)perf++;else if(e.d<0)early++;else late++;return `<i class="${p?'p':r>.66?'b':'m'}" style="height:${Math.round(18+ (1-r)*82)}%"></i>`}).join('');
  const tipK=perf/E.length>.7?'accGreat':early>late*1.5?'accEarly':late>early*1.5?'accLate':'accMix';
  return `<div class="acc"><div class="ah"><b>${t('accT')}</b><span>${Math.round(perf/E.length*100)}% ${t('accPerf')}</span></div><div class="abars">${bars}</div><p>${t(tipK)}</p></div>`}
