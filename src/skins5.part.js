/* ================= SKINS DE SOM (v1.5) =================
   Cada skin muda o SOM do jogo: o bloco que você solta vira nota/batida, e a torre vira música.
   Visual animado leve (base parada + fx). O "pacote de som" fica em SND e o sfx do jogo usa ele quando a skin está equipada. */
const SCALE=[261.63,293.66,329.63,392,440,523.25,587.33,659.25,783.99,880,1046.5,1174.66];
const MINOR=[220,261.63,293.66,329.63,392,440,523.25,587.33,659.25,783.99,880];
const noteAt=(arr,h)=>{const n=arr.length,k=h%(2*n-2);return arr[k<n?k:2*n-2-k]}; // sobe e desce a escala
const MELODY=[0,0,4,4,5,5,4,3,3,2,2,1,1,0,4,4,3,3,2,2,1]; // melodia simples (própria) da caixinha
function kick(t0,p=.7){osc('sine',150,t0,.28,p,A.sfx,{glide:42});noise(t0,.015,.15,A.sfx,'highpass',3000)}
function snare(t0,p=.3){noise(t0,.16,p,A.sfx,'bandpass',1900,.8);osc('triangle',190,t0,.1,p*.6,A.sfx,{glide:120})}
function hat(t0,p=.12){noise(t0,.045,p,A.sfx,'highpass',7500,1)}
const SND={
 eq:{place(h){const t0=now(),f=noteAt(MINOR,h);osc('sawtooth',f,t0,.22,.09,A.sfx,{rev:.2});osc('sine',f/2,t0,.25,.2,A.sfx)},perfect(c){const t0=now();[0,4,7].forEach((k,j)=>osc('sawtooth',MINOR[Math.min(10,k+Math.min(c,3))],t0+j*.05,.25,.08,A.sfx,{rev:.3}))}},
 speaker:{place(h){const t0=now();kick(t0,.75);if(h%2)hat(t0+.12,.08)},perfect(c){const t0=now();kick(t0,.8);kick(t0+.12,.5);osc('sine',55,t0,.5,.3,A.sfx)}},
 vinyl:{place(h){const t0=now();noise(t0,.12,.28,A.sfx,'bandpass',h%2?900:2600,2,h%2?2600:900);kick(t0,.35)},perfect(){const t0=now();noise(t0,.08,.3,A.sfx,'bandpass',700,2,3000);noise(t0+.09,.08,.3,A.sfx,'bandpass',3000,2,700);noise(t0+.18,.12,.3,A.sfx,'bandpass',700,2,4000)}},
 guitar:{place(h){const t0=now(),f=noteAt([164.81,196,220,246.94,293.66,329.63,392,440,493.88,587.33],h);osc('triangle',f,t0,.6,.3,A.sfx,{a:.002,rev:.3});osc('sine',f*2,t0,.3,.1,A.sfx,{a:.002});noise(t0,.02,.08,A.sfx,'highpass',4000)},
   perfect(){const t0=now();[164.81,246.94,329.63,415.3].forEach((f,j)=>osc('triangle',f,t0+j*.03,.9,.18,A.sfx,{a:.002,rev:.4}))}},
 drums:{place(h){const t0=now(),k=h%4;if(k===0)kick(t0,.7);else if(k===2)snare(t0,.32);else hat(t0,.14)},perfect(){const t0=now();kick(t0,.7);noise(t0,.7,.2,A.sfx,'highpass',5200,.7)}},
 xylo:{place(h){const t0=now(),f=noteAt(SCALE,h)*2;osc('sine',f,t0,.35,.3,A.sfx,{a:.002,rev:.25});osc('sine',f*3.9,t0,.08,.08,A.sfx,{a:.001})},perfect(c){const t0=now();for(let j=0;j<3;j++){const f=SCALE[Math.min(11,j*2+Math.min(c,5))]*2;osc('sine',f,t0+j*.07,.4,.22,A.sfx,{a:.002,rev:.3})}}},
 chip:{place(h){const t0=now(),f=noteAt(SCALE,h)*2;osc('square',f,t0,.07,.07,A.sfx);osc('square',f*1.5,t0+.06,.07,.06,A.sfx)},perfect(c){const t0=now();[1,1.25,1.5,2].forEach((m,j)=>osc('square',SCALE[Math.min(11,c)]*2*m,t0+j*.05,.06,.07,A.sfx))}},
 wave:{place(h){const t0=now(),f=noteAt(SCALE,h);osc('sine',f,t0,.2,.3,A.sfx,{glide:f*2,rev:.2})},perfect(){const t0=now();osc('sine',300,t0,.35,.28,A.sfx,{glide:1200,rev:.4});osc('sine',600,t0+.08,.3,.15,A.sfx,{glide:2400})}},
 musicbox:{place(h){const t0=now(),f=SCALE[MELODY[h%MELODY.length]+5]*2;bell(f,t0,.14,1.4,.6)},perfect(){const t0=now();[0,2,4].forEach((k,j)=>bell(SCALE[k+7]*2,t0+j*.08,.1,1.4,.6))}},
 laser:{place(h){const t0=now(),f=1400+(h%5)*120;osc('square',f,t0,.16,.06,A.sfx,{glide:180});osc('sine',f/2,t0,.16,.12,A.sfx,{glide:90})},perfect(){const t0=now();for(let j=0;j<3;j++)osc('square',1800-j*200,t0+j*.06,.14,.06,A.sfx,{glide:200})}},
};
// toca uma amostra do som (loja / coleção)
function sndDemo(key){const p=SND[key];if(!p||!S.settings.sfx||!A.ctx)return;const go=()=>{if(!sfx.ok())return;[0,1,2,3].forEach(k=>setTimeout(()=>p.place(k+(k>1?2:0)),k*190));setTimeout(()=>p.perfect(3),800)};if(A.ctx.state!=='running')A.ctx.resume().then(go).catch(()=>{});else go()}
function sk5(id,snd,cur,price,base,fx){SKINS.push({id,cat:'sound',snd,cur,price,base,fx,draw(c,x,y,w,i){this.base(c,x,y,w,i);this.fx(c,x,y,w,i)}})}
const EQC=['#4fe39a','#9be15d','#ffd23f','#ff9f1c','#ff4d6d'];
function note8(c,x,y,s,col){c.fillStyle=col;c.beginPath();c.ellipse(x,y,s*.55,s*.4,-.4,0,TAU);c.fill();c.fillRect(x+s*.4,y-s*1.6,s*.18,s*1.6);c.beginPath();c.moveTo(x+s*.58,y-s*1.6);c.quadraticCurveTo(x+s*1.2,y-s*1.2,x+s*.9,y-s*.7);c.lineTo(x+s*.58,y-s*1.1);c.fill()}

