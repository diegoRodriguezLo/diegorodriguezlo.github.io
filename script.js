/* ============================================================
   HORFAVEN 2008 SL — Mejoras progresivas (vanilla JS)
   Todo el contenido está en el HTML; este script solo añade
   interactividad. Sin JS la web sigue siendo 100 % funcional.
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var body = doc.body;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };

  root.classList.remove('no-js');
  root.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- 1. Menú móvil ---------- */
  var header = $('#site-header');
  var toggle = $('#nav-toggle');
  var menu = $('#nav-menu');

  function setMenu(open) {
    if (!header || !toggle) return;
    header.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    doc.addEventListener('click', function (e) {
      if (header.classList.contains('nav-open') && !header.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- 2. Scroll: sombra, barra de progreso, back-to-top ---------- */
  var progress = $('#scroll-progress');
  var backTop = $('#back-to-top');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || root.scrollTop;
    var max = root.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('is-scrolled', y > 20);
    if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    if (backTop) backTop.classList.toggle('is-visible', y > 600);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Scroll-spy ---------- */
  var navLinks = menu ? $$('a[href^="#"]:not(.nav-cta)', menu) : [];
  var linkById = {};
  navLinks.forEach(function (a) { linkById[a.getAttribute('href').slice(1)] = a; });
  var spySections = Object.keys(linkById).map(function (id) { return doc.getElementById(id); }).filter(Boolean);

  if (hasIO && spySections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
        var link = linkById[entry.target.id];
        if (link) { link.classList.add('is-active'); link.setAttribute('aria-current', 'location'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    spySections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 4. Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (!hasIO || reduceMotion) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- 5. Contadores animados ---------- */
  var counters = $$('.counter[data-target]');

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var start = parseInt(el.getAttribute('data-start') || '0', 10);
    if (isNaN(target)) return;
    var duration = 1600;
    var t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(start + (target - start) * eased));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  if (counters.length && hasIO && !reduceMotion) {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-start') || '0'; });
    var counterObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterObs.observe(el); });
  }

  /* ---------- 6. Galería: filtros ---------- */
  var filtersBar = $('.filters');
  var works = $$('#works-grid .work');

  if (filtersBar && works.length) {
    filtersBar.hidden = false;
    var filterBtns = $$('.filter-btn', filtersBar);
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        filterBtns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        works.forEach(function (w) {
          var show = f === 'todos' || w.getAttribute('data-category') === f;
          w.classList.toggle('is-hidden', !show);
        });
      });
    });
  }

  /* ---------- 7. Galería: lightbox ---------- */
  var lb = $('#lightbox');
  var lbImg = $('#lightbox-img');
  var lbCap = $('#lightbox-caption');
  var lbClose = $('#lightbox-close');
  var lbPrev = $('#lightbox-prev');
  var lbNext = $('#lightbox-next');
  var lbIndex = -1;
  var lbReturnFocus = null;

  function visibleWorks() {
    return works.filter(function (w) { return !w.classList.contains('is-hidden'); });
  }

  function showItem(item) {
    var link = $('.work-link', item);
    var img = $('img', item);
    var title = $('figcaption strong', item);
    var desc = $('figcaption span:last-child', item);
    if (!link || !lbImg) return;
    lbImg.src = link.getAttribute('href');
    lbImg.alt = img ? img.alt : '';
    if (lbCap) lbCap.textContent = (title ? title.textContent : '') + (desc ? ' — ' + desc.textContent : '');
  }

  function openLightbox(item) {
    if (!lb) return;
    var list = visibleWorks();
    lbIndex = list.indexOf(item);
    lbReturnFocus = doc.activeElement;
    showItem(item);
    lb.hidden = false;
    body.classList.add('lightbox-lock');
    window.requestAnimationFrame(function () { lb.classList.add('is-open'); });
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.classList.remove('is-open');
    body.classList.remove('lightbox-lock');
    lb.hidden = true;
    if (lbImg) lbImg.removeAttribute('src');
    if (lbReturnFocus && lbReturnFocus.focus) lbReturnFocus.focus();
  }

  function stepLightbox(dir) {
    var list = visibleWorks();
    if (!list.length) return;
    lbIndex = (lbIndex + dir + list.length) % list.length;
    showItem(list[lbIndex]);
  }

  if (lb && works.length) {
    works.forEach(function (item) {
      var link = $('.work-link', item);
      if (!link) return;
      link.setAttribute('aria-haspopup', 'dialog');
      link.addEventListener('click', function (e) {
        e.preventDefault();
        openLightbox(item);
      });
    });
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbPrev) lbPrev.addEventListener('click', function () { stepLightbox(-1); });
    if (lbNext) lbNext.addEventListener('click', function () { stepLightbox(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    doc.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') stepLightbox(-1);
      else if (e.key === 'ArrowRight') stepLightbox(1);
      else if (e.key === 'Tab') {
        // Trampa de foco dentro del diálogo
        var focusables = [lbClose, lbPrev, lbNext].filter(Boolean);
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- 8. FAQ: un único panel abierto + animación ---------- */
  var faqItems = $$('.faq-item');
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) { if (other !== item) other.open = false; });
      if (!reduceMotion) {
        item.classList.add('is-animating');
        window.setTimeout(function () { item.classList.remove('is-animating'); }, 350);
      }
    });
  });

  /* ---------- 9. Formulario: validación en vivo + envío ---------- */
  var form = $('#contact-form');
  var status = $('#form-status');
  var btn = $('#form-btn');
  var FORMSPREE_ACTION = 'https://formspree.io/f/xgvalgek';
  var BTN_LABEL = 'Enviar mensaje';

  var messages = {
    name: { valueMissing: 'Indícanos tu nombre.', tooShort: 'El nombre parece demasiado corto.' },
    email: { valueMissing: 'Necesitamos un email para responderte.', typeMismatch: 'Revisa el email: debe tener el formato nombre@dominio.es.' },
    phone: { patternMismatch: 'Introduce un teléfono válido (mínimo 9 dígitos).' },
    message: { valueMissing: 'Cuéntanos brevemente tu proyecto.', tooShort: 'Añade algo más de detalle (mínimo 10 caracteres).' }
  };

  function errorFor(input) {
    var v = input.validity;
    var m = messages[input.name] || {};
    if (v.valid) return '';
    if (v.valueMissing) return m.valueMissing || 'Este campo es obligatorio.';
    if (v.typeMismatch) return m.typeMismatch || 'Formato no válido.';
    if (v.tooShort) return m.tooShort || 'Demasiado corto.';
    if (v.patternMismatch) return m.patternMismatch || 'Formato no válido.';
    return 'Revisa este campo.';
  }

  function validateField(input, force) {
    var field = input.closest('.field');
    var errEl = input.id ? doc.getElementById(input.id + '-err') : null;
    if (!field) return input.validity.valid;
    // minlength no se evalúa en valores no escritos por el usuario; se comprueba a mano
    var min = parseInt(input.getAttribute('minlength') || '0', 10);
    var tooShort = min && input.value.trim().length > 0 && input.value.trim().length < min;
    var msg = tooShort ? ((messages[input.name] || {}).tooShort || 'Demasiado corto.') : errorFor(input);
    if (!force && !input.value && !field.classList.contains('was-touched')) return !msg;
    field.classList.add('was-touched');
    field.classList.toggle('is-invalid', !!msg);
    field.classList.toggle('is-valid', !msg && input.value.trim() !== '');
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  function setStatus(text, type) {
    if (!status) return;
    status.textContent = text;
    status.className = 'form-status' + (type ? ' ' + type : '');
  }

  if (form && btn) {
    var inputs = $$('input, textarea', form);

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) validateField(input, true); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('was-touched')) validateField(input, true);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      setStatus('', '');

      var firstInvalid = null;
      inputs.forEach(function (input) {
        if (!validateField(input, true) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        setStatus('Revisa los campos marcados en rojo antes de enviar.', 'err');
        firstInvalid.focus();
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '<span class="spinner" aria-hidden="true"></span> Enviando…';

      if (!window.fetch || !window.FormData) {
        form.submit(); // envío clásico como respaldo
        return;
      }

      fetch(FORMSPREE_ACTION, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('Respuesta ' + res.status);
        setStatus('¡Mensaje enviado! Gracias por contactar con HORFAVEN: te responderemos a la mayor brevedad (L-V, 7:00–19:00).', 'ok');
        form.reset();
        $$('.field', form).forEach(function (f) { f.classList.remove('is-valid', 'is-invalid', 'was-touched'); });
        inputs.forEach(function (i) { i.removeAttribute('aria-invalid'); });
      }).catch(function () {
        setStatus('No hemos podido enviar el mensaje. Inténtalo de nuevo o llámanos al 916 292 334.', 'err');
      }).then(function () {
        btn.disabled = false;
        btn.textContent = BTN_LABEL;
      });
    });
  }

  /* ---------- 10. Año del footer ---------- */
  var year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
