/**
 * SCROLL-DRIVEN SVG JOURNEY TIMELINE — PINAK CHAUHAN PORTFOLIO
 * Optimized rAF SVG line progression with offscreen short-circuiting & throttled resize.
 */

(function () {
  'use strict';

  const journeyContainer = document.getElementById('journey-container');
  const journeyPath = document.getElementById('journey-svg-path');
  const beacon = document.getElementById('journey-beacon');
  const milestones = Array.from(document.querySelectorAll('.milestone-item'));

  if (!journeyContainer || !journeyPath) return;

  let pathLength = 0;
  let isTicking = false;
  let lastOffset = null;
  let lastBeaconActive = null;
  let lastBeaconLeft = null;
  let resizeTimer = null;

  function init() {
    setupSvgPath();
    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupSvgPath();
        updateProgress();
      }, 150);
    }, { passive: true });
    updateProgress();
  }

  function setupSvgPath() {
    pathLength = journeyPath.getTotalLength ? journeyPath.getTotalLength() : 1200;
    journeyPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
    lastOffset = null;
  }

  function requestTick() {
    if (!isTicking) {
      requestAnimationFrame(() => {
        updateProgress();
        isTicking = false;
      });
      isTicking = true;
    }
  }

  function updateProgress() {
    const rect = journeyContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Short-circuit layout reads for milestone items when container is completely offscreen
    if (rect.bottom < -40 || rect.top > windowHeight + 40) {
      if (beacon && lastBeaconActive) {
        beacon.classList.remove('active');
        lastBeaconActive = false;
      }
      return;
    }

    const startOffset = windowHeight * 0.65;
    const totalDistance = rect.height || 1;
    const clampedProgress = Math.min(Math.max((startOffset - rect.top) / totalDistance, 0), 1);

    const newOffset = Number((pathLength - pathLength * clampedProgress).toFixed(2));
    if (newOffset !== lastOffset) {
      lastOffset = newOffset;
      journeyPath.style.strokeDashoffset = String(newOffset);
    }

    if (beacon) {
      const showBeacon = clampedProgress > 0.02 && clampedProgress < 0.98;
      if (showBeacon !== lastBeaconActive) {
        beacon.classList.toggle('active', showBeacon);
        lastBeaconActive = showBeacon;
      }
      if (showBeacon) {
        beacon.style.top = `${(clampedProgress * 100).toFixed(2)}%`;
        const targetLeft = window.innerWidth >= 768 ? '50%' : '24px';
        if (targetLeft !== lastBeaconLeft) {
          beacon.style.left = targetLeft;
          lastBeaconLeft = targetLeft;
        }
      }
    }

    const thresholdY = windowHeight * 0.62;
    for (let i = 0; i < milestones.length; i++) {
      const item = milestones[i];
      const shouldBeActive = item.getBoundingClientRect().top < thresholdY;
      if (shouldBeActive !== item.classList.contains('active')) {
        item.classList.toggle('active', shouldBeActive);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
