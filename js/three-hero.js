/**
 * THREE.JS AMBIENT NEURAL SPHERE — PINAK CHAUHAN PORTFOLIO
 * Lightweight computational neural-network background complementing the illustrated portrait.
 * Uses 160 nodes in a Fibonacci sphere distribution with restrained cobalt, sage, and charcoal accents.
 * Features:
 * - Lazy dynamic CDN loading after initial paint (skipped on reduced-motion or low-powered mobile)
 * - Single requestAnimationFrame loop paused when Hero is offscreen or tab is hidden
 * - Graceful geometric SVG fallback when WebGL is unavailable
 */

(function () {
  'use strict';

  const container = document.getElementById('hero-canvas-container');
  const canvas = document.getElementById('hero-three-canvas');
  if (!container || !canvas) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isSmallScreen = window.innerWidth < 680;
  const isLowPowerDevice =
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 2) ||
    (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 2);

  function activateFallback() {
    container.classList.add('fallback-active');
  }

  function isWebGLAvailable() {
    try {
      const testCanvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  // Respect reduced motion, WebGL constraints, and low-powered mobile devices
  if (prefersReducedMotion || (isSmallScreen && isLowPowerDevice) || !isWebGLAvailable()) {
    activateFallback();
    return;
  }

  function loadThreeAndBoot() {
    if (typeof window.THREE !== 'undefined') {
      initScene();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.async = true;
    script.onload = () => {
      if (typeof window.THREE !== 'undefined') {
        initScene();
      } else {
        activateFallback();
      }
    };
    script.onerror = () => {
      activateFallback();
    };
    document.head.appendChild(script);
  }

  function initScene() {
    const THREE = window.THREE;
    const width = container.clientWidth || 560;
    const height = container.clientHeight || 560;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
    } catch (err) {
      activateFallback();
      return;
    }

    const CONFIG = {
      nodeCount: isSmallScreen ? 88 : 160,
      radius: 1.98,
      connectionDistance: isSmallScreen ? 0.96 : 0.84,
      colorCobalt: 0x315BE8,
      colorSage: 0x6C7F59,
      colorAmber: 0xCC6A42,
      colorCharcoal: 0x202321
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.z = 6.25;

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.25 : 1.5));

    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    const nodes = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Fibonacci golden angle

    const nodeGeometry = new THREE.SphereGeometry(0.036, 10, 10);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.72
    });
    const instancedMesh = new THREE.InstancedMesh(nodeGeometry, nodeMaterial, CONFIG.nodeCount);

    const dummy = new THREE.Object3D();
    const colors = new Float32Array(CONFIG.nodeCount * 3);
    const cCobalt = new THREE.Color(CONFIG.colorCobalt);
    const cSage = new THREE.Color(CONFIG.colorSage);
    const cAmber = new THREE.Color(CONFIG.colorAmber);
    const cCharcoal = new THREE.Color(CONFIG.colorCharcoal);

    for (let i = 0; i < CONFIG.nodeCount; i++) {
      const y = 1 - (i / (CONFIG.nodeCount - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;
      const radialNoise = 1 + Math.sin(i * 1.45) * 0.06;
      const r = CONFIG.radius * radialNoise;

      const x = Math.cos(theta) * radiusAtY * r;
      const py = y * r;
      const z = Math.sin(theta) * radiusAtY * r;

      const pos = new THREE.Vector3(x, py, z);
      nodes.push(pos);

      dummy.position.copy(pos);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      const t = i / CONFIG.nodeCount;
      let col;
      if (t < 0.52) col = cCobalt;
      else if (t < 0.80) col = cSage;
      else if (t < 0.92) col = cCharcoal;
      else col = cAmber;

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
    instancedMesh.instanceMatrix.needsUpdate = true;
    sphereGroup.add(instancedMesh);

    // Connect proximal nodes with restrained synapse lines
    const linePositions = [];
    const lineColors = [];

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < CONFIG.connectionDistance) {
          linePositions.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
          const blend = (i + j) % 3 === 0 ? cSage : cCobalt;
          lineColors.push(blend.r, blend.g, blend.b, blend.r, blend.g, blend.b);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.24
    });
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    sphereGroup.add(lineMesh);

    // Subtle internal wireframe icosahedron for geometric depth
    const coreGeo = new THREE.IcosahedronGeometry(1.18, 1);
    const coreWire = new THREE.WireframeGeometry(coreGeo);
    const coreMat = new THREE.LineBasicMaterial({
      color: CONFIG.colorCharcoal,
      transparent: true,
      opacity: 0.08
    });
    const coreIcosahedron = new THREE.LineSegments(coreWire, coreMat);
    sphereGroup.add(coreIcosahedron);

    // State & animation lifecycle controls
    let isVisible = true;
    let isTabVisible = !document.hidden;
    let rafId = null;
    const clock = new THREE.Clock();
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    function updateLoopState() {
      const shouldRun = isVisible && isTabVisible;
      if (shouldRun && rafId === null) {
        clock.getDelta();
        rafId = requestAnimationFrame(animate);
      } else if (!shouldRun && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    function animate() {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;

      sphereGroup.rotation.y = elapsed * 0.085 + mouse.x;
      sphereGroup.rotation.x = Math.sin(elapsed * 0.06) * 0.08 + mouse.y;
      coreIcosahedron.rotation.x = -elapsed * 0.09;
      coreIcosahedron.rotation.z = elapsed * 0.07;

      renderer.render(scene, camera);
    }

    // Subtle pointer reaction on fine-pointer desktop
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      window.addEventListener('mousemove', (e) => {
        mouse.targetX = ((e.clientX / window.innerWidth) * 2 - 1) * 0.22;
        mouse.targetY = (-(e.clientY / window.innerHeight) * 2 + 1) * 0.18;
      }, { passive: true });
    }

    // Pause when Hero section leaves viewport
    const heroSection = document.getElementById('hero') || container;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          updateLoopState();
        });
      }, { threshold: 0.05 });
      io.observe(heroSection);
    }

    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      updateLoopState();
    });

    // Resize handler (keeps CSS 100% responsive sizing via updateStyle: false)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        const small = window.innerWidth < 680;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));
        renderer.setSize(w, h, false);
      }, 120);
    }, { passive: true });

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => {
      if (e.matches) {
        disposeScene();
        activateFallback();
      }
    };
    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    }

    // WebGL cleanup & context loss safety
    function disposeScene() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      coreGeo.dispose();
      coreWire.dispose();
      coreMat.dispose();
      renderer.dispose();
    }

    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      disposeScene();
      activateFallback();
    });

    window.addEventListener('pagehide', disposeScene, { once: true });

    container.classList.add('loaded');
    updateLoopState();
  }

  // Lazy-load Three.js once document is interactive/loaded so hero text & portrait paint first
  function scheduleBoot() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadThreeAndBoot, { timeout: 600 });
    } else {
      setTimeout(loadThreeAndBoot, 180);
    }
  }

  if (document.readyState === 'complete') {
    scheduleBoot();
  } else {
    window.addEventListener('load', scheduleBoot, { once: true });
  }
})();
