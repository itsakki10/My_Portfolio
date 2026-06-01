/**
 * Interactive AI twin chatbot logs, replies generator, quick questions, and overlays.
 */

let aiOpen = false;

const aiKnowledge = {
  projects: "Akash has built 3 flagship projects: Synapse RAG (10M+ docs, <200ms latency), Neural Chess Engine (2100+ ELO via self-play RL), and VisionSense CV (97.3% mAP, 120 FPS). Each one started as a 3am idea.",
  skills: "Core stack: Python + PyTorch for deep learning, Transformers/LangChain for LLMs, YOLOv8 + OpenCV for CV, FastAPI + Docker for deployment, CUDA for GPU optimization, FAISS for vector search.",
  chess: "Akash is rated 1800+ ELO. Chess is his mental model for engineering — evaluate deeply, sacrifice the obvious for the elegant, think 5 moves ahead. He built an AI chess engine that beat him.",
  coffee: "47 cups/month. Coffee is ritual, not habit. Every major architecture decision happened between the 2nd and 3rd cup. The debugging breakthroughs? Always the 3rd cup.",
  rubik: "23 second PB using the CFOP method. He says solving a cube is literally debugging: you decompose the problem, identify the state, apply the algorithm. Just faster with fingers.",
  hire: "Akash is actively looking for AI/ML engineering roles. He's most excited by teams building ambitious AI products that move fast. Email: akash.mehra@email.com | Phone: +91 98765 43210",
  adhd: "Ha! You noticed. Akash has ADHD — which means his brain generates ideas faster than most people can process. The trick? Build systems that catch all of them, then execute ruthlessly.",
  sports: "Discipline is a muscle. Akash trains 5-6 days a week. The same consistency that shows up at 6am in the gym shows up at 2am for a production bug. Competing taught him that talent without consistency is nothing.",
  default: "That's a great question. Akash is an AI/ML engineer who thinks in systems, solves puzzles for fun, runs on coffee and curiosity. He's built production ML systems, trained chess AI, and can solve a cube in 23 seconds. What would you like to know more about?"
};

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('project') || m.includes('build') || m.includes('work') || m.includes('ship')) return aiKnowledge.projects;
  if (m.includes('skill') || m.includes('stack') || m.includes('tech') || m.includes('python') || m.includes('torch')) return aiKnowledge.skills;
  if (m.includes('chess')) return aiKnowledge.chess;
  if (m.includes('coffee') || m.includes('cup') || m.includes('cafe')) return aiKnowledge.coffee;
  if (m.includes('rubik') || m.includes('cube') || m.includes('puzzle') || m.includes('23')) return aiKnowledge.rubik;
  if (m.includes('hire') || m.includes('job') || m.includes('contact') || m.includes('available') || m.includes('email')) return aiKnowledge.hire;
  if (m.includes('adhd') || m.includes('chaos') || m.includes('focus') || m.includes('energy')) return aiKnowledge.adhd;
  if (m.includes('sport') || m.includes('gym') || m.includes('train') || m.includes('discipline')) return aiKnowledge.sports;
  return aiKnowledge.default;
}

const quickQs = ['Projects?', 'Tech stack?', 'Chess?', 'Coffee habits?', 'Available?'];

function initAI() {
  const qw = $('ai-quick');
  if (!qw) return;
  qw.innerHTML = ''; // Clear fallback buttons
  
  quickQs.forEach(q => {
    const b = document.createElement('button');
    b.className = 'acb-q-btn';
    b.textContent = q;
    b.onclick = () => {
      addAIMsg(q, 'user');
      setTimeout(() => addAIMsg(getAIResponse(q), 'bot'), 700);
    };
    qw.appendChild(b);
  });
}

function addAIMsg(text, type) {
  const msgs = $('ai-msgs');
  if (!msgs) return;
  
  if (type === 'bot') {
    // Render typing dots animation bubble
    const t = document.createElement('div');
    t.className = 'acb-typing';
    t.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(t);
    msgs.scrollTop = msgs.scrollHeight;
    
    // Replace typing indicator with actual bot message bubble
    setTimeout(() => {
      t.remove();
      const d = document.createElement('div');
      d.className = 'acb-msg bot';
      d.textContent = text;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }, 700);
  } else {
    // Add user text bubble
    const d = document.createElement('div');
    d.className = 'acb-msg user';
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
}

function sendAI() {
  const inp = $('ai-input');
  if (!inp || !inp.value.trim()) return;
  
  const msg = inp.value.trim();
  inp.value = '';
  addAIMsg(msg, 'user');
  
  setTimeout(() => addAIMsg(getAIResponse(msg), 'bot'), 800);
}

function openAI() {
  aiOpen = !aiOpen;
  const b = $('ai-box');
  if (b) {
    b.classList.toggle('open', aiOpen);
  }
}
