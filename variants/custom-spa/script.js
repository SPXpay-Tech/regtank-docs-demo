/* ------------------------------------------------------------------ *
 *  Regtank Exchange API docs – custom Stripe-style SPA
 *  Pure vanilla JS. No build, no deps.
 * ------------------------------------------------------------------ */

(() => {
  /* ---- 1. Theme toggle (persisted in localStorage) ----------------- */
  const html = document.documentElement;
  const stored = localStorage.getItem('regtank-theme');
  if (stored) html.dataset.theme = stored;
  document.getElementById('theme-btn').addEventListener('click', () => {
    const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
    html.dataset.theme = next;
    localStorage.setItem('regtank-theme', next);
  });

  /* ---- 2. Code-sample language tabs -------------------------------- */
  document.querySelectorAll('.code-tabs').forEach(tabs => {
    const set = tabs.dataset.tabset;
    tabs.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        tabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll(`pre[data-tabset="${set}"]`).forEach(pre => {
          pre.classList.toggle('active', pre.dataset.lang === lang);
        });
      });
    });
  });

  /* ---- 3. Sidebar active highlighting via IntersectionObserver ----- */
  const links = [...document.querySelectorAll('.sidebar a[href^="#"]')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const targets = [...map.keys()]
    .map(id => document.getElementById(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    let lastActive = null;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (lastActive) lastActive.classList.remove('active');
          const a = map.get(e.target.id);
          if (a) { a.classList.add('active'); lastActive = a; }
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
    targets.forEach(t => io.observe(t));
  }

  /* ---- 4. Search modal (Cmd/Ctrl+K) -------------------------------- */
  const modal = document.getElementById('search-modal');
  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');
  const openSearch = () => {
    modal.hidden = false;
    requestAnimationFrame(() => input.focus());
    input.value = '';
    renderResults('');
  };
  const closeSearch = () => { modal.hidden = true; input.blur(); };

  document.getElementById('search-btn').addEventListener('click', openSearch);
  window.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    if (e.key === 'Escape' && !modal.hidden) closeSearch();
  });
  modal.addEventListener('click', e => { if (e.target === modal) closeSearch(); });

  /* index: build from sidebar entries + each <section> / <article> heading */
  const indexItems = [];
  links.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    const title = a.textContent.trim().replace(/\s+/g, ' ');
    const heading = target.querySelector('h1, h2, h3');
    const ctx = heading ? heading.textContent.trim() : '';
    indexItems.push({
      id,
      title: heading ? heading.textContent.trim() : title,
      meta: title,
      body: (target.textContent || '').replace(/\s+/g, ' ').slice(0, 240),
    });
  });

  function renderResults(q) {
    q = q.trim().toLowerCase();
    let items;
    if (!q) {
      items = indexItems.slice(0, 8);
    } else {
      items = indexItems
        .map(it => {
          const hay = (it.title + ' ' + it.meta + ' ' + it.body).toLowerCase();
          const idx = hay.indexOf(q);
          if (idx < 0) return null;
          return { ...it, score: idx };
        })
        .filter(Boolean)
        .sort((a, b) => a.score - b.score)
        .slice(0, 10);
    }
    if (!items.length) {
      resultsEl.innerHTML = '<div class="empty">No matches.</div>';
      return;
    }
    resultsEl.innerHTML = items
      .map(it => `<a href="#${it.id}" data-id="${it.id}"><div>${escapeHtml(it.title)}</div><div class="res-meta">${escapeHtml(it.meta)}</div></a>`)
      .join('');
    resultsEl.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => { closeSearch(); });
    });
  }

  input.addEventListener('input', e => renderResults(e.target.value));

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* ---- 5. Smooth-scroll for in-page anchors ------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${id}`);
      }
    });
  });
})();
