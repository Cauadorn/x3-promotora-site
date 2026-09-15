import { gsap } from 'gsap';
import { $, $$, reduceMotion, wait } from './utils.js';

const MIN_PRELOADER_MS = 900;
const MAX_PRELOADER_MS = 3500;

function countUp(el) {
  const end = Number(el.dataset.count);
  if (reduceMotion) {
    el.textContent = end;
    return;
  }
  const start = performance.now();
  const duration = 1600;
  const step = (now) => {
    const progress = Math.min(1, (now - start) / duration);
    el.textContent = Math.round(end * (1 - Math.pow(1 - progress, 3)));
    if (progress < 1) requestAnimationFrame(step);
  };
  el.textContent = '0';
  requestAnimationFrame(step);
}

function playHero() {
  $$('[data-count]').forEach(countUp);
  if (reduceMotion) return;

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .from('.hero__img', { scale: 1.18, duration: 2.4, ease: 'power3.out' }, 0)
    .from('.hero__title .line > span', { yPercent: 115, duration: 1.3, stagger: 0.12 }, 0.1)
    .from('[data-hero]', { y: 24, opacity: 0, duration: 1.1, stagger: 0.1 }, 0.35)
    .from('.fc', { y: 40, opacity: 0, scale: 0.92, duration: 1.2, stagger: 0.15 }, 0.7)
    .from('.hero__stats .stat', { y: 20, opacity: 0, duration: 1, stagger: 0.08 }, 0.6)
    .from('.nav__inner', { y: -30, opacity: 0, duration: 1 }, 0.2);
}

/** Preloader com o logo → animação de entrada do hero. */
export function initIntro() {
  const preloader = $('.preloader');
  const heroImg = $('.hero__img');
  let done = false;

  const finish = () => {
    if (done) return;
    done = true;
    if (!preloader) return playHero();
    if (reduceMotion) {
      preloader.remove();
      return playHero();
    }
    gsap.to(preloader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'expo.inOut',
      delay: 0.15,
      onStart: playHero,
      onComplete: () => preloader.remove(),
    });
  };

  const imageReady = !heroImg || heroImg.complete
    ? Promise.resolve()
    : new Promise((resolve) => {
      heroImg.addEventListener('load', resolve, { once: true });
      heroImg.addEventListener('error', resolve, { once: true });
    });

  Promise.all([wait(reduceMotion ? 0 : MIN_PRELOADER_MS), imageReady]).then(finish);
  setTimeout(finish, MAX_PRELOADER_MS); // segurança caso a imagem demore
}
