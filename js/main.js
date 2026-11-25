/**
 * MAIN LOGIC & INTERACTIONS — PINAK CHAUHAN PORTFOLIO
 * High-performance, debounced navigation spy, Lenis smooth anchor links,
 * mobile menu, clipboard copy, live IST clock, and validated contact dispatcher.
 */

(function () {
  'use strict';

  // Cached DOM Elements
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('back-to-top');
  const toastNotice = document.getElementById('toast-notice');
  const toastMessage = document.getElementById('toast-message');
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const localTimeDisplay = document.getElementById('local-time-ticker');
  const contactForm = document.getElementById('contact-form');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  let isScrollTicking = false;
  let toastTimer = null;
  let sectionMetrics = [];
  let lastActiveNavId = null;
  let lastBackToTopVisible = null;
  let closeMobileMenuRef = null;
  let closeTooltipsRef = null;

  function init() {
    setupMobileMenu();
    setupSmoothAnchors();
    setupUnifiedScrollWatcher();
    setupBackToTopAction();
    setupClipboardActions();
    setupLiveClock();
    setupContactForm();
    setupToolkitTooltips();
    setupGlobalKeyShortcuts();
  }

  function setupGlobalKeyShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (closeMobileMenuRef && mobileMenu?.classList.contains('open')) {
        closeMobileMenuRef();
        mobileToggle?.focus();
      }
      if (closeTooltipsRef) closeTooltipsRef();
    });
  }

  // Mobile Menu Toggle
  function setupMobileMenu() {
    if (!mobileToggle || !mobileMenu) return;

    function closeMobileMenu() {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileToggle.classList.remove('active');
      mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    closeMobileMenuRef = closeMobileMenu;

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenuLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    const desktopMedia = window.matchMedia('(min-width: 992px)');
    const handleViewportChange = (e) => {
      if (e.matches && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    };
    if (desktopMedia.addEventListener) {
      desktopMedia.addEventListener('change', handleViewportChange);
    } else if (desktopMedia.addListener) {
      desktopMedia.addListener(handleViewportChange);
    }
  }

  // Smooth Lenis Anchor Scrolling
  function setupSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (!target) return;

        // If Lenis is globally available, scroll smoothly with offset
        if (window.lenis) {
          e.preventDefault();
          window.lenis.scrollTo(target, { offset: -64, duration: 1.15 });
        }
      });
    });
  }

  // Unified requestAnimationFrame Scroll Watcher (Cached Metrics -> Zero Scroll Layout Reads)
  function cacheSectionMetrics() {
    sectionMetrics = sections.map((sec) => ({
      id: sec.getAttribute('id'),
      top: sec.offsetTop
    }));
  }

  function setupUnifiedScrollWatcher() {
    cacheSectionMetrics();

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cacheSectionMetrics();
        handleScrollUpdates();
      }, 150);
    }, { passive: true });

    window.addEventListener('load', () => {
      cacheSectionMetrics();
      handleScrollUpdates();
    }, { once: true });

    document.addEventListener('portfolio:layout-changed', () => {
      cacheSectionMetrics();
      handleScrollUpdates();
    });

    window.addEventListener('scroll', () => {
      if (!isScrollTicking) {
        requestAnimationFrame(() => {
          handleScrollUpdates();
          isScrollTicking = false;
        });
        isScrollTicking = true;
      }
    }, { passive: true });

    handleScrollUpdates();
  }

  function handleScrollUpdates() {
    const scrollY = window.scrollY;

    // 1. Back to Top Button Visibility (only mutate DOM on state transition)
    if (backToTopBtn) {
      const shouldShow = scrollY > 400;
      if (shouldShow !== lastBackToTopVisible) {
        lastBackToTopVisible = shouldShow;
        backToTopBtn.classList.toggle('visible', shouldShow);
      }
    }

    // 2. Nav Link Active Spy
    if (!sectionMetrics.length || !navLinks.length) return;
    const probeY = scrollY + 160;
    let matchedId = sectionMetrics[0]?.id || null;

    for (let i = sectionMetrics.length - 1; i >= 0; i--) {
      if (probeY >= sectionMetrics[i].top) {
        matchedId = sectionMetrics[i].id;
        break;
      }
    }

    if (matchedId && matchedId !== lastActiveNavId) {
      lastActiveNavId = matchedId;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${matchedId}`);
      });
    }
  }

  // Back to Top Action
  function setupBackToTopAction() {
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', () => {
      if (window.lenis) {
        window.lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // Clipboard Actions & Toast Notifications
  function setupClipboardActions() {
    copyEmailBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const email = 'pc000060@gmail.com';

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email)
            .then(() => showToast(`Copied to clipboard: ${email}`))
            .catch(() => fallbackCopy(email));
        } else {
          fallbackCopy(email);
        }
      });
    });
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(`Copied to clipboard: ${text}`);
    } catch (err) {
      window.location.href = `mailto:${text}`;
    }
    document.body.removeChild(tempInput);
  }

  function showToast(message) {
    if (!toastNotice || !toastMessage) return;
    clearTimeout(toastTimer);
    toastMessage.textContent = message;
    toastNotice.classList.add('show');

    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // Local Time Clock for Vadodara, Gujarat (IST = UTC+5:30)
  function setupLiveClock() {
    if (!localTimeDisplay) return;

    let formatter = null;
    try {
      formatter = new Intl.DateTimeFormat([], {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    } catch (e) {
      formatter = null;
    }

    let clockTimer = null;

    function updateTime() {
      if (!formatter) {
        localTimeDisplay.textContent = 'Vadodara, Gujarat, IN (IST)';
        return;
      }
      localTimeDisplay.textContent = `${formatter.format(new Date())} IST • Vadodara, Gujarat, IN`;
    }

    function startClock() {
      if (clockTimer) return;
      updateTime();
      clockTimer = setInterval(updateTime, 1000);
    }

    function stopClock() {
      if (clockTimer) {
        clearInterval(clockTimer);
        clockTimer = null;
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopClock();
      else startClock();
    });

    startClock();
  }

  // Functional Contact Form Dispatcher
  function setupContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Preparing Message...`;

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Sender: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:pc000060@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        window.location.href = mailtoUrl;

        showToast('Opening your email client to send message to Pinak...');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Message Prepared ✓`;
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
        }, 3500);
      }, 400);
    });
  }

  // Accessible Tap/Hover/Keyboard Tooltips for Technical Toolkit (Event-Delegated Document Listeners)
  function setupToolkitTooltips() {
    const pills = Array.from(document.querySelectorAll('.toolkit-pill[data-tooltip]'));
    if (!pills.length) return;

    let openPill = null;

    function alignTooltip(pill) {
      const rect = pill.getBoundingClientRect();
      pill.classList.remove('tooltip-align-left', 'tooltip-align-right');
      if (rect.left < 120) {
        pill.classList.add('tooltip-align-left');
      } else if (window.innerWidth - rect.right < 120) {
        pill.classList.add('tooltip-align-right');
      }
    }

    function closeAllTooltips(exceptPill) {
      if (openPill && openPill !== exceptPill) {
        openPill.classList.remove('is-tooltip-open');
        openPill.setAttribute('aria-expanded', 'false');
        openPill = null;
      }
    }
    closeTooltipsRef = () => closeAllTooltips(null);

    function toggleTooltip(pill) {
      const wasOpen = pill.classList.contains('is-tooltip-open');
      closeAllTooltips();
      if (!wasOpen) {
        alignTooltip(pill);
        pill.classList.add('is-tooltip-open');
        pill.setAttribute('aria-expanded', 'true');
        openPill = pill;
      }
    }

    pills.forEach((pill) => {
      if (!pill.hasAttribute('tabindex')) pill.setAttribute('tabindex', '0');
      if (!pill.hasAttribute('role')) pill.setAttribute('role', 'button');
      pill.setAttribute('aria-expanded', 'false');

      pill.addEventListener('mouseenter', () => alignTooltip(pill), { passive: true });
      pill.addEventListener('focus', () => alignTooltip(pill), { passive: true });
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTooltip(pill);
      });
      pill.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTooltip(pill);
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (openPill && !e.target.closest('.toolkit-pill')) {
        closeAllTooltips();
      }
    });
  }

  // Expose toast globally
  window.portfolioShowToast = showToast;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
