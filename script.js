/* ========================
   script.js — Ali Sir Chemistry
   Animations, Particles, Interactions
======================== */

'use strict';

/* ========== THEME MANAGER ========== */
(function initTheme() {
  const html   = document.documentElement;
  const btn    = document.getElementById('themeToggle');
  const DARK   = 'dark';
  const KEY    = 'aliSirTheme';

  // Apply saved preference (or default to light)
  const saved = localStorage.getItem(KEY);
  if (saved === DARK) html.setAttribute('data-theme', DARK);

  function setTheme(isDark) {
    if (isDark) {
      html.setAttribute('data-theme', DARK);
      localStorage.setItem(KEY, DARK);
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem(KEY, 'light');
    }
  }

  if (btn) {
    btn.addEventListener('click', () => {
      const isDark = html.getAttribute('data-theme') === DARK;
      setTheme(!isDark);   // flip
    });
  }
})();

/* ========== PARTICLE CANVAS ========== */
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], connections = [];
  const NUM_PARTICLES = 55;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 2.5 + 0.8;
      this.alpha = Math.random() * 0.5 + 0.15;
      const colors = ['#67e8f9', '#a78bfa', '#60a5fa', '#f472b6', '#34d399'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = (Math.random() * 0.02) + 0.005;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.pulseSpeed;
      if (this.x < -10) this.x = W + 10;
      if (this.x > W + 10) this.x = -10;
      if (this.y < -10) this.y = H + 10;
      if (this.y > H + 10) this.y = -10;
    }
    draw() {
      const pulsedAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + Math.floor(pulsedAlpha * 255).toString(16).padStart(2, '0');
      ctx.fill();
      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 3);
      grad.addColorStop(0, this.color + '22');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = Array.from({ length: NUM_PARTICLES }, () => new Particle());
  }
  initParticles();

  const MAX_DIST = 120;

  function animate() {
    ctx.clearRect(0, 0, W, H);
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(103, 232, 249, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();


/* ========== NAVBAR ========== */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const allNavLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveNav();
    toggleBackToTop();
  }, { passive: true });

  // Hamburger
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  function updateActiveNav() {
    const sections = ['home', 'about', 'courses', 'why-us', 'location', 'contact'];
    const scrollY = window.scrollY + 120;
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });
    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }
})();


/* ========== BACK TO TOP ========== */
const backToTopBtn = document.getElementById('backToTop');
function toggleBackToTop() {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}
backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ========== SCROLL REVEAL ANIMATIONS ========== */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();


/* ========== HERO ELEMENTS STAGGER ========== */
(function heroStagger() {
  const heroReveal = document.querySelectorAll('.hero .reveal-up');
  heroReveal.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
    setTimeout(() => el.classList.add('revealed'), 100);
  });
})();


