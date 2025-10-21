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
  // 4. Helper om product div te maken
  // ========================
  function createProduct(p, batch) {
    const div = document.createElement("div");
    div.className = "product";

    if (batch === 3) {
      // Batch 3: tekst onder afbeelding
      if (p.link) {
        div.innerHTML = `
          <a href="${p.link}">
            <img src="${p.img}" alt="${p.label}">
          </a>
          <div class="product-label">${p.label}</div>
        `;
      } else {
        div.innerHTML = `
          <img src="${p.img}" alt="${p.label}">
          <div class="product-label">${p.label}</div>
        `;
      }
    } else if (batch === 4) {
      // Batch 4: één grote afbeelding
      if (p.link) {
        div.innerHTML = `
          <a href="${p.link}">
            <img src="${p.img}" alt="${p.label}">
          </a>
        `;
      } else {
        div.innerHTML = `
          <img src="${p.img}" alt="${p.label}">
        `;
      }
    } else {
      // Batch 1 & 2: tekst in afbeelding
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
  // 5. Batch tonen
  // ========================
  function showBatch(index) {
    grid.className = "grid " + batches[index];
    grid.innerHTML = "";

    switch(index) {
      case 0:
        // Batch 1: linker product + rechter placeholder
        grid.appendChild(createProduct(products[0], 1));
        const placeholder1 = document.createElement("div");
        placeholder1.className = "placeholder";
        placeholder1.innerHTML = `<span>Hier kan tekst komen</span>`;
        grid.appendChild(placeholder1);
        break;

      case 1:
        // Batch 2: rechter product + linker placeholder
        const placeholder2 = document.createElement("div");
        placeholder2.className = "placeholder";
        placeholder2.innerHTML = `<span>Hier kan tekst komen</span>`;
        grid.appendChild(placeholder2);

        grid.appendChild(createProduct(products[1], 2));
        break;

      case 2:
        // Batch 3: vier producten in het midden
        for (let i = 3; i < 7; i++) {
          grid.appendChild(createProduct(products[i], 3));
        }
        break;

      case 3:
        // Batch 4: één grote afbeelding
        grid.appendChild(createProduct(products[2], 4));
        break;
    }
  }

  // ========================
  // 6. Scroll functionaliteit
  // ========================
  window.addEventListener("wheel", e => {
    if (isAnimating) return;
    e.preventDefault();

    if (e.deltaY > 0 && currentBatch < batches.length - 1) {
      currentBatch++;
      animateTransition();
    } else if (e.deltaY < 0 && currentBatch > 0) {
      currentBatch--;
      animateTransition();
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
  // 7. Eerste render
  // ========================
  showBatch(currentBatch);

});