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
const closeBtn = document.getElementById('closeInfoBar');
const whiteBar = document.querySelector('.white-bar');
const blackLine = document.querySelector('.black-line');
const topOverlay = document.querySelector('.top-overlay');
const ham = document.getElementById('hamburgerMenu');
const overlay = document.getElementById('menuOverlay');
const firstSection = document.querySelector('.fullscreen-section:first-of-type');

// ===== Helpers =====
function getInfoBarHeight() {
  return infoBar && !infoBar.classList.contains('hidden')
    ? infoBar.offsetHeight
    : 0;
}

// Zorg dat items in white-bar correct geplaatst zijn
function ensureWhiteBarInner() {
  if (!whiteBar) return;
  let inner = whiteBar.querySelector('.white-bar-inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'white-bar-inner';
    whiteBar.appendChild(inner);
  }

  if (ham && inner !== ham.parentElement) inner.appendChild(ham);
  if (topOverlay && inner !== topOverlay.parentElement) inner.appendChild(topOverlay);
}

// Update white-bar, black-line en overlay positie
function updateBarPosition() {
  if (!whiteBar || !blackLine || !overlay) return;

  const infoHeight = getInfoBarHeight();
  const wbHeight = whiteBar.offsetHeight || 50;

  // White-bar en black-line pinnen of absolute positioneren
  if (infoBar && !infoBar.classList.contains('hidden')) {
    whiteBar.style.position = 'absolute';
    whiteBar.style.top = `${infoHeight}px`;
    blackLine.style.position = 'absolute';
    blackLine.style.top = `${infoHeight + wbHeight}px`;
  } else {
    whiteBar.style.position = 'fixed';
    whiteBar.style.top = '0px';
    blackLine.style.position = 'fixed';
    blackLine.style.top = `${wbHeight}px`;
  }

  // Overlay correct positioneren onder white-bar + info-bar
  overlay.style.top = `${infoHeight + wbHeight}px`;
  overlay.style.height = `calc(100% - ${infoHeight + wbHeight}px)`;

  // Eerste section full viewport height behouden
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

    // Fallback
    setTimeout(() => {
      if (!infoBar.classList.contains('hidden')) {
        infoBar.classList.add('hidden');
        infoBar.classList.remove('closing');
        updateBarPosition();
      }
    }, 550);
  });
}

// ===== Hamburger / menu logica =====
if (ham && overlay && whiteBar && blackLine) {
  ensureWhiteBarInner();
  updateBarPosition();

  ham.addEventListener('click', () => {
    const isOpen = overlay.classList.toggle('menu-open');
    ham.classList.toggle('is-active', isOpen);

    // Update overlay positie zodat items altijd zichtbaar zijn
    updateBarPosition();

    // Body scroll blokkeren als menu open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      overlay.classList.remove('menu-open');
      ham.classList.remove('is-active');
      document.body.style.overflow = '';
    });
  });
}

// ===== Event hooks =====
window.addEventListener('load', () => {
  ensureWhiteBarInner();
  updateBarPosition();
});
window.addEventListener('resize', updateBarPosition);