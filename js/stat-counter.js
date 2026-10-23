// Contador dos números da seção "Vórus é da Cacal": cada .stat-card__value
// conta de 0 até o data-count quando os cards entram na tela, em cascata.
// Sem JS (ou com reduced motion) o número final já está no HTML.
function initStatCounter() {
  const values = document.querySelectorAll(".stat-card__value[data-count]");
  if (
    !values.length ||
    !window.gsap ||
    !window.ScrollTrigger ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  values.forEach((el) => {
    const target = Number(el.dataset.count);
    // Reserva a largura do número final pra o card não "pular" enquanto conta
    el.style.minWidth = `${String(target).length}ch`;
    el.textContent = "0";
  });

  ScrollTrigger.create({
    trigger: ".stats__grid",
    start: "top 85%",
    once: true,
    markers: window.VORUS_MARKERS, // debug: liga em js/main.js
    onEnter: () => {
      values.forEach((el, i) => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: Number(el.dataset.count),
          duration: 1.8,
          delay: i * 0.15,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(counter.value);
          },
        });
      });
    },
  });
}

window.VorusStatCounter = { init: initStatCounter };
