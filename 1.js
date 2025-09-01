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

section.addEventListener("wheel", (e) => {
  // Altijd scroll blokkeren binnen de product sectie
  e.preventDefault();

  if (lock) return;

  // Scrol naar beneden
  if (e.deltaY > SCROLL_THRESHOLD) {
    if (index + batchSize < products.length) {
      // nog meer batches → toon volgende
      triggerStep("down");
    } else {
      // laatste batch → laat pagina daarna pas scrollen
      section.style.pointerEvents = "none"; 
      window.scrollBy({ top: 1 }); // 1px kick zodat body scroll weer overneemt
      setTimeout(() => section.style.pointerEvents = "auto", 200);
    }
  }

  // Scrol naar boven
  else if (e.deltaY < -SCROLL_THRESHOLD) {
    if (index - batchSize >= 0) {
      // vorige batch tonen
      triggerStep("up");
    } else {
      // eerste batch → laat pagina omhoog scrollen
      section.style.pointerEvents = "none";
      window.scrollBy({ top: -1 });
      setTimeout(() => section.style.pointerEvents = "auto", 200);
    }
  }
}, { passive: false });


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