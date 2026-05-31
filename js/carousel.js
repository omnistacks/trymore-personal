// 3D DOM-based perspective carousel for products

export function initProductCarousel() {
  const track = document.getElementById('carousel-track');
  const viewport = document.getElementById('carousel-viewport');
  const cards = document.querySelectorAll('.product-card');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track || !cards.length || !prevBtn || !nextBtn || !dotsContainer) return;

  let activeIndex = 0;
  const totalCards = cards.length;

  // Initialize Indicators/Dots
  dotsContainer.innerHTML = '';
  cards.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => navigateTo(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.carousel-dot');

  // Apply 3D CSS Perspective transforms to each card
  const updateTransforms = () => {
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // In mobile view, reset styling and let swipe snap handle the positioning
      cards.forEach((card) => {
        card.style.transform = 'none';
        card.classList.remove('active');
      });
      cards[activeIndex].classList.add('active');
      return;
    }

    // Desktop 3D layout updates
    const cardWidth = cards[0].offsetWidth;
    const viewportWidth = viewport.offsetWidth;
    
    // Shift track to center the active card
    const offset = (viewportWidth / 2) - (cardWidth / 2) - (activeIndex * (cardWidth + 30));
    track.style.transform = `translateX(${offset}px)`;

    cards.forEach((card, idx) => {
      card.classList.remove('active');
      
      const diff = idx - activeIndex;
      const absDiff = Math.abs(diff);

      if (diff === 0) {
        // Active node: front & glowing
        card.classList.add('active');
        card.style.transform = 'scale(1.05) translateZ(50px) rotateY(0deg)';
        card.style.opacity = '1';
        card.style.zIndex = '5';
      } else if (diff === 1) {
        // Right side neighbor
        card.style.transform = 'scale(0.9) translateZ(0px) rotateY(-15deg)';
        card.style.opacity = '0.7';
        card.style.zIndex = '3';
      } else if (diff === -1) {
        // Left side neighbor
        card.style.transform = 'scale(0.9) translateZ(0px) rotateY(15deg)';
        card.style.opacity = '0.7';
        card.style.zIndex = '3';
      } else {
        // Far nodes
        const side = diff > 0 ? -25 : 25;
        card.style.transform = `scale(0.8) translateZ(-50px) rotateY(${side}deg)`;
        card.style.opacity = '0.4';
        card.style.zIndex = '1';
      }
    });

    // Update active dot
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  };

  // Navigations
  const navigateTo = (index) => {
    activeIndex = Math.max(0, Math.min(index, totalCards - 1));
    updateTransforms();
  };

  const nextCard = () => {
    if (activeIndex < totalCards - 1) {
      activeIndex++;
    } else {
      activeIndex = 0; // Wrap around
    }
    updateTransforms();
  };

  const prevCard = () => {
    if (activeIndex > 0) {
      activeIndex--;
    } else {
      activeIndex = totalCards - 1; // Wrap around
    }
    updateTransforms();
  };

  // Click bindings
  prevBtn.addEventListener('click', prevCard);
  nextBtn.addEventListener('click', nextCard);

  // Keyboard navigation support
  window.addEventListener('keydown', (e) => {
    const section = document.getElementById('products');
    const bounds = section.getBoundingClientRect();
    
    // Only intercept key presses if products section is visible
    if (bounds.top < window.innerHeight && bounds.bottom > 0) {
      if (e.key === 'ArrowRight') {
        nextCard();
      } else if (e.key === 'ArrowLeft') {
        prevCard();
      }
    }
  });

  // Touch Swipe interactions for mobile swipe tracking
  let touchStartX = 0;
  let touchEndX = 0;

  viewport.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  viewport.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // In snap layout on mobile, track which card is at screen center on scroll
      setTimeout(() => {
        const scrollLeft = viewport.scrollLeft;
        const cardWidth = cards[0].offsetWidth + 16; // 16px gap
        const currentIdx = Math.round(scrollLeft / cardWidth);
        activeIndex = Math.max(0, Math.min(currentIdx, totalCards - 1));
        
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === activeIndex);
        });
      }, 150);
    } else {
      // Swipe transitions on desktop
      if (touchStartX - touchEndX > swipeThreshold) {
        nextCard();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        prevCard();
      }
    }
  };

  // Card click centers cards
  cards.forEach((card, idx) => {
    card.addEventListener('click', (e) => {
      // Stop clicks from triggering link direct transitions unless card is already active
      if (window.innerWidth >= 768 && idx !== activeIndex) {
        e.preventDefault();
        navigateTo(idx);
      }
    });
  });

  // Initialize layouts
  window.addEventListener('resize', updateTransforms);
  updateTransforms();

  // Return programmatic navigation handle
  return { navigateTo, nextCard, prevCard };
}
