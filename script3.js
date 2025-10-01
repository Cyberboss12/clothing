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
    ? infoBar.getBoundingClientRect().height 
    : 0;
}

// White-bar en zwarte lijn updaten
function updateBarPosition() {
  const scrollY = window.scrollY || window.pageYOffset;
  const infoHeight = getInfoBarHeight();

  // White-bar
  whiteBar.style.position = 'absolute';
  whiteBar.style.top = `${infoHeight}px`;

  // Black-line net onder white-bar
  const wbHeight = whiteBar.getBoundingClientRect().height;
  blackLine.style.position = 'absolute';
  blackLine.style.top = `${infoHeight + wbHeight}px`;

}

// Pas eerste section aan
function adjustFirstSection() {
  if (!firstSection) return;
  firstSection.style.height = '100vh';
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
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('menu-open');
    ham.classList.remove('is-active', 'menu-active');
    whiteBar.classList.remove('visible');
    blackLine.classList.remove('visible');
    document.body.style.overflow = '';
  }

  ham.addEventListener('mouseenter', showBars);
  ham.addEventListener('mouseleave', () => { if (!overlay.classList.contains('menu-open')) hideBars(); });
  ham.addEventListener('click', () => { overlay.classList.contains('menu-open') ? closeMenu() : openMenu(); });
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  window.addEventListener('scroll', updateBarPosition);
  window.addEventListener('resize', updateBarPosition);
  window.addEventListener('load', () => { adjustFirstSection(); updateBarPosition(); });

  updateBarPosition();
}