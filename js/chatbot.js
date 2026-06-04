/**
 * Simplified AI Twin Chatbot (AkashAI) with theme-aware telemetry waveforms.
 */

(function() {
  let aiOpen = false;
  let isAiThinking = false;
  let waveId = null;
  let waveAmplitude = 5;
  let waveSpeed = 0.05;

  // Sound telemetry controls
  window.aiSoundEnabled = true;
  let audioCtx = null;

  // Memory context
  window.lastQueriedTopic = '';

  // Unified AkashAI Knowledge Database
  const aiKnowledge = {
    projects: "Akash has deployed 3 core ML systems: Synapse RAG (indexing 10M+ files with sub-200ms query latency), Neural Chess/Shogi (MCTS RL self-play engine), and VisionSense (a YOLOv8 edge computer vision line replacing visual inspectors).",
    projects_followup: "Deeper details: Synapse RAG uses FAISS with sparse BM25 retrieval. Neural Chess/Shogi uses policy-value ResNets quantized to FP16, and VisionSense utilizes TensorRT to process camera feeds at 120 FPS.",
    skills: "Core technical stack: Python, PyTorch, LangChain, FAISS vector indexes, FastAPI services, Docker containerization, CUDA programming, and MLOps deployment pipelines.",
    skills_followup: "His architectural focus is on low-latency inference. This includes custom CUDA kernel configurations, optimizing model weights via ONNX, and building secure enclave model decrypters.",
    chess: "Akash is rated 1800+ ELO. He views Chess and Shogi (将棋 - Japanese chess) as direct mental models for system design — prioritizing deep tree evaluation, spatial coordinate control, and planning recursive moves ahead.",
    chess_followup: "In Shogi, captured pieces can be dropped back onto the board (re-used). He equates this to memory pooling, buffer recycling, and efficient tensor allocation in neural compiler pipelines.",
    coffee: "Consumes an average of 47 cups per month. It serves as a focused ritual between designing system architectures and shipping updates.",
    coffee_followup: "He logs caffeine intake telemetry to correlate compile time with code quality. Cup 3 is statistically linked to major debugging sweeps.",
    rubik: "Maintains a personal best of 23 seconds. The cube serves as a practical lesson in state-space decomposition and algorithmic pathfinding.",
    rubik_followup: "Solving Rubik's cubes utilizes standard CFOP stages. In model architecture, solving sub-modules follows a similar pipeline of forced states.",
    hire: "He is actively looking for AI/ML engineering roles where he can build and ship high-impact models. Contact: akash.mehra@email.com | +91 98765 43210.",
    hire_followup: "He prefers fast-moving, ambitious development environments. He can coordinate end-to-end setups, from model training to secure enclaved production deployments.",
    adhd: "Akash channels his high neural energy into building code rapidly, establishing strict engineering checklists to ensure focus translates directly to production results.",
    adhd_followup: "Hyperfocus allows him to complete full architectural builds in single-session sprints, relying on automated unit tests to verify stability.",
    sports: "He maintains a disciplined strength training regimen 5-6 days a week, channeling high-energy focus like Rock Lee's weight-drops to build endurance and cognitive buffer.",
    sports_followup: "He views high-intensity training as the ultimate system diagnostic test — proving that consistency and mental toughness translate directly to debug sprints.",
    education: "Akash holds a B.Tech in CSE specializing in AI and ML from Delhi Technological University, focusing on deep networks, calculus, backpropagation, and distributed scheduling algorithms.",
    education_followup: "He supplemented his coursework with research in model optimization, custom enclaved decryption interfaces and fine-tuning YOLO-based segmentation models.",
    location: "Akash is based in Delhi, India. He works and builds from here, deploying models to global cloud instances and edge terminals.",
    location_followup: "Operating out of Delhi, he coordinates with distributed teams globally, syncing his compilation cycles with different timezone operational windows.",
    hobbies: "Akash's interest matrices cover strategic games like competitive Chess and Shogi (将棋), collecting vintage cyber-manga print panels (Akira, Ghost in the Shell), speedcubing (23s personal best), and reviewing ML research papers over double-shot espresso.",
    hobbies_followup: "He reads classic cyberpunk manga, drawing design inspiration from their clean, high-contrast, black-ink neobrutalist sketchbook layouts. He treats code as an art form akin to precise ink sketching.",
    future: "He envisions a cyberpunk future reminiscent of Ghost in the Shell — featuring secure edge-AI execution enclaves, highly autonomous multi-agent networks, and real-time model compilation.",
    future_followup: "Specifically, he is building neural compiler layers that encrypt weights in-transit and decrypt them inside secure enclaves on the fly, keeping user prompts fully private.",
    friends: "He views peers and collaborators as cooperative node clusters. He believes that working with like-minded builders, chess partners, and athletic peers multiplies the speed of calculation and execution.",
    friends_followup: "He values builders who challenge his system structures. Collaborating on fast hackathons and team code sprints represents his favorite environment to ship products.",
    looking_for: "He is seeking AI/ML engineering, Deep Learning developer, or MLOps positions where he can build high-throughput model architectures, optimize inference latency, and deploy secure models.",
    looking_for_followup: "He wants to join ambitious, high-discipline engineering teams that prioritize fast shipping speeds, clean codebase maintenance, and quantitative benchmark verification.",
    default: "Greetings. I am Akash's AI Twin (AM.コア). Ask me about his ML production systems, DTU education, Shogi/Chess strategies, or his cyberpunk/anime-inspired software architecture."
  };

  // Web Audio Synth Click
  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSynthClick() {
    if (!window.aiSoundEnabled) return;
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200 + Math.random() * 600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.012, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.04);
    } catch (e) {
      console.warn("Web Audio Click error:", e);
    }
  }

  function playSynthSweep(isUp = true) {
    if (!window.aiSoundEnabled) return;
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.type = 'triangle';
      const startFreq = isUp ? 300 : 800;
      const endFreq = isUp ? 800 : 300;
      
      osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + 0.25);
      
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch (e) {
      console.warn("Web Audio Sweep error:", e);
    }
  }

  // Interactive Neural Waveform Canvas Drawing
  function initWaveCanvas() {
    const canvas = document.getElementById('chatbot-wave-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let w = canvas.width = canvas.parentElement.clientWidth;
    let h = canvas.height = canvas.parentElement.clientHeight;
    let phaseOffset = 0;

    window.addEventListener('resize', () => {
      w = canvas.width = canvas.parentElement.clientWidth;
      h = canvas.height = canvas.parentElement.clientHeight;
    });

    function drawWave() {
      ctx.clearRect(0, 0, w, h);
      
      // Interpolate wave physics based on state
      const targetAmp = isAiThinking ? 12 : 3;
      const targetSpeed = isAiThinking ? 0.22 : 0.03;
      waveAmplitude += (targetAmp - waveAmplitude) * 0.08;
      waveSpeed += (targetSpeed - waveSpeed) * 0.08;

      phaseOffset += waveSpeed;

      // Extract current amber color prefix dynamically from CSS
      const bodyStyle = getComputedStyle(document.body);
      const amberColor = bodyStyle.getPropertyValue('--amber').trim() || '#fbbf24';
      
      // Draw 3 overlaying sine waves with different offsets/opacities
      for (let waveIndex = 0; waveIndex < 3; waveIndex++) {
        ctx.beginPath();
        ctx.lineWidth = waveIndex === 0 ? 1.5 : 0.8;
        const opacity = waveIndex === 0 ? 0.75 : 0.35 - waveIndex * 0.1;
        
        ctx.strokeStyle = amberColor + Math.round(opacity * 255).toString(16).padStart(2, '0');

        const freqMult = 0.008 + waveIndex * 0.004;
        const phaseShift = waveIndex * Math.PI * 0.35;

        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * freqMult + phaseOffset + phaseShift) * waveAmplitude * Math.cos(x * 0.001 - Math.PI/2);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      waveId = requestAnimationFrame(drawWave);
    }
    
    if (waveId) cancelAnimationFrame(waveId);
    drawWave();
  }

  // Sound telemetry button toggle
  window.toggleAISound = function() {
    window.aiSoundEnabled = !window.aiSoundEnabled;
    const btn = document.getElementById('acb-sound-btn');
    if (btn) {
      btn.textContent = window.aiSoundEnabled ? '🔊' : '🔇';
      btn.title = window.aiSoundEnabled ? 'Mute voice telemetry' : 'Unmute voice telemetry';
    }
    if (window.aiSoundEnabled) {
      initAudio();
    }
  };

  // Context-aware query translator (runs live API or local fallback)
  async function getAIResponse(msg) {
    const m = msg.toLowerCase().trim();
    const db = aiKnowledge;

    // 1. Try to query Vercel Serverless API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: msg })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.response) {
          return data.response;
        }
      }
    } catch (err) {
      console.warn("Live AI endpoint unavailable. Falling back to offline dictionary.", err);
    }

    // 2. Offline Fallback Logic (detect followups)
    const isFollowup = m.includes('more') || m.includes('explain') || m.includes('detail') || m.includes('deep') || m.includes('expand') || m.includes('go on');

    if (isFollowup && window.lastQueriedTopic) {
      const followupKey = `${window.lastQueriedTopic}_followup`;
      if (db[followupKey]) {
        return db[followupKey];
      }
    }

    if (m.includes('project') || m.includes('build') || m.includes('work') || m.includes('ship')) {
      window.lastQueriedTopic = 'projects';
      return db.projects;
    }
    if (m.includes('skill') || m.includes('stack') || m.includes('tech') || m.includes('python') || m.includes('torch') || m.includes('code')) {
      window.lastQueriedTopic = 'skills';
      return db.skills;
    }
    if (m.includes('chess') || m.includes('elo') || m.includes('knight')) {
      window.lastQueriedTopic = 'chess';
      return db.chess;
    }
    if (m.includes('coffee') || m.includes('cup') || m.includes('cafe') || m.includes('caffeine')) {
      window.lastQueriedTopic = 'coffee';
      return db.coffee;
    }
    if (m.includes('rubik') || m.includes('cube') || m.includes('puzzle') || m.includes('solve')) {
      window.lastQueriedTopic = 'rubik';
      return db.rubik;
    }
    if (m.includes('education') || m.includes('college') || m.includes('study') || m.includes('degree') || m.includes('university') || m.includes('academic') || m.includes('school')) {
      window.lastQueriedTopic = 'education';
      return db.education;
    }
    if (m.includes('from') || m.includes('where') || m.includes('born') || m.includes('live') || m.includes('hometown') || m.includes('delhi') || m.includes('india') || m.includes('location')) {
      window.lastQueriedTopic = 'location';
      return db.location;
    }
    if (m.includes('like') || m.includes('hobby') || m.includes('interest') || m.includes('love') || m.includes('activity')) {
      window.lastQueriedTopic = 'hobbies';
      return db.hobbies;
    }
    if (m.includes('future') || m.includes('think') || m.includes('forward') || m.includes('predict') || m.includes('tomorrow') || m.includes('next')) {
      window.lastQueriedTopic = 'future';
      return db.future;
    }
    if (m.includes('friend') || m.includes('team') || m.includes('peer') || m.includes('colleague') || m.includes('group') || m.includes('collaborator')) {
      window.lastQueriedTopic = 'friends';
      return db.friends;
    }
    if (m.includes('looking for') || m.includes('goal') || m.includes('ambition') || m.includes('role') || m.includes('seeking') || m.includes('position')) {
      window.lastQueriedTopic = 'looking_for';
      return db.looking_for;
    }
    if (m.includes('hire') || m.includes('job') || m.includes('contact') || m.includes('available') || m.includes('email') || m.includes('recru')) {
      window.lastQueriedTopic = 'hire';
      return db.hire;
    }
    if (m.includes('adhd') || m.includes('chaos') || m.includes('focus') || m.includes('energy') || m.includes('brain')) {
      window.lastQueriedTopic = 'adhd';
      return db.adhd;
    }
    if (m.includes('sport') || m.includes('gym') || m.includes('train') || m.includes('discipline') || m.includes('run') || m.includes('athletics')) {
      window.lastQueriedTopic = 'sports';
      return db.sports;
    }

    // Default catch-alls
    window.lastQueriedTopic = '';
    return db.default;
  }

  const quickQs = ['Projects?', 'Education?', 'Where from?', 'Future vision?', 'Likes?', 'Available?'];

  window.initAI = function() {
    const qw = document.getElementById('ai-quick');
    if (!qw) return;
    qw.innerHTML = '';
    
    quickQs.forEach(q => {
      const b = document.createElement('button');
      b.className = 'acb-q-btn';
      b.textContent = q;
      b.onclick = () => askTwin(q);
      qw.appendChild(b);
    });

    // Start wave canvas
    initWaveCanvas();
  };

  // Simulates typing effect
  function typeText(element, text, speed = 20) {
    isAiThinking = true;
    let charIndex = 0;
    element.textContent = '';
    const msgs = document.getElementById('ai-msgs');
    
    function stream() {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        if (charIndex % 2 === 0) {
          playSynthClick();
        }
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
        setTimeout(stream, speed);
      } else {
        isAiThinking = false;
        playSynthSweep(false);
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      }
    }
    stream();
  }

  // Manage bot query, thinking state, and output stream
  async function askTwin(msg) {
    if (isAiThinking) return;
    
    addAIMsg(msg, 'user');
    
    const msgs = document.getElementById('ai-msgs');
    if (!msgs) return;
    
    // Set thinking state true to trigger rapid waveform kinetics
    isAiThinking = true;
    
    const t = document.createElement('div');
    t.className = 'acb-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
    
    playSynthSweep(true);
    
    try {
      const replyText = await getAIResponse(msg);
      t.remove();
      
      const d = document.createElement('div');
      d.className = 'acb-msg bot';
      msgs.appendChild(d);
      typeText(d, replyText, 15);
    } catch (e) {
      t.remove();
      isAiThinking = false;
      console.error("Chatbot query error:", e);
    }
  }

  function addAIMsg(text, type) {
    const msgs = document.getElementById('ai-msgs');
    if (!msgs) return;
    
    if (type === 'user') {
      const d = document.createElement('div');
      d.className = 'acb-msg user';
      d.textContent = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      playSynthClick();
    }
  }

  window.sendAI = function() {
    if (isAiThinking) return;
    
    const inp = document.getElementById('ai-input');
    if (!inp || !inp.value.trim()) return;
    
    const msg = inp.value.trim();
    inp.value = '';
    
    askTwin(msg);
  };

  window.openAI = function() {
    aiOpen = !aiOpen;
    const b = document.getElementById('ai-box');
    if (b) {
      b.classList.toggle('open', aiOpen);
      if (aiOpen) {
        setTimeout(initWaveCanvas, 50);
        playSynthSweep(true);
      }
    }
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.initAI();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.initAI();
    });
  }
})();
