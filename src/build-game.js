// Monta www/index.html a partir do template + partes (skins, mundos).
const fs=require('fs'),path=require('path');
const d=__dirname;
let html=fs.readFileSync(path.join(d,'game.template.html'),'utf8');
html=html.replace('//@@SKINS@@',()=>fs.readFileSync(path.join(d,'skins.part.js'),'utf8'))
         .replace('//@@WORLDS@@',()=>fs.readFileSync(path.join(d,'worlds.part.js'),'utf8'));
fs.writeFileSync(path.join(d,'..','www','index.html'),html);
console.log('www/index.html', html.length,'bytes');
