import { initSmoothScroll } from './js/smooth-scroll.js';
import { initNav } from './js/nav.js';
import { initPointerEffects } from './js/pointer-effects.js';
import { initMarquee } from './js/marquee.js';
import { initBrazilMap } from './js/brazil-map.js';
import { initIntro } from './js/intro.js';
import { initScrollAnimations } from './js/scroll-animations.js';
import { initDashboard } from './js/dashboard.js';

document.documentElement.classList.add('js');

const lenis = initSmoothScroll();
initNav(lenis);
initPointerEffects();
initMarquee();
initBrazilMap(); // antes do intro: sincroniza os contadores de presença
initIntro();
initScrollAnimations();
initDashboard();
