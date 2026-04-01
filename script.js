// ==========================================
// ASUTOSH PORTFOLIO - INTERACTIONS
// ==========================================

// =================== THEME TOGGLE ===================
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let overlay = null;
  let circle = null;

  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    circle = document.createElement('div');
    overlay.appendChild(circle);
    document.body.appendChild(overlay);
  }

  function applyTheme(mode) {
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

  function setTheme(mode, animated = false, clickX = 0, clickY = 0) {
    if (!animated || prefersReducedMotion) {
      applyTheme(mode);
      return;
    }

    ensureOverlay();
    const maxDistance = Math.hypot(
      Math.max(clickX, window.innerWidth - clickX),
      Math.max(clickY, window.innerHeight - clickY)
    );
    const size = maxDistance * 2.1;

    circle.style.cssText = `
      position: absolute;
      left: ${clickX}px;
      top: ${clickY}px;
      width: ${size}px;
      height: ${size}px;
      background: ${mode === 'light' ? '#ffffff' : '#09090b'};
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.92;
      transition: transform 460ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease;
    `;

    overlay.style.opacity = '1';
    void circle.offsetWidth;
    requestAnimationFrame(() => {
      circle.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    window.setTimeout(() => {
      applyTheme(mode);
    }, 120);

    setTimeout(() => {
      overlay.style.opacity = '0';
      circle.style.opacity = '0';
    }, 360);

    setTimeout(() => {
      circle.style.transform = 'translate(-50%, -50%) scale(0)';
    }, 520);
  }

  setTheme(saved ?? 'dark', false);

  toggle.addEventListener('click', () => {
    const rect = toggle.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;
    const next = root.classList.contains('light') ? 'dark' : 'light';
    setTheme(next, true, clickX, clickY);
  });
})();

// =================== SMOOTH SCROLL ===================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function onClick(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

// =================== REVEAL ANIMATIONS ===================
(function initRevealAnimations() {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach((target) => observer.observe(target));
})();

// =================== COPY EMAIL ===================
(function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmail');
  const email = 'asutoshpattanayak806@gmail.com';
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      const original = copyBtn.getAttribute('data-original') || copyBtn.textContent;
      copyBtn.setAttribute('data-original', original);
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBtn.textContent = original;
      }, 2000);
    } catch (err) {
      alert('Could not copy email. Please copy manually: ' + email);
    }
  });
})();

// =================== CURRENT YEAR ===================
(function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();
})();

// =================== NOW BUILDING AUTO CAROUSEL ===================
(function initNowBuildingCarousel() {
  const track = document.querySelector('.now-building-grid');
  if (!track) return;

  const mobileQuery = window.matchMedia('(max-width: 780px)');
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let rafId = null;
  let pauseTimeout = null;
  let direction = 1;
  let lastTimestamp = 0;
  let isPaused = false;

  function stopAutoplay() {
    if (rafId === null) return;
    window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  function canAutoplay() {
    if (!mobileQuery.matches || reducedMotionQuery.matches || isPaused) return false;
    const maxScroll = track.scrollWidth - track.clientWidth;
    return maxScroll > 8;
  }

  function animate(timestamp) {
    if (!canAutoplay()) {
      stopAutoplay();
      return;
    }

    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const speed = 0.045;
    const nextLeft = track.scrollLeft + (delta * speed * direction);

    if (nextLeft >= maxScroll) {
      track.scrollLeft = maxScroll;
      direction = -1;
    } else if (nextLeft <= 0) {
      track.scrollLeft = 0;
      direction = 1;
    } else {
      track.scrollLeft = nextLeft;
    }

    rafId = window.requestAnimationFrame(animate);
  }

  function startAutoplay() {
    stopAutoplay();
    lastTimestamp = 0;
    if (!canAutoplay()) return;
    rafId = window.requestAnimationFrame(animate);
  }

  function pauseAutoplay() {
    isPaused = true;
    stopAutoplay();
    window.clearTimeout(pauseTimeout);
  }

  function resumeAutoplayWithDelay() {
    pauseAutoplay();
    window.clearTimeout(pauseTimeout);
    pauseTimeout = window.setTimeout(() => {
      isPaused = false;
      startAutoplay();
    }, 1800);
  }

  track.addEventListener('mouseenter', pauseAutoplay);
  track.addEventListener('mouseleave', () => {
    isPaused = false;
    startAutoplay();
  });
  track.addEventListener('touchstart', resumeAutoplayWithDelay, { passive: true });
  track.addEventListener('touchend', resumeAutoplayWithDelay, { passive: true });
  track.addEventListener('pointerdown', resumeAutoplayWithDelay);
  window.addEventListener('resize', startAutoplay);

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', startAutoplay);
    reducedMotionQuery.addEventListener('change', startAutoplay);
  }

  startAutoplay();
})();
