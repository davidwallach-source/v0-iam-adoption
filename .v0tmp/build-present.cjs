const fs=require('fs');
const src=fs.readFileSync('/tmp/att/present.js','utf8').split('\n');
const a=src.findIndex(l=>l.includes('// ---------- steps'));
const b=src.findIndex(l=>l.includes('// ---------- runner'));
const data=require('../src/present/steps.json');
const steps=data.steps.map((s,i)=>({scene:s.scene,title:i===7?'Upload the NDA':s.title,cue:s.cue}));
let block=fs.readFileSync('src/present/steps-runtime.js','utf8')
  .replace('__PM_SCENES__',JSON.stringify(data.scenes))
  .replace('__PM_STEPS__',JSON.stringify(steps,null,2).replace(/\n/g,'\n    '));
let out=[...src.slice(0,a),block,...src.slice(b)].join('\n')
  .replace(`q('[aria-label="Countersigning Agent"]'), 15000`,`q('[data-pm="deal-name"]'), 15000`)
  .replace('const rects = (marksTarget?.() || []).filter(Boolean);','const rects = (marksTarget?.() || [])\n        .filter(Boolean)\n        .map((n) => ("x" in n && "w" in n ? n : rectOf(n)));')
  .replace('Commit Agent for Countersigning','Concept walkthrough')
  .replace('<h1 class="pm-cover__title">Meet Sam</h1>','<h1 class="pm-cover__title">Unified Agreements</h1>')
  .replace('\n        <p class="pm-cover__sub">VP of Sales at Acme</p>','')
  .replace("Sam's workload, handled.",'One space for the whole agreement.')
  .replace("Thanks to Docusign's Countersigning Agent.",'Unified Agreements concept')
  .replace(/<div class="pm-cover__art"><img[^>]*\/><\/div>/g,'<div class="pm-cover__art pm-cover__art--gradient" aria-hidden="true"></div>');
let css=fs.readFileSync('/tmp/att/present.css','utf8')+'\n.pm-cover__art--gradient{background:radial-gradient(120% 90% at 85% 40%,rgba(76,0,255,.22),rgba(76,0,255,.06) 55%,transparent 80%),linear-gradient(135deg,#f4f0ff 0%,#e6dcff 100%);}\n';
fs.writeFileSync('public/present.css',css);
fs.writeFileSync('public/present.js',out);
console.log(a,b,steps.length, steps.every(s=>s.cue&&s.title));
