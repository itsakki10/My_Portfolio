/**
 * Chess board UI rendering, square selection, piece moving, and board flipping logic.
 */

const FILES_INIT = [
  [null, null, '♜', null, null, null, null, '♜'],
  ['♟', '♟', '♟', '♟', null, '♟', '♟', '♟'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, '♟', null, null, null],
  [null, null, null, null, '♙', null, null, null],
  [null, null, null, null, null, null, null, null],
  ['♙', '♙', '♙', '♙', null, '♙', '♙', '♙'],
  ['♖', null, null, null, null, null, null, '♖'],
];

let board = [];
let sel = null;
let flipped = false;
let lastMove = null;

const WHITE_PIECES = ['♙', '♖', '♘', '♗', '♕', '♔'];
const BLACK_PIECES = ['♟', '♜', '♞', '♝', '♛', '♚'];

function resetChess() {
  board = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
  ];
  sel = null;
  lastMove = null;
  renderChess();
  const statusEl = $('chess-status');
  if (statusEl) statusEl.textContent = 'White to move — click a piece';
}

function flipBoard() {
  flipped = !flipped;
  renderChess();
}

function renderChess() {
  const bd = $('chess-board');
  if (!bd) return;
  bd.innerHTML = '';
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const dr = flipped ? 7 - r : r;
      const dc = flipped ? 7 - c : c;
      const sq = document.createElement('div');
      
      // Determine square color based on checkerboard pattern
      sq.className = 'csq ' + (((dr + dc) % 2 === 0) ? 'light' : 'dark');
      
      const p = board[dr][dc];
      if (p) sq.textContent = p;
      
      // Visual feedback for selection
      if (sel && sel[0] === dr && sel[1] === dc) {
        sq.classList.add('selected');
      }
      
      // Visual feedback for last move squares
      if (lastMove && ((lastMove[0] === dr && lastMove[1] === dc) || (lastMove[2] === dr && lastMove[3] === dc))) {
        sq.classList.add('last-move');
      }
      
      sq.onclick = () => clickSquare(dr, dc);
      bd.appendChild(sq);
    }
  }
}

function isWhite(p) {
  return WHITE_PIECES.includes(p);
}

function isBlack(p) {
  return BLACK_PIECES.includes(p);
}

function clickSquare(r, c) {
  const p = board[r][c];
  const statusEl = $('chess-status');

  if (sel) {
    const [sr, sc] = sel;
    
    // De-select piece if clicked again
    if (sr === r && sc === c) {
      sel = null;
      renderChess();
      return;
    }
    
    // Execute move
    board[r][c] = board[sr][sc];
    board[sr][sc] = null;
    lastMove = [sr, sc, r, c];
    sel = null;
    
    if (statusEl) {
      statusEl.textContent = `Moved to ${String.fromCharCode(97 + c)}${8 - r}`;
    }
    renderChess();
    return;
  }
  
  if (p) {
    sel = [r, c];
    if (statusEl) {
      statusEl.textContent = `Selected ${p} at ${String.fromCharCode(97 + c)}${8 - r}`;
    }
    renderChess();
  }
}

function initChess() {
  resetChess();
}
