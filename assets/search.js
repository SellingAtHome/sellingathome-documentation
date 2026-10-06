/* Recherche plein texte du site de documentation (index généré : assets/search-index.js) */
(function () {
  var INDEX = window.SAH_SEARCH_INDEX || [];
  function norm(s) { return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' '); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var prepared = INDEX.map(function (e) { return { e: e, t: norm(e.t), h: norm(e.h), x: norm(e.x) }; });

  function search(q) {
    var toks = norm(q).split(/[^a-z0-9%€]+/).filter(function (t) { return t.length >= 2; });
    if (!toks.length) return [];
    var res = [];
    prepared.forEach(function (p) {
      var score = 0;
      for (var i = 0; i < toks.length; i++) {
        var t = toks[i], s = 0;
        if (p.t.indexOf(t) >= 0) s += 8;
        if (p.h.indexOf(t) >= 0) s += 3;
        var n = 0, k = p.x.indexOf(t);
        while (k >= 0 && n < 5) { n++; k = p.x.indexOf(t, k + t.length); }
        s += n;
        if (!s) return;               // tous les mots doivent être présents
        score += s;
      }
      if (p.t.indexOf(norm(q).trim()) >= 0) score += 10;
      res.push({ p: p, score: score });
    });
    res.sort(function (a, b) { return b.score - a.score; });
    return { toks: toks, items: res.slice(0, 15), total: res.length };
  }

  function snippet(p, toks) {
    var x = p.e.x, nx = p.x, pos = -1;
    for (var i = 0; i < toks.length && pos < 0; i++) pos = nx.indexOf(toks[i]);
    var start = Math.max(0, pos - 60), s = x.substr(start, 200);
    var out = esc((start > 0 ? '… ' : '') + s + (start + 200 < x.length ? ' …' : ''));
    toks.forEach(function (t) {
      // surlignage insensible aux accents : on reconstruit à partir du texte normalisé
      var o = norm(out), r = '', last = 0, k = o.indexOf(t);
      while (k >= 0) { r += out.slice(last, k) + '<mark>' + out.slice(k, k + t.length) + '</mark>'; last = k + t.length; k = o.indexOf(t, last); }
      if (r) { out = r + out.slice(last); }
    });
    return out;
  }

  function bind(input) {
    var box = input.parentNode.querySelector('.search-results');
    var sel = -1, links = [];
    function close() { box.classList.remove('open'); sel = -1; }
    function render() {
      var q = input.value;
      if (q.trim().length < 2) { close(); box.innerHTML = ''; return; }
      var r = search(q);
      if (!r.items || !r.items.length) { box.innerHTML = '<div class="sr-empty">Aucun résultat pour « ' + esc(q) + ' ».</div>'; box.classList.add('open'); links = []; return; }
      box.innerHTML = '<div class="sr-count">' + r.total + ' résultat' + (r.total > 1 ? 's' : '') + (r.total > r.items.length ? ' (' + r.items.length + ' premiers)' : '') + '</div>' +
        r.items.map(function (it) {
          var e = it.p.e;
          return '<a href="' + esc(e.u) + '" role="option"><span class="sr-path">' + esc(e.p) + (e.h && e.h !== e.t ? ' › ' + esc(e.h) : '') + '</span>' +
            '<span class="sr-title">' + esc(e.t) + '</span><span class="sr-snip">' + snippet(it.p, r.toks) + '</span></a>';
        }).join('');
      links = Array.prototype.slice.call(box.querySelectorAll('a'));
      sel = -1; box.classList.add('open');
    }
    function move(d) {
      if (!links.length) return;
      if (sel >= 0) links[sel].classList.remove('sel');
      sel = (sel + d + links.length) % links.length;
      links[sel].classList.add('sel'); links[sel].scrollIntoView({ block: 'nearest' });
    }
    input.addEventListener('input', render);
    input.addEventListener('focus', function () { if (input.value.trim().length >= 2) render(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { var l = links[sel >= 0 ? sel : 0]; if (l) { e.preventDefault(); window.location.href = l.href; } }
      else if (e.key === 'Escape') { close(); input.blur(); }
    });
    box.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
    document.addEventListener('click', function (e) { if (!input.parentNode.contains(e.target)) close(); });
  }

  Array.prototype.forEach.call(document.querySelectorAll('input[data-search]'), bind);
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      var i = document.querySelector('input[data-search]'); if (i) { e.preventDefault(); i.focus(); }
    }
  });
})();