/* ========== PARALLAX EFFECT ========== */
(function initParallax() {
  const hero = document.querySelector('.hero');
  const molecule = document.querySelector('.molecule-container');
  const blobs = document.querySelectorAll('.blob');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (molecule) {
      molecule.style.transform = `translateY(calc(-50% + ${scrollY * 0.15}px))`;
    }
    blobs.forEach((blob, i) => {
      const speed = 0.04 + i * 0.015;
      blob.style.transform += ` translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  // Mouse parallax for floating elements
  const floatEls = document.querySelectorAll('.float-el');
  document.addEventListener('mousemove', (e) => {
    const mx = (e.clientX / window.innerWidth - 0.5) * 2;
    const my = (e.clientY / window.innerHeight - 0.5) * 2;
    floatEls.forEach((el, i) => {
      const depth = (i % 3 + 1) * 6;
      el.style.transform = `translateX(${mx * depth}px) translateY(${my * depth}px)`;
    });
  });
})();


/* ========== CONTACT FORM — EmailJS + Validation ========== */
(function initContactForm() {

  // ── Initialise EmailJS ──────────────────────────────────
  emailjs.init('01Z_ZobKPtIAhsvxI');

  const form      = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submit-form-btn');
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoad   = submitBtn.querySelector('.btn-loading');

  if (!form) return;

  // ── Helper: show / clear inline field errors ─────────────
  function showError(inputId, errorId, msg) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errorId);
    if (!input || !err) return;
    input.classList.add('invalid');
    err.textContent = msg;
    err.classList.add('visible');
  }
  function clearError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const err   = document.getElementById(errorId);
    if (!input || !err) return;
    input.classList.remove('invalid');
    err.classList.remove('visible');
  }

  // ── Phone: allow only digits, max 10 chars ───────────────
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      // Strip anything that's not a digit
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
      if (this.value.length > 0) clearError('phone', 'phone-error');
    });
  }

  // ── Clear errors on user input ───────────────────────────
  const nameInput = document.getElementById('name');
  if (nameInput) nameInput.addEventListener('input', () => clearError('name', 'name-error'));

  const courseSelect = document.getElementById('course-select');
  if (courseSelect) courseSelect.addEventListener('change', () => clearError('course-select', 'course-error'));

  // ── Validation function ──────────────────────────────────
  function validate() {
    let valid = true;

    const name   = (nameInput   ? nameInput.value.trim()   : '');
    const phone  = (phoneInput  ? phoneInput.value.trim()  : '');
    const course = (courseSelect? courseSelect.value        : '');

    // Name
    if (!name) {
      showError('name', 'name-error', '⚠ Please enter your name.');
      valid = false;
    }

    // Phone — must be exactly 10 digits starting with 6-9
    if (!phone) {
      showError('phone', 'phone-error', '⚠ Phone number is required.');
      valid = false;
    } else if (!/^[6-9][0-9]{9}$/.test(phone)) {
      showError('phone', 'phone-error', '⚠ Enter a valid 10-digit Indian mobile number (starts with 6-9).');
      valid = false;
    }

    // Course
    if (!course) {
      showError('course-select', 'course-error', '⚠ Please select a course.');
      valid = false;
    }

    return valid;
  }

  // ── Form submit ──────────────────────────────────────────
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validate()) return;   // Stop if invalid

    const name     = nameInput.value.trim();
    const phone    = phoneInput.value.trim();
    const email    = (document.getElementById('email') || {}).value || '';
    const message  = document.getElementById('message').value.trim();
    const courseRaw= courseSelect ? courseSelect.value : '';
    const courseMap = {
      class11   : 'Class 11 Chemistry',
      class12   : 'Class 12 Chemistry',
      'neet-jee': 'NEET / JEE Chemistry',
      ''        : 'General Enquiry'
    };
    const course = courseMap[courseRaw] || courseRaw || 'General Enquiry';

    // Show loading
    btnText.classList.add('hidden');
    btnLoad.classList.remove('hidden');
    submitBtn.disabled = true;

    // Send via EmailJS
    emailjs.send(
      'service_sx7ikle',
      'template_cpyzfvr',
      { from_name: name, phone_number: phone, email_id: email, course, message }
    )
    .then(function () {
      form.classList.add('hidden');
      successEl.classList.remove('hidden');
      alert('Message Sent Successfully! We will contact you soon. 🎉');
    })
    .catch(function (err) {
      console.error('EmailJS error:', err);
      alert('Oops! Something went wrong. Please try calling or WhatsApp directly.');
      btnText.classList.remove('hidden');
      btnLoad.classList.add('hidden');
      submitBtn.disabled = false;
    });
  });

  function shakeForm() {
    const card = document.querySelector('.contact-form-card');
    card.style.animation = 'shake 0.5s ease';
    setTimeout(() => card.style.animation = '', 500);
  }
})();


/* ========== BUTTON RIPPLE EFFECTS ========== */
(function initRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        width: 100px; height: 100px;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        transform: translate(-50%, -50%) scale(0);
        animation: rippleAnim 0.6s ease forwards;
        pointer-events: none;
        left: ${e.offsetX}px;
        top: ${e.offsetY}px;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();

/* Inject ripple keyframes */
const styleEl = document.createElement('style');
styleEl.textContent = `
@keyframes rippleAnim {
  to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
`;
document.head.appendChild(styleEl);


/* ========== COUNTER ANIMATION ========== */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const targets = ['28', '98'];
  const suffixes = ['', '%'];
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      stats.forEach((el, i) => {
        const target = parseInt(targets[i]);
        const suffix = suffixes[i];
        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current) + suffix;
          if (current >= target) clearInterval(timer);
        }, 40);
      });
    }
  }, { threshold: 0.5 });

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) observer.observe(statsEl);
})();


/* ========== SMOOTH SCROLL FOR ANCHORS ========== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
      const targetY = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  });
});


/* ========== CARD TILT EFFECT ========== */
(function initTilt() {
  const cards = document.querySelectorAll('.course-card, .why-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
})();


/* ========== CHEMISTRY MOLECULE ORBIT ANIMATION ========== */
(function initOrbitCanvas() {
  // Draw an additional subtle orbit in hero
  const orbitContainer = document.createElement('div');
  orbitContainer.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 600px; height: 600px;
    pointer-events: none;
    z-index: 0;
    opacity: 0.08;
  `;
  const orbitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  orbitSvg.setAttribute('viewBox', '0 0 600 600');
  orbitSvg.style.cssText = 'width:100%;height:100%;animation:moleculeSpin 50s linear infinite;';
  orbitSvg.innerHTML = `
    <circle cx="300" cy="300" r="200" fill="none" stroke="#67e8f9" stroke-width="0.8" stroke-dasharray="10 6"/>
    <circle cx="300" cy="300" r="140" fill="none" stroke="#a78bfa" stroke-width="0.8" stroke-dasharray="8 5"/>
    <circle cx="300" cy="300" r="80" fill="none" stroke="#60a5fa" stroke-width="0.8" stroke-dasharray="5 4"/>
    <circle cx="300" cy="100" r="8" fill="#67e8f9" opacity="0.7"/>
    <circle cx="480" cy="360" r="6" fill="#a78bfa" opacity="0.7"/>
    <circle cx="220" cy="420" r="7" fill="#60a5fa" opacity="0.7"/>
    <circle cx="380" cy="220" r="5" fill="#f472b6" opacity="0.7"/>
    <circle cx="160" cy="250" r="6" fill="#34d399" opacity="0.7"/>
  `;
  orbitContainer.appendChild(orbitSvg);
  const hero = document.querySelector('.hero');
  if (hero) hero.appendChild(orbitContainer);
})();


/* ========== PERFORMANCE: Reduced motion support ========== */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.blob, .float-el, .molecule-svg, .testimony-track').forEach(el => {
    el.style.animation = 'none';
  });
}

