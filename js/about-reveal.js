// Entrada da arte da seção "Cuidar vai além de alimentar".
//
// Timeline em dois atos (tempos e curvas do
// docs/elementor-1678-2026-09-16.json / Figma Motion, node 197:269 / 206:456),
// disparada quando a seção entra na viewport. O ATO 1 repete a cada volta
// pela rolagem; o ATO 2 toca uma vez só:
//
//   ATO 1 — o card                          0s   → 0.8216s
//     fundo laranja  scale 0.8 → 1          0s   → 0.4641s
//     foto do cão    scale 0.6 → 1.03        0s   → 0.561s
//                    translateY 44.9% → 2%   0s   → 0.8216s
//
//   ATO 2 — só depois que o card assenta    0.8216s → 4.2265s
//     laço           desenha o traço        0.8216s → 2.6693s
//     ANIMAL         keyframes CSS          0.8216s → 4.2265s
//
// O laço é desenhado percorrendo o path, como a fita do hero: o comprimento
// real é medido com getTotalLength() e vira stroke-dasharray/-dashoffset em px,
// com o offset indo do comprimento total a 0 — revela da ponta inicial à final,
// em ordem. Medir é o que garante o desenho: com pathLength="1" o dash depende
// do navegador escalar valores de CSS/inline, e quando isso não acontece "1 1"
// vira um pontilhado de 1px e o traço inteiro brota de uma vez.
//
// A palavra NÃO é animada por tween: reproduzir a cascata das 5 cordas em
// stroke-dashoffset não bate com o que o Figma exportou (as keyframes
// mexem em stroke-dasharray, dashoffset e visibility ao mesmo tempo, e
// cada corda tem seu próprio ease interno). Então ela continua sendo as
// keyframes originais do docs/example.html (kf_197_276..280, em css/styles.css);
// a timeline só acende a classe .is-drawing no fim do ATO 1, o que as faz
// rodar UMA vez (`1 forwards`) em sincronia com o laço.

// Fim do ATO 1: a tween mais longa do card (o translate da foto).
const ABOUT_CARD_END = 0.8216;
// Ciclo completo das keyframes da palavra.
const ABOUT_WORD_CYCLE = 3.404891;
// Destino da foto: 2% da altura dela abaixo do pé do card (o ease passa do
// destino em ~1,8%, então esses 2% evitam o vão), com escala compensando.
const ABOUT_PHOTO_END_Y = 2;
const ABOUT_PHOTO_END_SCALE = 1.03;

