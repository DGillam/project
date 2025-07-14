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
  <div class="strands-theme-label">TODAY'S THEME</div>
  <div class="strands-theme-text"><strong>Mathieu through the years</strong></div>
`;
strandsContainer.insertBefore(themeBox, strandsContainer.firstChild.nextSibling);

const wordCount = document.createElement('div');
wordCount.id = 'strands-word-count';
wordCount.style.fontSize = '1.3em';
wordCount.style.margin = '1.2em 0 1em 0';
wordCount.innerHTML = `<strong>0 of 8</strong> theme words found.`;
strandsContainer.insertBefore(wordCount, document.getElementById('strands-grid'));

// --- JS: Live selected word display ---
// Add live word display above grid
let liveWordDisplay = document.getElementById('strands-live-word');
if (!liveWordDisplay) {
  liveWordDisplay = document.createElement('div');
  liveWordDisplay.id = 'strands-live-word';
  liveWordDisplay.style.fontSize = '1.3em';
  liveWordDisplay.style.margin = '0.7em 0 0.7em 0';
  liveWordDisplay.style.color = '#222';
  strandsContainer.insertBefore(liveWordDisplay, grid);
}

// Update word count and live word display color to match the title
wordCount.style.color = '#a0452e';
liveWordDisplay.style.color = '#a0452e';

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
      tile.onclick = () => {
        const idx = selected.findIndex(([sr, sc]) => sr === r && sc === c);
        if (idx !== -1) {
          // Deselect if already selected
          selected.splice(idx, 1);
        } else if (selected.length === 0 || isAdjacent(selected[selected.length-1], [r, c])) {
          selected.push([r, c]);
        }
        renderGrid();
        checkSelection();
      };
      if (selected.some(([sr, sc]) => sr === r && sc === c)) tile.classList.add("selected");
      if (foundWords.some(word => word.positions && word.positions.some(([wr, wc]) => wr === r && wc === c))) tile.classList.add("found");
      grid.appendChild(tile);
    }
  }
  // Draw connection lines for selected tiles
  drawConnectionLines(selected, '#4fc3f7');
  // Draw connection lines for found words
  foundWords.forEach(wordObj => {
    if (wordObj.positions && wordObj.positions.length > 1) {
      drawConnectionLines(wordObj.positions, '#7be07b');
    }
  });
  // Update live word display
  const liveWord = selected.map(([r, c]) => gridLetters[r][c]).join('');
  liveWordDisplay.textContent = liveWord ? liveWord : '';
}

function drawConnectionLines(positions, color) {
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
        svg.classList.add("strands-connection-line");
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

// Update word count when a word is found
function updateWordCount() {
  wordCount.innerHTML = `<strong>${foundWords.length} of 8</strong> theme words found.`;
}

function selectTile(r, c, tile) {
  // Allow diagonal and all adjacent selection
  if (selected.length === 0 || isAdjacent(selected[selected.length-1], [r, c])) {
    if (!selected.some(([sr, sc]) => sr === r && sc === c)) {
      selected.push([r, c]);
      renderGrid();
      checkSelection();
    }
  }
}

function isAdjacent([r1, c1], [r2, c2]) {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
}

function checkSelection() {
  const word = selected.map(([r, c]) => gridLetters[r][c]).join('');
  if (themeWords.includes(word) && !foundWords.some(w => w.word === word)) {
    foundWords.push({word, positions: [...selected]});
    message.textContent = `Found: ${word}`;
    selected = [];
    renderGrid();
    updateWordCount();
    if (foundWords.length === themeWords.length) {
      message.textContent = "You found all the theme words!";
    }
  } else if (word === spangram && selected.length === 9) {
    message.textContent = "You found the spangram!";
    selected = [];
    renderGrid();
  }
}

renderGrid();

// Add CSS for theme box and word count
const style = document.createElement('style');
style.innerHTML = `
.strands-theme-box {
  background: #e3f6fc;
  border-radius: 12px;
  padding: 0.7em 1.2em 0.9em 1.2em;
  margin-bottom: 1.2em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  text-align: left;
  width: 100%;
  max-width: 340px;
}
.strands-theme-label {
  color: #2a4d5b;
  font-size: 0.95em;
  font-weight: bold;
  letter-spacing: 0.04em;
  margin-bottom: 0.3em;
}
.strands-theme-text {
  font-size: 1.2em;
  color: #222;
}
#strands-word-count {
  color: #a0452e;
  text-align: left;
  margin-left: 0.2em;
}
#strands-live-word {
  color: #a0452e;
}
.strands-grid {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 1em 0.5em;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 0.18em;
  width: 320px;
  height: 320px;
  margin: 0 auto;
  position: relative;
}
.strands-tile {
  background: transparent;
  color: #222;
  border: none;
  font-size: 1.1rem;
  font-family: inherit;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}
.strands-tile.selected {
  background: none !important;
  color: #fff;
}
.strands-tile.found {
  background: none !important;
  color: #fff;
}
.strands-tile.selected::before,
.strands-tile.found::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1.4em;
  height: 1.4em;
  border-radius: 50%;
  z-index: -1;
}
.strands-tile.selected::before {
  background: #4fc3f7;
}
.strands-tile.found::before {
  background: #7be07b;
}
.strands-connection-line {
  position: absolute;
  pointer-events: none;
  z-index: 1;
}
@media (max-width: 500px) {
  .strands-grid {
    width: 98vw;
    height: 98vw;
    min-width: 220px;
    min-height: 220px;
    max-width: 98vw;
    max-height: 98vw;
    padding: 0.3em 0.1em;
  }
  .strands-theme-box {
    max-width: 98vw;
    font-size: 0.9em;
    padding: 0.5em 0.5em 0.7em 0.5em;
  }
  #strands-live-word {
    font-size: 1em;
  }
  .strands-tile {
    font-size: 0.8rem;
  }
  #strands-word-count {
    font-size: 1em;
  }
}
`;
document.head.appendChild(style);
