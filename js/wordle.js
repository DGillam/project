const answer = "TAILS";
let currentRow = 0;
let currentGuess = "";
const letterStatus = {}; // track letter states
let gameOver = false;
let keyButtons = {};

const board = document.getElementById("wordle-board");
const messageEl = document.getElementById("message");

// Create 6 rows
for (let i = 0; i < 6; i++) {
  const row = document.createElement("div");
  row.className = "row";
  for (let j = 0; j < 5; j++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    row.appendChild(tile);
  }
  board.appendChild(row);
}

// --- Keyboard Layout ---
const keyboardRows = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['ENTER','Z','X','C','V','B','N','M','DEL']
];

function renderKeyboard() {
  keyButtons = {};
  const keyboard = document.getElementById('keyboard');
  keyboard.innerHTML = '';
  keyboardRows.forEach((row, rowIdx) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    row.forEach((key, i) => {
      const keyBtn = document.createElement('button');
      keyBtn.className = 'key';
      keyBtn.textContent = key === 'ENTER' ? 'Enter' : (key === 'DEL' ? 'Del' : key);
      if (key === 'ENTER') keyBtn.classList.add('enter');
      if (key === 'DEL') keyBtn.classList.add('del');
      keyBtn.setAttribute('data-key', key);
      keyBtn.onclick = () => handleKey(key);
      rowDiv.appendChild(keyBtn);
      if (key.length === 1 && key >= 'A' && key <= 'Z') {
        keyButtons[key] = keyBtn;
      }
    });
    keyboard.appendChild(rowDiv);
  });
}

function handleKey(key) {
  if (gameOver) return;
  if (key === 'ENTER') {
    submitGuess();
  } else if (key === 'DEL') {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.slice(0, -1);
      updateTiles();
    }
  } else {
    pressKey(key);
  }
}

function pressKey(letter) {
  if (gameOver) return;
  if (currentGuess.length < 5) {
    currentGuess += letter;
    updateTiles();
  }
}

function updateTiles() {
  const row = board.children[currentRow];
  for (let i = 0; i < 5; i++) {
    row.children[i].textContent = currentGuess[i] || "";
  }
}

function submitGuess() {
  if (gameOver) return;
  if (currentGuess.length !== 5) return;

  const row = board.children[currentRow];
  const guess = currentGuess.toUpperCase();
  const answerArr = answer.split("");

  for (let i = 0; i < 5; i++) {
    const tile = row.children[i];
    const letter = guess[i];

    if (letter === answer[i]) {
      tile.classList.add("correct");
      updateKeyColor(letter, "correct");
    } else if (answer.includes(letter)) {
      tile.classList.add("present");
      updateKeyColor(letter, "present");
    } else {
      tile.classList.add("absent");
      updateKeyColor(letter, "absent");
    }
  }

  if (guess === answer) {
    messageEl.innerHTML = `<strong>Clever Seal, you cracked it!</strong><br>A memory of our very first conversation:<br>"If you could have any animal tail, which would it be and why?"`;
    gameOver = true;
  } else if (currentRow === 5) {
    messageEl.innerHTML = `<strong>Still my favorite Seal, even if you didn’t guess it.</strong><br>A memory of our very first conversation:<br>"If you could have any animal tail, which would it be and why?"`;
    gameOver = true;
  } else {
    currentRow++;
    currentGuess = "";
    updateTiles(); // Ensure next row is ready for input
  }
}

function updateKeyColor(letter, status) {
  const priority = { absent: 0, present: 1, correct: 2 };
  if (!letterStatus[letter] || priority[status] > priority[letterStatus[letter]]) {
    letterStatus[letter] = status;
    const key = keyButtons[letter];
    key.classList.remove("correct", "present", "absent");
    key.classList.add(status);
  }
}

// Call renderKeyboard() after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  renderKeyboard();
  // Add physical keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    let key = e.key.toUpperCase();
    if (key === 'BACKSPACE') key = 'DEL';
    if (key === 'ENTER') key = 'ENTER';
    if (key.length === 1 && key >= 'A' && key <= 'Z') {
      handleKey(key);
      e.preventDefault();
    } else if (key === 'ENTER' || key === 'DEL') {
      handleKey(key);
      e.preventDefault();
    }
  });
});