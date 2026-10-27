/**
 * WALQUIRIA RUIZ ATELIER — INTERACTIVE SCRIPTS
 * Mobile-First Drawer, Category Filtering, Lightbox & WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const siteHeader = document.getElementById('siteHeader');
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('[data-close-drawer]');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const editorialCards = document.querySelectorAll('.editorial-card');
  const bookingForm = document.getElementById('bookingForm');
  const formFeedback = document.getElementById('formFeedback');
  const currentYearSpan = document.getElementById('currentYear');
  
  // Lightbox elements
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  // --- Dynamic Year ---
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- 1. Sticky Header with Elevation on Scroll ---
  const handleScroll = () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. Mobile Drawer Navigation ---
  const toggleMobileDrawer = (open) => {
    const shouldOpen = open !== undefined ? open : !mobileDrawer.classList.contains('active');
    
    if (shouldOpen) {
      burgerBtn.classList.add('active');
      mobileDrawer.classList.add('active');
      burgerBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    } else {
      burgerBtn.classList.remove('active');
      mobileDrawer.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
    }
  };

  if (burgerBtn && mobileDrawer) {
    burgerBtn.addEventListener('click', () => toggleMobileDrawer());

    // Close when clicking links
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileDrawer(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (mobileDrawer.classList.contains('active')) toggleMobileDrawer(false);
        if (lightboxModal.classList.contains('active')) closeLightbox();
      }
    });
  }

  // --- 3. Category Filter Tabs ---
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update active tab state
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      editorialCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 4. Lightbox Modal for Editorial Portfolio ---
  const openLightbox = (card) => {
    const imgSrc = card.getAttribute('data-img');
    const title = card.getAttribute('data-title');
    const desc = card.getAttribute('data-desc');

    if (imgSrc && lightboxModal) {
      lightboxImg.src = imgSrc;
      lightboxImg.alt = title || 'Criação Walquiria Ruiz';
      lightboxTitle.textContent = title || '';
      lightboxDesc.textContent = desc || '';

      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
    }
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');
      setTimeout(() => {
        lightboxImg.src = '';
      }, 300);
    }
  };

  editorialCards.forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
  });

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // --- 5. Booking Form & WhatsApp Direct Dispatch ---
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('userName').value.trim();
      const whatsapp = document.getElementById('userWhatsapp').value.trim();
      const pieceType = document.getElementById('pieceType').value;
      const preferredDate = document.getElementById('preferredDate').value;
      const notes = document.getElementById('userNotes').value.trim();

      // Basic validation
      if (!name || !whatsapp) {
        formFeedback.textContent = 'Por favor, informe seu nome e telefone WhatsApp para contato.';
        formFeedback.className = 'form-feedback success';
        formFeedback.style.borderColor = '#c0392b';
        formFeedback.style.color = '#c0392b';
        return;
      }

      // Format WhatsApp text
      let message = `Olá, Walquiria! Meu nome é *${name}*. Gostaria de solicitar um agendamento para uma consulta exclusiva no atelier.\n\n`;
      message += `✦ *Criação Desejada:* ${pieceType}\n`;
      if (preferredDate) {
        const formattedDate = preferredDate.split('-').reverse().join('/');
        message += `✦ *Previsão/Data do Evento:* ${formattedDate}\n`;
      }
      message += `✦ *Meu WhatsApp:* ${whatsapp}\n`;
      if (notes) {
        message += `✦ *Observações:* ${notes}\n`;
      }
      message += `\nAguardo seu retorno para alinharmos os melhores horários disponíveis.`;

      // Direct WhatsApp link
      const phoneParam = '5511951312765'; // Número oficial do atelier Walquiria Ruiz
      const encodedMsg = encodeURIComponent(message);
      const waUrl = `https://wa.me/${phoneParam}?text=${encodedMsg}`;

      // Feedback message
      formFeedback.textContent = 'Solicitação formulada com sucesso! Redirecionando para o WhatsApp do Atelier...';
      formFeedback.className = 'form-feedback success';
      formFeedback.style.borderColor = 'var(--color-gold)';
      formFeedback.style.color = 'var(--color-navy)';

      // Open WhatsApp in new tab
      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 700);
    });
  }

  // --- 6. Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });
});
