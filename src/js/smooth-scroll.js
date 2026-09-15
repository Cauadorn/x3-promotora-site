import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { reduceMotion } from './utils.js';

gsap.registerPlugin(ScrollTrigger);

/** Rolagem suave sincronizada com o ScrollTrigger. Retorna `null` com movimento reduzido. */
export function initSmoothScroll() {
  if (reduceMotion) return null;

  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
