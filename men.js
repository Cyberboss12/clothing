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
const ham = document.getElementById('menuButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownItems = dropdownMenu.querySelectorAll('li');

// Menu openen
function openMenu() {
  dropdownMenu.classList.add('active');
  ham.classList.add('is-active');

  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

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

  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';

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

  rightBar.addEventListener('click', () => {
    if (currentIndex < sections.length - 1) {
      currentIndex++;
      wrapper.scrollTo({
        left: sections[currentIndex].offsetLeft,
        behavior: 'smooth'
      });
    }
  });

  // update currentIndex bij handmatig scrollen
  window.addEventListener('scroll', () => {

    // ⛔ BELANGRIJK:
    // Als we in batch 2 (index 1) zitten, NIKS doen.
    // Hierdoor zal verticale scroll NIET de horizontale index updaten.
    if (currentIndex === 1) return;

    const scrollLeft = window.scrollX;

    sections.forEach((section, i) => {
      if (scrollLeft >= section.offsetLeft - 10) {
        currentIndex = i;
      }
    });
  });

  // Veilige functie die al door jouw script werd aangeroepen
  function scrollToSection(i) {
    if (!sections[i]) return;
    wrapper.scrollTo({ left: sections[i].offsetLeft, behavior: "smooth" });
  }

  scrollToSection(currentIndex);
});