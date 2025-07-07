
const groups = {
  "Little Plushies that love you": ["Fox", "Pig", "Seal", "Hippo"],
  "Animals marking your skin": ["Beluga", "Bear", "Bird", "Rat"],
  "Things That Hang from your ears": ["Fish", "Eye", "Hoop", "China"],
  "A few of your favourite things": ["Hortensia", "Burgundy", "Wine", "Music"]
};

const allWords = Object.values(groups).flat().sort(() => Math.random() - 0.5);
const selected = [];
const found = [];
const grid = document.getElementById("word-grid");
const feedback = document.getElementById("feedback");
const foundDiv = document.getElementById("found-groups");

allWords.forEach(word => {
  const div = document.createElement("div");
  div.className = "word";
  div.textContent = word;
  div.onclick = () => toggleWord(div);
  grid.appendChild(div);
});

function toggleWord(div) {
  const word = div.textContent;
  if (div.classList.contains("selected")) {
    div.classList.remove("selected");
    selected.splice(selected.indexOf(word), 1);
  } else if (selected.length < 4) {
    div.classList.add("selected");
    selected.push(word);
  }
}

document.getElementById("submit-btn").onclick = () => {
  if (selected.length !== 4) {
    feedback.textContent = "Select exactly 4 words.";
    return;
  }

  let matchedGroup = null;
  for (const [groupName, words] of Object.entries(groups)) {
    if (words.every(w => selected.includes(w))) {
      matchedGroup = groupName;
      break;
    }
  }

  if (matchedGroup) {
    feedback.textContent = `✅ Group found: ${matchedGroup}`;
    found.push(...selected);
    const groupEl = document.createElement("p");
    groupEl.textContent = `${matchedGroup}: ${selected.join(", ")}`;
    foundDiv.appendChild(groupEl);
    selected.forEach(word => {
      const el = Array.from(document.querySelectorAll(".word")).find(d => d.textContent === word);
      if (el) el.remove();
    });
    selected.length = 0;

    if (found.length === 16) {
      feedback.innerHTML = "🎉 All groups found! You really *know* this Seal.<br><em>Just like our little plushies know us.</em>";
    }
  } else {
    feedback.textContent = "❌ Nope — try a different combo.";
    document.querySelectorAll(".selected").forEach(el => el.classList.remove("selected"));
    selected.length = 0;
  }
};
