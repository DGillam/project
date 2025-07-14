// 8x8 grid with words placed in a twisty, Strands-like fashion, allowing diagonal connections
const themeWords = [
  "TEACHER", "MUSICIAN", "CHEF", "ENTREPRENEUR", "BAROWNER", "CONSULTANT", "LAWYER"
];
const spangram = "THIRTYSIX";

// Twisty grid: words are hidden in various directions, spangram is unique
const gridLetters = [
  ['L','R','E','R','T','E','A','C'],
  ['A','E','N','C','O','N','S','H'],
  ['W','Y','W','O','T','L','U','E'],
  ['T','H','B','A','R','A','N','R'],
  ['E','I','R','T','Y','S','I','T'],
  ['N','T','R','E','M','C','H','X'],
  ['N','E','R','P','U','F','E','N'],
  ['E','U','R','S','I','C','I','A']
];

const foundWords = [];
let selected = [];

const grid = document.getElementById("strands-grid");
const message = document.getElementById("strands-message");

// Add theme box and word count display
const strandsContainer = document.querySelector('.strands-container');
const themeBox = document.createElement('div');
themeBox.className = 'strands-theme-box';
themeBox.innerHTML = `
  <div class="strands-theme-label" style="text-align:center;">TODAY'S THEME</div>
  <div class="strands-theme-text" style="text-align:center;"><strong>Mathieu through the years</strong></div>
`;
strandsContainer.insertBefore(themeBox, strandsContainer.firstChild.nextSibling);

const wordCount = document.createElement('div');
wordCount.id = 'strands-word-count';
wordCount.style.fontSize = '1.3em';
wordCount.style.margin = '1.2em 0 1em 0';
wordCount.innerHTML = `<strong>0 of 8</strong> theme words found.`;
strandsContainer.insertBefore(wordCount, document.getElementById('strands-grid'));

// --- JS: NYT-style selection and submission ---
let lastFoundWord = '';
let selectionState = 'idle'; // idle, selecting, submitted, invalid
let lastSelected = null;

// Fix: Ensure liveWordDisplay is defined
let liveWordDisplay = document.getElementById('strands-live-word');
if (!liveWordDisplay) {
  liveWordDisplay = document.createElement('div');
  liveWordDisplay.id = 'strands-live-word';
  liveWordDisplay.style.margin = '1em 0 0.5em 0';
  liveWordDisplay.style.fontSize = '1.3em';
  liveWordDisplay.style.fontWeight = 'bold';
  liveWordDisplay.style.letterSpacing = '0.04em';
  liveWordDisplay.style.textAlign = 'center';
  liveWordDisplay.style.color = '#fff5e1';
  strandsContainer.insertBefore(liveWordDisplay, grid);
}

function renderGrid() {
  grid.innerHTML = "";
  // Remove old lines
  const oldLines = document.querySelectorAll('.strands-connection-line');
  oldLines.forEach(line => line.remove());
  // Render tiles
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const tile = document.createElement("div");
      tile.className = "strands-tile";
      tile.textContent = gridLetters[r][c];
      tile.onclick = () => selectTile(r, c, tile);
      // Add selection circle for selected tiles (no number)
      const selIdx = selected.findIndex(([sr, sc]) => sr === r && sc === c);
      if (selIdx !== -1) {
        tile.classList.add("selected");
      }
      foundWords.forEach(wordObj => {
        if (wordObj.positions && wordObj.positions.some(([wr, wc]) => wr === r && wc === c)) {
          if (wordObj.type === 'theme') tile.classList.add('found', 'theme');
          if (wordObj.type === 'spangram') tile.classList.add('found', 'spangram');
        }
      });
      grid.appendChild(tile);
    }
  }
  // Draw connection lines for selected tiles
  if (selected.length > 1 && selectionState === 'selecting') {
    drawConnectionLines(selected, '#fff5e1', 'selected');
  }
  // Draw connection lines for found words
  foundWords.forEach(wordObj => {
    if (wordObj.positions && wordObj.positions.length > 1) {
      if (wordObj.type === 'theme') drawConnectionLines(wordObj.positions, '#b3e5fc', 'theme');
      if (wordObj.type === 'spangram') drawConnectionLines(wordObj.positions, '#fff9c4', 'spangram');
    }
  });
  // Update live word display
  const liveWord = selected.map(([r, c]) => gridLetters[r][c]).join('');
  if (selectionState === 'invalid') {
    liveWordDisplay.classList.add('shake');
    setTimeout(() => liveWordDisplay.classList.remove('shake'), 400);
  }
  if (liveWord) {
    liveWordDisplay.textContent = liveWord;
    lastFoundWord = '';
  } else if (lastFoundWord) {
    liveWordDisplay.textContent = lastFoundWord;
  } else {
    liveWordDisplay.textContent = '';
  }
}

