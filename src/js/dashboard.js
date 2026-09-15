import { $, $$, reduceMotion, wait, whenVisible } from './utils.js';

const STATUS_LABELS = ['Digitada', 'Em análise', 'Higienizada', 'Averbada'];
const SAMPLE_CPFS = ['***.482.391-**', '***.107.655-**', '***.930.214-**'];

/** Simulação do Full Consig: digita CPF, avança etapas e alterna status das propostas. */
export function initDashboard() {
  const root = $('.dash');
  const typing = $('#dashTyping');
  if (!root || !typing) return;

  const steps = $$('#dashPipe .pipe__step');
  const progress = $('#dashPipe .pipe__line span');
  const pills = $$('#dashList .pill');
  let running = false;
  let tick = 0;

  const typeText = (text) => new Promise((resolve) => {
    let i = 0;
    typing.textContent = '';
    const timer = setInterval(() => {
      typing.textContent = text.slice(0, ++i);
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, reduceMotion ? 0 : 55);
  });

  const setStep = (n) => {
    steps.forEach((step, i) => step.classList.toggle('is-done', i < n));
    progress.style.transform = `scaleX(${Math.max(0, (n - 1) / (steps.length - 1))})`;
  };

  const advancePill = () => {
    const pill = pills[tick % pills.length];
    const next = (Number(pill.dataset.s) + 1) % STATUS_LABELS.length;
    pill.dataset.s = next;
    pill.textContent = STATUS_LABELS[next];
    pill.classList.remove('is-flash');
    void pill.offsetWidth; // reinicia a animação
    pill.classList.add('is-flash');
    tick++;
  };

  const cycle = async () => {
    setStep(0);
    await typeText(SAMPLE_CPFS[tick % SAMPLE_CPFS.length]);
    for (let n = 1; n <= steps.length; n++) {
      await wait(650);
      setStep(n);
    }
    advancePill();
  };

  const run = async () => {
    if (running) return;
    running = true;
    while (running) {
      await cycle();
      await wait(1400);
    }
  };

  whenVisible(root, { onEnter: run, onLeave: () => { running = false; } });
}
