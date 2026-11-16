document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('is-ready');
  const english = document.documentElement.lang === 'en';
  const label = (es, en) => english ? en : es;
  document.querySelectorAll('.language-switcher a').forEach(link => {
    // Both versions retain the same section IDs. Keep the current section.
    link.addEventListener('click', () => {
      if (location.hash) link.hash = location.hash;
    });
  });
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.site-nav__toggle');
  const menu = document.querySelector('.site-nav__links');
  function closeMenu(restoreFocus = false) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', label('Abrir menú', 'Open menu'));
    toggle.classList.remove('is-open');
    menu.classList.remove('is-open');
    if (restoreFocus) toggle.focus();
  }
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? label('Cerrar menú', 'Close menu') : label('Abrir menú', 'Open menu'));
      toggle.classList.toggle('is-open', open);
      menu.classList.toggle('is-open', open);
    });
    menu.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true); });
    document.addEventListener('click', e => { if (nav && !nav.contains(e.target)) closeMenu(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 700) closeMenu(); }, { passive: true });
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion = false;
  try { savedMotion = localStorage.getItem('portfolio-motion') === 'off'; } catch {}
  let motionOff = reduced.matches || savedMotion;
  const motionButton = document.querySelector('.motion-toggle') || document.createElement('button');
  motionButton.hidden = false;
  motionButton.className = 'motion-toggle';
  motionButton.type = 'button';
  if (!motionButton.isConnected) document.querySelector('.site-footer__links')?.append(motionButton);
  function syncMotion() {
    document.documentElement.classList.toggle('motion-off', motionOff);
    document.dispatchEvent(new Event('portfolio:motion'));
    motionButton.setAttribute('aria-pressed', String(motionOff));
    motionButton.setAttribute('aria-label', motionOff ? label('Activar efectos de movimiento', 'Enable motion effects') : label('Pausar efectos de movimiento', 'Pause motion effects'));
    motionButton.title = motionButton.getAttribute('aria-label');
    motionButton.innerHTML = motionOff
      ? '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>'
      : '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14"/></svg>';
    const motionText = document.createElement('span');
    motionText.textContent = motionOff ? label('Activar animaciones', 'Enable animations') : label('Pausar animaciones', 'Pause animations');
    motionButton.append(motionText);
  }
  syncMotion();
  motionButton.addEventListener('click', () => {
    motionOff = !motionOff;
    savedMotion = motionOff;
    try { localStorage.setItem('portfolio-motion', motionOff ? 'off' : 'on'); } catch {}
    syncMotion();
    updateField();
  });
  reduced.addEventListener('change', e => {
    motionOff = e.matches || savedMotion;
    syncMotion();
    updateField();
  });

  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  if (filters.length && cards.length) {
    const status = document.createElement('p');
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');
    document.querySelector('.project-grid')?.before(status);
    filters.forEach(button => button.addEventListener('click', () => {
      let visible = 0;
      filters.forEach(item => {
        const active = item === button;
        item.setAttribute('aria-pressed', String(active));
        item.classList.toggle('is-active', active);
      });
      cards.forEach(card => {
        const show = button.dataset.filter === 'all' || card.dataset.category.split(' ').includes(button.dataset.filter);
        card.hidden = !show;
        card.classList.toggle('is-hidden', !show);
        if (show) visible++;
      });
      const noun = visible === 1 ? label('proyecto', 'project') : label('proyectos', 'projects');
      status.textContent = `${visible} ${noun} ${label('en', 'in')} ${button.textContent.trim()}.`;
    }));
  }
  document.querySelectorAll('[data-current-year]').forEach(e => { e.textContent = new Date().getFullYear(); });

  // A finite spring response: the field stops drawing when the pixels settle.
  const canvas = document.querySelector('.pixel-field');
  const stage = document.querySelector('.studio-hero');
  const art = document.querySelector('.hero-art img');
  const ctx = canvas?.getContext('2d');
  let points = [], frame = 0, width = 0, height = 0, inView = true;
  let mouse = { x: -1000, y: -1000 };
  function drawField() {
    frame = 0;
    if (!ctx || !inView || document.hidden) return;
    ctx.clearRect(0, 0, width, height);
    let unsettled = false;
    for (const p of points) {
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const distance = Math.hypot(dx, dy);
      const force = !motionOff && distance < 170 ? (1 - distance / 170) : 0;
      const tx = p.x + dx * force * .28, ty = p.y + dy * force * .28;
      p.rx += (tx - p.rx) * .12;
      p.ry += (ty - p.ry) * .12;
      if (Math.abs(tx - p.rx) + Math.abs(ty - p.ry) > .1) unsettled = true;
      ctx.fillStyle = `rgba(200,155,110,${p.alpha + force * .5})`;
      const size = p.size + force * 3;
      ctx.fillRect(p.rx, p.ry, size, size);
    }
    if (unsettled && !motionOff) frame = requestAnimationFrame(drawField);
  }
  function updateField() {
    if (!ctx) return;
    if (motionOff) {
      mouse = { x: -1000, y: -1000 };
      points.forEach(p => { p.rx = p.x; p.ry = p.y; });
      art?.style.removeProperty('--art-x');
      art?.style.removeProperty('--art-y');
    }
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(drawField);
  }
  function resizeField() {
    if (!ctx || !stage) return;
    width = stage.clientWidth; height = stage.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
    for (let y = 12; y < height; y += 27) for (let x = 12; x < width; x += 27) {
      const seed = Math.abs(Math.sin(x * 12.9898 + y * 78.233));
      if (seed > .83) points.push({x,y,rx:x,ry:y,size:seed > .98 ? 4 : 2,alpha:.05 + seed * .11});
    }
    updateField();
  }
  if (ctx && stage) {
    new ResizeObserver(resizeField).observe(stage);
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (inView) updateField();
      else { cancelAnimationFrame(frame); frame = 0; }
    }).observe(stage);
    stage.addEventListener('pointermove', e => {
      if (motionOff || e.pointerType !== 'mouse') return;
      const box = stage.getBoundingClientRect();
      mouse = { x: e.clientX - box.left, y: e.clientY - box.top };
      if (art) {
        art.style.setProperty('--art-y', `${(mouse.x / width - .5) * 7}deg`);
        art.style.setProperty('--art-x', `${(.5 - mouse.y / height) * 5}deg`);
      }
      if (!frame) frame = requestAnimationFrame(drawField);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
      mouse = { x: -1000, y: -1000 };
      art?.style.removeProperty('--art-x'); art?.style.removeProperty('--art-y');
      if (!frame) frame = requestAnimationFrame(drawField);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else updateField();
    });
  }
});
