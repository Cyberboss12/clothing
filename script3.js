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
  const infoHeight = infoBar && !infoBar.classList.contains('hidden') ? infoBar.getBoundingClientRect().height : 0;
  firstSection.style.height = `calc(100vh - ${infoHeight}px)`;
}

window.addEventListener('DOMContentLoaded', adjustFirstSection);
window.addEventListener('load', adjustFirstSection);
window.addEventListener('resize', adjustFirstSection);

// ===== Logo, menu en white-bar =====
const ham = document.getElementById('hamburgerMenu');
const overlay = document.getElementById('menuOverlay');
const whiteBar = document.querySelector('.white-bar');
const blackLine = document.querySelector('.black-line');
const topOverlay = document.querySelector('.top-overlay');

let nudge = -32.6; // kleine offset zodat white-bar niet overlapt met info-bar

// verplaats elementen in white-bar inner
function moveIntoWhiteBar(el) {
  if (!el || !whiteBar) return;
  let inner = whiteBar.querySelector('.white-bar-inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'white-bar-inner';
    inner.style.position = 'relative';
    inner.style.width = '100%';
    whiteBar.appendChild(inner);
  }
  inner.appendChild(el);
  el.style.position = 'relative';
}

// update white-bar en zwarte lijn
function updateBarPosition() {
  const infoVisible = infoBar && !infoBar.classList.contains('hidden');

  let whiteTop = infoVisible ? infoBar.getBoundingClientRect().height + nudge : 0;

  whiteBar.style.position = infoVisible ? 'absolute' : 'fixed';
  whiteBar.style.top = `${whiteTop}px`;

  // inner content altijd synchroon
  const inner = whiteBar.querySelector('.white-bar-inner');
  if (inner) inner.style.top = '0';

  // zwarte lijn direct onder white-bar
  const wbHeight = whiteBar.getBoundingClientRect().height || 50;
  blackLine.style.position = infoVisible ? 'absolute' : 'fixed';
  blackLine.style.top = `${whiteTop + wbHeight}px`;

  adjustFirstSection();
}

// ===== Close info-bar =====
if (closeBtn && infoBar) {
  closeBtn.addEventListener('click', () => {
    infoBar.classList.add('closing');
    const onTransitionEnd = (ev) => {
      if (ev.target !== infoBar) return;
      infoBar.classList.add('hidden');
      infoBar.classList.remove('closing');
      updateBarPosition();
      infoBar.removeEventListener('transitionend', onTransitionEnd);
    };
    infoBar.addEventListener('transitionend', onTransitionEnd);

    setTimeout(() => {
      if (!infoBar.classList.contains('hidden')) {
        infoBar.classList.add('hidden');
        infoBar.classList.remove('closing');
        updateBarPosition();
      }
    }, 500);
  });
}

// ===== Menu functionaliteit =====
if (ham && overlay && whiteBar && blackLine) {
  function showBars() { whiteBar.classList.add('visible'); }
  function hideBars() { whiteBar.classList.remove('visible'); }

  function openMenu() {
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
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    whiteBar.classList.remove('visible');
    blackLine.classList.remove('visible');
  }

  ham.addEventListener('mouseenter', showBars);
  ham.addEventListener('mouseleave', () => { if (!overlay.classList.contains('menu-open')) hideBars(); });
  ham.addEventListener('click', () => { overlay.classList.contains('menu-open') ? closeMenu() : openMenu(); });
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));

  window.addEventListener('resize', updateBarPosition);
  window.addEventListener('scroll', updateBarPosition);
  window.addEventListener('load', updateBarPosition);

  // verplaats hamburger en overlay altijd in white-bar inner
  moveIntoWhiteBar(ham);
  if (topOverlay) moveIntoWhiteBar(topOverlay);

  updateBarPosition();
}