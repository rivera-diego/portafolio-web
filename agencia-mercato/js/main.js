document.addEventListener('DOMContentLoaded', () => {
  // --- Sticky Header Scroll ---
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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
  }

  // --- Itinerary Step Accordion (destinos.html & fulldays.html) ---
  const itinerarySteps = document.querySelectorAll('.itinerary-step');
  
  itinerarySteps.forEach(step => {
    const stepHeader = step.querySelector('.itinerary-step-header');
    if (stepHeader) {
      stepHeader.addEventListener('click', () => {
        const isActive = step.classList.contains('active');
        
        // Find sibling steps in the same timeline and close them
        const parentTimeline = step.closest('.itinerary-timeline');
        if (parentTimeline) {
          parentTimeline.querySelectorAll('.itinerary-step').forEach(s => {
            s.classList.remove('active');
          });
        }
        
        if (!isActive) {
          step.classList.add('active');
        }
      });
    }
  });

  // --- Destinations Tabs Switcher (destinos.html) ---
  const tabBtns = document.querySelectorAll('.dest-tab-btn');
  const tabPanels = document.querySelectorAll('.dest-tab-panel');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // --- Booking Panel Interactions (reservar.html) ---
  const bookingTourSelect = document.getElementById('booking-tour');
  const passengersInput = document.getElementById('passengers');
  const totalPriceSpan = document.getElementById('calc-total-price');
  
  // Pricing Index for tours
  const tourPrices = {
    'cusco': 1200,
    'mancora': 950,
    'lunahuana': 85,
    'paracas': 150,
    'churin': 90
  };

  const updateBookingTotal = () => {
    if (!bookingTourSelect || !passengersInput || !totalPriceSpan) return;
    
    const selectedTour = bookingTourSelect.value;
    const numPassengers = parseInt(passengersInput.value) || 1;
    const pricePerPerson = tourPrices[selectedTour] || 0;
    
    const total = pricePerPerson * numPassengers;
    totalPriceSpan.textContent = `S/ ${total.toLocaleString()}`;
  };

  if (bookingTourSelect && passengersInput) {
    bookingTourSelect.addEventListener('change', updateBookingTotal);
    passengersInput.addEventListener('input', updateBookingTotal);
    
    // Parse URL parameters to auto-select tour package
    const urlParams = new URLSearchParams(window.location.search);
    const tourParam = urlParams.get('tour');
    if (tourParam && tourPrices[tourParam]) {
      bookingTourSelect.value = tourParam;
    }
    
    updateBookingTotal();
  }

  // --- Checkout Pasarela Tabs Switcher (reservar.html) ---
  const paymentTabBtns = document.querySelectorAll('.payment-tab-btn');
  const paymentPanels = document.querySelectorAll('.payment-panel');

  if (paymentTabBtns.length > 0) {
    paymentTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        paymentTabBtns.forEach(b => b.classList.remove('active'));
        paymentPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetId = btn.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // --- Form submission simulations ---
  const culqiForm = document.getElementById('culqi-payment-form');
  const paypalForm = document.getElementById('paypal-payment-form');

  // Culqi checkout validation
  if (culqiForm) {
    culqiForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect passenger and ticket info
      const fullname = document.getElementById('fullname').value.trim();
      const documentNumber = document.getElementById('document-id').value.trim();
      const tourName = bookingTourSelect.options[bookingTourSelect.selectedIndex].text;
      const passengersCount = passengersInput.value;
      const travelDate = document.getElementById('travel-date').value;
      const totalCost = totalPriceSpan.textContent;

      // Card validation
      const cardNumber = document.getElementById('card-number').value.trim();
      const cardCvv = document.getElementById('card-cvv').value.trim();

      if (cardNumber.length < 16) {
        alert('Por favor, ingrese un número de tarjeta válido de 16 dígitos.');
        return;
      }
      if (cardCvv.length < 3) {
        alert('Por favor, ingrese un código de seguridad (CVV) válido.');
        return;
      }

      alert(`¡PAGO PROCESADO CON ÉXITO VÍA CULQI!\n\nSe ha reservado el paquete "${tourName}" para ${passengersCount} personas el día ${travelDate}.\n\nTitular: ${fullname}\nDoc: ${documentNumber}\nMonto Debitado: ${totalCost}\n\nSe le ha enviado un boleto digital a su correo. ¡Buen viaje!`);
      
      culqiForm.reset();
      const passengerForm = document.getElementById('passenger-form');
      if (passengerForm) passengerForm.reset();
      updateBookingTotal();
    });
  }

  // Paypal checkout simulation
  if (paypalForm) {
    paypalForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullname = document.getElementById('fullname').value.trim();
      const documentNumber = document.getElementById('document-id').value.trim();
      const tourName = bookingTourSelect.options[bookingTourSelect.selectedIndex].text;
      const passengersCount = passengersInput.value;
      const travelDate = document.getElementById('travel-date').value;
      const totalCost = totalPriceSpan.textContent;

      alert(`¡PAGO AUTORIZADO CON ÉXITO VÍA PAYPAL!\n\nSe ha reservado el paquete "${tourName}" para ${passengersCount} personas el día ${travelDate}.\n\nTitular: ${fullname}\nDoc: ${documentNumber}\nMonto Debitado: ${totalCost}\n\nEnlace de confirmación emitido. ¡Buen viaje!`);

      paypalForm.reset();
      const passengerForm = document.getElementById('passenger-form');
      if (passengerForm) passengerForm.reset();
      updateBookingTotal();
    });
  }
});
