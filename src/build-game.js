// Monta www/index.html a partir do template + partes (skins, mundos).
const fs=require('fs'),path=require('path');
const d=__dirname;
let html=fs.readFileSync(path.join(d,'game.template.html'),'utf8');
html=html.replace('//@@SKINS@@',()=>fs.readFileSync(path.join(d,'skins.part.js'),'utf8'))
         .replace('//@@WORLDS@@',()=>fs.readFileSync(path.join(d,'worlds.part.js'),'utf8'))
         .replace('//@@SKINS2@@',()=>fs.readFileSync(path.join(d,'skins2.part.js'),'utf8'))
         .replace('//@@RANK@@',()=>fs.readFileSync(path.join(d,'rank.part.js'),'utf8'))
         .replace('//@@I18N@@',()=>fs.readFileSync(path.join(d,'i18n_more.js'),'utf8'));
fs.writeFileSync(path.join(d,'..','www','index.html'),html);
console.log('www/index.html', html.length,'bytes');
