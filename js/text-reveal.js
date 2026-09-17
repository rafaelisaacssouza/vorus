// Reveal sutil dos blocos de texto: fade in + sobe 24px, em cascata curta
// dentro de cada grupo, uma vez quando o grupo entra na tela.
//
// Só pega TEXTO (eyebrow, títulos, parágrafos, grupos de botões, colunas
// do footer). Nada das artes e cards que já têm animação feita à mão
// (hero-burst, about-reveal, product-cards, footer-word, diff-cards) —
// esses elementos não estão nos seletores abaixo.
const TEXT_REVEAL_GROUPS = [
  ".hero__content",
  ".about__text",
  ".products__head",
  ".differentials__head",
  ".stats__head",
  ".feed-well__text",
  ".tribe__head",
  ".distributors__head",
  ".final-cta .container",
  ".footer__grid",
];

function initTextReveal() {
  if (
    !window.gsap ||
    !window.ScrollTrigger ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(TEXT_REVEAL_GROUPS.join(",")).forEach((group) => {
    const items = group.children;
    if (!items.length) return;

    gsap.from(items, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      ease: "power2.out",
      stagger: 0.08,
      // Devolve o elemento ao CSS no fim (hovers e afins seguem intactos).
      clearProps: "opacity,transform",
      scrollTrigger: {
        trigger: group,
        start: "top 85%",
        markers: window.VORUS_MARKERS, // debug: liga em js/main.js
        once: true,
      },
    });
  });
}

window.VorusTextReveal = { init: initTextReveal };
