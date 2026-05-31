// Canvas-based Custom WebGL/2D Cursor Trail

export function initCursor() {
  const canvas = document.getElementById('custom-cursor');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: width / 2, y: height / 2 };
  let cursor = { x: width / 2, y: height / 2 };
  let speed = 0.15; // Interpolation factor

  let particles = [];
  const maxParticles = 12;
  let isHovered = false;
  let hoverText = '';

  // Resize handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Mouse leave viewport
  document.addEventListener('mouseleave', () => {
    canvas.style.opacity = 0;
  });
  
  document.addEventListener('mouseenter', () => {
    canvas.style.opacity = 1;
  });

  // Detect interactive elements hovers
  const updateHoverState = (e) => {
    const target = e.target.closest('a, button, .product-card, .skill-category-card, .testimonial-card, #skills-canvas, #contact-canvas, .carousel-nav-btn');
    if (target) {
      isHovered = true;
      if (target.closest('.product-card')) {
        hoverText = 'VIEW';
      } else if (target.id === 'skills-canvas') {
        hoverText = 'EXPLORE';
      } else if (target.id === 'contact-canvas') {
        hoverText = 'ORBIT';
      } else {
        hoverText = 'CLICK';
      }
    } else {
      isHovered = false;
      hoverText = '';
    }
  };

  document.addEventListener('mouseover', updateHoverState);

  // Particle constructor
  class TrailParticle {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.alpha = 1.0;
      this.decay = 0.08;
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.restore();
    }

    update() {
      this.alpha -= this.decay;
      return this.alpha > 0;
    }
  }

  // Animation Loop
  let rotationAngle = 0;
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Smooth cursor interpolation
    cursor.x += (mouse.x - cursor.x) * speed;
    cursor.y += (mouse.y - cursor.y) * speed;

    // Spawn trailing particles when moving
    const distanceMoved = Math.hypot(mouse.x - cursor.x, mouse.y - cursor.y);
    if (distanceMoved > 1 && !isHovered) {
      particles.push(
        new TrailParticle(
          cursor.x,
          cursor.y,
          3,
          particles.length % 2 === 0 ? '#00FF88' : '#00D4FF'
        )
      );
    }

    // Cap particle array size
    if (particles.length > maxParticles) {
      particles.shift();
    }

    // Update and draw trail particles
    particles = particles.filter((p) => {
      const active = p.update();
      if (active) p.draw();
      return active;
    });

    // Draw active cursor node
    if (isHovered) {
      // Draw hovering expanded ring
      rotationAngle += 0.05;
      ctx.save();
      ctx.translate(cursor.x, cursor.y);
      ctx.rotate(rotationAngle);
      
      // Outer neon dashed circle
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.strokeStyle = '#00FF88';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#00FF88';
      ctx.stroke();

      ctx.restore();

      // Draw inside text
      ctx.save();
      ctx.translate(cursor.x, cursor.y);
      ctx.font = "bold 8px 'JetBrains Mono', monospace";
      ctx.fillStyle = '#00D4FF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 5;
      ctx.shadowColor = '#00D4FF';
      ctx.fillText(hoverText, 0, 1);
      ctx.restore();

      // Tiny core node
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6B35';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#FF6B35';
      ctx.fill();

    } else {
      // Draw standard sleek indicator
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#00FF88';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00FF88';
      ctx.fill();

      // Draw crosshair indicators around the dot
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.4)';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(cursor.x - 10, cursor.y);
      ctx.lineTo(cursor.x - 7, cursor.y);
      ctx.moveTo(cursor.x + 7, cursor.y);
      ctx.lineTo(cursor.x + 10, cursor.y);
      ctx.moveTo(cursor.x, cursor.y - 10);
      ctx.lineTo(cursor.x, cursor.y - 7);
      ctx.moveTo(cursor.x, cursor.y + 7);
      ctx.lineTo(cursor.x, cursor.y + 10);
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  // Hide default cursor in CSS on desktop
  const style = document.createElement('style');
  style.innerHTML = `
    @media (min-width: 769px) {
      a, button, body, select, input, textarea, canvas, [role="button"] {
        cursor: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  animate();
}
