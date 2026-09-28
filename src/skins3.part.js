/* ================= SKINS DE GATINHO (v1.3) ================= */
// Tudo desenhado dentro do bloco (34px de altura), com padrão em coordenadas do mundo (x) como as outras skins.
const CATS=(()=>{
// carinha de gato: cabeça redonda, orelhas, olhos (piscam), focinho e bigode
function face(c,cx,cy,r,o){const ear=r*.95;c.fillStyle=o.fur;
  c.beginPath();c.moveTo(cx-r*.95,cy-r*.15);c.lineTo(cx-r*.75,cy-r-ear*.55);c.lineTo(cx-r*.15,cy-r*.8);c.closePath();c.fill();
  c.beginPath();c.moveTo(cx+r*.95,cy-r*.15);c.lineTo(cx+r*.75,cy-r-ear*.55);c.lineTo(cx+r*.15,cy-r*.8);c.closePath();c.fill();
  if(o.inner){c.fillStyle=o.inner;c.beginPath();c.moveTo(cx-r*.72,cy-r*.45);c.lineTo(cx-r*.66,cy-r-ear*.3);c.lineTo(cx-r*.32,cy-r*.78);c.closePath();c.fill();c.beginPath();c.moveTo(cx+r*.72,cy-r*.45);c.lineTo(cx+r*.66,cy-r-ear*.3);c.lineTo(cx+r*.32,cy-r*.78);c.closePath();c.fill()}
  c.fillStyle=o.fur;c.beginPath();c.ellipse(cx,cy,r,r*.86,0,0,TAU);c.fill();
  if(o.mask){c.fillStyle=o.mask;c.beginPath();c.ellipse(cx,cy+r*.28,r*.62,r*.45,0,0,TAU);c.fill()}
  const ex=r*.42,ey=cy-r*.08;
  if(o.closed||o.blink){c.strokeStyle=o.line||'#2a1a14';c.lineWidth=Math.max(1.2,r*.13);c.lineCap='round';
    for(const s of SGN){c.beginPath();c.arc(cx+s*ex,ey-r*.05,r*.2,.15*Math.PI,.85*Math.PI);c.stroke()}}
  else{c.fillStyle=o.eye||'#2a1a14';for(const s of SGN){c.beginPath();c.ellipse(cx+s*ex,ey,r*.17,r*.22,0,0,TAU);c.fill()}
    if(o.pupil){c.fillStyle=o.pupil;for(const s of SGN){c.beginPath();c.ellipse(cx+s*ex,ey,r*.05,r*.18,0,0,TAU);c.fill()}}
    c.fillStyle='rgba(255,255,255,.9)';for(const s of SGN){c.beginPath();c.arc(cx+s*ex+r*.06,ey-r*.08,r*.06,0,TAU);c.fill()}}
  c.fillStyle=o.nose||'#ff8fab';c.beginPath();c.moveTo(cx-r*.1,cy+r*.18);c.lineTo(cx+r*.1,cy+r*.18);c.lineTo(cx,cy+r*.3);c.closePath();c.fill();
  c.strokeStyle=o.line||'#2a1a14';c.lineWidth=Math.max(1,r*.08);c.beginPath();c.moveTo(cx,cy+r*.3);c.quadraticCurveTo(cx-r*.12,cy+r*.45,cx-r*.24,cy+r*.36);c.moveTo(cx,cy+r*.3);c.quadraticCurveTo(cx+r*.12,cy+r*.45,cx+r*.24,cy+r*.36);c.stroke();
  if(o.whisk!==false){c.strokeStyle=o.whisk||'rgba(255,255,255,.8)';c.lineWidth=.9;for(const s of SGN)for(const k of SGN){c.beginPath();c.moveTo(cx+s*r*.45,cy+r*.28+k*r*.08);c.lineTo(cx+s*r*1.15,cy+r*.22+k*r*.2);c.stroke()}}
  if(o.blush){c.fillStyle=o.blush;for(const s of SGN){c.beginPath();c.ellipse(cx+s*r*.62,cy+r*.25,r*.16,r*.1,0,0,TAU);c.fill()}}}
// pata (almofadinhas)
const PAWP=[[-.42,-.28],[-.15,-.5],[.15,-.5],[.42,-.28]];
function paw(c,x,y,s,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y+s*.25,s*.42,s*.34,0,0,TAU);c.fill();
  for(const [dx,dy] of PAWP){c.beginPath();c.ellipse(x+dx*s,y+dy*s,s*.15,s*.18,0,0,TAU);c.fill()}}
// pálpebra por cima do olho aberto (desenhada só quando pisca — a carinha fica pronta na imagem guardada)
function blinkOver(c,cx,cy,r,fur,line){const ex=r*.42,ey=cy-r*.08;c.fillStyle=fur;for(const s of SGN){c.beginPath();c.ellipse(cx+s*ex,ey,r*.24,r*.29,0,0,TAU);c.fill()}
  c.strokeStyle=line||'#2a1a14';c.lineWidth=Math.max(1.2,r*.13);c.lineCap='round';for(const s of SGN){c.beginPath();c.arc(cx+s*ex,ey-r*.05,r*.2,.15*Math.PI,.85*Math.PI);c.stroke()}}
// posições das carinhas (iguais na base e no brilho), alternadas por andar
function spots(x,w,i,P,min){return posMemo(posKey(1,i,P,min,37),x,w,()=>{const out=[];for(let o=(i*37)%P,X=Math.floor((x-o)/P)*P+o+P/2;X<x+w+22;X+=P){const a=hash(X*.13+i*3.7);if(a>=min)out.push([X,a])}return out})}
const blinkAt=(seed,per=3200)=>((tNow+seed*997)%per)<140;
function sk(id,cur,price,base,fx){return {id,cur,price,base,fx,draw(c,x,y,w,i){base(c,x,y,w,i);fx(c,x,y,w,i)}}}
const O_OR={fur:'#ffc27a',inner:'#ff9fb0',mask:'#fff1dc',nose:'#ff7d95'},O_TUX={fur:'#2b2b33',inner:'#ff9fb0',mask:'#f4f4f8',eye:'#ffe066',pupil:'#1c1c1c',whisk:'rgba(255,255,255,.85)'},
 O_SI={fur:'#efdcbc',inner:'#caa184',mask:'#6b4a36',eye:'#5ec8ff',pupil:'#10304a',nose:'#4a2f22',line:'#3a251a',whisk:'rgba(255,255,255,.9)'},
 O_CA={fur:'#fbf6ef',inner:'#ffb3c1',eye:'#7bc96f',pupil:'#1f3a1a',whisk:'rgba(80,60,50,.6)',blush:'rgba(255,140,160,.5)'};
let GLOW=null;const eyeGlow=()=>GLOW||(GLOW=(()=>{const cv=document.createElement('canvas');cv.width=cv.height=48;const c=cv.getContext('2d');const g=c.createRadialGradient(24,24,0,24,24,24);g.addColorStop(0,'rgba(255,220,80,.35)');g.addColorStop(1,'rgba(255,220,80,0)');c.fillStyle=g;c.fillRect(0,0,48,48);return cv})());
return [
 // 1. LARANJINHA: pelo laranja listrado, com gatinhos espiando (piscam)
 sk('cat_orange','coin',1400,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#ffb35c','#f38a2e','#d96a17']);c.fillRect(x,y,w,BH);
   c.fillStyle='rgba(160,60,0,.35)';for(let X=Math.floor(x/14)*14;X<x+w+14;X+=14){const a=hash(X*.37+i);c.beginPath();c.moveTo(X,y);c.quadraticCurveTo(X+6+a*4,y+BH*.45,X+2,y+BH);c.lineTo(X+7,y+BH);c.quadraticCurveTo(X+10+a*4,y+BH*.45,X+6,y);c.fill()}
   for(const [X,a] of spots(x,w,i,96,.35))face(c,X+(a-.5)*20,y+BH*.62,11.5,O_OR);bevel(c,x,y,w,.28,.22)},
  (c,x,y,w,i)=>{for(const [X,a] of spots(x,w,i,96,.35))if(blinkAt(X+i))blinkOver(c,X+(a-.5)*20,y+BH*.62,11.5,O_OR.fur)}),
 // 2. SMOKING: gato preto de peito branco com gravatinha
 sk('cat_tux','coin',1600,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#3a3a44','#23232b','#16161c']);c.fillRect(x,y,w,BH);
   c.fillStyle='#f4f4f8';c.beginPath();const x0=Math.floor(x/40)*40-40;c.moveTo(x0,y+BH);for(let X=x0;X<x+w+40;X+=20)c.quadraticCurveTo(X+10,y+BH*.52,X+20,y+BH);c.fill();
   for(const [X] of spots(x,w,i,110,0)){face(c,X,y+BH*.56,11,O_TUX);
     c.fillStyle='#e0304e';c.beginPath();c.moveTo(X+18,y+BH-7);c.lineTo(X+11,y+BH-11);c.lineTo(X+11,y+BH-3);c.closePath();c.moveTo(X+18,y+BH-7);c.lineTo(X+25,y+BH-11);c.lineTo(X+25,y+BH-3);c.closePath();c.fill();c.beginPath();c.arc(X+18,y+BH-7,2,0,TAU);c.fill()}
   bevel(c,x,y,w,.14,.3)},
  (c,x,y,w,i)=>{for(const [X] of spots(x,w,i,110,0))if(blinkAt(X*2+i))blinkOver(c,X,y+BH*.56,11,O_TUX.fur,'#dcdce6')}),
 // 3. GATO PRETO: escuro, com pares de olhos amarelos piscando no escuro
 sk('cat_black','gem',60,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#241a3a','#120c1f','#0a0712']);c.fillRect(x,y,w,BH);c.fillStyle='rgba(180,140,255,.12)';c.fillRect(x,y,w,3)},
  (c,x,y,w,i)=>{const G=eyeGlow();for(let X=Math.floor(x/34)*34;X<x+w;X+=34){const a=hash(X*.29+i*5.1),b=hash(X*.53+i);if(a<.45)continue;const cx=X+8+b*18,cy=y+10+a*14,per=2600+a*2400,ph=(tNow+a*9000)%per;
     const open=ph>per*.25?1:ph>per*.2?(ph-per*.2)/(per*.05):ph<per*.05?1-ph/(per*.05):0;if(open<=.02)continue;
     c.drawImage(G,cx-12,cy-12,24,24);for(const s of SGN){c.fillStyle='#ffd54a';c.beginPath();c.ellipse(cx+s*5,cy,2.8,3.4*open,0,0,TAU);c.fill();c.fillStyle='#1a1a1a';c.beginPath();c.ellipse(cx+s*5,cy,.9,3*open,0,0,TAU);c.fill()}}}),
 // 4. SIAMÊS: creme com as pontas marrons e olhos azuis
 sk('cat_siam','coin',1500,(c,x,y,w,i)=>{const g=c.createLinearGradient(0,y,0,y+BH);g.addColorStop(0,'#6b4a36');g.addColorStop(.28,'#f3e3c7');g.addColorStop(.72,'#f3e3c7');g.addColorStop(1,'#6b4a36');c.fillStyle=g;c.fillRect(x,y,w,BH);
   for(const [X] of spots(x,w,i,100,0))face(c,X,y+BH*.6,11.5,O_SI);bevel(c,x,y,w,.3,.15)},
  (c,x,y,w,i)=>{for(const [X] of spots(x,w,i,100,0))if(blinkAt(X+i*3))blinkOver(c,X,y+BH*.6,11.5,O_SI.fur,O_SI.line)}),
 // 5. TRICOLOR: manchas laranja e pretas no branco
 sk('cat_calico','coin',1300,(c,x,y,w,i)=>{c.fillStyle='#fbf6ef';c.fillRect(x,y,w,BH);
   for(let X=Math.floor(x/26)*26-26;X<x+w+26;X+=26){const a=hash(X*.41+i*2.3),b=hash(X*.77+i*1.1);if(a<.3)continue;c.fillStyle=b>.5?'#f0923a':'#2d2622';c.beginPath();c.ellipse(X+13,y+(a*BH),9+b*9,6+a*6,a*3,0,TAU);c.fill()}
   for(const [X] of spots(x,w,i,120,.4)){face(c,X,y+BH*.6,11.5,O_CA);c.fillStyle='#f0923a';c.beginPath();c.ellipse(X-6,y+BH*.42,5,4,0,0,TAU);c.fill()}
   bevel(c,x,y,w,.4,.18)},
  (c,x,y,w,i)=>{for(const [X] of spots(x,w,i,120,.4))if(blinkAt(X+i*7))blinkOver(c,X,y+BH*.6,11.5,O_CA.fur,'#5a4a40')}),
 // 6. PATINHAS: rosa pastel com marquinhas de pata; uma pata "carimba" de vez em quando
 sk('cat_paws','coin',900,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#ffd6e4','#ffc2d6','#ffadc8']);c.fillRect(x,y,w,BH);
   for(let X=Math.floor(x/30)*30;X<x+w;X+=30){const a=hash(X*.31+i*3.3);c.save();c.translate(X+15,y+(a>.5?11:23));c.rotate((a-.5)*.8);paw(c,0,0,8,'rgba(214,80,130,.55)');c.restore()}
   bevel(c,x,y,w,.45,.12)},
  (c,x,y,w,i)=>{for(let X=Math.floor(x/30)*30;X<x+w;X+=30){const a=hash(X*.31+i*3.3);const st=(tNow*.0006+a*7)%4;if(st>=.25)continue;const pop=Math.sin(st/.25*Math.PI)*.35;
     c.save();c.translate(X+15,y+(a>.5?11:23));c.rotate((a-.5)*.8);c.scale(1+pop,1+pop);paw(c,0,0,8,`rgba(214,80,130,${(.35*pop/.35).toFixed(2)})`);c.restore()}}),
 // 7. NOVELO: textura de lã enrolada e um novelo rolando
 sk('cat_yarn','coin',1200,(c,x,y,w,i)=>{const cols=YARN[i%4];c.fillStyle=vgrad(c,y,[cols[0],cols[1],cols[1]]);c.fillRect(x,y,w,BH);c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1.4;
   for(let X=Math.floor(x/8)*8-20;X<x+w+20;X+=8){c.beginPath();c.moveTo(X,y);c.bezierCurveTo(X+8,y+BH*.3,X-6,y+BH*.7,X+4,y+BH);c.stroke()}bevel(c,x,y,w,.3,.2)},
  (c,x,y,w,i)=>{const cols=YARN[i%4];const P=W+140,px=((tNow*.07+i*83)%P)-70,rot=tNow*.006;if(px<x-80||px>x+w+20)return;const cy=y+BH/2+1,r=12;
     c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=1.5;c.beginPath();c.moveTo(px-r,cy+r-2);c.quadraticCurveTo(px-40,cy+14,px-70,cy+10);c.stroke();
     c.fillStyle=cols[1];c.beginPath();c.arc(px,cy,r,0,TAU);c.fill();c.save();c.beginPath();c.arc(px,cy,r,0,TAU);c.clip();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=1.6;
     for(let k=-3;k<=3;k++){c.beginPath();c.ellipse(px,cy,r*1.1,r*.35,rot+k*.5,0,TAU);c.stroke()}c.restore()}),
 // 8. SONECA: gatinhos dormindo e "z z z" subindo
 sk('cat_sleep','coin',1100,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#9fb6ff','#7d95ee','#6479d6']);c.fillRect(x,y,w,BH);
   for(let k=0;k<6;k++){const sx=hash(k*3.1+i)*W,sy=y+4+hash(k*7.7+i)*8;if(sx>x&&sx<x+w){c.fillStyle='rgba(255,255,255,.7)';c.fillRect(sx,sy,1.6,1.6)}}
   for(const [X] of spots(x,w,i,90,0)){const cy=y+BH*.62;c.fillStyle='#fff3e0';c.beginPath();c.ellipse(X+8,cy+5,15,8,0,0,TAU);c.fill();c.strokeStyle='#fff3e0';c.lineWidth=4;c.lineCap='round';c.beginPath();c.arc(X+8,cy+5,15,.1*Math.PI,.55*Math.PI);c.stroke();
     face(c,X-6,cy,8.5,{fur:'#fff3e0',inner:'#ffb3c1',closed:true,line:'#6a5a70',whisk:'rgba(106,90,112,.55)',blush:'rgba(255,150,170,.6)'})}
   bevel(c,x,y,w,.3,.18)},
  (c,x,y,w,i)=>{c.fillStyle='#fff';c.font='900 10px Nunito, sans-serif';c.textAlign='center';c.textBaseline='alphabetic';const ga=c.globalAlpha;
   for(const [X,a] of spots(x,w,i,90,0)){const cy=y+BH*.62;for(let z=0;z<3;z++){const ph=((tNow*.0005+a+z/3)%1);const sc=.7+ph*.6;c.globalAlpha=ga*Math.sin(ph*Math.PI);
     c.save();c.translate(X+2+ph*14,cy-8-ph*14);c.scale(sc,sc);c.fillText('z',0,0);c.restore()}}c.globalAlpha=ga}),
 // 9. SORTUDO: gato da sorte japonês, vermelho e dourado, acenando a patinha
 sk('cat_lucky','gem',80,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#e8403a','#c21f2b','#9c1420']);c.fillRect(x,y,w,BH);
   c.strokeStyle='rgba(255,210,90,.35)';c.lineWidth=1;for(let X=Math.floor(x/16)*16;X<x+w;X+=16){c.beginPath();c.arc(X+8,y+BH,8,Math.PI,2*Math.PI);c.stroke();c.beginPath();c.arc(X,y+BH-8,8,Math.PI,2*Math.PI);c.stroke()}
   for(const [X] of spots(x,w,i,100,0)){const cy=y+BH*.58;face(c,X,cy,11,{fur:'#fffaf2',inner:'#ff9fb0',closed:true,line:'#3a1a14',whisk:'rgba(60,30,20,.4)',blush:'rgba(255,120,140,.7)'});c.fillStyle='#ffc93c';c.beginPath();c.arc(X,cy+11,2.6,0,TAU);c.fill()}
   c.fillStyle='rgba(255,210,90,.9)';c.fillRect(x,y,w,2.5);c.fillRect(x,y+BH-2.5,w,2.5)},
  (c,x,y,w,i)=>{for(const [X] of spots(x,w,i,100,0)){const cy=y+BH*.58;const wave=Math.sin(tNow*.009+X)*.5;c.save();c.translate(X+13,cy+2);c.rotate(-.6+wave);c.fillStyle='#fffaf2';c.beginPath();c.ellipse(0,-6,3.6,6.5,0,0,TAU);c.fill();c.fillStyle='#ff9fb0';c.beginPath();c.arc(0,-10,1.6,0,TAU);c.fill();c.restore();
     const sp=(tNow*.002+X)%3;if(sp<.3){c.fillStyle=`rgba(255,240,170,${(1-sp/.3).toFixed(2)})`;c.fillRect(X-16,cy-8,2,2);c.fillRect(X+20,cy+6,2,2)}}}),
 // 10. GATO CÓSMICO: céu estrelado com constelações de gatinho brilhando
 sk('cat_cosmic','gem',120,(c,x,y,w,i)=>{const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#1a0b3d');g.addColorStop(.5,'#3b1470');g.addColorStop(1,'#0f2a5c');c.fillStyle=g;c.fillRect(x,y,w,BH);
   for(const [X] of spots(x,w,i,120,0)){const cx=X,cy=y+BH*.58,r=10;c.strokeStyle='rgba(190,200,255,.4)';c.lineWidth=1;c.beginPath();COSP.forEach(([dx,dy],k)=>k?c.lineTo(cx+dx*r,cy+dy*r):c.moveTo(cx+dx*r,cy+dy*r));c.closePath();c.stroke()}
   bevel(c,x,y,w,.16,.3)},
  (c,x,y,w,i)=>{for(let X=Math.floor(x/7)*7;X<x+w;X+=7){const a=hash(X*.61+i*9);if(a>.55){const tw=.35+.65*Math.abs(Math.sin(tNow*.002+X*.3));c.fillStyle=WA[Math.round(tw*(a-.4)*20)];c.fillRect(X+hash(X+i)*5,y+3+hash(X*1.7+i)*(BH-6),1.4,1.4)}}
   for(const [X] of spots(x,w,i,120,0)){const cx=X,cy=y+BH*.58,r=10,pul=.55+.45*Math.sin(tNow*.003+X);c.fillStyle='#fff';for(const [dx,dy] of COSP){c.beginPath();c.arc(cx+dx*r,cy+dy*r,1.3+pul*.8,0,TAU);c.fill()}
     c.fillStyle=CA('140,230,255',.6+.4*pul);c.beginPath();c.arc(cx-r*.4,cy-r*.15,1.8,0,TAU);c.arc(cx+r*.4,cy-r*.15,1.8,0,TAU);c.fill()}}),
];})();
const YARN=[['#8fd3ff','#4aa8e6'],['#b8a3ff','#7a5cf0'],['#ffb3c7','#f06a95'],['#a6f0b8','#3fbf6a']];
const COSP=[[-1,-.1],[-.75,-1.35],[-.2,-.8],[.2,-.8],[.75,-1.35],[1,-.1],[.55,.7],[-.55,.7]];
SKINS.push(...CATS);
