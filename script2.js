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

// Belangrijk: jouw HTML heeft geen id="extraContent" op die sectie.
// We vallen daarom automatisch terug op de *volgende* sectie na productSection.
const extraContent =
  document.getElementById("extraContent") ||
  (section ? section.nextElementSibling : null);

const headerEl = document.querySelector("header");
const infoBarEl = document.querySelector(".info-bar");

let index = 0;
const batchSize = 4;

let lock = false;          // throttle 1 stap per interactie
let animating = false;     // tijdens smooth scroll alle input negeren
let carouselActive = true; // true = in carousel-fase, false = in extra content

// Tunables
const SCROLL_THRESHOLD = 28; // filtert touchpad-ruis
const LOCK_MS = 550;         // batch-schakel lock
const TOUCH_THRESHOLD = 36;  // swipe-drempel
const SMOOTH_MS = 650;       // duur smooth scroll (ms)

// ==============================
// 3) Helpers
// ==============================
function getTopY(el) {
  const rect = el.getBoundingClientRect();
  return rect.top + window.pageYOffset;
}

function totalTopBarsHeight() {
  const h = headerEl ? headerEl.offsetHeight : 0;
  const i = infoBarEl ? infoBarEl.offsetHeight : 0;
  return h + i;
}

function showBatch(startIndex) {
  grid.innerHTML = "";
  const slice = products.slice(startIndex, startIndex + batchSize);
  slice.forEach((p) => {
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

function atEndOfCarousel() {
  return index + batchSize >= products.length;
}
function atStartOfCarousel() {
  return index === 0;
}

function withLock(cb, ms = LOCK_MS) {
  lock = true;
  try { cb(); } finally {
    setTimeout(() => (lock = false), ms);
  }
}

function smoothScrollToY(y) {
  animating = true;
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  setTimeout(() => (animating = false), SMOOTH_MS);
}

// ==============================
// 4) Gedrags-functies (down/up)
// ==============================
function stepDownOrToExtra() {
  if (lock || animating) return;
  if (!atEndOfCarousel()) {
    withLock(() => {
      index += batchSize;
      showBatch(index);
    });
  } else if (extraContent) {
    // Smooth naar extra content (FIX: echte sectie selecteren)
    carouselActive = false;
    const target = getTopY(extraContent); // top van jouw extra content-sectie
    smoothScrollToY(target);
    withLock(() => {}, SMOOTH_MS); // blokkeer extra input tijdens animatie
  }
}

function stepUpOrToTopOrBackFromExtra() {
  if (lock || animating) return;

  if (carouselActive) {
    if (!atStartOfCarousel()) {
      withLock(() => {
        index -= batchSize;
        showBatch(index);
      });
    } else {
      // Helemaal terug naar boven (header/infobar)
      smoothScrollToY(0);
      withLock(() => {}, SMOOTH_MS);
    }
  } else {
    // We zitten in extra content: 1 tik omhoog ⇒ terug naar carousel,
    // met header + info-bar zichtbaar én batch 9–12.
    if (!section) return;
    index = products.length - batchSize; // laatste batch (9–12)
    showBatch(index);
    carouselActive = true;

    // Scroll zo dat header + info-bar zichtbaar zijn, en direct daaronder de carousel
    const y = getTopY(section) - totalTopBarsHeight();
    smoothScrollToY(y);
    withLock(() => {}, SMOOTH_MS);
  }
}

// ==============================
// 5) Input handlers
// ==============================

// WHEEL (muis & touchpad)
window.addEventListener(
  "wheel",
  (e) => {
    if (animating) { e.preventDefault(); return; }

    // In carousel-fase: we blokkeren default scroll, we regelen de stappen zelf
    if (carouselActive) {
      if (Math.abs(e.deltaY) < SCROLL_THRESHOLD) return; // ruis negeren
      e.preventDefault();
      if (e.deltaY > 0) stepDownOrToExtra();
      else stepUpOrToTopOrBackFromExtra();
      return;
    }

    // In extra-content:
    // Eén stap omhoog (ongeacht hard/zacht) ⇒ terug naar carousel (smooth)
    if (e.deltaY < 0) {
      // Optioneel: alleen als we dicht bij de top van extraContent zitten:
      const nearTop =
        extraContent && window.scrollY <= getTopY(extraContent) + 8;
      if (nearTop) {
        e.preventDefault();
        stepUpOrToTopOrBackFromExtra();
      }
      // anders: laat normale pagina-scroll naar boven lopen tot je bij de top bent
    }
  },
  { passive: false }
);

// TOUCH (1 batch per swipe)
let touchStartY = null;

window.addEventListener(
  "touchstart",
  (e) => {
    if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
  },
  { passive: true }
);

window.addEventListener(
  "touchend",
  (e) => {
    if (touchStartY == null || animating) return;
    const y = e.changedTouches[0].clientY;
    const dy = touchStartY - y;

    if (Math.abs(dy) < TOUCH_THRESHOLD) { touchStartY = null; return; }

    if (dy > 0) {
      // swipe omhoog (= naar beneden scrollen)
      stepDownOrToExtra();
    } else {
      // swipe omlaag (= naar boven scrollen)
      // Als we in extra content zitten en (bijna) bovenaan zijn: terug naar carousel
      if (!carouselActive) {
        const nearTop =
          extraContent && window.scrollY <= getTopY(extraContent) + 8;
        if (nearTop) {
          stepUpOrToTopOrBackFromExtra();
        }
      } else {
        stepUpOrToTopOrBackFromExtra();
      }
    }
    touchStartY = null;
  },
  { passive: true }
);

// KEYBOARD (pijltjes & PageUp/PageDown)
window.addEventListener("keydown", (e) => {
  if (animating || lock) return;

  const key = e.key;
  if (key === "ArrowDown" || key === "PageDown") {
    e.preventDefault();
    stepDownOrToExtra();
  } else if (key === "ArrowUp" || key === "PageUp") {
    e.preventDefault();
    // In extra content: altijd smooth terug naar header+info-bar+batch 3
    if (!carouselActive) {
      e.preventDefault();
      stepUpOrToTopOrBackFromExtra();
    } else {
      stepUpOrToTopOrBackFromExtra();
    }
  }
});