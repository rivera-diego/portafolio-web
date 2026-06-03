/* ===== INMOBILIARIA CARVAJAL: LÓGICA DE INTERACCIÓN Y FILTRADO ===== */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Iconos Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // 1. Efecto Scroll en Header (solo si no es scrolled fijo por defecto)
    const header = document.getElementById('main-header');
    if (header && !header.classList.contains('scrolled')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 2. Control de Mobile Drawer Menu
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (burgerBtn && mobileDrawer && mobileOverlay) {
        const toggleMenu = () => {
            mobileDrawer.classList.toggle('open');
            mobileOverlay.classList.toggle('open');
            
            const icon = burgerBtn.querySelector('i');
            if (mobileDrawer.classList.contains('open')) {
                if (icon) icon.setAttribute('data-lucide', 'x');
            } else {
                if (icon) icon.setAttribute('data-lucide', 'menu');
            }
            if (window.lucide) window.lucide.createIcons();
        };

        burgerBtn.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', toggleMenu);
    }

    // 3. Procesar Parámetros URL para el Formulario de Contacto o Filtros
    parseUrlParams();

    // 4. Configurar Submit de Contacto
    const contactForm = document.getElementById('carvajalContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
});

// 5. Cambiar Imagen Principal de la Galería (proyecto-detalle.html)
function switchGalleryImg(thumbElement) {
    const mainImg = document.getElementById('galleryMainImg');
    if (!mainImg || !thumbElement) return;

    // Cambiar la imagen principal
    mainImg.src = thumbElement.src;
    mainImg.alt = thumbElement.alt;

    // Quitar clase activa de todas las miniaturas
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach(t => t.classList.remove('active'));

    // Añadir clase activa al seleccionado
    thumbElement.classList.add('active');
}

// 6. Selector de Pestañas de Planos (proyecto-detalle.html)
function switchPlanTab(tabId) {
    // Desactivar botones de pestañas anteriores
    const buttons = document.querySelectorAll('.plan-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Ocultar contenidos de pestañas anteriores
    const contents = document.querySelectorAll('.plan-content');
    contents.forEach(content => content.classList.remove('active'));

    // Activar el seleccionado
    const selectedBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(`'${tabId}'`));
    if (selectedBtn) selectedBtn.classList.add('active');

    const selectedContent = document.getElementById(`plan-${tabId}`);
    if (selectedContent) selectedContent.classList.add('active');
}

