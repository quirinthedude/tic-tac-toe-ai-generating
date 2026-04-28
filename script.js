let field = [null, null, null, "Kreis", null, null, "Kreuz", null, null];
let lastChangedIndex = null;
let currentPlayer = 'Kreis';

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

  content.innerHTML = html;
}

function setField(index) {
  if (field[index] !== null) {
    return;
  }

  field[index] = currentPlayer;
  lastChangedIndex = index;

  // Spieler wechseln
  if (currentPlayer === 'Kreis') {
    currentPlayer = 'Kreuz';
  } else {
    currentPlayer = 'Kreis';
  }

  render();
}

function getCrossSvg(shouldAnimate) {
  let dashOffset = shouldAnimate ? '85' : '0';

        let animationLine1 = shouldAnimate ? `
        <animate 
          attributeName="stroke-dashoffset"
          from="85"
          to="0"
          dur="0.2s"
          fill="freeze" />
      ` 
      : '';
        let animationLine2 = shouldAnimate ? `
        <animate 
          attributeName="stroke-dashoffset"
          from="85"
          to="0"
          dur="0.2s"
          begin="0.2s"
          fill="freeze" />
      `
      : '';

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
    : '';

  let dashOffset = shouldAnimate ? '201' : '0';

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