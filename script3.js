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
const whiteBar = document.querySelector('.white-bar');
const blackLine = document.querySelector('.black-line');
const firstSection = document.querySelector('.fullscreen-section:first-of-type');
const closeBtn = document.getElementById('closeInfoBar');
const ham = document.getElementById('hamburgerMenu');
const overlay = document.getElementById('menuOverlay');
const topOverlay = document.querySelector('.top-overlay');

// ===== Wrapper voor info + white bar =====
const wrapper = document.createElement('div');
if (whiteBar && infoBar) {
  infoBar.parentNode.insertBefore(wrapper, infoBar);
  wrapper.appendChild(infoBar);
  wrapper.appendChild(whiteBar);
  wrapper.style.position = 'absolute';
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  wrapper.style.width = '100%';
  wrapper.style.zIndex = '60';
}

// ===== Helper: Update wrapper & black-line =====
function updateWrapperPosition() {
  if (!wrapper) return;

  if (infoBar && !infoBar.classList.contains('hidden')) {
    // info-bar zichtbaar → scroll mee
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
  } else {
    // info-bar weg → white-bar fixed bovenaan
    wrapper.style.position = 'fixed';
    wrapper.style.top = '0';
    wrapper.style.left = '0';
    wrapper.style.width = '100%';
  }

  // Black-line position
  const whiteHeight = whiteBar.getBoundingClientRect().height || 50;
  blackLine.style.position = wrapper.style.position;
  blackLine.style.top = (wrapper.getBoundingClientRect().top + whiteHeight) + 'px';
}

// ===== Adjust first section =====
function adjustFirstSection() {
  if (!firstSection) return;
  let offset = 0;
  if (infoBar && !infoBar.classList.contains('hidden')) {
    offset = wrapper.getBoundingClientRect().height;
  } else {
    offset = whiteBar.getBoundingClientRect().height;
  }
  firstSection.style.height = `calc(100vh - ${offset}px)`;
}

// ===== Info-bar sluiten =====
if (closeBtn && infoBar) {
  closeBtn.addEventListener('click', () => {
    infoBar.classList.add('hidden');
    updateWrapperPosition();
    adjustFirstSection();
  });
}

// ===== Menu functionaliteit =====
function showBars() {
  whiteBar.classList.add('visible');
  blackLine.classList.add('visible');
  updateWrapperPosition();
}

function hideBars() {
  whiteBar.classList.remove('visible');
  blackLine.classList.remove('visible');
}

function openMenu() {
  overlay.classList.add('menu-open');
  ham.classList.add('is-active', 'menu-active');
  whiteBar.classList.add('visible');
  blackLine.classList.add('visible');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  updateWrapperPosition();
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

if (ham && overlay && whiteBar && blackLine) {
  ham.addEventListener('mouseenter', showBars);
  ham.addEventListener('mouseleave', () => { if (!overlay.classList.contains('menu-open')) hideBars(); });
  ham.addEventListener('click', () => { overlay.classList.contains('menu-open') ? closeMenu() : openMenu(); });
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// ===== Scroll & resize =====
function onScrollResize() {
  updateWrapperPosition();
  adjustFirstSection();
}

window.addEventListener('scroll', onScrollResize);
window.addEventListener('resize', onScrollResize);
window.addEventListener('load', onScrollResize);

// ===== Init =====
updateWrapperPosition();
adjustFirstSection();