/* 1. EQUALIZADOR */
sk5('snd_eq','eq','coin',1600,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#171a2e','#10121f','#0a0b14']);c.fillRect(x,y,w,BH);c.fillStyle='rgba(255,255,255,.05)';for(let Y=4;Y<BH;Y+=5)c.fillRect(x,y+Y,w,1)},
 (c,x,y,w,i)=>{for(let X=Math.floor(x/7)*7;X<x+w;X+=7){const v=.5+.28*Math.sin(tNow*.009+X*.07+i)+.22*Math.sin(tNow*.023+X*.19);const n=Math.max(1,Math.round(v*6));for(let k=0;k<n;k++){c.fillStyle=EQC[Math.min(4,Math.floor(k*5/6))];c.fillRect(X+1,y+BH-4-k*5,5,4)}}});
/* 2. CAIXA DE SOM */
sk5('snd_speaker','speaker','coin',1700,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#3a3a44','#2a2a33','#1d1d24']);c.fillRect(x,y,w,BH);c.fillStyle='rgba(0,0,0,.35)';for(let X=Math.floor(x/4)*4;X<x+w;X+=4)for(let Y=2;Y<BH;Y+=4)c.fillRect(X,y+Y,2,2);
   for(const [X] of at(x,w,i,70)){circ(c,X,y+BH/2,14,'#15151a');circ(c,X,y+BH/2,12,'#2e2e38')}bevel(c,x,y,w,.15,.3)},
 (c,x,y,w,i)=>{const beat=(tNow%500)/500,pump=Math.exp(-beat*6);for(const [X] of at(x,w,i,70)){const r=8+pump*2.5;const g=c.createRadialGradient(X,y+BH/2,1,X,y+BH/2,r);g.addColorStop(0,'#6b6b7a');g.addColorStop(1,'#1d1d24');c.fillStyle=g;c.beginPath();c.arc(X,y+BH/2,r,0,TAU);c.fill();circ(c,X,y+BH/2,3,'#9a9aa8');
   c.strokeStyle=`rgba(255,93,143,${(pump*.8).toFixed(2)})`;c.lineWidth=1.5;for(const s of [-1,1]){c.beginPath();c.arc(X,y+BH/2,16+beat*10,s>0?-.5:Math.PI-.5,s>0?.5:Math.PI+.5);c.stroke()}}});
