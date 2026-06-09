/**
 * Mind Universe Logic.
 * Features:
 *  - Floating chaos physics (sine/cos wave trajectories).
 *  - High-performance Focus Mode grid coordinate snap interpolation.
 *  - Interconnected SVG network links rendering in Focus Mode.
 *  - Scroll-aware gamified Level timeline progress tracker.
 *  - Immersive Case Study detail popup modal templates.
 */

(function () {
  let space, svg;
  let nodes = [];
  let connections = [];
  let t = 0;

  // Projects Metadata
  const projectsData = [
    {
      num: "01",
      title: "Auth Vision Vox",
      category:
        "Smart Attendance • Face Recognition • Voice Recognition • Real-time AI",
      desc: "Production-ready smart attendance system leveraging Face Recognition, Voice Biometrics, and AI-driven verification to automate classroom attendance.",
      problem:
        "Educational institutions struggle with manual attendance tracking, proxy attendance, and inefficient record management.",
      architecture:
        "Face Enrollment → Voice Enrollment → Recognition Pipelines → Attendance Engine → Supabase Backend → Analytics Dashboard",
      tags: [
        "Python",
        "Computer Vision",
        "AI/ML",
        "OpenCV",
        "Face Recognition",
        "Voice Recognition",
        "Supabase",
        "Streamlit",
      ],
      metrics: [
        { val: "2", lbl: "Biometric Modalities" },
        { val: "Role-Based", lbl: "Access Control" },
        { val: "Real-Time", lbl: "Attendance Analysis" },
      ],
      lessons:
        "Gained hands-on experience in biometric authentication, computer vision pipelines, embedding-based recognition systems, database integration, and production deployment.",
      demo: "https://vision-vox-landing-page.vercel.app/",
      git: "https://github.com/itsakki10/Auth_Vision_Vox",
    },
    {
      num: "02",
      title: "NeuralCanvas",
      category: "Generative AI • Neural Style Transfer • Computer Vision",
      desc: "A Dockerized AI-powered artistic style transfer platform that leverages Adaptive Instance Normalization (AdaIN) and PyTorch to transform images into unique AI-generated artwork.",
      problem:
        "Traditional digital art creation requires significant artistic expertise and time. Users need an intuitive way to generate professional artistic transformations from ordinary images.",
      architecture:
        "Image Upload → Preprocessing Pipeline → VGG Encoder → AdaIN Feature Alignment → Decoder Network → Artwork Generation → Web Interface",
      challenge:
        "Implementing real-time neural style transfer while maintaining visual quality, optimizing inference performance, and deploying deep learning models in a production-ready environment.",
      tags: [
        "PyTorch",
        "Generative AI",
        "Computer Vision",
        "AdaIN",
        "Flask",
        "Docker",
        "Deep Learning",
        "Gunicorn",
      ],
      metrics: [
        { val: "AdaIN", lbl: "Style Transfer Engine" },
        { val: "Real-Time", lbl: "Artwork Generation" },
        { val: "Dockerized", lbl: "Production Deployment" },
      ],
      lessons:
        "Developed expertise in Generative AI, neural style transfer architectures, feature-space manipulation, model deployment, containerization, and full-stack AI application development.",
      added:
        "Style intensity control, custom image uploads, live previews, downloadable artwork generation, responsive UI, Docker support, and cloud deployment.",
      demo: "https://neuralcanvas-cpk1.onrender.com",
      git: "https://github.com/itsakki10/NeuralCanvas",
    },
    {
      num: "03",
      title: "RepSense AI",
      category: "Computer Vision • AI Fitness Coach • Pose Estimation",
      desc: "An AI-powered fitness coaching platform that delivers real-time exercise tracking, rep counting, posture analysis, form correction, voice coaching, and workout analytics using computer vision and pose estimation.",
      problem:
        "Gym-goers often struggle with incorrect exercise form, inaccurate self-assessment, lack of real-time feedback, and inconsistent workout tracking without access to personal trainers.",
      architecture:
        "Webcam/Video Input → MediaPipe Pose Estimation → Exercise Detection Engine → Rep Counting Logic → Form Analysis Pipeline → AI Coaching System → Workout Analytics Dashboard",
      challenge:
        "Developing accurate exercise recognition across multiple movements, implementing robust rep-counting algorithms, analyzing biomechanics in real time, and generating actionable AI-driven coaching feedback.",
      tags: [
        "Computer Vision",
        "MediaPipe",
        "OpenCV",
        "AI/ML",
        "Pose Estimation",
        "Streamlit",
        "SQLite",
        "Groq API",
      ],
      metrics: [
        { val: "5+", lbl: "Supported Exercises" },
        { val: "Real-Time", lbl: "Movement Analysis" },
        { val: "AI Coach", lbl: "Voice Feedback" },
      ],
      lessons:
        "Built expertise in pose estimation, human movement analysis, biomechanical tracking, real-time computer vision pipelines, AI coaching systems, and end-to-end application deployment.",
      added:
        "Live exercise tracking, intelligent rep counting, posture correction, voice coaching, uploaded video analysis, workout history management, and AI-generated performance reports.",
      demo: "https://repsenseai-gym-coach.netlify.app/",
      git: "https://github.com/itsakki10/RepSence_AI",
    },
    {
      num: "04",
      title: "CVortex",
      category: "NLP • ATS Intelligence • Resume Optimization",
      desc: "An AI-powered resume intelligence platform that leverages NLP, semantic similarity analysis, and keyword intelligence to optimize resumes for Applicant Tracking Systems (ATS) and improve job application success rates.",
      problem:
        "Many qualified candidates are rejected by ATS systems due to poor keyword alignment, weak semantic relevance, and lack of resume optimization insights.",
      architecture:
        "Resume Upload → Document Parsing → NLP Pipeline → Semantic Analysis Engine → ATS Scoring Model → Recommendation Generator → Interactive Dashboard",
      challenge:
        "Building an explainable ATS scoring system, extracting meaningful resume insights, implementing semantic similarity analysis, and delivering actionable optimization recommendations in real time.",
      tags: [
        "NLP",
        "LLMs",
        "Sentence Transformers",
        "spaCy",
        "FastAPI",
        "Streamlit",
        "Supabase",
        "Scikit-learn",
      ],
      metrics: [
        { val: "ATS AI", lbl: "Resume Scoring" },
        { val: "Semantic", lbl: "NLP Analysis" },
        { val: "Full-Stack", lbl: "Production System" },
      ],
      lessons:
        "Gained hands-on experience in Natural Language Processing, semantic search, transformer models, document intelligence, API development, authentication systems, and full-stack AI deployment.",
      added:
        "ATS scoring, semantic analysis, keyword intelligence, resume recommendations, authentication, analysis history tracking, and AI-powered optimization workflows.",
      demo: "https://appapppy-d7w9wzicgundg3bysngw8s.streamlit.app/",
      git: "https://github.com/itsakki10/CVortex",
    },

    {
      num: "05",
      title: "SecureML Fabric",
      category:
        "Cybersecurity AI • Network Threat Detection • Autonomous Response",
      desc: "An AI-powered cybersecurity platform that monitors live network traffic, detects anomalies using Machine Learning, and autonomously responds to threats through intelligent IP blocking, dynamic WAF rule generation, and real-time SOC visualization.",
      problem:
        "Traditional security monitoring relies heavily on manual analysis and delayed incident response, making it difficult to identify and mitigate evolving network threats in real time.",
      architecture:
        "Network Traffic → Packet Capture Engine → Feature Extraction Pipeline → ML Anomaly Detection → Threat Intelligence Engine → Autonomous Response System → WAF Rule Generation → SOC Dashboard",
      challenge:
        "Building a real-time threat detection pipeline capable of processing live network telemetry, generating explainable risk scores, and triggering autonomous defensive actions without disrupting legitimate traffic.",
      tags: [
        "Cybersecurity",
        "Machine Learning",
        "Network Security",
        "SOC",
        "Scikit-Learn",
        "Python",
        "Streamlit",
        "Threat Intelligence",
      ],
      metrics: [
        { val: "Real-Time", lbl: "Threat Detection" },
        { val: "Autonomous", lbl: "Response Engine" },
        { val: "Live SOC", lbl: "Security Monitoring" },
      ],
      lessons:
        "Developed expertise in network traffic analysis, anomaly detection, feature engineering, threat intelligence generation, security automation, packet inspection, and ML-powered cyber defense systems.",
      added:
        "Live packet monitoring, anomaly detection, autonomous IP blocking, dynamic WAF intelligence, threat confidence scoring, investigation workflows, and real-time SOC analytics.",
      demo: "",
      git: "https://github.com/itsakki10/SecureML-Fabric",
    },
  ];

  // Skills Metadata
  const skillsData = [
    { name: "Python", icon: "🐍" },
    { name: "PyTorch", icon: "🔥" },
    { name: "Machine Learning", icon: "🤖" },
    { name: "Computer Vision", icon: "👁" },
    { name: "Docker", icon: "🐳" },
    { name: "OpenCV", icon: "📷" },
    { name: "LLMs", icon: "🧠" },
    { name: "FastAPI", icon: "⚡" },
    { name: "SQL", icon: "🗃" },
    { name: "LangChain", icon: "⛓" },
    { name: "Data Engineering", icon: "⚙️" },
    { name: "Cybersecurity AI", icon: "🔐" },
  ];

  // Floating Thoughts Metadata
  const thoughtsData = [
    "Build AI Coach",
    "Train CNN",
    "Deploy Faster",
    "Learn MLOps",
    "Startup Idea",
    "Create AI Agent",
    "3am code sessions",
    "Optimum pathfinding",
  ];

  // Floating Decor Elements (Chess, Rubik, Sports hints)
  const decorNodesData = [
    { symbol: "♞", name: "Knight", cat: "chess" },
    { symbol: "♜", name: "Rook", cat: "chess" },
    { symbol: "♟", name: "Pawn", cat: "chess" },
    { symbol: "👑", name: "Queen", cat: "chess" },
    { symbol: "🧊", name: "Rubik", cat: "cube" },
    { symbol: "▰", name: "Layer", cat: "cube" },
    { symbol: "🏃", name: "Sprint", cat: "sports" },
    { symbol: "⚽", name: "Soccer", cat: "sports" },
    { symbol: "⏱", name: "Timer", cat: "sports" },
    { symbol: "ゴゴゴ", name: "anime", cat: "japan" },
  ];

  // Establish connection mapping (index of skills connected to index of projects)
  // Python(0), PyTorch(1), TensorFlow(2), CV(3), Docker(4), OpenCV(5), LLMs(6), FastAPI(7), SQL(8), LangChain(9), TensorRT(10)
  // Projects: VisionVox(0), NeuralCanvas(1), RepSense(2), SecureML(3), TaskPro(4)
  const connectionLinks = [
    // Auth Vision Vox (proj-0)
    { from: "skill-0", to: "proj-0" }, // Python
    { from: "skill-3", to: "proj-0" }, // Computer Vision
    { from: "skill-5", to: "proj-0" }, // OpenCV
    { from: "skill-8", to: "proj-0" }, // SQL (Supabase)

    // NeuralCanvas (proj-1)
    { from: "skill-0", to: "proj-1" }, // Python
    { from: "skill-1", to: "proj-1" }, // PyTorch
    { from: "skill-3", to: "proj-1" }, // Computer Vision
    { from: "skill-4", to: "proj-1" }, // Docker

    // RepSense AI (proj-2)
    { from: "skill-0", to: "proj-2" }, // Python
    { from: "skill-3", to: "proj-2" }, // Computer Vision
    { from: "skill-5", to: "proj-2" }, // OpenCV
    { from: "skill-6", to: "proj-2" }, // LLMs
    { from: "skill-9", to: "proj-2" }, // LangChain

    // CVortex (proj-3)
    { from: "skill-0", to: "proj-3" }, // Python
    { from: "skill-6", to: "proj-3" }, // LLMs
    { from: "skill-7", to: "proj-3" }, // FastAPI
    { from: "skill-8", to: "proj-3" }, // SQL
    { from: "skill-9", to: "proj-3" }, // LangChain

    // SecureML Fabric (proj-4)
    { from: "skill-0", to: "proj-4" }, // Python
    { from: "skill-2", to: "proj-4" }, // Machine Learning
    { from: "skill-8", to: "proj-4" }, // SQL
    { from: "skill-10", to: "proj-4" }, // Data Engineering
    { from: "skill-11", to: "proj-4" }, // Cybersecurity AI
  ];

  function recalculateCoordinates() {
    if (!space) return;
    const W = space.clientWidth || window.innerWidth;
    const H = space.clientHeight || window.innerHeight;

    nodes.forEach((node) => {
      if (node.type === "project") {
        // Chaos home coordinates (using smaller mobile widths if <= 768px)
        const cardW = W > 768 ? 270 : 170;
        const cardH = W > 768 ? 180 : 70;
        node.homeX = node.rxRatio * (W - cardW) + 10;
        node.homeY = node.ryRatio * (H - cardH) + 40;

        // Focus target coordinates
        if (W > 768) {
          node.tx = 60;
          node.ty = 60 + node.idx * ((H - 150) / 4);
        } else {
          // Clean mobile column layout for projects on the left
          node.tx = 15;
          node.ty = 15 + node.idx * ((H - 90) / 4);
        }
      } else if (node.type === "skill") {
        // Chaos home coordinates (using smaller mobile widths if <= 768px)
        const tagW = W > 768 ? 140 : 130;
        const tagH = W > 768 ? 80 : 35;
        node.homeX = node.rxRatio * (W - tagW) + 10;
        node.homeY = node.ryRatio * (H - tagH) + 40;

        // Focus target coordinates
        if (W > 768) {
          const radius = Math.min(180, H * 0.35);
          const centerX = W * 0.68;
          const centerY = H / 2;
          const angle = (node.idx / skillsData.length) * Math.PI * 2;
          node.tx = centerX + Math.cos(angle) * radius - 50; // shift half tag width
          node.ty = centerY + Math.sin(angle) * radius - 15; // shift half tag height
        } else {
          // Clean mobile column layout for skills on the right
          node.tx = W - 145;
          node.ty = 15 + node.idx * ((H - 50) / 11);
        }
      } else if (node.type === "thought") {
        // Chaos home coordinates
        node.homeX = node.rxRatio * (W - 180) + 40;
        node.homeY = node.ryRatio * (H - 80) + 40;

        // Focus target coordinates (hidden)
        node.tx = -500;
        node.ty = -500;
      } else if (node.type === "decor") {
        // Chaos home coordinates (spread across screen)
        node.homeX = node.rxRatio * (W - 80) + 20;
        node.homeY = node.ryRatio * (H - 80) + 40;

        // Focus target coordinates (remain at home for background drift)
        node.tx = node.homeX;
        node.ty = node.homeY;
      }
    });
  }

  window.addEventListener("resize", () => {
    if (window.activeScreen === "universe") {
      recalculateCoordinates();
    }
  });

  window.initMindUniverse = function () {
    space = $("interactive-space");
    svg = $("network-svg");
    if (!space || !svg) return;

    space.innerHTML = ""; // Reset container
    nodes = [];

    // 1. Create Projects Nodes
    projectsData.forEach((p, idx) => {
      const el = document.createElement("div");
      el.className = "mind-node project hoverable";
      el.id = `proj-${idx}`;
      el.innerHTML = `
        <div class="np-num">PROJECT ${p.num}</div>
        <div class="np-title">${p.title}</div>
        <div class="np-desc">${p.desc}</div>
        <div class="np-click-tip">Expand Case Study →</div>
      `;
      el.onclick = () => openCaseStudy(p);
      space.appendChild(el);

      const rxRatio =
        0.05 + (idx / projectsData.length) * 0.25 + Math.random() * 0.05;
      const ryRatio =
        0.1 + (idx / projectsData.length) * 0.65 + Math.random() * 0.05;

      nodes.push({
        el: el,
        id: el.id,
        idx: idx,
        rxRatio: rxRatio,
        ryRatio: ryRatio,
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        homeX: 0,
        homeY: 0,
        floatSpeed: 0.8 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        type: "project",
      });
    });

    // 2. Create Skills Nodes
    skillsData.forEach((s, idx) => {
      const el = document.createElement("div");
      el.className = "mind-node skill hoverable";
      el.id = `skill-${idx}`;
      el.innerHTML = `
        <span class="ns-icon">${s.icon}</span>
        <span class="ns-name">${s.name}</span>
      `;
      space.appendChild(el);

      const rxRatio =
        0.5 + (idx / skillsData.length) * 0.35 + Math.random() * 0.05;
      const ryRatio =
        0.15 + (idx / skillsData.length) * 0.65 + Math.random() * 0.05;

      nodes.push({
        el: el,
        id: el.id,
        idx: idx,
        rxRatio: rxRatio,
        ryRatio: ryRatio,
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        homeX: 0,
        homeY: 0,
        floatSpeed: 0.6 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        type: "skill",
      });
    });

    // 3. Create Floating thoughts
    thoughtsData.forEach((txt, idx) => {
      const el = document.createElement("div");
      el.className = "mind-node thought";
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
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        homeX: 0,
        homeY: 0,
        floatSpeed: 0.5 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        type: "thought",
      });
    });

    // 4. Create Decor elements (Chess, Rubik, Sports hints)
    decorNodesData.forEach((d, idx) => {
      const el = document.createElement("div");
      el.className = "mind-node decor hoverable";
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
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        homeX: 0,
        homeY: 0,
        floatSpeed: 0.4 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        type: "decor",
      });
    });

    // Recalculate coordinates initially
    recalculateCoordinates();

    // Spawn nodes at home position initially
    nodes.forEach((node) => {
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
    const grid = $("projects-grid");
    if (!grid) return;
    grid.innerHTML = "";

    projectsData.forEach((p, idx) => {
      const card = document.createElement("div");
      card.className = `static-card project-card-${idx} hoverable`;
      card.onclick = () => window.openCaseStudyByIndex(idx);

      // Define different colors and layouts based on index/category
      let badge = "";
      let highlightBox = "";
      let hankoKanji = "";

      if (p.num === "01") {
        // CV - highlights Edge FPS
        badge = `<span class="sc-badge cv-badge">EDGE AI</span>`;
        hankoKanji = "認"; // Recognition
        highlightBox = `
          <div class="sc-inline-metric">
            <span class="sc-im-val">Face + Voice</span>
            <span class="sc-im-lbl">biometric verification</span>
          </div>`;
      } else if (p.num === "02") {
        // Diffusion - highlights SDXL
        badge = `<span class="sc-badge genai-badge">GEN AI</span>`;
        hankoKanji = "創"; // Create
        highlightBox = `
          <div class="sc-inline-metric">
            <span class="sc-im-val">AdaIN</span>
            <span class="sc-im-lbl">style transfer engine</span>
          </div>`;
      } else if (p.num === "03") {
        // AI Agents - highlights retrieval flowchart
        badge = `<span class="sc-badge agent-badge">AI COACH</span>`;
        hankoKanji = "力"; // Strength
        highlightBox = `
          <div class="sc-flow-path">
            <span>Pose</span> → <span>Analyze</span> → <span>Coach</span>
          </div>`;
      } else if (p.num === "04") {
        // SecureML - no metrics, shows security checklist
        badge = `<span class="sc-badge secure-badge">ATS AI</span>`;
        hankoKanji = "職"; // Career
        highlightBox = `
<div class="sc-feature-list-mini">
  <div>📄 ATS Scoring Engine</div>
  <div>🧠 Semantic Analysis</div>
          </div>`;
      } else if (p.num === "05") {
        // Scheduler - user metrics
        badge = `<span class="sc-badge productivity-badge">CYBER AI</span>`;
        hankoKanji = "盾"; // Shield
        highlightBox = `
<div class="sc-inline-metric">
  <span class="sc-im-val">Real-Time</span>
  <span class="sc-im-lbl">threat detection</span>
          </div>`;
      }

      card.innerHTML = `
        <div class="hanko-stamp">${hankoKanji}</div>
        <div class="sc-header-row">
          <span class="sc-meta">${p.category}</span>
          ${badge}
        </div>
        <h3 class="sc-title">${p.title}</h3>
        <p class="sc-desc">${p.desc}</p>
        
        ${highlightBox}
        
        <div class="sc-tags">
          ${p.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>
        <div class="sc-arrow">View Case Study →</div>
      `;
      grid.appendChild(card);
    });
  }

  // Build SVG lines for node linkages
  function buildNetworkLines() {
    svg.innerHTML = "";
    connections = [];

    connectionLinks.forEach((link) => {
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.className = "net-line";
      line.setAttribute("stroke", "rgba(34, 211, 238, 0.15)");
      line.setAttribute("stroke-width", "1.5");
      svg.appendChild(line);

      connections.push({
        el: line,
        fromId: link.from,
        toId: link.to,
      });
    });
  }

  // Snap transition layout updates
  window.applyFocusTransition = function (isFocus) {
    if (isFocus) {
      svg.classList.add("visible");
    } else {
      svg.classList.remove("visible");
    }
  };

  // Main drawing / position update loop
  function update() {
    t += 16; // mock 60fps tick milliseconds

    const speedFactor = window.caffeineOverdrive ? 3.5 : 1.0;
    const W = space.clientWidth || window.innerWidth;

    nodes.forEach((node) => {
      if (window.focusModeActive) {
        // Linear Interpolate (lerp) nodes to structured targets
        if (node.type === "decor") {
          // Decors float slightly around their home even in focus mode!
          const floatX =
            Math.sin(t * 0.0005 * node.floatSpeed + node.phase) * 20;
          const floatY =
            Math.cos(t * 0.0005 * node.floatSpeed * 0.8 + node.phase * 0.5) *
            20;
          node.x += (node.homeX + floatX - node.x) * 0.08;
          node.y += (node.homeY + floatY - node.y) * 0.08;
        } else {
          node.x += (node.tx - node.x) * 0.12;
          node.y += (node.ty - node.y) * 0.12;
        }
      } else {
        // Floating wave math (reduced distance on mobile to prevent clutter)
        const maxFloat = W > 768 ? 50 : 20;
        const floatX =
          Math.sin(t * 0.001 * node.floatSpeed * speedFactor + node.phase) * maxFloat;
        const floatY =
          Math.cos(
            t * 0.001 * node.floatSpeed * 0.8 * speedFactor + node.phase * 0.5,
          ) * maxFloat;

        node.x += (node.homeX + floatX - node.x) * 0.06;
        node.y += (node.homeY + floatY - node.y) * 0.06;
      }

      // Assign styles
      node.el.style.left = node.x + "px";
      node.el.style.top = node.y + "px";
    });

    // Update SVG connection lines coordinates in focus mode
    if (window.focusModeActive) {
      connections.forEach((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.fromId);
        const toNode = nodes.find((n) => n.id === conn.toId);

        if (fromNode && toNode) {
          // Calculate center offsets for line start/ends
          const fromW = fromNode.el.offsetWidth || 100;
          const fromH = fromNode.el.offsetHeight || 30;
          const toW = toNode.el.offsetWidth || 250;
          const toH = toNode.el.offsetHeight || 100;

          conn.el.setAttribute("x1", fromNode.x + fromW / 2);
          conn.el.setAttribute("y1", fromNode.y + fromH / 2);
          conn.el.setAttribute("x2", toNode.x + toW / 2);
          conn.el.setAttribute("y2", toNode.y + toH / 2);
        }
      });
    }

    requestAnimationFrame(update);
  }

  // --- STATIC PORTFOLIO LINKING BINDER ---
  window.openCaseStudyByIndex = function (idx) {
    if (projectsData[idx]) {
      window.openCaseStudy(projectsData[idx]);
    }
  };

  // --- CASE STUDY POPUP MODALS ---
  window.openCaseStudy = function (proj) {
    const modal = $("case-study-modal");
    if (!modal) return;

    $("modal-title").textContent = proj.title;
    $("modal-category").textContent = proj.category;
    $("modal-problem").textContent = proj.problem;
    $("modal-architecture").textContent = proj.architecture;
    $("modal-lessons").textContent = proj.lessons;

    // Populate technology tag list
    const tagWrap = $("modal-tags");
    tagWrap.innerHTML = "";
    proj.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "mb-tag";
      span.textContent = tag;
      tagWrap.appendChild(span);
    });

    // Populate stats metrics grid adaptively
    const metricWrap = $("modal-metrics");
    metricWrap.innerHTML = "";
    const metricsTitle = metricWrap.previousElementSibling; // Key Metrics title

    if (proj.metrics && proj.metrics.length > 0) {
      if (metricsTitle) metricsTitle.style.display = "block";
      metricWrap.style.display = "grid";
      proj.metrics.forEach((m) => {
        const card = document.createElement("div");
        card.className = "mb-metric-card";
        card.innerHTML = `
          <div class="mb-metric-val">${m.val}</div>
          <div class="mb-metric-lbl">${m.lbl}</div>
        `;
        metricWrap.appendChild(card);
      });
    } else {
      if (metricsTitle) metricsTitle.style.display = "none";
      metricWrap.style.display = "none";
    }

    // Populate features list if it exists
    const featWrap = $("modal-features-wrap");
    if (featWrap) {
      featWrap.innerHTML = "";
      if (proj.features && proj.features.length > 0) {
        featWrap.style.display = "block";
        const h3 = document.createElement("h3");
        h3.textContent = "Core Features";
        h3.style.marginTop = "1.5rem";
        featWrap.appendChild(h3);
        const ul = document.createElement("ul");
        ul.className = "modal-feature-list";
        ul.style.listStyleType = "none";
        ul.style.paddingLeft = "0";
        proj.features.forEach((f) => {
          const li = document.createElement("li");
          li.textContent = `✓ ${f}`;
          li.style.color = "var(--text2)";
          li.style.fontSize = "14px";
          li.style.marginBottom = "6px";
          li.style.fontFamily = "inherit";
          ul.appendChild(li);
        });
        featWrap.appendChild(ul);
      } else {
        featWrap.style.display = "none";
      }
    }

    // Setup action urls
    $("modal-live-link").href = proj.demo;
    $("modal-git-link").href = proj.git;

    modal.classList.add("open");
    window.unlockAchievement("case_study", "📝 Memory Node Investigated!");
  };

  window.closeCaseStudy = function () {
    const modal = $("case-study-modal");
    if (modal) modal.classList.remove("open");
  };
})();
