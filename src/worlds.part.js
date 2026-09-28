/* ================= WORLDS ================= */
const WORLDS=[
 {at:0,name:'CIDADE',top:[43,27,79],bot:[224,115,106]},
 {at:25,name:'NUVENS',top:[46,120,200],bot:[160,215,245]},
 {at:50,name:'AURORA',top:[6,18,31],bot:[18,70,80]},
 {at:100,name:'ESPAÇO',top:[2,1,10],bot:[20,10,42]},
 {at:150,name:'GALÁXIA',top:[14,4,34],bot:[58,16,82]},
 {at:200,name:'NEBULOSA',top:[6,18,44],bot:[70,18,74]},
 {at:250,name:'BURACO NEGRO',top:[0,0,2],bot:[34,12,6]},
 {at:300,name:'CRISTAL',top:[16,8,52],bot:[26,84,120]},
 {at:400,name:'INFINITO',top:[4,2,16],bot:[40,6,60]},
];
const EVENT={1:'Cuidado com o vento',2:'Blocos em velocidade maluca',3:'Velocidade máxima maior'};
const worldOf=f=>{let k=0;for(let j=0;j<WORLDS.length;j++)if(f>=WORLDS[j].at)k=j;return k};
let skyF=0,city=[],clouds=[],stars=[];
let cityW=0;
function buildCity(){if(city.length&&Math.abs(W-cityW)<40)return;cityW=W;city=[];let x=-10;while(x<W+10){const w=26+Math.random()*40,h=40+Math.random()*120;city.push({x,w,h,win:Array.from({length:12},()=>Math.random()<.35)});x+=w+4}CITY.cv=null}
for(let k=0;k<26;k++)clouds.push({f:14+k*2.2+Math.random()*2,x:Math.random(),s:.6+Math.random()*.8,v:(Math.random()-.5)*.0004});
for(let k=0;k<90;k++)stars.push({x:Math.random(),y:Math.random(),s:Math.random()*1.8+.4,p:Math.random()*6});

/* ---- desempenho do cenário ----
   O fundo (céu, estrelas, aurora, espaço e nuvens) é desenhado numa imagem de resolução menor e ampliada de uma vez:
   é tudo suave/desfocado, então fica igual na tela e custa ~4x menos pixels. Quando a câmera está parada, o fundo
   é redesenhado a 30 fps (o que mexe ali é lento: estrelas piscando, nuvens, planetas).
   Cidade e nuvem viram imagens prontas (feitas 1 vez); degradês são guardados e só refeitos quando a cor muda. */
const BG={cv:null,c:null,s:0,odd:false,t:0,dirty:true};
function bgEnsure(){const s=Math.max(.75,DPR*.5),pw=Math.max(1,Math.ceil(W*s)),ph=Math.max(1,Math.ceil(H*s));
  if(!BG.cv){BG.cv=document.createElement('canvas');BG.c=BG.cv.getContext('2d',{alpha:false})}
  if(BG.cv.width!==pw||BG.cv.height!==ph||BG.s!==s){BG.cv.width=pw;BG.cv.height=ph;BG.s=s;BG.dirty=true;CLOUD.cv=null}
  BG.c.setTransform(s,0,0,s,0,0)}
