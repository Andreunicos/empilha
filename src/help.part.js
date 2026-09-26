/* ================= DICAS, ONDAS E COMO JOGAR ================= */
// dica que aparece só na primeira vez (fica guardada no save)
function tip(key,html,where){
  S.tips=S.tips||{};if(S.tips[key])return;S.tips[key]=1;save();
  const el=$('tipB');el.className='tp-'+(where||'mid');el.innerHTML=html;el.hidden=false;
  clearTimeout(tip.t);tip.t=setTimeout(()=>el.hidden=true,4200);
}
// ondas gravitacionais: anéis que saem da linha do bloco e rastro quando acelera (dá pra ler o ritmo)
function drawWaves(y,wd){
  const ph=Math.sin(tNow*WAVE_W),cyc=(tNow*WAVE_W/(Math.PI*2))%1,cy=y+BH/2,amp=waveAmp(wd);
  ctx.save();
  for(let k=0;k<3;k++){const r=(cyc+k/3)%1;const a=(1-r)*(.35+.35*Math.max(0,ph));
    ctx.strokeStyle=ph>0?`rgba(120,230,255,${a})`:`rgba(190,150,255,${a*.7})`;ctx.lineWidth=2+3*(1-r);
    ctx.beginPath();ctx.ellipse(W/2,cy,20+r*W*.75,6+r*46,0,0,Math.PI*2);ctx.stroke()}
  if(moving&&ph>.25){const n=4,dir=moving.dir;ctx.strokeStyle=`rgba(160,240,255,${(ph-.25)*.8})`;ctx.lineWidth=2;
    for(let k=0;k<n;k++){const yy=y+6+k*(BH-12)/(n-1),x0=dir>0?moving.x:moving.x+moving.w,len=18+ph*amp*120;ctx.beginPath();ctx.moveTo(x0-dir*4,yy);ctx.lineTo(x0-dir*(4+len),yy);ctx.stroke()}}
  ctx.restore();
}

