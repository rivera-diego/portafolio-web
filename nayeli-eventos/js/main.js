document.addEventListener('DOMContentLoaded', () => {
  // --- Active Nav Link & Scroll Behavior ---
  const currentPath = window.location.pathname;
  const navLinksList = document.querySelectorAll('.nav-links a');
  const header = document.querySelector('header');

  let isDarkHeroPage = false;
  if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.endsWith('nayeli-eventos')) {
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

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      if (isDarkHeroPage) {
        header.classList.remove('dark-theme');
        header.classList.add('light-theme');
      }
    } else {
      header.classList.remove('scrolled');
      if (isDarkHeroPage) {
        header.classList.remove('light-theme');
        header.classList.add('dark-theme');
      }
    }
  });

  // --- Mobile Navigation Menu Drawer ---
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');

      const span1 = menuToggle.children[0];
      const span2 = menuToggle.children[1];
      const span3 = menuToggle.children[2];

      const activeColor = navLinks.classList.contains('active') ? '#FFFFFF' : '';
      
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
  }

  // --- Portfolio Lightbox Modal (portafolio.html) ---
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const portfolioFilters = document.querySelectorAll('.portfolio-filter-btn');
  const lightbox = document.getElementById('portfolio-lightbox');

  if (portfolioCards.length > 0) {
    let activeCards = Array.from(portfolioCards);
    let currentLightboxIdx = 0;

    // Filters logic
    portfolioFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        portfolioFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        activeCards = [];

        portfolioCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (filter === 'all' || cardCat === filter) {
            card.style.display = 'block';
            activeCards.push(card);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Lightbox triggers
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    const updateLightbox = () => {
      const card = activeCards[currentLightboxIdx];
      const imgSrc = card.querySelector('img').getAttribute('src');
      const captionText = card.querySelector('h3').textContent;
      const categoryText = card.querySelector('span').textContent;

      lightboxImg.setAttribute('src', imgSrc);
      lightboxCaption.textContent = `${categoryText} — ${captionText}`;
    };

    portfolioCards.forEach(card => {
      card.addEventListener('click', () => {
        currentLightboxIdx = activeCards.indexOf(card);
        updateLightbox();
        lightbox.classList.add('active');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentLightboxIdx = (currentLightboxIdx - 1 + activeCards.length) % activeCards.length;
        updateLightbox();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentLightboxIdx = (currentLightboxIdx + 1) % activeCards.length;
        updateLightbox();
      });
    }

    // Close on keyboard ESC or clicking background
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
      }
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // --- Catering Accordions (catering.html) ---
  const cateringAccordionItems = document.querySelectorAll('.catering-accordion-item');

  cateringAccordionItems.forEach(item => {
    const accHeader = item.querySelector('.c-acc-header');
    accHeader.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      cateringAccordionItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Furniture Catalog Tags (mobiliario.html) ---
  const furnitureTabBtns = document.querySelectorAll('.furniture-tab-btn');
  const furnitureCards = document.querySelectorAll('.furniture-card');

  if (furnitureTabBtns.length > 0) {
    furnitureTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        furnitureTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        furnitureCards.forEach(card => {
          const cat = card.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Multi-step Quote Estimator (cotizar.html) ---
  const quoteForm = document.getElementById('multi-step-form');
  const steps = document.querySelectorAll('.form-step-content');
  const progressSteps = document.querySelectorAll('.progress-step');
  
  if (quoteForm) {
    let currentStep = 0;

    // Checkbox custom selections
    const choiceBoxes = document.querySelectorAll('.choice-box');
    choiceBoxes.forEach(box => {
      const input = box.querySelector('input[type="checkbox"], input[type="radio"]');
      
      box.addEventListener('click', (e) => {
        if (e.target !== input) {
          input.checked = !input.checked;
          // Trigger change event manually
          input.dispatchEvent(new Event('change'));
        }
      });

      input.addEventListener('change', () => {
        if (input.type === 'radio') {
          // If radio, remove selection from all other radios in group
          const groupName = input.getAttribute('name');
          document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
            r.closest('.choice-box').classList.remove('selected');
          });
        }
        
        if (input.checked) {
          box.classList.add('selected');
        } else {
          box.classList.remove('selected');
        }
      });
    });

    const updateStepView = () => {
      steps.forEach((step, idx) => {
        if (idx === currentStep) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });

      progressSteps.forEach((pStep, idx) => {
        pStep.classList.remove('active', 'completed');
        if (idx === currentStep) {
          pStep.classList.add('active');
        } else if (idx < currentStep) {
          pStep.classList.add('completed');
        }
      });
    };

    // Navigation buttons
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');

    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Validate Step inputs
        const currentInputs = steps[currentStep].querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        currentInputs.forEach(input => {
          if (!input.checkValidity()) {
            input.reportValidity();
            isValid = false;
          }
        });

        if (isValid) {
          currentStep++;
          if (currentStep === 2) {
            calculateEstimate();
          }
          updateStepView();
        }
      });
    });

    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentStep--;
        updateStepView();
      });
    });

    // Estimate Calculator Logic
    const calculateEstimate = () => {
      const guests = parseInt(document.getElementById('guests-count').value) || 50;
      
      // Catering Pricing
      let cateringRate = 0;
      const galaCheck = document.getElementById('cat-gala').checked;
      const buffetCheck = document.getElementById('cat-buffet').checked;
      const cocktailCheck = document.getElementById('cat-cocktail').checked;

      if (galaCheck) cateringRate = 150; // S/. 150 per comensal
      else if (buffetCheck) cateringRate = 100; // S/. 100 per comensal
      else if (cocktailCheck) cateringRate = 50; // S/. 50 per comensal

      // Furniture Pricing
      let furnitureCost = 0;
      const chairsTiffany = document.getElementById('furn-tiffany').checked;
      const chairsCrossback = document.getElementById('furn-crossback').checked;
      const tentCheck = document.getElementById('furn-toldo').checked;
      const ledBarCheck = document.getElementById('furn-led').checked;

      if (chairsTiffany) furnitureCost += guests * 15; // S/. 15 per chair
      if (chairsCrossback) furnitureCost += guests * 18; // S/. 18 per chair
      if (tentCheck) furnitureCost += 3500; // S/. 3500 flat tent rate
      if (ledBarCheck) furnitureCost += 1200; // S/. 1200 flat LED bar rate

      // Calculate total base cost
      const baseCost = (guests * cateringRate) + furnitureCost;
      
      // Apply location logistical factor (approx)
      const location = document.getElementById('location').value.toLowerCase();
      let logFactor = 1.0;
      if (location.includes('cieneguilla') || location.includes('pachacamac') || location.includes('chaclacayo')) {
        logFactor = 1.1; // 10% premium for outlying Lima zones
      }

      const totalEstimate = baseCost * logFactor;
      const minEstimate = Math.round(totalEstimate * 0.9);
      const maxEstimate = Math.round(totalEstimate * 1.1);

      // Render on screen
      const minPriceSpan = document.getElementById('min-price');
      const maxPriceSpan = document.getElementById('max-price');
      
      if (minPriceSpan && maxPriceSpan) {
        minPriceSpan.textContent = `S/ ${minEstimate.toLocaleString()}`;
        maxPriceSpan.textContent = `S/ ${maxEstimate.toLocaleString()}`;
      }
    };

    // Form submit redirects to WhatsApp
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullname = document.getElementById('fullname').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const date = document.getElementById('event-date').value;
      const location = document.getElementById('location').value.trim();
      const guests = document.getElementById('guests-count').value;

      // Collect service choices
      let services = [];
      if (document.getElementById('cat-gala').checked) services.push('Menú Gala Gourmet');
      if (document.getElementById('cat-buffet').checked) services.push('Buffet Criollo de Lujo');
      if (document.getElementById('cat-cocktail').checked) services.push('Estación de Bocaditos');
      if (document.getElementById('furn-tiffany').checked) services.push('Sillas Tiffany');
      if (document.getElementById('furn-crossback').checked) services.push('Sillas Crossback');
      if (document.getElementById('furn-toldo').checked) services.push('Toldo Estructural');
      if (document.getElementById('furn-led').checked) services.push('Barras LED');

      const minEstimate = document.getElementById('min-price').textContent;
      const maxEstimate = document.getElementById('max-price').textContent;

      let msg = `*COTIZACIÓN PRELIMINAR - NAYELI EVENTOS*\n\n`;
      msg += `*Cliente:* ${fullname}\n`;
      msg += `*WhatsApp:* ${phone}\n`;
      msg += `*Correo:* ${email}\n`;
      msg += `*Fecha del evento:* ${date}\n`;
      msg += `*Locación:* ${location}\n`;
      msg += `*Invitados:* ${guests}\n`;
      msg += `*Servicios solicitados:* ${services.join(', ')}\n`;
      msg += `*Presupuesto Estimado:* ${minEstimate} - ${maxEstimate}\n`;

      const nayeliPhone = '51999666555'; // Simulated Lima +51 phone number

      alert(`Muchas gracias, ${fullname}. Su solicitud de presupuesto estimado por un rango de ${minEstimate} a ${maxEstimate} ha sido calculada. Se le redirigirá a nuestro WhatsApp corporativo para programar una videollamada de validación de locación.`);
      
      const encodedMsg = encodeURIComponent(msg);
      window.open(`https://api.whatsapp.com/send?phone=${nayeliPhone}&text=${encodedMsg}`, '_blank');
      
      quoteForm.reset();
      currentStep = 0;
      updateStepView();
      // Remove selection classes
      choiceBoxes.forEach(box => box.classList.remove('selected'));
    });
  }
});
