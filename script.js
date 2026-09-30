/* script.js — Professional Portfolio Interactions */
(function () {
  'use strict';

  /* ─── Smooth Page Load ─────────────────────── */
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => { document.body.style.opacity = '1'; });

  /* ─── Custom Cursor ────────────────────────── */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  if (dot && ring) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    })();
    document.querySelectorAll('a,button,.tool-chip,.acc-item,.project-card,.contact-method,.about-card,.ach-card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
  }

  /* ─── Particle Canvas ──────────────────────── */
  const canvas = document.getElementById('particleCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    window.addEventListener('resize', () => {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    });

    const COUNT = Math.min(70, Math.floor(W * H / 20000));
    const COLORS = ['#3b82f6','#06b6d4','#8b5cf6'];

    class P {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W; this.y = Math.random() * H;
        this.vx = (Math.random() - .5) * .35; this.vy = (Math.random() - .5) * .35;
        this.r = Math.random() * 1.4 + .4;
        this.o = Math.random() * .45 + .1;
        this.c = COLORS[Math.floor(Math.random() * COLORS.length)];
      }
      step() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.save(); ctx.globalAlpha = this.o;
        ctx.fillStyle = this.c;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }
    }

    const ps = Array.from({ length: COUNT }, () => new P());

    function drawLines() {
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            ctx.save(); ctx.globalAlpha = (1 - d / 130) * 0.1;
            ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = .5;
            ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y);
            ctx.stroke(); ctx.restore();
          }
        }
      }
    }

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      ps.forEach(p => { p.step(); p.draw(); });
      drawLines();
      requestAnimationFrame(loop);
    })();
  }

  /* ─── Navbar: scroll + active + hamburger ──── */
  const nav  = document.getElementById('mainNav');
  const navL = document.getElementById('navLinks');
  const ham  = document.getElementById('navHamburger');

  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('scrolled', scrollY > 50);
    updateActive();
    // Back to top
    const btn = document.getElementById('backToTop');
    btn && btn.classList.toggle('visible', scrollY > 500);
  });

  function updateActive() {
    const links = document.querySelectorAll('.nav-link');
    let cur = '';
    document.querySelectorAll('section[id]').forEach(s => {
      if (scrollY >= s.offsetTop - 130) cur = s.id;
    });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }

  ham && ham.addEventListener('click', () => navL && navL.classList.toggle('open'));
  navL && navL.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navL.classList.remove('open')));

  /* ─── Back to top ──────────────────────────── */
  const btt = document.getElementById('backToTop');
  btt && btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─── Smooth Scroll ─────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ─── Typewriter ────────────────────────────── */
  const dynEl = document.getElementById('roleDynamic');
  if (dynEl) {
    const words = [
      'Autonomous Rovers',
      'IoT Systems',
      'Embedded Firmware',
      'Computer Vision Pipelines',
      'Smart Home Platforms',
      'Robot Navigation Logic',
    ];
    let wi = 0, ci = 0, del = false;
    function type() {
      const w = words[wi];
      dynEl.textContent = del ? w.slice(0, ci - 1) : w.slice(0, ci + 1);
      del ? ci-- : ci++;
      let t = del ? 48 : 82;
      if (!del && ci === w.length) { t = 2200; del = true; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; t = 400; }
      setTimeout(type, t);
    }
    setTimeout(type, 1200);
  }

  /* ─── Scroll-Reveal (AOS) ───────────────────── */
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.aosDelay || 0);
        setTimeout(() => e.target.classList.add('aos-animate'), delay + i * 60);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-aos]').forEach(el => obs.observe(el));

  /* ─── Skill Bar Animations ──────────────────── */
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.si-fill').forEach(bar => {
          const w = bar.dataset.w || 0;
          setTimeout(() => { bar.style.width = w + '%'; }, 200);
        });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-cat').forEach(c => skillObs.observe(c));

  /* ─── Counter Animation ─────────────────────── */
  function countUp(el, target, suffix) {
    let cur = 0;
    const step = target / 45;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur) + suffix;
      if (cur >= target) clearInterval(t);
    }, 38);
  }

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    const so = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        statsEl.querySelectorAll('.stat-num').forEach(n => {
          countUp(n, parseFloat(n.dataset.target || 0), n.dataset.suffix || '');
        });
        so.unobserve(statsEl);
      }
    }, { threshold: 0.5 });
    so.observe(statsEl);
  }

  /* ─── 3D Tilt on Project Cards ──────────────── */
  document.querySelectorAll('.project-card, .project-featured, .about-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      const rx2 = ((y - r.height / 2) / r.height) * -5;
      const ry2 = ((x - r.width  / 2) / r.width)  *  5;
      card.style.transform = `perspective(900px) rotateX(${rx2}deg) rotateY(${ry2}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ─── Tool Chip Stagger ─────────────────────── */
  const toolsObs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.tool-chip').forEach((c, i) => {
        c.style.opacity = '0'; c.style.transform = 'translateY(12px)';
        c.style.transition = `opacity .4s ${i*35}ms, transform .4s ${i*35}ms`;
        setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, 80 + i * 35);
      });
      toolsObs.unobserve(e.target);
    }
  }, { threshold: 0.2 });
  const toolsEl = document.querySelector('.tools-section');
  if (toolsEl) toolsObs.observe(toolsEl);

  /* ─── Contact Form (demo) ───────────────────── */
  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  if (form && successEl) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = document.getElementById('formSubmitBtn');
      btn.disabled = true;
      btn.innerHTML = '<span>Sending...</span>';
      setTimeout(() => {
        successEl.style.display = 'block';
        form.reset();
        btn.disabled = false;
        btn.innerHTML = '<span>Send Message</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/></svg>';
        setTimeout(() => { successEl.style.display = 'none'; }, 5000);
      }, 1500);
    });
  }

  /* ─── Active nav on load ────────────────────── */
  updateActive();

})();
