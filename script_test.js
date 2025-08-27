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

const grid = document.getElementById("productGrid");
const spacer = document.getElementById("scrollSpacer");

let index = 0;
const batchSize = 4;
let currentStep = 0; // bepaalt welke batch we al getoond hebben

function loadProducts() {
  const slice = products.slice(index, index + batchSize);
  slice.forEach((p) => {
    const div = document.createElement("div");
    div.classList.add("product");
    div.innerHTML = `
      <img src="${p.img}" alt="${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    grid.appendChild(div);
    requestAnimationFrame(() => div.classList.add("loaded"));
  });
  index += batchSize;

  // als alles geladen is → spacer weghalen
  if (index >= products.length) {
    spacer.style.display = "none";
  }
}

// eerste batch
loadProducts();

// bij scroll bepalen in welke 'stap' we zitten
window.addEventListener("scroll", () => {
  if (index >= products.length) return; // niets meer te laden

  // hoeveel volledige schermhoogtes zijn gescrold
  const step = Math.floor(window.scrollY / window.innerHeight);

  if (step > currentStep) {
    currentStep = step; // ga naar volgende stap
    loadProducts(); // laad volgende batch
  }
});

