/* Script commun du site de documentation : thème, sommaire, agrandissement des captures */
(function () {
  // Thème clair / sombre (le thème enregistré est appliqué dès le <head>, voir build.js)
  var root = document.documentElement, btn = document.getElementById('themeBtn');
  function isDark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; }
  var ICON_MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  var ICON_SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  function label() {
    if (!btn) return;
    var txt = isDark() ? 'Passer au thème clair' : 'Passer au thème sombre';
    btn.innerHTML = isDark() ? ICON_SUN : ICON_MOON;
    btn.setAttribute('aria-label', txt); btn.title = txt;
  }
  label();

  // Menu du haut : sur petit écran, faire apparaître l'univers en cours
  var cur = document.querySelector('.topnav a[aria-current]');
  if (cur && cur.parentNode.scrollWidth > cur.parentNode.clientWidth) {
    cur.parentNode.scrollLeft = cur.offsetLeft - (cur.parentNode.clientWidth - cur.offsetWidth) / 2;
  }
  if (btn) btn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('ba-theme', next); } catch (e) {}
    label();
  });

  // Sommaire : section active + repli sur mobile
  var secItems = Array.prototype.slice.call(document.querySelectorAll('.toc li[data-sec]'));
  if (secItems.length) {
    var links = Array.prototype.slice.call(document.querySelectorAll('.toc a'));
    var secs = secItems.map(function (li) {
      return {
        li: li, el: document.getElementById(li.dataset.sec),
        subs: Array.prototype.slice.call(li.querySelectorAll('.toc-sub a')).map(function (a) { return { a: a, el: document.getElementById(a.getAttribute('href').slice(1)) }; })
      };
    });
    var last = null, lastSub = null, ticking = false;
    var update = function () {
      ticking = false;
      var line = window.innerHeight * 0.3, cur = secs[0], sub = null;
      secs.forEach(function (s) { if (s.el && s.el.getBoundingClientRect().top <= line) cur = s; });
      cur.subs.forEach(function (s) { if (s.el && s.el.getBoundingClientRect().top <= line) sub = s; });
      if (cur !== last) {
        if (last) last.li.classList.remove('current');
        cur.li.classList.add('current'); last = cur;
      }
      if (sub !== lastSub) {
        if (lastSub) lastSub.a.classList.remove('active');
        if (sub) sub.a.classList.add('active');
        lastSub = sub;
      }
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
    var det = document.getElementById('tocDetails');
    if (det) {
      if (matchMedia('(max-width: 980px)').matches) det.removeAttribute('open');
      links.forEach(function (a) { a.addEventListener('click', function () { if (matchMedia('(max-width: 980px)').matches) det.removeAttribute('open'); }); });
    }
  }

  // Mega-menu des univers
  var sitebar = document.querySelector('.sitebar'), menuBtn = document.getElementById('menuBtn');
  var mmItems = Array.prototype.slice.call(document.querySelectorAll('.mm-item')).filter(function (it) { return it.querySelector('.mm-panel'); });
  var desktop = matchMedia('(min-width: 981px)'), canHover = matchMedia('(hover: hover)');
  function setOpen(it, open) {
    it.classList.toggle('open', open);
    var t = it.querySelector('.mm-toggle'); if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeAll(except) { mmItems.forEach(function (it) { if (it !== except) setOpen(it, false); }); }
  mmItems.forEach(function (it) {
    var timer = null, link = it.querySelector('.mm-link'), toggle = it.querySelector('.mm-toggle');
    it.addEventListener('mouseenter', function () {
      if (!desktop.matches || !canHover.matches) return;
      clearTimeout(timer);
      timer = setTimeout(function () { closeAll(it); setOpen(it, true); }, 140);
    });
    it.addEventListener('mouseleave', function () {
      if (!desktop.matches || !canHover.matches) return;
      clearTimeout(timer);
      timer = setTimeout(function () { setOpen(it, false); }, 220);
    });
    // Clavier (bureau) : flèche bas ouvre le panneau et place le focus sur la première page
    link.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' && desktop.matches) {
        e.preventDefault(); closeAll(it); setOpen(it, true);
        var first = it.querySelector('.mm-list a'); if (first) first.focus();
      }
    });
    // Accordéon (mobile)
    if (toggle) toggle.addEventListener('click', function () { var o = !it.classList.contains('open'); closeAll(it); setOpen(it, o); });
    // On quitte le panneau au clavier : il se referme
    it.addEventListener('focusout', function (e) { if (desktop.matches && !it.contains(e.relatedTarget)) setOpen(it, false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = mmItems.filter(function (it) { return it.classList.contains('open'); })[0];
    if (open) { setOpen(open, false); open.querySelector('.mm-link').focus(); }
    else if (sitebar && sitebar.classList.contains('menu-open') && menuBtn) { sitebar.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); }
  });
  document.addEventListener('click', function (e) { if (!e.target.closest || !e.target.closest('.mm-item')) { if (desktop.matches) closeAll(); } });
  if (menuBtn && sitebar) {
    menuBtn.addEventListener('click', function () {
      var o = !sitebar.classList.contains('menu-open');
      sitebar.classList.toggle('menu-open', o);
      menuBtn.setAttribute('aria-expanded', o ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', o ? 'Fermer le menu' : 'Ouvrir le menu');
      if (o) { // l'univers de la page en cours est déplié
        var cur = mmItems.filter(function (it) { return it.querySelector('.mm-link[aria-current]'); })[0];
        if (cur) setOpen(cur, true);
      }
    });
  }
  desktop.addEventListener && desktop.addEventListener('change', function () { closeAll(); if (sitebar) sitebar.classList.remove('menu-open'); });

  // Bouton « haut de page » : visible après un écran de défilement
  var toTop = document.getElementById('toTop');
  if (toTop) {
    var tTick = false;
    var tUpdate = function () { tTick = false; toTop.classList.toggle('show', window.scrollY > window.innerHeight * 0.8); };
    window.addEventListener('scroll', function () { if (!tTick) { tTick = true; requestAnimationFrame(tUpdate); } }, { passive: true });
    tUpdate();
    toTop.addEventListener('click', function () {
      var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var logo = document.querySelector('.brand-link'); if (logo) logo.focus({ preventScroll: true });
    });
  }

  // Agrandissement des captures
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('img');
    document.querySelectorAll('figure img').forEach(function (img) {
      img.addEventListener('click', function () { lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('open'); });
    });
    lb.addEventListener('click', function () { lb.classList.remove('open'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') lb.classList.remove('open'); });
  }
})();
