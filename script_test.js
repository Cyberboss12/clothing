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
let index = 0;
const batchSize = 4;

function loadProducts() {
  const slice = products.slice(index, index + batchSize);
  slice.forEach(p => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <img src="${p.img}" alt="Product ${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    grid.appendChild(productDiv);
    requestAnimationFrame(() => productDiv.classList.add('loaded'));
  });
  index += batchSize;
}

// Eerst 4 producten tonen
loadProducts();

// Infinite scroll op de wrapper
const wrapper = document.querySelector('.grid-wrapper');
wrapper.addEventListener('scroll', () => {
  if(wrapper.scrollTop + wrapper.clientHeight >= wrapper.scrollHeight - 1 && index < products.length) {
    loadProducts();
  }
});
