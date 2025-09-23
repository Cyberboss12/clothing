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

// defensive checks
if (!firstSection) console.warn('script3.js: geen .fullscreen-section:first-of-type gevonden.');
if (!infoBar) console.warn('script3.js: geen #infoBar gevonden.');
if (!closeBtn) console.warn('script3.js: geen #closeInfoBar gevonden.');

/**
 * Past de hoogte van de eerste <section> aan.
 */
function adjustFirstSection() {
  window.dispatchEvent(new Event('resize'));
  if (!firstSection) return;

  if (infoBar && !infoBar.classList.contains('hidden')) {
    const rect = infoBar.getBoundingClientRect();
    const infoHeight = Math.round(rect.height);
    firstSection.style.height = `calc(100vh - ${infoHeight}px)`;
  } else {
    firstSection.style.height = '100vh';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  adjustFirstSection();
});
window.addEventListener('load', () => {
  adjustFirstSection();
});
window.addEventListener('resize', () => {
  adjustFirstSection();
});

if (closeBtn && infoBar) {
  closeBtn.addEventListener('click', () => {
    infoBar.classList.add('closing');

    const onTransitionEnd = (ev) => {
      if (ev.target !== infoBar) return;
      infoBar.classList.add('hidden');
      infoBar.classList.remove('closing');
      adjustFirstSection();
      infoBar.removeEventListener('transitionend', onTransitionEnd);
    };

    infoBar.addEventListener('transitionend', onTransitionEnd);

    setTimeout(() => {
      if (!infoBar.classList.contains('hidden')) {
        infoBar.classList.add('hidden');
        infoBar.classList.remove('closing');
        adjustFirstSection();
      }
    }, 400);
  });
}

// logo en tekst
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

// Hamburger menu toggle
const ham = document.getElementById('hamburgerMenu');
const overlay = document.getElementById('menuOverlay');
const whiteBar = document.querySelector('.white-bar');
const blackLine = document.querySelector('.black-line');

if (ham && overlay && whiteBar && blackLine) {

  function showBars() {
    whiteBar.classList.add('visible');
    blackLine.classList.add('visible');
  }

  function hideBars() {
    if (!overlay.classList.contains('menu-open')) {
      whiteBar.classList.remove('visible');
      blackLine.classList.remove('visible');
    }
  }

  function openMenu() {
    overlay.classList.add('menu-open');
    ham.classList.add('is-active', 'menu-active');
    showBars();
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('menu-open');
    ham.classList.remove('is-active', 'menu-active');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    hideBars();
  }

  ham.addEventListener('mouseenter', showBars);
  ham.addEventListener('mouseleave', hideBars);

  ham.addEventListener('click', () => {
    if (overlay.classList.contains('menu-open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) closeMenu();
  });

  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}