document.addEventListener('DOMContentLoaded', () => {
  // ─── Navbar Scroll Effect ───
  const navBar = document.querySelector('.nav-bar');
  if (navBar) {
    window.addEventListener('scroll', () => {
      navBar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ─── Mobile Menu Toggle ───
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const spans = menuToggle.querySelectorAll('span');
      if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const spans = menuToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

  // ─── Typing Animation ───
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const phrases = [
      'Páginas Web a Medida',
      'Tiendas Virtuales',
      'Landing Pages',
      'Aplicaciones Web',
      'Diseño UI/UX'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 100;

    function typeLoop() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        delay = 40;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        delay = 90;
      }

      if (!isDeleting && charIndex === current.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 500;
      }

      setTimeout(typeLoop, delay);
    }

    typeLoop();
  }

  // ─── Scroll Reveal (Intersection Observer) ───
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  }

  // ─── Animated Counters ───
  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length > 0 && 'IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterEls.forEach(el => countObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1800;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ─── Smooth scroll for nav links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navBar ? navBar.offsetHeight + 32 : 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ─── Contact Form Simulation ───
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const projectType = document.getElementById('contact-project').value;
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }

      // Build WhatsApp message
      const waMsg = encodeURIComponent(
        `¡Hola Diego! 👋\n\n` +
        `Soy *${name}* y estoy interesado en tus servicios de desarrollo web.\n\n` +
        `📧 Email: ${email}\n` +
        `📋 Tipo de proyecto: ${projectType}\n\n` +
        `💬 Mensaje:\n${message}`
      );

      window.open(`https://wa.me/51988233246?text=${waMsg}`, '_blank');

      alert('¡Mensaje preparado! Se abrirá WhatsApp para enviar tu consulta directamente.');
      contactForm.reset();
    });
  }

  // ─── Active nav link highlight on scroll ───
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 120;
      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);

        if (link) {
          if (scrollPos >= top && scrollPos < top + height) {
            document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });
  }

  // ─── Canvas Particle Background ───
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    // Resize canvas
    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Track mouse on canvas parent (the hero section)
    const heroSection = document.getElementById('inicio');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#00F0FF' : '#FF00E5';
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce boundaries
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse collision (repulsion)
        if (mouse.x !== null && mouse.y !== null) {
          let dx = this.x - mouse.x;
          let dy = this.y - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            let force = (mouse.radius - dist) / mouse.radius;
            let angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 3;
            this.y += Math.sin(angle) * force * 3;
          }
        }
      }
    }

    // Populate particles based on canvas width
    function initParticles() {
      particles = [];
      const numParticles = Math.min(Math.floor(canvas.width / 15), 100);
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    // Render loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            // Gradients/alpha lines
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // ─── Holographic Mouse-Tracking Glow on Cards ───
  const glassCards = document.querySelectorAll('.glass-card, .portfolio-card, .pricing-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ─── Interactive CLI Terminal Simulator ───
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');

  // Command History / Booteo
  function bootConsole() {
    const bootLines = [
      '// SYS_OS CONNECTION ESTABLISHED.',
      '// PARSING DIRECTORIES... DONE.',
      '// READY. Escribe "help" para iniciar.'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        logTerminalLine(bootLines[i], 'text-muted');
        i++;
      } else {
        clearInterval(interval);
      }
    }, 450);
  }
  setTimeout(bootConsole, 1200);

  function logTerminalLine(text, className = '') {
    if (!terminalBody) return;
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.innerHTML = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Global function for CLI parsing
  window.runTerminalCmd = function(command) {
    if (!command) return;
    command = command.trim().toLowerCase();
    
    // Log prompt input
    logTerminalLine(`&gt; ${command}`, 'neon-cyan font-bold');

    switch(command) {
      case 'help':
        logTerminalLine('Comandos disponibles:<br>' +
          '- <span class="neon-cyan">projects</span>: Ver los 8 proyectos demo activos.<br>' +
          '- <span class="neon-magenta">skills</span>: Ver barras de habilidades técnicas.<br>' +
          '- <span class="neon-green">about</span>: Conocer más de Diego Rivera.<br>' +
          '- <span class="neon-yellow">contact</span>: Ver información de contacto directo.<br>' +
          '- <span class="text-white">clear</span>: Limpiar pantalla.');
        break;
      case 'projects':
      case 'portafolio':
        logTerminalLine('Demos en línea en este proyecto:<br>' +
          '1. <a href="leocal/index.html" target="_blank" class="neon-cyan underline">LEOCAL</a> (Seguridad Industrial)<br>' +
          '2. <a href="dalyster/index.html" target="_blank" class="neon-magenta underline">Dalyster</a> (Papelería Kawaii)<br>' +
          '3. <a href="castydent/index.html" target="_blank" class="neon-purple underline">CastyDent</a> (Clínica Dental)<br>' +
          '4. <a href="carvajal/index.html" target="_blank" class="neon-green underline">Carvajal</a> (Inmobiliaria)<br>' +
          '5. <a href="copernico/index.html" target="_blank" class="neon-yellow underline">Copérnico</a> (Capacitaciones)<br>' +
          '6. <a href="grupo-letona/index.html" target="_blank" class="neon-cyan underline">Letona</a> (Outsourcing Contable)<br>' +
          '7. <a href="nayeli-eventos/index.html" target="_blank" class="neon-magenta underline">Nayeli Eventos</a> (Catering y Muebles)<br>' +
          '8. <a href="agencia-mercato/index.html" target="_blank" class="neon-green underline">Agencia Mercato</a> (Turismo)');
        break;
      case 'skills':
        logTerminalLine('HABILIDADES TÉCNICAS (STUDIO OS CORE):<br>' +
          'HTML/CSS/SCSS   [████████████████░░] 88%<br>' +
          'JavaScript/ES6   [█████████████████░] 92%<br>' +
          'React / NextJS   [██████████████░░░░] 75%<br>' +
          'Astro / Vue      [████████████░░░░░░] 65%<br>' +
          'Diseño UI/UX     [██████████████████] 100%');
        break;
      case 'about':
        logTerminalLine('Diego Rivera es un Frontend Developer y Diseñador UI/UX especializado en crear experiencias web interactivas y customizadas que impulsan marcas y generan leads reales.');
        break;
      case 'contact':
        logTerminalLine('Información de Contacto:<br>' +
          '- WhatsApp: <span class="neon-green">+51 988 233 246</span><br>' +
          '- Email: <span class="neon-cyan">ds.diegorivera@gmail.com</span><br>' +
          '- Lima, Perú.');
        break;
      case 'clear':
        if (terminalBody) terminalBody.innerHTML = '';
        break;
      default:
        logTerminalLine(`Comando no reconocido: "${command}". Escribe <span class="neon-magenta">help</span> para ayuda.`, 'text-red-500');
    }
  }

  // CLI listener
  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value;
        if (cmd.trim() !== '') {
          runTerminalCmd(cmd);
          terminalInput.value = '';
        }
      }
    });
  }

  // ─── Tabs Switcher for Pricing ───
  window.switchPricingTab = function(tab) {
    const devGrid = document.getElementById('pricing-dev-grid');
    const maintGrid = document.getElementById('pricing-maint-grid');
    const btnDev = document.getElementById('tab-dev');
    const btnMaint = document.getElementById('tab-maint');

    if (tab === 'dev') {
      if (devGrid) devGrid.style.display = 'grid';
      if (maintGrid) maintGrid.style.display = 'none';
      if (btnDev) btnDev.classList.add('active');
      if (btnMaint) btnMaint.classList.remove('active');
    } else {
      if (devGrid) devGrid.style.display = 'none';
      if (maintGrid) maintGrid.style.display = 'grid';
      if (btnDev) btnDev.classList.remove('active');
      if (btnMaint) btnMaint.classList.add('active');
    }
  };

  // ─── Services / Web Configurator Widget ───
  const basePrices = {
    std: {
      landing: 300,
      corporativa: 600,
      ecommerce: 1200,
      sistema: 3000
    },
    pro: {
      landing: 600,
      corporativa: 1300,
      ecommerce: 2500,
      sistema: 5500
    }
  };

  // ─── Services / Web Configurator Widget ───
  let configState = {
    level: 'pro', // 'std' or 'pro'
    webType: 'landing',
    basePrice: 600,
    pagesCount: 0,
    addons: [],
    maintPrice: 0
  };

  window.switchPricingLevel = function(level) {
    configState.level = level;
    
    // 1. Sync Pricing Cards Level Toggle UI
    const toggleContainer = document.getElementById('pricing-level-toggle');
    const labelStd = document.getElementById('level-label-std');
    const labelPro = document.getElementById('level-label-pro');
    
    if (level === 'pro') {
      if (toggleContainer) {
        toggleContainer.classList.add('pro-active');
        toggleContainer.classList.remove('std-active');
      }
      if (labelPro) labelPro.classList.add('active');
      if (labelStd) labelStd.classList.remove('active');
    } else {
      if (toggleContainer) {
        toggleContainer.classList.add('std-active');
        toggleContainer.classList.remove('pro-active');
      }
      if (labelStd) labelStd.classList.add('active');
      if (labelPro) labelPro.classList.remove('active');
    }

    // 2. Update Pricing Cards Content (prices, descriptions, features)
    const devGrid = document.getElementById('pricing-dev-grid');
    if (devGrid) {
      const cards = devGrid.querySelectorAll('.pricing-card');
      cards.forEach(card => {
        const priceAmountEl = card.querySelector('.price-amount');
        const descEl = card.querySelector('.pricing-desc');
        const featuresStd = card.querySelector('.pricing-features-std');
        const featuresPro = card.querySelector('.pricing-features-pro');
        
        if (level === 'pro') {
          const pricePro = card.getAttribute('data-price-pro');
          const descPro = card.getAttribute('data-desc-pro');
          if (priceAmountEl) priceAmountEl.textContent = pricePro;
          if (descEl) descEl.textContent = descPro;
          if (featuresStd) featuresStd.style.display = 'none';
          if (featuresPro) featuresPro.style.display = 'block';
        } else {
          const priceStd = card.getAttribute('data-price-std');
          const descStd = card.getAttribute('data-desc-std');
          if (priceAmountEl) priceAmountEl.textContent = priceStd;
          if (descEl) descEl.textContent = descStd;
          if (featuresStd) featuresStd.style.display = 'block';
          if (featuresPro) featuresPro.style.display = 'none';
        }
      });
    }

    // 3. Sync Configurator Level Options UI
    document.querySelectorAll('[id^="config-level-"]').forEach(el => el.classList.remove('active'));
    const configLevelActive = document.getElementById(`config-level-${level}`);
    if (configLevelActive) configLevelActive.classList.add('active');

    // 4. Update Configurator base prices in UI
    const basePricesLvl = basePrices[level];
    Object.keys(basePricesLvl).forEach(type => {
      const priceSpan = document.getElementById(`base-price-${type}`);
      if (priceSpan) {
        priceSpan.textContent = `S/ ${basePricesLvl[type].toLocaleString()}`;
      }
    });

    // 5. Update internal configurator state & recalculate
    configState.basePrice = basePricesLvl[configState.webType];
    calculatePrice();
  };

  window.togglePricingLevel = function() {
    const nextLevel = configState.level === 'pro' ? 'std' : 'pro';
    switchPricingLevel(nextLevel);
  };

  window.selectConfigLevel = function(level) {
    switchPricingLevel(level);
  };

  window.selectWebType = function(type) {
    configState.webType = type;
    configState.basePrice = basePrices[configState.level][type];
    
    // Update active visual class
    document.querySelectorAll('[id^="type-"]').forEach(el => el.classList.remove('active'));
    
    const activeEl = document.getElementById(`type-${type}`);
    if (activeEl) activeEl.classList.add('active');

    // Reset range slider max/value
    const slider = document.getElementById('config-pages');
    const sliderLabel = document.getElementById('slider-label');
    const sliderTicks = document.getElementById('slider-ticks');

    if (slider) {
      slider.value = 0;
      slider.min = 0;
      slider.max = 10;
      
      if (type === 'landing') {
        if (sliderLabel) sliderLabel.textContent = '3. Secciones Adicionales (Base incluye 5-6)';
        if (sliderTicks) {
          sliderTicks.innerHTML = '<span>0</span><span>3</span><span>6</span><span>10</span>';
        }
      } else if (type === 'corporativa') {
        if (sliderLabel) sliderLabel.textContent = '3. Páginas Adicionales (Base incluye 5)';
        if (sliderTicks) {
          sliderTicks.innerHTML = '<span>0</span><span>3</span><span>6</span><span>10</span>';
        }
      } else if (type === 'ecommerce') {
        if (sliderLabel) sliderLabel.textContent = '3. Páginas/Productos Adicionales (Base incluye 5)';
        if (sliderTicks) {
          sliderTicks.innerHTML = '<span>0</span><span>3</span><span>6</span><span>10</span>';
        }
      } else if (type === 'sistema') {
        if (sliderLabel) sliderLabel.textContent = '3. Módulos / Vistas Adicionales (Base incluye 3)';
        if (sliderTicks) {
          sliderTicks.innerHTML = '<span>0</span><span>3</span><span>6</span><span>10</span>';
        }
      }
      updatePages(0);
    }
    calculatePrice();
  }

  window.updatePages = function(val) {
    configState.pagesCount = parseInt(val, 10);
    const pagesLabel = document.getElementById('pages-val');
    if (pagesLabel) {
      let suffix = 'extra';
      if (configState.webType === 'landing') {
        suffix = val === '1' ? 'sección extra' : 'secciones extra';
      } else if (configState.webType === 'sistema') {
        suffix = val === '1' ? 'módulo extra' : 'módulos extra';
      } else {
        suffix = val === '1' ? 'página extra' : 'páginas extra';
      }
      pagesLabel.textContent = `${val} ${suffix}`;
    }
    calculatePrice();
  }

  window.calculatePrice = function() {
    let projectTotal = configState.basePrice;
    
    // Extra pages/sections calculation depending on Level & WebType
    let extraCostPerUnit = 200; // default pro corporativa/ecommerce
    if (configState.level === 'std') {
      if (configState.webType === 'landing') {
        extraCostPerUnit = 80;
      } else if (configState.webType === 'sistema') {
        extraCostPerUnit = 150;
      } else {
        extraCostPerUnit = 100;
      }
    } else { // pro level
      if (configState.webType === 'landing') {
        extraCostPerUnit = 150;
      } else if (configState.webType === 'sistema') {
        extraCostPerUnit = 300;
      } else {
        extraCostPerUnit = 200;
      }
    }
    
    projectTotal += configState.pagesCount * extraCostPerUnit;

    // Addons calculation
    let addonsTotal = 0;
    let selectedAddonsCount = 0;
    
    const checkboxes = [
      { id: 'feature-dark', name: 'Diseño Dark Mode' },
      { id: 'feature-seo', name: 'Optimización SEO' },
      { id: 'feature-whatsapp-catalog', name: 'Catálogo WhatsApp' },
      { id: 'feature-cms', name: 'Panel CMS / Administrable' },
      { id: 'feature-payment', name: 'Pasarela de Pagos' },
      { id: 'feature-anim', name: 'Animaciones 3D' }
    ];

    checkboxes.forEach(cb => {
      const el = document.getElementById(cb.id);
      if (el && el.checked) {
        addonsTotal += parseInt(el.value, 10);
        selectedAddonsCount++;
      }
    });

    projectTotal += addonsTotal;

    // Monthly maintenance selection
    let maintCost = 0;
    const maintRadios = document.getElementsByName('config-maint');
    maintRadios.forEach(radio => {
      if (radio.checked) {
        maintCost = parseInt(radio.value, 10);
      }
    });
    configState.maintPrice = maintCost;

    // Render price breakdown
    const projectTotalEl = document.getElementById('configurator-project-total');
    if (projectTotalEl) projectTotalEl.textContent = `S/ ${projectTotal.toLocaleString()}`;

    const maintLine = document.getElementById('maint-price-line');
    const maintTotalEl = document.getElementById('configurator-maint-total');
    if (maintCost > 0) {
      if (maintLine) maintLine.style.display = 'flex';
      if (maintTotalEl) maintTotalEl.textContent = `S/ ${maintCost} / mes`;
    } else {
      if (maintLine) maintLine.style.display = 'none';
    }

    const totalEl = document.getElementById('configurator-total');
    if (totalEl) {
      if (maintCost > 0) {
        totalEl.innerHTML = `S/ ${projectTotal.toLocaleString()} <span style="font-size: 0.95rem; color: var(--text-muted); font-weight: normal;">+ S/ ${maintCost}/mes</span>`;
      } else {
        totalEl.textContent = `S/ ${projectTotal.toLocaleString()}`;
      }
    }

    const summaryLevel = document.getElementById('summary-level');
    const summaryType = document.getElementById('summary-web-type');
    const summaryPages = document.getElementById('summary-pages');
    const summaryFeatures = document.getElementById('summary-features');
    const summaryMaint = document.getElementById('summary-maint');

    const levelNames = {
      std: 'Estándar',
      pro: 'Premium (Código Puro)'
    };

    const typeNames = {
      landing: 'Landing Page',
      corporativa: 'Web Corporativa',
      ecommerce: 'Tienda Virtual',
      sistema: 'Sistema a Medida'
    };

    if (summaryLevel) {
      summaryLevel.textContent = levelNames[configState.level];
      if (configState.level === 'pro') {
        summaryLevel.style.color = 'var(--neon-magenta)';
      } else {
        summaryLevel.style.color = 'var(--text-primary)';
      }
    }

    if (summaryType) summaryType.textContent = typeNames[configState.webType];
    
    if (summaryPages) {
      let unit = 'páginas';
      if (configState.webType === 'landing') unit = 'secciones';
      if (configState.webType === 'sistema') unit = 'módulos';
      summaryPages.textContent = `${configState.pagesCount} ${unit} extra`;
    }
    
    if (summaryFeatures) summaryFeatures.textContent = selectedAddonsCount;
    
    if (summaryMaint) {
      if (maintCost === 80) {
        summaryMaint.textContent = 'Esencial (S/ 80/mes)';
      } else if (maintCost === 200) {
        summaryMaint.textContent = 'Avanzado (S/ 200/mes)';
      } else {
        summaryMaint.textContent = 'Ninguno';
      }
    }

    // Progress bar fill
    const progressFill = document.getElementById('price-progress');
    if (progressFill) {
      // Scale from S/ 300 to S/ 10,000
      const percentage = Math.min(((projectTotal - 300) / 9700) * 100 + 10, 100);
      progressFill.style.width = `${percentage}%`;
    }
  }

  // Send configurator state to WhatsApp
  window.sendConfigToWhatsapp = function() {
    const levelNames = {
      std: 'Estándar (Económico)',
      pro: 'Premium (Código Puro)'
    };

    const typeNames = {
      landing: 'Landing Page',
      corporativa: 'Web Corporativa',
      ecommerce: 'Tienda Virtual / E-commerce',
      sistema: 'Sistema a Medida'
    };

    let addonsList = [];
    const checkboxes = [
      { id: 'feature-dark', name: 'Soporte Dark Mode' },
      { id: 'feature-seo', name: 'SEO Profesional' },
      { id: 'feature-whatsapp-catalog', name: 'Catálogo WhatsApp' },
      { id: 'feature-cms', name: 'Panel CMS / Administrable' },
      { id: 'feature-payment', name: 'Pasarela de Pagos' },
      { id: 'feature-anim', name: 'Animaciones 3D' }
    ];

    checkboxes.forEach(cb => {
      const el = document.getElementById(cb.id);
      if (el && el.checked) {
        addonsList.push(cb.name);
      }
    });

    const projectTotalText = document.getElementById('configurator-project-total').textContent;
    
    let maintText = 'Ninguno';
    if (configState.maintPrice === 80) {
      maintText = 'Plan Esencial (S/ 80/mes)';
    } else if (configState.maintPrice === 200) {
      maintText = 'Plan Avanzado (S/ 200/mes)';
    }

    let unit = 'páginas';
    if (configState.webType === 'landing') unit = 'secciones';
    if (configState.webType === 'sistema') unit = 'módulos';

    const waMsg = encodeURIComponent(
      `¡Hola Diego! 👋\n\n` +
      `He configurado una propuesta web en tu portafolio:\n\n` +
      `⚙️ *Nivel de Acabado:* ${levelNames[configState.level]}\n` +
      `💻 *Tipo de Web:* ${typeNames[configState.webType]}\n` +
      `📄 *Adicionales en Plan:* ${configState.pagesCount} ${unit} extra\n` +
      `🔌 *Características Seleccionadas:* ${addonsList.length > 0 ? addonsList.join(', ') : 'Ninguna'}\n` +
      `🛠️ *Soporte Mensual:* ${maintText}\n\n` +
      `💵 *Costo Estimado Proyecto:* ${projectTotalText} (Pago único)\n` +
      `⚙️ *Costo Soporte:* ${configState.maintPrice > 0 ? 'S/ ' + configState.maintPrice + '/mes' : 'Sin soporte contratado'}\n\n` +
      `📝 *Condiciones Comerciales Aceptadas:*\n` +
      `- Pago: 50% de adelanto / 50% contra entrega de conformidad.\n` +
      `- Hosting/Dominio a cuenta del cliente.\n` +
      `- Incluye 2 rondas de modificaciones gratuitas.\n\n` +
      `¿Me podrías brindar más detalles o agendar una llamada breve? ¡Gracias!`
    );

    window.open(`https://wa.me/51988233246?text=${waMsg}`, '_blank');
  }

  // Custom Select Dropdown logic for contact form
  const selectWrapper = document.getElementById('custom-select-project-wrapper');
  if (selectWrapper) {
    const trigger = document.getElementById('custom-select-project-trigger');
    const triggerText = trigger.querySelector('.custom-select-trigger-text');
    const optionsContainer = document.getElementById('custom-select-project-options');
    const optionsList = optionsContainer.querySelectorAll('.custom-select-option');
    const hiddenInput = document.getElementById('contact-project');

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      selectWrapper.classList.toggle('open');
    });

    optionsList.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = opt.getAttribute('data-value');
        
        // Update trigger text & input value
        triggerText.textContent = value;
        hiddenInput.value = value;

        // Update active class
        optionsList.forEach(el => el.classList.remove('active'));
        opt.classList.add('active');

        // Close dropdown
        selectWrapper.classList.remove('open');
        
        // Trigger change event
        const event = new Event('change');
        hiddenInput.dispatchEvent(event);
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      selectWrapper.classList.remove('open');
    });
  }

  // ─── HUD Clock Ticker ───
  const clockEl = document.getElementById('nav-clock');
  if (clockEl) {
    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      clockEl.textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Initialize configurator price calculations
  calculatePrice();
});
