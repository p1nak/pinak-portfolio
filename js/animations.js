/**
 * ADVANCED MOTION & ANIMATIONS ENGINE — PINAK CHAUHAN PORTFOLIO
 * Features:
 * - Lenis studio-grade inertia smooth scrolling
 * - Kinetic clipping line reveals (GSAP power4.out)
 * - Physics-based 3D card tilt with dynamic specular sheen
 * - Dynamic metric number counter interpolation
 * - Staggered toolkit pills & project card entry cascades
 * - High-efficiency requestAnimationFrame loops with reduced-motion support
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lenis = null;
  const preloader = document.getElementById('preloader');
  const words = ['THINK', 'BUILD', 'LEARN', 'CREATE'];
  let currentWordIdx = 0;
  const wordContainer = document.getElementById('preloader-word-element');
  const progressBar = document.getElementById('preloader-progress-bar');

  // Initialize Lenis Smooth Scrolling
  function initLenis() {
    if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
      try {
        lenis = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 0.95,
          touchMultiplier: 1.5
        });
        window.lenis = lenis;

        if (window.gsap && window.ScrollTrigger) {
          lenis.on('scroll', ScrollTrigger.update);
          gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
          });
          gsap.ticker.lagSmoothing(0);
        } else {
          const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
          };
          requestAnimationFrame(raf);
        }
      } catch (e) {
        console.warn('Lenis initialization bypassed:', e);
      }
    }
  }

  // Preloader Sequence
  function initPreloader() {
    if (prefersReducedMotion || !preloader || !wordContainer) {
      dismissPreloader();
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progressBar) progressBar.style.width = `${progress}%`;

      if (progress % 25 === 0 && currentWordIdx < words.length) {
        cycleWord(words[currentWordIdx]);
        currentWordIdx++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(dismissPreloader, 260);
      }
    }, 35);
  }

  function cycleWord(text) {
    if (!wordContainer) return;

    const span = document.createElement('span');
    span.className = 'preloader-word';
    span.textContent = text;
    wordContainer.appendChild(span);

    requestAnimationFrame(() => {
      span.classList.add('active');
    });

    const existingSpans = wordContainer.querySelectorAll('.preloader-word');
    if (existingSpans.length > 1) {
      existingSpans[0].classList.remove('active');
      existingSpans[0].classList.add('exit');
      setTimeout(() => {
        if (existingSpans[0] && existingSpans[0].parentNode) {
          existingSpans[0].parentNode.removeChild(existingSpans[0]);
        }
      }, 350);
    }
  }

  function dismissPreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    const modalOpen = document.getElementById('project-modal')?.classList.contains('active');
    if (!modalOpen) {
      document.body.style.overflow = '';
    }
    initLenis();
    initScrollAnimations();
    initCard3DTilt();
    initCustomCursor();
    initMagneticButtons();
    document.dispatchEvent(new CustomEvent('portfolio:preloader-done'));
  }

  // Master Scroll & Entrance Animations
  function initScrollAnimations() {
    if (window.gsap && !prefersReducedMotion) {
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
      }

      // 1. Kinetic Hero Split-Line Reveal
      gsap.to('.split-line-inner', {
        y: '0%',
        opacity: 1,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power4.out',
        delay: 0.05
      });

      // 2. Hero Content Progressive Cascade (fromTo guarantees opacity: 1 completion)
      gsap.fromTo('.hero-bio',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.14, clearProps: 'transform,opacity' }
      );

      gsap.fromTo('.hero-details-row',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.2, clearProps: 'transform,opacity' }
      );

      gsap.fromTo('.hero-actions',
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', delay: 0.26, clearProps: 'transform,opacity' }
      );

      // 3. Hero Portrait Subtle Lift & Zoom-in (never gated behind below-fold reveal-fade)
      gsap.fromTo('.hero-portrait-frame',
        { scale: 0.94, y: 20, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.72,
          ease: 'expo.out',
          delay: 0.12,
          clearProps: 'transform,opacity',
          onComplete: () => {
            document.querySelector('.hero-portrait-frame')?.classList.add('is-revealed');
          }
        }
      );

      // 4. Section Headers Scrubbed Reveal
      if (window.ScrollTrigger) {
        gsap.utils.toArray('.section-header').forEach((header) => {
          gsap.from(header, {
            scrollTrigger: {
              trigger: header,
              start: 'top 88%',
              toggleActions: 'play none none none',
              onEnter: () => header.classList.add('is-revealed')
            },
            y: 32,
            opacity: 0,
            duration: 0.85,
            ease: 'power3.out'
          });
        });

        // 5. About Section Principles Cards Stagger
        const principles = document.querySelectorAll('.principle-card');
        if (principles.length) {
          gsap.from(principles, {
            scrollTrigger: {
              trigger: '.about-principles-grid',
              start: 'top 85%'
            },
            y: 24,
            opacity: 0,
            stagger: 0.1,
            duration: 0.75,
            ease: 'power3.out'
          });
        }

        // 6. Toolkit Category Cards & Pills Wave
        gsap.utils.toArray('.toolkit-category-card').forEach((catCard) => {
          const pills = catCard.querySelectorAll('.toolkit-pill');
          ScrollTrigger.create({
            trigger: catCard,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.from(pills, {
                scale: 0.85,
                opacity: 0,
                y: 10,
                duration: 0.45,
                stagger: 0.03,
                ease: 'back.out(1.6)'
              });
            }
          });
        });

        // 7. Interactive Numerical Counters
        initMetricCounters();
      }
    } else {
      // Fallback if GSAP is unavailable
      document.querySelectorAll('.split-line-inner').forEach((el) => {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
      document.querySelector('.hero-portrait-frame')?.classList.add('is-revealed');
    }

    // Standard IntersectionObserver for general .reveal-fade items
    initIntersectionObservers();
  }

  // Smooth Metric Counters
  function initMetricCounters() {
    if (!window.ScrollTrigger) return;

    const metricItems = document.querySelectorAll('.edu-metric-val, .metric-strip-value');
    metricItems.forEach((el) => {
      if (el.dataset.counterBound === 'true') return;
      el.dataset.counterBound = 'true';

      const originalText = el.textContent.trim();
      // Detect numbers like 91.20%, 0.939, 85.6%, 7.22, 5,000, 32,416
      const match = originalText.match(/^([^\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/);
      if (!match) return;

      const prefix = match[1];
      const rawNumStr = match[2].replace(/,/g, '');
      const numVal = parseFloat(rawNumStr);
      const suffix = match[3];
      const hasComma = match[2].includes(',');
      const decimals = rawNumStr.includes('.') ? rawNumStr.split('.')[1].length : 0;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 95%',
        once: true,
        onEnter: () => {
          const counterObj = { current: 0 };
          gsap.to(counterObj, {
            current: numVal,
            duration: 1.35,
            ease: 'power2.out',
            onUpdate: () => {
              let formatted = counterObj.current.toFixed(decimals);
              if (hasComma) {
                const parts = formatted.split('.');
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                formatted = parts.join('.');
              }
              el.textContent = `${prefix}${formatted}${suffix}`;
            }
          });
        }
      });
    });
  }

  // Custom Desktop Cursor (Fine pointers only, powered by GSAP quickTo)
  function initCustomCursor() {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion || typeof window.gsap === 'undefined') return;

    const cursorRoot = document.getElementById('custom-cursor');
    if (!cursorRoot || cursorRoot.dataset.cursorBound === 'true') return;
    cursorRoot.dataset.cursorBound = 'true';

    const dot = cursorRoot.querySelector('.cursor-dot');
    const ring = cursorRoot.querySelector('.cursor-ring');
    const labelEl = cursorRoot.querySelector('.cursor-label');
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.34, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.34, ease: 'power3.out' });

    let isVisible = false;
    let lastTarget = null;

    window.addEventListener('mousemove', (e) => {
      if (!isVisible) {
        isVisible = true;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        document.body.classList.add('has-custom-cursor');
        cursorRoot.classList.add('is-visible');
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const target = e.target;
      if (!(target instanceof Element) || target === lastTarget) return;
      lastTarget = target;

      const isTextControl = Boolean(target.closest('input, textarea, select'));
      cursorRoot.classList.toggle('is-text-input', isTextControl);

      const onDarkSurface = Boolean(
        target.closest('.section-dark, .site-footer, .project-visual-preview, .flagship-visual-frame, .about-visual-card, .modal-architecture-box')
      );
      cursorRoot.classList.toggle('is-on-dark', onDarkSurface);

      if (isTextControl) {
        cursorRoot.classList.remove('is-hovering', 'has-label');
        return;
      }

      const labelTarget = target.closest('[data-cursor-label]');
      const interactiveTarget = target.closest('a, button, .filter-btn, .toolkit-pill, .flagship-panel');

      if (labelTarget && labelEl) {
        const txt = labelTarget.getAttribute('data-cursor-label');
        if (txt) {
          labelEl.textContent = txt;
          cursorRoot.classList.add('has-label', 'is-hovering');
          return;
        }
      }

      cursorRoot.classList.remove('has-label');
      cursorRoot.classList.toggle('is-hovering', Boolean(interactiveTarget));
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      lastTarget = null;
      cursorRoot.classList.remove('is-visible');
    });

    document.addEventListener('mousedown', () => {
      cursorRoot.classList.add('is-pressed');
    }, { passive: true });

    document.addEventListener('mouseup', () => {
      cursorRoot.classList.remove('is-pressed');
    }, { passive: true });
  }

  // Magnetic Button Attraction Physics (Desktop fine pointers, clamped & duplicate-safe)
  function initMagneticButtons() {
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isFinePointer || prefersReducedMotion || typeof window.gsap === 'undefined') return;

    const candidates = document.querySelectorAll('.btn, .btn-icon, .brand-glyph, .back-to-top');

    candidates.forEach((el) => {
      if (el.dataset.magneticBound === 'true') return;
      if (el.classList.contains('no-magnetic')) return;

      el.dataset.magneticBound = 'true';
      el.classList.add('is-magnetic');

      const xTo = gsap.quickTo(el, 'x', { duration: 0.42, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.42, ease: 'power3.out' });

      const isCompact = el.classList.contains('btn-icon') || el.classList.contains('brand-glyph') || el.classList.contains('back-to-top');
      const maxShift = isCompact ? 5 : 7;

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        // Skip wide full-width mobile/form controls to avoid awkward shift
        if (!rect.width || rect.width > 320) return;

        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;

        const moveX = Math.max(-maxShift, Math.min(maxShift, relX * maxShift * 2));
        const moveY = Math.max(-maxShift, Math.min(maxShift, relY * maxShift * 2));

        xTo(moveX);
        yTo(moveY);
      }, { passive: true });

      el.addEventListener('mouseleave', () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.55,
          ease: 'elastic.out(1, 0.45)',
          overwrite: 'auto'
        });
      }, { passive: true });
    });
  }

  // Physics-Based 3D Card Tilt with Specular Glare
  function initCard3DTilt() {
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isCoarsePointer) return;
    const cards = document.querySelectorAll('.hero-portrait-frame, .interactive-card');

    cards.forEach((card) => {
      if (card.dataset.tiltBound === 'true') return;
      card.dataset.tiltBound = 'true';
      let rect = null;
      let targetX = 0, targetY = 0;
      let currentX = 0, currentY = 0;
      let isHovering = false;
      let rafId = null;

      function renderTilt() {
        if (!isHovering && Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01) {
          card.style.transform = '';
          rafId = null;
          return;
        }

        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;

        // Max rotation 8 degrees
        const tiltX = (-currentY * 8).toFixed(2);
        const tiltY = (currentX * 8).toFixed(2);

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;

        rafId = requestAnimationFrame(renderTilt);
      }

      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
        isHovering = true;
        if (!rafId) rafId = requestAnimationFrame(renderTilt);
      }, { passive: true });

      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;

        targetX = Math.max(-0.5, Math.min(0.5, normX));
        targetY = Math.max(-0.5, Math.min(0.5, normY));

        card.style.setProperty('--mouse-x', `${((normX + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${((normY + 0.5) * 100).toFixed(1)}%`);
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        isHovering = false;
        targetX = 0;
        targetY = 0;
      }, { passive: true });
    });
  }

  // IntersectionObserver for General Fade Reveals
  function initIntersectionObservers() {
    const revealElements = document.querySelectorAll('.reveal-fade');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
      });

      revealElements.forEach((el) => observer.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
    }
  }

  // Prevent scroll during preloader
  if (preloader && !prefersReducedMotion) {
    document.body.style.overflow = 'hidden';
  }

  // Expose global initializers for dynamically injected cards & magnetic controls
  window.reinitCard3DTilt = initCard3DTilt;
  window.reinitMagneticElements = initMagneticButtons;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
