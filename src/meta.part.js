/* ================= PROGRESSÃO (v1.6): metas da vida toda, álbum de figurinhas, loja do dia, skin brilhante ================= */
S.st=Object.assign({chests:0,boss:0},S.st);S.gl=S.gl||{};S.alb=S.alb||{};S.su=S.su||{};

/* ---- METAS DA VIDA TODA: cada meta tem degraus; cada degrau dá moedas e um título ---- */
const GOALS=[
  {k:'floors',ic:'🏗️',v:()=>S.st.floors,n:[100,1000,5000,10000,50000]},
  {k:'perf',ic:'✨',v:()=>S.st.perf,n:[50,500,2000,10000,30000]},
  {k:'runs',ic:'🎮',v:()=>S.st.runs,n:[10,100,500,2000,5000]},
  {k:'combo',ic:'🔥',v:()=>S.st.combo,n:[5,10,20,40,80]},
  {k:'boss',ic:'👹',v:()=>S.st.boss,n:[1,10,50,200,500]},
  {k:'chests',ic:'📦',v:()=>S.st.chests,n:[5,50,200,1000,3000]},
  {k:'skins',ic:'🎨',v:()=>S.owned.length,n:[5,20,50,100,130]},
  {k:'time',ic:'⏳',v:()=>Math.floor(S.st.time/60),n:[30,120,600,3000,9000]}
];
const GOAL_RW=[100,250,500,1000,2000];
const goalTier=g=>S.gl[g.k]||0; // degraus já pegos
const goalReady=g=>goalTier(g)<g.n.length&&g.v()>=g.n[goalTier(g)];
const goalsClaimable=()=>GOALS.some(goalReady);
function goalTitle(){let best=null,bt=-1;for(const g of GOALS){const tr=goalTier(g);if(tr>bt&&tr>0){bt=tr;best=t('gt_'+g.k+'_'+(tr-1))}}return best}
function renderGoals(){const el=$('seaGoals');
  el.innerHTML=`<p class="note">${t('goalsNote')}</p>`+GOALS.map(g=>{const tr=goalTier(g),max=tr>=g.n.length,n=g.n[Math.min(tr,g.n.length-1)],v=g.v(),rd=goalReady(g);
    const stars=g.n.map((_,k)=>`<i class="${k<tr?'on':''}"></i>`).join('');
    return `<div class="goal${rd?' rd':''}"><span class="gic">${g.ic}</span><div class="ginf"><b>${t('g_'+g.k,n)}</b><div class="bar g"><i style="width:${max?100:Math.min(100,v/n*100)}%"></i></div><small>${max?t('goalMax'):Math.min(v,n)+'/'+n}<span class="gst">${stars}</span></small></div>`+
      (max?`<span class="chip">✔</span>`:`<button class="btn sm ${rd?'okb':'alt'}" data-g="${g.k}" ${rd?'':'disabled'}><i class="coin"></i>&nbsp;${GOAL_RW[tr]}</button>`)+`</div>`}).join('');
  el.querySelectorAll('button[data-g]').forEach(b=>b.onclick=()=>{const g=GOALS.find(x=>x.k===b.dataset.g);if(!goalReady(g))return;const tr=goalTier(g);S.gl[g.k]=tr+1;S.coins+=GOAL_RW[tr];save();wallet();bump('pCoins');sfx.fanfare();buzz([20,40,20]);
    toast(t('goalOk',t('gt_'+g.k+'_'+tr)));renderGoals();navSync()})}

