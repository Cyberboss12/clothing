// ===== Info-bar boodschappen =====
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
  if (!infoMessage) return;
  infoMessage.classList.add('hidden');

  setTimeout(() => {
    msgIndex = (msgIndex + 1) % messages.length;
    infoMessage.textContent = messages[msgIndex];
    infoMessage.classList.remove('hidden');
  }, 500);
}

setInterval(showNextMessage, 4000);

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

const switchItems = document.querySelectorAll('.top-overlay .switch-item');
let currentIndex = 0;

function switchContent() {
  // huidige verbergen
  switchItems[currentIndex].classList.add('hidden');

  // volgende index berekenen
  currentIndex = (currentIndex + 1) % switchItems.length;

  // volgende tonen
  switchItems[currentIndex].classList.remove('hidden');
}

// Elke 8 seconden wisselen
setInterval(switchContent, 8000);