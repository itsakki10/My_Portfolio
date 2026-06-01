/**
 * Skills grid layout and fill bars scroll trigger animation
 */
function initSkills() {
  const skills = [
    { n: 'Python', icon: '🐍', lv: 98, c: '#22d3ee' },
    { n: 'PyTorch', icon: '🔥', lv: 94, c: '#ef4444' },
    { n: 'Transformers', icon: '🤖', lv: 92, c: '#a78bfa' },
    { n: 'LangChain', icon: '⛓', lv: 90, c: '#a78bfa' },
    { n: 'Computer Vision', icon: '👁', lv: 88, c: '#a3e635' },
    { n: 'FastAPI', icon: '⚡', lv: 87, c: '#fbbf24' },
    { n: 'Docker', icon: '🐳', lv: 85, c: '#22d3ee' },
    { n: 'CUDA', icon: '💻', lv: 82, c: '#22d3ee' },
    { n: 'MLflow', icon: '📊', lv: 80, c: '#f472b6' },
    { n: 'FAISS', icon: '🔍', lv: 88, c: '#a78bfa' },
    { n: 'TensorRT', icon: '🚀', lv: 78, c: '#fb923c' },
    { n: 'SQL', icon: '🗃', lv: 80, c: '#fbbf24' }
  ];

  const grid = $('skills-grid');
  if (!grid) return;

  grid.innerHTML = ''; // Clear fallback contents
  skills.forEach(s => {
    const d = document.createElement('div');
    d.className = 'skill-pill hoverable';
    d.style.setProperty('--pill-color', s.c);
    d.innerHTML = `
      <div class="sp-icon">${s.icon}</div>
      <div class="sp-name">${s.n}</div>
      <div class="sp-level">${s.lv}%</div>
      <div class="sp-bar">
        <div class="sp-fill" data-lv="${s.lv}" style="background:${s.c}"></div>
      </div>
    `;
    grid.appendChild(d);
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.sp-fill').forEach(f => {
          f.style.width = f.dataset.lv + '%';
        });
        obs.disconnect(); // Fire animation once
      }
    });
  }, { threshold: 0.3 });

  obs.observe(grid);
}
