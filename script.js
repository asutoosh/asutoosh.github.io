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
      transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
    `;

    overlay.style.opacity = '1';
    void circle.offsetWidth;
    requestAnimationFrame(() => {
      circle.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    applyTheme(mode);

    setTimeout(() => {
      overlay.style.opacity = '0';
    }, 280);

    setTimeout(() => {
      circle.style.transform = 'translate(-50%, -50%) scale(0)';
    }, 420);
  }

  setTheme(saved ?? (prefersLight ? 'light' : 'dark'), false);

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
