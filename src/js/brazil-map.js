import brazil from '@svg-maps/brazil';
import { gsap } from 'gsap';
import { $, $$, reduceMotion, whenVisible } from './utils.js';
import {
  ACTIVE_STATES,
  INITIAL_STATE,
  CONNECTIONS,
  MARKER_OFFSETS,
  STATUS_COPY,
  AUTO_CYCLE_MS,
  RESUME_AFTER_MS,
  REGIONS,
} from '../data/presence.js';

const NS = 'http://www.w3.org/2000/svg';

/** Mapa interativo: estados, conexões, marcadores, tooltip, painel e ciclo automático. */
export function initBrazilMap() {
  const svg = $('#brMap');
  const wrap = $('#mapWrap');
  if (!svg || !wrap) return;

  syncCounters();

  const gStates = $('#brStates');
  const gLinks = $('#brLinks');
  const gNodes = $('#brNodes');
  const tip = $('#mapTip');
  const panel = $('.hud__panel');
  const isActive = (id) => ACTIVE_STATES.includes(id);

  svg.setAttribute('viewBox', brazil.viewBox);

  // estados
  const paths = {};
  brazil.locations.forEach(({ id, name, path }) => {
    const el = document.createElementNS(NS, 'path');
    el.setAttribute('d', path);
    el.setAttribute('class', `st${isActive(id) ? ' is-active' : ''}`);
    el.setAttribute('tabindex', isActive(id) ? '0' : '-1');
    el.setAttribute('aria-label', name);
    el.dataset.uf = id;
    el.dataset.name = name;
    gStates.appendChild(el);
    paths[id] = el;
  });

  // centro de cada estado (para marcadores e conexões)
  const centers = {};
  Object.entries(paths).forEach(([id, el]) => {
    const box = el.getBBox();
    const [dx, dy] = MARKER_OFFSETS[id] || [0, 0];
    centers[id] = [box.x + box.width / 2 + dx, box.y + box.height / 2 + dy];
  });

  // conexões curvas com "pacotes" de dados percorrendo a linha
  CONNECTIONS.forEach(([a, b], i) => {
    const [x1, y1] = centers[a];
    const [x2, y2] = centers[b];
    const bend = 0.22;
    const cx = (x1 + x2) / 2 - (y2 - y1) * bend;
    const cy = (y1 + y2) / 2 + (x2 - x1) * bend;

    const line = document.createElementNS(NS, 'path');
    line.setAttribute('d', `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`);
    line.setAttribute('class', 'link');
    line.id = `map-link-${i}`;
    gLinks.appendChild(line);

    if (reduceMotion) return;
    const packet = document.createElementNS(NS, 'circle');
    packet.setAttribute('r', '1.8');
    packet.setAttribute('class', 'packet');
    const motion = document.createElementNS(NS, 'animateMotion');
    motion.setAttribute('dur', `${2.4 + (i % 3) * 0.7}s`);
    motion.setAttribute('repeatCount', 'indefinite');
    motion.setAttribute('begin', `${i * 0.35}s`);
    const mpath = document.createElementNS(NS, 'mpath');
    mpath.setAttribute('href', `#map-link-${i}`);
    motion.appendChild(mpath);
    packet.appendChild(motion);
    gLinks.appendChild(packet);
  });

  // marcadores pulsantes
  const nodes = {};
  ACTIVE_STATES.forEach((id, i) => {
    const [x, y] = centers[id];
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'node');
    g.innerHTML = `
      <circle class="node__ring" cx="${x}" cy="${y}" r="7" style="animation-delay:${i * 0.3}s"></circle>
      <circle class="node__core" cx="${x}" cy="${y}" r="3.2"></circle>
      <text class="node__lbl" x="${x + 9}" y="${y + (id === 'df' ? -6 : 3.5)}">${id.toUpperCase()}</text>`;
    gNodes.appendChild(g);
    nodes[id] = g;
  });

  // chips dos estados ativos
  const chipsEl = $('#mapChips');
  ACTIVE_STATES.forEach((id) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip-btn';
    btn.dataset.uf = id;
    btn.innerHTML = `<b>${id.toUpperCase()}</b>${paths[id].dataset.name}`;
    chipsEl.appendChild(btn);
  });
  const chips = $$('.chip-btn', chipsEl);

  // painel lateral
  const field = {
    uf: $('#pUF'),
    name: $('#pName'),
    region: $('#pRegion'),
    status: $('#pStatus'),
    desc: $('#pDesc'),
  };
  Object.values(field).forEach((el) => el.classList.add('hud__swap'));

  let current = null;
  const select = (id) => {
    if (id === current) return;
    current = id;
    const copy = isActive(id) ? STATUS_COPY.active : STATUS_COPY.expansion;

    Object.values(paths).forEach((el) => el.classList.toggle('is-selected', el.dataset.uf === id));
    gStates.appendChild(paths[id]); // traz o estado selecionado para frente
    Object.entries(nodes).forEach(([key, g]) => g.classList.toggle('is-selected', key === id));
    chips.forEach((chip) => chip.classList.toggle('is-on', chip.dataset.uf === id));

    panel.classList.add('is-swapping');
    setTimeout(() => {
      field.uf.textContent = id.toUpperCase();
      field.name.textContent = paths[id].dataset.name;
      field.region.textContent = `Região ${REGIONS[id]}`;
      field.status.classList.toggle('is-off', !isActive(id));
      field.status.querySelector('span').textContent = copy.label;
      field.desc.textContent = copy.description;
      panel.classList.remove('is-swapping');
    }, 220);
  };

  // ciclo automático entre estados ativos
  let autoTimer = null;
  let resumeTimer = null;
  let index = Math.max(0, ACTIVE_STATES.indexOf(INITIAL_STATE));
  const startAuto = () => {
    if (autoTimer || reduceMotion) return;
    autoTimer = setInterval(() => {
      index = (index + 1) % ACTIVE_STATES.length;
      select(ACTIVE_STATES[index]);
    }, AUTO_CYCLE_MS);
  };
  const stopAuto = () => {
    clearInterval(autoTimer);
    autoTimer = null;
  };
  const pick = (id) => {
    stopAuto();
    select(id);
    if (isActive(id)) index = ACTIVE_STATES.indexOf(id);
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAuto, RESUME_AFTER_MS);
  };

  chips.forEach((chip) => chip.addEventListener('click', () => pick(chip.dataset.uf)));

  Object.values(paths).forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = wrap.getBoundingClientRect();
      const copy = isActive(el.dataset.uf) ? STATUS_COPY.active : STATUS_COPY.expansion;
      tip.innerHTML = `<small>${el.dataset.uf.toUpperCase()} · ${copy.tip}</small>${el.dataset.name}`;
      tip.style.left = `${event.clientX - rect.left}px`;
      tip.style.top = `${event.clientY - rect.top}px`;
      tip.classList.add('is-on');
    });
    el.addEventListener('pointerleave', () => tip.classList.remove('is-on'));
    el.addEventListener('click', () => pick(el.dataset.uf));
    el.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        pick(el.dataset.uf);
      }
    });
  });

  select(INITIAL_STATE);

  // desenho do mapa ao entrar na tela
  let drawn = false;
  const drawIn = () => {
    if (drawn || reduceMotion) return;
    drawn = true;
    const all = Object.values(paths);
    all.forEach((el) => {
      const length = el.getTotalLength();
      el.style.strokeDasharray = length;
      el.style.strokeDashoffset = length;
    });
    gsap.set(all, { fillOpacity: 0 });
    gsap.set([gLinks, gNodes], { opacity: 0 });
    gsap.timeline({
      onComplete: () => all.forEach((el) => {
        el.style.strokeDasharray = '';
        el.style.strokeDashoffset = '';
        el.style.fillOpacity = '';
      }),
    })
      .to(all, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut', stagger: 0.03 })
      .to(all, { fillOpacity: 1, duration: 0.8, stagger: 0.015 }, 0.9)
      .to([gLinks, gNodes], { opacity: 1, duration: 0.8 }, 1.6);
  };

  whenVisible(wrap, {
    threshold: 0.3,
    onEnter: () => { drawIn(); startAuto(); },
    onLeave: stopAuto,
  });
}

/** Mantém contadores do site (hero e painel) em sincronia com src/data/presence.js. */
function syncCounters() {
  const activeCount = ACTIVE_STATES.length;
  const regionCount = new Set(ACTIVE_STATES.map((id) => REGIONS[id])).size;
  $$('[data-presence-count]').forEach((el) => {
    el.dataset.count = activeCount;
    el.textContent = activeCount;
  });
  $$('[data-presence-regions]').forEach((el) => {
    el.textContent = regionCount;
  });
}
