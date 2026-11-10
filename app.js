const $=s=>document.querySelector(s),esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const ST={bio:'Biological Science',phys:'Physical Science',comm:'Commerce',arts:'Arts',et:'Engineering Technology',bst:'Bio-systems Technology'},ALL=Object.keys(ST);
const DI='COLOMBO|GAMPAHA|KALUTARA|MATALE|KANDY|NUWARA ELIYA|GALLE|MATARA|HAMBANTOTA|JAFFNA|KILINOCHCHI|MANNAR|MULLAITIVU|VAVUNIYA|TRINCOMALEE|BATTICALOA|AMPARA|PUTTALAM|KURUNEGALA|ANURADHAPURA|POLONNARUWA|BADULLA|MONARAGALA|KEGALLE|RATNAPURA'.split('|');
const tc=s=>s.replace(/\b(\w)(\w*)/g,(m,a,b)=>a+b.toLowerCase());
const BIO=/^(MEDICINE|DENTAL|VETERINARY|AGRICULT|AGRI BUSINESS|GREEN TECH|FOOD SCIENCE|FOOD PRODUCTION|ANIMAL|EXPORT AGRI|AQUATIC|URBAN BIORES|BIOCHEM|BIOLOGICAL|APPLIED SCIENCES \(BIO|APPLIED CHEMISTRY|AYURVEDA|UNANI|SIDDHA|NURSING|PHARMACY|MEDICAL |RADIOGRAPHY|PHYSIOTHERAPY|OCCUPATIONAL|OPTOMETRY|SPEECH|ENVIRONMENTAL|FISHERIES|HEALTH PROMOTION)/,
PHY=/^(ENGINEERING|TRANSPORT MANAGEMENT|PHYSICAL SCIENCE|COMPUTER SCIENCE|APPLIED SCIENCES \(PHY|INDUSTRIAL STATISTICS|STATISTICS|ARTIFICIAL|ELECTRONIC|DATA SCIENCE)/,
COM=/^(MANAGEMENT( \(|$| AND PUBLIC| STUDIES)|COMMERCE|REAL ESTATE|BUSINESS INFORMATION|ACCOUNTING|BANKING)/,
ART=/^(ARTS|COMMUNICATION STUDIES|PEACE|ISLAMIC|ARABIC|TEACHING ENGLISH|SOCIAL WORK|MUSIC|DANCE|DRAMA|VISUAL|ART & DESIGN)/,
OPN=/^(INFORMATION AND COMMUNICATION|COMPUTER SCIENCE & TECH|INFORMATION TECHNOLOGY|INFORMATION SYSTEMS|INDUSTRIAL INFORMATION|MANAGEMENT AND INFORMATION|QUANTITY|SURVEYING|URBAN INFORMATICS|ARCHITECTURE|FASHION|LANDSCAPE|DESIGN|LAW|FACILITIES|SCIENCE AND TECH|ENTREPRENEUR|MINERAL|HOSPITALITY|PHYSICAL EDUCATION|SPORTS|TOURISM|TRANSLATION|FILM|PROJECT MAN|SOFTWARE|FOOD BUSINESS|MARINE AND|BUSINESS SCIENCE|FINANCIAL ENG|GEOGRAPHICAL|FINANCIAL MATH|HUMAN RESOURCE|FINANCIAL ECON|ENGLISH LANGUAGE|CREATIVE MUSIC|PLANTATION|PRIMARY|POLYMER)/;
const RL=[[/^ENGINEERING TECHNOLOGY/,['et']],[/^BIOSYSTEMS/,['bst']],[/^INFORMATION COMMUNICATION TECH/,['et','bst']],[OPN,ALL,1],[BIO,['bio']],[PHY,['phys']],[COM,['comm']],[ART,['arts']]];
const MC=new Map();
function meta(n){let m=MC.get(n);if(m)return m;const c=n.replace(/\s*[*#]+/g,'').replace(/\s+/g,' ').trim(),U=c.toUpperCase();let s=ALL,k=1,o=0;
for(const[r,t,f]of RL)if(r.test(U)){s=t;k=0;o=f||0;break}
m={name:c,s,k,o,hash:n.includes('#')};MC.set(n,m);return m}
const YS=['2023','2024','2025'],YL=y=>`${y}/${+y+1}`,bad={};
const ld=y=>window.UGC&&UGC[y]?Promise.resolve():bad[y]?Promise.reject(new Error('Missing data-'+y+'.js')):new Promise((ok,no)=>{const s=document.createElement('script');s.src=`data-${y}.js`;s.onload=ok;s.onerror=()=>{bad[y]=1;no(new Error('Could not load data-'+y+'.js'))};document.head.appendChild(s)});
$('#st').innerHTML=Object.entries(ST).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
$('#di').innerHTML='<option value="">Select district</option>'+DI.map((d,i)=>`<option value="${i}">${tc(d)}</option>`).join('');
let rows=[],Z=0;
const root=document.documentElement;
try{root.dataset.theme=localStorage.getItem('th')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch(e){root.dataset.theme='light'}
$('#th').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('th',t)}catch(e){}};
document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>tab(b.dataset.t));
function tab(t,k){document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));$('#r').hidden=t!=='r';$('#c').hidden=t!=='c';if(t==='c')openCompare(k)}
const card=(r,i,near)=>{const d=Z-r.v;return`<div class="card${near?' near':''}"><div class="t">${esc(r.m.name)}</div><div class="u">${esc(r.u)}</div><div class="x"><span>Cutoff <b>${r.v.toFixed(4)}</b></span><span class="${near?'neg':'pos'}">${d>=0?'+':''}${d.toFixed(4)}</span></div><div class="b">${r.m.hash?'<i>Aptitude / practical test</i>':''}${r.m.o?'<i>All streams · subject rules apply</i>':''}${r.m.k?'<i>Check eligibility</i>':''}</div><button type="button" data-i="${i}">Compare cutoffs</button></div>`};
function show(){const q=($('#q')?.value||'').toLowerCase(),ok=[],nr=[];let nq=0;
rows.forEach((r,i)=>{if(r.v===null){nq++;return}if(q&&!(r.m.name+' '+r.u).toLowerCase().includes(q))return;const d=Z-r.v;if(d>=0)ok.push([r,i]);else if(-d<=0.05)nr.push([r,i])});
ok.sort((a,b)=>b[0].v-a[0].v);nr.sort((a,b)=>a[0].v-b[0].v);
$('#o').innerHTML=`<h2>You can enter (${ok.length})</h2>${ok.length?`<div class="grid">${ok.map(x=>card(x[0],x[1])).join('')}</div>`:'<p class="hint">No courses match your Z-score in this district.</p>'}<h2>Just below the cutoff — within 0.05 (${nr.length})</h2>${nr.length?`<div class="grid">${nr.map(x=>card(x[0],x[1],1)).join('')}</div>`:'<p class="hint">None.</p>'}<p class="hint">${nq} course(s) had no qualified candidates (NQC) from this district last year and are not listed.</p>`;
document.querySelectorAll('#o .card button').forEach(b=>b.onclick=()=>{const r=rows[b.dataset.i];tab('c',r.key)})}
$('#f').onsubmit=async e=>{e.preventDefault();const y=$('#yr').value,st=$('#st').value,di=$('#di').value;Z=parseFloat($('#z').value);
if(isNaN(Z)||di===''){$('#r').innerHTML='<p class="hint">Please enter your Z-score and select a district.</p>';return}
$('#r').innerHTML='<p class="hint">Loading…</p>';
try{await ld(y)}catch(err){$('#r').innerHTML=`<p class="hint">${esc(err.message)}</p>`;return}
rows=UGC[y].c.map(c=>({key:c[0]+'|'+c[1],u:c[1],v:c[2][di],m:meta(c[0])})).filter(r=>r.m.s.includes(st));
$('#r').innerHTML=`<p class="hint">${tc(DI[di])} district · ${ST[st]} · A/L ${y} · Z-score ${Z.toFixed(4)} · cutoffs of ${YL(y)} admission</p><input id="q" placeholder="Filter by course or university"><div id="o"></div>`;
$('#q').oninput=show;show()};
async function openCompare(key){await Promise.allSettled(YS.map(ld));const ys=YS.filter(y=>window.UGC&&UGC[y]);
if(!ys.length){$('#cm').textContent='Could not load cutoff data.';return}
const sel=$('#cs'),cd=$('#cd');
if(!cd.options.length){cd.innerHTML=DI.map((d,i)=>`<option value="${i}">${tc(d)}</option>`).join('');cd.onchange=draw;cd.value=$('#di').value||0}
if(!sel.options.length){const m=new Map();ys.forEach(y=>UGC[y].c.forEach(c=>m.set(c[0]+'|'+c[1],meta(c[0]).name+' — '+c[1])));
sel.innerHTML=[...m].sort((a,b)=>a[1].localeCompare(b[1])).map(([k,v])=>`<option value="${esc(k).replace(/"/g,'&quot;')}">${esc(v)}</option>`).join('');sel.onchange=draw}
if(key){sel.value=key;if($('#di').value!=='')cd.value=$('#di').value}draw()}
function draw(){const key=$('#cs').value,di=+$('#cd').value,ys=YS.filter(y=>window.UGC&&UGC[y]);
const P=ys.map(y=>{const c=UGC[y].c.find(c=>c[0]+'|'+c[1]===key);return{l:YL(y),v:c?c[2][di]:undefined}});
const nums=P.filter(p=>typeof p.v==='number').map(p=>p.v);
if(!nums.length){$('#ch').innerHTML='<p class="hint">No cutoff for this district (NQC or course not offered).</p>';$('#cm').textContent='';return}
const mob=($('#ch').clientWidth||800)<600,W=mob?400:800,H=mob?340:380,L=mob?60:90,Rt=mob?60:90,T=70,B=70,n=P.length,x=i=>n===1?W/2:L+i*(W-L-Rt)/(n-1);
let lo=Math.min(...nums),hi=Math.max(...nums);const pad=Math.max((hi-lo)*.3,.06);lo-=pad;hi+=pad;const y=v=>T+(H-T-B)*(hi-v)/(hi-lo);
let g='<defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--rd)" stop-opacity=".3"/><stop offset="1" stop-color="var(--rd)" stop-opacity="0"/></linearGradient></defs>';
for(let k=0;k<5;k++){const yy=T+k*(H-T-B)/4;g+=`<line class="g" x1="${mob?10:40}" x2="${W-(mob?10:40)}" y1="${yy}" y2="${yy}"/>`}
const pts=P.map((p,i)=>typeof p.v==='number'?[x(i),y(p.v)]:null).filter(Boolean);
if(pts.length>1){let d=`M${pts[0][0]},${pts[0][1]}`;for(let i=1;i<pts.length;i++){const[a,b]=pts[i-1],[c,e]=pts[i],m=(a+c)/2;d+=`C${m},${b} ${m},${e} ${c},${e}`}
g+=`<path class="ar" d="${d}L${pts.at(-1)[0]},${H-B}L${pts[0][0]},${H-B}Z"/><path class="ln" d="${d}"/>`}
P.forEach((p,i)=>{g+=`<text class="xl" x="${x(i)}" y="${H-24}" text-anchor="middle">${p.l}</text>`;
if(typeof p.v==='number')g+=`<circle class="dt" cx="${x(i)}" cy="${y(p.v)}" r="9"/><text class="lb" x="${x(i)}" y="${y(p.v)-20}" text-anchor="middle">${p.v.toFixed(4)}</text>`;
else g+=`<text class="na" x="${x(i)}" y="${H-B-14}" text-anchor="middle">${p.v===null?'NQC':'Not offered'}</text>`});
$('#ch').innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Cutoff values by year"><text class="ti" x="${W/2}" y="30" text-anchor="middle">Cutoff values for ${DI[di]}</text>${g}</svg>`;
const last=[...P].reverse().find(p=>typeof p.v==='number'),z=parseFloat($('#z').value);
$('#cm').textContent=isNaN(z)?'':`Your Z-score ${z.toFixed(4)} is ${z>=last.v?'above':'below'} the ${last.l} cutoff by ${Math.abs(z-last.v).toFixed(4)}.`}

let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(!$('#c').hidden&&$('#cs').options.length)draw()},150)});

