// 8x8 grid using all theme words and spangram, row by row
const themeWords = [
  "TEACHER", "MUSICIAN", "CHEF", "ENTREPRENEUR", "BAROWNER", "CONSULTANT", "THIRTYSIX", "LAWYER"
];
const spangram = "THIRTYSIX";

// Concatenate all words into a single string
const allLetters = themeWords.join("").toUpperCase();

// Build 8x8 grid
const gridLetters = [];
for (let r = 0; r < 8; r++) {
  gridLetters.push([]);
  for (let c = 0; c < 8; c++) {
    gridLetters[r].push(allLetters[r * 8 + c]);
  }
}

const foundWords = [];
let selected = [];

const grid = document.getElementById("strands-grid");
const message = document.getElementById("strands-message");

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

function selectTile(r, c, tile) {
  // Only allow adjacent selection
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
    if (foundWords.length === themeWords.length) {
      message.textContent = "You found all the theme words!";
    }
  } else if (word === spangram) {
    message.textContent = "You found the spangram!";
    selected = [];
    renderGrid();
  }
}

renderGrid();
