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
  // move items if they're not already inside
  if (ham && inner !== ham.parentElement) {
    cleanseInlinePosition(ham);
    inner.appendChild(ham);
  }
  if (topOverlay && inner !== topOverlay.parentElement) {
    cleanseInlinePosition(topOverlay);
    inner.appendChild(topOverlay);
  }
}

// Update white-bar & black-line positions (only on load/resize/after close)
function updateBarPosition() {
  if (!whiteBar || !blackLine) return;

  const infoHeight = getInfoBarHeight();

  if (infoBar && !infoBar.classList.contains('hidden')) {
    // info-bar zichtbaar: beide absolute in document flow (so they move with page)
    // place infoBar at document-top (0) and whiteBar under it
    infoBar.style.position = 'absolute';
    infoBar.style.top = '0px';
    infoBar.style.left = '0px';
    // white-bar directly under infoBar (absolute -> will move with scroll because it's positioned in the document)
    whiteBar.style.position = 'absolute';
    whiteBar.style.top = `${infoHeight}px`;
    whiteBar.style.left = '0px';
    // black-line under white-bar
    const wbHeight = Math.round(whiteBar.getBoundingClientRect().height) || 0;
    blackLine.style.position = 'absolute';
    blackLine.style.top = `${infoHeight + wbHeight}px`;
    blackLine.style.left = '0px';

    // ensure inner content has no absolute positioning so it scrolls with whiteBar
    const inner = whiteBar.querySelector('.white-bar-inner');
    if (inner) {
      inner.style.position = '';
      inner.style.top = '';
      inner.style.left = '';
    }

    // remove pinned class if present
    whiteBar.classList.remove('pinned');
    blackLine.classList.remove('pinned');

  } else {
    // info-bar hidden -> pin white-bar to top (fixed) and black-line under it
    // reset infoBar positioning (it's hidden anyway)
    if (infoBar) {
      infoBar.style.position = '';
      infoBar.style.top = '';
      infoBar.style.left = '';
    }

    // pin white-bar
    whiteBar.style.position = 'fixed';
    whiteBar.style.top = '0px';
    whiteBar.style.left = '0px';
    whiteBar.classList.add('pinned');

    // black-line fixed under white-bar
    const wbHeight = Math.round(whiteBar.getBoundingClientRect().height) || 0;
    blackLine.style.position = 'fixed';
    blackLine.style.top = `${wbHeight}px`;
    blackLine.style.left = '0px';
    blackLine.classList.add('pinned');
  }

  // ensure first section isn't overlapped if needed (optional)
  if (firstSection) {
    if (infoBar && !infoBar.classList.contains('hidden')) {
      // keep first section full viewport height; whiteBar and infoBar are absolute above content
      firstSection.style.height = '100vh';
    } else {
      // when pinned, add top padding so content doesn't hide under fixed whitebar (if desired)
      // if you already use body.has-pinned-bar + padding-top in CSS, you can skip this:
      // firstSection.style.paddingTop = `${wbHeight}px`;
      firstSection.style.height = '100vh';
    }
  }
}

// ===== Info-bar sluiten (plaats -- wijzig pas NA transitionend) =====
if (closeBtn && infoBar) {
  closeBtn.addEventListener('click', () => {
    // start close animation
    infoBar.classList.add('closing');

    const onTransitionEnd = (ev) => {
      if (ev.target !== infoBar) return;
      // actually hide
      infoBar.classList.add('hidden');
      infoBar.classList.remove('closing');

      // update positions now that infoBar is gone
      updateBarPosition();

      infoBar.removeEventListener('transitionend', onTransitionEnd);
    };

    infoBar.addEventListener('transitionend', onTransitionEnd);

    // fallback in case transitionend doesn't fire
    setTimeout(() => {
      if (!infoBar.classList.contains('hidden')) {
        infoBar.classList.add('hidden');
        infoBar.classList.remove('closing');
        updateBarPosition();
      }
    }, 550);
  });
}

// ===== Menu logic (keep as-is but ensure no hover moves top) =====
if (ham && overlay && whiteBar && blackLine) {
  // Make sure hamburger is inside whitebar inner and cleansed
  ensureWhiteBarInner();
  updateBarPosition();

  function openMenu() {
    overlay.classList.add('menu-open');
    ham.classList.add('is-active', 'menu-active');
    whiteBar.classList.add('visible');
    blackLine.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    overlay.classList.remove('menu-open');
    ham.classList.remove('is-active', 'menu-active');
    whiteBar.classList.remove('visible');
    blackLine.classList.remove('visible');
    document.body.style.overflow = '';
  }

  ham.addEventListener('click', () => {
    overlay.classList.contains('menu-open') ? closeMenu() : openMenu();
  });
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// ===== Event hooks =====
window.addEventListener('load', () => { ensureWhiteBarInner(); updateBarPosition(); });
window.addEventListener('resize', updateBarPosition);