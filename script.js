// ========== Info-bar boodschap ==========
const infoMessage = document.getElementById('infoMessage');

// Verberg de boodschap automatisch na 3 seconden
setTimeout(() => {
  infoMessage.classList.add('hidden');
}, 3000);

// ========== Product grid & infinite scroll ==========
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

function loadProducts() {
  const slice = products.slice(index, index + batchSize);

  slice.forEach((p, i) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <img src="${p.img}" alt="${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    grid.appendChild(productDiv);

    // fade-in animatie met delay per product
    setTimeout(() => productDiv.classList.add('loaded'), 100 * i);
  });

  index += batchSize;
}

// Scroll-event
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
    if (index < products.length) {
      loadProducts();
    }
  }
});

// Eerste batch laden
loadProducts();

