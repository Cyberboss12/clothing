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
let active = false;
const ANIM_MS = 320;
const WHEEL_THRESHOLD = 30; // minimaal deltaY om batch te wisselen
let wheelBuffer = 0;

// render helpers
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
    requestAnimationFrame(() => div.classList.add("loaded"));
  });
}

function showBatch(startIndex, direction) {
  if (lock) return;
  lock = true;

  const current = Array.from(grid.children);
  if (current.length) {
    current.forEach(el => {
      el.classList.remove("loaded");
      el.classList.add(direction === "down" ? "exit-up" : "exit-down");
    });
    setTimeout(() => {
      renderBatchImmediate(startIndex);
      setTimeout(() => lock = false, 80);
    }, ANIM_MS);
  } else {
    renderBatchImmediate(startIndex);
    setTimeout(() => lock = false, 80);
  }
}

// init
renderBatchImmediate(index);

// observer → sectie actief wanneer 100% in beeld
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    active = entry.intersectionRatio >= 0.99;
  });
}, { threshold: [0, 0.25, 0.5, 0.75, 0.99, 1] });
io.observe(section);

// wheel handler
function onWheel(e) {
  if (!active) return; // laat pagina vrij scrollen

  // buffer voor gevoelige scrollwielen/trackpads
  wheelBuffer += e.deltaY;

  if (Math.abs(wheelBuffer) >= WHEEL_THRESHOLD) {
    e.preventDefault();
    e.stopPropagation();

    if (wheelBuffer > 0 && index + batchSize < products.length) {
      index += batchSize;
      showBatch(index, "down");
    } else if (wheelBuffer < 0 && index - batchSize >= 0) {
      index -= batchSize;
      showBatch(index, "up");
    }

    wheelBuffer = 0; // reset buffer na wissel
  }
}

// alleen op sectie luisteren
section.addEventListener("wheel", onWheel, { passive: false });

// touch support (idem met threshold)
let touchStartY = null;
const TOUCH_THRESHOLD = 40;

section.addEventListener("touchstart", (e) => {
  if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
}, { passive: true });

section.addEventListener("touchmove", (e) => {
  if (!active || !touchStartY) return;

  const y = e.touches[0].clientY;
  const dy = touchStartY - y;

  if (Math.abs(dy) >= TOUCH_THRESHOLD) {
    e.preventDefault();
    e.stopPropagation();

    if (dy > 0 && index + batchSize < products.length) {
      index += batchSize;
      showBatch(index, "down");
    } else if (dy < 0 && index - batchSize >= 0) {
      index -= batchSize;
      showBatch(index, "up");
    }
    touchStartY = null; // reset
  }
}, { passive: false });

section.addEventListener("touchend", () => touchStartY = null, { passive: true });