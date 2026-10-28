import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, join } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { allPages } from '../scripts/site/pages.mjs';

const root = resolve('dist');
const mime = {'.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.webp':'image/webp', '.svg':'image/svg+xml', '.ttf':'font/ttf', '.pdf':'application/pdf'};
const server=createServer(async(req,res)=>{
  try {
    let path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!path.startsWith(root+'/') && path!==root) throw Error('invalid path');
    if((await stat(path)).isDirectory()) path=join(path,'index.html');
    res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(await readFile(path));
  }catch{res.writeHead(404);res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||undefined,args:process.env.CHROMIUM_ARGS?JSON.parse(process.env.CHROMIUM_ARGS):['--no-sandbox']});
const errors=[], failures=[], accessibility=[], layoutIssues=[];
const context=await browser.newContext();
const page=await context.newPage();
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400) failures.push(`${r.status()} ${r.url()}`);});
await mkdir('tmp/qa',{recursive:true});
try {
  for(const width of (process.env.QA_SKIP_LAYOUT ? [] : [1440,768,390,320])) {
    await page.setViewportSize({width,height:900});
    // Reduced motion makes geometry assertions deterministic; animated path is tested below.
    await page.emulateMedia({reducedMotion:'reduce'});
    for(const {path} of allPages()) {
      const url=path==='index.html'?'/':'/'+path.replace('index.html','');
      await page.goto(base+url,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      await page.locator('img').evaluateAll(images => Promise.all(images.map(async img => {
        img.loading = 'eager';
        await img.decode().catch(() => {});
      })));
      assert.equal(await page.locator('h1').count(),1,`${width} ${url}: one main heading`);
      if (!await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)) {
        const overflowing=await page.locator('main *').evaluateAll(els=>els.filter(el=>el.getBoundingClientRect().right>innerWidth+1).map(el=>({tag:el.tagName,cls:el.className,right:el.getBoundingClientRect().right})).slice(0,12));
        layoutIssues.push({width,url,overflowing});
      }
      const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src));
      assert.deepEqual(broken,[],`${width} ${url}: images`);
      if(width===1440) {
        const links=await page.locator('a[href]').evaluateAll(as=>as.map(a=>a.getAttribute('href')).filter(h=>h.startsWith('/')||h.startsWith('#')));
        for(const href of links) {
          const target=new URL(href,base+url);let file=resolve(root,'.'+target.pathname);if(target.pathname.endsWith('/')) file=join(file,'index.html');
          const html=await readFile(file,'utf8');
          if(target.hash) assert.ok(html.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),`${url}: missing anchor ${href}`);
        }
      }
    }
    console.log(`CHECKED: ${allPages().length} pages at ${width}px; ${layoutIssues.filter(x=>x.width===width).length} layout issues.`);
  }
  await writeFile('tmp/qa/layout.json',JSON.stringify(layoutIssues,null,2));
  console.log(JSON.stringify({layoutIssues}));
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const path of ['/','/tienda/','/tienda/curso-lectura-rapida/','/tienda/cuadernos-lectorlab/','/laboratorio/','/laboratorio/mesa/','/habilidades/comunicar/']) {
    await page.goto(base+path,{waitUntil:'networkidle'});
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    for(const v of result.violations) accessibility.push({path,id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))});
  }
  await writeFile('tmp/qa/accessibility.json',JSON.stringify(accessibility,null,2));
  await page.goto(base+'/tienda/?tipo=notebook',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#product-grid .product-card:visible').count(),1);
  assert.equal(await page.locator('#filter-count').innerText(),'1 producto');
  await page.locator('#filter-skill').selectOption('hablar-en-publico');
  assert.ok(await page.locator('#filter-empty').isVisible());
  await page.locator('#filter-reset').click();
  assert.equal(await page.locator('#filter-count').innerText(),'26 productos');
  await page.locator('[data-filter-type="course"]').click();
  assert.equal(await page.locator('#product-grid .product-card:visible').count(),0);
  assert.ok(await page.locator('.shop-featured').isVisible());
  assert.equal(await page.locator('#filter-count').innerText(),'1 producto');
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('[data-filter-type="course"]').getAttribute('aria-pressed'),'true');
  console.log('PASS: product filters, empty state, reset, course visibility and URL reload.');
  await page.goto(base+'/laboratorio/',{waitUntil:'networkidle'});
  await page.locator('.legacy-lab > summary').click();
  await page.locator('#note').fill('Una pregunta para probar el flujo real.');
  await page.locator('#remember').check();
  await page.reload({waitUntil:'networkidle'});
  await page.locator('.legacy-lab > summary').click();
  assert.equal(await page.locator('#note').inputValue(),'Una pregunta para probar el flujo real.');
  await page.locator('#complete').check();
  await page.locator('#next-day').click();
  assert.equal(await page.locator('#day-number').innerText(),'DÍA 02 / 07');
  await page.locator('#topic').selectOption('attention');
  assert.equal(await page.locator('#note').inputValue(),'');
  const download=page.waitForEvent('download');await page.locator('#export').click();assert.ok((await download).suggestedFilename().endsWith('.txt'));
  await page.locator('#reset').click();await page.locator('button[value="cancel"]').click();
  console.log('PASS: notebook input, real storage/reload, route isolation, navigation, export and cancel.');
  await page.goto(base+'/laboratorio/mesa/',{waitUntil:'networkidle'});
  await page.locator('#new').click();
  await page.locator('#title').fill('Mi primera prueba en la plataforma');
  await page.locator('#question').fill('¿Qué pregunta falta en la reunión?');
  await page.locator('#contrast').fill('Preguntar puede revelar restricciones; no garantiza acuerdos.');
  await page.locator('#experiment summary').click();
  await page.locator('#action').fill('Preguntar antes de proponer.');
  await page.locator('#cue').fill('Al revisar el calendario mañana.');
  await page.locator('#stage').selectOption('2');
  await page.locator('#stage').selectOption('3');
  assert.equal(await page.locator('#stage').inputValue(),'2');
  await page.locator('#review').fill('Apareció una entrega que no conocía.');
  await page.locator('#stage').selectOption('3');
  await page.locator('summary').filter({hasText:'Guardar, llevarme'}).click();
  await page.locator('#remember').check();
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('#review').inputValue(),'Apareció una entrega que no conocía.');
  assert.equal(await page.locator('#stage').inputValue(),'3');
  await page.locator('summary').filter({hasText:'Guardar, llevarme'}).click();
  const platformDownload=page.waitForEvent('download');await page.locator('#json').click();assert.ok((await platformDownload).suggestedFilename().endsWith('.json'));
  await page.locator('#import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{}')});
  await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('No se ha importado'));
  assert.equal(await page.locator('#board .idea-card').count(),1);
  await page.screenshot({path:'tmp/qa/platform-desktop.png',fullPage:true});
  console.log('PASS: public platform creation, stage validation, review, persistence, backup and rejected import.');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+'/tienda/curso-lectura-rapida/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#course-scene canvas'));
  await page.locator('#motion-toggle').click();
  assert.equal(await page.locator('#course-scene canvas').count(),0);
  await page.locator('#motion-toggle').click();
  await page.locator('#course-scene').scrollIntoViewIfNeeded();
  await page.waitForFunction(()=>document.querySelector('#course-scene canvas'));
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>!document.querySelector('#course-scene canvas'));
  assert.equal(await page.locator('#course-scene canvas').count(),0);
  console.log('PASS: WebGL loads, pauses, resumes and respects reduced motion.');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto(base+'/',{waitUntil:'networkidle'});
  await page.waitForTimeout(1500);
  await page.screenshot({path:'tmp/qa/desktop-hero.png'});
  const flightState = () => page.evaluate(() => ({
    transform: document.querySelector('#rocket').getAttribute('transform'),
    trail: parseFloat(getComputedStyle(document.querySelector('#rocket-path')).strokeDashoffset),
  }));
  await page.evaluate(() => {
    const r = document.querySelector('.rocket-stage').getBoundingClientRect();
    scrollTo({top: scrollY + r.top - innerHeight * .75 + 2, behavior:'instant'});
  });
  await page.waitForTimeout(900);
  const launch = await flightState();
  await page.evaluate(() => {
    const r = document.querySelector('.rocket-stage').getBoundingClientRect();
    scrollTo({top: scrollY + r.bottom - innerHeight * .4 + 2, behavior:'instant'});
  });
  await page.waitForTimeout(900);
  const landing = await flightState();
  assert.notEqual(landing.transform,launch.transform,'Rocket moves with scroll');
  assert.ok(landing.trail < launch.trail && landing.trail < 1,'Flight path follows rocket');
  await page.locator('#cohete').screenshot({path:'tmp/qa/rocket-story.png'});
  await page.locator('#motion-toggle').click();
  assert.equal(await page.locator('#rocket').evaluate(el=>getComputedStyle(el).opacity),'1','Static rocket remains visible');
  assert.equal(await page.locator('.marquee-track').evaluate(el=>getComputedStyle(el).transform),'none','Banner animation is cleaned up');
  await page.locator('#motion-toggle').click();
  await page.locator('[data-story-step]').nth(1).scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  assert.ok(await page.locator('[data-story-step]').nth(1).evaluate(el=>parseFloat(getComputedStyle(el).getPropertyValue('--step-progress')) > 0),'Chapter progress reacts to scroll');
  await page.locator('#historia').screenshot({path:'tmp/qa/peter-story.png'});
  console.log('PASS: rocket trajectory, chapter progress, banner pause/resume and static fallback.');
  await page.locator('.path-card').first().hover();
  await page.waitForTimeout(350);
  assert.notEqual(await page.locator('.path-card').first().evaluate(el=>getComputedStyle(el).transform),'none');
  await page.locator('#motion-toggle').click();
  assert.equal(await page.locator('.path-card').first().evaluate(el=>getComputedStyle(el).transform),'none');
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.locator('img').evaluateAll(images => Promise.all(images.map(async img => { img.loading='eager'; await img.decode(); })));
  await page.screenshot({path:'tmp/qa/desktop-full.png',fullPage:true});
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+'/',{waitUntil:'networkidle'});
  await page.screenshot({path:'tmp/qa/mobile-hero.png'});
  await page.locator('.mobile-nav summary').click();
  assert.ok(await page.locator('.mobile-nav nav').isVisible());
  await page.locator('.mobile-nav a[href="/tienda/"]').click();
  await page.waitForURL(base+'/tienda/');
  assert.equal(await page.locator('.mobile-nav').getAttribute('open'),null);
  const noJs=await browser.newContext({javaScriptEnabled:false});
  const staticPage=await noJs.newPage();await staticPage.goto(base+'/');
  assert.ok(await staticPage.locator('#hero-cta').isVisible());
  assert.equal(await staticPage.locator('[data-story-step]').count(),3);
  assert.equal(await staticPage.locator('#rocket').evaluate(el=>getComputedStyle(el).opacity),'1');
  assert.equal(await staticPage.locator('.curated-grid a[href^="https:"]').count(),3);
  await noJs.close();
  console.log('PASS: Motion hover/pause, mobile menu and no-JavaScript content.');
  await writeFile('tmp/qa/accessibility.json',JSON.stringify({accessibility,layoutIssues},null,2));
  console.log(JSON.stringify({layoutIssues},null,2));
  assert.deepEqual(errors,[],'Browser JavaScript errors');
  assert.deepEqual(failures,[],'Failed resource requests');
  console.log(JSON.stringify({accessibility},null,2));
  assert.deepEqual(accessibility,[],'WCAG A/AA violations');
  assert.deepEqual(layoutIssues,[],'Responsive overflow');
} finally { await browser.close();await new Promise(r=>server.close(r)); }
