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
    { img: "afbeeldingen/Vraagteken_ai.png", label: "Men", link: "men.html" },
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
  // 3. Grid & batches
  // ========================
  const grid = document.getElementById("productGrid");
  const batches = ["batch-one", "batch-two", "batch-three", "batch-four"];
  let currentBatch = 0;
  let isScrolling = false;

  // ========================
  // 4. Helper: maak product-element
  // ========================
  function createProduct(p, batchIndex) {
    const div = document.createElement("div");
    div.className = "product";

    if (batchIndex === 3) { // batch 3: tekst onder afbeelding
      if (p.link) {
        div.innerHTML = `<a href="${p.link}"><img src="${p.img}" alt="${p.label}"></a><div class="product-label">${p.label}</div>`;
      } else {
        div.innerHTML = `<img src="${p.img}" alt="${p.label}"><div class="product-label">${p.label}</div>`;
      }
    } else if (batchIndex === 4) { // batch 4: fullscreen
      div.classList.add("full-view");
      if (p.link) {
        div.innerHTML = `<a href="${p.link}"><img src="${p.img}" alt="${p.label}"></a>`;
      } else {
        div.innerHTML = `<img src="${p.img}" alt="${p.label}">`;
      }
    } else { // batch 1 & 2: label over afbeelding
      if (p.link) {
        div.innerHTML = `<a href="${p.link}"><img src="${p.img}" alt="${p.label}"><div class="product-label">${p.label}</div></a>`;
      } else {
        div.innerHTML = `<img src="${p.img}" alt="${p.label}"><div class="product-label">${p.label}</div>`;
      }
    }

    return div;
  }

  // ========================
  // 5. Toon batch
  // ========================
  function showBatch(index) {
    grid.className = "grid " + batches[index];
    grid.innerHTML = "";

    switch(index) {
      case 0:
        // ==============================
        // Batch 1: linker afbeelding + rechter placeholder + hamburger menu
        // ==============================
        grid.appendChild(createProduct(products[0], 1));

        const placeholder0 = document.createElement("div");
        placeholder0.className = "placeholder";

        const placeholderInner = document.createElement("div");
        placeholderInner.className = "placeholder-inner";

        // Tekst in het midden
        const placeholderText = document.createElement("span");
        placeholderText.className = "placeholder-text";
        placeholderText.textContent = "Hier kan tekst komen";
        placeholderInner.appendChild(placeholderText);

        // Hamburger menu rechtsboven
        const hamburgerMenu = document.createElement("div");
        hamburgerMenu.className = "hamburger-menu";

        const menuHeader = document.createElement("div");
        menuHeader.className = "menu-header";
        menuHeader.textContent = "☰ Menu";
        hamburgerMenu.appendChild(menuHeader);

        const menuContent = document.createElement("div");
        menuContent.className = "menu-content";

        const menuItems = [
          { label: "Men", link: "men.html" },
          { label: "Women", link: "women.html" },
          { label: "Children", link: "children.html" },
          { label: "Discover", link: "discover.html" }
        ];

        menuItems.forEach(item => {
          const a = document.createElement("a");
          a.href = item.link;
          a.textContent = item.label;
          menuContent.appendChild(a);
        });

        hamburgerMenu.appendChild(menuContent);
        placeholderInner.appendChild(hamburgerMenu);
        placeholder0.appendChild(placeholderInner);
        grid.appendChild(placeholder0);

        // Klik-event toggle menu
        menuHeader.addEventListener("click", (e) => {
        e.stopPropagation(); // voorkomt dat buitenklik direct sluit
        menuContent.classList.toggle("open");
        });

        // Sluit menu bij klik buiten het menu
        document.addEventListener("click", (e) => {
        if (!menuContent.contains(e.target) && !menuHeader.contains(e.target)) {
        menuContent.classList.remove("open");
        }
        });

        break;

      case 1:
        // ==============================
        // Batch 2: rechter product + linker placeholder
        // ==============================
        const placeholder1 = document.createElement("div");
        placeholder1.className = "placeholder";
        placeholder1.innerHTML = `<div class="placeholder-inner"><span class="placeholder-text">Hier kan tekst komen</span></div>`;
        grid.appendChild(placeholder1);
        grid.appendChild(createProduct(products[1], 2));
        break;

      case 2:
        // ==============================
        // Batch 3: vier gelijke blokken
        // ==============================
        [2,3,4,5].forEach(i => {
          if (products[i]) grid.appendChild(createProduct(products[i], 3));
        });
        break;

      case 3:
        // ==============================
        // Batch 4: fullscreen product
        // ==============================
        if (products[6]) grid.appendChild(createProduct(products[6], 4));
        break;
    }

    // ==============================
    // Text-bar alleen bij batch 3
    // ==============================
    const textBar = document.querySelector('.text-bar');
    const textMessage = document.querySelector('#textMessage');
    if (index === 2) {
      textBar.style.opacity = 1;
      textMessage.textContent = "Ontdek onze unieke collectie";
    } else {
      textBar.style.opacity = 0;
    }
  }

  // ========================
  // 6. Scroll handler
  // ========================
  window.addEventListener("wheel", (e) => {
    if (isScrolling) return;

    const prev = currentBatch;
    if (e.deltaY > 50 && currentBatch < batches.length - 1) {
      currentBatch++;
    } else if (e.deltaY < -50 && currentBatch > 0) {
      currentBatch--;
    }

    if (currentBatch !== prev) {
      isScrolling = true;
      showBatch(currentBatch);
      setTimeout(() => { isScrolling = false; }, 400);
    }
  }, { passive: false });

  // ========================
  // 7. Eerste render
  // ========================
  showBatch(currentBatch);

});