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
  
  function setTheme(mode) {
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
  
  // Initialize theme
  setTheme(saved ?? (prefersLight ? 'light' : 'dark'));
  
  // Toggle on click
  toggle.addEventListener('click', () => {
    setTheme(root.classList.contains('light') ? 'dark' : 'light');
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