function initAboutReveal() {
  const art = document.querySelector(".about__art");
  if (!art) return;

  const dog = art.querySelector(".about__dog");
  // Fundo laranja e recorte da foto são irmãos (o laço passa entre eles, pelo
  // z-index, sem herdar o scale) e escalam juntos, na mesma tween.
  const card = [dog, art.querySelector(".about__dog-clip")].filter(Boolean);
  const photo = art.querySelector(".about__dog-photo");
  const squiggle = art.querySelector(".about__squiggle-path");

  // Sem GSAP (CDN fora do ar) ou com movimento reduzido, a arte aparece
  // direto no estado final — .is-revealed zera transforms e dashoffsets.
  if (
    !window.gsap ||
    !window.ScrollTrigger ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    art.classList.add("is-revealed");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Curvas exatas do JSON; sem o CustomEase (plugin opcional), caem nas
  // aproximações nomeadas do GSAP.
  let easeBg = "power2.inOut";
  let easeOvershoot = "back.out(1.2)";
  if (window.CustomEase) {
    gsap.registerPlugin(CustomEase);
    easeBg = CustomEase.create("vorusSmooth", "M0,0 C0.5,0 0.5,1 1,1");
    easeOvershoot = CustomEase.create(
      "vorusOvershoot",
      "M0,0 C0.453,0.667 0.628,1.194 1,1"
    );
  }

  // Estado inicial. O do card também está no CSS (em transform, não nas
  // props scale/translate, pra não somar com o transform do GSAP); o do
  // laço é repetido aqui porque é ele que garante o traço escondido caso
  // a folha de estilo carregue depois.
  if (card.length) gsap.set(card, { scale: 0.8 });
  // yPercent (% da altura da própria imagem), não px: 275.244 no canvas do
  // Figma equivale a 44.9% da altura renderizada da foto, e assim o salto
  // de entrada acompanha o tamanho do card em qualquer tela.
  // O `y: 0` junto do yPercent NÃO é redundante: o GSAP lê a matriz de
  // transform que já está aplicada pelo CSS (translateY(44.9%)) como um
  // deslocamento em px na prop `y`, e depois SOMA o yPercent por cima. Sem
  // zerar o `y`, a foto entra deslocada o dobro e, no fim da tween (que só
  // leva o yPercent a 0), sobra o resíduo em px — era isso que estava
  // deixando o cachorro caído pra baixo no fim da animação.
  if (photo) gsap.set(photo, { scale: 0.6, y: 0, yPercent: 44.9 });
  // O laço: mede o comprimento e esconde o traço deslocando o dash inteiro.
  const squiggleLength =
    squiggle && squiggle.getTotalLength ? squiggle.getTotalLength() : 0;
  if (squiggleLength) {
    gsap.set(squiggle, {
      strokeDasharray: squiggleLength,
      strokeDashoffset: squiggleLength,
      visibility: "visible",
    });
  } else if (squiggle) {
    // Navegador sem getTotalLength: melhor mostrar o traço do que sumir com ele.
    gsap.set(squiggle, { visibility: "visible" });
  }

  // ---- ATO 1: o card (fundo + cachorro) ----
  // Timeline própria, que repete: toca ao entrar descendo, toca de novo
  // quando o usuário sobe e a arte volta pela parte de cima da tela
  // (onEnterBack), e volta ao estado inicial ao subir acima do start
  // (onLeaveBack), pra tocar de novo na próxima descida.
  const cardTl = gsap.timeline({
    scrollTrigger: {
      trigger: art,
      start: "30% 75%",
      markers: window.VORUS_MARKERS, // debug: liga em js/main.js
      toggleActions: "restart none restart reset",
    },
  });

  if (card.length) {
    cardTl.fromTo(card, { scale: 0.8 }, { scale: 1, duration: 0.4641, ease: easeBg }, 0);
  }

  if (photo) {
    // O ease de entrada passa do destino (overshoot de ~4% do trajeto de
    // 44.9%, ou seja ~1,8% da altura da foto): no pico a foto subia mais
    // que o card e abria um vão no pé do laranja. Daí o destino ser 2%
    // ABAIXO do pé (ABOUT_PHOTO_END_Y) — no pico ela ainda não descola —
    // com a escala final um pouco maior pra compensar o que desce e sai
    // pelo corte de baixo.
    cardTl.fromTo(
      photo,
      { scale: 0.6 },
      { scale: ABOUT_PHOTO_END_SCALE, duration: 0.561, ease: easeBg },
      0
    );
    cardTl.fromTo(
      photo,
      { yPercent: 44.9, y: 0 },
      {
        yPercent: ABOUT_PHOTO_END_Y,
        y: 0,
        duration: 0.8216,
        ease: easeOvershoot,
      },
      0
    );
  }

  // ---- ATO 2: laço e palavra, uma vez só, depois do card ----
  const tl = gsap.timeline({
    delay: ABOUT_CARD_END,
    scrollTrigger: {
      trigger: art,
      start: "30% 75%",
      once: true, // reprodução única, sem loop
    },
  });

  if (squiggleLength) {
    tl.fromTo(
      squiggle,
      { strokeDashoffset: squiggleLength },
      { strokeDashoffset: 0, duration: 1.8477, ease: "power2.out" },
      0
    );
  }

  tl.call(() => art.classList.add("is-drawing"), null, 0);

  // Segura a timeline pelo ciclo inteiro da palavra, que roda no CSS.
  tl.to({}, { duration: ABOUT_WORD_CYCLE }, 0);
}

window.VorusAboutReveal = { init: initAboutReveal };
