/**
 * Advanced AI Twin Chatbot (AkashAI).
 * Revamped Features:
 *  - 4 Conversational Mood Personas.
 *  - Interactive Glowing Neural Waveform Canvas reacting to typing states.
 *  - Synthesized Web Audio key click & thinking sweep sound telemetry.
 *  - Multi-turn topic memory context supporting follow-up questions.
 *  - Expanded Personal Knowledge (Education, Location, Interests, Future Vision, Friends, Career Goals).
 *  - Custom border-glow CSS class binders.
 */

(function() {
  let aiOpen = false;
  let currentPersona = 'professional';
  let isAiThinking = false;
  let waveId = null;
  let waveAmplitude = 5;
  let waveSpeed = 0.05;

  // Sound telemetry controls
  window.aiSoundEnabled = true;
  let audioCtx = null;

  // Memory context
  window.lastQueriedTopic = '';

  // Welcome strings for each persona
  const welcomeMessages = {
    professional: "Neural pathways stabilized in Professional Mode. Ask me about Akash's engineering skills, RAG pipelines, production experience, or hiring status. 💼",
    adhd: "BAM! Brain cells overclocked! 🧠 Emojis loading! Ideas colliding! Ask me anything about chess, caffeine thresholds, gym sessions, models, fast! ⚡",
    caffeinated: "Caffeine concentration: 98%. Current task: analyze CUDA kernels, PyTorch layers, and deployment optimizations. Send input query. ☕",
    chess: "Strategic coordinates mapped. Evaluation: +1.2. Board positions analyzed. Ask me how strategic foresight dictates architecture refactoring choices. ♟"
  };

  // Persona status tags
  const statusTags = {
    professional: "● professional mode",
    adhd: "● chaos threshold active",
    caffeinated: "● telemetry high (caffeine)",
    chess: "● calculating depth 12"
  };

  // Persona colors (matching active borders)
  const personaColors = {
    professional: '#fbbf24',
    adhd: '#f472b6',
    caffeinated: '#a78bfa',
    chess: '#22d3ee'
  };

  // Persona responses knowledge graph mapping (with followups!)
  const aiKnowledge = {
    professional: {
      projects: "Akash has deployed 3 core ML systems: Synapse RAG (indexing 10M+ files with sub-200ms query latency), Neural Chess (MCTS RL self-play engine), and VisionSense (a YOLOv8 edge computer vision line replacing visual inspectors).",
      projects_followup: "Deeper details: Synapse RAG uses FAISS with sparse BM25 retrieval. Neural Chess uses policy-value ResNets quantized to FP16, and VisionSense utilizes TensorRT to process camera feeds at 120 FPS.",
      skills: "Core technical stack: Python, PyTorch, LangChain, FAISS vector indexes, FastAPI services, Docker containerization, CUDA programming, and MLOps deployment pipelines.",
      skills_followup: "His architectural focus is on low-latency inference. This includes custom CUDA kernel configurations, optimizing model weights via ONNX, and building secure enclave model decrypters.",
      chess: "Akash is rated 1800+ ELO. He views chess as a direct mental model for system design — prioritizing deep evaluation, identifying structural patterns, and planning moves ahead.",
      chess_followup: "In tournaments, he plays positional setups. He believes scaling a model follows the same pattern: secure the base layout, coordinate active pieces, and prune weak candidate steps.",
      coffee: "Consumes an average of 47 cups per month. It serves as a focused ritual between designing system architectures and shipping updates.",
      coffee_followup: "He logs caffeine intake telemetry to correlate compile time with code quality. cup 3 is statistically linked to major debugging sweeps.",
      rubik: "Maintains a personal best of 23 seconds. The cube serves as a practical lesson in state-space decomposition and algorithmic pathfinding.",
      rubik_followup: "Solving Rubik's cubes utilizes standard CFOP stages. In model architecture, solving sub-modules follows a similar pipeline of forced states.",
      hire: "He is actively looking for AI/ML engineering roles where he can build and ship high-impact models. Contact: akash.mehra@email.com | +91 98765 43210.",
      hire_followup: "He prefers fast-moving, ambitious development environments. He can coordinate end-to-end setups, from model training to secure enclaved production deployments.",
      adhd: "Akash channels his high neural energy into building code rapidly, establishing strict engineering checklists to ensure focus translates directly to production results.",
      adhd_followup: "Hyperfocus allows him to complete full architectural builds in single-session sprints, relying on automated unit tests to verify stability.",
      sports: "Maintains disciplined training 5-6 days a week, viewing consistency and daily commitment as vital muscles for both athletic performance and software engineering.",
      sports_followup: "He trains in sprints and strength builds. He views the physical endurance from athletics as a buffer against cognitive exhaustion during long debugs.",
      
      // Personal Details (Professional Mode)
      education: "Akash holds a Bachelor of Technology in Computer Science and Engineering, specializing in Artificial Intelligence. His academic focus covered Deep Learning networks, advanced mathematical modeling, and distributed system algorithms.",
      education_followup: "He supplemented his coursework with research in model optimization, writing custom enclaved decryption interfaces and fine-tuning YOLO-based segmentation models.",
      location: "Akash is based in Delhi, India. He works and builds from here, deploying models to global cloud instances and edge terminals.",
      location_followup: "Operating out of Delhi, he coordinates with distributed teams globally, syncing his compilation cycles with different timezone operational windows.",
      hobbies: "His interests cover strategic and physical challenges: competitive chess (1800+ ELO), compound weight training, speedcubing (personal best of 23 seconds), and reviewing ML research papers over double-shot espresso.",
      hobbies_followup: "He applies the CFOP method to speedcubing and positional patterns to chess, viewing both as state-space parsing games that directly translate to code architecture planning.",
      future: "He believes the future of engineering lies in secure edge AI execution enclaves, highly autonomous multi-agent ReAct networks controlling API actions, and sub-50ms hybrid vector retrieval grids.",
      future_followup: "Specifically, he is mapping out compiler optimizations that allow model weights to be encrypted during transit and decrypted dynamically inside secure CPU enclaves during real-time inference.",
      friends: "He views peers and collaborators as cooperative node clusters. He believes that working with like-minded builders, chess partners, and athletic peers multiplies the speed of calculation and execution.",
      friends_followup: "He values builders who challenge his system structures. Collaborating on fast hackathons and team code sprints represents his favorite environment to ship products.",
      looking_for: "He is seeking AI/ML engineering, Deep Learning developer, or MLOps positions where he can build high-throughput model architectures, optimize inference latency, and deploy secure models.",
      looking_for_followup: "He wants to join ambitious, high-discipline engineering teams that prioritize fast shipping speeds, clean codebase maintenance, and quantitative benchmark verification.",
      
      default: "I'm Akash's AI Twin in Professional Mode. Ask me about his projects, technical skills, CV, or past production achievements."
    },
    adhd: {
      projects: "WOAH! Okay, so: Synapse RAG searches 10 MILLION docs in like 150ms! 🤯 Then there is a neural chess engine trained on self-play RL for 48 hours straight on high-end GPUs! Plus an edge YOLOv8 model scanning factory lines at 120 FPS! INSANE!",
      projects_followup: "WANT MORE? The chess ResNet has a custom policy/value split, and the YOLO edge arm connects directly via GPIO triggers to knock defective parts off the physical belt! PEW PEW! ⚡",
      skills: "PyTorch! Python! Transformers! LangChain! Docker! CUDA! Fast APIs! Vector search indexes! Basically, if it's cutting-edge and involves deep learning, he builds with it!",
      skills_followup: "Also, high-performance CUDA coding! He writes custom kernel layers directly to handle FP16 vector operations in GPU enclaves! Speed overclocked!",
      chess: "1800+ Elo!! Chess is like speed-running code refactoring. You sacrifice pieces to get a beautiful mating pattern, just like you delete bad code to get a beautiful system design!",
      chess_followup: "Favorite opening is the Sicilian defense! Attacking from move one, creating dynamic imbalance, forcing the opponent into time pressure—just like his dev style!",
      coffee: "47 cups! He tracks this! Cups 1 & 2 are for waking up, Cup 3 is where the major debugging breakthroughs happen. Caffeine is literally his compiler fuel! ☕⚡",
      coffee_followup: "Caffeine molecules bind to adenosine receptors to prevent thread blocking! Code compiling speed goes from 3.2GHz to 5.0GHz with triple-shot espresso! 🚀",
      rubik: "23 seconds flat! He solves cubes with fingers moving faster than you can blink! It is just fast-paced debugging: identify the scrambled pattern, execute the algorithm, solve it!",
      rubik_followup: "CFOP is like writing modular functions! Cross is database setup, F2L is API route linking, OLL/PLL is clean frontend rendering! BOOM, solved in 20s!",
      hire: "YES, HIRE HIM! He wants to build ambitious AI products and move fast! Mail him at akash.mehra@email.com or call +91 98765 43210 before another recruiter does!",
      hire_followup: "He is ready to start building! Machine learning engineering, high-throughput agents, MLOps setups—he ships code faster than you can schedule the next standup meeting!",
      adhd: "Hyperfocus is a superpower! His brain runs at 5GHz, generating 50 ideas a minute. The trick? Capture them in code, automate everything, and execute ruthlessly!",
      adhd_followup: "When the hyperfocus kicks in, time disappears and systems write themselves. Checking off tasks on GitHub is his favorite dopamine loop!",
      sports: "Gym sessions at 6am, commits by 9am! He trains 6 days a week because physical discipline keeps the mental chaos completely locked and focused!",
      sports_followup: "Heavy deadlifts, compound circuits, speed sprints! Moving iron is literally the only thing that keeps his neural compiler thread count stable! 🏋️‍♂️",
      
      // Personal Details (ADHD/Chaos Mode)
      education: "B.Tech in Computer Science and Engineering, focusing on AI and ML! Algorithms, deep networks, big datasets, math calculations! He practically lived in the computer lab writing code!",
      education_followup: "He spent semester breaks building custom YOLO models and experimenting with Docker containers. Standard classes were way too slow—he wanted to build!",
      location: "Delhi, India! 🇮🇳 A chaotic, high-energy metropolis that matches his neural speed! He builds core AI pipelines right from the heart of the capital!",
      location_followup: "The traffic is fast, the food is spicy, and the dev sprints are intense! He coordinates code pushes globally across all timezone shifts!",
      hobbies: "Cubes, chess, caffeine, iron! 🧊♟☕🏋️‍♂️ Speed-solving Rubik's cubes, playing aggressive Sicilian chess, lifting heavy plates at 6am, and coding at 3am!",
      hobbies_followup: "His hands solve cubes in 23 seconds, his mind plans mates at 1800+ ELO, and his muscles pull deadlifts—all before most people finish their first coffee!",
      future: "AGENTS! Core MLOps! AI enclaves! Secure hardware running models instantly! Real-time agent networks executing actions while you sleep! The future is autonomous!",
      future_followup: "He is dreaming of a system that encrypts model weights during deployment, decrypts inside secure RAM slots, and executes vector searches in under 5ms! INSANE SPEED!",
      friends: "The ultimate builder crew! Node clusters of competitive developers, chess tacticians, and gym beasts! Teamwork makes the CPU compile 10x faster!",
      friends_followup: "He loves brainstorming at 2am, arguing over compiler speeds with dev buddies, and running competitive coding challenges to see who ships first!",
      looking_for: "AN AMBITIOUS JOB! High-speed engineering slots! Deep Learning roles! GPU memory profiling, agent deployments, scaling vector RAG arrays! Let's ship code!",
      looking_for_followup: "He is looking for a team that doesn't drag feet. No slow meetings—just code commits, benchmark testing, and pushing the boundaries of AI systems!",

      default: "Chaos mode fully engaged! Emojis loading! Ask me about his insane 3am coding projects, chess games, or how much espresso he drank today!"
    },
    caffeinated: {
      projects: "System analysis: 1) Synapse RAG utilizes a hybrid dense (FAISS) + sparse (BM25) retriever coupled with Cross-Encoder re-ranking. 2) Neural Chess leverages a policy-value ResNet trained via CUDA self-play. 3) VisionSense runs YOLOv8 FP16 optimized via TensorRT.",
      projects_followup: "Deep telemetry: SecureML Fabric encrypts weights with AES-GCM and decrypts on-the-fly inside secure hardware memory slots, keeping decryption CPU overhead below 1.5%.",
      skills: "Compiler stack loaded: Python 3.11, PyTorch (FP16/AMP, CUDA 12.1), LangChain, Redis caching layers, FastAPI async workers, Dockerized MLOps pipelines (MLflow, ONNX runtimes).",
      skills_followup: "Optimizing memory bandwidth: custom block size configurations, shared memory optimization, and asynchronous thread blocks mapped to CUDA kernels.",
      chess: "Heuristics profile: 1800+ ELO. AlphaZero-style evaluation weights. Chess coordinates with system state space search, optimizing decision trees and eliminating bad pathways.",
      chess_followup: "Evaluating depth: uses Monte Carlo Tree Search (MCTS) to simulate game configurations. Applying similar pruning parameters to software scaling loops.",
      coffee: "Telemetry warning: caffeine saturation high. 47 cups/month. Current dosage supports high-efficiency debugging. Debugging completion rate increases by 40% after the 3rd cup.",
      coffee_followup: "Chemical telemetry: C8H10N4O2 saturation level: 92%. Blocking sleep receptors to maximize thread execution frequency. Compiler clocks optimized.",
      rubik: "Solving latency: 23s. Algorithm mapping: CFOP method (Cross, F2L, OLL, PLL). Highly optimized state transition matrices mapped to motor reflexes.",
      rubik_followup: "CFOP mapping: 4-stage partition. Space decomposition maps 43 quintillion scrambled states to a single resolved target vector in under 55 moves.",
      hire: "Available for deployment. Targeted configuration: ML/AI engineering roles, scalable pipelines, fast-moving teams. Email: akash.mehra@email.com | Tel: +91 98765 43210.",
      hire_followup: "Core capability: implementing end-to-end deep learning architecture pipelines, GPU kernel quantization, and productionizing raw models.",
      adhd: "Neural pathways operating in hyper-threaded parallel processing. Output streams routed directly into rapid prototyping, balanced by strict verification testing.",
      adhd_followup: "Execution loops utilize git-based CI/CD triggers to deploy builds instantly upon completion of automated test matrices.",
      sports: "System health check: 6 weekly training cycles. Endorphin regulation keeps core cognitive loops stable, preventing burnout and optimization decay.",
      sports_followup: "Compound kinetics: 6am high-density load lifts. Regulates blood sugar levels and prevents model weights stagnation in developers' mental processes.",
      
      // Personal Details (Caffeinated Dev Mode)
      education: "Academic status: B.Tech in CSE (AI/ML specialization). Parsing matrix calculus, neural weight updates, backpropagation, and distributed scheduling algorithms.",
      education_followup: "Academic research modules: custom quantization configurations, reducing model parameter sizes, and optimizing ONNX execution providers.",
      location: "Geographic coordinates: Delhi, India. Operating terminal synced with local IP networks, routing code pushes to global servers.",
      location_followup: "Local atmosphere coordinates: Delhi region. High-energy dev center. Networking connections active, latency to AWS instances minimized.",
      hobbies: "Telemetry parameters: Chess ELO 1800+, Rubik solver latency 23s, 6 weekly strength training loops, caffeinated compiler intake.",
      hobbies_followup: "Mapping hobbies to state trees: chess acts as minimax game solver, Rubik's cube uses state transitions, weight lifting prevents core cycle decay.",
      future: "System prediction: decentralized model enclaves, secure memory weight decrypters, distributed agent routers executing tasks via vector stores.",
      future_followup: "Current research task: compilation pipeline optimization that allows model files to decrypt dynamically in private memory zones during execution.",
      friends: "Node configuration: collaborative team builders, peer compilers, strength partners. Group compilation increases system testing efficiency.",
      friends_followup: "Collaborative testing metrics: hackathons, shared git code reviews, and pair programming to locate edge cases quickly.",
      looking_for: "Target deployment: ML Engineer, MLOps Specialist, Deep Learning Developer. Configuring private pipelines, enclaves, and models.",
      looking_for_followup: "Desired environment configuration: high-throughput teams, automated testing, direct model execution, and rapid deployment schedules.",
      
      default: "Caffeinated telemetry active. Ask me about GPU memory layouts, PyTorch inference optimization, or model deployment configurations."
    },
    chess: {
      projects: "The projects represent calculated chess positions. Synapse RAG controls the center with FAISS search layers. The Neural Chess engine is a grandmaster simulator trained on self-play. VisionSense acts as a defensive guard dog on the factory floor.",
      projects_followup: "SecureML Fabric is like castling: it moves the king (model weights) into a highly secure enclave castle, surrounded by AES-256 shields, stopping any model hijacking threats.",
      skills: "Akash's skills are like a chess piece arsenal: Python is the Queen (highly versatile), PyTorch and CUDA are the Rooks (heavy material power), LangChain and FastAPI are the Knights (tactical maneuverability).",
      skills_followup: "Docker containers act as defensive pawns securing the environment grid. FAISS indexes act as bishops capturing diagonal semantic relations across vector datasets.",
      chess: "Rated 1800+ ELO. In chess and code, the rules are the same: never make the obvious move without calculating five moves ahead. Avoid gambits that compromise long-term structure.",
      chess_followup: "Positional play dictates that structural stability is superior to tactical traps. Akash designs codebases to prevent technical debt build-up.",
      coffee: "The coffee cup is a tactical pawn. Each sip buys a tempo. Sips 1 and 2 develop the position; Sip 3 finds the winning combination to checkmate the production bug.",
      coffee_followup: "Without coffee, the position becomes passive. Caffeine unlocks dynamic lines of attack, enabling creative sacrifices in code architectures.",
      rubik: "Solving a cube is like converting a winning endgame: you recognize the pattern, calculate the forced line of moves, and execute with absolute precision.",
      rubik_followup: "Solving endgames and cubes requires pattern categorization. Once you recognize the structure, the calculation path narrows down to a forced win.",
      hire: "Strategic deployment available. Akash is seeking AI/ML engineering roles. Ready to capture the board. Contact: akash.mehra@email.com | +91 98765 43210.",
      hire_followup: "He is prepared to assume control of technical layers, planning scaling pathways and capturing engineering opportunities five steps ahead of standard teams.",
      adhd: "An aggressive attacking style. The mind generates multiple tactical threats simultaneously. The challenge is filtering the noise to choose the single most elegant move.",
      adhd_followup: "Hyper-active calculation. He maps multiple conceptual lines simultaneously, selecting the most direct pathway to launch the model features.",
      sports: "Endurance training is the physical stamina required for a 5-hour tournament game. Staying calm under pressure on the field correlates directly to handling production incidents.",
      sports_followup: "Physical stamina supports tactical calculation depth. A fit body keeps the mind oxygenated when evaluating complex system trees.",
      
      // Personal Details (Chess Master Mode)
      education: "Akash acquired B.Tech in CSE with an AI specialization. This academic base represents theoretical chess studies—understanding tactical openings, pawn patterns, and endgame theories.",
      education_followup: "He spent university years analyzing system layouts, calculating complexity bounds, and translating deep mathematics into clean code structures.",
      location: "Akash coordinates from Delhi, India. The board is set in this high-activity zone, playing moves across global servers.",
      location_followup: "Operating from the capital, his moves are calculated and executed, ensuring a highly responsive connection to international projects.",
      hobbies: "Positional hobbies: ELO 1800+ chess battles, speedcubing puzzles, physical athletics, and decoding complex research structures.",
      hobbies_followup: "Chess is strategic warfare, cubing is forced pattern execution, weightlifting is building structural stamina. All feed his engineering mindset.",
      future: "The future is a complex middlegame. He anticipates highly coordinate agent networks dominating API paths and secure model enclaves securing weight assets.",
      future_followup: "He expects that model piracy will force systems to secure weights inside hardware castles, executing calculations in protected zones.",
      friends: "Strategic alliances. He views collaborators as a coordinated pawn structure—working together to control the board and capture engineering goals.",
      friends_followup: "He values builders who challenge his layouts. Exchanging ideas during hackathons or team projects is like analyzing games post-match.",
      looking_for: "He is seeking a position as an AI/ML Engineer or MLOps Architect where he can manage system files, coordinate agent networks, and secure models.",
      looking_for_followup: "He seeks high-intensity dev boards that calculate moves in advance, avoiding technical debt traps and planning clean wins.",

      default: "Chess Master AI loaded. The board is set, the pieces are moving. Ask me how Akash's tactical thinking applies to scaling ML codebases."
    }
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
      
      // High-pass retro click sound
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

      const pColor = personaColors[currentPersona];
      
      // Draw 3 overlaying sine waves with different offsets/opacities
      for (let waveIndex = 0; waveIndex < 3; waveIndex++) {
        ctx.beginPath();
        ctx.lineWidth = waveIndex === 0 ? 1.5 : 0.8;
        const opacity = waveIndex === 0 ? 0.75 : 0.35 - waveIndex * 0.1;
        ctx.strokeStyle = pColor + Math.round(opacity * 255).toString(16).padStart(2, '0');

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
    // Initialize audio context if user engages with sound
    if (window.aiSoundEnabled) {
      initAudio();
    }
  };

  // Switch active twin persona
  window.setPersona = function(mode, btn) {
    if (isAiThinking) return; // Block switches when bot is typing
    
    const box = document.getElementById('ai-box');
    if (box) {
      // Remove all class persona overlays
      box.className = 'ai-chat-box open';
      box.classList.add(`persona-${mode}`);
    }

    currentPersona = mode;
    window.currentPersona = mode; // bind globally for terminal report
    
    // Unlock achievement
    if (window.unlockAchievement) {
      window.unlockAchievement('ai_twin', '🤖 Neural Twin Synchronized!');
    }
    
    // Highlight active button
    document.querySelectorAll('.acb-p-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    
    // Update UI Status tag
    const statusEl = document.getElementById('acb-status');
    if (statusEl) statusEl.textContent = statusTags[mode];
    
    // Clear welcome message and stream the new welcome message
    const msgs = document.getElementById('ai-msgs');
    if (msgs) {
      msgs.innerHTML = ''; // Reset messages
      
      // Create new bot welcome bubble
      const d = document.createElement('div');
      d.className = 'acb-msg bot';
      msgs.appendChild(d);
      
      // Play chimes sweep
      playSynthSweep(true);

      // Stream welcome text
      typeText(d, welcomeMessages[mode], 15);
    }
  };

  // Context-aware query translator
  function getAIResponse(msg) {
    const m = msg.toLowerCase().trim();
    const db = aiKnowledge[currentPersona];

    // Detect followups
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
      b.onclick = () => {
        if (isAiThinking) return;
        addAIMsg(q, 'user');
        setTimeout(() => addAIMsg(getAIResponse(q), 'bot'), 400);
      };
      qw.appendChild(b);
    });

    // Start wave canvas
    initWaveCanvas();

    // Trigger professional theme initialization class on box
    const box = document.getElementById('ai-box');
    if (box) {
      box.classList.add('persona-professional');
    }
  };

  // Simulates real-time typing streaming
  function typeText(element, text, speed = 20) {
    isAiThinking = true;
    let charIndex = 0;
    element.textContent = '';
    
    const msgs = document.getElementById('ai-msgs');
    
    function stream() {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        
        // Play keyboard click sound
        if (charIndex % 2 === 0) {
          playSynthClick();
        }

        if (msgs) msgs.scrollTop = msgs.scrollHeight; // Auto-scroll on character
        setTimeout(stream, speed);
      } else {
        isAiThinking = false;
        playSynthSweep(false); // Play chime completion
        if (msgs) msgs.scrollTop = msgs.scrollHeight;
      }
    }
    stream();
  }

  function addAIMsg(text, type) {
    const msgs = document.getElementById('ai-msgs');
    if (!msgs) return;
    
    if (type === 'bot') {
      // Show typing dots first
      const t = document.createElement('div');
      t.className = 'acb-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(t);
      msgs.scrollTop = msgs.scrollHeight;
      
      playSynthSweep(true); // thinking sweep

      setTimeout(() => {
        t.remove();
        const d = document.createElement('div');
        d.className = 'acb-msg bot';
        msgs.appendChild(d);
        
        // Stream bot response character-by-character
        typeText(d, text, 15);
      }, 750);
    } else {
      // Show user message instantly
      const d = document.createElement('div');
      d.className = 'acb-msg user';
      d.textContent = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      
      // Play a quick chime trigger
      playSynthClick();
    }
  }

  window.sendAI = function() {
    if (isAiThinking) return; // Block input while AI streams
    
    const inp = document.getElementById('ai-input');
    if (!inp || !inp.value.trim()) return;
    
    const msg = inp.value.trim();
    inp.value = '';
    
    addAIMsg(msg, 'user');
    setTimeout(() => addAIMsg(getAIResponse(msg), 'bot'), 400);
  };

  window.openAI = function() {
    aiOpen = !aiOpen;
    const b = document.getElementById('ai-box');
    if (b) {
      b.classList.toggle('open', aiOpen);
      if (aiOpen) {
        // Redraw wave canvas when box unhides
        setTimeout(initWaveCanvas, 50);
        // Play quick engagement sweep
        playSynthSweep(true);
      }
    }
  };

  // Initialize chatbot when DOM is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.initAI();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      window.initAI();
    });
  }

})();