console.log('%c⚗️ Ali Sir Chemistry Website', 'color:#67e8f9;font-size:18px;font-weight:bold;');
console.log('%c Built with 💜 for chemistry excellence', 'color:#a78bfa;font-size:12px;');

/* ========== TESTIMONIALS SLIDER ========== */
(function initTestimonials() {
  const track    = document.getElementById('testiTrack');
  const viewport = document.getElementById('testiViewport');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  if (!track || !dotsWrap) return;

  const slides = track.querySelectorAll('.testi-slide');
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  // How many slides visible at once
  function getSlidesVisible() {
    const w = window.innerWidth;
    if (w <= 640)  return 1;
    if (w <= 1024) return 2;
    return 3;
  }

  // Build dots
  function buildDots() {
    dotsWrap.innerHTML = '';
    const visible = getSlidesVisible();
    const pages   = Math.ceil(total / visible);
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.className = 'testi-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Review ' + (i + 1));
      btn.addEventListener('click', () => goTo(i * visible));
      dotsWrap.appendChild(btn);
    }
  }

  function updateDots() {
    const visible = getSlidesVisible();
    const dots    = dotsWrap.querySelectorAll('.testi-dot');
    const page    = Math.floor(current / visible);
    dots.forEach((d, i) => d.classList.toggle('active', i === page));
  }

  function getSlideWidth() {
    return slides[0] ? slides[0].getBoundingClientRect().width + 24 : 0;
  }

  function goTo(index) {
    const visible = getSlidesVisible();
    const maxIdx  = total - visible;
    current = Math.max(0, Math.min(index, maxIdx));
    const offset = current * getSlideWidth();
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current >= maxIdx;
  }

  function next() {
    const visible = getSlidesVisible();
    goTo(current + visible);
    if (current >= total - getSlidesVisible()) { setTimeout(() => goTo(0), 600); }
  }

  function prev() {
    const visible = getSlidesVisible();
    goTo(current - visible);
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 4500);
  }
  function stopAuto() { clearInterval(autoTimer); }

  // Arrow buttons
  prevBtn.addEventListener('click', () => { prev(); stopAuto(); setTimeout(startAuto, 8000); });
  nextBtn.addEventListener('click', () => { next(); stopAuto(); setTimeout(startAuto, 8000); });

  // Touch / swipe support
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); }
    setTimeout(startAuto, 6000);
  }, { passive: true });

  // Pause on hover
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  // Init & resize
  function init() {
    buildDots();
    goTo(0);
  }
  init();
  startAuto();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { init(); }, 200);
  });
})();
