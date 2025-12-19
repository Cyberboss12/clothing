// ===== Info-bar boodschappen =====
const messages = [
  "Welkom bij onze webshop!",
  "Gratis verzending vanaf €50",
  "Vandaag: 10% korting op alle tassen",
  "Nieuw binnen: zomercollectie",
  "Sign up to recieve 15% off on your next order!",
  "Free shipping on orders above €150",
  "Sign up to our community newsletter!"
];

const infoMessage = document.getElementById('infoMessage');
let msgIndex = 0;

function showNextMessage() {
  if (!infoMessage) return;
  infoMessage.classList.add('hidden');

  setTimeout(() => {
    msgIndex = (msgIndex + 1) % messages.length;
    infoMessage.textContent = messages[msgIndex];
    infoMessage.classList.remove('hidden');
  }, 650);
}

setInterval(showNextMessage, 3675);

// ===== Wegklikbare info-bar & aanpassing eerste section =====
const ham = document.getElementById('menuButton');   // <-- FIXED ID
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownItems = dropdownMenu.querySelectorAll('li');

// Menu openen
function openMenu() {
  dropdownMenu.classList.add('active');
  ham.classList.add('is-active');

  // Scrolling blokkeren
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  // Animatie van menu-items
  dropdownItems.forEach((item, i) => {
    item.style.opacity = 0;
    item.style.transform = 'translateX(-20px)';

    setTimeout(() => {
      item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      item.style.opacity = 1;
      item.style.transform = 'translateX(0)';
    }, 100 * i);
  });
}

// Menu sluiten
function closeMenu() {
  dropdownMenu.classList.remove('active');
  ham.classList.remove('is-active');

  // Scroll weer toestaan
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';

  // Reset item-styling
  dropdownItems.forEach(item => {
    item.style.transition = '';
    item.style.opacity = '';
    item.style.transform = '';
  });
}

// Toggle bij klikken op hamburger
ham.addEventListener('click', () => {
  if (dropdownMenu.classList.contains('active')) closeMenu();
  else openMenu();
});

// Klik buiten het menu sluit het menu
dropdownMenu.addEventListener('click', (ev) => {
  if (ev.target === dropdownMenu) closeMenu();
});

// Klik op een link sluit ook het menu
dropdownItems.forEach(item => {
  const link = item.querySelector('a');
  if (link) link.addEventListener('click', closeMenu);
});


// ===== Horizontaal scrollen via rechter pijltje =====
document.addEventListener("DOMContentLoaded", () => {

  const wrapper = document.querySelector('.horizontal-wrapper');
  const sections = document.querySelectorAll('.horizontal-section');
  const rightBar = document.querySelector('.right-bar');
  const backBtn = document.getElementById('backToFirst'); // NIEUW
  const searchBtn = document.getElementById('searchButton');

  let currentIndex = 0;
  let hasLeftFirstBatch = false;
  const firstAllowedScrollLeft = sections[1].offsetLeft;

  function scrollToSection(i) {
    wrapper.scrollTo({
      left: sections[i].offsetLeft,
      behavior: "smooth"
    });
  }

  function updateScrollLock() {
    if (currentIndex === 0) {
      wrapper.style.overflowX = "hidden";
    } else {
      wrapper.style.overflowX = "auto";
    }
  }

  rightBar.addEventListener("click", () => {
    if (currentIndex < sections.length - 1) {
      currentIndex++;
      scrollToSection(currentIndex);
      updateScrollLock();

      if (currentIndex > 0) hasLeftFirstBatch = true;
    }
  });

  // ===== NIEUW: terug naar batch 1 via < knop =====
  backBtn.addEventListener("click", () => {
    currentIndex = 0;
    hasLeftFirstBatch = false; // zodat guard tijdelijk niet blokkeert
    scrollToSection(0);
    updateScrollLock();
  });

  wrapper.addEventListener("scroll", () => {
    const scrollLeft = wrapper.scrollLeft;

    sections.forEach((section, index) => {
      const midpoint = section.offsetLeft - window.innerWidth / 2;
      if (scrollLeft >= midpoint) currentIndex = index;
    });

    updateScrollLock();

    // ===== Guard: voorkomt shaky effect door terugscroll =====
    // Alleen als batch 1 definitief verlaten is
    if (hasLeftFirstBatch && wrapper.scrollLeft < firstAllowedScrollLeft) {
      wrapper.scrollLeft = firstAllowedScrollLeft;
    }
  });

  scrollToSection(0);
  updateScrollLock();
});