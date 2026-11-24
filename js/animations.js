/**
 * ANIMATIONS & PRELOADER CONTROLLER — PINAK CHAUHAN PORTFOLIO
 * Implements typography preloader sequence, GSAP/ScrollTrigger section reveals,
 * and IntersectionObserver fallbacks.
 */

(function () {
  'use strict';

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const preloader = document.getElementById('preloader');
  const words = ['THINK', 'BUILD', 'LEARN', 'CREATE'];
  let currentWordIdx = 0;
  const wordContainer = document.getElementById('preloader-word-element');
  const progressBar = document.getElementById('preloader-progress-bar');

  function initPreloader() {
    if (prefersReducedMotion || !preloader || !wordContainer) {
      dismissPreloader();
      initScrollAnimations();
      return;
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      if (progressBar) progressBar.style.width = `${progress}%`;

      // Cycle word every 25%
      if (progress % 25 === 0 && currentWordIdx < words.length) {
        cycleWord(words[currentWordIdx]);
        currentWordIdx++;
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(dismissPreloader, 280);
      }
    }, 40);
  }

  function cycleWord(text) {
    if (!wordContainer) return;
    
    // Create new word element
    const span = document.createElement('span');
    span.className = 'preloader-word';
    span.textContent = text;
    wordContainer.appendChild(span);

    // Trigger active transition
    requestAnimationFrame(() => {
      span.classList.add('active');
    });

    // Clean up previous words
    const existingSpans = wordContainer.querySelectorAll('.preloader-word');
    if (existingSpans.length > 1) {
      existingSpans[0].classList.remove('active');
      existingSpans[0].classList.add('exit');
      setTimeout(() => {
        if (existingSpans[0].parentNode) existingSpans[0].parentNode.removeChild(existingSpans[0]);
      }, 380);
    }
  }

  function dismissPreloader() {
    if (!preloader) return;
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
    initScrollAnimations();
  }

  function initScrollAnimations() {
    // If GSAP and ScrollTrigger are available, use them for refined editorial entrance
    if (window.gsap && window.ScrollTrigger && !prefersReducedMotion) {
      gsap.registerPlugin(ScrollTrigger);

      // Hero content staggered reveal
      gsap.from('.hero-headline', {
        y: 35,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.1
      });

      gsap.from('.hero-bio', {
        y: 25,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.25
      });

      gsap.from('.hero-actions', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.4
      });

      // Section title triggers
      gsap.utils.toArray('.section-header').forEach((header) => {
        gsap.from(header, {
          scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none none'
          },
          y: 30,
          opacity: 0,
          duration: 0.75,
          ease: 'power2.out'
        });
      });
    }

    // Standard IntersectionObserver for all .reveal-fade elements
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
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach((el) => observer.observe(el));
    } else {
      revealElements.forEach((el) => el.classList.add('is-revealed'));
    }
  }

  // Prevent initial scrolling during preloader
  if (preloader && !prefersReducedMotion) {
    document.body.style.overflow = 'hidden';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPreloader);
  } else {
    initPreloader();
  }
})();
