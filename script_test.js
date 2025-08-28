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

// const section = document.getElementById("productSection");
// const grid = document.getElementById("productGrid");

// let index = 0;
// const batchSize = 4;
// let lock = false;

// function showBatch(startIndex) {
//   grid.innerHTML = "";
//   const slice = products.slice(startIndex, startIndex + batchSize);
//   slice.forEach(p => {
//     const div = document.createElement("div");
//     div.className = "product";
//     div.innerHTML = `
//       <img src="${p.img}" alt="${p.label}">
//       <div class="product-label">${p.label}</div>
//     `;
//     grid.appendChild(div);
//     requestAnimationFrame(() => div.classList.add("loaded"));
//   });
// }

// showBatch(index);

// alleen scroll blokkeren binnen productSection
// section.addEventListener("wheel", (e) => {
//   if (lock) return;

//   if (e.deltaY > 0) {
//     if (index + batchSize < products.length) {
      // e.preventDefault(); // blokkeer pagina-scroll alleen als batch wisselt
//       index += batchSize;
//       showBatch(index);
//     }
//   } else if (e.deltaY < 0) {
//     if (index - batchSize >= 0) {
//       e.preventDefault();
//       index -= batchSize;
//       showBatch(index);
//     }
//   }

//   lock = true;
//   setTimeout(() => lock = false, 400);
// }, { passive: false });

const section = document.getElementById("productSection");
const grid = document.getElementById("productGrid");

let index = 0;
const batchSize = 4;
let lock = false;
let active = false; // is de sectie 'dominant zichtbaar' -> dan nemen we wheel over
const ANIM_MS = 320; // moet matchen met CSS-transition tijd (300ms + marge)

// render (direct - zonder exit anim)
function renderBatchImmediate(startIndex) {
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
    // trigger load animation
    requestAnimationFrame(() => div.classList.add("loaded"));
  });
}

// render met exit animatie (direction: 'down' of 'up')
function showBatch(startIndex, direction) {
  if (lock) return;
  lock = true;

  const current = Array.from(grid.children);
  if (current.length) {
    // outgoing anim
    current.forEach(el => {
      el.classList.remove("loaded");
      el.classList.add(direction === "down" ? "exit-up" : "exit-down");
    });
    // na anim -> vervang DOM
    setTimeout(() => {
      renderBatchImmediate(startIndex);
      // korte extra delay om swipes/inertia te dempen
      setTimeout(() => lock = false, 80);
    }, ANIM_MS);
  } else {
    renderBatchImmediate(startIndex);
    setTimeout(() => lock = false, 80);
  }
}

// init eerste batch
renderBatchImmediate(index);

// --- Intersectie: active alleen als sectie >= 60% in view ---
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    active = entry.intersectionRatio >= 0.6;
  });
}, { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] });
io.observe(section);

// --- wheel handler (op section) ---
function onWheel(e) {
  // Als sectie niet actief => laat browser gewoon scrollen
  if (!active) return;

  // Als we locked zijn: voorkomen we standaard scroll zodat inertie niet doorloopt
  if (lock) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  const delta = e.deltaY;

  // scroll naar beneden => next batch (als mogelijk), anders laat page scrollen
  if (delta > 0) {
    if (index + batchSize < products.length) {
      e.preventDefault();
      e.stopPropagation();
      index += batchSize;
      showBatch(index, "down");
    } else {
      // laatste batch: NIET preventDefault -> laat page doorrollen naar volgende sectie/footer
      return;
    }

  // scroll naar boven => prev batch (als mogelijk), anders laat page scrollen
  } else if (delta < 0) {
    if (index - batchSize >= 0) {
      e.preventDefault();
      e.stopPropagation();
      index -= batchSize;
      showBatch(index, "up");
    } else {
      // eerste batch: laat page scrollen terug naar header
      return;
    }
  }
}

// attach wheel op section en zorg voor passive:false zodat preventDefault werkt
section.addEventListener("wheel", onWheel, { passive: false });

// --- touch support (mobile) ---
let touchStartY = null;

section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (!active) return;
  if (!touchStartY) return;

  const y = e.touches[0].clientY;
  const dy = touchStartY - y; // positief = swipe up (we want next batch)
  const THRESH = 30; // px
  if (Math.abs(dy) < THRESH) return;

  // voorkom page scroll als we gaan handelen
  if (dy > 0) { // swipe up -> next
    if (index + batchSize < products.length) {
      e.preventDefault();
      e.stopPropagation();
      index += batchSize;
      showBatch(index, "down");
    } else {
      // do nothing -> laat page scrollen
    }
  } else { // swipe down -> prev
    if (index - batchSize >= 0) {
      e.preventDefault();
      e.stopPropagation();
      index -= batchSize;
      showBatch(index, "up");
    } else {
      // do nothing -> laat page scrollen
    }
  }

  // reset start y zodat meerdere moves niet triggeren herhaald
  touchStartY = null;
}, { passive: false });

section.addEventListener("touchend", () => touchStartY = null, { passive: true });