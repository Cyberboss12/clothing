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

function loadProducts() {
  const slice = products.slice(index, index + batchSize);
  slice.forEach(p => {
    const div = document.createElement('div');
    div.classList.add('product');
    div.innerHTML = `
      <img src="${p.img}" alt="${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    grid.appendChild(div);

    // fade-in animatie
    requestAnimationFrame(() => div.classList.add('loaded'));
  });
  index += batchSize;
}

// Eerste 4 producten tonen
loadProducts();

// Scroll-event: check of je bijna bij de onderkant van de grid bent
window.addEventListener('scroll', () => {
  const scrollBottom = window.scrollY + window.innerHeight;
  const gridBottom = grid.offsetTop + grid.offsetHeight;

  if (scrollBottom >= gridBottom - 100 && index < products.length) {
    loadProducts();
  }
});
