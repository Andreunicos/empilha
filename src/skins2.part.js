/* ================= SKINS NOVAS (v1.2) ================= */
// padrões sempre em coordenadas do mundo (x), pra que os pedaços cortados continuem batendo com o bloco de baixo
const TAU=Math.PI*2;
const PB={};function plasmaBuf(cols,rows){const k=cols+'x'+rows;let b=PB[k];if(!b){const cv=document.createElement('canvas');cv.width=cols;cv.height=rows;const c=cv.getContext('2d');b=PB[k]={cv,c,img:c.createImageData(cols,rows)}}return b}
function hsl2rgb(h,s,l,d,o){h=((h%360)+360)%360/360;const q=l<.5?l*(1+s):l+s-l*s,p=2*l-q;const f=t=>{t<0&&(t+=1);t>1&&(t-=1);return t<1/6?p+(q-p)*6*t:t<.5?q:t<2/3?p+(q-p)*(2/3-t)*6:p};d[o]=f(h+1/3)*255;d[o+1]=f(h)*255;d[o+2]=f(h-1/3)*255;d[o+3]=255}
SKINS.push(
 {id:'chocolate',cur:'coin',price:800,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#8a5134','#6b3a22','#4e2915']);c.fillRect(x,y,w,BH);const s=22;
   for(let X=Math.floor(x/s)*s;X<x+w;X+=s){c.fillStyle='rgba(255,220,190,.16)';c.fillRect(X+3,y+6,s-6,3);c.fillRect(X+3,y+6,3,BH-12);c.fillStyle='rgba(30,10,0,.35)';c.fillRect(X+3,y+BH-8,s-6,3);c.fillRect(X+s-6,y+6,3,BH-11)}
   // cobertura escorrendo
   c.fillStyle='#fff3e0';c.fillRect(x,y,w,5);for(let X=Math.floor(x/9)*9;X<x+w;X+=9){const d=hash(X*.21+i*3);if(d>.45){c.beginPath();c.ellipse(X+4,y+4+d*6,3,3+d*5,0,0,TAU);c.fill()}}}},
 {id:'honey',cur:'coin',price:1000,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#ffd35c','#f6a91c','#d97d06']);c.fillRect(x,y,w,BH);const r=7,hx=r*1.5,hy=r*Math.sqrt(3);c.strokeStyle='rgba(140,70,0,.45)';c.lineWidth=1.6;
   for(let col=Math.floor(x/hx)-1;col*hx<x+w+hx;col++){const cx=col*hx,off=(col%2+2)%2?hy/2:0;for(let cy=y-hy+off+((i*5)%hy);cy<y+BH+hy;cy+=hy){c.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;c.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a))}c.closePath();c.stroke()}}
   const p=.5+.5*Math.sin(tNow*.003+i);c.fillStyle=`rgba(255,250,210,${.25+.2*p})`;c.fillRect(x,y,w,4);bevel(c,x,y,w,.25,.25)}},
 {id:'denim',cur:'coin',price:1200,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#5d86c9','#3f67ad','#2f4f8c']);c.fillRect(x,y,w,BH);c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;
   for(let X=Math.floor(x/4)*4-BH;X<x+w;X+=4){c.beginPath();c.moveTo(X,y+BH);c.lineTo(X+BH,y);c.stroke()}
   c.strokeStyle='#f2b33d';c.lineWidth=1.6;c.setLineDash([5,4]);c.lineDashOffset=-((x%9)+9)%9;[y+5,y+BH-6].forEach(yy=>{c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke()});c.setLineDash([]);
   const px=Math.floor(x/120)*120+60+hash(i)*20;for(let X=px;X<x+w+120;X+=120){if(X<x+4||X>x+w-4)continue;c.fillStyle='#c98a2a';c.beginPath();c.arc(X,y+BH/2,3.2,0,TAU);c.fill();c.fillStyle='#ffe1a0';c.beginPath();c.arc(X-.8,y+BH/2-.8,1.2,0,TAU);c.fill()}}},
 {id:'leopard',cur:'coin',price:1300,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#f7cf7e','#eab35a','#d99a3f']);c.fillRect(x,y,w,BH);const s=16;
   for(let X=Math.floor(x/s)*s;X<x+w+s;X+=s)for(let r=0;r<2;r++){const a=hash(X*.37+r*7+i*11),b=hash(X*.53+r*3+i);const cx=X+(r?s/2:0)+a*5,cy=y+7+r*17+b*4;
     c.fillStyle='#b8741f';c.beginPath();c.ellipse(cx,cy,4.2,3.4,a*3,0,TAU);c.fill();c.strokeStyle='#3a2410';c.lineWidth=2;c.beginPath();c.ellipse(cx,cy,5,4.2,a*3,.3+b,4.6+b);c.stroke()}
   bevel(c,x,y,w,.25,.22)}},
 {id:'zebra',cur:'coin',price:900,draw(c,x,y,w,i){c.fillStyle='#f8f8f4';c.fillRect(x,y,w,BH);c.fillStyle='#22202a';
   for(let X=Math.floor(x/14)*14;X<x+w+14;X+=14){const a=hash(X*.19+i*5);c.beginPath();c.moveTo(X,y-2);c.bezierCurveTo(X+6+a*6,y+10,X-4,y+22,X+5+a*4,y+BH+2);c.lineTo(X+9+a*4,y+BH+2);c.bezierCurveTo(X+2,y+22,X+12+a*6,y+10,X+6,y-2);c.fill()}
   bevel(c,x,y,w,.35,.2)}},
 {id:'camo',cur:'coin',price:1600,draw(c,x,y,w,i){c.fillStyle='#6f7d45';c.fillRect(x,y,w,BH);const cols=['#4b5a2c','#9aa066','#3a3322'];const s=18;
   for(let X=Math.floor(x/s)*s-s;X<x+w+s;X+=s)for(let r=0;r<3;r++){const a=hash(X*.41+r*13+i*7),b=hash(X*.29+r*5+i);c.fillStyle=cols[r];c.beginPath();const cx=X+a*s,cy=y+b*BH;c.ellipse(cx,cy,7+a*6,4+b*4,a*2,0,TAU);c.ellipse(cx+6,cy+2,5,4,0,0,TAU);c.fill()}
   bevel(c,x,y,w,.15,.3)}},
 {id:'pizza',cur:'coin',price:1000,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#ffe08a','#ffc94d','#f2a93a']);c.fillRect(x,y,w,BH);c.fillStyle='#d9892b';c.fillRect(x,y+BH-7,w,7);c.fillStyle='#f0b25a';c.fillRect(x,y+BH-8,w,2);
   for(let X=Math.floor(x/26)*26;X<x+w+26;X+=26){const a=hash(X*.33+i*9),b=hash(X*.71+i);const cx=X+6+a*14,cy=y+8+b*10;c.fillStyle='#d6412f';c.beginPath();c.arc(cx,cy,5,0,TAU);c.fill();c.fillStyle='rgba(120,20,10,.5)';c.beginPath();c.arc(cx+1.5,cy+1,1.2,0,TAU);c.arc(cx-2,cy-1.5,1,0,TAU);c.fill();
     if(b>.5){c.fillStyle='#3d8f3a';c.beginPath();c.ellipse(cx+11,cy+5,3,1.6,a*3,0,TAU);c.fill()}}
   c.fillStyle='rgba(255,255,255,.35)';c.fillRect(x,y,w,3)}},
 {id:'grass',cur:'coin',price:700,r:2,draw(c,x,y,w,i){const sz=BH/4.25;const x0=Math.floor(x/sz)*sz;for(let r=0;r<5;r++)for(let X=x0;X<x+w;X+=sz){const h=hash(X*.13+r*7+i*3);let col;
     if(r===0)col=h>.5?'#6fd04b':'#5dbb3c';else if(r===1)col=hash(X*.2+i)>.55?'#5dbb3c':(h>.5?'#9a6a3d':'#8a5c33');else col=h>.8?'#a0a0a0':h>.5?'#8a5c33':'#7a4f2b';
     c.fillStyle=col;c.fillRect(X,y+r*sz,sz+.5,sz+.5)}c.fillStyle='rgba(0,0,0,.28)';c.fillRect(x,y+BH-2,w,2)}},
 {id:'water',cur:'coin',price:1800,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#7fe0ff','#2fb2ea','#1478c8']);c.fillRect(x,y,w,BH);const tt=tNow*.002;
   for(let L=0;L<3;L++){c.strokeStyle=`rgba(255,255,255,${.5-L*.13})`;c.lineWidth=2-L*.4;c.beginPath();const yy=y+7+L*9;for(let X=Math.floor(x/4)*4;X<=x+w;X+=4){const v=yy+Math.sin(X*.08+tt*(1+L*.4)+i+L*2)*2.2;X===Math.floor(x/4)*4?c.moveTo(X,v):c.lineTo(X,v)}c.stroke()}
   for(let X=Math.floor(x/30)*30;X<x+w;X+=30){const a=hash(X*.5+i);const by=y+BH-((tNow*.02+a*BH*3)%(BH+6));c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=1;c.beginPath();c.arc(X+a*20,by,1.5+a*1.5,0,TAU);c.stroke()}
   bevel(c,x,y,w,.4,.2)}},
 {id:'retro',cur:'coin',price:2400,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#2b0f4d','#521a6e','#ff3d8b']);c.fillRect(x,y,w,BH);c.strokeStyle='rgba(255,90,220,.55)';c.lineWidth=1;
   for(let X=Math.floor(x/12)*12;X<x+w;X+=12){c.beginPath();c.moveTo(X,y+BH*.45);c.lineTo(X+(X-W/2)*.35,y+BH);c.stroke()}
   const off=(tNow*.02)%6;for(let k=0;k<4;k++){const yy=y+BH*.45+Math.pow((k+off/6)/4,1.6)*BH*.55;c.beginPath();c.moveTo(x,yy);c.lineTo(x+w,yy);c.stroke()}
   c.fillStyle='#ffd23f';c.fillRect(x,y+5,w,2);c.fillStyle='#ff8a3d';c.fillRect(x,y+9,w,2);c.fillStyle='#ff3d8b';c.fillRect(x,y+13,w,2);c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x,y,w,2)}},
 {id:'comic',cur:'coin',price:2000,r:3,draw(c,x,y,w,i){const cols=['#ffd23f','#4dc3ff','#ff5d8f','#7bea72'];c.fillStyle=cols[i%4];c.fillRect(x,y,w,BH);c.fillStyle='rgba(0,0,0,.18)';
   for(let r=0;r<5;r++)for(let X=Math.floor(x/7)*7+(r%2?3.5:0);X<x+w;X+=7){const s=.6+r*.45;c.beginPath();c.arc(X,y+BH-3-r*6,s,0,TAU);c.fill()}
   c.fillStyle='rgba(255,255,255,.7)';c.fillRect(x,y+3,w,3);c.strokeStyle='#15121f';c.lineWidth=3;c.strokeRect(x+1.5,y+1.5,w-3,BH-3)}},
 {id:'gift',cur:'coin',price:1500,draw(c,x,y,w,i){const base=['#e8394d','#2f9d5b','#2d6ee0','#9b4de0'][i%4];c.fillStyle=base;c.fillRect(x,y,w,BH);c.fillStyle='rgba(255,255,255,.22)';
   for(let X=Math.floor(x/16)*16;X<x+w+16;X+=16)for(let r=0;r<2;r++){const cx=X+(r?8:0),cy=y+9+r*14;c.beginPath();for(let k=0;k<5;k++){const a=-Math.PI/2+k*TAU/5;c.lineTo(cx+Math.cos(a)*3.5,cy+Math.sin(a)*3.5);c.lineTo(cx+Math.cos(a+TAU/10)*1.5,cy+Math.sin(a+TAU/10)*1.5)}c.fill()}
   c.fillStyle='#ffd23f';c.fillRect(x,y+BH/2-3,w,6);c.fillStyle='rgba(180,120,0,.5)';c.fillRect(x,y+BH/2+2,w,1);const bx=Math.floor(x/150)*150+75;for(let X=bx;X<x+w+150;X+=150){if(X>x+2&&X<x+w-2){c.fillStyle='#ffd23f';c.fillRect(X-3,y,6,BH)}}bevel(c,x,y,w,.3,.25)}},
 {id:'piano',cur:'coin',price:1400,r:3,draw(c,x,y,w,i){c.fillStyle='#fbfbf7';c.fillRect(x,y,w,BH);const k=14;c.fillStyle='rgba(0,0,0,.25)';for(let X=Math.floor(x/k)*k;X<x+w;X+=k)c.fillRect(X,y,1,BH);
   c.fillStyle='#17151c';for(let X=Math.floor(x/k)*k;X<x+w+k;X+=k){const n=((Math.round(X/k)%7)+7)%7;if(n===2||n===6)continue;c.fillRect(X+k-4,y,8,BH*.58)}
   const hit=Math.floor(((tNow*.004)+i*3)%12);c.fillStyle='rgba(120,200,255,.35)';const hx=Math.floor(x/k)*k+hit*k;if(hx<x+w)c.fillRect(hx+1,y+BH*.6,k-1,BH*.4);c.fillStyle='#d9d6cf';c.fillRect(x,y+BH-3,w,3)}},
 {id:'sakura',cur:'lvl',price:15,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#ffe3ee','#ffc4da','#f79dbd']);c.fillRect(x,y,w,BH);c.strokeStyle='rgba(120,70,60,.55)';c.lineWidth=1.6;c.beginPath();for(let X=Math.floor(x/6)*6;X<=x+w;X+=6){const v=y+BH-7+Math.sin(X*.05+i)*4;X===Math.floor(x/6)*6?c.moveTo(X,v):c.lineTo(X,v)}c.stroke();
   for(let X=Math.floor(x/20)*20;X<x+w+20;X+=20){const a=hash(X*.43+i*3);const cx=X+a*12,cy=y+6+hash(X*.9+i)*16;c.fillStyle='#fff';for(let k=0;k<5;k++){const an=k*TAU/5+a;c.beginPath();c.ellipse(cx+Math.cos(an)*3,cy+Math.sin(an)*3,2.6,1.7,an,0,TAU);c.fill()}c.fillStyle='#ff7aa8';c.beginPath();c.arc(cx,cy,1.4,0,TAU);c.fill()}
   bevel(c,x,y,w,.45,.15)}},
 {id:'toxic',cur:'lvl',price:25,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#b6ff3d','#6fe02a','#2e9b1c']);c.fillRect(x,y,w,BH);
   for(let X=Math.floor(x/14)*14;X<x+w;X+=14){const a=hash(X*.37+i*2);const ph=(tNow*.0012*(0.6+a)+a*7)%1;const by=y+BH-2-ph*(BH-4);c.fillStyle=`rgba(230,255,170,${.75*(1-ph)})`;c.beginPath();c.arc(X+4+a*6,by,1.5+a*3*(1-ph*.5),0,TAU);c.fill()}
   c.fillStyle='#d8ff7a';c.fillRect(x,y,w,4);for(let X=Math.floor(x/11)*11;X<x+w;X+=11){const d=hash(X*.15+i*5);if(d>.4){const L=4+d*8+Math.sin(tNow*.003+X)*2;c.beginPath();c.ellipse(X+5,y+3+L/2,2.4,L/2,0,0,TAU);c.fill()}}
   c.fillStyle='rgba(0,60,0,.3)';c.fillRect(x,y+BH-4,w,4)}},
 {id:'aurora',cur:'lvl',price:30,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#13244d','#123a5c','#0c2440']);c.fillRect(x,y,w,BH);const tt=tNow*.0008;
   [['rgba(90,255,170,',0],['rgba(120,170,255,',2],['rgba(210,120,255,',4]].forEach(([col,ph],L)=>{c.beginPath();const x0=Math.floor(x/4)*4;c.moveTo(x0,y+BH);for(let X=x0;X<=x+w+4;X+=4){c.lineTo(X,y+4+L*6+Math.sin(X*.03+tt*(1+L*.3)+ph+i*.6)*7)}c.lineTo(x+w+4,y+BH);c.closePath();const g=c.createLinearGradient(0,y,0,y+BH);g.addColorStop(0,col+'0)');g.addColorStop(.35,col+'.9)');g.addColorStop(1,col+'0)');c.fillStyle=g;c.fill()});
   for(let X=Math.floor(x/11)*11;X<x+w;X+=11){const a=hash(X*.7+i);if(a>.7){c.fillStyle=`rgba(255,255,255,${.5+.5*Math.sin(tNow*.004+X)})`;c.fillRect(X,y+3+a*8,1.5,1.5)}}}},
 {id:'crystal',cur:'gem',price:70,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#e6c6ff','#a86bf0','#6a2fc0']);c.fillRect(x,y,w,BH);const s=16;
   for(let X=Math.floor(x/s)*s;X<x+w+s;X+=s){const a=hash(X*.29+i*4),h=BH*(.45+a*.5);c.fillStyle=`rgba(255,255,255,${.18+a*.25})`;c.beginPath();c.moveTo(X,y+BH);c.lineTo(X+s/2,y+BH-h);c.lineTo(X+s/2+2,y+BH);c.fill();c.fillStyle=`rgba(60,0,120,${.15+a*.2})`;c.beginPath();c.moveTo(X+s/2+2,y+BH);c.lineTo(X+s/2,y+BH-h);c.lineTo(X+s,y+BH);c.fill()}
   const sp=((tNow*.2+i*70)%(W+200))-100;if(sp>x-8&&sp<x+w+8){c.fillStyle='#fff';c.beginPath();c.moveTo(sp,y+BH/2-6);c.lineTo(sp+1.6,y+BH/2);c.lineTo(sp,y+BH/2+6);c.lineTo(sp-1.6,y+BH/2);c.fill();c.fillRect(sp-5,y+BH/2-.8,10,1.6)}bevel(c,x,y,w,.45,.2)}},
 {id:'fire',cur:'gem',price:100,draw(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#ffe066','#ff8a1f','#d62b1f']);c.fillRect(x,y,w,BH);const tt=tNow*.006;
   [['rgba(255,60,20,.75)',1,14],['rgba(255,170,40,.85)',.7,10],['rgba(255,245,170,.9)',.45,6]].forEach(([col,amp,base],L)=>{c.fillStyle=col;c.beginPath();const x0=Math.floor(x/5)*5;c.moveTo(x0,y+BH);for(let X=x0;X<=x+w+5;X+=5){const f=Math.sin(X*.09+tt*(1.4+L*.3)+i)+Math.sin(X*.23-tt*2+L)*.6;c.lineTo(X,y+BH-base-(f+1.6)*5*amp)}c.lineTo(x+w+5,y+BH);c.closePath();c.fill()});
   for(let X=Math.floor(x/17)*17;X<x+w;X+=17){const a=hash(X*.6+i);const ph=(tNow*.0015+a)%1;c.fillStyle=`rgba(255,230,120,${1-ph})`;c.fillRect(X+a*10,y+BH-ph*BH,2,2)}}},
 {id:'matrix',cur:'gem',price:110,draw(c,x,y,w,i){c.fillStyle='#03140a';c.fillRect(x,y,w,BH);c.font='bold 10px monospace';c.textAlign='center';c.textBaseline='top';const cw=9;
   for(let X=Math.floor(x/cw)*cw;X<x+w;X+=cw){const a=hash(X*.31+i*7);const sp=.02+a*.03;const head=((tNow*sp+a*100)%(BH+30))-10;for(let r=0;r<4;r++){const yy=y+r*9;const d=head-yy;const alpha=d<0?.28:d<9?1:Math.max(.28,1-d/40);const ch='01ｱｲｳｴｵｶｷｸｹｺ7Z3'[((Math.round(X/cw)*7+r*13+Math.floor(tNow*.004))%15+15)%15];c.fillStyle=d>=0&&d<9?`rgba(200,255,210,${alpha})`:`rgba(40,230,90,${alpha})`;c.fillText(ch,X+cw/2,yy)}}
   c.strokeStyle='rgba(40,230,90,.6)';c.lineWidth=1.5;c.strokeRect(x+.75,y+.75,w-1.5,BH-1.5)}},
 {id:'plasma',cur:'gem',price:140,draw(c,x,y,w,i){const tt=tNow*.002;const s=6;const X0=Math.floor(x/s)*s,cols=Math.ceil((x+w-X0)/s)+1,rows=Math.ceil(BH/s);
   // calcula as cores numa imagem pequena (1 pixel por quadradinho) e amplia de uma vez: mesmo visual, muito menos trabalho
   const pc=plasmaBuf(cols,rows),d=pc.img.data;let o=0;
   for(let Y=0;Y<rows*s;Y+=s)for(let X=X0;X<X0+cols*s;X+=s){const v=Math.sin(X*.04+tt)+Math.sin((Y+i*BH)*.09+tt*1.3)+Math.sin((X+Y+i*20)*.03-tt*.8);hsl2rgb(265+v*55+Math.sin(X*.01)*20,.95,(55+v*6)/100,d,o);o+=4}
   pc.c.putImageData(pc.img,0,0);const sm=c.imageSmoothingEnabled;c.imageSmoothingEnabled=false;c.drawImage(pc.cv,0,0,cols,rows,X0,y,cols*s,rows*s);c.imageSmoothingEnabled=sm;
   c.fillStyle='rgba(255,255,255,.18)';c.fillRect(x,y,w,4);c.fillStyle='rgba(0,0,0,.25)';c.fillRect(x,y+BH-4,w,4)}}

);


