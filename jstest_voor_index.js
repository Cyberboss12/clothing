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
    { img: "afbeeldingen/Black square_test.png", label: "Heritage" },
    { img: "afbeeldingen/model.jpg", label: "Bags" },
    { img: "afbeeldingen/strandpalen.jpg", label: "Shoes" },
    { img: "afbeeldingen/model.jpg", label: "Jewelry and watches" },
    { img: "afbeeldingen/model.jpg", label: "9" },
    { img: "afbeeldingen/model.jpg", label: "10" },
    { img: "afbeeldingen/model.jpg", label: "Discover" },
    { img: "afbeeldingen/model_muur2.png", label: "Gifts" }
  ];

 // ========================
  // 3. Grid en batches
  // ========================
  const grid = document.getElementById("productGrid");
  const batches = ["batch-one", "batch-two", "batch-three", "batch-four"];
  let currentBatch = 0;
  let isAnimating = false;

  // ========================
  // 4. Helper: maak product-element
  //    - gedrag per batch meegeven via 'batchIndex' (1..4)
  // ========================
  function createProduct(p, batchIndex) {
    const div = document.createElement("div");
    div.className = "product";

    // batchIndex gebruikt voor layoutkeuzes
    if (batchIndex === 3) {
      // Batch 3: afbeelding + label **onder** (tekst onder de afbeelding)
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
    } else if (batchIndex === 4) {
      // Batch 4: fullscreen single image (label optioneel)
      div.classList.add("full-view");
      if (p.link) {
        div.innerHTML = `
          <a href="${p.link}">
            <img src="${p.img}" alt="${p.label}">
          </a>
        `;
      } else {
        div.innerHTML = `<img src="${p.img}" alt="${p.label}">`;
      }
    } else {
      // Batch 1 & 2: image with label overlay (in image)
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
  // 5. Toon batch (duidelijke, expliciete mapping)
  //    - batch 0 => batch-one (product[0] + placeholder)
  //    - batch 1 => batch-two (placeholder + product[1])
  //    - batch 2 => batch-three (four products: products[2..5])
  //    - batch 3 => batch-four (single fullscreen product products[6])
  // ========================
  function showBatch(index) {
    grid.className = "grid " + batches[index];
    grid.innerHTML = "";

    switch(index) {
      case 0: // batch-one
        grid.appendChild(createProduct(products[0], 1));
        {
          const placeholder = document.createElement("div");
          placeholder.className = "placeholder";
          placeholder.innerHTML = `
            <div class="placeholder-inner">
              <span class="placeholder-text">Hier kan tekst komen</span>
            </div>
          `;
          grid.appendChild(placeholder);
        }
        break;

      case 1: // batch-two
        {
          const placeholder = document.createElement("div");
          placeholder.className = "placeholder";
          placeholder.innerHTML = `
            <div class="placeholder-inner">
              <span class="placeholder-text">Hier kan tekst komen</span>
            </div>
          `;
          grid.appendChild(placeholder);
        }
        grid.appendChild(createProduct(products[1], 2));
        break;

      case 2: // batch-three (4 items: indices 2,3,4,5)
        {
          const indices = [2,3,4,5];
          indices.forEach(i => {
            if (products[i]) grid.appendChild(createProduct(products[i], 3));
          });
        }
        break;

      case 3: // batch-four (single fullscreen image)
        // kies een product dat visueel geschikt is; hier products[6]
        if (products[6]) grid.appendChild(createProduct(products[6], 4));
        break;
    }
  }

  // ========================
  // 6. Scroll handler (preventDefault alleen als batch verandert)
  // ========================
  window.addEventListener("wheel", e => {
    if (isAnimating) return;

    const prev = currentBatch;
    if (e.deltaY > 0 && currentBatch < batches.length - 1) {
      currentBatch++;
    } else if (e.deltaY < 0 && currentBatch > 0) {
      currentBatch--;
    }

    if (currentBatch !== prev) {
      // alleen blokkeren als we echt naar een andere batch gaan
      e.preventDefault();
      animateTransition();
    }
  }, { passive: false });

  // ========================
  // 7. Animatie overgang
  // ========================
showBatch(currentBatch);

// Tekstbar tonen of verbergen afhankelijk van batch
const textBar = document.querySelector('.text-bar');
const textMessage = document.querySelector('#textMessage');

if (currentBatch === 2) { // batch 3 (index 2)
  textBar.style.opacity = 1;
  textMessage.textContent = "Ontdek onze unieke collectie";
} else {
  textBar.style.opacity = 0;
}

isAnimating = false;

  // ========================
  // 8. Eerste render
  // ========================
  showBatch(currentBatch);
});