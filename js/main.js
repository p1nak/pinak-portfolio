/**
 * MAIN LOGIC & INTERACTIONS — PINAK CHAUHAN PORTFOLIO
 * Navigation spy, mobile menu, email clipboard copy, live time ticker,
 * contact form handler, and back-to-top button.
 */

(function () {
  'use strict';

  // DOM Elements
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

  function init() {
    setupMobileMenu();
    setupNavSpy();
    setupBackToTop();
    setupClipboardActions();
    setupLiveClock();
    setupContactForm();
  }

  // Mobile Menu Toggle
  function setupMobileMenu() {
    if (!mobileToggle || !mobileMenu) return;

    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active Navigation Spy on Scroll
  function setupNavSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 140;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  // Back to Top Button
  function setupBackToTop() {
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
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
    toastMessage.textContent = message;
    toastNotice.classList.add('show');

    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  // Local Time Clock for Vadodara, Gujarat (IST = UTC+5:30)
  function setupLiveClock() {
    if (!localTimeDisplay) return;

    function updateTime() {
      try {
        const options = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        };
        const formatter = new Intl.DateTimeFormat([], options);
        const timeStr = formatter.format(new Date());
        localTimeDisplay.textContent = `${timeStr} IST • Vadodara, Gujarat, IN`;
      } catch (e) {
        localTimeDisplay.textContent = `Vadodara, Gujarat, IN (IST)`;
      }
    }

    updateTime();
    setInterval(updateTime, 1000);
  }

  // Functional Contact Form
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

      // Display loading state
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending...`;

      // Construct mailto link with encoded parameters
      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Sender: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:pc000060@gmail.com?subject=${subject}&body=${body}`;

      setTimeout(() => {
        // Open user's email client with pre-filled content
        window.location.href = mailtoUrl;

        showToast('Opening your email client to send message to Pinak...');
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Message Prepared ✓`;
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnText;
        }, 3500);
      }, 500);
    });
  }

  // Expose toast globally if needed
  window.portfolioShowToast = showToast;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
