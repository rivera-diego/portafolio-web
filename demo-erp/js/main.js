/* ==========================================================================
   ERP Simplificado — Prototipo interactivo V.I.C.A.
   Lógica de la demo: datos ficticios en memoria, sin conexión real a Pro9.
   ========================================================================== */
(() => {
  'use strict';

  /* ---------- 1. Datos de demostración ---------- */
  const CATEGORIES = [
    { id: 'TODOS', label: 'Todos' },
    { id: 'POLOS', label: 'Polos' },
    { id: 'JEANS', label: 'Jeans' },
    { id: 'CASACAS', label: 'Casacas' },
    { id: 'CAMISAS', label: 'Camisas' },
    { id: 'ACCESORIOS', label: 'Accesorios' },
  ];

  // Catálogo de 28 productos
  const INITIAL_INVENTORY = [
    { id: 1, name: 'Polo Algodón 20/1 Cuello Redondo', category: 'POLOS', price: 20, stock: 45, code: 'POL-001' },
    { id: 2, name: 'Polo Pique Cuello Camisero', category: 'POLOS', price: 32, stock: 28, code: 'POL-002' },
    { id: 3, name: 'Polo Manga Larga Algodón', category: 'POLOS', price: 25, stock: 18, code: 'POL-003' },
    { id: 4, name: 'Polo Boxy Fit Oversize', category: 'POLOS', price: 30, stock: 35, code: 'POL-004' },
    { id: 5, name: 'Polo Dama Cuello V Estampado', category: 'POLOS', price: 22, stock: 4, code: 'POL-005' },

    { id: 6, name: 'Pantalón Jean Clásico Azul T.30', category: 'JEANS', price: 48, stock: 22, code: 'JEA-010' },
    { id: 7, name: 'Pantalón Jean Clásico Azul T.32', category: 'JEANS', price: 48, stock: 26, code: 'JEA-011' },
    { id: 8, name: 'Pantalón Jean Clásico Azul T.34', category: 'JEANS', price: 48, stock: 15, code: 'JEA-012' },
    { id: 9, name: 'Pantalón Jean Negro Slim Fit T.32', category: 'JEANS', price: 52, stock: 3, code: 'JEA-013' },
    { id: 10, name: 'Pantalón Cargo Drill Beige T.32', category: 'JEANS', price: 55, stock: 19, code: 'JEA-014' },
    { id: 11, name: 'Jogger Algodón Rústico Plomo', category: 'JEANS', price: 38, stock: 30, code: 'JEA-015' },

    { id: 12, name: 'Casaca Térmica Polar con Cierre', category: 'CASACAS', price: 75, stock: 14, code: 'CAS-020' },
    { id: 13, name: 'Casaca Cortaviento Impermeable', category: 'CASACAS', price: 65, stock: 20, code: 'CAS-021' },
    { id: 14, name: 'Casaca Jean Clásica con Chiporro', category: 'CASACAS', price: 95, stock: 2, code: 'CAS-022' },
    { id: 15, name: 'Polera Capucha Algodón Franela', category: 'CASACAS', price: 50, stock: 32, code: 'CAS-023' },
    { id: 16, name: 'Chompa Cuello Jorge Chávez', category: 'CASACAS', price: 45, stock: 11, code: 'CAS-024' },

    { id: 17, name: 'Camisa Vestir Manga Larga Blanca', category: 'CAMISAS', price: 42, stock: 25, code: 'CAM-030' },
    { id: 18, name: 'Camisa Cuadros Casual Franela', category: 'CAMISAS', price: 40, stock: 17, code: 'CAM-031' },
    { id: 19, name: 'Camisa Lino Verano Manga Corta', category: 'CAMISAS', price: 45, stock: 21, code: 'CAM-032' },
    { id: 20, name: 'Camisa Denim Urbana Talla M', category: 'CAMISAS', price: 50, stock: 8, code: 'CAM-033' },

    { id: 21, name: 'Gorro Lana Tejido Polar', category: 'ACCESORIOS', price: 15, stock: 40, code: 'ACC-040' },
    { id: 22, name: 'Gorra Urbana con Visera Curva', category: 'ACCESORIOS', price: 20, stock: 30, code: 'ACC-041' },
    { id: 23, name: 'Correa Cuero Sintético Negro', category: 'ACCESORIOS', price: 18, stock: 25, code: 'ACC-042' },
    { id: 24, name: 'Billetera Hombre Cuero Vacuno', category: 'ACCESORIOS', price: 28, stock: 12, code: 'ACC-043' },
    { id: 25, name: 'Medias Algodón Pack x 3', category: 'ACCESORIOS', price: 12, stock: 55, code: 'ACC-044' },
    { id: 26, name: 'Bufanda Tejida Clásica', category: 'ACCESORIOS', price: 22, stock: 16, code: 'ACC-045' },
    { id: 27, name: 'Mochila Lona Reforzada 25L', category: 'ACCESORIOS', price: 65, stock: 7, code: 'ACC-046' },
    { id: 28, name: 'Morral Bandolera Compacto', category: 'ACCESORIOS', price: 35, stock: 14, code: 'ACC-047' },
  ];

  // Ventas de la mañana (cada ítem guarda el id del producto para devolver stock al anular)
  const INITIAL_SALES = [
    {
      voucher: 'B001-1003', time: '11:20', method: 'YAPE / PLIN', total: 165,
      items: [
        { id: 12, name: 'Casaca Térmica Polar con Cierre', qty: 2, price: 75 },
        { id: 21, name: 'Gorro Lana Tejido Polar', qty: 1, price: 15 },
      ],
    },
    {
      voucher: 'B001-1002', time: '10:45', method: 'EFECTIVO', total: 48,
      items: [{ id: 7, name: 'Pantalón Jean Clásico Azul T.32', qty: 1, price: 48 }],
    },
    {
      voucher: 'B001-1001', time: '09:30', method: 'EFECTIVO', total: 84,
      items: [
        { id: 1, name: 'Polo Algodón 20/1 Cuello Redondo', qty: 3, price: 20 },
        { id: 25, name: 'Medias Algodón Pack x 3', qty: 2, price: 12 },
      ],
    },
  ];

  const FIRST_VOUCHER = 1004;
  const LOW_STOCK = 5;   // umbral de "stock bajo"
  const VOID_LIMIT = 3;  // el esquema muestra solo las últimas 3 ventas para anular

  // Narración del recorrido: qué ve el comerciante y qué hace el sistema por detrás
  const TOUR = [
    {
      key: 'screen-vica', variant: 'home', badge: '⌂', name: 'Inicio', meta: 'Cuadrante fijo V.I.C.A.',
      sees: 'Cuatro botones grandes con color y letra. Nunca cambian de posición ni se ocultan, como en un cajero automático.',
      behind: 'El comerciante entra directo a esta vista; el panel completo de Pro9 queda oculto.',
      taps: '1 toque para llegar a cualquier función.',
    },
    {
      key: 'screen-vender', variant: 'v', badge: 'V', name: 'Vender', meta: 'Nueva boleta · cobro rápido',
      sees: 'Toca el producto (o lo escanea) y cobra en efectivo o Yape/Plin. Sin tipo de cambio, detracciones ni cuentas contables.',
      behind: '<code>POST /api/documents</code> emite la boleta electrónica, descuenta el stock e imprime el ticket.',
      taps: 'Máximo 2: producto → cobrar.',
    },
    {
      key: 'screen-inventario', variant: 'i', badge: 'I', name: 'Inventario', meta: 'Stock y precio al instante',
      sees: '¿Tengo esto y cuánto cuesta? Stock y precio en grande, con opción de agregarlo directo a la venta.',
      behind: '<code>GET /api/items</code>, con lectura de código por cámara o lector de pistola.',
      taps: '1: escanear o tocar el producto.',
    },
    {
      key: 'screen-caja', variant: 'c', badge: 'C', name: 'Caja del día', meta: '¿Cuánto vendí hoy?',
      sees: 'Resumen tipo billetera: efectivo, Yape/Plin y comprobantes emitidos. Sin reportes contables.',
      behind: '<code>GET /api/cash</code> y cierre impreso en la ticketera.',
      taps: '1 para ver el total; 1 más para imprimir el cierre.',
    },
    {
      key: 'screen-anular', variant: 'a', badge: 'A', name: 'Anular', meta: 'Corregir un error o devolución',
      sees: 'Solo las últimas 3 ventas del día y una confirmación simple. Sin motivos contables ni códigos SUNAT.',
      behind: '<code>POST /api/documents/anulation</code>: nota de crédito, stock de vuelta al Kardex y descuento en caja.',
      taps: '2: anular → confirmar.',
    },
    {
      key: 'advisor', variant: 'advisor', badge: '⚙', name: 'Panel Asesor', meta: 'Solo equipo técnico',
      sees: 'El comerciante nunca entra aquí. Lo usa soporte para certificados SUNAT, carga masiva de catálogo y reportes.',
      behind: 'Es el panel completo de Facturalo Pro9, sobre la misma base de datos.',
      taps: 'Se activa desde «Perfil: Asesor (Pro9)».',
    },
  ];

  /* ---------- 2. Utilidades ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const clone = (data) => JSON.parse(JSON.stringify(data));
  const moneyFormat = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money = (n) => `S/ ${moneyFormat.format(n)}`;
  const round2 = (n) => Math.round(n * 100) / 100;
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ESCAPES[c]);
  const clockTime = (d = new Date()) => d.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false });
  const scrollBehavior = () => (window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');

  /* ---------- 3. Referencias al DOM ---------- */
  const dom = {
    siteHeader: $('.site-header'),
    hero: $('#demo'),
    device: $('#device'),
    app: $('#app'),
    appMain: $('#appMain'),
    clock: $('#deviceClock'),
    stageCaption: $('#stageCaption'),
    tourList: $('#tourList'),
    roleBadge: $('#roleBadgeText'),
    // Venta
    productSearch: $('#productSearchInput'),
    salePills: $('#saleCategoryPills'),
    productsGrid: $('#productsGrid'),
    cartList: $('#cartItemsList'),
    cartTotal: $('#cartTotalDisplay'),
    payButtons: $$('[data-action="pay"]'),
    // Inventario
    invSearch: $('#inventorySearchInput'),
    invPills: $('#invCategoryPills'),
    invList: $('#inventoryItemsList'),
    statItems: $('#totalItemsCount'),
    statUnits: $('#totalStockCount'),
    statLow: $('#lowStockCount'),
    detailCard: $('#stockDetailCard'),
    detailCode: $('#detailCode'),
    detailName: $('#detailName'),
    detailQty: $('#detailQty'),
    detailPrice: $('#detailPrice'),
    detailAdd: $('#detailAddBtn'),
    // Caja
    cashCash: $('#cashTotalCash'),
    cashYape: $('#cashTotalYape'),
    cashVouchers: $('#cashTotalVouchers'),
    cashTotal: $('#cashGrandTotal'),
    // Anular
    voidList: $('#voidSalesList'),
    voidModal: $('#voidModal'),
    voidText: $('#voidModalText'),
    voidCancel: $('#voidCancelBtn'),
    // Ticket
    ticketModal: $('#ticketModal'),
    saleSuccess: $('#saleSuccess'),
    receiptTitle: $('#receiptDocTitle'),
    receiptBody: $('#receiptBody'),
    receiptTotal: $('#receiptTotalVal'),
    receiptQr: $('#receiptQrArea'),
    receiptPrimary: $('#btnReceiptPrimary'),
    // Asesor, avisos y cronograma
    advisorModal: $('#advisorModal'),
    advisorCount: $('#advisorProductCount'),
    toast: $('#appToast'),
    timeline: $('#timeline'),
  };

  /* ---------- 4. Estado ---------- */
  const state = {
    inventory: [],
    sales: [],
    voidedCount: 0,
    cart: [],
    voucherCounter: FIRST_VOUCHER,
    saleCategory: 'TODOS',
    invCategory: 'TODOS',
    selectedId: null,
    screen: 'screen-vica',
    mode: 'merchant',
    device: 'phone',
    receiptIsSale: false,
    pendingVoid: null,
    lastFocus: null,
  };

  const findItem = (id) => state.inventory.find((item) => item.id === id);

  // Re-renderizar con innerHTML destruye el botón enfocado; esto lo restaura (uso con teclado).
  function renderKeepingFocus(container, render) {
    const active = document.activeElement;
    let selector = null;
    if (active && container.contains(active) && active.dataset && active.dataset.action) {
      selector = `[data-action="${active.dataset.action}"]`;
      if (active.dataset.id) selector += `[data-id="${active.dataset.id}"]`;
      if (active.dataset.delta) selector += `[data-delta="${active.dataset.delta}"]`;
    }
    render();
    if (selector) {
      const next = container.querySelector(selector);
      if (next) next.focus({ preventScroll: true });
    }
  }

  /* ---------- 5. Navegación y recorrido ---------- */
  function navigateTo(screenId) {
    const target = document.getElementById(screenId);
    if (!target || !target.classList.contains('view-screen')) return;
    state.screen = screenId;
    dom.app.dataset.screen = screenId; // el CSS de PC oculta el menú lateral en Inicio
    $$('.view-screen', dom.app).forEach((screen) => screen.classList.toggle('active', screen === target));
    $$('.app-rail [data-target]', dom.app).forEach((btn) => {
      if (btn.dataset.target === screenId) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    dom.appMain.scrollTop = 0;

    if (screenId === 'screen-vender') { renderProducts(); renderCart(); }
    if (screenId === 'screen-inventario') { updateInventoryStats(); renderStockDetail(); renderInventory(); }
    if (screenId === 'screen-caja') updateCashView();
    if (screenId === 'screen-anular') renderVoidSales();
    updateTour();
  }

  function renderTour() {
    dom.tourList.innerHTML = TOUR.map((step) => `
      <li class="tour__item tour__item--${step.variant}" data-key="${step.key}">
        <button type="button" class="tour__btn" data-action="tour" data-key="${step.key}" aria-expanded="false" aria-controls="tour-${step.key}">
          <span class="tour__badge" aria-hidden="true">${step.badge}</span>
          <span class="tour__text">
            <span class="tour__name">${step.name}</span>
            <span class="tour__meta">${step.meta}</span>
          </span>
          <span class="tour__chev" aria-hidden="true">›</span>
        </button>
        <div class="tour__panel" id="tour-${step.key}" hidden>
          <dl>
            <dt>Qué ve el comerciante</dt><dd>${step.sees}</dd>
            <dt>Qué pasa por detrás</dt><dd>${step.behind}</dd>
            <dt>Toques</dt><dd>${step.taps}</dd>
          </dl>
        </div>
      </li>`).join('');
  }

  function updateTour() {
    const activeKey = state.mode === 'advisor' ? 'advisor' : state.screen;
    $$('.tour__item', dom.tourList).forEach((item) => {
      const isActive = item.dataset.key === activeKey;
      item.classList.toggle('is-active', isActive);
      $('.tour__btn', item).setAttribute('aria-expanded', String(isActive));
      $('.tour__panel', item).hidden = !isActive;
    });
  }

  function goToTourStep(key) {
    dismissOverlays();
    if (key === 'advisor') {
      setMode(state.mode === 'advisor' ? 'merchant' : 'advisor');
    } else {
      if (state.mode === 'advisor') setMode('merchant');
      navigateTo(key);
    }
    revealDevice();
  }

  // Si el dispositivo no se ve completo (p. ej. en celular, donde el recorrido queda debajo), lo trae a la vista.
  function revealDevice() {
    const rect = dom.device.getBoundingClientRect();
    const headerBottom = dom.siteHeader.getBoundingClientRect().bottom;
    const fullyVisible = rect.top >= headerBottom - 1 && rect.bottom <= window.innerHeight + 1;
    if (!fullyVisible) dom.device.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  }

  /* ---------- 6. Venta ---------- */
  function renderPills(container, activeCat, action) {
    container.innerHTML = CATEGORIES.map((cat) => {
      const label = cat.id === 'TODOS' ? `${cat.label} (${state.inventory.length})` : cat.label;
      return `<button type="button" class="cat-pill" data-action="${action}" data-cat="${cat.id}" aria-pressed="${cat.id === activeCat}">${label}</button>`;
    }).join('');
  }

  function setPillPressed(container, activeCat) {
    $$('.cat-pill', container).forEach((pill) => pill.setAttribute('aria-pressed', String(pill.dataset.cat === activeCat)));
  }

  function filterItems(query, category) {
    const q = query.trim().toLowerCase();
    return state.inventory.filter((item) =>
      (category === 'TODOS' || item.category === category) &&
      (!q || item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q)));
  }

  function renderProducts() {
    const list = filterItems(dom.productSearch.value, state.saleCategory);
    renderKeepingFocus(dom.productsGrid, () => {
      dom.productsGrid.innerHTML = list.length
        ? list.map((item) => {
          const soldOut = item.stock <= 0;
          return `
            <button type="button" class="product-btn" data-action="add-to-cart" data-id="${item.id}"${soldOut ? ' aria-disabled="true"' : ''}>
              <span class="prod-name">${esc(item.name)}</span>
              <span class="prod-meta">
                <span class="prod-price">${money(item.price)}</span>
                <span class="prod-stock-tag">${soldOut ? 'Agotado' : `${item.stock} disp.`}</span>
              </span>
            </button>`;
        }).join('')
        : '<p class="grid-empty">No hay productos con este filtro.</p>';
    });
  }

  const cartTotal = () => round2(state.cart.reduce((sum, line) => sum + line.price * line.qty, 0));

  function renderCart() {
    const hasItems = state.cart.length > 0;
    renderKeepingFocus(dom.cartList, () => {
      dom.cartList.innerHTML = hasItems
        ? state.cart.map((line) => `
          <div class="cart-item">
            <div class="cart-item__info">
              <div class="cart-item__name">${esc(line.name)}</div>
              <div class="cart-item__sub">${money(line.price)} c/u · <b>${money(line.price * line.qty)}</b></div>
            </div>
            <div class="cart-controls">
              <button type="button" class="btn-qty" data-action="qty" data-id="${line.id}" data-delta="-1" aria-label="Quitar una unidad de ${esc(line.name)}">−</button>
              <span class="cart-qty">${line.qty}</span>
              <button type="button" class="btn-qty" data-action="qty" data-id="${line.id}" data-delta="1" aria-label="Agregar una unidad de ${esc(line.name)}">+</button>
            </div>
          </div>`).join('')
        : '<p class="cart-empty">Toque un producto o escanee su código</p>';
    });
    dom.cartTotal.textContent = money(cartTotal());
    dom.payButtons.forEach((btn) => btn.setAttribute('aria-disabled', String(!hasItems)));
  }

  // No permite vender más unidades de las que hay en stock
  function addToCart(id) {
    const item = findItem(id);
    if (!item) return false;
    const line = state.cart.find((l) => l.id === id);
    const inCart = line ? line.qty : 0;
    if (inCart >= item.stock) {
      showToast(item.stock <= 0 ? `${item.name}: agotado` : `Solo hay ${item.stock} unid. de ${item.name}`);
      return false;
    }
    if (line) {
      line.qty += 1;
      renderCart();
    } else {
      state.cart.push({ id: item.id, name: item.name, price: item.price, qty: 1 });
      renderCart();
      dom.cartList.scrollTop = dom.cartList.scrollHeight; // muestra el producto recién agregado
    }
    return true;
  }

  function changeQty(id, delta) {
    if (delta > 0) { addToCart(id); return; }
    const index = state.cart.findIndex((l) => l.id === id);
    if (index === -1) return;
    state.cart[index].qty -= 1;
    if (state.cart[index].qty <= 0) state.cart.splice(index, 1);
    renderCart();
  }

  // Simulación del lector: elige un producto al azar que aún tenga stock disponible
  function randomAvailableItem() {
    const pool = state.inventory.filter((item) => {
      const line = state.cart.find((l) => l.id === item.id);
      return item.stock > (line ? line.qty : 0);
    });
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  function simulateScanSale() {
    const item = randomAvailableItem();
    if (!item) { showToast('No quedan productos con stock disponible'); return; }
    if (addToCart(item.id)) showToast(`📷 Escaneado: [${item.code}] ${item.name}`);
  }

  function processPayment(method) {
    if (!state.cart.length) {
      showToast('Primero toque un producto o escanee su código');
      return;
    }
    const now = new Date();
    const sale = {
      voucher: `B001-${state.voucherCounter++}`,
      time: clockTime(now),
      date: now.toLocaleDateString('es-PE'),
      method,
      items: state.cart.map((line) => ({ ...line })),
      total: cartTotal(),
    };
    sale.items.forEach((line) => {
      const item = findItem(line.id);
      if (item) item.stock -= line.qty;
    });
    state.sales.unshift(sale);
    showSaleReceipt(sale);
  }

  /* ---------- 7. Tickets (boleta y cierre de caja) ---------- */
  function openModal(modal, focusTarget) {
    state.lastFocus = document.activeElement;
    hideToast(); // un aviso pendiente no debe tapar el ticket ni la confirmación
    modal.hidden = false;
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  function closeModal(modal, { restoreFocus = true } = {}) {
    modal.hidden = true;
    const previous = state.lastFocus;
    state.lastFocus = null;
    if (restoreFocus && previous && previous.isConnected && previous.offsetParent !== null) {
      previous.focus({ preventScroll: true });
    }
  }

  function openReceipt({ title, body, total, showQr, primaryLabel, isSale }) {
    state.receiptIsSale = isSale;
    dom.saleSuccess.hidden = !isSale;
    dom.receiptTitle.textContent = title;
    dom.receiptBody.innerHTML = body;
    dom.receiptTotal.textContent = money(total);
    dom.receiptQr.hidden = !showQr;
    dom.receiptPrimary.textContent = primaryLabel;
    openModal(dom.ticketModal, dom.receiptPrimary);
  }

  function showSaleReceipt(sale) {
    const opGravada = round2(sale.total / 1.18);
    const igv = round2(sale.total - opGravada);
    const rows = sale.items.map((it) => `
      <div class="receipt-row"><span>${it.qty}x ${esc(it.name)}</span><span>${money(it.price * it.qty)}</span></div>`).join('');

    openReceipt({
      title: `BOLETA ELECTRÓNICA ${sale.voucher}`,
      body: `
        <div class="receipt-row receipt-row--meta"><span>FECHA: ${esc(sale.date)}</span><span>HORA: ${esc(sale.time)}</span></div>
        <div class="receipt-row receipt-row--meta"><span>TIPO PAGO:</span><b>${esc(sale.method)}</b></div>
        <div class="receipt-divider"></div>
        <div class="receipt-row receipt-row--head"><span>CANT / DESCRIPCIÓN</span><span>IMPORTE</span></div>
        ${rows}
        <div class="receipt-divider"></div>
        <div class="receipt-row receipt-row--meta"><span>OP. GRAVADA:</span><span>${money(opGravada)}</span></div>
        <div class="receipt-row receipt-row--meta"><span>IGV (18%):</span><span>${money(igv)}</span></div>`,
      total: sale.total,
      showQr: true,
      primaryLabel: '✅ LISTO · NUEVA VENTA',
      isSale: true,
    });
  }

  function cashTotals() {
    let cash = 0;
    let yape = 0;
    state.sales.forEach((sale) => {
      if (sale.method === 'EFECTIVO') cash += sale.total;
      else yape += sale.total;
    });
    return { cash: round2(cash), yape: round2(yape), total: round2(cash + yape), count: state.sales.length };
  }

  function showCashClosingTicket() {
    const totals = cashTotals();
    const now = new Date();
    openReceipt({
      title: 'CORTE / CIERRE DIARIO DE CAJA',
      body: `
        <div class="receipt-row receipt-row--meta"><span>FECHA CIERRE:</span><span>${now.toLocaleDateString('es-PE')}</span></div>
        <div class="receipt-row receipt-row--meta"><span>HORA CIERRE:</span><span>${clockTime(now)}</span></div>
        <div class="receipt-row receipt-row--meta"><span>CAJERO:</span><span>TURNO MAÑANA</span></div>
        <div class="receipt-divider"></div>
        <div class="receipt-section">RESUMEN DE INGRESOS:</div>
        <div class="receipt-row"><span>💵 Efectivo en gaveta:</span><span>${money(totals.cash)}</span></div>
        <div class="receipt-row"><span>📱 Yape / Plin confirmados:</span><span>${money(totals.yape)}</span></div>
        <div class="receipt-divider"></div>
        <div class="receipt-row"><span>Comprobantes emitidos:</span><span>${plural(totals.count, 'boleta', 'boletas')}</span></div>
        <div class="receipt-row"><span>Comprobantes anulados:</span><span>${plural(state.voidedCount, 'nota de crédito', 'notas de crédito')}</span></div>
        <div class="receipt-divider"></div>
        <p class="receipt-note">--- CUADRE CONFORME ---</p>`,
      total: totals.total,
      showQr: false,
      primaryLabel: 'CERRAR VISTA PREVIA',
      isSale: false,
    });
  }

  function closeReceipt({ goHome = true } = {}) {
    const wasSale = state.receiptIsSale;
    state.receiptIsSale = false;
    closeModal(dom.ticketModal, { restoreFocus: !wasSale });
    if (!wasSale) return;
    // Tras una venta: carrito limpio y de vuelta al inicio, listo para el siguiente cliente
    state.cart = [];
    dom.productSearch.value = '';
    renderCart();
    if (goHome) {
      navigateTo('screen-vica');
      $('#screen-vica .card-v', dom.app).focus({ preventScroll: true });
    }
  }

  /* ---------- 8. Inventario ---------- */
  function updateInventoryStats() {
    dom.statItems.textContent = state.inventory.length;
    dom.statUnits.textContent = state.inventory.reduce((sum, item) => sum + item.stock, 0);
    dom.statLow.textContent = state.inventory.filter((item) => item.stock <= LOW_STOCK).length;
  }

  function stockBadge(stock) {
    if (stock <= 0) return { cls: 'badge-empty', text: 'AGOTADO' };
    if (stock <= LOW_STOCK) return { cls: 'badge-low', text: `⚠️ ${stock} unid.` };
    return { cls: 'badge-ok', text: `${stock} unid.` };
  }

  function renderInventory() {
    const list = filterItems(dom.invSearch.value, state.invCategory);
    renderKeepingFocus(dom.invList, () => {
      dom.invList.innerHTML = list.length
        ? list.map((item) => {
          const badge = stockBadge(item.stock);
          return `
            <button type="button" class="inv-item-row" data-action="show-detail" data-id="${item.id}"${item.id === state.selectedId ? ' aria-current="true"' : ''}>
              <span class="inv-info">
                <span class="inv-name">${esc(item.name)}</span>
                <span class="inv-code">${esc(item.code)} • ${money(item.price)}</span>
              </span>
              <span class="inv-badge ${badge.cls}">${badge.text}</span>
            </button>`;
        }).join('')
        : '<p class="list-empty">No se encontraron productos.</p>';
    });
  }

  function renderStockDetail() {
    const item = state.selectedId != null ? findItem(state.selectedId) : null;
    dom.detailCard.classList.toggle('active', Boolean(item));
    if (!item) return;
    dom.detailCode.textContent = `CÓDIGO: ${item.code}`;
    dom.detailName.textContent = item.name;
    dom.detailQty.textContent = item.stock;
    dom.detailQty.className = `detail-qty${item.stock <= 0 ? ' is-empty' : item.stock <= LOW_STOCK ? ' is-low' : ''}`;
    dom.detailPrice.textContent = `Precio de venta: ${money(item.price)}`;
    dom.detailAdd.setAttribute('aria-disabled', String(item.stock <= 0));
  }

  function showStockDetail(id) {
    state.selectedId = id;
    renderStockDetail();
    renderInventory();
    // En celular la tarjeta aparece sobre la lista: se desplaza el contenido interno para mostrarla
    const mainRect = dom.appMain.getBoundingClientRect();
    const cardRect = dom.detailCard.getBoundingClientRect();
    if (cardRect.top < mainRect.top || cardRect.bottom > mainRect.bottom) {
      dom.appMain.scrollTo({ top: dom.appMain.scrollTop + (cardRect.top - mainRect.top) - 8, behavior: scrollBehavior() });
    }
  }

  function closeStockDetail() {
    state.selectedId = null;
    renderStockDetail();
    renderInventory();
  }

  function addDetailItemToSale() {
    if (state.selectedId == null) return;
    if (addToCart(state.selectedId)) navigateTo('screen-vender');
  }

  function simulateScanInventory() {
    const item = state.inventory[Math.floor(Math.random() * state.inventory.length)];
    showStockDetail(item.id);
    showToast(`📷 Código escaneado: [${item.code}]`);
  }

  /* ---------- 9. Caja ---------- */
  function updateCashView() {
    const totals = cashTotals();
    dom.cashCash.textContent = money(totals.cash);
    dom.cashYape.textContent = money(totals.yape);
    dom.cashVouchers.textContent = plural(totals.count, 'boleta', 'boletas');
    dom.cashTotal.textContent = money(totals.total);
  }

  /* ---------- 10. Anulación ---------- */
  function renderVoidSales() {
    const recent = state.sales.slice(0, VOID_LIMIT);
    dom.voidList.innerHTML = recent.length
      ? recent.map((sale) => `
        <div class="void-item-card">
          <div class="void-info">
            <div class="void-head"><b>${esc(sale.voucher)}</b> · ${esc(sale.time)}</div>
            <div class="void-items">${sale.items.map((it) => `${it.qty}x ${esc(it.name)}`).join(', ')}</div>
            <div class="void-total"><b>${money(sale.total)}</b> · ${esc(sale.method)}</div>
          </div>
          <button type="button" class="btn-void-action" data-action="void-request" data-voucher="${esc(sale.voucher)}">ANULAR</button>
        </div>`).join('')
      : '<p class="void-empty">No hay ventas registradas hoy para anular.</p>';
  }

  function requestVoid(voucher) {
    const sale = state.sales.find((s) => s.voucher === voucher);
    if (!sale) return;
    state.pendingVoid = voucher;
    dom.voidText.innerHTML = `Venta <b>${esc(sale.voucher)}</b> de las ${esc(sale.time)} por <b>${money(sale.total)}</b>.`;
    openModal(dom.voidModal, dom.voidCancel); // el foco inicia en la opción segura
  }

  function cancelVoid() {
    state.pendingVoid = null;
    closeModal(dom.voidModal);
  }

  function confirmVoid() {
    const index = state.sales.findIndex((s) => s.voucher === state.pendingVoid);
    state.pendingVoid = null;
    closeModal(dom.voidModal, { restoreFocus: false });
    if (index === -1) return;

    const [sale] = state.sales.splice(index, 1);
    sale.items.forEach((line) => {
      const item = findItem(line.id);
      if (item) item.stock += line.qty;
    });
    state.voidedCount += 1;
    renderVoidSales();
    const nextFocus = $('.btn-void-action', dom.voidList) || $('#screen-anular .btn-back', dom.app);
    nextFocus.focus({ preventScroll: true });
    showToast(`✅ Venta ${sale.voucher} anulada · nota de crédito emitida`);
  }

  function dismissOverlays() {
    if (!dom.voidModal.hidden) cancelVoid();
    if (!dom.ticketModal.hidden) closeReceipt({ goHome: false });
  }

  /* ---------- 11. Perfil, dispositivo, avisos y reinicio ---------- */
  function setMode(mode) {
    state.mode = mode === 'advisor' ? 'advisor' : 'merchant';
    const isAdvisor = state.mode === 'advisor';
    dom.advisorModal.hidden = !isAdvisor;
    dom.roleBadge.textContent = isAdvisor ? 'MODO ASESOR TÉCNICO' : 'MODO VENDEDOR';
    dom.advisorCount.textContent = state.inventory.length;
    $$('[data-action="set-mode"][aria-pressed]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.mode === state.mode));
    });
    updateTour();
  }

  const DEVICE_CAPTIONS = {
    phone: 'Vista celular · datos ficticios de una tienda en Gamarra',
    tablet: 'Vista tablet horizontal · datos ficticios de una tienda en Gamarra',
    pc: 'Vista PC en el navegador · menú V.I.C.A. fijo a la izquierda · datos ficticios',
  };

  function setDevice(device, { reveal = false } = {}) {
    state.device = DEVICE_CAPTIONS[device] ? device : 'phone';
    dom.hero.dataset.device = state.device;
    ['phone', 'tablet', 'pc'].forEach((d) => dom.device.classList.toggle(`is-${d}`, d === state.device));
    $$('[data-action="set-device"]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.device === state.device));
    });
    dom.stageCaption.textContent = DEVICE_CAPTIONS[state.device];
    if (reveal) requestAnimationFrame(revealDevice);
  }

  let toastTimer = null;
  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => dom.toast.classList.remove('is-visible'), 2600);
  }

  function hideToast() {
    clearTimeout(toastTimer);
    dom.toast.classList.remove('is-visible');
  }

  function resetDemo({ announce = true } = {}) {
    state.inventory = clone(INITIAL_INVENTORY);
    state.sales = clone(INITIAL_SALES);
    state.voidedCount = 0;
    state.cart = [];
    state.voucherCounter = FIRST_VOUCHER;
    state.saleCategory = 'TODOS';
    state.invCategory = 'TODOS';
    state.selectedId = null;
    state.pendingVoid = null;
    state.receiptIsSale = false;

    dom.productSearch.value = '';
    dom.invSearch.value = '';
    dom.ticketModal.hidden = true;
    dom.voidModal.hidden = true;
    renderPills(dom.salePills, state.saleCategory, 'sale-cat');
    renderPills(dom.invPills, state.invCategory, 'inv-cat');
    renderCart();
    setMode('merchant');
    navigateTo('screen-vica');
    if (announce) showToast('Demo reiniciada con los datos de ejemplo');
  }

  /* ---------- 12. Cronograma: marca la fase en curso según la fecha de hoy ---------- */
  function markTimeline() {
    const now = new Date();
    const today = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const toKey = (iso) => Number(iso.split('-').join(''));

    $$('.tl-item', dom.timeline).forEach((item) => {
      const start = toKey(item.dataset.start);
      const end = toKey(item.dataset.end);
      const isCurrent = start <= today && today <= end;
      item.classList.toggle('is-past', end < today);
      item.classList.toggle('is-current', isCurrent);
      if (isCurrent) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');

      const oldBadge = $('.tl-now', item);
      if (oldBadge) oldBadge.remove();
      if (isCurrent) {
        const label = item.classList.contains('tl-item--milestone') ? 'Hoy' : 'En curso';
        $('.tl-title', item).insertAdjacentHTML('beforeend', ` <span class="tl-now">${label}</span>`);
      }
    });
  }

  /* ---------- 13. Eventos e inicio ---------- */
  document.addEventListener('click', (event) => {
    const el = event.target.closest('[data-action]');
    if (!el) return;
    const id = el.dataset.id ? Number(el.dataset.id) : null;

    switch (el.dataset.action) {
      case 'nav': navigateTo(el.dataset.target); break;
      case 'tour': goToTourStep(el.dataset.key); break;
      case 'set-mode': setMode(el.dataset.mode); break;
      case 'set-device': setDevice(el.dataset.device, { reveal: true }); break;
      case 'reset-demo': resetDemo(); break;
      case 'sale-cat':
        state.saleCategory = el.dataset.cat;
        setPillPressed(dom.salePills, state.saleCategory);
        renderProducts();
        break;
      case 'inv-cat':
        state.invCategory = el.dataset.cat;
        setPillPressed(dom.invPills, state.invCategory);
        renderInventory();
        break;
      case 'add-to-cart': addToCart(id); break;
      case 'qty': changeQty(id, Number(el.dataset.delta)); break;
      case 'scan-sale': simulateScanSale(); break;
      case 'scan-inv': simulateScanInventory(); break;
      case 'pay': processPayment(el.dataset.method); break;
      case 'show-detail': showStockDetail(id); break;
      case 'close-detail': closeStockDetail(); break;
      case 'detail-to-sale': addDetailItemToSale(); break;
      case 'print-cash': showCashClosingTicket(); break;
      case 'close-receipt': closeReceipt(); break;
      case 'void-request': requestVoid(el.dataset.voucher); break;
      case 'void-confirm': confirmVoid(); break;
      case 'void-cancel': cancelVoid(); break;
      default: break;
    }
  });

  dom.productSearch.addEventListener('input', renderProducts);
  dom.invSearch.addEventListener('input', renderInventory);

  // Esc cierra la capa superior: confirmación → ticket → modo asesor
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!dom.voidModal.hidden) cancelVoid();
    else if (!dom.ticketModal.hidden) closeReceipt();
    else if (state.mode === 'advisor') setMode('merchant');
  });

  // Cada vista solo existe donde cabe: tablet desde 800 px y PC desde 1200 px de ventana.
  // Si la ventana se achica, se baja a la vista más grande que todavía entra.
  const tabletQuery = window.matchMedia('(min-width: 800px)');
  const pcQuery = window.matchMedia('(min-width: 1200px)');
  function enforceDeviceFit() {
    if (state.device === 'pc' && !pcQuery.matches) setDevice(tabletQuery.matches ? 'tablet' : 'phone');
    else if (state.device === 'tablet' && !tabletQuery.matches) setDevice('phone');
  }
  tabletQuery.addEventListener('change', enforceDeviceFit);
  pcQuery.addEventListener('change', enforceDeviceFit);

  function tickClock() { dom.clock.textContent = clockTime(); }

  renderTour();
  resetDemo({ announce: false });
  setDevice('phone');
  markTimeline();
  tickClock();
  setInterval(tickClock, 30000);
})();
