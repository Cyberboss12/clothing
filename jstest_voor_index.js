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
  const section = document.getElementById("productSection");
  const grid = document.getElementById("productGrid");
  const extraContent = document.getElementById("extraContent");

  if (!section || !grid) {
    console.error("❌ Fout: 'productSection' of 'productGrid' werd niet gevonden in de DOM.");
    return;
  }

  let index = 0;
  const batchSize = 4;
  let lock = false;
  const LOCK_MS = 600;
  const TOUCH_THRESHOLD = 20;
  let extraScrollLock = false;


  // ========================
  // 4. Batch weergave
  // ========================
  function showBatch(startIndex) {
    grid.innerHTML = "";

    const slice = products.slice(startIndex, startIndex + batchSize);
    slice.forEach(p => {
      const div = document.createElement("div");
      div.className = "product";

      const content = p.link
        ? `<a href="${p.link}" style="display:block;text-decoration:none;color:inherit;">
             <img src="${p.img}" alt="${p.label}">
             <div class="product-label">${p.label}</div>
           </a>`
        : `<img src="${p.img}" alt="${p.label}">
           <div class="product-label">${p.label}</div>`;

      div.innerHTML = content;
      grid.appendChild(div);

      requestAnimationFrame(() => div.classList.add("loaded"));
    });

    // 🟢 8. Afbeeldingscorrectie
    fixImageAlignment();
  }


  // ========================
  // 5. Navigatie (up/down)
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

  function atLastBatch() {
    return index >= products.length - batchSize;
  }


  // ========================
  // 6. Scrollfuncties
  // ========================
  function scrollToExtraContent() {
    extraContent.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function scrollToLastBatch() {
    if (extraScrollLock) return;

    index = products.length - batchSize;
    showBatch(index);

    const headerEl = document.getElementById("siteHeader");
    const infoEl = document.getElementById("infoBar");
    if (headerEl) headerEl.style.opacity = "1";
    if (infoEl) infoEl.style.opacity = "1";

    extraScrollLock = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => (extraScrollLock = false), 900);
  }


  // ========================
  // 7. Scroll / toets / touch events
  // ========================
  window.addEventListener("wheel", e => {
    const deltaY = e.deltaY;

    if (deltaY > 0) {
      if (!atLastBatch()) {
        e.preventDefault();
        triggerStep("down");
      } else {
        e.preventDefault();
        scrollToExtraContent();
      }
    } else if (deltaY < 0) {
      if (window.scrollY > section.offsetTop) {
        e.preventDefault();
        scrollToLastBatch();
      } else {
        e.preventDefault();
        triggerStep("up");
      }
    }
  }, { passive: false });

  window.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") {
      if (!atLastBatch()) triggerStep("down");
      else scrollToExtraContent();
    } else if (e.key === "ArrowUp") {
      if (window.scrollY > section.offsetTop) scrollToLastBatch();
      else triggerStep("up");
    }
  });

  let touchStartY = null;

  section.addEventListener("touchstart", e => {
    if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
  }, { passive: true });

  section.addEventListener("touchmove", e => {
    if (touchStartY === null) return;
    const dy = touchStartY - e.touches[0].clientY;

    if (dy > TOUCH_THRESHOLD) {
      if (!atLastBatch()) triggerStep("down");
      else scrollToExtraContent();
      touchStartY = null;
    } else if (dy < -TOUCH_THRESHOLD) {
      if (window.scrollY > section.offsetTop) {
        e.preventDefault();
        scrollToLastBatch();
      } else {
        triggerStep("up");
      }
      touchStartY = null;
    }
  }, { passive: false });

  section.addEventListener("touchend", () => { touchStartY = null; });


  // ========================
  // 8. Afbeeldingscorrectie
  // ========================
  function fixImageAlignment() {
    const images = grid.querySelectorAll("img");
    images.forEach(img => {
      img.style.objectFit = "cover";
      img.style.objectPosition = "top";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.display = "block";
      img.style.margin = "0";
      img.style.padding = "0";

      // witruimte van transparante PNG’s vermijden
      img.addEventListener("load", () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        if (aspectRatio < 0.5 || aspectRatio > 2) {
          img.style.objectFit = "cover";
        }
      });
    });
  }

  // eerste render
  showBatch(index);
});