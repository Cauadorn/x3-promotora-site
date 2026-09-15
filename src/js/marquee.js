import { $, reduceMotion } from './utils.js';

/** Duplica a faixa de bancos para o loop infinito ficar contínuo. */
export function initMarquee() {
  const track = $('.marquee__track');
  if (!track || reduceMotion) return;
  const clone = [...track.children].map((item) => {
    const copy = item.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    return copy;
  });
  track.append(...clone);
}
