/* ================= ANTI-TRAPAÇA ================= */
// Cada partida guarda um resumo dos toques. No fim, se o padrão for de robô, macro ou jogo alterado,
// a partida vale normalmente pra você (moedas, recorde), mas NÃO entra no ranking mundial.
function runVerdict(sc){
  const r=run||{},why=[];
  if(S.tamper)why.push('save');
  const taps=r.taps||[],errs=(r.errs||[]).filter(e=>!e.mag);
  if(taps.some(tp=>!tp.tr))why.push('synthetic');               // toque falso gerado por script
  if(sc>=30&&r.play<sc*120)why.push('fast');                    // andares demais pro tempo jogado
  if(stack.length-1!==sc)why.push('state');                      // placar não bate com a torre
  if(taps.length>=25){
    const cnt={};let mx=0;taps.forEach(tp=>{const k=tp.x+','+tp.y;cnt[k]=(cnt[k]||0)+1;if(cnt[k]>mx)mx=cnt[k]});
    if(mx/taps.length>.8)why.push('samepx');                      // sempre no mesmo pixel = autoclick
    const iv=[];for(let k=1;k<taps.length;k++)iv.push(taps[k].t-taps[k-1].t);
    const mean=iv.reduce((a,b)=>a+b,0)/iv.length,sd=Math.sqrt(iv.reduce((a,b)=>a+(b-mean)**2,0)/iv.length);
    if(mean>0&&sd/mean<.03)why.push('rhythm');                   // ritmo perfeito de máquina
  }
  if(errs.length>=120&&errs.filter(e=>e.e>=e.tol).length<=1)why.push('perfect'); // 120 perfeitos quase sem erro
  return why;
}
