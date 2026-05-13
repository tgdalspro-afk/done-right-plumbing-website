 /**
 * Done Right Plumbing — script.js
 * Production-ready JavaScript
 * Handles: nav scroll, mobile menu, reveal animations, mobile call bar
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
     NAVBAR: scroll state + shrink on scroll
  ────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


  /* ──────────────────────────────────────────────
     MOBILE HAMBURGER MENU
  ────────────────────────────────────────────── */
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobile-menu');
  const mobileLinks  = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = hamburger.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close on link click
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        mobileMenu.classList.contains('open') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMenu();
        hamburger.focus();
      }
    });
  }


  /* ──────────────────────────────────────────────
     SMOOTH SCROLL for anchor links (native CSS
     smooth-scroll fallback for older browsers)
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navHeight  = navbar ? navbar.offsetHeight : 0;
      const targetTop  = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });

      // Update URL without triggering scroll
      if (history.pushState) {
        history.pushState(null, null, targetId);
      }
    });
  });


  /* ──────────────────────────────────────────────
     INTERSECTION OBSERVER — scroll reveal
  ────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // once only
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all immediately for older browsers
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ──────────────────────────────────────────────
     MOBILE CALL BAR
     – Show after hero section scrolled past
     – Hide when contact section is visible
  ────────────────────────────────────────────── */
  const mobileCallBar  = document.getElementById('mobile-call-bar');
  const heroSection    = document.querySelector('.hero');
  const contactSection = document.getElementById('contact');

  if (mobileCallBar) {
    function updateCallBar() {
      if (!heroSection) return;

      const heroBottom    = heroSection.getBoundingClientRect().bottom;
      const windowHeight  = window.innerHeight;

      // Show once hero has scrolled out of view
      if (heroBottom < 0) {
        mobileCallBar.classList.remove('hidden');
      } else {
        mobileCallBar.classList.add('hidden');
      }

      // Hide when contact section is fully visible
      if (contactSection) {
        const contactTop = contactSection.getBoundingClientRect().top;
        if (contactTop < windowHeight * 0.5) {
          mobileCallBar.classList.add('hidden');
        }
      }
    }

    // Start hidden
    mobileCallBar.classList.add('hidden');
    window.addEventListener('scroll', updateCallBar, { passive: true });
    updateCallBar();
  }


  /* ──────────────────────────────────────────────
     ACTIVE NAV LINK — highlight based on scroll
  ────────────────────────────────────────────── */
  const sections   = document.querySelectorAll('section[id], div[id="top"]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function updateActiveLink() {
    const scrollPos    = window.scrollY + (navbar ? navbar.offsetHeight + 80 : 80);
    let currentSection = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentSection = section.getAttribute('id');
      }
    });

    navAnchors.forEach(function (link) {
      link.removeAttribute('aria-current');
      const href = link.getAttribute('href');
      if (href === '#' + currentSection) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();


  /* ──────────────────────────────────────────────
     SERVICE CARD — subtle entrance stagger
     (augment CSS delays with JS-controlled ones
      for cards that enter via scroll mid-grid)
  ────────────────────────────────────────────── */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(function (card, i) {
    card.style.transitionDelay = (i % 3) * 0.08 + 's';
  });

  const reviewCards = document.querySelectorAll('.review-card');
  reviewCards.forEach(function (card, i) {
    card.style.transitionDelay = (i % 3) * 0.08 + 's';
  });


  /* ──────────────────────────────────────────────
     PHONE LINK TRACKING (optional GTM / GA4 hook)
     Fires a custom event when user taps any
     phone CTA — wire up to your analytics later.
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (typeof gtag === 'function') {
        gtag('event', 'phone_click', {
          event_category: 'contact',
          event_label: 'Done Right Plumbing CTA',
        });
      }
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
          event: 'phone_click',
          category: 'contact',
          label: 'Done Right Plumbing CTA',
        });
      }
    });
  });


  /* ──────────────────────────────────────────────
     RESIZE HANDLER — close mobile menu on resize
  ────────────────────────────────────────────── */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 640 && mobileMenu && mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    }, 150);
  });


  /* ──────────────────────────────────────────────
     HERO STATS — count-up animation
  ────────────────────────────────────────────── */
  function animateCountUp(el, target, suffix, duration) {
    const start     = 0;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed  = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = eased * target;

      if (suffix === '★') {
        el.textContent = value.toFixed(1) + '★';
      } else if (suffix === '+') {
        el.textContent = Math.round(value) + '+';
      } else {
        el.textContent = Math.round(value) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const statsData = [
    { selector: '.hero-stat:nth-child(1) .hero-stat-num', target: 4.8, suffix: '★', duration: 1600 },
    { selector: '.hero-stat:nth-child(2) .hero-stat-num', target: 27,  suffix: '+', duration: 1400 },
    { selector: '.hero-stat:nth-child(3) .hero-stat-num', target: 20,  suffix: '+', duration: 1200 },
  ];

  let statsAnimated = false;
  const heroStats   = document.querySelector('.hero-stats');

  if (heroStats && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statsData.forEach(function (stat) {
            const el = document.querySelector(stat.selector);
            if (el) {
              setTimeout(function () {
                animateCountUp(el, stat.target, stat.suffix, stat.duration);
              }, 600); // delay until after hero animation
            }
          });
          statsObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(heroStats);
  }

})();
