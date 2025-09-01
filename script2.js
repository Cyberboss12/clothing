// Alle boodschappen die je wilt tonen
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
  // Verberg huidige tekst
  infoMessage.classList.add('hidden');

  // Wacht tot fade-out klaar is (500ms uit CSS)
  setTimeout(() => {
    // Nieuwe boodschap instellen
    msgIndex = (msgIndex + 1) % messages.length;
    infoMessage.textContent = messages[msgIndex];

    // Fade-in
    infoMessage.classList.remove('hidden');
  }, 500);
}

// Elke 4 seconden wisselen van boodschap
setInterval(showNextMessage, 4000);

const products = [
  { img: "afbeeldingen/model.jpg", label: "Men" },
  { img: "afbeeldingen/model.jpg", label: "Women" },
  { img: "afbeeldingen/model.jpg", label: "Children" },
  { img: "afbeeldingen/model.jpg", label: "Discover" },
  { img: "afbeeldingen/Black square_test.png", label: "5" },
  { img: "afbeeldingen/model.jpg", label: "6" },
  { img: "afbeeldingen/model.jpg", label: "7" },
  { img: "afbeeldingen/model.jpg", label: "8" },
  { img: "afbeeldingen/model.jpg", label: "9" },
  { img: "afbeeldingen/model.jpg", label: "10" },
  { img: "afbeeldingen/model.jpg", label: "11" },
  { img: "afbeeldingen/model.jpg", label: "12" }
];

// === Carousel basis (laat je eigen products + showBatch zoals je had) ===
const section = document.getElementById("productSection");
const grid    = document.getElementById("productGrid");

const batchSize = 4;
let index = 0;
let lock = false;
let engaged = false; // zitten we in "carousel-modus"?

function showBatch(startIndex){
  grid.innerHTML = "";
  const slice = products.slice(startIndex, startIndex + batchSize);
  slice.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${p.img}" alt="${p.label}">
      <div class="product-label">${p.label}</div>
    `;
    grid.appendChild(div);
    requestAnimationFrame(() => div.classList.add("loaded"));
  });
}
showBatch(index);

function triggerStep(dir){
  if (lock) return false;
  if (dir === 'down'){
    if (index + batchSize < products.length){
      index += batchSize;
      showBatch(index);
      lock = true; setTimeout(()=>lock=false, 320);
      return true;
    } else {
      // bij laatste batch -> verlaat modus zodat pagina verder scrolt
      engaged = false;
      return false;
    }
  } else {
    if (index - batchSize >= 0){
      index -= batchSize;
      showBatch(index);
      lock = true; setTimeout(()=>lock=false, 320);
      return true;
    } else {
      // bij eerste batch omhoog -> verlaat modus zodat pagina omhoog kan
      engaged = false;
      return false;
    }
  }
}

function sectionTop(){
  return section.getBoundingClientRect().top + window.scrollY;
}
function sectionBottom(){
  return sectionTop() + section.offsetHeight;
}
function enterCarousel(){
  engaged = true;
  // zorg dat de sectie in beeld staat
  window.scrollTo({ top: sectionTop(), behavior: 'smooth' });
}

window.addEventListener('wheel', (e) => {
  const PIXEL_PER_LINE = 16;
  const dy = (e.deltaMode === 1) ? e.deltaY * PIXEL_PER_LINE : e.deltaY;

  const top    = window.scrollY;
  const vh     = window.innerHeight;
  const sTop   = sectionTop();
  const sBot   = sectionBottom();
  const above  = top + 10 < sTop;            // viewport duidelijk boven sectie
  const below  = top > sBot - vh - 10;       // viewport duidelijk onder sectie
  const inside = !above && !below;           // overlap met sectie

  // Nog niet in carousel-modus?
  if (!engaged){
    if (dy > 0 && above){
      // van boven naar beneden -> ga eerst naar de sectie en engage
      e.preventDefault();
      enterCarousel();
      return;
    }
    if (dy < 0 && below){
      // van onder naar boven -> ga naar sectie en start bij laatste batch
      e.preventDefault();
      index = Math.max(0, products.length - batchSize);
      showBatch(index);
      enterCarousel();
      return;
    }
    if (inside){
      // al op de sectie: ga de modus in en hou pagina stil
      engaged = true;
      e.preventDefault();
    } else {
      // ergens anders op de pagina -> normale scroll
      return;
    }
  }

  // In carousel-modus: hou pagina stil en stap max 1 batch per wheel
  e.preventDefault();
  if (dy > 0){
    const moved = triggerStep('down');
    if (!moved){
      // klaar onder: laat pagina door naar content/footer
      window.scrollTo({ top: sBot, behavior: 'smooth' });
    }
  } else if (dy < 0){
    const moved = triggerStep('up');
    if (!moved){
      // klaar boven: laat pagina terug naar header/infobar
      window.scrollTo({ top: sTop - 1, behavior: 'smooth' });
    }
  }
}, { passive: false });