/**
 * THREE.JS HERO CENTERPIECE — PINAK CHAUHAN PORTFOLIO
 * Abstract 3D Neural Network Sphere & Computational Structure
 * Color accents: Cobalt (#315BE8), Sage (#9CAF88), Burnt Amber (#CC6A42), Warm Ivory (#F3EFE6)
 * Features subtle pointer parallax, synapse lines, pulsating node signals,
 * performance observer, and non-WebGL fallback.
 */

(function () {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  const container = document.getElementById('hero-canvas-container');
  const canvas = document.getElementById('hero-three-canvas');

  if (!container || !canvas) return;

  if (!isWebGLAvailable() || typeof THREE === 'undefined') {
    container.classList.add('fallback-active');
    return;
  }

  let scene, camera, renderer, sphereGroup, nodeMesh, lineMesh, coreIcosahedron;
  let nodes = [];
  let isVisible = true;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let clock;

  const CONFIG = {
    nodeCount: 160,
    radius: 1.85,
    connectionDistance: 0.82,
    colorCobalt: 0x315BE8,
    colorSage: 0x9CAF88,
    colorAmber: 0xCC6A42,
    colorIvory: 0xF3EFE6,
    colorCharcoal: 0x202321
  };

  function init() {
    clock = new THREE.Clock();

    // Scene setup
    scene = new THREE.Scene();

    // Camera setup
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    camera.position.z = 4.8;

    // Renderer setup
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Sphere Group for rotation & parallax
    sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Build Neural Structure
    buildNodes();
    buildSynapseLines();
    buildCoreStructure();

    // Subtle Restrained Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(CONFIG.colorCobalt, 1.2);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(CONFIG.colorAmber, 0.6);
    dirLight2.position.set(-5, -4, -2);
    scene.add(dirLight2);

    // Event Listeners
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    // IntersectionObserver to pause rendering when scrolled out of view
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      }, { threshold: 0.1 });
      observer.observe(container);
    }

    container.classList.add('loaded');
    animate();
  }

  // Generate nodes on Fibonacci sphere distribution
  function buildNodes() {
    nodes = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    const nodeGeometry = new THREE.SphereGeometry(0.045, 12, 12);
    const instancedMesh = new THREE.InstancedMesh(
      nodeGeometry,
      new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 0.2
      }),
      CONFIG.nodeCount
    );

    const dummy = new THREE.Object3D();
    const colors = new Float32Array(CONFIG.nodeCount * 3);
    const colorCobalt = new THREE.Color(CONFIG.colorCobalt);
    const colorSage = new THREE.Color(CONFIG.colorSage);
    const colorAmber = new THREE.Color(CONFIG.colorAmber);
    const colorIvory = new THREE.Color(CONFIG.colorIvory);

    for (let i = 0; i < CONFIG.nodeCount; i++) {
      const y = 1 - (i / (CONFIG.nodeCount - 1)) * 2; // y from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      // Small radial perturbation for organic feel
      const radialNoise = 1 + (Math.sin(i * 1.5) * 0.08);
      const r = CONFIG.radius * radialNoise;

      const x = Math.cos(theta) * radiusAtY * r;
      const py = y * r;
      const z = Math.sin(theta) * radiusAtY * r;

      const pos = new THREE.Vector3(x, py, z);
      nodes.push({
        basePos: pos.clone(),
        currentPos: pos.clone(),
        phase: Math.random() * Math.PI * 2,
        speed: 1.2 + Math.random() * 2.0
      });

      dummy.position.copy(pos);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      // Distribute palette colors intentionally
      let c;
      const rnd = Math.random();
      if (rnd < 0.65) {
        c = colorCobalt;
      } else if (rnd < 0.88) {
        c = colorSage;
      } else if (rnd < 0.96) {
        c = colorAmber;
      } else {
        c = colorIvory;
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    instancedMesh.instanceColor = new THREE.InstancedBufferAttribute(colors, 3);
    instancedMesh.instanceMatrix.needsUpdate = true;
    nodeMesh = instancedMesh;
    sphereGroup.add(nodeMesh);
  }

  // Connect close nodes with synapse lines
  function buildSynapseLines() {
    const linePositions = [];
    const lineColors = [];
    const colorCobalt = new THREE.Color(CONFIG.colorCobalt);
    const colorSage = new THREE.Color(CONFIG.colorSage);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = nodes[i].basePos.distanceTo(nodes[j].basePos);
        if (dist < CONFIG.connectionDistance) {
          linePositions.push(
            nodes[i].basePos.x, nodes[i].basePos.y, nodes[i].basePos.z,
            nodes[j].basePos.x, nodes[j].basePos.y, nodes[j].basePos.z
          );

          // Subtle blend
          const blendColor = (i + j) % 2 === 0 ? colorCobalt : colorSage;
          lineColors.push(
            blendColor.r, blendColor.g, blendColor.b,
            blendColor.r, blendColor.g, blendColor.b
          );
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.32,
      blending: THREE.NormalBlending
    });

    lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    sphereGroup.add(lineMesh);
  }

  // Internal geometric core wireframe
  function buildCoreStructure() {
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const wireframe = new THREE.WireframeGeometry(coreGeo);
    const coreMat = new THREE.LineBasicMaterial({
      color: CONFIG.colorCobalt,
      transparent: true,
      opacity: 0.22
    });

    coreIcosahedron = new THREE.LineSegments(wireframe, coreMat);
    sphereGroup.add(coreIcosahedron);

    // Concentric inner ring
    const ringGeo = new THREE.RingGeometry(0.95, 0.98, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: CONFIG.colorSage,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    sphereGroup.add(ring);
  }

  function onResize() {
    if (!container || !renderer || !camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function onMouseMove(event) {
    const rect = container.getBoundingClientRect();
    // Normalize to -1 to +1 relative to screen center
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    mouse.targetX = x * 0.35;
    mouse.targetY = y * 0.35;
  }

  function onMouseLeave() {
    mouse.targetX = 0;
    mouse.targetY = 0;
  }

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Smooth pointer parallax lerping
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    // Gentle continuous rotation
    sphereGroup.rotation.y = elapsedTime * 0.12 + mouse.x;
    sphereGroup.rotation.x = Math.sin(elapsedTime * 0.08) * 0.1 + mouse.y;

    if (coreIcosahedron) {
      coreIcosahedron.rotation.x = -elapsedTime * 0.18;
      coreIcosahedron.rotation.z = elapsedTime * 0.15;
    }

    renderer.render(scene, camera);
  }

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