/* ---- ÁLBUM DE FIGURINHAS: caem nos baús (a cada 25 andares) e no chefão; repetida vira moedas; completou = skin exclusiva ---- */
const ALBUMS=[
  {k:'worlds',ic:'🌌',items:['🏙️','☁️','🌈','🌌','🪐','☄️','🐋','💎','🕳️','🛰️','🌠','♾️'],skin:'alb_cosmos'},
  {k:'pets',ic:'🐾',items:['🐱','🐶','🐼','🦊','🐸','🐧','🦄','🐙','🐢','🦉','🐝','🐬'],skin:'alb_pets'},
  {k:'sweets',ic:'🍭',items:['🍩','🍰','🧁','🍪','🍫','🍬','🍭','🍦','🍮','🥧','🍡','🎂'],skin:'alb_sweets'}
];
const albHave=a=>(S.alb[a.k]||[]).filter(Boolean).length;
function albumCur(){for(const a of ALBUMS){const h=albHave(a);if(h<a.items.length)return {k:a.k,ic:a.ic,have:h,n:a.items.length}}return null}
const albumNew=()=>!!S.albNew;
function albumSeen(){if(S.albNew){S.albNew=false;save()}}
// sorteia uma figurinha do álbum atual; devolve o que ganhou (pra mostrar na tela)
function dropSticker(){const a=ALBUMS.find(x=>albHave(x)<x.items.length);if(!a){S.coins+=40;return {dup:true,ic:'🪙'}}
  const arr=S.alb[a.k]=S.alb[a.k]||new Array(a.items.length).fill(0);const miss=a.items.map((_,j)=>j).filter(j=>!arr[j]);const k=miss.length&&Math.random()<.6?miss[Math.random()*miss.length|0]:Math.random()*a.items.length|0;const ic=a.items[k];
  if(arr[k]){S.coins+=40;return {dup:true,ic}}arr[k]=1;S.albNew=true;if(typeof run==='object'&&run)run.stkNew=1;
  let done=false;if(albHave(a)===a.items.length&&!S.owned.includes(a.skin)){S.owned.push(a.skin);done=a}save();return {ic,done}}
function renderAlbum(g){g.classList.add('album');$('skCats').hidden=$('skHead').hidden=true;$('shopNote').textContent=t('albumNote');
  g.innerHTML=ALBUMS.map((a,ai)=>{const arr=S.alb[a.k]||[],h=albHave(a),full=h===a.items.length;const sk=skinOf(a.skin);
    return `<div class="alb${full?' full':''}"><div class="ahd"><b>${a.ic} ${t('album_'+a.k)}</b><span>${h}/${a.items.length}</span></div><div class="bar g"><i style="width:${h/a.items.length*100}%"></i></div>
    <div class="stk">${a.items.map((ic,k)=>arr[k]?`<span class="st">${ic}</span>`:`<span class="st no">${k+1}</span>`).join('')}</div>
    <div class="arw"><canvas data-s="${a.skin}"></canvas><span>${full?t('albumGot',t('s_'+a.skin)):t('albumPrize',t('s_'+a.skin))}</span></div></div>`}).join('');
  g.querySelectorAll('canvas[data-s]').forEach(cv=>previews.push({cv,skin:skinOf(cv.dataset.s)}));albumSeen();navSync()}

/* ---- LOJA DO DIA: 3 skins de moedas com desconto (troca todo dia) + pacote de poderes ---- */
// (sorteio pelo dia de hoje no relógio do servidor: troca à meia-noite UTC mesmo com o jogo fechado; antes a conta estourava e saía sempre igual)
// as 3 skins sorteadas ficam guardadas até o dia virar: comprar uma NÃO troca a oferta (ela fica como "Adquirido")
function shopDay(){const dk=dayKey();let out=null;
  if(S.shopD&&S.shopD.k===dk){out=S.shopD.ids.map(id=>SKINS.find(s=>s.id===id)).filter(Boolean);if(out.length<3)out=null}
  if(!out){const r=mulberry(seedOf('shop_'+dk));
    const all=SKINS.filter(s=>s.cur==='coin'&&s.price>0&&!s.season),mine=all.filter(s=>!S.owned.includes(s.id));const pool=mine.length>=3?mine:all;out=[];while(out.length<3&&pool.length){out.push(pool.splice(r()*pool.length|0,1)[0])}
    S.shopD={k:dk,ids:out.map(s=>s.id)};save()}
  return out.map((s,k)=>({s,off:k===0?.4:.2,price:Math.round(s.price*(k===0?.6:.8)/10)*10}))}
