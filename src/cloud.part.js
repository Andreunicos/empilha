/* ================= SAVE NA NUVEM (Google Play Games) ================= */
// O save vai selado pra nuvem. Ao carregar, o selo é conferido (save editado é recusado).
const CL=()=>window.Native&&window.Native.isNative&&window.Native.cloud?window.Native.cloud:null;
let clPlayer=null,clLast=0,clBusy=false;
function clPayload(){save();let d,h;try{d=localStorage.getItem('empilha_save');h=localStorage.getItem('empilha_sig')}catch(e){}return JSON.stringify({v:1,d,h})}
function clParse(txt){try{const o=JSON.parse(txt||'');if(!o||!o.d||!o.h||SEAL(o.d)!==o.h)return null;const s=JSON.parse(o.d);return {o,s}}catch(e){return null}}
function clDesc(s){return t('clDesc',s.lvl||1,s.best||0)}
function clRender(){const box=$('cloudBox');if(!box)return;const c=CL();box.hidden=!c;if(!c)return;
  $('clSt').innerHTML=clPlayer?`<span class="dotok"></span>${t('clOn',esc(clPlayer))}`:`<span class="dotoff"></span>${t('clOff')}`;
  $('clSign').hidden=!!clPlayer;$('clSave').disabled=clBusy;$('clLoad').disabled=clBusy}
async function clSignIn(interactive){const c=CL();if(!c)return false;
  try{const r=await c.signIn(interactive);clPlayer=r&&r.signedIn?(r.name||'Play Games'):null}catch(e){clPlayer=null}
  clRender();return !!clPlayer}
async function clSaveNow(manual){const c=CL();if(!c||clBusy)return;
  if(!clPlayer&&!(await clSignIn(manual))){if(manual)toast(t('clNeedSign'));return}
  clBusy=true;clRender();
  try{await c.save(clPayload(),clDesc(S));clLast=Date.now();if(manual){sfx.coin();toast(t('clSaved'))}}
  catch(e){if(manual)toast(t('clFail'))}
  clBusy=false;clRender()}
// salva sozinho no fim das partidas e ao sair do app (no máximo 1x por minuto)
function cloudAuto(){if(clPlayer&&Date.now()-clLast>60000)clSaveNow(false)}
async function clLoadNow(manual){const c=CL();if(!c||clBusy)return;
  if(!clPlayer&&!(await clSignIn(manual))){if(manual)toast(t('clNeedSign'));return}
  clBusy=true;clRender();let r=null;
  try{r=await c.load()}catch(e){}
  clBusy=false;clRender();
  if(!r||!r.data){if(manual)toast(t('clEmpty'));return}
  const p=clParse(r.data);if(!p){if(manual)toast(t('clBad'));return}
  clAsk(p);
}
function clAsk(p){const s=p.s;$('clAskP').innerHTML=t('clAskP',s.lvl||1,s.best||0,s.coins||0,s.gems||0);$('clAsk').hidden=false;
  $('clYes').onclick=async()=>{$('clAsk').hidden=true;try{localStorage.setItem('empilha_save',p.o.d);localStorage.setItem('empilha_sig',p.o.h);localStorage.setItem('empilha_bak',p.o.d);localStorage.setItem('empilha_bak_sig',p.o.h)}catch(e){return}
    // atualiza também o espelho do backup do Android, senão ele "restauraria" o save antigo por cima
    const NN=window.Native;try{if(NN&&NN.prefSet){await NN.prefSet('bs_save',p.o.d);await NN.prefSet('bs_sig',p.o.h)}}catch(e){}
    location.reload()};
  $('clNo').onclick=()=>{$('clAsk').hidden=true}}
$('clSave').onclick=()=>clSaveNow(true);$('clLoad').onclick=()=>clLoadNow(true);$('clSign').onclick=()=>clSignIn(true).then(ok=>{if(ok)toast(t('clHi',clPlayer))});
// ao abrir: entra em silêncio e, se este celular estiver "novo" e a nuvem tiver progresso, oferece recuperar
(async()=>{if(!CL())return;clRender();if(!(await clSignIn(false)))return;
  try{const r=await CL().load();const p=r&&r.data?clParse(r.data):null;if(!p)return;
    const fresh=!BOOT_LOCAL||(S.best<(p.s.best||0)&&S.lvl<=(p.s.lvl||1)&&S.xp+S.lvl*100<(p.s.xp||0)+(p.s.lvl||1)*100);
    if(fresh&&(p.s.best||0)>0)clAsk(p)}catch(e){}})();
