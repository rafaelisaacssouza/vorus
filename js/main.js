// Debug: mostra os markers do ScrollTrigger (start/end) em todas as animações.
// Troque para false antes de publicar.
window.VORUS_MARKERS = false;

document.addEventListener("DOMContentLoaded", () => {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  window.VorusHeroBurst && window.VorusHeroBurst.init();
  window.VorusAboutReveal && window.VorusAboutReveal.init();
  window.VorusDiffCards && window.VorusDiffCards.init();
  window.VorusProductCards && window.VorusProductCards.init();
  window.VorusFooterWord && window.VorusFooterWord.init();
  window.VorusTextReveal && window.VorusTextReveal.init();
  window.VorusFilm && window.VorusFilm.init();

  window.ScrollTrigger && ScrollTrigger.refresh();
});
