// Alle boodschappen die je wilt tonen
const messages = [
  "Welkom bij onze webshop!",
  "Gratis verzending vanaf €50",
  "Vandaag: 10% korting op alle tassen",
  "Nieuw binnen: lente collectie 🌸",
  "Sign up to recieve 15% off on your next order!",
  "Free shipping on orders above €150",
  "Sign up to our community newsletter!"
];

const infoMessage = document.getElementById('infoMessage');
let msgIndex = 0;

function showNextMessage() {
  // Verberg huidige tekst
  infoMessage.classList.add('hidden');

  // Wacht tot fade-out klaar is (500ms uit CSS)
  setTimeout(() => {
    // Nieuwe boodschap instellen
    msgIndex = (msgIndex + 1) % messages.length;
    infoMessage.textContent = messages[msgIndex];

    // Fade-in
    infoMessage.classList.remove('hidden');
  }, 500);
}

// Elke 4 seconden wisselen van boodschap
setInterval(showNextMessage, 4000);

// -----------------------------
// Extra logica voor wegklikbare info-bar
// -----------------------------
const infoBar = document.getElementById('infoBar');
const firstImg = document.querySelector('.fullscreen-section:first-of-type img');
const closeBtn = document.getElementById('closeInfoBar');

// Zorg dat eerste afbeelding rekening houdt met info-bar
function adjustFirstImage() {
  if (!infoBar.classList.contains('hidden')) {
    const infoHeight = infoBar.offsetHeight;
    firstImg.style.height = `calc(100vh - ${infoHeight}px)`;
  } else {
    firstImg.style.height = "100vh"; // info-bar weg → volle hoogte
  }
}

// Bij laden meteen goed zetten
window.addEventListener('DOMContentLoaded', adjustFirstImage);
window.addEventListener('resize', adjustFirstImage);

// Klik op kruisje → verberg info-bar en update eerste afbeelding
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    infoBar.classList.add('hidden');
    adjustFirstImage();
  });
}
