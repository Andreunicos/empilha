/* ================= SKINS ================= */
const BH=34;let hue0=200,tNow=0;
const hsl=(h,s,l,a=1)=>`hsla(${((h%360)+360)%360},${s}%,${l}%,${a})`;
const hash=n=>{n=Math.sin(n*127.1)*43758.5453;return n-Math.floor(n)};
// mesma ideia pra qualquer cor: CA('255,190,90',.4) devolve 'rgba(255,190,90,0.4)' pronto (21 níveis de transparência)
const CAM={};function CA(rgb,a){let t=CAM[rgb];if(!t){t=CAM[rgb]=[];for(let k=0;k<=20;k++)t.push(`rgba(${rgb},${k/20})`)}return t[Math.max(0,Math.min(20,Math.round(a*20)))]}
// posições dos enfeites de cada bloco: são sempre as mesmas pro mesmo bloco, então ficam guardadas
// (antes eram recalculadas e criavam lixo na memória todo frame, o que causava engasgos do coletor de lixo)
// (chave numérica por bloco + confere x/largura: nada de texto criado por frame)
const POSM=new Map(),SGN=[-1,1];function posMemo(k,x,w,mk){let v=POSM.get(k);if(!v||v.x!==x||v.w!==w){if(POSM.size>4000)POSM.clear();v={x,w,o:mk()};POSM.set(k,v)}return v.o}
const posKey=(tag,i,P,min,sh)=>((((i|0)*512+(P|0))*128+((min*100)|0))*64+((sh|0)&63))*4+tag;
function vgrad(c,y,stops){const g=c.createLinearGradient(0,y,0,y+BH);stops.forEach((s,k)=>g.addColorStop(k/(stops.length-1),s));return g}
// retângulo arredondado: usa o roundRect nativo quando existe (o Android reconhece a forma e recorta/pinta bem mais rápido)
function rr(c,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));c.beginPath();if(c.roundRect&&w>=0&&h>=0){c.roundRect(x,y,w,h,r);return}c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function bevel(c,x,y,w,top=.3,bot=.25){c.fillStyle=`rgba(255,255,255,${top})`;c.fillRect(x,y,w,4);c.fillStyle=`rgba(0,0,0,${bot})`;c.fillRect(x,y+BH-5,w,5);c.fillStyle='rgba(255,255,255,.1)';c.fillRect(x,y,3,BH);c.fillStyle='rgba(0,0,0,.12)';c.fillRect(x+w-3,y,3,BH)}
// every pattern uses world x (not block x), so cut pieces keep matching the block below
const SKINS=[
 {id:'classic',name:'Arco-íris',cur:'coin',price:0,draw(c,x,y,w,i){const h=hue0+i*9;c.fillStyle=vgrad(c,y,[hsl(h,85,66),hsl(h,80,54),hsl(h,78,46)]);c.fillRect(x,y,w,BH);bevel(c,x,y,w)}},
 {id:'candy',name:'Doce',cur:'coin',price:250,draw(c,x,y,w,i){const P=[[340,90,82],[190,85,78],[48,95,78],[265,85,84],[140,70,78]][i%5];c.fillStyle=hsl(P[0],P[1],P[2]);c.fillRect(x,y,w,BH);c.fillStyle='rgba(255,255,255,.5)';for(let s=Math.floor(x/18)*18-BH;s<x+w;s+=18){c.beginPath();c.moveTo(s,y+BH);c.lineTo(s+8,y+BH);c.lineTo(s+8+BH,y);c.lineTo(s+BH,y);c.fill()}c.fillStyle='rgba(255,255,255,.7)';c.fillRect(x,y,w,5);c.fillStyle=hsl(P[0],P[1]-20,P[2]-18);c.fillRect(x,y+BH-5,w,5)}},
 {id:'wood',name:'Madeira',cur:'coin',price:400,draw(c,x,y,w,i){const l=i%2?44:38;c.fillStyle=vgrad(c,y,[hsl(30,52,l+8),hsl(28,55,l),hsl(24,55,l-7)]);c.fillRect(x,y,w,BH);c.strokeStyle='rgba(70,35,10,.35)';c.lineWidth=1.4;for(let k=0;k<3;k++){c.beginPath();const yy=y+10+k*7;for(let X=Math.floor(x/6)*6;X<=x+w;X+=6){const v=yy+Math.sin(X*.05+k*2+i)*1.8;X===Math.floor(x/6)*6?c.moveTo(X,v):c.lineTo(X,v)}c.stroke()}const kx=(hash(i)*260)|0;for(let K=kx;K<x+w+400;K+=260){if(K>x+6&&K<x+w-6){c.fillStyle='rgba(70,35,10,.4)';c.beginPath();c.ellipse(K,y+BH/2,5,3,0,0,7);c.fill()}}bevel(c,x,y,w,.22,.25)}},
 {id:'brick',name:'Tijolo',cur:'coin',price:700,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#d0674c','#b5523b','#94402c']);c.fillRect(x,y,w,BH);c.fillStyle='rgba(235,215,195,.75)';c.fillRect(x,y+BH/2-1,w,2);const s=28,o=(i%2)*14;for(let X=Math.floor((x-o)/s)*s+o;X<x+w;X+=s){c.fillRect(X,y,2,BH/2)}for(let X=Math.floor((x-o-14)/s)*s+o+14;X<x+w;X+=s){c.fillRect(X,y+BH/2,2,BH/2)}bevel(c,x,y,w,.18,.28)}},
 {id:'pixel',name:'Pixel',cur:'coin',price:600,r:0,draw(c,x,y,w,i){const h=[130,210,28,320,265][i%5];const sz=BH/4;const x0=Math.floor(x/sz)*sz;for(let r=0;r<4;r++)for(let X=x0;X<x+w;X+=sz){const odd=((X/sz|0)+r)%2;const l=r===0?66:r===3?38:(odd?52:47);c.fillStyle=hsl(h,70,l);c.fillRect(X,y+r*sz,sz+.5,sz+.5)}c.fillStyle='rgba(0,0,0,.35)';c.fillRect(x,y+BH-2,w,2)}},
 {id:'ice',name:'Gelo',cur:'coin',price:900,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['rgba(236,251,255,.97)','rgba(160,224,250,.9)','rgba(96,176,226,.92)']);c.fillRect(x,y,w,BH);c.fillStyle='rgba(255,255,255,.55)';for(let s=Math.floor(x/70)*70+((i*23)%70);s<x+w+BH;s+=70){c.beginPath();c.moveTo(s,y+BH);c.lineTo(s+7,y+BH);c.lineTo(s+7+BH*.8,y);c.lineTo(s+BH*.8,y);c.fill();c.beginPath();c.moveTo(s+12,y+BH);c.lineTo(s+15,y+BH);c.lineTo(s+15+BH*.8,y);c.lineTo(s+12+BH*.8,y);c.fill()}bevel(c,x,y,w,.6,.18)}},
 {id:'watermelon',name:'Melancia',cur:'coin',price:1100,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#ff6b78','#ff4d5e','#e02745']);c.fillRect(x,y,w,BH);c.fillStyle='#f4ffe0';c.fillRect(x,y+BH-11,w,3);c.fillStyle='#7ed957';c.fillRect(x,y+BH-8,w,3);c.fillStyle='#1f7a3a';c.fillRect(x,y+BH-5,w,5);c.fillStyle='#2b1a1a';for(let X=Math.floor(x/15)*15;X<x+w;X+=15){const a=hash(X*.31+i);if(a<.25)continue;const sx=X+4+a*6,sy=y+6+hash(X*.73+i)*12;c.beginPath();c.ellipse(sx,sy,1.6,2.6,.4,0,7);c.fill()}c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x,y,w,3)}},
 {id:'marble',name:'Mármore',cur:'coin',price:1400,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#ffffff','#eeedf3','#d9d7e2']);c.fillRect(x,y,w,BH);[[1.3,'rgba(80,80,105,.35)',0],[3,'rgba(80,80,105,.12)',2.1]].forEach(([lw,col,ph])=>{c.strokeStyle=col;c.lineWidth=lw;c.beginPath();const x0=Math.floor(x/4)*4;for(let X=x0;X<=x+w;X+=4){const v=y+BH/2+Math.sin(X*.045+i*2.3+ph)*9+Math.sin(X*.13+i)*3;X===x0?c.moveTo(X,v):c.lineTo(X,v)}c.stroke()});bevel(c,x,y,w,.55,.16)}},
 {id:'neon',name:'Neon',cur:'coin',price:1500,r:4,draw(c,x,y,w,i){const h=hue0+i*24;c.fillStyle='#0d0a1f';c.fillRect(x,y,w,BH);c.strokeStyle=hsl(h,100,60,.18);c.lineWidth=1;for(let X=Math.ceil(x/14)*14;X<x+w;X+=14){c.beginPath();c.moveTo(X,y);c.lineTo(X,y+BH);c.stroke()}if(w<12){c.fillStyle=hsl(h,100,65,.8);c.fillRect(x,y+4,w,BH-8);return}const p=.75+.25*Math.sin(tNow*.005+i);c.strokeStyle=hsl(h,100,60,.35*p);c.lineWidth=7;c.strokeRect(x+4,y+4,w-8,BH-8);c.strokeStyle=hsl(h,100,72);c.lineWidth=2.5;c.strokeRect(x+4,y+4,w-8,BH-8)}},
 {id:'circuit',name:'Circuito',cur:'coin',price:2200,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#14553f','#0f3d2e','#0a2c21']);c.fillRect(x,y,w,BH);c.strokeStyle='rgba(80,240,160,.7)';c.fillStyle='rgba(120,255,190,.9)';c.lineWidth=1.5;const s=20;for(let X=Math.floor(x/s)*s;X<x+w;X+=s){const a=hash(X*.17+i),b=hash(X*.59+i),ya=y+8+Math.round(a*2)*8;c.beginPath();c.moveTo(X,ya);c.lineTo(X+s*.6,ya);if(b>.4){c.lineTo(X+s*.6,y+BH-6)}c.stroke();if(b>.6){c.beginPath();c.arc(X+s*.6,ya,2.2,0,7);c.fill()}}bevel(c,x,y,w,.15,.3)}},
 {id:'carbon',name:'Carbono',cur:'coin',price:3000,draw(c,x,y,w,i){c.fillStyle='#1b1d22';c.fillRect(x,y,w,BH);const s=6;for(let r=0;r*s<BH;r++)for(let X=Math.floor(x/s)*s;X<x+w;X+=s){if(((X/s|0)+r)%2){c.fillStyle='rgba(255,255,255,.07)';c.fillRect(X,y+r*s,s,s/2)}else{c.fillStyle='rgba(255,255,255,.03)';c.fillRect(X,y+r*s+s/2,s,s/2)}}c.fillStyle='#e63946';c.fillRect(x,y+BH-10,w,2);bevel(c,x,y,w,.2,.35)}},
 {id:'jade',name:'Jade',cur:'lvl',price:5,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#9af5cf','#3fc98e','#1c8a5e']);c.fillRect(x,y,w,BH);c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=2;c.beginPath();for(let X=Math.floor(x/5)*5;X<=x+w;X+=5){const v=y+BH/2+Math.sin(X*.035+i*1.7)*8+Math.sin(X*.11)*2;X===Math.floor(x/5)*5?c.moveTo(X,v):c.lineTo(X,v)}c.stroke();bevel(c,x,y,w,.4,.22)}},
 {id:'sunset',name:'Pôr do Sol',cur:'lvl',price:10,draw(c,x,y,w,i){const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#ff5d8f');g.addColorStop(.5,'#ff9a3d');g.addColorStop(1,'#8b5cf6');c.fillStyle=g;c.fillRect(x,y,w,BH);c.fillStyle='rgba(255,240,200,.35)';c.fillRect(x,y+12,w,3);c.fillRect(x,y+20,w,2);bevel(c,x,y,w)}},
 {id:'diamond',name:'Diamante',cur:'lvl',price:20,draw(c,x,y,w,i){c.fillStyle='#bdf3ff';c.fillRect(x,y,w,BH);const s=17;for(let X=Math.floor(x/s)*s;X<x+w;X+=s){const a=hash(X*.37+i),b=hash(X*.91+i);c.fillStyle=`rgba(255,255,255,${.25+a*.6})`;c.beginPath();c.moveTo(X,y);c.lineTo(X+s,y);c.lineTo(X+s/2,y+BH/2);c.fill();c.fillStyle=`rgba(60,160,220,${.2+b*.45})`;c.beginPath();c.moveTo(X,y+BH);c.lineTo(X+s,y+BH);c.lineTo(X+s/2,y+BH/2);c.fill()}const sp=((tNow*.25+i*60)%(W+160))-80;if(sp>x-10&&sp<x+w+10){c.fillStyle='#fff';c.beginPath();c.moveTo(sp,y+BH/2-7);c.lineTo(sp+2,y+BH/2);c.lineTo(sp,y+BH/2+7);c.lineTo(sp-2,y+BH/2);c.fill()}bevel(c,x,y,w,.5,.18)}},
 {id:'gold',name:'Ouro',cur:'gem',price:40,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#fff4c2','#f5c542','#d99a16','#9c6a05']);c.fillRect(x,y,w,BH);c.fillStyle='rgba(120,80,0,.3)';c.fillRect(x,y+BH/2,w,1.5);const sx=((tNow*.3+i*47)%(W+220))-110;c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.moveTo(sx,y+BH);c.lineTo(sx+10,y+BH);c.lineTo(sx+10+BH*.7,y);c.lineTo(sx+BH*.7,y);c.fill();bevel(c,x,y,w,.5,.2)}},
 {id:'lava',name:'Lava',cur:'gem',price:60,draw(c,x,y,w,i){const p=.6+.4*Math.sin(tNow*.004+i*.7);c.fillStyle=vgrad(c,y,['#3a1610','#24100c','#ff5a1f']);c.fillRect(x,y,w,BH);c.fillStyle=CA('255,120,30',.35+.35*p);c.fillRect(x,y+BH-8,w,8);c.lineCap='round';const x0=Math.floor(x/16)*16;c.beginPath();for(let X=x0;X<=x+w+16;X+=16){const v=y+9+hash(X*.13+i)*14;X===x0?c.moveTo(X,v):c.lineTo(X,v)}c.strokeStyle=CA('255,110,20',.3*p);c.lineWidth=8;c.stroke();c.strokeStyle=CA('255,'+(170+Math.round(p*6)*10)+',60',1);c.lineWidth=2.5;c.stroke();c.fillStyle='rgba(255,255,255,.12)';c.fillRect(x,y,w,3)}},
 {id:'galaxy',name:'Galáxia',cur:'gem',price:90,draw(c,x,y,w,i){const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#1b0b45');g.addColorStop(.5,'#5a1d8f');g.addColorStop(1,'#0e2a6b');c.fillStyle=g;c.fillRect(x,y,w,BH);const nx=hash(i*3.1)*W;const rg=c.createRadialGradient(nx,y+BH/2,0,nx,y+BH/2,70);rg.addColorStop(0,'rgba(255,120,200,.45)');rg.addColorStop(1,'rgba(255,120,200,0)');c.fillStyle=rg;c.fillRect(x,y,w,BH);for(let X=Math.floor(x/9)*9;X<x+w;X+=9){const a=hash(X*.7+i*13);if(a>.45){const tw=.4+.6*Math.abs(Math.sin(tNow*.003+X));c.fillStyle=`rgba(255,255,255,${tw})`;const s=a>.9?2.2:1.3;c.fillRect(X+hash(X+i)*6,y+4+hash(X*1.3+i)*(BH-8),s,s)}}bevel(c,x,y,w,.18,.3)}},
 {id:'holo',name:'Holográfico',cur:'gem',price:120,draw(c,x,y,w,i){const off=(tNow*.06+i*25)%(W+300);const g=c.createLinearGradient(-off,0,W+300-off,0);['#ff9ae6','#9ad8ff','#b8ffcf','#fff3a3','#ffb3c9','#c3a9ff','#ff9ae6'].forEach((col,k,a)=>g.addColorStop(k/(a.length-1),col));c.fillStyle=g;c.fillRect(x,y,w,BH);c.fillStyle='rgba(255,255,255,.4)';for(let s=Math.floor(x/60)*60+((i*17)%60);s<x+w+BH;s+=60){c.beginPath();c.moveTo(s,y+BH);c.lineTo(s+6,y+BH);c.lineTo(s+6+BH*.8,y);c.lineTo(s+BH*.8,y);c.fill()}bevel(c,x,y,w,.5,.18)}},
];
// busca da skin pelo id (guardada num mapa; refeito se a lista crescer)
let SKM=null,SKMn=0;const skinOf=id=>{if(!SKM||SKMn!==SKINS.length){SKM=new Map(SKINS.map(s=>[s.id,s]));SKMn=SKINS.length}return SKM.get(id)||SKINS[0]};
function block(x,y,w,i,alpha=1,c=ctx,sk){if(w<=.5)return;sk=sk||skinOf(S.skin);c.save();c.globalAlpha=alpha;rr(c,x,y,w,BH,sk.r??5);c.clip();sk.draw(c,x,y,w,i);c.restore()}

/* ---- desempenho: cada bloco da torre vira uma imagem pronta (desenhar imagem é muito mais leve que redesenhar a skin).
   Skins paradas: desenha 1 vez e reaproveita. Skins "divididas" (base + brilho): a base fica pronta e só o brilho é desenhado.
   Skins animadas simples: desenhadas normalmente. Blocos fora da tela não são desenhados. ---- */
const BC={id:null,dpr:0,w:0,mode:'live'};
function skinProbe(sk){const PW=Math.max(240,Math.round(W||360));const cv=document.createElement('canvas');cv.width=PW;cv.height=BH;const c=cv.getContext('2d',{willReadFrequently:true});const t0=tNow;
  const snap=t=>{tNow=t;c.clearRect(0,0,PW,BH);block(0,0,PW,3,1,c,sk);return c.getImageData(0,0,PW,BH).data};
  // compara vários momentos (brilhos que passam de vez em quando também contam como animação), todos os canais
  let anim=false;try{const a=snap(1000);for(const t of [1777,3100,4700,6300,8200,9900]){const b=snap(t);for(let k=0;k<a.length;k++)if(a[k]!==b[k]){anim=true;break}if(anim)break}}catch(e){anim=true}
  tNow=t0;return {anim}}
function bcSync(){const sk=skinOf(S.skin);if(BC.id===sk.id&&BC.dpr===DPR&&BC.w===W)return;const pr=sk.fx?{anim:true}:skinProbe(sk);BC.id=sk.id;BC.dpr=DPR;BC.w=W;
  BC.mode=sk.fx?'split':pr.anim?'live':'cache';BC.sk=sk;
  for(const b of (typeof stack!=='undefined'?stack:[]))b.cv=null}
function bcRender(b){const sk=BC.sk||skinOf(S.skin);const pw=Math.ceil(b.w*DPR)+2,ph=Math.ceil(BH*DPR)+1;let cv=b.cv;if(!cv||cv.width!==pw||cv.height!==ph){cv=document.createElement('canvas');cv.width=pw;cv.height=ph;b.cv=cv}
  const c=cv.getContext('2d');c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,pw,ph);c.setTransform(DPR,0,0,DPR,-b.x*DPR,0);
  c.save();rr(c,b.x,0,b.w,BH,sk.r??5);c.clip();(sk.base||sk.draw).call(sk,c,b.x,0,b.w,b.i);c.restore();b.cvX=b.x;b.cvW=b.w}
// desenha a torre visível (first..fim) usando o cache
function drawStack(first,yFor){bcSync();const n=stack.length,sk=BC.sk,live=BC.mode==='live',split=BC.mode==='split';
  if(live||split)drawStackAnim(first,yFor,sk,live);
  else for(let k=first;k<n;k++){const b=stack[k];const y=yFor(k,b);if(y>H+2||y<-BH-2)continue;const age=tNow-b.t0;
    if(age<260){squash(b,y,age);continue}
    // bloco mudou de tamanho/lugar (poder Largo, reviver): refaz a imagem
    if(!b.cv||b.cvX!==b.x||b.cvW!==b.w)bcRender(b);ctx.drawImage(b.cv,0,0,b.cv.width,b.cv.height,b.x,y,b.cv.width/DPR,b.cv.height/DPR)}
  // libera memória dos blocos que já saíram da tela
  for(let k=Math.max(0,first-6);k<first;k++)stack[k].cv=null}
// bloco que acabou de cair (efeito de amassar): desenhado na hora
function squash(b,y,age){const sq=1-.2*Math.sin(age/260*Math.PI)*(1-age/260);ctx.save();ctx.translate(b.x+b.w/2,y+BH);ctx.scale(1+(1-sq)*.6,sq);ctx.translate(-(b.x+b.w/2),-(y+BH));block(b.x,y,b.w,b.i);ctx.restore()}
/* ---- skins animadas: "folha da torre" ----
   Os blocos visíveis ficam numa imagem só (uma faixa por andar, em rodízio). A cada frame só METADE dos blocos tem a
   animação redesenhada (alternando), e a torre inteira é copiada dessa folha. Cada bloco continua animando (30 fps),
   a torre anda a 60 e o celular faz metade do trabalho. Em aparelho fraco (qualidade baixa), 1/3 por frame. ---- */
const TL={cv:null,c:null,sh:0,ns:0,pw:0,own:[],dpr:0,id:null,f:0};
function drawStackAnim(first,yFor,sk,live){
  const sh=Math.ceil(BH*DPR)+2,ns=Math.ceil(H/BH)+4,pw=Math.ceil(W*DPR)+4,r=sk.r??5;
  if(!TL.cv){TL.cv=document.createElement('canvas');TL.c=TL.cv.getContext('2d')}
  if(TL.cv.width!==pw||TL.cv.height!==sh*ns||TL.id!==BC.id||TL.dpr!==DPR){TL.cv.width=pw;TL.cv.height=sh*ns;TL.sh=sh;TL.ns=ns;TL.pw=pw;TL.own=new Array(ns);TL.id=BC.id;TL.dpr=DPR}
  const c=TL.c,N=TL.N||(QCAP<=1.25?3:2),f=++TL.f,n=stack.length;
  // 1º passo: redesenha na folha os blocos da vez (todos de uma vez; se misturar desenhar e copiar, o navegador
  // precisa duplicar a folha inteira a cada bloco)
  for(let k=first;k<n;k++){const b=stack[k];const y=yFor(k,b);if(y>H+2||y<-BH-2||tNow-b.t0<260)continue;
    const s=k%ns,sy=s*sh,o=TL.own[s];
    if(!o||o.b!==b||o.x!==b.x||o.w!==b.w||(k+f)%N===0){
      c.setTransform(1,0,0,1,0,0);c.clearRect(0,sy,pw,sh);c.setTransform(DPR,0,0,DPR,2,sy+1);
      if(live)block(b.x,0,b.w,b.i,1,c,sk);
      else{if(!b.cv||b.cvX!==b.x||b.cvW!==b.w)bcRender(b);c.drawImage(b.cv,b.x,0,b.cv.width/DPR,b.cv.height/DPR);if(b.w>.5){c.save();rr(c,b.x,0,b.w,BH,r);c.clip();sk.fx(c,b.x,0,b.w,b.i);c.restore()}}
      if(o){o.b=b;o.x=b.x;o.w=b.w}else TL.own[s]={b,x:b.x,w:b.w}}}
  // 2º passo: copia a torre da folha pra tela
  for(let k=first;k<n;k++){const b=stack[k];const y=yFor(k,b);if(y>H+2||y<-BH-2)continue;const age=tNow-b.t0;
    if(age<260){squash(b,y,age);continue}
    const sy=(k%ns)*sh,sx=Math.max(0,Math.floor(b.x*DPR)),sw=Math.min(pw,Math.ceil((b.x+b.w)*DPR)+4)-sx;
    if(sw>0)ctx.drawImage(TL.cv,sx,sy,sw,sh,(sx-2)/DPR,y-1/DPR,sw/DPR,sh/DPR)}}

