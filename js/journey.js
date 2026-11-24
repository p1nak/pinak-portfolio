/**
 * SCROLL-DRIVEN SVG JOURNEY TIMELINE — PINAK CHAUHAN PORTFOLIO
 * Calculates scroll progression along the SVG line and highlights milestones
 */

(function () {
  'use strict';

  const journeyContainer = document.getElementById('journey-container');
  const journeyPath = document.getElementById('journey-svg-path');
  const milestones = document.querySelectorAll('.milestone-item');

  if (!journeyContainer || !journeyPath) return;

  let pathLength = 0;

  function init() {
    setupSvgPath();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    onScroll();
  }

  function setupSvgPath() {
    pathLength = journeyPath.getTotalLength ? journeyPath.getTotalLength() : 1000;
    journeyPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    journeyPath.style.strokeDashoffset = `${pathLength}`;
  }

  function onResize() {
    setupSvgPath();
    onScroll();
  }

  function onScroll() {
    if (!journeyContainer) return;

    const rect = journeyContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate progress through journey section
    // Start drawing when top of container reaches 65% of viewport
    const startOffset = windowHeight * 0.65;
    const totalDistance = rect.height;
    const currentProgress = (startOffset - rect.top) / totalDistance;

    const clampedProgress = Math.min(Math.max(currentProgress, 0), 1);

    // Update stroke dashoffset
    const drawLength = pathLength * clampedProgress;
    journeyPath.style.strokeDashoffset = `${pathLength - drawLength}`;

    // Highlight individual milestones
    milestones.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.top < windowHeight * 0.6) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
