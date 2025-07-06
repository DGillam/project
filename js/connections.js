const connectionsCategories = [
  {
    name: "Animals marking your skin",
    words: ["Beluga", "Bear", "Bird", "Rat"],
    difficulty: 2
  },
  {
    name: "Little Plushies that love you",
    words: ["Fox", "Pig", "Seal", "Hippo"],
    difficulty: 1
  },
  {
    name: "Things That Hang from your ears",
    words: ["Fish", "Eye", "Hoop", "China"],
    difficulty: 3
  },
  {
    name: "A few of your favourite things",
    words: ["Hortensia", "Burgundy", "Wine", "Music"],
    difficulty: 4
  }
];

// Flatten and shuffle all words
let allWords = connectionsCategories.flatMap(cat => cat.words);
allWords = allWords
  .map(word => ({ word, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(obj => obj.word);

let selectedWords = [];
let foundCategories = [];
const board = document.getElementById("connections-board");
const message = document.getElementById("connections-message");

// Render word buttons
function renderBoard() {
  board.innerHTML = "";
  allWords.forEach(word => {
    const btn = document.createElement("button");
    btn.textContent = word;
    btn.className = "connections-word";
    btn.disabled = foundCategories.some(cat =>
      connectionsCategories.find(c => c.name === cat).words.includes(word)
    );
    if (selectedWords.includes(word)) btn.classList.add("selected");
    btn.onclick = () => selectWord(word);
    board.appendChild(btn);
  });
}

function selectWord(word) {
  if (selectedWords.includes(word)) {
    selectedWords = selectedWords.filter(w => w !== word);
  } else if (selectedWords.length < 4) {
    selectedWords.push(word);
  }
  renderBoard();
  if (selectedWords.length === 4) {
    setTimeout(checkSelection, 200);
  }
}

function checkSelection() {
  const match = connectionsCategories.find(cat =>
    cat.words.every(w => selectedWords.includes(w)) &&
    !foundCategories.includes(cat.name)
  );
  if (match) {
    foundCategories.push(match.name);
    message.textContent = `Correct! Category: ${match.name}`;
    // Optionally, highlight found words
  } else {
    message.textContent = "Not quite! Try again.";
  }
  selectedWords = [];
  renderBoard();
  if (foundCategories.length === 4) {
    message.innerHTML = "<strong>You found all the connections!</strong>";
  }
}

// Initial render
renderBoard();