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

// alleen scroll blokkeren binnen productSection
section.addEventListener("wheel", (e) => {
  if (lock) return;

  if (e.deltaY > 0) {
    if (index + batchSize < products.length) {
      e.preventDefault(); // blokkeer pagina-scroll alleen als batch wisselt
      index += batchSize;
      showBatch(index);
    }
  } else if (e.deltaY < 0) {
    if (index - batchSize >= 0) {
      e.preventDefault();
      index -= batchSize;
      showBatch(index);
    }
  }

  lock = true;
  setTimeout(() => lock = false, 400);
}, { passive: false });

