import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Convert lat/long to 3D Cartesian coordinates on a sphere
function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);

  return new THREE.Vector3(x, y, z);
}

// -------------------------------------------------------------
// 1. HERO SCENE DEFINITION
// -------------------------------------------------------------
export function initHeroScene() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || !container) return null;

  // Screen metrics
  let width = container.clientWidth;
  let height = container.clientHeight;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2('#0A0A12', 0.015);

  // Camera
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 6.5;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Post processing composer (Neon UnrealBloom)
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    1.4,  // Bloom strength
    0.45, // Radius
    0.2   // Threshold
  );
  composer.addPass(bloomPass);

  // Light arrays
  const ambientLight = new THREE.AmbientLight('#0F1525', 1.0);
  scene.add(ambientLight);

  const orangeRimLight = new THREE.DirectionalLight('#FF6B35', 2.5);
  orangeRimLight.position.set(0, -5, -2);
  scene.add(orangeRimLight);

  const greenOrbitLight = new THREE.PointLight('#00FF88', 3.0, 15);
  scene.add(greenOrbitLight);

  // Globe parent container
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Core Globe Geometry: low-poly icosphere
  const globeRadius = 2.0;
  const globeGeo = new THREE.IcosahedronGeometry(globeRadius, 2);
  const globeMat = new THREE.MeshStandardMaterial({
    color: '#0A0A1F',
    wireframe: true,
    transparent: true,
    opacity: 0.45,
    roughness: 0.8,
    metalness: 0.9,
    emissive: '#00FF88',
    emissiveIntensity: 0.15
  });
  const globeMesh = new THREE.Mesh(globeGeo, globeMat);
  globeGroup.add(globeMesh);

  // Globe outer wireframe outline
  const outlineGeo = new THREE.IcosahedronGeometry(globeRadius + 0.05, 1);
  const outlineMat = new THREE.MeshBasicMaterial({
    color: '#00D4FF',
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
  globeGroup.add(outlineMesh);

  // Add 3D Hexagonal floaters
  const floatersGroup = new THREE.Group();
  scene.add(floatersGroup);

  const hexCount = 15;
  const hexMeshes = [];
  for (let i = 0; i < hexCount; i++) {
    const size = 0.15 + Math.random() * 0.15;
    const hexGeo = new THREE.CylinderGeometry(size, size, 0.05, 6);
    const hexMat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? '#00FF88' : '#00D4FF',
      roughness: 0.3,
      metalness: 0.9,
      transparent: true,
      opacity: 0.4,
      emissive: i % 2 === 0 ? '#00FF88' : '#00D4FF',
      emissiveIntensity: 0.2
    });
    const mesh = new THREE.Mesh(hexGeo, hexMat);
    mesh.position.set(
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 8,
      -3 - Math.random() * 5
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      spinX: (Math.random() - 0.5) * 0.01,
      spinY: (Math.random() - 0.5) * 0.01,
      driftSpeed: 0.002 + Math.random() * 0.004
    };
    floatersGroup.add(mesh);
    hexMeshes.push(mesh);
  }

  // Network connection lines pulsing from Harare, Zimbabwe
  // Coordinates: Lat -17.8187° S, Lon 31.0488° E
  const harareLat = -17.8187;
  const harareLon = 31.0488;
  const harareVec = latLongToVector3(harareLat, harareLon, globeRadius);

  // Harare glowing beacon point
  const beaconGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const beaconMat = new THREE.MeshBasicMaterial({ color: '#FF6B35' });
  const beacon = new THREE.Mesh(beaconGeo, beaconMat);
  beacon.position.copy(harareVec);
  globeGroup.add(beacon);

  // Pulse ring around beacon
  const pulseGeo = new THREE.RingGeometry(0.1, 0.25, 32);
  const pulseMat = new THREE.MeshBasicMaterial({
    color: '#FF6B35',
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  });
  const pulseRing = new THREE.Mesh(pulseGeo, pulseMat);
  pulseRing.position.copy(harareVec);
  pulseRing.lookAt(0, 0, 0); // Orient flat on sphere surface
  globeGroup.add(pulseRing);

  // Global target endpoints (London, Tokyo, New York, Sydney, Nairobi, Lagos, Cairo)
  const targets = [
    { lat: 51.5074, lon: -0.1278, color: '#00FF88' },  // London
    { lat: 35.6762, lon: 139.6503, color: '#00D4FF' }, // Tokyo
    { lat: 40.7128, lon: -74.0060, color: '#A855F7' }, // New York
    { lat: -33.8688, lon: 151.2093, color: '#00FF88' }, // Sydney
    { lat: -1.2921, lon: 36.8219, color: '#FF6B35' },  // Nairobi
    { lat: 6.5244, lon: 3.3792, color: '#00D4FF' },    // Lagos
    { lat: 30.0444, lon: 31.2357, color: '#FF6B35' }    // Cairo
  ];

  const lines = [];
  targets.forEach((tgt) => {
    const targetVec = latLongToVector3(tgt.lat, tgt.lon, globeRadius);

    // Compute curved network line path (bezier arc above the surface)
    const midPoint = new THREE.Vector3().addVectors(harareVec, targetVec).multiplyScalar(0.5);
    const distance = harareVec.distanceTo(targetVec);
    midPoint.normalize().multiplyScalar(globeRadius + distance * 0.25); // Lift arc height

    const curve = new THREE.QuadraticBezierCurve3(harareVec, midPoint, targetVec);
    const points = curve.getPoints(30);

    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({
      color: tgt.color,
      transparent: true,
      opacity: 0.6
    });
    const line = new THREE.Line(lineGeo, lineMat);
    globeGroup.add(line);
    lines.push({ mesh: line, points: points, counter: Math.random() * 30 });
  });

  // Harare facing rotation adjustment: align Harare to camera
  const targetRotationX = (harareLat * Math.PI) / 180;
  const targetRotationY = (-harareLon * Math.PI) / 180 + Math.PI / 2;
  globeGroup.rotation.x = targetRotationX;
  globeGroup.rotation.y = targetRotationY;

  // Particle Starfield (8000+ points)
  const particleCount = 8000;
  const starGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const greenColor = new THREE.Color('#00FF88');
  const cyanColor = new THREE.Color('#00D4FF');

  for (let i = 0; i < particleCount; i++) {
    // Generate positions spread throughout space
    const radius = 10 + Math.random() * 25;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Tint starfield colors emerald green and cyan
    const mixedColor = new THREE.Color().lerpColors(
      greenColor,
      cyanColor,
      Math.random()
    );
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Load small square texture for points
  const pointsMat = new THREE.PointsMaterial({
    size: 0.065,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const starfield = new THREE.Points(starGeo, pointsMat);
  scene.add(starfield);

  // Mouse interactivity variables
  let mouse = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Resize callback
  window.addEventListener('resize', () => {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
  });

  // Render variables
  let clock = new THREE.Clock();
  let baseSpeed = 1.0;

  // Animate function
  function update() {
    const elapsed = clock.getElapsedTime();
    const delta = clock.getDelta();

    // Ambient globe rotation
    globeGroup.rotation.y += 0.003 * baseSpeed;

    // Orbit point light
    greenOrbitLight.position.x = Math.sin(elapsed) * 4;
    greenOrbitLight.position.z = Math.cos(elapsed) * 4;
    greenOrbitLight.position.y = Math.sin(elapsed * 0.5) * 2;

    // Pulse beacon ring
    const pulseScale = 1.0 + (elapsed * 2.0) % 2.0;
    pulseRing.scale.set(pulseScale, pulseScale, 1.0);
    pulseMat.opacity = Math.max(0.0, 1.0 - (pulseScale - 1.0) / 2.0);

    // Drifting hexagons
    hexMeshes.forEach((mesh) => {
      mesh.rotation.x += mesh.userData.spinX * baseSpeed;
      mesh.rotation.y += mesh.userData.spinY * baseSpeed;
      mesh.position.y += Math.sin(elapsed + mesh.position.x) * mesh.userData.driftSpeed * baseSpeed;
    });

    // Reactive mouse starfield parallax rotation
    starfield.rotation.y += (mouse.x * 0.15 - starfield.rotation.y) * 0.05;
    starfield.rotation.x += (-mouse.y * 0.15 - starfield.rotation.x) * 0.05;

    // Slowly rotate background starfield
    starfield.rotation.z += 0.0003 * baseSpeed;

    // Render pass
    composer.render();
  }

  // Handle external synchronization requests (from audio.js)
  const setMusicSpeedFactor = (factor) => {
    baseSpeed = factor;
  };

  return {
    scene,
    camera,
    globeGroup,
    update,
    setMusicSpeedFactor
  };
}

// -------------------------------------------------------------
// 2. SKILLS INTERACTIVE NEURAL NET SCENE
// -------------------------------------------------------------
export function initSkillsScene() {
  const canvas = document.getElementById('skills-canvas');
  if (!canvas) return null;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  scene.add(new THREE.AmbientLight('#0F1525', 1.5));
  const dirLight = new THREE.DirectionalLight('#00FF88', 2.0);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  const group = new THREE.Group();
  scene.add(group);

  // Skill clusters definitions
  const skillsData = [
    // Category 0: Mobile (Emerald Green)
    { name: 'Flutter', category: 0, pos: [-2, 2, 0], level: 'Advanced (4+ yrs)', details: 'Custom plugins, async isolate databases' },
    { name: 'Kotlin/Java', category: 0, pos: [-3.5, 1, -1], level: 'Expert (5 yrs)', details: 'Broadcasting services, hardware bindings' },
    { name: 'React Native', category: 0, pos: [-3, 3, 1], level: 'Intermediate', details: 'Cross platform bridges' },
    
    // Category 1: Backend & DB (Cyan)
    { name: 'Node.js', category: 1, pos: [2, 2, 0], level: 'Expert', details: 'Socket.io streams, express security frameworks' },
    { name: 'PHP/MySQL', category: 1, pos: [3.5, 1.5, -1], level: 'Core Native', details: 'Highly robust relational DB models' },
    { name: 'SQLite', category: 1, pos: [1.8, 3.2, 1], level: 'Advanced', details: 'Offline client-side sync modules' },
    { name: 'Firebase', category: 1, pos: [3.2, 3.0, -0.5], level: 'Proficient', details: 'Real-time sync listeners, Firestore' },

    // Category 2: Hardware/IoT (Orange)
    { name: 'ESC/POS', category: 2, pos: [0, -2, 0], level: 'Expert', details: 'Raw byte commands, Bluetooth print lines' },
    { name: 'GPS Hardware', category: 2, pos: [-1.5, -3, 1], level: 'Advanced', details: 'Tracker connection streams, telemetry API integrations' },
    { name: 'POS Printers', category: 2, pos: [1.5, -3, -1], level: 'Specialist', details: 'Mobile terminal hardware communication protocols' }
  ];

  const nodeMeshes = [];
  const colorMap = ['#00FF88', '#00D4FF', '#FF6B35'];

  // Add category labels inside groups
  skillsData.forEach((skill, idx) => {
    const nodeGeo = new THREE.SphereGeometry(0.28, 32, 32);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: colorMap[skill.category],
      roughness: 0.1,
      metalness: 0.9,
      emissive: colorMap[skill.category],
      emissiveIntensity: 0.3
    });
    
    const mesh = new THREE.Mesh(nodeGeo, nodeMat);
    mesh.position.set(...skill.pos);
    mesh.userData = { skill, index: idx };
    group.add(mesh);
    nodeMeshes.push(mesh);
  });

  // Create connections (neural network lines)
  const lineMat = new THREE.LineBasicMaterial({
    color: 'rgba(255,255,255,0.06)',
    transparent: true,
    opacity: 0.3
  });

  const connectionGeo = new THREE.BufferGeometry();
  const linePoints = [];

  // Connect close nodes in the same category or closely related
  for (let i = 0; i < nodeMeshes.length; i++) {
    for (let j = i + 1; j < nodeMeshes.length; j++) {
      const p1 = nodeMeshes[i].position;
      const p2 = nodeMeshes[j].position;
      const dist = p1.distanceTo(p2);
      
      // Connect nodes that are relatively close
      if (dist < 4.8) {
        linePoints.push(p1.x, p1.y, p1.z);
        linePoints.push(p2.x, p2.y, p2.z);
      }
    }
  }

  connectionGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3));
  const connectionsMesh = new THREE.LineSegments(connectionGeo, lineMat);
  group.add(connectionsMesh);

  // Resize callback
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Interactivity Raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // Create interactive UI detail panel overlay element dynamically
  const setupInfoPanel = () => {
    let panel = document.getElementById('skill-detail-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'skill-detail-panel';
      panel.className = 'glass-panel';
      panel.style.cssText = `
        position: absolute;
        top: 25px;
        right: 25px;
        padding: 20px;
        border-radius: 8px;
        width: 260px;
        z-index: 100;
        pointer-events: none;
        display: none;
        border: 1px solid rgba(0, 255, 136, 0.2);
        box-shadow: 0 0 20px rgba(0, 255, 136, 0.05);
      `;
      canvas.parentNode.appendChild(panel);
    }
    return panel;
  };

  const infoPanel = setupInfoPanel();

  const handlePointerInteraction = (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / canvas.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(nodeMeshes);

    if (intersects.length > 0) {
      const selected = intersects[0].object;
      const data = selected.userData.skill;

      // Pulse selected mesh scale
      nodeMeshes.forEach(m => m.scale.set(1, 1, 1));
      selected.scale.set(1.4, 1.4, 1.4);

      // Populate info panel
      infoPanel.innerHTML = `
        <span style="font-family: var(--font-code); color: ${colorMap[data.category]}; font-size: 0.65rem; display: block; letter-spacing: 0.1em; margin-bottom: 5px;">CLUSTER NODE //</span>
        <h4 style="font-family: var(--font-display); color: #fff; margin-bottom: 10px; font-size: 1.1rem; text-transform: uppercase;">${data.name}</h4>
        <div style="height: 1px; background: rgba(255,255,255,0.08); margin-bottom: 12px;"></div>
        <p style="font-family: var(--font-mono); font-size: 0.75rem; color: #00D4FF; margin-bottom: 8px;">PROFICIENCY: ${data.level}</p>
        <p style="font-family: var(--font-body); font-size: 0.8rem; color: var(--muted); line-height: 1.4;">${data.details}</p>
      `;
      infoPanel.style.display = 'block';
    }
  };

  canvas.addEventListener('click', handlePointerInteraction);

  // Animation Loop
  function update() {
    const elapsed = Date.now() * 0.0008;

    // Slow ambient rotation
    group.rotation.y = Math.sin(elapsed * 0.25) * 0.4;
    group.rotation.x = Math.cos(elapsed * 0.2) * 0.25;

    // Make individual spheres float softly in local offsets
    nodeMeshes.forEach((mesh) => {
      const idx = mesh.userData.index;
      mesh.position.y = skillsData[idx].pos[1] + Math.sin(elapsed + idx) * 0.08;
    });

    renderer.render(scene, camera);
  }

  return { update };
}