/* 3. DJ (VINIL) */
sk5('snd_vinyl','vinyl','gem',90,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#2b1d4a','#1b1233','#120b22']);c.fillRect(x,y,w,BH);c.fillStyle='rgba(255,93,143,.6)';c.fillRect(x,y+BH-2,w,2);
   for(const [X] of at(x,w,i,90)){circ(c,X,y+BH/2,14,'#0b0b0f');c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=1;for(let r=6;r<14;r+=2){c.beginPath();c.arc(X,y+BH/2,r,0,TAU);c.stroke()}}},
 (c,x,y,w,i)=>{for(const [X,a] of at(x,w,i,90)){const cy=y+BH/2,rot=tNow*.006+a*6;circ(c,X,cy,5,a>.5?'#ff5d8f':'#5ee0ff');c.save();c.translate(X,cy);c.rotate(rot);c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.moveTo(0,0);c.arc(0,0,13,-.25,.25);c.fill();c.fillStyle='#fff';c.fillRect(-.8,-4.5,1.6,2.5);c.restore();circ(c,X,cy,1,'#111')}});
/* 4. VIOLÃO */
sk5('snd_guitar','guitar','coin',1500,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#e0a15a','#c47f36','#a5642a']);c.fillRect(x,y,w,BH);c.strokeStyle='rgba(120,60,10,.25)';c.lineWidth=1;for(let k=0;k<5;k++){c.beginPath();const x0=Math.floor(x/40)*40;c.moveTo(x0,y+4+k*7);for(let X=x0;X<x+w+40;X+=40)c.quadraticCurveTo(X+20,y+2+k*7+hash(X+k)*4,X+40,y+4+k*7);c.stroke()}
   for(const [X] of at(x,w,i,120)){circ(c,X,y+BH/2,11,'#3a220e');c.strokeStyle='#f3d7a6';c.lineWidth=1.5;c.beginPath();c.arc(X,y+BH/2,12.5,0,TAU);c.stroke()}bevel(c,x,y,w,.25,.2)},
 (c,x,y,w,i)=>{const per=1400,ph=((tNow+i*230)%per)/per,amp=Math.exp(-ph*5)*2.2;c.strokeStyle='rgba(245,240,230,.85)';c.lineWidth=.9;for(let k=0;k<6;k++){const yy=y+6+k*4.4;c.beginPath();for(let X=x;X<=x+w;X+=6)c.lineTo(X,yy+Math.sin(X*.25+tNow*.09+k)*amp*(1-k*.1));c.stroke()}});
