/* ============================================================
   AEGISZ · Production JS · v2.0
   Pure frontend — no API calls, no backend
   ============================================================ */

'use strict';

// ─── NAV SCROLL ──────────────────────────────────────────────
const nav = document.querySelector('.nav');
const onScroll = () => nav && nav.classList.toggle('scrolled', window.scrollY > 48);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ─── MOBILE MENU ─────────────────────────────────────────────
const hamburger   = document.querySelector('.hamburger');
const mobileNav   = document.querySelector('.mobile-nav');
const mobileLinks = mobileNav?.querySelectorAll('a') ?? [];

function openMenu() {
  hamburger?.classList.add('open');
  mobileNav?.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger?.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  hamburger?.classList.remove('open');
  mobileNav?.classList.remove('open');
  document.body.style.overflow = '';
  hamburger?.setAttribute('aria-expanded', 'false');
}

hamburger?.addEventListener('click', () =>
  mobileNav?.classList.contains('open') ? closeMenu() : openMenu()
);
mobileLinks.forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

// ─── SMOOTH ANCHOR SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── SCROLL REVEAL ───────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) {
      target.classList.add('visible');
      revealObserver.unobserve(target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── COUNTER ANIMATION ───────────────────────────────────────
function animateCount(el, to, duration = 1400) {
  const suffix = el.dataset.suffix ?? '';
  const start  = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * to) + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting && !target.dataset.done) {
      target.dataset.done = '1';
      animateCount(target, parseInt(target.dataset.count));
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ─── HERO PARTICLE CANVAS ────────────────────────────────────
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    W = canvas.width  = canvas.offsetWidth  * dpr;
    H = canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width  = canvas.offsetWidth  + 'px';
    canvas.style.height = canvas.offsetHeight + 'px';
    makeParticles();
  }

  class P {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * (W / (window.devicePixelRatio||1));
      this.y = init ? Math.random() * (H / (window.devicePixelRatio||1)) : (Math.random() > .5 ? 0 : (H / (window.devicePixelRatio||1)));
      this.r  = Math.random() * 1.2 + 0.3;
      this.vx = (Math.random() - .5) * 0.25;
      this.vy = (Math.random() - .5) * 0.25;
      this.a  = Math.random() * 0.35 + 0.04;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      const W2 = W / (window.devicePixelRatio||1);
      const H2 = H / (window.devicePixelRatio||1);
      if (this.x < -10 || this.x > W2+10 || this.y < -10 || this.y > H2+10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,0,0,${this.a})`;
      ctx.fill();
    }
  }

  function makeParticles() {
    const count = Math.min(Math.floor((W * H) / ((window.devicePixelRatio||1) * 14000)), 80);
    particles = Array.from({ length: count }, () => new P());
  }

  function drawEdges() {
    const W2 = W / (window.devicePixelRatio||1);
    const maxDist = Math.min(W2 * 0.14, 140);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,0,0,${0.03 * (1 - d / maxDist)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  let raf;
  function tick() {
    ctx.clearRect(0, 0, W / (window.devicePixelRatio||1), H / (window.devicePixelRatio||1));
    particles.forEach(p => { p.update(); p.draw(); });
    drawEdges();
    raf = requestAnimationFrame(tick);
  }

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else tick();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  resize();
  tick();
})();

// ─── LIGHT PARALLAX ──────────────────────────────────────────
(function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        els.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.2;
          el.style.transform = `translateY(${sy * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();
