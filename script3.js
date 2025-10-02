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
const whiteBar = document.querySelector('.white-bar');
const blackLine = document.querySelector('.black-line');
const topOverlay = document.querySelector('.top-overlay');
const ham = document.getElementById('hamburgerMenu');
const overlay = document.getElementById('menuOverlay');

// ===== Helpers =====
function getInfoBarHeight() {
  return infoBar && !infoBar.classList.contains('hidden')
    ? Math.round(infoBar.getBoundingClientRect().height)
    : 0;
}

// Zorg dat elementen die we in de white-bar stoppen geen oude inline position/top/left meer hebben
function cleanseInlinePosition(el) {
  if (!el) return;
  el.style.position = '';
  el.style.top = '';
  el.style.left = '';
  el.style.bottom = '';
}

// Move ham / topOverlay into white-bar-inner (once)
function ensureWhiteBarInner() {
  if (!whiteBar) return;
  let inner = whiteBar.querySelector('.white-bar-inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'white-bar-inner';
    whiteBar.appendChild(inner);
  }
  if (ham && inner !== ham.parentElement) {
    cleanseInlinePosition(ham);
    inner.appendChild(ham);
  }
  if (topOverlay && inner !== topOverlay.parentElement) {
    cleanseInlinePosition(topOverlay);
    inner.appendChild(topOverlay);
  }
}

// Update white-bar & black-line positions (en overlay)
function updateBarPosition() {
  if (!whiteBar || !blackLine || !overlay) return;

  const infoHeight = getInfoBarHeight();
  const wbHeight = Math.round(whiteBar.getBoundingClientRect().height) || 50;

  // White-bar & black-line position
  if (infoBar && !infoBar.classList.contains('hidden')) {
    infoBar.style.position = 'absolute';
    infoBar.style.top = '0px';
    infoBar.style.left = '0px';
    whiteBar.style.position = 'absolute';
    whiteBar.style.top = `${infoHeight}px`;
    whiteBar.style.left = '0px';
    blackLine.style.position = 'absolute';
    blackLine.style.top = `${infoHeight + wbHeight}px`;
    blackLine.style.left = '0px';
    whiteBar.classList.remove('pinned');
    blackLine.classList.remove('pinned');
  } else {
    whiteBar.style.position = 'fixed';
    whiteBar.style.top = '0px';
    whiteBar.style.left = '0px';
    blackLine.style.position = 'fixed';
    blackLine.style.top = `${wbHeight}px`;
    blackLine.style.left = '0px';
    whiteBar.classList.add('pinned');
    blackLine.classList.add('pinned');
  }

  // Overlay correct position onder white-bar + info-bar
  overlay.style.top = `${infoHeight + wbHeight}px`;
  overlay.style.height = `calc(100% - ${infoHeight + wbHeight}px)`;

  // Eerste section full viewport height
  if (firstSection) firstSection.style.height = '100vh';
}

// ===== Info-bar sluiten =====
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
    }, 550);
  });
}

// ===== Hamburger / menu logic =====
if (ham && overlay && whiteBar && blackLine) {
  ensureWhiteBarInner();
  updateBarPosition();

  function openMenu() {
    overlay.classList.add('menu-open');
    ham.classList.add('is-active', 'menu-active');
    whiteBar.classList.add('visible');
    blackLine.classList.add('visible');
    document.body.style.overflow = 'hidden';

    // Update overlay position dynamisch
    updateBarPosition();
  }

  function closeMenu() {
    overlay.classList.remove('menu-open');
    ham.classList.remove('is-active', 'menu-active');
    whiteBar.classList.remove('visible');
    blackLine.classList.remove('visible');
    document.body.style.overflow = '';

    updateBarPosition();
  }

  ham.addEventListener('click', () => {
    overlay.classList.contains('menu-open') ? closeMenu() : openMenu();
  });

  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// ===== Event hooks =====
window.addEventListener('load', () => { ensureWhiteBarInner(); updateBarPosition(); });
window.addEventListener('resize', updateBarPosition);