/* 5. BATERIA */
sk5('snd_drums','drums','coin',1800,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#d62839','#b01e2f','#8a1624']);c.fillRect(x,y,w,BH);for(let X=Math.floor(x/6)*6;X<x+w;X+=6)if(hash(X+i)>.6)circ(c,X+3,y+hash(X*2)*BH,.8,'rgba(255,255,255,.5)');
   for(const [X] of at(x,w,i,100)){ell(c,X,y+BH*.62,13,7,'#f4f1e8');ell(c,X,y+BH*.62,13,7,'rgba(0,0,0,0)');c.strokeStyle='#c9a227';c.lineWidth=2;c.beginPath();c.ellipse(X,y+BH*.62,13,7,0,0,TAU);c.stroke()}bevel(c,x,y,w,.2,.25)},
 (c,x,y,w,i)=>{const b=(tNow%600)/600;for(const [X,a] of at(x,w,i,100)){const hit=Math.exp(-b*8),side=((Math.floor(tNow/600)+Math.floor(a*4))%2)?1:-1,ang=-.9+hit*.7;c.save();c.translate(X+side*14,y+2);c.rotate(side*ang);c.fillStyle='#f6e2b3';c.fillRect(-1,0,2.2,16);circ(c,0,16,1.8,'#f6e2b3');c.restore();
   if(hit>.4){c.strokeStyle=`rgba(255,255,255,${((hit-.4)*1.5).toFixed(2)})`;c.lineWidth=1.2;c.beginPath();c.ellipse(X,y+BH*.62,15,8.5,0,0,TAU);c.stroke()}}});
/* 6. XILOFONE */
const XYC=['#ff4d6d','#ff9f1c','#ffd23f','#4fe39a','#4cc9f0','#7b6cff','#c77dff'];
sk5('snd_xylo','xylo','coin',1400,(c,x,y,w,i)=>{c.fillStyle='#5b3a1e';c.fillRect(x,y,w,BH);for(let X=Math.floor(x/15)*15;X<x+w+15;X+=15){const k=((Math.floor(X/15)%7)+7)%7,hh=BH-4-k*1.4;c.fillStyle=XYC[k];rr(c,X+1.5,y+(BH-hh)/2,12,hh,3);c.fill();circ(c,X+7.5,y+(BH-hh)/2+3,1.2,'#e6e6e6');circ(c,X+7.5,y+(BH+hh)/2-3,1.2,'#e6e6e6')}},
 (c,x,y,w,i)=>{const P=W,mx=((tNow*.12+i*47)%P),hop=Math.abs(Math.sin(tNow*.02));const kx=Math.floor(mx/15)*15;if(kx>=x-15&&kx<x+w){c.fillStyle='rgba(255,255,255,.35)';c.fillRect(kx+1.5,y+2,12,BH-4)}
   if(mx>x-10&&mx<x+w+10){c.save();c.translate(mx,y+4-hop*6);c.rotate(-.5);c.fillStyle='#d9b38c';c.fillRect(-1,0,2,14);circ(c,0,0,3.2,'#ff5d8f');c.restore()}});
/* 7. 8-BIT */
sk5('snd_chip','chip','coin',1300,(c,x,y,w,i)=>{c.fillStyle='#1d2b53';c.fillRect(x,y,w,BH);c.fillStyle='#29366f';for(let X=Math.floor(x/6)*6;X<x+w;X+=6)for(let Y=0;Y<BH;Y+=6)if(((X/6)+(Y/6))%2===0)c.fillRect(X,y+Y,6,6);c.fillStyle='#ff004d';c.fillRect(x,y+BH-3,w,3)},
 (c,x,y,w,i)=>{const cols=['#00e436','#ffec27','#29adff','#ff77a8'];for(let k=0;k<Math.ceil(w/40);k++){const a=hash(k*2.7+i),ph=((tNow*.0005+a)%1),nx=Math.floor((x+a*w)/3)*3,ny=Math.floor((y+BH-ph*(BH+10))/3)*3;
   pxs(c,nx,ny,3,['..xx','..x.','..x.','xxx.','xx..'],{x:cols[k%4]})}});
