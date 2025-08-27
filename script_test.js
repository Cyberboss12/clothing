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

const grid = document.getElementById('productGrid');
let index = 0;
const batchSize = 4;

// Functie om exact één batch te laden
function loadProducts() {
  // verwijder eerst alle producten uit grid
  grid.innerHTML = '';

  const slice = products.slice(index, index + batchSize);
  slice.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('product');
    div.innerHTML = `
      <img src="${p.img}" alt="${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    grid.appendChild(div);
    requestAnimationFrame(() => div.classList.add('loaded'));
  });
}

// Start met eerste batch
loadProducts();

// Infinite scroll: pas volgende batch tonen bij scroll
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5) {
    if (index + batchSize < products.length) {
      index += batchSize;   // ga naar volgende batch
      loadProducts();       // vervang de grid door de volgende 4
      window.scrollTo(0, 0); // reset scroll naar boven voor nieuwe batch
    }
  }
});
