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

const section = document.getElementById("productSection");
const grid = document.getElementById("productGrid");

let index = 0;
const batchSize = 4;
let lock = false;
const SCROLL_THRESHOLD = 30; // middelmatige gevoeligheid

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

// eerste batch tonen
showBatch(index);

// alleen scroll blokkeren als batch wisselt
section.addEventListener("wheel", (e) => {
  if (lock) return;

  const delta = e.deltaY;

  if (delta > SCROLL_THRESHOLD) {
    if (index + batchSize < products.length) {
      e.preventDefault();
      index += batchSize;
      showBatch(index);
    }
  } else if (delta < -SCROLL_THRESHOLD) {
    if (index - batchSize >= 0) {
      e.preventDefault();
      index -= batchSize;
      showBatch(index);
    }
  }

  lock = true;
  setTimeout(() => lock = false, 400);
}, { passive: false });