const shopLeftH=()=>{const n=nowSrv(),next=(Math.floor(n/864e5)+1)*864e5;return Math.max(1,Math.ceil((next-n)/36e5))};
const offersNew=()=>S.offSeen!==dayKey();
function offersSeen(){if(S.offSeen!==dayKey()){S.offSeen=dayKey();save()}}
const PWPACK={price:2000,inv:{magnet:1,slow:1,wide:1,calm:1}};
function renderOffers(g){$('skCats').hidden=$('skHead').hidden=true;$('shopNote').textContent=t('offersNote',shopLeftH());
  const hd=document.createElement('div');hd.className='osec';hd.innerHTML=`<b>${t('dayShopT')}</b><span>⏱ ${t('hoursLeft',shopLeftH())}</span>`;g.appendChild(hd);
  shopDay().forEach((o,k)=>{const s=o.s,own=S.owned.includes(s.id);const d=document.createElement('div');d.className='item'+(k===0?' deal':'');d.style.animationDelay=(k*50)+'ms';
    d.innerHTML=`<span class="best">-${Math.round(o.off*100)}%</span><canvas></canvas><div class="nm">${t('s_'+s.id)}</div>`;
    const b=document.createElement('button');
    if(own){b.className='btn alt';b.disabled=true;b.textContent=t('owned')}
    else{b.className='btn';b.innerHTML=`<s>${s.price}</s> <i class="coin"></i>${o.price}`;b.onclick=()=>{if(S.owned.includes(s.id))return;if(S.coins<o.price){toast(t('needCoins',o.price-S.coins));return}S.coins-=o.price;S.owned.push(s.id);S.skin=s.id;save();wallet();sfx.fanfare();toast(t('unlocked',t('s_'+s.id)));renderShop()}}
    d.appendChild(b);g.appendChild(d);previews.push({cv:d.querySelector('canvas'),skin:s})});
  const got=S.pwpk===dayKey();const p=document.createElement('div');p.className='item pwpack';
  p.innerHTML=`<div class="pwic">${Object.keys(PWPACK.inv).map(k=>`<span class="ico a-${k}">${abIcon(k)}</span>`).join('')}</div><div class="inf"><div class="nm">${t('pwPackT')}</div><div class="ds">${t('pwPackD')}</div></div>`;
  const b=document.createElement('button');b.className='btn'+(got?' alt':'');b.disabled=got;b.innerHTML=got?t('boughtToday'):`<s>2750</s> <i class="coin"></i>${PWPACK.price}`;
  b.onclick=()=>{if(S.pwpk===dayKey())return;if(S.coins<PWPACK.price){toast(t('needCoins',PWPACK.price-S.coins));return}S.coins-=PWPACK.price;for(const k in PWPACK.inv)S.inv[k]=(S.inv[k]||0)+PWPACK.inv[k];S.pwpk=dayKey();save();wallet();sfx.fanfare();toast(t('pwPackOk'));renderShop()};
  p.appendChild(b);g.appendChild(p)}

/* ---- SKIN BRILHANTE: 100 andares com a mesma skin e ela ganha um brilho que passa pelos blocos ---- */
const SHINY_AT=100;
const isShiny=id=>(S.su[id]||0)>=SHINY_AT;
// soma os andares da partida na skin usada; devolve a skin se ela acabou de evoluir
function skinUse(sc){const id=S.skin;const was=isShiny(id);S.su[id]=(S.su[id]||0)+sc;return !was&&isShiny(id)?id:null}
let GLINT=null;function glintSprite(){if(GLINT&&GLINT.d===DPR)return GLINT;const d=DPR||1,w=30,cv=document.createElement('canvas');cv.width=Math.ceil(w*d);cv.height=Math.ceil(BH*d);const c=cv.getContext('2d');c.scale(d,d);
  const g=c.createLinearGradient(0,0,w,0);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.5,'rgba(255,255,255,.55)');g.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=g;c.beginPath();c.moveTo(10,0);c.lineTo(w,0);c.lineTo(w-10,BH);c.lineTo(0,BH);c.fill();
  const v=c.createLinearGradient(0,0,0,BH);v.addColorStop(0,'rgba(0,0,0,1)');v.addColorStop(.12,'rgba(0,0,0,0)');v.addColorStop(.88,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,1)');c.globalCompositeOperation='destination-out';c.fillStyle=v;c.fillRect(0,0,w,BH);
  return GLINT={cv,d:DPR,w}}
