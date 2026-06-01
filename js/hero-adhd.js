/**
 * Hero typing animation, floating background ideas, mouse sparks, and ADHD marquee rows
 */
function initHero() {
  // Console Typing Animation
  const phrases = [
    '> model.fit(ideas, execution)',
    '> while alive: { learn(); build(); ship(); }',
    '> accuracy = (ambition + discipline) / chaos',
    '> import creativity; deploy results',
    '> loss.backward(); optimizer.step()'
  ];
  let pi = 0, ci = 0;
  const el = $('h-code');
  
  function type() {
    if (!el) return;
    const ph = phrases[pi];
    if (ci < ph.length) {
      el.textContent = ph.substring(0, ++ci);
      setTimeout(type, 40 + Math.random() * 30);
    } else {
      setTimeout(() => {
        ci = 0;
        pi = (pi + 1) % phrases.length;
        type();
      }, 2200);
    }
  }
  type();

  // Floating Mind Elements/Chaos Text
  const chaos = $('h-chaos');
  if (chaos) {
    const items = [
      'transformer.attention()', '∂L/∂w', 'loss.backward()', 'rubik.solve(23s)',
      '♟ Nf3', '☕ +1', 'accuracy:97.3%', 'GPT-4 vibes', 'CUDA cores',
      'embeddings', 'RL agent', 'git push', 'if(curious)learn()', '3am ideas',
      'O(log n)', 'deploy!', 'fine_tune()', 'RAG pipeline', 'chess elo:1800',
      'model weights', 'batch_norm', 'dropout(.5)', 'self_play()', 'pattern match'
    ];
    items.forEach((txt, i) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'h-idea';
      itemEl.textContent = txt;
      itemEl.style.cssText = `left:${5 + Math.random() * 88}%;top:${5 + Math.random() * 88}%;font-size:${10 + Math.random() * 4}px;color:hsl(${260 + Math.random() * 80},60%,${40 + Math.random() * 25}%);transform:rotate(${(Math.random() - 0.5) * 30}deg)`;
      chaos.appendChild(itemEl);
      
      // Delayed fade-in
      setTimeout(() => {
        itemEl.style.opacity = (0.15 + Math.random() * 0.5).toFixed(2);
      }, 600 + i * 100);
      
      // Floating repositioning interval
      setInterval(() => {
        itemEl.style.left = (5 + Math.random() * 88) + '%';
        itemEl.style.top = (5 + Math.random() * 88) + '%';
        itemEl.style.opacity = (0.1 + Math.random() * 0.4).toFixed(2);
        itemEl.style.transition = 'left 4s ease, top 4s ease, opacity 2s';
      }, 4000 + Math.random() * 4000);
    });
  }

  // Interactive mouse canvas sparks
  const hc = $('hero-canvas');
  if (hc) {
    const ctx = hc.getContext('2d');
    function rsHc() {
      hc.width = window.innerWidth;
      hc.height = window.innerHeight;
    }
    rsHc();
    window.addEventListener('resize', rsHc);
    
    const sparks = [];
    document.addEventListener('mousemove', e => {
      if (Math.random() > 0.6) {
        sparks.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3 - 1,
          life: 1,
          hue: 260 + Math.random() * 100
        });
      }
    });

    function drawSparks() {
      ctx.clearRect(0, 0, hc.width, hc.height);
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05; // gravity influence
        s.life -= 0.025;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2 * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 70%, ${s.life})`;
        ctx.fill();
      }
      requestAnimationFrame(drawSparks);
    }
    drawSparks();
  }
}

function initADHD() {
  const row1 = ['transformer', '∂loss/∂w', 'chess strategy', 'RAG systems', 'rubik 23s', 'espresso', 'CUDA', 'reinforcement learning', 'self-play RL', 'pattern recognition', 'LLMs', 'computer vision', 'builder mindset', 'caffeine', 'gradient descent', 'fine-tuning'];
  const row2 = ['pytorch', 'attention is all you need', '3am commits', 'YOLOv8', 'FAISS index', 'elo 1800', 'F2L method', 'langchain', 'MLflow', 'infinite curiosity', 'obsessive builder', 'AlphaZero', 'byte by byte', 'ship it', 'think deep', 'stay curious'];
  
  const cls1 = ['hi-v', 'hi-c', 'hi-l', 'hi-a', 'hi-p', '', '', 'hi-v'];
  const cls2 = ['hi-c', '', 'hi-l', '', 'hi-a', 'hi-v', 'hi-p', ''];
  
  const t1 = $('adhd-t1');
  const t2 = $('adhd-t2');
  
  if (!t1 || !t2) return;

  const make = (arr, clsArr) => arr.concat(arr).map((t, i) => {
    const d = document.createElement('div');
    d.className = 'adhd-item ' + (clsArr[i % clsArr.length] || '');
    d.textContent = t;
    return d;
  });

  make(row1, cls1).forEach(el => t1.appendChild(el));
  make(row2, cls2).forEach(el => t2.appendChild(el));
}