(()=>{const d=$('#intro');if(!d||!d.showModal)return;
let busy=0;const close=()=>{if(busy)return;busy=1;if($('#ns').checked)try{localStorage.setItem('intro','1')}catch(e){}
const fin=()=>{d.classList.remove('out');d.close();busy=0};d.classList.add('out');d.addEventListener('animationend',fin,{once:true});setTimeout(()=>{if(d.open&&busy)fin()},1000)};
d.addEventListener('cancel',e=>{e.preventDefault();close()});
$('#ok').onclick=close;
d.addEventListener('click',e=>{if(e.target===d)close()});
$('#inf').onclick=()=>{$('#ns').checked=false;d.showModal()};
let seen=0;try{seen=localStorage.getItem('intro')}catch(e){}
if(!seen)d.showModal()})();

(()=>{const d=$('#intro');if(!d)return;
const set=l=>{d.dataset.l=l;d.querySelectorAll('.lt button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.l===l));d.querySelector('#it').lang=l;try{localStorage.setItem('lang',l)}catch(e){}};
d.querySelectorAll('.lt button').forEach(b=>b.onclick=()=>set(b.dataset.l));
let l='si';try{l=localStorage.getItem('lang')||'si'}catch(e){}set(['si','ta','en'].includes(l)?l:'si')})();

/* ===== Block right-click, copy, cut, paste, print ===== */
(()=>{const inp=e=>e.target.closest&&e.target.closest('input,select,textarea');
const stop=e=>{e.preventDefault();e.stopPropagation()};
['contextmenu','copy','cut','dragstart'].forEach(t=>document.addEventListener(t,stop,true));
document.addEventListener('paste',e=>{if(!inp(e))stop(e)},true);   // pasting into input boxes still allowed
document.addEventListener('selectstart',e=>{if(!inp(e))e.preventDefault()},true);
document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();
if((e.ctrlKey||e.metaKey)&&['c','x','p','a'].includes(k)&&!(k==='a'&&inp(e)))stop(e);
if((e.ctrlKey||e.metaKey)&&k==='v'&&!inp(e))stop(e);
if(e.key==='PrintScreen'){try{navigator.clipboard.writeText('')}catch(_){}}},true);
addEventListener('beforeprint',()=>document.body.classList.add('noprint'));
addEventListener('afterprint',()=>document.body.classList.remove('noprint'));
})();
