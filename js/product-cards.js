// Entrada dos cards de produto.
//
// Os cards já ficam visíveis, só deslocados pra baixo. Quando o grid chega
// no start do scroller, o deslocamento se desfaz em sequência, sem fade:
// 400ms cada, com 150ms entre um e outro, então sobem sobrepostos.
const PRODUCT_CARD_DURATION = 0.4;
const PRODUCT_CARD_OFFSET = 80; // px abaixo da posição final
const PRODUCT_CARD_STAGGER = 0.15; // o próximo começa antes do anterior pousar

function initProductCards() {
  const grid = document.querySelector(".products__grid");
  if (!grid) return;
  const cards = grid.querySelectorAll(".product-card");
  if (!cards.length) return;

  // Sem GSAP ou com movimento reduzido, os cards ficam como estão no CSS.
  if (
    !window.gsap ||
    !window.ScrollTrigger ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(cards, { y: PRODUCT_CARD_OFFSET });

  gsap.to(cards, {
    y: 0,
    duration: PRODUCT_CARD_DURATION,
    // Arranque suave (ease in) e pouso suave: o card "pega embalo" em vez
    // de já sair disparado no primeiro frame.
    ease: "power4.inOut",
    stagger: PRODUCT_CARD_STAGGER,
    // Limpa o transform no fim pra não brigar com o hover do CSS.
    clearProps: "transform",
    scrollTrigger: {
      trigger: grid,
      start: "-20% 75%",
      markers: window.VORUS_MARKERS, // debug: liga em js/main.js
      once: true,
    },
  });
}

window.VorusProductCards = { init: initProductCards };
