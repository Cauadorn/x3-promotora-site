export const $ = (selector, context = document) => context.querySelector(selector);
export const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = window.matchMedia('(pointer: fine)').matches;

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Executa `onEnter`/`onLeave` quando o elemento entra/sai da viewport. */
export function whenVisible(el, { onEnter, onLeave, threshold = 0.25 } = {}) {
  if (!el) return;
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) onEnter?.();
    else onLeave?.();
  }, { threshold }).observe(el);
}
