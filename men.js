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
const overlay = document.getElementById('menuOverlay');
const whiteBar = document.querySelector('.white-bar');
const blackLine = document.querySelector('.black-line');

if (ham && overlay && whiteBar && blackLine) {

  // Update positie balken t.o.v. hamburger
  function updateBarPosition() {
    const rect = ham.getBoundingClientRect();
    const topForWhite = Math.round(rect.bottom);
    whiteBar.style.top = `${topForWhite}px`;

    const wbHeight = Math.max(whiteBar.getBoundingClientRect().height, 40);
    blackLine.style.top = `${topForWhite + wbHeight}px`;
  }

  // Helpers voor tonen/verbergen balken
  function showBars() {
    updateBarPosition();
    whiteBar.classList.add('visible');
    blackLine.classList.add('visible');
  }

  function hideBars() {
    whiteBar.classList.remove('visible');
    blackLine.classList.remove('visible');
  }

  // Open/close menu
  function openMenu() {
    updateBarPosition();
    overlay.style.top = `${Math.round(ham.getBoundingClientRect().bottom + 5)}px`;
    overlay.classList.add('menu-open');
    ham.classList.add('is-active', 'menu-active');

    whiteBar.classList.add('visible');
    blackLine.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('menu-open');
    ham.classList.remove('is-active', 'menu-active');

    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';

    whiteBar.classList.remove('visible');
    blackLine.classList.remove('visible');
  }

  // Hover effect voor hamburger
  ham.addEventListener('mouseenter', showBars);
  ham.addEventListener('mouseleave', () => {
    if (!overlay.classList.contains('menu-open')) hideBars();
  });

  // Klik toggles menu
  ham.addEventListener('click', () => {
    if (overlay.classList.contains('menu-open')) closeMenu();
    else openMenu();
  });

  // Klik buiten overlay sluit menu
  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) closeMenu();
  });

  // Klik op links in overlay sluit menu
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Resize handling
  window.addEventListener('resize', () => {
    if (overlay.classList.contains('menu-open')) {
      updateBarPosition();
      overlay.style.top = `${Math.round(ham.getBoundingClientRect().bottom + 5)}px`;
    } else {
      updateBarPosition();
    }
  });

  // Initial run
  updateBarPosition();
}