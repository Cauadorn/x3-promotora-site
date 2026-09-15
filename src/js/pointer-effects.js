import { $, $$, reduceMotion, finePointer } from './utils.js';

/** Spotlight nos cards, botões magnéticos e parallax dos cards flutuantes do hero. */
export function initPointerEffects() {
  $$('[data-spot]').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      el.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });

  if (reduceMotion || !finePointer) return;

  $$('.btn--primary, .btn--light').forEach((btn) => {
    btn.addEventListener('pointermove', (event) => {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--bx', `${((event.clientX - rect.left) / rect.width - 0.5) * 10}px`);
      btn.style.setProperty('--by', `${((event.clientY - rect.top) / rect.height - 0.5) * 8}px`);
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.setProperty('--bx', '0px');
      btn.style.setProperty('--by', '0px');
    });
  });

  const hero = $('.hero');
  const floats = $$('.fc');
  hero?.addEventListener('pointermove', (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    floats.forEach((card) => {
      const depth = Number(card.dataset.depth) || 10;
      card.style.transform = `translate(${x * -depth}px, ${y * -depth}px)`;
    });
  });
}