/* 8. OSCILOSCÓPIO */
sk5('snd_wave','wave','gem',80,(c,x,y,w,i)=>{c.fillStyle='#04140a';c.fillRect(x,y,w,BH);c.strokeStyle='rgba(60,255,120,.12)';c.lineWidth=1;for(let X=Math.floor(x/10)*10;X<x+w;X+=10){c.beginPath();c.moveTo(X,y);c.lineTo(X,y+BH);c.stroke()}c.beginPath();c.moveTo(x,y+BH/2);c.lineTo(x+w,y+BH/2);c.stroke()},
 (c,x,y,w,i)=>{c.lineWidth=1.8;c.strokeStyle='#5dff8c';c.beginPath();for(let X=x;X<=x+w;X+=3)c.lineTo(X,y+BH/2+Math.sin(X*.09-tNow*.01+i)*9*Math.sin(tNow*.002+i));c.stroke();
   c.lineWidth=1;c.strokeStyle='rgba(94,224,255,.7)';c.beginPath();for(let X=x;X<=x+w;X+=3)c.lineTo(X,y+BH/2+Math.sin(X*.21+tNow*.013)*5);c.stroke()});
/* 9. CAIXINHA DE MÚSICA */
sk5('snd_musicbox','musicbox','gem',110,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#ffd6e7','#ffc2dc','#f7a8cb']);c.fillRect(x,y,w,BH);c.fillStyle='#e8c35a';c.fillRect(x,y+BH-8,w,8);for(let X=Math.floor(x/5)*5;X<x+w;X+=5){c.fillStyle='#fff3c4';c.fillRect(X+1,y+BH-8,2.4,6)}
   c.strokeStyle='rgba(200,120,160,.4)';c.lineWidth=1;for(let X=Math.floor(x/30)*30;X<x+w;X+=30){c.beginPath();c.arc(X+15,y+BH*.35,6,0,TAU);c.stroke()}bevel(c,x,y,w,.4,.15)},
 (c,x,y,w,i)=>{const cols=['#c2185b','#7b1fa2','#1976d2','#e65100'];for(let k=0;k<Math.ceil(w/45);k++){const a=hash(k*3.1+i),ph=((tNow*.00045+a)%1),nx=x+a*w+Math.sin(ph*6+k)*6,ny=y+BH-8-ph*(BH-4);c.globalAlpha=Math.sin(ph*Math.PI);note8(c,nx,ny,5,cols[k%4]);c.globalAlpha=1}
   const off=(tNow*.02)%5;for(let X=Math.floor(x/5)*5;X<x+w;X+=5)if(hash(Math.floor((X+off)/5)+i)>.8)circ(c,X+off,y+BH-2,.9,'#8a6d1f')});
/* 10. LASER */
sk5('snd_laser','laser','gem',120,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#1e0b3b','#140728','#0b0418']);c.fillRect(x,y,w,BH);c.strokeStyle='rgba(180,90,255,.25)';c.lineWidth=1;c.strokeRect(x+1,y+1,w-2,BH-2)},
 (c,x,y,w,i)=>{const cols=['#ff4dff','#4dfff3','#fff04d'];c.lineCap='round';for(let k=0;k<3;k++){const a=tNow*.0015*(k+1)+k*2+i,px=x+w/2+Math.sin(a)*w*.45;c.strokeStyle=cols[k];c.globalAlpha=.25;c.lineWidth=5;c.beginPath();c.moveTo(px,y+BH);c.lineTo(px+Math.cos(a)*30,y);c.stroke();c.globalAlpha=.9;c.lineWidth=1.4;c.stroke();c.globalAlpha=1}
   for(let k=0;k<Math.ceil(w/35);k++){const a=hash(k*1.9+i),tw=Math.abs(Math.sin(tNow*.006+k));c.fillStyle=al(tw);c.fillRect(x+a*w,y+hash(k*5+i)*BH,1.6,1.6)}});
