// Burst do Hero — sequência extraída do motion do Figma (node 169:4568,
// get_motion_context): num ciclo de referência de 2s, a fita (Path) é
// "desenhada" via stroke-trim de 0% a 40% (0.8s), some fica em repouso
// até 54.8% (1.096s) e só então o splash aparece, terminando de
// assentar em 67.5% (1.35s). Aqui isso vira uma animação de ENTRADA
// (uma vez só, via ScrollTrigger) em vez do loop infinito do Figma.
//
// A fita é um caminho preenchido (fill), não um stroke fino — então em
// vez de stroke-dasharray/dashoffset (que exigiria stroke), o "desenho"
// é reproduzido com um clip-path animado de baixo pra cima, que é
// visualmente equivalente ao observado no Container.gif de referência.
function initHeroBurst() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const ribbon = document.querySelector(".hero__ribbon");
  const splash = document.querySelector(".hero__splash");
  const paws = document.querySelector(".hero__paws");
  if (!ribbon && !splash) return;

  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (ribbon) gsap.set(ribbon, { clipPath: "inset(0% 0 0 0)" });
    if (splash) gsap.set(splash, { opacity: 1, scale: 1 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero-art",
      start: "top 70%",
      markers: window.VORUS_MARKERS, // debug: liga em js/main.js
      once: true,
    },
  });

  if (ribbon) {
    // Começa clipada de baixo (inset(100% 0 0 0) = nada visível) e revela
    // pra cima até inset(0 0 0 0) = totalmente visível.
    tl.fromTo(
      ribbon,
      { clipPath: "inset(100% 0 0 0)" },
      { clipPath: "inset(0% 0 0 0)", duration: 0.8, ease: "power1.inOut" },
      0,
    );
  }

  if (paws) {
    // A mão entra vindo de cima e da direita (10% do próprio tamanho),
    // começando junto com o desenho da fita.
    tl.from(
      paws,
      { xPercent: 10, yPercent: -10, duration: 0.8, ease: "power2.out" },
      0,
    );
  }

  if (splash) {
    // Só entra depois que a fita termina de desenhar — no Figma, ~0.3s
    // de folga entre o fim do desenho (0.8s) e o início do splash (1.096s).
    tl.from(
      splash,
      { opacity: 0, scale: 0.85, transformOrigin: "50% 50%", duration: 0.25, ease: "power2.out" },
      1.1,
    );
  }
}

window.VorusHeroBurst = { init: initHeroBurst };