function drawConnectionLines(positions, color, type) {
  if (positions.length > 1) {
    for (let i = 0; i < positions.length - 1; i++) {
      const [r1, c1] = positions[i];
      const [r2, c2] = positions[i+1];
      const tile1 = grid.children[r1*8 + c1];
      const tile2 = grid.children[r2*8 + c2];
      if (tile1 && tile2) {
        const rect1 = tile1.getBoundingClientRect();
        const rect2 = tile2.getBoundingClientRect();
        const gridRect = grid.getBoundingClientRect();
        const x1 = rect1.left + rect1.width/2 - gridRect.left;
        const y1 = rect1.top + rect1.height/2 - gridRect.top;
        const x2 = rect2.left + rect2.width/2 - gridRect.left;
        const y2 = rect2.top + rect2.height/2 - gridRect.top;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add("strands-connection-line", type);
        svg.style.left = "0";
        svg.style.top = "0";
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.position = "absolute";
        svg.style.zIndex = "1";
        svg.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="6" stroke-linecap="round" />`;
        grid.appendChild(svg);
      }
    }
  }
}

function submitSelection() {
  const word = selected.map(([r, c]) => gridLetters[r][c]).join('');
  if (themeWords.includes(word) && !foundWords.some(w => w.word === word)) {
    foundWords.push({word, positions: [...selected], type: 'theme'});
    lastFoundWord = word;
    selected = [];
    selectionState = 'submitted';
    renderGrid();
    updateWordCount();
    if (foundWords.length === themeWords.length) {
      message.textContent = "You found all the theme words!";
    }
  } else if (word === spangram && selected.length === 9 && !foundWords.some(w => w.word === word)) {
    foundWords.push({word, positions: [...selected], type: 'spangram'});
    lastFoundWord = word;
    selected = [];
    selectionState = 'submitted';
    renderGrid();
  } else {
    selectionState = 'invalid';
    selected = [];
    renderGrid();
    setTimeout(() => { selectionState = 'idle'; renderGrid(); }, 400);
  }
}

// Update word count when a word is found
function updateWordCount() {
  wordCount.innerHTML = `<strong>${foundWords.length} of 8</strong> theme words found.`;
}

function selectTile(r, c, tile) {
  if (selected.length > 0 && selected[selected.length-1][0] === r && selected[selected.length-1][1] === c) {
    // Submit word if last letter clicked again
    submitSelection();
    return;
  }
  const idx = selected.findIndex(([sr, sc]) => sr === r && sc === c);
  if (idx !== -1) {
    // Only allow deselection (backtracking) of the last selected tile
    if (idx === selected.length - 1) {
      selected.pop();
    } else {
      // Invalid move: trying to deselect a non-last tile, show shake feedback
      selectionState = 'invalid';
      renderGrid();
      setTimeout(() => { selectionState = 'idle'; renderGrid(); }, 400);
      return;
    }
  } else if (selected.length === 0 || isAdjacent(selected[selected.length-1], [r, c])) {
    selected.push([r, c]);
  } else {
    // Invalid move: trying to select a non-adjacent tile, show shake feedback
    selectionState = 'invalid';
    renderGrid();
    setTimeout(() => { selectionState = 'idle'; renderGrid(); }, 400);
    return;
  }
  selectionState = 'selecting';
  renderGrid();
}

function isAdjacent([r1, c1], [r2, c2]) {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
}

function checkSelection() {
  const word = selected.map(([r, c]) => gridLetters[r][c]).join('');
  if (themeWords.includes(word) && !foundWords.some(w => w.word === word)) {
    foundWords.push({word, positions: [...selected]});
    // Remove message for found word
    message.textContent = '';
    lastFoundWord = word;
    selected = [];
    renderGrid();
    updateWordCount();
    if (foundWords.length === themeWords.length) {
      message.textContent = "You found all the theme words!";
    }
  } else if (word === spangram && selected.length === 9) {
    message.textContent = "You found the spangram!";
    lastFoundWord = word;
    selected = [];
    renderGrid();
  }
}

renderGrid();

// Update CSS for centering
const style = document.createElement('style');
style.innerHTML = `
.strands-theme-box {
  background: #e3f6fc;
  border-radius: 12px;
  padding: 0.7em 1.2em 0.9em 1.2em;
  margin-bottom: 1.2em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  text-align: center;
  width: 100%;
  max-width: 340px;
  margin-left: auto;
  margin-right: auto;
}
.strands-theme-label {
  color: #2a4d5b;
  font-size: 0.95em;
  font-weight: bold;
  letter-spacing: 0.04em;
  margin-bottom: 0.3em;
  text-align: center;
}
.strands-theme-text {
  font-size: 1.2em;
  color: #222;
  text-align: center;
}
#strands-word-count, #strands-live-word {
  color: #fff5e1 !important;
  font-weight: bold;
  text-shadow: 0 1px 4px #a0452e;
}
.strands-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 0.18em;
  width: min(90vw, 400px);
  height: min(90vw, 400px);
  margin: 0 auto;
  position: relative;
  background: none !important;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
}
.strands-tile {
  width: 100%;
  height: 100%;
  background: none !important;
  border: none !important;
  box-shadow: none !important;
  color: #222;
  font-size: 1.7rem;
  font-family: inherit;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  color: #fff5e1;
  transition: color 0.2s;
}
.strands-tile.selected,
.strands-tile.found,
.strands-tile.selected.found,
.strands-tile.selected.theme,
.strands-tile.selected.spangram,
.strands-tile.found.theme,
.strands-tile.found.spangram {
  color: #222 !important;
}
.strands-tile.selected::before,
.strands-tile.found::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1.3em;
  height: 1.3em;
  border-radius: 50%;
  background: #fff5e1 !important;
  border: 2px solid #e3cfa1;
  z-index: 1;
  box-shadow: 0 1px 6px #a0452e22;
  pointer-events: none;
  display: block;
}
.strands-tile.selected.found.theme::before,
.strands-tile.found.theme::before {
  background: #b3e5fc !important;
  border-color: #b3e5fc !important;
}
.strands-tile.selected.found.spangram::before,
.strands-tile.found.spangram::before {
  background: #fff9c4 !important;
  border-color: #fff9c4 !important;
}
.strands-tile.selected {
  z-index: 3;
}
.strands-connection-line {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
.strands-connection-line.selected {
  stroke: #fff5e1 !important;
}
.strands-connection-line.theme {
  stroke: #b3e5fc !important;
}
.strands-connection-line.spangram {
  stroke: #fff9c4 !important;
}
@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-8px); }
  80% { transform: translateX(8px); }
  100% { transform: translateX(0); }
}
#strands-live-word.shake {
  animation: shake 0.4s;
}
@media (max-width: 600px) {
  .strands-grid {
    width: 98vw;
    height: 98vw;
    max-width: 98vw;
    max-height: 98vw;
    min-width: 220px;
    min-height: 220px;
    padding: 0;
  }
  .strands-tile {
    font-size: 1rem;
  }
  .strands-tile.selected::before {
    width: 1.4em;
    height: 1.4em;
  }
}
`;
document.head.appendChild(style);
