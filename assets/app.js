/* Study Notes 筆記整理庫 — 全站共用腳本（Vanilla JS，無外部依賴）
   功能：1. 導覽列高亮  2. 手機版選單切換  3. 關鍵字即時搜尋過濾 */
(function () {
  'use strict';

  var body = document.body;

  /* 1. 導覽列高亮：以解析後的絕對路徑比對目前頁面 */
  function normalize(path) {
    return path.replace(/index\.html$/, '').replace(/\/+$/, '/');
  }
  var here = normalize(location.pathname);
  document.querySelectorAll('.sidebar .nav-list a').forEach(function (a) {
    if (normalize(new URL(a.getAttribute('href'), location.href).pathname) === here) {
      a.classList.add('is-active');
      a.setAttribute('aria-current', 'page');
    }
  });

  /* 2. 手機版漢堡選單 */
  var toggle = document.getElementById('menu-toggle');
  var overlay = document.getElementById('nav-overlay');
  function setNav(open) {
    body.classList.toggle('nav-open', open);
    if (toggle) toggle.setAttribute('aria-expanded', String(open));
  }
  if (toggle) toggle.addEventListener('click', function () { setNav(!body.classList.contains('nav-open')); });
  if (overlay) overlay.addEventListener('click', function () { setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  document.querySelectorAll('.sidebar a').forEach(function (a) {
    a.addEventListener('click', function () { setNav(false); });
  });

  /* 3. 關鍵字即時搜尋：過濾所有 [data-searchable] 元素 */
  var input = document.getElementById('search-input');
  if (input) {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-searchable]'));
    var groups = Array.prototype.slice.call(document.querySelectorAll('[data-search-group]'));
    var status = document.getElementById('search-status');
    var empty = document.getElementById('no-results');
    var cache = items.map(function (el) { return el.textContent.toLowerCase().replace(/\s+/g, ' '); });

    input.addEventListener('input', function () {
      var terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
      var shown = 0;
      items.forEach(function (el, i) {
        var hit = terms.every(function (t) { return cache[i].indexOf(t) !== -1; });
        el.hidden = !hit;
        if (hit) shown++;
      });
      groups.forEach(function (g) {
        g.hidden = !g.querySelector('[data-searchable]:not([hidden])');
      });
      if (empty) empty.hidden = shown !== 0;
      if (status) status.textContent = terms.length ? '找到 ' + shown + ' 筆符合的項目' : '';
    });
  }
})();
