document.addEventListener('DOMContentLoaded', () => {
  // --- Highlight Active Nav Link ---
  const currentPath = window.location.pathname;
  const navLinksList = document.querySelectorAll('.nav-links a');
  
  navLinksList.forEach(link => {
    // Check if the link's href matches the current page
    const href = link.getAttribute('href');
    if (currentPath.includes(href) && href !== '') {
      link.classList.add('active');
    } else if (currentPath.endsWith('/') && href === 'index.html') {
      link.classList.add('active');
    }
  });

  // --- Sticky Header Scroll ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Drawer Toggle ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      
      // Animate hamburger lines
      const span1 = menuToggle.children[0];
      const span2 = menuToggle.children[1];
      const span3 = menuToggle.children[2];
      
      if (navLinks.classList.contains('active')) {
        span1.style.transform = 'rotate(45deg) translate(6px, 6px)';
        span2.style.opacity = '0';
        span3.style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        span1.style.transform = 'none';
        span2.style.opacity = '1';
        span3.style.transform = 'none';
      }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const span1 = menuToggle.children[0];
        const span2 = menuToggle.children[1];
        const span3 = menuToggle.children[2];
        span1.style.transform = 'none';
        span2.style.opacity = '1';
        span3.style.transform = 'none';
      });
    });
  }

  // --- Course Filter and Live Search (cursos.html) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('.search-bar');
  const courseCards = document.querySelectorAll('.curso-card');
  const noResults = document.querySelector('.no-results');

  if (courseCards.length > 0) {
    let currentCategory = 'all';
    let searchQuery = '';

    // Parse URL parameter to auto-filter on load
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    if (filterParam) {
      const activeFilterBtn = document.querySelector(`.filter-btn[data-filter="${filterParam}"]`);
      if (activeFilterBtn) {
        filterButtons.forEach(b => b.classList.remove('active'));
        activeFilterBtn.classList.add('active');
        currentCategory = filterParam;
      }
    }

    const filterCourses = () => {
      let visibleCount = 0;

      courseCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const cardTitle = card.querySelector('h3').textContent.toLowerCase();
        const cardDesc = card.querySelector('p').textContent.toLowerCase();
        
        const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
        const matchesSearch = cardTitle.includes(searchQuery) || cardDesc.includes(searchQuery);

        if (matchesCategory && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResults) {
        if (visibleCount === 0) {
          noResults.style.display = 'block';
        } else {
          noResults.style.display = 'none';
        }
      }
    };

    // Filter Buttons Listener
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle Active Class
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        currentCategory = btn.getAttribute('data-filter');
        filterCourses();
      });
    });

    // Search Input Listener
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterCourses();
      });
    }
  }

  // --- FAQ Accordion (contacto.html) ---
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Pre-Registration Form WhatsApp Redirect (contacto.html) ---
  const contactForm = document.getElementById('enrollment-form');
  
  if (contactForm) {
    // Parse URL parameters to auto-fill form input values
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course');
    const programParam = urlParams.get('program');

    const typeSelect = document.getElementById('program-type');
    const nameInput = document.getElementById('program-name');

    if (courseParam && nameInput && typeSelect) {
      typeSelect.value = 'curso';
      const courseMap = {
        'excel': 'Excel Profesional y Empresarial',
        'barberia': 'Barbería y Estética Masculina',
        'globos': 'Diseño y Decoración con Globos',
        'manicura': 'Manicura y Uñas Acrílicas',
        'computacion': 'Computación Básica e Internet',
        'disenografico': 'Diseño Gráfico Publicitario'
      };
      nameInput.value = courseMap[courseParam] || courseParam;
    } else if (programParam && nameInput && typeSelect) {
      typeSelect.value = 'carrera';
      const programMap = {
        'gastronomia': 'Gastronomía y Arte Culinario',
        'computacion': 'Computación e Informática'
      };
      nameInput.value = programMap[programParam] || programParam;
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get Form fields
      const fullname = document.getElementById('fullname').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const programType = document.getElementById('program-type').value;
      const programName = document.getElementById('program-name').value.trim();
      const shift = document.getElementById('shift').value;
      const message = document.getElementById('message').value.trim();
      
      // Validation Check (Basic check since HTML handles most)
      if (!fullname || !phone || !programName) {
        alert('Por favor, rellene todos los campos obligatorios (*).');
        return;
      }
      
      // Copernico registry office WhatsApp phone number (simulated Lima country code +51)
      const registryPhone = '51999888777'; // Simulated official number
      
      // Build text message for registry
      let textMessage = `*SOLICITUD DE INSCRIPCIÓN - COPÉRNICO*\n\n`;
      textMessage += `*Estudiante:* ${fullname}\n`;
      textMessage += `*Teléfono:* ${phone}\n`;
      textMessage += `*Tipo de programa:* ${programType === 'carrera' ? 'Carrera Profesional' : 'Curso Corto'}\n`;
      textMessage += `*Programa solicitado:* ${programName}\n`;
      textMessage += `*Turno de preferencia:* ${shift.toUpperCase()}\n`;
      if (message) {
        textMessage += `*Consulta adicional:* ${message}\n`;
      }
      
      // Encode URI
      const encodedText = encodeURIComponent(textMessage);
      const whatsappURL = `https://api.whatsapp.com/send?phone=${registryPhone}&text=${encodedText}`;
      
      // Open in new tab
      window.open(whatsappURL, '_blank');
      
      // Reset form
      contactForm.reset();
    });
  }
});
