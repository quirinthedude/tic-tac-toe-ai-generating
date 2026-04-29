let field = [null, null, null, "Kreis", null, null, "Kreuz", null, null];
let lastChangedIndex = null;
let currentPlayer = "Kreis";
let winningLine = null;
let gameResult = null;

function init() {
  render();
}

function render() {
  let content = document.getElementById("content");

  let html = "<table>";

  for (let i = 0; i < 9; i++) {
    // neue Zeile alle 3 Felder
    if (i % 3 === 0) {
      html += "<tr>";
    }

    let symbol = "";

    if (field[i] === "Kreis") {
      symbol = getCircleSvg(i === lastChangedIndex);
    } else if (field[i] === "Kreuz") {
      symbol = getCrossSvg(i === lastChangedIndex);
    }

    if (field[i] === null) {
      html += `<td onclick="setField(${i})">${symbol}</td>`;
    } else {
      html += `<td>${symbol}</td>`;
    }

    // Zeile schließen
    if (i % 3 === 2) {
      html += "</tr>";
    }
  }

  html += "</table>";

  let lineSvg = "";

  if (winningLine) {
    lineSvg = getWinningLineSvg(winningLine);
  }

  let resultOverlay = getGameResultOverlay();

  content.innerHTML = `
<div style="position: relative; width: 300px; height: 300px;">
  ${html}
  ${lineSvg}
  ${resultOverlay}  
</div>
`;
}

function setField(index) {
  if (gameResult !== null) {
    return;
  }
  
  if (field[index] !== null) {
    return;
  }

  field[index] = currentPlayer;
  lastChangedIndex = index;

  if (checkGameOver()) {
    render();
    return;
  }

  // Spieler wechseln
  if (currentPlayer === "Kreis") {
    currentPlayer = "Kreuz";
  } else {
    currentPlayer = "Kreis";
  }

  render();
}

function checkGameOver() {
  let winningLines = [
    [0, 1, 2], // Zeile 1
    [3, 4, 5], // Zeile 2
    [6, 7, 8], // Zeile 3
    [0, 3, 6], // Spalte 1
    [1, 4, 7], // Spalte 2
    [2, 5, 8], // Spalte 3
    [0, 4, 8], // Diagonale von oben links nach unten rechts
    [2, 4, 6], // Diagonale von oben rechts nach unten links
  ];

  for (let line of winningLines) {
    let [a, b, c] = line;
    if (field[a] && field[a] === field[b] && field[a] === field[c]) {
      winningLine = line;
      gameResult = field[a];
      return field[a]; // Gewinner zurückgeben
    }

    if (field.every((cell) => cell !== null)) {
      gameResult = "Unentschieden";
      return "Unentschieden"; // Unentschieden
    }
  }

  return null; // Spiel läuft weiter
}

function resetGame() {
  field = [null, null, null, null, null, null, null, null, null];
  currentPlayer = 'Kreis';
  lastChangedIndex = null;
  winningLine = null;
  gameResult = null;
  render();
}

function getGameResultOverlay() {
  if (gameResult === null) {
    return '';
  }

  if (gameResult === 'Unentschieden') {
    return `
      <div class="result-overlay result-draw">
        Unentschieden
      </div>
    `;
  }

  return `
    <div class="result-overlay ${gameResult === 'Kreis' ? 'result-circle' : 'result-cross'}">
      ${gameResult} hat gewonnen
    </div>
  `;
}

function getCrossSvg(shouldAnimate) {
  let dashOffset = shouldAnimate ? "85" : "0";

  let animationLine1 = shouldAnimate
    ? `
        <animate 
          attributeName="stroke-dashoffset"
          from="85"
          to="0"
          dur="0.2s"
          fill="freeze" />
      `
    : "";
  let animationLine2 = shouldAnimate
    ? `
        <animate 
          attributeName="stroke-dashoffset"
          from="85"
          to="0"
          dur="0.2s"
          begin="0.2s"
          fill="freeze" />
      `
    : "";

  return `
    <svg viewBox="0 0 100 100" width="70" height="70" aria-hidden="true">
      
      <!-- Linie 1 -->
      <line 
        x1="20" y1="20" x2="80" y2="80"
        stroke="#ffcc00"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray="85"
        stroke-dashoffset="${dashOffset}"
      >
      ${animationLine1}
      </line>

      <!-- Linie 2 -->
      <line 
        x1="80" y1="20" x2="20" y2="80"
        stroke="#ffcc00"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray="85"
        stroke-dashoffset="${dashOffset}"
      >
        ${animationLine2}
      </line>

    </svg>
  `;
}

function getCircleSvg(shouldAnimate) {
  let animation = shouldAnimate
    ? `
      <animate 
        attributeName="stroke-dashoffset"
        from="201"
        to="0"
        dur="0.4s"
        fill="freeze" />
    `
    : "";

  let dashOffset = shouldAnimate ? "201" : "0";

  return `
    <svg viewBox="0 0 100 100" width="70" height="70" aria-hidden="true">
      <circle 
        cx="50" cy="50" r="32"
        fill="none"
        stroke="#00b0ff"
        stroke-width="8"
        stroke-linecap="round"
        stroke-dasharray="201"
        stroke-dashoffset="${dashOffset}"
      >
        ${animation}
      </circle>
    </svg>
  `;
}

function getWinningLineSvg(line) {
  const positions = [
    [50, 50],
    [150, 50],
    [250, 50],
    [50, 150],
    [150, 150],
    [250, 150],
    [50, 250],
    [150, 250],
    [250, 250],
  ];

  let [start, , end] = line;

  let [x1, y1] = positions[start];
  let [x2, y2] = positions[end];

  return `
    <svg style="
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
    " width="300" height="300">
      <line 
        x1="${x1}" y1="${y1}" 
        x2="${x2}" y2="${y2}"
        stroke="white"
        stroke-width="5"
        stroke-linecap="round"
      />
    </svg>
  `;
}