/* ---- skins "divididas": a parte parada (base) é desenhada 1 vez e guardada; só o brilho/movimento (fx) é desenhado todo frame.
   Mantém 100% da animação e corta quase todo o custo. ---- */
function splitSkin(id,base,fx){const sk=SKINS.find(s=>s.id===id);if(!sk)return;sk.base=base;sk.fx=fx;sk.draw=function(c,x,y,w,i){base(c,x,y,w,i);fx(c,x,y,w,i)}}
const WA=Array.from({length:21},(_,k)=>`rgba(255,255,255,${k/20})`); // brancos com transparência prontos
splitSkin('galaxy',(c,x,y,w,i)=>{const g=c.createLinearGradient(0,0,W,0);g.addColorStop(0,'#1b0b45');g.addColorStop(.5,'#5a1d8f');g.addColorStop(1,'#0e2a6b');c.fillStyle=g;c.fillRect(x,y,w,BH);
   const nx=hash(i*3.1)*W;const rg=c.createRadialGradient(nx,y+BH/2,0,nx,y+BH/2,70);rg.addColorStop(0,'rgba(255,120,200,.45)');rg.addColorStop(1,'rgba(255,120,200,0)');c.fillStyle=rg;c.fillRect(x,y,w,BH);bevel(c,x,y,w,.18,.3)},
 (c,x,y,w,i)=>{for(let X=Math.floor(x/9)*9;X<x+w;X+=9){const a=hash(X*.7+i*13);if(a>.45){c.fillStyle=WA[Math.round((.4+.6*Math.abs(Math.sin(tNow*.003+X)))*20)];const s=a>.9?2.2:1.3;c.fillRect(X+hash(X+i)*6,y+4+hash(X*1.3+i)*(BH-8),s,s)}}});
