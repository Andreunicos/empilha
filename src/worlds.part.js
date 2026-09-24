/* ================= WORLDS ================= */
const WORLDS=[
 {at:0,name:'CIDADE',top:[43,27,79],bot:[224,115,106]},
 {at:25,name:'NUVENS',top:[46,120,200],bot:[160,215,245]},
 {at:50,name:'AURORA',top:[6,18,31],bot:[18,70,80]},
 {at:100,name:'ESPAÇO',top:[2,1,10],bot:[20,10,42]},
];
const EVENT={1:'Cuidado com o vento',2:'Blocos em velocidade maluca',3:'Velocidade máxima maior'};
const worldOf=f=>f>=100?3:f>=50?2:f>=25?1:0;
let skyF=0,city=[],clouds=[],stars=[];
function buildCity(){city=[];let x=-10;while(x<W+10){const w=26+Math.random()*40,h=40+Math.random()*120;city.push({x,w,h,win:Array.from({length:12},()=>Math.random()<.35)});x+=w+4}}
for(let k=0;k<26;k++)clouds.push({f:14+k*2.2+Math.random()*2,x:Math.random(),s:.6+Math.random()*.8,v:(Math.random()-.5)*.0004});
for(let k=0;k<90;k++)stars.push({x:Math.random(),y:Math.random(),s:Math.random()*1.8+.4,p:Math.random()*6});
function skyColor(key){let col=WORLDS[0][key].slice();for(let k=1;k<WORLDS.length;k++){const t=clamp((skyF-(WORLDS[k].at-8))/8,0,1);col=col.map((v,j)=>v+(WORLDS[k][key][j]-v)*t)}return `rgb(${col.map(v=>v|0).join(',')})`}
function drawWorld(){
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,skyColor('top'));g.addColorStop(1,skyColor('bot'));ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  const nightA=clamp((skyF-40)/15,0,1)*.9+.25*(1-clamp(skyF/20,0,1));
  for(const s of stars){const a=nightA*(.4+.6*Math.abs(Math.sin(tNow*.001+s.p)));if(a<.02)continue;ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.fillRect(s.x*W,((s.y*H+cam*.08)%H),s.s,s.s)}
  // aurora
  const au=clamp((skyF-44)/8,0,1)*(1-clamp((skyF-96)/8,0,1));
  if(au>0){for(let b=0;b<3;b++){ctx.beginPath();const base=H*(.18+b*.12);ctx.moveTo(0,base);for(let X=0;X<=W;X+=10)ctx.lineTo(X,base+Math.sin(X*.012+tNow*.0006*(b+1)+b)*26);ctx.lineTo(W,base+70);ctx.lineTo(0,base+70);const ag=ctx.createLinearGradient(0,base-30,0,base+70);ag.addColorStop(0,`rgba(90,255,170,0)`);ag.addColorStop(.4,`rgba(${b?120:80},255,${b?220:160},${.22*au})`);ag.addColorStop(1,'rgba(90,255,170,0)');ctx.fillStyle=ag;ctx.fill()}}
  // planets
  [[108,.78,46,'#ff9a6b','#8a2f4a'],[150,.2,30,'#7fd1ff','#2a4b9c'],[200,.65,60,'#c9a3ff','#4b2a8a']].forEach(([f,px,r,a,b])=>{const y=yOf(f)*.5+H*.2;if(y<-r||y>H+r)return;const pg=ctx.createRadialGradient(px*W-r*.4,y-r*.4,r*.1,px*W,y,r);pg.addColorStop(0,a);pg.addColorStop(1,b);ctx.fillStyle=pg;ctx.beginPath();ctx.arc(px*W,y,r,0,7);ctx.fill()});
  // city
  const gy=yOf(0)+BH;
  if(gy-180<H){ctx.fillStyle='rgba(255,210,150,.25)';ctx.beginPath();ctx.arc(W*.72,gy-150,46,0,7);ctx.fill();
    for(const b of city){ctx.fillStyle='rgba(30,16,56,.75)';ctx.fillRect(b.x,gy-b.h,b.w,b.h);ctx.fillStyle='rgba(255,215,120,.55)';b.win.forEach((on,k)=>{if(!on)return;const cx=b.x+5+(k%3)*((b.w-10)/3),cy=gy-b.h+8+Math.floor(k/3)*16;if(cy<gy-6)ctx.fillRect(cx,cy,5,7)})}
    ctx.fillStyle='#1a1030';ctx.fillRect(0,gy,W,H)}
  // clouds
  for(const cl of clouds){cl.x=(cl.x+cl.v+(worldOf(score)===1&&state==='play'?windDir*.0012:0)+1)%1;const y=yOf(cl.f);if(y<-40||y>H+40)continue;const x=cl.x*(W+160)-80,s=cl.s;ctx.fillStyle='rgba(255,255,255,.75)';ctx.beginPath();ctx.arc(x,y,18*s,0,7);ctx.arc(x+20*s,y-8*s,22*s,0,7);ctx.arc(x+44*s,y,17*s,0,7);ctx.rect(x,y,44*s,17*s);ctx.fill()}
}

