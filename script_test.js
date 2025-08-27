const products = [
  { img: "afbeeldingen/model.jpg", label: "Men" },
  { img: "afbeeldingen/model.jpg", label: "Women" },
  { img: "afbeeldingen/model.jpg", label: "Children" },
  { img: "afbeeldingen/model.jpg", label: "Discover" },
  { img: "afbeeldingen/model1.JPG", label: "5" },
  { img: "afbeeldingen/model1.JPG", label: "6" },
  { img: "afbeeldingen/model1.JPG", label: "7" },
  { img: "afbeeldingen/model1.JPG", label: "8" },
  { img: "afbeeldingen/model1.JPG", label: "9" },
  { img: "afbeeldingen/model1.JPG", label: "10" },
  { img: "afbeeldingen/model1.JPG", label: "11" },
  { img: "afbeeldingen/model1.JPG", label: "12" }
];

// --- Elementen & state ---
const grid   = document.getElementById("productGrid");
const spacer = document.getElementById("scrollSpacer");

let index = 0;              // volgende startindex in products
const batchSize = 4;        // altijd 4 per keer
let gestureLock = false;    // voorkomt meerdere batches per scroll-actie
let wheelIdleTimer = null;  // om "actie afgelopen" te detecteren
let touchStartY = null;     // voor touch richting

// --- Batch laden (exact 4) ---
function loadBatch() {
  if (index >= products.length) return;

  const slice = products.slice(index, index + batchSize);
  slice.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    grid.appendChild(div);
    requestAnimationFrame(() => div.classList.add("loaded"));
  });

  index += batchSize;

  // Als alles geladen is, spacer weghalen (dan stopt de pagina netjes)
  if (index >= products.length) {
    spacer.style.display = "none";
  }
}

// --- Init: begin met 4 ---
loadBatch();

// --- Helper: één batch per scroll-actie ---
function triggerNextBatchOnce() {
  if (index >= products.length) return;
  if (gestureLock) return;

  gestureLock = true;
  loadBatch();

  // "actie is voorbij" zodra er even geen scroll/wheel meer komt
  clearTimeout(wheelIdleTimer);
  wheelIdleTimer = setTimeout(() => {
    gestureLock = false;
  }, 250); // 250ms zonder input = volgende actie toegestaan
}

// --- Muiswiel (desktop/trackpad) ---
window.addEventListener("wheel", (e) => {
  // Alleen bij naar beneden scrollen
  if (e.deltaY > 0) {
    triggerNextBatchOnce();
  }
}, { passive: true });

// --- Toetsenbord: PgDown, Space, ArrowDown (= ook "1 scroll-actie") ---
window.addEventListener("keydown", (e) => {
  const keys = ["PageDown", "ArrowDown", " ", "Spacebar"]; // " " voor sommige browsers
  if (keys.includes(e.key)) {
    triggerNextBatchOnce();
  }
});

// --- Touch (mobiel): swipe omhoog = naar beneden scrollen ---
window.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches.length) {
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener("touchend", (e) => {
  if (touchStartY == null) return;
  const endY = (e.changedTouches && e.changedTouches.length)
    ? e.changedTouches[0].clientY
    : touchStartY;

  const delta = touchStartY - endY; // positief = swipe omhoog (naar beneden scrollen)
  if (delta > 15) { // kleine drempel om tikjes te negeren
    triggerNextBatchOnce();
  }
  touchStartY = null;
}, { passive: true });

// --- (optioneel) pijltjes omhoog/omlaag onderscheid ---
// Als je ECHT alleen bij omlaag wil laden, laat bovenstaande zo.
// Wil je ook bij omhoog niets doen: huidige code doet al niets bij omhoog.
