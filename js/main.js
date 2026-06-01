/**
 * Global coordinator: cursor trackers, reveal observer, page scrolls, and loading sequences.
 */

// Global DOM selector helper (used by all JS modules)
const $ = id => document.getElementById(id);

// Smooth scroll helper for anchors
function goTo(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

// Global initialization entrypoint
function initAll() {
  initBG();
  initHero();
  initADHD();
  initMind();
  initSkills();
  initProjects();
  initCoffee();
  initChess();
  initRubik();
  initReveal();
  initAI();
}

// Reveal animation observer (toggles CSS classes for transitions)
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.reveal, .reveal-l, .reveal-r').forEach(el => {
    obs.observe(el);
  });
}

// Custom mouse follower cursor setup
let cx = window.innerWidth / 2;
let cy = window.innerHeight / 2;
let rx = window.innerWidth / 2;
let ry = window.innerHeight / 2;

const cur = $('cur');
const cring = $('cur-ring');
const cdot = $('cur-dot');

if (cur && cring && cdot) {
  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    cur.style.left = cx + 'px';
    cur.style.top = cy + 'px';
    cdot.style.left = cx + 'px';
    cdot.style.top = cy + 'px';
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

// Page preloading sequence tracker
const loaderSteps = [
  { p: 15, t: 'scanning neural pathways...' },
  { p: 35, t: 'brewing 3 cups of coffee...' },
  { p: 55, t: 'loading chaos modules...' },
  { p: 75, t: 'applying OCD organization...' },
  { p: 90, t: 'connecting the dots...' },
  { p: 100, t: 'ready.' }
];

let li = 0;
const lbar = $('ld-bar');
const lstatus = $('ld-status');

if (lbar) lbar.style.width = '0%';

function nextLoader() {
  if (li >= loaderSteps.length) {
    setTimeout(() => {
      const loader = $('loader');
      if (loader) {
        loader.classList.add('out');
      }
      initAll();
    }, 400);
    return;
  }
  
  const s = loaderSteps[li];
  if (lbar) lbar.style.width = s.p + '%';
  if (lstatus) lstatus.textContent = s.t;
  
  li++;
  setTimeout(nextLoader, 300 + Math.random() * 200);
}

// Start preloading loop
setTimeout(nextLoader, 200);
