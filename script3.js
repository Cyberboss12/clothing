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
  }, 500);
}

setInterval(showNextMessage, 8000);

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
 * Als de info-bar zichtbaar is: section height = 100vh - infoBarHeight
 * Als de info-bar verborgen is: section height = 100vh
 */
function adjustFirstSection() {
  if (!firstSection) return;

  // Als infoBar bestaat en zichtbaar is -> reduceer eerste section
  if (infoBar && !infoBar.classList.contains('hidden')) {
    // Zorg dat de computed height juist gemeten wordt
    const rect = infoBar.getBoundingClientRect();
    const infoHeight = Math.round(rect.height);
    firstSection.style.height = `calc(100vh - ${infoHeight}px)`;
  } else {
    // info-bar weg -> eerste section weer full viewport
    firstSection.style.height = '100vh';
  }
}

// Run na DOM ready en ook na volledige window load (voor alle images/layout)
window.addEventListener('DOMContentLoaded', () => {
  // korte vertraging om zeker te zijn dat CSS is toegepast
  adjustFirstSection();
});
window.addEventListener('load', () => {
  adjustFirstSection();
});
window.addEventListener('resize', () => {
  adjustFirstSection();
});

// Klik op kruisje: animatie -> verberg -> pas section aan
if (closeBtn && infoBar) {
  closeBtn.addEventListener('click', () => {
    // start closing animation
    infoBar.classList.add('closing');

    // na overgang: uit DOM-flow halen en aanpassen
    const onTransitionEnd = (ev) => {
      // alleen reageren op de transition van de info-bar zelf
      if (ev.target !== infoBar) return;
      infoBar.classList.add('hidden');       // display:none
      infoBar.classList.remove('closing');   // reset state
      adjustFirstSection();                  // pas eerste section aan nu info-bar niet meer in flow is
      infoBar.removeEventListener('transitionend', onTransitionEnd);
    };

    infoBar.addEventListener('transitionend', onTransitionEnd);

    // Fallback: als transitionend niet firet (bv oudere browsers), forceer na 350ms
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
const duration = 8000; // 8 seconden
const fadeTime = 800;  // moet gelijk zijn aan CSS transition tijd

function switchContent() {
  const currentItem = switchItems[currentIndex];
  currentItem.classList.remove('active'); // start fade-out

  // volgende item bepalen
  const nextIndex = (currentIndex + 1) % switchItems.length;
  const nextItem = switchItems[nextIndex];

  // wachten tot fade-out klaar is, dan fade-in nieuwe
  setTimeout(() => {
    nextItem.classList.add('active');
    currentIndex = nextIndex;
  }, fadeTime);
}

setInterval(switchContent, duration);

// Hamburger menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const ham = document.getElementById('hamburgerMenu');
  const overlay = document.getElementById('menuOverlay');

  if (!ham) console.warn('hamburgerMenu element niet gevonden');
  if (!overlay) console.warn('menuOverlay element niet gevonden');

  if (!ham || !overlay) return;

  // Toggle open/close
  function openMenu() {
    overlay.classList.add('menu-open');
    ham.classList.add('is-active');
    overlay.setAttribute('aria-hidden', 'false');
    // voorkom body scroll (optioneel)
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    overlay.classList.remove('menu-open');
    ham.classList.remove('is-active');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  ham.addEventListener('click', () => {
    if (overlay.classList.contains('menu-open')) closeMenu();
    else openMenu();
  });

  // keyboard accessibility (Enter/Space)
  ham.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      ham.click();
    }
  });

  // Klik buiten de grid sluit het menu
  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) closeMenu();
  });

  // Klik op een link sluit menu ook
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => closeMenu());
  });
});