splitSkin('honey',(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#ffd35c','#f6a91c','#d97d06']);c.fillRect(x,y,w,BH);const r=7,hx=r*1.5,hy=r*Math.sqrt(3);c.strokeStyle='rgba(140,70,0,.45)';c.lineWidth=1.6;
   for(let col=Math.floor(x/hx)-1;col*hx<x+w+hx;col++){const cx=col*hx,off=(col%2+2)%2?hy/2:0;for(let cy=y-hy+off+((i*5)%hy);cy<y+BH+hy;cy+=hy){c.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;c.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a))}c.closePath();c.stroke()}}bevel(c,x,y,w,.25,.25)},
 (c,x,y,w,i)=>{const p=.5+.5*Math.sin(tNow*.003+i);c.fillStyle=`rgba(255,250,210,${(.25+.2*p).toFixed(2)})`;c.fillRect(x,y,w,4)});
splitSkin('crystal',(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#e6c6ff','#a86bf0','#6a2fc0']);c.fillRect(x,y,w,BH);const s=16;
   for(let X=Math.floor(x/s)*s;X<x+w+s;X+=s){const a=hash(X*.29+i*4),h=BH*(.45+a*.5);c.fillStyle=`rgba(255,255,255,${.18+a*.25})`;c.beginPath();c.moveTo(X,y+BH);c.lineTo(X+s/2,y+BH-h);c.lineTo(X+s/2+2,y+BH);c.fill();c.fillStyle=`rgba(60,0,120,${.15+a*.2})`;c.beginPath();c.moveTo(X+s/2+2,y+BH);c.lineTo(X+s/2,y+BH-h);c.lineTo(X+s,y+BH);c.fill()}bevel(c,x,y,w,.45,.2)},
 (c,x,y,w,i)=>{const sp=((tNow*.2+i*70)%(W+200))-100;if(sp>x-8&&sp<x+w+8){c.fillStyle='#fff';c.beginPath();c.moveTo(sp,y+BH/2-6);c.lineTo(sp+1.6,y+BH/2);c.lineTo(sp,y+BH/2+6);c.lineTo(sp-1.6,y+BH/2);c.fill();c.fillRect(sp-5,y+BH/2-.8,10,1.6)}});
