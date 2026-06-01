/**
 * 3D Rubik's Cube projection matrix simulator, drag controls, and rotations solver
 */

const COLORS = ['#ffffff', '#ef4444', '#3b82f6', '#f97316', '#22c55e', '#facc15'];
const FACE_NAMES = ['U', 'R', 'L', 'F', 'B', 'D'];

let cubeState;
let rbDrag = { active: false, sx: 0, sy: 0 };
let rbRot = { x: 25, y: -35 };
let rbMoves = [];

function initCubeState() {
  cubeState = COLORS.map((c, i) => Array(9).fill(i));
}

function resetCubeState() {
  initCubeState();
  rbMoves = [];
  const statusEl = $('rb-status');
  const movesEl = $('rb-moves');
  if (statusEl) statusEl.textContent = 'Cube reset!';
  if (movesEl) movesEl.textContent = '';
  renderCube();
}

function scrambleCube() {
  initCubeState();
  const moves = ['U', 'R', 'F', 'D', 'L', 'B'];
  const dirs = ['', "'"];
  const seq = [];
  
  for (let i = 0; i < 18; i++) {
    const m = moves[Math.floor(Math.random() * 6)] + dirs[Math.floor(Math.random() * 2)];
    seq.push(m);
    applyMove(m);
  }
  
  rbMoves = seq;
  const statusEl = $('rb-status');
  const movesEl = $('rb-moves');
  if (statusEl) statusEl.textContent = 'Scrambled! Can you solve it?';
  if (movesEl) movesEl.textContent = seq.join(' ');
  renderCube();
}

function applyMove(mv) {
  const f = mv[0];
  const cw = mv.length === 1;
  const fi = FACE_NAMES.indexOf(f);
  if (fi < 0) return;
  rotateFace(fi, cw);
  renderCube();
}

function rotateFace(fi, cw) {
  const face = [...cubeState[fi]];
  if (cw) {
    cubeState[fi] = [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]];
  } else {
    cubeState[fi] = [face[2], face[5], face[8], face[1], face[4], face[7], face[0], face[3], face[6]];
  }
}

function renderCube() {
  const c = $('rb-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 260, 260);

  const size = 36;
  const gap = 2;
  const ox = 130;
  const oy = 130;
  
  const rx = (rbRot.x * Math.PI) / 180;
  const ry = (rbRot.y * Math.PI) / 180;

  // 3D coordinate projection mapping function
  function project(x, y, z) {
    const y2 = y * Math.cos(rx) - z * Math.sin(rx);
    const z2 = y * Math.sin(rx) + z * Math.cos(rx);
    const x2 = x * Math.cos(ry) + z2 * Math.sin(ry);
    const z3 = -x * Math.sin(ry) + z2 * Math.cos(ry);
    const scale = 220 / (220 + z3);
    return { x: ox + x2 * scale, y: oy + y2 * scale, z: z3 };
  }

  const hs = size / 2 + gap / 2;

  const drawFaceGrid = (fi, getCorner) => {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const ci = row * 3 + col;
        const color = COLORS[cubeState[fi][ci]];
        const [x0, y0, z0] = getCorner(row, col);
        const [x1, y1, z1] = getCorner(row, col + 1);
        const [x2, y2, z2] = getCorner(row + 1, col + 1);
        const [x3, y3, z3] = getCorner(row + 1, col);
        
        const p0 = project(x0, y0, z0);
        const p1 = project(x1, y1, z1);
        const p2 = project(x2, y2, z2);
        const p3 = project(x3, y3, z3);
        
        // Backface culling via cross product check
        const nx = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);
        if (nx < 0) return;

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  };

  const s = size;
  
  // Render faces in 3D projection space
  drawFaceGrid(0, (r, c) => [(-1.5 + c) * s, (-1.5) * s - s / 2 + 0.5, (-1.5 + r) * s]);
  drawFaceGrid(5, (r, c) => [(-1.5 + c) * s, (1.5) * s + s / 2 - 0.5, (-1.5 + (2 - r)) * s]);
  drawFaceGrid(3, (r, c) => [(-1.5 + c) * s, (-1.5 + r) * s, (-1.5) * s - s / 2 + 0.5]);
  drawFaceGrid(4, (r, c) => [(-1.5 + c) * s, (-1.5 + (2 - r)) * s, (1.5) * s + s / 2 - 0.5]);
  drawFaceGrid(1, (r, c) => [(1.5) * s + s / 2 - 0.5, (-1.5 + r) * s, (-1.5 + (2 - c)) * s]);
  drawFaceGrid(2, (r, c) => [(-1.5) * s - s / 2 + 0.5, (-1.5 + r) * s, (-1.5 + c) * s]);
}

function initRubik() {
  initCubeState();
  
  // Dynamic controls setup
  const row = $('rb-btn-row');
  if (row) {
    row.innerHTML = ''; // Clear fallback buttons
    FACE_NAMES.forEach(f => {
      ['', "'"].forEach(d => {
        const b = document.createElement('button');
        b.className = 'rb-btn hoverable';
        b.textContent = f + d;
        b.onclick = () => {
          applyMove(f + d);
          const statusEl = $('rb-status');
          if (statusEl) statusEl.textContent = `Rotated ${f + d}`;
        };
        row.appendChild(b);
      });
    });
  }

  const c = $('rb-canvas');
  if (c) {
    c.addEventListener('mousedown', e => {
      rbDrag = { active: true, sx: e.clientX, sy: e.clientY };
    });
    
    document.addEventListener('mouseup', () => {
      rbDrag.active = false;
    });
    
    document.addEventListener('mousemove', e => {
      if (!rbDrag.active) return;
      rbRot.y += (e.clientX - rbDrag.sx) * 0.5;
      rbRot.x += (e.clientY - rbDrag.sy) * 0.5;
      rbDrag.sx = e.clientX;
      rbDrag.sy = e.clientY;
      renderCube();
    });
  }

  // Slow continuous self-rotation background animation
  function rbAnim() {
    if (!rbDrag.active) {
      rbRot.y += 0.3;
      renderCube();
    }
    requestAnimationFrame(rbAnim);
  }
  
  rbAnim();
}
