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

    // Estatísticas - layout direto
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
    // Services Section - Card Animations
    // ====================================
    
    gsap.from('.services-section .section-label', {
        scrollTrigger: {
            trigger: '.services-section',
            start: 'top 70%',
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
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'power2.out'
    });

    // Service cards animations
    const serviceCards = gsap.utils.toArray('.service-card');
    serviceCards.forEach((card, index) => {
        // Initial entrance animation
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -150,
            duration: 1,
            delay: index * 0.2,
            ease: 'power3.out'
        });

        // Card number animation
        const cardNumber = card.querySelector('.card-number');
        gsap.from(cardNumber, {
            scrollTrigger: {
                trigger: card,
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0,
            rotation: 180,
            duration: 0.8,
            delay: index * 0.2 + 0.3,
            ease: 'back.out(1.7)'
        });

        // Card image animation
        const cardImage = card.querySelector('.card-image');
        if (cardImage) {
            gsap.from(cardImage, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 75%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                x: 100,
                scale: 0.8,
                duration: 1,
                delay: index * 0.2 + 0.4,
                ease: 'power2.out'
            });
        }

        // Advanced hover effect
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                x: 30,
                scale: 1.02,
                boxShadow: '0px 8px 48px rgba(0, 0, 0, 0.24)',
                duration: 0.4,
                ease: 'power2.out'
            });

            gsap.to(cardNumber, {
                scale: 1.1,
                color: '#DC473B',
                duration: 0.3,
                ease: 'back.out(1.7)'
            });

            if (cardImage) {
                gsap.to(cardImage, {
                    scale: 1.05,
                    rotation: 2,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                x: 0,
                scale: 1,
                boxShadow: '0px 4px 32px rgba(0, 0, 0, 0.16)',
                duration: 0.4,
                ease: 'power2.out'
            });

            gsap.to(cardNumber, {
                scale: 1,
                color: '#1E2F3C',
                duration: 0.3,
                ease: 'power2.out'
            });

            if (cardImage) {
                gsap.to(cardImage, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            }
        });
    });

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
