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
const section = document.getElementById("productSection");
const grid = document.getElementById("productGrid");

const batchSize = 4;
let index = 0;
let lock = false;

// Gevoelige instellingen
const SCROLL_THRESHOLD = 2;   // lager = gevoeliger
const TOUCH_THRESHOLD = 10;   // minder pixels nodig
const LOCK_MS = 800;          // langer slot → bijna onmogelijk overslaan

// Render batch
function showBatch(startIndex) {
  grid.innerHTML = "";
  const slice = products.slice(startIndex, startIndex + batchSize);
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
}
showBatch(index);

// Stap vooruit of achteruit
function triggerStep(direction) {
  if (lock) return;

  if (direction === "down" && index + batchSize < products.length) {
    index += batchSize;
    showBatch(index);
  } else if (direction === "up" && index - batchSize >= 0) {
    index -= batchSize;
    showBatch(index);
  }

  lock = true;
  setTimeout(() => (lock = false), LOCK_MS);
}

// ===================
// Events
// ===================

// Muiswiel / touchpad
section.addEventListener("wheel", (e) => {
  e.preventDefault();
  if (lock) return;

  if (e.deltaY > SCROLL_THRESHOLD) {
    triggerStep("down");
  } else if (e.deltaY < -SCROLL_THRESHOLD) {
    triggerStep("up");
  }
}, { passive: false });

// Pijltoetsen
window.addEventListener("keydown", (e) => {
  if (lock) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    triggerStep("down");
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    triggerStep("up");
  }
});

// Touch
let touchStartY = null;
section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) {
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (lock || touchStartY === null) return;

  const y = e.touches[0].clientY;
  const dy = touchStartY - y;

  if (dy > TOUCH_THRESHOLD) {
    e.preventDefault();
    triggerStep("down");
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) {
    e.preventDefault();
    triggerStep("up");
    touchStartY = null;
  }
}, { passive: false });

section.addEventListener("touchend", () => {
  touchStartY = null;
}, { passive: true });