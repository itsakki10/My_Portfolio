/**
 * Simplified AI Twin Chatbot (AkashAI) with theme-aware telemetry waveforms.
 */

(function () {
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
    projects: "Akash has built multiple AI-powered products including SecureML Fabric (cybersecurity threat detection), CVortex (ATS resume intelligence platform), RepSense AI (real-time AI gym coach), NeuralCanvas (generative AI style transfer), and Auth Vision Vox (face and voice-based smart attendance system).",

    projects_followup: "His projects span Computer Vision, NLP, LLM integrations, Cybersecurity AI, Generative AI, and full-stack application development. He enjoys building end-to-end systems from data pipelines and model training to deployment and user experience.",

    skills: "Core technical stack includes Python, Machine Learning, Deep Learning, PyTorch, OpenCV, FastAPI, SQL, Data Engineering, LLMs, Computer Vision, Docker, and Streamlit.",

    skills_followup: "His focus is on transforming ideas into deployable products by combining AI models, backend engineering, analytics, and intuitive user experiences.",

    ai: "Akash is deeply interested in Artificial Intelligence, Machine Learning, Computer Vision, NLP, Generative AI, Agentic Systems, and real-world AI applications.",

    ai_followup: "He enjoys exploring how intelligent systems can automate decisions, improve productivity, and create meaningful user experiences across industries.",

    fitness: "Akash maintains a disciplined gym routine and believes physical training and engineering share the same principles: consistency, progressive improvement, and measurable results.",

    fitness_followup: "He views strength training as a practical lesson in discipline and long-term optimization, applying the same mindset to software development and AI projects.",

    data: "Akash is fascinated by data engineering, feature engineering, analytics, and transforming raw information into actionable insights through intelligent systems.",

    data_followup: "He enjoys building pipelines that collect, process, analyze, and serve data efficiently for machine learning applications.",

    education: "Akash is pursuing a B.Tech in Artificial Intelligence and Machine Learning, focusing on machine learning, deep learning, computer vision, data science, and software engineering.",

    education_followup: "Beyond academics, he spends significant time building real-world projects, learning deployment workflows, and studying production-grade AI systems.",

    location: "Akash is based in India and actively collaborates through online communities, open-source projects, hackathons, and AI-focused learning initiatives.",

    location_followup: "His work is designed with a global mindset, focusing on scalable products that can solve problems beyond geographical boundaries.",

    hobbies: "His interests include AI research, fitness, technology trends, building side projects, exploring emerging tools, and continuously learning new technologies.",

    hobbies_followup: "He enjoys transforming curiosity into products, often spending weekends experimenting with new AI models, frameworks, and software architectures.",

    future: "Akash aims to become a world-class AI Engineer capable of building intelligent systems that combine machine learning, data engineering, software architecture, and human-centered design.",

    future_followup: "He is particularly excited about the future of Agentic AI, LLM applications, autonomous systems, and AI-powered products that create real-world impact.",

    mindset: "Akash believes great engineering is the combination of curiosity, discipline, and execution. Ideas matter, but shipped products matter more.",

    mindset_followup: "He focuses on learning by building, treating every project as an opportunity to master a new technology stack or solve a meaningful problem.",

    hire: "Akash is actively seeking opportunities in AI/ML Engineering, Data Science, Machine Learning, Computer Vision, NLP, Data Engineering, and Full-Stack AI Development.",

    hire_followup: "He is looking for ambitious teams where he can contribute to impactful products, learn from experienced engineers, and continue growing as a builder.",

    looking_for: "He is interested in AI/ML Engineer, Machine Learning Engineer, Data Scientist, AI Developer, Computer Vision Engineer, and Data Engineering roles.",

    looking_for_followup: "His ideal environment combines innovation, ownership, continuous learning, and the opportunity to build products from concept to deployment.",

    default: "Greetings. I am Akash's AI Twin (AM.コア). Ask me about his AI projects, machine learning journey, computer vision systems, LLM applications, fitness discipline, or future ambitions."
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
          const y = h / 2 + Math.sin(x * freqMult + phaseOffset + phaseShift) * waveAmplitude * Math.cos(x * 0.001 - Math.PI / 2);
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
  window.toggleAISound = function () {
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

  window.initAI = function () {
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

  window.sendAI = function () {
    if (isAiThinking) return;

    const inp = document.getElementById('ai-input');
    if (!inp || !inp.value.trim()) return;

    const msg = inp.value.trim();
    inp.value = '';

    askTwin(msg);
  };

  window.openAI = function () {
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
