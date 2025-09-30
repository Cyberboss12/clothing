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

function adjustFirstSection() {
  if (!firstSection) return;
  const infoHeight = infoBar && !infoBar.classList.contains('hidden') ? infoBar.offsetHeight : 0;
  firstSection.style.height = `calc(100vh - ${infoHeight}px)`;
}

window.addEventListener('DOMContentLoaded', adjustFirstSection);
window.addEventListener('resize', adjustFirstSection);
window.addEventListener('load', adjustFirstSection);

// ===== Logo, menu en balken =====
const ham = document.getElementById('hamburgerMenu');
const overlay = document.getElementById('menuOverlay');
const whiteBar = document.querySelector('.white-bar');
const blackLine = document.querySelector('.black-line');
const topOverlay = document.querySelector('.top-overlay');

// Zorg dat de inhoud van white-bar inner altijd bestaat
let whiteInner = whiteBar.querySelector('.white-bar-inner');
if (!whiteInner) {
  whiteInner = document.createElement('div');
  whiteInner.className = 'white-bar-inner';
  whiteBar.appendChild(whiteInner);
}

// Plaats ham en topOverlay altijd in white-bar-inner zodat alles synchroon meebeweegt
if (ham) whiteInner.appendChild(ham);
if (topOverlay) whiteInner.appendChild(topOverlay);

// ===== Update functie =====
function updateBarPosition() {
  const infoHeight = infoBar && !infoBar.classList.contains('hidden') ? infoBar.offsetHeight : 0;

  // White-bar en black-line meescrollen met info-bar
  whiteBar.style.position = infoHeight > 0 ? 'sticky' : 'fixed';
  whiteBar.style.top = infoHeight > 0 ? `${infoHeight}px` : '0';
  blackLine.style.position = whiteBar.style.position;
  blackLine.style.top = infoHeight > 0
    ? `${infoHeight + whiteBar.offsetHeight}px`
    : `${whiteBar.offsetHeight}px`;

  // Pas firstSection aan
  adjustFirstSection();
}

// ===== Info-bar sluiten =====
if (closeBtn && infoBar) {
  closeBtn.addEventListener('click', () => {
    infoBar.classList.add('hidden');
    updateBarPosition();
  });
}

// ===== Menu functionaliteit =====
if (ham && overlay && whiteBar && blackLine) {
  function showBars() { whiteBar.classList.add('visible'); }
  function hideBars() { whiteBar.classList.remove('visible'); }

  function openMenu() {
    overlay.classList.add('menu-open');
    ham.classList.add('is-active', 'menu-active');
    blackLine.classList.add('visible');
    whiteBar.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
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

  ham.addEventListener('mouseenter', showBars);
  ham.addEventListener('mouseleave', () => { if (!overlay.classList.contains('menu-open')) hideBars(); });
  ham.addEventListener('click', () => { overlay.classList.contains('menu-open') ? closeMenu() : openMenu(); });
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));

  window.addEventListener('scroll', updateBarPosition);
  window.addEventListener('resize', updateBarPosition);
  window.addEventListener('load', updateBarPosition);

  // Init
  updateBarPosition();
}