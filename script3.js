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

  if (infoBar && !infoBar.classList.contains('hidden')) {
    const rect = infoBar.getBoundingClientRect();
    const infoHeight = Math.round(rect.height);
    firstSection.style.height = `calc(100vh - ${infoHeight}px)`;
  } else {
    firstSection.style.height = '100vh';
  }
}

window.addEventListener('DOMContentLoaded', adjustFirstSection);
window.addEventListener('load', adjustFirstSection);
window.addEventListener('resize', adjustFirstSection);

// ===== Logo, menu en balken =====
const ham = document.getElementById('hamburgerMenu');
const overlay = document.getElementById('menuOverlay');
const whiteBar = document.querySelector('.white-bar');
const blackLine = document.querySelector('.black-line');
const whiteBarInner = whiteBar.querySelector('.white-bar-inner') || whiteBar;

// ===== Helpers =====
function updateBarPosition() {
  const scrollTop = window.scrollY || window.pageYOffset;

  if (infoBar && !infoBar.classList.contains('hidden')) {
    // Info-bar zichtbaar → alles scrollt mee
    const infoHeight = infoBar.getBoundingClientRect().height;
    
    infoBar.style.position = 'absolute';
    infoBar.style.top = `${scrollTop}px`;

    whiteBar.style.position = 'absolute';
    whiteBar.style.top = `${scrollTop + infoHeight}px`;

    if (whiteBarInner) {
      whiteBarInner.style.position = 'absolute';
      whiteBarInner.style.top = `${scrollTop + infoHeight}px`;
    }

    blackLine.style.position = 'absolute';
    blackLine.style.top = `${scrollTop + infoHeight + whiteBar.getBoundingClientRect().height}px`;
  } else {
    // Info-bar verborgen → pinned top
    infoBar.style.position = 'static';

    whiteBar.style.position = 'fixed';
    whiteBar.style.top = '0px';

    if (whiteBarInner) {
      whiteBarInner.style.position = 'relative';
      whiteBarInner.style.top = '0px';
    }

    blackLine.style.position = 'fixed';
    blackLine.style.top = `${whiteBar.getBoundingClientRect().height}px`;
  }
}

// ===== Info-bar sluiten =====
if (closeBtn && infoBar) {
  closeBtn.addEventListener('click', () => {
    infoBar.classList.add('closing');

    const onTransitionEnd = (ev) => {
      if (ev.target !== infoBar) return;
      infoBar.classList.add('hidden');
      infoBar.classList.remove('closing');
      adjustFirstSection();
      updateBarPosition();
      infoBar.removeEventListener('transitionend', onTransitionEnd);
    };

    infoBar.addEventListener('transitionend', onTransitionEnd);

    setTimeout(() => {
      if (!infoBar.classList.contains('hidden')) {
        infoBar.classList.add('hidden');
        infoBar.classList.remove('closing');
        adjustFirstSection();
        updateBarPosition();
      }
    }, 500);
  });
}

// ===== Menu functionaliteit =====
if (ham && overlay && whiteBar && blackLine) {
  function showBars() {
    updateBarPosition();
    whiteBar.classList.add('visible');
    blackLine.classList.add('visible');
  }
  function hideBars() {
    whiteBar.classList.remove('visible');
    blackLine.classList.remove('visible');
  }
  function openMenu() {
    overlay.classList.add('menu-open');
    ham.classList.add('is-active', 'menu-active');
    showBars();
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    overlay.classList.remove('menu-open');
    ham.classList.remove('is-active', 'menu-active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    hideBars();
  }

  ham.addEventListener('mouseenter', showBars);
  ham.addEventListener('mouseleave', () => { if (!overlay.classList.contains('menu-open')) hideBars(); });
  ham.addEventListener('click', () => { overlay.classList.contains('menu-open') ? closeMenu() : openMenu(); });
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));

  window.addEventListener('scroll', updateBarPosition);
  window.addEventListener('resize', updateBarPosition);
  window.addEventListener('load', updateBarPosition);

  updateBarPosition();
}