splitSkin('diamond',(c,x,y,w,i)=>{c.fillStyle='#bdf3ff';c.fillRect(x,y,w,BH);const s=17;for(let X=Math.floor(x/s)*s;X<x+w;X+=s){const a=hash(X*.37+i),b=hash(X*.91+i);c.fillStyle=`rgba(255,255,255,${.25+a*.6})`;c.beginPath();c.moveTo(X,y);c.lineTo(X+s,y);c.lineTo(X+s/2,y+BH/2);c.fill();c.fillStyle=`rgba(60,160,220,${.2+b*.45})`;c.beginPath();c.moveTo(X,y+BH);c.lineTo(X+s,y+BH);c.lineTo(X+s/2,y+BH/2);c.fill()}bevel(c,x,y,w,.5,.18)},
 (c,x,y,w,i)=>{const sp=((tNow*.25+i*60)%(W+160))-80;if(sp>x-10&&sp<x+w+10){c.fillStyle='#fff';c.beginPath();c.moveTo(sp,y+BH/2-7);c.lineTo(sp+2,y+BH/2);c.lineTo(sp,y+BH/2+7);c.lineTo(sp-2,y+BH/2);c.fill()}});
// matrix: letras vêm de uma "folha" pronta (desenhar imagem é bem mais leve que escrever texto)
const MX_CH='01ｱｲｳｴｵｶｷｸｹｺ7Z3';let MX=null;
function mxAtlas(){if(MX&&MX.d===DPR)return MX;const d=DPR||1,cw=10,chh=11;const cv=document.createElement('canvas');cv.width=Math.ceil(MX_CH.length*cw*d);cv.height=Math.ceil(chh*2*d);const c=cv.getContext('2d');c.scale(d,d);c.font='bold 10px monospace';c.textAlign='center';c.textBaseline='top';
  [...MX_CH].forEach((ch,k)=>{c.fillStyle='rgb(40,230,90)';c.fillText(ch,k*cw+cw/2,0);c.fillStyle='rgb(200,255,210)';c.fillText(ch,k*cw+cw/2,chh)});return MX={cv,d,cw,chh}}
