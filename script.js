/* ============================================================
   DONE RIGHT PLUMBING — script.js
   Scroll animations, sticky nav, FAQ accordion, mobile bar
   ============================================================ */

(function () {
  'use strict';

  /* ── SCROLL ANIMATIONS ────────────────────────────────────── */
  function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(el.getAttribute('data-delay') || '0', 10);
            setTimeout(function () {
              el.classList.add('is-visible');
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ── STICKY NAV ───────────────────────────────────────────── */
  function initStickyNav() {
    var nav = document.getElementById('mainNav');
    if (!nav) return;

    var lastScroll = 0;
    var ticking = false;

    function updateNav() {
      var scrollY = window.scrollY || window.pageYOffset;
      if (scrollY > 60) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── FAQ ACCORDION ────────────────────────────────────────── */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      var answer = item.querySelector('.faq-a');
      if (!btn || !answer) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all open items
        items.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('is-open');
            var otherBtn = other.querySelector('.faq-q');
            var otherA = other.querySelector('.faq-a');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherA) {
              otherA.hidden = true;
            }
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          answer.hidden = true;
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
          answer.hidden = false;
        }
      });
    });
  }

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ──────────────────────── */
  function initSmoothScroll() {
    var navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '68',
      10
    );

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── MOBILE CALL BAR HIDE ON SCROLL UP ───────────────────── */
  function initMobileCallBar() {
    var bar = document.getElementById('mobileCallBar');
    if (!bar) return;

    var lastScrollY = window.scrollY;
    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var currentY = window.scrollY;
          // Show bar after scrolling past hero
          if (currentY > 300) {
            bar.style.transform = 'translateY(0)';
          } else {
            bar.style.transform = 'translateY(100%)';
          }
          lastScrollY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    // Start hidden, animate in after scroll
    bar.style.transform = 'translateY(100%)';
    bar.style.transition = 'transform 0.3s ease';
  }

  /* ── HERO STAGGER ON LOAD ─────────────────────────────────── */
  function initHeroAnimation() {
    // Hero elements animate on load, not on scroll
    var heroEls = document.querySelectorAll('.hero [data-animate]');
    heroEls.forEach(function (el) {
      var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
      setTimeout(function () {
        el.classList.add('is-visible');
      }, 200 + delay);
    });
  }

  /* ── PHONE LINK TRACKING PLACEHOLDER ─────────────────────── */
  function initPhoneTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
      link.addEventListener('click', function () {
        // Ready for Google Analytics or GTM event:
        // gtag('event', 'phone_call_click', { event_category: 'CTA', event_label: 'done_right_plumbing' });
      });
    });
  }

  /* ── INIT ALL ─────────────────────────────────────────────── */
  function init() {
    initHeroAnimation();
    initScrollAnimations();
    initStickyNav();
    initFaq();
    initSmoothScroll();
    initMobileCallBar();
    initPhoneTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
