/* =============================================================================
   RHECON B.V. — Main JavaScript
   ============================================================================= */

(function () {
  'use strict';

  /* ─── 1. Header: add shadow on scroll ─── */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── 2. Mobile navigation ─── */
  const toggle   = document.querySelector('.nav-toggle');
  const navMenu  = document.querySelector('.nav-menu');

  if (toggle && navMenu) {
    toggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close when a link is clicked
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ─── 3. Animate on scroll (Intersection Observer) ─── */
  const animateEls = document.querySelectorAll('.animate-fade');
  if (animateEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animateEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show all immediately
    animateEls.forEach((el) => el.classList.add('visible'));
  }

  /* ─── 4. Active nav link ─── */
  const currentPath = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.main-nav a, .nav-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    // Normalise both paths for comparison
    const linkPath = new URL(href, window.location.href).pathname.replace(/\/$/, '');
    if (linkPath === currentPath || (currentPath === '' && linkPath === '/index.html')) {
      link.classList.add('active');
    }
  });

  /* ─── 5. Contact form — client-side UX ─── */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      // If Formspree action is set, let the form submit normally (don't prevent)
      const action = this.getAttribute('action') || '';
      const isFormspree = action.includes('formspree.io');

      if (!isFormspree) {
        // No backend configured — show info message
        e.preventDefault();
        const success = document.querySelector('.form-success');
        if (success) {
          success.style.display = 'block';
          success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        this.reset();
      }
      // If Formspree is configured, the browser submits normally
    });
  }

  /* ─── 6. Smooth anchor scrolling ─── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
          10
        ) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
