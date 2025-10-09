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
  const LOCK_MS = 600;           // lock-tijd tussen stappen (aanpassen indien gewenst)
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

    // afbeeldings-correcties (zoals eerder)
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
    if (extraContent) extraContent.scrollIntoView({ behavior: "smooth", block: "start" });
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
  // 7. Scroll / toets / touch events (VERBETERDE wheel-logica)
  // ========================
  // wheel accumulatie + drempel zodat harde/soft scrolls niet rijen overslaan
  const WHEEL_THRESHOLD = 40; // pas aan indien je trackpad gevoeliger/gevoeliger wil
  let wheelAccum = 0;
  let wheelTimeout = null;

  window.addEventListener("wheel", e => {
    const deltaY = e.deltaY;
    if (!deltaY) return;

    // zorg dat we de default scroll blokkeren voor de product-sectie interactie
    // (we willen volledige controle zodat er niet wordt ge-skippt)
    e.preventDefault();

    // update accumulator (trackpad levert veel kleine events)
    wheelAccum += deltaY;

    // reset accumulator kort na laatste wheel event (samengestelde gestures)
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
      wheelAccum = 0;
    }, 150);

    // respecteer de lock (voorkom dubbele steps door momentum)
    if (lock) return;

    // wacht totdat we genoeg delta hebben verzameld
    if (Math.abs(wheelAccum) < WHEEL_THRESHOLD) return;

    // we hebben nu voldoende intentie om 1 stap te doen
    const direction = wheelAccum > 0 ? "down" : "up";
    wheelAccum = 0; // verbruik de intentie

    if (direction === "down") {
      // als er nog batches zijn -> ga 1 batch omlaag
      if (index + batchSize < products.length) {
        triggerStep("down");
      } else {
        // we staan op de laatste batch: 1 scroll gaat naar extra content
        if (!extraScrollLock) {
          // blok tijdelijk verdere scroll-acties
          extraScrollLock = true;
          lock = true; // ook lock zodat triggerStep niet kan triggerren tijdens scroll
          scrollToExtraContent();
          setTimeout(() => {
            extraScrollLock = false;
            lock = false;
          }, LOCK_MS + 200);
        }
      }
    } else { // direction === "up"
      // als pagina al naar beneden gescrolled is (user in extraContent) -> terug naar laatste batch
      if (window.scrollY > section.offsetTop) {
        scrollToLastBatch();
      } else {
        // anders: ga 1 batch omhoog
        triggerStep("up");
      }
    }
  }, { passive: false });


  // Pijltoetsen — blijven kort en simpel, gebruiken triggerStep die lock regelt
  window.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") {
      if (!atLastBatch()) triggerStep("down");
      else scrollToExtraContent();
    } else if (e.key === "ArrowUp") {
      if (window.scrollY > section.offsetTop) scrollToLastBatch();
      else triggerStep("up");
    }
  });


  // Touch-besturing (swipe)
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
  // 8. Afbeeldingscorrectie (ongeveer jouw eerdere logica)
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

      // optionele aspect-check (leave as cover)
      img.addEventListener("load", () => {
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        if (aspectRatio < 0.5 || aspectRatio > 2) {
          img.style.objectFit = "cover";
        }
      });
    });
  }


  // ========================
  // 9. Eerste render met preload-fix (voorkomt afwijkende eerste rij)
  // ========================
  function preloadFirstBatch(callback) {
    const slice = products.slice(0, batchSize);
    let loaded = 0;
    let done = false;

    slice.forEach(p => {
      const img = new Image();
      img.src = p.img;
      img.onload = img.onerror = () => {
        loaded++;
        if (!done && loaded === slice.length) {
          done = true;
          callback();
        }
      };
    });

    // fallback — als iets blijft hangen, toch na 3s tonen
    setTimeout(() => {
      if (!done) callback();
    }, 3000);
  }

  // startpagina renderen zodra eerste batch geladen is
  preloadFirstBatch(() => {
    showBatch(index);
  });

});