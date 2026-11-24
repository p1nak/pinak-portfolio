/**
 * PROJECTS GALLERY & MODAL INTERACTIONS — PINAK CHAUHAN PORTFOLIO
 * Implements category filtering, dynamic card rendering, expandable deep-dive modal,
 * and keyboard accessibility.
 */

(function () {
  'use strict';

  let currentCategory = 'all';
  let activeModalProjectId = null;
  let previousActiveElement = null;

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectsGrid = document.getElementById('projects-grid-container');
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDialog = document.getElementById('modal-dialog');

  // Vector illustration mapping
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
    if (!projectsGrid) return;

    renderProjects(currentCategory);
    setupFilterEvents();
    setupModalEvents();
  }

  function setupFilterEvents() {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-filter') || 'all';
        renderProjects(currentCategory);
      });
    });
  }

  function renderProjects(category) {
    if (!projectsGrid || typeof PROJECTS_DATA === 'undefined') return;

    const filtered = category === 'all'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === category);

    projectsGrid.innerHTML = '';

    filtered.forEach((project, index) => {
      const card = createProjectCard(project, index);
      projectsGrid.appendChild(card);
    });

    // Reinitialize Lucide icons if available
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  function createProjectCard(project, index) {
    const card = document.createElement('article');
    card.className = `project-card ${project.flagship ? 'is-flagship' : ''} interactive-card reveal-fade`;
    card.setAttribute('data-id', project.id);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `${project.title}: ${project.subtitle}`);

    const illustrationSrc = ILLUSTRATION_MAP[project.illustration] || 'assets/illustrations/moodline.svg';

    // Metrics preview strip
    const metricsHtml = project.metrics.slice(0, 2).map((m) => `
      <div class="metric-strip-item ${m.highlight ? 'highlight' : ''}">
        <span class="metric-strip-label">${escapeHtml(m.label)}</span>
        <span class="metric-strip-value">${escapeHtml(m.value)}</span>
      </div>
    `).join('');

    // Tech tags preview
    const tagsHtml = project.techStack.slice(0, 4).map((t) => `
      <span class="tag">${escapeHtml(t)}</span>
    `).join('');

    card.innerHTML = `
      <div class="project-visual-preview">
        <img src="${illustrationSrc}" alt="Computational diagram for ${escapeHtml(project.title)}" loading="lazy" />
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

        <div class="project-tech-tags">
          ${tagsHtml}
          ${project.techStack.length > 4 ? `<span class="tag tag-cobalt">+${project.techStack.length - 4}</span>` : ''}
        </div>

        <div class="project-actions-row">
          <button type="button" class="btn btn-sm btn-secondary open-modal-btn" data-project-id="${project.id}">
            Deep Dive
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
          <div class="project-links-group">
            ${project.githubUrl ? `
              <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="View Source Code on GitHub" aria-label="View ${escapeHtml(project.title)} on GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            ` : ''}
            ${project.liveUrl ? `
              <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="Open Live Deployed Application" aria-label="Open ${escapeHtml(project.title)} live deployment">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Click handler for deep dive
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

    // Animate reveal
    requestAnimationFrame(() => {
      card.classList.add('is-revealed');
    });

    return card;
  }

  function setupModalEvents() {
    if (!modal || !modalCloseBtn) return;

    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  function openProjectModal(projectId, triggerEl) {
    if (!modal || typeof PROJECTS_DATA === 'undefined') return;

    const project = PROJECTS_DATA.find((p) => p.id === projectId);
    if (!project) return;

    activeModalProjectId = projectId;
    previousActiveElement = triggerEl || document.activeElement;

    const illustrationSrc = ILLUSTRATION_MAP[project.illustration] || 'assets/illustrations/moodline.svg';

    // Populate Modal Content
    document.getElementById('modal-badge').textContent = project.badge;
    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-subtitle').textContent = project.subtitle;
    document.getElementById('modal-description').textContent = project.description;
    
    const modalImg = document.getElementById('modal-illustration-img');
    if (modalImg) {
      modalImg.src = illustrationSrc;
      modalImg.alt = `Detailed architecture diagram for ${project.title}`;
    }

    // Metrics Grid
    const metricsContainer = document.getElementById('modal-metrics-container');
    if (metricsContainer) {
      metricsContainer.innerHTML = project.metrics.map((m) => `
        <div class="modal-metric-box">
          <div class="metric-strip-label">${escapeHtml(m.label)}</div>
          <div class="modal-metric-num">${escapeHtml(m.value)}</div>
        </div>
      `).join('');
    }

    // Architecture Pipeline
    const archContainer = document.getElementById('modal-architecture-text');
    if (archContainer) {
      archContainer.textContent = project.architecture;
    }

    // Tech stack tags
    const techContainer = document.getElementById('modal-tech-tags');
    if (techContainer) {
      techContainer.innerHTML = project.techStack.map((t) => `
        <span class="tag tag-cobalt">${escapeHtml(t)}</span>
      `).join('');
    }

    // Disclaimer
    const disclaimerContainer = document.getElementById('modal-disclaimer');
    if (disclaimerContainer) {
      if (project.disclaimer) {
        disclaimerContainer.style.display = 'block';
        disclaimerContainer.textContent = project.disclaimer;
      } else {
        disclaimerContainer.style.display = 'none';
      }
    }

    // Modal action buttons
    const githubBtn = document.getElementById('modal-github-btn');
    if (githubBtn) {
      if (project.githubUrl) {
        githubBtn.href = project.githubUrl;
        githubBtn.style.display = 'inline-flex';
      } else {
        githubBtn.style.display = 'none';
      }
    }

    const liveBtn = document.getElementById('modal-live-btn');
    if (liveBtn) {
      if (project.liveUrl) {
        liveBtn.href = project.liveUrl;
        liveBtn.style.display = 'inline-flex';
      } else {
        liveBtn.style.display = 'none';
      }
    }

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalCloseBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    activeModalProjectId = null;

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

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
