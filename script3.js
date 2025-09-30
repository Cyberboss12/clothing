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
    const infoHeight = infoBar.getBoundingClientRect().height;
    firstSection.style.height = `calc(100vh - ${infoHeight}px)`;
  } else {
    const wbHeight = whiteBar.getBoundingClientRect().height || 50;
    const blHeight = blackLine.getBoundingClientRect().height || 3;
    firstSection.style.height = `calc(100vh - ${wbHeight + blHeight}px)`;
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
const topOverlay = document.querySelector('.top-overlay');
let nudge = -32.6;

// ===== Helpers voor elementen verplaatsen =====
const _origPos = {
  ham: ham ? { parent: ham.parentNode, nextSibling: ham.nextSibling, style: ham.getAttribute('style') || '' } : null,
  topOverlay: topOverlay ? { parent: topOverlay.parentNode, nextSibling: topOverlay.nextSibling, style: topOverlay.getAttribute('style') || '' } : null
};

function moveIntoWhiteBar(el) {
  if (!el || !whiteBar) return;
  let inner = whiteBar.querySelector('.white-bar-inner');
  if (!inner) {
    inner = document.createElement('div');
    inner.className = 'white-bar-inner';
    whiteBar.appendChild(inner);
  }
  inner.appendChild(el);
  el.style.position = 'static';
  el.style.top = '';
  el.style.left = '';
}

function moveBack(el, saved) {
  if (!el || !saved || !saved.parent) return;
  if (saved.nextSibling) saved.parent.insertBefore(el, saved.nextSibling);
  else saved.parent.appendChild(el);
  if (saved.style) el.setAttribute('style', saved.style);
  else el.removeAttribute('style');
}

// ===== White-bar & black-line update =====
function updateBarPosition() {
  const infoVisible = infoBar && !infoBar.classList.contains('hidden');

  // bereken basis-top voor white-bar
  let whiteTop = infoVisible ? infoBar.getBoundingClientRect().bottom + window.scrollY + nudge : 0;
  whiteBar.style.position = 'absolute';
  whiteBar.style.top = `${whiteTop}px`;

  // Black-line exact onder white-bar
  const wbHeight = whiteBar.getBoundingClientRect().height || 50;
  blackLine.style.position = 'absolute';
  blackLine.style.top = `${whiteTop + wbHeight}px`;

  adjustFirstSection();
}

// ===== Info-bar sluiten =====
if (closeBtn && infoBar) {
  closeBtn.addEventListener('click', () => {
    infoBar.classList.add('closing');
    const onTransitionEnd = (ev) => {
      if (ev.target !== infoBar) return;
      infoBar.classList.add('hidden');
      infoBar.classList.remove('closing');

      // white-bar en black-line bovenaan
      whiteBar.style.position = 'fixed';
      whiteBar.style.top = '0';
      blackLine.style.position = 'fixed';
      blackLine.style.top = `${whiteBar.getBoundingClientRect().height}px`;

      adjustFirstSection();
      infoBar.removeEventListener('transitionend', onTransitionEnd);
    };
    infoBar.addEventListener('transitionend', onTransitionEnd);

    setTimeout(() => {
      if (!infoBar.classList.contains('hidden')) {
        infoBar.classList.add('hidden');
        infoBar.classList.remove('closing');
        whiteBar.style.position = 'fixed';
        whiteBar.style.top = '0';
        blackLine.style.position = 'fixed';
        blackLine.style.top = `${whiteBar.getBoundingClientRect().height}px`;
        adjustFirstSection();
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

  window.addEventListener('scroll', updateBarPosition);
  window.addEventListener('resize', updateBarPosition);
  window.addEventListener('load', updateBarPosition);

  updateBarPosition();
}