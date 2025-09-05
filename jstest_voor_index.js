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
let lock = false;
const LOCK_MS = 600;
const TOUCH_THRESHOLD = 20;

// ========================
// 3. Render batches
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

// Toon eerste batch bij load
showBatch(index);

// ========================
// 4. Carousel triggers
// ========================
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

function atBatch3() {
  return index >= products.length - batchSize;
}

// ========================
// 5. Smooth scroll helpers
// ========================
function scrollToExtraContent() {
  extraContent.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToBatch3() {
  section.scrollIntoView({ behavior: "smooth", block: "start" });
  index = products.length - batchSize;
  showBatch(index);
}

// ========================
// 6. Scroll & touch events
// ========================
let batch3Reached = false;
let extraScrollLock = false;

window.addEventListener("wheel", (e) => {
  const deltaY = e.deltaY;

  if (deltaY > 0) {
    if (index + batchSize < products.length) {
      e.preventDefault();
      triggerStep("down");
    } else {
      e.preventDefault();
      if (!batch3Reached) {
        index = products.length - batchSize;
        showBatch(index);
        batch3Reached = true;
        extraScrollLock = false;
      } else if (!extraScrollLock) {
        extraScrollLock = true;
        scrollToExtraContent();
      }
    }
  }

  if (deltaY < 0) {
    if (window.scrollY > section.offsetTop) {
      e.preventDefault();
      scrollToBatch3();
      extraScrollLock = false;
    } else {
      e.preventDefault();
      triggerStep("up");
      batch3Reached = false;
    }
  }
}, { passive: false });

window.addEventListener("keydown", e => {
  if (e.key === "ArrowDown") {
    if (!atBatch3()) triggerStep("down");
    else scrollToExtraContent();
  } else if (e.key === "ArrowUp") {
    if (window.scrollY > section.offsetTop) scrollToBatch3();
    else triggerStep("up");
  }
});

let touchStartY = null;

section.addEventListener("touchstart", e => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchmove", e => {
  if (touchStartY === null) return;
  const dy = touchStartY - e.touches[0].clientY;

  if (dy > TOUCH_THRESHOLD) {
    if (!atBatch3()) triggerStep("down");
    else scrollToExtraContent();
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) {
    if (window.scrollY > section.offsetTop) scrollToBatch3();
    else triggerStep("up");
    touchStartY = null;
  }
}, { passive: false });

section.addEventListener("touchend", () => { touchStartY = null; });