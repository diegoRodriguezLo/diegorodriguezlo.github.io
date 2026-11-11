// ============================================================
// Hnos. Rodríguez Gutiérrez — Sitio web dinámico (JS)
// ============================================================

(() => {
  'use strict';

  /* ---------- Menú móvil ---------- */
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const body = document.body;

  toggle.addEventListener('click', () => {
    const open = body.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Cerrar menú al hacer clic en un enlace (móvil)
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Cambiar aspecto del navbar al hacer scroll ---------- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.style.boxShadow = '0 4px 12px -4px rgba(0,0,0,0.08)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });

  /* ---------- Galería de trabajos (dinámica) ---------- */
  const works = [
    { title: 'Nave industrial', subtitle: 'Obra civil y estructura', img: 'img/01-large-500x300.jpg' },
    { title: 'Vivienda unifamiliar', subtitle: 'Edificación en general', img: 'img/07-large-500x300.jpg' },
    { title: 'Urbanización polígono', subtitle: 'Infraestructuras especiales', img: 'img/04-large-500x300.jpg' },
    { title: 'Cimentación profunda', subtitle: 'Estructuras de hormigón', img: 'img/06-large-500x300.jpg' },
    { title: 'Planta de hormigón', subtitle: 'Fabrica y transporte', img: 'img/WhatsApp Image 2026-11-11 at 10.48.04.jpeg' },
    { title: 'Nave logística', subtitle: 'Edificación industrial', img: 'img/08-large-500x300.jpg' }
  ];

  const grid = document.getElementById('works-grid');
  if (grid) {
    grid.innerHTML = works.map((w, i) => `
      <div class="work-item reveal" aria-label="${w.title}">
        <img src="${w.img}" alt="${w.title}" loading="lazy">
        <div class="work-text">
          <div style="font-weight:700; color:var(--color-ink); margin-bottom:4px;">${w.title}</div>
          <div style="color:var(--color-muted); font-size:0.82rem;">${w.subtitle}</div>
        </div>
      </div>
    `).join('');
  }

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const btn = document.getElementById('form-btn');

  // IMPORTANT: sustituye esta URL por tu endpoint de Formspree (gratis en formspree.io)
  const FORMSPREE_ACTION = 'https://formspree.io/f/xgvalgek';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';
    btn.disabled = true;
    btn.textContent = 'Enviando…';

    const formData = new FormData(form);

    try {
      const res = await fetch(FORMSPREE_ACTION, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        status.textContent = '¡Mensaje enviado! Te responderemos a la mayor brevedad.';
        status.classList.add('ok');
        form.reset();
      } else {
        throw new Error('Error del servidor');
      }
    } catch (err) {
      status.textContent = 'Hubo un error enviando el mensaje. Prueba de nuevo o llámanos al 916 292 334.';
      status.classList.add('err');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enviar mensaje';
    }
  });

  /* ---------- Aparición animada al hacer scroll ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  /* ---------- Año en el footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();

// Solución segura para el typo de la galería (si falla, se ignora)
try { } catch (_) {}
