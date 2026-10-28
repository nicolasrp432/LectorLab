import {samples} from './data/lab-scenes.js';
import {emptyIdea,backup,markdown,calendar,downloadFile,storageAdapter,parseBackup} from './learning-core.js';
import './quick-lab.css';
const root=document.querySelector('#quick-lab');

let route='comunicar',step=0,idea=emptyIdea();
const $=id=>root.querySelector('#'+id);
const storage=storageAdapter('lectorlab-quick-v1',()=>{$('quick-status').textContent='No se puede guardar aquí. Descarga una copia antes de salir.';});
let remember=false;
try{const raw=storage.read();if(raw){const data=JSON.parse(raw);if(samples[data.route]&&Number.isInteger(data.step)&&data.step>=0&&data.step<=3){idea=parseBackup(JSON.stringify(data.backup)).ideas[0]||emptyIdea();route=data.route;step=data.step;remember=true;}}}catch{$('quick-status').textContent='No se pudo recuperar la sesión. Puedes empezar de nuevo.';}
function save(){if(remember&&storage.write(JSON.stringify({route,step,backup:JSON.parse(backup([idea]))})))$('quick-status').textContent='Guardado en este navegador. Descarga una copia para cambiar de dispositivo.';}
function render(){
  const s=samples[route];$('quick-route').value=route;$('quick-remember').checked=remember;
  for(const panel of root.querySelectorAll('[data-step]'))panel.hidden=Number(panel.dataset.step)!==step;
  $('quick-progress').textContent=`${step+1} / 4 · ${['Lee una escena','Recuerda y contrasta','Elige tu prueba','Llévatela contigo'][step]}`;
  $('quick-title').textContent=s.title;$('quick-text').textContent=s.text;$('quick-question').textContent=s.question;$('quick-answer').textContent=s.contrast;
  for(const k of ['recall','contrast','action','cue','date'])$('quick-'+k).value=idea[k];
  $('quick-action').placeholder=s.action;
  $('quick-summary').textContent=idea.action?`${idea.action}\nCuándo y dónde: ${idea.cue || 'Por decidir'}`:'Tu prueba aparecerá aquí.';
  $('quick-prev').disabled=step===0;$('quick-next').hidden=step===3;
  $('quick-feedback').open=Boolean(idea.contrast);save();
}
$('quick-route').addEventListener('change',e=>{if((idea.recall||idea.action)&&!confirm('Cambiar de escena inicia una prueba nueva. Descarga tu copia si quieres conservar esta.')){e.target.value=route;return;}route=e.target.value;idea=emptyIdea();step=0;render();});
$('quick-next').addEventListener('click',()=>{
  if(step===1&&(!idea.recall.trim()||!idea.contrast.trim())){$('quick-status').textContent='Escribe un recuerdo y un contraste. «No recuerdo» también sirve como punto de partida.';return;}
  if(step===2&&(!idea.action.trim()||!idea.cue.trim())){$('quick-status').textContent='Elige una prueba pequeña y una ocasión concreta para intentarla.';return;}
  idea.title=samples[route].title;idea.source='Escena original de LectorLab: '+idea.title;idea.question=samples[route].question;step++;render();$('quick-progress').focus();
});
$('quick-prev').addEventListener('click',()=>{step=Math.max(0,step-1);render();$('quick-progress').focus();});
for(const k of ['recall','contrast','action','cue','date'])$('quick-'+k).addEventListener('input',e=>{idea[k]=e.target.value;save();});
$('quick-remember').addEventListener('change',e=>{remember=e.target.checked;if(!remember){if(storage.clear())$('quick-status').textContent='Solo durante esta sesión. Exporta antes de cerrar.';}else save();});
$('quick-md').addEventListener('click',()=>downloadFile('Mi-primera-prueba.md',markdown([idea])));
$('quick-json').addEventListener('click',()=>downloadFile('Mi-primera-prueba.json',backup([idea]),'application/json'));
$('quick-calendar').addEventListener('click',()=>{try{downloadFile('Revisar-mi-prueba.ics',calendar(idea),'text/calendar');$('quick-status').textContent='Archivo descargado. Ábrelo en tu calendario y confirma el evento; no se ha enviado ningún aviso.';}catch(e){$('quick-status').textContent=e.message;}});
$('quick-print').addEventListener('click',()=>window.print());
render();
