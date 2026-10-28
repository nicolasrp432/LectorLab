import assert from 'node:assert/strict';
import {emptyIdea,backup,parseBackup,anki,calendar,storageAdapter} from '../src/learning-core.js';
const idea={...emptyIdea(),title:'Una prueba <script>',question:'¿Qué\tpasó?\nCuenta',contrast:'Respuesta\ncontrastada',source:'Libro, p. 12',date:'2026-11-03'};
assert.deepEqual(parseBackup(backup([idea])).ideas,[idea]);
for(const bad of ['{}',backup([idea,idea]),JSON.stringify({format:'lectorlab-kit',version:1,ideas:[{...idea,stage:4}]}),JSON.stringify({format:'lectorlab-kit',version:1,ideas:[{...idea,action:null}]}),'a'.repeat(1000001)])assert.throws(()=>parseBackup(bad));
const cards=anki([idea,emptyIdea()]).split('\n');assert.equal(cards.length,3);assert.equal(cards[2].split('\t').length,2);assert.ok(cards[2].includes('Libro, p. 12'));
const ics=calendar({...idea,title:'á'.repeat(120)+'\nBEGIN:VEVENT',action:'a,b;c'});assert.ok(ics.includes('\\nBEGIN:VEVENT'));assert.ok(ics.replace(/\r\n /g,'').includes('a\\,b\\;c'));for(const line of ics.split('\r\n'))assert.ok(Buffer.byteLength(line)<=75);assert.throws(()=>calendar(emptyIdea()));
let errors=0;Object.defineProperty(globalThis,'localStorage',{get(){throw Error('blocked');},configurable:true});const s=storageAdapter('test',()=>errors++);assert.equal(s.read(),null);assert.equal(s.write('x'),false);assert.equal(s.clear(),false);assert.equal(errors,3);
console.log('PASS: backup validation, duplicate IDs, import bounds, Anki TSV, ICS injection/folding, denied storage.');
