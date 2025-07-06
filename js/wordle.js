
const answer = "TAILS";
let currentRow = 0;
let currentGuess = "";
const letterStatus = {}; // track letter states

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

const keyboard = document.getElementById("keyboard");
const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");
const keyButtons = {};

keys.forEach(letter => {
  const key = document.createElement("button");
  key.className = "key";
  key.textContent = letter;
  key.onclick = () => pressKey(letter);
  keyboard.appendChild(key);
  keyButtons[letter] = key;
});

const enterKey = document.createElement("button");
enterKey.className = "key";
enterKey.textContent = "Enter";
enterKey.onclick = submitGuess;
keyboard.appendChild(enterKey);

const delKey = document.createElement("button");
delKey.className = "key";
delKey.textContent = "Del";
delKey.onclick = () => {
  if (currentGuess.length > 0) {
    currentGuess = currentGuess.slice(0, -1);
    updateTiles();
  }
};
keyboard.appendChild(delKey);

function pressKey(letter) {
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
  } else if (currentRow === 5) {
    messageEl.innerHTML = `<strong>Still my favorite Seal, even if you didn’t guess it.</strong><br>A memory of our very first conversation:<br>"If you could have any animal tail, which would it be and why?"`;
  } else {
    currentRow++;
    currentGuess = "";
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