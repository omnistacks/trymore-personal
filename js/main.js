import { initCursor } from './cursor.js';
import { initHeroScene, initSkillsScene, initContactScene } from './three-scene.js';
import { initProductCarousel } from './carousel.js';
import { initScrollAnimations } from './gsap-animations.js';
import { initAmbientSoundtrack } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
  const isMobile = window.innerWidth < 768;

  // 1. Initialize custom cursor trail (Desktop only)
  if (!isMobile) {
    initCursor();
  }

  // Inject Mobile Bottom Nav Tab bar dynamically if on mobile
  if (isMobile) {
    injectMobileTabBar();
  }

  // 2. Initialize Scenes & Loop manager
  let heroScene = null;
  let skillsScene = null;
  let contactScene = null;

  if (!isMobile) {
    // Desktop: complete Three.js WebGL setups
    try {
      heroScene = initHeroScene();
      skillsScene = initSkillsScene();
      contactScene = initContactScene();

      // Master frame render loop
      const masterRenderLoop = () => {
        if (heroScene && heroScene.update) heroScene.update();
        if (skillsScene && skillsScene.update) skillsScene.update();
        if (contactScene && contactScene.update) contactScene.update();
        requestAnimationFrame(masterRenderLoop);
      };
      
      masterRenderLoop();
    } catch (e) {
      console.warn("WebGL initialization failed. Loading elegant CSS/Static fallback: ", e);
      enableMobileFallbacks();
    }
  } else {
    // Mobile: disable WebGL completely for lightweight performance
    enableMobileFallbacks();
  }

  // 3. Initialize Product Carousel slider
  initProductCarousel();

  // 4. Initialize GSAP ScrollTrigger Animations & Exit Preloader
  const animations = initScrollAnimations(heroScene, contactScene);
  
  // Exit loader immediately once JS initializations are ready
  if (animations && animations.exitLoaderAndPlayHero) {
    // Soft delay to ensure layout metrics calculations settle
    setTimeout(() => {
      animations.exitLoaderAndPlayHero();
    }, 500);
  }

  // 5. Initialize Rhythmic Audio layer
  initAmbientSoundtrack(heroScene);

  // 6. Navigation highlight handler
  setupActiveLinksObserver();
});

// Dynamic Mobile Tab Bar injector
function injectMobileTabBar() {
  const tabBar = document.createElement('div');
  tabBar.className = 'mobile-nav-bar';
  tabBar.innerHTML = `
    <a href="#hero" class="mobile-nav-item active" data-section="hero">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
      <span>HOME</span>
    </a>
    <a href="#products" class="mobile-nav-item" data-section="products">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line></svg>
      <span>PRODUCTS</span>
    </a>
    <a href="#contact" class="mobile-nav-item" data-section="contact">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
      <span>CONTACT</span>
    </a>
  `;
  document.body.appendChild(tabBar);
}

// Visual/CSS fallback when WebGL isn't loaded or active
function enableMobileFallbacks() {
  document.getElementById('canvas-container').classList.add('fallback-bg');
  
  const hCanvas = document.getElementById('hero-canvas');
  if (hCanvas) hCanvas.style.display = 'none';

  const sCanvas = document.getElementById('skills-canvas');
  if (sCanvas) {
    sCanvas.style.display = 'none';
    const skillsOverlay = document.querySelector('.canvas-instruction-overlay');
    if (skillsOverlay) skillsOverlay.style.display = 'none';
  }

  const cCanvas = document.getElementById('contact-canvas');
  if (cCanvas) cCanvas.style.display = 'none';
}

// Connect layout items to viewport active intersections
function setupActiveLinksObserver() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileItems = document.querySelectorAll('.mobile-nav-item');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px',
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        // Update desktop links active highlights
        navLinks.forEach((link) => {
          const href = link.getAttribute('href').replace('#', '');
          link.classList.toggle('active', href === id);
        });

        // Update mobile bottom tab bar icons active highlights
        mobileItems.forEach((item) => {
          const sectionAttr = item.getAttribute('data-section');
          item.classList.toggle('active', sectionAttr === id);
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach((section) => observer.observe(section));
}
