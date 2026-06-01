/**
 * Global State Coordinator and Keyboard Easter Eggs Handler
 */

const $ = id => document.getElementById(id);

// Global state variables
window.activeScreen = 'opening';
window.focusModeActive = false;
window.caffeineOverdrive = false;
let unlockedAchievements = new Set();
let keystrokeBuffer = '';

// Core initializers
window.addEventListener('DOMContentLoaded', () => {
  // Setup cursor following logic
  setupCursor();
  
  // Setup keyboard logger for easter eggs
  document.addEventListener('keydown', handleKeystrokes);

  // Run preloader loading sequence
  runPreloader();
});

// Run futuristic startup preloader log progression
function runPreloader() {
  const preloader = $('preloader');
  const percentEl = $('preloader-percent');
  const ringFill = $('preloader-ring-fill');
  const logsEl = $('preloader-logs');

  if (!preloader || !percentEl || !ringFill || !logsEl) return;

  const logs = [
    "[ SYSTEM ] Initializing caffeine thread...",
    "[ SYSTEM ] Allocating GPU VRAM blocks (CUDA 12.1)...",
    "[ SYSTEM ] Quantizing core YOLOv8 weights to FP16...",
    "[ SYSTEM ] Loading 1800 ELO chess evaluation matrices...",
    "[ SYSTEM ] Mapping ADHD hyperfocus parameters...",
    "[ SYSTEM ] Synapses connected. Initializing link."
  ];

  let percent = 0;
  let logIndex = 0;
  const totalDuration = 2200; // 2.2 seconds
  const intervalTime = 20;
  const steps = totalDuration / intervalTime;
  const percentPerStep = 100 / steps;
  const perimeter = 251.2;

  const preloaderInterval = setInterval(() => {
    percent += percentPerStep;
    if (percent >= 100) {
      percent = 100;
      clearInterval(preloaderInterval);
      percentEl.textContent = "100%";
      ringFill.setAttribute('stroke-dashoffset', '0');

      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.visibility = 'hidden';
        setTimeout(() => {
          preloader.remove();
        }, 800);
      }, 300);
    } else {
      const displayPercent = Math.floor(percent);
      percentEl.textContent = `${displayPercent}%`;
      const offset = perimeter - (percent / 100) * perimeter;
      ringFill.setAttribute('stroke-dashoffset', offset);

      const expectedLogIndex = Math.floor((percent / 100) * logs.length);
      if (expectedLogIndex > logIndex && logIndex < logs.length) {
        const line = document.createElement('div');
        line.className = 'preloader-log-line';
        line.textContent = logs[logIndex];
        logsEl.appendChild(line);
        logsEl.scrollTop = logsEl.scrollHeight;
        logIndex = expectedLogIndex;
      }
    }
  }, intervalTime);
}

// Smooth cursor custom follow circles
function setupCursor() {
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  let rx = window.innerWidth / 2;
  let ry = window.innerHeight / 2;

  const cur = $('cur');
  const cring = $('cur-ring');

  if (cur && cring) {
    document.addEventListener('mousemove', e => {
      cx = e.clientX;
      cy = e.clientY;
      cur.style.left = cx + 'px';
      cur.style.top = cy + 'px';
    });

    function animCur() {
      rx += (cx - rx) * 0.12;
      ry += (cy - ry) * 0.12;
      cring.style.left = rx + 'px';
      cring.style.top = ry + 'px';
      requestAnimationFrame(animCur);
    }
    animCur();
  }
}

// Transitions from Stage 1 (Opening) to Stage 2 (Mind Space)
window.enterMind = function() {
  if (window.activeScreen !== 'opening') return;
  window.activeScreen = 'transitioning';
  
  // Trigger 3D canvas flying zoom transition
  if (window.triggerBrainZoom) {
    window.triggerBrainZoom();
  }
  
  setTimeout(() => {
    const openingSec = $('opening-sec');
    if (openingSec) openingSec.classList.add('hidden');
    
    const uSec = $('universe-sec');
    if (uSec) uSec.classList.remove('hidden');
    
    window.activeScreen = 'universe';
    
    // Initialize Mind Universe nodes coordinates
    if (window.initMindUniverse) {
      window.initMindUniverse();
    }
    
    // Auto unlock stage 1 achievement
    window.unlockAchievement('neural_core', '🧠 Neural Link Established!');
  }, 1000);
};

// Navigates back to Stage 1 Opening
window.resetToOpening = function() {
  const openingSec = $('opening-sec');
  const uSec = $('universe-sec');
  if (openingSec) openingSec.classList.remove('hidden');
  if (uSec) uSec.classList.add('hidden');
  
  window.activeScreen = 'opening';
  
  if (window.resetBrainZoom) {
    window.resetBrainZoom();
  }
};

// Toggle structured grid focus mode
window.toggleFocusMode = function() {
  if (window.activeScreen !== 'universe') return;
  
  window.focusModeActive = !window.focusModeActive;
  
  const btn = $('focus-btn');
  if (btn) {
    if (window.focusModeActive) {
      btn.classList.add('active');
      btn.textContent = 'Chaos Mode';
      window.unlockAchievement('focus_execution', '🗂 Structured Focus Engaged!');
    } else {
      btn.classList.remove('active');
      btn.textContent = 'Focus Mode';
    }
  }

  // Trigger grid transitions inside mind universe
  if (window.applyFocusTransition) {
    window.applyFocusTransition(window.focusModeActive);
  }
};

// Achievement Unlocked Toast Notification manager
window.unlockAchievement = function(id, title) {
  if (unlockedAchievements.has(id)) return;
  unlockedAchievements.add(id);
  
  const toast = $('achievement-toast');
  const toastTitle = $('toast-title');
  if (!toast || !toastTitle) return;
  
  toastTitle.textContent = title;
  toast.classList.add('visible');
  
  setTimeout(() => {
    toast.classList.remove('visible');
  }, 3500);
};

// Keyboard listener for typing easter eggs
function handleKeystrokes(e) {
  keystrokeBuffer += e.key;
  if (keystrokeBuffer.length > 20) {
    keystrokeBuffer = keystrokeBuffer.substring(keystrokeBuffer.length - 20);
  }

  // Type focus() to toggle layout mode
  if (keystrokeBuffer.endsWith('focus()')) {
    window.toggleFocusMode();
    keystrokeBuffer = '';
  }

  // Type coffee++ to unlock caffeine overdrive
  if (keystrokeBuffer.endsWith('coffee++')) {
    window.triggerCaffeineOverdrive();
    keystrokeBuffer = '';
  }
}

// Caffeine Overdrive mode (speed boost, steam, bright glows)
window.triggerCaffeineOverdrive = function() {
  window.caffeineOverdrive = !window.caffeineOverdrive;
  
  const status = $('caffeine-status');
  const txt = $('caffeine-txt');
  
  if (window.caffeineOverdrive) {
    if (status) status.classList.add('active');
    if (txt) txt.textContent = 'Caffeine: OVERDRIVE! ⚡';
    
    // Speed up orbits and floating nodes
    window.unlockAchievement('caffeine_overdrive', '☕ Caffeine Overdrive! 4.0GHz');
  } else {
    if (status) status.classList.remove('active');
    if (txt) txt.textContent = 'Caffeine: Normal';
  }
};

// Smooth scroll to targeted elements inside scroll container
window.scrollToSection = function(id) {
  const el = document.getElementById(id);
  const container = document.getElementById('universe-sec');
  if (el && container) {
    container.scrollTo({
      top: el.offsetTop - 80, // Offset for sticky header
      behavior: 'smooth'
    });
  }
};
