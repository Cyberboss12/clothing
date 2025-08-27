const products = [
  { img: "afbeeldingen/model.jpg", label: "Men" },
  { img: "afbeeldingen/model.jpg", label: "Women" },
  { img: "afbeeldingen/model.jpg", label: "Children" },
  { img: "afbeeldingen/model.jpg", label: "Discover" },
  { img: "afbeeldingen/model1.JPG", label: "5" },
  { img: "afbeeldingen/model1.JPG", label: "6" },
  { img: "afbeeldingen/model1.JPG", label: "7" },
  { img: "afbeeldingen/model1.JPG", label: "8" },
  { img: "afbeeldingen/model1.JPG", label: "9" },
  { img: "afbeeldingen/model1.JPG", label: "10" },
  { img: "afbeeldingen/model1.JPG", label: "11" },
  { img: "afbeeldingen/model1.JPG", label: "12" }
];

const grid = document.getElementById("productGrid");

let index = 0;
const batchSize = 4;
let lock = false;

// toon een batch (vervangt vorige!)
function showBatch(startIndex) {
  grid.innerHTML = ""; // oude producten weghalen
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

// event: scroll = volgende batch
window.addEventListener("wheel", (e) => {
  if (lock) return;
  if (e.deltaY > 0) { // naar beneden
    index = (index + batchSize) % products.length; 
    showBatch(index);
  } else if (e.deltaY < 0) { // naar boven
    index = (index - batchSize + products.length) % products.length;
    showBatch(index);
  }

  // lock zodat 1 scroll = 1 batch
  lock = true;
  setTimeout(() => lock = false, 400);
}, { passive: true });

