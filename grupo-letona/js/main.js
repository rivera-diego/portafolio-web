document.addEventListener('DOMContentLoaded', () => {
  // --- Active Nav Link and Scroll Themes ---
  const currentPath = window.location.pathname;
  const navLinksList = document.querySelectorAll('.nav-links a');
  const header = document.querySelector('header');
  
  // Identify page to apply proper scroll classes
  let isDarkHeroPage = false;
  if (currentPath.includes('index.html') || currentPath.endsWith('/')) {
    isDarkHeroPage = true;
    header.classList.add('dark-theme');
  } else {
    header.classList.add('light-theme');
  }

  navLinksList.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.includes(href) && href !== '') {
      link.classList.add('active');
    } else if (currentPath.endsWith('/') && href === 'index.html') {
      link.classList.add('active');
    }
  });

  // --- Scroll Actions ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      if (isDarkHeroPage) {
        header.classList.add('scrolled-dark');
      } else {
        header.classList.add('scrolled');
      }
    } else {
      header.classList.remove('scrolled-dark', 'scrolled');
    }
  });

  // --- Mobile Navigation Drawer Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      const span1 = menuToggle.children[0];
      const span2 = menuToggle.children[1];
      const span3 = menuToggle.children[2];
      
      // Determine active color for spans on toggle
      const activeColor = '#FFFFFF';
      
      if (navLinks.classList.contains('active')) {
        span1.style.transform = 'rotate(45deg) translate(5px, 5px)';
        span1.style.backgroundColor = activeColor;
        span2.style.opacity = '0';
        span3.style.transform = 'rotate(-45deg) translate(5px, -5px)';
        span3.style.backgroundColor = activeColor;
      } else {
        span1.style.transform = 'none';
        span1.style.backgroundColor = '';
        span2.style.opacity = '1';
        span3.style.transform = 'none';
        span3.style.backgroundColor = '';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const span1 = menuToggle.children[0];
        const span2 = menuToggle.children[1];
        const span3 = menuToggle.children[2];
        span1.style.transform = 'none';
        span1.style.backgroundColor = '';
        span2.style.opacity = '1';
        span3.style.transform = 'none';
        span3.style.backgroundColor = '';
      });
    });
  }

  // --- Blog Filters & Search (blog.html) ---
  const blogCards = document.querySelectorAll('.blog-card');
  const blogFilters = document.querySelectorAll('.blog-filter-btn');
  const blogSearch = document.querySelector('.blog-search-bar');
  const blogNoResults = document.querySelector('.blog-no-results');

  if (blogCards.length > 0) {
    let currentCategory = 'all';
    let searchQuery = '';

    const filterArticles = () => {
      let visibleArticles = 0;

      blogCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const title = card.querySelector('h3').textContent.toLowerCase();
        const snippet = card.querySelector('p').textContent.toLowerCase();
        const tag = card.querySelector('.blog-card-meta').textContent.toLowerCase();

        const matchesCategory = currentCategory === 'all' || category === currentCategory;
        const matchesSearch = title.includes(searchQuery) || snippet.includes(searchQuery) || tag.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          visibleArticles++;
        } else {
          card.style.display = 'none';
        }
      });

      if (blogNoResults) {
        if (visibleArticles === 0) {
          blogNoResults.style.display = 'block';
        } else {
          blogNoResults.style.display = 'none';
        }
      }
    };

    blogFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        blogFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.getAttribute('data-filter');
        filterArticles();
      });
    });

    if (blogSearch) {
      blogSearch.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterArticles();
      });
    }
  }

  // --- Zoom Diagnostic Booking Form (contacto.html) ---
  const bookingForm = document.getElementById('booking-form');

  if (bookingForm) {
    // Automatically pre-fill service if navigated from services page
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const commentsArea = document.getElementById('comments');

    if (serviceParam && commentsArea) {
      const servicesMap = {
        'tributario': 'Planeamiento Tributario Estratégico',
        'contable': 'Outsourcing Contable Completo',
        'auditoria': 'Auditoría Preventiva y Financiera'
      };
      commentsArea.value = `Deseo agendar la asesoría de diagnóstico enfocada en: ${servicesMap[serviceParam] || serviceParam}.`;
    }

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect data
      const fullname = document.getElementById('fullname').value.trim();
      const company = document.getElementById('company').value.trim();
      const ruc = document.getElementById('ruc').value.trim();
      const industry = document.getElementById('industry').value.trim();
      const revenue = document.getElementById('revenue').value;
      const proposedDate = document.getElementById('proposed-date').value;
      const proposedTime = document.getElementById('proposed-time').value;
      const comments = document.getElementById('comments').value.trim();

      // Formulate confirmation message
      let msg = `*SOLICITUD DE ASESORÍA DE DIAGNÓSTICO (15 MIN - ZOOM)*\n\n`;
      msg += `*Representante:* ${fullname}\n`;
      msg += `*Empresa:* ${company}\n`;
      msg += `*RUC:* ${ruc}\n`;
      msg += `*Rubro:* ${industry}\n`;
      msg += `*Facturación anual:* ${revenue}\n`;
      msg += `*Fecha sugerida:* ${proposedDate}\n`;
      msg += `*Hora sugerida:* ${proposedTime}\n`;
      if (comments) {
        msg += `*Detalle adicional:* ${comments}\n`;
      }

      // Partner scheduling WhatsApp number (simulated Lima +51)
      const partnerPhone = '51999777666';

      // Show professional notification dialog
      alert(`Su solicitud de diagnóstico para ${company} ha sido recibida.\n\nA continuación, le redirigiremos al chat corporativo del socio asignado para confirmar el enlace de Zoom para el día ${proposedDate} a las ${proposedTime}.`);

      // Redirect
      const encodedMsg = encodeURIComponent(msg);
      window.open(`https://api.whatsapp.com/send?phone=${partnerPhone}&text=${encodedMsg}`, '_blank');

      // Reset
      bookingForm.reset();
    });
  }
});
