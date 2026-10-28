import {stages,fields,emptyIdea,parseBackup,backup,markdown,anki,calendar,downloadFile,storageAdapter} from './learning-core.js';
import './lab-workspace.css';
const $=id=>document.getElementById(id);
let ideas=[],active=null,remember=false;
const store=storageAdapter('lectorlab-platform-v1',()=>status('El navegador no permite guardar. Tus cambios siguen en esta sesión: exporta una copia JSON antes de cerrar.'));
function status(s){$('status').textContent=s;}
function persist(){if(remember&&store.write(backup(ideas)))status('Guardado en este navegador. Exporta JSON para conservar una copia independiente.');}
function current(){return ideas.find(x=>x.id===active);}
function render(){
  $('board').replaceChildren();
  stages.forEach((title,stage)=>{const col=document.createElement('section');const h=document.createElement('h3');h.textContent=title;col.append(h);const items=ideas.filter(x=>x.stage===stage);const count=document.createElement('p');count.className='small';count.textContent=`${items.length} ideas`;col.append(count);for(const item of items){const btn=document.createElement('button');btn.className='idea-card';btn.textContent=item.title||'Idea sin título';btn.setAttribute('aria-pressed',String(item.id===active));btn.addEventListener('click',()=>{active=item.id;render();$('editor-title').focus();});col.append(btn);} $('board').append(col);});
  const x=current();$('editor').hidden=!x;$('empty').hidden=ideas.length>0;
  if(x){for(const k of fields)$(k).value=x[k];$('stage').value=String(x.stage);$('understand').open=x.stage<2;$('experiment').open=x.stage===2;$('reflection').open=x.stage===3;$('editor-title').textContent=x.title||'Tu nueva idea';}
  $('summary').textContent=`${ideas.length} ideas · ${ideas.filter(x=>x.stage===2).length} en prueba · ${ideas.filter(x=>x.stage===3).length} revisadas. Revisar no significa dominar.`;
  $('review-list').replaceChildren();const today=new Date();const local=[today.getFullYear(),String(today.getMonth()+1).padStart(2,'0'),String(today.getDate()).padStart(2,'0')].join('-');
  for(const item of ideas.filter(x=>x.date&&x.date<=local)){const li=document.createElement('li');const b=document.createElement('button');b.textContent=`${item.date} · ${item.title||'Sin título'}`;b.addEventListener('click',()=>{active=item.id;render();$('review').focus();});li.append(b);$('review-list').append(li);}
  $('review-empty').hidden=$('review-list').children.length>0;
}
function add(seed){if(ideas.length>=100){status('Has llegado a 100 ideas. Exporta una copia y archiva las que no necesites antes de añadir más.');return;}const x={...emptyIdea(),...seed};ideas.push(x);active=x.id;render();persist();$('title').focus();}
$('new').addEventListener('click',()=>add());
$('example').addEventListener('click',()=>add({title:'Escuchar antes de proponer',source:'Ejemplo original LectorLab, no cita de un libro',question:'¿Qué necesito preguntar antes de dar mi solución?',recall:'Una respuesta rápida puede pasar por alto el problema de la otra persona.',contrast:'No puedo saber qué necesita sin preguntarlo. Preguntar no garantiza un acuerdo.',action:'Preguntar qué parte preocupa más antes de proponer un cambio de fecha.',cue:'En la reunión de mañana, al hablar del calendario.',review:'Ejemplo: apareció una dependencia que no conocía. Próximo paso: confirmar la fecha con la otra persona.',stage:1}));
for(const k of fields)$(k).addEventListener('input',e=>{const x=current();if(!x)return;x[k]=e.target.value;persist();if(k==='title')$('editor-title').textContent=x.title||'Tu nueva idea';});
$('stage').addEventListener('change',e=>{const x=current();const next=Number(e.target.value);if(next===2&&(!x.action.trim()||!x.cue.trim())){$('experiment').open=true;status('Para pasar a En prueba, define una acción y una ocasión.');e.target.value=String(x.stage);return;}if(next===3&&!x.review.trim()){$('reflection').open=true;status('Anota qué ocurrió antes de marcarla como Revisada.');e.target.value=String(x.stage);return;}x.stage=next;render();persist();});
$('save-view').addEventListener('click',()=>{render();if(remember)persist();else status('Vista actualizada. Recuerda exportar antes de cerrar.');});
$('remember').addEventListener('change',e=>{remember=e.target.checked;if(remember)persist();else if(store.clear())status('Copia local eliminada. Las notas actuales siguen abiertas hasta cerrar esta página.');});
$('json').addEventListener('click',()=>downloadFile('LectorLab-copia.json',backup(ideas),'application/json'));
$('md').addEventListener('click',()=>downloadFile('LectorLab-notas.md',markdown(ideas)));
$('anki').addEventListener('click',()=>{if(!ideas.some(x=>x.question.trim()&&x.contrast.trim())){status('Completa al menos una pregunta y su respuesta contrastada antes de exportar.');return;}downloadFile('LectorLab-Anki.txt',anki(ideas));status('Exportadas las preguntas con respuesta contrastada. En Anki: Archivo > Importar, separador tabulación, campo 1 anverso, campo 2 reverso.');});
$('ics').addEventListener('click',()=>{try{downloadFile('LectorLab-revision.ics',calendar(current()),'text/calendar');status('Abre el archivo en tu calendario y confirma el evento. Los avisos dependen de tu calendario.');}catch(e){status(e.message);}});
$('print').addEventListener('click',()=>{const article=$('print-notes');article.textContent=markdown(ideas);window.print();});
$('import').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>1000000)throw Error('El archivo supera 1 MB.');const data=parseBackup(await file.text());if(ideas.length&&!confirm('Esta copia reemplazará las ideas abiertas. ¿Has exportado lo que quieres conservar?'))return;ideas=data.ideas;active=ideas[0]?.id||null;render();persist();status(`Importadas ${ideas.length} ideas. Revisa y guarda una copia al terminar.`);}catch(err){status('No se ha importado: '+err.message);}finally{e.target.value='';}});
$('delete').addEventListener('click',()=>{if(!current()||!confirm('¿Borrar esta idea? Esta acción no se puede deshacer.'))return;ideas=ideas.filter(x=>x.id!==active);active=ideas[0]?.id||null;render();persist();});
$('clear').addEventListener('click',()=>{if(!confirm('¿Borrar todas las ideas y la copia de este navegador? Exporta JSON antes si quieres conservarlas.'))return;if(!store.clear()){status('No se pudo borrar la copia local. Usa los ajustes del navegador para eliminarla.');return;}ideas=[];active=null;remember=false;$('remember').checked=false;render();status('Ideas y copia local eliminadas.');});
$('book-filter').addEventListener('change',e=>{for(const card of document.querySelectorAll('[data-skill]'))card.hidden=e.target.value!=='all'&&card.dataset.skill!==e.target.value;});
for(const b of document.querySelectorAll('[data-prompt]'))b.addEventListener('click',()=>{add({title:b.dataset.title,source:b.dataset.source,question:b.dataset.prompt});$('editor-title').scrollIntoView({behavior:'smooth',block:'start'});});
try{const raw=store.read();if(raw){ideas=parseBackup(raw).ideas;active=ideas[0]?.id||null;remember=true;$('remember').checked=true;status('Copia recuperada. Tus notas no se envían a LectorLab.');}}catch{status('La copia guardada no se puede abrir. No la hemos sobrescrito. Importa una copia JSON válida o exporta tus datos desde la versión anterior.');}
render();
