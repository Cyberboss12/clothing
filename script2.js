// Productlijst (afbeelding en label)
const products = [
  { img: "afbeeldingen/model1.JPG", label: "Men" },
  { img: "afbeeldingen/model1.JPG", label: "Women" },
  { img: "afbeeldingen/model1.JPG", label: "Children" },
  { img: "afbeeldingen/model1.JPG", label: "Discover" },
  { img: "afbeeldingen/model1.JPG", label: "5" },
  { img: "afbeeldingen/model1.JPG", label: "6" },
  { img: "afbeeldingen/model1.JPG", label: "7" },
  { img: "afbeeldingen/model1.JPG", label: "8" },
  { img: "afbeeldingen/model1.JPG", label: "9" },
  { img: "afbeeldingen/model1.JPG", label: "10" },
  { img: "afbeeldingen/model1.JPG", label: "11" },
  { img: "afbeeldingen/model1.JPG", label: "12" }
];

const grid = document.getElementById('productGrid');
let index = 0;
const batchSize = 4;

// Functie om een batch producten toe te voegen
function loadProducts() {
  const slice = products.slice(index, index + batchSize);
  slice.forEach(p => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <img src="${p.img}" alt="${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    grid.appendChild(productDiv);
    setTimeout(() => productDiv.classList.add('loaded'), 50);
  });
  index += batchSize;
}

// Zorg dat er altijd genoeg content is om te scrollen
function ensureScrollable() {
  while (document.body.scrollHeight <= window.innerHeight && index < products.length) {
    loadProducts();
  }
}

// Initial load
loadProducts();
ensureScrollable();

// Infinite scroll bij bijna onderaan
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    if (index < products.length) {
      loadProducts();
      ensureScrollable();
    }
  }
});

