document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.site-nav');
  const navToggle = document.querySelector('.site-nav__toggle');
  const navLinks = document.querySelector('.site-nav__links');

  const closeMenu = () => {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('is-open');
  };

  if (nav && window.scrollY > 40) {
    nav.classList.add('is-scrolled');
  }

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', event => {
      if (!nav.contains(event.target)) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealElements.forEach(element => revealObserver.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('is-visible'));
  }

  document.querySelectorAll('.project-card, .glow-panel, .secondary-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    });
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('[data-category]');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;

        filterButtons.forEach(item => {
          const active = item === button;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-pressed', String(active));
        });

        projectCards.forEach(card => {
          const categories = card.dataset.category.split(' ');
          const visible = filter === 'all' || categories.includes(filter);
          card.classList.toggle('is-hidden', !visible);
        });
      });
    });
  }

  document.querySelectorAll('[data-current-year]').forEach(element => {
    element.textContent = new Date().getFullYear();
  });

});
