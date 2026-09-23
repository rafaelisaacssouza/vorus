// Filme Vórus — as 3 propostas (A / B / C) da seção de vídeo.
//
// Comum às três: o vídeo de fundo roda mudo, em loop, SÓ enquanto está na
// tela (IntersectionObserver) — assim as três versões na mesma página não
// ficam decodificando ao mesmo tempo. O som fica no botão (A) ou no
// lightbox (B e C), que abre o filme do começo com controles.
//
// Ao escolher a versão final, apagar os blocos das outras duas aqui.

// Os primeiros ~4s do filme são só a cartela "Se eu pudesse escolher..." em
// fundo laranja — no loop mudo isso vira um bloco chapado, então o loop
// começa direto na primeira cena. Com som, o filme toca desde o 0.
const FILM_LOOP_START = 4;

function initFilmAutoplay() {
  const videos = document.querySelectorAll(".js-film-bg");
  if (!videos.length) return;

  videos.forEach((v) => {
    const skipIntro = () => {
      if (v.muted && v.currentTime < FILM_LOOP_START) {
        v.currentTime = FILM_LOOP_START;
      }
    };
    v.addEventListener("loadedmetadata", skipIntro);
    v.addEventListener("timeupdate", skipIntro);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          target.play().catch(() => {});
        } else {
          target.pause();
        }
      });
    },
    { threshold: 0.15 },
  );
  videos.forEach((v) => io.observe(v));
}

// ---------- A: botão de som no próprio vídeo ----------
function initFilmSound() {
  document.querySelectorAll(".js-film-sound").forEach((btn) => {
    const video = btn.parentElement.querySelector("video");
    const label = btn.querySelector(".film-sound__label");

    btn.addEventListener("click", () => {
      const turnOn = video.muted;
      // Ligar o som recomeça o filme, pra pessoa não pegar a narração no meio.
      if (turnOn) video.currentTime = 0;
      video.muted = !turnOn;
      video.loop = !turnOn;
      video.play().catch(() => {});
      btn.classList.toggle("is-on", turnOn);
      label.textContent = turnOn ? "Desativar som" : "Ativar som";
    });

    // Terminou com som: volta pro loop mudo.
    video.addEventListener("ended", () => {
      video.muted = true;
      video.loop = true;
      video.play().catch(() => {});
      btn.classList.remove("is-on");
      label.textContent = "Ativar som";
    });
  });
}

// ---------- B e C: lightbox ----------
function initFilmModal() {
  const modal = document.querySelector(".film-modal");
  if (!modal) return;
  const video = modal.querySelector("video");

  const close = () => {
    video.pause();
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".js-film-open").forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  });

  modal.querySelector(".film-modal__close").addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
}

// ---------- Animações de scroll ----------
function initFilmScroll() {
  if (
    !window.gsap ||
    !window.ScrollTrigger ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  // A: a janela abre até a tela cheia enquanto o palco está grudado.
  const a = document.querySelector(".film-a");
  if (a) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: a,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        markers: window.VORUS_MARKERS,
      },
    });
    // Início explícito com os 4 lados: o CSS computado normaliza o inset
    // pra 3 valores e o GSAP pareia os números errado (abre torto).
    const isNarrow = window.matchMedia("(max-width: 900px)").matches;
    tl.fromTo(
      a.querySelector(".film-a__frame"),
      {
        clipPath: isNarrow
          ? "inset(30% 6% 14% 6% round 24px)"
          : "inset(40% 24% 8% 24% round 32px)",
      },
      {
        clipPath: "inset(0% 0% 0% 0% round 0px)",
        ease: "power2.inOut",
        duration: 1,
      },
    )
      .to(
        a.querySelector(".film-a__video"),
        { scale: 1, ease: "power2.inOut", duration: 1 },
        0,
      )
      .to(
        a.querySelector(".film-a__head"),
        { y: -60, opacity: 0, ease: "power1.in", duration: 0.6 },
        0,
      )
      // Um respiro em tela cheia antes de soltar o sticky.
      .to({}, { duration: 0.35 });
  }

  // B: cortina abre da esquerda pra direita + vídeo desinfla por dentro.
  const b = document.querySelector(".film-b");
  if (b) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: b.querySelector(".film-b__media"),
        start: "top 80%",
        once: true,
        markers: window.VORUS_MARKERS,
      },
    });
    tl.fromTo(
      b.querySelector(".film-b__frame"),
      { clipPath: "inset(0% 100% 0% 0% round 32px)" },
      {
        clipPath: "inset(0% 0% 0% 0% round 32px)",
        duration: 1.2,
        ease: "power4.inOut",
      },
    )
      .to(
        b.querySelector(".film-b__video"),
        { scale: 1, duration: 1.6, ease: "power3.out" },
        0.2,
      )
      .from(
        b.querySelector(".film-play"),
        { scale: 0, rotate: -120, duration: 0.8, ease: "back.out(1.8)" },
        0.9,
      );

    gsap.from(b.querySelector(".film-b__text").children, {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "opacity,transform",
      scrollTrigger: { trigger: b, start: "top 80%", once: true },
    });
  }

  // C: letreiros correm em sentidos opostos e o card endireita.
  const c = document.querySelector(".film-c");
  if (c) {
    const scrub = {
      trigger: c,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.8,
      markers: window.VORUS_MARKERS,
    };
    gsap.fromTo(
      c.querySelector(".film-c__row--1"),
      { xPercent: 0 },
      { xPercent: -30, ease: "none", scrollTrigger: scrub },
    );
    gsap.fromTo(
      c.querySelector(".film-c__row--2"),
      { xPercent: -30 },
      { xPercent: 0, ease: "none", scrollTrigger: scrub },
    );
    gsap.to(c.querySelector(".film-c__card"), {
      rotate: 0,
      scale: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: c,
        start: "top 85%",
        end: "center 55%",
        scrub: 0.8,
      },
    });
  }
}

function initFilm() {
  initFilmAutoplay();
  initFilmSound();
  initFilmModal();
  initFilmScroll();
}

window.VorusFilm = { init: initFilm };
