import fs from 'node:fs'; import vm from 'node:vm';
const f=process.argv[2]; const out={};
vm.runInNewContext(fs.readFileSync(f,'utf8'),{VCPanels:o=>Object.assign(out,o),VCCards:o=>Object.assign(out,o),window:{}});
for(const [n,fn] of Object.entries(out)){ const src=String(fn); const g=new Function('k','var h={};var I="#3a2a12";return ('+src+')(k)'); let s; try{s=g(7);}catch(e){console.log('ERR',n,e.message);continue;}
 fs.writeFileSync('/tmp/art/out_'+n+'.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 180">'+s+'</svg>'); console.log('ok',n,s.length);}
