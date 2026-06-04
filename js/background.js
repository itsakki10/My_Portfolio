/**
 * Background star/dot particle network canvas animation
 * Supports dynamic Sakura petal drifting in dark mode and ink droplets in Manga light mode.
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
    const count = Math.min(70, Math.round((W * H) / 22000));
    for (let i = 0; i < count; i++) {
      const isSakura = Math.random() > 0.3; // 70% Sakura Pink, 30% Cyber Cyan
      pts.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        speedY: 0.2 + Math.random() * 0.35, // Sakura descent speed
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.005 + Math.random() * 0.015,
        colorPrefix: isSakura ? 'rgba(255, 42, 133, ' : 'rgba(0, 240, 255, '
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

  function getColor(prefix, opacity) {
    const isLight = document.body.classList.contains('light-mode');
    if (isLight) {
      // Manga ink color: soft charcoal ink grey
      return `rgba(18, 18, 18, ${opacity * 0.35})`;
    }
    // Sakura pink / cyber cyan
    return prefix + opacity + ')';
  }

  function getShadowColor(prefix) {
    const isLight = document.body.classList.contains('light-mode');
    if (isLight) {
      return '#121212';
    }
    return prefix.includes('255, 42, 133') ? '#ff2a85' : '#00f0ff';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isLight = document.body.classList.contains('light-mode');

    // Update positions based on theme state
    pts.forEach(p => {
      if (!isLight) {
        // Falling Sakura blossom kinetics
        p.y += p.speedY;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.2;
        p.swayPhase += p.swaySpeed;

        if (p.y > H) {
          p.y = -10;
          p.x = Math.random() * W;
        }
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
      } else {
        // Standard random sketchbook charcoal drift
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
    });

    // Draw connection lines
    ctx.lineWidth = 0.75;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 220) {
          const a = (1 - d / 220) * 0.18;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = getColor(pts[i].colorPrefix, a);
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
          const a = (1 - d / 200) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = getColor(p.colorPrefix, a);
          ctx.stroke();
        }
      });
    }

    // Draw particles with glowing/flat shadows depending on theme
    pts.forEach(p => {
      ctx.save();
      if (!isLight) {
        ctx.shadowBlur = 6;
        ctx.shadowColor = getShadowColor(p.colorPrefix);
      }
      ctx.beginPath();
      // Draw as sakura blossom petal (small ellipses) in sakura mode
      if (!isLight) {
        ctx.ellipse(p.x, p.y, 3.5, 2.0, Math.PI / 4, 0, Math.PI * 2);
      } else {
        ctx.arc(p.x, p.y, 2.0, 0, Math.PI * 2);
      }
      ctx.fillStyle = getColor(p.colorPrefix, 0.45);
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  draw();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initBG();
} else {
  document.addEventListener('DOMContentLoaded', initBG);
}