splitSkin('matrix',(c,x,y,w,i)=>{c.fillStyle='#03140a';c.fillRect(x,y,w,BH);c.strokeStyle='rgba(40,230,90,.6)';c.lineWidth=1.5;c.strokeRect(x+.75,y+.75,w-1.5,BH-1.5)},
 (c,x,y,w,i)=>{const A=mxAtlas(),cw=9,ga=c.globalAlpha;
   for(let X=Math.floor(x/cw)*cw;X<x+w;X+=cw){const a=hash(X*.31+i*7);const sp=.02+a*.03;const head=((tNow*sp+a*100)%(BH+30))-10;for(let r=0;r<4;r++){const yy=y+r*9;const d=head-yy;const al=d<0?.28:d<9?1:Math.max(.28,1-d/40);const k=((Math.round(X/cw)*7+r*13+Math.floor(tNow*.004))%15+15)%15;const br=d>=0&&d<9?1:0;
     c.globalAlpha=ga*al;c.drawImage(A.cv,k*A.cw*A.d,br*A.chh*A.d,A.cw*A.d,A.chh*A.d,X+cw/2-A.cw/2,yy,A.cw,A.chh)}}c.globalAlpha=ga;
   c.strokeStyle='rgba(40,230,90,.6)';c.lineWidth=1.5;c.strokeRect(x+.75,y+.75,w-1.5,BH-1.5)});

