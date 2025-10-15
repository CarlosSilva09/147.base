// Registrar plugins do GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin, ScrollToPlugin, Observer, Flip, Draggable);

document.addEventListener('DOMContentLoaded', function() {
    console.log('GSAP Loaded:', typeof gsap !== 'undefined');
    
    // ====================================
    // Hero Section Animations - NOVA ESTRUTURA
    // ====================================
    
    // Logo pequeno fade in
    gsap.from('.hero-logo-small', {
        opacity: 0,
        y: -50,
        rotation: -20,
        duration: 1.2,
        ease: 'back.out(1.7)'
    });

    // Hero title animation - palavra por palavra
    gsap.from('.hero-title', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        delay: 0.3,
        ease: 'power3.out'
    });

    // Elemento 147 vermelho
    gsap.from('.hero-147-element', {
        opacity: 0,
        x: -150,
        scale: 0.9,
        duration: 2,
        delay: 0.6,
        ease: 'power2.out'
    });

    // Círculo amarelo com ícone
    gsap.from('.hero-yellow-circle', {
        opacity: 0,
        scale: 0,
        rotation: 180,
        duration: 1,
        delay: 0.8,
        ease: 'back.out(1.7)'
    });

    // Mulher VR - entrada dramática
    gsap.from('.hero-vr-girl', {
        opacity: 0,
        x: 200,
        scale: 1.1,
        duration: 2,
        delay: 0.4,
        ease: 'power3.out'
    });

    // Animação flutuante sutil para a mulher VR
    gsap.to('.hero-vr-girl', {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 2
    });

    // Grid de transição
    gsap.from('.hero-transition-grid', {
        opacity: 0,
        y: 100,
        duration: 1.5,
        delay: 1,
        ease: 'power2.out'
    });

    // ====================================
    // Numbers Section Animations - NOVA ESTRUTURA
    // ====================================
    
    // Header da seção
    gsap.from('.numbers-title', {
        scrollTrigger: {
            trigger: '.numbers-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.from('.numbers-line', {
        scrollTrigger: {
            trigger: '.numbers-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        width: 0,
        duration: 1.2,
        delay: 0.2,
        ease: 'power2.out'
    });

    // Estatísticas - layout direto com contagem animada
    const statItems = gsap.utils.toArray('.stat-item');
    statItems.forEach((item, index) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 80,
            duration: 0.8,
            delay: index * 0.15,
            ease: 'power2.out'
        });

        // Animação de contagem dos números (preserva formato do HTML)
        const numberElement = item.querySelector('.stat-number');
        if (numberElement) {
            const originalText = numberElement.textContent.trim();

            // Extrai a primeira parte numérica do texto preservando separadores
            const numMatch = originalText.match(/[+-]?\d[\d.,]*/);
            const numberStr = numMatch ? numMatch[0] : '';
            const start = numMatch ? originalText.indexOf(numberStr) : 0;
            const prefix = originalText.slice(0, start);
            const suffix = originalText.slice(start + numberStr.length);

            // Detecta separadores decimal/milhar com heurística simples
            const lastDot = numberStr.lastIndexOf('.');
            const lastComma = numberStr.lastIndexOf(',');
            let decimalSep = null;
            let thousandsSep = null;
            let decimals = 0;

            if (lastComma > lastDot && lastComma !== -1) {
                // vírgula provavelmente decimal (pt-BR), ponto (se houver) como milhar
                decimalSep = ',';
                thousandsSep = numberStr.includes('.') ? '.' : null;
                decimals = numberStr.length - lastComma - 1;
            } else if (lastDot !== -1) {
                const fracLen = numberStr.length - lastDot - 1;
                if (fracLen !== 3) {
                    // se não for grupo de 3 no final, considere ponto decimal
                    decimalSep = '.';
                    thousandsSep = numberStr.includes(',') ? ',' : null;
                    decimals = fracLen;
                } else {
                    // provável separador de milhar
                    thousandsSep = '.';
                    decimalSep = null;
                    decimals = 0;
                }
            }

            // Converte string numérica para valor real
            let sanitized = numberStr;
            if (thousandsSep) sanitized = sanitized.split(thousandsSep).join('');
            if (decimalSep && decimalSep !== '.') sanitized = sanitized.replace(decimalSep, '.');
            const targetValue = parseFloat(sanitized) || 0;

            // Função de formatação que replica o formato original
            const formatValue = (val) => {
                let str = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toString();
                let intPart = str;
                let fracPart = '';
                if (decimals > 0) {
                    const split = str.split('.');
                    intPart = split[0];
                    fracPart = split[1] || '';
                }
                if (thousandsSep) {
                    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
                }
                if (decimals > 0) {
                    const sep = decimalSep || ','; // se não detectado, usa vírgula por padrão pt-BR
                    return intPart + sep + fracPart;
                }
                return intPart;
            };

            // Atualiza do 0 ao alvo mantendo o formato
            const counter = { value: 0 };
            gsap.to(counter, {
                value: targetValue,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                duration: 2,
                delay: index * 0.15 + 0.3,
                ease: 'power2.out',
                onUpdate: function() {
                    numberElement.textContent = prefix + formatValue(counter.value) + suffix;
                },
                onComplete: function() {
                    // Garante que o texto final seja exatamente o original do HTML
                    numberElement.textContent = originalText;
                }
            });
        }

        // Efeito de destaque para item amarelo
        if (item.classList.contains('stat-highlight')) {
            gsap.to(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 60%',
                    toggleActions: 'play none none reverse'
                },
                scale: 1.05,
                duration: 0.5,
                ease: 'back.out(1.2)'
            });
        }
    });


    // Elementos decorativos
    gsap.from('.decoration-circle', {
        scrollTrigger: {
            trigger: '.numbers-section',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0,
        duration: 1.5,
        delay: 0.5,
        ease: 'back.out(1.7)'
    });

    const decorationShapes = gsap.utils.toArray('.decoration-shape');
    gsap.from(decorationShapes, {
        scrollTrigger: {
            trigger: '.numbers-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0,
        rotation: 180,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.7,
        ease: 'back.out(1.2)'
    });

    // Watermark - animação simples conforme Figma
    gsap.from('.numbers-watermark-bg', {
        scrollTrigger: {
            trigger: '.numbers-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        ease: 'power2.out'
    });

    // Watermark parallax
    gsap.to('.numbers-watermark-bg', {
        scrollTrigger: {
            trigger: '.numbers-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -50,
        ease: 'none'
    });

    // ====================================
    // About Section Animations
    // ====================================
    
    gsap.from('.about-section .section-label', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.from('.about-img-1', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -60,
        duration: 1,
        ease: 'power2.out'
    });

    gsap.from('.about-img-2', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -60,
        duration: 1,
        delay: 0.2,
        ease: 'power2.out'
    });

    gsap.from('.about-arrow', {
        scrollTrigger: {
            trigger: '.about-grid',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        rotate: -90,
        scale: 0,
        duration: 0.8,
        delay: 0.4,
        ease: 'back.out(1.7)'
    });

    gsap.from('.about-text h3', {
        scrollTrigger: {
            trigger: '.about-text',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out'
    });

    const aboutParagraphs = gsap.utils.toArray('.about-text p');
    gsap.from(aboutParagraphs, {
        scrollTrigger: {
            trigger: '.about-text',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out'
    });

    // ====================================
    // Team Section Animations
    // ====================================
    
    gsap.from('.team-left .team-member', {
        scrollTrigger: {
            trigger: '.team-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -80,
        duration: 1,
        ease: 'power2.out'
    });

    gsap.from('.team-right .team-member', {
        scrollTrigger: {
            trigger: '.team-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 80,
        duration: 1,
        ease: 'power2.out'
    });

    // Photo scale animation
    const memberPhotos = gsap.utils.toArray('.member-photo');
    memberPhotos.forEach(photo => {
        gsap.from(photo, {
            scrollTrigger: {
                trigger: photo,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            scale: 0,
            rotation: 360,
            duration: 1,
            ease: 'back.out(1.2)'
        });
    });

    // Social icons hover
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.15,
                rotation: 5,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ====================================
    // Services Section - Card Stacking Animations (AAT.js style)
    // ====================================
    
    gsap.from('.services-section .section-label', {
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

    // Empilhamento dos cards (stack) centralizados
    const servicesCardsContainer = document.querySelector('.cards') || document.querySelector('.services-cards');
    const servicesCards = gsap.utils.toArray('.card').length ? gsap.utils.toArray('.card') : gsap.utils.toArray('.service-card');
    if (servicesCardsContainer && servicesCards.length) {
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
                const toScale = 0.92; // redução leve
                gsap.to(inner, {
                    scrollTrigger: {
                        trigger: nextCard,
                        start: 'top bottom',
                        end: 'top top',
                        scrub: true
                    },
                    scale: toScale,
                    filter: 'brightness(0.85)',
                    transformOrigin: 'top center',
                    ease: 'none'
                });
            }
        });
    }



    // ====================================
    // Cases Section Animations
    // ====================================
    
    gsap.from('.cases-section .section-label', {
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

    gsap.from('.case-mockup', {
        scrollTrigger: {
            trigger: '.case-content',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        rotation: -5,
        duration: 1,
        ease: 'power2.out'
    });

    gsap.from('.mockup-desktop', {
        scrollTrigger: {
            trigger: '.case-mockup',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        duration: 1,
        delay: 0.2,
        ease: 'back.out(1.2)'
    });

    gsap.from('.mockup-mobile', {
        scrollTrigger: {
            trigger: '.case-mockup',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: 50,
        rotation: 45,
        duration: 1,
        delay: 0.4,
        ease: 'back.out(1.2)'
    });

    gsap.from('.case-title', {
        scrollTrigger: {
            trigger: '.case-info',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out'
    });

    const caseFeatures = gsap.utils.toArray('.case-features li');
    gsap.from(caseFeatures, {
        scrollTrigger: {
            trigger: '.case-features',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        x: -40,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out'
    });

    gsap.from('.case-buttons', {
        scrollTrigger: {
            trigger: '.case-buttons',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power2.out'
    });

    // ====================================
    // Footer Section - Logo Dinâmico (LEGADO, protegido)
    // ====================================
    const footerLogo = document.querySelector('.footer-logo-dynamic');
    if (footerLogo) {
        gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-section', start: 'top center', end: 'bottom center',
                onEnter: () => footerLogo.className = 'footer-logo-dynamic hero-active',
                onLeave: () => footerLogo.className = 'footer-logo-dynamic',
                onEnterBack: () => footerLogo.className = 'footer-logo-dynamic hero-active',
                onLeaveBack: () => footerLogo.className = 'footer-logo-dynamic'
            }
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: '.numbers-section', start: 'top center', end: 'bottom center',
                onEnter: () => footerLogo.className = 'footer-logo-dynamic numbers-active',
                onLeave: () => footerLogo.className = 'footer-logo-dynamic',
                onEnterBack: () => footerLogo.className = 'footer-logo-dynamic numbers-active',
                onLeaveBack: () => footerLogo.className = 'footer-logo-dynamic'
            }
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: '.about-section', start: 'top center', end: 'bottom center',
                onEnter: () => footerLogo.className = 'footer-logo-dynamic about-active',
                onLeave: () => footerLogo.className = 'footer-logo-dynamic',
                onEnterBack: () => footerLogo.className = 'footer-logo-dynamic about-active',
                onLeaveBack: () => footerLogo.className = 'footer-logo-dynamic'
            }
        });

        gsap.timeline({
            scrollTrigger: {
                trigger: '.services-section', start: 'top center', end: 'bottom center',
                onEnter: () => footerLogo.className = 'footer-logo-dynamic services-active',
                onLeave: () => footerLogo.className = 'footer-logo-dynamic',
                onEnterBack: () => footerLogo.className = 'footer-logo-dynamic services-active',
                onLeaveBack: () => footerLogo.className = 'footer-logo-dynamic'
            }
        });
    }

    // Animações do conteúdo do footer
    gsap.from('.footer-title', {
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: 'power3.out'
    });

    gsap.from('.footer-address', {
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: 'power2.out'
    });

    gsap.from('.footer-room', {
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'top 50%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.5,
        duration: 1.5,
        delay: 0.6,
        ease: 'back.out(1.2)'
    });

    // ====================================
    // Button Hover Effects
    // ====================================
    
    document.querySelectorAll('.btn-outline, .btn-primary').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                y: -3,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // ====================================
    // Parallax Effects
    // ====================================
    
    // Hero image parallax
    gsap.to('.hero-image', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        ease: 'none'
    });

    // Background parallax for numbers section
    gsap.to('.numbers-bg', {
        scrollTrigger: {
            trigger: '.numbers-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -50,
        ease: 'none'
    });

    // Footer background parallax
    gsap.to('.footer-bg img', {
        scrollTrigger: {
            trigger: '.footer-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        y: -80,
        ease: 'none'
    });

    // ====================================
    // Localização - Animações de entrada
    // ====================================
    gsap.from('.localizacao-title', {
        scrollTrigger: { trigger: '.localizacao-section', start: 'top 70%', toggleActions: 'play none none reverse' },
        opacity: 0, x: -60, duration: 1, ease: 'power3.out'
    });
    gsap.from('.localizacao-cta', {
        scrollTrigger: { trigger: '.localizacao-section', start: 'top 65%', toggleActions: 'play none none reverse' },
        opacity: 0, y: 20, duration: 0.8, delay: 0.2, ease: 'power2.out'
    });
    gsap.from(['.localizacao-topbar .brand', '.localizacao-topbar .topline'], {
        scrollTrigger: { trigger: '.localizacao-section', start: 'top 75%', toggleActions: 'play none none reverse' },
        opacity: 0, y: -20, duration: 0.8, stagger: 0.1, ease: 'power2.out'
    });
    gsap.from(['.localizacao-bottom .bottom-line', '.localizacao-bottom .bottom-content'], {
        scrollTrigger: { trigger: '.localizacao-section', start: 'top 55%', toggleActions: 'play none none reverse' },
        opacity: 0, y: 30, duration: 1, stagger: 0.1, ease: 'power2.out'
    });

    // Parallax leve no BG da Localização
    gsap.to('.localizacao-bg img', {
        scrollTrigger: { trigger: '.localizacao-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
        y: -60, ease: 'none'
    });

    // ====================================
    // Footer Panels - transição de cores com pin
    // ====================================
    const footerPanelsPin = document.querySelector('.footer-panels-pin');
    if (footerPanelsPin) {
        const bgColors = ['#DC473B', '#1E2F3C', '#4EC1B6', '#FEE644', '#DC473B'];
        const tlFooter = gsap.timeline({
            scrollTrigger: {
                trigger: '.footer-panels-section',
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                pin: '.footer-panels-pin'
            }
        });
        bgColors.forEach((color, i) => {
            tlFooter.to(footerPanelsPin, { backgroundColor: color, duration: 1 }, i);
        });
    }

    // ====================================
    // Footer Theme - troca de cor por seção (LEGADO, só se existir .footer-section)
    // ====================================
    const footer = document.querySelector('.footer-section');
    if (footer) {
        const setFooterTheme = (theme) => {
            footer.classList.remove('footer-theme-red','footer-theme-teal','footer-theme-dark','footer-theme-yellow');
            footer.classList.add(theme);
        };

        ScrollTrigger.create({
            trigger: '.hero-section', start: 'top center', end: 'bottom center',
            onEnter: () => setFooterTheme('footer-theme-red'), onEnterBack: () => setFooterTheme('footer-theme-red')
        });
        ScrollTrigger.create({
            trigger: '.numbers-section', start: 'top center', end: 'bottom center',
            onEnter: () => setFooterTheme('footer-theme-dark'), onEnterBack: () => setFooterTheme('footer-theme-dark')
        });
        ScrollTrigger.create({
            trigger: '.about-section', start: 'top center', end: 'bottom center',
            onEnter: () => setFooterTheme('footer-theme-teal'), onEnterBack: () => setFooterTheme('footer-theme-teal')
        });
        ScrollTrigger.create({
            trigger: '.services-section', start: 'top center', end: 'bottom center',
            onEnter: () => setFooterTheme('footer-theme-yellow'), onEnterBack: () => setFooterTheme('footer-theme-yellow')
        });
        ScrollTrigger.create({
            trigger: '.localizacao-section', start: 'top center', end: 'bottom center',
            onEnter: () => setFooterTheme('footer-theme-red'), onEnterBack: () => setFooterTheme('footer-theme-red')
        });
    }

    console.log('All GSAP animations initialized ✅');
});
