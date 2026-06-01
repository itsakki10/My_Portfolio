/**
 * Inner world mind network graph canvas simulation
 */
function initMind() {
  const canvas = $('mind-canvas');
  const tip = $('mind-tip');
  if (!canvas || !tip) return;

  const ctx = canvas.getContext('2d');
  let W, H, hov = null, t = 0;

  const nodes = [
    { id: 0, label: 'Akash', desc: 'The center of it all — curious, building, always learning', x: 0.5, y: 0.5, r: 30, c: '#a78bfa', core: true, links: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { id: 1, label: 'Deep Learning', desc: 'CNNs, RNNs, Transformers — the backbone of everything', x: 0.22, y: 0.18, r: 20, c: '#22d3ee', links: [0, 2, 3, 7] },
    { id: 2, label: 'LLMs & RAG', desc: '10M+ docs, sub-200ms queries, production-grade retrieval', x: 0.72, y: 0.15, r: 19, c: '#22d3ee', links: [0, 1, 3, 8] },
    { id: 3, label: 'Computer Vision', desc: 'YOLOv8, 97.3% mAP, 120 FPS on edge hardware', x: 0.88, y: 0.48, r: 17, c: '#a3e635', links: [0, 1, 2] },
    { id: 4, label: 'Chess', desc: '1800+ ELO. The ultimate test of long-term strategic thinking', x: 0.75, y: 0.82, r: 17, c: '#fbbf24', links: [0, 5, 9] },
    { id: 5, label: 'Rubik\'s Cube', desc: '23s PB. Pattern recognition meets optimal pathfinding', x: 0.38, y: 0.85, r: 16, c: '#f472b6', links: [0, 4, 6] },
    { id: 6, label: 'Coffee ☕', desc: '47 cups/month. Each one a boundary between wonder and action', x: 0.12, y: 0.65, r: 16, c: '#fb923c', links: [0, 5, 7] },
    { id: 7, label: 'Builder', desc: 'Ideas without execution are just dreams. I close the loop.', x: 0.13, y: 0.35, r: 18, c: '#a78bfa', links: [0, 1, 6, 8] },
    { id: 8, label: 'MLOps', desc: 'FastAPI, Docker, MLflow, ONNX — models live in production', x: 0.6, y: 0.88, r: 14, c: '#a3e635', links: [0, 2, 3, 9] },
    { id: 9, label: 'RL & Games', desc: 'AlphaZero-style self-play. Teaching machines to beat humans.', x: 0.85, y: 0.72, r: 15, c: '#fbbf24', links: [0, 4, 8] },
    { id: 10, label: 'Sports', desc: 'Discipline, consistency, showing up every day — on the field and in code', x: 0.28, y: 0.68, r: 14, c: '#f87171', links: [0, 5, 6] }
  ];

  function resize() {
    W = canvas.width = canvas.parentElement.clientWidth || 900;
    H = canvas.height = 520;
  }

  resize();
  window.addEventListener('resize', resize);

  function ap(n) {
    return { x: n.x * W, y: n.y * H };
  }

  function draw() {
    t += 0.008;
    ctx.clearRect(0, 0, W, H);

    // Draw connection lines
    nodes.forEach(n => {
      n.links.forEach(li => {
        if (li <= n.id) return;
        const nb = nodes[li];
        const a = ap(n);
        const b = ap(nb);
        const ih = hov === n || hov === nb;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = ih ? 'rgba(167, 139, 250, 0.5)' : 'rgba(167, 139, 250, 0.07)';
        ctx.lineWidth = ih ? 1.5 : 0.5;
        ctx.stroke();
      });
    });

    // Draw nodes
    nodes.forEach((n, i) => {
      const { x, y } = ap(n);
      const ih = hov === n;
      const pulse = 1 + Math.sin(t * 1.5 + i * 0.8) * 0.07;
      const r = n.r * (ih ? 1.4 : 1) * pulse;

      // Glow effect background
      ctx.beginPath();
      ctx.arc(x, y, r + 10, 0, Math.PI * 2);
      ctx.fillStyle = n.c + '10';
      ctx.fill();

      // Node inner body
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = n.c + (ih ? '44' : '1a');
      ctx.fill();

      // Node border
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = n.c + (ih ? 'ff' : '66');
      ctx.lineWidth = ih ? 2.5 : 1;
      ctx.stroke();

      // Interactive ring arc for hovered items
      if (ih) {
        const a2 = (n.links.length / 10) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(x, y, r + 14, -Math.PI / 2, -Math.PI / 2 + a2);
        ctx.strokeStyle = n.c + '80';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Text Label
      ctx.fillStyle = ih ? '#fff' : '#c8c8e8';
      ctx.font = `${n.core ? '700' : '500'} ${n.core ? 14 : 12}px 'Space Grotesk', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, x, y);
    });

    requestAnimationFrame(draw);
  }

  draw();

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    hov = null;

    nodes.forEach(n => {
      const { x, y } = ap(n);
      if (Math.hypot(mx - x, my - y) < n.r + 14) {
        hov = n;
      }
    });

    canvas.style.cursor = hov ? 'pointer' : 'crosshair';

    if (hov) {
      tip.style.opacity = '1';
      // Offset tooltip from cursor to avoid covering it
      tip.style.left = (e.clientX - rect.left + 20) + 'px';
      tip.style.top = (e.clientY - rect.top - 20) + 'px';
      tip.innerHTML = `<strong>${hov.label}</strong>${hov.desc}`;
    } else {
      tip.style.opacity = '0';
    }
  });

  canvas.addEventListener('mouseleave', () => {
    hov = null;
    tip.style.opacity = '0';
  });
}
