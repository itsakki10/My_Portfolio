/**
 * Coffee Mug Canvas simulation, click counts tracker, and quotes rotation loop
 */

let cupCount = 47;
let ideasCount = 188;
let bugsFixed = 31;

function initCoffee() {
  const canvas = $('coffee-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let fillPct = 0.6;
  let steam = [];

  function addSteam() {
    steam.push({
      x: 80 + Math.random() * 40,
      y: 60,
      vy: -1.2 - Math.random() * 0.8,
      vx: (Math.random() - 0.5) * 0.5,
      life: 1,
      r: 3 + Math.random() * 4
    });
  }

  // Periodic steam creation
  const steamInterval = setInterval(addSteam, 300);

  // Click handler on the mug canvas
  canvas.onclick = () => {
    cupCount++;
    ideasCount += Math.floor(2 + Math.random() * 5);
    bugsFixed += Math.random() > 0.7 ? 1 : 0;
    fillPct = Math.min(1, fillPct + 0.05);

    // Update text counters
    const cupsEl = $('cups-count');
    const ideasEl = $('ideas-count');
    const bugsEl = $('bugs-count');
    if (cupsEl) cupsEl.textContent = cupCount;
    if (ideasEl) ideasEl.textContent = ideasCount;
    if (bugsEl) bugsEl.textContent = bugsFixed;

    // Burst of steam on click
    for (let i = 0; i < 8; i++) {
      steam.push({
        x: 60 + Math.random() * 80,
        y: 70,
        vy: -2 - Math.random() * 2,
        vx: (Math.random() - 0.5) * 2,
        life: 1.2,
        r: 4 + Math.random() * 6
      });
    }

    // Micro-animation bounce on click
    canvas.style.transform = 'scale(1.08) rotate(-3deg)';
    setTimeout(() => {
      canvas.style.transform = '';
    }, 250);
  };

  // Scroll visibility count animation observer
  const countObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animCount('cups-count', 0, cupCount, 1200);
      animCount('ideas-count', 0, ideasCount, 1400);
      animCount('bugs-count', 0, bugsFixed, 1600);
      countObs.disconnect();
    }
  }, { threshold: 0.4 });

  const cs = $('coffee-sec');
  if (cs) countObs.observe(cs);

  function animCount(id, from, to, dur) {
    const el = $(id);
    if (!el) return;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Draw loop for the coffee mug and steam particles
  function drawCoffee() {
    ctx.clearRect(0, 0, 200, 260);

    // Mug background border
    ctx.fillStyle = '#2a1506';
    ctx.beginPath();
    ctx.roundRect(30, 80, 140, 140, 8);
    ctx.fill();

    // Mug interior cup space
    ctx.fillStyle = '#3d1f0a';
    ctx.beginPath();
    ctx.roundRect(32, 82, 136, 136, 7);
    ctx.fill();

    // Coffee liquid fill
    const fillY = 82 + (1 - fillPct) * 136;
    const grad = ctx.createLinearGradient(0, fillY, 0, 218);
    grad.addColorStop(0, '#c8874a');
    grad.addColorStop(0.5, '#8b4513');
    grad.addColorStop(1, '#5c2d0a');
    
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(32, fillY, 136, 218 - fillY, fillPct > 0.95 ? [0, 0, 7, 7] : [0]);
    ctx.fill();

    // Liquid surface ellipse glow
    ctx.fillStyle = 'rgba(255, 200, 100, 0.08)';
    ctx.beginPath();
    ctx.ellipse(100, fillY + 4, 60, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer mug stroke details
    ctx.strokeStyle = '#c8874a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(30, 80, 140, 140, 8);
    ctx.stroke();

    // Mug handle
    ctx.strokeStyle = '#c8874a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(170, 100);
    ctx.bezierCurveTo(200, 100, 210, 120, 200, 135);
    ctx.bezierCurveTo(190, 150, 170, 148, 170, 148);
    ctx.stroke();

    // Saucer plate
    ctx.fillStyle = '#3d1f0a';
    ctx.beginPath();
    ctx.roundRect(20, 218, 160, 12, 6);
    ctx.fill();

    // Steam particles render
    steam.forEach((s, i) => {
      s.x += s.vx;
      s.y += s.vy;
      s.life -= 0.012;
      s.r += 0.05;
      if (s.life <= 0) {
        steam.splice(i, 1);
        return;
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 135, 74, ${s.life * 0.35})`;
      ctx.fill();
    });

    // Glass reflection highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.beginPath();
    ctx.ellipse(65, 110, 12, 30, -0.3, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(drawCoffee);
  }

  drawCoffee();

  // Coffee Quotes display cycle
  const quotes = [
    "every great commit started with a cup",
    "debugging is just coffee with extra steps",
    "the best architectures are designed between the 2nd and 3rd cup",
    "coffee: turning semicolons into systems since 1600",
    "sleep is temporary. the model is eternal."
  ];

  const qWrap = $('coffee-quotes');
  if (qWrap) {
    qWrap.innerHTML = ''; // Clear fallback contents
    quotes.forEach((q, i) => {
      const d = document.createElement('div');
      d.className = 'cq' + (i === 0 ? ' active' : '');
      d.textContent = `"${q}"`;
      qWrap.appendChild(d);
    });

    let qi = 0;
    setInterval(() => {
      const items = document.querySelectorAll('.cq');
      if (items.length === 0) return;
      items.forEach(e => e.classList.remove('active'));
      qi = (qi + 1) % quotes.length;
      if (items[qi]) items[qi].classList.add('active');
    }, 3000);
  }
}
