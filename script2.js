// Alle boodschappen die je wilt tonen
const messages = [
  "Welkom bij onze webshop!",
  "Gratis verzending vanaf €50",
  "Vandaag: 10% korting op alle tassen",
  "Nieuw binnen: lente collectie 🌸",
  "Sign up to recieve 15% off on your next order!",
  "Free shipping on orders above €150",
  "Sign up to our community newsletter!"
];

const infoMessage = document.getElementById('infoMessage');
let msgIndex = 0;

function showNextMessage() {
  // Verberg huidige tekst
  infoMessage.classList.add('hidden');

  // Wacht tot fade-out klaar is (500ms uit CSS)
  setTimeout(() => {
    // Nieuwe boodschap instellen
    msgIndex = (msgIndex + 1) % messages.length;
    infoMessage.textContent = messages[msgIndex];

    // Fade-in
    infoMessage.classList.remove('hidden');
  }, 500);
}

// Elke 4 seconden wisselen van boodschap
setInterval(showNextMessage, 4000);

const products = [
  { img: "afbeeldingen/model.jpg", label: "Men" },
  { img: "afbeeldingen/model.jpg", label: "Women" },
  { img: "afbeeldingen/model.jpg", label: "Children" },
  { img: "afbeeldingen/model.jpg", label: "Discover" },
  { img: "afbeeldingen/Black square_test.png", label: "5" },
  { img: "afbeeldingen/model.jpg", label: "6" },
  { img: "afbeeldingen/model.jpg", label: "7" },
  { img: "afbeeldingen/model.jpg", label: "8" },
  { img: "afbeeldingen/model.jpg", label: "9" },
  { img: "afbeeldingen/model.jpg", label: "10" },
  { img: "afbeeldingen/model.jpg", label: "11" },
  { img: "afbeeldingen/model.jpg", label: "12" }
];

// aannemende dat `products` al gedefinieerd is
let index = 0;
const batchSize = 4;
const grid = document.getElementById("productGrid");
const section = document.getElementById("productSection");

// scroll accumulatie
let accumulatedDelta = 0;
const SCROLL_UNIT = 100; // 1 batch = 100 pixels, past zich aan
const TOUCH_UNIT = 50;

// render batch
function showBatch(startIndex) {
  grid.innerHTML = "";
  const slice = products.slice(startIndex, startIndex + batchSize);
  slice.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `<img src="${p.img}" alt="${p.label}"><div class="product-label">${p.label}</div>`;
    grid.appendChild(div);
    requestAnimationFrame(() => div.classList.add("loaded"));
  });
}
showBatch(index);

// trigger batch op/af
function triggerStep(direction) {
  if (direction === "down" && index + batchSize < products.length) {
    index += batchSize;
    showBatch(index);
  } else if (direction === "up" && index - batchSize >= 0) {
    index -= batchSize;
    showBatch(index);
  }
}

// ==================
// Muiswiel / touchpad
// ==================
section.addEventListener("wheel", e => {
  e.preventDefault();
  accumulatedDelta += e.deltaY;

  while (accumulatedDelta >= SCROLL_UNIT) {
    triggerStep("down");
    accumulatedDelta -= SCROLL_UNIT;
  }
  while (accumulatedDelta <= -SCROLL_UNIT) {
    triggerStep("up");
    accumulatedDelta += SCROLL_UNIT;
  }
}, { passive: false });

// ==================
// Pijltoetsen
// ==================
window.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") triggerStep("down");
  if (e.key === "ArrowUp") triggerStep("up");
});

// ==================
// Touch
// ==================
let touchStartY = null;
section.addEventListener("touchstart", e => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchmove", e => {
  if (touchStartY === null) return;
  const dy = touchStartY - e.touches[0].clientY;

  if (dy > TOUCH_UNIT) {
    triggerStep("down");
    touchStartY = e.touches[0].clientY;
  } else if (dy < -TOUCH_UNIT) {
    triggerStep("up");
    touchStartY = e.touches[0].clientY;
  }
}, { passive: false });

section.addEventListener("touchend", () => { touchStartY = null; });
