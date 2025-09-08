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
  { img: "afbeeldingen/model.jpg", label: "Women", link: "women.html" },
  { img: "afbeeldingen/model.jpg", label: "Children", link: "children.html" },
  { img: "afbeeldingen/boom.jpg", label: "Discover" },
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
const extraContent = document.querySelector("#extraContent");

let index = 0;
const batchSize = 4;
const LOCK_MS = 700; // iets ruimer voor touchpad
const TOUCH_THRESHOLD = 20;

let globalLock = false;
let scrollStage = "batch"; // "batch" of "extra"

// ========================
// 4. Batches renderen
// ========================
function showBatch(startIndex) {
  grid.innerHTML = "";
  const slice = products.slice(startIndex, startIndex + batchSize);

  slice.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";

    if (p.link) {
      div.innerHTML = `
        <a href="${p.link}" style="display:block;text-decoration:none;color:inherit;">
          <img src="${p.img}" alt="${p.label}">
          <div class="product-label">${p.label}</div>
        </a>
      `;
    } else {
      div.innerHTML = `
        <img src="${p.img}" alt="${p.label}">
        <div class="product-label">${p.label}</div>
      `;
    }

    grid.appendChild(div);
    requestAnimationFrame(() => div.classList.add("loaded"));
  });
}
showBatch(index);

// ========================
// 5. Helpers
// ========================
function lockGlobal() {
  globalLock = true;
  setTimeout(() => { globalLock = false; }, LOCK_MS);
}

function atLastBatch() {
  return index >= products.length - batchSize;
}

function goToNextBatch() {
  if (!atLastBatch()) {
    index += batchSize;
    showBatch(index);
  }
}

function goToPrevBatch() {
  if (index - batchSize >= 0) {
    index -= batchSize;
    showBatch(index);
  }
}

function goToExtraContent() {
  extraContent.scrollIntoView({ behavior: "smooth", block: "start" });
  scrollStage = "extra";
}

function goToBatch3() {
  index = products.length - batchSize;
  showBatch(index);
  window.scrollTo({ top: section.offsetTop, behavior: "smooth" });
  scrollStage = "batch";
}

// ========================
// 6. Scroll controller
// ========================
function handleScroll(direction) {
  if (globalLock) return;
  lockGlobal();

  if (direction === "down") {
    if (scrollStage === "batch") {
      if (!atLastBatch()) {
        goToNextBatch();
      } else {
        goToExtraContent();
      }
    }
  } else if (direction === "up") {
    if (scrollStage === "extra") {
      goToBatch3();
    } else {
      goToPrevBatch();
    }
  }
}

// ========================
// 7. Event handlers
// ========================

// Wheel
window.addEventListener("wheel", (e) => {
  const deltaY = e.deltaY;
  if (Math.abs(deltaY) < 10) return; // mini scrolls negeren

  e.preventDefault();
  if (deltaY > 0) handleScroll("down");
  else handleScroll("up");
}, { passive: false });

// Keys
window.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") handleScroll("down");
  if (e.key === "ArrowUp") handleScroll("up");
});

// Touch
let touchStartY = null;
section.addEventListener("touchstart", e => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchend", e => {
  if (touchStartY === null) return;
  const dy = touchStartY - e.changedTouches[0].clientY;

  if (Math.abs(dy) > TOUCH_THRESHOLD) {
    if (dy > 0) handleScroll("down");
    else handleScroll("up");
  }
  touchStartY = null;
}, { passive: true });
