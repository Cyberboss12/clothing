document.addEventListener("DOMContentLoaded", () => {

  // ========================
  // 1. Boodschappen info-bar
  // ========================
  const messages = [
    "Welcome to my world",
    "Gratis verzending vanaf €50",
    "10% off on your first order",
    "New fall collection",
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
    { img: "afbeeldingen/strandpalen.jpg", label: "Shoes" },
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
  const batches = ["batch-one", "batch-two", "batch-three", "batch-four"];
  let currentBatch = 0;
  let isAnimating = false;


  // ========================
  // 4. Text-bar setup
  // ========================
  const textBar = document.getElementById("textBar");
  const textMessage = document.getElementById("textMessage");

  const textMessages = "MERKNAAM";

  let textIndex = 0;

  // ========================
  // 5. Helper om product div te maken (klikbare links)
  // ========================
  function createProduct(p) {
    const div = document.createElement("div");
    div.className = "product";

    if (p.img) {
      if (p.link) {
        div.innerHTML = `
          <a href="${p.link}">
            <img src="${p.img}" alt="${p.label}">
            <div class="product-label">${p.label}</div>
          </a>
        `;
      } else {
        div.innerHTML = `
          <img src="${p.img}" alt="${p.label}">
          <div class="product-label">${p.label}</div>
        `;
      }
    }

    return div;
  }


  // ========================
  // 6. Batch tonen
  // ========================
  function showBatch(index) {
    grid.className = "grid " + batches[index];
    grid.innerHTML = "";

    // toon/verberg textbar afhankelijk van batch
    if (index === 2) { 
      textBar.style.opacity = 1;
    } else {
      textBar.style.opacity = 0;
    }

    if (index === 0) {
      grid.appendChild(createProduct(products[0]));
      const placeholder = document.createElement("div");
      placeholder.className = "placeholder";
      placeholder.innerHTML = `<span>MERKNAAM</span>`;
      grid.appendChild(placeholder);

    } else if (index === 1) {
      const placeholder = document.createElement("div");
      placeholder.className = "placeholder";
      placeholder.innerHTML = `<span>MERKNAAM</span>`;
      grid.appendChild(placeholder);
      grid.appendChild(createProduct(products[1]));

    } else if (index === 2) {
      for (let i = 2; i < 6; i++) {
        grid.appendChild(createProduct(products[i]));
      }

    } else if (index === 3) {
      const full = createProduct(products[7]);
      full.style.gridColumn = "1 / -1";
      grid.appendChild(full);
    }
  }


  // ========================
  // 7. Scroll functionaliteit
  // ========================
  window.addEventListener("wheel", e => {
    if (isAnimating) return;
    e.preventDefault();

    if (e.deltaY > 0) {
      if (currentBatch < batches.length - 1) {
        currentBatch++;
        animateTransition();
      }
    } else if (e.deltaY < 0) {
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
  // 8. Eerste render
  // ========================
  showBatch(currentBatch);

});
