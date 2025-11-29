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

  const rightBar = document.querySelector('.right-bar');
  const sections = document.querySelectorAll('.horizontal-section');
  let currentIndex = 0;

  const wrapper = document.querySelector('.horizontal-wrapper');

  // ===== ADD: horizontale scroll lock functie =====
  function updateScrollLock() {
    if (currentIndex === 0) {
      // View 1 → HORIZONTAAL LOCKEN
      document.body.style.overflowX = "hidden";
      document.documentElement.style.overflowX = "hidden";
    } else {
      // Andere views → VRIJ SCROLLEN
      document.body.style.overflowX = "auto";
      document.documentElement.style.overflowX = "auto";
    }
  }

  // ===== Klik op rechter balk =====
  rightBar.addEventListener('click', () => {
    if (currentIndex < sections.length - 1) {
      currentIndex++;
      wrapper.scrollTo({
        left: sections[currentIndex].offsetLeft,
        behavior: 'smooth'
      });
      updateScrollLock(); // <-- ADD
    }
  });

  // update currentIndex bij handmatig scrollen
  window.addEventListener('scroll', () => {
    const scrollLeft = window.scrollX;
    sections.forEach((section, i) => {
      if (scrollLeft >= section.offsetLeft - 10) {
        currentIndex = i;
      }
    });
    updateScrollLock(); // <-- ADD
  });

  // Optioneel: initial scroll naar eerste section bij page load
  scrollToSection(currentIndex);

  // Eerste view direct locken
  updateScrollLock(); // <-- ADD

});