/* ---- tela Como jogar ---- */
const HELP=[
 {k:'tap',draw(c,w,h){const bw=w*.58,bx=(w-bw)/2;block(bx,h-BH*.9,bw,1,1,c);block(bx+2,h-BH*1.9,bw-4,2,1,c);const mx=bx+16+Math.sin(tNow*.003)*14;block(mx,h-BH*2.9-6,bw-4,3,1,c);
   c.fillStyle='#fff';c.beginPath();c.arc(w*.82,16,9+Math.sin(tNow*.008)*2,0,7);c.globalAlpha=.85;c.fill();c.globalAlpha=1}},
 {k:'perf',draw(c,w,h){const bw=w*.5+Math.min(10,((tNow*.004)%3|0)*4),bx=(w-bw)/2;for(let r=0;r<3;r++)block(bx,h-BH*(r+.9),bw,r+4,1,c);
   c.strokeStyle='#fff';c.lineWidth=2;c.globalAlpha=.5+.5*Math.sin(tNow*.008);c.strokeRect(bx-4,h-BH*2.9-4,bw+8,BH*3+2);c.globalAlpha=1;
   c.fillStyle='#4fe39a';c.font='900 16px Nunito';c.textAlign='center';c.fillText('+',bx-10,h-BH*1.3);c.fillText('+',bx+bw+10,h-BH*1.3)}},
 {k:'bonus',draw(c,w,h){const bw=w*.62,bx=(w-bw)/2,y=h/2-BH/2;block(bx,y,bw,6,1,c);const p=.5+.5*Math.sin(tNow*.01);c.strokeStyle='#7fd1ff';c.globalAlpha=.6+.4*p;c.lineWidth=3;rr(c,bx-3,y-3,bw+6,BH+6,7);c.stroke();c.globalAlpha=1;
   c.fillStyle='#7fd1ff';rr(c,w/2-30,y+7,60,20,10);c.fill();c.fillStyle='#1a1030';c.font='900 12px Nunito';c.textAlign='center';c.textBaseline='middle';c.fillText('★ '+t('p_slow'),w/2,y+17.5)}},
 {k:'pow',draw(c,w,h){const cols=[['#ff7a9c','#e0305a'],['#6fd0ff','#2a86d8'],['#6ff0a8','#1fa864'],['#c7b3ff','#7a5ae0']];cols.forEach((cc,k)=>{const x=14+k*((w-28)/3),y=h/2+(k%2?6:-6)+Math.sin(tNow*.004+k)*3;const g=c.createLinearGradient(0,y-14,0,y+14);g.addColorStop(0,cc[0]);g.addColorStop(1,cc[1]);c.fillStyle=g;c.beginPath();c.arc(x,y,13,0,7);c.fill();c.fillStyle='#2fbf5b';c.beginPath();c.arc(x+10,y-10,6,0,7);c.fill();c.fillStyle='#fff';c.font='900 10px Nunito';c.textAlign='center';c.textBaseline='middle';c.fillText('+',x+10,y-10)})}},
 {k:'worlds',draw(c,w,h){[['#2e78c8','#a0d7f5'],['#06121f','#124650'],['#02010a','#3a1060']].forEach((g0,k)=>{const x=k*w/3,g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,g0[0]);g.addColorStop(1,g0[1]);c.fillStyle=g;c.fillRect(x,0,w/3+1,h)});
   c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=2;for(let k=0;k<3;k++){const yy=18+k*14,xx=((tNow*.05+k*20)%(w/3));c.beginPath();c.moveTo(xx,yy);c.lineTo(xx+14,yy);c.stroke()}
   c.strokeStyle='rgba(90,255,170,.8)';c.beginPath();for(let X=w/3;X<2*w/3;X+=3)c.lineTo(X,h/2+Math.sin(X*.15+tNow*.003)*8);c.stroke();
   const r=((tNow*WAVE_W/(Math.PI*2))%1);c.strokeStyle=`rgba(120,230,255,${1-r})`;c.beginPath();c.ellipse(w*5/6,h/2,4+r*14,2+r*9,0,0,7);c.stroke()}},
 {k:'rank',draw(c,w,h){c.fillStyle='#ffc23d';c.save();c.translate(w/2-24,h/2-26);c.scale(2,2);c.fill(new Path2D('M7 3h10v3h3v2a4 4 0 0 1-4 4 5 5 0 0 1-3 2.7V17h3v3H8v-3h3v-2.3A5 5 0 0 1 8 12a4 4 0 0 1-4-4V6h3zM4 8a2 2 0 0 0 3 1.7V8zm16 0h-3v1.7A2 2 0 0 0 20 8z'));c.restore()}},
];
let helpBack='menu',helpRAF=0;
function openHelp(from){helpBack=from;if(from==='pause')$('pause').hidden=true;else $('menu').hidden=true;$('help').hidden=false;
  $('hcards').innerHTML=HELP.map((h,k)=>`<div class="hcard" style="animation-delay:${k*60}ms"><canvas></canvas><div><b>${t('h_'+h.k+'T')}</b><span>${t('h_'+h.k+'P')}</span></div></div>`).join('');
  const cvs=[...$('hcards').querySelectorAll('canvas')];cancelAnimationFrame(helpRAF);
  const loop=()=>{if($('help').hidden)return;cvs.forEach((cv,k)=>{const r=cv.getBoundingClientRect();if(!r.width)return;const pw=Math.round(r.width*DPR),ph=Math.round(r.height*DPR);if(cv.width!==pw){cv.width=pw;cv.height=ph}const c=cv.getContext('2d');c.setTransform(DPR,0,0,DPR,0,0);c.clearRect(0,0,r.width,r.height);HELP[k].draw(c,r.width,r.height)});helpRAF=requestAnimationFrame(loop)};loop();
}
$('openHelp').onclick=()=>openHelp('menu');$('pauseHelp').onclick=()=>openHelp('pause');
$('closeHelp').onclick=()=>{$('help').hidden=true;cancelAnimationFrame(helpRAF);if(helpBack==='pause')$('pause').hidden=false;else showMenu()};
