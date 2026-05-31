import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations(heroScene, contactScene) {
  // -------------------------------------------------------------
  // 1. LOADING SCREEN EXIT & HERO TIMELINE
  // -------------------------------------------------------------
  const loader = document.getElementById('loader');
  
  const exitLoaderAndPlayHero = () => {
    if (!loader) return;

    // Fade out loader overlay
    loader.classList.add('loaded');

    // Create entrance timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.navbar', {
      y: -60,
      opacity: 0,
      duration: 1.0,
      delay: 0.2
    });

    tl.from('.hero-text-card', {
      x: -100,
      opacity: 0,
      duration: 1.2
    }, '-=0.5');

    // Trigger tagline typewriter effect
    tl.call(() => {
      runTypewriter();
    }, null, '-=0.8');

    tl.from('.hero-ctas .btn', {
      y: 20,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8
    }, '-=0.4');

    tl.from('.hero-badge', {
      scale: 0.5,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.3');

    tl.from('.scroll-indicator', {
      opacity: 0,
      y: -10,
      duration: 0.6
    }, '-=0.2');
  };

  // Tagline typewriter script
  const runTypewriter = () => {
    const el = document.querySelector('.hero-tagline');
    if (!el) return;

    const originalHTML = `Building Africa's Tech Stack<br><span class="hero-loc">From Harare, Zimbabwe 🇿🇼</span>`;
    
    // Clear initial content
    el.innerHTML = '';
    
    let isTaglineDone = false;
    let text1 = "Building Africa's Tech Stack";
    let text2 = "From Harare, Zimbabwe 🇿🇼";
    
    let i = 0;
    const type1 = () => {
      if (i < text1.length) {
        el.innerHTML += text1.charAt(i);
        i++;
        setTimeout(type1, 35);
      } else {
        el.innerHTML += '<br><span class="hero-loc"></span>';
        i = 0;
        setTimeout(type2, 150);
      }
    };

    const type2 = () => {
      const sub = el.querySelector('.hero-loc');
      if (i < text2.length) {
        sub.innerHTML += text2.charAt(i);
        i++;
        setTimeout(type2, 35);
      }
    };

    type1();
  };

  // -------------------------------------------------------------
  // 2. SCROLL DRIVEN TRANSITIONS (Hero -> About)
  // -------------------------------------------------------------
  if (heroScene) {
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile) {
      // Shrink and rotate the globe as user scrolls down to About
      gsap.to(heroScene.globeGroup.scale, {
        x: 0.45,
        y: 0.45,
        z: 0.45,
        scrollTrigger: {
          trigger: '#about',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.0
        }
      });

      gsap.to(heroScene.globeGroup.rotation, {
        y: Math.PI * 3.5,
        scrollTrigger: {
          trigger: '#about',
          start: 'top bottom',
          end: 'top top',
          scrub: 1.0
        }
      });

      // Gradually fade out canvas-container as we go deep into page
      gsap.to('#canvas-container', {
        opacity: 0.15,
        scrollTrigger: {
          trigger: '#about',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.0
        }
      });
    }
  }

  // -------------------------------------------------------------
  // 3. STATS IN-VIEW COUNT ANIMATIONS
  // -------------------------------------------------------------
  const statsTrigger = document.getElementById('stats-counter-trigger');
  if (statsTrigger) {
    ScrollTrigger.create({
      trigger: statsTrigger,
      start: 'top 85%',
      onEnter: () => {
        animateStats();
      },
      once: true
    });
  }

  const animateStats = () => {
    // Normal integers
    const numbers = document.querySelectorAll('.stat-num');
    numbers.forEach((num) => {
      const target = parseInt(num.getAttribute('data-target'), 10);
      const countObj = { value: 0 };
      
      gsap.to(countObj, {
        value: target,
        duration: 2.0,
        ease: 'power2.out',
        onUpdate: () => {
          num.textContent = Math.floor(countObj.value) + (target === 1000 ? '+' : '+');
        }
      });
    });

    // Decimals (e.g. 4.8 Rating)
    const decimals = document.querySelectorAll('.stat-num-decimal');
    decimals.forEach((num) => {
      const target = parseFloat(num.getAttribute('data-target'));
      const countObj = { value: 0.0 };

      gsap.to(countObj, {
        value: target,
        duration: 2.0,
        ease: 'power2.out',
        onUpdate: () => {
          num.textContent = countObj.value.toFixed(1) + '★';
        }
      });
    });
  };

  // -------------------------------------------------------------
  // 4. ABOUT CARD INTERACTIVITY
  // -------------------------------------------------------------
  const card = document.getElementById('interactive-card');
  if (card) {
    const wrapper = card.parentNode;
    
    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Limit tilt bounds (X: max ±15deg, Y: max ±15deg)
      const rotateX = -(y / (rect.height / 2)) * 15;
      const rotateY = (x / (rect.width / 2)) * 15;

      gsap.to(card, {
        rotateX: rotateX,
        rotateY: rotateY,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    wrapper.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });
  }

  // -------------------------------------------------------------
  // 5. STACK CARDS SCROLL FADES
  // -------------------------------------------------------------
  gsap.from('.skill-category-card', {
    scrollTrigger: {
      trigger: '.skills-section',
      start: 'top 75%'
    },
    scale: 0.9,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power2.out'
  });

  // -------------------------------------------------------------
  // 6. CONTACT ZOOM TO HARARE
  // -------------------------------------------------------------
  if (contactScene) {
    ScrollTrigger.create({
      trigger: '#contact',
      start: 'top 60%',
      onEnter: () => {
        contactScene.zoomToHarare();
      },
      once: true
    });
  }

  // -------------------------------------------------------------
  // 7. FORM FOCUS & SUBMIT Burst Feedback
  // -------------------------------------------------------------
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('btn-submit-form');
  
  if (form && submitBtn) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Submit feedback button animation
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'CONNECTION SECURED &bull; SENT';
      submitBtn.style.background = '#00FF88';
      submitBtn.style.color = '#000';
      submitBtn.style.boxShadow = '0 0 35px #00FF88';
      
      // Reset after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.style.boxShadow = '';
        form.reset();
      }, 3000);
    });
  }

  // Export exit trigger
  return { exitLoaderAndPlayHero };
}
