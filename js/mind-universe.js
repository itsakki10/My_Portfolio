/**
 * Mind Universe Logic.
 * Features:
 *  - Floating chaos physics (sine/cos wave trajectories).
 *  - High-performance Focus Mode grid coordinate snap interpolation.
 *  - Interconnected SVG network links rendering in Focus Mode.
 *  - Scroll-aware gamified Level timeline progress tracker.
 *  - Immersive Case Study detail popup modal templates.
 */

(function() {
  let space, svg;
  let nodes = [];
  let connections = [];
  let t = 0;

  // Projects Metadata
  const projectsData = [
    {
      num: '01',
      title: 'VisionVox',
      category: 'Computer Vision / Edge AI',
      desc: 'Real-time defect sorting pipeline processing 120 FPS on edge hardware.',
      problem: 'Factory assembly lines had a high defect escape rate due to fatigue in manual visual inspect processes, leading to assembly delays.',
      architecture: 'Camera streams raw frame → ONNX Runtime preprocessing → TensorRT FP16 quantization inference → 97.3% mAP defect classification overlays → GPIO Rejection Arm alert.',
      tags: ['YOLOv8', 'TensorRT', 'OpenCV', 'C++'],
      metrics: [
        { val: '120 FPS', lbl: 'Edge Throughput' },
        { val: '97.3%', lbl: 'Defect Precision (mAP)' }
      ],
      lessons: 'Quantizing weights to FP16 can degrade precision slightly if representative calibrations are not performed correctly. Added custom calibration datasets.',
      demo: 'https://example.com/visionvox',
      git: 'https://github.com/akashmehra/visionvox'
    },
    {
      num: '02',
      title: 'NeuralCanvas',
      category: 'Generative AI / Diffusion',
      desc: 'Generates high-resolution vector and textures from text prompts.',
      problem: 'Game designers spent days creating customized surface assets manually, creating bottlenecks in creative asset pipelines.',
      architecture: 'User Text Input → Stable Diffusion SDXL latent map generation → ControlNet structural lines constraint → Custom ESRGAN edge upscaling models.',
      tags: ['PyTorch', 'Stable Diffusion', 'Flask', 'CUDA'],
      metrics: [
        { val: '1.4s', lbl: 'Average Latency' },
        { val: '92%', lbl: 'UI Designer Approval' }
      ],
      lessons: 'SDXL latency is heavily bound by memory throughput. Moving models into shared GPU memory and using flash attention slashed response speed by half.',
      demo: 'https://example.com/neuralcanvas',
      git: 'https://github.com/akashmehra/neuralcanvas'
    },
    {
      num: '03',
      title: 'RepSense',
      category: 'AI Agents / RAG',
      desc: 'Autonomous customer agent resolving queries with deep semantic memory.',
      problem: 'Customer support teams faced excessive query queues, leading to high turnaround latency for standard technical issues.',
      architecture: 'Inbound Webhook → LangChain ReAct agent loop → BM25 sparse + FAISS dense hybrid retriever → Redis semantic caches → Streaming response generator.',
      tags: ['Python', 'LangChain', 'FAISS', 'Redis', 'FastAPI'],
      metrics: [
        { val: '85%', lbl: 'Auto-Resolution Rate' },
        { val: '<1.2s', lbl: 'Response Latency' }
      ],
      lessons: 'Agent loops easily descend into infinite execution loops if prompt bounds are fuzzy. Added strict state boundary validators.',
      demo: 'https://example.com/repsense',
      git: 'https://github.com/akashmehra/repsense'
    },
    {
      num: '04',
      title: 'SecureML Fabric',
      category: 'MLOps / Privacy',
      desc: 'Zero-Trust secure framework for encrypting and deploying model weights.',
      problem: 'Model weights are vulnerable to IP theft and side-channel leakage when hosted on third-party remote edge hardware.',
      architecture: 'Model files encrypted using AES-256-GCM → ONNX Runtime containerized framework → Decrypted directly inside secure enclave memory during execution.',
      tags: ['Docker', 'ONNX', 'Python', 'Cryptography'],
      features: [
        'AES-256-GCM Enclave Encryption',
        'Zero-Trust Model Verification Layer',
        'On-the-fly Model Chunk Streaming'
      ],
      lessons: 'Decrypting full models in memory creates spikes in execution RAM. Solved by streaming chunk decryption paths in real-time.',
      demo: 'https://example.com/secureml',
      git: 'https://github.com/akashmehra/secureml'
    },
    {
      num: '05',
      title: 'Task Manager Pro',
      category: 'Productivity / ML Scheduling',
      desc: 'Priority-driven calendar automation with smart heuristic scheduling.',
      problem: 'Daily scheduling overlaps and idle gaps cause severe productivity blockages for busy project builders.',
      architecture: 'Task database load → Heuristic prioritization scoring matrix → Auto scheduling allocator → Google Calendar integration API hooks.',
      tags: ['TypeScript', 'FastAPI', 'SQL', 'React'],
      metrics: [
        { val: '80%', lbl: 'Reduction in Idle Gaps' },
        { val: '1.5k+', lbl: 'Active Daily Users' }
      ],
      lessons: 'Syncing dates across time zones leads to scheduling shifts. Built a central UTC timestamp parser to coordinate scheduling dates.',
      demo: 'https://example.com/taskpro',
      git: 'https://github.com/akashmehra/taskpro'
    }
  ];

  // Skills Metadata
  const skillsData = [
    { name: 'Python', icon: '🐍' },
    { name: 'PyTorch', icon: '🔥' },
    { name: 'TensorFlow', icon: '🤖' },
    { name: 'Computer Vision', icon: '👁' },
    { name: 'Docker', icon: '🐳' },
    { name: 'OpenCV', icon: '📷' },
    { name: 'LLMs', icon: '🧠' },
    { name: 'FastAPI', icon: '⚡' },
    { name: 'SQL', icon: '🗃' },
    { name: 'LangChain', icon: '⛓' },
    { name: 'TensorRT', icon: '🚀' }
  ];

  // Floating Thoughts Metadata
  const thoughtsData = [
    "Build AI Coach", "Train CNN", "Deploy Faster", "Learn MLOps", 
    "Startup Idea", "Create AI Agent", "3am code sessions", "Optimum pathfinding"
  ];

  // Floating Decor Elements (Chess, Rubik, Sports hints)
  const decorNodesData = [
    { symbol: '♞', name: 'Knight', cat: 'chess' },
    { symbol: '♜', name: 'Rook', cat: 'chess' },
    { symbol: '♟', name: 'Pawn', cat: 'chess' },
    { symbol: '👑', name: 'Queen', cat: 'chess' },
    { symbol: '🧊', name: 'Rubik', cat: 'cube' },
    { symbol: '▰', name: 'Layer', cat: 'cube' },
    { symbol: '🏃', name: 'Sprint', cat: 'sports' },
    { symbol: '⚽', name: 'Soccer', cat: 'sports' },
    { symbol: '⏱', name: 'Timer', cat: 'sports' }
  ];

  // Establish connection mapping (index of skills connected to index of projects)
  // Python(0), PyTorch(1), TensorFlow(2), CV(3), Docker(4), OpenCV(5), LLMs(6), FastAPI(7), SQL(8), LangChain(9), TensorRT(10)
  // Projects: VisionVox(0), NeuralCanvas(1), RepSense(2), SecureML(3), TaskPro(4)
  const connectionLinks = [
    { from: 'skill-0', to: 'proj-0' }, // Python to VisionVox
    { from: 'skill-0', to: 'proj-2' }, // Python to RepSense
    { from: 'skill-1', to: 'proj-1' }, // PyTorch to NeuralCanvas
    { from: 'skill-3', to: 'proj-0' }, // CV to VisionVox
    { from: 'skill-4', to: 'proj-3' }, // Docker to SecureML
    { from: 'skill-5', to: 'proj-0' }, // OpenCV to VisionVox
    { from: 'skill-6', to: 'proj-2' }, // LLMs to RepSense
    { from: 'skill-7', to: 'proj-2' }, // FastAPI to RepSense
    { from: 'skill-7', to: 'proj-4' }, // FastAPI to TaskPro
    { from: 'skill-8', to: 'proj-4' }, // SQL to TaskPro
    { from: 'skill-9', to: 'proj-2' }, // LangChain to RepSense
    { from: 'skill-10', to: 'proj-0' } // TensorRT to VisionVox
  ];

  function recalculateCoordinates() {
    if (!space) return;
    const W = space.clientWidth || window.innerWidth;
    const H = space.clientHeight || window.innerHeight;

    nodes.forEach(node => {
      if (node.type === 'project') {
        // Chaos home coordinates
        node.homeX = node.rxRatio * (W - 270) + 10;
        node.homeY = node.ryRatio * (H - 180) + 40;

        // Focus target coordinates
        if (W > 900) {
          node.tx = 60;
          node.ty = 60 + node.idx * ((H - 150) / 4);
        } else {
          node.tx = (W - 250) / 2;
          node.ty = 20 + node.idx * 105;
        }
      } else if (node.type === 'skill') {
        // Chaos home coordinates
        node.homeX = node.rxRatio * (W - 140) + 10;
        node.homeY = node.ryRatio * (H - 80) + 40;

        // Focus target coordinates
        const radius = W > 900 ? Math.min(180, H * 0.35) : Math.min(110, W * 0.35);
        const centerX = W > 900 ? W * 0.68 : W / 2;
        const centerY = W > 900 ? H / 2 : H / 2 + 100;
        const angle = (node.idx / skillsData.length) * Math.PI * 2;
        node.tx = centerX + Math.cos(angle) * radius - 50; // shift half tag width
        node.ty = centerY + Math.sin(angle) * radius - 15; // shift half tag height
      } else if (node.type === 'thought') {
        // Chaos home coordinates
        node.homeX = node.rxRatio * (W - 180) + 40;
        node.homeY = node.ryRatio * (H - 80) + 40;

        // Focus target coordinates (hidden)
        node.tx = -500;
        node.ty = -500;
      } else if (node.type === 'decor') {
        // Chaos home coordinates (spread across screen)
        node.homeX = node.rxRatio * (W - 80) + 20;
        node.homeY = node.ryRatio * (H - 80) + 40;

        // Focus target coordinates (remain at home for background drift)
        node.tx = node.homeX;
        node.ty = node.homeY;
      }
    });
  }

  window.addEventListener('resize', () => {
    if (window.activeScreen === 'universe') {
      recalculateCoordinates();
    }
  });

  window.initMindUniverse = function() {
    space = $('interactive-space');
    svg = $('network-svg');
    if (!space || !svg) return;

    space.innerHTML = ''; // Reset container
    nodes = [];

    // 1. Create Projects Nodes
    projectsData.forEach((p, idx) => {
      const el = document.createElement('div');
      el.className = 'mind-node project hoverable';
      el.id = `proj-${idx}`;
      el.innerHTML = `
        <div class="np-num">PROJECT ${p.num}</div>
        <div class="np-title">${p.title}</div>
        <div class="np-desc">${p.desc}</div>
        <div class="np-click-tip">Expand Case Study →</div>
      `;
      el.onclick = () => openCaseStudy(p);
      space.appendChild(el);

      const rxRatio = 0.05 + (idx / projectsData.length) * 0.25 + Math.random() * 0.05;
      const ryRatio = 0.1 + (idx / projectsData.length) * 0.65 + Math.random() * 0.05;

      nodes.push({
        el: el,
        id: el.id,
        idx: idx,
        rxRatio: rxRatio,
        ryRatio: ryRatio,
        x: 0, y: 0,
        tx: 0, ty: 0,
        homeX: 0, homeY: 0,
        floatSpeed: 0.8 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        type: 'project'
      });
    });

    // 2. Create Skills Nodes
    skillsData.forEach((s, idx) => {
      const el = document.createElement('div');
      el.className = 'mind-node skill hoverable';
      el.id = `skill-${idx}`;
      el.innerHTML = `
        <span class="ns-icon">${s.icon}</span>
        <span class="ns-name">${s.name}</span>
      `;
      space.appendChild(el);

      const rxRatio = 0.5 + (idx / skillsData.length) * 0.35 + Math.random() * 0.05;
      const ryRatio = 0.15 + (idx / skillsData.length) * 0.65 + Math.random() * 0.05;

      nodes.push({
        el: el,
        id: el.id,
        idx: idx,
        rxRatio: rxRatio,
        ryRatio: ryRatio,
        x: 0, y: 0,
        tx: 0, ty: 0,
        homeX: 0, homeY: 0,
        floatSpeed: 0.6 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        type: 'skill'
      });
    });

    // 3. Create Floating thoughts
    thoughtsData.forEach((txt, idx) => {
      const el = document.createElement('div');
      el.className = 'mind-node thought';
      el.textContent = txt;
      space.appendChild(el);

      const rxRatio = 0.1 + Math.random() * 0.8;
      const ryRatio = 0.05 + Math.random() * 0.85;

      nodes.push({
        el: el,
        id: `thought-${idx}`,
        idx: idx,
        rxRatio: rxRatio,
        ryRatio: ryRatio,
        x: 0, y: 0,
        tx: 0, ty: 0,
        homeX: 0, homeY: 0,
        floatSpeed: 0.5 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        type: 'thought'
      });
    });

    // 4. Create Decor elements (Chess, Rubik, Sports hints)
    decorNodesData.forEach((d, idx) => {
      const el = document.createElement('div');
      el.className = 'mind-node decor hoverable';
      el.id = `decor-${idx}`;
      el.innerHTML = `<span class="nd-sym">${d.symbol}</span>`;
      el.title = `${d.name} (${d.cat})`;
      space.appendChild(el);

      const rxRatio = 0.1 + Math.random() * 0.8;
      const ryRatio = 0.05 + Math.random() * 0.85;

      nodes.push({
        el: el,
        id: el.id,
        idx: idx,
        rxRatio: rxRatio,
        ryRatio: ryRatio,
        x: 0, y: 0,
        tx: 0, ty: 0,
        homeX: 0, homeY: 0,
        floatSpeed: 0.4 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        type: 'decor'
      });
    });

    // Recalculate coordinates initially
    recalculateCoordinates();

    // Spawn nodes at home position initially
    nodes.forEach(node => {
      node.x = node.homeX;
      node.y = node.homeY;
    });

    // Render visual distinct cards dynamically in the static section
    renderStaticProjects();

    // Establish connections SVG structure
    buildNetworkLines();

    // Start coordinate update loops (prevent multiple loops)
    if (!window.mindUniverseLoopActive) {
      window.mindUniverseLoopActive = true;
      update();
    }
  };

  // Render static projects with customized layout highlights (not all have metrics)
  function renderStaticProjects() {
    const grid = $('projects-grid');
    if (!grid) return;
    grid.innerHTML = '';

    projectsData.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = `static-card project-card-${idx} hoverable`;
      card.onclick = () => window.openCaseStudyByIndex(idx);

      // Define different colors and layouts based on index/category
      let badge = '';
      let highlightBox = '';

      if (p.num === '01') {
        // CV - highlights Edge FPS
        badge = `<span class="sc-badge cv-badge">EDGE INF</span>`;
        highlightBox = `
          <div class="sc-inline-metric">
            <span class="sc-im-val">120 FPS</span>
            <span class="sc-im-lbl">throughput latency</span>
          </div>`;
      } else if (p.num === '02') {
        // Diffusion - highlights SDXL
        badge = `<span class="sc-badge genai-badge">DIFFUSION</span>`;
        highlightBox = `
          <div class="sc-inline-metric">
            <span class="sc-im-val">SDXL</span>
            <span class="sc-im-lbl">quantized latency</span>
          </div>`;
      } else if (p.num === '03') {
        // AI Agents - highlights retrieval flowchart
        badge = `<span class="sc-badge agent-badge">LLM AGENT</span>`;
        highlightBox = `
          <div class="sc-flow-path">
            <span>BM25</span> → <span>FAISS</span> → <span>LLM</span>
          </div>`;
      } else if (p.num === '04') {
        // SecureML - no metrics, shows security checklist
        badge = `<span class="sc-badge secure-badge">SECURE SYSTEMS</span>`;
        highlightBox = `
          <div class="sc-feature-list-mini">
            <div>🛡 AES-256 Enclave RAM</div>
            <div>🔐 Zero-Trust Verification</div>
          </div>`;
      } else if (p.num === '05') {
        // Scheduler - user metrics
        badge = `<span class="sc-badge productivity-badge">SCHEDULER</span>`;
        highlightBox = `
          <div class="sc-inline-metric">
            <span class="sc-im-val">1.5k+</span>
            <span class="sc-im-lbl">active daily users</span>
          </div>`;
      }

      card.innerHTML = `
        <div class="sc-header-row">
          <span class="sc-meta">${p.category}</span>
          ${badge}
        </div>
        <h3 class="sc-title">${p.title}</h3>
        <p class="sc-desc">${p.desc}</p>
        
        ${highlightBox}
        
        <div class="sc-tags">
          ${p.tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
        <div class="sc-arrow">View Case Study →</div>
      `;
      grid.appendChild(card);
    });
  }

  // Build SVG lines for node linkages
  function buildNetworkLines() {
    svg.innerHTML = '';
    connections = [];

    connectionLinks.forEach(link => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.className = 'net-line';
      line.setAttribute('stroke', 'rgba(34, 211, 238, 0.15)');
      line.setAttribute('stroke-width', '1.5');
      svg.appendChild(line);

      connections.push({
        el: line,
        fromId: link.from,
        toId: link.to
      });
    });
  }

  // Snap transition layout updates
  window.applyFocusTransition = function(isFocus) {
    if (isFocus) {
      svg.classList.add('visible');
    } else {
      svg.classList.remove('visible');
    }
  };

  // Main drawing / position update loop
  function update() {
    t += 16; // mock 60fps tick milliseconds

    const speedFactor = window.caffeineOverdrive ? 3.5 : 1.0;

    nodes.forEach(node => {
      if (window.focusModeActive) {
        // Linear Interpolate (lerp) nodes to structured targets
        if (node.type === 'decor') {
          // Decors float slightly around their home even in focus mode!
          const floatX = Math.sin(t * 0.0005 * node.floatSpeed + node.phase) * 20;
          const floatY = Math.cos(t * 0.0005 * node.floatSpeed * 0.8 + node.phase * 0.5) * 20;
          node.x += ((node.homeX + floatX) - node.x) * 0.08;
          node.y += ((node.homeY + floatY) - node.y) * 0.08;
        } else {
          node.x += (node.tx - node.x) * 0.12;
          node.y += (node.ty - node.y) * 0.12;
        }
      } else {
        // Floating wave math
        const floatX = Math.sin(t * 0.001 * node.floatSpeed * speedFactor + node.phase) * 50;
        const floatY = Math.cos(t * 0.001 * node.floatSpeed * 0.8 * speedFactor + node.phase * 0.5) * 50;
        
        node.x += ((node.homeX + floatX) - node.x) * 0.06;
        node.y += ((node.homeY + floatY) - node.y) * 0.06;
      }

      // Assign styles
      node.el.style.left = node.x + 'px';
      node.el.style.top = node.y + 'px';
    });

    // Update SVG connection lines coordinates in focus mode
    if (window.focusModeActive) {
      connections.forEach(conn => {
        const fromNode = nodes.find(n => n.id === conn.fromId);
        const toNode = nodes.find(n => n.id === conn.toId);
        
        if (fromNode && toNode) {
          // Calculate center offsets for line start/ends
          const fromW = fromNode.el.offsetWidth || 100;
          const fromH = fromNode.el.offsetHeight || 30;
          const toW = toNode.el.offsetWidth || 250;
          const toH = toNode.el.offsetHeight || 100;

          conn.el.setAttribute('x1', fromNode.x + fromW / 2);
          conn.el.setAttribute('y1', fromNode.y + fromH / 2);
          conn.el.setAttribute('x2', toNode.x + toW / 2);
          conn.el.setAttribute('y2', toNode.y + toH / 2);
        }
      });
    }

    requestAnimationFrame(update);
  }

  // --- STATIC PORTFOLIO LINKING BINDER ---
  window.openCaseStudyByIndex = function(idx) {
    if (projectsData[idx]) {
      window.openCaseStudy(projectsData[idx]);
    }
  };

  // --- CASE STUDY POPUP MODALS ---
  window.openCaseStudy = function(proj) {
    const modal = $('case-study-modal');
    if (!modal) return;

    $('modal-title').textContent = proj.title;
    $('modal-category').textContent = proj.category;
    $('modal-problem').textContent = proj.problem;
    $('modal-architecture').textContent = proj.architecture;
    $('modal-lessons').textContent = proj.lessons;

    // Populate technology tag list
    const tagWrap = $('modal-tags');
    tagWrap.innerHTML = '';
    proj.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'mb-tag';
      span.textContent = tag;
      tagWrap.appendChild(span);
    });

    // Populate stats metrics grid adaptively
    const metricWrap = $('modal-metrics');
    metricWrap.innerHTML = '';
    const metricsTitle = metricWrap.previousElementSibling; // Key Metrics title
    
    if (proj.metrics && proj.metrics.length > 0) {
      if (metricsTitle) metricsTitle.style.display = 'block';
      metricWrap.style.display = 'grid';
      proj.metrics.forEach(m => {
        const card = document.createElement('div');
        card.className = 'mb-metric-card';
        card.innerHTML = `
          <div class="mb-metric-val">${m.val}</div>
          <div class="mb-metric-lbl">${m.lbl}</div>
        `;
        metricWrap.appendChild(card);
      });
    } else {
      if (metricsTitle) metricsTitle.style.display = 'none';
      metricWrap.style.display = 'none';
    }

    // Populate features list if it exists
    const featWrap = $('modal-features-wrap');
    if (featWrap) {
      featWrap.innerHTML = '';
      if (proj.features && proj.features.length > 0) {
        featWrap.style.display = 'block';
        const h3 = document.createElement('h3');
        h3.textContent = 'Core Features';
        h3.style.marginTop = '1.5rem';
        featWrap.appendChild(h3);
        const ul = document.createElement('ul');
        ul.className = 'modal-feature-list';
        ul.style.listStyleType = 'none';
        ul.style.paddingLeft = '0';
        proj.features.forEach(f => {
          const li = document.createElement('li');
          li.textContent = `✓ ${f}`;
          li.style.color = 'var(--text2)';
          li.style.fontSize = '14px';
          li.style.marginBottom = '6px';
          li.style.fontFamily = 'inherit';
          ul.appendChild(li);
        });
        featWrap.appendChild(ul);
      } else {
        featWrap.style.display = 'none';
      }
    }

    // Setup action urls
    $('modal-live-link').href = proj.demo;
    $('modal-git-link').href = proj.git;

    modal.classList.add('open');
    window.unlockAchievement('case_study', '📝 Memory Node Investigated!');
  };

  window.closeCaseStudy = function() {
    const modal = $('case-study-modal');
    if (modal) modal.classList.remove('open');
  };

})();
