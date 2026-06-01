/**
 * Background star/dot particle network canvas animation
 */
function initBG() {
  const c = document.getElementById('bg-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, pts = [];

  let mouse = { x: -1000, y: -1000, active: false };

  function rs() {
    W = c.width = window.innerWidth;
    H = c.height = window.innerHeight;
    pts = [];
    // Responsive count: density adjusts on screen size (max 80 nodes)
    const count = Math.min(80, Math.round((W * H) / 20000));
    for (let i = 0; i < count; i++) {
      const isAmber = Math.random() > 0.5;
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18, // Slow drifting velocities
        vy: (Math.random() - 0.5) * 0.18,
        colorPrefix: isAmber ? 'rgba(251, 191, 36, ' : 'rgba(34, 211, 238, '
      });
    }
  }

  rs();
  window.addEventListener('resize', rs);

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions and bounce off boundaries
    pts.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    // Draw connection lines
    ctx.lineWidth = 0.75;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 220) {
          const a = (1 - d / 220) * 0.18; // More visible connections
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = pts[i].colorPrefix + a + ')';
          ctx.stroke();
        }
      }
    }

    // Connect particles to mouse cursor
    if (mouse.active) {
      ctx.lineWidth = 0.95;
      pts.forEach(p => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 200) {
          const a = (1 - d / 200) * 0.25; // Brighter cursor attraction links
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = p.colorPrefix + a + ')';
          ctx.stroke();
        }
      });
    }

    // Draw particles with glowing shadows
    pts.forEach(p => {
      ctx.save();
      ctx.shadowBlur = 6;
      ctx.shadowColor = p.colorPrefix === 'rgba(251, 191, 36, ' ? '#fbbf24' : '#22d3ee';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = p.colorPrefix + '0.45)';
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// Auto-run when DOM is parsed
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initBG();
} else {
  document.addEventListener('DOMContentLoaded', initBG);
}
