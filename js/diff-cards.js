// Inclinação sorteada dos cards de diferenciais e dos pacotes de produto.
//
// CSS não sorteia número, então o valor vem daqui: a cada entrada do
// ponteiro (ou do foco, via teclado) o card recebe um --diff-tilt novo
// entre -2deg e 3deg, e o :hover no CSS só consome essa variável. Sem JS,
// a variável não existe e o fallback 0deg mantém o hover de sempre.
const DIFF_TILT_MIN = -2;
const DIFF_TILT_MAX = 3;

function initDiffCards() {
  const cards = document.querySelectorAll(".diff-card, .product-card");
  if (!cards.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const drawTilt = () =>
    (DIFF_TILT_MIN + Math.random() * (DIFF_TILT_MAX - DIFF_TILT_MIN)).toFixed(2) +
    "deg";

  cards.forEach((card) => {
    const shuffle = () => card.style.setProperty("--diff-tilt", drawTilt());
    // pointerenter em vez de mouseenter: cobre mouse, caneta e o toque
    // que vira hover; e não dispara de novo ao passear entre os filhos.
    card.addEventListener("pointerenter", shuffle);
    card.addEventListener("focusin", shuffle);
  });
}

window.VorusDiffCards = { init: initDiffCards };