/* ---- TEMPESTADE VIOLETA (pedido de um testador): escudo de energia roxo, borda neon bem visível
   e uma corrente elétrica que corre pela borda de cada bloco, em cascata pela torre ---- */
function rimPt(x,y,w,h,s){const P=2*(w+h);s=((s%P)+P)%P;if(s<w)return[x+s,y];s-=w;if(s<h)return[x+w,y+s];s-=h;if(s<w)return[x+w-s,y+h];s-=w;return[x,y+h-s]}
SKINS.push({id:'void',cur:'gem',price:150,
 base(c,x,y,w,i){c.fillStyle=vgrad(c,y,['#7b3ff2','#2b0b72','#5b21b6']);c.fillRect(x,y,w,BH);
   // escudo de hexágonos bem sutil
   const r=6,hx=r*1.5,hy=r*Math.sqrt(3);c.strokeStyle='rgba(215,180,255,.28)';c.lineWidth=1;
   for(let col=Math.floor(x/hx)-1;col*hx<x+w+hx;col++){const cx=col*hx,off=(col%2+2)%2?hy/2:0;for(let cy=y-hy+off;cy<y+BH+hy;cy+=hy){c.beginPath();for(let k=0;k<6;k++){const a=k*Math.PI/3;c.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a))}c.closePath();c.stroke()}}
   const g=c.createLinearGradient(0,y,0,y+BH);g.addColorStop(0,'rgba(255,255,255,.22)');g.addColorStop(.35,'rgba(255,255,255,0)');c.fillStyle=g;c.fillRect(x,y,w,BH);
   // borda neon dupla
   c.strokeStyle='rgba(150,70,255,.75)';c.lineWidth=4;c.strokeRect(x+2,y+2,w-4,BH-4);c.strokeStyle='#e9d5ff';c.lineWidth=1.6;c.strokeRect(x+1,y+1,w-2,BH-2)},
 fx(c,x,y,w,i){if(w<14)return;const P=2*(w-3+BH-3),sp=tNow*.32+i*61,x0=x+1.5,y0=y+1.5,ww=w-3,hh=BH-3;
   // 2 faíscas correndo pela borda (sentidos opostos) com rastro brilhante
   c.lineCap='round';for(const dir of [1,-1]){const s0=dir>0?sp:P-sp*.8+i*23;for(let k=0;k<18;k++){const a=rimPt(x0,y0,ww,hh,s0-dir*k*5),b=rimPt(x0,y0,ww,hh,s0-dir*(k+1)*5);
     c.strokeStyle=k<3?'#ffffff':`rgba(${dir>0?'225,185,255':'140,220,255'},${(1-k/18).toFixed(2)})`;c.lineWidth=k<3?3.4:3-k*.14;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke()}
     const h=rimPt(x0,y0,ww,hh,s0);const gl=c.createRadialGradient(h[0],h[1],0,h[0],h[1],16);gl.addColorStop(0,dir>0?'rgba(245,225,255,.95)':'rgba(200,240,255,.9)');gl.addColorStop(1,'rgba(160,80,255,0)');c.fillStyle=gl;c.fillRect(h[0]-16,h[1]-16,32,32)}
   // luz varrendo o escudo em diagonal a cada ~3s
   const ph=((tNow+i*140)%3000)/3000,sx=x-40+ph*(w+80);if(ph<.99){const sg=c.createLinearGradient(sx-18,0,sx+18,0);sg.addColorStop(0,'rgba(200,150,255,0)');sg.addColorStop(.5,'rgba(235,210,255,.38)');sg.addColorStop(1,'rgba(200,150,255,0)');c.fillStyle=sg;c.beginPath();c.moveTo(sx-10,y);c.lineTo(sx+26,y);c.lineTo(sx+10,y+BH);c.lineTo(sx-26,y+BH);c.fill()}
   // estalo elétrico curto de vez em quando
   const slot=Math.floor(tNow/140),q=hash(slot*1.3+i*2.7);if(q>.72){let px=x+6+hash(slot+i)*(w-40),py=y+BH/2;c.strokeStyle='rgba(245,230,255,.95)';c.lineWidth=1.3;c.beginPath();c.moveTo(px,py);for(let s2=1;s2<=5;s2++){px+=6;py=y+BH/2+(hash(slot*2.1+s2+i)-.5)*14;c.lineTo(px,py)}c.stroke()}},
 draw(c,x,y,w,i){this.base(c,x,y,w,i);this.fx(c,x,y,w,i)}});
