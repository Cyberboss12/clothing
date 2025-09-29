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

if (!firstSection) console.warn('script3.js: geen .fullscreen-section:first-of-type gevonden.');
if (!infoBar) console.warn('script3.js: geen #infoBar gevonden.');
if (!closeBtn) console.warn('script3.js: geen #closeInfoBar gevonden.');

function adjustFirstSection() {
  window.dispatchEvent(new Event('resize'));
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
const topOverlay = document.querySelector('.top-overlay'); 

let nudge = -32.6;

// ===== Info-bar sluiten =====
if (closeBtn && infoBar && whiteBar && blackLine) {

  // bewaar originele parent/positie/styles zodat we later kunnen terugplaatsen
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

  function pinBars() {
    if (ham) moveIntoWhiteBar(ham);
    if (topOverlay) moveIntoWhiteBar(topOverlay);

    whiteBar.classList.add('pinned');
    blackLine.classList.add('pinned', 'visible');

    const wbHeight = Math.round(whiteBar.getBoundingClientRect().height) || 50;
    const blHeight = parseInt(getComputedStyle(blackLine).height, 10) || 3;
    const total = wbHeight + blHeight;
    document.documentElement.style.setProperty('--whitebar-height', `${wbHeight}px`);
    document.documentElement.style.setProperty('--whitebar-total-height', `${total}px`);

    document.body.classList.add('has-pinned-bar');

    if (firstSection) firstSection.style.height = `calc(100vh - ${total}px)`;
  }

  function unpinBars() {
    whiteBar.classList.remove('pinned');
    blackLine.classList.remove('pinned', 'visible');
    document.documentElement.style.removeProperty('--whitebar-height');
    document.documentElement.style.removeProperty('--whitebar-total-height');
    document.body.classList.remove('has-pinned-bar');

    if (ham && _origPos.ham) moveBack(ham, _origPos.ham);
    if (topOverlay && _origPos.topOverlay) moveBack(topOverlay, _origPos.topOverlay);

    if (firstSection) firstSection.style.height = '';
    const inner = whiteBar.querySelector('.white-bar-inner');
    if (inner && inner.children.length === 0) inner.remove();
  }

  closeBtn.addEventListener('click', () => {
    infoBar.classList.add('closing');

    const onTransitionEnd = (ev) => {
      if (ev.target !== infoBar) return;
      infoBar.classList.add('hidden');
      infoBar.classList.remove('closing');
      pinBars();
      infoBar.removeEventListener('transitionend', onTransitionEnd);
    };
    infoBar.addEventListener('transitionend', onTransitionEnd);

    setTimeout(() => {
      if (!infoBar.classList.contains('hidden')) {
        infoBar.classList.add('hidden');
        infoBar.classList.remove('closing');
        pinBars();
      }
    }, 500);
  });

  if (infoBar.classList.contains('hidden')) {
    pinBars();
  } else {
    unpinBars();
  }
}

// ===== Menu functionaliteit =====
if (ham && overlay && whiteBar && blackLine) {
  function showBars() {
    whiteBar.classList.add('visible');
  }
  function hideBars() {
    whiteBar.classList.remove('visible');
  }

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
  ham.addEventListener('mouseleave', () => {
    if (!overlay.classList.contains('menu-open')) hideBars();
  });

  ham.addEventListener('click', () => {
    if (overlay.classList.contains('menu-open')) closeMenu();
    else openMenu();
  });

  overlay.addEventListener('click', (ev) => {
    if (ev.target === overlay) closeMenu();
  });

  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
}