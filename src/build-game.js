// Monta www/index.html a partir do template + partes (skins, mundos).
const fs=require('fs'),path=require('path');
const d=__dirname;
let html=fs.readFileSync(path.join(d,'game.template.html'),'utf8');
html=html.replace('//@@SKINS@@',()=>fs.readFileSync(path.join(d,'skins.part.js'),'utf8'))
         .replace('//@@WORLDS@@',()=>fs.readFileSync(path.join(d,'worlds.part.js'),'utf8'))
         .replace('//@@SKINS2@@',()=>fs.readFileSync(path.join(d,'skins2.part.js'),'utf8'))
         .replace('//@@SECURE@@',()=>fs.readFileSync(path.join(d,'secure.part.js'),'utf8'))
         .replace('//@@RANK@@',()=>fs.readFileSync(path.join(d,'rank.part.js'),'utf8'))
         .replace('//@@HELP@@',()=>fs.readFileSync(path.join(d,'help.part.js'),'utf8'))
         .replace('//@@I18N@@',()=>fs.readFileSync(path.join(d,'i18n_more.js'),'utf8'));
// Versão da loja: o código do jogo é compactado e embaralhado (ofuscado) pra dificultar mods e trapaças.
if(process.env.OBFUSCATE==='1'){
  const esbuild=require('esbuild'),JO=require('javascript-obfuscator');
  const a=html.indexOf('<script>\n(()=>{'),b=html.indexOf('</script>',a);
  if(a<0||b<0)throw new Error('script principal não encontrado');
  const src=html.slice(a+'<script>'.length,b);
  const min=esbuild.transformSync(src,{minify:true,target:'es2019',legalComments:'none'}).code;
  const obf=JO.obfuscate(min,{compact:true,target:'browser',identifierNamesGenerator:'hexadecimal',renameGlobals:false,
    stringArray:true,stringArrayEncoding:['base64'],stringArrayThreshold:.75,stringArrayRotate:true,stringArrayShuffle:true,splitStrings:false,
    controlFlowFlattening:false,deadCodeInjection:false,selfDefending:false,debugProtection:false,disableConsoleOutput:true,numbersToExpressions:false,transformObjectKeys:false,unicodeEscapeSequence:false}).getObfuscatedCode();
  html=html.slice(0,a)+'<script>'+obf+html.slice(b);
  console.log('ofuscado:',src.length,'->',obf.length,'bytes');
}
fs.writeFileSync(path.join(d,'..','www','index.html'),html);
console.log('www/index.html', html.length,'bytes');
