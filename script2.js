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

// Functie om producten toe te voegen
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

// Initial load = alleen eerste 4
loadProducts();

// Scroll event: pas bij onderkant nieuwe batch
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
    if (index < products.length) {
      loadProducts();
    }
  }
});

