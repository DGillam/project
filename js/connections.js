const connectionsData = {
  categories: [
    {
      name: "Animals marking your skin",
      words: ["Beluga", "Bear", "Bird", "Rat"]
    },
    {
      name: "Little Plushies that love you",
      words: ["Fox", "Pig", "Seal", "Hippo"]
    },
    {
      name: "Things That Hang from your ears",
      words: ["Fish", "Eye", "Hoop", "China"]
    },
    {
      name: "A few of your favourite things",
      words: ["Change1", "Change2", "Hortensia", "Burgundy"]
    }
  ]
};

let selectedWords = [];
let foundGroups = [];
let guessesLeft = 4;

const board = document.getElementById("connections-board");
const message = document.getElementById("connections-message");
const lives = document.getElementById("connections-lives");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function renderBoard() {
  const words = connectionsData.categories.flatMap(cat => cat.words);
  shuffle(words);
  board.innerHTML = "";
  words.forEach(word => {
    const btn = document.createElement("button");
    btn.className = "connection-tile";
    btn.textContent = word;
    btn.onclick = () => toggleWord(word, btn);
    board.appendChild(btn);
  });
}

function toggleWord(word, btn) {
  if (selectedWords.includes(word)) {
    selectedWords = selectedWords.filter(w => w !== word);
    btn.classList.remove("selected");
  } else {
    if (selectedWords.length === 4) return;
    selectedWords.push(word);
    btn.classList.add("selected");
    if (selectedWords.length === 4) checkGuess();
  }
}

function checkGuess() {
  const match = connectionsData.categories.find(cat =>
    cat.words.every(w => selectedWords.includes(w))
  );

  if (match && !foundGroups.includes(match.name)) {
    foundGroups.push(match.name);
    highlightGroup("correct", match.words);
    message.innerHTML = `✅ Group found: <strong>${match.name}</strong>`;
  } else {
    guessesLeft--;
    highlightGroup("incorrect", selectedWords);
    message.innerHTML = `❌ Nope! Tries left: ${guessesLeft}`;
    if (guessesLeft === 0) {
      endGame();
    }
  }

  selectedWords = [];
  updateLives();
}

function highlightGroup(className, words) {
  const tiles = document.querySelectorAll(".connection-tile");
  tiles.forEach(tile => {
    if (words.includes(tile.textContent)) {
      tile.classList.add(className);
      tile.disabled = true;
    }
  });
}

function updateLives() {
  lives.innerHTML = "❤️ ".repeat(guessesLeft);
}

function endGame() {
  const remaining = connectionsData.categories
    .filter(cat => !foundGroups.includes(cat.name))
    .map(cat => `<strong>${cat.name}</strong>: ${cat.words.join(", ")}`)
    .join("<br>");
  message.innerHTML = `Game over!<br>${remaining}`;
  const tiles = document.querySelectorAll(".connection-tile");
  tiles.forEach(tile => tile.disabled = true);
}

renderBoard();
updateLives();
