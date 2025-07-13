const connectionsData = {
  categories: [
    {
      name: "Animals marking your skin",
      words: ["Beluga", "Bear", "Bird", "Rat"],
      color: "green"
    },
    {
      name: "Little Plushies that love you",
      words: ["Fox", "Pig", "Seal", "Hippo"],
      color: "yellow"
    },
    {
      name: "Things That Hang from your ears",
      words: ["Fish", "Eye", "Hoop", "China"],
      color: "blue"
    },
    {
      name: "A few of your favourite things",
      words: ["Hortensia", "Burgundy", "Wine", "Music"],
      color: "purple"
    }
  ]
};

let selectedWords = [];
let foundGroups = [];
let guessesLeft = 4;
let solvedGroups = []; // Store solved groups for display

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
  // Show solved groups at the top
  board.innerHTML = "";
  solvedGroups.forEach(group => {
    const row = document.createElement("div");
    row.className = "connections-row";
    group.words.forEach(word => {
      const btn = document.createElement("button");
      btn.className = `connection-tile cat-${group.color}`;
      btn.textContent = word;
      btn.disabled = true;
      row.appendChild(btn);
    });
    board.appendChild(row);
  });

  // Remaining words
  const solvedWords = solvedGroups.flatMap(g => g.words);
  const words = connectionsData.categories.flatMap(cat => cat.words)
    .filter(word => !solvedWords.includes(word));
  shuffle(words);
  const row = document.createElement("div");
  row.className = "connections-row";
  words.forEach(word => {
    const btn = document.createElement("button");
    btn.className = "connection-tile";
    btn.textContent = word;
    btn.onclick = () => toggleWord(word, btn);
    if (selectedWords.includes(word)) btn.classList.add("selected");
    row.appendChild(btn);
  });
  board.appendChild(row);
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
    cat.words.every(w => selectedWords.includes(w)) &&
    !foundGroups.includes(cat.name)
  );

  if (match) {
    foundGroups.push(match.name);
    solvedGroups.push({ words: match.words, color: match.color });
    message.innerHTML = `✅ Group found: <strong>${match.name}</strong>`;
    selectedWords = [];
    setTimeout(() => {
      renderBoard();
      if (foundGroups.length === 4) {
        message.innerHTML = "<strong>You found all the connections!</strong>";
      }
    }, 600);
  } else {
    guessesLeft--;
    highlightGroup("incorrect", selectedWords);
    message.innerHTML = `❌ Nope! Tries left: ${guessesLeft}`;
    setTimeout(() => {
      clearIncorrectHighlight(selectedWords);
      selectedWords = [];
      renderBoard();
      if (guessesLeft === 0) {
        endGame();
      }
    }, 800);
  }
  updateLives();
}

function highlightGroup(className, words) {
  const tiles = document.querySelectorAll(".connection-tile");
  tiles.forEach(tile => {
    if (words.includes(tile.textContent)) {
      tile.classList.add(className);
    }
  });
}

function clearIncorrectHighlight(words) {
  const tiles = document.querySelectorAll(".connection-tile");
  tiles.forEach(tile => {
    if (words.includes(tile.textContent)) {
      tile.classList.remove("incorrect", "selected");
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