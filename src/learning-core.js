/** Portable data and export primitives. No network or framework dependencies. */
export const stages = ['Elegida', 'Explicada', 'En prueba', 'Revisada'];
export const fields = ['title','source','question','recall','contrast','action','cue','review','date'];
export function emptyIdea() { return {id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, stage:0, ...Object.fromEntries(fields.map(k=>[k,'']))}; }
export function parseBackup(text) {
  if (text.length>1000000) throw Error('La copia supera 1 MB.');
  const data=JSON.parse(text);
  if(data.format!=='lectorlab-kit' || data.version!==1 || !Array.isArray(data.ideas) || data.ideas.length>100) throw Error('Esta copia no tiene el formato LectorLab v1.');
  const ids=new Set();
  const ideas=data.ideas.map(x=>{
    if(!x || typeof x.id!=='string' || x.id.length>100 || ids.has(x.id) || !Number.isInteger(x.stage) || x.stage<0 || x.stage>3) throw Error('Una idea tiene datos no válidos.');
    ids.add(x.id);
    const item={id:x.id,stage:x.stage};
    for(const k of fields){if(typeof x[k]!=='string'||x[k].length>6000) throw Error('Hay campos ausentes o demasiado largos.');item[k]=x[k];}
    if(item.date && !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) throw Error('Fecha de revisión no válida.');
    return item;
  });
  return {format:'lectorlab-kit',version:1,ideas};
}
export function backup(ideas) { return JSON.stringify({format:'lectorlab-kit',version:1,ideas},null,2); }
export function markdown(ideas) {
  const labels=['Idea','Libro y página / fuente','Pregunta','Recuerdo sin mirar','Contraste con el texto','Prueba pequeña','Cuándo y dónde','Resultado y próximo ajuste','Fecha de revisión'];
  return '# Mi laboratorio de lectura\n\n'+ideas.map(x=>`## ${x.title || 'Idea sin título'}\n\nEstado: ${stages[x.stage]}\n\n`+fields.map((k,i)=>`### ${labels[i]}\n\n${x[k] || '(pendiente)'}`).join('\n\n')).join('\n\n---\n\n');
}
export function anki(ideas) {
  const clean=s=>s.replace(/[\t\r\n]+/g,' ').trim();
  return '#separator:Tab\n#html:false\n'+ideas.filter(x=>x.question.trim()&&x.contrast.trim()).map(x=>`${clean(x.question)}\t${clean(x.contrast)} | Fuente: ${clean(x.source)}`).join('\n');
}
export function calendar(idea) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(idea.date)) throw Error('Elige primero una fecha.');
  const escape=s=>s.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
  // UTF-8 line folding at <= 75 octets, including the continuation space.
  const fold=s=>{let out='',line='',bytes=0;for(const c of s){const n=new TextEncoder().encode(c).length;if(bytes+n>74){out+=line+'\r\n';line=' ';bytes=1;}line+=c;bytes+=n;}return out+line;};
  return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//LectorLab//Lectura//ES','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${escape(idea.id)}@lectorlab.local`,`DTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'')}`,`DTSTART;VALUE=DATE:${idea.date.replaceAll('-','')}`,`SUMMARY:${escape('Revisar: '+(idea.title || 'mi idea'))}`,`DESCRIPTION:${escape('Recuerda sin mirar, contrasta y decide el próximo paso. '+idea.action)}`,'END:VEVENT','END:VCALENDAR'].map(fold).join('\r\n')+'\r\n';
}
export function downloadFile(name,text,type='text/plain;charset=utf-8') {
  const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export function storageAdapter(key,onError=()=>{}) {
  return {
    read(){try{return localStorage.getItem(key);}catch{onError();return null;}},
    write(value){try{localStorage.setItem(key,value);return true;}catch{onError();return false;}},
    clear(){try{localStorage.removeItem(key);return true;}catch{onError();return false;}}
  };
}