// 7. Filtrado en Tiempo Real del Catálogo de Proyectos (proyectos.html)
function filterProjects() {
    const filterDistrito = document.getElementById('filter-distrito').value;
    const filterEstado = document.getElementById('filter-estado').value;
    const filterPrecio = document.getElementById('filter-precio').value;

    const cards = document.querySelectorAll('#catalog-projects-grid .project-card');
    const noResults = document.getElementById('no-projects-message');
    let visibleCount = 0;

    cards.forEach(card => {
        const itemDistrito = card.getAttribute('data-distrito');
        const itemEstado = card.getAttribute('data-estado');
        const itemPrecioStr = card.getAttribute('data-precio');
        const itemPrecio = parseFloat(itemPrecioStr) || 0;

        // Comprobación Distrito
        const matchDistrito = (filterDistrito === 'todos' || itemDistrito === filterDistrito);

        // Comprobación Estado de Obra
        const matchEstado = (filterEstado === 'todos' || itemEstado === filterEstado);

        // Comprobación Rango de Inversión
        let matchPrecio = false;
        if (filterPrecio === 'todos') {
            matchPrecio = true;
        } else if (filterPrecio === 'bajo') {
            matchPrecio = (itemPrecio < 300000);
        } else if (filterPrecio === 'medio') {
            matchPrecio = (itemPrecio >= 300000 && itemPrecio <= 400000);
        } else if (filterPrecio === 'alto') {
            matchPrecio = (itemPrecio > 400000);
        }

        // Mostrar / Ocultar Tarjeta
        if (matchDistrito && matchEstado && matchPrecio) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    // Controlar mensaje de no resultados
    if (noResults) {
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }
}

// Limpiar Filtros
function resetFilters() {
    const filterDistrito = document.getElementById('filter-distrito');
    const filterEstado = document.getElementById('filter-estado');
    const filterPrecio = document.getElementById('filter-precio');

    if (filterDistrito) filterDistrito.value = 'todos';
    if (filterEstado) filterEstado.value = 'todos';
    if (filterPrecio) filterPrecio.value = 'todos';

    filterProjects();
}

// 8. Leer parámetros URL
function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    
    // Para proyectos.html: filtrar por distrito si se especifica (ej. proyectos.html?distrito=Miraflores)
    const urlDistrito = params.get('distrito');
    const filterDistrito = document.getElementById('filter-distrito');
    
    if (urlDistrito && filterDistrito) {
        const val = urlDistrito.toLowerCase().replace(' ', '-');
        // Validar si existe la opcion
        if (Array.from(filterDistrito.options).some(opt => opt.value === val)) {
            filterDistrito.value = val;
            filterProjects();
        }
    }

    // Para contacto.html: preseleccionar proyecto de interes
    const urlProyecto = params.get('proyecto');
    const formProyecto = document.getElementById('proyecto');
    if (urlProyecto && formProyecto) {
        if (Array.from(formProyecto.options).some(opt => opt.value === urlProyecto)) {
            formProyecto.value = urlProyecto;
        }
    }

    // Para contacto.html: añadir tipologia en el mensaje
    const urlTipo = params.get('tipo');
    const formMensaje = document.getElementById('mensaje');
    if (urlTipo && formMensaje) {
        let msg = '';
        if (urlTipo === '1dorm') msg = 'Me interesa recibir planos y precios específicos sobre los departamentos de 1 Dormitorio (Flat Studio de 55 m²).';
        else if (urlTipo === '2dorm') msg = 'Me interesa recibir planos y precios específicos sobre los departamentos de 2 Dormitorios (Flat Familiar de 85 m²).';
        else if (urlTipo === 'duplex') msg = 'Me interesa recibir planos y precios específicos sobre la tipología Dúplex de 3 Dormitorios (160 m²).';
        
        formMensaje.value = msg;
    }
}

// 9. Enviar Formulario de Cita Inmobiliaria a WhatsApp
function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const proyectoKey = document.getElementById('proyecto').value;
    const presupuestoKey = document.getElementById('presupuesto').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    const proyectoNames = {
        alura: 'Edificio Alura (Miraflores)',
        bosque: 'Residencial Bosque (San Isidro)',
        golf: 'Golf View (Surco)',
        otro: 'Proyectos Carvajal'
    };

    const presupuestoNames = {
        bajo: 'Menos de $300,000',
        medio: '$300,000 a $450,000',
        alto: 'Más de $450,000'
    };

    const messageText = `
🏢 *Solicitud de Cita - Inmobiliaria Carvajal*

*Datos del Interesado:*
• *Nombre:* ${name}
• *WhatsApp:* ${phone}
• *Email:* ${email}

*Especificaciones del Requerimiento:*
• *Proyecto:* ${proyectoNames[proyectoKey]}
• *Rango Presupuesto:* ${presupuestoNames[presupuestoKey]}

*Consulta Particular:*
${mensaje || 'Desea coordinar una llamada de presentación.'}

---
Mensaje enviado desde el Portal de Contacto de Inmobiliaria Carvajal.
    `.trim();

    const whatsappNumber = '51987654321'; // WhatsApp Central de Ventas
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;
    
    window.open(url, '_blank');
    alert('¡Solicitud enviada! Se abrirá WhatsApp para consolidar la fecha de tu visita a la sala de ventas.');
    
    document.getElementById('carvajalContactForm').reset();
}
