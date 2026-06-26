// hud.js — shared HUD system for all pages

/* ════════════ BG CANVAS ════════════ */
(function(){
  const cv = document.getElementById('bg-canvas');
  if(!cv) return;
  const cx = cv.getContext('2d');
  let W, H, pts=[], matDrops=[], angle=0;
  const G='#00ff41', B='#00e5ff', R='#ff003c';
  const CHARS='アイウエカキクサタ01CYBERHACKX<>{}[]#$%';

  function resize(){
    W = cv.width  = window.innerWidth;
    H = cv.height = window.innerHeight;
    const fc = Math.floor(W/13);
    matDrops = Array.from({length:fc}, ()=> Math.random()*-60);
  }

  class Pt{
    constructor(){ this.reset(); }
    reset(){
      this.x=Math.random()*W; this.y=Math.random()*H;
      this.vx=(Math.random()-.5)*.32; this.vy=(Math.random()-.5)*.32;
      this.r=Math.random()*1.6+.4;
      this.c=[G,G,G,G,B,R][Math.floor(Math.random()*6)];
      this.a=Math.random()*.45+.12;
    }
    tick(){ this.x+=this.vx; this.y+=this.vy; if(this.x<0||this.x>W||this.y<0||this.y>H) this.reset(); }
    draw(){
      cx.save(); cx.globalAlpha=this.a;
      cx.fillStyle=this.c; cx.shadowBlur=7; cx.shadowColor=this.c;
      cx.beginPath(); cx.arc(this.x,this.y,this.r,0,Math.PI*2); cx.fill();
      cx.restore();
    }
  }

  function init(){
    const n=Math.min(60,Math.floor(W/16));
    pts=Array.from({length:n},()=>new Pt());
  }

  function drawMatrix(){
    cx.font='12px Share Tech Mono,monospace';
    for(let i=0;i<matDrops.length;i++){
      const ch=CHARS[Math.floor(Math.random()*CHARS.length)];
      cx.save(); cx.globalAlpha=.05; cx.fillStyle=G;
      cx.fillText(ch,i*13,matDrops[i]*13); cx.restore();
      if(matDrops[i]*13>H && Math.random()>.977) matDrops[i]=0;
      matDrops[i]+=.38;
    }
  }

  function drawLines(){
    const d=100;
    for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, dist=Math.hypot(dx,dy);
      if(dist<d){
        cx.save(); cx.globalAlpha=(1-dist/d)*.1; cx.strokeStyle=G;
        cx.lineWidth=.5; cx.beginPath();
        cx.moveTo(pts[i].x,pts[i].y); cx.lineTo(pts[j].x,pts[j].y);
        cx.stroke(); cx.restore();
      }
    }
  }

  function drawHex(){
    const cX=W/2, cY=H/2, s=58;
    cx.save(); cx.translate(cX,cY); cx.rotate(angle);
    cx.globalAlpha=.016; cx.strokeStyle=B; cx.lineWidth=.7;
    for(let r=-7;r<7;r++) for(let c2=-9;c2<9;c2++){
      const x=c2*s*1.732, y=r*s*2+(c2%2===0?0:s);
      cx.beginPath();
      for(let k=0;k<6;k++){
        const a=(Math.PI/3)*k-Math.PI/6;
        k===0?cx.moveTo(x+s*.88*Math.cos(a),y+s*.88*Math.sin(a))
             :cx.lineTo(x+s*.88*Math.cos(a),y+s*.88*Math.sin(a));
      }
      cx.closePath(); cx.stroke();
    }
    cx.restore();
    angle+=.00022;
  }

  let animId;
  function loop(){
    cx.clearRect(0,0,W,H);
    drawHex(); drawMatrix(); drawLines();
    pts.forEach(p=>{ p.tick(); p.draw(); });
    animId=requestAnimationFrame(loop);
  }

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden) cancelAnimationFrame(animId);
    else loop();
  });
  window.addEventListener('resize',()=>{ resize(); init(); });
  resize(); init(); loop();
})();

/* ════════════ STATUS BAR CLOCK ════════════ */
(function(){
  const el = document.getElementById('sb-clock');
  if(!el) return;
  function tick(){
    const n=new Date();
    el.textContent=[n.getHours(),n.getMinutes(),n.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':');
  }
  tick(); setInterval(tick,1000);
})();

/* ════════════ LIVE HUD VALUES ════════════ */
(function(){
  const cpuEl  = document.getElementById('hud-cpu');
  const memEl  = document.getElementById('hud-mem');
  const keyEl  = document.getElementById('hud-key');
  const threatEl = document.getElementById('hud-threat');
  const HEX='0123456789ABCDEF';

  function rand(a,b){ return Math.floor(Math.random()*(b-a))+a; }

  function update(){
    if(cpuEl)   cpuEl.textContent   = rand(8,48)+'%';
    if(memEl)   memEl.textContent   = rand(28,72)+'%';
    if(threatEl) threatEl.textContent = rand(0,3);
  }

  function cycleKey(){
    if(keyEl) keyEl.textContent = Array.from({length:8},()=>HEX[Math.floor(Math.random()*16)]).join('');
  }

  update(); setInterval(update, 2400);
  cycleKey(); setInterval(cycleKey, 750);
})();