// brilho passando (chamado pra cada bloco visível quando a skin é brilhante)
function shinyFx(x,y,w,i){if(w<40)return;const ph=((tNow*.00032+i*.09)%4);if(ph>=1)return;const G=glintSprite(),gx=x+2+ph*(w-G.w-4);ctx.drawImage(G.cv,gx,y,G.w,BH);
  const tw=Math.sin(tNow*.006+i*2.3);if(tw>.8){const sx=x+8+hash(i*7.3)*(w-16),sy=y+6+hash(i*3.1)*(BH-12),r=(tw-.8)*12;ctx.fillStyle='#fff';ctx.beginPath();ctx.moveTo(sx,sy-r);ctx.lineTo(sx+r*.28,sy);ctx.lineTo(sx,sy+r);ctx.lineTo(sx-r*.28,sy);ctx.fill();ctx.beginPath();ctx.moveTo(sx-r,sy);ctx.lineTo(sx,sy+r*.28);ctx.lineTo(sx+r,sy);ctx.lineTo(sx,sy-r*.28);ctx.fill()}}

/* ---- 3 skins exclusivas do álbum ---- */
const PAWS=[[-.42,-.28],[-.15,-.5],[.15,-.5],[.42,-.28]];
mk('alb_cosmos','special','album',0,(c,x,y,w,i)=>{const g=c.createLinearGradient(0,y,0,y+BH);g.addColorStop(0,'#1a1147');g.addColorStop(1,'#07081f');c.fillStyle=g;c.fillRect(x,y,w,BH);
   for(let X=Math.floor(x/8)*8;X<x+w;X+=8){const a=hash(X*.53+i*3);if(a>.55){c.fillStyle=a>.9?'#fff':'rgba(200,210,255,.6)';c.fillRect(X+hash(X+i)*6,y+3+hash(X*1.9+i)*(BH-6),a>.9?1.6:1,a>.9?1.6:1)}}
   for(const [X,a] of at(x,w,i,96)){const cx=X,cy=y+BH/2,r=7+a*3,hue=a>.5?[255,154,92]:[94,224,255];const pg=c.createRadialGradient(cx-r*.4,cy-r*.4,1,cx,cy,r);pg.addColorStop(0,`rgb(${hue.map(v=>Math.min(255,v+60))})`);pg.addColorStop(1,`rgb(${hue.map(v=>v*.45|0)})`);c.fillStyle=pg;c.beginPath();c.arc(cx,cy,r,0,TAU);c.fill();
     c.strokeStyle='rgba(255,230,200,.8)';c.lineWidth=1.6;c.beginPath();c.ellipse(cx,cy,r*1.8,r*.45,-.35,0,TAU);c.stroke()}
   c.strokeStyle='rgba(185,163,255,.7)';c.lineWidth=1.5;c.strokeRect(x+1,y+1,w-2,BH-2);bevel(c,x,y,w,.12,.3)},
 (c,x,y,w,i)=>{const P=W+220,px=((tNow*.16+i*131)%P)-110;if(px>x-60&&px<x+w+40){const py=y+6+hash(i*1.7)*(BH-12);const g=c.createLinearGradient(px-46,py-10,px,py);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(255,255,255,.95)');c.strokeStyle=g;c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(px-46,py-10);c.lineTo(px,py);c.stroke();circ(c,px,py,1.8,'#fff')}
   for(let X=Math.floor(x/23)*23;X<x+w;X+=23){const a=hash(X*.29+i*5);if(a<.6)continue;const tw=.5+.5*Math.sin(tNow*.004+X);c.fillStyle=al(tw*.9);const sx=X+a*10,sy=y+5+hash(X+i*2)*(BH-10),r=1+tw*1.6;c.beginPath();c.moveTo(sx,sy-r*2);c.lineTo(sx+r*.5,sy);c.lineTo(sx,sy+r*2);c.lineTo(sx-r*.5,sy);c.fill()}});
mk('alb_pets','special','album',0,(c,x,y,w,i)=>{const P=['#ffd6e7','#ffe7c2','#fff7b8','#d4f5d0','#cfe9ff','#e6dcff'];c.fillStyle=P[((i%6)+6)%6];c.fillRect(x,y,w,BH);
   for(const [X,a] of at(x,w,i,40,0,23)){const cx=X,cy=y+BH*.55+(a-.5)*6,s=5.5,col='rgba(120,80,120,.28)';c.fillStyle=col;c.beginPath();c.ellipse(cx,cy+2,s*.9,s*.75,0,0,TAU);c.fill();for(const [dx,dy] of PAWS)circ(c,cx+dx*s*2,cy+dy*s*2+1,s*.34,col)}
   bevel(c,x,y,w,.45,.12)},
 (c,x,y,w,i)=>{for(const [X,a] of at(x,w,i,58,0,41)){const per=2600+a*1400,ph=((tNow+a*9000)%per)/per;if(ph>.75)continue;const k=ph/.75,hx=X+Math.sin(k*9+a*6)*4,hy=y+BH-4-k*(BH-2),s=4+a*2;c.globalAlpha=Math.sin(k*Math.PI);heart(c,hx,hy,s,a>.5?'#ff5d8f':'#ff9ac1');c.globalAlpha=1}});
mk('alb_sweets','special','album',0,(c,x,y,w,i)=>{c.fillStyle=vgrad(c,y,['#8a4b2c','#6b3620','#4e2515']);c.fillRect(x,y,w,BH);
   c.fillStyle='#ffc2dc';c.beginPath();c.moveTo(x-2,y);c.lineTo(x+w+2,y);const x0=Math.floor(x/14)*14;c.lineTo(x+w+2,y+6);for(let X=Math.ceil((x+w)/14)*14;X>=x0;X-=14){const d=8+hash(X*.7+i)*9;c.lineTo(X,y+6);c.quadraticCurveTo(X-3,y+d+4,X-7,y+d);c.quadraticCurveTo(X-11,y+d+4,X-14,y+6)}c.closePath();c.fill();
   c.fillStyle='rgba(255,255,255,.45)';c.fillRect(x,y+1,w,2);
   const SP=['#ff5d8f','#ffd23f','#5ee0ff','#4fe39a','#fff','#b98cff'];for(let X=Math.floor(x/7)*7;X<x+w;X+=7){const a=hash(X*.37+i*9);const sx=X+a*5,sy=y+BH*.55+hash(X*1.3+i)*(BH*.38);c.save();c.translate(sx,sy);c.rotate(a*6);c.fillStyle=SP[(a*6|0)%6];c.fillRect(-2,-.7,4,1.4);c.restore()}
   bevel(c,x,y,w,.2,.25)},
 (c,x,y,w,i)=>{for(const [X,a] of at(x,w,i,110,0,59)){const b=Math.abs(Math.sin(tNow*.005+a*7))*4;circ(c,X,y+5-b,4.2,'#e8243f');circ(c,X-1.3,y+3.6-b,1.3,'rgba(255,255,255,.7)');c.strokeStyle='#3f7a2a';c.lineWidth=1.2;c.beginPath();c.moveTo(X,y+1-b);c.quadraticCurveTo(X+3,y-4-b,X+6,y-5-b);c.stroke()}
   for(let X=Math.floor(x/19)*19;X<x+w;X+=19){const a=hash(X*.81+i);if(a<.55)continue;const tw=.5+.5*Math.sin(tNow*.005+X*1.3);if(tw<.6)continue;c.fillStyle=al((tw-.6)*2.2);c.fillRect(X+a*8,y+BH*.6+a*8,1.6,1.6)}});
