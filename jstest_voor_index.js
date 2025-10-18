document.addEventListener("DOMContentLoaded", () => {

  // ========================
  // 1. Boodschappen info-bar
  // ========================
  const messages = [
    "Welkom bij onze webshop!",
    "Gratis verzending vanaf €50",
    "Vandaag: 10% korting op alle tassen",
    "Nieuw binnen: lente collectie 🌸",
    "Sign up to recieve 15% off on your next order!",
    "Free shipping on orders above €150",
    "Sign up to our community newsletter!"
  ];

  const infoMessage = document.getElementById('infoMessage');
  let msgIndex = 0;

  function showNextMessage() {
    infoMessage.classList.add('hidden');
    setTimeout(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      infoMessage.textContent = messages[msgIndex];
      infoMessage.classList.remove('hidden');
    }, 500);
  }

  setInterval(showNextMessage, 4000);


  // ========================
  // 2. Productdata
  // ========================
  const products = [
    { img: "afbeeldingen/model_muur2.png", label: "Men", link: "men.html" },
    { img: "afbeeldingen/model.jpg", label: "Women", link: "women.html" },
    { img: "afbeeldingen/model.jpg", label: "Children", link: "children.html" },
    { img: "afbeeldingen/Black square_test.png", label: "Discover", link: "discover.html" },
    { img: "afbeeldingen/Black square_test.png", label: "5" },
    { img: "afbeeldingen/model.jpg", label: "Bags" },
    { img: "afbeeldingen/model.jpg", label: "Shoes" },
    { img: "afbeeldingen/model.jpg", label: "Jewelry and watches" },
    { img: "afbeeldingen/model.jpg", label: "9" },
    { img: "afbeeldingen/model.jpg", label: "10" },
    { img: "afbeeldingen/model.jpg", label: "Discover" },
    { img: "afbeeldingen/model_muur2.png", label: "Gifts" }
  ];


  // ========================
  // 3. Grid-elementen
  // ========================
  const grid = document.getElementById("productGrid");
  const batches = [
    "batch-one",
    "batch-two",
    "batch-three"
  ];
  let currentBatch = 0;
  let isAnimating = false;

  // ========================
  // 4. Batch tonen
  // ========================
  function showBatch(index) {
    grid.className = "grid " + batches[index];
    grid.innerHTML = "";

    if (index === 0) {
      // batch 1: 2 links/rechts
      for (let i = 0; i < 2; i++) {
        grid.appendChild(createProduct(products[i]));
      }
    } else if (index === 1) {
      // batch 2: 2 omgekeerd
      const left = createProduct(products[2]); left.classList.add("reverse-2");
      const right = createProduct(products[3]); right.classList.add("reverse-1");
      grid.appendChild(left);
      grid.appendChild(right);
    } else {
      // batch 3: 4 in het midden
      for (let i = 4; i < 8; i++) {
        grid.appendChild(createProduct(products[i]));
      }
    }
  }

  function createProduct(p) {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    return div;
  }

  // ========================
  // 5. Scroll functionaliteit
  // ========================
  window.addEventListener("wheel", e => {
    if (isAnimating) return;
    e.preventDefault();

    if (e.deltaY > 0) {
      // naar beneden scroll
      if (currentBatch < batches.length - 1) {
        currentBatch++;
        animateTransition();
      }
    } else if (e.deltaY < 0) {
      // naar boven scroll
      if (currentBatch > 0) {
        currentBatch--;
        animateTransition();
      }
    }
  }, { passive: false });

  function animateTransition() {
    isAnimating = true;
    grid.style.opacity = 0;
    setTimeout(() => {
      showBatch(currentBatch);
      grid.style.opacity = 1;
      isAnimating = false;
    }, 500);
  }

  // ========================
  // 6. Eerste render
  // ========================
  showBatch(currentBatch);

});