/* ════════════ NAV ACTIVE STATE ════════════ */
(function(){
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.cx-nav-item').forEach(el=>{
    const href = el.getAttribute('href')||'';
    if(href && page.includes(href.replace('.html',''))){ el.classList.add('active'); }
    if(page===''||page==='index.html'){ document.querySelector('[href="index.html"]')?.classList.add('active'); }
  });
})();

/* ════════════ SCROLL REVEAL ════════════ */
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  },{threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
})();

/* ════════════ 3D TILT for .tilt-card ════════════ */
(function(){
  document.querySelectorAll('.tilt-card').forEach(c=>{
    c.addEventListener('mousemove',e=>{
      const r=c.getBoundingClientRect();
      const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
      c.style.transform=`perspective(500px) rotateX(${dy*-8}deg) rotateY(${dx*8}deg) translateY(-3px)`;
    });
    c.addEventListener('mouseleave',()=>{
      c.style.transform='';
      c.style.transition='transform .4s ease';
      setTimeout(()=>c.style.transition='',420);
    });
    c.addEventListener('touchmove',e=>{
      const t=e.touches[0]; const r=c.getBoundingClientRect();
      const dx=(t.clientX-r.left-r.width/2)/(r.width/2);
      const dy=(t.clientY-r.top-r.height/2)/(r.height/2);
      c.style.transform=`perspective(500px) rotateX(${dy*-5}deg) rotateY(${dx*5}deg)`;
    },{passive:true});
    c.addEventListener('touchend',()=>{ c.style.transform=''; });
  });
})();

/* ════════════ MINI RADAR (top-right HUD) ════════════ */
(function(){
  const cv=document.getElementById('mini-radar');
  if(!cv) return;
  const ctx=cv.getContext('2d');
  const S=cv.width=cv.height=70;
  const CX=S/2, CY=S/2;
  let sweep=0;
  const blips=Array.from({length:4},()=>({
    a:Math.random()*Math.PI*2,
    r:Math.random()*.3*S+.06*S,
    alpha:0,
    c:['#00ff41','#00e5ff','#ff003c'][Math.floor(Math.random()*3)]
  }));

  function draw(){
    ctx.clearRect(0,0,S,S);
    // rings
    [.28,.42,.5].forEach(f=>{
      ctx.save(); ctx.strokeStyle='#00e5ff'; ctx.globalAlpha=.12; ctx.lineWidth=.6;
      ctx.beginPath(); ctx.arc(CX,CY,f*S,0,Math.PI*2); ctx.stroke(); ctx.restore();
    });
    // cross
    ctx.save(); ctx.strokeStyle='#00e5ff'; ctx.globalAlpha=.07; ctx.lineWidth=.5; ctx.setLineDash([2,4]);
    ctx.beginPath(); ctx.moveTo(CX,0); ctx.lineTo(CX,S); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,CY); ctx.lineTo(S,CY); ctx.stroke();
    ctx.setLineDash([]); ctx.restore();
    // sweep
    ctx.save(); ctx.strokeStyle='#00ff41'; ctx.globalAlpha=.6; ctx.lineWidth=1;
    ctx.shadowBlur=4; ctx.shadowColor='#00ff41';
    ctx.beginPath(); ctx.moveTo(CX,CY);
    ctx.lineTo(CX+Math.cos(sweep)*S*.5,CY+Math.sin(sweep)*S*.5);
    ctx.stroke(); ctx.restore();
    // blips
    blips.forEach(b=>{
      const diff=((sweep-b.a)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      if(diff<.2) b.alpha=1; else b.alpha=Math.max(0,b.alpha-.01);
      if(b.alpha<=0) return;
      const x=CX+Math.cos(b.a)*b.r, y=CY+Math.sin(b.a)*b.r;
      ctx.save(); ctx.globalAlpha=b.alpha; ctx.fillStyle=b.c;
      ctx.shadowBlur=8; ctx.shadowColor=b.c;
      ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill(); ctx.restore();
    });
    sweep=(sweep+.015)%(Math.PI*2);
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ════════════ WAVEFORM BARS ════════════ */
(function(){
  document.querySelectorAll('.wave-bars').forEach(el=>{
    const count=parseInt(el.dataset.bars)||16;
    for(let i=0;i<count;i++){
      const b=document.createElement('div');
      b.style.cssText=`display:inline-block;width:2px;margin:0 1px;background:var(--g);border-radius:1px;vertical-align:bottom;animation:wavePulse ${.7+Math.random()*.9}s ease-in-out ${Math.random()*1.2}s infinite;`;
      const h=Math.random()*18+4;
      b.style.height=h+'px';
      el.appendChild(b);
    }
  });
})();

/* inject wave keyframe if not present */
if(!document.getElementById('wave-kf')){
  const s=document.createElement('style');
  s.id='wave-kf';
  s.textContent=`@keyframes wavePulse{0%,100%{transform:scaleY(.25);}50%{transform:scaleY(1);}}`;
  document.head.appendChild(s);
}