// cor do céu sem criar lixo na memória: só monta o texto/degradê quando a cor muda de verdade
const SKY={k:'',g:null,h:0};
function skyMix(key,o){let r=WORLDS[0][key][0],g=WORLDS[0][key][1],b=WORLDS[0][key][2];for(let k=1;k<WORLDS.length;k++){const t=clamp((skyF-(WORLDS[k].at-8))/8,0,1);if(t<=0)continue;const c=WORLDS[k][key];r+=(c[0]-r)*t;g+=(c[1]-g)*t;b+=(c[2]-b)*t}o[0]=r|0;o[1]=g|0;o[2]=b|0}
const SKT=[0,0,0],SKB=[0,0,0];
function skyGrad(c){skyMix('top',SKT);skyMix('bot',SKB);const k=((SKT[0]<<16|SKT[1]<<8|SKT[2])*16777216+(SKB[0]<<16|SKB[1]<<8|SKB[2]))+'_'+H;
  if(SKY.k!==k||!SKY.g){SKY.k=k;const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgb(${SKT[0]},${SKT[1]},${SKT[2]})`);g.addColorStop(1,`rgb(${SKB[0]},${SKB[1]},${SKB[2]})`);SKY.g=g}return SKY.g}
// degradês da aurora guardados por faixa e intensidade (a forma da onda continua animada)
const AUG={};function auGrad(c,b,au,base){const q=Math.round(au*30),k=b+'_'+q+'_'+H;let g=AUG[k];if(g)return g;
  g=c.createLinearGradient(0,base-30,0,base+70);g.addColorStop(0,'rgba(90,255,170,0)');g.addColorStop(.4,`rgba(${b?120:80},255,${b?220:160},${(.22*q/30).toFixed(3)})`);g.addColorStop(1,'rgba(90,255,170,0)');return AUG[k]=g}
// nuvem pronta (mesma forma de antes, em imagem)
const CLOUD={cv:null};function cloudSprite(){if(CLOUD.cv)return CLOUD.cv;const U=1.4*(BG.s||1),cv=document.createElement('canvas');cv.width=Math.ceil(84*U);cv.height=Math.ceil(52*U);
  const c=cv.getContext('2d');c.scale(U,U);c.translate(20,32);c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.arc(0,0,18,0,7);c.arc(20,-8,22,0,7);c.arc(44,0,17,0,7);c.rect(0,0,44,17);c.fill();return CLOUD.cv=cv}
// cidade pronta: sol + prédios + janelas numa imagem só (nítida, na resolução da tela)
const CITY={cv:null,k:''};const CITY_H=200;
function citySprite(){const k=W+'_'+DPR+'_'+city.length;if(CITY.cv&&CITY.k===k)return CITY.cv;const d=DPR||1,cv=document.createElement('canvas');cv.width=Math.ceil(W*d);cv.height=Math.ceil(CITY_H*d);
  const c=cv.getContext('2d');c.scale(d,d);const gy=CITY_H;c.fillStyle='rgba(255,210,150,.25)';c.beginPath();c.arc(W*.72,gy-150,46,0,7);c.fill();
  for(const b of city){c.fillStyle='rgba(30,16,56,.75)';c.fillRect(b.x,gy-b.h,b.w,b.h);c.fillStyle='rgba(255,215,120,.55)';b.win.forEach((on,k)=>{if(!on)return;const cx=b.x+5+(k%3)*((b.w-10)/3),cy=gy-b.h+8+Math.floor(k/3)*16;if(cy<gy-6)c.fillRect(cx,cy,5,7)})}
  CITY.cv=cv;CITY.k=k;return cv}
// fundo (desenhado no contexto que estiver em ctx: a imagem do fundo)
function drawBG(){
  ctx.fillStyle=skyGrad(ctx);ctx.fillRect(0,0,W,H);
  const nightA=clamp((skyF-40)/15,0,1)*.9+.25*(1-clamp(skyF/20,0,1));
  if(nightA>.02)for(const s of stars){const a=nightA*(.4+.6*Math.abs(Math.sin(tNow*.001+s.p)));if(a<.02)continue;ctx.fillStyle=WA[Math.min(20,Math.round(a*20))];ctx.fillRect(s.x*W,((s.y*H+cam*.08)%H),s.s,s.s)}
  // aurora
  const au=clamp((skyF-44)/8,0,1)*(1-clamp((skyF-96)/8,0,1));
  if(au>0){for(let b=0;b<3;b++){ctx.beginPath();const base=H*(.18+b*.12);ctx.moveTo(0,base);for(let X=0;X<=W;X+=10)ctx.lineTo(X,base+Math.sin(X*.012+tNow*.0006*(b+1)+b)*26);ctx.lineTo(W,base+70);ctx.lineTo(0,base+70);ctx.fillStyle=auGrad(ctx,b,au,base);ctx.fill()}}
  drawScenery();
  // nuvens (andam pelo tempo real, não por frame: mesma velocidade em 60/90/120 Hz)
  const bdt=Math.min(4,Math.max(0,(tNow-BG.t)/16.667));BG.t=tNow;const windy=worldOf(score)===1&&state==='play',sp=cloudSprite();
  for(const cl of clouds){cl.x=(cl.x+(cl.v+(windy?windDir*.0012:0))*bdt+1)%1;const y=yOf(cl.f);if(y<-40||y>H+40)continue;const x=cl.x*(W+160)-80,s=cl.s;ctx.drawImage(sp,x-20*s,y-32*s,84*s,52*s)}
}
let BGD=false;
function drawWorld(){
  if(BGD){drawBG()}else{
  bgEnsure();BG.odd=!BG.odd;
  // câmera parada: fundo a 30 fps; câmera andando (depois de cada bloco): todo frame
  if(BG.dirty||BG.odd||Math.abs(camT-cam)>.3){const m=ctx;ctx=BG.c;try{drawBG()}finally{ctx=m}BG.dirty=false}
  ctx.drawImage(BG.cv,0,0,BG.cv.width,BG.cv.height,0,0,BG.cv.width/BG.s,BG.cv.height/BG.s);}
  // cidade
  const gy=yOf(0)+BH;
  if(gy-CITY_H<H){ctx.drawImage(citySprite(),0,gy-CITY_H,W,CITY_H);if(gy<H){ctx.fillStyle='#1a1030';ctx.fillRect(0,gy,W,H-gy)}}
}


/* ================= CENÁRIO DO ESPAÇO (acima do andar 100) =================
   Cada objeto fica "preso" a um andar e passa pela tela com parallax (p<1 = mais longe e mais devagar),
   então conforme a torre sobe, galáxias, planetas e buracos negros vão surgindo lá em cima e descendo. */
const TAU2=Math.PI*2;
const NEB=[[-.25,-.1,'255,90,200'],[.2,.05,'90,160,255'],[0,.2,'140,90,255'],[.3,-.25,'255,170,90'],[-.3,.3,'80,230,210']];
// nebulosa pronta: as 5 nuvens coloridas numa imagem só (em meia resolução: é tudo degradê suave).
// Antes eram 5 degradês gigantes por frame, cada um cobrindo a tela inteira.
let NS=null;function nebSprite(){const sc=Math.max(.35,(BG.s||1)*.5),k=W+'_'+H+'_'+sc;if(NS&&NS.k===k)return NS;
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;const bl=NEB.map(([dx,dy,c],k)=>{const R=W*(.45+hash(k)*.25),cx=dx*W,cy=dy*H;x0=Math.min(x0,cx-R);y0=Math.min(y0,cy-R);x1=Math.max(x1,cx+R);y1=Math.max(y1,cy+R);return {R,cx,cy,c}});
  const cv=document.createElement('canvas');cv.width=Math.ceil((x1-x0)*sc);cv.height=Math.ceil((y1-y0)*sc);const c=cv.getContext('2d');c.scale(sc,sc);c.translate(-x0,-y0);
  for(const b of bl){const g=c.createRadialGradient(b.cx,b.cy,0,b.cx,b.cy,b.R);g.addColorStop(0,`rgba(${b.c},.32)`);g.addColorStop(1,`rgba(${b.c},0)`);c.fillStyle=g;c.fillRect(b.cx-b.R,b.cy-b.R,b.R*2,b.R*2)}
  return NS={cv,k,x0,y0,w:x1-x0,h:y1-y0}}
const GAL=(()=>{const pts=[];for(let k=0;k<1100;k++){const arm=k%3,t=Math.random(),r=Math.pow(t,.8);const a=arm*TAU2/3+r*5.2+(Math.random()-.5)*.55*(1-r*.5);pts.push({r:r+(Math.random()-.5)*.04,a,s:Math.random()*1.6+.5,h:r<.25?45:Math.random()<.5?290:200,l:r<.25?85:65+Math.random()*25})}return pts})();
// galáxia pronta, guardada por tamanho (2 galáxias de tamanhos diferentes na tela não ficam refazendo a imagem todo frame)
// e na resolução do fundo (onde ela é desenhada)
const GSP=new Map();function galSprite(R){const d=BG.s||DPR||1,k=Math.round(R)*100+d;let cv0=GSP.get(k);if(cv0)return cv0;if(GSP.size>4)GSP.clear();const S2=Math.ceil((2*R+8)*d);const cv=document.createElement('canvas');cv.width=cv.height=S2;const c=cv.getContext('2d');c.scale(d,d);c.translate(R+4,R+4);
  for(const p of GAL){c.fillStyle=p.col||(p.col=hsl(p.h,90,p.l,.85));c.fillRect(Math.cos(p.a)*p.r*R,Math.sin(p.a)*p.r*R,p.s,p.s/.58)}GSP.set(k,cv);return cv}
const ROCKS=Array.from({length:14},(_,k)=>({x:Math.random(),y:(Math.random()-.5)*2,r:5+Math.random()*13,v:(Math.random()-.5)*.0002,sp:(Math.random()-.5)*.002,sides:6+(k%3)}));
const SCN=[
 {f:112,p:.7,k:'station',x:.78},
 {f:128,p:.3,k:'galaxy',x:.5,r:.62},
 {f:150,p:.85,k:'asteroids'},
 {f:172,p:.45,k:'giant',x:.25,r:70,c1:'#ffcf8a',c2:'#b2562e',ring:'rgba(255,225,170,.75)'},
 {f:200,p:.25,k:'nebula',x:.5},
 {f:214,p:.9,k:'comet',x:.2},
 {f:245,p:.35,k:'blackhole',x:.55,r:46},
 {f:272,p:.55,k:'whale',x:.3},
 {f:300,p:.4,k:'crystalp',x:.7,r:52},
 {f:335,p:.3,k:'wormhole',x:.5},
 {f:360,p:.6,k:'station',x:.25},
];
// depois do 360 os cenários continuam aparecendo, sorteados (mas sempre iguais pra cada andar)
const PROC=['galaxy','giant','asteroids','comet','planet','nebula','crystalp','station'];
const SCN_MEMO=[],SCN_L=[];
// degradês guardados (centrados em 0,0; o objeto é desenhado com translate), refeitos só se o tamanho mudar
const GC={};function cgrad(k,mk){return GC[k]||(GC[k]=mk())}
function sceneAt(n){return SCN_MEMO[n]||(SCN_MEMO[n]=sceneAt0(n))}
function sceneAt0(n){const f=390+n*32;const a=hash(n*7.7),b=hash(n*3.1+1);const k=PROC[(a*PROC.length)|0];
  return {f,p:k==='asteroids'||k==='comet'?.85:.3+b*.35,k,x:.2+b*.6,r:k==='galaxy'?.4+b*.25:40+b*40,c1:hsl(b*360,80,70),c2:hsl(b*360+40,70,35),ring:`hsla(${a*360},90%,80%,.7)`}}
function drawScenery(){
  if(skyF<85)return;
  const fade=clamp((skyF-88)/10,0,1);if(fade<=0)return;
  ctx.save();ctx.globalAlpha=fade;
  const list=SCN_L;list.length=0;for(const o of SCN)list.push(o);const top=Math.floor(Math.max(0,skyF-360)/32);for(let n=Math.max(0,top-3);n<=top+3;n++)list.push(sceneAt(n));
  const base=H*.35;
  for(const o of list){const y=base+(yOf(o.f)-base)*o.p;const rad=o.k==='galaxy'?W*(o.r||.6)*.65:o.k==='nebula'?W*.9:o.k==='asteroids'?H*1.1:o.k==='whale'||o.k==='wormhole'?W*.6:(o.r||60)*1.6+40;if(y-rad>H||y+rad<0)continue;const x=(o.x??.5)*W;ctx.globalAlpha=fade;DRAW[o.k](x,y,o)}
  ctx.restore();
}
const DRAW={
 galaxy(x,y,o){const R=W*(o.r||.6);const rot=tNow*.00004;const g=cgrad('gal'+R,()=>{const g=ctx.createRadialGradient(0,0,0,0,0,R*1.05);g.addColorStop(0,'rgba(255,230,190,.55)');g.addColorStop(.18,'rgba(200,120,255,.25)');g.addColorStop(.6,'rgba(90,60,200,.10)');g.addColorStop(1,'rgba(40,20,90,0)');return g});ctx.save();ctx.translate(x,y);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,R*1.05,R*.62,0,0,TAU2);ctx.fill();ctx.restore();
   const sp=galSprite(R);ctx.save();ctx.translate(x,y);ctx.scale(1,.58);ctx.rotate(rot);ctx.drawImage(sp,-R-4,-R-4,2*R+8,2*R+8);ctx.restore();
   const c=cgrad('galc'+R,()=>{const c=ctx.createRadialGradient(0,0,0,0,0,R*.16);c.addColorStop(0,'rgba(255,250,230,1)');c.addColorStop(1,'rgba(255,200,140,0)');return c});ctx.save();ctx.translate(x,y);ctx.fillStyle=c;ctx.beginPath();ctx.arc(0,0,R*.16,0,TAU2);ctx.fill();ctx.restore()},
 station(x,y){ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(tNow*.0004)*.25);ctx.fillStyle='#3b6bd6';ctx.fillRect(-52,-9,34,18);ctx.fillRect(18,-9,34,18);ctx.strokeStyle='rgba(180,210,255,.8)';ctx.lineWidth=1;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-52+k*8.5,-9);ctx.lineTo(-52+k*8.5,9);ctx.stroke();ctx.beginPath();ctx.moveTo(18+k*8.5,-9);ctx.lineTo(18+k*8.5,9);ctx.stroke()}
   ctx.fillStyle='#c9d1e3';ctx.fillRect(-18,-3,36,6);ctx.beginPath();ctx.arc(0,0,11,0,TAU2);ctx.fill();ctx.fillStyle='#8fa0bf';ctx.beginPath();ctx.arc(0,0,11,0,Math.PI);ctx.fill();ctx.fillStyle='#7fe0ff';ctx.beginPath();ctx.arc(-3,-3,3.5,0,TAU2);ctx.fill();
   const bl=Math.sin(tNow*.006)>0;ctx.fillStyle=bl?'#ff5d5d':'#5d1d1d';ctx.beginPath();ctx.arc(0,-13,2,0,TAU2);ctx.fill();ctx.restore()},
 asteroids(x,y){for(const r of ROCKS){const rx=((r.x+tNow*r.v)%1+1)%1*W,ry=y+r.y*H*.35;ctx.save();ctx.translate(rx,ry);ctx.rotate(tNow*r.sp);ctx.fillStyle='#7a6a64';ctx.beginPath();for(let k=0;k<r.sides;k++){const a=k/r.sides*TAU2,rr2=r.r*(.75+hash(k+r.r)*.35);ctx.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2)}ctx.closePath();ctx.fill();ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.arc(r.r*.25,r.r*.2,r.r*.28,0,TAU2);ctx.fill();ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.arc(-r.r*.3,-r.r*.3,r.r*.25,0,TAU2);ctx.fill();ctx.restore()}},
 giant(x,y,o){const r=o.r||60;ctx.save();ctx.strokeStyle=o.ring;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,y,r*1.9,r*.45,-.3,Math.PI,TAU2);ctx.stroke();const g=ctx.createRadialGradient(x-r*.4,y-r*.4,r*.1,x,y,r);g.addColorStop(0,o.c1);g.addColorStop(1,o.c2);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU2);ctx.fill();
   ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU2);ctx.clip();ctx.fillStyle='rgba(255,255,255,.12)';for(let k=-3;k<=3;k++)ctx.fillRect(x-r,y+k*r*.27,r*2,r*.09);ctx.restore();
   ctx.strokeStyle=o.ring;ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(x,y,r*1.9,r*.45,-.3,0,Math.PI);ctx.stroke();ctx.restore()},
 planet(x,y,o){const r=o.r||40;const g=ctx.createRadialGradient(x-r*.4,y-r*.4,r*.1,x,y,r);g.addColorStop(0,o.c1);g.addColorStop(1,o.c2);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU2);ctx.fill();ctx.fillStyle='rgba(0,0,0,.12)';for(let k=0;k<4;k++){ctx.beginPath();ctx.arc(x+(hash(k+r)-.5)*r,y+(hash(k*3+r)-.5)*r,r*.15,0,TAU2);ctx.fill()}},
 nebula(x,y){const N=nebSprite();ctx.drawImage(N.cv,x+N.x0+Math.sin(tNow*.0002)*6,y+N.y0,N.w,N.h);
   for(let k=0;k<40;k++){const a=hash(k*1.3),b=hash(k*2.9);const tw=.5+.5*Math.sin(tNow*.003+k);ctx.fillStyle=WA[Math.round(tw*20)];ctx.fillRect(x+(a-.5)*W*1.2,y+(b-.5)*H*.8,2,2)}},
 comet(x,y){const sx=((tNow*.05)%(W+400))-200;const cx=sx,cy=y;const g=ctx.createLinearGradient(cx,cy,cx-160,cy-60);g.addColorStop(0,'rgba(190,240,255,.9)');g.addColorStop(1,'rgba(190,240,255,0)');ctx.strokeStyle=g;ctx.lineWidth=10;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx-160,cy-60);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(cx,cy,6,0,TAU2);ctx.fill()},
 blackhole(x,y,o){const r=o.r||46;const rot=tNow*.0015;for(let k=0;k<3;k++){ctx.save();ctx.translate(x,y);ctx.scale(1,.32);ctx.rotate(rot*(1+k*.3));const g=cgrad('bh'+k+'_'+r,()=>{const g=ctx.createRadialGradient(0,0,r*.9,0,0,r*(2.6-k*.3));g.addColorStop(0,'rgba(255,240,200,.95)');g.addColorStop(.3,'rgba(255,150,40,.7)');g.addColorStop(1,'rgba(160,30,10,0)');return g});ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r*(2.6-k*.3),0,TAU2);ctx.fill();ctx.restore()}
   const h=cgrad('bhh'+r,()=>{const h=ctx.createRadialGradient(0,0,r*.7,0,0,r*1.35);h.addColorStop(0,'rgba(255,200,120,.9)');h.addColorStop(1,'rgba(255,120,40,0)');return h});ctx.save();ctx.translate(x,y);ctx.fillStyle=h;ctx.beginPath();ctx.arc(0,0,r*1.35,0,TAU2);ctx.fill();ctx.restore();ctx.fillStyle='#000';ctx.beginPath();ctx.arc(x,y,r*.85,0,TAU2);ctx.fill();
   ctx.save();ctx.translate(x,y);ctx.scale(1,.32);ctx.strokeStyle='rgba(255,220,150,.9)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,r*1.6,0,Math.PI);ctx.stroke();ctx.restore()},
 whale(x,y){const bx=x+Math.sin(tNow*.0005)*40,by=y+Math.sin(tNow*.001)*8;ctx.save();ctx.translate(bx,by);ctx.fillStyle=cgrad('wh',()=>{const g=ctx.createLinearGradient(0,-30,0,30);g.addColorStop(0,'#7aa6ff');g.addColorStop(1,'#3b4fc9');return g});ctx.beginPath();ctx.ellipse(0,0,62,28,0,0,TAU2);ctx.fill();
   ctx.beginPath();ctx.moveTo(52,-4);ctx.quadraticCurveTo(84,-26,96,-30+Math.sin(tNow*.004)*6);ctx.quadraticCurveTo(88,-4,98,16+Math.sin(tNow*.004)*6);ctx.quadraticCurveTo(80,8,52,8);ctx.fill();
   ctx.fillStyle='#d6e4ff';ctx.beginPath();ctx.ellipse(-8,14,44,12,0,0,Math.PI);ctx.fill();ctx.fillStyle='#1a1030';ctx.beginPath();ctx.arc(-38,-6,4,0,TAU2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-39,-7.5,1.4,0,TAU2);ctx.fill();
   ctx.fillStyle='rgba(255,140,190,.6)';ctx.beginPath();ctx.ellipse(-32,4,6,3,0,0,TAU2);ctx.fill();
   for(let k=0;k<6;k++){const ph=(tNow*.0012+k/6)%1;ctx.fillStyle=`rgba(200,230,255,${1-ph})`;ctx.beginPath();ctx.arc(-20+Math.sin(k*2)*8,-30-ph*50,2+ph*2,0,TAU2);ctx.fill()}ctx.restore()},
 crystalp(x,y,o){const r=o.r||50;const g=ctx.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r);g.addColorStop(0,'#e8d8ff');g.addColorStop(1,'#5d2fb0');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,TAU2);ctx.fill();
   for(let k=0;k<9;k++){const a=k/9*TAU2+tNow*.0003,h=r*(.45+hash(k)*.5);const bx=x+Math.cos(a)*r*.92,by=y+Math.sin(a)*r*.92;ctx.save();ctx.translate(bx,by);ctx.rotate(a+Math.PI/2);ctx.fillStyle=k%2?'rgba(170,240,255,.9)':'rgba(255,170,240,.9)';ctx.beginPath();ctx.moveTo(-6,0);ctx.lineTo(0,-h);ctx.lineTo(6,0);ctx.fill();ctx.fillStyle='rgba(255,255,255,.5)';ctx.beginPath();ctx.moveTo(-2,0);ctx.lineTo(0,-h*.9);ctx.lineTo(1,0);ctx.fill();ctx.restore()}},
 wormhole(x,y){for(let k=10;k>=0;k--){const ph=((tNow*.0006)+k/10)%1;const r=20+ph*W*.55;ctx.strokeStyle=hsl(k*36+tNow*.05,90,65,(1-ph)*.8);ctx.lineWidth=3+ph*6;ctx.beginPath();ctx.ellipse(x,y,r,r*.55,0,0,TAU2);ctx.stroke()}ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(x,y,18,10,0,0,TAU2);ctx.fill()},
};

// prepara com calma (quando o celular está livre, no menu) as imagens pesadas do cenário, pra não engasgar na hora que aparecem
function warmScenery(){const idle=window.requestIdleCallback||(f=>setTimeout(f,200));const jobs=[()=>{bgEnsure();cloudSprite()},()=>citySprite(),()=>nebSprite(),()=>galSprite(W*.62)];
  const next=()=>{const j=jobs.shift();if(!j)return;idle(()=>{try{j()}catch(e){}next()},{timeout:3000})};next()}
