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
 * Als de info-bar zichtbaar is: section height = 100vh - infoBarHeight
 * Als de info-bar verborgen is: section height = 100vh
 */
function adjustFirstSection() {
  window.dispatchEvent(new Event('resize'));
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
const fadeTime = 650;  // moet gelijk zijn aan CSS transition tijd

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
// Hamburger menu toggle (vervang je huidige blok met dit)
const ham = document.getElementById('hamburgerMenu');
const overlay = document.getElementById('menuOverlay');
const whiteBar = document.querySelector('.white-bar');
const blackLine = document.querySelector('.black-line');

if (ham && overlay && whiteBar && blackLine) {

function updateBarPosition() {
  const rect = ham.getBoundingClientRect();

  // Plaats de witte balk direct onder de hamburger-knop
  const topForWhite = Math.round(rect.bottom);
  whiteBar.style.top = `${topForWhite}px`;

  // Haal hoogte van balken
  const wbHeight = parseFloat(getComputedStyle(whiteBar).height) || 40;
  const blHeight = parseFloat(getComputedStyle(blackLine).height) || 3;

  // Plaats zwarte lijn direct onder witte balk
  const blackTop = topForWhite + wbHeight;
  blackLine.style.top = `${blackTop}px`;

  // Overlay begint direct onder zwarte lijn
  const overlayTop = blackTop + blHeight;
  overlay.style.top = `${overlayTop}px`;
}

// Toon balken bij hover, maar alleen als menu niet open is
function showBars() {
  updateBarPosition();
  if (!overlay.classList.contains('menu-open')) {
    whiteBar.classList.add('visible');
    blackLine.classList.remove('visible'); // zwarte lijn alleen bij open menu
  }
}

function hideBars() {
  if (!overlay.classList.contains('menu-open')) {
    whiteBar.classList.remove('visible');
  }
}

// Open/close menu
function openMenu() {
  updateBarPosition();
  overlay.classList.add('menu-open');
  ham.classList.add('is-active', 'menu-active');
  whiteBar.classList.add('visible');
  blackLine.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  overlay.classList.remove('menu-open');
  ham.classList.remove('is-active', 'menu-active');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  whiteBar.classList.remove('visible');
  blackLine.classList.remove('visible');
}

// Event listeners
ham.addEventListener('mouseenter', showBars);
ham.addEventListener('mouseleave', hideBars);
ham.addEventListener('click', () => {
  overlay.classList.contains('menu-open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', ev => {
  if (ev.target === overlay) closeMenu();
});

overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

// Herpositioneer bij resize of scroll
window.addEventListener('resize', updateBarPosition);
window.addEventListener('scroll', () => {
  if (overlay.classList.contains('menu-open')) updateBarPosition();
});

// Initial position
updateBarPosition();
