const products = [
  { img: "afbeeldingen/model1.JPG", label: "Men" },
  { img: "afbeeldingen/model2.JPG", label: "Women" },
  { img: "afbeeldingen/model3.JPG", label: "Children" },
  { img: "afbeeldingen/model4.JPG", label: "Discover" },
  { img: "afbeeldingen/model5.JPG", label: "5" },
  { img: "afbeeldingen/model6.JPG", label: "6" },
  { img: "afbeeldingen/model7.JPG", label: "7" },
  { img: "afbeeldingen/model8.JPG", label: "8" },
  { img: "afbeeldingen/model9.JPG", label: "9" },
  { img: "afbeeldingen/model10.JPG", label: "10" },
  { img: "afbeeldingen/model11.JPG", label: "11" },
  { img: "afbeeldingen/model12.JPG", label: "12" }
];

const grid = document.getElementById('productGrid');
const sentinel = document.getElementById('sentinel');
const batchSize = 4;
let index = 0;
let loading = false;

// Functie om producten toe te voegen
function loadProducts() {
  if (index >= products.length) return;
  loading = true;

  const slice = products.slice(index, index + batchSize);

  slice.forEach(p => {
    // Skeleton loader toevoegen
    const skeleton = document.createElement('div');
    skeleton.classList.add('skeleton-loader');
    grid.appendChild(skeleton);

    // Laad product na korte timeout (simulatie fetch)
    setTimeout(() => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.innerHTML = `
        <img src="${p.img}" alt="${p.label}" loading="lazy">
        <div class="product-label">${p.label}</div>
      `;
      grid.replaceChild(productDiv, skeleton);
      setTimeout(() => productDiv.classList.add('loaded'), 50);
    }, 500); // simulatie netwerk vertraging
  });

  index += batchSize;
  loading = false;
}

// Intersection Observer om nieuwe batch te laden
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !loading) {
      loadProducts();
    }
  });
}, { rootMargin: '200px' });

observer.observe(sentinel);

// Start eerste batch
loadProducts();

