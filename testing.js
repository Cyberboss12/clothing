document.addEventListener("DOMContentLoaded", () => {

  const wrapper = document.querySelector('.horizontal-wrapper');
  const sections = document.querySelectorAll('.horizontal-section');
  const rightBar = document.getElementById('rightBar');

  let currentIndex = 0;

  // Klik op rechter balk = naar volgende horizontale view
  rightBar.addEventListener('click', () => {

    if (currentIndex < sections.length - 1) {
      currentIndex++;
    } else {
      // optioneel: terug naar begin (carousel loop)
      // currentIndex = 0; 
      return;
    }

    wrapper.scrollTo({
      left: sections[currentIndex].offsetLeft,
      behavior: 'smooth'
    });
  });

  // Update currentIndex bij handmatig scrollen
  wrapper.addEventListener('scroll', () => {
    const scrollLeft = wrapper.scrollLeft;

    sections.forEach((section, i) => {
      if (scrollLeft >= section.offsetLeft - window.innerWidth / 2) {
        currentIndex = i;
      }
    });
  }, { passive: true });

});