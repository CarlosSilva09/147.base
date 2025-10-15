// Importações principais do GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";
import { Flip } from "gsap/Flip";

// Registrar plugins
gsap.registerPlugin(
    ScrollTrigger,
    TextPlugin,
    MotionPathPlugin,
    MorphSVGPlugin,
    DrawSVGPlugin,
    SplitText,
    Draggable,
    InertiaPlugin,
    ScrollToPlugin,
    Observer,
    Flip
);

// Exportar GSAP e plugins para uso global
export {
    gsap,
    ScrollTrigger,
    TextPlugin,
    MotionPathPlugin,
    MorphSVGPlugin,
    DrawSVGPlugin,
    SplitText,
    Draggable,
    InertiaPlugin,
    ScrollToPlugin,
    Observer,
    Flip
};

// ====================================
// HERO ANIMATIONS - simples e diretas
// ====================================
gsap.from('.hero-title', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.3
});

gsap.from('.hero-147-logo', {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)',
    delay: 0.6
});

gsap.from('.hero-image', {
    x: 100,
    opacity: 0,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.4
});

gsap.from('.hero-circle', {
    scale: 0,
    opacity: 0,
    duration: 0.8,
    ease: 'back.out(2)',
    delay: 0.8
});

// ====================================
// NUMBERS SECTION - entrada suave
// ====================================
if (document.querySelector('.numbers-section')) {
    // Header
    gsap.from('.numbers-section .section-label', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.numbers-section',
            start: 'top 70%',
            toggleActions: 'play none none none'
        }
    });

    // Cards aparecem em sequência
    gsap.from('.stat-item', {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.stats-grid',
            start: 'top 75%',
            toggleActions: 'play none none none'
        }
    });

    // Watermark parallax
    gsap.to('.numbers-watermark', {
        xPercent: -15,
        ease: 'none',
        scrollTrigger: {
            trigger: '.numbers-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });
}