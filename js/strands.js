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

function renderGrid() {
  grid.innerHTML = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const tile = document.createElement("div");
      tile.className = "strands-tile";
      tile.textContent = gridLetters[r][c];
      tile.onclick = () => selectTile(r, c, tile);
      if (selected.some(([sr, sc]) => sr === r && sc === c)) tile.classList.add("selected");
      if (foundWords.some(word => word.positions && word.positions.some(([wr, wc]) => wr === r && wc === c))) tile.classList.add("found");
      grid.appendChild(tile);
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
  color: #222;
  text-align: left;
  margin-left: 0.2em;
}
.strands-grid {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1em 0.5em;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  gap: 0.2em;
  width: 340px;
  height: 340px;
  margin: 0 auto;
}
.strands-tile {
  background: transparent;
  color: #222;
  border: none;
  font-size: 1.3rem;
  font-family: inherit;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.strands-tile.selected {
  background: #ffe066;
  color: #4a1c1c;
  border-radius: 10px;
}
.strands-tile.found {
  background: #7be07b;
  color: #1d3b1d;
  border-radius: 10px;
}
`;
document.head.appendChild(style);
