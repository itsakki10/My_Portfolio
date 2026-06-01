/**
 * Selected projects card renderer
 */
function initProjects() {
  const projs = [
    {
      num: '01',
      title: 'Synapse RAG',
      desc: 'Production RAG system indexing 10M+ documents with sub-200ms latency. Custom hybrid retriever: dense FAISS + sparse BM25 + cross-encoder re-ranking.',
      tags: [
        { t: 'Python', c: '' },
        { t: 'LangChain', c: '' },
        { t: 'FAISS', c: 'c' },
        { t: 'FastAPI', c: 'c' },
        { t: 'Redis', c: 'l' }
      ],
      stat: '10M+ docs · <200ms',
      live: 'Production',
      pc: '#22d3ee'
    },
    {
      num: '02',
      title: 'Neural Chess Engine',
      desc: 'AlphaZero-style deep RL engine trained via self-play MCTS. 2100+ ELO after 48h GPU training. Thinks like a grandmaster, plays like a machine.',
      tags: [
        { t: 'PyTorch', c: '' },
        { t: 'MCTS', c: '' },
        { t: 'CUDA', c: 'c' },
        { t: 'Self-Play RL', c: 'l' }
      ],
      stat: '2100+ ELO · 48h train',
      live: 'Open Source',
      pc: '#fbbf24'
    },
    {
      num: '03',
      title: 'VisionSense CV',
      desc: 'Real-time quality control pipeline. Custom YOLOv8 fine-tune on 47 defect classes. 120 FPS on edge hardware. Replaced 8 visual inspectors on the factory floor.',
      tags: [
        { t: 'YOLOv8', c: '' },
        { t: 'TensorRT', c: 'c' },
        { t: 'ONNX', c: 'l' },
        { t: 'Edge AI', c: 'c' }
      ],
      stat: '97.3% mAP · 120 FPS',
      live: 'Deployed',
      pc: '#a3e635'
    }
  ];

  const grid = $('proj-grid');
  if (!grid) return;

  grid.innerHTML = ''; // Clear fallback contents
  projs.forEach(p => {
    const d = document.createElement('div');
    d.className = 'proj-card hoverable';
    d.style.setProperty('--pc', p.pc);
    d.innerHTML = `
      <div class="pc-card-accent" style="background:linear-gradient(90deg, ${p.pc}, transparent)"></div>
      <div class="pc-header">
        <div class="pc-num">PROJECT ${p.num}</div>
        <div class="pc-title" style="color:${p.pc}">${p.title}</div>
      </div>
      <div class="pc-desc">${p.desc}</div>
      <div class="pc-tags">
        ${p.tags.map(t => `<span class="pc-tag ${t.c}">${t.t}</span>`).join('')}
      </div>
      <div class="pc-footer">
        <div class="pc-stat">${p.stat}</div>
        <div class="pc-live">
          <div class="live-dot" style="background:${p.pc}"></div>${p.live}
        </div>
      </div>
    `;
    grid.appendChild(d);
  });
}
