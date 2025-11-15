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
const infoBar = document.getElementById('infoBar');
const firstSection = document.querySelector('.fullscreen-section:first-of-type');
const closeBtn = document.getElementById('closeInfoBar');

if (!firstSection) console.warn('Geen .fullscreen-section:first-of-type gevonden.');
if (!infoBar) console.warn('Geen #infoBar gevonden.');
if (!closeBtn) console.warn('Geen #closeInfoBar gevonden.');

function adjustFirstSection() {
  if (!firstSection) return;
  if (infoBar && !infoBar.classList.contains('hidden')) {
    const rect = infoBar.getBoundingClientRect();
    const infoHeight = Math.round(rect.height);
    firstSection.style.height = `calc(100vh - ${infoHeight}px)`;
  } else {
    firstSection.style.height = '100vh';
  }
}

if (closeBtn && infoBar) {
  closeBtn.addEventListener('click', () => {
    infoBar.classList.add('closing');
    const onTransitionEnd = (ev) => {
      if (ev.propertyName !== 'transform') return;
      infoBar.classList.add('hidden');
      infoBar.classList.remove('closing');
      infoBar.removeEventListener('transitionend', onTransitionEnd);
    };
    infoBar.addEventListener('transitionend', onTransitionEnd);

    setTimeout(() => {
      if (!infoBar.classList.contains('hidden')) {
        infoBar.classList.add('hidden');
        infoBar.classList.remove('closing');
      }
    }, 500);
  });
}

// ===== Logo en switch-items =====
const switchItems = document.querySelectorAll('.top-overlay .switch-item');
let currentIndex = 0;
const duration = 8000;
const fadeTime = 650;

function switchContent() {
  const currentItem = switchItems[currentIndex];
  currentItem.classList.remove('active');
  const nextIndex = (currentIndex + 1) % switchItems.length;
  const nextItem = switchItems[nextIndex];
  setTimeout(() => {
    nextItem.classList.add('active');
    currentIndex = nextIndex;
  }, fadeTime);
}
setInterval(switchContent, duration);

// ===== NIEUW DROPMENU + HAMBURGER =====
const ham = document.getElementById('hamburgerMenu');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownItems = dropdownMenu ? dropdownMenu.querySelectorAll('li') : [];

if (ham && dropdownMenu) {

  // Open/close menu functie
  function openMenu() {
    dropdownMenu.classList.add('active');
    ham.classList.add('is-active', 'menu-active');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Animatie: menu-items één voor één laten verschijnen
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

  function closeMenu() {
    dropdownMenu.classList.remove('active');
    ham.classList.remove('is-active', 'menu-active');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    // Reset menu-items positie
    dropdownItems.forEach(item => {
      item.style.transition = '';
      item.style.opacity = '';
      item.style.transform = '';
    });
  }

  // Klik toggles menu
  ham.addEventListener('click', () => {
    if (dropdownMenu.classList.contains('active')) closeMenu();
    else openMenu();
  });

  // Klik buiten dropdown sluit menu
  dropdownMenu.addEventListener('click', (ev) => {
    if (ev.target === dropdownMenu) closeMenu();
  });

  // Klik op links sluit menu
  dropdownItems.forEach(a => {
    a.querySelector('a').addEventListener('click', closeMenu);
  });
}