// ANIMAAAAALLL do footer.
//
// Mesmo esquema da palavra do "sobre" (js/about-reveal.js): a animação em
// si é CSS (keyframes kf_197_276..280 nos traços + transição de largura do
// container); aqui acende .is-drawing quando o footer aparece e apaga ao
// sair da tela, pra desenhar de novo na próxima vez.
function initFooterWord() {
  const word = document.querySelector(".footer__word");
  if (!word) return;

  // Sem GSAP ou com movimento reduzido, a palavra aparece pronta.
  if (
    !window.gsap ||
    !window.ScrollTrigger ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    word.classList.add("is-revealed");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.create({
    trigger: word,
    start: "top 95%",
    markers: window.VORUS_MARKERS, // debug: liga em js/main.js
    onEnter: () => {
      word.classList.remove("is-resetting");
      // Força o reflow pra largura sair dos 55% já sem o "transition: none".
      void word.offsetWidth;
      word.classList.add("is-drawing");
    },
  });

  // Reset quando a palavra sai inteira da tela por baixo (usuário subiu):
  // volta ao estado inicial sem transição, pronta pra desenhar de novo.
  ScrollTrigger.create({
    trigger: word,
    start: "top bottom",
    onLeaveBack: () => {
      word.classList.add("is-resetting");
      word.classList.remove("is-drawing");
    },
  });
}

window.VorusFooterWord = { init: initFooterWord };
