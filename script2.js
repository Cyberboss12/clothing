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
  { img: "afbeeldingen/model.jpg", label: "5" },
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

let index = 0;
const batchSize = 4;
let lock = false;

// instellingen: zeer gevoelig maar single-step
const SCROLL_THRESHOLD = 6;   // klein = gevoelig (muismoves/trackpad)
const LOCK_MS = 300;          // na trigger korte lock zodat inertie niet skipt
const TOUCH_THRESHOLD = 20;   // swipe gevoeligheid (px)

// render (je bestaande showBatch behouden/overgenomen)
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

// init eerste batch
showBatch(index);

// helper: probeer één stap (down of up)
function triggerStep(direction) {
  if (lock) return false;
  if (direction === 'down' && index + batchSize < products.length) {
    index += batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  } else if (direction === 'up' && index - batchSize >= 0) {
    index -= batchSize;
    showBatch(index);
    lock = true;
    setTimeout(() => lock = false, LOCK_MS);
    return true;
  }
  return false;
}

// pointer flag: true wanneer cursor/focus zich over de sectie bevindt
let pointerInside = false;
section.addEventListener('pointerenter', () => pointerInside = true);
section.addEventListener('pointerleave', () => pointerInside = false);

// WHEEL: luister op window zodat trackpad/muiswiel events worden opgevangen
// maar handel alleen als pointerInside === true
function onWindowWheel(e) {
  // alleen ageren als cursor/focus in de sectie is
  if (!pointerInside) return;

  // als we locked zijn, voorkom extra triggers (en voorkom dat pagina meebeweegt)
  if (lock) {
    // we voorkomen scroll-vernieling tijdens lock zodat inertie niet doorloopt
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  // normaliseer deltaY als browser gebruikt 'lines' in deltaMode
  const PIXEL_PER_LINE = 16;
  const deltaY = (e.deltaMode === 1) ? e.deltaY * PIXEL_PER_LINE : e.deltaY;

  if (deltaY > SCROLL_THRESHOLD) {
    const switched = triggerStep('down');
    if (switched) {
      e.preventDefault();
      e.stopPropagation();
    }
  } else if (deltaY < -SCROLL_THRESHOLD) {
    const switched = triggerStep('up');
    if (switched) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
}
// passive: false zodat preventDefault werkt
window.addEventListener('wheel', onWindowWheel, { passive: false });

// TOUCH: binnen de sectie swipen = 1 rij per swipe
let touchStartY = null;
section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) {
    touchStartY = e.touches[0].clientY;
    // assume touch means user is interacting with section
    pointerInside = true;
  }
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (lock || touchStartY === null) return;

  const y = e.touches[0].clientY;
  const dy = touchStartY - y; // positief = swipe up

  if (dy > TOUCH_THRESHOLD) {
    const switched = triggerStep('down');
    if (switched) {
      e.preventDefault();
      e.stopPropagation();
    }
    touchStartY = null;
  } else if (dy < -TOUCH_THRESHOLD) {
    const switched = triggerStep('up');
    if (switched) {
      e.preventDefault();
      e.stopPropagation();
    }
    touchStartY = null;
  }
}, { passive: false });

section.addEventListener("touchend", () => {
  touchStartY = null;
  // pointerInside blijft true until pointerleave — mobile browsers will naturally change view when user scrolls away
}, { passive: true });