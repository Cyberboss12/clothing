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

const grid = document.getElementById('productGrid');
const spacer = document.getElementById('scrollSpacer');

let index = 0;
const batchSize = 4;
let lastScroll = 0;
let loading = false; // lock zodat niet alles tegelijk laadt

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

    requestAnimationFrame(() => div.classList.add('loaded'));
  });
  index += batchSize;

  if (index >= products.length) {
    spacer.style.display = "none"; // geen extra ruimte meer nodig
  }
}

// Eerste batch tonen
loadProducts();

window.addEventListener('scroll', () => {
  if (loading || index >= products.length) return;

  const currentScroll = window.scrollY;

  // alleen bij naar beneden scrollen en minstens 100px verschil
  if (currentScroll > lastScroll + 100) {
    loading = true;
    loadProducts();

    // cooldown van 300ms om meerdere triggers tegelijk te voorkomen
    setTimeout(() => {
      loading = false;
    }, 300);
  }

  lastScroll = currentScroll;
});


