// Registrar plugins do GSAP (protegido caso algum CDN falhe)
try {
  gsap.registerPlugin(
    ScrollTrigger,
    TextPlugin,
    MotionPathPlugin,
    ScrollToPlugin,
    Observer,
    Flip,
    Draggable,
    SplitText
  );
} catch (e) {
  console.warn("GSAP plugins não registrados:", e);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("GSAP Loaded:", typeof gsap !== "undefined");

  // ====================================
  // Hero Section Animations - NOVA ESTRUTURA
  // ====================================
  // Entrada minimalista: sutileza, sem rotações ou bounces
  const tlHeroIn = gsap.timeline({ defaults: { ease: "power2.out" } });
  tlHeroIn
    .from(".hero-main-content", { autoAlpha: 0, duration: 0.8 }, 0)
    .from(".hero-text-section", { y: 24, autoAlpha: 0, duration: 0.6 }, 0.1)
    .from(".hero-logo-small", { autoAlpha: 0, y: 14, duration: 0.5 }, 0.3)
    .from(
      ".hero-yellow-circle",
      { autoAlpha: 0, scale: 0.94, duration: 0.5 },
      0.35
    );

  // Animação suave para o título principal (SplitText)
  const heroTitle = document.querySelector(".hero-title");
  let heroTitleSplit = null;
  const initHeroTitleHover = (chars) => {
    if (!heroTitle || heroTitle.dataset.hoverInit === "true") return;
    const charsArray = Array.isArray(chars) ? chars : Array.from(chars || []);
    if (!charsArray.length) return;

    const hoverIn = () => {
      gsap.to(charsArray, {
        duration: 0.4,
        ease: "power2.out",
        stagger: { each: 0.006, from: "random" },
      });
    };
    const hoverOut = () => {
      gsap.to(charsArray, {
        duration: 0.5,
        ease: "power3.out",
        stagger: { each: 0.004 },
        x: 0,
        y: 0,
        rotation: 0,
      });
    };
    heroTitle.addEventListener("mouseenter", hoverIn);
    heroTitle.addEventListener("mouseleave", hoverOut);
    // acessibilidade: foco com teclado também ativa
    heroTitle.addEventListener("focusin", hoverIn);
    heroTitle.addEventListener("focusout", hoverOut);
    heroTitle.dataset.hoverInit = "true";
  };

  const createHeroTitleAnimation = () => {
    if (!heroTitle) return null;
    if (typeof SplitText === "undefined") {
      // fallback: mantém hover básico sem animação de entrada
      initHeroTitleHover(heroTitle.querySelectorAll("span"));
      return null;
    }
    heroTitleSplit = new SplitText(heroTitle, {
      type: "lines,words,chars",
      charsClass: "char",
      wordsClass: "hero-word",
      linesClass: "hero-line",
    });

    if (heroTitleSplit.lines && heroTitleSplit.lines.length) {
      gsap.set(heroTitleSplit.lines, {
        overflow: "hidden",
        paddingBottom: "0.05em",
      });
    }

    const chars = heroTitleSplit.chars;
    if (!chars || !chars.length) return null;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" },
      onComplete: () => initHeroTitleHover(chars),
    });

    tl.from(
      chars,
      {
        yPercent: 45,
        autoAlpha: 0,
        duration: 0.58,
        ease: "power3.out",
        transformOrigin: "50% 100%",
        stagger: {
          each: 0.024,
          from: "start",
        },
      },
      0
    );

    return tl;
  };

  const heroTitleIntroTl = createHeroTitleAnimation();
  if (heroTitleIntroTl) {
    tlHeroIn.add(() => heroTitleIntroTl.restart(true), 0.18);
  }

  // Lupa (ícone dentro da ampola) girando no centro
  gsap.to(".hero-yellow-circle img", {
    rotation: 360,
    transformOrigin: "50% 50%",
    ease: "linear",
    duration: 6,
    repeat: -1,
  });

  // Mulher VR - entrada dramática e flutuação cobrindo todo o elemento neon
  let vrFloatTween = null;
  let gridTween = null;
  const getAmp = () => {
    const root = document.querySelector(".hero-section");
    const cssVal = getComputedStyle(root).getPropertyValue("--hero-grid-h");
    const gridH = parseFloat(cssVal) || 60; // fallback
    return gridH / 2;
  };
  const startVrFloat = () => {
    const target = document.querySelector(".hero-vr-girl");
    if (!target) return;
    const amp = getAmp(); // metade p/ cima e metade p/ baixo
    const floatDuration = 4; // mantém sensação original
    if (vrFloatTween) vrFloatTween.kill();
    // Parte do topo (já inicia em -amp), vai até a borda inferior (+amp) e volta
    vrFloatTween = gsap.to(target, {
      y: amp,
      duration: floatDuration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Sincroniza o “neon” (grid) para também ir até o fim na mesma cadência
    const gridEl = document.querySelector(".hero-transition-grid");
    if (gridEl) {
      if (gridTween) gridTween.kill();
      gsap.set(gridEl, { backgroundPosition: "0px 0" });
      gridTween = gsap.to(gridEl, {
        backgroundPosition: "160px 0",
        duration: floatDuration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    }
  };

  // Define a posição inicial no topo da faixa ANTES da animação de entrada
  gsap.set(".hero-vr-girl", { y: -getAmp() });
  const vrEnter = gsap.from(".hero-vr-girl", {
    opacity: 0,
    x: 200,
    scale: 1.1,
    duration: 2,
    delay: 0.7,
    ease: "power3.out",
    onComplete: () => startVrFloat(),
  });
  // Recalcula amplitude em resize para cobrir todo o grid
  window.addEventListener("resize", () => {
    if (document.querySelector(".hero-vr-girl")) {
      startVrFloat();
    }
  });

  // Grid de transição: reveal + efeito de “reflexo” sutil em loop
  const grid = document.querySelector(".hero-transition-grid");
  if (grid) {
    gsap.from(grid, {
      autoAlpha: 0,
      y: 40,
      duration: 0.9,
      ease: "power2.out",
      delay: 0.6,
    });
    // o shimmer agora é sincronizado com a flutuação da VR (ver startVrFloat)
  }

  // Glow sobre o grid em perspectiva (fundo roxo): varre da esquerda para a direita
  const gridGlow = document.querySelector(".hero-grid-glow");
  if (gridGlow) {
    // começa fora da esquerda e atravessa
    gsap.set(gridGlow, { xPercent: -30 });
    gsap.to(gridGlow, {
      xPercent: 130,
      duration: 6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  // Animações no próprio SVG oficial (fundo-hero.svg) carregado no <object>
  const floorObj = document.querySelector(".hero-floor-svg");
  if (floorObj) {
    floorObj.addEventListener("load", () => {
      const svgDoc = floorObj.contentDocument;
      if (!svgDoc) return;
      const svgEl = svgDoc.querySelector("svg");
      if (!svgEl) return;

      // Se o SVG veio como imagem dentro de pattern, criamos um overlay de scan com <rect>
      // Adiciona defs + gradient e um rect que atravessa
      const defs =
        svgDoc.querySelector("defs") ||
        svgDoc.createElementNS("http://www.w3.org/2000/svg", "defs");
      if (!defs.parentNode) svgEl.appendChild(defs);

      const gradId = "scanGradient";
      let grad = svgDoc.getElementById(gradId);
      if (!grad) {
        grad = svgDoc.createElementNS(
          "http://www.w3.org/2000/svg",
          "linearGradient"
        );
        grad.setAttribute("id", gradId);
        grad.setAttribute("x1", "0");
        grad.setAttribute("y1", "0");
        grad.setAttribute("x2", "1");
        grad.setAttribute("y2", "0");
        const a = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
        a.setAttribute("offset", "0%");
        a.setAttribute("stop-color", "#FEE644");
        a.setAttribute("stop-opacity", "0");
        const b = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
        b.setAttribute("offset", "50%");
        b.setAttribute("stop-color", "#FEE644");
        b.setAttribute("stop-opacity", "0.35");
        const c = svgDoc.createElementNS("http://www.w3.org/2000/svg", "stop");
        c.setAttribute("offset", "100%");
        c.setAttribute("stop-color", "#FEE644");
        c.setAttribute("stop-opacity", "0");
        grad.appendChild(a);
        grad.appendChild(b);
        grad.appendChild(c);
        defs.appendChild(grad);
      }

      let scan = svgDoc.getElementById("gh-scan");
      if (!scan) {
        scan = svgDoc.createElementNS("http://www.w3.org/2000/svg", "rect");
        scan.setAttribute("id", "gh-scan");
        scan.setAttribute("x", "0");
        scan.setAttribute("y", "0");
        scan.setAttribute("width", svgEl.getAttribute("width") || "1440");
        scan.setAttribute("height", svgEl.getAttribute("height") || "101");
        scan.setAttribute("fill", `url(#${gradId})`);
        scan.setAttribute("opacity", "0.0");
        svgEl.appendChild(scan);
      }

      // Anima: varre da esquerda para a direita e volta
      gsap.set(scan, { x: -200, opacity: 0.0 });
      gsap.to(scan, {
        x: 200,
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        opacity: 1,
      });
    });
  }

  // ====================================
  // Numbers Section Animations - NOVA ESTRUTURA
  // ====================================

  // Header da seção
  gsap.from(".numbers-title", {
    scrollTrigger: {
      trigger: ".numbers-section",
      start: "top bottom",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    x: -50,
    duration: 0.8,
    ease: "power2.out",
  });

  // Estatísticas - layout direto com contagem animada
  const statItems = gsap.utils.toArray(".stat-item");
  statItems.forEach((item, index) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 80,
      duration: 0.8,
      delay: index * 0.15,
      ease: "power2.out",
    });

    // Animação de contagem dos números (preserva formato do HTML)
    const numberElement = item.querySelector(".stat-number");
    if (numberElement) {
      const originalText = numberElement.textContent.trim();

      // Extrai a primeira parte numérica do texto preservando separadores
      const numMatch = originalText.match(/[+-]?\d[\d.,]*/);
      const numberStr = numMatch ? numMatch[0] : "";
      const start = numMatch ? originalText.indexOf(numberStr) : 0;
      const prefix = originalText.slice(0, start);
      const suffix = originalText.slice(start + numberStr.length);

      // Detecta separadores decimal/milhar com heurística simples
      const lastDot = numberStr.lastIndexOf(".");
      const lastComma = numberStr.lastIndexOf(",");
      let decimalSep = null;
      let thousandsSep = null;
      let decimals = 0;

      if (lastComma > lastDot && lastComma !== -1) {
        // vírgula provavelmente decimal (pt-BR), ponto (se houver) como milhar
        decimalSep = ",";
        thousandsSep = numberStr.includes(".") ? "." : null;
        decimals = numberStr.length - lastComma - 1;
      } else if (lastDot !== -1) {
        const fracLen = numberStr.length - lastDot - 1;
        if (fracLen !== 3) {
          // se não for grupo de 3 no final, considere ponto decimal
          decimalSep = ".";
          thousandsSep = numberStr.includes(",") ? "," : null;
          decimals = fracLen;
        } else {
          // provável separador de milhar
          thousandsSep = ".";
          decimalSep = null;
          decimals = 0;
        }
      }

      // Converte string numérica para valor real
      let sanitized = numberStr;
      if (thousandsSep) sanitized = sanitized.split(thousandsSep).join("");
      if (decimalSep && decimalSep !== ".")
        sanitized = sanitized.replace(decimalSep, ".");
      const targetValue = parseFloat(sanitized) || 0;

      // Função de formatação que replica o formato original
      const formatValue = (val) => {
        let str =
          decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
        let intPart = str;
        let fracPart = "";
        if (decimals > 0) {
          const split = str.split(".");
          intPart = split[0];
          fracPart = split[1] || "";
        }
        if (thousandsSep) {
          intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
        }
        if (decimals > 0) {
          const sep = decimalSep || ","; // se não detectado, usa vírgula por padrão pt-BR
          return intPart + sep + fracPart;
        }
        return intPart;
      };

      // Atualiza do 0 ao alvo mantendo o formato
      // Animação de digitação para os textos das estatísticas
      const textEl = item.querySelector(".stat-text");
      if (textEl) {
        const fullText = (textEl.textContent || "").trim();
        // Evita flicker e permite reanimação ao voltar
        textEl.textContent = "";
        // Mais cadenciado: aumenta duração por caractere e limita máximos/ mínimos
        const typeDuration = Math.max(1.2, Math.min(5, fullText.length * 0.08));
        const stepsCount = Math.max(1, fullText.length);

        ScrollTrigger.create({
          trigger: item,
          start: "top 75%",
          onEnter: () => {
            // mata tweens antigos e começa a digitar novamente
            gsap.killTweensOf(textEl);
            textEl.classList.add("typing");
            gsap.to(textEl, {
              text: fullText,
              duration: typeDuration,
              // Passos discretos por caractere para sensação de batida/ritmo
              ease: `steps(${stepsCount})`,
              overwrite: "auto",
              onComplete: () => textEl.classList.remove("typing"),
            });
          },
          onLeaveBack: () => {
            gsap.killTweensOf(textEl);
            textEl.textContent = "";
            textEl.classList.remove("typing");
          },
        });
      }
      const counter = { value: 0 };
      gsap.to(counter, {
        value: targetValue,
        scrollTrigger: {
          trigger: item,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        duration: 2,
        delay: index * 0.15 + 0.3,
        ease: "power2.out",
        onUpdate: function () {
          numberElement.textContent =
            prefix + formatValue(counter.value) + suffix;
        },
        onComplete: function () {
          // Garante que o texto final seja exatamente o original do HTML
          numberElement.textContent = originalText;
        },
      });
    }
  });

  // Elementos decorativos
  gsap.from(".decoration-circle", {
    scrollTrigger: {
      trigger: ".numbers-section",
      start: "top 60%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    scale: 0,
    duration: 1.5,
    delay: 0.5,
    ease: "back.out(1.7)",
  });

  const decorationShapes = gsap.utils.toArray(".decoration-shape");
  gsap.from(decorationShapes, {
    scrollTrigger: {
      trigger: ".numbers-section",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    scale: 0,
    rotation: 180,
    stagger: 0.1,
    duration: 0.8,
    delay: 0.7,
    ease: "back.out(1.2)",
  });

  // Watermark - animação simples conforme Figma + flutuação contínua
  gsap.from(".numbers-watermark-bg", {
    scrollTrigger: {
      trigger: ".numbers-section",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    scale: 0.8,
    duration: 1.5,
    ease: "power2.out",
    onComplete: () => {
      // Inicia flutuação contínua após entrada
      gsap.to(".numbers-watermark-bg", {
        y: "+=30",
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
  });

  // ====================================
  // About Section Animations
  // ====================================
  const ABOUT_ARROW_FLOAT_AMP = 18;
  let aboutArrowFloatTween = null;
  const startAboutArrowFloat = () => {
    const arrow = document.querySelector(".about-arrow");
    if (!arrow) return;
    if (aboutArrowFloatTween) aboutArrowFloatTween.kill();
    aboutArrowFloatTween = gsap.to(arrow, {
      y: ABOUT_ARROW_FLOAT_AMP,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  };

  gsap.set(".about-arrow", { y: -ABOUT_ARROW_FLOAT_AMP });

  gsap.from(".section-label-red", {
    scrollTrigger: {
      trigger: ".about-section",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    x: -50,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap.from(".about-img-1", {
    scrollTrigger: {
      trigger: ".about-grid",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    x: -60,
    duration: 1,
    ease: "power2.out",
  });

  gsap.from(".about-img-2", {
    scrollTrigger: {
      trigger: ".about-grid",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    x: -60,
    duration: 1,
    delay: 0.2,
    ease: "power2.out",
  });

  gsap.from(".about-arrow", {
    scrollTrigger: {
      trigger: ".about-grid",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    rotate: -90,
    scale: 0,
    duration: 0.8,
    delay: 0.4,
    ease: "back.out(1.7)",
    onComplete: startAboutArrowFloat,
  });

  gsap.from(".about-text h3", {
    scrollTrigger: {
      trigger: ".about-text",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: "power2.out",
  });

  const aboutParagraphs = gsap.utils.toArray(".about-text p");
  gsap.from(aboutParagraphs, {
    scrollTrigger: {
      trigger: ".about-text",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.8,
    delay: 0.2,
    ease: "power2.out",
  });

  // ====================================
  // Team Section Animations
  // ====================================

  gsap.from(".team-left .team-member", {
    scrollTrigger: {
      trigger: ".team-section",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    x: -80,
    duration: 1,
    ease: "power2.out",
  });

  gsap.from(".team-right .team-member", {
    scrollTrigger: {
      trigger: ".team-section",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    x: 80,
    duration: 1,
    ease: "power2.out",
  });

  // Team photos - entrada sutil (sem girar)
  const memberPhotos = gsap.utils.toArray(".member-photo");
  memberPhotos.forEach((photo) => {
    gsap.from(photo, {
      scrollTrigger: {
        trigger: photo,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 20,
      scale: 0.94,
      duration: 0.8,
      ease: "power2.out",
    });
  });

  // Social icons hover
  document.querySelectorAll(".social-link").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      gsap.to(link, {
        scale: 1.15,
        rotation: 5,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    });

    link.addEventListener("mouseleave", () => {
      gsap.to(link, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

    // ====================================
    // Services Section - Card Stacking Animations (AAT.js style)
    // ====================================
    
    if (document.querySelector('.services-section .section-label')) gsap.from('.services-section .section-label', {
        scrollTrigger: {
            trigger: '.services-section',
            start: 'top 50%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.from('.services-title', {
        scrollTrigger: {
            trigger: '.services-section',
            start: 'top 50%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'power2.out'
    });

    // Anime.js lettering effect for the services headline
    (function initServicesTitleAnime(){
        const title = document.querySelector('.services-title');
        if (!title || typeof anime === 'undefined') return;

        const wrapLetters = (element) => {
            const nodes = Array.from(element.childNodes);
            nodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent || '';
                    const frag = document.createDocumentFragment();
                    for (const char of text) {
                        if (char === ' ') {
                            frag.appendChild(document.createTextNode(' '));
                        } else {
                            const span = document.createElement('span');
                            span.className = 'letter';
                            span.textContent = char;
                            frag.appendChild(span);
                        }
                    }
                    element.replaceChild(frag, node);
                } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
                    wrapLetters(node);
                }
            });
        };

        if (!title.dataset.animeReady) {
            wrapLetters(title);
            title.dataset.animeReady = 'true';
        }

        const letters = title.querySelectorAll('.letter');
        if (!letters.length) return;

        ScrollTrigger.create({
            trigger: '.services-section',
            start: 'top 60%',
            once: true,
            onEnter: () => {
                anime({
                    targets: letters,
                    translateY: [24, 0],
                    opacity: [0, 1],
                    rotateX: [-15, 0],
                    easing: 'easeOutExpo',
                    duration: 900,
                    delay: anime.stagger(35)
                });
            }
        });
    })();

    // Empilhamento dos cards (stack) centralizados
    const servicesCardsContainer = document.querySelector('.services-section .cards') || document.querySelector('.services-cards');
    const servicesCards = servicesCardsContainer ? gsap.utils.toArray(servicesCardsContainer.querySelectorAll('.card, .service-card')) : [];
    const servicesProgress = document.querySelector('.services-progress');
    const servicesProgressCurrent = servicesProgress ? servicesProgress.querySelector('.services-progress-current') : null;
    const servicesProgressTotal = servicesProgress ? servicesProgress.querySelector('.services-progress-total') : null;
    const servicesProgressStepsContainer = servicesProgress ? servicesProgress.querySelector('.services-progress-steps') : null;
    let servicesProgressSteps = [];
    const servicesCompactMM = window.matchMedia('(max-width: 820px)');
    const stackTweens = [];

    const updateServicesProgress = (index, { immediate = false } = {}) => {
        if (!servicesProgress || !servicesCards.length) return;

        const total = servicesCards.length;
        const clampedIndex = gsap.utils.clamp(0, total - 1, index);

        if (servicesProgressCurrent) {
            servicesProgressCurrent.textContent = String(clampedIndex + 1);
        }
        if (servicesProgressTotal) {
            servicesProgressTotal.textContent = String(total);
        }

        if (servicesProgressSteps.length) {
            servicesProgressSteps.forEach((step, stepIdx) => {
                step.classList.toggle('is-active', stepIdx === clampedIndex);
                step.classList.toggle('is-complete', stepIdx < clampedIndex);
            });
        }

        if (servicesProgress) {
            servicesProgress.classList.toggle('services-progress--started', clampedIndex > 0);
        }
    };
    const getStackScale = () => (servicesCompactMM.matches ? 0.985 : 0.92);
    if (servicesCardsContainer && servicesCards.length) {
        if (servicesProgress) {
            servicesProgress.style.display = servicesCards.length > 1 ? '' : 'none';
            gsap.set(servicesProgress, { autoAlpha: 0, y: 12 });

            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.create({
                    trigger: servicesCardsContainer,
                    start: 'top 80%',
                    onEnter: () => gsap.to(servicesProgress, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }),
                    onEnterBack: () => gsap.to(servicesProgress, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }),
                    onLeaveBack: () => gsap.to(servicesProgress, { autoAlpha: 0, y: 12, duration: 0.25, ease: 'power2.in' })
                });
                ScrollTrigger.create({
                    trigger: servicesCardsContainer,
                    start: 'bottom top+=120',
                    onEnter: () => gsap.to(servicesProgress, { autoAlpha: 0, y: 12, duration: 0.35, ease: 'power2.in' }),
                    onLeaveBack: () => gsap.to(servicesProgress, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' })
                });
            } else {
                gsap.set(servicesProgress, { autoAlpha: 1, y: 0 });
            }
        }
        if (servicesProgressStepsContainer) {
            servicesProgressStepsContainer.innerHTML = '';
            servicesProgressSteps = servicesCards.map(() => {
                const step = document.createElement('span');
                step.className = 'services-progress-step';
                servicesProgressStepsContainer.appendChild(step);
                return step;
            });
        } else {
            servicesProgressSteps = [];
        }
        updateServicesProgress(0, { immediate: true });

        let activeServiceIndex = 0;
        const serviceStepTriggers = [];
        const setActiveService = (idx, opts) => {
            const nextIndex = gsap.utils.clamp(0, servicesCards.length - 1, idx);
            if (nextIndex === activeServiceIndex && !(opts && opts.force)) return;
            activeServiceIndex = nextIndex;
            updateServicesProgress(activeServiceIndex, opts);
        };

        servicesCards.forEach((card, index) => {
            if (typeof ScrollTrigger === 'undefined') return;
            const st = ScrollTrigger.create({
                trigger: card,
                start: 'center center',
                end: '+=1',
                onEnter: () => setActiveService(index),
                onEnterBack: () => setActiveService(index),
                onLeave: () => {
                    if (index === servicesCards.length - 1 && servicesProgress) {
                        gsap.to(servicesProgress, { autoAlpha: 0, y: 14, duration: 0.3, ease: 'power2.in' });
                    }
                },
                onLeaveBack: () => {
                    if (index === servicesCards.length - 1 && servicesProgress) {
                        gsap.to(servicesProgress, { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' });
                    }
                }
            });
            serviceStepTriggers.push(st);
        });

        // Centralização vertical usa --card-height no CSS (via top: calc(...))
        const updateCardsMetrics = () => {
            const firstInner = servicesCards[0].querySelector('.card__inner') || servicesCards[0];
            const h = firstInner ? Math.max(firstInner.scrollHeight, 420) : 420;
            servicesCardsContainer.style.setProperty('--cards-count', servicesCards.length);
            servicesCardsContainer.style.setProperty('--card-height', `${h}px`);
            // Garante brilho inicial
            servicesCards.forEach(c => {
                const inner = c.querySelector('.card__inner') || c;
                if (inner) inner.style.filter = 'brightness(1)';
            });
        };
        updateCardsMetrics();
        window.addEventListener('load', updateCardsMetrics);
        window.addEventListener('resize', () => { gsap.delayedCall(0.05, updateCardsMetrics); });

        servicesCards.forEach((card, index) => {
            const inner = card.querySelector('.card__inner') || card;
            const numberEl = card.querySelector('.card__number') || card.querySelector('.card-number');
            const imageEl = card.querySelector('.card__image-container') || card.querySelector('.card-image');
            const stackScale = getStackScale();

            // Ordem de sobreposição: os próximos ficam acima
            card.style.zIndex = String(index + 1);
            if (inner) inner.style.zIndex = String(index + 1);

            // Entrada suave para cada card
            gsap.from(inner, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                ease: 'power3.out'
            });

            if (numberEl) {
                // Animação suave, sem "pulo": apenas fade + leve translação
                gsap.from(numberEl, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 0,
                    y: 14,
                    duration: 0.5,
                    delay: 0.1,
                    ease: 'power2.out'
                });
            }

            if (imageEl) {
                gsap.from(imageEl, {
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    },
                    opacity: 0,
                    x: 60,
                    scale: 0.96,
                    duration: 0.8,
                    delay: 0.1,
                    ease: 'power2.out'
                });
            }

            // Efeito stack: enquanto o próximo card entra, o atual reduz escala e brilho
            if (index < servicesCards.length - 1 && inner) {
                const nextCard = servicesCards[index + 1];
                const tween = gsap.to(inner, {
                    scrollTrigger: {
                        trigger: nextCard,
                        start: 'top bottom',
                        end: 'top top',
                        scrub: true
                    },
                    scale: stackScale,
                    filter: 'brightness(0.85)',
                    transformOrigin: servicesCompactMM.matches ? 'center top' : 'top center',
                    ease: 'none'
                });
                stackTweens.push(tween);
            }
        });

        servicesCompactMM.addEventListener('change', () => {
            const nextScale = getStackScale();
            stackTweens.forEach(tween => {
                tween.vars.scale = nextScale;
                tween.vars.transformOrigin = servicesCompactMM.matches ? 'center top' : 'top center';
                tween.invalidate();
            });
            ScrollTrigger.refresh();
        });

        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.addEventListener('refresh', () => {
                setActiveService(activeServiceIndex, { immediate: true, force: true });
            });
        }
    }

    // ====================================
    // Cases Section Animations
    // ====================================
    
    // Animação por case: cada .toggle cria a própria linha animada
    gsap.registerPlugin(ScrollTrigger);
    const redLog = document.querySelector('.red-log');
    const redProgress = document.querySelector('.red-progress');
    function logRed(text) { if (redLog) redLog.innerHTML += text + '<br>'; }

    const casesSection = document.querySelector('.cases-section');
    const caseItems = casesSection ? gsap.utils.toArray('.cases-list .case-item') : [];
    const caseLines = caseItems.map(item => item.querySelector('.line-1'));
    const fallbackCasesBg = casesSection ? window.getComputedStyle(casesSection).backgroundColor : '#1E2F3C';
    const casesProgress = casesSection ? casesSection.querySelector('.cases-progress') : null;
    const casesProgressFill = casesProgress ? casesProgress.querySelector('.cases-progress-fill') : null;
    const casesProgressCurrent = casesProgress ? casesProgress.querySelector('.cases-progress-current') : null;
    const casesProgressTotal = casesProgress ? casesProgress.querySelector('.cases-progress-total') : null;
    const casesProgressStepsContainer = casesProgress ? casesProgress.querySelector('.cases-progress-steps') : null;
    let casesProgressSteps = [];
    let currentCaseBg = null;
    const CASE_THEMES = ['dark','red','light','deep','teal','yellow','default'];

    const updateCasesProgress = (index, { immediate = false } = {}) => {
        const total = caseItems.length;
        if (!casesProgress || total === 0) return;

        if (casesProgressCurrent) {
            casesProgressCurrent.textContent = String(Math.min(total, index + 1));
        }
        if (casesProgressTotal) {
            casesProgressTotal.textContent = String(total);
        }

        if (casesProgressSteps.length) {
            casesProgressSteps.forEach((step, stepIdx) => {
                step.classList.toggle('is-active', stepIdx === index);
                step.classList.toggle('is-complete', stepIdx < index);
            });
        }

        if (casesProgressFill) {
            const maxIndex = Math.max(1, total - 1);
            const targetRatio = total > 1 ? index / maxIndex : 1;
            gsap.to(casesProgressFill, {
                width: `${(targetRatio * 100).toFixed(3)}%`,
                duration: immediate ? 0 : 0.45,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        }
    };

    const applyCaseTheme = (item) => {
        if (!casesSection || !item) return;
        const theme = item.dataset ? item.dataset.theme || '' : '';
        CASE_THEMES.forEach(name => casesSection.classList.remove(`cases-theme-${name}`));
        if (theme) {
            casesSection.classList.add(`cases-theme-${theme}`);
        }
    };

    const setCaseBackground = (item, immediate = false) => {
        if (!casesSection || !item) return;
        applyCaseTheme(item);
        const color = item.dataset ? item.dataset.bg || fallbackCasesBg : fallbackCasesBg;
        if (!color || color === currentCaseBg && !immediate) return;
        currentCaseBg = color;
        gsap.to(casesSection, {
            backgroundColor: color,
            duration: immediate ? 0 : 0.6,
            ease: 'power1.out',
            overwrite: 'auto'
        });
    };

    const animateCaseEntry = (item) => {
        if (!item) return;
        if (item.__caseEntryTimeline) {
            item.__caseEntryTimeline.kill();
        }
        const mockup = item.querySelector('.case-mockup');
        const title = item.querySelector('.case-title');
        const features = gsap.utils.toArray(item.querySelectorAll('.case-features li'));
        const buttons = item.querySelector('.case-buttons');

        const tl = gsap.timeline({ defaults: { ease: 'power2.out', overwrite: 'auto' } });
        if (mockup) {
            tl.fromTo(mockup, { autoAlpha: 0, y: 80, rotate: -5 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.6 });
        }
        if (title) {
            tl.fromTo(title, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.5 }, '-=0.35');
        }
        if (features.length) {
            tl.fromTo(features, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.08 }, '-=0.25');
        }
        if (buttons) {
            tl.fromTo(buttons, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4 }, '-=0.2');
        }
        item.__caseEntryTimeline = tl;
    };

    if (casesSection && caseItems.length) {
        const mm = gsap.matchMedia();

        if (casesProgress) {
            casesProgress.style.display = caseItems.length > 1 ? '' : 'none';
        }
        if (casesProgressStepsContainer) {
            casesProgressStepsContainer.innerHTML = '';
            const totalSteps = caseItems.length;
            casesProgressSteps = caseItems.map((_, idx) => {
                const step = document.createElement('span');
                step.className = 'cases-progress-step';
                if (totalSteps > 1) {
                    const ratio = idx / (totalSteps - 1);
                    step.style.left = `${(ratio * 100).toFixed(3)}%`;
                } else {
                    step.style.left = '0%';
                }
                casesProgressStepsContainer.appendChild(step);
                return step;
            });
        } else {
            casesProgressSteps = [];
        }
        if (casesProgressFill) {
            gsap.set(casesProgressFill, { width: '0%' });
        }
        updateCasesProgress(0, { immediate: true });
        setCaseBackground(caseItems[0], true);

        mm.add('(min-width: 0px)', () => {
            const totalCases = caseItems.length;
            let activeIndex = 0;

            caseItems.forEach((item, idx) => {
                item.style.zIndex = String(totalCases - idx);
                gsap.set(item, { autoAlpha: idx === 0 ? 1 : 0 });
                item.classList.toggle('is-active', idx === 0);
            });

            caseLines.forEach(line => line && gsap.set(line, { scaleX: 0 }));
            animateCaseEntry(caseItems[0]);

            const trigger = ScrollTrigger.create({
                trigger: casesSection,
                start: 'top top',
                end: () => '+=' + Math.max(window.innerHeight * 0.75, 420) * Math.max(1, totalCases - 1),
                pin: true,
                anticipatePin: 1,
                scrub: false,
                snap: totalCases > 1 ? {
                    snapTo: (value) => {
                        const snapIndex = Math.round(value * (totalCases - 1));
                        return (totalCases - 1) ? snapIndex / (totalCases - 1) : 0;
                    },
                    duration: 0.55,
                    delay: 0,
                    ease: 'power2.inOut'
                } : false,
                onUpdate: self => {
                    const hasMultiple = totalCases > 1;
                    let newIndex = activeIndex;

                    if (hasMultiple) {
                        const maxIndex = totalCases - 1;
                        const progress = self.progress;
                        let candidate = activeIndex;

                        while (candidate < maxIndex && progress >= ((candidate + 0.5) / maxIndex)) {
                            candidate++;
                        }
                        while (candidate > 0 && progress <= ((candidate - 0.5) / maxIndex)) {
                            candidate--;
                        }

                        newIndex = candidate;
                    } else {
                        newIndex = 0;
                    }

                    if (newIndex !== activeIndex) {
                        activeIndex = newIndex;
                        caseItems.forEach((item, idx) => {
                            const isActive = idx === activeIndex;
                            item.classList.toggle('is-active', isActive);
                            gsap.to(item, { autoAlpha: isActive ? 1 : 0, duration: 0.35, overwrite: 'auto' });
                        });
                        animateCaseEntry(caseItems[activeIndex]);
                        setCaseBackground(caseItems[activeIndex]);
                        updateCasesProgress(activeIndex);
                        logRed(`case ${activeIndex + 1} active`);
                    }

                    caseLines.forEach((line, idx) => {
                        if (!line) return;
                        gsap.set(line, { scaleX: idx <= activeIndex ? 1 : 0 });
                    });
                    if (redProgress) {
                        redProgress.innerText = 'index: ' + (activeIndex + 1);
                    }
                },
                onRefresh: () => {
                    caseItems.forEach((item, idx) => {
                        gsap.set(item, { autoAlpha: idx === activeIndex ? 1 : 0 });
                        item.classList.toggle('is-active', idx === activeIndex);
                    });
                    caseLines.forEach((line, idx) => {
                        if (!line) return;
                        gsap.set(line, { scaleX: idx <= activeIndex ? 1 : 0 });
                    });
                    setCaseBackground(caseItems[activeIndex], true);
                    updateCasesProgress(activeIndex, { immediate: true });
                }
            });

            return () => {
                trigger.kill();
                caseItems.forEach(item => {
                    gsap.set(item, { clearProps: 'all' });
                    item.classList.remove('is-active');
                    item.style.zIndex = '';
                });
                caseLines.forEach(line => line && gsap.set(line, { clearProps: 'all' }));
                setCaseBackground(caseItems[0], true);
                updateCasesProgress(0, { immediate: true });
            };
        });
    }

    if (document.querySelector('.cases-section .section-label')) gsap.from('.cases-section .section-label', {
        scrollTrigger: {
            trigger: '.cases-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power2.out'
    });

  // ====================================
  // Footer Section - Logo Dinâmico (LEGADO, protegido)
  // ====================================
  const footerLogo = document.querySelector(".footer-logo-dynamic");
  if (footerLogo) {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top center",
        end: "bottom center",
        onEnter: () =>
          (footerLogo.className = "footer-logo-dynamic hero-active"),
        onLeave: () => (footerLogo.className = "footer-logo-dynamic"),
        onEnterBack: () =>
          (footerLogo.className = "footer-logo-dynamic hero-active"),
        onLeaveBack: () => (footerLogo.className = "footer-logo-dynamic"),
      },
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".numbers-section",
        start: "top center",
        end: "bottom center",
        onEnter: () =>
          (footerLogo.className = "footer-logo-dynamic numbers-active"),
        onLeave: () => (footerLogo.className = "footer-logo-dynamic"),
        onEnterBack: () =>
          (footerLogo.className = "footer-logo-dynamic numbers-active"),
        onLeaveBack: () => (footerLogo.className = "footer-logo-dynamic"),
      },
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".about-section",
        start: "top center",
        end: "bottom center",
        onEnter: () =>
          (footerLogo.className = "footer-logo-dynamic about-active"),
        onLeave: () => (footerLogo.className = "footer-logo-dynamic"),
        onEnterBack: () =>
          (footerLogo.className = "footer-logo-dynamic about-active"),
        onLeaveBack: () => (footerLogo.className = "footer-logo-dynamic"),
      },
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: ".services-section",
        start: "top center",
        end: "bottom center",
        onEnter: () =>
          (footerLogo.className = "footer-logo-dynamic services-active"),
        onLeave: () => (footerLogo.className = "footer-logo-dynamic"),
        onEnterBack: () =>
          (footerLogo.className = "footer-logo-dynamic services-active"),
        onLeaveBack: () => (footerLogo.className = "footer-logo-dynamic"),
      },
    });
  }

  // Animações do conteúdo do footer
  if (document.querySelector(".footer-title"))
    gsap.from(".footer-title", {
      scrollTrigger: {
        trigger: ".footer-section",
        start: "top 70%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 100,
      duration: 1.2,
      ease: "power3.out",
    });

  if (document.querySelector(".footer-address"))
    gsap.from(".footer-address", {
      scrollTrigger: {
        trigger: ".footer-section",
        start: "top 60%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.3,
      ease: "power2.out",
    });

  if (document.querySelector(".footer-room"))
    gsap.from(".footer-room", {
      scrollTrigger: {
        trigger: ".footer-section",
        start: "top 50%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      scale: 0.5,
      duration: 1.5,
      delay: 0.6,
      ease: "back.out(1.2)",
    });

  // ====================================
  // Button Hover Effects
  // ====================================

  document.querySelectorAll(".btn-outline, .btn-primary").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        scale: 1.05,
        y: -3,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  });

  // ====================================
  // Parallax Effects
  // ====================================

  // Hero image parallax
  if (document.querySelector(".hero-image"))
    gsap.to(".hero-image", {
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1,
      },
      y: 100,
      ease: "none",
    });

  // Background parallax for numbers section (usa .numbers-background img no HTML)
  if (document.querySelector(".numbers-background img"))
    gsap.to(".numbers-background img", {
      scrollTrigger: {
        trigger: ".numbers-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      y: -50,
      ease: "none",
    });

  // Footer background parallax
  if (document.querySelector(".footer-bg img"))
    gsap.to(".footer-bg img", {
      scrollTrigger: {
        trigger: ".footer-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
      y: -80,
      ease: "none",
    });

  // ====================================
  // Localização - Animações de entrada
  // ====================================
    (function initLocalizacaoVideoAutoplay(){
        const section = document.querySelector('.localizacao-section');
        const iframe = section ? section.querySelector('.localizacao-video') : null;
        if (!section || !iframe) return;

        const videoSrc = iframe.dataset.src;
        if (!videoSrc) return;

        if (iframe.dataset.loaded !== 'true') {
            iframe.src = videoSrc;
            iframe.dataset.loaded = 'true';
        }
    })();

  gsap.from(".localizacao-title", {
    scrollTrigger: {
      trigger: ".localizacao-section",
      start: "top 70%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    x: -60,
    duration: 1,
    ease: "power3.out",
  });
  gsap.from(".localizacao-cta", {
    scrollTrigger: {
      trigger: ".localizacao-section",
      start: "top 65%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.2,
    ease: "power2.out",
  });
  gsap.from([".localizacao-topbar .brand", ".localizacao-topbar .topline"], {
    scrollTrigger: {
      trigger: ".localizacao-section",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
    opacity: 0,
    y: -20,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out",
  });
  gsap.from(
    [".localizacao-bottom .bottom-line", ".localizacao-bottom .bottom-content"],
    {
      scrollTrigger: {
        trigger: ".localizacao-section",
        start: "top 55%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
    }
  );

  // Parallax leve no BG da Localização
  gsap.to(".localizacao-bg .localizacao-video", {
    scrollTrigger: {
      trigger: ".localizacao-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
    y: -60,
    ease: "none",
  });

  // ====================================
  // Footer Panels - transição de cores com pin
  // ====================================
  const footerPanelsPin = document.querySelector(".footer-panels-pin");
  if (footerPanelsPin) {
    const bgColors = ["#DC473B", "#1E2F3C", "#4EC1B6", "#FEE644", "#DC473B"];
    const footerTextElements = footerPanelsPin.querySelectorAll(
      ".footer-heading, .footer-cta"
    );
    const footerLogoGiant = footerPanelsPin.querySelector(".footer-logo-giant");
    const tlFooter = gsap.timeline({
      scrollTrigger: {
        trigger: ".footer-panels-section",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: ".footer-panels-pin",
      },
    });
    bgColors.forEach((color, i) => {
      tlFooter.to(footerPanelsPin, { backgroundColor: color, duration: 1 }, i);
    });
    if (footerLogoGiant) {
      gsap.set(footerLogoGiant, {
        "--frame-opacity": 0.24,
        "--logo-img-opacity": 1,
        "--logo-shadow-opacity": 0.28,
      });
      tlFooter.to(
        footerLogoGiant,
        {
          "--frame-opacity": 0,
          "--logo-img-opacity": 0.35,
          "--logo-shadow-opacity": 0.05,
          duration: 0.6,
          ease: "power2.out",
        },
        bgColors.length - 0.6
      );
    }
    if (footerTextElements.length) {
      gsap.set(footerTextElements, {
        autoAlpha: 0,
        y: 40,
        rotateX: 15,
        transformPerspective: 600,
      });
      tlFooter.to(
        footerTextElements,
        {
          autoAlpha: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
        },
        bgColors.length - 0.4
      );
    }
  }

  // ====================================
  // Footer Theme - troca de cor por seção (LEGADO, só se existir .footer-section)
  // ====================================
  const footer = document.querySelector(".footer-section");
  if (footer) {
    const setFooterTheme = (theme) => {
      footer.classList.remove(
        "footer-theme-red",
        "footer-theme-teal",
        "footer-theme-dark",
        "footer-theme-yellow"
      );
      footer.classList.add(theme);
    };

    ScrollTrigger.create({
      trigger: ".hero-section",
      start: "top center",
      end: "bottom center",
      onEnter: () => setFooterTheme("footer-theme-red"),
      onEnterBack: () => setFooterTheme("footer-theme-red"),
    });
    ScrollTrigger.create({
      trigger: ".numbers-section",
      start: "top center",
      end: "bottom center",
      onEnter: () => setFooterTheme("footer-theme-dark"),
      onEnterBack: () => setFooterTheme("footer-theme-dark"),
    });
    ScrollTrigger.create({
      trigger: ".about-section",
      start: "top center",
      end: "bottom center",
      onEnter: () => setFooterTheme("footer-theme-teal"),
      onEnterBack: () => setFooterTheme("footer-theme-teal"),
    });
    ScrollTrigger.create({
      trigger: ".services-section",
      start: "top center",
      end: "bottom center",
      onEnter: () => setFooterTheme("footer-theme-yellow"),
      onEnterBack: () => setFooterTheme("footer-theme-yellow"),
    });
    ScrollTrigger.create({
      trigger: ".localizacao-section",
      start: "top center",
      end: "bottom center",
      onEnter: () => setFooterTheme("footer-theme-red"),
      onEnterBack: () => setFooterTheme("footer-theme-red"),
    });
  }

  console.log("All GSAP animations initialized ✅");

  // ====================================
  // Header fixo: aparece a partir da 2ª seção + detecção de contraste
  // ====================================
  (function initStickyHeaderVisibility() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    const show = () => header.classList.add("is-visible");
    const hide = () => header.classList.remove("is-visible");

    // Função para detectar se a seção atual é clara ou escura
    const detectSectionType = () => {
      const sections = [
        { selector: ".hero-section", type: "light" },
        { selector: ".numbers-section", type: "dark" },
        { selector: ".about-section", type: "light" },
        { selector: ".team-section", type: "light" },
        { selector: ".services-section", type: "dark" },
        { selector: ".cases-section", type: "dark" },
        { selector: ".localizacao-section", type: "dark" },
        { selector: ".footer-section", type: "dark" },
      ];

      const scrollY = window.scrollY || window.pageYOffset;
      const viewportCenter = scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.querySelector(section.selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          const sectionTop = scrollY + rect.top;
          const sectionBottom = sectionTop + rect.height;

          if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
            return section.type;
          }
        }
      }
      return "dark"; // fallback
    };

    // Função para atualizar o contraste do header
    const updateHeaderContrast = () => {
      const sectionType = detectSectionType();
      header.classList.remove("over-light-section", "over-dark-section");
      header.classList.add(`over-${sectionType}-section`);
    };

    // Interações do menu (mobile)
    const toggleBtn = header.querySelector(".nav-toggle");
    const setMenuOpen = (open) => {
      header.classList.toggle("menu-open", open);
      if (toggleBtn) toggleBtn.setAttribute("aria-expanded", String(!!open));
    };
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () =>
        setMenuOpen(!header.classList.contains("menu-open"))
      );
    }
    header
      .querySelectorAll(".nav-list a")
      .forEach((a) => a.addEventListener("click", () => setMenuOpen(false)));

    const home = document.querySelector("#home");
    const localizacaoSection = document.querySelector(".localizacao-section");
    const footerSection = document.querySelector(".footer-panels-section");
    const ensureHeaderAfterHero = () => {
      const pastHero =
        (window.scrollY || window.pageYOffset) >= (home
          ? home.offsetHeight - 10
          : 0);
      if (pastHero) {
        show();
        updateHeaderContrast();
      } else {
        hide();
        if (window.innerWidth <= 880) {
          updateHeaderContrast();
        }
      }
    };
    const toggleLocalizacaoHeader = (active) => {
      document.body.classList.toggle("is-in-localizacao", !!active);
      if (active) {
        hide();
        setMenuOpen(false);
      } else {
        ensureHeaderAfterHero();
      }
    };

    if (typeof ScrollTrigger !== "undefined" && home) {
      // Aparece quando o fundo do HERO passa pelo topo da viewport
      ScrollTrigger.create({
        trigger: home,
        start: "bottom top",
        onEnter: () => {
          show();
          updateHeaderContrast();
        },
        onLeaveBack: hide 
      });

      if (localizacaoSection && footerSection) {
        ScrollTrigger.create({
          trigger: localizacaoSection,
          start: "top bottom",
          endTrigger: footerSection,
          end: "top top",
          onEnter: () => toggleLocalizacaoHeader(true),
          onEnterBack: () => toggleLocalizacaoHeader(true),
          onUpdate: (self) => {
            if (self.isActive) toggleLocalizacaoHeader(true);
          },
          onLeave: () => {
            toggleLocalizacaoHeader(false);
            hide();
          },
          onLeaveBack: () => {
            toggleLocalizacaoHeader(false);
            ensureHeaderAfterHero();
          },
        });
      }
      

      if (footerSection) {
        ScrollTrigger.create({
          trigger: footerSection,
          start: "top bottom",
          onEnter: hide,
          onLeaveBack: () => {
            const pastHero =
              (window.scrollY || window.pageYOffset) >= home.offsetHeight - 10;
            if (pastHero) {
              show();
              updateHeaderContrast();
            } else hide();
          },
        });
      }

      // Estado inicial caso a página carregue já rolada
      const initVisible =
        (window.scrollY || window.pageYOffset) >= home.offsetHeight - 10;
      if (initVisible) {
        show();
        updateHeaderContrast();
      } else {
        hide();
        // No mobile, sempre aplicar contraste mesmo quando escondido
        if (window.innerWidth <= 880) {
          updateHeaderContrast();
        }
      }

      // Atualizar contraste durante o scroll
      window.addEventListener("scroll", updateHeaderContrast, {
        passive: true,
      });

      // No mobile, aplicar contraste imediatamente
      if (window.innerWidth <= 880) {
        updateHeaderContrast();
      }
    } else {
      // Fallback sem ScrollTrigger
      const heroH = () => (home ? home.offsetHeight : window.innerHeight);
      const footerTop = () =>
        footerSection ? footerSection.offsetTop : Infinity;
      const onScroll = () => {
        const y = window.scrollY || window.pageYOffset;
        const viewportBottom = y + window.innerHeight;
        if (footerSection && viewportBottom >= footerTop()) {
          hide();
          return;
        }
        if (y >= heroH() - 10) {
          show();
          updateHeaderContrast();
        } else hide();
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    }
  })();

  // ====================================
  // Scrollspy: marcar link ativo baseado na seção
  // ====================================
  (function initScrollSpy() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const links = Array.from(header.querySelectorAll('.nav-list a[href^="#"]'));
    if (!links.length) return;

    const map = links
      .map((a) => {
        const id = decodeURIComponent(a.getAttribute("href") || "").slice(1);
        const section = id ? document.getElementById(id) : null;
        return section ? { a, section } : null;
      })
      .filter(Boolean);

    const setActive = (el) => {
      links.forEach((l) => l.classList.toggle("active", l === el));
    };

    if (typeof ScrollTrigger !== "undefined") {
      map.forEach(({ a, section }) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(a),
          onEnterBack: () => setActive(a),
        });
      });
    } else if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const found = map.find((m) => m.section === entry.target);
              if (found) setActive(found.a);
            }
          });
        },
        { rootMargin: "-40% 0% -40% 0%", threshold: 0 }
      );
      map.forEach((m) => io.observe(m.section));
    }
  })();
});
