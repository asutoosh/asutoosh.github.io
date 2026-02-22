// ==========================================
// ASUTOSH'S PORTFOLIO - INTERACTIONS
// ==========================================

// =================== THEME TOGGLE ===================
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  
  if (!toggle) return;
  
  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  
  let overlay = null;
  let circle = null;
  
  // Initialize overlay after DOM is ready
  function createOverlay() {
    if (overlay) return;
    
    overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    
    circle = document.createElement('div');
    circle.className = 'theme-circle';
    
    overlay.appendChild(circle);
    document.body.appendChild(overlay);
  }
  
  function setTheme(mode, animated = false, clickX = 0, clickY = 0) {
    if (animated) {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (!prefersReducedMotion) {
        createOverlay();
        
        // Calculate the maximum distance to cover the entire screen
        const maxDistance = Math.hypot(
          Math.max(clickX, window.innerWidth - clickX),
          Math.max(clickY, window.innerHeight - clickY)
        );
        
        const size = maxDistance * 2.5;
        
        // Reset circle
        circle.style.cssText = `
          position: absolute;
          left: ${clickX}px;
          top: ${clickY}px;
          width: ${size}px;
          height: ${size}px;
          background: ${mode === 'light' ? '#ffffff' : '#0a0a0a'};
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        // Show overlay
        overlay.style.opacity = '1';
        
        // Force reflow to ensure initial state is applied
        void circle.offsetWidth;
        
        // Trigger animation
        requestAnimationFrame(() => {
          circle.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        
        // Apply theme change during animation
        setTimeout(() => {
          if (mode === 'light') {
            root.classList.add('light');
            toggle.setAttribute('aria-checked', 'true');
            toggle.textContent = '☀️';
          } else {
            root.classList.remove('light');
            toggle.setAttribute('aria-checked', 'false');
            toggle.textContent = '🌙';
          }
          localStorage.setItem('theme', mode);
        }, 400);
        
        // Hide overlay after animation
        setTimeout(() => {
          overlay.style.opacity = '0';
        }, 800);
        
        // Reset for next animation
        setTimeout(() => {
          circle.style.transform = 'translate(-50%, -50%) scale(0)';
        }, 1000);
      } else {
        // Instant theme change for reduced motion preference
        if (mode === 'light') {
          root.classList.add('light');
          toggle.setAttribute('aria-checked', 'true');
          toggle.textContent = '☀️';
        } else {
          root.classList.remove('light');
          toggle.setAttribute('aria-checked', 'false');
          toggle.textContent = '🌙';
        }
        localStorage.setItem('theme', mode);
      }
    } else {
      // Initial theme set (no animation)
      if (mode === 'light') {
        root.classList.add('light');
        toggle.setAttribute('aria-checked', 'true');
        toggle.textContent = '☀️';
      } else {
        root.classList.remove('light');
        toggle.setAttribute('aria-checked', 'false');
        toggle.textContent = '🌙';
      }
      localStorage.setItem('theme', mode);
    }
  }
  
  // Initialize theme
  setTheme(saved ?? (prefersLight ? 'light' : 'dark'), false);
  
  // Toggle on click with animation
  toggle.addEventListener('click', (e) => {
    const rect = toggle.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;
    
    const newMode = root.classList.contains('light') ? 'dark' : 'light';
    setTheme(newMode, true, clickX, clickY);
  });
})();

// =================== MOBILE NAVIGATION ===================
(function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  
  if (!hamburger || !nav) return;
  
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });
  
  // Close nav when clicking a link
  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();

// =================== SMOOTH SCROLL ===================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
})();

// =================== SCROLL ANIMATIONS ===================
(function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );
  
  // Observe all sections
  document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
  });
})();

// =================== COPY EMAIL ===================
(function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmail');
  const email = 'asutoshpattanayak806@gmail.com';
  
  if (!copyBtn) return;
  
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✓ Copied!';
      
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    } catch (err) {
      alert('Could not copy email. Please copy manually: ' + email);
    }
  });
})();

// =================== CURRENT YEAR ===================
(function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
})();

// =================== THREE.JS PARTICLES BACKGROUND ===================
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  // Skip on reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  // Skip on mobile/low-power
  if (window.navigator.hardwareConcurrency <= 2 ||
      (window.navigator.connection && window.navigator.connection.saveData)) {
    canvas.style.display = 'none';
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create particles
  const particleCount = window.innerWidth < 768 ? 50 : 150;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    velocities.push({
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Accent color from CSS variable
  const isDark = !document.documentElement.classList.contains('light');
  const particleColor = isDark ? 0x3b82f6 : 0x2563eb;

  const material = new THREE.PointsMaterial({
    color: particleColor,
    size: 0.05,
    transparent: true,
    opacity: 0.8
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  camera.position.z = 5;

  // Animation
  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);

    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += velocities[i].x;
      positions[i * 3 + 1] += velocities[i].y;
      positions[i * 3 + 2] += velocities[i].z;

      // Wrap around
      if (Math.abs(positions[i * 3]) > 5) positions[i * 3] *= -0.9;
      if (Math.abs(positions[i * 3 + 1]) > 5) positions[i * 3 + 1] *= -0.9;
      if (Math.abs(positions[i * 3 + 2]) > 5) positions[i * 3 + 2] *= -0.9;
    }
    particles.geometry.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.001;

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Update color on theme change
  const observer = new MutationObserver(() => {
    const isDark = !document.documentElement.classList.contains('light');
    material.color.setHex(isDark ? 0x3b82f6 : 0x2563eb);
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Cleanup
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animationId);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  });
})();
