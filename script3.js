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
    // Flex layout: hamburger links, merknaam gecentreerd
    inner.style.display = 'flex';
    inner.style.alignItems = 'center';
    inner.style.justifyContent = 'center';
    inner.style.position = 'relative';
    whiteBar.appendChild(inner);
  }

  // Hamburger links
  if (ham && inner !== ham.parentElement) {
    cleanseInlinePosition(ham);
    ham.style.position = 'absolute';
    ham.style.left = '20px';
    inner.appendChild(ham);
  }

  // Merknaam gecentreerd
  if (topOverlay && inner !== topOverlay.parentElement) {
    cleanseInlinePosition(topOverlay);
    topOverlay.style.position = 'absolute';
    topOverlay.style.left = '50%';
    topOverlay.style.transform = 'translateX(-50%)';
    topOverlay.style.top = '50%';
    topOverlay.style.transform += ' translateY(-50%)';
    inner.appendChild(topOverlay);
  }
}

// Update white-bar & black-line positions + overlay
function updateBarPosition() {
  if (!whiteBar || !blackLine || !overlay) return;

  const infoHeight = getInfoBarHeight();
  const wbHeight = Math.round(whiteBar.getBoundingClientRect().height) || 50;

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

  // Overlay hoogte aanpassen naar bv. 50vh
  overlay.style.top = `${infoHeight + wbHeight}px`;
  overlay.style.height = '50vh'; // <--- kleiner menu

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