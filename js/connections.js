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
  // Show solved groups at the top
  board.innerHTML = "";
  if (foundGroups.length === 4) {
    // All groups found: show summary rectangles
    solvedGroups.forEach(group => {
      const summaryDiv = document.createElement("div");
      summaryDiv.className = `connections-summary cat-${group.color}`;
      summaryDiv.innerHTML = `
        <div class="connections-summary-words">${group.words.join(", ")}</div>
        <div class="connections-summary-theme">${connectionsData.categories.find(c => c.color === group.color).name}</div>
      `;
      board.appendChild(summaryDiv);
    });
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
    message.innerHTML = `Group found: <strong>${match.name}</strong>`;
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

// Add CSS for summary rectangles
const style = document.createElement('style');
style.innerHTML = `
.connections-summary {
  width: 100%;
  max-width: 420px;
  margin: 10px auto;
  padding: 1.2em 1em 0.7em 1em;
  border-radius: 14px;
  font-size: 1.1em;
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.connections-summary-words {
  font-weight: bold;
  font-size: 1.15em;
  margin-bottom: 0.4em;
}
.connections-summary-theme {
  font-size: 0.98em;
  opacity: 0.85;
  margin-bottom: 0.1em;
}
`;
document.head.appendChild(style);

renderBoard();
updateLives();