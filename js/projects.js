/**
 * PROJECTS SHOWCASE, ARCHIVE & DEEP-LINKING — PINAK CHAUHAN PORTFOLIO
 * Features:
 * - Expandable Flagship Horizontal Showcase (Moodline, Credit Ledger, Gyan Prapti)
 * - Complete 11-project Archive with category filters
 * - Accessible Deep-Dive Modal Drawer with Tab focus trap & Escape closing
 * - Bidirectional URL Deep-Linking (?project=<slug> + browser back/forward navigation)
 */

(function () {
  'use strict';

  const FLAGSHIP_IDS = ['moodline', 'credit-ledger', 'gyan-prapti'];

  let currentCategory = 'all';
  let activeFlagshipId = FLAGSHIP_IDS[0];
  let activeModalProjectId = null;
  let previousActiveElement = null;
  let deepLinkScrollPending = false;
  let filterTimer = null;

  const flagshipContainer = document.getElementById('flagship-accordion');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectsGrid = document.getElementById('projects-grid-container');
  const archiveCountLabel = document.getElementById('archive-count-label');
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDialog = document.getElementById('modal-dialog');
  const preloader = document.getElementById('preloader');

  // Cached modal DOM references (populated once)
  const modalEls = {
    badge: document.getElementById('modal-badge'),
    title: document.getElementById('modal-title'),
    subtitle: document.getElementById('modal-subtitle'),
    description: document.getElementById('modal-description'),
    img: document.getElementById('modal-illustration-img'),
    metrics: document.getElementById('modal-metrics-container'),
    arch: document.getElementById('modal-architecture-text'),
    tech: document.getElementById('modal-tech-tags'),
    disclaimer: document.getElementById('modal-disclaimer'),
    githubBtn: document.getElementById('modal-github-btn'),
    liveBtn: document.getElementById('modal-live-btn')
  };

  const ILLUSTRATION_MAP = {
    'moodline-svg': 'assets/illustrations/moodline.svg',
    'credit-svg': 'assets/illustrations/credit-ledger.svg',
    'airbnb-svg': 'assets/illustrations/nyc-airbnb.svg',
    'gearbox-svg': 'assets/illustrations/gearbox.svg',
    'wellness-svg': 'assets/illustrations/student-wellness.svg',
    'gyan-svg': 'assets/illustrations/gyan-prapti.svg',
    'lstm-svg': 'assets/illustrations/lstm-next-word.svg',
    'placement-svg': 'assets/illustrations/global-placement.svg',
    'stock-svg': 'assets/illustrations/amazon-stock.svg',
    'mlwork-svg': 'assets/illustrations/ml-work.svg',
    'internship-svg': 'assets/illustrations/industrial-internship.svg'
  };

  function init() {
    if (typeof PROJECTS_DATA === 'undefined') {
      console.error('PROJECTS_DATA is missing — verify js/projects-data.js is loaded.');
      return;
    }

    renderFlagshipShowcase();
    renderProjects(currentCategory, false);
    setupFilterEvents();
    setupModalEvents();
    setupDeepLinking();
  }

  /* ========================================================================
     1. EXPANDABLE FLAGSHIP SHOWCASE (MOODLINE, CREDIT LEDGER, GYAN PRAPTI)
     ======================================================================== */
  function renderFlagshipShowcase() {
    if (!flagshipContainer) return;

    const flagshipProjects = FLAGSHIP_IDS
      .map((id) => PROJECTS_DATA.find((p) => p.id === id))
      .filter(Boolean);

    flagshipContainer.innerHTML = '';

    flagshipProjects.forEach((project, idx) => {
      const numLabel = String(idx + 1).padStart(2, '0');
      const isExpanded = project.id === activeFlagshipId;
      const illustrationSrc = ILLUSTRATION_MAP[project.illustration] || 'assets/illustrations/moodline.svg';
      const leadMetric = project.metrics.find((m) => m.highlight) || project.metrics[0];

      const panel = document.createElement('article');
      panel.className = `flagship-panel${isExpanded ? ' is-expanded' : ''}`;
      panel.setAttribute('data-flagship-id', project.id);

      const metricsHtml = project.metrics.slice(0, 3).map((m) => `
        <div class="metric-strip-item ${m.highlight ? 'highlight' : ''}">
          <span class="metric-strip-label">${escapeHtml(m.label)}</span>
          <span class="metric-strip-value">${escapeHtml(m.value)}</span>
        </div>
      `).join('');

      const techHtml = project.techStack.slice(0, 5).map((t) => `
        <span class="tag">${escapeHtml(t)}</span>
      `).join('');

      panel.innerHTML = `
        <button type="button"
                class="flagship-rail"
                aria-expanded="${isExpanded ? 'true' : 'false'}"
                aria-controls="flagship-body-${project.id}"
                data-cursor-label="EXPAND">
          <div class="flagship-rail-top">
            <span class="flagship-num">${numLabel}</span>
            <span class="tag tag-cobalt">${escapeHtml(project.year)}</span>
          </div>

          <div class="flagship-rail-meta">
            <h3 class="flagship-rail-title">${escapeHtml(project.title)}</h3>
            <div class="flagship-rail-subtitle">${escapeHtml(project.badge)}</div>
          </div>

          <div class="flagship-rail-footer">
            <span class="flagship-rail-metric">${leadMetric ? escapeHtml(leadMetric.value) : ''}</span>
            <span class="flagship-rail-cta">
              <span class="flagship-cta-text">${isExpanded ? 'Selected' : 'Inspect'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </span>
          </div>
        </button>

        <div id="flagship-body-${project.id}" class="flagship-expanded-content">
          <div class="flagship-info-col">
            <div class="flagship-expanded-top">
              <span class="flagship-expanded-num">FLAGSHIP ${numLabel} // ${escapeHtml(project.badge.toUpperCase())}</span>
              <span class="tag tag-dark">${escapeHtml(project.year)}</span>
            </div>

            <h3 class="flagship-expanded-title">${escapeHtml(project.title)}</h3>
            <p class="flagship-expanded-subtitle">${escapeHtml(project.subtitle)}</p>
            <p class="flagship-expanded-summary">${escapeHtml(project.summary)}</p>

            <div class="flagship-metrics-row">
              ${metricsHtml}
            </div>

            <div class="project-tech-tags" style="margin-bottom: var(--space-1);">
              ${techHtml}
            </div>

            ${project.disclaimer ? `
              <p class="project-card-disclaimer" style="margin-bottom: 0;">${escapeHtml(project.disclaimer)}</p>
            ` : ''}

            <div class="flagship-actions-row">
              <button type="button" class="btn btn-sm btn-primary flagship-deepdive-btn" data-project-id="${project.id}" data-cursor-label="INSPECT">
                Deep Dive
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
              ${project.githubUrl ? `
                <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary" data-cursor-label="CODE">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  GitHub
                </a>
              ` : ''}
              ${project.liveUrl ? `
                <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary" data-cursor-label="LIVE">
                  Live Demo
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              ` : ''}
            </div>
          </div>

          <div class="flagship-visual-col">
            <div class="flagship-visual-frame">
              <img src="${illustrationSrc}" alt="System architecture visualization for ${escapeHtml(project.title)}" width="480" height="280" loading="lazy" />
            </div>
          </div>
        </div>
      `;

      const railTrigger = panel.querySelector('.flagship-rail');
      if (railTrigger) {
        railTrigger.addEventListener('click', () => {
          expandFlagshipPanel(project.id);
        });
      }

      // Allow clicking anywhere on a desktop contracted panel body to expand it
      panel.addEventListener('click', (e) => {
        if (!panel.classList.contains('is-expanded') && window.innerWidth >= 920) {
          expandFlagshipPanel(project.id);
        }
      });

      const deepDiveBtn = panel.querySelector('.flagship-deepdive-btn');
      if (deepDiveBtn) {
        deepDiveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openProjectModal(project.id, deepDiveBtn);
        });
      }

      flagshipContainer.appendChild(panel);
    });
  }

  function expandFlagshipPanel(projectId) {
    if (!flagshipContainer || activeFlagshipId === projectId) return;
    activeFlagshipId = projectId;

    const panels = flagshipContainer.querySelectorAll('.flagship-panel');
    panels.forEach((p) => {
      const pid = p.getAttribute('data-flagship-id');
      const isMatch = pid === projectId;
      p.classList.toggle('is-expanded', isMatch);

      const rail = p.querySelector('.flagship-rail');
      const ctaText = p.querySelector('.flagship-cta-text');
      if (rail) rail.setAttribute('aria-expanded', isMatch ? 'true' : 'false');
      if (ctaText) ctaText.textContent = isMatch ? 'Selected' : 'Inspect';
    });

    document.dispatchEvent(new CustomEvent('portfolio:layout-changed'));
  }

  /* ========================================================================
     2. PROJECT ARCHIVE GALLERY & FILTERING (ALL 11 PROJECTS)
     ======================================================================== */
  function setupFilterEvents() {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        currentCategory = btn.getAttribute('data-filter') || 'all';
        renderProjects(currentCategory, true);
      });
    });
  }

  function renderProjects(category, animateTransition) {
    if (!projectsGrid || typeof PROJECTS_DATA === 'undefined') return;

    const filtered = category === 'all'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === category);

    if (archiveCountLabel) {
      archiveCountLabel.textContent = `${filtered.length} Verified ${filtered.length === 1 ? 'Build' : 'Builds'}`;
    }

    const performRender = () => {
      const fragment = document.createDocumentFragment();

      filtered.forEach((project) => {
        fragment.appendChild(createProjectCard(project));
      });

      projectsGrid.innerHTML = '';
      projectsGrid.appendChild(fragment);
      projectsGrid.classList.remove('filtering');

      if (animateTransition && window.gsap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(
          projectsGrid.children,
          { opacity: 0, y: 18, scale: 0.985 },
          { opacity: 1, y: 0, scale: 1, duration: 0.42, stagger: 0.035, ease: 'power2.out', clearProps: 'transform' }
        );
      }

      if (typeof window.reinitCard3DTilt === 'function') {
        window.reinitCard3DTilt();
      }
      if (typeof window.reinitMagneticElements === 'function') {
        window.reinitMagneticElements();
      }
      document.dispatchEvent(new CustomEvent('portfolio:layout-changed'));
    };

    clearTimeout(filterTimer);
    if (animateTransition) {
      projectsGrid.classList.add('filtering');
      filterTimer = setTimeout(performRender, 110);
    } else {
      performRender();
    }
  }

  function createProjectCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card interactive-card reveal-fade';
    card.setAttribute('data-id', project.id);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `${project.title}: ${project.subtitle}`);

    const illustrationSrc = ILLUSTRATION_MAP[project.illustration] || 'assets/illustrations/moodline.svg';

    const metricsHtml = project.metrics.slice(0, 2).map((m) => `
      <div class="metric-strip-item ${m.highlight ? 'highlight' : ''}">
        <span class="metric-strip-label">${escapeHtml(m.label)}</span>
        <span class="metric-strip-value">${escapeHtml(m.value)}</span>
      </div>
    `).join('');

    const tagsHtml = project.techStack.slice(0, 4).map((t) => `
      <span class="tag">${escapeHtml(t)}</span>
    `).join('');

    card.innerHTML = `
      <div class="project-visual-preview">
        <img src="${illustrationSrc}" alt="Computational diagram for ${escapeHtml(project.title)}" width="480" height="280" loading="lazy" />
      </div>
      <div class="project-card-body">
        <div class="project-header-row">
          <span class="project-badge-pill">${escapeHtml(project.badge)}</span>
          <span class="tag-dark tag">${escapeHtml(project.year)}</span>
        </div>
        <h3 class="project-card-title">${escapeHtml(project.title)}</h3>
        <p class="project-card-subtitle">${escapeHtml(project.subtitle)}</p>
        <p class="project-card-summary">${escapeHtml(project.summary)}</p>

        <div class="project-metrics-strip">
          ${metricsHtml}
        </div>

        ${project.disclaimer ? `
          <div class="project-card-disclaimer">${escapeHtml(project.disclaimer)}</div>
        ` : ''}

        <div class="project-tech-tags">
          ${tagsHtml}
          ${project.techStack.length > 4 ? `<span class="tag tag-cobalt">+${project.techStack.length - 4}</span>` : ''}
        </div>

        <div class="project-actions-row">
          <button type="button" class="btn btn-sm btn-secondary open-modal-btn" data-project-id="${project.id}" data-cursor-label="VIEW">
            Deep Dive
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
          <div class="project-links-group">
            ${project.githubUrl ? `
              <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="View Source Code on GitHub" aria-label="View ${escapeHtml(project.title)} on GitHub" data-cursor-label="CODE">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            ` : ''}
            ${project.liveUrl ? `
              <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="Open Live Deployed Application" aria-label="Open ${escapeHtml(project.title)} live deployment" data-cursor-label="LIVE">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    const deepDiveBtn = card.querySelector('.open-modal-btn');
    if (deepDiveBtn) {
      deepDiveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectModal(project.id, deepDiveBtn);
      });
    }

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProjectModal(project.id, card);
      }
    });

    requestAnimationFrame(() => {
      card.classList.add('is-revealed');
    });

    return card;
  }

  /* ========================================================================
     3. MODAL DRAWER, ACCESSIBILITY FOCUS TRAP & URL DEEP-LINKING
     ======================================================================== */
  function setupModalEvents() {
    if (!modal || !modalCloseBtn) return;

    modalCloseBtn.addEventListener('click', () => closeModal({ updateUrl: true }));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal({ updateUrl: true });
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeModal({ updateUrl: true });
        return;
      }

      // Keyboard Tab Focus Trap within Modal
      if (e.key === 'Tab' && modalDialog) {
        const focusable = Array.from(
          modalDialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ).filter((el) => el.offsetParent !== null);

        if (!focusable.length) return;
        const firstEl = focusable[0];
        const lastEl = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });
  }

  function findProjectBySlug(slug) {
    if (!slug || typeof PROJECTS_DATA === 'undefined') return null;
    const normalized = String(slug).trim().toLowerCase();
    return PROJECTS_DATA.find(
      (p) => p.id.toLowerCase() === normalized || (p.slug && p.slug.toLowerCase() === normalized)
    ) || null;
  }

  function getSlugFromLocation() {
    const params = new URLSearchParams(window.location.search);
    const paramSlug = params.get('project');
    if (paramSlug) return paramSlug;

    if (window.location.hash && window.location.hash.startsWith('#project=')) {
      return window.location.hash.slice('#project='.length);
    }
    return null;
  }

  function updateBrowserUrl(projectId) {
    if (!window.history || typeof window.history.pushState !== 'function') return;

    const url = new URL(window.location.href);
    if (projectId) {
      url.searchParams.set('project', projectId);
    } else {
      url.searchParams.delete('project');
      if (url.hash && url.hash.startsWith('#project=')) {
        url.hash = '';
      }
    }

    const targetHref = url.pathname + (url.search ? url.search : '') + (url.hash ? url.hash : '');
    const currentHref = window.location.pathname + window.location.search + window.location.hash;
    if (targetHref !== currentHref) {
      window.history.pushState({ project: projectId || null }, '', targetHref);
    }
  }

  function scrollToProjectsSection() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    if (window.lenis) {
      window.lenis.scrollTo(projectsSection, { offset: -64, immediate: false, duration: 0.9 });
    } else {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setupDeepLinking() {
    const initialSlug = getSlugFromLocation();
    if (initialSlug) {
      const matched = findProjectBySlug(initialSlug);
      if (matched) {
        if (FLAGSHIP_IDS.includes(matched.id)) {
          expandFlagshipPanel(matched.id);
        }
        deepLinkScrollPending = true;
        openProjectModal(matched.id, null, { updateUrl: false });
      }
    }

    // Wait for preloader dismissal so Lenis/native scroll isn't blocked by preloader overflow lock
    document.addEventListener('portfolio:preloader-done', () => {
      if (deepLinkScrollPending) {
        deepLinkScrollPending = false;
        setTimeout(() => {
          const projectsSection = document.getElementById('projects');
          if (projectsSection) {
            if (window.lenis) {
              window.lenis.scrollTo(projectsSection, { offset: -64, immediate: true });
            } else {
              window.scrollTo(0, projectsSection.offsetTop - 64);
            }
          }
        }, 60);
      }
    });

    window.addEventListener('popstate', () => {
      const slug = getSlugFromLocation();
      if (slug) {
        const matched = findProjectBySlug(slug);
        if (matched) {
          if (FLAGSHIP_IDS.includes(matched.id)) {
            expandFlagshipPanel(matched.id);
          }
          scrollToProjectsSection();
          openProjectModal(matched.id, null, { updateUrl: false });
          return;
        }
      }
      if (modal && modal.classList.contains('active')) {
        closeModal({ updateUrl: false });
      }
    });
  }

  function openProjectModal(projectId, triggerEl, options) {
    if (!modal || typeof PROJECTS_DATA === 'undefined') return;
    const opts = Object.assign({ updateUrl: true }, options);

    const project = findProjectBySlug(projectId);
    if (!project) return;

    activeModalProjectId = project.id;
    previousActiveElement = triggerEl || document.activeElement;

    const illustrationSrc = ILLUSTRATION_MAP[project.illustration] || 'assets/illustrations/moodline.svg';

    if (modalEls.badge) modalEls.badge.textContent = project.badge;
    if (modalEls.title) modalEls.title.textContent = project.title;
    if (modalEls.subtitle) modalEls.subtitle.textContent = project.subtitle;
    if (modalEls.description) modalEls.description.textContent = project.description;

    if (modalEls.img) {
      modalEls.img.src = illustrationSrc;
      modalEls.img.alt = `Detailed architecture diagram for ${project.title}`;
      modalEls.img.style.display = 'block';
    }

    if (modalEls.metrics) {
      modalEls.metrics.innerHTML = project.metrics.map((m) => `
        <div class="modal-metric-box">
          <div class="metric-strip-label">${escapeHtml(m.label)}</div>
          <div class="modal-metric-num">${escapeHtml(m.value)}</div>
        </div>
      `).join('');
    }

    if (modalEls.arch) {
      modalEls.arch.textContent = project.architecture;
    }

    if (modalEls.tech) {
      modalEls.tech.innerHTML = project.techStack.map((t) => `
        <span class="tag tag-cobalt">${escapeHtml(t)}</span>
      `).join('');
    }

    if (modalEls.disclaimer) {
      modalEls.disclaimer.style.display = project.disclaimer ? 'block' : 'none';
      if (project.disclaimer) modalEls.disclaimer.textContent = project.disclaimer;
    }

    setOptionalLink(modalEls.githubBtn, project.githubUrl);
    setOptionalLink(modalEls.liveBtn, project.liveUrl);

    if (opts.updateUrl) {
      updateBrowserUrl(project.id);
    }

    modal.classList.add('active');
    if (modalDialog) modalDialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    if (window.lenis) window.lenis.stop();
    modalCloseBtn.focus();
  }

  function setOptionalLink(anchorEl, url) {
    if (!anchorEl) return;
    if (url) {
      anchorEl.href = url;
      anchorEl.style.display = 'inline-flex';
    } else {
      anchorEl.style.display = 'none';
    }
  }

  function closeModal(options) {
    if (!modal) return;
    const opts = Object.assign({ updateUrl: true }, options);

    modal.classList.remove('active');
    const preloaderVisible = preloader && !preloader.classList.contains('hidden');
    if (!preloaderVisible) {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }

    activeModalProjectId = null;

    if (opts.updateUrl) {
      updateBrowserUrl(null);
    }

    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
