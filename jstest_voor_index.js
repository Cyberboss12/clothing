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
  const section = document.getElementById("productSection");
  const extraContent = document.getElementById("extraContent");

  let index = 0;
  const batchSize = 4;
  let lock = false;
  const LOCK_MS = 600;

  // ========================
  // Functie: batch tonen
  // ========================
  function showBatch(startIndex) {
    grid.innerHTML = "";

    const slice = products.slice(startIndex, startIndex + batchSize);
    const loaders = slice.map(p => loadProduct(p));

    Promise.all(loaders).then(elements => {
      elements.forEach(el => grid.appendChild(el));
      normalizeGridHeights();
    });
  }

  // ========================
  // Product maken + afbeelding laden
  // ========================
  function loadProduct(product) {
    return new Promise(resolve => {
      const div = document.createElement("div");
      div.className = "product";

      const img = new Image();
      img.src = product.img;
      img.alt = product.label;
      img.loading = "lazy";
      img.onload = () => {
        requestAnimationFrame(() => div.classList.add("loaded"));
        resolve(div);
      };

      const label = document.createElement("div");
      label.className = "product-label";
      label.textContent = product.label;

      if (product.link) {
        const a = document.createElement("a");
        a.href = product.link;
        a.style.display = "block";
        a.appendChild(img);
        a.appendChild(label);
        div.appendChild(a);
      } else {
        div.appendChild(img);
        div.appendChild(label);
      }

      resolve(div);
    });
  }

  // ========================
  // Hoogtes corrigeren per rij
  // ========================
  function normalizeGridHeights() {
    const products = grid.querySelectorAll(".product");
    if (!products.length) return;

    // Reset
    products.forEach(p => p.style.height = "");

    // Gelijk maken
    let maxHeight = 0;
    products.forEach(p => maxHeight = Math.max(maxHeight, p.offsetHeight));
    products.forEach(p => p.style.height = `${maxHeight}px`);
  }

  // ========================
  // Scrollgedrag
  // ========================
  function triggerStep(direction) {
    if (lock) return;
    if (direction === "down" && index + batchSize < products.length) {
      index += batchSize;
      showBatch(index);
    } else if (direction === "up" && index - batchSize >= 0) {
      index -= batchSize;
      showBatch(index);
    }
    lock = true;
    setTimeout(() => (lock = false), LOCK_MS);
  }

  // Event listeners
  window.addEventListener("wheel", e => {
    const deltaY = e.deltaY;
    if (deltaY > 0) triggerStep("down");
    else triggerStep("up");
  }, { passive: true });

  // Init
  showBatch(index);
});