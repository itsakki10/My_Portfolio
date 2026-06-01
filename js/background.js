/**
 * Background star/dot particle network canvas animation
 */
function initBG() {
  const c = $('bg-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, pts = [];

  function rs() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    pts = [];
    const count = Math.min(60, (W * H) / 18000);
    for (let i = 0; i < count; i++) {
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        hue: 260 + Math.random() * 80
      });
    }
  }

  rs();
  window.addEventListener('resize', rs);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions and handle boundary collisions
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // Draw connection lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) {
          const a = (1 - d / 200) * 0.3;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `hsla(${(pts[i].hue + pts[j].hue) / 2}, 70%, 65%, ${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, 0.6)`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
}
