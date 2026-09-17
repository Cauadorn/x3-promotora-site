import { gsap } from 'gsap';
import { initSmoothScroll } from './js/smooth-scroll.js';
import { initNav } from './js/nav.js';
import { initPointerEffects } from './js/pointer-effects.js';
import { initBrazilMap } from './js/brazil-map.js';
import { initReveals } from './js/scroll-animations.js';
import { initPartnerForm } from './js/partner-form.js';
import { reduceMotion } from './js/utils.js';

document.documentElement.classList.add('js');

const lenis = initSmoothScroll();
initNav(lenis);
initPointerEffects();
initBrazilMap();
initPartnerForm();
initReveals();

// entrada do hero
if (!reduceMotion) {
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.nav__inner', { y: -30, opacity: 0, duration: 1 }, 0)
    .from('[data-intro]', { y: 28, opacity: 0, duration: 1.1, stagger: 0.09 }, 0.1)
    .from('.phero__frame', { clipPath: 'inset(8% 8% 8% 8% round 28px)', scale: 1.05, duration: 1.6 }, 0.1)
    .from('.phero__card', { y: 30, opacity: 0, duration: 1.1, stagger: 0.15 }, 0.6);
}