// -------------------------------------------------------------
// 3. CONTACT COORDINATE MAP SCENE
// -------------------------------------------------------------
export function initContactScene() {
  const canvas = document.getElementById('contact-canvas');
  if (!canvas) return null;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 7);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  scene.add(new THREE.AmbientLight('#0F1525', 1.0));
  const light = new THREE.DirectionalLight('#00D4FF', 2.0);
  light.position.set(5, 3, 5);
  scene.add(light);

  const mapGroup = new THREE.Group();
  scene.add(mapGroup);

  // Represent topographic spherical grid wireframe
  const mapGlobeGeo = new THREE.SphereGeometry(2.0, 36, 18);
  const mapGlobeMat = new THREE.MeshBasicMaterial({
    color: '#0F1525',
    wireframe: true,
    transparent: true,
    opacity: 0.1
  });
  const globe = new THREE.Mesh(mapGlobeGeo, mapGlobeMat);
  mapGroup.add(globe);

  // Outline grids for country outlines look
  const contourMat = new THREE.MeshBasicMaterial({
    color: 'rgba(0, 255, 136, 0.2)',
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const contour = new THREE.Mesh(new THREE.IcosahedronGeometry(2.02, 2), contourMat);
  mapGroup.add(contour);

  // Position Harare marker on sphere
  const hLat = -17.8187;
  const hLon = 31.0488;
  const hVec = latLongToVector3(hLat, hLon, 2.0);

  // Floating orange marker pin
  const pinGeo = new THREE.ConeGeometry(0.08, 0.35, 16);
  const pinMat = new THREE.MeshStandardMaterial({
    color: '#FF6B35',
    roughness: 0.2,
    metalness: 0.9,
    emissive: '#FF6B35',
    emissiveIntensity: 0.6
  });
  const pin = new THREE.Mesh(pinGeo, pinMat);
  pin.position.copy(hVec);
  pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), hVec.clone().normalize());
  mapGroup.add(pin);

  // Floating ring around the pin
  const ringGeo = new THREE.RingGeometry(0.12, 0.25, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: '#00FF88',
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.copy(hVec).multiplyScalar(1.01); // Slightly elevated above surface
  ring.quaternion.copy(pin.quaternion);
  mapGroup.add(ring);

  // Rotate group initially
  mapGroup.rotation.y = 0.5;

  // Resize callback
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Track map state for zoom animation sequence on ScrollTrigger focus
  let zoomCompleted = false;
  const zoomToHarare = () => {
    if (zoomCompleted) return;
    
    // Zoom/tilt camera and orient Harare right at the viewer
    const targetRotX = (hLat * Math.PI) / 180;
    const targetRotY = (-hLon * Math.PI) / 180 + Math.PI / 2;

    // Use standard interpolation loops
    let steps = 0;
    const maxSteps = 45;
    
    const smoothStep = () => {
      if (steps >= maxSteps) {
        zoomCompleted = true;
        return;
      }
      steps++;
      
      // Interpolate values
      mapGroup.rotation.x += (targetRotX - mapGroup.rotation.x) * 0.08;
      mapGroup.rotation.y += (targetRotY - mapGroup.rotation.y) * 0.08;
      camera.position.z += (3.8 - camera.position.z) * 0.08;

      requestAnimationFrame(smoothStep);
    };

    smoothStep();
  };

  // Animate function
  function update() {
    const elapsed = Date.now() * 0.0006;

    // Constant slow rotation if zoom isn't triggered
    if (!zoomCompleted) {
      mapGroup.rotation.y += 0.004;
    }

    // Pulse pin ring scale
    const ringScale = 1.0 + (elapsed * 2) % 1.5;
    ring.scale.set(ringScale, ringScale, 1);
    ringMat.opacity = Math.max(0.0, 1.0 - (ringScale - 1.0) / 1.5);

    renderer.render(scene, camera);
  }

  return {
    update,
    zoomToHarare
  };
}
