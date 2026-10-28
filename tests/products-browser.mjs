import assert from 'node:assert/strict';
import {readFile,stat,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname} from 'node:path';
import {createServer} from 'node:http';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const products=resolve(process.env.LECTORLAB_PRODUCTS_DIR||'../lectorlab-products/output');
const dist=resolve('dist');
const server=createServer(async(req,res)=>{try{let p=resolve(dist,'.'+new URL(req.url,'http://local').pathname);if(!p.startsWith(dist+'/'))throw Error();if((await stat(p)).isDirectory())p=join(p,'index.html');res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.webp':'image/webp','.ttf':'font/ttf'})[extname(p)]||'text/plain');res.end(await readFile(p));}catch{res.writeHead(404);res.end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH,args:process.env.CHROMIUM_ARGS?JSON.parse(process.env.CHROMIUM_ARGS):['--no-sandbox']});
const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
const qa=resolve('../lectorlab-products/qa');await mkdir(qa,{recursive:true});
async function getDownload(button){const p=page.waitForEvent('download');await button.click();const dl=await p;return {name:dl.suggestedFilename(),text:await readFile(await dl.path(),'utf8')};}
async function accessible(label){const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(results.violations.map(x=>({id:x.id,nodes:x.nodes.map(n=>n.target)})),[],label);}
try{
 await page.goto(base+'/laboratorio/');
 await page.locator('#quick-next').click();await page.locator('#quick-next').click();assert.match(await page.locator('#quick-status').textContent(),/Escribe un recuerdo/);
 await page.locator('#quick-recall').fill('La pregunta mostró una restricción.');await page.locator('#quick-feedback summary').click();await page.locator('#quick-contrast').fill('No garantiza un acuerdo.');await page.locator('#quick-next').click();
 await page.locator('#quick-action').fill('Preguntaré qué parte preocupa.');await page.locator('#quick-cue').fill('Mañana, al revisar el calendario.');await page.locator('#quick-date').fill('2026-11-03');await page.locator('#quick-remember').check();await page.locator('#quick-next').click();
 const labBackup=await getDownload(page.locator('#quick-json'));assert.equal(JSON.parse(labBackup.text).ideas[0].action,'Preguntaré qué parte preocupa.');
 await page.reload();assert.ok(await page.locator('#quick-summary').isVisible());assert.match(await page.locator('#quick-summary').textContent(),/Preguntaré/);await accessible('lab finished');
 await page.screenshot({path:join(qa,'lab-desktop.png'),fullPage:true});
 const pack=pathToFileURL(join(products,'Pack-LectorLab-19/01-MI-LABORATORIO.html')).href;
 await page.goto(pack);await page.locator('summary').filter({hasText:'Guardar, llevarme'}).click();
 await page.locator('#import').setInputFiles({name:'lab.json',mimeType:'application/json',buffer:Buffer.from(labBackup.text)});await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Importadas 1 ideas'));assert.equal(await page.locator('#action').inputValue(),'Preguntaré qué parte preocupa.');
 await page.locator('#remember').check();await page.locator('#title').fill('<img src=x onerror=alert(1)>');await page.locator('#stage').selectOption('2');assert.equal(await page.locator('#board img').count(),0);assert.ok((await page.locator('#summary').textContent()).includes('1 en prueba'));
 await page.locator('#stage').selectOption('3');assert.equal(await page.locator('#stage').inputValue(),'2');await page.locator('#review').fill('Apareció una fecha que no conocía.');await page.locator('#stage').selectOption('3');
 await page.reload();assert.equal(await page.locator('#stage').inputValue(),'3');assert.equal(await page.locator('#review').inputValue(),'Apareció una fecha que no conocía.');
 await page.locator('summary').filter({hasText:'Guardar, llevarme'}).click();const saved=await getDownload(page.locator('#json'));assert.equal(JSON.parse(saved.text).ideas.length,1);
 const anki=await getDownload(page.locator('#anki'));assert.ok(anki.text.includes('#html:false'));assert.ok(anki.text.includes('No garantiza un acuerdo.'));
 await page.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"format":"wrong"}')});await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('No se ha importado'));assert.match(await page.locator('#status').textContent(),/No se ha importado/);assert.equal(await page.locator('#review').inputValue(),'Apareció una fecha que no conocía.');
 await page.locator('#delete').click({noWaitAfter:true,timeout:1000}).catch(()=>{});
 // Native confirmation defaults to dismiss in Playwright: idea must remain.
 assert.equal(await page.locator('#board .idea-card').count(),1);
 for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`pack overflow ${width}`);}
 await accessible('kit');await page.screenshot({path:join(qa,'kit-mobile.png'),fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:join(qa,'kit-desktop.png'),fullPage:true});
 const course=pathToFileURL(join(products,'Curso-LectorLab-49/01-CURSO-Y-HERRAMIENTAS.html')).href;await page.goto(course);await page.locator('summary').filter({hasText:'Herramientas:'}).click();await page.locator('#planner button').click();assert.match(await page.locator('#estimate').textContent(),/4 sesiones/);await page.locator('#review-minutes').fill('20');await page.locator('#planner button').click();assert.match(await page.locator('#estimate').textContent(),/menos minutos/);
 await page.locator('[data-answer]').first().fill('Mi pregunta para la reunión.');await page.locator('#remember').check();await page.reload();assert.equal(await page.locator('[data-answer]').first().inputValue(),'Mi pregunta para la reunión.');const courseBackup=await getDownload(page.locator('#export'));assert.equal(JSON.parse(courseBackup.text).format,'lectorlab-course');
 await page.locator('summary').filter({hasText:'Herramientas:'}).click();await page.locator('#timer-start').click();assert.equal(await page.locator('#timer-start').textContent(),'En marcha');await page.locator('#timer-pause').click();assert.equal(await page.locator('#timer-start').textContent(),'Continuar');await page.locator('#timer-reset').click();assert.equal(await page.locator('#clock').textContent(),'00:00');
 for(const width of [1440,768,390,320]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`course overflow ${width}`);}
 await accessible('course');
 const denied=await browser.newContext();await denied.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}));const blocked=await denied.newPage();await blocked.goto(pack);await blocked.locator('#new').click();await blocked.locator('summary').filter({hasText:'Guardar, llevarme'}).click();await blocked.locator('#remember').check();assert.match(await blocked.locator('#status').textContent(),/no permite guardar/);await denied.close();
 assert.deepEqual(errors,[]);console.log('PASS: lab-to-kit import; file:// persistence; stage guards; XSS-safe rendering; invalid import preservation; JSON/Anki exports; course planner/timer; blocked storage; 4 widths; accessibility.');
 await writeFile(join(qa,'browser-report.json'),JSON.stringify({result:'pass',widths:[1440,768,390,320],pageErrors:errors,accessibilityViolations:0},null,2));
}finally{await browser.close();await new Promise(r=>server.close(r));}
