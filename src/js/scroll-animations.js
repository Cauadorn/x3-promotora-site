import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { $$, reduceMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

/** Elementos com data-reveal entram em lote ao aparecer na tela (usado em todas as páginas). */
export function initReveals() {
  window.addEventListener('load', () => ScrollTrigger.refresh());
  if (reduceMotion) return;

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) => gsap.fromTo(els, { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });
  gsap.set('[data-reveal]', { opacity: 0 });
}

/** Home: reveals + parallax e animações atreladas à rolagem. */
export function initScrollAnimations() {
  initReveals();
  if (reduceMotion) return;

  // hero: parallax da imagem e saída do conteúdo
  gsap.to('.hero__media', {
    yPercent: 14, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
  });
  gsap.to('.hero__content', {
    yPercent: -12, opacity: 0.2, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true },
  });

  // Crédito CLT: máscara que abre + parallax da foto
  gsap.fromTo('.clt__frame img', { yPercent: -10 }, {
    yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.clt', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.fromTo('.clt__frame', { clipPath: 'inset(12% 12% 12% 12% round 28px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 28px)', ease: 'none',
    scrollTrigger: { trigger: '.clt__media', start: 'top 90%', end: 'center 55%', scrub: true },
  });

  // ícones 3D das soluções flutuam com a rolagem
  $$('.pcard__ico').forEach((icon) => {
    gsap.fromTo(icon, { y: 30, rotate: 6 }, {
      y: -20, rotate: -4, ease: 'none',
      scrollTrigger: { trigger: icon.closest('.pcard'), start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // dashboard entra inclinado
  gsap.from('.dash__win', {
    rotateY: -24, rotateX: 12, y: 60, duration: 1.6, ease: 'expo.out',
    scrollTrigger: { trigger: '.dash', start: 'top 80%' },
  });

  // CTA: marca X3 ao fundo cresce
  gsap.fromTo('.cta__mark', { scale: 0.7, rotate: -6 }, {
    scale: 1.1, rotate: 0, ease: 'none',
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.fromTo('.cta__beam', { scale: 0.6, opacity: 0.4 }, {
    scale: 1.2, opacity: 1, ease: 'none',
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'center center', scrub: true },
  });
}
