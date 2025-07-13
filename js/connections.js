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
let allWords = shuffle(connectionsData.categories.flatMap(cat => cat.words)); // shuffled once at start

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

function renderBoard(doShuffle = false) {
  board.innerHTML = "";
  // If game is over (win or lose), show all groups as colored tiles
  if (foundGroups.length === 4 || guessesLeft === 0) {
    connectionsData.categories.forEach(group => {
      const row = document.createElement("div");
      row.className = "connections-row";
      group.words.forEach(word => {
        const btn = document.createElement("button");
        btn.className = `connection-tile cat-${group.color}`;
        btn.textContent = word;
        btn.disabled = true;
        row.appendChild(btn);
      });
      // Add theme label below the row
      const theme = document.createElement("div");
      theme.className = "connections-summary-theme";
      theme.textContent = group.name;
      board.appendChild(row);
      board.appendChild(theme);
    });
    if (guessesLeft === 0 && foundGroups.length < 4) {
      const failMsg = document.createElement("div");
      failMsg.style.margin = "1.5em 0 0.5em 0";
      failMsg.style.fontWeight = "bold";
      failMsg.style.color = "#ffe8cc";
      failMsg.textContent = "Oh no! Better luck next year.";
      board.appendChild(failMsg);
    }
    return;
  }
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
  if (doShuffle) {
    allWords = shuffle(allWords.filter(word => !solvedWords.includes(word)));
  }
  const words = allWords.filter(word => !solvedWords.includes(word));
  const grid = document.createElement("div");
  grid.className = "connections-grid";
  words.forEach(word => {
    const btn = document.createElement("button");
    btn.className = "connection-tile";
    btn.textContent = word;
    btn.onclick = () => toggleWord(word, btn);
    if (selectedWords.includes(word)) btn.classList.add("selected");
    grid.appendChild(btn);
  });
  board.appendChild(grid);
}

function toggleWord(word, btn) {
  if (selectedWords.includes(word)) {
    selectedWords = selectedWords.filter(w => w !== word);
    btn.classList.remove("selected");
  } else {
    if (selectedWords.length === 4) return;
    selectedWords.push(word);
    btn.classList.add("selected");
    // Do not auto-submit; wait for submit button
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
    message.innerHTML = `<strong>${match.name}</strong>`;
    selectedWords = [];
    setTimeout(() => {
      renderBoard();
      if (foundGroups.length === 4) {
        message.innerHTML = "<strong>You found all the seal connections!</strong>";
      }
    }, 600);
  } else {
    guessesLeft--;
    highlightGroup("incorrect", selectedWords);
    message.innerHTML = `Nope! Mistakes left: ${guessesLeft}`;
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
  const seals = "🦭 ".repeat(guessesLeft);
  lives.innerHTML = `<span style="font-size:0.95em;">Mistakes remaining: ${seals}</span>`;
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

document.getElementById("shuffle-btn").onclick = () => {
  renderBoard(true); // pass true to shuffle
};
document.getElementById("deselect-btn").onclick = () => {
  selectedWords = [];
  renderBoard(false);
};
document.getElementById("submit-btn").onclick = () => {
  if (selectedWords.length === 4) {
    checkGuess();
  } else {
    message.innerHTML = "Select 4 tiles before submitting.";
  }
};

// Add or update this CSS for summary tiles and theme
const style = document.createElement('style');
style.innerHTML = `
.connections-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 0.2em;
  flex-wrap: wrap;
  width: 100%;
  max-width: 420px;
  box-sizing: border-box;
}
.connection-tile {
  word-break: break-word;
  white-space: normal;
  overflow-wrap: anywhere;
  text-overflow: ellipsis;
  max-width: 90px;
}
.connections-summary-theme {
  font-size: 0.98em;
  opacity: 0.85;
  margin-bottom: 1.2em;
  margin-top: 0.2em;
  text-align: center;
  max-width: 420px;
  word-break: break-word;
  white-space: normal;
}
.connections-container {
  max-width: 500px;
  margin: 20px auto 10px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.connections-controls {
  display: flex;
  gap: 0.7rem;
  justify-content: center;
  margin-top: 0.7rem;
  flex-wrap: wrap;
  max-width: 420px;
  width: 100%;
  box-sizing: border-box;
}
#connections-lives {
  margin-bottom: 0.5rem;
}
`;
document.head.appendChild(style);

renderBoard();
updateLives();