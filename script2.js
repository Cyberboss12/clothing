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
  { img: "afbeeldingen/model1.JPG", label: "12" },

  // Voeg hier extra producten toe
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

    // Animatie bij verschijnen
    setTimeout(() => productDiv.classList.add('loaded'), 50);
  });
  index += batchSize;
}

// Scroll event: laad nieuwe producten als gebruiker bijna onderaan is
window.addEventListener('scroll', () => {
  // if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    if (index < products.length) {
      loadProducts();
    // }
  }
});

// Initial load
function loadProducts() {
  console.log("Nieuwe batch geladen:", slice);
};

